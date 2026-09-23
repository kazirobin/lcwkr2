"use client";

import { useEffect } from "react";

/* Registers the offline service worker. On production (Vercel),
 * the SW precaches shell assets and serves offline. In development
 * it clears stale caches and registers so messaging/progress work
 * during local testing; fetch uses network-first so stale `_next`
 * chunks are never served. */
export default function ServiceWorkerRegistrar() {
  useEffect(() => {
    if (typeof window === "undefined" || !("serviceWorker" in navigator)) {
      return;
    }

    /* Development: clear stale caches from earlier offline testing,
     * then register the SW so it stays active for messaging/progress.
     * The SW's install event clears `lcwkr-*` caches on startup,
     * and `next dev` serves fresh chunks via network-first fetch. */
    if (process.env.NODE_ENV !== "production") {
      navigator.serviceWorker
        .register("/sw.js")
        .catch(() => {
          /* register failed — site still works online */
        });
      typeof window.caches !== "undefined"
        ? window.caches.keys().then((keys) =>
            Promise.all(
              keys
                .filter((k) => k.startsWith("lcwkr-"))
                .map((k) => window.caches.delete(k)),
            ),
          )
        : undefined;
      return;
    }

    const onLoad = () => {
      navigator.serviceWorker.register("/sw.js").catch(() => {
        /* register failed — site still works online */
      });
    };
    window.addEventListener("load", onLoad);
    return () => window.removeEventListener("load", onLoad);
  }, []);

  return null;
}