"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import { Star } from "lucide-react";
import { useLanguage } from "@/i18n";

/**
 * A small, unmissable-but-not-obnoxious ask for a review.
 *
 * It appears for two seconds and then gets out of the way, and it will not come
 * back for five minutes after that. Two seconds is long enough to notice and
 * short enough that it never blocks reading a lesson. The five-minute wait is
 * what stops it turning into something a person learns to dismiss without
 * reading.
 *
 * The nudge is a link to the site's own review form, so the feedback lands in
 * /admin/reviews where it can be answered.
 */

const REPEAT_MS = 5 * 60 * 1000;
const VISIBLE_MS = 2000;
const DISMISSED_KEY = "lcwkr_review_nudge_seen";

export default function ReviewNudge() {
  const { language } = useLanguage();
  const [visible, setVisible] = useState(false);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    // A visitor who has already acted is never asked again in this browser.
    try {
      if (window.localStorage.getItem(DISMISSED_KEY)) return;
    } catch {
      /* ignore */
    }

    let cancelled = false;

    const show = () => {
      if (cancelled) return;
      setVisible(true);
      timer.current = setTimeout(() => setVisible(false), VISIBLE_MS);
    };

    // First ask comes after five minutes so it never lands on top of whatever
    // someone came here to do.
    const first = setTimeout(show, REPEAT_MS);
    const repeat = setInterval(show, REPEAT_MS);

    return () => {
      cancelled = true;
      clearTimeout(first);
      clearInterval(repeat);
      if (timer.current) clearTimeout(timer.current);
    };
  }, []);

  const dismiss = () => {
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
      className="fixed bottom-24 left-1/2 z-[75] w-[min(92vw,26rem)] -translate-x-1/2 sm:left-auto sm:right-6 sm:translate-x-0"
    >
      <div className="flex items-start gap-3 rounded-2xl border border-secondary/35 bg-background px-4 py-3 shadow-lg">
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
              onClick={dismiss}
              className="rounded-full bg-secondary px-3 py-1 text-xs font-semibold text-white transition-opacity hover:opacity-90"
            >
              {language === "bn" ? "রিভিউ দিন" : "Leave a review"}
            </Link>
            <button
              type="button"
              onClick={dismiss}
              className="text-xs text-text/50 underline-offset-2 hover:underline"
            >
              {language === "bn" ? "এখন নয়" : "Not now"}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
