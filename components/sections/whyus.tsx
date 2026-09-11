import {
  BadgeCheck,
  HandHeart,
  Headphones,
  Layers,
  ShieldCheck,
  Sparkles,
  type LucideIcon,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import SectionHead from "@/components/ui/SectionHead";
import { pourquoiNousChoisir } from "@/lib/content";

const itemIcons: LucideIcon[] = [
  ShieldCheck,
  BadgeCheck,
  Layers,
  HandHeart,
  Headphones,
];

const accentGradients = [
  "from-brand-500 to-brand-700",
  "from-gold-500 to-amber-600",
  "from-emerald-500 to-teal-600",
  "from-brand-600 to-indigo-600",
  "from-rose-500 to-pink-600",
];

export default function PourquoiNousChoisir() {
  return (
    <section className="relative overflow-hidden bg-white py-[76px] nav:py-[110px]">
      {/* Halo décoratif */}
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-32 right-0 h-[420px] w-[420px] rounded-full bg-brand-50 blur-[100px]"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -bottom-40 -left-20 h-[380px] w-[380px] rounded-full bg-gold-500/5 blur-[100px]"
      />

      <div className="shell relative">
        <Reveal>
          <SectionHead
            eyebrow={pourquoiNousChoisir.eyebrow}
            title={pourquoiNousChoisir.title}
            center
          />
        </Reveal>

        <ul className="grid grid-cols-1 gap-5 mid:grid-cols-2 nav:grid-cols-3 wide:grid-cols-5">
          {pourquoiNousChoisir.items.map((item, index) => {
            const Icon = itemIcons[index] ?? Sparkles;
            const gradient = accentGradients[index] ?? accentGradients[0];
            return (
              <Reveal
                key={item.tag}
                as="li"
                delay={index * 0.08}
                className="group relative flex flex-col overflow-hidden rounded-pvs border border-line bg-white p-[22px] pt-7 transition-all duration-[350ms] ease-pvs hover:-translate-y-1.5 hover:border-transparent hover:shadow-card"
              >
                {/* Numéro fantôme */}
                <span
                  aria-hidden="true"
                  className="pointer-events-none absolute right-3 top-1 font-serif text-[44px] font-bold leading-none text-brand-50 transition-colors duration-[350ms] group-hover:text-brand-100"
                >
                  {String(index + 1).padStart(2, "0")}
                </span>

                {/* Icône dans un cercle gradient */}
                <span
                  className={`relative mb-5 flex h-12 w-12 items-center justify-center rounded-[14px] bg-gradient-to-br ${gradient} text-white shadow-sm transition-transform duration-[350ms] ease-pvs group-hover:scale-110 group-hover:rotate-[-4deg]`}
                >
                  <Icon size={22} strokeWidth={2} />
                  {/* Lueur derrière l'icône */}
                  <span
                    aria-hidden="true"
                    className={`absolute inset-0 rounded-[14px] bg-gradient-to-br ${gradient} opacity-0 blur-md transition-opacity duration-[350ms] group-hover:opacity-40`}
                  />
                </span>

                {/* Tag */}
                <span className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-gold-600">
                  {item.tag}
                </span>

                <h4 className="mb-2 text-[16.5px] font-bold text-brand-900">
                  {item.title}
                </h4>
                <p className="text-[13.5px] leading-[1.6] text-ink-500">
                  {item.description}
                </p>

                {/* Barre d'accent qui se déploie au hover */}
                <span
                  aria-hidden="true"
                  className={`mt-5 block h-[3px] w-0 rounded-full bg-gradient-to-r ${gradient} transition-all duration-[400ms] ease-pvs group-hover:w-full`}
                />
              </Reveal>
            );
          })}
        </ul>
      </div>
    </section>
  );
}
