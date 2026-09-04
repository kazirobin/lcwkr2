"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  CalendarDays,
  Clock,
  RefreshCw,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { ICourse, IStudent } from "@/features/academy";
import {
  Breadcrumb,
  ButtonLink,
  Card,
  Eyebrow,
  IconButton,
  LoadingBlock,
  PageHeader,
  ProgressBar,
  SectionHanzi,
  StatusPill,
} from "@/components/ui";

const WHATSAPP_URL = "https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY";

export default function AcademyHubPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        fetch("/api/academy/courses", { cache: "no-store" }),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }),
      ]);
      const coursesData = await coursesRes.json();
      const studentsData = await studentsRes.json();
      if (coursesData.success && Array.isArray(coursesData.courses)) {
        setCourses(coursesData.courses);
      }
      if (studentsData.success && Array.isArray(studentsData.students)) {
        setStudents(studentsData.students);
      }
    } catch (err) {
      console.error("Failed to load academy data:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const openBatch = useMemo(
    () => courses.find((c) => c.status === "Coming Soon"),
    [courses],
  );

  const stats = useMemo(() => {
    const running = courses.filter((c) => c.status === "Running").length;
    const held = courses.reduce(
      (acc, c) => acc + (c.completedClassesCount ?? c.classes?.length ?? 0),
      0,
    );
    return { batches: courses.length, running, held, scholars: students.length };
  }, [courses, students]);

  const nextIntake =
    openBatch?.nextBatchRegistrationDate ||
    courses.find((c) => c.nextBatchRegistrationDate)?.nextBatchRegistrationDate ||
    t("শীঘ্রই ঘোষণা করা হবে", "To be announced");

  const topScholars = useMemo(() => {
    if (!students.length || !courses.length) return [];
    return students
      .map((stu) => {
        const roll = String(stu.rollNumber).trim();
        const enrolled = Array.isArray(stu.enrolledCourseIds) && stu.enrolledCourseIds.length
          ? stu.enrolledCourseIds
          : (stu as { enrolledCourseId?: string }).enrolledCourseId
            ? [(stu as { enrolledCourseId?: string }).enrolledCourseId as string]
            : [];
        let held = 0;
        let attended = 0;
        courses.forEach((crs) => {
          if (enrolled.some((id) => id.toLowerCase() === crs.courseId.toLowerCase())) {
            const sessions = crs.classes ?? [];
            held += sessions.length;
            attended += sessions.filter((cls) =>
              cls.presentStudents?.some((r) => String(r).trim() === roll),
            ).length;
          }
        });
        return {
          roll: stu.rollNumber,
          name: stu.nameEnglish,
          avatarUrl: stu.avatarUrl,
          rate: held > 0 ? Math.round((attended / held) * 100) : 100,
          held,
        };
      })
      .filter((s) => s.held > 0)
      .sort((a, b) => b.rate - a.rate)
      .slice(0, 6);
  }, [students, courses]);

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="院" className="-top-10 right-0" />

      <Breadcrumb items={[{ label: t("হোম", "Home"), href: "/" }, { label: t("একাডেমি", "Academy") }]} />

      <PageHeader
        className="mt-6"
        eyebrow={
          <Eyebrow seal="院" label={t("একাডেমি", "Academy")} detail="Kazi Robin" />
        }
        title={t("ব্যাচ ও ক্লাস রেকর্ড", "Cohorts & class records")}
        lede={t(
          "চলমান ব্যাচ, সিলেবাসের অগ্রগতি ও নিয়মিত শিক্ষার্থীদের এক নজরে দেখুন।",
          "Every running cohort, its syllabus progress, and the scholars keeping pace — at a glance.",
        )}
        actions={
          <>
            {openBatch ? (
              <ButtonLink href="/academy/admission" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
                {t("ভর্তির আবেদন", "Apply for admission")}
              </ButtonLink>
            ) : (
              <a
                href={WHATSAPP_URL}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center gap-2 rounded-xl bg-text px-3.5 py-2 text-[13px] font-semibold text-background transition-transform duration-200 hover:-translate-y-0.5 motion-reduce:transform-none focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
              >
                {t("লাইভ ক্লাসে যোগ দিন", "Join live class")}
                <ArrowRight className="h-4 w-4" />
              </a>
            )}
            <IconButton
              label={t("তথ্য রিফ্রেশ করুন", "Refresh data")}
              size="sm"
              spinning={loading}
              onClick={fetchData}
            >
              <RefreshCw className="h-4 w-4" />
            </IconButton>
          </>
        }
      />

      {/* Stat row */}
      <dl className="mt-10 grid grid-cols-2 divide-text/10 rounded-2xl border border-text/10 bg-card sm:grid-cols-4 sm:divide-x">
        {(
          [
            [t("সক্রিয় ব্যাচ", "Active cohorts"), stats.batches],
            [t("চলমান এখন", "Running now"), stats.running],
            [t("ক্লাস সম্পন্ন", "Classes held"), stats.held],
            [t("মোট শিক্ষার্থী", "Scholars enrolled"), stats.scholars],
          ] as const
        ).map(([label, value]) => (
          <div key={label} className="px-5 py-5">
            <dt className="text-xs font-medium uppercase tracking-wide text-text/50">{label}</dt>
            <dd className="mt-1.5 text-2xl font-bold tabular-nums text-text">
              {loading ? <span className="text-text/30">—</span> : value}
            </dd>
          </div>
        ))}
      </dl>

      {/* Tracks */}
      <section className="mt-16">
        <Eyebrow seal="径" label={t("ম্যান্ডারিন ট্র্যাক", "Mandarin tracks")} />
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl">
          {t("কোর্স ও ব্যাচের অবস্থা", "Courses & cohort status")}
        </h2>

        {loading ? (
          <div className="mt-6">
            <LoadingBlock label={t("কোর্স লোড হচ্ছে", "Loading courses")} rows={2} />
          </div>
        ) : courses.length === 0 ? (
          <Card className="mt-6 p-10 text-center">
            <p className="text-sm font-semibold text-text/70">
              {t("এখনও কোনো কোর্স ট্র্যাক নেই।", "No course tracks yet.")}
            </p>
          </Card>
        ) : (
          <div className="mt-6 grid grid-cols-1 gap-5 md:grid-cols-2">
            {courses.map((course) => {
              const done = course.classes?.length ?? course.completedClassesCount ?? 0;
              const planned = course.totalClassesPlanned || 24;
              const running = course.status === "Running";
              const time = course.classes?.[0]?.time || "9:00 PM – 10:10 PM";
              const enrolled = students.filter((s) => {
                const cid = course.courseId.toLowerCase();
                if (Array.isArray(s.enrolledCourseIds))
                  return s.enrolledCourseIds.some((id) => id.toLowerCase() === cid);
                const legacy = (s as { enrolledCourseId?: string }).enrolledCourseId;
                return legacy ? legacy.toLowerCase() === cid : false;
              }).length;

              return (
                <Card key={course._id ? String(course._id) : course.courseId} className="flex flex-col p-6">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-text/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-text/70">
                        {course.courseId}
                      </span>
                      <span className="text-xs text-text/50">{course.targetLevel}</span>
                    </div>
                    <StatusPill tone={running ? "done" : "pending"}>
                      {running ? t("চলমান", "Running") : t("আসছে", "Coming soon")}
                    </StatusPill>
                  </div>

                  <h3 className="mt-4 text-lg font-bold text-text">{course.courseName}</h3>
                  <p className="mt-1 text-xs text-text/55">
                    {t(
                      `${course.totalLessons} পাঠ · ${enrolled} জন ভর্তি`,
                      `${course.totalLessons} lessons · ${enrolled} enrolled`,
                    )}
                  </p>

                  <dl className="mt-4 grid grid-cols-2 gap-3 rounded-xl border border-text/10 bg-text/3 p-3.5 text-xs">
                    <div className="flex items-start gap-2">
                      <Clock className="mt-0.5 h-4 w-4 shrink-0 text-text/40" aria-hidden="true" />
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-text/40">
                          {t("ক্লাসের সময়", "Class time")}
                        </dt>
                        <dd className="font-semibold text-text">{time}</dd>
                      </div>
                    </div>
                    <div className="flex items-start gap-2">
                      <CalendarDays className="mt-0.5 h-4 w-4 shrink-0 text-text/40" aria-hidden="true" />
                      <div>
                        <dt className="text-[10px] uppercase tracking-wide text-text/40">
                          {t("শুরুর তারিখ", "Start date")}
                        </dt>
                        <dd className="font-semibold text-text">
                          {course.startDate || t("চলমান ব্যাচ", "Active cohort")}
                        </dd>
                      </div>
                    </div>
                  </dl>

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
            })}
          </div>
        )}

        {/* Admission notice */}
        {!loading && (
          <Card className="mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
            <div>
              <p className="text-sm font-bold text-text">
                {openBatch
                  ? t("নতুন ব্যাচের ভর্তি চলছে", "Admission is open for the next cohort")
                  : t("সব ব্যাচে ক্লাস চলছে (ভর্তি বন্ধ)", "All cohorts are currently running (Admission closed)")}
              </p>
              <p className="mt-1 text-sm text-text/60">
                {openBatch
                  ? t(
                      `${openBatch.courseName} — এখনই আসন সংরক্ষণ করুন।`,
                      `${openBatch.courseName} — reserve a seat now.`,
                    )
                  : t(
                      `পরবর্তী ব্যাচে ভর্তি শুরু হবে: ${nextIntake}`,
                      `Next batch admission starts: ${nextIntake}`,
                    )}
              </p>
            </div>
            
            {openBatch ? (
              <ButtonLink href="/academy/admission" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
                {t("আবেদন করুন", "Apply now")}
              </ButtonLink>
            ) : (
              <div className="inline-flex items-center gap-2 rounded-xl border border-text/15 bg-text/5 px-4 py-2 text-xs font-semibold text-text/70">
                <span>{t("আগামী ভর্তি:", "Next Intake:")}</span>
                <span className="font-mono text-primary font-bold">{nextIntake}</span>
              </div>
            )}
          </Card>
        )}
      </section>

      {/* Regular scholars */}
      {!loading && topScholars.length > 0 && (
        <section className="mt-16">
          <div className="flex flex-wrap items-end justify-between gap-3">
            <div>
              <Eyebrow seal="勤" label={t("নিয়মিত শিক্ষার্থী", "Regular scholars")} />
              <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl">
                {t("সবচেয়ে নিয়মিত যাঁরা", "Keeping pace, class after class")}
              </h2>
            </div>
            <Link
              href="/academy/students"
              className="inline-flex items-center gap-1.5 text-sm font-medium text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
            >
              {t("সব শিক্ষার্থী দেখুন", "All scholars")}
              <ArrowRight className="h-4 w-4" aria-hidden="true" />
            </Link>
          </div>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
            {topScholars.map((s) => (
              <li key={String(s.roll)}>
                <Card className="flex h-full flex-col items-center gap-2 p-3.5 text-center">
                  <span className="h-12 w-12 overflow-hidden rounded-xl border border-text/10 bg-text/5">
                    <Image
                      src={
                        s.avatarUrl ||
                        `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(s.name || "student")}`
                      }
                      alt=""
                      width={48}
                      height={48}
                      className="h-full w-full object-cover"
                      unoptimized
                    />
                  </span>
                  <span className="min-w-0">
                    <span className="block truncate text-xs font-bold text-text">{s.name}</span>
                    <span className="block text-[10px] tabular-nums text-text/45">#{s.roll}</span>
                  </span>
                  <span className="mt-auto inline-flex items-center gap-1 border-t border-text/10 pt-1.5 text-[11px] font-semibold tabular-nums text-ok">
                    {s.rate}% {t("উপস্থিতি", "present")}
                  </span>
                </Card>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* New here → intro */}
      <Link
        href="/intro"
        className="group mt-16 flex items-center justify-between gap-4 rounded-2xl border border-text/10 bg-card px-6 py-5 transition-colors hover:border-text/25 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
      >
        <span>
          <span className="block text-sm font-bold text-text">
            {t("নতুন এসেছেন?", "New here?")}
          </span>
          <span className="mt-0.5 block text-sm text-text/60">
            {t("ক্লাস কীভাবে চলে, ধাপে ধাপে দেখুন।", "See how the class works, step by step.")}
          </span>
        </span>
        <ArrowRight className="h-5 w-5 shrink-0 text-text/40 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
      </Link>
    </div>
  );
}