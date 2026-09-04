"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";

import { XIcon } from "@/components/ui/icons";

const ICON_OPTIONS = [
  { value: "egg", label: "Œuf" },
  { value: "cattle", label: "Bétail" },
  { value: "pig", label: "Porc" },
  { value: "fish", label: "Poisson" },
  { value: "sprout", label: "Pousse" },
  { value: "feedbag", label: "Sac d'aliment" },
  { value: "check", label: "Coché" },
];

export type CategoryModalData = {
  id?: number;
  name: string;
  slug: string;
  icon: string;
  description: string;
  sortOrder: string;
  isActive: boolean;
};

const emptyData: CategoryModalData = {
  name: "",
  slug: "",
  icon: "egg",
  description: "",
  sortOrder: "0",
  isActive: true,
};

export default function CategoryModal({
  open,
  initialData,
  onClose,
}: {
  open: boolean;
  initialData?: CategoryModalData | null;
  onClose: () => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<CategoryModalData>(emptyData);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(values.id);

  useEffect(() => {
    if (open) {
      setValues(initialData ?? emptyData);
      setError(null);
      setLoading(false);
    }
  }, [open, initialData]);

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

  function update<K extends keyof CategoryModalData>(
    key: K,
    value: CategoryModalData[K],
  ) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload = {
      name: values.name,
      slug: values.slug || null,
      icon: values.icon,
      description: values.description || null,
      sortOrder: Number(values.sortOrder) || 0,
      isActive: values.isActive,
    };

    const url = isEditing
      ? `/api/admin/categories/${values.id}`
      : "/api/admin/categories";
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
      onClose();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  const inputClass =
    "w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15";

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-[640px] max-h-[90vh] overflow-y-auto rounded-pvs border border-line bg-white shadow-card">
        {/* Header */}
        <div className="flex items-center justify-between border-b border-line px-6 py-4">
          <h2 className="font-serif text-[18px] font-bold text-brand-900">
            {isEditing ? "Modifier la catégorie" : "Nouvelle catégorie"}
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
        <form onSubmit={handleSubmit} className="flex flex-col gap-5 p-6">
          <div className="grid gap-5 mid:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
                Nom
              </label>
              <input
                required
                value={values.name}
                onChange={(e) => update("name", e.target.value)}
                className={inputClass}
              />
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
                Slug (URL, optionnel — généré automatiquement)
              </label>
              <input
                value={values.slug}
                onChange={(e) => update("slug", e.target.value)}
                placeholder="ex: oeufs"
                className={inputClass}
              />
            </div>
          </div>

          <div className="grid gap-5 mid:grid-cols-2">
            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
                Icône
              </label>
              <select
                value={values.icon}
                onChange={(e) => update("icon", e.target.value)}
                className={inputClass}
              >
                {ICON_OPTIONS.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
                Ordre d&apos;affichage
              </label>
              <input
                type="number"
                value={values.sortOrder}
                onChange={(e) => update("sortOrder", e.target.value)}
                className={inputClass}
              />
            </div>
          </div>

          <div>
            <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
              Description (optionnel)
            </label>
            <textarea
              rows={2}
              value={values.description}
              onChange={(e) => update("description", e.target.value)}
              className={inputClass}
            />
          </div>

          <label className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink-700">
            <input
              type="checkbox"
              checked={values.isActive}
              onChange={(e) => update("isActive", e.target.checked)}
              className="h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500/15"
            />
            Catégorie active
          </label>

          {error && (
            <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
              {error}
            </div>
          )}

          <div className="flex justify-end gap-3 pt-1">
            <button
              type="button"
              onClick={onClose}
              className="inline-flex items-center justify-center rounded-[10px] border border-line bg-white px-5 py-2.5 text-[13.5px] font-bold text-brand-900 transition-colors hover:bg-brand-50"
            >
              Annuler
            </button>
            <button
              type="submit"
              disabled={loading}
              className="inline-flex items-center justify-center rounded-[10px] bg-brand-600 px-5 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading
                ? "Enregistrement..."
                : isEditing
                  ? "Mettre à jour"
                  : "Créer la catégorie"}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
