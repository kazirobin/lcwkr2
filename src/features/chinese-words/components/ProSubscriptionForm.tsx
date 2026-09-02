"use client";

import React, { useState } from "react";
import Image from "next/image";
import { Copy, Check, Send, Sparkles, AlertCircle, Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";

export default function ProSubscriptionForm() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const BKASH_NUMBER = "01787881334";
  const WHATSAPP_NUMBER = "8801787881334";

  // Form states
  const [fullName, setFullName] = useState("");
  const [senderPhone, setSenderPhone] = useState("");
  const [trxId, setTrxId] = useState("");
  const [planType, setPlanType] = useState("Lifetime Access (৳৪৯৯)");
  const [copied, setCopied] = useState(false);
  const [error, setError] = useState("");

  // ডেমো ওপেন/ক্লোজ স্টেট
  const [showDemo, setShowDemo] = useState(false);

  // bKash নম্বর কপি হ্যান্ডলার
  const handleCopyNumber = () => {
    navigator.clipboard.writeText(BKASH_NUMBER);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // ফর্ম সাবমিট এবং WhatsApp-এ ডিরেক্ট মেসেজ রিডাইরেক্ট
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (!fullName.trim() || !senderPhone.trim() || !trxId.trim()) {
      setError(
        language === "bn"
          ? "অনুগ্রহ করে সব তথ্য সঠিকভাবে পূরণ করুন।"
          : "Please fill in all fields correctly."
      );
      return;
    }

    setError("");

    const whatsappMessage = `*নতুন Pro সাবস্ক্রিপশন আবেদন* 🌟
-----------------------------------
👤 *নাম:* ${fullName.trim()}
📱 *বিকাশ প্রেরক নম্বর:* ${senderPhone.trim()}
💳 *প্ল্যান:* ${planType}
🧾 *bKash TrxID:* ${trxId.trim().toUpperCase()}
-----------------------------------
আমি পেমেন্ট সম্পন্ন করেছি। অনুগ্রহ করে আমার অ্যাকাউন্টটি ভেরিফাই করে অ্যাক্সেস পাসওয়ার্ড প্রদান করুন।`;

    const whatsappUrl = `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(
      whatsappMessage
    )}`;

    window.open(whatsappUrl, "_blank");
  };

  return (
    <div
      className={`w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-background border border-text/15 shadow-xl text-text ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 border border-secondary/25 text-secondary text-xs font-mono font-bold rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          {t("প্রো সাবস্ক্রিপশন", "Pro Subscription")}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t("চাইনিজ কোর ওয়ার্ড বিল্ডার আনলক করুন", "Unlock Chinese Core Word Builder")}
        </h2>
        <p className="text-xs sm:text-sm text-text/70">
          {t(
            "বিকাশে সেন্ড মানি করে নিচের ফর্মটি সাবমিট করুন। ভেরিফিকেশনের পর সরাসরি পাসওয়ার্ড পেয়ে যাবেন।",
            "Send Money via bKash and submit the form below to receive your instant access password."
          )}
        </p>

        {/* ডেমো টগল বাটন */}
        <div className="pt-2">
          <button
            type="button"
            onClick={() => setShowDemo((prev) => !prev)}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl border border-secondary/30 bg-secondary/10 hover:bg-secondary/15 text-secondary text-xs font-semibold transition cursor-pointer"
          >
            {showDemo ? (
              <>
                <EyeOff className="w-3.5 h-3.5" />
                <span>{t("ডেমো প্রিভিউ বন্ধ করুন", "Hide Demo Preview")}</span>
              </>
            ) : (
              <>
                <Eye className="w-3.5 h-3.5" />
                <span>{t("ডেমো প্রিভিউ দেখুন", "View Demo Preview")}</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* ডেমো প্রিভিউ সেকশন */}
      {showDemo && (
        <div className="mb-6 p-4 rounded-2xl bg-text/5 border border-secondary/25 space-y-3 transition-all animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase font-mono tracking-wider">
              {t("Pro মেটেরিয়াল ডেমো", "Pro Material Demo")}
            </span>
            <span className="text-[11px] font-mono text-text/60">
              chinese-words.png
            </span>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-text/10 bg-background">
            <Image
              src="/chinese-words.png"
              alt="Chinese Core Words Demo"
              fill
              className="object-cover"
            />
          </div>

          <p className="text-[11px] text-text/70 leading-relaxed">
            {t(
              "সাবস্ক্রিপশন নিলে HSK কোর শব্দভাণ্ডার, পিনয়িন, স্ট্রোক অর্ডার এবং অর্থসহ এই ধরনের পূর্ণাঙ্গ ফ্ল্যাশকার্ড ও নোটবুক অ্যাক্সেস পাবেন।",
              "Subscribing unlocks complete interactive flashcards, stroke breakdown, and full word lists."
            )}
          </p>
        </div>
      )}

      {/* bKash Instructions Box */}
      <div className="p-4 sm:p-5 rounded-2xl bg-text/5 border border-text/10 space-y-3 mb-6">
        <div className="flex items-center justify-between">
          <span className="text-xs font-bold text-secondary uppercase font-mono tracking-wider">
            {t("bKash Personal (Send Money)", "bKash Personal (Send Money)")}
          </span>
          <span className="text-xs font-semibold text-text/60">
            ফি: ৳৪৯৯ (আজীবন মেয়াদ)
          </span>
        </div>

        <div className="flex items-center justify-between bg-background p-3 rounded-xl border border-text/15">
          <span className="font-mono text-base sm:text-lg font-bold tracking-wider text-text">
            {BKASH_NUMBER}
          </span>
          <button
            type="button"
            onClick={handleCopyNumber}
            className="flex items-center gap-1.5 text-xs font-medium px-3 py-1.5 rounded-lg bg-text/10 hover:bg-text/15 text-text transition cursor-pointer"
          >
            {copied ? (
              <>
                <Check className="w-3.5 h-3.5 text-emerald-500" />
                <span className="text-emerald-500 font-bold">{t("কপি হয়েছে!", "Copied!")}</span>
              </>
            ) : (
              <>
                <Copy className="w-3.5 h-3.5" />
                <span>{t("কপি করুন", "Copy")}</span>
              </>
            )}
          </button>
        </div>

        <p className="text-[11px] text-text/60 leading-relaxed">
          {t(
            "* উপরে দেওয়া বিকাশ নম্বরে 'Send Money' করে প্রাপ্ত TrxID নিচের বক্সে লিখে সাবমিট বাটনে চাপ দিন।",
            "* Send Money to the number above and provide the Transaction ID (TrxID) below."
          )}
        </p>
      </div>

      {/* Subscription Submission Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        {error && (
          <div className="p-3 bg-secondary/10 border border-secondary/20 rounded-xl text-xs text-secondary flex items-center gap-2">
            <AlertCircle className="w-4 h-4 shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <div>
          <label className="block text-xs font-semibold mb-1 text-text/80">
            {t("আপনার নাম *", "Full Name *")}
          </label>
          <input
            type="text"
            required
            placeholder={t("আপনার নাম লিখুন", "Enter your full name")}
            value={fullName}
            onChange={(e) => setFullName(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-text/20 bg-background text-sm text-text focus:outline-none focus:border-secondary transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-text/80">
            {t("যে নম্বর থেকে বিকাশ করেছেন *", "bKash Sender Phone Number *")}
          </label>
          <input
            type="tel"
            required
            placeholder="01XXXXXXXXX"
            value={senderPhone}
            onChange={(e) => setSenderPhone(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-text/20 bg-background text-sm font-mono text-text focus:outline-none focus:border-secondary transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-text/80">
            {t("বিকাশ ট্রানজেকশন আইডি (TrxID) *", "bKash Transaction ID (TrxID) *")}
          </label>
          <input
            type="text"
            required
            placeholder="e.g. BL92A8XKQ"
            value={trxId}
            onChange={(e) => setTrxId(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-text/20 bg-background text-sm font-mono uppercase text-text focus:outline-none focus:border-secondary transition"
          />
        </div>

        <div>
          <label className="block text-xs font-semibold mb-1 text-text/80">
            {t("সাবস্ক্রিপশন প্ল্যান", "Subscription Plan")}
          </label>
          <select
            value={planType}
            onChange={(e) => setPlanType(e.target.value)}
            className="w-full px-3.5 py-2.5 rounded-xl border border-text/20 bg-background text-sm text-text focus:outline-none focus:border-secondary transition"
          >
            <option value="Lifetime Access (৳৪৯৯)">লাইফটাইম অ্যাক্সেস — ৳৪৯৯</option>
            <option value="1 Year Access (৳২৯৯)">১ বছরের জন্য — ৳২৯৯</option>
          </select>
        </div>

        <button
          type="submit"
          className="w-full py-3 px-4 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all flex items-center justify-center gap-2 shadow-md hover:shadow-lg cursor-pointer mt-2"
        >
          <Send className="w-4 h-4" />
          <span>{t("ভেরিফিকেশনের জন্য WhatsApp-এ পাঠান", "Submit via WhatsApp")}</span>
        </button>

        <p className="text-[11px] text-center text-text/50 pt-1">
          {t(
            "বাটনে ক্লিক করলে সরাসরি TrxID সহ WhatsApp মেসেজ ওপেন হবে।",
            "Clicking submit will open WhatsApp with all payment details pre-filled."
          )}
        </p>
      </form>
    </div>
  );
}