"use client";

import { useState } from "react";
import Link from "next/link";
import { CheckCircle2, Eye, EyeOff, Infinity as InfinityIcon, Send, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";

/**
 * The join-Pro panel.
 *
 * Pro costs ৳500 once, for life. The student pays by bKash, types the TrxID,
 * and the admin confirms — there is no card form and no self-serve unlock, so
 * the price on the page and the price in the admin queue can never drift.
 *
 * A visitor with no account is pointed at the ৳500 student registration first,
 * because Pro lives on an account and one phone number should own everything
 * they have bought.
 */

const BKASH_NUMBER = "01787881334";
const WHATSAPP_NUMBER = "8801787881334";
const PRO_PRICE = 500;

export default function ProSubscriptionForm() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const { student: account } = useAccount();

  const [showDemo, setShowDemo] = useState(false);
  const [trxId, setTrxId] = useState("");
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const [done, setDone] = useState(false);

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    if (trxId.trim().length < 4) {
      setError(t("bKash TrxID লিখুন।", "Enter the bKash TrxID."));
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/pro/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ whatsapp: account.whatsapp, name: account.nameEnglish, trxId }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(data.message || t("জমা দিতে সমস্যা হয়েছে।", "Could not submit."));
        return;
      }
      setDone(true);
    } catch {
      setError(t("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।", "Network problem. Try again."));
    } finally {
      setBusy(false);
    }
  };

  return (
    <div
      className={`mx-auto w-full max-w-xl rounded-3xl border border-border bg-card p-6 text-text shadow-xl sm:p-8 ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      <div className="mb-6 space-y-2 text-center">
        <span className="inline-flex items-center gap-1 rounded-full border border-secondary/25 bg-secondary/10 px-3 py-1 font-mono text-xs font-bold uppercase tracking-wider text-secondary">
          <Sparkles className="size-3.5" />
          {t("প্রো সাবস্ক্রিপশন", "Pro subscription")}
        </span>
        <h2 className="text-2xl font-bold tracking-tight sm:text-3xl">
          {t("সব Pro ফিচার সারাজীবন", "Every Pro feature, for life")}
        </h2>
        <p className="mx-auto max-w-sm text-xs text-muted sm:text-sm">
          {t(
            `একবার ৳${PRO_PRICE} দিলে HSK ২–৬, কোর ওয়ার্ড, হানজি প্রো ও সব হোমওয়ার্ক — আজীবন মেয়াদ।`,
            `Pay ৳${PRO_PRICE} once and HSK 2–6, Core Words, Hanzi Pro and every homework tool are yours — no expiry.`,
          )}
        </p>
      </div>

      {!account ? (
        /* No account yet: the ৳500 student registration comes first, because Pro
           is attached to one phone number. */
        <div className="mb-6 space-y-3 rounded-2xl border border-border bg-background p-5 text-center">
          <p className="text-sm font-semibold text-text">
            {t(
              "প্রথমে ৳৫০০ দিয়ে student অ্যাকাউন্ট খুলুন",
              "Start with the ৳500 student account",
            )}
          </p>
          <p className="text-xs leading-relaxed text-muted">
            {t(
              "Pro অ্যাকাউন্টের সাথে যুক্ত, তাই একই নম্বরে সব কিছু থাকবে।",
              "Pro lives on your account, so one number holds everything you buy.",
            )}
          </p>
          <div className="flex flex-wrap items-center justify-center gap-3 pt-1">
            <Link
              href="/register"
              className="rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-background transition hover:opacity-90"
            >
              {t("৳৫০০ — student হোন", "৳500 — become a student")}
            </Link>
            <Link
              href="/login"
              className="text-sm font-semibold text-secondary underline-offset-2 hover:underline"
            >
              {t("আমার অ্যাকাউন্ট আছে", "I already have an account")}
            </Link>
          </div>
        </div>
      ) : done ? (
        <div className="mb-6 space-y-2 rounded-2xl border border-ok/40 bg-ok-surface p-5 text-center">
          <p className="text-sm font-semibold text-ok">
            ✓ {t("আবেদন পেয়েছি!", "Payment received!")}
          </p>
          <p className="text-xs leading-relaxed text-text/70">
            {t(
              "TrxID যাচাই হলে আপনার অ্যাকাউন্টে Pro চালু হবে — তখন যেকোনো ডিভাইস থেকেই HSK ২–৬ খুলবে।",
              "Once the TrxID is verified Pro turns on for your account, and HSK 2–6 opens on any device.",
            )}
          </p>
          <a
            href={`https://wa.me/${WHATSAPP_NUMBER}`}
            target="_blank"
            rel="noreferrer"
            className="inline-block pt-1 text-xs text-text/55 underline-offset-2 hover:underline"
          >
            {t("জরুরি প্রয়োজনে জিজ্ঞাসা করুন", "Ask if it is urgent")}
          </a>
        </div>
      ) : (
        <>
          <div className="mb-6 space-y-3 rounded-2xl border border-border bg-background p-4">
            <p className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
              {t("bKash Personal (Send Money)", "bKash Personal (Send Money)")}
            </p>
            <div className="flex items-center justify-between rounded-xl border border-border bg-card p-3">
              <span className="font-mono text-lg font-bold tracking-wider text-text">
                {BKASH_NUMBER}
              </span>
              <span className="rounded-full bg-secondary/10 px-3 py-1 font-mono text-sm font-bold text-secondary">
                ৳{PRO_PRICE}
              </span>
            </div>
            <p className="text-[11px] leading-relaxed text-muted">
              {t(
                "পাঠিয়ে TrxID দিন। যাচাই হলে Pro চালু — আজীবন মেয়াদ, কোনো মাসিক চার্জ নেই।",
                "Send it, then enter the TrxID. Once verified Pro is on — for life, with no monthly charge.",
              )}
            </p>
          </div>

          <form onSubmit={submit} className="mb-6 space-y-3">
            {error && <p className="text-xs font-medium text-danger">{error}</p>}
            <div className="flex gap-2">
              <input
                type="text"
                value={trxId}
                onChange={(e) => setTrxId(e.target.value.toUpperCase())}
                placeholder={t("যেমন: BL92A8XKQ", "e.g. BL92A8XKQ")}
                className="w-full flex-1 rounded-xl border border-border bg-card px-3.5 py-2.5 font-mono text-sm uppercase text-text outline-none transition focus:border-primary"
              />
              <button
                type="submit"
                disabled={busy}
                className="inline-flex items-center gap-1.5 rounded-xl bg-primary px-4 py-2.5 text-sm font-semibold text-primary-foreground transition hover:opacity-95 disabled:opacity-60"
              >
                <Send className="size-4" />
                {busy ? t("পাঠানো হচ্ছে…", "Sending…") : t("জমা দিন", "Submit")}
              </button>
            </div>
          </form>
        </>
      )}

      {/* What the money actually buys, spelled out. */}
      <ul className="mb-6 space-y-2">
        {[
          t("HSK ২ থেকে ৬ — সব শব্দ, পাঠ ও অনুশীলন", "HSK 2 to 6 — every word, text and exercise"),
          t("কোর ওয়ার্ড বিল্ডার — ফ্ল্যাশকার্ড ও স্ট্রোক", "Core Word Builder — flashcards and stroke order"),
          t("হানজি প্রো — লেখার অনুশীলন ও ট্র্যাকার", "Hanzi Pro — writing practice and progress"),
          t("সব হোমওয়ার্ক, ডায়ালগ ও পরীক্ষা", "All homework, dialogue and exam work"),
        ].map((line) => (
          <li key={line} className="flex items-start gap-2 text-[13px] leading-snug text-text/80">
            <CheckCircle2 className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden="true" />
            <span>{line}</span>
          </li>
        ))}
        <li className="flex items-start gap-2 text-[13px] leading-snug font-semibold text-text">
          <InfinityIcon className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
          <span>
            {t("আজীবন মেয়াদ — কোনো মাসিক চার্জ নেই", "For life — no monthly charge")}
          </span>
        </li>
      </ul>

      <div className="pt-2 text-center">
        <button
          type="button"
          onClick={() => setShowDemo((prev) => !prev)}
          className="inline-flex items-center gap-1.5 rounded-xl border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-semibold text-secondary transition hover:bg-secondary/15"
        >
          {showDemo ? (
            <>
              <EyeOff className="size-3.5" />
              <span>{t("ডেমো বন্ধ করুন", "Hide demo")}</span>
            </>
          ) : (
            <>
              <Eye className="size-3.5" />
              <span>{t("Pro ফিচার দেখুন", "See what Pro has")}</span>
            </>
          )}
        </button>
      </div>

      {showDemo && (
        <div className="mt-4 space-y-3 rounded-2xl border border-secondary/25 bg-background p-4">
          <p className="font-mono text-xs font-bold uppercase tracking-wider text-secondary">
            {t("Pro মেটেরিয়াল ডেমো", "Pro material demo")}
          </p>
          <p className="text-[11px] leading-relaxed text-muted">
            {t(
              "Pro হলে HSK কোর শব্দভাণ্ডার, পিনয়িন, স্ট্রোক অর্ডার এবং অর্থসহ পূর্ণাঙ্গ ফ্ল্যাশকার্ড ও নোটবুক।",
              "Pro includes the full HSK core vocabulary with pinyin, stroke order, flashcards and notebook.",
            )}
          </p>
          <p className="flex items-center gap-1.5 text-[11px] font-semibold text-ok">
            <InfinityIcon className="size-3.5" aria-hidden="true" />
            {t("১০ মিনিট ফ্রি প্রিভিউ — এখনই দেখে নিন", "Ten free minutes — try it now")}
          </p>
        </div>
      )}
    </div>
  );
}
