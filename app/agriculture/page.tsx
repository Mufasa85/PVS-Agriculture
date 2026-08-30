import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/layout/Footer";
import HeroFloatingBadge from "@/components/sections/HeroFloatingBadge";
import Reveal from "@/components/ui/Reveal";
import {
  BarnIcon,
  CheckIcon,
  CycleIcon,
  LeafIcon,
  LinesIcon,
  LockIcon,
} from "@/components/ui/icons";
import { agriculturePage } from "@/lib/content";

export const metadata: Metadata = {
  title: agriculturePage.metaTitle,
  description: agriculturePage.metaDescription,
};

const pointIcons = [
  BarnIcon,
  LeafIcon,
  LockIcon,
  CheckIcon,
  CycleIcon,
  LinesIcon,
];

function TitleLine({ line }: { line: string }) {
  const emphasis = agriculturePage.hero.titleEmphasis;
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

export default function AgriculturePage() {
  const { hero, features, stats, cta } = agriculturePage;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white pb-[90px] pt-[140px] sm:pt-[168px]">
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
              <Link href={cta.buttonHref} className="btn btn-primary">
                {cta.buttonLabel}
              </Link>
              <Link href="/#activites" className="btn btn-ghost">
                Découvrir nos activités
              </Link>
            </div>

            <dl className="mt-[52px] flex flex-wrap justify-center gap-[34px] nav:justify-start">
              {stats.map((stat) => (
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
              <Image
                src={hero.imageSrc}
                alt={hero.imageAlt}
                fill
                priority
                sizes="(max-width: 900px) 420px, 45vw"
                className="object-cover"
              />
            </div>

            <HeroFloatingBadge>{hero.badge}</HeroFloatingBadge>
          </Reveal>
        </div>
      </section>

      {/* ── Features (section sombre, comme AgricultureFeature sur la landing) ── */}
      <section className="relative bg-brand-900 text-white">
        <div className="shell pb-[110px] pt-[70px]">
          <Reveal className="mb-14 max-w-[640px]">
            <span className="eyebrow text-gold-500 before:bg-gold-500">
              {features.eyebrow}
            </span>
            <h2 className="mt-[14px] text-[clamp(30px,4vw,44px)] text-white">
              {features.title}
            </h2>
          </Reveal>

          <div className="mt-5 grid items-center gap-16 nav:grid-cols-[0.9fr_1.1fr]">
            <Reveal className="relative aspect-[5/6] overflow-hidden rounded-pvs-lg bg-gradient-to-br from-brand-700 to-brand-500 shadow-img-dark">
              <Image
                src={features.imageSrc}
                alt={features.imageAlt}
                fill
                sizes="(max-width: 900px) 90vw, 40vw"
                className="object-cover"
              />
            </Reveal>

            <Reveal delay={0.16}>
              <p className="mb-[38px] max-w-[520px] text-[17px] text-muted-light nav:mb-[34px]">
                {features.paragraph}
              </p>

              <ul className="grid gap-[30px] nav:grid-cols-2 nav:gap-x-7 nav:gap-y-[22px]">
                {features.points.map((point, index) => {
                  const Icon = pointIcons[index] ?? BarnIcon;
                  return (
                    <li
                      key={point.title}
                      className="flex items-center gap-[14px] nav:items-start"
                    >
                      <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] border border-white/[0.14] bg-white/[0.08] text-gold-500 nav:h-10 nav:w-10">
                        <Icon />
                      </span>
                      <span className="block">
                        <span className="mb-1.5 block font-sans text-base font-bold text-white nav:mb-1 nav:text-[15.5px]">
                          {point.title}
                        </span>
                        <span className="block text-[13.5px] leading-[1.55] text-muted">
                          {point.description}
                        </span>
                      </span>
                    </li>
                  );
                })}
              </ul>
            </Reveal>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-white py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal className="mx-auto max-w-[640px] text-center">
            <span className="eyebrow">{cta.eyebrow}</span>
            <h2 className="mt-[14px] text-[clamp(30px,4vw,44px)]">
              {cta.title}
            </h2>
            <p className="mt-4 text-[17px] text-ink-500">{cta.text}</p>
            <Link
              href={cta.buttonHref}
              className="btn btn-primary mt-8"
            >
              {cta.buttonLabel}
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
