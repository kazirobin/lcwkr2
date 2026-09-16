"use client";

import { useState } from "react";
import { HandCoins, X } from "lucide-react";
import Link from "next/link";
import { useLanguage } from "@/i18n";

// A small persistent "donate" pill shown on every page (bottom-right).
// Clicking it opens the donation page. The X dismisses it for this page view;
// refreshing the page brings it back (it's plain component state).
export default function DonationBadge() {
  const { language } = useLanguage();
  const [dismissed, setDismissed] = useState(false);
  if (dismissed) return null;

  return (
    <div className="fixed bottom-4 right-4 z-40 flex items-center gap-2">
      <Link
        href="/donate"
        className="group flex items-center gap-2 rounded-full border border-primary/40 bg-card/95 px-4 py-2.5 text-primary shadow-xl backdrop-blur transition-all hover:border-primary hover:shadow-2xl focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"
      >
        <HandCoins className="h-4 w-4 transition-transform group-hover:scale-110" />
        <span className="text-sm font-bold">
          {language === "bn" ? "অনুদান দিন" : "Donate"}
        </span>
      </Link>
      <button
        type="button"
        onClick={() => setDismissed(true)}
        aria-label={language === "bn" ? "বন্ধ করুন" : "Dismiss"}
        className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full border border-text/15 bg-card/95 text-text/45 shadow-xl backdrop-blur transition-colors hover:border-text/30 hover:text-text"
      >
        <X className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}