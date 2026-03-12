export type CalendarView = "week" | "month";

export type CalendarTag = "focus" | "meeting" | "personal" | "launch" | "design";

export type CalendarEvent = {
  id: string;
  title: string;
  start: string;
  end: string;
  color: string;
  tag: CalendarTag;
  description?: string;
  location?: string;
  attendees?: string[];
};
