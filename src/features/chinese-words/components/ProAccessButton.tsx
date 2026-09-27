"use client";

import { useCallback, useEffect, useImperativeHandle, useState } from "react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import ProSubscriptionForm from "./ProSubscriptionForm";

/**
 * Corner Pro access badge shared across all Pro-gated pages (Core Words,
 * Hanzi Pro, HSK Homework).
 *
 * Pro is granted by the admin on the student's account — there is no password
 * box and no self-serve upgrade. This badge simply reflects the account flag
 * (plus the legacy `cw:pro` key, so anyone already unlocked on this device
 * keeps access) and opens the request panel.
 *
 * Passing a `ref` exposes `{ open() }` so pages can open the panel from
 * elsewhere (e.g. a locked lesson button).
 */
const PRO_KEY = "cw:pro";

export type ProAccessHandle = { open: () => void };

export default function ProAccessButton({
  ref,
}: {
  ref?: React.Ref<ProAccessHandle>;
}) {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [localPro, setLocalPro] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);
  const { student: account } = useAccount();
  // Server truth (admin-granted) counts alongside the legacy local flag.
  const showPro = localPro || !!account?.isPro;

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setLocalPro(localStorage.getItem(PRO_KEY) === "1");
      } catch {
        /* storage unavailable */
      }
    });
  }, []);

  useImperativeHandle(ref, () => ({
    open: () => setModalOpen(true),
  }));

  return (
    <>
      {showPro ? (
        <button
          type="button"
          onClick={() => setModalOpen(true)}
          title={t("Pro সদস্য", "Pro member")}
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
          ✦ {t("Pro চান", "Ask for Pro")}
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

            {showPro && (
              <div className="mb-4 p-4 rounded-2xl bg-ok-surface border border-ok/30 space-y-1">
                <p className="text-sm font-semibold text-ok">
                  ✓ {t("আপনি Pro সদস্য — সব কনটেন্ট আনলক করা আছে।", "You're a Pro member — all content is unlocked.")}
                </p>
                <p className="text-[11px] text-text/55">
                  {t(
                    "Pro আপনার অ্যাকাউন্টে চালু আছে, তাই নতুন ডিভাইসেও কাজ করবে।",
                    "Pro is switched on for your account, so it works on a new device too.",
                  )}
                </p>
              </div>
            )}

            <ProSubscriptionForm />
          </div>
        </div>
      )}
    </>
  );
}