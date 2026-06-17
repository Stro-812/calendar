import { MAX_PRIORITIES, PRIORITIES } from "../constants";
import { PriorityKey } from "../types";

interface PriorityPickerProps {
  selected: PriorityKey[];
  onChange: (next: PriorityKey[]) => void;
}

export function PriorityPicker({ selected, onChange }: PriorityPickerProps) {
  const limitReached = selected.length >= MAX_PRIORITIES;

  function toggle(key: PriorityKey) {
    if (selected.includes(key)) {
      onChange(selected.filter((k) => k !== key));
    } else if (!limitReached) {
      onChange([...selected, key]);
    }
  }

  return (
    <section className="priority">
      <div className="priority__head">
        <div>
          <h2 className="priority__title">Что для вас важнее всего в тренере?</h2>
          <p className="priority__subtitle">
            Выберите до {MAX_PRIORITIES} приоритетов — список перестроится под вас.
          </p>
        </div>
        <span className="priority__counter" aria-live="polite">
          {selected.length} / {MAX_PRIORITIES}
        </span>
      </div>

      <div className="priority__chips" role="group" aria-label="Приоритеты">
        {PRIORITIES.map((item) => {
          const isActive = selected.includes(item.key);
          const isDisabled = !isActive && limitReached;

          return (
            <button
              key={item.key}
              type="button"
              className={`chip ${isActive ? "chip--active" : ""} ${isDisabled ? "chip--disabled" : ""}`}
              aria-pressed={isActive}
              disabled={isDisabled}
              title={item.hint}
              onClick={() => toggle(item.key)}
            >
              <span className="chip__check" aria-hidden="true">
                {isActive ? "✓" : "+"}
              </span>
              {item.label}
            </button>
          );
        })}
      </div>

      {limitReached ? (
        <p className="priority__hint">
          Выбран максимум. Снимите один приоритет, чтобы добавить другой.
        </p>
      ) : null}
    </section>
  );
}
