"use client";

import { useEffect, useState } from "react";

import {
  CONSENT_CHANGED_EVENT,
  CONSENT_REQUEST_EVENT,
  readConsent,
  writeConsent,
  notifyConsentChanged,
} from "@/lib/consent";

/**
 * Permet de retirer ou modifier le consentement à la mesure d'audience
 * depuis la politique de confidentialité — droit de retrait à tout moment
 * (article 196 du Code du numérique).
 *
 * Affiche l'état du choix en cours et permet de rouvrir le bandeau de
 * consentement.
 */
export default function ConsentManager() {
  const [choice, setChoice] = useState<"accepted" | "refused" | null>(null);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation avec le cookie, indisponible en SSR
    setChoice(readConsent());
    setMounted(true);

    function onChanged() {
      setChoice(readConsent());
    }
    window.addEventListener(CONSENT_CHANGED_EVENT, onChanged);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onChanged);
    };
  }, []);

  function reopen() {
    window.dispatchEvent(new CustomEvent(CONSENT_REQUEST_EVENT));
  }

  function withdraw() {
    writeConsent("refused");
    notifyConsentChanged("refused");
    setChoice("refused");
  }

  if (!mounted) return null;

  return (
    <div className="mt-6 rounded-pvs-lg border border-line bg-white px-5 py-5">
      <p className="text-[12px] font-bold uppercase tracking-[0.08em] text-brand-600">
        Votre choix actuel
      </p>

      <p className="mt-2 text-[14px] leading-[1.65] text-ink-700">
        {choice === "accepted"
          ? "Vous avez accepté la mesure d'audience anonymisée. Aucune donnée n'est enregistrée sans votre accord."
          : choice === "refused"
            ? "Vous avez refusé la mesure d'audience : aucune statistique n'est enregistrée sur ce site."
            : "Vous n'avez pas encore fait de choix : la mesure d'audience est désactivée par défaut."}
      </p>

      <div className="mt-4 flex flex-wrap gap-3">
        <button type="button" onClick={reopen} className="btn btn-ghost btn-sm">
          Modifier mon choix
        </button>
        {choice === "accepted" ? (
          <button
            type="button"
            onClick={withdraw}
            className="btn btn-ghost btn-sm"
          >
            Retirer mon consentement
          </button>
        ) : null}
      </div>
    </div>
  );
}
