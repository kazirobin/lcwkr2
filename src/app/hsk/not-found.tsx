"use client";

import Link from "next/link";

import { useLanguage } from "@/i18n";
import { vocabularyCopy } from "@/features/vocabulary/i18n";

export default function HskNotFound() {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];

  return (
    <div
      className={`hsk-page min-h-[75vh] bg-[#f7f2e8] leading-relaxed text-text in-[.dark]:bg-[#17130f] ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      <div className="mx-auto flex min-h-[75vh] max-w-xl flex-col justify-center px-5 pt-28 pb-16 sm:px-6">
        <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55">
          {c.section} · 404
        </span>
        <h1 className="mt-4 font-serif text-[2.2rem] font-medium leading-[1.1] text-text sm:text-[2.6rem]">
          {c.notFoundTitle}
        </h1>
        <p className="mt-4 text-[15px] leading-7 text-text/70">{c.notFoundBody}</p>
        <Link
          href="/hsk"
          className="mt-7 inline-flex w-fit items-center gap-2 rounded-xl bg-secondary px-5 py-3 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary motion-reduce:hover:translate-y-0"
        >
          {c.notFoundCta} →
        </Link>
      </div>
    </div>
  );
}
