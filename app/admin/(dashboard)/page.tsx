import Link from "next/link";

import { Activity, Package, Plus, Tag, Users } from "lucide-react";

import { CategoryIcon } from "@/components/admin/CategoryIcon";
import { prisma } from "@/lib/prisma";
import { getAllCategories } from "@/lib/products";

export const dynamic = "force-dynamic";

/* ─────────────────────────── Types ────────────────────────────── */

const ACTION_LABELS: Record<string, string> = {
  PRODUCT_CREATE: "a créé un produit",
  PRODUCT_UPDATE: "a modifié un produit",
  PRODUCT_DELETE: "a supprimé un produit",
  CATEGORY_CREATE: "a créé une catégorie",
  CATEGORY_UPDATE: "a modifié une catégorie",
  CATEGORY_DELETE: "a supprimé une catégorie",
  USER_CREATE: "a créé un utilisateur",
  USER_UPDATE: "a modifié un utilisateur",
  USER_DELETE: "a supprimé un utilisateur",
  LOGIN: "s'est connecté",
  LOGOUT: "s'est déconnecté",
};

const ACTION_COLORS: Record<string, string> = {
  PRODUCT_CREATE: "bg-green-50 text-green-600",
  PRODUCT_UPDATE: "bg-brand-50 text-brand-600",
  PRODUCT_DELETE: "bg-red-50 text-red-500",
  CATEGORY_CREATE: "bg-amber-50 text-amber-600",
  CATEGORY_UPDATE: "bg-amber-50 text-amber-600",
  CATEGORY_DELETE: "bg-red-50 text-red-500",
  USER_CREATE: "bg-purple-50 text-purple-600",
  USER_UPDATE: "bg-purple-50 text-purple-600",
  USER_DELETE: "bg-red-50 text-red-500",
  LOGIN: "bg-brand-50 text-brand-600",
  LOGOUT: "bg-ink-100 text-ink-500",
};

function timeAgo(date: Date): string {
  const seconds = Math.floor((Date.now() - date.getTime()) / 1000);
  if (seconds < 60) return "à l'instant";
  const minutes = Math.floor(seconds / 60);
  if (minutes < 60) return `il y a ${minutes} min`;
  const hours = Math.floor(minutes / 60);
  if (hours < 24) return `il y a ${hours} h`;
  const days = Math.floor(hours / 24);
  if (days < 30) return `il y a ${days} j`;
  return date.toLocaleDateString("fr-FR");
}

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

/* ─────────────────────── KPI Card ──────────────────────────────── */

function KpiCard({
  label,
  value,
  icon: Icon,
  iconBg,
  iconColor,
  href,
  badge,
  badgeColor,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  iconBg: string;
  iconColor: string;
  href?: string;
  badge?: string;
  badgeColor?: string;
}) {
  const inner = (
    <div className="group relative overflow-hidden rounded-[16px] border border-line bg-white p-5 shadow-soft transition-all duration-300 hover:shadow-card hover:-translate-y-0.5">
      {/* Icône */}
      <div className={`mb-4 inline-flex h-10 w-10 items-center justify-center rounded-[12px] ${iconBg}`}>
        <Icon size={19} className={iconColor} />
      </div>

      {/* Valeur principale */}
      <p className="text-[28px] font-bold leading-none text-brand-900 font-serif">
        {value}
      </p>

      {/* Label + badge */}
      <div className="mt-2 flex items-center justify-between gap-2">
        <p className="text-[13px] font-medium text-ink-500">{label}</p>
        {badge && (
          <span className={`rounded-full px-2 py-0.5 text-[10.5px] font-bold ${badgeColor}`}>
            {badge}
          </span>
        )}
      </div>

      {/* Décor coin */}
      <div className={`absolute -right-3 -top-3 h-16 w-16 rounded-full opacity-[0.07] ${iconBg}`} />
    </div>
  );

  if (href) {
    return (
      <Link href={href} className="block">
        {inner}
      </Link>
    );
  }
  return inner;
}

/* ─────────────────────── Page principale ───────────────────────── */

