import { TOTAL_TRAINERS } from "../constants";

export function HeroBanner() {
  return (
    <section className="hero">
      <div className="hero__overlay" />
      <div className="hero__content">
        <h1 className="hero__title">
          Найди
          <br />
          тренера
        </h1>
        <p className="hero__stat">
          <strong>{TOTAL_TRAINERS}</strong> тренеров в одной базе
        </p>
        <p className="hero__subtitle">Вероятно, самая большая база тренеров по бегу</p>
      </div>
    </section>
  );
}
