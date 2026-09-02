"use client";

import { useMemo, useState } from "react";

import { useLanguage } from "@/i18n";
import { useReveal } from "@/lib/useReveal";
import {
  categoryMeta,
  categoryOrder,
  type AppCategory,
  type AppWithIcon,
} from "@/features/marketing/data/suggestedApps";

/**
 * The technical `/apps` registry. A rice-paper spec header connects the page
 * to the rest of the site; the listing itself is a dark console — mono
 * package ids, dot-leader section rules, one data row per app.
 *
 * `apps` (with pre-resolved Play Store icons) and `resolvedIcons` come from
 * the `/apps` server component.
 */

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

type Filter = AppCategory | "all";

function AppIcon({ app }: { app: AppWithIcon }) {
  if (app.iconUrl) {
    return (
      // eslint-disable-next-line @next/next/no-img-element -- remote Play Store CDN, no next.config images setup
      <img
        src={app.iconUrl}
        alt=""
        width={40}
        height={40}
        loading="lazy"
        decoding="async"
        className="size-9 shrink-0 rounded-[9px] bg-white/5 ring-1 ring-white/10 sm:size-10"
      />
    );
  }
  return (
    <span
      aria-hidden="true"
      className="flex size-9 shrink-0 items-center justify-center rounded-[9px] bg-white/[0.04] font-mono text-sm text-white/40 ring-1 ring-white/10 sm:size-10"
    >
      {app.name.charAt(0)}
    </span>
  );
}

function CategoryGroup({
  category,
  apps,
  isBn,
  index,
}: {
  category: AppCategory;
  apps: AppWithIcon[];
  isBn: boolean;
  index: number;
}) {
  const ref = useReveal<HTMLDivElement>({ threshold: 0.08 });
  const meta = categoryMeta[category];
  const idx = isBn ? toBn(index) : String(index).padStart(2, "0");
  const count = isBn ? toBn(apps.length) : String(apps.length).padStart(2, "0");

  return (
    <div ref={ref} className="reveal-group">
      {/* Section rule — index · label · dot leader · count */}
      <div
        data-reveal
        className="flex items-baseline gap-3 py-3 font-mono text-[11px] uppercase tracking-[0.18em] text-white/45"
      >
        <span className="text-[#fa7d4e]">{idx}</span>
        <span className="text-white/75">{isBn ? meta.bn : meta.en}</span>
        <span aria-hidden="true" lang="zh" className="tracking-normal text-white/30">
          {meta.seal}
        </span>
        <span
          aria-hidden="true"
          className="min-w-6 flex-1 translate-y-[-3px] border-b border-dotted border-white/15"
        />
        <span className="tabular-nums text-white/55">{count}</span>
      </div>

      <ul className="border-t border-white/10">
        {apps.map((app, i) => (
          <li
            key={app.name}
            data-reveal
            style={{ "--r": i + 1 } as React.CSSProperties}
          >
            <a
              href={app.url}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={
                isBn
                  ? `${app.name} — গুগল প্লে-তে খুলুন`
                  : `${app.name} — open on Google Play`
              }
              className="group grid grid-cols-[auto_1fr] items-center gap-x-4 gap-y-1 border-b border-white/10 py-4 transition-colors hover:bg-white/[0.03] focus-visible:bg-white/[0.05] focus-visible:outline-none sm:grid-cols-[auto_minmax(0,1fr)_9.5rem_5rem] sm:gap-x-6"
            >
              <AppIcon app={app} />

              <span className="min-w-0">
                <span className="block truncate text-[15px] font-medium text-[#e6f0ed]">
                  {app.name}
                </span>
                <span className="block truncate font-mono text-[11px] text-white/40">
                  {app.packageId ?? "—"}
                </span>
              </span>

              <span className="col-start-2 font-mono text-[10px] uppercase tracking-[0.16em] text-white/45 sm:col-start-3 sm:text-right sm:text-[11px]">
                {isBn ? categoryMeta[app.category].bn : app.category}
              </span>

              <span className="col-start-2 inline-flex items-center gap-1 font-mono text-[11px] uppercase tracking-[0.16em] text-white/50 transition-colors group-hover:text-[#fa7d4e] sm:col-start-4 sm:justify-end">
                {isBn ? "খুলুন" : "Open"}
                <span aria-hidden="true" className="text-sm leading-none">
                  ↗
                </span>
              </span>
            </a>
          </li>
        ))}
      </ul>
    </div>
  );
}

