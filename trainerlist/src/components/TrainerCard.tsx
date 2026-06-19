import { useState } from "react";
import { DISCIPLINE_META, PRIORITIES, PRIORITY_LABEL } from "../constants";
import { PriorityKey } from "../types";
import { RankedTrainer } from "../api/trainerListApi";
import { ScoreBadge } from "./ScoreBadge";

interface TrainerCardProps {
  trainer: RankedTrainer;
  priorities: PriorityKey[];
}

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((part) => part[0])
    .filter(Boolean)
    .slice(0, 2)
    .join("")
    .toUpperCase();
}

function ComponentBar({ label, value, highlight }: { label: string; value: number; highlight?: boolean }) {
  return (
    <div className={`cbar ${highlight ? "cbar--hl" : ""}`}>
      <span className="cbar__label">{label}</span>
      <span className="cbar__track">
        <span className="cbar__fill" style={{ width: `${value * 10}%` }} />
      </span>
      <span className="cbar__value">{value.toFixed(1)}</span>
    </div>
  );
}

export function TrainerCard({ trainer, priorities }: TrainerCardProps) {
  const [expanded, setExpanded] = useState(false);

  const priceText = `${trainer.priceFrom ? "от " : ""}${trainer.price.toLocaleString("ru-RU")} ${
    trainer.currency === "RUB" ? "₽" : "€"
  }`;

  return (
    <article className="card">
      <header className="card__head">
        <div className="avatar">
          {trainer.avatarUrl ? (
            <img src={trainer.avatarUrl} alt={trainer.name} />
          ) : (
            <span>{getInitials(trainer.name)}</span>
          )}
        </div>

        <div className="card__id">
          <h3 className="card__name">{trainer.name}</h3>
          {trainer.handle ? <p className="card__handle">{trainer.handle}</p> : null}
          <div className="card__disciplines">
            {trainer.disciplines.map((d) => (
              <span key={d} className="discipline" title={DISCIPLINE_META[d].label}>
                <span aria-hidden="true">{DISCIPLINE_META[d].icon}</span> {DISCIPLINE_META[d].label}
              </span>
            ))}
          </div>
        </div>

        <ScoreBadge score={trainer.rankedByPriorities ? trainer.rankScore : trainer.overallScore} />
      </header>

      <p className="card__desc">{trainer.description}</p>

      {priorities.length > 0 ? (
        <div className="card__match">
          <p className="card__match-title">По вашим приоритетам</p>
          {priorities.map((key) => (
            <ComponentBar key={key} label={PRIORITY_LABEL[key]} value={trainer.components[key]} highlight />
          ))}
        </div>
      ) : null}

      {expanded ? (
        <div className="card__breakdown">
          <p className="card__match-title">Из чего складывается рейтинг</p>
          {PRIORITIES.map((p) => (
            <ComponentBar
              key={p.key}
              label={p.label}
              value={trainer.components[p.key]}
              highlight={priorities.includes(p.key)}
            />
          ))}
        </div>
      ) : null}

      <footer className="card__foot">
        <div className="card__price">
          <strong>{priceText}</strong>
          {trainer.remote ? <span className="tag-remote">🌍 Удалённо</span> : null}
        </div>

        <div className="card__actions">
          <button type="button" className="link-button" onClick={() => setExpanded((v) => !v)}>
            {expanded ? "Свернуть" : "Из чего складывается"}
          </button>
          <button type="button" className="btn-primary">
            Профиль тренера
          </button>
        </div>
      </footer>
    </article>
  );
}
