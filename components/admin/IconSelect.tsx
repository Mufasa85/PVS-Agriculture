"use client";

import { useEffect, useRef, useState } from "react";

import { CategoryIcon, ICON_OPTIONS } from "@/components/admin/CategoryIcon";
import { ChevronDownIcon } from "@/components/ui/icons";

export default function IconSelect({
  value,
  onChange,
}: {
  value: string;
  onChange: (icon: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selectedLabel =
    ICON_OPTIONS.find((opt) => opt.value === value)?.label ?? "Icône";

  useEffect(() => {
    if (!open) return;
    function handleClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    function handleEscape(e: KeyboardEvent) {
      if (e.key === "Escape") setOpen(false);
    }
    document.addEventListener("mousedown", handleClickOutside);
    document.addEventListener("keydown", handleEscape);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
      document.removeEventListener("keydown", handleEscape);
    };
  }, [open]);

  return (
    <div ref={containerRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((prev) => !prev)}
        className="flex w-full items-center justify-between gap-2 rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
      >
        <span className="flex items-center gap-2.5">
          <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-brand-50 text-brand-600">
            <CategoryIcon icon={value} size={15} />
          </span>
          <span className="font-medium">{selectedLabel}</span>
        </span>
        <ChevronDownIcon
          size={18}
          className={`shrink-0 text-ink-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-30 mt-1.5 w-full rounded-[10px] border border-line bg-white p-2 shadow-card">
          <div className="grid max-h-64 grid-cols-6 gap-1 overflow-y-auto sm:grid-cols-7">
            {ICON_OPTIONS.map((opt) => {
              const isActive = opt.value === value;
              return (
                <button
                  key={opt.value}
                  type="button"
                  title={opt.label}
                  onClick={() => {
                    onChange(opt.value);
                    setOpen(false);
                  }}
                  className={`flex h-10 w-10 items-center justify-center rounded-[8px] transition-colors ${
                    isActive
                      ? "bg-brand-600 text-white"
                      : "text-brand-600 hover:bg-brand-50"
                  }`}
                >
                  <CategoryIcon icon={opt.value} size={18} />
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}
