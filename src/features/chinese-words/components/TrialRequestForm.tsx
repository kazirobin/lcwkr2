"use client";

import { useState } from "react";
import { Clock, Loader2, Sparkles } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import { startTrial, type StartTrialResult } from "./pro-access";

/**
 * The form a visitor fills in to get their ten minutes.
 *
 * Name, WhatsApp number and location, all three required, and it opens the
 * window the moment it is sent. Nothing here waits for a person to approve it —
 * the ten minutes are the marketing, so a queue in front of them would cost more
 * than it was worth.
 *
 * The reason it asks at all, when it did not used to, is the admin's side: a
 * request with nothing on it could be renewed but nobody could tell whose it was,
 * so a renewal meant guessing. These three fields are what turn the preview into
 * a list of people the site owner can actually act on.
 *
 * A signed-in student is not asked for anything — their account already knows
 * all three, and retyping your own details is how a number ends up wrong.
 */
export default function TrialRequestForm({ onStarted }: { onStarted?: () => void }) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const { student: account } = useAccount();

  const [name, setName] = useState("");
  const [whatsapp, setWhatsapp] = useState("");
  const [location, setLocation] = useState("");
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [problem, setProblem] = useState("");

  // A student never sees this form at all — see TrialGate.
  if (account) return null;

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (busy) return;

    const next: Record<string, string> = {};
    if (name.trim().length < 2) next.name = t("নাম লিখুন", "Please enter your name");
    if (whatsapp.replace(/\D/g, "").length < 10) {
      next.whatsapp = t("সঠিক মোবাইল নম্বর দিন", "Enter a valid mobile number");
    }
    if (location.trim().length < 2) {
      next.location = t("অবস্থান লিখুন", "Please enter your location");
    }
    setErrors(next);
    if (Object.keys(next).length) return;

    setBusy(true);
    setProblem("");
    const result: StartTrialResult = await startTrial({ name, whatsapp, location });
    setBusy(false);
    if (!result.ok) {
      setProblem(result.message);
      return;
    }
    onStarted?.();
  };

  const input =
    "w-full rounded-xl border border-text/15 bg-card px-3.5 py-2.5 text-sm text-text outline-none transition focus-visible:border-secondary focus-visible:outline-2 focus-visible:outline-offset-1";

  return (
    <div className="mx-auto flex min-h-[70vh] w-full max-w-md flex-col items-center justify-center px-4 py-14">
      <div className="flex size-14 items-center justify-center rounded-2xl border border-secondary/30 bg-secondary/10">
        <Clock className="size-6 text-secondary" aria-hidden="true" />
      </div>

      <h1 className="mt-5 text-center text-2xl font-bold text-text">
        {t("Pro ফ্রি ১০ মিনিট চান?", "Want ten free minutes of Pro?")}
      </h1>
      <p className="mt-2 max-w-sm text-center text-sm leading-relaxed text-text/60">
        {t(
          "নাম, মোবাইল নম্বর ও অবস্থান দিন — সাথে সাথে ১০ মিনিট চালু হয়ে যাবে। শুধু একবার, তারপর admin প্রয়োজন হলে আরও ১০ মিনিট দিতে পারেন।",
          "Give your name, mobile number and location — the ten minutes start straight away. Once only, after which the teacher can add another ten if you need it.",
        )}
      </p>

      <form onSubmit={submit} className="mt-7 w-full space-y-3.5" noValidate>
        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-text/70">
            {t("নাম", "Name")} <span className="text-secondary">*</span>
          </label>
          <input
            className={input}
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder={t("যেমন: রহিম উদ্দিন", "e.g. Rahim Uddin")}
            aria-invalid={Boolean(errors.name)}
          />
          {errors.name && <p className="mt-1 text-[11px] text-danger">{errors.name}</p>}
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-text/70">
            {t("মোবাইল নম্বর (WhatsApp)", "Mobile number (WhatsApp)")}{" "}
            <span className="text-secondary">*</span>
          </label>
          <input
            className={input}
            inputMode="tel"
            value={whatsapp}
            onChange={(e) => setWhatsapp(e.target.value)}
            placeholder="01XXXXXXXXX"
            aria-invalid={Boolean(errors.whatsapp)}
          />
          {errors.whatsapp ? (
            <p className="mt-1 text-[11px] text-danger">{errors.whatsapp}</p>
          ) : (
            <p className="mt-1 text-[11px] text-text/45">
              {t(
                "এই নম্বরেই admin আরও সময় দিতে যোগাযোগ করবেন।",
                "The teacher will use this number if you ask for more time.",
              )}
            </p>
          )}
        </div>

        <div>
          <label className="mb-1.5 block text-[12px] font-semibold text-text/70">
            {t("অবস্থান", "Location")} <span className="text-secondary">*</span>
          </label>
          <input
            className={input}
            value={location}
            onChange={(e) => setLocation(e.target.value)}
            placeholder={t("যেমন: মিরপুর ১০, ঢাকা", "e.g. Mirpur 10, Dhaka")}
            aria-invalid={Boolean(errors.location)}
          />
          {errors.location && <p className="mt-1 text-[11px] text-danger">{errors.location}</p>}
        </div>

        {problem && <p className="text-[12px] text-danger">{problem}</p>}

        <button
          type="submit"
          disabled={busy}
          className="flex w-full items-center justify-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90 disabled:opacity-60"
        >
          {busy ? (
            <Loader2 className="size-4 animate-spin" aria-hidden="true" />
          ) : (
            <Sparkles className="size-4" aria-hidden="true" />
          )}
          {busy
            ? t("চালু হচ্ছে…", "Starting…")
            : t("১০ মিনিট ফ্রি চালু করুন", "Start my 10 free minutes")}
        </button>
      </form>

      <p className="mt-5 text-center text-[11px] leading-relaxed text-text/40">
        {t(
          "HSK 1 আর পিনয়িন সবসময় ফ্রি — এই ফর্মের দরকার নেই।",
          "HSK 1 and Pinyin are free for good — no form needed there.",
        )}
      </p>
    </div>
  );
}
