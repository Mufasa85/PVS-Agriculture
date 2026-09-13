"use client";

import { Menu } from "lucide-react";

import GlobalSearch from "@/components/admin/GlobalSearch";
import NotificationBell from "@/components/admin/NotificationBell";

function getDateFr(): string {
  return new Date().toLocaleDateString("fr-FR", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  });
}

export default function AdminTopBar({
  userName,
  userRole,
}: {
  userName: string;
  userRole: string;
}) {
  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <header className="flex items-center justify-between rounded-[16px] border border-white/50 bg-white/70 px-4 py-3 shadow-soft backdrop-blur-xl nav:px-8 nav:py-4">
      {/* Gauche : date (le titre de page est rendu par chaque page, pas ici,
          pour éviter le doublon « Vue d'ensemble » × 2) */}
      <p className="hidden text-[13px] font-semibold text-ink-500 first-letter:capitalize nav:block">
        {getDateFr()}
      </p>

      {/* Centre : recherche globale */}
      <GlobalSearch isSuperAdmin={userRole === "SUPER_ADMIN"} />

      {/* Droite : notifications + avatar */}
      <div className="flex items-center gap-3">
        <NotificationBell />

        {/* Avatar */}
        <div className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1 pl-1 shadow-soft nav:pr-3.5">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[11.5px] font-bold text-white shadow-sm">
            {initials || "PV"}
          </div>
          <div className="hidden nav:block">
            <p className="text-[12.5px] font-bold text-brand-900 leading-tight">
              {userName}
            </p>
            <p className="text-[10.5px] text-ink-500 leading-tight">
              {userRole}
            </p>
          </div>
        </div>

        {/* Bouton menu (mobile uniquement) */}
        <button
          type="button"
          onClick={() =>
            window.dispatchEvent(new CustomEvent("admin-sidebar-open"))
          }
          className="flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-brand-900 transition-all hover:border-brand-300 hover:bg-brand-50 active:scale-95 nav:hidden"
          aria-label="Ouvrir le menu"
        >
          <Menu size={19} />
        </button>
      </div>
    </header>
  );
}
