"use client";

import Link from "next/link";
import { ArrowUpRight, GraduationCap, Radio } from "lucide-react";
import { ICourse } from "@/features/academy/types";
import { useLanguage } from "@/i18n";
import { Card, ProgressBar, StatusPill } from "@/components/ui";

export default function CourseCard({
  course,
  live = false,
}: {
  course: ICourse;
  live?: boolean;
}) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const done = course.completedClassesCount ?? course.classes?.length ?? 0;
  const planned = course.totalClassesPlanned || 24;
  const enrolled = course.enrolledStudentRolls?.length ?? 0;
  const running = course.status === "Running";

  const regOpen =
    course.registrationOpen === true &&
    (!course.registrationLastDate || course.registrationLastDate >= new Date().toISOString().slice(0, 10));

  return (
    <Card interactive className="group relative flex flex-col p-5">
      {/* whole card links to the course page (stretched link) */}
      <Link
        href={`/academy/courses?course=${encodeURIComponent(course.courseId)}`}
        aria-label={t("দেখুন", "View") + " " + course.courseName}
        className="absolute inset-0 z-0 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
      />
      <div className="relative z-10 flex flex-col">
        <div className="flex items-start justify-between gap-2">
          <span className="rounded-md border border-text/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-text/70">
            {course.courseId}
          </span>
          <div className="flex items-center gap-2">
            {live && (
              <Link
                href={`/academy/courses?course=${encodeURIComponent(course.courseId)}#attendance`}
                className="inline-flex items-center gap-1 rounded-full bg-danger px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white transition-transform hover:-translate-y-0.5"
              >
                <Radio className="h-3 w-3" />
                {t("লাইভ", "Live")}
              </Link>
            )}
            {regOpen && (
              <span className="inline-flex items-center gap-1 rounded-full bg-ok px-2 py-0.5 text-[10px] font-bold uppercase tracking-wide text-white">
                <GraduationCap className="h-3 w-3" />
                {t("ভর্তি চলছে", "Admitting")}
              </span>
            )}
            <StatusPill tone={running ? "done" : "pending"}>
              {running ? t("চলমান", "Running") : t("আসছে", "Coming soon")}
            </StatusPill>
          </div>
        </div>

        <h3 className="mt-3 text-base font-bold text-text">{course.courseName}</h3>
        <p className="mt-1 text-xs text-text/55">
          {course.targetLevel} · {t(`${course.totalLessons} পাঠ`, `${course.totalLessons} lessons`)}
          {enrolled > 0 ? t(` · ${enrolled} জন ভর্তি`, ` · ${enrolled} enrolled`) : ""}
        </p>

        {(() => {
          const latest = course.nextClassTopic || (course.topics && course.topics.length ? course.topics[course.topics.length - 1] : "");
          return latest ? (
            <p className="mt-2 rounded-lg bg-secondary/[0.07] px-3 py-2 text-xs font-medium text-secondary">
              {t("পরবর্তী টপিক:", "Next topic:")}{" "}
              <span className="font-semibold">{latest}</span>
            </p>
          ) : null;
        })()}

        <div className="mt-4 space-y-1.5">
          <div className="flex items-center justify-between text-xs">
            <span className="text-text/55">{t("ক্লাস সম্পন্ন", "Classes completed")}</span>
            <span className="font-semibold tabular-nums text-text">
              {done} / {planned}
            </span>
          </div>
          <ProgressBar value={done} max={planned} label={t("ক্লাস সম্পন্ন", "Classes completed")} />
        </div>

        {regOpen && (
          <Link
            href={`/academy/admission?course=${encodeURIComponent(course.courseId)}`}
            className="mt-4 inline-flex items-center justify-center gap-1.5 rounded-xl bg-secondary px-4 py-2.5 text-sm font-semibold text-white transition-transform hover:-translate-y-0.5"
          >
            {t("এখন ভর্তি করুন", "Apply now")}
            <ArrowUpRight className="h-4 w-4" aria-hidden="true" />
          </Link>
        )}

        <span className="mt-5 inline-flex items-center gap-1 self-start border-t border-text/10 pt-4 text-sm font-semibold text-text underline decoration-text/25 underline-offset-4 transition-colors group-hover:decoration-text">
          {t("সিলেবাস ও ক্লাস লগ", "Curriculum & class logs")}
          <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
        </span>
      </div>
    </Card>
  );
}
