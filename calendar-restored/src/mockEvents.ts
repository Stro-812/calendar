import { CalendarEvent } from "./types";

export const initialEvents: CalendarEvent[] = [
  {
    id: "evt-1",
    title: "Design review",
    start: "2026-03-10T09:30:00",
    end: "2026-03-10T10:30:00",
    color: "#7986cb",
    tag: "design",
    description: "Проверяем визуал month/week и empty states",
    attendees: ["Mila", "Ivan", "Alex"]
  },
  {
    id: "evt-2",
    title: "Weekly sync",
    start: "2026-03-11T12:00:00",
    end: "2026-03-11T13:00:00",
    color: "#33b679",
    tag: "meeting",
    location: "Zoom room",
    attendees: ["Team"]
  },
  {
    id: "evt-3",
    title: "Frontend focus",
    start: "2026-03-12T14:00:00",
    end: "2026-03-12T17:00:00",
    color: "#f6bf26",
    tag: "focus"
  },
  {
    id: "evt-4",
    title: "Product launch prep",
    start: "2026-03-14T11:00:00",
    end: "2026-03-14T12:30:00",
    color: "#d50000",
    tag: "launch",
    description: "Финальный прогон уведомлений и сценариев"
  },
  {
    id: "evt-5",
    title: "Personal block",
    start: "2026-03-15T08:00:00",
    end: "2026-03-15T09:00:00",
    color: "#8e24aa",
    tag: "personal"
  }
];
