"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

/**
 * Badge « Agriculture d'abord » posé sur l'image du hero.
 * Reproduit l'animation `float` (translation verticale en boucle) de la maquette.
 */
export default function HeroFloatingBadge({
  children,
}: {
  children: ReactNode;
}) {
  const reduceMotion = useReducedMotion();

  return (
    <motion.div
      className="absolute right-1.5 top-[22px] z-[2] rounded-full bg-gold-500 px-[18px] py-2.5 text-[13px] font-bold text-brand-900 shadow-gold-pill sm:-right-4"
      animate={reduceMotion ? undefined : { y: [0, -10, 0] }}
      transition={{ duration: 5, repeat: Infinity, ease: "easeInOut" }}
    >
      {children}
    </motion.div>
  );
}
