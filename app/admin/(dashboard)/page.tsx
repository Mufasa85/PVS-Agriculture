import Link from "next/link";

import { PackageIcon, UsersIcon, ActivityIcon, PlusIcon } from "@/components/ui/icons";
import { prisma } from "@/lib/prisma";
import { getCategoryLabels } from "@/lib/products";

export const dynamic = "force-dynamic";

function StatCard({
  label,
  value,
  icon: Icon,
  accent,
  href,
}: {
  label: string;
  value: number | string;
  icon: React.ComponentType<{ size?: number; className?: string }>;
  accent: string;
  href?: string;
}) {
  const inner = (
    <div className="flex items-center gap-4 rounded-pvs border border-line bg-white px-5 py-4 shadow-soft transition-shadow hover:shadow-card">
      <div className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-[10px] ${accent}`}>
        <Icon size={20} />
      </div>
      <div>
        <p className="text-[22px] font-bold leading-none text-brand-900">{value}</p>
        <p className="mt-1 text-[12.5px] font-semibold text-ink-500">{label}</p>
      </div>
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

export default async function AdminDashboardPage() {
  const [products, users, auditLogs, categoryLabels] = await Promise.all([
    prisma.product.findMany({
      where: { deletedAt: null },
      select: { id: true, isPublished: true, comingSoon: true, category: true, name: true },
    }),
    prisma.user.count(),
    prisma.auditLog.findMany({
      take: 8,
      orderBy: { createdAt: "desc" },
      include: { user: { select: { name: true } } },
    }),
    getCategoryLabels(),
  ]);

  const published = products.filter((p) => p.isPublished).length;
  const drafts = products.filter((p) => !p.isPublished).length;
  const comingSoon = products.filter((p) => p.comingSoon).length;

  const byCategory = products.reduce<Record<string, number>>((acc, p) => {
    acc[p.category] = (acc[p.category] ?? 0) + 1;
    return acc;
  }, {});

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 nav:flex-row nav:items-center nav:justify-between">
        <div>
          <h1 className="font-serif text-[26px] font-bold text-brand-900">Vue d'ensemble</h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            Suivez l'activité du catalogue et de l'équipe.
          </p>
        </div>
        <Link
          href="/admin/products/new"
          className="inline-flex items-center gap-2 rounded-[10px] bg-brand-600 px-4 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover"
        >
          <PlusIcon size={17} />
          Nouveau produit
        </Link>
      </div>

      {/* Stat cards */}
      <div className="grid grid-cols-2 gap-4 nav:grid-cols-4">
        <StatCard
          label="Produits actifs"
          value={published}
          icon={PackageIcon}
          accent="bg-brand-100 text-brand-700"
          href="/admin/products"
        />
        <StatCard
          label="Brouillons"
          value={drafts}
          icon={PackageIcon}
          accent="bg-amber-100 text-amber-700"
          href="/admin/products"
        />
        <StatCard
          label="À venir"
          value={comingSoon}
          icon={ActivityIcon}
          accent="bg-gold-500/15 text-gold-600"
          href="/admin/products"
        />
        <StatCard
          label="Utilisateurs"
          value={users}
          icon={UsersIcon}
          accent="bg-brand-100 text-brand-700"
          href="/admin/users"
        />
      </div>

      <div className="grid gap-6 nav:grid-cols-[1fr_320px]">
        {/* Répartition par catégorie */}
        <section className="rounded-pvs border border-line bg-white p-6 shadow-soft">
          <h2 className="mb-5 font-serif text-[18px] font-bold text-brand-900">
            Répartition par catégorie
          </h2>
          <div className="flex flex-col gap-4">
            {Object.entries(byCategory).map(([category, count]) => {
              const pct = products.length > 0 ? Math.round((count / products.length) * 100) : 0;
              return (
                <div key={category}>
                  <div className="mb-1.5 flex items-center justify-between text-[13px]">
                    <span className="font-semibold text-ink-700">
                      {categoryLabels[category] ?? category}
                    </span>
                    <span className="font-bold text-brand-900">{count}</span>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-brand-50">
                    <div
                      className="h-full rounded-full bg-brand-500 transition-all"
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>
              );
            })}
            {products.length === 0 && (
              <p className="text-[13.5px] text-ink-500">Aucun produit pour le moment.</p>
            )}
          </div>
        </section>

        {/* Activité récente */}
        <section className="rounded-pvs border border-line bg-white p-6 shadow-soft">
          <h2 className="mb-5 font-serif text-[18px] font-bold text-brand-900">
            Activité récente
          </h2>
          {auditLogs.length === 0 ? (
            <p className="text-[13.5px] text-ink-500">Aucune activité enregistrée.</p>
          ) : (
            <ul className="flex flex-col gap-4">
              {auditLogs.map((log) => (
                <li key={log.id} className="flex items-start gap-3">
                  <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-brand-50">
                    <ActivityIcon size={14} className="text-brand-600" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <p className="text-[12.5px] leading-snug text-ink-700">
                      <span className="font-bold text-brand-900">
                        {log.user?.name ?? "Système"}
                      </span>{" "}
                      {ACTION_LABELS[log.action] ?? log.action}
                    </p>
                    <p className="mt-0.5 text-[11px] text-ink-500">
                      {timeAgo(log.createdAt)}
                    </p>
                  </div>
                </li>
              ))}
            </ul>
          )}
        </section>
      </div>
    </div>
  );
}
