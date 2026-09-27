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
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState(false);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* ignore */
    }
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!fullName.trim() || !mobile.trim() || !trxId.trim()) {
      setError(
        t("অনুগ্রহ করে নাম, মোবাইল ও TrxID দিন।", "Please give name, mobile and TrxID.")
      );
      return;
    }
    setError("");
    setBusy(true);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: fullName.trim(),
          whatsapp: mobile.trim(),
          trxId: trxId.trim(),
          location: location.trim(),
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        setError(
          data.message ||
            t("জমা দিতে সমস্যা হয়েছে। আবার চেষ্টা করুন।", "Could not submit. Please try again.")
        );
        return;
      }
      setDone(true);
    } catch {
      setError(t("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।", "Network problem. Try again."));
    } finally {
      setBusy(false);
    }
  };

  // A WhatsApp copy of the same details. The form has already been saved by
  // the time this runs, so this is a courtesy for the student, not the record.
  const sendWhatsAppCopy = () => {
    const msg =
      `*নতুন স্টুডেন্ট রেজিস্ট্রেশন* 🎓\n` +
      `-----------------------------------\n` +
      `👤 *নাম:* ${fullName.trim()}\n` +
      `📱 *মোবাইল:* ${mobile.trim()}\n` +
      `📍 *ঠিকানা:* ${location.trim() || "-"}\n` +
      `💰 *ফি:* ৳${FEE_BDT} (bKash)\n` +
      `🧾 *TrxID:* ${trxId.trim().toUpperCase()}\n` +
      `-----------------------------------\n` +
      `ফর্ম জমা দিয়েছি। অ্যাকাউন্ট active করে ডিফল্ট পাসওয়ার্ড (lcwkr2026) দিয়ে লগইন করতে চাই।`;
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
          <Button type="submit" className="w-full" disabled={busy || done}>
            <span className="inline-flex items-center gap-2">
              <Send className="w-4 h-4" />
              {busy
                ? t("জমা হচ্ছে…", "Submitting…")
                : t("ফর্ম জমা দিন", "Submit the form")}
            </span>
          </Button>
          {done && (
            <div className="space-y-3 rounded-xl border border-ok/40 bg-ok-surface p-4">
              <p className="text-center text-sm font-semibold text-ok">
                ✓ {t("আবেদন admin-এর কাছে পৌঁছেছে!", "Sent to the admin!")}
              </p>
              <p className="text-center text-xs leading-relaxed text-text/70">
                {t(
                  "আপনার নাম, মোবাইল ও TrxID সরাসরি admin-এর তালিকায় জমা হয়েছে। TrxID যাচাই করে admin অনুমোদন দিলে অ্যাকাউন্ট চালু হবে — তখন মোবাইল নম্বর ও ডিফল্ট পাসওয়ার্ড (lcwkr2026) দিয়ে লগইন করবেন।",
                  "Your name, mobile and TrxID are now in the admin's queue. Once the payment is checked and approved the account opens, and you log in with your mobile number and the default password (lcwkr2026).",
                )}
              </p>
              {/* The one thing the student still has to do: nudge the admin on
                  WhatsApp so it does not sit in the queue unnoticed. */}
              <Button
                type="button"
                variant="secondary"
                className="w-full"
                onClick={sendWhatsAppCopy}
              >
                <span className="inline-flex items-center gap-2">
                  <Send className="h-4 w-4" />
                  {t("Admin-কে WhatsApp-এ জানান", "Message the admin on WhatsApp")}
                </span>
              </Button>
              <p className="text-center text-[11px] text-text/50">
                {t(
                  "এটি শুধু একটি মনে করানো — আবেদন ইতিমধ্যে জমা হয়ে গেছে।",
                  "This is just a reminder — the application is already saved.",
                )}
              </p>
            </div>
          )}
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
