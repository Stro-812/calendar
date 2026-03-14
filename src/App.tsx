import { useEffect, useMemo, useState } from "react";
import {
  addDays,
  addMonths,
  formatDayNumber,
  formatMonthLabel,
  formatShortWeekday,
  formatTime,
  formatWeekRange,
  getHourLabels,
  getMinutesSinceDayStart,
  getMonthGrid,
  getWeekDays,
  isSameDay,
  parseDateTime,
  toLocalInputValue
} from "./date";
import { getActivityDetails } from "./api/activityApi";
import { createEvent, listEvents, updateEvent } from "./api/calendarApi";
import { ActivityDetails, CalendarEvent, CalendarView, TrainingPhase, TrainingSport } from "./types";

const DAY_MINUTES = 24 * 60;
const SLOT_HEIGHT = 56;
const STUDENT_ID = "7439904";
const DEMO_ACTIVITY_ID = "g22089384971";

const PHASE_STYLES: Record<TrainingPhase, { dayBackground: string; label: string }> = {
  base: { dayBackground: "#eef9ee", label: "База" },
  speed: { dayBackground: "#fff0f7", label: "Скорость" },
  development: { dayBackground: "#eef5ff", label: "Развитие" },
  taper: { dayBackground: "#fff4e8", label: "Тейпер" },
  race: { dayBackground: "#f1f1f1", label: "Старт" }
};

const SPORT_ICONS: Record<TrainingSport, string> = {
  run: "🏃",
  swim: "🏊",
  bike: "🚴",
  other: "•"
};

const SPORT_LABELS: Record<TrainingSport, string> = {
  run: "Бег",
  swim: "Плавание",
  bike: "Велосипед",
  other: "Прочее"
};

type DraftEvent = {
  title: string;
  start: string;
  end: string;
  color: string;
  description: string;
  location: string;
};

type ComposerState = {
  mode: "create" | "edit";
  eventId: string | null;
};

const DEFAULT_DRAFT = (date = new Date()): DraftEvent => ({
  title: "",
  start: toLocalInputValue(date),
  end: toLocalInputValue(new Date(date.getTime() + 60 * 60 * 1000)),
  color: "#1a73e8",
  description: "",
  location: ""
});

function renderDescriptionBlocks(description?: string) {
  if (!description) {
    return [];
  }

  return description
    .split("\n")
    .map((line) => line.trim())
    .filter(Boolean);
}

function formatIntervalLine(event: CalendarEvent) {
  if (!event.intervalCount || !event.intervalLength || !event.pace) {
    return null;
  }

  return `${event.intervalCount} x ${event.intervalLength.toString().replace(".", ",")} @ ${event.pace}`;
}

