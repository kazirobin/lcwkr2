"use client";

import { useCallback, useEffect, useRef, useState, type ReactNode } from "react";
import { Lock } from "lucide-react";
import { useLanguage } from "@/i18n";
import ProAccessButton, { type ProAccessHandle } from "@/features/chinese-words/components/ProAccessButton";

/**
 * Server-friendly Pro gate for a whole level track. HSK 1 is free; any
 * higher level requires a Pro subscription (same `cw:pro` flag as the
 * Core Words builder / Hanzi Pro).
 *
 * Guests see a lock screen with an unlock CTA; the corner Pro badge is
 * rendered too so subscribers can manage their status.
 */
export default function ProLevelGate({ level, children }: { level: number; children: ReactNode }) {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [ready, setReady] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const proRef = useRef<ProAccessHandle>(null);

  useEffect(() => {
    try {
      setIsPro(localStorage.getItem("cw:pro") === "1");
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, []);

  const refreshPro = () => {
    try {
      setIsPro(localStorage.getItem("cw:pro") === "1");
    } catch {
      /* ignore */
    }
  };

  if (level <= 1) return <>{children}</>;
  if (!ready) return <>{children}</>; // avoid flashing the lock for pro users

  if (isPro) {
    return (
      <>
        {children}
        <ProAccessButton ref={proRef} onUnlock={refreshPro} />
      </>
    );
  }

  return (
    <>
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col items-center justify-center gap-4 px-5 py-16 text-center">
        <div className="flex size-14 items-center justify-center rounded-2xl border border-text/12 bg-text/5">
          <Lock className="size-6 text-secondary" aria-hidden="true" />
        </div>
        <h1 className="text-2xl font-bold text-text sm:text-3xl">
          {t(`HSK ${level} — প্রো ফিচার`, `HSK ${level} — a Pro feature`)}
        </h1>
        <p className="max-w-md text-sm leading-6 text-text/60">
          {t(
            `HSK 1 সম্পূর্ণ ফ্রি। HSK ${level} এর সব শব্দ, পাঠ ও অনুশীলন দেখতে প্রো সাবস্ক্রিপশন প্রয়োজন। একবার সাবস্ক্রাইব করলেই সব প্রো টুল খোলা থাকে।`,
            `HSK 1 is completely free. A Pro subscription is required to open HSK ${level}'s words, texts and practice. One subscription unlocks every Pro tool.`,
          )}
        </p>
        <button
          type="button"
          onClick={() => proRef.current?.open()}
          className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
        >
          ✦ {t("প্রো আনলক করুন", "Unlock Pro")}
        </button>
      </div>
      <ProAccessButton ref={proRef} onUnlock={refreshPro} />
    </>
  );
}