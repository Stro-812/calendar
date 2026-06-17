// Domain model for the "Найти тренера" page.

export type PriorityKey =
  | "studentProgress"
  | "trainerScore"
  | "experience"
  | "communication"
  | "achievements"
  | "activity";

export type DisciplineKey = "run" | "bike" | "swim";

export type Currency = "RUB" | "EUR";

export interface Trainer {
  id: string;
  name: string;
  /** e.g. "Stro_team (Дежурный тренер)" */
  handle: string | null;
  avatarUrl: string | null;
  /** Overall weighted rating, 0–10. */
  overallScore: number;
  /** Sub-score (0–10) for each rating component. */
  components: Record<PriorityKey, number>;
  disciplines: DisciplineKey[];
  description: string;
  price: number;
  priceFrom: boolean;
  currency: Currency;
  remote: boolean;
  tags: string[];
}

export interface Filters {
  disciplines: DisciplineKey[];
  currency: Currency | null;
  /** Selected rating components to rank by — up to MAX_PRIORITIES. */
  priorities: PriorityKey[];
  keywords: string;
  tags: string;
}
