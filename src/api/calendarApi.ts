import { CalendarEvent, CalendarTag, TrainingPhase, TrainingSport } from "../types";
import { initialEvents } from "../mockEvents";

const TRAINING_SOURCE_URL =
  "https://script.google.com/macros/s/AKfycbwxqWrd2VCKhQ0acvFziw-1p3Xc8uuio75vQFMkMPBnNrXUnTqosXdj_x4gtJ4PGcb3/exec";

type RawTrack = {
  id: number;
  sport: string;
  type: string;
  task: string;
  report: string;
  json?: {
    numbOfIntervals?: number;
    lengthOfIntervals?: number;
    pace?: string;
  };
};

type RawDiaryTask = {
  id: number;
  date: string;
  phase: string;
  tracks: RawTrack[];
};

type RawTrainingPayload = {
  student?: {
    diaryTasksInfo?: RawDiaryTask[];
  };
};

let inMemoryEvents = [...initialEvents];
let hasLoadedRemote = false;

const SPORT_META: Record<
  string,
  { tag: CalendarTag; label: string; defaultHour: number; durationMinutes: number; sport: TrainingSport }
> = {
  run: { tag: "focus", label: "Бег", defaultHour: 7, durationMinutes: 90, sport: "run" },
  swim: { tag: "personal", label: "Плавание", defaultHour: 19, durationMinutes: 60, sport: "swim" },
  bike: { tag: "meeting", label: "Велосипед", defaultHour: 18, durationMinutes: 75, sport: "bike" }
};

const TYPE_COLORS: Record<string, string> = {
  длительная: "#5e7ce2",
  восстановительная: "#7bbf43",
  силовая: "#ef6c57",
  развивающая: "#2f80ed",
  интервальная: "#8e44ad",
  повторная: "#c0392b"
};

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function addMinutes(isoDateTime: string, minutes: number) {
  const date = new Date(isoDateTime);
  return new Date(date.getTime() + minutes * 60 * 1000);
}

function toLocalDateTime(input: Date) {
  const year = input.getFullYear();
  const month = `${input.getMonth() + 1}`.padStart(2, "0");
  const day = `${input.getDate()}`.padStart(2, "0");
  const hours = `${input.getHours()}`.padStart(2, "0");
  const minutes = `${input.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

function normalizePhaseLabel(phase: string) {
  const labels: Record<string, string> = {
    base: "База",
    speed: "Скорость",
    development: "Развитие",
    taper: "Подводка",
    race: "Старт"
  };

  return labels[phase] ?? phase;
}

function buildTrackDescription(track: RawTrack, phase: string) {
  const details = [
    `Фаза: ${normalizePhaseLabel(phase)}`,
    track.task,
    track.json?.pace ? `Темп: ${track.json.pace}/км` : "",
    track.json?.numbOfIntervals ? `Интервалы: ${track.json.numbOfIntervals}` : "",
    track.json?.lengthOfIntervals ? `Длина интервала: ${track.json.lengthOfIntervals} км` : "",
    track.report ? `Отчёт: ${track.report}` : ""
  ].filter(Boolean);

  return details.join("\n");
}

function normalizeTrackToEvent(day: RawDiaryTask, track: RawTrack, index: number): CalendarEvent {
  const meta = SPORT_META[track.sport] ?? {
    tag: "design" as const,
    label: track.sport,
    defaultHour: 12,
    durationMinutes: 60,
    sport: "other" as const
  };
  const start = new Date(`${day.date}T00:00:00`);
  start.setHours(meta.defaultHour + index * 2, 0, 0, 0);
  const end = addMinutes(toLocalDateTime(start), meta.durationMinutes);

  return {
    id: `training-${track.id}`,
    title: `${meta.label} • ${track.type}`,
    start: toLocalDateTime(start),
    end: toLocalDateTime(end),
    color: TYPE_COLORS[track.type] ?? "#7986cb",
    tag: meta.tag,
    description: buildTrackDescription(track, day.phase),
    location: normalizePhaseLabel(day.phase),
    phase: day.phase as TrainingPhase,
    trainingType: track.type,
    sport: meta.sport
  };
}

async function fetchRemoteEvents() {
  const response = await fetch(TRAINING_SOURCE_URL);
  if (!response.ok) {
    throw new Error(`Failed to load training data: ${response.status}`);
  }

  const payload = (await response.json()) as RawTrainingPayload;
  const diaryTasks = payload.student?.diaryTasksInfo ?? [];

  return diaryTasks.flatMap((day) => day.tracks.map((track, index) => normalizeTrackToEvent(day, track, index)));
}

export async function listEvents() {
  if (!hasLoadedRemote) {
    try {
      const remoteEvents = await fetchRemoteEvents();
      inMemoryEvents = remoteEvents;
      hasLoadedRemote = true;
    } catch (error) {
      console.error("Failed to fetch training calendar feed, using local fallback.", error);
    }
  }

  await delay(120);
  return [...inMemoryEvents];
}

export async function createEvent(event: CalendarEvent) {
  await delay(120);
  inMemoryEvents = [event, ...inMemoryEvents];
  return event;
}

export async function updateEvent(event: CalendarEvent) {
  await delay(120);
  inMemoryEvents = inMemoryEvents.map((entry) => (entry.id === event.id ? event : entry));
  return event;
}
