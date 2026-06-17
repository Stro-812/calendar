import { useEffect, useState } from "react";
import { listTrainers } from "./api/trainerListApi";
import { FilterBar } from "./components/FilterBar";
import { TrainerCard } from "./components/TrainerCard";
import { specializations } from "./mockTrainers";
import { Trainer, TrainerListFilters } from "./types";

const initialFilters: TrainerListFilters = {
  search: "",
  specialization: null,
  onlyAvailable: false,
  sortBy: "rating"
};

export default function App() {
  const [filters, setFilters] = useState<TrainerListFilters>(initialFilters);
  const [trainers, setTrainers] = useState<Trainer[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let active = true;
    setIsLoading(true);

    listTrainers(filters).then((items) => {
      if (active) {
        setTrainers(items);
        setIsLoading(false);
      }
    });

    return () => {
      active = false;
    };
  }, [filters]);

  function updateFilters(next: Partial<TrainerListFilters>) {
    setFilters((current) => ({ ...current, ...next }));
  }

  return (
    <div className="page">
      <header className="page-header">
        <p className="eyebrow">s10.run</p>
        <h1>Тренеры</h1>
        <p className="page-subtitle">Выберите тренера по направлению, рейтингу и доступности.</p>
      </header>

      <FilterBar filters={filters} specializations={specializations} onChange={updateFilters} />

      <main className="trainer-grid" aria-busy={isLoading}>
        {isLoading ? (
          <p className="state-message">Загрузка…</p>
        ) : trainers.length === 0 ? (
          <p className="state-message">По заданным фильтрам тренеры не найдены.</p>
        ) : (
          trainers.map((trainer) => <TrainerCard key={trainer.id} trainer={trainer} />)
        )}
      </main>
    </div>
  );
}
