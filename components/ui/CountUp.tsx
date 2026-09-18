"use client";

import { useEffect, useRef, useState } from "react";
import { useReducedMotion } from "framer-motion";

type CountUpProps = {
  /** Valeur finale (nombre). */
  to: number;
  /** Durée de l'animation en secondes. */
  duration?: number;
  /** Préfixe affiché avant la valeur (ex: "+", ">"). */
  prefix?: string;
  /** Suffixe affiché après la valeur (ex: "%", " ans"). */
  suffix?: string;
  /** Nombre de décimales. */
  decimals?: number;
  /** Délai avant le démarrage (en secondes). */
  delay?: number;
  className?: string;
};

/**
 * Compteur animé qui s'incrémente quand l'élément entre dans le viewport.
 * Utilise un easing ease-out pour que les chiffres ralentissent à l'approche
 * de la valeur finale — plus naturel qu'un compte linéaire.
 *
 * Respecte `prefers-reduced-motion` : affiche la valeur finale immédiatement.
 */
export default function CountUp({
  to,
  duration = 1.4,
  prefix = "",
  suffix = "",
  decimals = 0,
  delay = 0,
  className,
}: CountUpProps) {
  const ref = useRef<HTMLSpanElement>(null);
  const [value, setValue] = useState(0);
  const [hasAnimated, setHasAnimated] = useState(false);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion) {
      setValue(to);
      setHasAnimated(true);
      return;
    }

    const el = ref.current;
    if (!el) return;

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting && !hasAnimated) {
          setHasAnimated(true);
          const startTime = performance.now() + delay * 1000;
          const animate = (now: number) => {
            if (now < startTime) {
              requestAnimationFrame(animate);
              return;
            }
            const elapsed = (now - startTime) / (duration * 1000);
            if (elapsed >= 1) {
              setValue(to);
              return;
            }
            // ease-out cubic : ralentit vers la fin
            const eased = 1 - Math.pow(1 - elapsed, 3);
            setValue(to * eased);
            requestAnimationFrame(animate);
          };
          requestAnimationFrame(animate);
        }
      },
      { threshold: 0.4 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [to, duration, delay, hasAnimated, reduceMotion]);

  const formatted = value.toLocaleString("fr-FR", {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals,
  });

  return (
    <span ref={ref} className={className}>
      {prefix}
      {formatted}
      {suffix}
    </span>
  );
}
