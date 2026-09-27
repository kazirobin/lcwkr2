"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import { ArrowRight, CalendarClock, Gift, Sparkles, Ticket, X } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";

/**
 * The featured-course banner at the top of the academy page.
 *
 * It shows the newest course that is on sale, so a launch is impossible to
 * miss, and it can be dismissed for the session. Which course is featured is
 * the admin's call from /admin/courses — a course marked "pin to the academy
 * page" wins, otherwise the most recently launched one is used.
 *
 * Completed batches are counted underneath, because how many batches have
 * actually finished is the best argument for enrolling in the next one.
 */

type Course = {
  courseId: string;
  courseName: string;
  targetLevel: string;
  tagline: string;
  duration: string;
  fee: number;
  freeClassCount: number;
  seats: number;
  remaining: number | null;
  /** Admin can pin one course; otherwise the newest launch is featured. */
  featured?: boolean;
  launchedAt?: string;
};

const HIDDEN_KEY = "lcwkr_academy_feature_hidden";

export default function AcademyFeatureBanner() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const { student: account } = useAccount();

  const [course, setCourse] = useState<Course | null>(null);
  const [completed, setCompleted] = useState(0);
  const [hidden, setHidden] = useState(false);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      try {
        if (window.sessionStorage.getItem(HIDDEN_KEY)) setHidden(true);
      } catch {
        /* ignore */
      }
    });

    const load = () => {
      fetch("/api/course-enrollments/summary", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (!alive || !d.success) return;
          setCompleted(Number(d.completedCourses) || 0);
          const list = (d.courses ?? []) as Course[];
          if (!list.length) {
            setCourse(null);
            return;
          }
          // An explicitly featured course wins; otherwise the most recent
          // launch is what a newcomer should see.
          const pinned = list.find((c) => c.featured);
          const newest = [...list].sort((a, b) =>
            (b.launchedAt ?? "").localeCompare(a.launchedAt ?? ""),
          )[0];
          setCourse(pinned ?? newest);
        })
        .catch(() => undefined);
    };
    queueMicrotask(load);
    return () => {
      alive = false;
    };
  }, []);

  const dismiss = useCallback(() => {
    setHidden(true);
    try {
      // Per session: closing it should not hide the offer on the next visit.
      window.sessionStorage.setItem(HIDDEN_KEY, "1");
    } catch {
      /* ignore */
    }
  }, []);

  if (hidden || !course) {
    if (completed > 0 && hidden) return null;
    return null;
  }

  const free = course.fee <= 0;
  const soldOut = course.remaining !== null && course.remaining <= 0;

  return (
    <section className="relative isolate overflow-hidden rounded-3xl border border-secondary/30 bg-gradient-to-br from-secondary/[0.14] via-background to-primary/[0.08] p-5 sm:p-7">
      <span
        className="pointer-events-none absolute -right-6 -top-8 select-none font-chinese text-[7rem] font-bold leading-none text-text/[0.05]"
        aria-hidden="true"
        lang="zh"
      >
        课
      </span>

      <button
        type="button"
        onClick={dismiss}
        aria-label={t("বন্ধ করুন", "Close")}
        className="absolute right-3 top-3 z-10 flex size-7 items-center justify-center rounded-full text-text/40 transition-colors hover:bg-text/8 hover:text-text"
      >
        <X className="size-4" />
      </button>

      <div className="relative">
        <p className="inline-flex items-center gap-1.5 rounded-full bg-secondary/15 px-3 py-1 text-[11px] font-bold uppercase tracking-[0.14em] text-secondary">
          <Sparkles className="size-3" aria-hidden="true" />
          {t("নতুন কোর্স চালু", "Course now open")}
        </p>

        <h2 className="mt-3 font-serif text-2xl font-medium leading-tight tracking-tight text-text sm:text-3xl">
          {course.courseName}
        </h2>

        {course.tagline && (
          <p className="mt-2 max-w-[52ch] text-[15px] leading-6 text-text/70">
            {course.tagline}
          </p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-2 text-xs text-text/65">
          <span className="rounded-full bg-background/70 px-2.5 py-1 font-semibold text-text/80">
            {course.targetLevel}
          </span>
          {course.duration && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1">
              <CalendarClock className="size-3.5 text-text/40" aria-hidden="true" />
              {course.duration}
            </span>
          )}
          {course.freeClassCount > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1">
              <Gift className="size-3.5 text-text/40" aria-hidden="true" />
              {t(`${course.freeClassCount} ফ্রি ক্লাস`, `${course.freeClassCount} free classes`)}
            </span>
          )}
          {course.remaining !== null && course.remaining > 0 && (
            <span className="inline-flex items-center gap-1.5 rounded-full bg-background/70 px-2.5 py-1">
              <Ticket className="size-3.5 text-text/40" aria-hidden="true" />
              {t(`${course.remaining} সিট বাকি`, `${course.remaining} seats left`)}
            </span>
          )}
        </div>

        <div className="mt-6 flex flex-wrap items-center gap-3">
          <a
            href="#courses"
            className="inline-flex items-center gap-2 rounded-xl bg-secondary px-5 py-2.5 text-sm font-bold text-white shadow-lg transition-opacity hover:opacity-90"
          >
            {soldOut
              ? t("সিট পূর্ণ", "All seats taken")
              : free
                ? t("ফ্রি তে যুক্ত হোন", "Join for free")
                : t("এখনই ভর্তি করুন", "Enroll now")}
            {!soldOut && <ArrowRight className="size-4" aria-hidden="true" />}
          </a>
          {!account && (
            <Link
              href="/register"
              className="text-sm font-medium text-text/60 underline-offset-4 hover:underline"
            >
              {t("আগে ৳৫০০ দিয়ে student হোন", "First, become a student for ৳500")}
            </Link>
          )}
        </div>

        {completed > 0 && (
          <p className="mt-5 border-t border-text/10 pt-4 text-xs text-text/50">
            {t(
              `আগের ${completed} টি কোর্স সফলভাবে সম্পন্ন হয়েছে।`,
              `${completed} courses completed so far.`,
            )}
          </p>
        )}
      </div>
    </section>
  );
}
