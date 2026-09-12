"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { RotateCcw, Trash2 } from "lucide-react";

import { formatProductPrice } from "@/lib/products";

type TrashProduct = {
  id: number;
  name: string;
  slug: string;
  category: string;
  priceAmount: number | null;
  currency: "FC" | "USD";
  deletedAt: string;
};

export default function TrashPanel() {
  const router = useRouter();
  const [products, setProducts] = useState<TrashProduct[]>([]);
  const [loading, setLoading] = useState(true);
  const [restoringId, setRestoringId] = useState<number | null>(null);

  useEffect(() => {
    let cancelled = false;
    fetch("/api/admin/products?trash=1")
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!cancelled && data) setProducts(data.products ?? []);
      })
      .catch(() => {
        if (!cancelled) toast.error("Impossible de charger la corbeille.");
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  async function restore(product: TrashProduct) {
    setRestoringId(product.id);
    try {
      const res = await fetch(`/api/admin/products/${product.id}/restore`, {
        method: "POST",
      });
      if (res.ok) {
        setProducts((prev) => prev.filter((p) => p.id !== product.id));
        toast.success(`« ${product.name} » restauré.`);
        router.refresh();
      } else {
        const data = await res.json().catch(() => null);
        toast.error(data?.error ?? "Erreur lors de la restauration.");
      }
    } catch {
      toast.error("Erreur lors de la restauration.");
    } finally {
      setRestoringId(null);
    }
  }

  return (
    <div className="overflow-hidden rounded-[16px] border border-line bg-white shadow-soft">
      {loading ? (
        <div className="flex h-48 items-center justify-center">
          <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
        </div>
      ) : products.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-16 text-center">
          <div className="mb-3 flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
            <Trash2 size={24} className="text-brand-400" />
          </div>
          <p className="text-[14px] font-semibold text-ink-700">
            La corbeille est vide
          </p>
          <p className="mt-1 text-[13px] text-ink-500">
            Les produits supprimés apparaîtront ici.
          </p>
        </div>
      ) : (
        <div>
          {products.map((product, idx) => (
            <div
              key={product.id}
              className={`flex items-center gap-4 px-5 py-3.5 ${
                idx < products.length - 1 ? "border-b border-line/60" : ""
              }`}
            >
              <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] bg-red-50">
                <Trash2 size={14} className="text-red-400" />
              </div>
              <div className="min-w-0 flex-1">
                <p className="truncate text-[13.5px] font-semibold text-brand-900">
                  {product.name}
                </p>
                <p className="truncate text-[11.5px] text-ink-500">
                  Supprimé le{" "}
                  {new Date(product.deletedAt).toLocaleDateString("fr-FR", {
                    day: "numeric",
                    month: "long",
                    year: "numeric",
                  })}
                </p>
              </div>
              <span className="hidden text-[12.5px] font-semibold text-ink-500 sm:block">
                {formatProductPrice({
                  comingSoon: false,
                  priceAmount: product.priceAmount,
                  currency: product.currency,
                })}
              </span>
              <button
                type="button"
                onClick={() => restore(product)}
                disabled={restoringId === product.id}
                className="inline-flex items-center gap-1.5 rounded-[8px] border border-brand-200 px-3 py-1.5 text-[12px] font-bold text-brand-600 transition-colors hover:bg-brand-50 disabled:opacity-50"
              >
                {restoringId === product.id ? (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
                ) : (
                  <RotateCcw size={13} />
                )}
                Restaurer
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
