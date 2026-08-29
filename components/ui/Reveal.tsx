"use client";

import { motion, useReducedMotion } from "framer-motion";
import type { ReactNode } from "react";

type RevealProps = {
  children: ReactNode;
  /** Délai d'apparition en secondes (équivalent des .reveal-delay-* de la maquette). */
  delay?: number;
  className?: string;
  as?: "div" | "section" | "li";
};

/**
 * Reproduit l'effet `.reveal` de la maquette (fade + translation verticale
 * déclenchée à l'entrée dans le viewport) avec Framer Motion.
 */
export default function Reveal({
  children,
  delay = 0,
  className,
  as = "div",
}: RevealProps) {
  const reduceMotion = useReducedMotion();
  const MotionTag = motion[as];

  if (reduceMotion) {
    const Tag = as;
    return <Tag className={className}>{children}</Tag>;
  }

  return (
    <MotionTag
      className={className}
      initial={{ opacity: 0, y: 28 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.15, margin: "0px 0px -60px 0px" }}
      transition={{ duration: 0.8, delay, ease: [0.16, 0.8, 0.24, 1] }}
    >
      {children}
    </MotionTag>
  );
}
