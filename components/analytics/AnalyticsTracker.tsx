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

    const body = {
      type: "PAGE_VIEW",
      path: fullUrl,
      referrer: typeof document !== "undefined" ? document.referrer : "",
    };

    fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(body),
    }).catch(() => {
      // Ignorer silencieusement les erreurs de télémesure
    });
  }, [pathname, searchParams]);

  return null;
}
