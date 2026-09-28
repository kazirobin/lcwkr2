"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "@/features/student-auth";
import { visitorId } from "@/features/analytics/visitor-id";

/**
 * Who is allowed to see Pro content, and for how long.
 *
 * The order matters:
 *
 *  1. The account flag is the truth. The admin switches Pro on a student's
 *     record, and that is what unlocks everything on every device.
 *  2. The legacy `cw:pro` key is still honoured so anyone already unlocked on
 *     this browser does not lose access overnight.
 *  3. Everyone else gets a ten-minute preview, once, on this device.
 *
 * The ten minutes is the whole marketing plan for the free tier: a visitor can
 * open HSK 2, click through a few lessons and try the flashcards, and only then
 * hits the wall. Pinyin and HSK 1 are free outright and are not gated at all.
 *
 * Lives in its own module so ProGate and ProLevelGate cannot drift apart on
 * what "Pro" means.
 */

const PRO_KEY = "cw:pro";
const GUEST_KEY = "cw:guest-start";

/** Ten minutes of Pro, once per device. */
export const TRIAL_MS = 10 * 60 * 1000;

export type ProAccessStatus = "checking" | "pro" | "guest" | "expired";

function noopSubscribe() {
  return () => {};
}

type TrialReply = { expiresAt: string; remainingMs: number } | null;

/**
 * How far through the preview we have already reported to the server.
 *
 * Three components watch the gate at once — the nav, the page's own level gate
 * and the corner badge — and each one kept its own idea of when it last
 * reported, so a page open for forty seconds booked a hundred and forty. This
 * is shared by every watcher on the page so "used" means one length of time.
 */
let reportedUpTo = Date.now();

/**
 * Tell the server how much of the preview has just been consumed.
 *
 * The admin list shows this, so somebody can tell a visitor who read three
 * lessons from one who closed the tab straight away. Callers pass nothing; the
 * module decides whether enough time has passed to be worth a request, which
 * is what stops three watchers reporting the same stretch three times.
 */
function reportBeatUsed(flush = false) {
  const now = Date.now();
  const delta = now - reportedUpTo;
  // On the way out a second is worth flushing; during use, half a minute is the
  // cadence, and anything less is noise.
  if (delta < (flush ? 1_000 : 25_000)) return;
  reportedUpTo = now;

  const id = visitorId();
  if (!id) return;
  const payload = JSON.stringify({ action: "USE", visitorId: id, usedMs: delta });
  if (flush && navigator.sendBeacon) {
    navigator.sendBeacon("/api/pro/trial", new Blob([payload], { type: "application/json" }));
    return;
  }
  void fetch("/api/pro/trial", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: payload,
    keepalive: true,
  }).catch(() => {
    /* analytics only */
  });
}

/**
 * Ask the server what this browser's window is, creating it on first sight.
 *
 * Returns null for the two cases that are not worth failing over: a browser
 * that cannot give us a visitor id (private mode), and a network or database
 * problem. Both leave the caller on its own local clock, because a free
 * preview should never be taken away by infrastructure.
 */
async function askServer(who: {
  phone?: string;
  name?: string;
  rollNumber?: number | null;
}): Promise<TrialReply> {
  const id = visitorId();
  if (!id) return null;
  try {
    const res = await fetch("/api/pro/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ visitorId: id, ...who }),
    });
    const data = (await res.json()) as {
      trial?: { expiresAt?: string; remainingMs?: number } | null;
    };
    if (!data.trial || typeof data.trial.remainingMs !== "number") return null;
    return { expiresAt: data.trial.expiresAt ?? "", remainingMs: data.trial.remainingMs };
  } catch {
    return null;
  }
}

