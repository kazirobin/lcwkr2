"use client";

import { useState } from "react";
import { ArrowUpRight } from "lucide-react";

import { useLanguage } from "@/i18n";
import { useReveal } from "@/lib/useReveal";
import {
  suggestedApps,
  categoryMeta,
  categoryOrder,
  type AppCategory,
  type SuggestedApp,
} from "@/features/marketing/data/suggestedApps";

/**
 * `/apps` — recommended Android apps for Chinese learners.
 *
 * Built in the home / `/intro` / `/community` sumi-e register: rice-paper
 * hero bleeding under the fixed nav, one oversized Hanzi watermark, the
 * `[seal] SMALL-CAPS · detail` eyebrow, and hairline-separated sections
 * rather than a card grid. The category filter narrows which sections show;
 * every out-link opens the Play Store listing in a new tab.
 */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number) =>
  String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

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

function CategoryBlock({
  category,
  apps,
  isBn,
}: {
  category: AppCategory;
  apps: SuggestedApp[];
  isBn: boolean;
}) {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.12 });
  const meta = categoryMeta[category];
  const num = (n: number) => (isBn ? toBn(n) : String(n).padStart(2, "0"));

  return (
    <div ref={ref} className="reveal-group">
      <div
        data-reveal
        className="flex items-baseline gap-3 border-b border-text/15 pb-3"
      >
        <span
          lang="zh"
          aria-hidden="true"
          className="text-sm font-semibold text-text/35"
        >
          {meta.seal}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-text">
          {isBn ? meta.bn : meta.en}
        </h3>
        <span className="text-xs tabular-nums text-text/40">
          {num(apps.length)}
        </span>
      </div>

      <ul>
        {apps.map((app, i) => (
          <li
            key={app.name}
            data-reveal
            style={{ "--r": i + 1 } as React.CSSProperties}
            className="flex flex-col gap-2 border-b border-text/10 py-5 sm:flex-row sm:items-center sm:justify-between sm:gap-6"
          >
            <span className="text-[15px] font-medium text-text">{app.name}</span>
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex shrink-0 items-center gap-1.5 self-start text-sm font-medium text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text sm:self-center"
            >
              {isBn ? "প্লে স্টোরে দেখুন" : "View on Play Store"}
              <ArrowUpRight className="size-3.5" aria-hidden="true" />
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function SuggestedAppsPage() {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const t = (bn: string, en: string) => (isBn ? bn : en);
  const num = (n: number) => (isBn ? toBn(n) : String(n));

  const [active, setActive] = useState<AppCategory | "all">("all");

  const present = categoryOrder.filter((c) =>
    suggestedApps.some((a) => a.category === c),
  );
  const visible = active === "all" ? present : present.filter((c) => c === active);

  return (
    <div className={`bg-background text-text ${isBn ? "font-bn" : "font-en"}`}>
      {/* ============================ HERO ============================ */}
      <section className="relative isolate -mt-16 overflow-hidden bg-[#f8f3ea] in-[.dark]:bg-background sm:-mt-20">
        <span
          aria-hidden="true"
          lang="zh"
          className="pointer-events-none absolute -top-16 right-[4%] hidden select-none text-[22rem] leading-none font-bold text-text/[0.04] lg:block"
        >
          具
        </span>

        <div className="relative z-10 mx-auto max-w-6xl px-3 pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
          <div className="max-w-2xl">
            <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
              <span
                lang="zh"
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-md bg-text text-[11px] font-bold text-background"
              >
                具
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text/60">
                {t("রিসোর্স · অ্যাপস", "Resources · Apps")}
              </span>
            </div>

            <h1 className="mt-7 text-[2.5rem] leading-[1.12] font-bold tracking-tight sm:text-5xl lg:text-[3.5rem]">
              <span className="block">
                {t("চীনা শেখার সঙ্গী", "The apps that carry")}
              </span>
              <span className="mt-1 block text-secondary">
                {t("অ্যাপগুলো", "your practice")}
              </span>
            </h1>

            <p className="mt-6 max-w-[52ch] text-base leading-[1.8] text-text/70 sm:text-lg">
              {t(
                "পিনয়িন, অভিধান, হাতে লেখা আর এইচএসকে প্রস্তুতির জন্য বেছে নেওয়া অ্যাপ — প্রতিটি ফ্রি, গুগল প্লে স্টোরে।",
                "A hand-picked set for pinyin, dictionaries, handwriting and HSK prep — every one free, on Google Play.",
              )}
            </p>

            <p className="mt-9 flex flex-wrap gap-x-8 gap-y-2 border-t border-text/10 pt-6 text-sm text-text/55">
              <span>
                <span className="font-semibold tabular-nums text-text">
                  {num(suggestedApps.length)}
                </span>{" "}
                {t("অ্যাপ", "apps")}
              </span>
              <span>
                <span className="font-semibold tabular-nums text-text">
                  {num(present.length)}
                </span>{" "}
                {t("বিভাগ", "categories")}
              </span>
            </p>
          </div>
        </div>
      </section>

      {/* ============================ LIST ============================ */}
      <section className="border-t border-text/10 bg-background py-16 md:py-24">
        <div className="mx-auto max-w-6xl px-6">
          <div
            className="flex flex-wrap gap-2"
            role="group"
            aria-label={t("বিভাগ অনুযায়ী ফিল্টার", "Filter by category")}
          >
            <FilterButton
              active={active === "all"}
              onClick={() => setActive("all")}
            >
              {t("সব", "All")}
            </FilterButton>
            {present.map((c) => (
              <FilterButton
                key={c}
                active={active === c}
                onClick={() => setActive(c)}
              >
                {isBn ? categoryMeta[c].bn : categoryMeta[c].en}
              </FilterButton>
            ))}
          </div>

          <div className="mt-14 space-y-16">
            {visible.map((c) => (
              <CategoryBlock
                key={c}
                category={c}
                isBn={isBn}
                apps={suggestedApps.filter((a) => a.category === c)}
              />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
