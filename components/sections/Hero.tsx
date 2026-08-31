import Link from "next/link";

import Reveal from "@/components/ui/Reveal";
import FloatingBadge from "@/components/sections/HeroFloatingBadge";
import HeroImageCarousel from "@/components/sections/HeroImageCarousel";
import { hero } from "@/lib/content";

function TitleLine({ line }: { line: string }) {
  const emphasis = hero.titleEmphasis;
  const index = line.indexOf(emphasis);

  if (index === -1) {
    return <>{line}</>;
  }

  return (
    <>
      {line.slice(0, index)}
      <em className="not-italic text-brand-600 [background:linear-gradient(180deg,transparent_62%,theme(colors.brand.100)_62%)]">
        {emphasis}
      </em>
      {line.slice(index + emphasis.length)}
    </>
  );
}

export default function Hero() {
  return (
    <section
      id="accueil"
      className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white pb-[90px] pt-[140px] sm:pt-[168px]"
    >
      <div className="shell grid items-center gap-14 nav:grid-cols-[1.05fr_0.95fr]">
        <Reveal className="order-2 text-center nav:order-1 nav:text-left">
          <span className="eyebrow">{hero.eyebrow}</span>

          <h1 className="mt-[18px] text-[clamp(38px,5.4vw,60px)] font-bold">
            {hero.titleLines.map((line, i) => (
              <span key={line} className="block">
                <TitleLine line={line} />
                {i < hero.titleLines.length - 1 ? " " : null}
              </span>
            ))}
          </h1>

          <p className="mx-auto mt-[22px] max-w-[520px] text-[18px] text-ink-700 nav:mx-0">
            {hero.paragraph}
          </p>

          <div className="mt-9 flex flex-wrap justify-center gap-4 nav:justify-start">
            <Link href={hero.ctaPrimary.href} className="btn btn-primary">
              {hero.ctaPrimary.label}
            </Link>
            <Link href={hero.ctaSecondary.href} className="btn btn-ghost">
              {hero.ctaSecondary.label}
            </Link>
          </div>

          <dl className="mt-[52px] flex flex-wrap justify-center gap-[34px] nav:justify-start">
            {hero.stats.map((stat) => (
              <div key={stat.label}>
                <dt className="font-serif text-[26px] font-bold text-brand-700">
                  {stat.value}
                </dt>
                <dd className="text-[13px] font-semibold text-ink-500">
                  {stat.label}
                </dd>
              </div>
            ))}
          </dl>
        </Reveal>

        <Reveal
          delay={0.16}
          className="relative order-1 mx-auto w-full max-w-[420px] nav:order-2 nav:max-w-none"
        >
          <div
            aria-hidden="true"
            className="hero-blob absolute -top-[8%] -right-[14%] z-0 h-[120%] w-[120%] bg-brand-600 opacity-95"
          />

          <div className="relative z-[1] aspect-[4/4.6] overflow-hidden rounded-pvs-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-float">
            <HeroImageCarousel images={hero.images} />
          </div>

          <FloatingBadge>{hero.badge}</FloatingBadge>

          <div className="absolute bottom-[34px] left-1.5 z-[2] flex max-w-[230px] items-center gap-3 rounded-2xl bg-white px-[22px] py-[18px] shadow-card sm:-left-[30px]">
            <span className="flex h-[42px] w-[42px] shrink-0 items-center justify-center rounded-full bg-brand-100">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden="true">
                <path
                  d="M12 2C12 2 6 8 6 13a6 6 0 0012 0c0-5-6-11-6-11z"
                  stroke="#3a45c4"
                  strokeWidth="1.8"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            <span className="block">
              <span className="block font-serif text-sm font-bold text-brand-900">
                {hero.floatingCardTitle}
              </span>
              <span className="block text-xs text-ink-500">
                {hero.floatingCardText}
              </span>
            </span>
          </div>
        </Reveal>
      </div>
    </section>
  );
}
