"use client";

import { AnimatePresence, motion, useReducedMotion } from "framer-motion";
import Image from "next/image";
import { useEffect, useState } from "react";

type HeroImage = {
  src: string;
  alt: string;
};

/**
 * Carrousel d'images du hero : fond en fondu (crossfade) qui alterne
 * entre nos différentes activités (agriculture, élevage, pisciculture, porcherie).
 */
export default function HeroImageCarousel({ images }: { images: HeroImage[] }) {
  const [index, setIndex] = useState(0);
  const reduceMotion = useReducedMotion();

  useEffect(() => {
    if (reduceMotion || images.length <= 1) return;
    const interval = setInterval(() => {
      setIndex((current) => (current + 1) % images.length);
    }, 4500);
    return () => clearInterval(interval);
  }, [images.length, reduceMotion]);

  const current = images[index];

  return (
    <div className="relative h-full w-full">
      <AnimatePresence mode="sync">
        <motion.div
          key={current.src}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 1.1, ease: "easeInOut" }}
          className="absolute inset-0"
        >
          <Image
            src={current.src}
            alt={current.alt}
            fill
            priority={index === 0}
            sizes="(max-width: 900px) 420px, 45vw"
            className="object-cover"
          />
        </motion.div>
      </AnimatePresence>

      {images.length > 1 && (
        <div className="absolute bottom-4 left-1/2 z-[2] flex -translate-x-1/2 gap-1.5">
          {images.map((image, i) => (
            <span
              key={image.src}
              className={`h-1.5 rounded-full transition-all duration-300 ${
                i === index ? "w-6 bg-white" : "w-1.5 bg-white/50"
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}
