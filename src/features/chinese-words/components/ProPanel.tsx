"use client";

import { CheckCircle2, MessageCircle, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import ProSubscriptionForm from "./ProSubscriptionForm";
import {
  formatRemaining,
  ASK_FOR_MORE_TIME_URL,
  ADMIN_WHATSAPP_DISPLAY,
  type ProAccessStatus,
} from "./pro-access";

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
 *
 * `onResetTrial` is a flag, not a callback any more. The preview is ten minutes
 * once, kept on the server, and only the admin extends it — a button that gave
 * everybody unlimited extra ten minutes made the promise meaningless. The
 * affordance is now a WhatsApp message, which is how a renewal actually gets
 * asked for and granted.
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
  /** Shows the "ask for more time" line when the preview is not running. */
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

      {!isPro && <OutOfTimeChoices onAsk={onResetTrial} />}
    </div>
  );
}

/**
 * What a visitor is offered once the ten minutes are gone: pay the ৳500, or ask
 * the teacher for more time.
 *
 * Both were previously a single small link under the payment form, which read as
 * an afterthought — and the one a real person often wants is not the one to pay.
 * The number is spelled out on the button because most people who want to
 * message will not go looking for it, and the admin matches the request against
 * the visitor in /admin/pro-trials once the number arrives.
 */
function OutOfTimeChoices({ onAsk }: { onAsk?: () => void }) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  return (
    <div className="mt-4 rounded-2xl border border-text/12 bg-background p-4">
      <p className="text-[12px] font-semibold text-text">
        {t("দুইটি পথ আছে", "There are two ways forward")}
      </p>

      <ul className="mt-2.5 space-y-2 text-[12px] leading-relaxed text-text/70">
        <li className="flex gap-2">
          <span aria-hidden="true" className="text-secondary">
            1.
          </span>
          <span>
            {t(
              "Pro নিন — ৳৫০০ একবার, সব ডিভাইসে আজীবন চালু। উপরের ফর্মে TrxID দিন।",
              "Take Pro — ৳500 once, yours for life on every device. Put the TrxID in the form above.",
            )}
          </span>
        </li>
        <li className="flex gap-2">
          <span aria-hidden="true" className="text-secondary">
            2.
          </span>
          <span>
            {t(
              "না চাইলে আরও ১০ মিনিট চাইতে পারেন — সরাসরি মেসেজ করুন।",
              "Or ask for another ten minutes instead — just message.",
            )}
          </span>
        </li>
      </ul>

      {onAsk && (
        <a
          href={ASK_FOR_MORE_TIME_URL}
          target="_blank"
          rel="noopener noreferrer"
          className="mt-3 inline-flex items-center gap-2 rounded-xl border border-ok/40 bg-ok-surface px-4 py-2.5 text-[13px] font-semibold text-ok transition-colors hover:bg-ok/10"
        >
          <MessageCircle className="size-4 shrink-0" aria-hidden="true" />
          {t("মেসেজ করে সময় বাড়ান", "Message for more time")}
          <span className="font-mono font-normal opacity-80">{ADMIN_WHATSAPP_DISPLAY}</span>
        </a>
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
