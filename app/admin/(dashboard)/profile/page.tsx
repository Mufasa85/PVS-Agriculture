"use client";

import { useEffect, useState } from "react";
import { toast } from "sonner";

import {
  CheckIcon,
  EyeIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
  UsersIcon,
} from "@/components/ui/icons";

type Profile = {
  id: number;
  name: string;
  email: string;
  role: string;
  lastLoginAt: string | null;
  twoFactorEnabled: boolean;
  createdAt: string;
};

const ROLE_LABELS: Record<string, string> = {
  SUPER_ADMIN: "Super administrateur",
  ADMIN: "Administrateur",
  EDITOR: "Éditeur",
};

const inputClass =
  "w-full rounded-[10px] border border-line bg-white px-4 py-2.5 text-[14px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15";

const labelClass = "mb-1.5 block text-[12.5px] font-bold text-brand-900";

const btnPrimary =
  "inline-flex items-center justify-center gap-2 rounded-[10px] bg-brand-600 px-4 py-2.5 text-[13.5px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60";

const btnSecondary =
  "inline-flex items-center justify-center gap-2 rounded-[10px] border border-line bg-white px-4 py-2.5 text-[13.5px] font-bold text-brand-900 transition-colors hover:bg-brand-50 disabled:cursor-not-allowed disabled:opacity-60";

function Spinner() {
  return (
    <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-current border-t-transparent opacity-70" />
  );
}

function PasswordInput({
  id,
  label,
  value,
  onChange,
  autoComplete,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (v: string) => void;
  autoComplete: string;
  placeholder?: string;
}) {
  const [show, setShow] = useState(false);
  return (
    <div>
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <div className="relative">
        <input
          id={id}
          type={show ? "text" : "password"}
          required
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className={`${inputClass} pr-11`}
          placeholder={placeholder ?? "••••••••"}
          autoComplete={autoComplete}
        />
        <button
          type="button"
          onClick={() => setShow((v) => !v)}
          aria-label={
            show ? "Masquer le mot de passe" : "Afficher le mot de passe"
          }
          className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-500/60 transition-colors hover:text-brand-600"
        >
          <EyeIcon size={16} />
        </button>
      </div>
    </div>
  );
}

function SectionCard({
  icon,
  title,
  subtitle,
  children,
}: {
  icon: React.ReactNode;
  title: string;
  subtitle: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-[16px] border border-line bg-white shadow-soft">
      <div className="flex items-center gap-3 border-b border-line px-6 py-4">
        <div className="flex h-9 w-9 items-center justify-center rounded-[10px] bg-brand-50 text-brand-600">
          {icon}
        </div>
        <div>
          <h2 className="font-serif text-[16px] font-bold text-brand-900">
            {title}
          </h2>
          <p className="text-[12px] text-ink-500">{subtitle}</p>
        </div>
      </div>
      <div className="p-6">{children}</div>
    </section>
  );
}

