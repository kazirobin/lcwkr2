"use client";

import { useCallback, useEffect, useRef, useState } from "react";
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

export type ProAccessStatus = "checking" | "pro" | "guest" | "expired" | "unstarted";

function noopSubscribe() {
  return () => {};
}

type TrialReply = { expiresAt: string; remainingMs: number } | null;

/** What the visitor has to give before the ten minutes can start. */
export type TrialRequest = {
  name: string;
  whatsapp: string;
  location: string;
};

export type StartTrialResult =
  | { ok: true; remainingMs?: number }
  | { ok: false; message: string };

/**
 * Ask whether this browser already has a window.
 *
 * A null answer is the normal state for a first visit, and it is what puts the
 * name-and-number form in front of them rather than a clock. It is also what a
 * blocked browser or a database problem looks like, which is why the caller does
 * not treat it as an error.
 */
async function askServer(): Promise<TrialReply> {
  const id = visitorId();
  if (!id) return null;
  try {
    const res = await fetch("/api/pro/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ action: "CHECK", visitorId: id }),
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

/**
 * Open the ten minutes, given the visitor's name, number and location.
 *
 * The server approves it there and then — the ten minutes are the marketing, not
 * something a person has to wait for — and the details land on the admin's list
 * so a renewal can be granted later against a real name.
 */
export async function startTrial(
  request: TrialRequest,
  rollNumber?: number | null,
): Promise<StartTrialResult> {
  const id = visitorId();
  if (!id) {
    return { ok: false, message: "This browser is blocking storage, so the preview cannot start here." };
  }
  try {
    const res = await fetch("/api/pro/trial", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        action: "START",
        visitorId: id,
        name: request.name,
        whatsapp: request.whatsapp,
        location: request.location,
        rollNumber: rollNumber ?? null,
      }),
    });
    const data = (await res.json()) as {
      success?: boolean;
      message?: string;
      trial?: { remainingMs?: number } | null;
    };
    if (!res.ok || !data.success) {
      return { ok: false, message: data.message ?? "Could not start the preview." };
    }
    return { ok: true, remainingMs: data.trial?.remainingMs };
  } catch {
    return { ok: false, message: "Network problem. Please try again." };
  }
}

/**
 * Only one START in flight for a given phone number at a time.
 *
 * The nav, the page's level gate and the corner badge each call useProAccess,
 * and until this existed every one of them fired the auto-start for a signed-in
 * student at the same time. A handful of POSTs raced each other; one would win
 * and create the trial, and the losers could answer "could not start", leaving
 * that instance without a clock and without retrying until some later render.
 * Deduping here keeps one request per student per page load, and every instance
 * sees the same answer.
 */
type Flight = { phone: string; run: Promise<StartTrialResult> };
let flight: Flight | null = null;

function flightStart(
  request: TrialRequest,
  rollNumber?: number | null,
): Promise<StartTrialResult> {
  if (flight && flight.phone === request.whatsapp) return flight.run;
  const run = startTrial(request, rollNumber);
  flight = { phone: request.whatsapp, run };
  void run.finally(() => {
    if (flight?.run === run) flight = null;
  });
  return run;
}

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

