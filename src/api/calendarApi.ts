import { CalendarEvent } from "../types";
import { initialEvents } from "../mockEvents";

let inMemoryEvents = [...initialEvents];

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export async function listEvents() {
  await delay(180);
  return [...inMemoryEvents];
}

export async function createEvent(event: CalendarEvent) {
  await delay(160);
  inMemoryEvents = [event, ...inMemoryEvents];
  return event;
}

export async function updateEvent(event: CalendarEvent) {
  await delay(140);
  inMemoryEvents = inMemoryEvents.map((entry) => (entry.id === event.id ? event : entry));
  return event;
}
