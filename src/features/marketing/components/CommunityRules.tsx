// components/CommunityRules.tsx
"use client";

import { useEffect, useRef } from "react";
import Link from "next/link";
import { ArrowRight, ArrowUpRight } from "lucide-react";

import { useLanguage } from "@/i18n";
import {
  rulesData,
  categoryGroups,
  type Category,
  type Rule,
} from "@/features/marketing/data/mandarinRules";

/**
 * Community guidelines — the sumi-e register's reading treatment for a long
 * rule list: no search box, no view toggle, no category filter. Rules are
 * grouped by category into hairline-separated sub-sections, severity is a word
 * (not a colour swatch), and the few "start here" rules carry a filled numeral.
 */

const LAST_UPDATED = { bn: "১৭ আগস্ট ২০২৬", en: "17 August 2026" };
const CONTACT_URL = "https://wa.me/8801787881334";

const SEVERITY: Record<
  Rule["severity"],
  { bn: string; en: string; cls: string }
> = {
  strict: { bn: "কঠোর", en: "Strict", cls: "text-secondary" },
  moderate: { bn: "প্রত্যাশিত", en: "Expected", cls: "text-text/55" },
  informative: { bn: "তথ্য", en: "Info", cls: "text-text/40" },
};

// One Hanzi per category — reads as the section's idea, not decoration.
const CATEGORY_SEAL: Record<Category, string> = {
  overview: "序",
  schedule: "时",
  chain_system: "链",
  rules: "则",
  commitment: "诺",
};

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];
const toBn = (n: number) => String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)]);

const LINK_CLS =
  "mt-3 inline-flex items-center gap-1.5 text-sm font-medium text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text";

function useReveal<T extends HTMLElement>() {
  const ref = useRef<T>(null);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;

    el.classList.add("reveal-armed");

    const reduced = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;
    if (reduced || !("IntersectionObserver" in window)) {
      el.classList.add("is-in");
      return;
    }

    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          el.classList.add("is-in");
          observer.disconnect();
        }
      },
      { threshold: 0.12 },
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, []);

  return ref;
}

function CategoryBlock({
  categoryId,
  label,
  rules,
  isBn,
}: {
  categoryId: Category;
  label: string;
  rules: Rule[];
  isBn: boolean;
}) {
  const ref = useReveal<HTMLDivElement>();
  const pick = (v: { bn: string; en: string }) => (isBn ? v.bn : v.en);
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
          {CATEGORY_SEAL[categoryId]}
        </span>
        <h3 className="text-lg font-semibold tracking-tight text-text">
          {label}
        </h3>
        <span className="text-xs tabular-nums text-text/40">{num(rules.length)}</span>
      </div>

      <ol>
        {rules.map((rule, i) => {
          const sev = SEVERITY[rule.severity];
          return (
            <li
              key={rule.id}
              data-reveal
              style={{ "--r": i + 1 } as React.CSSProperties}
              className="grid grid-cols-[2rem_1fr] gap-x-4 border-b border-text/10 py-6 sm:grid-cols-[2.5rem_1fr]"
            >
              <span
                className={
                  rule.isHighlighted
                    ? "flex size-6 items-center justify-center rounded-md bg-text text-[11px] font-bold tabular-nums text-background"
                    : "pt-0.5 text-xs font-semibold tabular-nums text-text/35"
                }
              >
                {num(i + 1)}
              </span>

              <div>
                <div className="flex flex-wrap items-baseline gap-x-3 gap-y-1">
                  <h4 className="text-[15px] font-semibold text-text">
                    {pick(rule.title)}
                  </h4>
                  <span
                    className={`text-[11px] font-medium uppercase tracking-wide ${sev.cls}`}
                  >
                    {pick(sev)}
                  </span>
                </div>

                <p className="mt-1.5 max-w-2xl text-sm leading-6 text-text/65">
                  {pick(rule.description)}
                </p>

                {rule.details && (
                  <ul className="mt-3 space-y-1.5">
                    {(isBn ? rule.details.bn : rule.details.en).map((d, di) => (
                      <li
                        key={di}
                        className="flex items-start gap-2.5 text-sm text-text/55"
                      >
                        <span
                          aria-hidden="true"
                          className="mt-2 size-1 shrink-0 rounded-full bg-text/30"
                        />
                        {d}
                      </li>
                    ))}
                  </ul>
                )}

                {rule.action &&
                  (rule.action.type === "external" ? (
                    <a
                      href={rule.action.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className={LINK_CLS}
                    >
                      {pick(rule.action.label)}
                      <ArrowUpRight className="size-3.5" aria-hidden="true" />
                    </a>
                  ) : (
                    <Link href={rule.action.link} className={LINK_CLS}>
                      {pick(rule.action.label)}
                      <ArrowRight className="size-3.5" aria-hidden="true" />
                    </Link>
                  ))}
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

export default function CommunityRules() {
  const { language } = useLanguage();
  const isBn = language === "bn";
  const t = (bn: string, en: string) => (isBn ? bn : en);

  const groups = categoryGroups
    .filter((g) => g.id !== "all")
    .map((g) => ({
      id: g.id as Category,
      label: t(g.label.bn, g.label.en),
      rules: rulesData
        .filter((r) => r.category === g.id)
        .sort((a, b) => a.priority - b.priority),
    }))
    .filter((g) => g.rules.length > 0);

  const total = rulesData.length;

  return (
    <section
      id="guidelines"
      className="scroll-mt-24 border-t border-text/10 bg-background py-16 md:py-24"
    >
      <div className="mx-auto max-w-6xl px-6">
        <div className="max-w-2xl">
          <div className="flex flex-wrap items-center gap-x-3 gap-y-1.5">
            <span
              lang="zh"
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-md bg-text text-[11px] font-bold text-background"
            >
              规
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text/60">
              {t("কমিউনিটি গাইডলাইন", "Community guidelines")}
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {t("কমিউনিটি যেভাবে চলে", "How the community works")}
          </h2>

          <p className="mt-3 text-[15px] leading-7 text-text/70">
            {t(
              "সম্পূর্ণ বিনামূল্যে চীনা শেখার একটি সুশৃঙ্খল জায়গা। নিচের নিয়মগুলো মেনে চললে সবার জন্যই ক্লাসটা কাজে লাগে।",
              "A structured, completely free place to learn Chinese. Following the guidelines below is what keeps the class working for everyone.",
            )}
          </p>
        </div>

        <div className="mt-14 space-y-16">
          {groups.map((g) => (
            <CategoryBlock
              key={g.id}
              categoryId={g.id}
              label={g.label}
              rules={g.rules}
              isBn={isBn}
            />
          ))}
        </div>

        <div className="mt-16 flex flex-col gap-4 border-t border-text/15 pt-6 text-sm text-text/60 sm:flex-row sm:items-center sm:justify-between">
          <p>
            {t("মোট ", "")}
            <span className="font-semibold tabular-nums text-text">
              {isBn ? toBn(total) : total}
            </span>{" "}
            {t("টি নিয়ম", "guidelines in total")}
            <span className="mx-2 text-text/25" aria-hidden="true">
              ·
            </span>
            {t("হালনাগাদ ", "Updated ")}
            {t(LAST_UPDATED.bn, LAST_UPDATED.en)}
          </p>

          <a
            href={CONTACT_URL}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-1.5 font-medium text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-text"
          >
            {t("প্রশ্ন থাকলে যোগাযোগ করুন", "Questions? Contact us")}
            <ArrowUpRight className="size-3.5" aria-hidden="true" />
          </a>
        </div>
      </div>
    </section>
  );
}
