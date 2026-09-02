"use client";

import {
  ArrowRight,
  BookOpen,
  GraduationCap,
  MessageCircle,
  Mic,
  ShieldCheck,
} from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";
import { finals, initials, type PinyinSound } from "@/data/pinyin";

type Step = {
  title: string;
  description: string;
};

/**
 * The gate a learner clears before joining Level 1: read the Pinyin
 * sound sheet aloud, record it, send it in, wait for a mentor to check.
 *
 * The sheet is real, selectable text set on copybook ruling — the same
 * 四线格 a Chinese pinyin exercise book uses — not a screenshot, so it
 * reads, translates, zooms and indexes. The four actions run as one
 * numbered sequence rather than a card grid, because this is a path,
 * not a feature list.
 */
export default function RoadmapBooks() {
  const { t, language } = useLanguage();
  const roadmap = t.roadmap;

  const stepIcons = [BookOpen, Mic, MessageCircle, GraduationCap];

  return (
    <section
      id="pinyin"
      className={`scroll-mt-24 bg-background py-16 md:py-24 ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header — left-aligned, in the site's own eyebrow idiom */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span
              lang="zh"
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-md bg-text text-[11px] font-bold text-background"
            >
              拼
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text/55">
              {roadmap.badge}
            </span>
          </div>

          <h2 className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl">
            {roadmap.title}
          </h2>

          <p className="mt-3 text-[15px] leading-7 text-text/70">
            {roadmap.description}
          </p>
        </div>

        <div className="mt-10 grid gap-10 lg:grid-cols-[minmax(0,1.35fr)_minmax(0,1fr)] lg:gap-14">
          {/* The practice sheet */}
          <div>
            <div className="rounded-2xl border border-text/10 bg-[#f8f3ea] p-5 shadow-[0_24px_60px_-38px_rgba(0,0,0,0.35)] in-[.dark]:bg-text/[0.035] sm:p-7">
              <SoundGroup
                zh="声母"
                label={roadmap.initialsLabel}
                count={initials.length}
                sounds={initials}
                exampleLabel={roadmap.exampleLabel}
                columnsClass="grid-cols-6 sm:grid-cols-8"
              />

              <div className="my-6 h-px bg-text/10" />

              <SoundGroup
                zh="单韵母"
                label={roadmap.finalsLabel}
                count={finals.length}
                sounds={finals}
                exampleLabel={roadmap.exampleLabel}
                columnsClass="grid-cols-6"
              />
            </div>

            <p className="mt-3 flex items-start gap-2 text-[13px] leading-6 text-text/55">
              <Mic className="mt-0.5 size-3.5 shrink-0 text-primary" aria-hidden="true" />
              {roadmap.sheetCaption}
            </p>
          </div>

          {/* The four actions, as one numbered path */}
          <div>
            <ol className="relative">
              <span
                aria-hidden="true"
                className="absolute left-5 top-4 bottom-4 w-px bg-text/15"
              />

              {roadmap.steps.map((step: Step, index: number) => {
                const Icon = stepIcons[index] ?? BookOpen;
                const isLast = index === roadmap.steps.length - 1;

                return (
                  <li key={index} className="relative flex gap-4 pb-7 last:pb-0">
                    <span
                      className={`relative z-10 flex size-10 shrink-0 items-center justify-center rounded-full border text-xs font-semibold tabular-nums ${
                        isLast
                          ? "border-text bg-text text-background"
                          : "border-text/20 bg-background text-text/70"
                      }`}
                    >
                      {String(index + 1).padStart(2, "0")}
                    </span>

                    <div className="pt-1">
                      <div className="flex items-center gap-2">
                        <Icon className="size-3.5 text-text/40" aria-hidden="true" />
                        <h3 className="text-[15px] font-semibold text-text">
                          {step.title}
                        </h3>
                      </div>
                      <p className="mt-1 text-sm leading-6 text-text/65">
                        {step.description}
                      </p>
                    </div>
                  </li>
                );
              })}
            </ol>

            {/* What happens after you send it in */}
            <div className="mt-7 flex gap-4 border-t border-text/10 pt-6">
              <span className="flex size-10 shrink-0 items-center justify-center">
                <ShieldCheck className="size-5 text-text/40" aria-hidden="true" />
              </span>
              <div className="pt-1">
                <h3 className="text-[15px] font-semibold text-text">
                  {roadmap.finalTitle}
                </h3>
                <p className="mt-1 text-sm leading-6 text-text/65">
                  {roadmap.finalDescription}
                </p>
              </div>
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a
                href={roadmap.learnHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl bg-text px-5 py-3.5 text-[15px] font-semibold text-background transition hover:-translate-y-0.5 motion-reduce:transform-none focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
              >
                <BookOpen className="size-4" aria-hidden="true" />
                {roadmap.learnButton}
                <span className="sr-only"> ({roadmap.newTabHint})</span>
                <ArrowRight
                  className="size-4 transition group-hover:translate-x-0.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </a>

              <a
                href={roadmap.submitHref}
                target="_blank"
                rel="noopener noreferrer"
                className="group inline-flex items-center justify-center gap-2 rounded-xl border border-text/15 bg-background px-5 py-3.5 text-[15px] font-medium text-text transition hover:border-text/40 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
              >
                <Mic className="size-4" aria-hidden="true" />
                {roadmap.submitButton}
                <span className="sr-only"> ({roadmap.newTabHint})</span>
                <ArrowRight
                  className="size-4 transition group-hover:translate-x-0.5 motion-reduce:transform-none"
                  aria-hidden="true"
                />
              </a>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

type SoundGroupProps = {
  zh: string;
  label: string;
  count: number;
  sounds: PinyinSound[];
  exampleLabel: string;
  columnsClass: string;
};

function SoundGroup({
  zh,
  label,
  count,
  sounds,
  exampleLabel,
  columnsClass,
}: SoundGroupProps) {
  return (
    <div>
      <div className="mb-4 flex items-baseline gap-3">
        <h3 className="flex items-baseline gap-2 text-sm font-semibold text-text">
          <span lang="zh">{zh}</span>
          <span className="font-en font-medium text-text/50">{label}</span>
        </h3>
        <span className="h-px flex-1 bg-text/15" />
        <span className="font-en text-xs font-medium tabular-nums text-text/45">
          {count}
        </span>
      </div>

      <ul className={`grid gap-x-1.5 gap-y-4 ${columnsClass}`}>
        {sounds.map((s) => (
          <li
            key={s.sound}
            className="flex flex-col items-center gap-1.5 rounded-md px-0.5 py-1 transition-colors hover:bg-text/4 motion-reduce:transition-none"
          >
            <span className="relative flex h-13 w-full items-end justify-center">
              <svg
                viewBox="0 0 100 52"
                preserveAspectRatio="none"
                aria-hidden="true"
                className="absolute inset-0 h-full w-full"
              >
                <line x1="0" y1="6" x2="100" y2="6" strokeWidth="1" className="stroke-primary/30" />
                <line
                  x1="0"
                  y1="29"
                  x2="100"
                  y2="29"
                  strokeWidth="1"
                  strokeDasharray="3 4"
                  className="stroke-primary/30"
                />
                <line x1="0" y1="46" x2="100" y2="46" strokeWidth="1" className="stroke-primary/45" />
              </svg>
              <span
                lang="zh-Latn"
                className="font-en relative pb-[5px] text-[1.7rem] font-medium leading-none text-text"
              >
                {s.sound}
              </span>
            </span>

            <span lang="zh" className="text-lg leading-none text-text/70">
              {s.hanzi}
            </span>

            <span className="font-en text-[0.65rem] leading-none tracking-wide text-text/45">
              <span className="sr-only">{exampleLabel}: </span>
              {s.reading}
            </span>
          </li>
        ))}
      </ul>
    </div>
  );
}
