import { mockTrainers } from "../mockTrainers";
import { Filters, Trainer } from "../types";

// In-memory mock API. Replace with real HTTP requests once the backend is ready.

export interface RankedTrainer extends Trainer {
  /** Score used for the current ordering (0–10). */
  rankScore: number;
  /** True when ordering reflects the user's selected priorities. */
  rankedByPriorities: boolean;
}

function matchesFilters(trainer: Trainer, filters: Filters): boolean {
  if (filters.disciplines.length > 0) {
    const hasDiscipline = filters.disciplines.some((d) => trainer.disciplines.includes(d));
    if (!hasDiscipline) return false;
  }

  if (filters.currency && trainer.currency !== filters.currency) {
    return false;
  }

  if (filters.keywords.trim()) {
    const query = filters.keywords.trim().toLowerCase();
    const haystack = `${trainer.name} ${trainer.handle ?? ""} ${trainer.description}`.toLowerCase();
    if (!haystack.includes(query)) return false;
  }

  if (filters.tags.trim()) {
    const query = filters.tags.trim().toLowerCase();
    const hasTag = trainer.tags.some((tag) => tag.toLowerCase().includes(query));
    if (!hasTag) return false;
  }

  return true;
}

/** Average of the selected component scores, or the overall score when none chosen. */
function computeRankScore(trainer: Trainer, priorities: Filters["priorities"]): number {
  if (priorities.length === 0) {
    return trainer.overallScore;
  }

  const sum = priorities.reduce((acc, key) => acc + trainer.components[key], 0);
  return sum / priorities.length;
}

export async function listTrainers(filters: Filters): Promise<RankedTrainer[]> {
  // Simulate a network round-trip.
  await new Promise((resolve) => setTimeout(resolve, 150));

  const rankedByPriorities = filters.priorities.length > 0;

  return mockTrainers
    .filter((trainer) => matchesFilters(trainer, filters))
    .map<RankedTrainer>((trainer) => ({
      ...trainer,
      rankScore: computeRankScore(trainer, filters.priorities),
      rankedByPriorities
    }))
    .sort((a, b) => b.rankScore - a.rankScore);
}