export default function AdminProfilePage() {
  const [profile, setProfile] = useState<Profile | null>(null);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState("");
  const [savingProfile, setSavingProfile] = useState(false);

  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [savingPassword, setSavingPassword] = useState(false);

  const [qrCode, setQrCode] = useState<string | null>(null);
  const [manualSecret, setManualSecret] = useState<string | null>(null);
  const [totpCode, setTotpCode] = useState("");
  const [processing2fa, setProcessing2fa] = useState(false);

  function loadProfile() {
    fetch("/api/admin/profile")
      .then((res) => res.json())
      .then((data) => {
        if (data.user) {
          setProfile(data.user);
          setName(data.user.name);
        }
      })
      .catch(() => toast.error("Impossible de charger le profil."))
      .finally(() => setLoading(false));
  }

  useEffect(() => {
    queueMicrotask(loadProfile);
  }, []);

  async function handleSaveProfile(e: React.FormEvent) {
    e.preventDefault();
    setSavingProfile(true);
    try {
      const res = await fetch("/api/admin/profile", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur lors de la mise à jour.");
        return;
      }
      toast.success("Profil mis à jour.");
      setProfile((p) => (p ? { ...p, name: data.user.name } : p));
    } finally {
      setSavingProfile(false);
    }
  }

  async function handleChangePassword(e: React.FormEvent) {
    e.preventDefault();
    if (newPassword !== confirmPassword) {
      toast.error("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setSavingPassword(true);
    try {
      const res = await fetch("/api/admin/profile/password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          currentPassword,
          password: newPassword,
          confirm: confirmPassword,
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur lors du changement.");
        return;
      }
      toast.success("Mot de passe modifié.");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmPassword("");
    } finally {
      setSavingPassword(false);
    }
  }

  async function handleSetup2fa() {
    setProcessing2fa(true);
    try {
      const res = await fetch("/api/admin/profile/2fa/setup", {
        method: "POST",
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Erreur lors de la configuration.");
        return;
      }
      setQrCode(data.qrCode);
      setManualSecret(data.secret);
    } finally {
      setProcessing2fa(false);
    }
  }

  async function handleEnable2fa(e: React.FormEvent) {
    e.preventDefault();
    setProcessing2fa(true);
    try {
      const res = await fetch("/api/admin/profile/2fa/enable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: totpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Code invalide.");
        return;
      }
      toast.success("Double authentification activée.");
      setQrCode(null);
      setManualSecret(null);
      setTotpCode("");
      setProfile((p) => (p ? { ...p, twoFactorEnabled: true } : p));
    } finally {
      setProcessing2fa(false);
    }
  }

  async function handleDisable2fa(e: React.FormEvent) {
    e.preventDefault();
    setProcessing2fa(true);
    try {
      const res = await fetch("/api/admin/profile/2fa/disable", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code: totpCode }),
      });
      const data = await res.json();
      if (!res.ok) {
        toast.error(data.error ?? "Code invalide.");
        return;
      }
      toast.success("Double authentification désactivée.");
      setTotpCode("");
      setProfile((p) => (p ? { ...p, twoFactorEnabled: false } : p));
    } finally {
      setProcessing2fa(false);
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-24">
        <div className="h-8 w-8 animate-spin rounded-full border-2 border-brand-200 border-t-brand-600" />
      </div>
    );
  }

  if (!profile) {
    return (
      <p className="py-16 text-center text-[14px] text-ink-500">
        Impossible de charger le profil.
      </p>
    );
  }

  return (
    <div className="mx-auto flex max-w-[720px] flex-col gap-6">
      <SectionCard
        icon={<UsersIcon size={18} />}
        title="Informations du compte"
        subtitle="Votre identité dans l'espace administrateur."
      >
        <form onSubmit={handleSaveProfile} className="flex flex-col gap-4">
          <div>
            <label htmlFor="profile-name" className={labelClass}>
              Nom complet
            </label>
            <input
              id="profile-name"
              type="text"
              required
              value={name}
              onChange={(e) => setName(e.target.value)}
              className={inputClass}
            />
          </div>
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <p className={labelClass}>Email</p>
              <div className="flex items-center gap-2 rounded-[10px] border border-line bg-brand-50/50 px-4 py-2.5 text-[14px] text-ink-500">
                <MailIcon size={15} className="shrink-0" />
                {profile.email}
              </div>
            </div>
            <div>
              <p className={labelClass}>Rôle</p>
              <div className="flex items-center gap-2 rounded-[10px] border border-line bg-brand-50/50 px-4 py-2.5 text-[14px] text-ink-500">
                <ShieldIcon size={15} className="shrink-0" />
                {ROLE_LABELS[profile.role] ?? profile.role}
              </div>
            </div>
          </div>
          <p className="text-[12px] text-ink-500">
            {profile.lastLoginAt &&
              `Dernière connexion : ${new Date(profile.lastLoginAt).toLocaleString("fr-FR")} · `}
            Membre depuis le{" "}
            {new Date(profile.createdAt).toLocaleDateString("fr-FR")}
          </p>
          <div>
            <button
              type="submit"
              disabled={savingProfile}
              className={btnPrimary}
            >
              {savingProfile && <Spinner />}
              Enregistrer
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        icon={<LockIcon size={18} />}
        title="Changer le mot de passe"
        subtitle="12 caractères minimum. La session reste active après modification."
      >
        <form onSubmit={handleChangePassword} className="flex flex-col gap-4">
          <PasswordInput
            id="current-password"
            label="Mot de passe actuel"
            value={currentPassword}
            onChange={setCurrentPassword}
            autoComplete="current-password"
          />
          <div className="grid gap-4 sm:grid-cols-2">
            <PasswordInput
              id="new-password"
              label="Nouveau mot de passe"
              value={newPassword}
              onChange={setNewPassword}
              autoComplete="new-password"
            />
            <PasswordInput
              id="confirm-password"
              label="Confirmer"
              value={confirmPassword}
              onChange={setConfirmPassword}
              autoComplete="new-password"
            />
          </div>
          <div>
            <button
              type="submit"
              disabled={savingPassword}
              className={btnPrimary}
            >
              {savingPassword && <Spinner />}
              Modifier le mot de passe
            </button>
          </div>
        </form>
      </SectionCard>

      <SectionCard
        icon={<ShieldIcon size={18} />}
        title="Double authentification (2FA)"
        subtitle="Un code temporaire depuis votre application (Google Authenticator, Authy…) est exigé à la connexion."
      >
        <div className="flex items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-[12px] font-bold ${
              profile.twoFactorEnabled
                ? "bg-emerald-50 text-emerald-600"
                : "bg-amber-50 text-amber-600"
            }`}
          >
            {profile.twoFactorEnabled && <CheckIcon size={13} />}
            {profile.twoFactorEnabled ? "Activée" : "Désactivée"}
          </span>
        </div>

        {!profile.twoFactorEnabled && !qrCode && (
          <div className="mt-4">
            <button
              type="button"
              onClick={handleSetup2fa}
              disabled={processing2fa}
              className={btnPrimary}
            >
              {processing2fa && <Spinner />}
              Activer la 2FA
            </button>
          </div>
        )}

        {!profile.twoFactorEnabled && qrCode && (
          <form onSubmit={handleEnable2fa} className="mt-5 flex flex-col gap-4">
            <div className="flex flex-col items-center gap-3 rounded-[12px] border border-dashed border-line bg-brand-50/40 p-5 sm:flex-row sm:items-start">
              {/* eslint-disable-next-line @next/next/no-img-element -- data URL */}
              <img
                src={qrCode}
                alt="QR code pour configurer l'application d'authentification"
                className="h-[160px] w-[160px] rounded-[8px]"
              />
              <div className="text-[13px] leading-relaxed text-ink-500">
                <p>
                  1. Scannez ce QR code avec votre application
                  d&apos;authentification.
                </p>
                <p className="mt-1.5">
                  2. Ou entrez cette clé manuellement :{" "}
                  <code className="rounded bg-white px-1.5 py-0.5 font-mono text-[12px] text-brand-700">
                    {manualSecret}
                  </code>
                </p>
                <p className="mt-1.5">
                  3. Saisissez le code à 6 chiffres affiché pour valider.
                </p>
              </div>
            </div>
            <div>
              <label htmlFor="totp-enable" className={labelClass}>
                Code de vérification
              </label>
              <input
                id="totp-enable"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className={`${inputClass} max-w-[200px] text-center font-mono text-[18px] tracking-[0.5em]`}
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>
            <div className="flex gap-3">
              <button
                type="submit"
                disabled={processing2fa || totpCode.length !== 6}
                className={btnPrimary}
              >
                {processing2fa && <Spinner />}
                Vérifier et activer
              </button>
              <button
                type="button"
                onClick={() => {
                  setQrCode(null);
                  setManualSecret(null);
                  setTotpCode("");
                }}
                className={btnSecondary}
              >
                Annuler
              </button>
            </div>
          </form>
        )}

        {profile.twoFactorEnabled && (
          <form
            onSubmit={handleDisable2fa}
            className="mt-5 flex flex-col gap-4"
          >
            <div>
              <label htmlFor="totp-disable" className={labelClass}>
                Code de l&apos;application (pour confirmer la désactivation)
              </label>
              <input
                id="totp-disable"
                type="text"
                inputMode="numeric"
                pattern="\d{6}"
                maxLength={6}
                required
                value={totpCode}
                onChange={(e) => setTotpCode(e.target.value.replace(/\D/g, ""))}
                className={`${inputClass} max-w-[200px] text-center font-mono text-[18px] tracking-[0.5em]`}
                placeholder="000000"
                autoComplete="one-time-code"
              />
            </div>
            <div>
              <button
                type="submit"
                disabled={processing2fa || totpCode.length !== 6}
                className="inline-flex items-center justify-center gap-2 rounded-[10px] border border-red-200 bg-white px-4 py-2.5 text-[13.5px] font-bold text-red-600 transition-colors hover:bg-red-50 disabled:cursor-not-allowed disabled:opacity-60"
              >
                {processing2fa && <Spinner />}
                Désactiver la 2FA
              </button>
            </div>
          </form>
        )}
      </SectionCard>
    </div>
  );
}
