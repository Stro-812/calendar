// Shared types for the trainer list page.
// NOTE: these are placeholder fields based on a typical "trainer catalog" page.
// Adjust them once we lock the exact data model of s10.run/trainerlist.

export interface Trainer {
  id: string;
  name: string;
  specialization: string;
  experienceYears: number;
  rating: number;
  reviewsCount: number;
  pricePerSession: number;
  avatarUrl: string | null;
  tags: string[];
  isAvailable: boolean;
}

export type SortKey = "rating" | "price" | "experience";

export interface TrainerListFilters {
  search: string;
  specialization: string | null;
  onlyAvailable: boolean;
  sortBy: SortKey;
}