export default function App() {
  const [view, setView] = useState<CalendarView>("month");
  const [cursorDate, setCursorDate] = useState(new Date("2026-03-11T08:00:00"));
  const [events, setEvents] = useState<CalendarEvent[]>([]);
  const [selectedEventId, setSelectedEventId] = useState<string | null>(null);
  const [draft, setDraft] = useState<DraftEvent>(DEFAULT_DRAFT(new Date("2026-03-11T10:00:00")));
  const [isComposerOpen, setIsComposerOpen] = useState(false);
  const [composerState, setComposerState] = useState<ComposerState>({ mode: "create", eventId: null });
  const [draggedEventId, setDraggedEventId] = useState<string | null>(null);
  const [activityDetails, setActivityDetails] = useState<ActivityDetails | null>(null);

  useEffect(() => {
    listEvents().then(setEvents);
  }, []);

  const weekDays = useMemo(() => getWeekDays(cursorDate), [cursorDate]);
  const monthDays = useMemo(() => getMonthGrid(cursorDate), [cursorDate]);
  const selectedEvent = useMemo(
    () => events.find((event) => event.id === selectedEventId) ?? null,
    [events, selectedEventId]
  );

  const visibleEvents = useMemo(() => {
    return events.map((event) => ({
      ...event,
      startDate: parseDateTime(event.start),
      endDate: parseDateTime(event.end),
      descriptionLines: renderDescriptionBlocks(event.description),
      intervalLine: formatIntervalLine(event)
    }));
  }, [events]);

  const phaseByDay = useMemo(() => {
    const map = new Map<string, TrainingPhase>();

    visibleEvents.forEach((event) => {
      if (!event.phase) {
        return;
      }
      map.set(event.startDate.toDateString(), event.phase);
    });

    return map;
  }, [visibleEvents]);

  const today = new Date("2026-03-11T00:00:00");

  useEffect(() => {
    const activityId = selectedEvent?.activityId ?? DEMO_ACTIVITY_ID;
    let cancelled = false;

    getActivityDetails(activityId)
      .then((details) => {
        if (!cancelled) {
          setActivityDetails(details);
        }
      })
      .catch((error) => {
        if (!cancelled) {
          console.error("Failed to load activity details", error);
          setActivityDetails(null);
        }
      });

    return () => {
      cancelled = true;
    };
  }, [selectedEventId, selectedEvent?.activityId]);

  function shiftPeriod(direction: -1 | 1) {
    setCursorDate((current) => (view === "week" ? addDays(current, direction * 7) : addMonths(current, direction)));
  }

  function openComposer(date?: Date) {
    const seed = date ?? new Date(cursorDate);
    const end = new Date(seed);
    end.setHours(seed.getHours() + 1);
    setComposerState({ mode: "create", eventId: null });
    setDraft({
      title: "",
      start: toLocalInputValue(seed),
      end: toLocalInputValue(end),
      color: "#1a73e8",
      description: "",
      location: ""
    });
    setIsComposerOpen(true);
  }

  function openEditor(eventId: string) {
    const targetEvent = events.find((event) => event.id === eventId);
    if (!targetEvent) {
      return;
    }

    setComposerState({ mode: "edit", eventId });
    setDraft({
      title: targetEvent.title,
      start: targetEvent.start,
      end: targetEvent.end,
      color: targetEvent.color,
      description: targetEvent.description ?? "",
      location: targetEvent.location ?? ""
    });
    setIsComposerOpen(true);
  }

  async function handleSaveEvent() {
    if (!draft.title.trim()) {
      return;
    }

    const baseEvent: CalendarEvent = {
      id: composerState.eventId ?? `evt-${Date.now()}`,
      title: draft.title.trim(),
      start: draft.start,
      end: draft.end,
      color: draft.color,
      tag: "meeting",
      description: draft.description.trim(),
      location: draft.location.trim(),
      sport: "other"
    };

    if (composerState.mode === "edit" && composerState.eventId) {
      const updated = await updateEvent(baseEvent);
      setEvents((current) => current.map((entry) => (entry.id === updated.id ? updated : entry)));
      setSelectedEventId(updated.id);
      setIsComposerOpen(false);
      return;
    }

    const created = await createEvent(baseEvent);
    setEvents((current) => [created, ...current]);
    setIsComposerOpen(false);
    setSelectedEventId(created.id);
  }

  async function moveEvent(eventId: string, nextDate: Date) {
    const existing = events.find((entry) => entry.id === eventId);
    if (!existing) {
      return;
    }

    const start = parseDateTime(existing.start);
    const end = parseDateTime(existing.end);
    const duration = end.getTime() - start.getTime();
    const nextStart = new Date(nextDate);
    const nextEnd = new Date(nextStart.getTime() + duration);
    const updatedEvent: CalendarEvent = {
      ...existing,
      start: toLocalInputValue(nextStart),
      end: toLocalInputValue(nextEnd)
    };

    setEvents((current) => current.map((entry) => (entry.id === eventId ? updatedEvent : entry)));
    await updateEvent(updatedEvent);
  }

  return (
    <div className="page-shell">
      <header className="portal-header" />

      <div className="app-shell">
        <main className="main-panel">
          <header className="topbar">
            <div className="topbar-left">
              <div className="brand-lockup">
                <div className="brand-mark" aria-label="S10 logo">
                  <span className="brand-s">S</span>
                  <span className="brand-one">1</span>
                  <span className="brand-zero">0</span>
                  <span className="brand-arc" />
                </div>
                <div>
                  <h1>ID {STUDENT_ID}</h1>
                </div>
              </div>
              <div className="nav-controls">
                <button onClick={() => shiftPeriod(-1)}>‹</button>
                <button onClick={() => setCursorDate(today)}>Сегодня</button>
                <button onClick={() => shiftPeriod(1)}>›</button>
              </div>
              <div className="period-label">
                {view === "week" ? formatWeekRange(cursorDate) : formatMonthLabel(cursorDate)}
              </div>
            </div>

            <div className="topbar-right">
              <div className="searchbox">
                <input placeholder="Поиск событий, людей, календарей" />
              </div>
              <div className="view-switcher">
                <button className={view === "week" ? "is-active" : ""} onClick={() => setView("week")}>
                  Неделя
                </button>
                <button className={view === "month" ? "is-active" : ""} onClick={() => setView("month")}>
                  Месяц
                </button>
              </div>
              <button className="primary-action" onClick={() => openComposer()}>
                Новое событие
              </button>
            </div>
          </header>

          {view === "week" ? (
            <section className="calendar-surface week-surface">
              <div className="surface-title">Календарь недели</div>
              <div className="week-header">
                <div className="time-column-header" />
                {weekDays.map((day) => (
                  <button key={day.toISOString()} className="day-column-header" onClick={() => openComposer(day)}>
                    <span>{formatShortWeekday(day)}</span>
                    <strong className={isSameDay(day, today) ? "is-today" : ""}>{formatDayNumber(day)}</strong>
                  </button>
                ))}
              </div>

              <div className="week-grid">
                <div className="time-column">
                  {getHourLabels().map((label) => (
                    <div className="time-slot-label" key={label}>
                      {label}
                    </div>
                  ))}
                </div>

                {weekDays.map((day) => (
                  <div
                    className="day-column"
                    key={day.toISOString()}
                    style={{
                      background: phaseByDay.get(day.toDateString())
                        ? PHASE_STYLES[phaseByDay.get(day.toDateString())!].dayBackground
                        : "#fff"
                    }}
                    onDragOver={(event) => event.preventDefault()}
                    onDrop={() => {
                      if (!draggedEventId) {
                        return;
                      }
                      const nextDate = new Date(day);
                      nextDate.setHours(9, 0, 0, 0);
                      void moveEvent(draggedEventId, nextDate);
                      setDraggedEventId(null);
                    }}
                  >
                    {getHourLabels().map((label) => (
                      <button
                        className="grid-slot"
                        key={label}
                        onClick={() => {
                          const [hours] = label.split(":");
                          const nextDate = new Date(day);
                          nextDate.setHours(Number(hours), 0, 0, 0);
                          openComposer(nextDate);
                        }}
                      />
                    ))}

                    {visibleEvents
                      .filter((event) => isSameDay(event.startDate, day))
                      .map((event) => {
                        const top = (getMinutesSinceDayStart(event.startDate) / DAY_MINUTES) * SLOT_HEIGHT * 24;
                        const height =
                          ((event.endDate.getTime() - event.startDate.getTime()) / (1000 * 60) / DAY_MINUTES) *
                          SLOT_HEIGHT *
                          24;

                        return (
                          <button
                            draggable
                            key={event.id}
                            className={`event-card ${selectedEventId === event.id ? "is-selected" : ""}`}
                            style={{
                              top: `${top}px`,
                              height: `${Math.max(height, 64)}px`,
                              background: `${event.color}1a`,
                              borderColor: event.color
                            }}
                            onClick={() => setSelectedEventId(event.id)}
                            onDragStart={() => setDraggedEventId(event.id)}
                          >
                            <strong>
                              <span className="sport-icon">{SPORT_ICONS[event.sport ?? "other"]}</span>
                              {event.title}
                            </strong>
                            <span>
                              {formatTime(event.startDate)} - {formatTime(event.endDate)}
                            </span>
                            {event.task ? <small>{event.task}</small> : null}
                            {event.intervalLine ? <small className="event-interval">{event.intervalLine}</small> : null}
                            {event.report ? <small>{event.report}</small> : null}
                          </button>
                        );
                      })}
                  </div>
                ))}
              </div>
            </section>
          ) : (
            <section className="calendar-surface month-surface">
              <div className="surface-title">Календарь месяца</div>
              <div className="month-header-row">
                {["Пн", "Вт", "Ср", "Чт", "Пт", "Сб", "Вс"].map((label) => (
                  <div key={label} className="month-weekday-label">
                    {label}
                  </div>
                ))}
              </div>
              <div className="month-grid">
                {monthDays.map((day) => (
                  <div
                    key={day.toISOString()}
                    className="month-cell"
                    style={{
                      background: phaseByDay.get(day.toDateString())
                        ? PHASE_STYLES[phaseByDay.get(day.toDateString())!].dayBackground
                        : "#fff"
                    }}
                  >
                    <div className="month-cell-top">
                      <span
                        className={[
                          "month-day-number",
                          isSameDay(day, today) ? "is-today" : "",
                          day.getMonth() !== cursorDate.getMonth() ? "is-muted" : ""
                        ].join(" ")}
                      >
                        {day.getDate()}
                      </span>
                    </div>
                    <div className="month-events">
                      {visibleEvents
                        .filter((event) => isSameDay(event.startDate, day))
                        .map((event) => (
                          <button
                            key={event.id}
                            className={`month-event-card ${selectedEventId === event.id ? "is-selected" : ""}`}
                            style={{ borderLeftColor: event.color }}
                            onClick={() => setSelectedEventId(event.id)}
                          >
                            <div className="month-event-time">
                              <span className="sport-icon">{SPORT_ICONS[event.sport ?? "other"]}</span>
                              {formatTime(event.startDate)} {event.title}
                            </div>
                            {event.task ? <div className="month-event-line">{event.task}</div> : null}
                            {event.intervalLine ? <div className="month-event-line month-event-interval">{event.intervalLine}</div> : null}
                            {event.report ? <div className="month-event-line">{event.report}</div> : null}
                          </button>
                        ))}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          <aside className="details-panel">
            {activityDetails ? (
              <>
                <div className="activity-hero">
                  <div className="activity-metric">
                    <span className="activity-icon">🏃</span>
                    <strong>{activityDetails.distance} км</strong>
                  </div>
                  <div className="activity-metric">
                    <span className="activity-icon">⏱</span>
                    <strong>{activityDetails.pace} мин/км</strong>
                  </div>
                  <div className="activity-metric">
                    <span className="activity-icon">♡</span>
                    <strong>{activityDetails.bpm} bpm</strong>
                  </div>
                  <div className="activity-metric">
                    <span className="activity-icon">♬</span>
                    <strong>{activityDetails.cadence}</strong>
                  </div>
                </div>

                <div className="activity-pulse-row">
                  <div className="activity-pulse-box">
                    <span className="activity-icon">👟</span>
                    <div>
                      <div className="activity-mini-label">импульс</div>
                      <strong>{activityDetails.impulse}</strong>
                    </div>
                  </div>
                  <div className="activity-pulse-box">
                    <span className="activity-icon">☺</span>
                    <div>
                      <div className="activity-mini-label">gs</div>
                      <strong>{activityDetails.gs}</strong>
                    </div>
                  </div>
                </div>

                {activityDetails.trainerComment ? (
                  <div className="activity-note">
                    <div className="activity-note-author">{activityDetails.trainerName || "Тренер"}</div>
                    <div>{activityDetails.trainerComment}</div>
                  </div>
                ) : null}

                {selectedEvent?.report ? (
                  <div className="activity-note">
                    <div className="activity-note-author">
                      {activityDetails.trainerName || "Тренер"} <span className="activity-note-role">| Тренер</span>
                    </div>
                    <div>{selectedEvent.report}</div>
                  </div>
                ) : null}

                <div className="activity-tabs">
                  <span className="is-active">ФАКТ</span>
                  <span>ЗАДАНИЕ</span>
                </div>

                <div className="activity-fact-grid">
                  <div className="activity-column">
                    <h3>Быстро</h3>
                    <div className="activity-stat">
                      <span>⏱</span>
                      <div>
                        <div>среднее время</div>
                        <strong>{activityDetails.fast?.averageTime || "—"}</strong>
                      </div>
                    </div>
                    <div className="activity-stat">
                      <span>🧭</span>
                      <div>
                        <div>средний темп</div>
                        <strong>{activityDetails.fast?.averagePace || "—"}</strong>
                      </div>
                    </div>
                    <div className="activity-stat">
                      <span>△</span>
                      <div>
                        <div>разброс времени</div>
                        <strong>{activityDetails.fast?.standardDeviation || "—"}</strong>
                      </div>
                    </div>
                    <div className="activity-stat">
                      <span>♥</span>
                      <div>
                        <div>средний пульс</div>
                        <strong>{activityDetails.fast?.averageHR || "—"}</strong>
                      </div>
                    </div>
                    <div className="activity-stat">
                      <span>⇵</span>
                      <div>
                        <div>средняя дистанция</div>
                        <strong>{activityDetails.fast?.averageDistance || "—"}</strong>
                      </div>
                    </div>
                    <div className="activity-stat">
                      <span>◔</span>
                      <div>
                        <div>количество интервалов</div>
                        <strong>{activityDetails.fast?.count || "—"}</strong>
                      </div>
                    </div>
                  </div>

                  <div className="activity-column slow">
                    <h3>Медленно</h3>
                    <div className="activity-stat">
                      <span>⏱</span>
                      <div>
                        <div>среднее время</div>
                        <strong>{activityDetails.slow?.averageTime || "—"}</strong>
                      </div>
                    </div>
                    <div className="activity-stat">
                      <span>🧭</span>
                      <div>
                        <div>средний темп</div>
                        <strong>{activityDetails.slow?.averagePace || "—"}</strong>
                      </div>
                    </div>
                    <div className="activity-stat">
                      <span>△</span>
                      <div>
                        <div>разброс времени</div>
                        <strong>{activityDetails.slow?.standardDeviation || "—"}</strong>
                      </div>
                    </div>
                    <div className="activity-stat">
                      <span>♥</span>
                      <div>
                        <div>средний пульс</div>
                        <strong>{activityDetails.slow?.averageHR || "—"}</strong>
                      </div>
                    </div>
                    <div className="activity-stat">
                      <span>⇵</span>
                      <div>
                        <div>средняя дистанция</div>
                        <strong>{activityDetails.slow?.averageDistance || "—"}</strong>
                      </div>
                    </div>
                    <div className="activity-stat">
                      <span>◔</span>
                      <div>
                        <div>количество интервалов</div>
                        <strong>{activityDetails.slow?.count || "—"}</strong>
                      </div>
                    </div>
                  </div>
                </div>
              </>
            ) : (
              <>
                <h2>Выберите событие</h2>
                <p>Правая панель покажет activity-детали, когда будет доступен `aid`.</p>
              </>
            )}
          </aside>
        </main>
      </div>

      {isComposerOpen ? (
        <div className="modal-backdrop" onClick={() => setIsComposerOpen(false)}>
          <div className="composer-modal" onClick={(event) => event.stopPropagation()}>
            <div className="composer-header">
              <h2>{composerState.mode === "edit" ? "Редактировать событие" : "Новое событие"}</h2>
              <button onClick={() => setIsComposerOpen(false)}>×</button>
            </div>
            <div className="composer-grid">
              <label>
                Название
                <input
                  value={draft.title}
                  onChange={(event) => setDraft((current) => ({ ...current, title: event.target.value }))}
                />
              </label>
              <label>
                Цвет
                <input
                  type="color"
                  value={draft.color}
                  onChange={(event) => setDraft((current) => ({ ...current, color: event.target.value }))}
                />
              </label>
              <label>
                Начало
                <input
                  type="datetime-local"
                  value={draft.start}
                  onChange={(event) => setDraft((current) => ({ ...current, start: event.target.value }))}
                />
              </label>
              <label>
                Конец
                <input
                  type="datetime-local"
                  value={draft.end}
                  onChange={(event) => setDraft((current) => ({ ...current, end: event.target.value }))}
                />
              </label>
              <label>
                Место
                <input
                  value={draft.location}
                  onChange={(event) => setDraft((current) => ({ ...current, location: event.target.value }))}
                />
              </label>
              <label className="full-width">
                Описание
                <textarea
                  rows={5}
                  value={draft.description}
                  onChange={(event) => setDraft((current) => ({ ...current, description: event.target.value }))}
                />
              </label>
            </div>
            <div className="composer-actions">
              <button onClick={() => setIsComposerOpen(false)}>Отмена</button>
              <button className="primary" onClick={() => void handleSaveEvent()}>
                {composerState.mode === "edit" ? "Обновить" : "Сохранить"}
              </button>
            </div>
          </div>
        </div>
      ) : null}
    </div>
  );
}
