"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function AdminLoginPage() {
  const router = useRouter();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
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
      {/* Panel brand */}
      <div className="relative hidden w-[44%] flex-col justify-between bg-brand-900 px-12 py-14 nav:flex">
        <div
          className="pointer-events-none absolute inset-0 opacity-[0.07]"
          style={{
            backgroundImage:
              "radial-gradient(circle at 20% 80%, #dfa62e 0%, transparent 50%), radial-gradient(circle at 80% 20%, #4d58dd 0%, transparent 50%)",
          }}
        />
        <div className="relative flex items-center gap-3">
          <div className="flex h-11 w-11 items-center justify-center rounded-[12px] bg-gold-500 font-serif text-[18px] font-bold text-brand-900">
            PVS
          </div>
          <div>
            <p className="font-serif text-[17px] font-bold leading-tight text-white">
              PVS-ONGD
            </p>
            <p className="text-[11.5px] font-semibold uppercase tracking-[0.1em] text-white/40">
              Agriculture &amp; Élevage
            </p>
          </div>
        </div>

        <div className="relative">
          <h2 className="font-serif text-[32px] font-bold leading-tight text-white">
            Espace
            <br />
            administrateur
          </h2>
          <p className="mt-4 max-w-[340px] text-[14px] leading-relaxed text-white/50">
            Gérez votre catalogue produits, vos tarifs et votre équipe depuis une
            interface dédiée et sécurisée.
          </p>
        </div>

        <div className="relative">
          <Link
            href="/"
            className="text-[13px] font-semibold text-white/40 transition-colors hover:text-white/70"
          >
            ← Retour au site public
          </Link>
        </div>
      </div>

      {/* Panel form */}
      <div className="flex flex-1 items-center justify-center bg-[#f4f5fa] px-6 py-12">
        <div className="w-full max-w-[400px]">
          {/* Logo mobile */}
          <div className="mb-8 flex items-center gap-3 nav:hidden">
            <div className="flex h-10 w-10 items-center justify-center rounded-[10px] bg-brand-900 font-serif text-[15px] font-bold text-gold-500">
              PVS
            </div>
            <span className="font-serif text-[16px] font-bold text-brand-900">
              PVS-ONGD Admin
            </span>
          </div>

          <h1 className="font-serif text-[26px] font-bold text-brand-900">
            Connexion
          </h1>
          <p className="mt-1.5 text-[13.5px] text-ink-500">
            Entrez vos identifiants pour accéder à l'espace admin.
          </p>

          <form onSubmit={handleSubmit} className="mt-8 flex flex-col gap-5">
            <div>
              <label
                htmlFor="email"
                className="mb-2 block text-[13px] font-bold text-brand-900"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                placeholder="admin@pvs-ongd.org"
                autoComplete="username"
              />
            </div>

            <div>
              <label
                htmlFor="password"
                className="mb-2 block text-[13px] font-bold text-brand-900"
              >
                Mot de passe
              </label>
              <input
                id="password"
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full rounded-[10px] border border-line bg-white px-4 py-3 text-[14.5px] text-brand-900 outline-none transition-colors placeholder:text-ink-500/50 focus:border-brand-500 focus:ring-2 focus:ring-brand-500/15"
                placeholder="••••••••"
                autoComplete="current-password"
              />
            </div>

            {error && (
              <div className="rounded-[10px] border border-red-200 bg-red-50 px-4 py-3 text-[13px] font-semibold text-red-600">
                {error}
              </div>
            )}

            <button
              type="submit"
              disabled={loading}
              className="mt-1 inline-flex items-center justify-center rounded-[10px] bg-brand-600 px-4 py-3 text-[14px] font-bold text-white shadow-brand-btn transition-all hover:bg-brand-700 hover:shadow-brand-btn-hover disabled:cursor-not-allowed disabled:opacity-60"
            >
              {loading ? "Connexion..." : "Se connecter"}
            </button>
          </form>

          <p className="mt-8 text-center text-[12px] text-ink-500">
            Accès réservé aux administrateurs autorisés.
          </p>
        </div>
      </div>
    </div>
  );
}