export default async function AdminDashboardPage() {
  const [products, users, auditLogs, categories] = await Promise.all([
    prisma.product.findMany({
      where: { deletedAt: null },
      select: {
        id: true,
        isPublished: true,
        comingSoon: true,
        category: true,
        name: true,
      },
    }),
    prisma.user.count(),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    getAllCategories(),
  ]);

  const categoryMap = new Map(categories.map((c) => [c.slug, c]));

  const published = products.filter((p) => p.isPublished).length;
  const drafts = products.filter((p) => !p.isPublished).length;
  const comingSoon = products.filter((p) => p.comingSoon).length;
  const total = products.length;

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-7">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 nav:flex-row nav:items-center nav:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-500">
            Administration
          </p>
          <h1 className="mt-1 font-serif text-[24px] font-bold text-brand-900">
            Vue d'ensemble
          </h1>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-[10px] bg-brand-600 px-4 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover hover:-translate-y-0.5"
        >
          <Plus size={16} />
          Nouveau produit
        </Link>
      </div>

      {/* ── KPI Cards ── */}
      <div className="grid grid-cols-2 gap-4 nav:grid-cols-4">
        <KpiCard
          label="Produits actifs"
          value={published}
          icon={Package}
          iconBg="bg-brand-100"
          iconColor="text-brand-600"
          href="/admin/products"
          badge="Publiés"
          badgeColor="bg-brand-100 text-brand-600"
        />
        <KpiCard
          label="Brouillons"
          value={drafts}
          icon={Package}
          iconBg="bg-amber-100"
          iconColor="text-amber-600"
          href="/admin/products"
          badge="En cours"
          badgeColor="bg-amber-100 text-amber-600"
        />
        <KpiCard
          label="À venir"
          value={comingSoon}
          icon={Activity}
          iconBg="bg-gold-500/15"
          iconColor="text-gold-600"
          href="/admin/products"
          badge="Bientôt"
          badgeColor="bg-gold-500/15 text-gold-600"
        />
        <KpiCard
          label="Utilisateurs"
          value={users}
          icon={Users}
          iconBg="bg-purple-50"
          iconColor="text-purple-600"
          href="/admin/users"
          badge="Actifs"
          badgeColor="bg-purple-100 text-purple-600"
        />
      </div>

      {/* ── Grille principale ── */}
      <div className="grid gap-6 nav:grid-cols-[1fr_340px]">

        {/* Répartition par catégorie */}
        <section className="rounded-[16px] border border-line bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center justify-between">
            <div className="flex items-center gap-2.5">
              <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand-50">
                <Tag size={16} className="text-brand-600" />
              </div>
              <h2 className="font-serif text-[17px] font-bold text-brand-900">
                Répartition par catégorie
              </h2>
            </div>
            <span className="rounded-full bg-brand-50 px-2.5 py-1 text-[11px] font-bold text-brand-600">
              {total} total
            </span>
          </div>

          {products.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <div className="mb-3 flex h-12 w-12 items-center justify-center rounded-full bg-brand-50">
                <Package size={22} className="text-brand-400" />
              </div>
              <p className="text-[13.5px] text-ink-500">Aucun produit pour le moment.</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4">
              {Object.entries(byCategory).map(([category, count]) => {
                const pct = total > 0 ? Math.round((count / total) * 100) : 0;
                return (
                  <div key={category}>
                    <div className="mb-2 flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <CategoryIcon icon={categoryMap.get(category)?.icon ?? "sprout"} size={15} className="text-brand-600" />
                        <span className="text-[13.5px] font-semibold text-ink-700">
                          {categoryMap.get(category)?.name ?? category}
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-[12px] font-medium text-ink-500">
                          {pct}%
                        </span>
                        <span className="min-w-[28px] rounded-full bg-brand-50 px-2 py-0.5 text-center text-[11.5px] font-bold text-brand-700">
                          {count}
                        </span>
                      </div>
                    </div>
                    <div className="h-1.5 overflow-hidden rounded-full bg-brand-50">
                      <div
                        className="h-full rounded-full bg-gradient-to-r from-brand-400 to-brand-600 transition-all duration-700"
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </section>

        {/* Activité récente */}
        <section className="rounded-[16px] border border-line bg-white p-6 shadow-soft">
          <div className="mb-5 flex items-center gap-2.5">
            <div className="flex h-8 w-8 items-center justify-center rounded-[10px] bg-brand-50">
              <Activity size={16} className="text-brand-600" />
            </div>
            <h2 className="font-serif text-[17px] font-bold text-brand-900">
              Activité récente
            </h2>
          </div>

          {auditLogs.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-10 text-center">
              <p className="text-[13.5px] text-ink-500">Aucune activité enregistrée.</p>
            </div>
          ) : (
            <ul className="flex flex-col">
              {auditLogs.map((log, i) => {
                const colorClass = ACTION_COLORS[log.action] ?? "bg-brand-50 text-brand-600";
                const isLast = i === auditLogs.length - 1;
                const userName = log.user?.name ?? "Système";
                return (
                  <li key={log.id} className="relative flex gap-3 pb-4">
                    {/* Ligne verticale (timeline) */}
                    {!isLast && (
                      <span className="absolute left-4 top-8 h-full w-px bg-line" />
                    )}

                    {/* Avatar initiales */}
                    <div
                      className={`relative z-10 mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-full text-[11px] font-bold ${colorClass}`}
                    >
                      {initials(userName) || "S"}
                    </div>

                    {/* Contenu */}
                    <div className="min-w-0 flex-1 pt-0.5">
                      <p className="text-[12.5px] leading-snug text-ink-700">
                        <span className="font-bold text-brand-900">{userName}</span>{" "}
                        {ACTION_LABELS[log.action] ?? log.action}
                      </p>
                      <p className="mt-0.5 text-[11px] text-ink-500">
                        {timeAgo(log.createdAt)}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ul>
          )}

          <div className="mt-2 border-t border-line pt-3">
            <Link
              href="/admin/products"
              className="text-[12.5px] font-semibold text-brand-600 hover:text-brand-700"
            >
              Voir tous les produits →
            </Link>
          </div>
        </section>
      </div>

      {/* ── Accès rapides ── */}
      <section className="grid grid-cols-1 gap-4 nav:grid-cols-3">
        {[
          {
            href: "/admin/products/new",
            icon: Package,
            label: "Ajouter un produit",
            desc: "Créer une nouvelle fiche produit",
            color: "bg-brand-50",
            iconColor: "text-brand-600",
          },
          {
            href: "/admin/categories",
            icon: Tag,
            label: "Gérer les catégories",
            desc: "Organiser le catalogue",
            color: "bg-amber-50",
            iconColor: "text-amber-600",
          },
          {
            href: "/admin/users",
            icon: Users,
            label: "Gérer les utilisateurs",
            desc: "Équipe et permissions",
            color: "bg-purple-50",
            iconColor: "text-purple-600",
          },
        ].map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className="flex items-center gap-4 rounded-[14px] border border-line bg-white p-4 shadow-soft transition-all hover:shadow-card hover:-translate-y-0.5"
          >
            <div className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-[12px] ${item.color}`}>
              <item.icon size={19} className={item.iconColor} />
            </div>
            <div>
              <p className="text-[13.5px] font-bold text-brand-900">{item.label}</p>
              <p className="text-[12px] text-ink-500">{item.desc}</p>
            </div>
          </Link>
        ))}
      </section>
    </div>
  );
}
