/* Learn Chinese with Kazi Robin — offline-first PWA service worker (v3)
 *
 * Modes:
 *  - DEFAULT (no Pro): browsed pages remain available offline (SWR caching).
 *  - PRO: user unlocks with a code and downloads the whole site once; after
 *    that, navigations serve instantly from cache and silently refresh in
 *    the background whenever the user is online.
 *
 * Dev mode (localhost): worker clears stale caches on install but stays active
 * so messages/progress work during development. Fetch uses network-first so
 * stale `_next` chunks are never served — the Next dev build-id loop is
 * broken at the source.  Detected by hostname because `process.env` is
 * unavailable inside a service-worker scope.
 */
const VERSION = "lcwkr-v3";

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

const IS_DEV = self.location.hostname === "localhost";

/* ═══ install ═══ */
self.addEventListener("install", (event) => {
  event.waitUntil(
    IS_DEV
      ? (async () => {
          const names = await caches.keys();
          await Promise.all(
            names.filter((n) => n.startsWith("lcwkr-")).map((n) => caches.delete(n)),
          );
          await self.skipWaiting();
        })()
      : caches
          .open(CACHES.shell)
          .then((cache) => cache.addAll(PRECACHE))
          .then(() => self.skipWaiting()),
  );
});

/* ═══ activate ═══ */
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

/* ═══ messaging (download control / progress) ═══ */

/* Static asset URLs referenced from an HTML page, deduped. */
function extractAssetUrls(html) {
  const found = new Set();
  const re =
    /(?:src|href)=["'](\/[^"']+\.(?:js|css|png|jpe?g|svg|webp|gif|ico|woff2?|ttf|otf|mp3|m4a|pdf))["']/g;
  let m;
  while ((m = re.exec(html))) {
    const url = m[1];
    if (url.startsWith("/_next/")) found.add(url);
    else if (url.startsWith("/assets/")) found.add(url);
  }
  return [...found];
}

self.addEventListener("message", (event) => {
  const data = event.data || {};
  const reply = (payload) => event.source && event.source.postMessage(payload);

  if (data.type === "DOWNLOAD") {
    const routes = Array.isArray(data.routes) ? data.routes : [];
    event.waitUntil(runDownload(routes, reply));
  }

  if (data.type === "REFRESH") {
    event.waitUntil(refreshCachedPages());
  }

  if (data.type === "STATUS") {
    Promise.all([
      caches.open(CACHES.pages).then((c) => c.keys()),
      navigator.onLine,
    ]).then(([keys]) => {
      reply({ type: "STATUS", downloaded: keys.length });
    });
  }
});

async function runDownload(routes, reply) {
  const pagesCache = await caches.open(CACHES.pages);
  const assetsCache = await caches.open(CACHES.assets);
  const done = new Set();

  let completed = 0;
  const total = routes.length;

  const report = () => reply({ type: "PROGRESS", done: completed, total, url: "" });

  const fetchRoute = async (route) => {
    if (done.has(route)) return;
    done.add(route);
    completed += 1;
    report();
    try {
      const res = await fetch(route, { cache: "reload" });
      if (res && res.ok) {
        const html = await res.clone().text();
        await pagesCache.put(route, res.clone());

        const assetUrls = extractAssetUrls(html).filter((u) => !done.has(u));
        await Promise.all(
          assetUrls.map(async (u) => {
            done.add(u);
            try {
              const a = await fetch(u, { cache: "reload" });
              if (a && a.ok) await assetsCache.put(u, a);
            } catch {
              /* asset missing offline — page still cached */
            }
          }),
        );
      }
    } catch {
      /* temporarily offline during download — skip, refresh will retry */
    }
  };

  for (let i = 0; i < routes.length; i += 8) {
    const batch = routes.slice(i, i + 8);
    await Promise.all(batch.map(fetchRoute));
  }

  reply({ type: "DOWNLOAD_DONE", total });
}

/* Re-fetch every cached page in the background (silent auto-update). */
async function refreshCachedPages() {
  const pagesCache = await caches.open(CACHES.pages);
  const requests = await pagesCache.keys();
  await Promise.all(
    requests.map(async (req) => {
      const url = req.url.replace(self.location.origin, "");
      if (url.startsWith("/_next/") || url === "/offline.html") return;
      try {
        const res = await fetch(url, { cache: "reload" });
        if (res && res.ok) await pagesCache.put(url, res);
      } catch {
        /* offline — keep serving the cached copy */
      }
    }),
  );
}

/* ═══ fetch handling ═══ */

self.addEventListener("fetch", (event) => {
  const req = event.request;
  const url = new URL(req.url);

  if (req.method !== "GET" || url.origin !== self.location.origin) return;

  /* ---- API: network-first, fall back to last good response ---- */
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

  /* ---- navigation ---- */
  if (req.mode === "navigate") {
    event.respondWith(
      IS_DEV
        ? fetch(req)
            .then((res) => {
              if (res && res.ok) {
                const copy = res.clone();
                caches.open(CACHES.pages).then((c) =>
                  c.put(new Request(url.pathname + url.search), copy),
                );
              }
              return res;
            })
            .catch(() =>
              caches
                .match(req)
                .then((hit) =>
                  hit
                    ? hit
                    : caches
                        .match("offline.html")
                        .then((o) => o || caches.match("/offline.html")),
                ),
            )
        : caches.match(req).then((hit) => {
            if (hit) {
              if (navigator.onLine) {
                fetch(req)
                  .then((res) => {
                    if (res && res.ok) {
                      const copy = res.clone();
                      caches.open(CACHES.pages).then((c) =>
                        c.put(new Request(url.pathname + url.search), copy),
                      );
                    }
                    return res;
                  })
                  .catch(() => hit);
              }
              return hit;
            }
            return fetch(req)
              .then((res) => {
                if (res && res.ok) {
                  const copy = res.clone();
                  caches.open(CACHES.pages).then((c) =>
                    c.put(new Request(url.pathname + url.search), copy),
                  );
                }
                return res;
              })
              .catch(() =>
                caches.match("offline.html").then((o) => o || caches.match("/offline.html")),
              );
          }),
    );
    return;
  }

  /* ---- static assets: stale-while-revalidate ---- */
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

  event.respondWith(fetch(req).catch(() => caches.match(req)));
});
