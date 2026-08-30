import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import {
  CattleIcon,
  FeedBagIcon,
  FishIcon,
  PigIcon,
  SproutIcon,
} from "@/components/ui/icons";
import { aproposPage } from "@/lib/content";

export const metadata: Metadata = {
  title: aproposPage.metaTitle,
  description: aproposPage.metaDescription,
};

function TitleLine({ line }: { line: string }) {
  const emphasis = aproposPage.hero.titleEmphasis;
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

const expertiseIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  sprout: SproutIcon,
  cattle: CattleIcon,
  fish: FishIcon,
  pig: PigIcon,
  feedbag: FeedBagIcon,
};

export default function AProposPage() {
  const { hero, mission, vision, expertise, approach, values, stats, cta } = aproposPage;
  const [imageA, imageB] = vision.images;

  return (
    <>
      {/* ── Hero plein écran avec image en fond ── */}
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

      {/* ── Mission (citation mise en avant) ── */}
      <section className="relative bg-brand-900 py-[80px] nav:py-[120px]">
        <div className="shell max-w-[800px] text-center">
          <Reveal>
            <span className="eyebrow text-gold-500 before:bg-gold-500">
              {mission.eyebrow}
            </span>
            <h2 className="mt-[14px] text-[clamp(26px,3.4vw,36px)] text-white">
              {mission.title}
            </h2>
            <blockquote className="mt-[30px] text-[clamp(18px,2.4vw,24px)] font-serif leading-[1.6] text-white/90">
              {mission.statement}
            </blockquote>
            <div className="mt-[28px]">
              <p className="font-bold text-gold-500">{mission.signature}</p>
              <p className="mt-1 text-[13px] text-white/60">
                {mission.signatureRole}
              </p>
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Vision (reprend la structure APropos de la landing) ── */}
      <section className="bg-brand-50 py-[76px] nav:py-[110px]">
        <div className="shell grid items-center gap-16 nav:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="mx-auto grid h-auto w-full max-w-[460px] grid-cols-2 items-stretch gap-3.5 nav:relative nav:mx-0 nav:block nav:h-[460px] nav:max-w-none">
            <div className="relative min-h-[170px] overflow-hidden rounded-pvs-lg bg-brand-600 shadow-float mid:min-h-[220px] nav:absolute nav:left-0 nav:top-0 nav:z-[1] nav:h-[82%] nav:w-[78%] nav:min-h-0">
              <Image
                src={imageA.src}
                alt={imageA.alt}
                fill
                sizes="(max-width: 900px) 45vw, 35vw"
                className="object-cover"
              />
            </div>
            <div className="relative min-h-[170px] overflow-hidden rounded-pvs-lg bg-gold-500 shadow-float mid:min-h-[220px] nav:absolute nav:bottom-0 nav:right-0 nav:z-[2] nav:h-[52%] nav:w-[52%] nav:min-h-0 nav:border-[6px] nav:border-white">
              <Image
                src={imageB.src}
                alt={imageB.alt}
                fill
                sizes="(max-width: 900px) 45vw, 20vw"
                className="object-cover"
              />
            </div>
          </Reveal>

          <Reveal delay={0.16}>
            <span className="eyebrow">{vision.eyebrow}</span>
            <h2 className="mt-[14px] text-[clamp(28px,3.6vw,38px)]">
              {vision.title}
            </h2>

            {vision.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mb-[18px] mt-[18px] text-base text-ink-700"
              >
                {paragraph}
              </p>
            ))}

            <ul className="mt-[30px] flex flex-wrap gap-4">
              {vision.tags.map((tag) => (
                <li
                  key={tag}
                  className="flex items-center gap-2.5 rounded-full border border-line bg-white px-[18px] py-3 text-[13.5px] font-bold text-brand-900"
                >
                  <span className="h-2 w-2 shrink-0 rounded-full bg-gold-500" />
                  {tag}
                </li>
              ))}
            </ul>
          </Reveal>
        </div>
      </section>

      {/* ── Domaines d'expertise ── */}
      <section className="bg-white py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow={expertise.eyebrow}
              title={expertise.title}
              subtitle={expertise.subtitle}
              center
            />
          </Reveal>

          <ul className="grid grid-cols-1 gap-5 mid:grid-cols-2 nav:grid-cols-3 wide:grid-cols-5">
            {expertise.items.map((item, index) => {
              const Icon = expertiseIcons[item.icon] ?? SproutIcon;
              return (
                <Reveal
                  key={item.title}
                  as="li"
                  delay={index * 0.08}
                  className="flex flex-col items-center rounded-pvs border border-line px-[22px] py-8 text-center transition-all duration-[350ms] ease-pvs hover:-translate-y-1.5 hover:bg-brand-50 hover:shadow-card"
                >
                  <span className="mb-[18px] flex h-14 w-14 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                    <Icon size={26} />
                  </span>
                  <h4 className="mb-2 text-[16.5px]">{item.title}</h4>
                  <p className="text-[13.5px] text-ink-500">{item.description}</p>
                </Reveal>
              );
            })}
          </ul>
        </div>
      </section>

      {/* ── Notre approche (étapes) ── */}
      <section className="bg-brand-900 py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow={approach.eyebrow}
              title={approach.title}
              center
            />
          </Reveal>

          <div className="grid grid-cols-1 gap-8 mid:grid-cols-2 nav:grid-cols-4">
            {approach.steps.map((step, index) => (
              <Reveal
                key={step.number}
                delay={index * 0.1}
                className="relative"
              >
                <span className="mb-[16px] block font-serif text-[42px] font-bold text-gold-500/30">
                  {step.number}
                </span>
                <h4 className="mb-2 text-[17px] font-bold text-white">
                  {step.title}
                </h4>
                <p className="text-[13.5px] leading-[1.6] text-white/70">
                  {step.description}
                </p>
                {index < approach.steps.length - 1 && (
                  <span className="absolute right-[-16px] top-[20px] hidden text-gold-500/30 nav:block">
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none">
                      <path
                        d="M5 12h14M13 6l6 6-6 6"
                        stroke="currentColor"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </span>
                )}
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* ── Valeurs / Engagements (reprend PourquoiNousChoisir) ── */}
      <section className="bg-white py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow={values.eyebrow}
              title={values.title}
              center
            />
          </Reveal>

          <ul className="grid grid-cols-1 gap-5 mid:grid-cols-2 nav:grid-cols-3 wide:grid-cols-5">
            {values.items.map((item, index) => (
              <Reveal
                key={item.tag}
                as="li"
                delay={index * 0.08}
                className="rounded-pvs border border-line px-[22px] py-8 text-left transition-all duration-[350ms] ease-pvs hover:-translate-y-1.5 hover:bg-brand-50 hover:shadow-card"
              >
                <span className="mb-[18px] block font-serif text-[15px] font-bold text-gold-600">
                  {item.tag}
                </span>
                <h4 className="mb-2 text-[16.5px]">{item.title}</h4>
                <p className="text-[13.5px] text-ink-500">{item.description}</p>
              </Reveal>
            ))}
          </ul>
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
