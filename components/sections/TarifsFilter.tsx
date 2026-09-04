"use client";

import { useMemo, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import type { Product } from "@prisma/client";

import {
  CattleIcon,
  CheckIcon,
  EggIcon,
  FeedBagIcon,
  FishIcon,
  PigIcon,
  SproutIcon,
} from "@/components/ui/icons";
import { formatProductPrice } from "@/lib/products";

const categoryIcons: Record<string, (props: { size?: number }) => React.ReactElement> = {
  cattle: CattleIcon,
  fish: FishIcon,
  feedbag: FeedBagIcon,
  check: CheckIcon,
  egg: EggIcon,
  pig: PigIcon,
  sprout: SproutIcon,
};

type Category = { id: string; icon: string; name: string };

export default function TarifsFilter({
  products,
  categories,
}: {
  products: Product[];
  categories: Category[];
}) {
  const [active, setActive] = useState<string>("tous");

  const filtered = useMemo(() => {
    if (active === "tous") return products;
    return products.filter((p) => p.category === active);
  }, [active, products]);

  const activeLabel =
    active === "tous" ? "Tous" : categories.find((c) => c.id === active)?.name ?? active;

  return (
    <section className="bg-brand-50 py-[76px] nav:py-[110px]">
      <div className="shell">
        {/* ── Filtres ── */}
        <div className="mb-12 flex flex-wrap justify-center gap-3">
          {categories.map((cat) => {
            const Icon = categoryIcons[cat.icon] ?? CheckIcon;
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                onClick={() => setActive(cat.id)}
                className={`flex items-center gap-2.5 rounded-full border px-[20px] py-3 text-[14px] font-bold transition-all duration-300 ${
                  isActive
                    ? "border-brand-600 bg-brand-600 text-white shadow-card"
                    : "border-line bg-white text-brand-900 hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                <Icon size={18} />
                {cat.id === "tous" ? "Tous" : cat.name}
              </button>
            );
          })}
        </div>

        {/* ── Compteur de résultats ── */}
        <p className="mb-8 text-center text-[14px] text-ink-500">
          <span className="font-bold text-brand-900">{filtered.length}</span> produit{filtered.length > 1 ? "s" : ""} — {activeLabel}
        </p>

        {/* ── Grille de produits ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 0.8, 0.24, 1] }}
            className="grid grid-cols-1 gap-6 mid:grid-cols-2 nav:grid-cols-3"
          >
            {filtered.map((product) => (
              <div
                key={product.id}
                className="group overflow-hidden rounded-pvs-lg border border-line bg-white shadow-sm transition-all duration-[350ms] ease-pvs hover:-translate-y-1.5 hover:shadow-card"
              >
                <div className="relative aspect-[4/3] overflow-hidden bg-brand-100">
                  <Image
                    src={product.imageSrc}
                    alt={product.imageAlt}
                    fill
                    sizes="(max-width: 900px) 90vw, 33vw"
                    className="object-cover transition-transform duration-500 group-hover:scale-105"
                  />
                </div>

                <div className="px-[22px] py-6">
                  <h3 className="mb-1.5 text-[17px] font-bold text-brand-900">
                    {product.name}
                  </h3>
                  <p className="mb-4 text-[13.5px] leading-[1.55] text-ink-500">
                    {product.description}
                  </p>

                  <div className="flex items-end justify-between border-t border-line pt-4">
                    <div>
                      <span className="block font-serif text-[22px] font-bold text-brand-700">
                        {formatProductPrice(product)}
                      </span>
                      {product.unit && (
                        <span className="text-[12px] text-ink-500">
                          {product.unit}
                        </span>
                      )}
                    </div>
                    <span className="rounded-full bg-brand-50 px-3 py-1.5 text-[11px] font-bold uppercase tracking-[0.04em] text-brand-600">
                      {categories.find((c) => c.id === product.category)?.name ?? product.category}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <p className="py-16 text-center text-[15px] text-ink-500">
            Aucun produit dans cette catégorie pour le moment.
          </p>
        )}
      </div>
    </section>
  );
}
