"use client";

/**
 * The one place a browser's random visitor id is made and read.
 *
 * It existed only inside AnalyticsTracker, which meant the Pro preview had no
 * way to identify the same person the traffic numbers count. Two copies of a
 * key that has to match is two chances to drift, so both callers read it from
 * here.
 *
 * The value is a random string and nothing else: no device, no fingerprint, no
 * account. It cannot be traced back to a person, and clearing site data really
 * does make you a new visitor.
 */
export const VISITOR_KEY = "lcwkr_visitor_id";

export function visitorId(): string {
  try {
    const existing = window.localStorage.getItem(VISITOR_KEY);
    if (existing) return existing;
    const id =
      typeof crypto !== "undefined" && "randomUUID" in crypto
        ? crypto.randomUUID()
        : `${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 10)}`;
    window.localStorage.setItem(VISITOR_KEY, id);
    return id;
  } catch {
    // Private mode or storage disabled. The caller treats an empty id as
    // "cannot be identified" and falls back to whatever it can do alone.
    return "";
  }
}
