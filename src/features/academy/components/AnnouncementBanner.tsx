"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { Megaphone, PartyPopper, TriangleAlert, X } from "lucide-react";

/**
 * The site-wide notice strip.
 *
 * Mounted once in the root layout, so a course launch reaches everyone without
 * them having to go looking for it. It shows the newest active notice, is
 * dismissible for good once acted on, and refreshes on the next page so a
 * launch that happens while someone is browsing still shows up.
 */

const SEEN_KEY = "lcwkr_announcement_seen";
const POLL_MS = 5 * 60 * 1000;

type Notice = {
  id: string;
  title: string;
  body: string;
  href: string;
  tone: "info" | "success" | "warning";
  dismissible: boolean;
};

const TONE: Record<Notice["tone"], { icon: typeof Megaphone; bar: string; chip: string }> = {
  success: { icon: PartyPopper, bar: "border-ok/40 bg-ok-surface", chip: "text-ok" },
  info: { icon: Megaphone, bar: "border-secondary/35 bg-secondary/10", chip: "text-secondary" },
  warning: { icon: TriangleAlert, bar: "border-danger/35 bg-danger/10", chip: "text-danger" },
};

export default function AnnouncementBanner() {
  const [notice, setNotice] = useState<Notice | null>(null);
  const [hidden, setHidden] = useState<string[]>([]);

  useEffect(() => {
    // Read through a microtask so the first state update is not a synchronous
    // set inside the effect body.
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      try {
        const raw = localStorage.getItem(SEEN_KEY);
        if (raw) setHidden(JSON.parse(raw) as string[]);
      } catch {
        /* ignore */
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/announcements?scope=public", { cache: "no-store" });
      const data = await res.json();
      if (!data.success) return;
      const list = (data.announcements ?? []) as Notice[];
      setNotice(list[0] ?? null);
    } catch {
      /* a missing banner is not an error worth showing */
    }
  }, []);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) void load();
    });
    const timer = setInterval(() => {
      if (alive) void load();
    }, POLL_MS);
    return () => {
      alive = false;
      clearInterval(timer);
    };
  }, [load]);

  if (!notice) return null;
  if (hidden.includes(notice.id)) return null;

  const tone = TONE[notice.tone] ?? TONE.info;
  const Icon = tone.icon;

  const dismiss = () => {
    const next = [...new Set([...hidden, notice.id])];
    setHidden(next);
    try {
      localStorage.setItem(SEEN_KEY, JSON.stringify(next));
    } catch {
      /* ignore */
    }
  };

  const inner = (
    <span className={`flex items-start gap-3 rounded-xl border px-4 py-2.5 ${tone.bar}`}>
      <Icon className={`mt-0.5 size-4 shrink-0 ${tone.chip}`} aria-hidden="true" />
      <span className="min-w-0 flex-1">
        <span className="block text-sm font-semibold text-text">{notice.title}</span>
        {notice.body && (
          <span className="mt-0.5 block text-[13px] leading-snug text-text/70">
            {notice.body}
          </span>
        )}
      </span>
    </span>
  );

  return (
    <div
      role="status"
      aria-live="polite"
      className="mx-auto w-full max-w-6xl px-4 pt-2 sm:px-6"
    >
      <div className="flex items-start gap-2">
        <div className="min-w-0 flex-1">
          {notice.href ? (
            <Link
              href={notice.href}
              onClick={notice.dismissible ? dismiss : undefined}
              className="block rounded-xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
            >
              {inner}
            </Link>
          ) : (
            inner
          )}
        </div>
        {notice.dismissible && (
          <button
            type="button"
            onClick={dismiss}
            aria-label="Dismiss"
            className="mt-1 flex size-7 shrink-0 items-center justify-center rounded-full text-text/45 transition-colors hover:bg-text/8 hover:text-text"
          >
            <X className="size-4" />
          </button>
        )}
      </div>
    </div>
  );
}
