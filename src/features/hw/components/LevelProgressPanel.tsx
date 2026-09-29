"use client";

import { useEffect, useMemo, useState } from "react";
import { Target, CircleCheck, CircleDashed, BookOpen } from "lucide-react";
import { useLanguage } from "@/i18n";
import { getExamLessonNumbers, buildLessonExam } from "@/features/hw/data/exam";
import { loadAccountPhone } from "@/features/student-auth";
import { round2 } from "@/features/hw/marks";

type LevelProgress = {
  level: number;
  totalMarks: number;
  obtained: number;
  percent: number | null;
  examsGiven: number;
  examsTotal: number;
  examsLeft: number;
  perLesson: { lesson: number; best: number; attempts: number; outOf: number }[];
};

/**
 * What the whole HSK level is worth and how much of it this student has.
 *
 * The exam page used to show only the marks for the lesson in front of you, so
 * "how many marks is HSK 1 worth in total" had to be counted by hand and a
 * student could not tell whether they were three exams in or thirty. When
 * logged in this reads the account's real results; signed out it falls back to
 * the results already saved in this browser, so the same numbers appear either
 * way.
 */
export default function LevelProgressPanel({
  level,
  highlightLesson,
}: {
  level: number;
  highlightLesson?: number;
}) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const [remote, setRemote] = useState<LevelProgress | null>(null);
  const [phone, setPhone] = useState<string | null>(null);

  useEffect(() => {
    queueMicrotask(() => setPhone(loadAccountPhone()));
  }, []);

  useEffect(() => {
    if (!phone) return;
    let alive = true;
    /* The phone has to be in the query. Without it the route answers 401, so
       this panel silently fell back to the browser's local numbers and the
       student's real progress never arrived — which looked exactly like the
       remote figures being wrong. */
    fetch(`/api/hw/progress?phone=${encodeURIComponent(phone)}`, { cache: "no-store" })
      .then((r) => (r.ok ? r.json() : null))
      .then((d) => {
        if (!alive || !d?.success) return;
        const hit = (d.levels ?? []).find((l: LevelProgress) => l.level === level);
        if (hit) setRemote(hit);
      })
      .catch(() => {
        /* offline — the local fallback below covers it */
      });
    return () => {
      alive = false;
    };
  }, [phone, level]);

  /* `remote` is whatever level came back last, and levels reuse lesson numbers
     (HSK 1 lesson 3 and HSK 2 lesson 3 are different papers). Matching on
     lesson alone would therefore show HSK 1's marks against HSK 2's lessons
     until the new answer landed. Only accept the answer that belongs to the
     level on screen. */
  const remoteForLevel = remote?.level === level ? remote : null;

  const progress = useMemo<LevelProgress>(() => {
    const lessons = getExamLessonNumbers(level);
    const byLesson = lessons.map((lesson) => {
      let outOf = 0;
      try {
        outOf = buildLessonExam(level, lesson)?.totalMarks ?? 0;
      } catch {
        outOf = 0;
      }
      const fromRemote = remoteForLevel?.perLesson.find((p) => p.lesson === lesson);
      return {
        lesson,
        outOf,
        best: fromRemote?.best ?? 0,
        attempts: fromRemote?.attempts ?? 0,
      };
    });
    const totalMarks = round2(byLesson.reduce((n, l) => n + l.outOf, 0));
    const obtained = round2(byLesson.reduce((n, l) => n + l.best, 0));
    const examsGiven = byLesson.filter((l) => l.attempts > 0).length;
    return {
      level,
      totalMarks,
      obtained,
      percent: totalMarks ? Math.round((obtained / totalMarks) * 100) : null,
      examsGiven,
      examsTotal: byLesson.length,
      examsLeft: Math.max(0, byLesson.length - examsGiven),
      perLesson: byLesson,
    };
  }, [level, remoteForLevel]);

  if (progress.examsTotal === 0) return null;

  const pct = progress.percent ?? 0;

  return (
    <section className="mb-6 rounded-2xl border border-border bg-background p-4 sm:p-5">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <div>
          <h2 className="flex items-center gap-2 text-sm font-bold text-text">
            <Target className="h-4 w-4 text-primary" aria-hidden="true" />
            {t("এই HSK-এর সব মিলিয়ে", "Whole HSK level")}
          </h2>
          <p className="mt-0.5 text-xs text-muted">
            {t(
              `${progress.examsTotal} টি পরীক্ষা, মোট ${progress.totalMarks} নম্বর`,
              `${progress.examsTotal} exams, ${progress.totalMarks} marks in total`,
            )}
          </p>
        </div>
        <div className="text-right">
          <p className="font-mono text-2xl font-bold tabular-nums text-text">
            {progress.obtained}
            <span className="text-base text-muted"> / {progress.totalMarks}</span>
          </p>
          <p className="text-[11px] font-semibold tabular-nums text-muted">
            {t("পেয়েছেন", "scored")}
            {progress.percent !== null && ` · ${progress.percent}%`}
          </p>
        </div>
      </div>

      <div className="mt-4 h-2.5 overflow-hidden rounded-full bg-text/10">
        <div
          className={`h-full rounded-full transition-all ${
            pct >= 80 ? "bg-ok" : pct >= 40 ? "bg-warn" : "bg-danger"
          }`}
          style={{ width: `${pct}%` }}
        />
      </div>

      <dl className="mt-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
        <div className="rounded-xl border border-border bg-card px-3 py-2.5">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {t("পরীক্ষা দিয়েছেন", "Exams given")}
          </dt>
          <dd className="mt-0.5 font-mono text-lg font-bold tabular-nums text-text">
            {progress.examsGiven}
            <span className="text-sm text-muted"> / {progress.examsTotal}</span>
          </dd>
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-2.5">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {t("আরও দিতে হবে", "Still to give")}
          </dt>
          <dd className="mt-0.5 font-mono text-lg font-bold tabular-nums text-text">
            {progress.examsLeft}
            <span className="ml-1 text-[11px] font-normal text-muted">
              {t("টি পরীক্ষা", "exams")}
            </span>
          </dd>
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-2.5">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {t("নম্বর বাকি", "Marks left")}
          </dt>
          <dd className="mt-0.5 font-mono text-lg font-bold tabular-nums text-text">
            {round2(progress.totalMarks - progress.obtained)}
          </dd>
        </div>
        <div className="rounded-xl border border-border bg-card px-3 py-2.5">
          <dt className="text-[10px] font-semibold uppercase tracking-wide text-muted">
            {t("গড়", "Average")}
          </dt>
          <dd className="mt-0.5 font-mono text-lg font-bold tabular-nums text-text">
            {progress.examsGiven > 0
              ? round2(progress.obtained / progress.examsGiven)
              : "—"}
          </dd>
        </div>
      </dl>

      {/* Per-lesson grid, so "which exam have I not done" is answerable at a
          glance instead of by reading the dropdown. */}
      <details className="mt-4">
        <summary className="cursor-pointer text-xs font-semibold text-muted hover:text-text">
          {t("লেসনভিত্তিক বিস্তারিত", "Lesson by lesson")}
        </summary>
        <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-4 lg:grid-cols-6">
          {progress.perLesson.map((l) => {
            const done = l.attempts > 0;
            const current = highlightLesson === l.lesson;
            return (
              <li
                key={l.lesson}
                className={`flex items-center justify-between gap-1.5 rounded-lg border px-2.5 py-1.5 text-[11px] ${
                  current
                    ? "border-primary/50 bg-primary/5"
                    : done
                      ? "border-ok/30 bg-ok/5"
                      : "border-border bg-card"
                }`}
              >
                <span className="flex items-center gap-1.5 font-medium text-text">
                  {done ? (
                    <CircleCheck className="h-3.5 w-3.5 text-ok" aria-hidden="true" />
                  ) : (
                    <CircleDashed className="h-3.5 w-3.5 text-muted" aria-hidden="true" />
                  )}
                  {t("লেসন", "L")} {l.lesson}
                </span>
                <span
                  className={`font-mono tabular-nums ${
                    done ? "font-bold text-ok" : "text-muted"
                  }`}
                >
                  {done ? `${l.best}/${l.outOf}` : "—"}
                </span>
              </li>
            );
          })}
        </ul>
        {!phone && (
          <p className="mt-3 flex items-start gap-1.5 text-[11px] text-muted">
            <BookOpen className="mt-0.5 h-3 w-3 shrink-0" aria-hidden="true" />
            {t(
              "লগইন করলে অন্য ডিভাইসে দেওয়া পরীক্ষার নম্বরও এখানে জমা হবে।",
              "Sign in to include exams you sat on another device.",
            )}
          </p>
        )}
      </details>
    </section>
  );
}
