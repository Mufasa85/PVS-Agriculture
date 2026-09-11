"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";

import BrandBadge from "@/components/layout/BrandBadge";
import { EyeIcon, LockIcon, MailIcon, ShieldIcon } from "@/components/ui/icons";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      const res = await fetch("/api/admin/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await res.json();

      if (!res.ok) {
        setError(data.error ?? "Identifiants incorrects.");
        setLoading(false);
        return;
      }

      router.push("/admin");
      router.refresh();
    } catch {
      setError("Une erreur est survenue. Veuillez réessayer.");
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen">
      {/* Panel image de marque */}
      <div className="relative hidden w-[46%] flex-col justify-between overflow-hidden px-12 py-14 nav:flex">
        <Image
          src="https://images.unsplash.com/photo-1492496913980-501348b61469?auto=format&fit=crop&w=1200&q=80"
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
            Espace sécurisé
          </span>
          <h2 className="mt-4 font-serif text-[34px] font-bold leading-tight text-white">
            Piloter la production,
            <br />
            de la terre à l&rsquo;assiette.
          </h2>
          <p className="mt-4 max-w-[360px] text-[14px] leading-relaxed text-white/60">
            Gérez votre catalogue produits, vos tarifs et votre équipe depuis
            une interface dédiée, pensée pour les équipes de PVS ONGD ASBL.
          </p>

          <div className="mt-8 flex items-center gap-2.5 rounded-full border border-white/15 bg-white/[0.07] px-4 py-2.5 backdrop-blur-sm">
            <ShieldIcon size={16} className="shrink-0 text-gold-500" />
            <span className="text-[12.5px] font-semibold text-white/70">
              Connexion chiffrée &amp; accès contrôlé
            </span>
          </div>
        </motion.div>

        <div className="relative">
          <Link
            href="/"
            className="text-[13px] font-semibold text-white/50 transition-colors hover:text-white"
          >
            ← Retour au site public
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
            Connexion
          </h1>
          <p className="mt-1.5 text-[13.5px] text-ink-500">
            Entrez vos identifiants pour accéder à l&rsquo;espace admin.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[13px] font-bold text-brand-900"
              >
                Email
              </label>
              <div className="relative">
                <MailIcon
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500/60"
                />
                <input
                  id="email"
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full rounded-[10px] border border-line bg-white py-3 pl-11 pr-4 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                  placeholder="admin@pvs-ongd.org"
                  autoComplete="username"
                />
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[13px] font-bold text-brand-900"
              >
                Mot de passe
              </label>
              <div className="relative">
                <LockIcon
                  size={17}
                  className="pointer-events-none absolute left-4 top-1/2 -translate-y-1/2 text-ink-500/60"
                />
                <input
                  id="password"
                  type={showPassword ? "text" : "password"}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full rounded-[10px] border border-line bg-white py-3 pl-11 pr-11 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                  placeholder="••••••••"
                  autoComplete="current-password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword((v) => !v)}
                  aria-label={showPassword ? "Masquer le mot de passe" : "Afficher le mot de passe"}
                  className="absolute right-3.5 top-1/2 -translate-y-1/2 text-ink-500/60 transition-colors hover:text-brand-600"
                >
                  <EyeIcon size={17} />
                </button>
              </div>
            </div>

            {error && (
              <motion.div
                initial={{ opacity: 0, y: -4 }}
                animate={{ opacity: 1, y: 0 }}
                className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600"
              >
                {error}
              </motion.div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center gap-2 rounded-[10px] bg-brand-600 px-4 py-3 text-[14px] font-bold text-white shadow-brand-btn transition-all hover:-translate-y-[1.5px] hover:bg-brand-700 hover:shadow-brand-btn-hover disabled:cursor-not-allowed disabled:translate-y-0 disabled:opacity-60"
            >
              {loading && (
                <span className="h-3.5 w-3.5 animate-spin rounded-full border-2 border-white/40 border-t-white" />
              )}
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-8 text-center text-[12px] text-ink-500">
            Accès réservé aux administrateurs autorisés.
          </p>
        </motion.div>
      </div>
    </div>
  );
}
