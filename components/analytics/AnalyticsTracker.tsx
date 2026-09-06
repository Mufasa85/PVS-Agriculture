"use client";

import { useEffect, useRef } from "react";
import { usePathname, useSearchParams } from "next/navigation";

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const lastTracked = useRef<string>("");

  useEffect(() => {
    // Ne pas tracker les pages d'administration
    if (pathname.startsWith("/admin")) return;

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
  }, [pathname, searchParams]);

  return null;
}
