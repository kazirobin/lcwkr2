"use client";

import { useEffect, useRef } from "react";

/**
 * One orchestrated entrance per section for the sumi-e register: adds
 * `reveal-armed` on mount, then `is-in` the first time the element scrolls
 * into view. A no-JS render shows everything; `prefers-reduced-motion` and
 * browsers without IntersectionObserver skip straight to visible. The CSS
 * lives in `app/globals.css` (`.reveal-group` / `[data-reveal]` / `--r`).
 *
 * Mirrors the copies inlined in `app/intro/IntroContent.tsx`,
 * `app/community/page.tsx` and `components/CommunityRules.tsx` — those can
 * adopt this shared hook whenever they're next touched.
 */
export function useReveal<T extends HTMLElement>({
  threshold = 0.15,
}: { threshold?: number } = {}) {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal-armed");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || !("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [threshold]);

  return ref;
}
