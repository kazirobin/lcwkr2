"use client";

import { useState } from "react";
import Link from "next/link";
import { Check, Copy, Send } from "lucide-react";
import { useLanguage } from "@/i18n";
import { Button, Card } from "@/components/ui";

const BKASH_NUMBER = "01787881334";
const WHATSAPP_NUMBER = "8801787881334";
const FEE_BDT = 500;

export default function RegisterPage() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const [fullName, setFullName] = useState("");
  const [mobile, setMobile] = useState("");
  const [location, setLocation] = useState("");
  const [trxId, setTrxId] = useState("");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const submit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim() || !trxId.trim()) {
      setError(
        t("অনুগ্রহ করে নাম, মোবাইল ও TrxID দিন।", "Please give name, mobile and TrxID.")
      );
      return;
    }
    setError("");
    const msg =
      `*নতুন স্টুডেন্ট রেজিস্ট্রেশন* 🎓\n` +
      `-----------------------------------\n` +
      `👤 *নাম:* ${fullName.trim()}\n` +
      `📱 *মোবাইল:* ${mobile.trim()}\n` +
      `📍 *ঠিকানা:* ${location.trim() || "-"}\n` +
      `💰 *ফি:* ৳${FEE_BDT} (bKash)\n` +
      `🧾 *TrxID:* ${trxId.trim().toUpperCase()}\n` +
      `-----------------------------------\n` +
      `পেমেন্ট সম্পন্ন করেছি। অ্যাকাউন্ট active করে ডিফল্ট পাসওয়ার্ড (lcwkr2026) দিয়ে লগইন করতে চাই।`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  const inputCls =
    "w-full px-3.5 py-2.5 rounded-xl border border-text/15 bg-card text-sm text-text placeholder:text-text/40 focus:outline-none focus:border-secondary transition";

  return (
    <div className="mx-auto max-w-xl px-4 py-12 sm:px-6">
      <Card className="p-6 sm:p-8">
        <p className="text-center text-3xl">🎓</p>
        <h1 className="mt-2 text-center text-2xl font-bold text-text">
          {t("স্টুডেন্ট রেজিস্ট্রেশন", "Student registration")}
        </h1>
        <p className="mt-1 text-center text-xs text-text/55">
          {t(
            `৳${FEE_BDT} বিকাশে পাঠিয়ে ফর্মটি জমা দিন — approve হলে মোবাইল + lcwkr2026 দিয়ে লগইন।`,
            `Send ৳${FEE_BDT} via bKash and submit — after approval login with mobile + lcwkr2026.`
          )}
        </p>

        <div className="mt-5 rounded-2xl bg-background border border-text/10 p-4 space-y-3">
          <p className="text-xs font-bold text-secondary uppercase tracking-wider">
            {t("bKash Personal (Send Money) — ৳৫০০", "bKash Personal (Send Money) — ৳500")}
          </p>
          <div className="flex items-center justify-between bg-card p-3 rounded-xl border border-text/10">
            <span className="font-mono text-lg font-bold tracking-wider text-text">
              {BKASH_NUMBER}
            </span>
            <button
              type="button"
              onClick={copyNumber}
              className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-text/5 hover:bg-text/10 text-text transition"
            >
              {copied ? (
                <>
                  <Check className="w-3.5 h-3.5 text-ok" />
                  <span className="text-ok font-bold">{t("কপি হয়েছে!", "Copied!")}</span>
                </>
              ) : (
                <>
                  <Copy className="w-3.5 h-3.5" />
                  <span>{t("কপি", "Copy")}</span>
                </>
              )}
            </button>
          </div>
        </div>

        <form onSubmit={submit} className="mt-5 space-y-4">
          {error && (
            <p className="rounded-lg bg-red-500/10 px-3 py-2 text-xs font-medium text-red-400">
              {error}
            </p>
          )}
          <div>
            <label className="block text-xs font-semibold mb-1 text-text/80">
              {t("পুরো নাম *", "Full name *")}
            </label>
            <input
              type="text"
              required
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              placeholder={t("আপনার নাম", "Your name")}
              className={inputCls}
            />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold mb-1 text-text/80">
                {t("মোবাইল *", "Mobile *")}
              </label>
              <input
                type="tel"
                required
                value={mobile}
                onChange={(e) => setMobile(e.target.value)}
                placeholder="01XXXXXXXXX"
                className={`${inputCls} font-mono`}
              />
            </div>
            <div>
              <label className="block text-xs font-semibold mb-1 text-text/80">
                {t("ঠিকানা", "Location")}
              </label>
              <input
                type="text"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder={t("ঢাকা", "Dhaka")}
                className={inputCls}
              />
            </div>
          </div>
          <div>
            <label className="block text-xs font-semibold mb-1 text-text/80">
              {t("bKash TrxID *", "bKash TrxID *")}
            </label>
            <input
              type="text"
              required
              value={trxId}
              onChange={(e) => setTrxId(e.target.value)}
              placeholder="e.g. BL92A8XKQ"
              className={`${inputCls} font-mono uppercase`}
            />
          </div>
          <Button type="submit" className="w-full">
            <span className="inline-flex items-center gap-2">
              <Send className="w-4 h-4" />
              {t("WhatsApp-এ পাঠান", "Send via WhatsApp")}
            </span>
          </Button>
        </form>

        <p className="mt-4 text-center text-xs text-text/55">
          {t("অ্যাকাউন্ট আছে?", "Have an account?")}{" "}
          <Link href="/login" className="font-semibold text-secondary hover:underline">
            {t("লগইন", "Login")}
          </Link>
        </p>
      </Card>
    </div>
  );
}
