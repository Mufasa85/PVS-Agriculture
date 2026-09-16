// Service worker PVS — cache-first pour les assets statiques,
// network-first pour les navigations publiques (fallback hors-ligne).
// N'intercepte JAMAIS /api/* ni /admin/* (réponses authentifiées).

const STATIC_CACHE = "pvs-static-v1";
const PAGE_CACHE = "pvs-pages-v1";

const PRECACHE = [
  "/manifest.webmanifest",
  "/pvs-pwa/icons/icon-192x192.png",
  "/pvs-pwa/icons/icon-512x512.png",
];

const STATIC_PATH = /^\/(pvs-pwa|images|_next\/static|_next\/image)\//;
const EXCLUDED_PATH = /^\/(api|admin)(\/|$)/;

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(STATIC_CACHE)
      .then((cache) => cache.addAll(PRECACHE))
      .catch(() => undefined),
  );
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys
            .filter((key) => key !== STATIC_CACHE && key !== PAGE_CACHE)
            .map((key) => caches.delete(key)),
        ),
      ),
  );
  self.clients.claim();
});

self.addEventListener("fetch", (event) => {
  const { request } = event;

  if (request.method !== "GET") return;

  const url = new URL(request.url);
  if (url.origin !== location.origin) return;
  if (EXCLUDED_PATH.test(url.pathname)) return;

  // Assets statiques → cache-first
  if (STATIC_PATH.test(url.pathname)) {
    event.respondWith(
      caches.match(request).then(
        (cached) =>
          cached ||
          fetch(request).then((response) => {
            if (response.ok) {
              const clone = response.clone();
              caches
                .open(STATIC_CACHE)
                .then((cache) => cache.put(request, clone));
            }
            return response;
          }),
      ),
    );
    return;
  }

  // Navigations publiques → network-first, fallback cache si hors-ligne
  if (request.mode === "navigate") {
    event.respondWith(
      fetch(request)
        .then((response) => {
          if (response.ok) {
            const clone = response.clone();
            caches.open(PAGE_CACHE).then((cache) => cache.put(request, clone));
          }
          return response;
        })
        .catch(() =>
          caches.match(request).then((cached) => cached || Response.error()),
        ),
    );
  }
});
