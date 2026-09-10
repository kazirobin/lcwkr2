"use client";

import React, { useCallback, useEffect, useState } from "react";
import { useLanguage } from "@/i18n";
import ProSubscriptionForm from "./ProSubscriptionForm";

/**
 * Guest preview system: visitors who have not subscribed can browse the
 * Pro pages for a limited trial. Everything is localStorage-based —
 * no account, no server.
 *
 * Keys:
 *   cw:pro          = "1"  → unlocked (subscribed / valid password entered)
 *   cw:guest-start  = ms timestamp of the first visit (trial start)
 */

const PRO_KEY = "cw:pro";
const GUEST_KEY = "cw:guest-start";
export const TRIAL_MS = 10 * 60 * 1000; // 10 minutes

export type ProAccessStatus = "checking" | "pro" | "guest" | "expired";

export function useProAccess() {
  const [status, setStatus] = useState<ProAccessStatus>("checking");
  const [remainingMs, setRemainingMs] = useState(TRIAL_MS);

  useEffect(() => {
    const compute = () => {
      try {
        if (localStorage.getItem(PRO_KEY) === "1") {
          setStatus("pro");
          return;
        }
        let start = Number(localStorage.getItem(GUEST_KEY));
        if (!start || Number.isNaN(start)) {
          start = Date.now();
          localStorage.setItem(GUEST_KEY, String(start));
        }
        const remain = start + TRIAL_MS - Date.now();
        if (remain <= 0) {
          setRemainingMs(0);
          setStatus("expired");
        } else {
          setRemainingMs(remain);
          setStatus("guest");
        }
      } catch {
        // localStorage unavailable — never lock the user out
        setStatus("pro");
      }
    };

    compute();
    const interval = setInterval(compute, 1000);
    return () => clearInterval(interval);
  }, []);

  const unlock = useCallback(() => {
    try {
      localStorage.setItem(PRO_KEY, "1");
    } catch {
      /* ignore */
    }
    setStatus("pro");
  }, []);

  /** Back to guest/expired after removing the Pro flag. */
  const logout = useCallback(() => {
    try {
      localStorage.removeItem(PRO_KEY);
      const start = Number(localStorage.getItem(GUEST_KEY));
      const remain = (start || Date.now()) + TRIAL_MS - Date.now();
      if (remain <= 0) {
        setRemainingMs(0);
        setStatus("expired");
      } else {
        setRemainingMs(remain);
        setStatus("guest");
      }
    } catch {
      setStatus("pro");
    }
  }, []);

  /** Start the trial over (testing / support). */
  const resetTrial = useCallback(() => {
    try {
      localStorage.removeItem(GUEST_KEY);
      localStorage.removeItem(PRO_KEY);
      localStorage.setItem(GUEST_KEY, String(Date.now()));
    } catch {
      /* ignore */
    }
    setRemainingMs(TRIAL_MS);
    setStatus("guest");
  }, []);

  return { status, remainingMs, unlock, logout, resetTrial };
}

function formatRemaining(ms: number): string {
  const total = Math.max(0, Math.ceil(ms / 1000));
  const m = Math.floor(total / 60);
  const s = total % 60;
  return `${m}:${String(s).padStart(2, "0")}`;
}

/** Wrap any Pro page content: guests get TRIAL_MS, then the paywall. */
export default function ProGate({ children }: { children: React.ReactNode }) {
  const { status, remainingMs, unlock, logout, resetTrial } = useProAccess();
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const [modalOpen, setModalOpen] = useState(false);

  // auto-close the modal right after a successful unlock
  useEffect(() => {
    if (status === "pro") {
      queueMicrotask(() => setModalOpen(false));
    }
  }, [status]);

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

        <ProSubscriptionForm onUnlock={unlock} />

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
        <div className="fixed bottom-6 left-6 z-50 flex items-center gap-2">
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

      {status === "pro" && (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          title={t("Pro সদস্য — ম্যানেজ করুন", "Pro member — manage")}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold shadow-lg bg-ok text-background border border-ok hover:opacity-90 transition"
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

            {status === "pro" && (
              <div className="mb-4 p-4 rounded-2xl bg-ok-surface border border-ok/30 space-y-2">
                <p className="text-sm font-semibold text-ok">
                  ✓ {t("আপনি Pro সদস্য — সব কনটেন্ট আনলক করা আছে।", "You're a Pro member — all content is unlocked.")}
                </p>
                <p className="text-[11px] text-muted">
                  {t(
                    "নতুন ডিভাইসে বা ভুলে গেলে নিচে আবার পাসওয়ার্ড দিন। লগ আউট করলে গেস্ট মোডে ফিরে যাবেন।",
                    "On a new device (or if forgotten) enter the password again below. Logging out returns you to guest mode."
                  )}
                </p>
                <button
                  type="button"
                  onClick={logout}
                  className="px-3.5 py-1.5 rounded-xl border border-danger/40 bg-danger/10 text-danger text-xs font-semibold hover:bg-danger/20 transition"
                >
                  {t("Pro থেকে লগ আউট", "Log out of Pro")}
                </button>
              </div>
            )}

            <ProSubscriptionForm
              onUnlock={() => {
                unlock();
                setModalOpen(false);
              }}
            />
          </div>
        </div>
      )}
    </>
  );
}
