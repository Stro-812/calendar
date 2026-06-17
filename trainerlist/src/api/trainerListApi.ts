import { mockTrainers } from "../mockTrainers";
import { Trainer, TrainerListFilters } from "../types";

// In-memory mock API. Replace these functions with real HTTP requests
// to the backend once the endpoints are available.

function sortTrainers(items: Trainer[], sortBy: TrainerListFilters["sortBy"]): Trainer[] {
  const sorted = [...items];

  switch (sortBy) {
    case "price":
      return sorted.sort((a, b) => a.pricePerSession - b.pricePerSession);
    case "experience":
      return sorted.sort((a, b) => b.experienceYears - a.experienceYears);
    case "rating":
    default:
      return sorted.sort((a, b) => b.rating - a.rating);
  }
}

export async function listTrainers(filters?: Partial<TrainerListFilters>): Promise<Trainer[]> {
  // Simulate a network round-trip.
  await new Promise((resolve) => setTimeout(resolve, 150));

  let items = [...mockTrainers];

  if (filters?.search) {
    const query = filters.search.trim().toLowerCase();
    items = items.filter(
      (trainer) =>
        trainer.name.toLowerCase().includes(query) ||
        trainer.specialization.toLowerCase().includes(query) ||
        trainer.tags.some((tag) => tag.toLowerCase().includes(query))
    );
  }

  if (filters?.specialization) {
    items = items.filter((trainer) => trainer.specialization === filters.specialization);
  }

  if (filters?.onlyAvailable) {
    items = items.filter((trainer) => trainer.isAvailable);
  }

  return sortTrainers(items, filters?.sortBy ?? "rating");
}
