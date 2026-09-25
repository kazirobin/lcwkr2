"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { ArrowLeft, MapPin, RefreshCw } from "lucide-react";
import { IStudent, ICourse } from "@/features/academy";
import { useLanguage } from "@/i18n";
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
  StatusMark,
  StatusPill,
} from "@/components/ui";

export default function StudentProfilePage() {
  const params = useParams();
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const raw = params?.roll
    ? Array.isArray(params.roll)
      ? params.roll[0]
      : params.roll
    : "";
  const roll = decodeURIComponent(String(raw)).trim();

  const [student, setStudent] = useState<IStudent | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [dialogueMarks, setDialogueMarks] = useState<
    {
      _id: string;
      mark: number;
      level: number;
      lesson: number;
      source: string;
      feedback: string;
      createdAt: string;
    }[]
  >([]);
  const [examRows, setExamRows] = useState<
    { level: number; lesson: number; best: number; latest: number; attempts: number; totalMarks: number }[]
  >([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (s.success && Array.isArray(s.students)) {
        const found = (s.students.find((x: IStudent) => String(x.rollNumber).trim() === roll) ?? null) as IStudent | null;
        setStudent(found);
        if (found?.whatsapp) {
          const phoneParam = encodeURIComponent(found.whatsapp);
          fetch(`/api/hw/marks?phone=${phoneParam}`, { cache: "no-store" })
            .then((r) => r.json())
            .then((d) => {
              if (d.success && Array.isArray(d.marks)) setDialogueMarks(d.marks);
            })
            .catch(() => {
              /* offline — ignore */
            });
          fetch(`/api/hw/exam-results?phone=${phoneParam}`, { cache: "no-store" })
            .then((r) => r.json())
            .then((d) => {
              if (d.success && Array.isArray(d.results)) setExamRows(d.results);
            })
            .catch(() => {
              /* offline — ignore */
            });
        } else {
          setDialogueMarks([]);
          setExamRows([]);
        }
      }
      if (c.success && Array.isArray(c.courses)) setCourses(c.courses);
    } catch (err) {
      console.error("Failed to load profile:", err);
    } finally {
      setLoading(false);
    }
  }, [roll]);

  useEffect(() => {
    queueMicrotask(() => {
      if (roll) void fetchData();
    });
  }, [roll, fetchData]);

  const enrolledIds = useMemo(() => {
    if (!student) return [];
    if (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.length)
      return student.enrolledCourseIds.map((id) => String(id).trim());
    const legacy = (student as { enrolledCourseId?: string }).enrolledCourseId;
    return legacy ? [String(legacy).trim()] : [];
  }, [student]);

  const tracks = useMemo(() => {
    if (!student) return [];
    const target = String(student.rollNumber).trim();
    return courses
      .filter((c) => enrolledIds.some((id) => id.toLowerCase() === c.courseId.toLowerCase()))
      .map((c) => {
        const sessions = (c.classes ?? []).map((cls) => ({
          date: cls.date,
          summary: cls.contentCovered?.topic ?? cls.contentCovered?.summary ?? "",
          present: (cls.presentStudents ?? []).some((r) => String(r).trim() === target),
        }));
        const attended = sessions.filter((s) => s.present).length;
        return { course: c, sessions, attended, held: sessions.length };
      });
  }, [student, courses, enrolledIds]);

  const overall = useMemo(() => {
    const held = tracks.reduce((a, x) => a + x.held, 0);
    const attended = tracks.reduce((a, x) => a + x.attended, 0);
    return { held, attended, rate: held > 0 ? Math.round((attended / held) * 100) : null };
  }, [tracks]);

  return (
    <div className="relative isolate mx-auto max-w-4xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="生" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("শিক্ষার্থী", "Scholars"), href: "/academy/students" },
          { label: loading || !student ? `#${roll}` : student.nameEnglish },
        ]}
      />

      {loading ? (
        <div className="mt-10">
          <LoadingBlock label={t("প্রোফাইল লোড হচ্ছে", "Loading profile")} rows={2} />
        </div>
      ) : !student ? (
        <div className="mt-10">
          <PageHeader
            title={t(`রোল #${roll} পাওয়া যায়নি`, `Roll #${roll} not found`)}
            lede={t("এই রোল নম্বরে কোনো অনুমোদিত শিক্ষার্থী নেই।", "No approved scholar has this roll number.")}
          />
          <ButtonLink href="/academy/students" variant="secondary" size="sm" className="mt-6" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            {t("তালিকায় ফিরুন", "Back to scholars")}
          </ButtonLink>
        </div>
      ) : (
        <>
          <div className="mt-6 flex items-start justify-between gap-4">
            <Eyebrow seal="生" label={t("শিক্ষার্থী প্রোফাইল", "Scholar profile")} detail={`#${student.rollNumber}`} />
            <IconButton
              label={t("রিফ্রেশ করুন", "Refresh")}
              size="sm"
              spinning={loading}
              onClick={fetchData}
            >
              <RefreshCw className="h-4 w-4" />
            </IconButton>
          </div>

          <Card className="mt-4 flex flex-col items-center gap-6 p-6 sm:flex-row sm:items-start sm:p-7">
            <span className="h-24 w-24 shrink-0 overflow-hidden rounded-2xl border border-text/10 bg-text/5 sm:h-28 sm:w-28">
              <Image
                src={
                  student.avatarUrl ||
                  `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(student.nameEnglish || "student")}`
                }
                alt=""
                width={112}
                height={112}
                className="h-full w-full object-cover"
                unoptimized
              />
            </span>

            <div className="flex-1 text-center sm:text-left">
              <h1 className="flex flex-wrap items-center justify-center gap-2 text-2xl font-bold tracking-tight text-text sm:justify-start sm:text-3xl">
                <span>{student.nameEnglish}</span>
                {student.isPro && (
                  <span className="inline-flex items-center rounded-full bg-amber-400/15 px-2.5 py-1 text-xs font-bold text-amber-500">
                    ⭐ {t("Pro সদস্য", "Pro member")}
                  </span>
                )}
              </h1>
              <p className="mt-1.5 flex items-center justify-center gap-1.5 text-sm text-text/55 sm:justify-start">
                <MapPin className="h-4 w-4 shrink-0 text-text/35" aria-hidden="true" />
                {student.location || t("অবস্থান নেই", "Location not set")}
              </p>
              <div className="mt-3 flex flex-wrap items-center justify-center gap-2 sm:justify-start">
                <StatusPill tone={student.isWhatsAppGroupJoined ? "done" : "pending"}>
                  {student.isWhatsAppGroupJoined
                    ? t("গ্রুপে যুক্ত", "In the class group")
                    : t("গ্রুপে নেই", "Not in the group")}
                </StatusPill>
                {overall.rate !== null && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-text/10 bg-text/5 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-text">
                    {t("সার্বিক উপস্থিতি", "Overall attendance")} {overall.rate}%
                  </span>
                )}
              </div>
            </div>
          </Card>

          <HwTotalsStrip
            t={t}
            examRows={examRows}
            dialogueMarks={dialogueMarks}
          />

          <section className="mt-10">
            <Eyebrow seal="录" label={t("উপস্থিতির রেকর্ড", "Attendance record")} />
            {tracks.length === 0 ? (
              <Card className="mt-4 p-6 text-sm text-text/60">
                {t("এই শিক্ষার্থী এখনও কোনো ট্র্যাকে যুক্ত নন।", "This scholar isn't in any track yet.")}
              </Card>
            ) : (
              <div className="mt-4 space-y-6">
                {tracks.map(({ course, sessions, attended, held }) => (
                  <Card key={course.courseId} className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-text/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-text/70">
                          {course.courseId}
                        </span>
                        <h2 className="text-sm font-bold text-text">{course.courseName}</h2>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-text">
                        {attended} / {held} {t("ক্লাস", "classes")}
                      </span>
                    </div>

                    <div className="mt-3">
                      <ProgressBar
                        value={attended}
                        max={held || 1}
                        label={t("উপস্থিতি", "Attendance")}
                      />
                    </div>

                    {sessions.length > 0 && (
                      <ul className="mt-4 divide-y divide-text/10 border-t border-text/10">
                        {sessions.map((s, i) => (
                          <li key={i} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                            <span className="min-w-0">
                              <span className="block tabular-nums text-text/50">{s.date}</span>
                              {s.summary && (
                                <span className="block truncate text-xs text-text/45">{s.summary}</span>
                              )}
                            </span>
                            <StatusMark tone={s.present ? "done" : "closed"}>
                              {s.present ? t("উপস্থিত", "Present") : t("অনুপস্থিত", "Absent")}
                            </StatusMark>
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                ))}
              </div>
            )}
          </section>

          <section className="mt-10">
            <Eyebrow seal="話" label={t("সংলাপ মার্ক", "Dialogue marks")} />
            {dialogueMarks.length === 0 ? (
              <Card className="mt-4 p-6 text-sm text-text/60">
                {t("এখনো কোনো সংলাপ mark নেই।", "No dialogue marks yet.")}
              </Card>
            ) : (
              <Card className="mt-4 p-6">
                <ul className="divide-y divide-text/10">
                  {dialogueMarks.map((m) => (
                    <li key={m._id} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                      <span className="min-w-0">
                        <span className="block font-semibold text-text">
                          HSK {m.level} ·{" "}
                          {m.lesson === 0 ? t("সামগ্রিক", "Overall") : `${t("লেসন", "Lesson")} ${m.lesson}`}
                        </span>
                        <span className="block truncate text-xs text-text/45">
                          {m.source === "manual" ? t("ম্যানুয়াল", "Manual") : t("রেকর্ডিং", "Recording")}
                          {m.feedback ? ` · ${m.feedback}` : ""} ·{" "}
                          {m.createdAt ? new Date(m.createdAt).toLocaleDateString() : ""}
                        </span>
                      </span>
                      <StatusMark tone="done">
                        <span className="tabular-nums">{m.mark}/10</span>
                      </StatusMark>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </section>

          <section className="mt-10">
            <Eyebrow seal="試" label={t("পরীক্ষার ফল", "Exam results")} />
            {examRows.length === 0 ? (
              <Card className="mt-4 p-6 text-sm text-text/60">
                {t("এখনো কোনো পরীক্ষা দেয়নি।", "No exams taken yet.")}
              </Card>
            ) : (
              <Card className="mt-4 p-6">
                <ul className="divide-y divide-text/10">
                  {examRows.map((r) => (
                    <li
                      key={`${r.level}-${r.lesson}`}
                      className="flex items-center justify-between gap-3 py-2.5 text-sm"
                    >
                      <span className="font-semibold text-text">
                        HSK {r.level} · {t("লেসন", "Lesson")} {r.lesson}
                        <span className="ml-2 text-[11px] font-normal text-text/45">
                          ×{r.attempts}
                        </span>
                      </span>
                      <StatusMark tone="done">
                        <span className="tabular-nums">
                          {t("সেরা", "Best")} {r.best}/{r.totalMarks}
                        </span>
                      </StatusMark>
                    </li>
                  ))}
                </ul>
              </Card>
            )}
          </section>

          <ButtonLink
            href="/academy/students"
            variant="secondary"
            size="sm"
            className="mt-10"
            iconLeft={<ArrowLeft className="h-4 w-4" />}
          >
            {t("সব শিক্ষার্থী", "All scholars")}
          </ButtonLink>
        </>
      )}
    </div>
  );
}

function HwTotalsStrip({
  t,
  examRows,
  dialogueMarks,
}: {
  t: (bn: string, en: string) => string;
  examRows: { best: number; totalMarks: number }[];
  dialogueMarks: { mark: number; level: number; lesson: number; createdAt: string }[];
}) {
  const examBest = examRows.reduce((n, r) => n + r.best, 0);
  const examMax = examRows.reduce((n, r) => n + r.totalMarks, 0);
  const latestByLesson = new Map<string, number>();
  // History arrives newest-first — first hit per lesson wins.
  for (const m of dialogueMarks) {
    const key = `${m.level}-${m.lesson}`;
    if (!latestByLesson.has(key)) latestByLesson.set(key, m.mark);
  }
  const dialogueTotal = [...latestByLesson.values()].reduce((n, v) => n + v, 0);
  const cells = [
    { value: `${examBest}/${examMax}`, label: t("পরীক্ষা", "Exams") },
    { value: String(dialogueTotal), label: t("সংলাপ", "Dialogue") },
    { value: String(examBest + dialogueTotal), label: t("মোট", "Total"), hot: true },
  ];
  return (
    <div className="mt-6 grid grid-cols-3 gap-2">
      {cells.map((c) => (
        <div
          key={c.label}
          className={`rounded-2xl border px-3 py-3 text-center ${
            c.hot ? "border-primary/25 bg-primary/5" : "border-text/10 bg-card"
          }`}
        >
          <p
            className={`font-mono text-xl font-bold tabular-nums ${
              c.hot ? "text-primary" : "text-text"
            }`}
          >
            {c.value}
          </p>
          <p className="mt-0.5 text-[11px] text-text/50">{c.label}</p>
        </div>
      ))}
    </div>
  );
}
