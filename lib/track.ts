"use client";

/**
 * Client-side helper for tracking analytics events to POST /api/track
 */
export async function trackEvent(
  type: "PAGE_VIEW" | "PRODUCT_VIEW" | "SEARCH" | "CATEGORY_VIEW" | "QUOTE_REQUEST" | "CONTACT_CLICK" | string,
  path?: string,
  metadata?: Record<string, any>
) {
  try {
    const currentPath = path || (typeof window !== "undefined" ? window.location.pathname : "");
    const referrer = typeof document !== "undefined" ? document.referrer : "";

    await fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        type,
        path: currentPath,
        referrer,
        metadata: {
          ...(metadata || {}),
          timestamp: new Date().toISOString(),
        },
      }),
    });
  } catch (error) {
    // Ignorer silencieusement les erreurs de télémesure réseau
    console.debug("[Analytics] Failed to track event:", error);
  }
}

export function trackProductView(productName: string, categoryName?: string, path?: string) {
  return trackEvent("PRODUCT_VIEW", path, {
    productName,
    categoryName: categoryName || "Général",
  });
}

export function trackQuoteRequest(details?: { productName?: string; categoryName?: string; sujet?: string }) {
  return trackEvent("QUOTE_REQUEST", typeof window !== "undefined" ? window.location.pathname : "/contact", {
    productName: details?.productName,
    categoryName: details?.categoryName,
    sujet: details?.sujet || "Demande de devis",
  });
}

export function trackSearch(query: string) {
  if (!query || query.trim().length === 0) return;
  return trackEvent("SEARCH", typeof window !== "undefined" ? window.location.pathname : "/catalogue", {
    query: query.trim(),
  });
}

export function trackContactClick(channel: "whatsapp" | "phone" | "email", target?: string) {
  return trackEvent("CONTACT_CLICK", typeof window !== "undefined" ? window.location.pathname : "", {
    channel,
    target: target || (channel === "whatsapp" ? "WhatsApp" : channel === "phone" ? "Téléphone" : "Email"),
  });
}
