"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import Image from "next/image";
import { AnimatePresence, motion } from "framer-motion";
import { CategoryIcon } from "@/components/admin/CategoryIcon";
import { formatProductPrice } from "@/lib/products";
import type { SerializableProduct } from "@/lib/products";
import { trackEvent, trackProductView, trackSearch } from "@/lib/track";

type Category = { id: string; icon: string; name: string };

export default function TarifsFilter({
  products,
  categories,
}: {
  products: SerializableProduct[];
  categories: Category[];
}) {
  const [active, setActive] = useState<string>("tous");
  const [query, setQuery] = useState("");

  // Debounce du tracking : on n'envoie l'événement SEARCH qu'après que
  // l'utilisateur ait arrêté de taper pendant 600 ms, pour éviter de
  // spammer l'API à chaque frappe.
  const debounceRef = useRef<ReturnType<typeof setTimeout> | null>(null);
  const lastTrackedRef = useRef("");
  useEffect(() => {
    if (debounceRef.current) clearTimeout(debounceRef.current);
    const trimmed = query.trim();
    if (trimmed.length === 0 || trimmed === lastTrackedRef.current) return;
    debounceRef.current = setTimeout(() => {
      trackSearch(trimmed);
      lastTrackedRef.current = trimmed;
    }, 600);
    return () => {
      if (debounceRef.current) clearTimeout(debounceRef.current);
    };
  }, [query]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    const byCategory =
      active === "tous"
        ? products
        : products.filter((p) => p.category === active);

    if (q.length === 0) return byCategory;

    return byCategory.filter((p) => {
      const catName =
        categories.find((c) => c.id === p.category)?.name ?? p.category;
      return (
        p.name.toLowerCase().includes(q) ||
        p.description.toLowerCase().includes(q) ||
        (p.note ?? "").toLowerCase().includes(q) ||
        (p.badge ?? "").toLowerCase().includes(q) ||
        catName.toLowerCase().includes(q)
      );
    });
  }, [active, query, products, categories]);

  const activeLabel =
    active === "tous"
      ? "Tous"
      : (categories.find((c) => c.id === active)?.name ?? active);

  const handleCategoryClick = (cat: Category) => {
    setActive(cat.id);
    if (cat.id !== "tous") {
      trackEvent("CATEGORY_VIEW", "/tarifs", { categoryName: cat.name });
    }
  };

  return (
    <section className="bg-brand-50 py-[76px] nav:py-[110px]">
      <div className="shell">
        {/* ── Barre de recherche ── */}
        <div className="mx-auto mb-10 max-w-[480px]">
          <div className="relative">
            <svg
              className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-400"
              width="18"
              height="18"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <circle
                cx="11"
                cy="11"
                r="7"
                stroke="currentColor"
                strokeWidth="1.8"
              />
              <path
                d="M21 21l-4.3-4.3"
                stroke="currentColor"
                strokeWidth="1.8"
                strokeLinecap="round"
              />
            </svg>
            <input
              type="search"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="Rechercher un produit…"
              aria-label="Rechercher un produit"
              className="w-full rounded-full border-[1.5px] border-line bg-white py-3.5 pl-11 pr-10 text-[14.5px] text-ink-900 shadow-sm transition-[border-color,box-shadow] duration-200 ease-out placeholder:text-ink-400 focus:border-brand-600 focus:outline-none focus:ring-2 focus:ring-brand-600/15"
            />
            {query.length > 0 && (
              <button
                type="button"
                onClick={() => setQuery("")}
                aria-label="Effacer la recherche"
                className="absolute right-3 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-full text-ink-400 transition-colors duration-150 ease-out hover:bg-brand-100 hover:text-brand-700 active:scale-95"
              >
                <svg
                  width="14"
                  height="14"
                  viewBox="0 0 24 24"
                  fill="none"
                  aria-hidden="true"
                >
                  <path
                    d="M6 6l12 12M6 18L18 6"
                    stroke="currentColor"
                    strokeWidth="2"
                    strokeLinecap="round"
                  />
                </svg>
              </button>
            )}
          </div>
        </div>

        {/* ── Filtres : défilement horizontal (carrousel) sur mobile ── */}
        <div
          role="group"
          aria-label="Filtrer les produits par catégorie"
          className="-mx-5 mb-12 flex gap-3 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mid:mx-0 mid:flex-wrap mid:justify-center mid:overflow-visible mid:px-0 mid:pb-0"
        >
          {categories.map((cat) => {
            const isActive = active === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => handleCategoryClick(cat)}
                aria-pressed={isActive}
                className={`flex shrink-0 items-center gap-2.5 rounded-full border px-[20px] py-3 text-[14px] font-bold transition-[border-color,background-color,color,box-shadow] duration-200 ease-out active:scale-[0.97] ${
                  isActive
                    ? "border-brand-600 bg-brand-600 text-white shadow-card"
                    : "border-line bg-white text-brand-900 hover:border-brand-300 hover:bg-brand-50"
                }`}
              >
                <CategoryIcon icon={cat.icon} size={18} />
                {cat.id === "tous" ? "Tous" : cat.name}
              </button>
            );
          })}
        </div>

        {/* ── Compteur de résultats ── */}
        <p
          aria-live="polite"
          className="mb-8 text-center text-[14px] text-ink-500"
        >
          <span className="font-bold text-brand-900">{filtered.length}</span>{" "}
          produit{filtered.length > 1 ? "s" : ""}
          {query.trim() ? (
            <>
              {" "}
              pour « <span className="font-bold text-brand-900">{query.trim()}</span> »
            </>
          ) : (
            <> — {activeLabel}</>
          )}
        </p>

        {/* ── Produits : carrousel scroll-snap sur mobile, grille dès `mid` ── */}
        <AnimatePresence mode="wait">
          <motion.div
            key={active + query}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.35, ease: [0.16, 0.8, 0.24, 1] }}
            className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 [-ms-overflow-style:none] [scrollbar-width:none] [&::-webkit-scrollbar]:hidden mid:mx-0 mid:grid mid:snap-none mid:grid-cols-2 mid:gap-6 mid:overflow-visible mid:px-0 mid:pb-0 nav:grid-cols-3"
          >
            {filtered.map((product) => {
              const catName =
                categories.find((c) => c.id === product.category)?.name ??
                product.category;
              return (
                <div
                  key={product.id}
                  onClick={() =>
                    trackProductView(product.name, catName, "/tarifs")
                  }
                  className="group w-[80vw] max-w-[340px] shrink-0 snap-center overflow-hidden rounded-pvs-lg border border-line bg-white shadow-sm transition-all duration-[350ms] ease-pvs hover:-translate-y-1.5 hover:shadow-card mid:w-auto mid:max-w-none"
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
                        {categories.find((c) => c.id === product.category)
                          ?.name ?? product.category}
                      </span>
                    </div>
                  </div>
                </div>
              );
            })}
          </motion.div>
        </AnimatePresence>

        {filtered.length === 0 && (
          <div className="py-16 text-center">
            <p className="text-[15px] text-ink-500">
              {query.trim()
                ? "Aucun produit ne correspond à votre recherche."
                : "Aucun produit dans cette catégorie pour le moment."}
            </p>
            {query.trim() && (
              <button
                type="button"
                onClick={() => setQuery("")}
                className="btn btn-ghost btn-sm mt-5"
              >
                Réinitialiser la recherche
              </button>
            )}
          </div>
        )}
      </div>
    </section>
  );
}
