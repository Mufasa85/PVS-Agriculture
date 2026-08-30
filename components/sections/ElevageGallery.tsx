"use client";

import { useCallback, useEffect, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion, useReducedMotion } from "framer-motion";

import { elevagePage } from "@/lib/content";

export default function ElevageGallery() {
  const { gallery } = elevagePage;
  const slides = gallery.slides;
  const [current, setCurrent] = useState(0);
  const [direction, setDirection] = useState(1);
  const reduceMotion = useReducedMotion();

  const goTo = useCallback(
    (index: number, dir: number) => {
      setDirection(dir);
      setCurrent((index + slides.length) % slides.length);
    },
    [slides.length],
  );

  const next = useCallback(
    () => goTo(current + 1, 1),
    [current, goTo],
  );

  const prev = useCallback(
    () => goTo(current - 1, -1),
    [current, goTo],
  );

  useEffect(() => {
    if (reduceMotion) return;
    const timer = window.setInterval(() => {
      setDirection(1);
      setCurrent((c) => (c + 1) % slides.length);
    }, 5000);
    return () => window.clearInterval(timer);
  }, [reduceMotion, slides.length]);

  return (
    <section className="bg-brand-900 py-[76px] nav:py-[110px]">
      <div className="shell">
        <div className="mx-auto mb-12 max-w-[640px] text-center">
          <span className="eyebrow text-gold-500 before:bg-gold-500">
            {gallery.eyebrow}
          </span>
          <h2 className="mt-[14px] text-[clamp(28px,3.6vw,38px)] text-white">
            {gallery.title}
          </h2>
          <p className="mt-4 text-[15px] text-white/70">{gallery.subtitle}</p>
        </div>

        <div className="relative mx-auto max-w-[900px]">
          <div className="relative aspect-[16/10] overflow-hidden rounded-pvs-lg bg-brand-800 shadow-float">
            <AnimatePresence mode="wait" custom={direction}>
              <motion.div
                key={current}
                custom={direction}
                initial={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: direction > 0 ? 60 : -60 }
                }
                animate={{ opacity: 1, x: 0 }}
                exit={
                  reduceMotion
                    ? { opacity: 0 }
                    : { opacity: 0, x: direction > 0 ? -60 : 60 }
                }
                transition={{ duration: 0.5, ease: [0.16, 0.8, 0.24, 1] }}
                className="absolute inset-0"
              >
                <Image
                  src={slides[current].src}
                  alt={slides[current].alt}
                  fill
                  sizes="(max-width: 900px) 90vw, 900px"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-brand-900/80 via-transparent to-transparent" />
                <span className="absolute bottom-5 left-5 rounded-full bg-white/15 px-4 py-2 text-[14px] font-bold text-white backdrop-blur-sm">
                  {slides[current].caption}
                </span>
              </motion.div>
            </AnimatePresence>
          </div>

          <button
            onClick={prev}
            aria-label="Image précédente"
            className="absolute top-1/2 left-3 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M15 18l-6-6 6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>
          <button
            onClick={next}
            aria-label="Image suivante"
            className="absolute top-1/2 right-3 z-[2] flex h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full bg-white/15 text-white backdrop-blur-sm transition-colors hover:bg-white/30"
          >
            <svg width="20" height="20" viewBox="0 0 24 24" fill="none">
              <path
                d="M9 18l6-6-6-6"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </svg>
          </button>

          <div className="mt-5 flex justify-center gap-2">
            {slides.map((slide, index) => (
              <button
                key={slide.src}
                onClick={() => goTo(index, index > current ? 1 : -1)}
                aria-label={`Aller à l'image ${index + 1}`}
                className={`h-2.5 rounded-full transition-all duration-300 ${
                  index === current
                    ? "w-8 bg-gold-500"
                    : "w-2.5 bg-white/30 hover:bg-white/50"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
