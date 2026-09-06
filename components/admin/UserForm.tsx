"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";

const ALL_ROLES = ["SUPER_ADMIN", "ADMIN", "EDITOR"] as const;

const ROLE_LABELS: Record<(typeof ALL_ROLES)[number], string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  EDITOR: "Éditeur",
};

type UserFormValues = {
  id?: number;
  name: string;
  email: string;
  password: string;
  role: (typeof ALL_ROLES)[number];
  isActive: boolean;
};

const emptyValues: UserFormValues = {
  name: "",
  email: "",
  password: "",
  role: "EDITOR",
  isActive: true,
};

export default function UserForm({
  initialValues,
  onClose,
}: {
  initialValues?: UserFormValues;
  onClose?: () => void;
}) {
  const router = useRouter();
  const [values, setValues] = useState<UserFormValues>(initialValues ?? emptyValues);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const isEditing = Boolean(values.id);

  function update<K extends keyof UserFormValues>(key: K, value: UserFormValues[K]) {
    setValues((prev) => ({ ...prev, [key]: value }));
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const payload: Partial<UserFormValues> = {
      name: values.name,
      email: values.email,
      role: values.role,
      isActive: values.isActive,
    };
    if (values.password) {
      payload.password = values.password;
    }

    const url = isEditing ? `/api/admin/users/${values.id}` : "/api/admin/users";
    const method = isEditing ? "PUT" : "POST";

    try {
      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        setLoading(false);
        return;
      }

      if (onClose) {
        onClose();
      } else {
        router.push("/admin/users");
      }
      router.refresh();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-5">
      <div className="grid gap-5 mid:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-brand-900">Nom</label>
          <input
            required
            value={values.name}
            onChange={(e) => update("name", e.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-brand-900">Email</label>
          <input
            type="email"
            required
            value={values.email}
            onChange={(e) => update("email", e.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          />
        </div>
      </div>

      <div className="grid gap-5 mid:grid-cols-2">
        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-brand-900">
            {isEditing ? "Nouveau mot de passe (optionnel)" : "Mot de passe"}
          </label>
          <input
            type="password"
            required={!isEditing}
            minLength={8}
            value={values.password}
            onChange={(e) => update("password", e.target.value)}
            className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
            placeholder={isEditing ? "Laisser vide pour ne pas changer" : ""}
          />
        </div>

        <div>
          <label className="mb-1.5 block text-[13px] font-bold text-brand-900">Rôle</label>
          <select
            value={values.role}
            onChange={(e) => update("role", e.target.value as UserFormValues["role"])}
            className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
          >
            {ALL_ROLES.map((role) => (
              <option key={role} value={role}>
                {ROLE_LABELS[role]}
              </option>
            ))}
          </select>
        </div>
      </div>

      <label className="flex items-center gap-2.5 text-[13.5px] font-semibold text-ink-700">
        <input
          type="checkbox"
          checked={values.isActive}
          onChange={(e) => update("isActive", e.target.checked)}
          className="h-4 w-4 rounded border-line text-brand-600 focus:ring-brand-500/15"
        />
        Compte actif
      </label>

      {error && (
        <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">{error}</div>
      )}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={loading}
          className="inline-flex items-center justify-center rounded-[10px] bg-brand-600 px-5 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover disabled:cursor-not-allowed disabled:opacity-60"
        >
          {loading ? "Enregistrement..." : isEditing ? "Mettre à jour" : "Créer l'utilisateur"}
        </button>
        <button
          type="button"
          onClick={() => (onClose ? onClose() : router.push("/admin/users"))}
          className="inline-flex items-center justify-center rounded-[10px] border border-line bg-white px-5 py-2.5 text-[13.5px] font-bold text-brand-900 transition-colors hover:bg-brand-50"
        >
          Annuler
        </button>
      </div>
    </form>
  );
}
