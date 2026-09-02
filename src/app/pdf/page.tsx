"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { useLanguage } from "@/i18n";
import { useReveal } from "@/lib/useReveal";
import {
  hskLevels,
  completeCollection,
  resourceLabels,
  type HSKLevel,
} from "@/features/marketing/data/hskResources";

/**
 * `/pdf` — the HSK resource hub: PDF books, audio, mock tests and vocabulary
 * for all six levels, each linking out to a Google Drive folder.
 *
 * Built in the home / `/intro` / `/community` sumi-e register: rice-paper
 * hero under the fixed nav, one oversized Hanzi watermark, the `[seal]
 * SMALL-CAPS · detail` eyebrow, and a hairline-separated level list instead
 * of a card grid. The level filter narrows the list; missing resources (none
 * today) would read "soon" rather than 404.
 */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number) =>
  String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

const LINK_CLS =
  "inline-flex items-center gap-1.5 text-sm font-medium text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text";

function FilterButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`rounded-full border px-3.5 py-1.5 text-sm font-medium transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
        active
          ? "border-text bg-text text-background"
          : "border-text/15 text-text/70 hover:border-text/40 hover:text-text"
      }`}
    >
      {children}
    </button>
  );
}

function LevelBlock({ level, isBn }: { level: HSKLevel; isBn: boolean }) {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.12 });
  const t = (bn: string, en: string) => (isBn ? bn : en);
  const n = Number(level.id.split("-")[1]);

  return (
    <div ref={ref} className="reveal-group">
      <div data-reveal className="border-b border-text/15 pb-3">
        <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
          <h3 className="text-lg font-semibold tracking-tight text-text">
            HSK {isBn ? toBn(n) : n}
          </h3>
          <span className="text-[11px] font-medium uppercase tracking-wide text-text/45">
            {isBn ? level.titleBn : level.title}
          </span>
        </div>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-text/65">
          {isBn ? level.descriptionBn : level.description}
        </p>
      </div>

      <div
        data-reveal
        style={{ "--r": 1 } as React.CSSProperties}
        className="flex flex-wrap gap-x-8 gap-y-3 py-6"
      >
        {resourceLabels.map(({ key, bn, en }) => {
          const link = level.driveLinks[key];
          const available = level.resources[key] && Boolean(link);

          if (!available) {
            return (
              <span
                key={key}
                className="inline-flex items-center gap-1.5 text-sm text-text/30"
              >
                {t(bn, en)}
                <span className="text-xs">· {t("শীঘ্রই", "soon")}</span>
              </span>
            );
          }

          return (
            <a
              key={key}
              href={link}
              target="_blank"
              rel="noopener noreferrer"
              className={LINK_CLS}
            >
              {t(bn, en)}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          );
        })}
      </div>

      {level.driveLinks.all && (
        <a
          href={level.driveLinks.all}
          target="_blank"
          rel="noopener noreferrer"
          className="mb-1 inline-flex items-center gap-1.5 text-sm font-semibold text-text underline decoration-text/40 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text"
        >
          {t("এই লেভেলের সব ম্যাটেরিয়াল", "All materials for this level")}
          <ArrowUpRight className="size-3.5" aria-hidden="true" />
        </a>
      )}
    </div>
  );
}

export default function PdfPage() {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const t = (bn: string, en: string) => (isBn ? bn : en);

  const [active, setActive] = useState<string | "all">("all");
  const visible =
    active === "all" ? hskLevels : hskLevels.filter((l) => l.id === active);

  return (
    <div className={`bg-background text-text ${isBn ? "font-bn" : "font-en"}`}>
      {/* ============================ HERO ============================ */}
      <section className="relative isolate -mt-16 overflow-hidden bg-[#f8f3ea] in-[.dark]:bg-background sm:-mt-20">
        <span
          aria-hidden="true"
          lang="zh"
          className="pointer-events-none absolute -top-16 right-[4%] hidden select-none text-[22rem] leading-none font-bold text-text/[0.04] lg:block"
        >
          书
        </span>

        <div className="relative z-10 mx-auto max-w-6xl px-3 pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span
                lang="zh"
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-md bg-text text-[11px] font-bold text-background"
              >
                书
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text/60">
                {t("রিসোর্স · এইচএসকে ম্যাটেরিয়াল", "Resources · HSK materials")}
              </span>
            </div>

            <h1 className="mt-7 text-[2.5rem] leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]">
              <span className="block">
                {t("এইচএসকে বই ও", "HSK books &")}
              </span>
              <span className="mt-1 block text-secondary">
                {t("স্টাডি ম্যাটেরিয়াল", "study material")}
              </span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-base leading-[1.8] text-text/70 sm:text-lg">
              {t(
                "ছয়টি লেভেলের PDF বই, অডিও, মক টেস্ট আর ভোকাবুলারি — গুগল ড্রাইভে লেভেল ধরে সাজানো, সম্পূর্ণ ফ্রি।",
                "PDF books, audio, mock tests and vocabulary for all six levels — organised level by level on Google Drive, completely free.",
              )}
            </p>

            <p className="mt-9 flex flex-wrap gap-x-8 gap-y-2 border-t border-text/10 pt-6 text-sm text-text/55">
              <span>
                <span className="font-semibold tabular-nums text-text">
                  {isBn ? toBn(6) : 6}
                </span>{" "}
                {t("লেভেল", "levels")}
              </span>
              <span>
                <span className="font-semibold tabular-nums text-text">
                  {isBn ? toBn(4) : 4}
                </span>{" "}
                {t("রিসোর্স টাইপ", "resource types each")}
              </span>
              <span>{t("সম্পূর্ণ ফ্রি", "Free")}</span>
            </p>
          </div>
        </div>
      </section>

      {/* =========================== LEVELS =========================== */}
      <section className="border-t border-text/10 bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={t("লেভেল অনুযায়ী ফিল্টার", "Filter by level")}
          >
            <FilterButton
              active={active === "all"}
              onClick={() => setActive("all")}
            >
              {t("সব", "All")}
            </FilterButton>
            {hskLevels.map((level) => (
              <FilterButton
                key={level.id}
                active={active === level.id}
                onClick={() => setActive(level.id)}
              >
                HSK {isBn ? toBn(Number(level.id.split("-")[1])) : level.id.split("-")[1]}
              </FilterButton>
            ))}
          </div>

          <div className="mt-14 space-y-16">
            {visible.map((level) => (
              <LevelBlock key={level.id} level={level} isBn={isBn} />
            ))}
          </div>

          <div className="mt-16 border-t border-text/15 pt-6">
            <p className="text-sm text-text/60">
              {isBn
                ? completeCollection.descriptionBn
                : completeCollection.description}
            </p>
            <a
              href={completeCollection.link}
              target="_blank"
              rel="noopener noreferrer"
              className="mt-2 inline-flex items-center gap-1.5 text-sm font-semibold text-text underline decoration-text/40 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text"
            >
              {isBn ? completeCollection.titleBn : completeCollection.title}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </div>
        </div>
      </section>
    </div>
  );
}
