"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { toast } from "sonner";

import ConfirmDialog from "@/components/admin/ConfirmDialog";
import { TrashIcon } from "@/components/ui/icons";

export default function DeleteProductButton({
  id,
  name,
}: {
  id: number;
  name: string;
}) {
  const router = useRouter();
  const [confirmOpen, setConfirmOpen] = useState(false);
  const [loading, setLoading] = useState(false);

  async function handleDelete() {
    setLoading(true);
    const res = await fetch(`/api/admin/products/${id}`, { method: "DELETE" });

    if (res.ok) {
      toast.success(`« ${name} » déplacé dans la corbeille.`);
      setConfirmOpen(false);
      router.refresh();
    } else {
      const data = await res.json().catch(() => null);
      toast.error(data?.error ?? "Erreur lors de la suppression.");
      setLoading(false);
    }
  }

  return (
    <>
      <button
        type="button"
        onClick={() => setConfirmOpen(true)}
        title="Supprimer"
        className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-red-200 text-red-500 transition-colors hover:border-red-300 hover:bg-red-50"
      >
        <TrashIcon size={14} />
      </button>
      <ConfirmDialog
        open={confirmOpen}
        title="Supprimer le produit"
        message={`« ${name} » sera déplacé dans la corbeille et restera restaurable.`}
        loading={loading}
        onConfirm={handleDelete}
        onCancel={() => setConfirmOpen(false)}
      />
    </>
  );
}