export function useProAccess() {
  const { student: account, checking: accountChecking } = useAccount();
  const [localPro, setLocalPro] = useState(false);
  const [guestState, setGuestState] = useState<{ remainingMs: number } | null>(null);
  // True once the server has confirmed a window exists for this browser. Until
  // then the visitor is neither counting down nor locked out — they have not
  // asked for the ten minutes yet.
  const [started, setStarted] = useState(false);
  // True once the server has answered at all. Before that we do not know whether
  // to show a clock, a form or a wall, so the gate keeps showing the content
  // rather than flashing the form at somebody who is already entitled to it.
  const [checked, setChecked] = useState(false);

  // Shared between the auto-start effect and the clock effect: the clock counts
  // down once the preview has opened, and the auto-start opens it, so both need
  // to agree on the one boolean without either waiting for the other's render.
  const startedRef = useRef(false);

  const accountPro = Boolean(account?.isPro);
  const isPro = localPro || accountPro;

  // The window in which we do not yet know the answer. `status` deliberately
  // reports "pro" throughout it so an entitled student never sees a lock flash,
  // which means a caller that wants to hold back its own lock screen has to ask
  // for `resolving` instead of checking for "checking".
  //
  // It ends when the account has been read and the server has said whether a
  // window exists. Before that, "pro" — the gate stays out of the way.
  //
  // Computed here, above the effects, because the auto-start below has to be
  // able to watch it: when it was computed further down the hook, this effect's
  // dependency list could not name it, so the effect never re-ran at the moment
  // the answer arrived and signed-in students were quietly left with no preview.
  const resolving = accountChecking || (!checked && !isPro);

  let status: ProAccessStatus;
  if (resolving) {
    // Still resolving: render unlocked rather than flashing a lock at someone
    // who is actually entitled to see the content.
    status = "pro";
  } else if (isPro) {
    status = "pro";
  } else if (!started) {
    // The server has answered and there is no window: this browser has not asked
    // for the ten minutes yet, so what belongs on screen is the form, not a
    // clock and not a wall.
    status = "unstarted";
  } else if ((guestState?.remainingMs ?? 0) > 0) {
    status = "guest";
  } else {
    status = "expired";
  }

  // A Pro member never had a trial, and asking again would put a question in
  // front of somebody who does not need one. Deferred through a microtask so the
  // reset is not a synchronous render inside the effect body.
  useEffect(() => {
    if (!accountPro) return;
    queueMicrotask(() => setStarted(false));
  }, [accountPro]);

  /**
   * A signed-in student is never asked for their details — the account already
   * holds a name, a number and a location, so the window opens with what is on
   * file.
   *
   * This lives here rather than in each gate so that HSK 2, the Core Words
   * builder and anything else that calls the hook all behave the same way; when
   * it sat in one gate, the other quietly left signed-in students with no
   * preview at all.
   */
  useEffect(() => {
    if (!account || accountPro || status !== "unstarted") return;
    let alive = true;
    let retry: ReturnType<typeof setTimeout> | undefined;

    const open = async (attempt: number) => {
      const result = await flightStart(
        {
          name: account.nameEnglish,
          whatsapp: account.whatsapp,
          location: account.location,
        },
        account.rollNumber ?? null,
      );
      if (!alive) return;
      if (!result.ok) {
        // A signed-in student has handed over all three details, so a refusal
        // is a transient hiccup, not a judgement. Give it two more tries rather
        // than leaving them without a clock until some later render happens to
        // re-run this effect.
        if (attempt < 3) {
          retry = setTimeout(() => void open(attempt + 1), attempt * 2_500);
        }
        return;
      }
      // Take the clock from the server rather than assuming a full ten minutes:
      // it holds the authoritative window, and this is the one moment where
      // reading it back cannot be a wasted request. If that read fails, the
      // START answer itself carries the remaining time.
      const reply = await askServer().catch(() => null);
      if (!alive) return;
      const got = reply?.remainingMs ?? result.remainingMs ?? TRIAL_MS;
      startedRef.current = true;
      setChecked(true);
      setStarted(true);
      setGuestState({ remainingMs: got });
      // Mirror it locally so the 1s ticker and a reload on a flaky connection
      // count the same window instead of restarting the ten minutes.
      try {
        localStorage.setItem(GUEST_KEY, String(Date.now() + got - TRIAL_MS));
      } catch {
        /* ignore */
      }
    };

    void open(1);
    return () => {
      alive = false;
      if (retry) clearTimeout(retry);
    };
    // `status` is a fresh string each render but only ever one of five values,
    // so naming it costs nothing and is what makes the effect fire on the
    // render where the answer finally arrives.
  }, [account, accountPro, status]);

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
    // Whether a window exists is shared between this effect and the auto-start
    // effect through startedRef, so one opening the clock and the other opening
    // the trial stay in step on the same render.

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
      if (startedRef.current) setGuestState({ remainingMs: fromServer() });
    };

    const sync = async () => {
      const reply = await askServer();
      const at = reply?.expiresAt ? Date.parse(reply.expiresAt) : 0;
      if (reply && at > 0) {
        expiresAt = at;
        serverAnswered = true;
        startedRef.current = true;
        setStarted(true);
        // Mirror it locally so a reload or a flaky connection still counts the
        // same clock rather than restarting the ten minutes.
        try {
          localStorage.setItem(GUEST_KEY, String(at - TRIAL_MS));
        } catch {
          /* ignore */
        }
      }
      // The answer arrived either way: there is a window, or there is not and
      // the form is what belongs on screen. Either way the gate now knows, and
      // the "still working it out" state can end.
      setChecked(true);
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
    // spent on. The re-check is not skipped when the last answer was "no trial":
    // the trial may have been opened by another tab or recovered from an error,
    // and the check is one small POST that keeps those cases from silently
    // staying clockless.
    const poll = setInterval(() => {
      if (serverAnswered) reportBeatUsed();
      void sync();
    }, 30_000);

    return () => {
      alive = false;
      clearInterval(timer);
      clearInterval(poll);
      if (serverAnswered) reportBeatUsed(true);
      document.removeEventListener("visibilitychange", onHide);
    };
  }, [localPro, accountPro, accountChecking, setStarted]);

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
      const reply = await askServer();
      setChecked(true);
      if (reply) {
        startedRef.current = true;
        setStarted(true);
        setGuestState({ remainingMs: reply.remainingMs });
        // Arm the 1s ticker with the same window: without the local stamp it
        // would fall back to its own stale clock and the chip would snap back.
        try {
          localStorage.setItem(GUEST_KEY, String(Date.now() + reply.remainingMs - TRIAL_MS));
        } catch {
          /* ignore */
        }
      }
    })();
  }, []);

  return { status, remainingMs, isPro, resolving, started, resetTrial };
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
