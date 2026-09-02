"use client";

import { CalendarDays, GraduationCap } from "lucide-react";
import { useLanguage } from "@/context/LanguageContext";

/**
 * Two facts a prospective student needs before joining: the shape of the
 * teaching week (five live classes, a Thursday exam, a Friday rest day)
 * and the arc of the course (Pinyin → six levels → HSK prep).
 *
 * The week is a seven-cell strip so the two days that differ — the exam
 * and the rest day — carry the only visual emphasis. The course arc runs
 * horizontally, deliberately unlike the vertical Pinyin-submission path in
 * RoadmapBooks directly above it: this track begins where that one ends.
 */

const dayTone: Record<string, string> = {
  class: "border-text/10 bg-[#f8f3ea] in-[.dark]:bg-text/[0.04]",
  exam: "border-primary/45 bg-primary/[0.06]",
  rest: "border-dashed border-text/20 bg-transparent",
};

export default function ClassRoutineSection() {
  const { t, language } = useLanguage();
  const c = t.classRoutine;

  const teachingDays = c.days.filter((d) => d.kind !== "rest").length;

  return (
    <section
      id="routine"
      aria-labelledby="routine-title"
      className={`scroll-mt-24 bg-background py-16 md:py-24 ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      <div className="mx-auto max-w-6xl px-6">
        {/* Header */}
        <div className="max-w-2xl">
          <div className="flex items-center gap-2.5">
            <span
              lang="zh"
              aria-hidden="true"
              className="flex size-7 items-center justify-center rounded-md bg-text text-[11px] font-bold text-background"
            >
              课
            </span>
            <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text/55">
              {c.badge}
            </span>
          </div>

          <h2
            id="routine-title"
            className="mt-4 text-3xl font-bold tracking-tight text-text sm:text-4xl"
          >
            {c.title}
          </h2>

          <p className="mt-3 text-[15px] leading-7 text-text/70">
            {c.description}
          </p>
        </div>

        {/* The teaching week */}
        <div className="mt-10">
          <div className="flex items-baseline gap-3">
            <h3 className="text-sm font-semibold text-text">{c.weekLabel}</h3>
            <span className="h-px flex-1 bg-text/15" />
            <span className="font-en text-xs font-medium tabular-nums text-text/45">
              {teachingDays} / {c.days.length}
            </span>
          </div>

          <ul className="mt-4 grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-7">
            {c.days.map((day) => (
              <li
                key={day.short}
                className={`rounded-xl border p-3 transition-colors motion-reduce:transition-none ${
                  dayTone[day.kind] ?? dayTone.class
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="text-sm font-semibold text-text">
                    {day.short}
                  </span>
                  <span
                    lang="zh"
                    aria-hidden="true"
                    className="font-en text-[11px] tabular-nums text-text/45"
                  >
                    {day.zh}
                  </span>
                </div>
                <p className="mt-2 flex items-center gap-1.5 text-[12px] leading-4 text-text/60">
                  {day.kind === "exam" && (
                    <span
                      aria-hidden="true"
                      className="size-1.5 shrink-0 rounded-full bg-primary"
                    />
                  )}
                  {day.note}
                </p>
              </li>
            ))}
          </ul>

          <div className="mt-4 flex flex-wrap gap-x-6 gap-y-1.5 text-[13px] leading-6 text-text/55">
            <span className="flex items-center gap-1.5">
              <CalendarDays
                className="size-3.5 shrink-0 text-primary"
                aria-hidden="true"
              />
              {c.attendanceNote}
            </span>
            <span className="flex items-center gap-1.5">
              <span
                aria-hidden="true"
                className="size-1.5 shrink-0 rounded-full bg-primary"
              />
              {c.examNote}
            </span>
          </div>
        </div>

        {/* The level track */}
        <div className="mt-14 border-t border-text/10 pt-10">
          <div className="max-w-2xl">
            <div className="flex items-center gap-2.5">
              <span
                aria-hidden="true"
                className="flex size-7 items-center justify-center rounded-md border border-text/15 text-text/70"
              >
                <GraduationCap className="size-4" />
              </span>
              <span className="text-xs font-semibold uppercase tracking-[0.15em] text-text/55">
                {c.trackBadge}
              </span>
            </div>

            <h3 className="mt-4 text-2xl font-bold tracking-tight text-text sm:text-3xl">
              {c.trackTitle}
            </h3>

            <p className="mt-3 text-[15px] leading-7 text-text/70">
              {c.trackDescription}
            </p>
          </div>

          <div className="mt-8 overflow-x-auto pb-2">
            <ol className="relative flex min-w-max">
              <span
                aria-hidden="true"
                className="absolute left-11 right-11 top-5 h-px bg-text/15"
              />
              {c.levels.map((level, index) => {
                const isFirst = index === 0;
                const isLast = index === c.levels.length - 1;

                return (
                  <li
                    key={level.name}
                    className="relative flex w-23 shrink-0 flex-col items-center text-center"
                  >
                    <span
                      aria-hidden="true"
                      className={`relative z-10 flex size-10 items-center justify-center rounded-full border text-xs font-semibold tabular-nums ${
                        isLast
                          ? "border-text bg-text text-background"
                          : "border-text/20 bg-background text-text/70"
                      }`}
                    >
                      {isFirst ? (
                        <span lang="zh" className="text-[11px]">
                          拼
                        </span>
                      ) : isLast ? (
                        <span className="text-[10px]">HSK</span>
                      ) : (
                        String(index).padStart(2, "0")
                      )}
                    </span>
                    <span className="mt-2 text-[13px] font-medium leading-4 text-text">
                      {level.name}
                    </span>
                    <span
                      lang="zh"
                      aria-hidden="true"
                      className="mt-0.5 text-[11px] text-text/45"
                    >
                      {level.zh}
                    </span>
                  </li>
                );
              })}
            </ol>
          </div>

          <p className="mt-6 max-w-2xl text-sm leading-7 text-text/70">
            {c.trackStartNote}{" "}
            <a
              href={c.pinyinHref}
              className="font-medium text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
            >
              {c.pinyinLinkText}
            </a>
          </p>
        </div>
      </div>
    </section>
  );
}
