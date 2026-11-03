import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

import Footer from "@/components/layout/Footer";
import ConsentManager from "@/components/layout/ConsentManager";
import Reveal from "@/components/ui/Reveal";
import { confidentialitePage } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: confidentialitePage.metaTitle,
  description: confidentialitePage.metaDescription,
  path: "/confidentialite",
});

/** Entrées du sommaire — une par section, dans l'ordre de lecture. */
const SUMMARY = [
  { id: "donnees", label: "Ce que nous collectons" },
  { id: "choix", label: "Votre choix" },
  { id: "acces", label: "Qui y a accès" },
  { id: "securite", label: "Protection" },
  { id: "ecrire", label: "Nous écrire" },
];

export default function ConfidentialitePage() {
  const { hero, intro, keyFacts, data, choices, privacy, contact, cta } =
    confidentialitePage;

  return (
    <>
      {/* ── Hero ── */}
      <section className="relative flex min-h-[42vh] items-center justify-center overflow-hidden">
        <Image
          src={hero.imageSrc}
          alt={hero.imageAlt}
          fill
          priority
          sizes="100vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-brand-900/70" />

        <div className="shell relative z-[1] py-[110px] text-center">
          <Reveal className="mx-auto max-w-[640px]">
            <span className="eyebrow text-gold-500 before:bg-gold-500">
              {hero.eyebrow}
            </span>
            <h1 className="mt-[18px] text-[clamp(32px,4.8vw,50px)] font-bold text-white">
              {hero.title}
            </h1>
            <p className="mx-auto mt-[20px] max-w-[560px] text-[17px] leading-[1.7] text-white/80">
              {hero.paragraph}
            </p>

            <p className="mt-6 inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-[12.5px] font-semibold uppercase tracking-[0.06em] text-white/75">
              {hero.updatedLabel} : {hero.updatedAt}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Résumé ── */}
      <section className="bg-white pb-[60px] pt-[60px] nav:pb-[88px] nav:pt-[88px]">
        <div className="shell">
          <Reveal className="mx-auto max-w-[780px]">
            <h2 className="text-[clamp(24px,3vw,32px)] font-bold text-brand-900">
              {intro.title}
            </h2>
            {intro.paragraphs.map((paragraph) => (
              <p
                key={paragraph}
                className="mt-4 text-[15.5px] leading-[1.75] text-ink-700"
              >
                {paragraph}
              </p>
            ))}
          </Reveal>

          {/* Points clés */}
          <Reveal delay={0.12} className="mt-10">
            <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-pvs-lg border border-line bg-line nav:grid-cols-3">
              {keyFacts.map((fact) => (
                <div key={fact.label} className="bg-brand-50 px-5 py-5">
                  <dt className="text-[11px] font-bold uppercase tracking-[0.07em] text-brand-600">
                    {fact.label}
                  </dt>
                  <dd className="mt-1.5 text-[13.5px] font-semibold leading-[1.5] text-brand-900">
                    {fact.value}
                  </dd>
                </div>
              ))}
            </dl>
          </Reveal>
        </div>
      </section>

      {/* ── Sommaire + contenu ── */}
      <section className="bg-brand-50 py-[60px] nav:py-[88px]">
        <div className="shell">
          <div className="flex flex-col gap-8 nav:grid nav:grid-cols-[210px_1fr] nav:gap-14">
            {/* Sommaire (sticky sur desktop) */}
            <nav aria-label="Sommaire de la politique">
              <Reveal className="nav:sticky nav:top-[110px]">
                <p className="mb-4 text-[11.5px] font-bold uppercase tracking-[0.1em] text-ink-500">
                  Sommaire
                </p>
                <ol className="flex flex-col gap-2.5">
                  {SUMMARY.map((entry) => (
                    <li key={entry.id}>
                      <a
                        href={`#${entry.id}`}
                        className="text-[13.5px] leading-[1.5] text-ink-700 transition-colors hover:text-brand-600 hover:underline hover:underline-offset-2"
                      >
                        {entry.label}
                      </a>
                    </li>
                  ))}
                </ol>
              </Reveal>
            </nav>

            <div className="flex flex-col gap-10">
              {/* 1 — Ce que nous collectons */}
              <section id="donnees" className="scroll-mt-[110px]">
                <Reveal>
                  <span className="eyebrow">{data.eyebrow}</span>
                  <h2 className="mt-[12px] text-[clamp(21px,2.5vw,27px)] font-bold tracking-[-0.01em] text-brand-900">
                    {data.title}
                  </h2>
                  <p className="mt-3 text-[15px] leading-[1.75] text-ink-700">
                    {data.paragraph}
                  </p>

                  <div className="mt-6">
                    <div className="overflow-visible mid:overflow-x-auto">
                      <table className="pvs-table w-full min-w-0 border-collapse text-left mid:min-w-[600px]">
                        <thead>
                          <tr>
                            {data.table.head.map((cell) => (
                              <th
                                key={cell}
                                scope="col"
                                className="border-b-2 border-brand-200 px-3 py-3 text-[11.5px] font-bold uppercase tracking-[0.05em] text-brand-700 first:pl-0 last:pr-0"
                              >
                                {cell}
                              </th>
                            ))}
                          </tr>
                        </thead>
                        <tbody>
                          {data.table.rows.map((row, rowIndex) => (
                            <tr
                              key={row.join("|")}
                              className={
                                rowIndex % 2 === 1 ? "bg-white/70" : ""
                              }
                            >
                              {row.map((cell, cellIndex) => (
                                <td
                                  key={cell}
                                  data-label={data.table.head[cellIndex]}
                                  className={`border-b border-line px-3 py-3.5 text-[13.5px] leading-[1.6] text-ink-700 first:pl-0 last:pr-0 ${
                                    cellIndex === 0
                                      ? "font-semibold text-brand-900"
                                      : ""
                                  }`}
                                >
                                  {cell}
                                </td>
                              ))}
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  </div>

                  <p className="mt-5 rounded-pvs-lg border-l-[3px] border-gold-500 bg-white px-5 py-4 text-[13.5px] leading-[1.7] text-ink-700">
                    {data.note}
                  </p>
                </Reveal>
              </section>

              {/* 2 — Votre choix */}
              <section id="choix" className="scroll-mt-[110px]">
                <Reveal>
                  <span className="eyebrow">{choices.eyebrow}</span>
                  <h2 className="mt-[12px] text-[clamp(21px,2.5vw,27px)] font-bold tracking-[-0.01em] text-brand-900">
                    {choices.title}
                  </h2>
                  {choices.paragraphs.map((paragraph) => (
                    <p
                      key={paragraph}
                      className="mt-3 text-[15px] leading-[1.75] text-ink-700"
                    >
                      {paragraph}
                    </p>
                  ))}

                  <ul className="mt-6 flex flex-col gap-3">
                    {choices.bullets.map((bullet) => (
                      <li
                        key={bullet}
                        className="flex gap-3 text-[14px] leading-[1.7] text-ink-700"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-[9px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                        />
                        <span>{bullet}</span>
                      </li>
                    ))}
                  </ul>

                  {/* Retrait du consentement à tout moment */}
                  <ConsentManager />
                </Reveal>
              </section>

              {/* 3 + 4 — Destinataires et sécurité, côte à côte */}
              <div className="grid grid-cols-1 gap-6 mid:grid-cols-2">
                <section id="acces" className="scroll-mt-[110px]">
                  <Reveal>
                    <div className="h-full rounded-pvs-lg border border-line bg-white p-6">
                      <h2 className="text-[17px] font-bold text-brand-900">
                        {privacy.recipients.title}
                      </h2>
                      {privacy.recipients.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="mt-3 text-[14px] leading-[1.7] text-ink-700"
                        >
                          {paragraph}
                        </p>
                      ))}
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {privacy.recipients.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-3 text-[13.5px] leading-[1.65] text-ink-500"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </section>

                <section id="securite" className="scroll-mt-[110px]">
                  <Reveal delay={0.08}>
                    <div className="h-full rounded-pvs-lg border border-line bg-white p-6">
                      <h2 className="text-[17px] font-bold text-brand-900">
                        {privacy.security.title}
                      </h2>
                      {privacy.security.paragraphs.map((paragraph) => (
                        <p
                          key={paragraph}
                          className="mt-3 text-[14px] leading-[1.7] text-ink-700"
                        >
                          {paragraph}
                        </p>
                      ))}
                      <ul className="mt-4 flex flex-col gap-2.5">
                        {privacy.security.bullets.map((bullet) => (
                          <li
                            key={bullet}
                            className="flex gap-3 text-[13.5px] leading-[1.65] text-ink-500"
                          >
                            <span
                              aria-hidden="true"
                              className="mt-[8px] h-1.5 w-1.5 shrink-0 rounded-full bg-gold-500"
                            />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </Reveal>
                </section>
              </div>

              {/* 5 — Nous écrire */}
              <section id="ecrire" className="scroll-mt-[110px]">
                <Reveal>
                  <div className="rounded-pvs-lg border border-line bg-white p-6 nav:p-8">
                    <h2 className="text-[clamp(21px,2.5vw,27px)] font-bold tracking-[-0.01em] text-brand-900">
                      {contact.title}
                    </h2>
                    {contact.paragraphs.map((paragraph) => (
                      <p
                        key={paragraph}
                        className="mt-3 max-w-[760px] text-[14.5px] leading-[1.75] text-ink-700"
                      >
                        {paragraph}
                      </p>
                    ))}

                    <ul className="mt-6 flex flex-col gap-3 mid:flex-row">
                      {contact.channels.map((channel) => (
                        <li
                          key={channel.label}
                          className="flex-1 rounded-[12px] bg-brand-50 px-4 py-3.5"
                        >
                          <span className="block text-[11px] font-bold uppercase tracking-[0.07em] text-brand-600">
                            {channel.label}
                          </span>
                          {channel.href ? (
                            <a
                              href={channel.href}
                              className="mt-1 block text-[14px] font-bold text-brand-900 transition-colors hover:text-brand-600"
                            >
                              {channel.value}
                            </a>
                          ) : (
                            <span className="mt-1 block text-[14px] font-bold leading-[1.5] text-brand-900">
                              {channel.value}
                            </span>
                          )}
                        </li>
                      ))}
                    </ul>

                    <p className="mt-5 text-[13px] leading-[1.7] text-ink-500">
                      {contact.note}
                    </p>

                    {/* Cadre juridique */}
                    <div className="mt-6 border-t border-line pt-5">
                      <p className="text-[11px] font-bold uppercase tracking-[0.08em] text-brand-600">
                        {contact.legalTitle}
                      </p>
                      <p className="mt-2 text-[12.5px] leading-[1.7] text-ink-500">
                        {contact.legalText}
                      </p>
                    </div>
                  </div>
                </Reveal>
              </section>
            </div>
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="bg-brand-50 py-[60px] nav:py-[88px]">
        <div className="shell">
          <Reveal className="mx-auto max-w-[620px] text-center">
            <span className="eyebrow">{cta.eyebrow}</span>
            <h2 className="mt-[12px] text-[clamp(26px,3.6vw,38px)] tracking-[-0.01em]">
              {cta.title}
            </h2>
            <p className="mt-4 text-[16px] leading-[1.7] text-ink-500">
              {cta.text}
            </p>
            <Link href={cta.buttonHref} className="btn btn-primary mt-7">
              {cta.buttonLabel}
            </Link>
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
