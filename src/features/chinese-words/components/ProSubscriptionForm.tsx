"use client";

import React, { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ShieldCheck, Sparkles, Eye, EyeOff, KeyRound, Send } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import { isValidProPassword } from "../data/pro-passwords";

const WHATSAPP_NUMBER = "8801787881334";

/**
 * Pro access panel.
 * - Pro registration is admin-only: logged-in students request Pro over
 *   WhatsApp, admin marks isPro, and every device on that account unlocks.
 * - The password box works ONLY when logged in (approved student).
 * - Logged-out visitors get a login CTA — no password, no self-serve form.
 */
export default function ProSubscriptionForm({ onUnlock }: { onUnlock?: () => void }) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const { student: account } = useAccount();

  // ডেমো ওপেন/ক্লোজ স্টেট
  const [showDemo, setShowDemo] = useState(false);

  // পাসওয়ার্ড চেক ও শো/হাইড স্টেট
  const [accessPassword, setAccessPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [passwordStatus, setPasswordStatus] = useState<"idle" | "success" | "error">("idle");
  const [error, setError] = useState("");

  // পাসওয়ার্ড ভেরিফিকেশন — শুধু লগইন করা শিক্ষার্থীর জন্য
  const handleVerifyPassword = (e: React.FormEvent) => {
    e.preventDefault();
    if (!account) return;
    if (!accessPassword.trim()) return;

    if (isValidProPassword(accessPassword)) {
      setPasswordStatus("success");
      setError("");
      onUnlock?.();
    } else {
      setPasswordStatus("error");
      setError(
        language === "bn"
          ? "ভুল পাসওয়ার্ড! সঠিক পাসওয়ার্ডের জন্য WhatsApp-এ যোগাযোগ করুন।"
          : "Invalid password! Please contact via WhatsApp for the correct password."
      );
    }
  };

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
            "Pro সদস্য হতে হবে শিক্ষার্থী — রেজিস্ট্রেশন শুধু admin দেয়। নিচে WhatsApp-এ রিকোয়েস্ট পাঠান।",
            "Pro members must be students — only admin grants Pro. Request below over WhatsApp."
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

          {/* ── password box (logged-in students only) ── */}
          <div className="mb-6 p-4 rounded-2xl bg-background border border-border space-y-3">
            <div className="flex items-center gap-2 text-xs font-bold text-primary">
              <KeyRound className="w-4 h-4" />
              <span>{t("পাসওয়ার্ড থাকলে এখানে দিন", "Have a password? Enter it here")}</span>
            </div>

            <form onSubmit={handleVerifyPassword} className="flex gap-2">
              <div className="relative flex-1">
                <input
                  type={showPassword ? "text" : "password"}
                  placeholder={t("আপনার Pro পাসওয়ার্ড দিন", "Enter your Pro password")}
                  value={accessPassword}
                  onChange={(e) => {
                    setAccessPassword(e.target.value);
                    setPasswordStatus("idle");
                  }}
                  className="w-full pl-3.5 pr-10 py-2 rounded-xl border border-border bg-card text-xs text-text focus:outline-none focus:border-primary transition font-mono"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-muted hover:text-text cursor-pointer"
                >
                  {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <button
                type="submit"
                className="px-4 py-2 bg-primary text-primary-foreground font-semibold rounded-xl text-xs hover:opacity-95 transition cursor-pointer"
              >
                {t("চেক করুন", "Verify")}
              </button>
            </form>

            {passwordStatus === "success" && (
              <div className="space-y-2">
                <p className="text-xs text-ok flex items-center gap-1 font-medium">
                  <ShieldCheck className="w-4 h-4" />
                  {t("সফল! আপনার পাসওয়ার্ডটি সঠিক আছে।", "Success! Your password is valid.")}
                </p>
                {onUnlock && (
                  <button
                    type="button"
                    onClick={onUnlock}
                    className="w-full py-3 bg-ok text-background font-bold rounded-xl text-sm hover:opacity-90 transition shadow-md"
                  >
                    🎉 {t("আনলক করে চালিয়ে যান", "Unlock & Continue")}
                  </button>
                )}
              </div>
            )}
            {passwordStatus === "error" && error && (
              <p className="text-xs text-danger font-medium">{error}</p>
            )}
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
