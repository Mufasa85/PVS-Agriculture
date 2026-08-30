import type { Metadata } from "next";
import Link from "next/link";

import Footer from "@/components/layout/Footer";
import TarifsFilter from "@/components/sections/TarifsFilter";
import Reveal from "@/components/ui/Reveal";
import { tarifsPage } from "@/lib/content";

export const metadata: Metadata = {
  title: tarifsPage.metaTitle,
  description: tarifsPage.metaDescription,
};

function TitleLine({ line }: { line: string }) {
  const emphasis = tarifsPage.hero.titleEmphasis;
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

export default function TarifsPage() {
  const { hero, info, cta } = tarifsPage;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white pb-[80px] pt-[140px] sm:pt-[168px]">
        <div className="shell text-center">
          <Reveal className="mx-auto max-w-[640px]">
            <span className="eyebrow">{hero.eyebrow}</span>

            <h1 className="mt-[18px] text-[clamp(36px,5.4vw,56px)] font-bold">
              {hero.titleLines.map((line, i) => (
                <span key={line} className="block">
                  <TitleLine line={line} />
                  {i < hero.titleLines.length - 1 ? " " : null}
                </span>
              ))}
            </h1>

            <p className="mx-auto mt-[22px] max-w-[560px] text-[17px] leading-[1.7] text-ink-700">
              {hero.paragraph}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Filtre + grille de produits ── */}
      <TarifsFilter />

      {/* ── Info ── */}
      <section className="bg-white py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal className="mx-auto max-w-[640px] text-center">
            <span className="eyebrow">{info.eyebrow}</span>
            <h2 className="mt-[14px] text-[clamp(26px,3.4vw,36px)]">
              {info.title}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-ink-500">
              {info.text}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-900 py-[76px] nav:py-[110px]">
        <div className="shell">
          <Reveal className="mx-auto max-w-[640px] text-center">
            <span className="eyebrow text-gold-500 before:bg-gold-500">
              {cta.eyebrow}
            </span>
            <h2 className="mt-[14px] text-[clamp(28px,3.6vw,38px)] text-white">
              {cta.title}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-white/70">
              {cta.text}
            </p>
            <Link href={cta.buttonHref} className="btn btn-gold mt-8">
              {cta.buttonLabel}
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
