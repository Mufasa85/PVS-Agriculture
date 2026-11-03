"use client";

import Link from "next/link";
import { useEffect, useState } from "react";

import {
  CONSENT_BANNER_EVENT,
  CONSENT_REQUEST_EVENT,
  notifyConsentChanged,
  readConsent,
  writeConsent,
} from "@/lib/consent";

/**
 * Bandeau de consentement à la mesure d'audience.
 *
 * Affiché tant que l'utilisateur n'a pas fait de choix. Le refus est
 * enregistré au même titre que l'acceptation : dans les deux cas, plus
 * aucune statistique n'est envoyée (voir `lib/track.ts`).
 *
 * Accessibilité : rôle `dialog`, libellé par `aria-labelledby`, et
 * libellé explicite sur chaque bouton.
 */
export default function ConsentBanner() {
  const [visible, setVisible] = useState(false);

  // Signale l'état du bandeau aux autres composants (bouton WhatsApp).
  useEffect(() => {
    if (!visible) return;
    window.dispatchEvent(
      new CustomEvent(CONSENT_BANNER_EVENT, { detail: { visible: true } }),
    );
    return () => {
      window.dispatchEvent(
        new CustomEvent(CONSENT_BANNER_EVENT, { detail: { visible: false } }),
      );
    };
  }, [visible]);

  useEffect(() => {
    // Si l'utilisateur a déjà choisi, on n'affiche rien.
    if (readConsent() !== null) return;

    // Petit délai : laisse le contenu se poser avant d'interrompre.
    const timer = window.setTimeout(() => setVisible(true), 800);
    return () => window.clearTimeout(timer);
  }, []);

  // Permet à la politique de confidentialité de rouvrir le bandeau
  // (« Modifier mon choix »).
  useEffect(() => {
    function onRequest() {
      setVisible(true);
    }
    window.addEventListener(CONSENT_REQUEST_EVENT, onRequest);
    return () => {
      window.removeEventListener(CONSENT_REQUEST_EVENT, onRequest);
    };
  }, []);

  function choose(choice: "accepted" | "refused") {
    writeConsent(choice);
    notifyConsentChanged(choice);
    setVisible(false);
  }

  if (!visible) return null;

  return (
    <div
      role="dialog"
      aria-modal="false"
      aria-labelledby="pvs-consent-title"
      className="fixed inset-x-0 bottom-0 z-[1000] border-t border-line bg-white/95 shadow-header backdrop-blur-[14px]"
    >
      <div className="shell flex flex-col gap-5 py-6 mid:flex-row mid:items-center mid:justify-between mid:gap-10">
        <div className="max-w-[720px]">
          <p
            id="pvs-consent-title"
            className="text-[15px] font-bold text-brand-900"
          >
            Mesure d&apos;audience
          </p>
          <p className="mt-1.5 text-[13.5px] leading-[1.6] text-ink-500">
            Nous utilisons des statistiques anonymisées pour comprendre les
            pages les plus consultées et améliorer le site. Aucune donnée
            personnelle n&apos;est enregistrée sans votre accord. Vous pouvez
            retirer votre consentement à tout moment.
          </p>
          <p className="mt-2 text-[13px] text-ink-500">
            En savoir plus sur{" "}
            <Link
              href="/confidentialite"
              className="font-bold text-brand-600 underline underline-offset-2 hover:text-brand-700"
            >
              notre politique de confidentialité
            </Link>
            .
          </p>
        </div>

        <div className="flex shrink-0 flex-wrap gap-3">
          <button
            type="button"
            onClick={() => choose("refused")}
            className="btn btn-ghost btn-sm"
          >
            Refuser
          </button>
          <button
            type="button"
            onClick={() => choose("accepted")}
            className="btn btn-primary btn-sm"
          >
            Accepter
          </button>
        </div>
      </div>
    </div>
  );
}
