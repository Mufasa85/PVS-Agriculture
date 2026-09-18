"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef } from "react";
import { motion, useReducedMotion } from "framer-motion";
import { CategoryIcon } from "@/components/admin/CategoryIcon";

export type ExpertiseCardProps = {
  icon: string;
  title: string;
  description: string;
  href: string;
  imageSrc: string;
  imageAlt: string;
  index: number;
};

/**
 * Carte de domaine d'expertise avec image de fond, parallax subtil au
 * survol, et spring au clic.
 *
 * Décisions d'animation (animate skill) :
 * - Fréquence : occasionnelle (page À propos, visitée rarement) → budget delight
 * - But : feedback (le survol indique que la carte est cliquable)
 * - Outil : Framer Motion (spring pour le clic, pas de librairie pour le hover)
 * - Propriétés : transform uniquement (GPU)
 * - Easing : ease-out pour le hover, spring critically damped pour le clic
 * - Durée : 200ms pour le hover (sous 300ms)
 * - Reduced motion : pas de parallax, juste un fade
 */
export default function ExpertiseCard({
  icon,
  title,
  description,
  href,
  imageSrc,
  imageAlt,
  index,
}: ExpertiseCardProps) {
  const reduceMotion = useReducedMotion();
  const cardRef = useRef<HTMLAnchorElement>(null);

  return (
    <motion.div
      initial={reduceMotion ? { opacity: 0 } : { opacity: 0, transform: "translateY(24px)" }}
      whileInView={
        reduceMotion
          ? { opacity: 1 }
          : { opacity: 1, transform: "translateY(0px)" }
      }
      viewport={{ once: true, amount: 0.2, margin: "0px 0px -40px 0px" }}
      transition={{
        duration: 0.5,
        delay: index * 0.06,
        ease: [0.16, 0.8, 0.24, 1],
      }}
    >
      <Link
        ref={cardRef}
        href={href}
        className="group relative block h-full overflow-hidden rounded-pvs-lg border border-line bg-white shadow-sm transition-[transform,box-shadow] duration-200 ease-out active:scale-[0.97] hover:-translate-y-1.5 hover:shadow-card"
      >
        {/* Image avec parallax subtil au survol */}
        <div className="relative aspect-[4/3] overflow-hidden bg-brand-100">
          <Image
            src={imageSrc}
            alt={imageAlt}
            fill
            sizes="(max-width: 768px) 90vw, (max-width: 1280px) 33vw, 20vw"
            className={`object-cover transition-transform duration-500 ease-out ${
              reduceMotion ? "" : "group-hover:scale-105"
            }`}
          />
          {/* Overlay dégradé pour la lisibilité de l'icône */}
          <div className="absolute inset-0 bg-gradient-to-t from-brand-900/60 via-brand-900/10 to-transparent" />

          {/* Icône en bas à gauche sur l'image */}
          <span className="absolute bottom-3 left-3 flex h-11 w-11 items-center justify-center rounded-full bg-white/90 backdrop-blur-sm shadow-sm">
            <CategoryIcon icon={icon} size={20} />
          </span>
        </div>

        {/* Contenu */}
        <div className="px-[22px] py-6">
          <h4 className="mb-2 text-[17px] font-bold text-brand-900">
            {title}
          </h4>
          <p className="mb-4 text-[13.5px] leading-[1.55] text-ink-500">
            {description}
          </p>

          {/* Lien "Découvrir" avec flèche qui se déplace au survol */}
          <span className="flex items-center gap-1.5 text-[13px] font-bold text-brand-600 transition-colors duration-200 ease-out group-hover:text-brand-700">
            Découvrir
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              className="transition-transform duration-200 ease-out group-hover:translate-x-1"
              aria-hidden="true"
            >
              <path
                d="M5 12h14M13 6l6 6-6 6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </span>
        </div>
      </Link>
    </motion.div>
  );
}
