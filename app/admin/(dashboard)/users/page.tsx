import Link from "next/link";

import DeleteUserButton from "@/components/admin/DeleteUserButton";
import { PlusIcon, PencilIcon, UsersIcon } from "@/components/ui/icons";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  EDITOR: "Éditeur",
};

const ROLE_BADGE: Record<string, string> = {
  SUPER_ADMIN: "bg-gold-500/15 text-gold-600",
  ADMIN: "bg-brand-100 text-brand-600",
  EDITOR: "bg-ink-100 text-ink-500",
};

const ROLE_AVATAR: Record<string, string> = {
  SUPER_ADMIN: "from-gold-500 to-gold-600",
  ADMIN: "from-brand-500 to-brand-700",
  EDITOR: "from-ink-500 to-ink-700",
};

function initials(name: string): string {
  return name
    .split(" ")
    .filter(Boolean)
    .slice(0, 2)
    .map((p) => p[0]?.toUpperCase())
    .join("");
}

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

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "asc" }],
  });

  const activeCount = users.filter((u) => u.isActive).length;
  const adminCount = users.filter(
    (u) => u.role === "ADMIN" || u.role === "SUPER_ADMIN"
  ).length;

  return (
    <div className="flex flex-col gap-6">
      {/* ── Header ── */}
      <div className="flex flex-col gap-3 nav:flex-row nav:items-center nav:justify-between">
        <div>
          <p className="text-[12px] font-bold uppercase tracking-[0.12em] text-brand-500">
            Équipe
          </p>
          <h1 className="mt-1 font-serif text-[24px] font-bold text-brand-900">
            Utilisateurs
          </h1>
          <p className="mt-1 text-[13px] text-ink-500">
            {users.length} membre{users.length > 1 ? "s" : ""} d'équipe
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 rounded-[10px] bg-brand-600 px-4 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover hover:-translate-y-0.5"
        >
          <PlusIcon size={17} />
          Nouvel utilisateur
        </Link>
      </div>

      {/* ── Stats ── */}
      <div className="grid grid-cols-3 gap-4">
        {[
          { label: "Total membres", value: users.length, color: "text-brand-600" },
          { label: "Actifs", value: activeCount, color: "text-green-600" },
          { label: "Admins", value: adminCount, color: "text-gold-600" },
        ].map((s) => (
          <div
            key={s.label}
            className="rounded-[14px] border border-line bg-white p-4 shadow-soft"
          >
            <p className={`text-[22px] font-bold font-serif ${s.color}`}>
              {s.value}
            </p>
            <p className="text-[12px] text-ink-500">{s.label}</p>
          </div>
        ))}
      </div>

      {/* ── Table ── */}
      <div className="overflow-hidden rounded-[16px] border border-line bg-white shadow-soft">
        {/* Toolbar */}
        <div className="flex items-center justify-between border-b border-line px-5 py-3.5">
          <div className="flex items-center gap-2">
            <UsersIcon size={15} className="text-ink-500" />
            <span className="text-[13px] font-semibold text-ink-700">
              {users.length} utilisateur{users.length > 1 ? "s" : ""}
            </span>
          </div>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full min-w-[640px]">
            <thead>
              <tr className="border-b border-line bg-[#f8f9fc]">
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                  Membre
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                  Rôle
                </th>
                <th className="px-5 py-3 text-center text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                  Statut
                </th>
                <th className="px-5 py-3 text-left text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500 hidden nav:table-cell">
                  Dernière connexion
                </th>
                <th className="px-5 py-3 text-right text-[11px] font-bold uppercase tracking-[0.06em] text-ink-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => {
                const avatarGradient =
                  ROLE_AVATAR[user.role] ?? "from-ink-500 to-ink-700";
                return (
                  <tr
                    key={user.id}
                    className="border-b border-line/60 transition-colors last:border-0 hover:bg-brand-50/30"
                  >
                    {/* Membre : avatar + nom + email */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div
                          className={`flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-gradient-to-br ${avatarGradient} text-[12px] font-bold text-white shadow-sm`}
                        >
                          {initials(user.name) || "U"}
                        </div>
                        <div className="min-w-0">
                          <p className="truncate text-[13.5px] font-bold text-brand-900">
                            {user.name}
                          </p>
                          <p className="truncate text-[11.5px] text-ink-500">
                            {user.email}
                          </p>
                        </div>
                      </div>
                    </td>

                    {/* Rôle */}
                    <td className="px-5 py-4">
                      <span
                        className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${
                          ROLE_BADGE[user.role] ?? "bg-ink-100 text-ink-500"
                        }`}
                      >
                        {ROLE_LABELS[user.role] ?? user.role}
                      </span>
                    </td>

                    {/* Statut */}
                    <td className="px-5 py-4 text-center">
                      {user.isActive ? (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-[11.5px] font-bold text-green-700">
                          <span className="h-1.5 w-1.5 rounded-full bg-green-500" />
                          Actif
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-[11.5px] font-bold text-red-500">
                          <span className="h-1.5 w-1.5 rounded-full bg-red-400" />
                          Désactivé
                        </span>
                      )}
                    </td>

                    {/* Dernière connexion */}
                    <td className="hidden px-5 py-4 text-[12.5px] text-ink-500 nav:table-cell">
                      {user.lastLoginAt ? (
                        <span title={new Date(user.lastLoginAt).toLocaleString("fr-FR")}>
                          {timeAgo(user.lastLoginAt)}
                        </span>
                      ) : (
                        <span className="text-ink-500/50">Jamais</span>
                      )}
                    </td>

                    {/* Actions */}
                    <td className="px-5 py-4">
                      <div className="flex items-center justify-end gap-1.5">
                        <Link
                          href={`/admin/users/${user.id}/edit`}
                          title="Éditer"
                          className="flex h-8 w-8 items-center justify-center rounded-[8px] border border-line text-ink-500 transition-colors hover:border-brand-300 hover:bg-brand-50 hover:text-brand-600"
                        >
                          <PencilIcon size={14} />
                        </Link>
                        <DeleteUserButton id={user.id} name={user.name} />
                      </div>
                    </td>
                  </tr>
                );
              })}

              {users.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-5 py-16 text-center">
                    <div className="flex flex-col items-center gap-3">
                      <div className="flex h-14 w-14 items-center justify-center rounded-full bg-brand-50">
                        <UsersIcon size={24} className="text-brand-400" />
                      </div>
                      <p className="text-[14px] font-semibold text-ink-700">
                        Aucun utilisateur
                      </p>
                      <p className="text-[13px] text-ink-500">
                        Créez le premier membre de l'équipe.
                      </p>
                    </div>
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
