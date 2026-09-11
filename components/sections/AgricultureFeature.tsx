import Image from "next/image";
import {
  AlignCenter,
  Check,
  Leaf,
  Lock,
  RefreshCw,
  Warehouse,
  type LucideIcon,
} from "lucide-react";

import Reveal from "@/components/ui/Reveal";
import { agricultureFeature } from "@/lib/content";

/** Icônes dans l'ordre des `points` de la maquette. */
const pointIcons: LucideIcon[] = [
  Warehouse,
  Leaf,
  Lock,
  Check,
  RefreshCw,
  AlignCenter,
];

export default function AgricultureFeature() {
  return (
    <section id="agriculture" className="relative bg-brand-900 text-white">
      <div className="shell pb-[110px] pt-5">
        <Reveal className="mb-14 max-w-[640px]">
          <span className="eyebrow text-gold-500 before:bg-gold-500">
            {agricultureFeature.eyebrow}
          </span>
          <h2 className="mt-[14px] text-[clamp(30px,4vw,44px)] text-white">
            {agricultureFeature.title}
          </h2>
        </Reveal>

        <div className="mt-5 grid items-center gap-16 nav:grid-cols-[0.9fr_1.1fr]">
          <Reveal className="relative aspect-[5/6] overflow-hidden rounded-pvs-lg bg-gradient-to-br from-brand-700 to-brand-500 shadow-img-dark">
            <Image
              src={agricultureFeature.imageSrc}
              alt={agricultureFeature.imageAlt}
              fill
              sizes="(max-width: 900px) 90vw, 40vw"
              className="object-cover"
            />
          </Reveal>

          <Reveal delay={0.16}>
            <p className="mb-[38px] max-w-[520px] text-[17px] text-muted-light nav:mb-[34px]">
              {agricultureFeature.paragraph}
            </p>

            <ul className="grid gap-[30px] nav:grid-cols-2 nav:gap-x-7 nav:gap-y-[22px]">
              {agricultureFeature.points.map((point, index) => {
                const Icon = pointIcons[index] ?? Warehouse;
                return (
                  <li
                    key={point.title}
                    className="flex items-center gap-[14px] nav:items-start"
                  >
                    <span className="flex h-11 w-11 shrink-0 items-center justify-center rounded-[11px] border border-white/[0.14] bg-white/[0.08] text-gold-500 nav:h-10 nav:w-10">
                      <Icon size={20} />
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
  );
}
