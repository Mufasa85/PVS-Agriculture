"use client";

import { useEffect, useRef, useState } from "react";
import { usePathname, useSearchParams } from "next/navigation";

import { CONSENT_CHANGED_EVENT, hasAnalyticsConsent } from "@/lib/consent";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string>("");

  // Miroir du consentement en état React : le changement d'état
  // relance l'effet de tracking ci-dessous. Un simple listener d'événement
  // ne suffirait pas, car les dépendances (pathname, searchParams)
  // n'auraient pas changé.
  const [consented, setConsented] = useState(false);

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect -- synchronisation avec le cookie, indisponible en SSR
    setConsented(hasAnalyticsConsent());

    function onConsentChanged() {
      setConsented(hasAnalyticsConsent());
    }

    window.addEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
    return () => {
      window.removeEventListener(CONSENT_CHANGED_EVENT, onConsentChanged);
    };
  }, []);

  useEffect(() => {
    // Ne pas tracker les pages d'administration
    if (pathname.startsWith("/admin")) return;

    // Aucune mesure d'audience sans consentement (politique de
    // confidentialité, sections 3 et 5). Tant que l'utilisateur n'a pas
    // accepté, ou s'il a refusé, on n'envoie rien.
    if (!consented) {
      lastTracked.current = "";
      return;
    }

    const fullUrl = `${pathname}${searchParams.toString() ? `?${searchParams.toString()}` : ""}`;
    if (lastTracked.current === fullUrl) return;

    lastTracked.current = fullUrl;

    const utmSource = searchParams.get("utm_source");
    const utmMedium = searchParams.get("utm_medium");
    const utmCampaign = searchParams.get("utm_campaign");

    const body = {
      type: "PAGE_VIEW",
      path: fullUrl,
      referrer: typeof document !== "undefined" ? document.referrer : "",
      metadata: {
        ...(utmSource ? { utm_source: utmSource } : {}),
        ...(utmMedium ? { utm_medium: utmMedium } : {}),
        ...(utmCampaign ? { utm_campaign: utmCampaign } : {}),
      },
    };

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {
      // Ignorer silencieusement les erreurs de télémesure
    });

    // Si des paramètres de recherche sont présents (?q=... ou ?search=...)
    const query = searchParams.get("q") || searchParams.get("search");
    if (query && query.trim()) {
      fetch("/api/track", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          type: "SEARCH",
          path: fullUrl,
          referrer: typeof document !== "undefined" ? document.referrer : "",
          metadata: { query: query.trim() },
        }),
      }).catch(() => {});
    }
  }, [pathname, searchParams, consented]);

  return null;
}
