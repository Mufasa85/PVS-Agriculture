"use client";

import { useEffect, useState } from "react";

import ProductForm from "@/components/admin/ProductForm";
import { XIcon } from "@/components/ui/icons";
import type { CategoryInfo } from "@/lib/products";

type GalleryImage = { url: string; alt: string };

type ProductModalData = {
  id?: number;
  name: string;
  slug: string;
  description: string;
  category: string;
  priceAmount: string;
  currency: string;
  unit: string;
  note: string;
  badge: string;
  imageSrc: string;
  imageAlt: string;
  images: GalleryImage[];
  comingSoon: boolean;
  onDemand: boolean;
  isPublished: boolean;
  sortOrder: string;
};

export default function ProductModal({
  open,
  editId,
  categories,
  onClose,
}: {
  open: boolean;
  editId: number | null;
  categories: CategoryInfo[];
  onClose: () => void;
}) {
  const [initialData, setInitialData] = useState<ProductModalData | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = editId !== null;

  useEffect(() => {
    if (!open) {
      setInitialData(null);
      return;
    }

    if (isEditing) {
      setLoading(true);
      fetch(`/api/admin/products/${editId}`)
        .then((res) => res.json())
        .then((data) => {
          if (data.product) {
            const p = data.product;
            setInitialData({
              id: p.id,
              name: p.name,
              slug: p.slug,
              description: p.description,
              category: p.category,
              priceAmount: p.priceAmount?.toString() ?? "",
              currency: p.currency,
              unit: p.unit ?? "",
              note: p.note ?? "",
              badge: p.badge ?? "",
              imageSrc: p.imageSrc,
              imageAlt: p.imageAlt,
              images: (p.images ?? []).map((img: { url: string; alt: string }) => ({
                url: img.url,
                alt: img.alt,
              })),
              comingSoon: p.comingSoon,
              onDemand: p.onDemand,
              isPublished: p.isPublished,
              sortOrder: p.sortOrder.toString(),
            });
          }
        })
        .finally(() => setLoading(false));
    } else {
      setInitialData(null);
    }
  }, [open, editId, isEditing]);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape") onClose();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, onClose]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[760px] max-h-[90vh] overflow-y-auto rounded-pvs border border-line bg-white shadow-card">
        {/* Header */}
        <div className="sticky top-0 z-10 flex items-center justify-between border-b border-line bg-white px-6 py-4">
          <h2 className="font-serif text-[18px] font-bold text-brand-900">
            {isEditing ? "Modifier le produit" : "Nouveau produit"}
          </h2>
          <button
            type="button"
            onClick={onClose}
            className="flex h-8 w-8 items-center justify-center rounded-[8px] text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-900"
          >
            <XIcon size={18} />
          </button>
        </div>

        {/* Body */}
        <div className="p-6">
          {loading ? (
            <div className="flex items-center justify-center py-16">
              <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            </div>
          ) : (
            <ProductForm
              categories={categories}
              initialValues={initialData ?? undefined}
              onClose={onClose}
            />
          )}
        </div>
      </div>
    </div>
  );
}
