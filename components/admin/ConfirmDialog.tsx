"use client";

import { useEffect } from "react";

import { useModalA11y } from "@/lib/use-modal-a11y";
import { TrashIcon, XIcon } from "@/components/ui/icons";

/**
 * Modale de confirmation partagée — remplace window.confirm().
 * Accessible : role=dialog, focus trap, Esc ferme, focus restauré.
 */
export default function ConfirmDialog({
  open,
  title,
  message,
  confirmLabel = "Supprimer",
  loading = false,
  onConfirm,
  onCancel,
}: {
  open: boolean;
  title: string;
  message: string;
  confirmLabel?: string;
  loading?: boolean;
  onConfirm: () => void;
  onCancel: () => void;
}) {
  const panelRef = useModalA11y(open);

  useEffect(() => {
    if (!open) return;
    function handleKey(e: KeyboardEvent) {
      if (e.key === "Escape" && !loading) onCancel();
    }
    window.addEventListener("keydown", handleKey);
    document.body.style.overflow = "hidden";
    return () => {
      window.removeEventListener("keydown", handleKey);
      document.body.style.overflow = "";
    };
  }, [open, loading, onCancel]);

  if (!open) return null;

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div
        className="absolute inset-0 bg-brand-950/40 backdrop-blur-sm"
        onClick={loading ? undefined : onCancel}
      />
      <div
        ref={panelRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="confirm-dialog-title"
        className="relative z-10 w-full max-w-[420px] rounded-pvs border border-line bg-white p-6 shadow-card"
      >
        <div className="flex items-start gap-4">
          <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-full bg-red-50 text-red-500">
            <TrashIcon size={18} />
          </div>
          <div className="min-w-0 flex-1">
            <h2
              id="confirm-dialog-title"
              className="font-serif text-[16px] font-bold text-brand-900"
            >
              {title}
            </h2>
            <p className="mt-1 text-[13.5px] leading-relaxed text-ink-500">
              {message}
            </p>
          </div>
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            aria-label="Fermer"
            className="flex h-8 w-8 shrink-0 items-center justify-center rounded-[8px] text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-900 disabled:opacity-50"
          >
            <XIcon size={16} />
          </button>
        </div>

        <div className="mt-6 flex justify-end gap-3">
          <button
            type="button"
            onClick={onCancel}
            disabled={loading}
            className="rounded-[10px] border border-line bg-white px-4 py-2.5 text-[13.5px] font-bold text-brand-900 transition-colors hover:bg-brand-50 disabled:opacity-60"
          >
            Annuler
          </button>
          <button
            type="button"
            onClick={onConfirm}
            disabled={loading}
            className="inline-flex items-center gap-2 rounded-[10px] bg-red-600 px-4 py-2.5 text-[13.5px] font-bold text-white transition-colors hover:bg-red-700 disabled:opacity-60"
          >
            {loading && (
              <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
            )}
            {confirmLabel}
          </button>
        </div>
      </div>
    </div>
  );
}
