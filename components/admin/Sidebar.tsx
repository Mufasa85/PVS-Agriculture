"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  ExternalLinkIcon,
  GridIcon,
  LogoutIcon,
  MenuIcon,
  PackageIcon,
  TagIcon,
  UsersIcon,
  XIcon,
} from "@/components/ui/icons";

type NavItem = {
  href: string;
  label: string;
  icon: ComponentType<{ size?: number; className?: string }>;
  exact?: boolean;
};

const PRIMARY_NAV: NavItem[] = [
  { href: "/admin", label: "Vue d'ensemble", icon: GridIcon, exact: true },
  { href: "/admin/products", label: "Produits & tarifs", icon: PackageIcon },
  { href: "/admin/categories", label: "Catégories", icon: TagIcon },
];

const TEAM_NAV: NavItem = {
  href: "/admin/users",
  label: "Utilisateurs",
  icon: UsersIcon,
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  EDITOR: "Éditeur",
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((part) => part[0]?.toUpperCase())
    .join("");
}

function NavLink({
  item,
  active,
  onNavigate,
}: {
  item: NavItem;
  active: boolean;
  onNavigate: () => void;
}) {
  const Icon = item.icon;
  return (
    <Link
      href={item.href}
      onClick={onNavigate}
      className={`group relative flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[13.5px] font-semibold transition-all duration-200 ${
        active
          ? "bg-white/10 text-white"
          : "text-white/55 hover:bg-white/5 hover:text-white/90"
      }`}
    >
      <span
        className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-gold-500 transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
      <Icon size={18} className={active ? "text-gold-500" : "text-white/40 group-hover:text-white/70"} />
      {item.label}
    </Link>
  );
}

export default function Sidebar({
  isSuperAdmin,
  user,
}: {
  isSuperAdmin: boolean;
  user: { name: string; email: string; role: string };
}) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);

  useEffect(() => {
    setOpen(false);
  }, [pathname]);

  const navItems = isSuperAdmin ? [...PRIMARY_NAV, TEAM_NAV] : PRIMARY_NAV;

  function isActive(item: NavItem) {
    if (item.exact) return pathname === item.href;
    return pathname === item.href || pathname.startsWith(`${item.href}/`);
  }

  const sidebarContent = (
    <div className="flex h-full flex-col">
      <div className="flex items-center gap-3 px-6 py-7">
        <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-gold-500 font-serif text-[16px] font-bold text-brand-900">
          PVS
        </div>
        <div>
          <p className="font-serif text-[16px] font-bold leading-tight text-white">Espace admin</p>
          <p className="text-[11.5px] font-semibold uppercase tracking-[0.08em] text-white/40">
            PVS-ONGD
          </p>
        </div>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-white/60 hover:bg-white/10 hover:text-white nav:hidden"
          aria-label="Fermer le menu"
        >
          <XIcon size={18} />
        </button>
      </div>

      <nav className="flex flex-1 flex-col gap-1.5 px-4">
        <p className="mb-1 px-3.5 text-[11px] font-bold uppercase tracking-[0.12em] text-white/30">
          Pilotage
        </p>
        {navItems.map((item) => (
          <NavLink
            key={item.href}
            item={item}
            active={isActive(item)}
            onNavigate={() => setOpen(false)}
          />
        ))}
      </nav>

      <div className="mt-auto border-t border-white/10 px-4 py-5">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[13.5px] font-semibold text-white/55 transition-colors hover:bg-white/5 hover:text-white/90"
        >
          <ExternalLinkIcon size={18} className="text-white/40" />
          Voir le site public
        </Link>

        <div className="mt-4 flex items-center gap-3 rounded-[12px] bg-white/5 px-3.5 py-3">
          <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-gold-500 to-gold-600 text-[12.5px] font-bold text-brand-900">
            {initials(user.name) || "PV"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-white">{user.name}</p>
            <p className="truncate text-[11.5px] text-white/40">
              {ROLE_LABELS[user.role] ?? user.role}
            </p>
          </div>
        </div>

        <LogoutTrigger />
      </div>
    </div>
  );

  return (
    <>
      {/* Barre mobile */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-5 py-3.5 nav:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line text-brand-900"
          aria-label="Ouvrir le menu"
        >
          <MenuIcon size={19} />
        </button>
        <span className="font-serif text-[16px] font-bold text-brand-900">Espace admin</span>
      </div>

      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[264px] bg-brand-900 nav:block">
        {sidebarContent}
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-40 nav:hidden">
          <div
            className="absolute inset-0 bg-brand-900/60"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-brand-900 shadow-float">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

function LogoutTrigger() {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-3 flex w-full items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[13.5px] font-semibold text-white/55 transition-colors hover:bg-white/5 hover:text-white"
    >
      <LogoutIcon size={18} className="text-white/40" />
      Se déconnecter
    </button>
  );
}
