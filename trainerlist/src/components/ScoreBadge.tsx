interface ScoreBadgeProps {
  score: number;
  size?: "lg" | "md";
}

function scoreTone(score: number): string {
  if (score >= 9) return "score--high";
  if (score >= 8) return "score--good";
  return "score--mid";
}

export function ScoreBadge({ score, size = "lg" }: ScoreBadgeProps) {
  return (
    <span className={`score score--${size} ${scoreTone(score)}`}>
      <span className="score__icon" aria-hidden="true">★</span>
      <span className="score__value">{score.toFixed(1)}</span>
      <span className="score__max">/10</span>
    </span>
  );
}
