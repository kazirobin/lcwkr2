"use client";

import React, { useEffect, useState } from "react";
import { useLanguage } from "@/i18n";
import ProPanel from "./ProPanel";
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
      <div className="flex min-h-[70vh] flex-col items-center justify-center gap-6 px-4 py-12">
        {/* The panel carries the status line and the form, so nothing is
            repeated here. */}
        <ProPanel
          status={status}
          remainingMs={remainingMs}
          onResetTrial={resetTrial}
        />
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

      {/* Access modal � the same panel the corner badge opens, so only one
          copy of the form is ever on screen. */}
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
