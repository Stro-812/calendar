import { ChangeEvent } from "react";
import { SortKey, TrainerListFilters } from "../types";

interface FilterBarProps {
  filters: TrainerListFilters;
  specializations: string[];
  onChange: (next: Partial<TrainerListFilters>) => void;
}

export function FilterBar({ filters, specializations, onChange }: FilterBarProps) {
  function handleSearch(event: ChangeEvent<HTMLInputElement>) {
    onChange({ search: event.target.value });
  }

  function handleSpecialization(event: ChangeEvent<HTMLSelectElement>) {
    onChange({ specialization: event.target.value || null });
  }

  function handleSort(event: ChangeEvent<HTMLSelectElement>) {
    onChange({ sortBy: event.target.value as SortKey });
  }

  function handleAvailable(event: ChangeEvent<HTMLInputElement>) {
    onChange({ onlyAvailable: event.target.checked });
  }

  return (
    <div className="filter-bar">
      <input
        className="filter-search"
        type="search"
        placeholder="Поиск по имени, направлению, тегам…"
        value={filters.search}
        onChange={handleSearch}
      />

      <select className="filter-select" value={filters.specialization ?? ""} onChange={handleSpecialization}>
        <option value="">Все направления</option>
        {specializations.map((spec) => (
          <option key={spec} value={spec}>
            {spec}
          </option>
        ))}
      </select>

      <select className="filter-select" value={filters.sortBy} onChange={handleSort}>
        <option value="rating">По рейтингу</option>
        <option value="price">По цене</option>
        <option value="experience">По опыту</option>
      </select>

      <label className="filter-checkbox">
        <input type="checkbox" checked={filters.onlyAvailable} onChange={handleAvailable} />
        Только свободные
      </label>
    </div>
  );
}
