"use client";

import { useCallback, useEffect, useState } from "react";
import { useAccount } from "@/features/student-auth";

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

  // The ten-minute preview clock, started on the first Pro page a visitor opens.
  useEffect(() => {
    const compute = () => {
      try {
        let start = Number(localStorage.getItem(GUEST_KEY));
        if (!start || Number.isNaN(start)) {
          start = Date.now();
          localStorage.setItem(GUEST_KEY, String(start));
        }
        setGuestState({ remainingMs: Math.max(0, start + TRIAL_MS - Date.now()) });
      } catch {
        // localStorage unavailable: never lock a learner out of their own trial.
        setGuestState({ remainingMs: TRIAL_MS });
      }
    };

    // Both branches go through a microtask: writing the start stamp on the
    // first read, and clearing it when Pro turns on, are both state updates and
    // neither should happen synchronously inside the effect body.
    if (localPro || accountPro) {
      queueMicrotask(() => setGuestState(null));
      return;
    }
    queueMicrotask(compute);
    const timer = setInterval(compute, 1000);
    return () => clearInterval(timer);
  }, [localPro, accountPro]);

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

  /** Start the preview over — used by the "try again" link after a reset. */
  const resetTrial = useCallback(() => {
    try {
      localStorage.removeItem(GUEST_KEY);
      localStorage.setItem(GUEST_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setGuestState({ remainingMs: TRIAL_MS });
  }, []);

  return { status, remainingMs, isPro, resolving, resetTrial };
}

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
