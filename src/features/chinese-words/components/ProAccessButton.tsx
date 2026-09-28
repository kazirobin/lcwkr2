"use client";

import { useCallback, useImperativeHandle, useState } from "react";
import { Clock } from "lucide-react";
import { useLanguage } from "@/i18n";
import ProPanel from "./ProPanel";
import { formatRemaining, useProAccess } from "./pro-access";

/**
 * The corner Pro control, shared by every Pro-gated page.
 *
 * This is the single place the Pro panel is opened from, so there is one form on
 * screen whichever Pro page you are on. Opening it scrolls to the top of the
 * viewport so the status line — not the middle of the form — is what lands in
 * view.
 *
 * Both facts are shown at once, and that is the point. There used to be three
 * separate implementations of this corner — a Pro badge here, a countdown chip
 * in the level gate, another pair in the word builder — and on a level page the
 * two of them sat on top of each other at the bottom left, so whoever was inside
 * their free preview saw a countdown sitting on the Pro button instead of the
 * two of them side by side. A visitor needs to be able to glance at one corner
 * and know both things: that they are on the clock, and what the clock buys
 * them. So the clock rides on the Pro button rather than fighting it.
 */
export type ProAccessHandle = { open: () => void };

export default function ProAccessButton({ ref }: { ref?: React.Ref<ProAccessHandle> }) {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [modalOpen, setModalOpen] = useState(false);
  const { isPro, status, remainingMs } = useProAccess();

  const open = useCallback(() => {
    setModalOpen(true);
    // The panel is taller than a phone screen, so make sure the status line at
    // the top is what lands in view.
    queueMicrotask(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    });
  }, []);

  useImperativeHandle(ref, () => ({ open }));

  // Nothing to say while we are still working out who this is, and nothing to
  // say about a clock once they are a member.
  const previewing = status === "guest" && remainingMs > 0;
  const ending = previewing && remainingMs < 2 * 60 * 1000;

  return (
    <>
      <div className="fixed bottom-5 left-5 z-50 flex flex-wrap items-center gap-2">
        {previewing && (
          <button
            type="button"
            onClick={open}
            title={t("ফ্রি Pro প্রিভিউ বাকি", "left of your free Pro preview")}
            className={`flex items-center gap-1.5 rounded-full border px-3 py-2 text-xs font-bold shadow-lg transition hover:opacity-90 ${
              ending
                ? "border-danger/45 bg-danger text-white"
                : "border-secondary/40 bg-secondary text-white"
            }`}
          >
            <Clock className="size-3.5" aria-hidden="true" />
            <span className="font-mono tabular-nums">{formatRemaining(remainingMs)}</span>
            <span className="hidden font-normal sm:inline">
              {t("ফ্রি প্রিভিউ বাকি", "preview left")}
            </span>
          </button>
        )}

        <button
          type="button"
          onClick={open}
          className={`flex items-center gap-2 rounded-full border px-3.5 py-2 text-xs font-bold shadow-lg transition hover:opacity-90 ${
            isPro ? "border-ok bg-ok text-background" : "border-secondary bg-secondary text-white"
          }`}
          title={isPro ? t("Pro সদস্য", "Pro member") : t("Pro নিন", "Get Pro")}
        >
          {isPro ? (
            <>✓ {t("Pro সদস্য", "Pro member")}</>
          ) : (
            <>✦ {t("Pro — ৳৫০০", "Pro — ৳500")}</>
          )}
        </button>
      </div>

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
            />
          </div>
        </div>
      )}
    </>
  );
}
