"use client";

import { useEffect, useState } from "react";
import type { ComponentType } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";

import {
  BarChartIcon,
  ExternalLinkIcon,
  GridIcon,
  LogoutIcon,
  MailIcon,
  MenuIcon,
  PackageIcon,
  ShieldIcon,
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
  { href: "/admin/analytics", label: "Analytics & Suivi", icon: BarChartIcon },
  { href: "/admin/products", label: "Produits & tarifs", icon: PackageIcon },
  { href: "/admin/categories", label: "Catégories", icon: TagIcon },
  { href: "/admin/messages", label: "Messages", icon: MailIcon },
  { href: "/admin/audit-logs", label: "Journal d'audit", icon: ShieldIcon },
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
          ? "bg-brand-50 text-brand-600"
          : "text-ink-500 hover:bg-brand-50/60 hover:text-brand-700"
      }`}
    >
      {/* Trait gauche actif */}
      <span
        className={`absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-full bg-brand-500 transition-opacity ${
          active ? "opacity-100" : "opacity-0"
        }`}
      />
      <Icon
        size={18}
        className={
          active
            ? "text-brand-600"
            : "text-ink-500/70 group-hover:text-brand-500"
        }
      />
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
      {/* Logo & titre */}
      <div className="flex items-center gap-3 border-b border-line px-6 py-5">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-600 font-serif text-[13px] font-bold text-white shadow-brand">
          PVS
        </div>
        <div>
          <p className="font-serif text-[15px] font-bold leading-tight text-brand-900">
            Espace admin
          </p>
          <p className="text-[11px] font-semibold uppercase tracking-[0.08em] text-ink-500">
            PVS-ONGD
          </p>
        </div>
        {/* Bouton fermer (mobile) */}
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="ml-auto flex h-8 w-8 items-center justify-center rounded-full text-ink-500 hover:bg-brand-50 hover:text-brand-700 nav:hidden"
          aria-label="Fermer le menu"
        >
          <XIcon size={18} />
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex flex-1 flex-col gap-1 px-4 pt-5">
        <p className="mb-2 px-3.5 text-[10.5px] font-bold uppercase tracking-[0.12em] text-ink-500/50">
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

      {/* Pied de sidebar */}
      <div className="mt-auto border-t border-line px-4 py-4">
        <Link
          href="/"
          target="_blank"
          className="flex items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[13px] font-semibold text-ink-500 transition-colors hover:bg-brand-50 hover:text-brand-700"
        >
          <ExternalLinkIcon size={17} className="text-ink-500/60" />
          Voir le site public
        </Link>

        {/* Profil utilisateur */}
        <div className="mt-3 flex items-center gap-3 rounded-[12px] bg-brand-50 px-3.5 py-3">
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-gradient-to-br from-brand-500 to-brand-700 text-[12px] font-bold text-white shadow-sm">
            {initials(user.name) || "PV"}
          </div>
          <div className="min-w-0 flex-1">
            <p className="truncate text-[13px] font-bold text-brand-900">
              {user.name}
            </p>
            <p className="truncate text-[11px] text-ink-500">
              {ROLE_LABELS[user.role] ?? user.role}
            </p>
          </div>
          <LogoutTrigger compact />
        </div>
      </div>
    </div>
  );

  return (
    <>
      {/* Barre mobile */}
      <div className="sticky top-0 z-30 flex items-center gap-3 border-b border-line bg-white px-5 py-3.5 shadow-soft nav:hidden">
        <button
          type="button"
          onClick={() => setOpen(true)}
          className="flex h-9 w-9 items-center justify-center rounded-[10px] border border-line text-brand-900 hover:border-brand-300 hover:bg-brand-50"
          aria-label="Ouvrir le menu"
        >
          <MenuIcon size={19} />
        </button>
        <div className="flex items-center gap-2">
          <div className="flex h-7 w-7 items-center justify-center rounded-[8px] bg-brand-600 font-serif text-[11px] font-bold text-white">
            PVS
          </div>
          <span className="font-serif text-[15px] font-bold text-brand-900">
            Espace admin
          </span>
        </div>
      </div>

      {/* Sidebar desktop */}
      <aside className="fixed inset-y-0 left-0 z-30 hidden w-[248px] border-r border-line bg-white shadow-soft nav:block">
        {sidebarContent}
      </aside>

      {/* Drawer mobile */}
      {open && (
        <div className="fixed inset-0 z-40 nav:hidden">
          <div
            className="absolute inset-0 bg-brand-900/30 backdrop-blur-sm"
            onClick={() => setOpen(false)}
            aria-hidden="true"
          />
          <aside className="absolute inset-y-0 left-0 w-[280px] bg-white shadow-float">
            {sidebarContent}
          </aside>
        </div>
      )}
    </>
  );
}

function LogoutTrigger({ compact }: { compact?: boolean }) {
  async function handleLogout() {
    await fetch("/api/admin/logout", { method: "POST" });
    window.location.href = "/admin/login";
  }

  if (compact) {
    return (
      <button
        type="button"
        onClick={handleLogout}
        title="Se déconnecter"
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-[8px] text-ink-500 transition-colors hover:bg-red-50 hover:text-red-500"
        aria-label="Se déconnecter"
      >
        <LogoutIcon size={15} />
      </button>
    );
  }

  return (
    <button
      type="button"
      onClick={handleLogout}
      className="mt-3 flex w-full items-center gap-3 rounded-[10px] px-3.5 py-2.5 text-[13.5px] font-semibold text-ink-500 transition-colors hover:bg-red-50 hover:text-red-500"
    >
      <LogoutIcon size={18} className="text-ink-500/60" />
      Se déconnecter
    </button>
  );
}
