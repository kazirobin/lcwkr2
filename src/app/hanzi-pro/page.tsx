"use client";

import { useCallback, useMemo, useState } from "react";
import { Check, Copy, ArrowUpRight, Trophy, CalendarDays, Wallet, Target } from "lucide-react";

import { useLanguage } from "@/i18n";
import { LESSON_WORDS } from "@/features/chinese-words";

const BKASH_NUMBER = "01787881334";
const ADMIN_WHATSAPP = "8801787881334";
const START_DAY = "২০ তারিখ";

// HSK 1 lesson-wise word breakdown — the challenge curriculum
const LESSON_COUNTS = (() => {
  const per = new Map<number, number>();
  for (const w of LESSON_WORDS) {
    if (w.level !== 1) continue;
    per.set(w.lesson, (per.get(w.lesson) ?? 0) + 1);
  }
  return [...per.entries()].sort((a, b) => a[0] - b[0]);
})();

const TOTAL_WORDS = LESSON_COUNTS.reduce((n, [, c]) => n + c, 0);

export default function HanziProPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [copied, setCopied] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", trxId: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [waLink, setWaLink] = useState("");

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  const setField = (k: keyof typeof form) => (v: string) => {
    setForm((prev) => ({ ...prev, [k]: v }));
    setErrors((prev) => ({ ...prev, [k]: "" }));
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("নাম লিখুন।", "Please enter your name.");
    if (!form.phone.trim()) e.phone = t("হোয়াটসঅ্যাপ নম্বর দিন।", "Please enter your WhatsApp number.");
    if (!form.trxId.trim()) e.trxId = t("bKash TrxID দিন।", "Please enter the bKash TrxID.");
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    setLoading(true);
    setStatus(null);

    try {
      const res = await fetch("/api/hanzi-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: 200 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t("রেজিস্ট্রেশন হয়নি।", "Registration failed."));
      }

      const message = `🌟 *Hanzi Pro রেজিস্ট্রেশন*\n-------------------------------\n👤 *নাম:* ${form.name}\n📱 *হোয়াটসঅ্যাপ:* ${form.phone}\n💳 *bKash TrxID:* ${form.trxId.trim().toUpperCase()}\n💰 *ফি:* 200 BDT\n🎯 *চ্যালেঞ্জ:* HSK 1 — ${TOTAL_WORDS} টি শব্দ\n-------------------------------\nআমি রেজিস্ট্রেশন সম্পন্ন করেছি। দয়া করে আমাকে গ্রুপে অ্যাড করুন।`;
      const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
      setWaLink(url);
      setStatus({
        type: "success",
        msg: t(
          "রেজিস্ট্রেশন সফল! WhatsApp খুলে মেসেজটি পাঠান — আমরা আপনাকে গ্রুপে অ্যাড করব।",
          "Registration successful! Open WhatsApp and send the message — we'll add you to the group.",
        ),
      });
      setForm({ name: "", phone: "", trxId: "" });
      window.open(url, "_blank", "noopener");
    } catch (err) {
      setStatus({
        type: "error",
        msg: err instanceof Error ? err.message : t("সমস্যা হয়েছে।", "Something went wrong."),
      });
    } finally {
      setLoading(false);
    }
  };

  const highlights = useMemo(
    () => [
      {
        icon: Target,
        title: t(`${TOTAL_WORDS} টি শব্দ`, `${TOTAL_WORDS} words`),
        desc: t("HSK 1 এর লেসন-ভিত্তিক প্রতিটি শব্দ — পিনইন, বাংলা ও ইংরেজি অর্থসহ।", "Every HSK 1 lesson word — with pinyin, Bangla and English meanings."),
      },
      {
        icon: CalendarDays,
        title: t(`${START_DAY} থেকে ক্লাস`, `Classes start on the ${START_DAY}`),
        desc: t("লেসন ধরে ধরে এগোবে — প্রতিদিন একটু একটু করে পুরো তালিকা শেষ।", "Lesson by lesson, a little every day until the whole list is done."),
      },
      {
        icon: Wallet,
        title: t("ফি মাত্র ৳২০০", "Fee only ৳200"),
        desc: t("এককালীন রেজিস্ট্রেশন ফি — bKash Send Money করে TrxID জমা দিন।", "One-time registration fee — send via bKash and submit the TrxID."),
      },
    ],
    [t],
  );

  return (
    <div className="bg-background text-text">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative isolate -mt-16 overflow-hidden bg-[#f8f3ea] in-[.dark]:bg-background sm:-mt-20">
        <span
          aria-hidden="true"
          lang="zh"
          className="pointer-events-none absolute -top-16 right-[4%] hidden select-none text-[22rem] leading-none font-bold text-text/[0.04] lg:block"
        >
          挑
        </span>

        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-secondary">
            <Trophy className="size-3.5" aria-hidden="true" />
            {t("প্রো চ্যালেঞ্জ", "Pro Challenge")}
          </span>

          <h1 className="mt-6 text-[2.4rem] leading-[1.12] font-bold tracking-tight sm:text-5xl">
            {t("হানজি প্রো — ৩০০ শব্দের চ্যালেঞ্জ", "Hanzi Pro — the 300-word challenge")}
          </h1>

          <p className="mt-5 max-w-[56ch] text-base leading-[1.9] text-text/70 sm:text-lg">
            {t(
              "HSK 1 এর লেসন-ভিত্তিক সবগুলো শব্দ এক চ্যালেঞ্জে — লেসন ধরে ধরে শিখুন, নিজের অগ্রগতি ট্র্যাক করুন এবং পুরো তালিকা শেষ করে চ্যাম্পিয়ন হন।",
              "Every HSK 1 lesson word in one challenge — learn lesson by lesson, track your progress and finish the whole list as a champion.",
            )}
          </p>

          {/* highlights */}
          <div className="mt-8 grid gap-4 sm:grid-cols-3">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="rounded-2xl border border-text/12 bg-card/70 p-5 backdrop-blur-sm">
                  <Icon className="size-5 text-secondary" aria-hidden="true" />
                  <h2 className="mt-3 text-sm font-bold text-text">{h.title}</h2>
                  <p className="mt-1 text-xs leading-6 text-text/60">{h.desc}</p>
                </div>
              );
            })}
          </div>

          {/* bKash number */}
          <div className="mt-8 max-w-lg border border-text/15 bg-background px-4 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text/50">
                  bKash/Rocket Personal Number
                </p>
                <p className="mt-1 font-mono text-xl tracking-[0.12em] text-text tabular-nums select-all">
                  {BKASH_NUMBER}
                </p>
              </div>
              <button
                type="button"
                onClick={copyNumber}
                className="inline-flex items-center gap-2 rounded-xl border border-text/15 px-3.5 py-2 text-sm font-medium text-text transition-colors hover:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
              >
                {copied ? (
                  <Check className="size-4 text-ok" aria-hidden="true" />
                ) : (
                  <Copy className="size-4 text-text/50" aria-hidden="true" />
                )}
                <span aria-live="polite">{copied ? t("কপি হয়েছে", "Copied") : t("কপি", "Copy")}</span>
              </button>
            </div>
            <p className="mt-2 text-xs text-text/55">
              {t(
                "৳২০০ Send Money করার পর নিচের ফর্মে TrxID সাবমিট করুন।",
                "After sending ৳200 via bKash, submit the TrxID in the form below.",
              )}
            </p>
          </div>
        </div>
      </section>

      {/* ═══════════ CURRICULUM ═══════════ */}
      <section className="border-t border-text/10 bg-background py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-text sm:text-3xl">
            <Target className="size-6 text-secondary" aria-hidden="true" />
            {t("চ্যালেঞ্জ কারিকুলাম", "The challenge curriculum")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-text/60">
            {t(
              "HSK 1 এর ১৫টি লেসনে ছড়ানো মোট শব্দ — প্রতিটি লেসন শেষ করলেই অগ্রগতি বাড়বে।",
              `All HSK 1 words across 15 lessons — each finished lesson grows your progress.`,
            )}
          </p>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {LESSON_COUNTS.map(([lesson, count]) => (
              <li
                key={lesson}
                className="rounded-xl border border-text/12 bg-card p-3.5 text-center shadow-sm"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text/45">
                  {t("লেসন", "Lesson")} {lesson}
                </p>
                <p className="mt-1 font-mono text-xl font-bold tabular-nums text-text">{count}</p>
                <p className="text-[10px] uppercase tracking-[0.1em] text-text/40">
                  {t("শব্দ", "words")}
                </p>
              </li>
            ))}
            <li className="rounded-xl border border-secondary/40 bg-secondary/10 p-3.5 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-secondary">
                {t("মোট", "Total")}
              </p>
              <p className="mt-1 font-mono text-xl font-bold tabular-nums text-secondary">{TOTAL_WORDS}</p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-secondary/70">
                {t("শব্দ", "words")}
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* ═══════════ REGISTRATION FORM ═══════════ */}
      <section className="border-t border-text/10 bg-background py-14 md:py-20">
        <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
          <h2 className="text-2xl font-bold tracking-tight text-text sm:text-3xl">
            {t("রেজিস্ট্রেশন করুন", "Register for the challenge")}
          </h2>
          <p className="mt-2 text-sm text-text/60">
            {t(
              "ফর্ম জমা দিলে সরাসরি WhatsApp-এ আপনার তথ্য চলে আসবে — আমরা আপনাকে গ্রুপে অ্যাড করে দেব।",
              "Submitting the form opens WhatsApp with your details — we'll add you to the group.",
            )}
          </p>

          <form onSubmit={handleSubmit} className="mt-7 space-y-5 rounded-3xl border border-text/12 bg-card/70 p-6 sm:p-8">
            {[
              {
                k: "name" as const,
                label: t("আপনার নাম", "Full name"),
                placeholder: t("যেমন: Kazi Robin", "e.g. Kazi Robin"),
                type: "text" as const,
              },
              {
                k: "phone" as const,
                label: t("হোয়াটসঅ্যাপ নম্বর", "WhatsApp number"),
                placeholder: "01XXXXXXXXX",
                type: "tel" as const,
              },
              {
                k: "trxId" as const,
                label: t("bKash TrxID (৳২০০)", "bKash TrxID (৳200)"),
                placeholder: "যেমন: 9K2L1M4P",
                type: "text" as const,
              },
            ].map((f) => (
              <div key={f.k}>
                <label htmlFor={`hp-${f.k}`} className="block text-sm font-medium text-text">
                  {f.label}
                  <span className="ml-0.5 text-secondary" aria-hidden="true">
                    *
                  </span>
                </label>
                <input
                  id={`hp-${f.k}`}
                  type={f.type}
                  required
                  value={form[f.k]}
                  onChange={(e) => setField(f.k)(e.target.value)}
                  placeholder={f.placeholder}
                  className={`mt-1.5 w-full rounded-xl border bg-background px-3.5 py-2.5 text-[15px] text-text transition-colors placeholder:text-text/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                    errors[f.k] ? "border-danger" : "border-text/20 focus-visible:border-text"
                  } ${f.k === "trxId" ? "uppercase" : ""}`}
                />
                {errors[f.k] && (
                  <p className="mt-1.5 text-xs font-medium text-danger">{errors[f.k]}</p>
                )}
              </div>
            ))}

            <button
              type="submit"
              disabled={loading}
              aria-busy={loading}
              className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-text px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-55"
            >
              {loading ? t("জমা হচ্ছে…", "Submitting…") : t("রেজিস্ট্রেশন কনফার্ম করুন", "Confirm registration")}
              <ArrowUpRight className="size-4" aria-hidden="true" />
            </button>

            <div aria-live="polite" className="empty:mt-0">
              {status && (
                <div
                  role={status.type === "error" ? "alert" : "status"}
                  className={`flex flex-wrap items-center gap-x-2 gap-y-3 border px-4 py-3 text-sm ${
                    status.type === "error"
                      ? "border-danger/40 bg-danger-surface text-text"
                      : "border-ok/40 bg-ok-surface text-text"
                  }`}
                >
                  {status.type === "success" && (
                    <Check className="size-4 text-ok" aria-hidden="true" />
                  )}
                  <span>{status.msg}</span>
                  {status.type === "success" && waLink && (
                    <a
                      href={waLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-semibold text-text underline underline-offset-2"
                    >
                      {t("WhatsApp খুলুন", "Open WhatsApp")}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  )}
                </div>
              )}
            </div>
          </form>
        </div>
      </section>
    </div>
  );
}
