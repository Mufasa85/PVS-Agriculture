import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/layout/Footer";
import ElevageGallery from "@/components/sections/ElevageGallery";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import {
  BarnIcon,
  CheckIcon,
  CycleIcon,
  FeedBagIcon,
  LockIcon,
} from "@/components/ui/icons";
import { elevagePage } from "@/lib/content";

export const metadata: Metadata = {
  title: elevagePage.metaTitle,
  description: elevagePage.metaDescription,
};

function TitleLine({ line }: { line: string }) {
  const emphasis = elevagePage.hero.titleEmphasis;
  const index = line.indexOf(emphasis);

  if (index === -1) {
    return <>{line}</>;
  }

  return (
    <>
      {line.slice(0, index)}
      <em className="not-italic text-gold-500">
        {emphasis}
      </em>
      {line.slice(index + emphasis.length)}
    </>
  );
}

const practiceIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  check: CheckIcon,
  lock: LockIcon,
  feedbag: FeedBagIcon,
  cycle: CycleIcon,
  barn: BarnIcon,
};

export default function ElevagePage() {
  const { hero, practices, process, stats, cta } = elevagePage;

  return (
    <>
      {/* ── Hero plein écran ── */}
      <section className="relative flex min-h-[70vh] items-center justify-center overflow-hidden">
        <Image
          src={hero.imageSrc}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-900/70" />

        <div className="shell relative z-[1] py-[120px] text-center">
          <Reveal>
            <span className="eyebrow text-gold-500 before:bg-gold-500">
              {hero.eyebrow}
            </span>

            <h1 className="mx-auto mt-[18px] max-w-[760px] text-[clamp(36px,5.4vw,58px)] font-bold text-white">
              {hero.titleLines.map((line, i) => (
                <span key={line} className="block">
                  <TitleLine line={line} />
                  {i < hero.titleLines.length - 1 ? " " : null}
                </span>
              ))}
            </h1>

            <p className="mx-auto mt-[22px] max-w-[560px] text-[17px] leading-[1.7] text-white/80">
              {hero.paragraph}
            </p>

            <div className="mt-9 flex flex-wrap justify-center gap-4">
              <Link href={cta.buttonHref} className="btn btn-gold">
                {cta.buttonLabel}
              </Link>
              <Link
                href="/#activites"
                className="btn border-[1.5px] border-white/30 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white/20"
              >
                Découvrir nos activités
              </Link>
            </div>

            <dl className="mt-[52px] flex flex-wrap justify-center gap-[40px]">
              {stats.map((stat) => (
                <div key={stat.label} className="text-center">
                  <dt className="font-serif text-[28px] font-bold text-gold-500">
                    {stat.value}
                  </dt>
                  <dd className="text-[13px] font-semibold uppercase tracking-[0.06em] text-white/70">
                    {stat.label}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Galerie animée (slider auto-play) ── */}
      <ElevageGallery />

      {/* ── Pratiques d'élevage ── */}
      <section className="bg-brand-50 py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
            <SectionHead
              eyebrow={practices.eyebrow}
              title={practices.title}
              subtitle={practices.paragraph}
              center
            />
          </Reveal>

          <ul className="grid grid-cols-1 gap-5 mid:grid-cols-2 nav:grid-cols-3">
            {practices.items.map((item, index) => {
              const Icon = practiceIcons[item.icon] ?? CheckIcon;
              return (
                <Reveal
                  key={item.title}
                  as="li"
                  delay={index * 0.08}
                  className="rounded-pvs border border-line bg-white px-[22px] py-8 transition-all duration-[350ms] ease-pvs hover:-translate-y-1.5 hover:shadow-card"
                >
                  <span className="mb-[18px] flex h-12 w-12 items-center justify-center rounded-[11px] bg-brand-100 text-brand-700">
                    <Icon size={22} />
                  </span>
                  <h4 className="mb-2 text-[16.5px] font-bold text-brand-900">
                    {item.title}
                  </h4>
                  <p className="text-[13.5px] leading-[1.6] text-ink-500">
                    {item.description}
                  </p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Processus d'élevage (timeline) ── */}
      <section className="bg-white py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow={process.eyebrow}
              title={process.title}
              center
            />
          </Reveal>

          <div className="relative mt-14">
            <div className="absolute left-0 right-0 top-[28px] hidden h-[2px] bg-line nav:block" />

            <div className="grid grid-cols-1 gap-10 nav:grid-cols-5">
              {process.steps.map((step, index) => (
                <Reveal
                  key={step.number}
                  delay={index * 0.1}
                  className="relative text-center"
                >
                  <span className="relative z-[1] mx-auto mb-[18px] flex h-14 w-14 items-center justify-center rounded-full border-[2px] border-brand-200 bg-white font-serif text-[18px] font-bold text-brand-700">
                    {step.number}
                  </span>
                  <h4 className="mb-2 text-[15.5px] font-bold text-brand-900">
                    {step.title}
                  </h4>
                  <p className="text-[13px] leading-[1.6] text-ink-500">
                    {step.description}
                  </p>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-50 py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal className="mx-auto max-w-[640px] text-center">
            <span className="eyebrow">{cta.eyebrow}</span>
            <h2 className="mt-[14px] text-[clamp(30px,4vw,44px)]">
              {cta.title}
            </h2>
            <p className="mt-4 text-[17px] text-ink-500">{cta.text}</p>
            <Link href={cta.buttonHref} className="btn btn-primary mt-8">
              {cta.buttonLabel}
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
