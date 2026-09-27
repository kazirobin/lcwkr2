"use client";

import {
  useCallback,
  useRef,
  useSyncExternalStore,
  type ReactNode,
} from "react";
import { Lock } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import ProAccessButton, { type ProAccessHandle } from "@/features/chinese-words/components/ProAccessButton";

/**
 * The old self-serve unlock key. Pro is now granted on the student's account by
 * the admin, but anyone who was already unlocked on this device keeps access,
 * so the flag is still read (never written).
 */
const PRO_KEY = "cw:pro";

function getProSnapshot() {
  try {
    return localStorage.getItem(PRO_KEY) === "1";
  } catch {
    /* storage unavailable */
    return false;
  }
}

// The server has no localStorage, so it always renders the locked view. React
// swaps in the real value on hydration, which is what `useSyncExternalStore`
// is for — no setState-in-effect cascade.
function getProServerSnapshot() {
  return false;
}

const noopSubscribe = () => () => {};
const getTrue = () => true;
const getFalse = () => false;

/**
 * Server-friendly Pro gate for a whole level track. HSK 1 is free; any higher
 * level needs Pro.
 *
 * Pro is now granted by the admin on the student's account, so the account flag
 * is the source of truth. The old `cw:pro` localStorage key is still honoured
 * for anyone already unlocked on this device, but it is no longer something a
 * student can set for themselves.
 *
 * Guests and non-Pro students see a lock screen with a way to ask for Pro;
 * the corner Pro badge lets subscribers manage their status.
 */
export default function ProLevelGate({
  level,
  aside,
  children,
}: {
  level: number;
  /** Shown on the lock screen only — e.g. the lesson book, which is free. */
  aside?: ReactNode;
  children: ReactNode;
}) {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const { student: account } = useAccount();

  const localPro = useSyncExternalStore(
    () => () => {},
    getProSnapshot,
    getProServerSnapshot,
  );
  // The admin decides this on the server, so it is what actually matters.
  const isPro = localPro || Boolean(account?.isPro);
  // False on the server and on the very first client render, true right after
  // hydration — lets subscribers render their children before the gate
  // resolves instead of flashing the lock screen.
  const hydrated = useSyncExternalStore(noopSubscribe, getTrue, getFalse);
  const proRef = useRef<ProAccessHandle>(null);

  if (level <= 1) return <>{children}</>;
  if (!hydrated) return <>{children}</>; // avoid flashing the lock for pro users

  if (isPro) {
    return (
      <>
        {children}
        <ProAccessButton ref={proRef} />
      </>
    );
  }

  return (
    <>
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-5 py-16 text-center">
        {aside}
        <div className="flex size-14 items-center justify-center rounded-2xl border border-text/12 bg-text/5">
          <Lock className="size-6 text-secondary" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          {t(`HSK ${level} — প্রো ফিচার`, `HSK ${level} — a Pro feature`)}
        </h1>
        <p className="max-w-md text-sm leading-6 text-text/60">
          {t(
            `HSK 1 সম্পূর্ণ ফ্রি। HSK ${level} এর সব শব্দ, পাঠ ও অনুশীলন দেখতে প্রো লাগে — প্রো teacher-ই চালু করে দেন।`,
            `HSK 1 is completely free. HSK ${level}'s words, texts and practice need Pro, which your teacher switches on for you.`,
          )}
        </p>
        <button
          type="button"
          onClick={() => proRef.current?.open()}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
        >
          ✦ {t("প্রো চান", "Ask for Pro")}
        </button>
      </div>
      <ProAccessButton ref={proRef} />
    </>
  );
}