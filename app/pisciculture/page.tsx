import type { Metadata } from "next";
import type { ComponentType } from "react";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import {
  CheckIcon,
  CycleIcon,
  FeedBagIcon,
  FishIcon,
  LockIcon,
} from "@/components/ui/icons";
import { pisciculturePage } from "@/lib/content";
import { prisma } from "@/lib/prisma";
import { formatProductPrice } from "@/lib/products";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: pisciculturePage.metaTitle,
  description: pisciculturePage.metaDescription,
};

function TitleLine({ line }: { line: string }) {
  const emphasis = pisciculturePage.hero.titleEmphasis;
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

const featureIcons: Record<string, ComponentType<{ size?: number; className?: string }>> = {
  check: CheckIcon,
  feedbag: FeedBagIcon,
  cycle: CycleIcon,
  lock: LockIcon,
  fish: FishIcon,
};

export default async function PisciculturePage() {
  const { hero, overview, features, pricing, stats, cta } = pisciculturePage;

  const pricingItems = await prisma.product.findMany({
    where: { category: "poissons", deletedAt: null, isPublished: true },
    orderBy: [{ sortOrder: "asc" }, { name: "asc" }],
  });

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
                href="/tarifs"
                className="btn border-[1.5px] border-white/30 bg-white/10 text-white backdrop-blur-sm hover:border-white hover:bg-white/20"
              >
                Voir tous les tarifs
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

      {/* ── Overview (présentation de la pisciculture) ── */}
      <section className="bg-brand-50 py-[76px] nav:py-[110px]">
        <div className="shell grid items-center gap-16 nav:grid-cols-[1.1fr_0.9fr]">
          <Reveal>
            <span className="eyebrow">{overview.eyebrow}</span>
            <h2 className="mt-[14px] text-[clamp(28px,3.6vw,38px)]">
              {overview.title}
            </h2>

            {overview.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mb-[18px] mt-[18px] text-base text-ink-700"
              >
                {paragraph}
              </p>
            ))}

            <ul className="mt-[30px] flex flex-wrap gap-3">
              {overview.tags.map((tag) => (
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

          <Reveal delay={0.16} className="relative mx-auto w-full max-w-[420px] nav:mx-0 nav:max-w-none">
            <div
              aria-hidden="true"
              className="hero-blob absolute -top-[8%] -left-[14%] z-0 h-[120%] w-[120%] bg-brand-600 opacity-95"
            />
            <div className="relative z-[1] aspect-[4/4.6] overflow-hidden rounded-pvs-lg bg-gradient-to-br from-brand-500 to-brand-700 shadow-float">
              <Image
                src={overview.imageSrc}
                alt={overview.imageAlt}
                fill
                sizes="(max-width: 900px) 420px, 40vw"
                className="object-cover"
              />
            </div>
          </Reveal>
        </div>
      </section>

      {/* ── Produits piscicoles (layout alterné) ── */}
      <section className="bg-white py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal className="mb-14 text-center">
            <span className="eyebrow">{overview.eyebrow}</span>
            <h2 className="mt-[14px] text-[clamp(28px,3.6vw,38px)]">
              Nos produits de pisciculture
            </h2>
          </Reveal>

          <div className="flex flex-col gap-20 nav:gap-28">
            {overview.products.map((product, index) => {
              const reversed = index % 2 === 1;
              return (
                <Reveal key={product.name}>
                  <div className="grid items-center gap-10 nav:grid-cols-2 nav:gap-16">
                    <div
                      className={`relative aspect-[4/3] overflow-hidden rounded-pvs-lg bg-brand-100 shadow-float ${
                        reversed ? "nav:order-2" : ""
                      }`}
                    >
                      <Image
                        src={product.imageSrc}
                        alt={product.imageAlt}
                        fill
                        sizes="(max-width: 900px) 90vw, 45vw"
                        className="object-cover"
                      />
                    </div>

                    <div className={reversed ? "nav:order-1" : ""}>
                      <span className="font-serif text-[15px] font-bold text-gold-600">
                        {String(index + 1).padStart(2, "0")}
                      </span>
                      <h3 className="mt-3 text-[clamp(22px,2.8vw,30px)] font-bold text-brand-900">
                        {product.name}
                      </h3>
                      <p className="mt-4 text-[15.5px] leading-[1.7] text-ink-700">
                        {product.description}
                      </p>
                    </div>
                  </div>
                </Reveal>
              );
            })}
          </div>
        </div>
      </section>

      {/* ── Pratiques piscicoles ── */}
      <section className="bg-white py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal>
            <SectionHead
              eyebrow={features.eyebrow}
              title={features.title}
              subtitle={features.subtitle}
              center
            />
          </Reveal>

          <ul className="grid grid-cols-1 gap-5 mid:grid-cols-2 nav:grid-cols-3">
            {features.items.map((item, index) => {
              const Icon = featureIcons[item.icon] ?? CheckIcon;
              return (
                <Reveal
                  key={item.title}
                  as="li"
                  delay={index * 0.08}
                  className="rounded-pvs border border-line bg-white px-[22px] py-8 transition-all duration-[350ms] ease-pvs hover:-translate-y-1.5 hover:bg-brand-50 hover:shadow-card"
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

      {/* ── Grille des prix ── */}
      <section className="bg-brand-900 py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal className="mx-auto mb-14 max-w-[640px] text-center">
            <span className="eyebrow text-gold-500 before:bg-gold-500">
              {pricing.eyebrow}
            </span>
            <h2 className="mt-[14px] text-[clamp(28px,3.6vw,38px)] text-white">
              {pricing.title}
            </h2>
            <p className="mt-4 text-[15px] text-white/70">{pricing.subtitle}</p>
          </Reveal>

          <div className="grid grid-cols-1 gap-6 mid:grid-cols-2 nav:grid-cols-4">
            {pricingItems.map((item, index) => (
              <Reveal
                key={item.id}
                delay={index * 0.08}
                className="group overflow-hidden rounded-pvs-lg border border-white/10 bg-white/[0.06] backdrop-blur-sm transition-all duration-[350ms] ease-pvs hover:-translate-y-1.5 hover:border-white/20 hover:bg-white/[0.1]"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-800">
                  <Image
                    src={item.imageSrc}
                    alt={item.imageAlt}
                    fill
                    sizes="(max-width: 900px) 90vw, 25vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                  {item.badge && (
                    <span className="absolute top-3 right-3 rounded-full bg-gold-500 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.04em] text-brand-900">
                      {item.badge}
                    </span>
                  )}
                </div>

                <div className="px-5 py-6">
                  <h3 className="mb-1.5 text-[16px] font-bold text-white">
                    {item.name}
                  </h3>
                  <p className="mb-4 text-[13px] leading-[1.55] text-white/60">
                    {item.description}
                  </p>

                  <div className="flex items-end justify-between border-t border-white/10 pt-4">
                    <div>
                      <span className="block font-serif text-[20px] font-bold text-gold-500">
                        {formatProductPrice(item)}
                      </span>
                      {item.unit && (
                        <span className="text-[12px] text-white/50">
                          {item.unit}
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </Reveal>
            ))}
          </div>

          <div className="mt-12 text-center">
            <Link href="/tarifs" className="btn btn-gold">
              Voir tous nos tarifs
            </Link>
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
