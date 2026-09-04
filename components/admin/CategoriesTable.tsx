"use client";

import { useState } from "react";

import CategoryModal, { type CategoryModalData } from "@/components/admin/CategoryModal";
import DeleteCategoryButton from "@/components/admin/DeleteCategoryButton";
import { PlusIcon, PencilIcon } from "@/components/ui/icons";

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

  return (
    <div className="flex flex-col gap-8">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="font-serif text-[26px] font-bold text-brand-900">
            Catégories
          </h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            Gérez les catégories de produits du catalogue.
          </p>
        </div>
        <button
          type="button"
          onClick={openCreate}
          className="inline-flex items-center gap-2 rounded-[10px] bg-brand-600 px-4 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover"
        >
          <PlusIcon size={16} />
          Nouvelle catégorie
        </button>
      </div>

      <div className="overflow-hidden rounded-pvs border border-line bg-white shadow-soft">
        <table className="w-full">
          <thead>
            <tr className="border-b border-line bg-brand-50/50">
              <th className="px-5 py-3.5 text-left text-[12px] font-bold uppercase tracking-wide text-ink-500">
                Nom
              </th>
              <th className="px-5 py-3.5 text-left text-[12px] font-bold uppercase tracking-wide text-ink-500">
                Slug
              </th>
              <th className="px-5 py-3.5 text-left text-[12px] font-bold uppercase tracking-wide text-ink-500">
                Icône
              </th>
              <th className="px-5 py-3.5 text-center text-[12px] font-bold uppercase tracking-wide text-ink-500">
                Produits
              </th>
              <th className="px-5 py-3.5 text-center text-[12px] font-bold uppercase tracking-wide text-ink-500">
                Statut
              </th>
              <th className="px-5 py-3.5 text-right text-[12px] font-bold uppercase tracking-wide text-ink-500">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {categories.map((cat) => (
              <tr
                key={cat.id}
                className="border-b border-line/60 transition-colors last:border-0 hover:bg-brand-50/40"
              >
                <td className="px-5 py-4">
                  <span className="text-[14px] font-bold text-brand-900">
                    {cat.name}
                  </span>
                </td>
                <td className="px-5 py-4">
                  <code className="rounded bg-brand-50 px-1.5 py-0.5 text-[12px] text-brand-700">
                    {cat.slug}
                  </code>
                </td>
                <td className="px-5 py-4">
                  <span className="text-[13px] text-ink-700">{cat.icon}</span>
                </td>
                <td className="px-5 py-4 text-center">
                  <span className="text-[14px] font-semibold text-brand-900">
                    {countMap[cat.slug] ?? 0}
                  </span>
                </td>
                <td className="px-5 py-4 text-center">
                  {cat.isActive ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-2.5 py-1 text-[11.5px] font-bold text-green-700">
                      Active
                    </span>
                  ) : (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ink-100 px-2.5 py-1 text-[11.5px] font-bold text-ink-500">
                      Inactive
                    </span>
                  )}
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      type="button"
                      onClick={() => openEdit(cat)}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-1.5 text-[12.5px] font-semibold text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
                    >
                      <PencilIcon size={14} />
                      Éditer
                    </button>
                    <DeleteCategoryButton id={cat.id} name={cat.name} />
                  </div>
                </td>
              </tr>
            ))}

            {categories.length === 0 && (
              <tr>
                <td colSpan={6} className="px-5 py-12 text-center text-[14px] text-ink-500">
                  Aucune catégorie. Cliquez sur « Nouvelle catégorie » pour en créer une.
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      <CategoryModal open={modalOpen} initialData={editData} onClose={closeModal} />
    </div>
  );
}
