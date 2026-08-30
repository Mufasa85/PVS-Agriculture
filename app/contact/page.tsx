import type { Metadata } from "next";
import Link from "next/link";

import ContactForm from "@/components/sections/ContactForm";
import Footer from "@/components/layout/Footer";
import Reveal from "@/components/ui/Reveal";
import { contact } from "@/lib/content";

export const metadata: Metadata = {
  title: "Contact — PVS ONGD ASBL",
  description:
    "Contactez PVS ONGD ASBL : téléphone, email, WhatsApp ou formulaire en ligne. Notre équipe vous répond rapidement pour vos besoins en agriculture, élevage, pisciculture et produits pour animaux.",
};

export default function ContactPage() {
  return (
    <>
      {/* ── Hero ── */}
      <section className="relative overflow-hidden bg-gradient-to-b from-brand-50 to-white pb-[60px] pt-[140px] sm:pt-[168px]">
        <div className="shell text-center">
          <Reveal className="mx-auto max-w-[640px]">
            <span className="eyebrow">{contact.eyebrow}</span>
            <h1 className="mt-[18px] text-[clamp(36px,5.4vw,56px)] font-bold">
              {contact.title}
            </h1>
            <p className="mx-auto mt-[22px] max-w-[560px] text-[17px] leading-[1.7] text-ink-700">
              {contact.subtitle}
            </p>
          </Reveal>
        </div>
      </section>

      {/* ── Contact : infos + formulaire ── */}
      <section className="bg-white pb-[76px] pt-0 nav:pb-[110px]">
        <div className="shell grid gap-12 nav:grid-cols-[0.85fr_1.15fr] nav:gap-16">
          {/* Infos de contact */}
          <Reveal>
            <h2 className="text-[clamp(22px,2.6vw,28px)] font-bold text-brand-900">
              Nos coordonnées
            </h2>
            <p className="mt-3 text-[15px] text-ink-500">
              Plusieurs moyens pour nous joindre. Choisissez celui qui vous convient le mieux.
            </p>

            <ul className="mt-8 flex flex-col gap-6">
              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-brand-100 text-brand-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M22 16.92v3a2 2 0 01-2.18 2 19.79 19.79 0 01-8.63-3.07 19.5 19.5 0 01-6-6 19.79 19.79 0 01-3.07-8.67A2 2 0 014.11 2h3a2 2 0 012 1.72c.13.96.36 1.9.7 2.81a2 2 0 01-.45 2.11L8.09 9.91a16 16 0 006 6l1.27-1.27a2 2 0 012.11-.45c.91.34 1.85.57 2.81.7A2 2 0 0122 16.92z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <span className="block text-[13px] font-bold uppercase tracking-[0.04em] text-ink-500">
                    Téléphone
                  </span>
                  <Link
                    href={contact.phoneHref}
                    className="text-[16px] font-bold text-brand-900 hover:text-brand-600"
                  >
                    {contact.phone}
                  </Link>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-brand-100 text-brand-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <path
                      d="M22 6l-10 7L2 6"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    />
                  </svg>
                </span>
                <div>
                  <span className="block text-[13px] font-bold uppercase tracking-[0.04em] text-ink-500">
                    Email
                  </span>
                  <Link
                    href={`mailto:${contact.email}`}
                    className="text-[16px] font-bold text-brand-900 hover:text-brand-600"
                  >
                    {contact.email}
                  </Link>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-brand-100 text-brand-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <path
                      d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0118 0z"
                      stroke="currentColor"
                      strokeWidth="1.6"
                    />
                    <circle cx="12" cy="10" r="3" stroke="currentColor" strokeWidth="1.6" />
                  </svg>
                </span>
                <div>
                  <span className="block text-[13px] font-bold uppercase tracking-[0.04em] text-ink-500">
                    Adresse
                  </span>
                  <span className="text-[16px] font-bold text-brand-900">
                    {contact.address}
                  </span>
                </div>
              </li>

              <li className="flex items-start gap-4">
                <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] bg-brand-100 text-brand-700">
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
                    <circle cx="12" cy="12" r="9" stroke="currentColor" strokeWidth="1.6" />
                    <path
                      d="M12 7v5l3 2"
                      stroke="currentColor"
                      strokeWidth="1.6"
                      strokeLinecap="round"
                    />
                  </svg>
                </span>
                <div>
                  <span className="block text-[13px] font-bold uppercase tracking-[0.04em] text-ink-500">
                    Horaires
                  </span>
                  <span className="text-[16px] font-bold text-brand-900">
                    {contact.hours}
                  </span>
                </div>
              </li>
            </ul>

            <div className="mt-8 flex flex-wrap gap-3">
              <Link
                href={contact.whatsappHref}
                target="_blank"
                rel="noopener noreferrer"
                className="btn btn-primary"
              >
                WhatsApp
              </Link>
              <Link
                href={contact.phoneHref}
                className="btn btn-ghost"
              >
                Appeler
              </Link>
            </div>
          </Reveal>

          {/* Formulaire */}
          <Reveal delay={0.16}>
            <ContactForm />
          </Reveal>
        </div>
      </section>

      <Footer />
    </>
  );
}
