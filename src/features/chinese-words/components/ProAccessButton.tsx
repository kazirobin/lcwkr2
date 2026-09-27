"use client";

import { useCallback, useImperativeHandle, useState } from "react";
import { useLanguage } from "@/i18n";
import ProPanel from "./ProPanel";
import { useProAccess } from "./pro-access";

/**
 * The corner Pro badge, shared across all Pro-gated pages.
 *
 * This is the single place the Pro panel is opened from, so there is one form
 * on screen whichever Pro page you are on. Opening it scrolls the panel to the
 * top of the viewport so the status line — not the middle of the form — is the
 * first thing read.
 *
 * Three badge states, because the funnel has three steps: a signed-in Pro
 * student, someone inside their free preview, and everyone else.
 */
export type ProAccessHandle = { open: () => void };

export default function ProAccessButton({ ref }: { ref?: React.Ref<ProAccessHandle> }) {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [modalOpen, setModalOpen] = useState(false);
  const { isPro, status, remainingMs, resetTrial } = useProAccess();

  const open = useCallback(() => {
    setModalOpen(true);
    // The panel is taller than a phone screen, so make sure the status line at
    // the top is what lands in view.
    queueMicrotask(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  useImperativeHandle(ref, () => ({ open }));

  return (
    <>
      <button
        type="button"
        onClick={open}
        className={`fixed bottom-6 left-6 z-50 flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold shadow-lg transition hover:opacity-90 ${
          isPro
            ? "border-ok bg-ok text-background"
            : "border-secondary bg-secondary text-white"
        }`}
        title={isPro ? t("Pro সদস্য", "Pro member") : t("Pro নিন", "Get Pro")}
      >
        {isPro ? (
          <>
            ✓ {t("Pro সদস্য", "Pro member")}
          </>
        ) : (
          <>✦ {t("Pro — ৳৫০০", "Pro — ৳500")}</>
        )}
      </button>

      {modalOpen && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 p-4"
          onClick={() => setModalOpen(false)}
        >
          <div className="mx-auto my-6 max-w-xl" onClick={(e) => e.stopPropagation()}>
            <ProPanel
              status={status}
              remainingMs={remainingMs}
              onClose={() => setModalOpen(false)}
              onResetTrial={resetTrial}
            />
          </div>
        </div>
      )}
    </>
  );
}
