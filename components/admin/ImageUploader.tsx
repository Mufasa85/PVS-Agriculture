"use client";

import { useCallback, useRef, useState } from "react";

type ImageUploaderProps = {
  url: string;
  alt: string;
  onUrlChange: (url: string) => void;
  onAltChange: (alt: string) => void;
  onRemove?: () => void;
  label?: string;
  required?: boolean;
  compact?: boolean;
};

export default function ImageUploader({
  url,
  alt,
  onUrlChange,
  onAltChange,
  onRemove,
  label,
  required,
  compact,
}: ImageUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [dragOver, setDragOver] = useState(false);

  const handleFile = useCallback(async (file: File) => {
    setError(null);

    if (!file.type.startsWith("image/")) {
      setError("Veuillez sélectionner un fichier image.");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Le fichier dépasse la taille maximale de 5 Mo.");
      return;
    }

    setUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);

      const res = await fetch("/api/admin/upload", {
        method: "POST",
        body: formData,
      });

      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Échec de l'upload.");
        return;
      }

      onUrlChange(data.url);

      if (!alt && file.name) {
        const baseName = file.name.replace(/\.[^.]+$/, "").replace(/[-_]/g, " ");
        onAltChange(baseName);
      }
    } catch {
      setError("Une erreur est survenue pendant l'upload.");
    } finally {
      setUploading(false);
    }
  }, [alt, onUrlChange, onAltChange]);

  function handleDrop(e: React.DragEvent) {
    e.preventDefault();
    setDragOver(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  }

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
    e.target.value = "";
  }

  if (url) {
    return (
      <div className={`flex flex-col gap-2 ${compact ? "" : "gap-3"}`}>
        {label && (
          <label className="block text-[13px] font-bold text-brand-900">
            {label} {required && <span className="text-red-500">*</span>}
          </label>
        )}
        <div className={`flex gap-3 ${compact ? "items-center" : "items-start"}`}>
          <div className={`relative shrink-0 overflow-hidden rounded-[10px] border border-line bg-brand-50 ${compact ? "h-16 w-16" : "h-24 w-24"}`}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img src={url} alt={alt} className="h-full w-full object-cover" />
            <button
              type="button"
              onClick={() => onUrlChange("")}
              className="absolute right-1 top-1 flex h-5 w-5 items-center justify-center rounded-full bg-black/50 text-white transition-colors hover:bg-red-500"
              aria-label="Retirer l'image"
            >
              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M6 6l12 12M18 6L6 18" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" />
              </svg>
            </button>
          </div>
          <div className="flex flex-1 flex-col gap-2">
            <input
              value={alt}
              onChange={(e) => onAltChange(e.target.value)}
              placeholder="Texte alternatif"
              className="w-full rounded-[8px] border border-line bg-white px-3 py-2 text-[13px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            />
            <button
              type="button"
              onClick={() => inputRef.current?.click()}
              className="inline-flex w-fit items-center gap-1.5 text-[12px] font-semibold text-brand-600 transition-colors hover:text-brand-700"
            >
              <svg width="13" height="13" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 5v14M5 12h14" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
              Remplacer
            </button>
            {onRemove && !compact && (
              <button
                type="button"
                onClick={onRemove}
                className="inline-flex w-fit items-center gap-1.5 text-[12px] font-semibold text-red-500 transition-colors hover:text-red-600"
              >
                Supprimer
              </button>
            )}
          </div>
        </div>
        <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2">
      {label && (
        <label className="block text-[13px] font-bold text-brand-900">
          {label} {required && <span className="text-red-500">*</span>}
        </label>
      )}
      <div
        onDragOver={(e) => { e.preventDefault(); setDragOver(true); }}
        onDragLeave={() => setDragOver(false)}
        onDrop={handleDrop}
        onClick={() => inputRef.current?.click()}
        className={`flex cursor-pointer flex-col items-center justify-center rounded-[12px] border-2 border-dashed px-4 py-6 text-center transition-all ${
          dragOver
            ? "border-brand-500 bg-brand-50"
            : "border-line bg-white hover:border-brand-300 hover:bg-brand-50/40"
        }`}
      >
        {uploading ? (
          <div className="flex flex-col items-center gap-2">
            <div className="h-7 w-7 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
            <p className="text-[12.5px] font-medium text-ink-500">Upload en cours…</p>
          </div>
        ) : (
          <div className="flex flex-col items-center gap-2">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-brand-50">
              <svg width="20" height="20" viewBox="0 0 24 24" fill="none" aria-hidden>
                <path d="M12 16V4m0 0L8 8m4-4l4 4M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2"
                  stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" strokeLinejoin="round" />
              </svg>
            </div>
            <div>
              <p className="text-[13px] font-semibold text-brand-700">
                Cliquez ou glissez une image
              </p>
              <p className="mt-0.5 text-[11.5px] text-ink-500">
                JPG, PNG, WebP — 5 Mo max
              </p>
            </div>
          </div>
        )}
      </div>
      {error && (
        <p className="text-[12px] font-medium text-red-500">{error}</p>
      )}
      <input ref={inputRef} type="file" accept="image/*" onChange={handleInputChange} className="hidden" />
    </div>
  );
}
