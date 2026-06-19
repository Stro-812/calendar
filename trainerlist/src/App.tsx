import { useEffect, useMemo, useState } from "react";
import { listTrainers, RankedTrainer } from "./api/trainerListApi";
import { FiltersPanel } from "./components/Filters";
import { HeroBanner } from "./components/HeroBanner";
import { PriorityPicker } from "./components/PriorityPicker";
import { TrainerCard } from "./components/TrainerCard";
import { WinnersCarousel } from "./components/WinnersCarousel";
import { challengeWinners } from "./mockTrainers";
import { Filters } from "./types";

const initialFilters: Filters = {
  disciplines: [],
  currency: null,
  priorities: [],
  keywords: "",
  tags: ""
};

export default function App() {
  const [filters, setFilters] = useState<Filters>(initialFilters);
  const [trainers, setTrainers] = useState<RankedTrainer[]>([]);
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

  function updateFilters(next: Partial<Filters>) {
    setFilters((current) => ({ ...current, ...next }));
  }

  const countText = useMemo(() => {
    const n = trainers.length;
    const forms: [string, string, string] = ["тренер", "тренера", "тренеров"];
    const mod10 = n % 10;
    const mod100 = n % 100;
    let form = forms[2];
    if (mod10 === 1 && mod100 !== 11) form = forms[0];
    else if (mod10 >= 2 && mod10 <= 4 && (mod100 < 10 || mod100 >= 20)) form = forms[1];
    return `${n} ${form}`;
  }, [trainers.length]);

  return (
    <div className="page">
      <HeroBanner />

      <WinnersCarousel winners={challengeWinners} />

      <p className="page-subtitle page-subtitle--lead">
        Подберите тренера под свои цели — список ранжируется по тому, что важно вам.
      </p>

      <PriorityPicker
        selected={filters.priorities}
        onChange={(priorities) => updateFilters({ priorities })}
      />

      <FiltersPanel filters={filters} onChange={updateFilters} onReset={() => setFilters(initialFilters)} />

      <div className="results-bar">
        <span className="results-bar__count">{isLoading ? "Загрузка…" : `Найдено: ${countText}`}</span>
        <span className="results-bar__sort">
          {filters.priorities.length > 0 ? "Отсортировано по вашим приоритетам" : "Отсортировано по рейтингу"}
        </span>
      </div>

      <main className="list" aria-busy={isLoading}>
        {!isLoading && trainers.length === 0 ? (
          <p className="state-message">По заданным условиям тренеры не найдены. Попробуйте смягчить фильтры.</p>
        ) : (
          trainers.map((trainer) => (
            <TrainerCard key={trainer.id} trainer={trainer} priorities={filters.priorities} />
          ))
        )}
      </main>
    </div>
  );
}
