"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

import { TrashIcon } from "@/components/ui/icons";

export default function DeleteProductButton({ id, name }: { id: number; name: string }) {
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    if (!confirm(`Supprimer « ${name} » ? Cette action est irréversible.`)) {
      return;
    }

    setLoading(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });

    if (res.ok) {
      router.refresh();
    } else {
      alert("Erreur lors de la suppression.");
      setLoading(false);
    }
  }

  return (
    <button
      type="button"
      onClick={handleDelete}
      disabled={loading}
      className="inline-flex items-center gap-1.5 rounded-[8px] border border-red-200 px-3 py-1.5 text-[12.5px] font-semibold text-red-600 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
    >
      <TrashIcon size={14} />
      {loading ? "..." : "Supprimer"}
    </button>
  );
}
