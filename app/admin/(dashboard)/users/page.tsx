import Link from "next/link";

import DeleteUserButton from "@/components/admin/DeleteUserButton";
import { PlusIcon, PencilIcon } from "@/components/ui/icons";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  EDITOR: "Éditeur",
};

const ROLE_BADGE: Record<string, string> = {
  SUPER_ADMIN: "bg-gold-500/15 text-gold-600",
  ADMIN: "bg-brand-100 text-brand-700",
  EDITOR: "bg-ink-500/10 text-ink-500",
};

export default async function AdminUsersPage() {
  const users = await prisma.user.findMany({
    orderBy: [{ createdAt: "asc" }],
  });

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col gap-4 nav:flex-row nav:items-center nav:justify-between">
        <div>
          <h1 className="font-serif text-[26px] font-bold text-brand-900">Utilisateurs</h1>
          <p className="mt-1 text-[13.5px] text-ink-500">
            {users.length} membre{users.length > 1 ? "s" : ""} d'équipe
          </p>
        </div>
        <Link
          href="/admin/users/new"
          className="inline-flex items-center gap-2 rounded-[10px] bg-brand-600 px-4 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover"
        >
          <PlusIcon size={17} />
          Nouvel utilisateur
        </Link>
      </div>

      <div className="overflow-hidden rounded-pvs border border-line bg-white shadow-soft">
        <table className="w-full text-left text-[13.5px]">
          <thead className="border-b border-line bg-brand-50 text-[11.5px] font-bold uppercase tracking-[0.04em] text-ink-500">
            <tr>
              <th className="px-5 py-3">Nom</th>
              <th className="px-5 py-3">Email</th>
              <th className="px-5 py-3">Rôle</th>
              <th className="px-5 py-3">Statut</th>
              <th className="px-5 py-3">Dernière connexion</th>
              <th className="px-5 py-3 text-right">Actions</th>
            </tr>
          </thead>
          <tbody>
            {users.map((user) => (
              <tr
                key={user.id}
                className="border-b border-line last:border-0 transition-colors hover:bg-brand-50/50"
              >
                <td className="px-5 py-3.5 font-semibold text-brand-900">{user.name}</td>
                <td className="px-5 py-3.5 text-ink-700">{user.email}</td>
                <td className="px-5 py-3.5">
                  <span
                    className={`rounded-full px-2.5 py-1 text-[11px] font-bold ${ROLE_BADGE[user.role] ?? "bg-ink-500/10 text-ink-500"}`}
                  >
                    {ROLE_LABELS[user.role] ?? user.role}
                  </span>
                </td>
                <td className="px-5 py-3.5">
                  {user.isActive ? (
                    <span className="rounded-full bg-brand-100 px-2.5 py-1 text-[11px] font-bold text-brand-700">
                      Actif
                    </span>
                  ) : (
                    <span className="rounded-full bg-red-100 px-2.5 py-1 text-[11px] font-bold text-red-600">
                      Désactivé
                    </span>
                  )}
                </td>
                <td className="px-5 py-3.5 text-ink-500">
                  {user.lastLoginAt
                    ? new Date(user.lastLoginAt).toLocaleString("fr-FR")
                    : "Jamais"}
                </td>
                <td className="px-5 py-3.5 text-right">
                  <div className="flex items-center justify-end gap-2">
                    <Link
                      href={`/admin/users/${user.id}/edit`}
                      className="inline-flex items-center gap-1.5 rounded-[8px] border border-line px-3 py-1.5 text-[12.5px] font-semibold text-brand-700 transition-colors hover:border-brand-300 hover:bg-brand-50"
                    >
                      <PencilIcon size={14} />
                      Éditer
                    </Link>
                    <DeleteUserButton id={user.id} name={user.name} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
