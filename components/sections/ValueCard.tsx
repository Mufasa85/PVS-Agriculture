"use client";

import Image from "next/image";
import { motion, useReducedMotion } from "framer-motion";
import { CategoryIcon } from "@/components/admin/CategoryIcon";
import type { ValueProp } from "@/lib/types";

type ValueCardProps = {
  item: ValueProp;
  index: number;
  variant: "large" | "small" | "wide";
};

/**
 * Carte de valeur pour la section "Nos engagements" de la page À propos.
 *
 * Bento grid : la carte "large" (2×2) contient une image avec parallax,
 * les cartes "small" (1×1) et "wide" (2×1) sont textuelles avec icône.
 *
 * Décisions d'animation (animate skill) :
 * - Fréquence : occasionnelle (page À propos visitée rarement) → budget delight
 * - But : state indication (entrée au scroll) + feedback (hover)
 * - Outil : Framer Motion whileInView (scroll reveal) + CSS hover
 * - Propriétés : transform + opacity uniquement (GPU)
 * - Easing : cubic-bezier(0.16, 0.8, 0.24, 1) — strong ease-out
 * - Durée : 500ms (page marketing, peut dépasser 300ms)
 * - Stagger : 60ms entre cartes
 * - Hover : -translate-y + shadow, image zoom (large uniquement)
 * - Active : scale(0.97)
 * - Reduced motion : fade seul, pas de transform
 */
export default function ValueCard({
  item,
  index,
  variant,
}: ValueCardProps) {
  const reduceMotion = useReducedMotion();
  const isLarge = variant === "large";

  const initial = reduceMotion
    ? { opacity: 0 }
    : { opacity: 0, transform: "translateY(24px)" };

  const animate = reduceMotion
    ? { opacity: 1 }
    : { opacity: 1, transform: "translateY(0px)" };

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 0.8, 0.24, 1],
      }}
      className={
        isLarge
          ? "nav:col-span-2 nav:row-span-2"
          : variant === "wide"
            ? "nav:col-span-2"
            : ""
      }
    >
      <div
        className={`group relative h-full overflow-hidden rounded-pvs-lg border border-line bg-white transition-[transform,box-shadow] duration-200 ease-out active:scale-[0.97] hover:-translate-y-1.5 hover:shadow-card ${
          isLarge ? "flex flex-col" : "px-[22px] py-8"
        }`}
      >
        {isLarge && item.imageSrc ? (
          <>
            {/* Image avec parallax subtil au survol */}
            <div className="relative aspect-[16/10] overflow-hidden bg-brand-100 nav:flex-1">
              <Image
                src={item.imageSrc}
                alt={item.imageAlt ?? item.title}
                fill
                sizes="(max-width: 768px) 90vw, 66vw"
                className={`object-cover transition-transform duration-500 ease-out ${
                  reduceMotion ? "" : "group-hover:scale-105"
                }`}
              />
              {/* Overlay dégradé pour la lisibilité */}
              <div className="absolute inset-0 bg-gradient-to-t from-brand-900/70 via-brand-900/20 to-transparent" />

              {/* Tag en overlay sur l'image */}
              <span className="absolute left-5 top-5 rounded-full bg-white/90 px-3.5 py-1.5 text-[12px] font-bold uppercase tracking-[0.04em] text-brand-700 backdrop-blur-sm">
                {item.tag}
              </span>
            </div>

            {/* Contenu sous l'image */}
            <div className="px-[26px] py-7">
              <h4 className="mb-2.5 text-[clamp(18px,2vw,22px)] font-bold leading-[1.3] text-brand-900">
                {item.title}
              </h4>
              <p className="text-[14px] leading-[1.6] text-ink-500">
                {item.description}
              </p>
            </div>
          </>
        ) : (
          <>
            {/* Icône */}
            {item.icon && (
              <span className="mb-[18px] flex h-12 w-12 items-center justify-center rounded-full bg-brand-100 text-brand-700">
                <CategoryIcon icon={item.icon} size={22} />
              </span>
            )}

            <span className="mb-2 block text-[12px] font-bold uppercase tracking-[0.04em] text-gold-600">
              {item.tag}
            </span>
            <h4 className="mb-2 text-[16.5px] font-bold leading-[1.3] text-brand-900">
              {item.title}
            </h4>
            <p className="text-[13.5px] leading-[1.55] text-ink-500">
              {item.description}
            </p>
          </>
        )}
      </div>
    </motion.div>
  );
}