export default function AppsExplorer({
  apps,
  resolvedIcons,
}: {
  apps: AppWithIcon[];
  resolvedIcons: number;
}) {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const t = (bn: string, en: string) => (isBn ? bn : en);
  const num = (n: number) => (isBn ? toBn(n) : String(n));

  const [filter, setFilter] = useState<Filter>("all");

  const present = useMemo(
    () => categoryOrder.filter((c) => apps.some((a) => a.category === c)),
    [apps],
  );
  const visible = filter === "all" ? present : present.filter((c) => c === filter);

  const spec: [string, string][] = [
    [t("এন্ট্রি", "Entries"), num(apps.length)],
    [t("বিভাগ", "Categories"), num(present.length)],
    [t("সোর্স", "Source"), "play.google.com"],
    [t("প্ল্যাটফর্ম", "Platform"), "Android"],
    [t("খরচ", "Cost"), t("ফ্রি", "Free")],
    [
      t("আইকন", "Icons"),
      `${num(resolvedIcons)}/${num(apps.length)} ${t("রেজলভড", "resolved")}`,
    ],
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
          具
        </span>

        <div className="relative z-10 mx-auto grid max-w-6xl gap-12 px-5 pt-28 pb-14 sm:px-6 md:grid-cols-[1fr_auto] md:pt-32 md:pb-18 lg:px-8">
          <div className="max-w-xl">
            <div className="flex items-center gap-2.5 font-mono text-[11px] uppercase tracking-[0.2em] text-text/55">
              <span
                lang="zh"
                aria-hidden="true"
                className="flex size-6 items-center justify-center rounded bg-text text-[10px] font-bold text-background"
              >
                具
              </span>
              {t("রিসোর্স · অ্যাপ রেজিস্ট্রি", "Resources · App registry")}
            </div>

            <h1 className="mt-6 text-[2.4rem] leading-[1.1] font-bold tracking-tight sm:text-5xl">
              {t("অ্যাপ রেজিস্ট্রি", "The app registry")}
            </h1>

            <p className="mt-5 max-w-[50ch] text-base leading-[1.75] text-text/70">
              {t(
                "পিনয়িন, অভিধান, হাতে লেখা আর এইচএসকে প্রস্তুতির জন্য বেছে নেওয়া অ্যান্ড্রয়েড অ্যাপ — প্রতিটি ফ্রি। প্রতিটি এন্ট্রি সরাসরি প্লে স্টোর লিস্টিং-এ যায়।",
                "A curated set of Android apps for pinyin, dictionaries, handwriting and HSK prep — every one free. Each entry resolves straight to its Play Store listing.",
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
          {/* filter bar */}
          <div
            className="flex flex-wrap gap-x-1.5 gap-y-2 font-mono text-[11px] uppercase tracking-[0.14em]"
            role="group"
            aria-label={t("বিভাগ অনুযায়ী ফিল্টার", "Filter by category")}
          >
            <FilterChip
              active={filter === "all"}
              onClick={() => setFilter("all")}
              label={`${t("সব", "all")} · ${num(apps.length)}`}
            />
            {present.map((c) => (
              <FilterChip
                key={c}
                active={filter === c}
                onClick={() => setFilter(c)}
                label={`${isBn ? categoryMeta[c].bn : c} · ${num(
                  apps.filter((a) => a.category === c).length,
                )}`}
              />
            ))}
          </div>

          {/* column key */}
          <div className="mt-10 hidden grid-cols-[auto_minmax(0,1fr)_9.5rem_5rem] gap-x-6 border-b border-white/10 pb-2 font-mono text-[10px] uppercase tracking-[0.18em] text-white/35 sm:grid">
            <span className="w-10">{t("আইকন", "Icon")}</span>
            <span>{t("নাম · প্যাকেজ", "Name · package")}</span>
            <span className="text-right">{t("বিভাগ", "Category")}</span>
            <span className="text-right">{t("লিংক", "Link")}</span>
          </div>

          <div className="mt-4 space-y-12">
            {visible.map((c, i) => (
              <CategoryGroup
                key={c}
                category={c}
                index={i + 1}
                isBn={isBn}
                apps={apps.filter((a) => a.category === c)}
              />
            ))}
          </div>

          <p className="mt-14 border-t border-white/10 pt-6 font-mono text-[11px] leading-relaxed text-white/40">
            {t(
              "আইকন ও নাম গুগল প্লে থেকে নেওয়া। কোনো অ্যাপ ইনস্টল করার আগে পারমিশন যাচাই করে নিন।",
              "Icons and names are pulled from Google Play. Review the permissions on any listing before installing.",
            )}
          </p>
        </div>
      </section>
    </div>
  );
}

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
