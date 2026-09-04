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
      title="Supprimer"
      className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-red-200 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50 disabled:opacity-50"
    >
      {loading ? (
        <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-red-300 border-t-red-500" />
      ) : (
        <TrashIcon size={14} />
      )}
    </button>
  );
}
