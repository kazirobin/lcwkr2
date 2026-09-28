"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import { useAccount } from "@/features/student-auth";
import { visitorId } from "./visitor-id";

/**
 * Site-wide traffic recorder.
 *
 * Two things keep this from being a performance problem on a mostly-static
 * site:
 *
 *  1. Page views are sent once per route with sendBeacon, which does not block
 *     navigation and survives the page going away.
 *  2. Clicks are only counted for elements a person would call a button or a
 *     link, and each distinct label is only sent once per page. Without that
 *     second rule, a single popular button clicked two hundred times would send
 *     two hundred beacons and teach us nothing extra — the daily rollup is
 *     what we read anyway.
 *
 * The visitor id is a random string, not a fingerprint: it exists only to tell
 * "one person" from "two people" in a single day's unique count. The Pro
 * preview uses the same id so a trial can be recognised and renewed by the
 * admin; see ./visitor-id.
 */

const CLICK_LIMIT = 40; // distinct labels per page view
const CLICK_MIN_LENGTH = 2;

function send(payload: Record<string, unknown>): void {
  try {
    const body = JSON.stringify(payload);
    // sendBeacon survives navigation, which a fetch would not.
    const ok = navigator.sendBeacon?.(
      "/api/track",
      new Blob([body], { type: "application/json" }),
    );
    if (ok) return;
    void fetch("/api/track", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body,
      keepalive: true,
    }).catch(() => undefined);
  } catch {
    /* tracking never breaks the page */
  }
}

/**
 * True for links and buttons that only exist for screen readers — the "skip to
 * content" jump and similar. They are real elements but nobody clicks them, so
 * counting them would put noise at the top of the most-clicked list.
 */
function isScreenReaderOnly(el: HTMLElement): boolean {
  if (el.classList.contains("sr-only")) return true;
  if (el.closest(".sr-only")) return true;
  return el.getAttribute("aria-hidden") === "true";
}

/** The most human name we can find for a clicked element. */
function labelFor(node: Element): string {
  const el = node as HTMLElement;
  const candidates = [
    el.getAttribute("aria-label"),
    el.getAttribute("title"),
    el.textContent,
  ];
  for (const raw of candidates) {
    const value = (raw ?? "").replace(/\s+/g, " ").trim();
    if (value.length >= CLICK_MIN_LENGTH && value.length <= 48) return value;
  }
  // Fall back to the accessible name the browser computed.
  return (el.getAttribute?.("name") ?? "").trim();
}

export default function AnalyticsTracker() {
  const pathname = usePathname();
  const { student } = useAccount();
  const phone = student?.whatsapp ?? "";
  const seenClicks = useRef<Set<string>>(new Set());

  // Page view. Re-runs on every client-side navigation.
  useEffect(() => {
    if (!pathname) return;
    seenClicks.current = new Set();
    send({ kind: "page", label: pathname, visitorId: visitorId(), phone });
  }, [pathname, phone]);

  // Clicks, delegated once for the whole document.
  useEffect(() => {
    const onClick = (event: MouseEvent) => {
      const target = event.target;
      if (!(target instanceof Element)) return;
      const el = target.closest("button, a, [role=button], summary, label[for]");
      if (!el) return;
      if (isScreenReaderOnly(el as HTMLElement)) return;

      const label = labelFor(el);
      if (!label) return;
      // Once per distinct label per page: the daily rollup is all we read, and
      // this keeps a popular button from flooding the network.
      if (seenClicks.current.has(label)) return;
      if (seenClicks.current.size >= CLICK_LIMIT) return;
      seenClicks.current.add(label);

      send({ kind: "click", label, visitorId: visitorId(), phone });
    };

    document.addEventListener("click", onClick, { capture: true, passive: true });
    return () => document.removeEventListener("click", onClick, { capture: true });
  }, [phone]);

  // A tab closed without signing out still needs to stop counting. sendBeacon
  // runs on visibilitychange, so the session closes with a real timestamp.
  useEffect(() => {
    if (!phone) return;
    const close = () => {
      if (document.visibilityState === "hidden") {
        try {
          navigator.sendBeacon?.(
            "/api/auth/logout",
            new Blob([JSON.stringify({ phone })], { type: "application/json" }),
          );
        } catch {
          /* ignore */
        }
      }
    };
    document.addEventListener("visibilitychange", close);
    return () => document.removeEventListener("visibilitychange", close);
  }, [phone]);

  return null;
}
