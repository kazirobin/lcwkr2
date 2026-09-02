"use client";

import { useState } from "react";

import { useLanguage } from "@/i18n";
import { useReveal } from "@/lib/useReveal";
import {
  hskLevels,
  completeCollection,
  resourceLabels,
  type HSKLevel,
} from "@/features/marketing/data/hskResources";

/**
 * `/pdf` — the HSK library: PDF books, audio, mock tests and vocabulary for
 * all six levels, each linking out to a Google Drive folder.
 *
 * Same technical register as `/apps` ([[AppsExplorer]]): a mono spec sheet
 * over a rice-paper header (kept light so the fixed nav stays readable),
 * then a dark console listing each level as a record — one dot-leader row
 * per resource type. Missing resources (none today) read "soon", not 404.
 */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

const pad2 = (n: number, isBn: boolean) =>
  isBn ? toBn(n) : String(n).padStart(2, "0");

function FilterChip({
  active,
  onClick,
  label,
}: {
  active: boolean;
  onClick: () => void;
  label: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-pressed={active}
      className={`border px-2.5 py-1.5 transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fa7d4e] ${
        active
          ? "border-[#fa7d4e] bg-[#fa7d4e]/12 text-[#fa7d4e]"
          : "border-white/15 text-white/55 hover:border-white/35 hover:text-white/85"
      }`}
    >
      [&nbsp;{label}&nbsp;]
    </button>
  );
}

function LevelRecord({
  level,
  index,
  isBn,
}: {
  level: HSKLevel;
  index: number;
  isBn: boolean;
}) {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.08 });
  const t = (bn: string, en: string) => (isBn ? bn : en);
  const n = Number(level.id.split("-")[1]);

  const rows = resourceLabels.map(({ key, bn, en }) => ({
    label: t(bn, en),
    link: level.driveLinks[key],
    available: level.resources[key] && Boolean(level.driveLinks[key]),
  }));
  const availableCount = rows.filter((r) => r.available).length;

  return (
    <div ref={ref} className="reveal-group">
      {/* record header — index · level · title · dot leader · count */}
      <div
        data-reveal
        className="flex items-baseline gap-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45"
      >
        <span className="text-[#fa7d4e]">{pad2(index, isBn)}</span>
        <span className="text-white/75">HSK&nbsp;{isBn ? toBn(n) : n}</span>
        <span className="text-white/40">
          {isBn ? level.titleBn : level.title}
        </span>
        <span
          aria-hidden="true"
          className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-white/15"
        />
        <span className="tabular-nums text-white/55">
          {pad2(availableCount, isBn)}
        </span>
      </div>

      <p
        data-reveal
        style={{ "--r": 1 } as React.CSSProperties}
        className="max-w-2xl pb-2 text-[13px] leading-6 text-white/50"
      >
        {isBn ? level.descriptionBn : level.description}
      </p>

      <ul className="border-t border-white/10">
        {rows.map((row, i) => (
          <li
            key={row.label}
            data-reveal
            style={{ "--r": i + 2 } as React.CSSProperties}
          >
            {row.available ? (
              <a
                href={row.link}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex items-baseline gap-3 border-b border-white/10 py-3 font-mono text-[12px] transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.05] focus-visible:outline-none"
              >
                <span className="uppercase tracking-[0.14em] text-[#e6f0ed]">
                  {row.label}
                </span>
                <span
                  aria-hidden="true"
                  className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-white/12"
                />
                <span className="inline-flex items-center gap-1 uppercase tracking-[0.16em] text-white/50 transition-colors group-hover:text-[#fa7d4e]">
                  {t("খুলুন", "Open")}
                  <span className="text-sm leading-none">↗</span>
                </span>
              </a>
            ) : (
              <div className="flex items-baseline gap-3 border-b border-white/10 py-3 font-mono text-[12px]">
                <span className="uppercase tracking-[0.14em] text-white/30">
                  {row.label}
                </span>
                <span
                  aria-hidden="true"
                  className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-white/[0.06]"
                />
                <span className="uppercase tracking-[0.16em] text-white/30">
                  {t("শীঘ্রই", "Soon")}
                </span>
              </div>
            )}
          </li>
        ))}

        {level.driveLinks.all && (
          <li data-reveal style={{ "--r": rows.length + 2 } as React.CSSProperties}>
            <a
              href={level.driveLinks.all}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-3 border-b border-white/10 py-3 font-mono text-[12px] transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.05] focus-visible:outline-none"
            >
              <span className="uppercase tracking-[0.14em] text-[#fa7d4e]">
                {t("এই লেভেলের সব", "Whole level")}
              </span>
              <span
                aria-hidden="true"
                className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-[#fa7d4e]/25"
              />
              <span className="inline-flex items-center gap-1 uppercase tracking-[0.16em] text-[#fa7d4e]">
                {t("খুলুন", "Open")}
                <span className="text-sm leading-none">↗</span>
              </span>
            </a>
          </li>
        )}
      </ul>
    </div>
  );
}

