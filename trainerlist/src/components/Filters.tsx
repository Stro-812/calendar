import { ChangeEvent } from "react";
import { DISCIPLINES } from "../constants";
import { Currency, DisciplineKey, Filters } from "../types";

interface FiltersPanelProps {
  filters: Filters;
  onChange: (next: Partial<Filters>) => void;
  onReset: () => void;
}

const CURRENCIES: Currency[] = ["RUB", "EUR"];

export function FiltersPanel({ filters, onChange, onReset }: FiltersPanelProps) {
  function toggleDiscipline(key: DisciplineKey) {
    const next = filters.disciplines.includes(key)
      ? filters.disciplines.filter((d) => d !== key)
      : [...filters.disciplines, key];
    onChange({ disciplines: next });
  }

  function toggleCurrency(currency: Currency) {
    onChange({ currency: filters.currency === currency ? null : currency });
  }

  function handleKeywords(event: ChangeEvent<HTMLInputElement>) {
    onChange({ keywords: event.target.value });
  }

  function handleTags(event: ChangeEvent<HTMLInputElement>) {
    onChange({ tags: event.target.value });
  }

  return (
    <section className="filters">
      <div className="filters__group">
        <span className="filters__label">Дисциплина</span>
        <div className="filters__row">
          {DISCIPLINES.map((d) => (
            <button
              key={d.key}
              type="button"
              className={`pill ${filters.disciplines.includes(d.key) ? "pill--active" : ""}`}
              aria-pressed={filters.disciplines.includes(d.key)}
              onClick={() => toggleDiscipline(d.key)}
            >
              <span aria-hidden="true">{d.icon}</span> {d.label}
            </button>
          ))}
        </div>
      </div>

      <div className="filters__group">
        <span className="filters__label">Валюта</span>
        <div className="filters__row">
          {CURRENCIES.map((c) => (
            <button
              key={c}
              type="button"
              className={`pill ${filters.currency === c ? "pill--active" : ""}`}
              aria-pressed={filters.currency === c}
              onClick={() => toggleCurrency(c)}
            >
              {c}
            </button>
          ))}
        </div>
      </div>

      <div className="filters__group filters__group--grow">
        <span className="filters__label">Поиск</span>
        <div className="filters__row">
          <input
            className="input"
            type="search"
            placeholder="Имя или ключевые слова"
            value={filters.keywords}
            onChange={handleKeywords}
          />
          <input
            className="input"
            type="search"
            placeholder="Теги"
            value={filters.tags}
            onChange={handleTags}
          />
        </div>
      </div>

      <button type="button" className="link-button" onClick={onReset}>
        Сбросить
      </button>
    </section>
  );
}
