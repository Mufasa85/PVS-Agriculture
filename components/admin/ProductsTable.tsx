"use client";

import { useState } from "react";

import type { Currency } from "@prisma/client";
import type { Prisma } from "@prisma/client";

import DeleteProductButton from "@/components/admin/DeleteProductButton";
import ProductModal from "@/components/admin/ProductModal";
import { PlusIcon, PencilIcon } from "@/components/ui/icons";
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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 nav:flex-row nav:items-center nav:justify-between">
        <div>
          <h1 className="font-serif text-[26px] font-bold text-brand-900">
            Produits &amp; tarifs
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            {totalCount} produit{totalCount > 1 ? "s" : ""} au catalogue
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-[10px] bg-brand-600 px-4 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover"
        >
          <PlusIcon size={17} />
          Nouveau produit
        </button>
      </div>

      <div className="flex flex-col gap-10">
        {grouped.map(({ category, items }) => (
          <section key={category.slug}>
            <h2 className="mb-3 text-[14px] font-bold uppercase tracking-[0.04em] text-brand-700">
              {category.name}{" "}
              <span className="text-ink-500">({items.length})</span>
            </h2>

            {items.length === 0 ? (
              <p className="rounded-pvs border border-dashed border-line bg-white px-5 py-6 text-[13.5px] text-ink-500">
                Aucun produit dans cette catégorie.
              </p>
            ) : (
              <div className="overflow-hidden rounded-pvs border border-line bg-white shadow-soft">
                <table className="w-full text-left text-[13.5px]">
                  <thead className="border-b border-line bg-brand-50 text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink-500">
                    <tr>
                      <th className="px-5 py-3">Nom</th>
                      <th className="px-5 py-3">Prix</th>
                      <th className="px-5 py-3">Statut</th>
                      <th className="px-5 py-3 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {items.map((product) => (
                      <tr
                        key={product.id}
                        className="border-b border-line last:border-0 transition-colors hover:bg-brand-50/50"
                      >
                        <td className="px-5 py-3.5 font-semibold text-brand-900">
                          {product.name}
                        </td>
                        <td className="px-5 py-3.5 text-ink-700">
                          {formatProductPrice(product)}
                          {product.unit ? ` ${product.unit}` : ""}
                        </td>
                        <td className="px-5 py-3.5">
                          <div className="flex flex-wrap gap-1.5">
                            {product.comingSoon ? (
                              <span className="rounded-full bg-amber-100 px-2.5 py-1 text-[11px] font-bold text-amber-700">
                                À venir
                              </span>
                            ) : (
                              <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                                Actif
                              </span>
                            )}
                            {!product.isPublished && (
                              <span className="rounded-full bg-ink-500/10 px-2.5 py-1 text-[11px] font-bold text-ink-500">
                                Brouillon
                              </span>
                            )}
                          </div>
                        </td>
                        <td className="px-5 py-3.5 text-right">
                          <div className="flex items-center justify-end gap-2">
                            <button
                              type="button"
                              onClick={() => openEdit(product.id)}
                              className="inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-1.5 text-[12.5px] font-semibold text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
                            >
                              <PencilIcon size={14} />
                              Éditer
                            </button>
                            <DeleteProductButton id={product.id} name={product.name} />
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </section>
        ))}
      </div>

      <ProductModal
        open={modalOpen}
        editId={editId}
        categories={categories}
        onClose={closeModal}
      />
    </div>
  );
}
