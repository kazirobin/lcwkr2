"use client";

import { useEffect } from "react";
import Link from "next/link";

import { useLanguage } from "@/i18n";
import { vocabularyCopy } from "@/features/vocabulary/i18n";

export default function HskError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];

  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <div
      className={`hsk-page min-h-[70vh] bg-[#f7f2e8] leading-relaxed text-text in-[.dark]:bg-[#17130f] ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
     <div className="mx-auto flex min-h-[70vh] max-w-xl flex-col justify-center px-5 pt-28 pb-16 sm:px-6">
      <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55">
        {c.section}
      </span>
      <h1 className="mt-4 font-serif text-[2rem] font-medium leading-[1.1] text-text sm:text-[2.4rem]">
        {c.errorTitle}
      </h1>
      <p className="mt-4 text-[15px] leading-7 text-text/70">{c.errorBody}</p>
      <div className="mt-7 flex flex-wrap gap-3">
        <button
          type="button"
          onClick={reset}
          className="inline-flex items-center gap-2 rounded-xl bg-text px-5 py-3 text-sm font-semibold text-background transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text motion-reduce:hover:translate-y-0"
        >
          {c.errorRetry}
        </button>
        <Link
          href="/hsk"
          className="inline-flex items-center gap-2 rounded-xl border border-text/20 px-5 py-3 text-sm font-medium text-text transition-colors hover:border-text/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
        >
          {c.notFoundCta}
        </Link>
      </div>
     </div>
    </div>
  );
}
