"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { Sparkles, Eye, EyeOff, Send } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";

const WHATSAPP_NUMBER = "8801787881334";

/**
 * Pro access panel.
 *
 * Pro is entirely admin-granted: the owner turns it on or off per student from
 * /admin/students, and there is no password box, redeem code or self-serve
 * upgrade here any more. A student who wants Pro sends a request over WhatsApp
 * and waits; once the admin marks them, every device on that account unlocks.
 */
export default function ProSubscriptionForm() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const { student: account } = useAccount();

  // ডেমো ওপেন/ক্লোজ স্টেট
  const [showDemo, setShowDemo] = useState(false);

  const requestPro = () => {
    if (!account) return;
    const msg =
      `*Pro সদস্য হতে চাই* 🌟\n` +
      `-----------------------------------\n` +
      `👤 *নাম:* ${account.nameEnglish}\n` +
      `🎓 *রোল:* ${account.rollNumber}\n` +
      `📱 *মোবাইল:* ${account.whatsapp}\n` +
      `-----------------------------------\n` +
      `Chinese Core Word Builder-এর Pro access চাই।`;
    window.open(`https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(msg)}`, "_blank");
  };

  return (
    <div
      className={`w-full max-w-xl mx-auto p-6 sm:p-8 rounded-3xl bg-card border border-border shadow-xl text-text ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      {/* Header */}
      <div className="text-center space-y-2 mb-6">
        <span className="inline-flex items-center gap-1 px-3 py-1 bg-secondary/10 border border-secondary/25 text-secondary text-xs font-mono font-bold rounded-full uppercase tracking-wider">
          <Sparkles className="w-3.5 h-3.5" />
          {t("প্রো অ্যাক্সেস", "Pro access")}
        </span>
        <h2 className="text-2xl sm:text-3xl font-bold tracking-tight">
          {t("চাইনিজ কোর ওয়ার্ড বিল্ডার আনলক করুন", "Unlock Chinese Core Word Builder")}
        </h2>
          <p className="text-xs sm:text-sm text-muted">
            {t(
              "Pro শুধু admin চালু বা বন্ধ করে — নিজে কিনতে হয় না। নিচে WhatsApp-এ রিকোয়েস্ট পাঠান।",
              "Only the admin turns Pro on or off — there is nothing to buy yourself. Send a request over WhatsApp below.",
            )}
          </p>

        {/* ডেমো টগল বাটন */}
        <div className="pt-2 flex items-center justify-center gap-2">
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

      {!account ? (
        /* ── logged out: login first, no password box ── */
        <div className="mb-6 p-5 rounded-2xl bg-background border border-border text-center space-y-3">
          <p className="text-3xl">🔑</p>
          <p className="text-sm font-semibold text-text">
            {t(
              "Pro আনলক করতে আগে student অ্যাকাউন্টে লগইন করুন।",
              "Login with your student account first to unlock Pro."
            )}
          </p>
          <Link
            href="/login"
            className="inline-block px-6 py-2.5 bg-secondary text-background font-bold rounded-xl text-sm hover:opacity-90 transition"
          >
            {t("লগইন", "Login")}
          </Link>
        </div>
      ) : (
        <>
          {/* ── WhatsApp request (admin-granted Pro) ── */}
          <div className="mb-6 p-4 rounded-2xl bg-emerald-600/10 border border-emerald-600/25 space-y-3 text-center">
            <p className="text-sm font-bold text-text">
              📩 {t("Admin-এর কাছে Pro চান", "Request Pro from admin")}
            </p>
            <p className="text-[11px] text-muted leading-relaxed">
              {t(
                `${account.nameEnglish} (রোল #${account.rollNumber}) হিসেবে নিচে চাপ দিন — WhatsApp-এ তথ্য চলে যাবে, approve হলে সব ডিভাইসে Pro চালু।`,
                `Send as ${account.nameEnglish} (roll #${account.rollNumber}) below — info goes over WhatsApp, Pro activates on all devices once approved.`
              )}
            </p>
            <button
              type="button"
              onClick={requestPro}
              className="inline-flex items-center gap-2 px-5 py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl text-sm transition-all shadow-md cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{t("WhatsApp-এ Pro চান", "Request Pro on WhatsApp")}</span>
            </button>
          </div>
        </>
      )}

      {/* ডেমো প্রিভিউ সেকশন */}
      {showDemo && (
        <div className="mb-6 p-4 rounded-2xl bg-background border border-secondary/25 space-y-3 transition-all animate-in fade-in zoom-in-95">
          <div className="flex items-center justify-between">
            <span className="text-xs font-bold text-secondary uppercase font-mono tracking-wider">
              {t("Pro মেটেরিয়াল ডেমো", "Pro Material Demo")}
            </span>
            <span className="text-[11px] font-mono text-muted">
              chinese-words.png
            </span>
          </div>

          <div className="relative aspect-video w-full overflow-hidden rounded-xl border border-border bg-card">
            <Image
              src="/chinese-words.png"
              alt="Chinese Core Words Demo"
              fill
              className="object-cover"
            />
          </div>

          <p className="text-[11px] text-muted leading-relaxed">
            {t(
              "Pro হলে HSK কোর শব্দভাণ্ডার, পিনয়িন, স্ট্রোক অর্ডার এবং অর্থসহ পূর্ণাঙ্গ ফ্ল্যাশকার্ড ও নোটবুক অ্যাক্সেস পাবেন।",
              "Pro unlocks complete interactive flashcards, stroke breakdown, and full word lists."
            )}
          </p>
        </div>
      )}
    </div>
  );
}
