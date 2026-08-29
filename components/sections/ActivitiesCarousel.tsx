"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import type { ReactNode } from "react";

/**
 * Grille des activités : 3 colonnes en desktop, 2 sous 1080px, et carrousel
 * horizontal à scroll-snap avec pastilles sous 768px (comportement de script.js).
 */
export default function ActivitiesCarousel({
  children,
  count,
}: {
  children: ReactNode;
  count: number;
}) {
  const gridRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  const updateActiveDot = useCallback(() => {
    const grid = gridRef.current;
    if (!grid) return;

    const center = grid.scrollLeft + grid.clientWidth / 2;
    let closest = 0;
    let minDist = Infinity;

    Array.from(grid.children).forEach((child, index) => {
      const card = child as HTMLElement;
      const dist = Math.abs(card.offsetLeft + card.offsetWidth / 2 - center);
      if (dist < minDist) {
        minDist = dist;
        closest = index;
      }
    });

    setActiveIndex(closest);
  }, []);

  useEffect(() => {
    const grid = gridRef.current;
    if (!grid) return;

    let rafId: number | null = null;
    const onScroll = () => {
      if (rafId !== null) return;
      rafId = requestAnimationFrame(() => {
        updateActiveDot();
        rafId = null;
      });
    };

    grid.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      grid.removeEventListener("scroll", onScroll);
      if (rafId !== null) cancelAnimationFrame(rafId);
    };
  }, [updateActiveDot]);

  const scrollToCard = (index: number) => {
    const card = gridRef.current?.children[index] as HTMLElement | undefined;
    card?.scrollIntoView({
      behavior: "smooth",
      inline: "center",
      block: "nearest",
    });
  };

  return (
    <>
      <div
        ref={gridRef}
        className="-mx-5 flex snap-x snap-mandatory gap-[18px] overflow-x-auto px-5 pb-2.5 pt-1 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden cards:mx-0 cards:grid cards:snap-none cards:grid-cols-2 cards:gap-7 cards:overflow-visible cards:p-0 wide:grid-cols-3"
      >
        {children}
      </div>

      <div className="mt-[22px] flex items-center justify-center gap-[9px] cards:hidden">
        {Array.from({ length: count }).map((_, index) => (
          <button
            key={index}
            type="button"
            onClick={() => scrollToCard(index)}
            aria-label={`Aller à l'activité ${index + 1}`}
            className={`h-2 shrink-0 transition-all duration-300 ease-pvs ${
              index === activeIndex
                ? "w-[22px] rounded-[5px] bg-brand-600"
                : "w-2 rounded-full bg-brand-100"
            }`}
          />
        ))}
      </div>
    </>
  );
}
