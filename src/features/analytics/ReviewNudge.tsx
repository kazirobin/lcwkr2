"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { Star, X } from "lucide-react";
import { useLanguage } from "@/i18n";

/**
 * The ask for a review.
 *
 * It appears once, five minutes after the site is opened, and then stays put
 * until it is closed. Two things matter here:
 *
 *  - It never blocks anything. It is a card in the corner, not a modal, so a
 *    student can keep reading a lesson with it sitting there, and the browser
 *    can be minimised as usual. It takes clicks only on itself.
 *  - It never repeats. Once it has been closed it is remembered, and it does
 *    not come back on this device — a reminder that reappears every few
 *    minutes is the kind people learn to close without reading.
 *
 * The nudge points at the site's own review form, so the feedback lands in
 * /admin/reviews where it can be answered.
 */

const APPEAR_AFTER_MS = 5 * 60 * 1000;
const DISMISSED_KEY = "lcwkr_review_nudge_closed";

export default function ReviewNudge() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    // Someone who has already closed it is never asked again.
    try {
      if (window.localStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      /* ignore */
    }

    // Deferred through a microtask so nothing is a synchronous setState, and
    // the five minutes gives a visitor time to settle into the site first.
    let timer: ReturnType<typeof setTimeout>;
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      timer = setTimeout(() => setVisible(true), APPEAR_AFTER_MS);
    });
    return () => {
      alive = false;
      clearTimeout(timer);
    };
  }, []);

  const close = () => {
    setVisible(false);
    try {
      window.localStorage.setItem(DISMISSED_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
  };

  if (!visible) return null;

  return (
    <div
      role="status"
      aria-live="polite"
      className="pointer-events-none fixed bottom-4 left-4 z-[75] w-[min(88vw,20rem)]"
    >
      <div className="pointer-events-auto rounded-2xl border border-secondary/35 bg-background/95 px-4 py-3 shadow-lg backdrop-blur">
        <div className="flex items-start gap-3">
          <span
            className="mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full bg-secondary/15 text-secondary"
            aria-hidden="true"
          >
            <Star className="size-4" strokeWidth={2.5} />
          </span>
          <div className="min-w-0 flex-1">
            <p className="text-sm font-semibold leading-snug text-text">
              {language === "bn"
                ? "আমাদের সাইটটি কতটা ভালো লাগছে?"
                : "How is the site working for you?"}
            </p>
            <p className="mt-0.5 text-xs leading-snug text-text/60">
              {language === "bn"
                ? "একটি ছোট রিভিউ দিলে অন্যদের খুঁজতে অনেক সাহায্য হবে।"
                : "A short review helps other students find their way here."}
            </p>
            <div className="mt-2 flex items-center gap-3">
              <Link
                href="/academy/reviews"
                onClick={close}
                className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
              >
                {language === "bn" ? "রিভিউ দিন" : "Leave a review"}
              </Link>
              <button
                type="button"
                onClick={close}
                className="text-xs text-text/50 underline-offset-2 hover:underline"
              >
                {language === "bn" ? "এখন নয়" : "Not now"}
              </button>
            </div>
          </div>
          <button
            type="button"
            onClick={close}
            aria-label={language === "bn" ? "বন্ধ করুন" : "Close"}
            className="-mr-1 -mt-1 flex size-6 shrink-0 items-center justify-center rounded-full text-text/40 transition-colors hover:bg-text/8 hover:text-text"
          >
            <X className="size-3.5" />
          </button>
        </div>
      </div>
    </div>
  );
}
