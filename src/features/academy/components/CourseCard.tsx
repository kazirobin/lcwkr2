"use client";

import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ICourse } from "@/features/academy/types";
import { useLanguage } from "@/i18n";
import { Card, ProgressBar, StatusPill } from "@/components/ui";

export default function CourseCard({ course }: { course: ICourse }) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const done = course.completedClassesCount ?? course.classes?.length ?? 0;
  const planned = course.totalClassesPlanned || 24;
  const enrolled = course.enrolledStudentRolls?.length ?? 0;
  const running = course.status === "Running";

  return (
    <Card interactive className="flex flex-col p-5">
      <div className="flex items-start justify-between gap-2">
        <span className="rounded-md border border-text/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-text/70">
          {course.courseId}
        </span>
        <StatusPill tone={running ? "done" : "pending"}>
          {running ? t("চলমান", "Running") : t("আসছে", "Coming soon")}
        </StatusPill>
      </div>

      <h3 className="mt-3 text-base font-bold text-text">{course.courseName}</h3>
      <p className="mt-1 text-xs text-text/55">
        {course.targetLevel} · {t(`${course.totalLessons} পাঠ`, `${course.totalLessons} lessons`)}
        {enrolled > 0 ? t(` · ${enrolled} জন ভর্তি`, ` · ${enrolled} enrolled`) : ""}
      </p>

      <div className="mt-4 space-y-1.5">
        <div className="flex items-center justify-between text-xs">
          <span className="text-text/55">{t("ক্লাস সম্পন্ন", "Classes completed")}</span>
          <span className="font-semibold tabular-nums text-text">
            {done} / {planned}
          </span>
        </div>
        <ProgressBar value={done} max={planned} label={t("ক্লাস সম্পন্ন", "Classes completed")} />
      </div>

      <Link
        href={`/academy/courses/${course.courseId}`}
        className="mt-5 inline-flex items-center gap-1 self-start border-t border-text/10 pt-4 text-sm font-semibold text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
      >
        {t("সিলেবাস ও ক্লাস লগ", "Curriculum & class logs")}
        <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
      </Link>
    </Card>
  );
}
