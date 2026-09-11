"use client";

import { useEffect, useRef, useState } from "react";

import { CategoryIcon } from "@/components/admin/CategoryIcon";
import { ChevronDownIcon } from "@/components/ui/icons";
import type { CategoryInfo } from "@/lib/products";

export default function CategorySelect({
  value,
  categories,
  onChange,
}: {
  value: string;
  categories: CategoryInfo[];
  onChange: (slug: string) => void;
}) {
  const [open, setOpen] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  const selected = categories.find((c) => c.slug === value) ?? categories[0];

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
            <CategoryIcon icon={selected?.icon ?? "sprout"} size={15} />
          </span>
          <span className="font-medium">{selected?.name ?? "—"}</span>
        </span>
        <ChevronDownIcon
          size={18}
          className={`shrink-0 text-ink-500 transition-transform duration-200 ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <ul
          className="absolute z-30 mt-1.5 max-h-64 w-full overflow-y-auto rounded-[10px] border border-line bg-white py-1.5 shadow-card"
          role="listbox"
        >
          {categories.map((cat) => {
            const isActive = cat.slug === value;
            return (
              <li key={cat.slug} role="option" aria-selected={isActive}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(cat.slug);
                    setOpen(false);
                  }}
                  className={`flex w-full items-center gap-2.5 px-3 py-2.5 text-left text-[14px] transition-colors hover:bg-brand-50 ${
                    isActive ? "bg-brand-50/60 font-bold text-brand-900" : "text-ink-700"
                  }`}
                >
                  <span className="flex h-6 w-6 shrink-0 items-center justify-center rounded-[8px] bg-brand-50 text-brand-600">
                    <CategoryIcon icon={cat.icon} size={15} />
                  </span>
                  <span className="truncate">{cat.name}</span>
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
