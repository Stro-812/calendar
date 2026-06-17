import bannerUrl from "../assets/hero-banner.png";

export function HeroBanner() {
  return (
    <section className="hero">
      <img className="hero__image" src={bannerUrl} alt="Найди тренера — 170 тренеров в одной базе" />
    </section>
  );
}
