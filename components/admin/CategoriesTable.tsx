"use client";

import { useState } from "react";

import CategoryModal, { type CategoryModalData } from "@/components/admin/CategoryModal";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";
import { PlusIcon, PencilIcon, TagIcon } from "@/components/ui/icons";

type CategoryRow = {
  id: number;
  name: string;
  slug: string;
  icon: string;
  isActive: boolean;
};

export default function CategoriesTable({
  categories,
  countMap,
}: {
  categories: CategoryRow[];
  countMap: Record<string, number>;
}) {
  const [modalOpen, setModalOpen] = useState(false);
  const [editData, setEditData] = useState<CategoryModalData | null>(null);

  function openCreate() {
    setEditData(null);
    setModalOpen(true);
  }

  function openEdit(cat: CategoryRow) {
    setEditData({
      id: cat.id,
      name: cat.name,
      slug: cat.slug,
      icon: cat.icon,
      description: "",
      sortOrder: "0",
      isActive: cat.isActive,
    });
    setModalOpen(true);
  }

  function closeModal() {
    setModalOpen(false);
    setEditData(null);
  }

  const activeCount = categories.filter((c) => c.isActive).length;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 nav:flex-row nav:items-center nav:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-500">
            Catalogue
          </p>
          <h1 className="mt-1 font-serif text-[24px] font-bold text-brand-900">
            Catégories
          </h1>
          <p className="mt-1 text-[13px] text-ink-500">
            Gérez les catégories de produits du catalogue.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-[10px] bg-brand-600 px-4 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover hover:-translate-y-0.5"
        >
          <PlusIcon size={16} />
          Nouvelle catégorie
        </button>
      </div>

      {/* ── Stats rapides ── */}
      <div className="grid grid-cols-2 gap-4 nav:grid-cols-3">
        {[
          {
            label: "Total catégories",
            value: categories.length,
            color: "bg-brand-50",
            textColor: "text-brand-600",
          },
          {
            label: "Actives",
            value: activeCount,
            color: "bg-green-50",
            textColor: "text-green-600",
          },
          {
            label: "Inactives",
            value: categories.length - activeCount,
            color: "bg-ink-100",
            textColor: "text-ink-500",
          },
        ].map((stat) => (
          <div
            key={stat.label}
            className={`flex items-center gap-3 rounded-[14px] border border-line bg-white p-4 shadow-soft ${stat.color}`}
          >
            <div>
              <p className={`text-[22px] font-bold font-serif ${stat.textColor}`}>
                {stat.value}
              </p>
              <p className="text-[12px] text-ink-500">{stat.label}</p>
            </div>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-[16px] border border-line bg-white shadow-soft">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2">
            <TagIcon size={15} className="text-ink-500" />
            <span className="text-[13px] font-semibold text-ink-700">
              {categories.length} catégorie{categories.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-line bg-[#f8f9fc]">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                  Catégorie
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                  Slug
                </th>
                <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                  Produits
                </th>
                <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                  Statut
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {categories.map((cat) => (
                <tr
                  key={cat.id}
                  className="group border-b border-line/60 transition-colors last:border-0 hover:bg-brand-50/30"
                >
                  {/* Nom + icône */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-[10px] bg-brand-50 text-[18px]">
                        {cat.icon}
                      </div>
                      <span className="text-[13.5px] font-bold text-brand-900">
                        {cat.name}
                      </span>
                    </div>
                  </td>

                  {/* Slug */}
                  <td className="px-5 py-4">
                    <code className="rounded-[6px] bg-brand-50 px-2 py-1 text-[11.5px] font-semibold text-brand-700">
                      {cat.slug}
                    </code>
                  </td>

                  {/* Nombre de produits */}
                  <td className="px-5 py-4 text-center">
                    <span className="inline-flex h-7 min-w-[28px] items-center justify-center rounded-full bg-brand-50 px-2 text-[12px] font-bold text-brand-700">
                      {countMap[cat.slug] ?? 0}
                    </span>
                  </td>

                  {/* Statut */}
                  <td className="px-5 py-4 text-center">
                    {cat.isActive ? (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[11.5px] font-bold text-green-700">
                        <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                        Active
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-3 py-1 text-[11.5px] font-bold text-ink-500">
                        <span className="h-1.5 w-1.5 rounded-full bg-ink-500/50" />
                        Inactive
                      </span>
                    )}
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4">
                    <div className="flex items-center justify-end gap-1.5">
                      <button
                        type="button"
                        onClick={() => openEdit(cat)}
                        title="Éditer"
                        className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-line text-ink-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                      >
                        <PencilIcon size={14} />
                      </button>
                      <DeleteCategoryButton id={cat.id} name={cat.name} />
                    </div>
                  </td>
                </tr>
              ))}

              {categories.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                        <TagIcon size={24} className="text-brand-400" />
                      </div>
                      <p className="text-[14px] font-semibold text-ink-700">
                        Aucune catégorie
                      </p>
                      <p className="text-[13px] text-ink-500">
                        Cliquez sur « Nouvelle catégorie » pour en créer une.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <CategoryModal open={modalOpen} initialData={editData} onClose={closeModal} />
    </div>
  );
}
