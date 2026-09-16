"use client";

import { useCallback, useEffect, useImperativeHandle, useRef, useState } from "react";
import { useLanguage } from "@/i18n";
import ProSubscriptionForm from "./ProSubscriptionForm";

/**
 * Corner Pro access badge shared across all Pro-gated pages (Core Words,
 * Hanzi Pro, HSK Homework). Reads the same `cw:pro` localStorage flag as
 * ProGate so one subscription unlocks every Pro tool.
 *
 * - Not subscribed → an "Unlock Pro" pill; clicking opens the subscription
 *   modal (password or bKash).
 * - Subscribed → a green "✓ Pro member" pill; clicking opens a manage modal
 *   with log-out.
 *
 * Passing a `ref` exposes `{ open() }` so pages can open the modal from
 * elsewhere (e.g. a locked lesson button).
 */
const PRO_KEY = "cw:pro";

export type ProAccessHandle = { open: () => void };

export default function ProAccessButton({
  ref,
  onUnlock,
}: {
  ref?: React.Ref<ProAccessHandle>;
  onUnlock?: () => void;
}) {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [ready, setReady] = useState(false);
  const [isPro, setIsPro] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const unlockedRef = useRef(false);

  useEffect(() => {
    try {
      setIsPro(localStorage.getItem(PRO_KEY) === "1");
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => setModalOpen(true),
  }));

  const unlock = () => {
    try {
      localStorage.setItem(PRO_KEY, "1");
    } catch {
      /* storage unavailable */
    }
    setIsPro(true);
    setModalOpen(false);
    onUnlock?.();
  };

  const logout = () => {
    try {
      localStorage.removeItem(PRO_KEY);
    } catch {
      /* ignore */
    }
    setIsPro(false);
    setModalOpen(false);
  };

  if (!ready) return null;

  return (
    <>
      {isPro ? (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          title={t("Pro সদস্য — ম্যানেজ করুন", "Pro member — manage")}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold shadow-lg bg-ok text-background border border-ok hover:opacity-90 transition"
        >
          ✓ {t("Pro সদস্য", "Pro member")}
        </button>
      ) : (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          className="fixed bottom-6 left-6 z-50 flex items-center gap-2 px-3.5 py-2 rounded-full text-xs font-bold shadow-lg bg-secondary text-white border border-secondary hover:opacity-90 transition"
        >
          ✦ {t("Pro আনলক করুন", "Unlock Pro")}
        </button>
      )}

      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div className="relative mx-auto my-8 max-w-xl" onClick={(e) => e.stopPropagation()}>
            <button
              type="button"
              onClick={() => setModalOpen(false)}
              aria-label={t("বন্ধ করুন", "Close")}
              className="absolute -top-3 -right-3 z-10 flex size-9 items-center justify-center rounded-full border border-border bg-card text-text shadow-lg transition-colors hover:bg-text/5"
            >
              ✕
            </button>

            {isPro && (
              <div className="mb-4 p-4 rounded-2xl bg-ok-surface border border-ok/30 space-y-2">
                <p className="text-sm font-semibold text-ok">
                  ✓ {t("আপনি Pro সদস্য — সব কনটেন্ট আনলক করা আছে।", "You're a Pro member — all content is unlocked.")}
                </p>
                <p className="text-[11px] text-text/55">
                  {t(
                    "নতুন ডিভাইসে বা ভুলে গেলে নিচে আবার পাসওয়ার্ড দিন।",
                    "On a new device (or if forgotten) enter the password again below.",
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

            <ProSubscriptionForm onUnlock={unlock} />
          </div>
        </div>
      )}
    </>
  );
}