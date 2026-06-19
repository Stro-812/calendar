import { useRef } from "react";
import { DISCIPLINE_META } from "../constants";
import { ChallengeWinner } from "../types";

interface WinnersCarouselProps {
  winners: ChallengeWinner[];
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

export function WinnersCarousel({ winners }: WinnersCarouselProps) {
  const trackRef = useRef<HTMLDivElement>(null);

  if (winners.length === 0) return null;

  function scroll(direction: -1 | 1) {
    const track = trackRef.current;
    if (!track) return;
    track.scrollBy({ left: direction * (track.clientWidth * 0.8), behavior: "smooth" });
  }

  return (
    <section className="winners">
      <div className="winners__head">
        <div>
          <h2 className="winners__title">🏆 Победители челленджей</h2>
          <p className="winners__subtitle">Тренеры, чьи команды показали лучший результат</p>
        </div>
        <div className="winners__nav">
          <button type="button" className="winners__arrow" aria-label="Назад" onClick={() => scroll(-1)}>
            ‹
          </button>
          <button type="button" className="winners__arrow" aria-label="Вперёд" onClick={() => scroll(1)}>
            ›
          </button>
        </div>
      </div>

      <div className="winners__track" ref={trackRef}>
        {winners.map((winner) => (
          <article key={winner.id} className="winner-card">
            <span className="winner-card__badge">🏆 {winner.challenge}</span>
            <div className="winner-card__avatar">
              {winner.avatarUrl ? (
                <img src={winner.avatarUrl} alt={winner.name} />
              ) : (
                <span>{getInitials(winner.name)}</span>
              )}
            </div>
            <h3 className="winner-card__name">{winner.name}</h3>
            <p className="winner-card__meta">
              <span aria-hidden="true">{DISCIPLINE_META[winner.discipline].icon}</span>{" "}
              {DISCIPLINE_META[winner.discipline].label}
              <span className="winner-card__score">★ {winner.score.toFixed(1)}</span>
            </p>
          </article>
        ))}
      </div>
    </section>
  );
}
