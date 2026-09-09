"use client";

import { usePathname } from "next/navigation";

const PAGE_TITLES: Record<string, { title: string; subtitle: string }> = {
  "/admin": {
    title: "Vue d'ensemble",
    subtitle: "Suivez l'activité du catalogue et de l'équipe.",
  },
  "/admin/products": {
    title: "Produits & tarifs",
    subtitle: "Gérez votre catalogue de produits.",
  },
  "/admin/categories": {
    title: "Catégories",
    subtitle: "Organisez les catégories du catalogue.",
  },
  "/admin/users": {
    title: "Utilisateurs",
    subtitle: "Gérez les membres de l'équipe.",
  },
};

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
  const pathname = usePathname();

  // Trouver la page courante (exact match, sinon préfixe)
  const info =
    PAGE_TITLES[pathname] ??
    Object.entries(PAGE_TITLES)
      .filter(([key]) => key !== "/admin" && pathname.startsWith(key))
      .map(([, val]) => val)[0];

  const initials = userName
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");

  return (
    <header className="flex items-center justify-between rounded-[16px] border border-white/50 bg-white/70 px-4 py-3 shadow-soft backdrop-blur-xl nav:px-8 nav:py-4">
      {/* Gauche : titre + date */}
      <div>
        {info && (
          <h1 className="font-serif text-[18px] font-bold leading-tight text-brand-900 nav:text-[22px]">
            {info.title}
          </h1>
        )}
        <p className="mt-0.5 hidden text-[12.5px] text-ink-500 first-letter:capitalize nav:block">
          {getDateFr()}
        </p>
      </div>

      {/* Droite : notifications + avatar */}
      <div className="flex items-center gap-3">
        {/* Notification bell (décorative) */}
        <button
          type="button"
          className="relative flex h-9 w-9 items-center justify-center rounded-full border border-line bg-white text-ink-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
          aria-label="Notifications"
        >
          <svg
            width="17"
            height="17"
            viewBox="0 0 24 24"
            fill="none"
            aria-hidden="true"
          >
            <path
              d="M18 8A6 6 0 006 8c0 7-3 9-3 9h18s-3-2-3-9M13.73 21a2 2 0 01-3.46 0"
              stroke="currentColor"
              strokeWidth="1.7"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>
          {/* Pastille */}
          <span className="absolute right-1.5 top-1.5 h-2 w-2 rounded-full bg-brand-500 ring-2 ring-white" />
        </button>

        {/* Avatar */}
        <div className="flex items-center gap-2.5 rounded-full border border-line bg-white py-1 pl-1 pr-3.5 shadow-soft">
          <div className="flex h-7 w-7 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[11.5px] font-bold text-white shadow-sm">
            {initials || "PV"}
          </div>
          <div>
            <p className="text-[12.5px] font-bold text-brand-900 leading-tight">
              {userName}
            </p>
            <p className="text-[10.5px] text-ink-500 leading-tight">{userRole}</p>
          </div>
        </div>
      </div>
    </header>
  );
}
