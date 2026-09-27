"use client";

import {
  useRef,
  type ReactNode,
} from "react";
import { Clock, Lock } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import ProAccessButton, { type ProAccessHandle } from "@/features/chinese-words/components/ProAccessButton";
import { formatRemaining, useProAccess } from "@/features/chinese-words/components/pro-access";

/**
 * Pro gate for a whole level track.
 *
 * HSK 1 is free outright, so a visitor with no money can learn real Chinese
 * from day one. Everything above it gets a ten-minute preview first: open HSK 2,
 * click through a couple of lessons, hear the audio, and only then does the pay
 * wall appear. That preview is the whole funnel — it is the same ten minutes
 * the Core Words builder gives, so both feel like one site.
 *
 * Access itself comes from the account: the admin switches Pro on the student's
 * record and it works on every device.
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
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const { student: account } = useAccount();
  const { status, remainingMs, isPro, resetTrial } = useProAccess();
  const proRef = useRef<ProAccessHandle>(null);

  if (level <= 1) return <>{children}</>;

  if (isPro) {
    return (
      <>
        {children}
        <ProAccessButton ref={proRef} />
      </>
    );
  }

  // Still working out who this is: show the content rather than flashing a lock
  // at someone who is entitled to it.
  if (status === "pro") {
    return (
      <>
        {children}
        <ProAccessButton ref={proRef} />
      </>
    );
  }

  // Inside the ten-minute preview.
  if (status === "guest") {
    const ending = remainingMs < 2 * 60 * 1000;
    return (
      <>
        {children}
        <div
          className={`fixed bottom-4 left-4 z-50 flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold shadow-lg ${
            ending
              ? "border-danger/45 bg-danger text-white"
              : "border-secondary/40 bg-secondary text-white"
          }`}
        >
          <Clock className="size-3.5" aria-hidden="true" />
          <span className="font-mono tabular-nums">{formatRemaining(remainingMs)}</span>
          <span className="font-normal">
            {t("ফ্রি Pro প্রিভিউ বাকি", "left of your free Pro preview")}
          </span>
        </div>
        <ProAccessButton ref={proRef} />
      </>
    );
  }

  // Preview spent.
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
            `HSK 1 সম্পূর্ণ ফ্রি। HSK ${level}-এর শব্দ, পাঠ ও অনুশীলন দেখতে Pro লাগে — ৳৫০০ সাবস্ক্রিপশনে সব Pro টুল সারাজীবন চালু।`,
            `HSK 1 is completely free. HSK ${level}'s words, texts and practice need Pro — ৳500 once and every Pro tool is yours for life.`,
          )}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => proRef.current?.open()}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            ✦ {t("Pro নিন — ৳৫০০", "Get Pro — ৳500")}
          </button>
          {!account && (
            <a
              href="/register"
              className="text-sm font-medium text-text/60 underline-offset-4 hover:underline"
            >
              {t("আগে ৳৫০০ দিয়ে student হোন", "First, become a student for ৳500")}
            </a>
          )}
        </div>
        <button
          type="button"
          onClick={resetTrial}
          className="mt-2 text-[11px] text-text/40 underline-offset-2 hover:underline"
        >
          {t("আবার ১০ মিনিট দেখুন", "See another 10 minutes")}
        </button>
      </div>
      <ProAccessButton ref={proRef} />
    </>
  );
}