"use client";

import { useState } from "react";

import type { Currency } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import { Package, Pencil, Plus, Search, X } from "lucide-react";

import { CategoryIcon } from "@/components/admin/CategoryIcon";
import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductModal from "@/components/admin/ProductModal";
import { formatProductPrice } from "@/lib/products";
import type { CategoryInfo } from "@/lib/products";

type ProductRow = {
  id: number;
  name: string;
  slug: string;
  category: string;
  priceAmount: Prisma.Decimal | null;
  currency: Currency;
  unit: string | null;
  comingSoon: boolean;
  isPublished: boolean;
};

type GroupedProducts = {
  category: CategoryInfo;
  items: ProductRow[];
};

export default function ProductsTable({
  grouped,
  totalCount,
  categories,
}: {
  grouped: GroupedProducts[];
  totalCount: number;
  categories: CategoryInfo[];
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editId, setEditId] = useState<number | null>(null);
  const [activeTab, setActiveTab] = useState<string | "all">("all");
  const [searchQuery, setSearchQuery] = useState("");

  function openCreate() {
    setEditId(null);
    setModalOpen(true);
  }

  function openEdit(id: number) {
    setEditId(id);
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditId(null);
  }

  const publishedCount = grouped.flatMap((g) => g.items).filter((p) => p.isPublished).length;
  const draftCount = totalCount - publishedCount;

  const q = searchQuery.trim().toLowerCase();

  // Liste plate de tous les produits avec leur info de catégorie
  const allProductsWithCategory = grouped.flatMap((g) =>
    g.items.map((item) => ({ ...item, categoryInfo: g.category })),
  );

  // Filtrage selon tab et requête de recherche
  const displayProducts = allProductsWithCategory.filter((p) => {
    const matchesTab = activeTab === "all" || p.categoryInfo.slug === activeTab;
    const matchesSearch =
      !q ||
      p.name.toLowerCase().includes(q) ||
      p.slug.toLowerCase().includes(q) ||
      p.categoryInfo.name.toLowerCase().includes(q);
    return matchesTab && matchesSearch;
  });

  const searchResultCount = displayProducts.length;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 nav:flex-row nav:items-center nav:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-500">
            Catalogue
          </p>
          <h1 className="mt-1 font-serif text-[24px] font-bold text-brand-900">
            Produits & tarifs
          </h1>
          <p className="mt-1 text-[13px] text-ink-500">
            {totalCount} produit{totalCount > 1 ? "s" : ""} au catalogue
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-[10px] bg-brand-600 px-4 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover hover:-translate-y-0.5"
        >
          <Plus size={17} />
          Nouveau produit
        </button>
      </div>

      {/* ── Mini stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total", value: totalCount, color: "text-brand-600", bg: "bg-brand-50" },
          { label: "Publiés", value: publishedCount, color: "text-green-600", bg: "bg-green-50" },
          { label: "Brouillons", value: draftCount, color: "text-amber-600", bg: "bg-amber-50" },
        ].map((s) => (
          <div
            key={s.label}
            className="flex flex-col rounded-[14px] border border-line bg-white p-4 shadow-soft"
          >
            <span className={`text-[22px] font-bold font-serif ${s.color}`}>
              {s.value}
            </span>
            <span className="text-[12px] text-ink-500">{s.label}</span>
          </div>
        ))}
      </div>

      {/* ── Barre de recherche ── */}
      <div className="flex flex-col gap-2">
        <div className="relative">
          <Search
            size={17}
            className="pointer-events-none absolute left-3.5 top-1/2 -translate-y-1/2 text-ink-500/60"
          />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Rechercher un produit par nom ou slug…"
            className="w-full rounded-[12px] border border-line bg-white py-2.5 pl-11 pr-10 text-[14px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
          {searchQuery && (
            <button
              type="button"
              onClick={() => setSearchQuery("")}
              className="absolute right-3 top-1/2 -translate-y-1/2 flex h-6 w-6 items-center justify-center rounded-full text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
              aria-label="Effacer la recherche"
            >
              <X size={14} />
            </button>
          )}
        </div>
        {q && (
          <p className="text-[12.5px] text-ink-500">
            {searchResultCount} résultat{searchResultCount > 1 ? "s" : ""} pour « {searchQuery} »
          </p>
        )}
      </div>

      {/* ── Tabs de filtre par catégorie ── */}
      <div className="flex flex-wrap gap-2">
        <button
          type="button"
          onClick={() => setActiveTab("all")}
          className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
            activeTab === "all"
              ? "bg-brand-600 text-white shadow-brand-btn"
              : "border border-line bg-white text-ink-500 hover:border-brand-300 hover:text-brand-600"
          }`}
        >
          Tout ({totalCount})
        </button>
        {grouped.map(({ category, items }) => (
          <button
            key={category.slug}
            type="button"
            onClick={() => setActiveTab(category.slug)}
            className={`rounded-full px-4 py-1.5 text-[12.5px] font-semibold transition-all ${
              activeTab === category.slug
                ? "bg-brand-600 text-white shadow-brand-btn"
                : "border border-line bg-white text-ink-500 hover:border-brand-300 hover:text-brand-600"
            }`}
          >
            <CategoryIcon icon={category.icon} size={13} /> {category.name}
            <span
              className={`ml-1.5 rounded-full px-1.5 py-0.5 text-[10.5px] font-bold ${
                activeTab === category.slug
                  ? "bg-white/20 text-white"
                  : "bg-brand-50 text-brand-600"
              }`}
            >
              {items.length}
            </span>
          </button>
        ))}
      </div>

      {/* ── Table unique des produits (plate, sans séparation par catégorie) ── */}
      {displayProducts.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-[16px] border border-dashed border-line bg-white py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <Package size={24} className="text-brand-400" />
          </div>
          <p className="text-[14px] font-semibold text-ink-700">
            {q ? "Aucun résultat" : "Aucun produit"}
          </p>
          <p className="mt-1 text-[13px] text-ink-500">
            {q
              ? `Aucun produit ne correspond à « ${searchQuery} ».`
              : "Aucun produit disponible."}
          </p>
        </div>
      ) : (
        <div className="overflow-hidden rounded-[16px] border border-line bg-white shadow-soft">
          {/* Toolbar / Table Header */}
          <div className="border-b border-line bg-[#f8f9fc] px-5 py-2.5">
            <div className="flex items-center gap-4 text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
              <span className="flex-[3]">Nom</span>
              <span className="hidden flex-[2] nav:block">Catégorie</span>
              <span className="flex-1 text-right nav:text-left">Prix</span>
              <span className="hidden flex-1 nav:block">Statut</span>
              <span className="flex-shrink-0 w-20 text-right">Actions</span>
            </div>
          </div>

          <div>
            {displayProducts.map((product, idx) => (
              <div
                key={product.id}
                className={`flex items-center gap-4 px-5 py-3.5 transition-colors hover:bg-brand-50/30 ${
                  idx < displayProducts.length - 1 ? "border-b border-line/60" : ""
                }`}
              >
                {/* Nom */}
                <div className="flex flex-[3] items-center gap-3 min-w-0">
                  <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-brand-50">
                    <Package size={14} className="text-brand-500" />
                  </div>
                  <span className="truncate text-[13.5px] font-semibold text-brand-900">
                    {product.name}
                  </span>
                </div>

                {/* Catégorie */}
                <div className="hidden flex-[2] nav:flex items-center gap-1.5 text-[12.5px]">
                  <span className="inline-flex items-center gap-1.5 rounded-md bg-brand-50/70 px-2.5 py-1 text-[11.5px] font-medium text-brand-700 border border-brand-100">
                    <CategoryIcon icon={product.categoryInfo.icon} size={13} />
                    <span>{product.categoryInfo.name}</span>
                  </span>
                </div>

                {/* Prix */}
                <div className="flex-1 text-right nav:text-left">
                  <span className="text-[13px] font-semibold text-ink-700">
                    {formatProductPrice(product)}
                    {product.unit ? ` ${product.unit}` : ""}
                  </span>
                </div>

                {/* Statut */}
                <div className="hidden flex-1 nav:flex nav:flex-wrap nav:gap-1.5">
                  {product.comingSoon ? (
                    <span className="inline-flex items-center gap-1 rounded-full bg-amber-50 px-2.5 py-0.5 text-[11px] font-bold text-amber-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-amber-400" />
                      À venir
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1 rounded-full bg-green-50 px-2.5 py-0.5 text-[11px] font-bold text-green-600">
                      <span className="h-1.5 w-1.5 rounded-full bg-green-400" />
                      Actif
                    </span>
                  )}
                  {!product.isPublished && (
                    <span className="inline-flex items-center gap-1 rounded-full bg-ink-100 px-2.5 py-0.5 text-[11px] font-bold text-ink-500">
                      Brouillon
                    </span>
                  )}
                </div>

                {/* Actions */}
                <div className="flex w-20 shrink-0 items-center justify-end gap-1">
                  <button
                    type="button"
                    onClick={() => openEdit(product.id)}
                    title="Éditer"
                    className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-line text-ink-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                  >
                    <Pencil size={13} />
                  </button>
                  <DeleteProductButton id={product.id} name={product.name} />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      <ProductModal
        open={modalOpen}
        editId={editId}
        categories={categories}
        onClose={closeModal}
      />
    </div>
  );
}

