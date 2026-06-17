import { Trainer } from "../types";

interface TrainerCardProps {
  trainer: Trainer;
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

export function TrainerCard({ trainer }: TrainerCardProps) {
  return (
    <article className="trainer-card">
      <div className="trainer-card__head">
        <div className="trainer-avatar" aria-hidden={trainer.avatarUrl ? undefined : true}>
          {trainer.avatarUrl ? (
            <img src={trainer.avatarUrl} alt={trainer.name} />
          ) : (
            <span>{getInitials(trainer.name)}</span>
          )}
        </div>

        <div className="trainer-card__title">
          <h3>{trainer.name}</h3>
          <p className="trainer-card__spec">{trainer.specialization}</p>
        </div>

        <span className={`trainer-status ${trainer.isAvailable ? "is-available" : "is-busy"}`}>
          {trainer.isAvailable ? "Свободен" : "Занят"}
        </span>
      </div>

      <div className="trainer-card__meta">
        <span>⭐ {trainer.rating.toFixed(1)} ({trainer.reviewsCount})</span>
        <span>{trainer.experienceYears} лет опыта</span>
        <span>{trainer.pricePerSession.toLocaleString("ru-RU")} ₽ / занятие</span>
      </div>

      <ul className="trainer-card__tags">
        {trainer.tags.map((tag) => (
          <li key={tag}>{tag}</li>
        ))}
      </ul>
    </article>
  );
}
