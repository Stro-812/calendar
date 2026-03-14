export type CalendarView = "week" | "month";

export type CalendarTag = "focus" | "meeting" | "personal" | "launch" | "design";

export type TrainingPhase = "base" | "speed" | "development" | "taper" | "race";

export type TrainingSport = "run" | "swim" | "bike" | "other";

export type ActivityDetails = {
  studentName: string;
  distance: number;
  pace: string;
  bpm: number;
  cadence: number;
  impulse: number;
  gs: number;
  trainerName?: string;
  trainerComment?: string;
  reportComment?: string;
  fast?: {
    averageTime: string;
    averagePace: string;
    standardDeviation: string;
    averageHR: number;
    averageDistance: string;
    count: number;
  };
  slow?: {
    averageTime: string;
    averagePace: string;
    standardDeviation: string;
    averageHR: number;
    averageDistance: string;
    count: number;
  };
};

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
  activityId?: string;
};
