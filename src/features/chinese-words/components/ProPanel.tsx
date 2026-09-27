"use client";

import { CheckCircle2, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import ProSubscriptionForm from "./ProSubscriptionForm";
import { formatRemaining, type ProAccessStatus } from "./pro-access";

/**
 * The one Pro panel.
 *
 * There used to be a copy of the purchase form in the nav, another inside the
 * page's own gate, and a third in the corner badge — so opening Pro from one
 * place left two or three identical forms on screen at once. This component is
 * the single definition, and a page renders it exactly once.
 *
 * Shape: a status line at the top that says where the visitor stands, and the
 * payment form below it only when there is something to pay for.
 */

export default function ProPanel({
  status,
  remainingMs,
  onClose,
  onResetTrial,
}: {
  status: ProAccessStatus;
  remainingMs: number;
  onClose?: () => void;
  onResetTrial?: () => void;
}) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const { student: account } = useAccount();

  const isPro = status === "pro";
  const isGuest = status === "guest";

  return (
    <div className="relative mx-auto w-full max-w-xl">
      {onClose && (
        <button
          type="button"
          onClick={onClose}
          aria-label={t("বন্ধ করুন", "Close")}
          className="absolute -top-3 -right-3 z-10 flex size-9 items-center justify-center rounded-full border border-border bg-card text-text shadow-lg transition-colors hover:bg-text/5"
        >
          <X className="size-4" />
        </button>
      )}

      {/* The status line. Always present, so the panel never opens blank. */}
      {isPro ? (
        <div className="mb-4 rounded-2xl border border-ok/30 bg-ok-surface p-4">
          <p className="text-sm font-semibold text-ok">
            ✓{" "}
            {t(
              "আপনি Pro সদস্য — সব কনটেন্ট আনলক করা আছে।",
              "You're a Pro member — all content is unlocked.",
            )}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-muted">
            {account
              ? t(
                  `Admin থেকে দেওয়া Pro (${account.nameEnglish}) — অ্যাকাউন্টে সব ডিভাইসে চলবে।`,
                  `Admin-granted Pro (${account.nameEnglish}) — works on all devices with this account.`,
                )
              : t(
                  "Pro আপনার অ্যাকাউন্টে চালু আছে, তাই নতুন ডিভাইসেও কাজ করবে।",
                  "Pro is switched on for your account, so it works on a new device too.",
                )}
          </p>
        </div>
      ) : isGuest ? (
        <div className="mb-4 rounded-2xl border border-secondary/30 bg-secondary/10 p-4">
          <p className="flex items-center gap-2 text-sm font-semibold text-secondary">
            <Sparkles className="size-4 shrink-0" aria-hidden="true" />
            {t(
              `আপনার ফ্রি Pro প্রিভিউ বাকি ${formatRemaining(remainingMs)}`,
              `${formatRemaining(remainingMs)} left of your free Pro preview`,
            )}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-text/65">
            {t(
              "প্রিভিউ শেষ হলে Pro নিতে হবে। HSK 1 আর পিনয়িন সবসময় ফ্রি।",
              "When the preview ends you will need Pro. HSK 1 and Pinyin stay free for good.",
            )}
          </p>
        </div>
      ) : (
        <div className="mb-4 rounded-2xl border border-text/12 bg-background p-4">
          <p className="text-sm font-semibold text-text">
            {t("১০ মিনিটের ফ্রি প্রিভিউ শেষ", "Your ten free minutes are up")}
          </p>
          <p className="mt-1 text-[11px] leading-relaxed text-text/65">
            {t(
              "HSK 1 আর পিনয়িন সবসময় ফ্রি থাকবে। বাকি সব Pro টুল চালু করতে নিচের ফর্মে TrxID দিন।",
              "HSK 1 and Pinyin stay free. To switch on the rest, send the amount and enter your TrxID below.",
            )}
          </p>
        </div>
      )}

      <ProSubscriptionForm />

      {onResetTrial && !isPro && (
        <button
          type="button"
          onClick={onResetTrial}
          className="mx-auto mt-4 block text-[11px] text-text/40 underline-offset-2 transition hover:text-text/70 hover:underline"
        >
          {t("আবার ১০ মিনিট দেখুন", "See another 10 minutes")}
        </button>
      )}
    </div>
  );
}

/** The bullet list of what Pro unlocks, reused by the landing copy. */
export const PRO_INCLUDES = [
  { bn: "HSK ২ থেকে ৬ — সব শব্দ, পাঠ ও অনুশীলন", en: "HSK 2 to 6 — every word, text and exercise" },
  { bn: "কোর ওয়ার্ড বিল্ডার — ফ্ল্যাশকার্ড ও স্ট্রোক", en: "Core Word Builder — flashcards and stroke order" },
  { bn: "হানজি প্রো — লেখার অনুশীলন ও ট্র্যাকার", en: "Hanzi Pro — writing practice and progress" },
  { bn: "সব হোমওয়ার্ক, ডায়ালগ ও পরীক্ষা", en: "All homework, dialogue and exam work" },
];

export { CheckCircle2 };
