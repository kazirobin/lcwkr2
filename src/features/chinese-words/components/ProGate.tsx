"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import ProSubscriptionForm from "./ProSubscriptionForm";
import { formatRemaining, useProAccess } from "./pro-access";

/**
 * Wrap any Pro page content.
 *
 * Everyone gets a ten-minute preview so a visitor can actually try the thing
 * before being asked for money. After that the page becomes the join panel,
 * which is where the ৳500 student account and the ৳500 lifetime Pro live.
 */
export default function ProGate({ children }: { children: React.ReactNode }) {
  const { status, remainingMs, isPro, resetTrial } = useProAccess();
  const { student: account } = useAccount();
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const [modalOpen, setModalOpen] = useState(false);

  // auto-close the modal right after a successful unlock
  useEffect(() => {
    if (isPro) {
      queueMicrotask(() => setModalOpen(false));
    }
  }, [isPro]);

  if (status === "expired") {
    return (
      <div className="min-h-[70vh] py-12 px-4 flex flex-col items-center justify-center gap-6">
        <div className="text-center space-y-2">
          <div className="text-5xl">🔒</div>
          <h2 className="text-2xl font-bold text-text">
            {t("আপনার ফ্রি প্রিভিউ শেষ", "Your free preview has ended")}
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            {t(
              "১০ মিনিটের গেস্ট প্রিভিউ শেষ হয়ে গেছে। চালিয়ে যেতে সাবস্ক্রিপশন নিন অথবা পাওয়া পাসওয়ার্ড দিন।",
              "Your 10-minute guest preview is over. Subscribe below or enter the password you received to continue."
            )}
          </p>
        </div>

        <ProSubscriptionForm />

        <button
          type="button"
          onClick={resetTrial}
          className="text-[11px] text-text/40 hover:text-text/70 underline transition"
        >
          {t("ট্রায়াল রিসেট করুন (টেস্ট)", "Reset trial (testing)")}
        </button>
      </div>
    );
  }

  const trialEnding = status === "guest" && remainingMs < 2 * 60 * 1000;

  return (
    <>
      {children}

      {/* Bottom-left access chips */}
      {status === "guest" && (
        <div className="fixed bottom-16 left-4 z-50 flex items-center gap-2">
          <div
            className={`flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-mono shadow-lg border ${
              trialEnding
                ? "bg-warn-surface border-warn/40 text-warn"
                : "bg-card border-border text-text/70"
            }`}
          >
            ⏳ {t("ফ্রি প্রিভিউ", "Free preview")}: {formatRemaining(remainingMs)}
          </div>
          <button
            type="button"
            onClick={() => setModalOpen(true)}
            className="px-3.5 py-2 rounded-full text-xs font-bold shadow-lg bg-primary text-primary-foreground hover:opacity-90 transition"
          >
            🔓 {t("আনলক", "Unlock")}
          </button>
        </div>
      )}

      {isPro && (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          title={t("Pro সদস্য — ম্যানেজ করুন", "Pro member — manage")}
          className="fixed bottom-16 left-4 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold shadow-lg bg-ok text-background border border-ok hover:opacity-90 transition"
        >
          ✓ {t("Pro সদস্য", "Pro member")}
        </button>
      )}

      {/* Access modal */}
      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div
            className="relative max-w-xl mx-auto my-8"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              title={t("বন্ধ করুন", "Close")}
              className="absolute -top-3 -right-3 z-10 w-9 h-9 rounded-full bg-card border border-border text-text shadow-lg flex items-center justify-center hover:bg-text/5 transition"
            >
              ✕
            </button>

            {isPro && (
              <div className="mb-4 p-4 rounded-2xl bg-ok-surface border border-ok/30 space-y-2">
                <p className="text-sm font-semibold text-ok">
                  ✓ {t("আপনি Pro সদস্য — সব কনটেন্ট আনলক করা আছে।", "You're a Pro member — all content is unlocked.")}
                </p>
                {account ? (
                  <p className="text-[11px] text-muted">
                    {t(
                      `Admin থেকে দেওয়া Pro (${account.nameEnglish}) — অ্যাকাউন্টে সব ডিভাইসে চলবে।`,
                      `Admin-granted Pro (${account.nameEnglish}) — works on all devices with this account.`
                    )}
                  </p>
                ) : null}
              </div>
            )}

            <ProSubscriptionForm />
          </div>
        </div>
      )}
    </>
  );
}
