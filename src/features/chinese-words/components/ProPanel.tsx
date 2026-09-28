"use client";

import { ArrowRight, CheckCircle2, MessageCircle, Sparkles, X } from "lucide-react";
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
 * `onResetTrial` is gone. The preview is ten minutes once, kept on the server,
 * and only the admin extends it — a button that gave everybody unlimited extra
 * ten minutes made the promise meaningless. The affordance is now a WhatsApp
 * message, which is how a renewal actually gets asked for and granted.
 */

export default function ProPanel({
  status,
  remainingMs,
  onClose,
}: {
  status: ProAccessStatus;
  remainingMs: number;
  onClose?: () => void;
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

      {!isPro && <OutOfTimeChoices />}
    </div>
  );
}

/**
 * What a visitor is offered once the ten minutes are gone: pay the ৳500, or ask
 * the teacher for more time.
 *
 * Both used to be a single small link under the payment form, which read as an
 * afterthought — and the one a real person often wants is not the one to pay.
 * Each option is now a button sitting on its own line, so the sentence and the
 * thing you can actually press are read together. The number is spelled out on
 * the message button because most people who want to write will not go looking
 * for it, and the request is matched against the visitor in /admin/pro-trials
 * once their number arrives.
 */
function OutOfTimeChoices() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  return (
    <div className="mt-4 rounded-2xl border border-text/12 bg-background p-4">
      <p className="text-[12px] font-semibold text-text">
        {t("১০ মিনিট শেষ। এখন দুইটি পথ আছে", "Your ten minutes are up. Two ways forward")}
      </p>

      <ol className="mt-3 space-y-3">
        <li>
          <button
            type="button"
            onClick={() => {
              // The form is directly above, so take the reader to it rather than
              // telling them it is there.
              document
                .getElementById("pro-trxid-field")
                ?.scrollIntoView({ behavior: "smooth", block: "center" });
            }}
            className="flex w-full items-center gap-3 rounded-xl border border-secondary/40 bg-secondary/10 px-4 py-3 text-left transition-colors hover:bg-secondary/15"
          >
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-secondary text-[11px] font-bold text-white"
            >
              1
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-bold text-text">
                {t("Pro নিন — ৳৫০০ একবার, আজীবন", "Take Pro — ৳500 once, for life")}
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-text/60">
                {t(
                  "সব ডিভাইসে চলবে। উপরের ফর্মে TrxID দিন।",
                  "Works on every device. Put your TrxID in the form above.",
                )}
              </span>
            </span>
            <ArrowRight className="size-4 shrink-0 text-secondary" aria-hidden="true" />
          </button>
        </li>

        <li>
          <a
            href={ASK_FOR_MORE_TIME_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="flex w-full items-center gap-3 rounded-xl border border-ok/40 bg-ok-surface px-4 py-3 text-left transition-colors hover:bg-ok/10"
          >
            <span
              aria-hidden="true"
              className="flex size-6 shrink-0 items-center justify-center rounded-full bg-ok text-[11px] font-bold text-background"
            >
              2
            </span>
            <span className="min-w-0 flex-1">
              <span className="block text-[13px] font-bold text-ok">
                {t("মেসেজ করে আরও ১০ মিনিট চান", "Message for another ten minutes")}
              </span>
              <span className="mt-0.5 block text-[11px] leading-relaxed text-text/60">
                {t(
                  `WhatsApp-এ লিখুন — ${ADMIN_WHATSAPP_DISPLAY}`,
                  `Write on WhatsApp — ${ADMIN_WHATSAPP_DISPLAY}`,
                )}
              </span>
            </span>
            <MessageCircle className="size-4 shrink-0 text-ok" aria-hidden="true" />
          </a>
        </li>
      </ol>
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