export default function PdfPage() {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const t = (bn: string, en: string) => (isBn ? bn : en);
  const num = (n: number) => (isBn ? toBn(n) : String(n));

  const [active, setActive] = useState<string | "all">("all");
  const visible =
    active === "all" ? hskLevels : hskLevels.filter((l) => l.id === active);

  const spec: [string, string][] = [
    [t("লেভেল", "Levels"), num(hskLevels.length)],
    [t("টাইপ / লেভেল", "Types / level"), num(resourceLabels.length)],
    [t("ফরম্যাট", "Format"), "PDF · Audio"],
    [t("হোস্ট", "Host"), "drive.google.com"],
    [t("খরচ", "Cost"), t("ফ্রি", "Free")],
  ];

  return (
    <div className={isBn ? "font-bn" : "font-en"}>
      {/* ===================== SPEC HEADER (rice paper) ===================== */}
      <section className="relative isolate -mt-16 overflow-hidden bg-paper text-text sm:-mt-20">
        <span
          aria-hidden="true"
          lang="zh"
          className="pointer-events-none absolute -top-20 right-[3%] hidden select-none text-[20rem] leading-none font-bold text-text/[0.04] lg:block"
        >
          书
        </span>

        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-5 pt-28 pb-14 sm:px-6 md:grid-cols-[1fr_auto] md:pt-32 md:pb-18 lg:px-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text/55">
              <span
                lang="zh"
                aria-hidden="true"
                className="flex size-6 items-center justify-center rounded bg-text text-[10px] font-bold text-background"
              >
                书
              </span>
              {t("রিসোর্স · এইচএসকে লাইব্রেরি", "Resources · HSK library")}
            </div>

            <h1 className="mt-6 text-[2.4rem] leading-[1.1] font-bold tracking-tight sm:text-5xl">
              {t("এইচএসকে লাইব্রেরি", "The HSK library")}
            </h1>

            <p className="mt-5 max-w-[50ch] text-base leading-[1.75] text-text/70">
              {t(
                "ছয়টি লেভেলের PDF বই, অডিও, মক টেস্ট আর ভোকাবুলারি — গুগল ড্রাইভে লেভেল ধরে সাজানো, সম্পূর্ণ ফ্রি। প্রতিটি সারি সরাসরি ড্রাইভ ফোল্ডারে যায়।",
                "PDF books, audio, mock tests and vocabulary for all six levels — organised level by level on Google Drive, completely free. Every row resolves straight to a Drive folder.",
              )}
            </p>
          </div>

          {/* spec sheet */}
          <dl className="min-w-[15rem] self-start border border-text/15 font-mono text-xs">
            {spec.map(([k, v], i) => (
              <div
                key={k}
                className={`flex items-center justify-between gap-6 px-3.5 py-2.5 ${
                  i === 0 ? "" : "border-t border-text/12"
                }`}
              >
                <dt className="uppercase tracking-[0.14em] text-text/45">{k}</dt>
                <dd className="tabular-nums text-text">{v}</dd>
              </div>
            ))}
          </dl>
        </div>
      </section>

      {/* ===================== CONSOLE (dark) ===================== */}
      <section className="bg-[#0a1512] text-[#e6f0ed]">
        <div className="mx-auto max-w-6xl px-5 py-12 sm:px-6 md:py-16 lg:px-8">
          <div
            className="flex flex-wrap gap-x-1.5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em]"
            role="group"
            aria-label={t("লেভেল অনুযায়ী ফিল্টার", "Filter by level")}
          >
            <FilterChip
              active={active === "all"}
              onClick={() => setActive("all")}
              label={`${t("সব", "all")} · ${num(hskLevels.length)}`}
            />
            {hskLevels.map((level) => (
              <FilterChip
                key={level.id}
                active={active === level.id}
                onClick={() => setActive(level.id)}
                label={`hsk ${
                  isBn
                    ? toBn(Number(level.id.split("-")[1]))
                    : level.id.split("-")[1]
                }`}
              />
            ))}
          </div>

          <div className="mt-10 space-y-12">
            {visible.map((level, i) => (
              <LevelRecord
                key={level.id}
                level={level}
                index={i + 1}
                isBn={isBn}
              />
            ))}
          </div>

          {/* complete collection */}
          <div className="mt-14 border-t border-white/10 pt-6">
            <a
              href={completeCollection.link}
              target="_blank"
              rel="noopener noreferrer"
              className="group flex items-baseline gap-3 font-mono text-[12px] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-[#fa7d4e]"
            >
              <span className="uppercase tracking-[0.14em] text-[#e6f0ed]">
                {isBn ? completeCollection.titleBn : completeCollection.title}
              </span>
              <span
                aria-hidden="true"
                className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-white/15"
              />
              <span className="inline-flex items-center gap-1 uppercase tracking-[0.16em] text-white/50 transition-colors group-hover:text-[#fa7d4e]">
                {t("খুলুন", "Open")}
                <span className="text-sm leading-none">↗</span>
              </span>
            </a>
            <p className="mt-3 font-mono text-[11px] leading-relaxed text-white/40">
              {isBn
                ? completeCollection.descriptionBn
                : completeCollection.description}
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
