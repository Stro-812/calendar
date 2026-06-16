export type CalendarView = "week" | "month";

export type CalendarTag = "focus" | "meeting" | "personal" | "launch" | "design";

export type TrainingPhase = "base" | "speed" | "development" | "taper" | "race";

export type TrainingSport = "run" | "swim" | "bike" | "other";

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
  phase?: TrainingPhase;
  trainingType?: string;
  sport?: TrainingSport;
  task?: string;
  report?: string;
  intervalCount?: number;
  intervalLength?: number;
  pace?: string;
};
