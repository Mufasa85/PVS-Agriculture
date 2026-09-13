"use client";

import { useEffect } from "react";

/**
 * Enregistre /sw.js en production uniquement — en dev, un service worker
 * mettrait en cache les chunks HMR et rendrait le hot-reload instable.
 */
export default function ServiceWorkerRegister() {
  useEffect(() => {
    if (process.env.NODE_ENV !== "production") return;
    if (!("serviceWorker" in navigator)) return;
    navigator.serviceWorker.register("/sw.js").catch(() => {
      // silencieux : la PWA est un plus, jamais bloquant
    });
  }, []);

  return null;
}
