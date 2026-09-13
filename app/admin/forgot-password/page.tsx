"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BrandBadge from "@/components/layout/BrandBadge";
import {
  CheckIcon,
  EyeIcon,
  LockIcon,
  MailIcon,
  ShieldIcon,
} from "@/components/ui/icons";

type Step = "email" | "code" | "reset" | "done";

const inputClass =
  "w-full rounded-[10px] border border-line bg-white py-3 pl-11 pr-4 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15";

const labelClass = "mb-2 block text-[13px] font-bold text-brand-900";

const btnPrimary =
  "mt-1 inline-flex items-center justify-center gap-2 rounded-[10px] bg-brand-600 px-4 py-3 text-[14px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 disabled:cursor-not-allowed disabled:opacity-60";

function ErrorBox({ message }: { message: string }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: -4 }}
      animate={{ opacity: 1, y: 0 }}
      className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600"
    >
      {message}
    </motion.div>
  );
}

export default function ForgotPasswordPage() {
  const router = useRouter();
  const [step, setStep] = useState<Step>("email");
  const [email, setEmail] = useState("");
  const [code, setCode] = useState("");
  const [resetToken, setResetToken] = useState("");
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setNotice(data.message ?? "Code envoyé. Vérifiez votre boîte mail.");
      setStep("code");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  async function handleVerifyCode(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password/verify", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, code }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Code invalide.");
        return;
      }
      setResetToken(data.resetToken);
      setNotice(null);
      setStep("reset");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    if (password !== confirm) {
      setError("Les deux mots de passe ne correspondent pas.");
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/admin/forgot-password/reset", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ token: resetToken, password, confirm }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error ?? "Une erreur est survenue.");
        return;
      }
      setStep("done");
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Panel image de marque */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden px-12 py-14 nav:flex">
        <Image
          src="/images/photo-1492496913980-501348b61469.jpg"
          alt="Mains tenant de la terre fertile, symbole du travail agricole de PVS ONGD ASBL"
          fill
          priority
          sizes="46vw"
          className="object-cover"
        />
        <div className="absolute inset-0 bg-gradient-to-b from-brand-900/92 via-brand-900/80 to-brand-900/95" />
        <div
          aria-hidden="true"
          className="pointer-events-none absolute inset-0 opacity-[0.1]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 85%, #dfa62e 0%, transparent 45%), radial-gradient(circle at 85% 15%, #4d58dd 0%, transparent 45%)",
          }}
        />

        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="relative flex items-center gap-3"
        >
          <BrandBadge />
          <div>
            <p className="font-serif text-[17px] font-bold leading-tight text-white">
              PVS-ONGD
            </p>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/50">
              Agriculture &amp; Élevage
            </p>
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.1, ease: "easeOut" }}
          className="relative"
        >
          <span className="eyebrow text-gold-500 before:bg-gold-500">
            Récupération d&apos;accès
          </span>
          <h2 className="mt-4 font-serif text-[34px] font-bold leading-tight text-white">
            Retrouver l&apos;accès,
            <br />
            en toute sécurité.
          </h2>
          <p className="mt-4 max-w-[360px] text-[14px] leading-relaxed text-white/60">
            Un code de vérification vous sera envoyé par email pour
            réinitialiser votre mot de passe en toute sécurité.
          </p>

          <div className="mt-8 flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 backdrop-blur-sm">
            <ShieldIcon size={16} className="shrink-0 text-gold-500" />
            <span className="text-[12.5px] font-semibold text-white/70">
              Code à usage unique, valable 10 minutes
            </span>
          </div>
        </motion.div>

        <div className="relative">
          <Link
            href="/admin/login"
            className="text-[13px] font-semibold text-white/50 transition-colors hover:text-white"
          >
            ← Retour à la connexion
          </Link>
        </div>
      </div>

      {/* Panel formulaire */}
      <div className="flex flex-1 items-center justify-center bg-[#f4f5fa] px-6 py-12">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: "easeOut" }}
          className="w-full max-w-[400px]"
        >
          {/* Logo mobile */}
          <div className="mb-8 flex items-center gap-3 nav:hidden">
            <BrandBadge />
            <span className="font-serif text-[16px] font-bold text-brand-900">
              PVS-ONGD Admin
            </span>
          </div>

          <h1 className="font-serif text-[26px] font-bold text-brand-900">
            {step === "email" && "Mot de passe oublié"}
            {step === "code" && "Code de vérification"}
            {step === "reset" && "Nouveau mot de passe"}
            {step === "done" && "Mot de passe modifié"}
          </h1>
          <p className="mt-1.5 text-[13.5px] text-ink-500">
            {step === "email" &&
              "Entrez votre email pour recevoir un code de vérification."}
            {step === "code" &&
              `Un code à 6 chiffres a été envoyé à ${email}. Valable 10 minutes.`}
            {step === "reset" &&
              "Choisissez un nouveau mot de passe (12 caractères minimum)."}
            {step === "done" &&
              "Vous pouvez maintenant vous connecter avec votre nouveau mot de passe."}
          </p>

          {step === "email" && (
            <form
              onSubmit={handleSendCode}
              className="mt-8 flex flex-col gap-5"
            >
              <div>
                <label htmlFor="fp-email" className={labelClass}>
                  Email
                </label>
                <div className="relative">
                  <MailIcon
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500/60"
                  />
                  <input
                    id="fp-email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className={inputClass}
                    placeholder="admin@pvs-ongd.org"
                    autoComplete="username"
                  />
                </div>
              </div>
              {error && <ErrorBox message={error} />}
              <button type="submit" disabled={loading} className={btnPrimary}>
                {loading && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loading ? "Envoi..." : "Envoyer le code"}
              </button>
            </form>
          )}

          {step === "code" && (
            <form
              onSubmit={handleVerifyCode}
              className="mt-8 flex flex-col gap-5"
            >
              {notice && !error && (
                <div className="rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-600">
                  {notice}
                </div>
              )}
              <div>
                <label htmlFor="fp-code" className={labelClass}>
                  Code à 6 chiffres
                </label>
                <div className="relative">
                  <ShieldIcon
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500/60"
                  />
                  <input
                    id="fp-code"
                    type="text"
                    inputMode="numeric"
                    pattern="\d{6}"
                    maxLength={6}
                    required
                    value={code}
                    onChange={(e) => setCode(e.target.value.replace(/\D/g, ""))}
                    className={`${inputClass} text-center font-mono text-[20px] tracking-[0.5em]`}
                    placeholder="000000"
                    autoComplete="one-time-code"
                  />
                </div>
              </div>
              {error && <ErrorBox message={error} />}
              <button
                type="submit"
                disabled={loading || code.length !== 6}
                className={btnPrimary}
              >
                {loading && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loading ? "Vérification..." : "Vérifier le code"}
              </button>
              <button
                type="button"
                onClick={handleSendCode}
                disabled={loading}
                className="text-[13px] font-semibold text-ink-500 transition-colors hover:text-brand-600"
              >
                Renvoyer le code
              </button>
            </form>
          )}

          {step === "reset" && (
            <form onSubmit={handleReset} className="mt-8 flex flex-col gap-5">
              <div>
                <label htmlFor="fp-password" className={labelClass}>
                  Nouveau mot de passe
                </label>
                <div className="relative">
                  <LockIcon
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500/60"
                  />
                  <input
                    id="fp-password"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={12}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className={`${inputClass} pr-11`}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    aria-label={
                      showPassword
                        ? "Masquer le mot de passe"
                        : "Afficher le mot de passe"
                    }
                    className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500/60 transition-colors hover:text-brand-600"
                  >
                    <EyeIcon size={17} />
                  </button>
                </div>
              </div>
              <div>
                <label htmlFor="fp-confirm" className={labelClass}>
                  Confirmer le mot de passe
                </label>
                <div className="relative">
                  <LockIcon
                    size={17}
                    className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500/60"
                  />
                  <input
                    id="fp-confirm"
                    type={showPassword ? "text" : "password"}
                    required
                    minLength={12}
                    value={confirm}
                    onChange={(e) => setConfirm(e.target.value)}
                    className={inputClass}
                    placeholder="••••••••"
                    autoComplete="new-password"
                  />
                </div>
              </div>
              {error && <ErrorBox message={error} />}
              <button type="submit" disabled={loading} className={btnPrimary}>
                {loading && (
                  <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
                )}
                {loading ? "Enregistrement..." : "Modifier le mot de passe"}
              </button>
            </form>
          )}

          {step === "done" && (
            <div className="mt-8 flex flex-col gap-5">
              <div className="flex items-center gap-3 rounded-[10px] border border-emerald-200 bg-emerald-50 px-4 py-3 text-[13px] font-semibold text-emerald-600">
                <CheckIcon size={16} className="shrink-0" />
                Mot de passe réinitialisé avec succès.
              </div>
              <button
                type="button"
                onClick={() => {
                  router.push("/admin/login");
                  router.refresh();
                }}
                className={btnPrimary}
              >
                Se connecter
              </button>
            </div>
          )}

          <p className="mt-8 text-center text-[12px] text-ink-500 nav:hidden">
            <Link
              href="/admin/login"
              className="font-semibold transition-colors hover:text-brand-600"
            >
              ← Retour à la connexion
            </Link>
          </p>
        </motion.div>
      </div>
    </div>
  );
}
