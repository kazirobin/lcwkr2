/* Learn Chinese with Kazi Robin — offline-first service worker */
const VERSION = "lcwkr-v1";

const PRECACHE = [
  "/offline.html",
  "/pwa-192x192.png",
  "/pwa-512x512.png",
  "/apple-touch-icon.png",
];

const CACHES = {
  shell: `${VERSION}-shell`,
  pages: `${VERSION}-pages`,
  assets: `${VERSION}-assets`,
  api: `${VERSION}-api`,
};

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHES.shell).then((cache) => cache.addAll(PRECACHE)).then(() => self.skipWaiting()),
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches
      .keys()
      .then((keys) =>
        Promise.all(
          keys.filter((k) => !k.startsWith(`${VERSION}-`)).map((k) => caches.delete(k)),
        ),
      )
      .then(() => self.clients.claim()),
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  // only same-origin GETs
  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  // ---- API: network-first, fall back to last good response ----
  if (url.pathname.startsWith("/api/")) {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHES.api).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => {
            if (hit) return hit;
            return new Response(
              JSON.stringify({ success: false, error: "offline" }),
              {
                status: 503,
                headers: { "Content-Type": "application/json; charset=utf-8" },
              },
            );
          }),
        ),
    );
    return;
  }

  // ---- navigation: network-first, cached page fallback, then offline ----
  if (req.mode === "navigate") {
    event.respondWith(
      fetch(req)
        .then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHES.pages).then((c) => c.put(req, copy));
          }
          return res;
        })
        .catch(() =>
          caches.match(req).then((hit) => hit || caches.match("/offline.html")),
        ),
    );
    return;
  }

  // ---- static assets: stale-while-revalidate ----
  const isStatic =
    url.pathname.startsWith("/_next/static/") ||
    url.pathname.startsWith("/assets/") ||
    url.pathname.endsWith(".png") ||
    url.pathname.endsWith(".jpg") ||
    url.pathname.endsWith(".jpeg") ||
    url.pathname.endsWith(".svg") ||
    url.pathname.endsWith(".ico") ||
    url.pathname.endsWith(".webp") ||
    url.pathname.endsWith(".mp3") ||
    url.pathname.endsWith(".m4a") ||
    url.pathname.endsWith(".pdf") ||
    url.pathname.endsWith(".woff2") ||
    url.pathname.endsWith(".woff") ||
    url.pathname.endsWith(".ttf");

  if (isStatic) {
    event.respondWith(
      caches.match(req).then((hit) => {
        const refresh = fetch(req)
          .then((res) => {
            if (res && res.ok) {
              const copy = res.clone();
              caches.open(CACHES.assets).then((c) => c.put(req, copy));
            }
            return res;
          })
          .catch(() => hit);
        return hit || refresh;
      }),
    );
    return;
  }

  // everything else: network-first
  event.respondWith(
    fetch(req).catch(() => caches.match(req)),
  );
});