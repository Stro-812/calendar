const HOURS_IN_DAY = 24;

export function startOfWeek(input: Date) {
  const date = new Date(input);
  const day = (date.getDay() + 6) % 7;
  date.setDate(date.getDate() - day);
  date.setHours(0, 0, 0, 0);
  return date;
}

export function addDays(input: Date, days: number) {
  const date = new Date(input);
  date.setDate(date.getDate() + days);
  return date;
}

export function addMonths(input: Date, months: number) {
  const date = new Date(input);
  date.setMonth(date.getMonth() + months);
  return date;
}

export function formatMonthLabel(input: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    month: "long",
    year: "numeric"
  }).format(input);
}

export function formatWeekRange(input: Date) {
  const weekStart = startOfWeek(input);
  const weekEnd = addDays(weekStart, 6);
  const formatter = new Intl.DateTimeFormat("ru-RU", {
    day: "numeric",
    month: "short"
  });
  return `${formatter.format(weekStart)} - ${formatter.format(weekEnd)}`;
}

export function getWeekDays(input: Date) {
  const start = startOfWeek(input);
  return Array.from({ length: 7 }, (_, index) => addDays(start, index));
}

export function getMonthGrid(input: Date) {
  const firstDay = new Date(input.getFullYear(), input.getMonth(), 1);
  const gridStart = startOfWeek(firstDay);
  return Array.from({ length: 42 }, (_, index) => addDays(gridStart, index));
}

export function isSameDay(a: Date, b: Date) {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

export function formatShortWeekday(input: Date) {
  return new Intl.DateTimeFormat("ru-RU", { weekday: "short" }).format(input);
}

export function formatDayNumber(input: Date) {
  return new Intl.DateTimeFormat("ru-RU", { day: "numeric" }).format(input);
}

export function formatTime(input: Date) {
  return new Intl.DateTimeFormat("ru-RU", {
    hour: "2-digit",
    minute: "2-digit"
  }).format(input);
}

export function parseDateTime(localValue: string) {
  return new Date(localValue);
}

export function toLocalInputValue(input: Date) {
  const year = input.getFullYear();
  const month = `${input.getMonth() + 1}`.padStart(2, "0");
  const day = `${input.getDate()}`.padStart(2, "0");
  const hours = `${input.getHours()}`.padStart(2, "0");
  const minutes = `${input.getMinutes()}`.padStart(2, "0");
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

export function getHourLabels() {
  return Array.from({ length: HOURS_IN_DAY }, (_, hour) =>
    `${`${hour}`.padStart(2, "0")}:00`
  );
}

export function getMinutesSinceDayStart(input: Date) {
  return input.getHours() * 60 + input.getMinutes();
}
