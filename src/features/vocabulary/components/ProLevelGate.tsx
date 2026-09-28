"use client";

import {
  useRef,
  type ReactNode,
} from "react";
import { Lock, MessageCircle } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import ProAccessButton, { type ProAccessHandle } from "@/features/chinese-words/components/ProAccessButton";
import {
  useProAccess,
  ASK_FOR_MORE_TIME_URL,
  ADMIN_WHATSAPP_DISPLAY,
} from "@/features/chinese-words/components/pro-access";

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
  const { status, isPro } = useProAccess();
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

  // Inside the ten-minute preview. The corner control already carries the clock
  // next to the Pro button, so this page adds nothing of its own.
  if (status === "guest") {
    return (
      <>
        {children}
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
            `HSK 1 সম্পূর্ণ ফ্রি। HSK ${level}-এর শব্দ, পাঠ ও অনুশীলন দেখতে Pro লাগে।`,
            `HSK 1 is completely free. HSK ${level}'s words, texts and practice need Pro.`,
          )}
        </p>
        <div className="flex flex-wrap items-center justify-center gap-3">
          <button
            type="button"
            onClick={() => proRef.current?.open()}
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            ✦ {t("Pro নিন — ৳৫০০, আজীবন", "Get Pro — ৳500, for life")}
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

        {/* The other way forward, stated as plainly as the first. Most of the
            people who land here do not want to pay yet, and a buried link was
            not offering them anything. */}
        <div className="mt-1 max-w-md rounded-2xl border border-text/12 bg-background p-4 text-left">
          <p className="text-[12px] leading-relaxed text-text/70">
            {t(
              "১০ মিনিট শেষ হয়ে গেছে। Pro নিতে না চাইলে আরও ১০ মিনিট চাইতে পারেন —",
              "Your ten minutes are up. If you would rather not take Pro yet, you can ask for another ten —",
            )}
          </p>
          <a
            href={ASK_FOR_MORE_TIME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="mt-2.5 inline-flex items-center gap-2 rounded-xl border border-ok/40 bg-ok-surface px-4 py-2.5 text-[13px] font-semibold text-ok transition-colors hover:bg-ok/10"
          >
            <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
            {t("মেসেজ করে সময় বাড়ান", "Message for more time")}
            <span className="font-mono font-normal opacity-80">{ADMIN_WHATSAPP_DISPLAY}</span>
          </a>
        </div>
      </div>
      <ProAccessButton ref={proRef} />
    </>
  );
}