export function useProAccess() {
  const { student: account, checking: accountChecking } = useAccount();
  const [localPro, setLocalPro] = useState(false);
  const [guestState, setGuestState] = useState<{ remainingMs: number } | null>(null);

  const accountPro = Boolean(account?.isPro);

  // Read the legacy local flag once. It is never written any more.
  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      try {
        setLocalPro(localStorage.getItem(PRO_KEY) === "1");
      } catch {
        /* storage unavailable — treat as not unlocked */
      }
    });
    return () => {
      alive = false;
    };
  }, []);

  // The ten-minute preview clock.
  //
  // The server holds the authoritative window so the admin can see who used the
  // preview and push it out again when somebody asks. This hook asks for that
  // window and then counts it down locally once a second, and keeps the old
  // localStorage stamp as the offline fallback — if the request fails, or the
  // browser refuses to give us a visitor id, the visitor keeps the ten minutes
  // they were already owed rather than being shut out by a network problem.
  useEffect(() => {
    let alive = true;
    let expiresAt = 0;
    let serverAnswered = false;

    const onHide = () => {
      if (document.visibilityState === "hidden" && serverAnswered) reportBeatUsed(true);
    };
    document.addEventListener("visibilitychange", onHide);

    const fromServer = () => {
      if (expiresAt) return Math.max(0, expiresAt - Date.now());
      // No server answer yet: fall back to the browser's own clock, starting it
      // now if this is the first Pro page they have opened.
      try {
        let start = Number(localStorage.getItem(GUEST_KEY));
        if (!start || Number.isNaN(start)) {
          start = Date.now();
          localStorage.setItem(GUEST_KEY, String(start));
        }
        return Math.max(0, start + TRIAL_MS - Date.now());
      } catch {
        return TRIAL_MS;
      }
    };

    const compute = () => {
      if (!alive) return;
      setGuestState({ remainingMs: fromServer() });
    };

    const sync = async () => {
      const reply = await askServer({
        phone: account?.whatsapp,
        name: account?.nameEnglish,
        rollNumber: account?.rollNumber ?? null,
      });
      const at = reply?.expiresAt ? Date.parse(reply.expiresAt) : 0;
      if (reply && at > 0) {
        expiresAt = at;
        serverAnswered = true;
        // Mirror it locally so a reload or a flaky connection still counts the
        // same clock rather than restarting the ten minutes.
        try {
          localStorage.setItem(GUEST_KEY, String(at - TRIAL_MS));
        } catch {
          /* ignore */
        }
      }
      compute();
    };

    // Both branches go through a microtask: writing the start stamp on the
    // first read, and clearing it when Pro turns on, are both state updates and
    // neither should happen synchronously inside the effect body.
    if (localPro || accountPro) {
      queueMicrotask(() => setGuestState(null));
      return;
    }

    queueMicrotask(() => {
      compute();
      // Wait until we know who this is. Syncing earlier would open a trial for
      // somebody who turns out to be a Pro member a moment later, leaving a
      // row in the admin's list for someone who never needed one — and it would
      // open theirs with no name, because the account has not loaded yet. The
      // effect re-runs when the check finishes, so nothing is lost by waiting.
      if (!accountChecking) void sync();
    });
    const timer = setInterval(compute, 1000);

    // Re-check every half minute so a renewal granted while the tab is open
    // takes effect without a reload. This is the whole point of putting the
    // clock on the server. The same beat records what that half minute was
    // spent on.
    const poll = setInterval(() => {
      if (!serverAnswered) return;
      reportBeatUsed();
      void sync();
    }, 30_000);

    return () => {
      alive = false;
      clearInterval(timer);
      clearInterval(poll);
      if (serverAnswered) reportBeatUsed(true);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [
    localPro,
    accountPro,
    accountChecking,
    account?.whatsapp,
    account?.nameEnglish,
    account?.rollNumber,
  ]);

  const isPro = localPro || accountPro;

  // The window in which we do not yet know the answer. `status` deliberately
  // reports "pro" throughout it so an entitled student never sees a lock flash,
  // which means a caller that wants to hold back its own lock screen has to ask
  // for this instead of checking for "checking".
  const resolving = accountChecking || (guestState === null && !isPro);

  let status: ProAccessStatus;
  if (resolving) {
    // Still resolving: render unlocked rather than flashing a lock at someone
    // who is actually entitled to see the content.
    status = "pro";
  } else if (isPro) {
    status = "pro";
  } else if ((guestState?.remainingMs ?? 0) > 0) {
    status = "guest";
  } else {
    status = "expired";
  }

  const remainingMs = guestState?.remainingMs ?? TRIAL_MS;

  /**
   * Ask the server for the current window again, without touching the clock.
   *
   * The preview used to be restartable by the visitor, an unlimited number of
   * times, which made "ten minutes once" untrue and made the admin's renew
   * button pointless. The window now only moves when somebody renews it from
   * /admin/pro-trials, so this is what runs when a visitor follows the "ask for
   * more time" link and comes back: they pick up whatever they were granted.
   */
  const resetTrial = useCallback(() => {
    void (async () => {
      const reply = await askServer({
        phone: account?.whatsapp,
        name: account?.nameEnglish,
        rollNumber: account?.rollNumber ?? null,
      });
      if (reply) setGuestState({ remainingMs: reply.remainingMs });
    })();
  }, [account?.whatsapp, account?.nameEnglish, account?.rollNumber]);

  return { status, remainingMs, isPro, resolving, resetTrial };
}

/**
 * The teacher's WhatsApp, as a visitor would write it and as a dialler needs it.
 *
 * Both live here beside the message so the two cannot disagree: a visitor who
 * is told one number and reaches a link for another is worse off than one who
 * was never offered the shortcut.
 */
export const ADMIN_WHATSAPP_DISPLAY = "01787881334";
const ADMIN_WHATSAPP_INTL = "8801787881334";

/**
 * Where a visitor goes when their ten minutes are up. The message is written out
 * for them because the request is easier to grant when it arrives with a number
 * on it, and the admin can match the trial in /admin/pro-trials to the browser
 * asking.
 */
export const ASK_FOR_MORE_TIME_URL = `https://wa.me/${ADMIN_WHATSAPP_INTL}?text=${encodeURIComponent(
  "আসসালামু আলাইকুম। আমি ওয়েবসাইটে Pro-র ফ্রি ১০ মিনিট প্রিভিউ ব্যবহার করেছি। আরও ১০ মিনিট সময় দিতে পারবেন? আমার নম্বর: ",
)}`;

/** "9:41" style countdown for the trial badge. */
export function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Levels every visitor can use without paying anything. */
export const FREE_LEVELS = [1];

// Kept so older imports of the in-place helpers still resolve.
export { noopSubscribe };
