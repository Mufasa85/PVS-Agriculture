"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import CategorySelect from "@/components/admin/CategorySelect";
import ImageUploader from "@/components/admin/ImageUploader";
import type { CategoryInfo } from "@/lib/products";

type GalleryImage = {
  url: string;
  alt: string;
};

type ProductFormValues = {
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

const emptyValues: ProductFormValues = {
  name: "",
  slug: "",
  description: "",
  category: "",
  priceAmount: "",
  currency: "FC",
  unit: "",
  note: "",
  badge: "",
  imageSrc: "",
  imageAlt: "",
  images: [],
  comingSoon: false,
  onDemand: false,
  isPublished: true,
  sortOrder: "0",
};

export default function ProductForm({
  initialValues,
  categories,
  onClose,
}: {
  initialValues?: ProductFormValues;
  categories: CategoryInfo[];
  onClose?: () => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<ProductFormValues>(
    initialValues ?? { ...emptyValues, category: categories[0]?.slug ?? "" },
  );
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(values.id);

  function update<K extends keyof ProductFormValues>(key: K, value: ProductFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: values.name,
      slug: values.slug || null,
      description: values.description,
      category: values.category,
      priceAmount: values.comingSoon || values.priceAmount === ""
        ? null
        : Number(values.priceAmount),
      currency: values.currency,
      unit: values.unit || null,
      note: values.note || null,
      badge: values.badge || null,
      imageSrc: values.imageSrc,
      imageAlt: values.imageAlt,
      images: values.images.filter((img) => img.url.trim()),
      comingSoon: values.comingSoon,
      onDemand: values.onDemand,
      isPublished: values.isPublished,
      sortOrder: Number(values.sortOrder) || 0,
    };

    const url = isEditing ? `/api/admin/products/${values.id}` : "/api/admin/products";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      router.refresh();
      if (onClose) {
        onClose();
      } else {
        router.push("/admin/products");
      }
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 mid:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-brand-900">Nom</label>
          <input
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-brand-900">Catégorie</label>
          <CategorySelect
            value={values.category}
            categories={categories}
            onChange={(slug) => update("category", slug)}
          />
        </div>
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
          Slug (URL, optionnel — généré automatiquement à partir du nom si vide)
        </label>
        <input
          value={values.slug}
          onChange={(e) => update("slug", e.target.value)}
          placeholder="ex: oeufs-plateau"
          className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
        />
      </div>

      <div>
        <label className="mb-1.5 block text-[13px] font-bold text-brand-900">Description</label>
        <textarea
          required
          rows={3}
          value={values.description}
          onChange={(e) => update("description", e.target.value)}
          className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
        />
      </div>

      <div className="flex flex-wrap gap-6">
        <label className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink-700">
          <input
            type="checkbox"
            checked={values.comingSoon}
            onChange={(e) => update("comingSoon", e.target.checked)}
            className="h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500/15"
          />
          Catégorie à venir (pas encore de prix)
        </label>
        <label className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink-700">
          <input
            type="checkbox"
            checked={values.onDemand}
            onChange={(e) => update("onDemand", e.target.checked)}
            className="h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500/15"
          />
          Produit à la demande
        </label>
        <label className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink-700">
          <input
            type="checkbox"
            checked={values.isPublished}
            onChange={(e) => update("isPublished", e.target.checked)}
            className="h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500/15"
          />
          Publié sur le site
        </label>
      </div>

      {!values.comingSoon && (
        <div className="grid gap-5 mid:grid-cols-3">
          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-brand-900">Prix</label>
            <input
              type="number"
              step="0.01"
              required={!values.comingSoon}
              value={values.priceAmount}
              onChange={(e) => update("priceAmount", e.target.value)}
              className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            />
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-brand-900">Devise</label>
            <select
              value={values.currency}
              onChange={(e) => update("currency", e.target.value)}
              className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            >
              <option value="FC">FC</option>
              <option value="USD">USD ($)</option>
            </select>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
              Unité (ex: / kg, / plateau)
            </label>
            <input
              value={values.unit}
              onChange={(e) => update("unit", e.target.value)}
              className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            />
          </div>
        </div>
      )}

      <div className="grid gap-5 mid:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
            Note (optionnel — ex: prix dégressif)
          </label>
          <input
            value={values.note}
            onChange={(e) => update("note", e.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
            Badge (optionnel — ex: Best-seller)
          </label>
          <input
            value={values.badge}
            onChange={(e) => update("badge", e.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
      </div>

      <div>
        <ImageUploader
          label="Image principale"
          required
          url={values.imageSrc}
          alt={values.imageAlt}
          onUrlChange={(url) => update("imageSrc", url)}
          onAltChange={(alt) => update("imageAlt", alt)}
        />
      </div>

      <div className="max-w-[200px]">
        <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
          Ordre d&apos;affichage
        </label>
        <input
          type="number"
          value={values.sortOrder}
          onChange={(e) => update("sortOrder", e.target.value)}
          className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
        />
      </div>

      <div>
        <div className="mb-3 flex items-center justify-between">
          <label className="block text-[13px] font-bold text-brand-900">
            Galerie d&apos;images supplémentaires (optionnel)
          </label>
          <button
            type="button"
            onClick={() => update("images", [...values.images, { url: "", alt: "" }])}
            className="inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-1.5 text-[12.5px] font-semibold text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
          >
            + Ajouter une image
          </button>
        </div>
        <div className="flex flex-col gap-4">
          {values.images.map((img, index) => (
            <ImageUploader
              key={index}
              compact
              url={img.url}
              alt={img.alt}
              onUrlChange={(url) => {
                const next = [...values.images];
                next[index] = { ...next[index], url };
                update("images", next);
              }}
              onAltChange={(alt) => {
                const next = [...values.images];
                next[index] = { ...next[index], alt };
                update("images", next);
              }}
              onRemove={() => update("images", values.images.filter((_, i) => i !== index))}
            />
          ))}
          {values.images.length === 0 && (
            <p className="text-[13px] text-ink-500">Aucune image supplémentaire.</p>
          )}
        </div>
      </div>

      {error && (
        <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">{error}</div>
      )}

      <div className="flex justify-end gap-3">
        <button
          type="button"
          onClick={() => (onClose ? onClose() : router.push("/admin/products"))}
          className="inline-flex items-center justify-center rounded-[10px] border border-line bg-white px-5 py-2.5 text-[13.5px] font-bold text-brand-900 transition-colors hover:bg-brand-50"
        >
          Annuler
        </button>
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-[10px] bg-brand-600 px-5 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer le produit"}
        </button>
      </div>
    </form>
  );
}
