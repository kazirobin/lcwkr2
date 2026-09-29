"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import {
  ArrowLeft,
  Camera,
  CheckCircle2,
  Clock,
  HardDrive,
  MapPin,
  Mic,
  RefreshCw,
  XCircle,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { formatBytes, formatDuration } from "@/lib/format";
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

type Session = { key: string; date: string; title: string; live: boolean; present: boolean };
type CourseAttendance = {
  courseId: string;
  courseName: string;
  held: number;
  attended: number;
  rate: number | null;
  sessions: Session[];
};
type Attendance = {
  held: number;
  attended: number;
  rate: number | null;
  byCourse: CourseAttendance[];
  recent: Session[];
};
type LevelProgress = {
  level: number;
  totalMarks: number;
  obtained: number;
  percent: number | null;
  examsGiven: number;
  examsTotal: number;
  examsLeft: number;
  perLesson: Array<{ lesson: number; best: number; attempts: number; outOf: number }>;
};
type Storage = {
  imageCount: number;
  imageBytes: number;
  audioCount: number;
  audioBytes: number;
  audioSeconds: number;
  totalBytes: number;
  unsizedCount: number;
};
type Profile = {
  rollNumber: number;
  nameEnglish: string;
  location?: string;
  avatarUrl?: string;
  isPro?: boolean;
  isWhatsAppGroupJoined?: boolean;
};

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

  const [student, setStudent] = useState<Profile | null>(null);
  const [attendance, setAttendance] = useState<Attendance | null>(null);
  const [levels, setLevels] = useState<LevelProgress[]>([]);
  const [storage, setStorage] = useState<Storage | null>(null);
  const [dialogue, setDialogue] = useState<{ count: number; marked: number; average: number | null; best: number | null }>({ count: 0, marked: 0, average: null, best: null });
  const [handwriting, setHandwriting] = useState<{ count: number; photos: number; marked: number; average: number | null }>({ count: 0, photos: 0, marked: 0, average: null });
  const [loading, setLoading] = useState(true);
  const [missing, setMissing] = useState(false);

  // One roll-keyed request. The page used to read the whole roster to find one
  // person and then ask two more endpoints for that person's marks by phone,
  // which meant a public URL was effectively a phone-number lookup.
  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch(`/api/academy/students/${encodeURIComponent(roll)}/profile`, {
        cache: "no-store",
      });
      const data = await res.json();
      if (!data.success) {
        setMissing(true);
        setStudent(null);
        return;
      }
      setMissing(false);
      setStudent(data.student);
      setAttendance(data.attendance);
      setLevels(data.progress?.levels ?? []);
      setStorage(data.progress?.storage ?? null);
      if (data.progress?.dialogue) setDialogue(data.progress.dialogue);
      if (data.progress?.handwriting) setHandwriting(data.progress.handwriting);
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

  const totalObtained = levels.reduce((n, l) => n + l.obtained, 0);
  const totalMarks = levels.reduce((n, l) => n + l.totalMarks, 0);
  const totalExamsLeft = levels.reduce((n, l) => n + l.examsLeft, 0);
  const totalExamsGiven = levels.reduce((n, l) => n + l.examsGiven, 0);

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
      ) : !student || missing ? (
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
                {attendance?.rate != null && (
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-text/10 bg-text/5 px-2.5 py-1 text-[11px] font-semibold tabular-nums text-text">
                    {t("সার্বিক উপস্থিতি", "Overall attendance")} {attendance.rate}%
                  </span>
                )}
              </div>
            </div>
          </Card>

          {/* Headline numbers: marks earned, exams left, storage used. */}
          <div className="mt-6 grid grid-cols-2 gap-2 sm:grid-cols-4">
            {[
              {
                value: totalMarks > 0 ? `${totalObtained}/${totalMarks}` : "—",
                label: t("হোমওয়ার্ক নম্বর", "Homework marks"),
                hot: true,
              },
              {
                value: String(totalExamsLeft),
                label: t("বাকি পরীক্ষা", "Exams left"),
              },
              {
                value: String(totalExamsGiven),
                label: t("দেওয়া পরীক্ষা", "Exams taken"),
              },
              {
                value: formatBytes(storage?.totalBytes ?? 0),
                label: t("মোট স্টোরেজ", "Total storage"),
              },
            ].map((c) => (
              <div
                key={c.label}
                className={`rounded-2xl border px-3 py-3 text-center ${
                  c.hot ? "border-primary/25 bg-primary/5" : "border-text/10 bg-card"
                }`}
              >
                <p
                  className={`font-mono text-lg font-bold tabular-nums ${
                    c.hot ? "text-primary" : "text-text"
                  }`}
                >
                  {c.value}
                </p>
                <p className="mt-0.5 text-[11px] text-text/50">{c.label}</p>
              </div>
            ))}
          </div>

          {/* Where the marks are, level by level. */}
          <section className="mt-10">
            <Eyebrow seal="試" label={t("পরীক্ষার অগ্রগতি", "Exam progress")} />
            <div className="mt-4 space-y-3">
              {levels.map((l) => (
                <Card key={l.level} className="p-5">
                  <div className="flex flex-wrap items-baseline justify-between gap-2">
                    <h2 className="text-sm font-bold text-text">
                      HSK {l.level}
                      <span className="ml-2 text-[11px] font-normal text-text/45">
                        {t("লেসন", "Lesson")} 1–{l.examsTotal}
                      </span>
                    </h2>
                    <p className="font-mono text-sm font-bold tabular-nums text-text">
                      {l.obtained}
                      <span className="text-text/40"> / {l.totalMarks}</span>
                    </p>
                  </div>

                  <div className="mt-3">
                    <ProgressBar
                      value={l.obtained}
                      max={l.totalMarks || 1}
                      label={t("নম্বর", "Marks")}
                    />
                  </div>

                  <dl className="mt-3 flex flex-wrap gap-x-5 gap-y-1 text-[11px] text-text/55">
                    <div className="flex gap-1.5">
                      <dt>{t("দিয়েছেন", "Taken")}</dt>
                      <dd className="font-semibold tabular-nums text-text">
                        {l.examsGiven}/{l.examsTotal}
                      </dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt>{t("বাকি", "Left")}</dt>
                      <dd className="font-semibold tabular-nums text-text">{l.examsLeft}</dd>
                    </div>
                    <div className="flex gap-1.5">
                      <dt>{t("হিসাব", "Score")}</dt>
                      <dd className="font-semibold tabular-nums text-text">
                        {l.percent === null ? "—" : `${l.percent}%`}
                      </dd>
                    </div>
                  </dl>

                  {l.examsGiven > 0 && (
                    <ul className="mt-3 flex flex-wrap gap-1.5 border-t border-text/10 pt-3">
                      {l.perLesson
                        .filter((p) => p.attempts > 0)
                        .map((p) => (
                          <li
                            key={p.lesson}
                            className="rounded-lg border border-text/10 bg-text/3 px-2 py-1 text-[10px] tabular-nums text-text/60"
                          >
                            L{p.lesson}:{" "}
                            <span className="font-bold text-text">
                              {p.best}/{p.outOf}
                            </span>
                            {p.attempts > 1 && (
                              <span className="ml-1 text-text/40">×{p.attempts}</span>
                            )}
                          </li>
                        ))}
                    </ul>
                  )}
                </Card>
              ))}
            </div>
          </section>

          {/* How much the student has uploaded, split by kind. */}
          <section className="mt-10">
            <Eyebrow seal="像" label={t("আপলোড ও স্টোরেজ", "Uploads and storage")} />
            <Card className="mt-4 p-6">
              <div className="flex flex-wrap items-baseline justify-between gap-2">
                <p className="flex items-center gap-2 text-sm font-bold text-text">
                  <HardDrive className="h-4 w-4 text-text/40" aria-hidden="true" />
                  {t("মোট ব্যবহৃত", "Total used")}
                </p>
                <p className="font-mono text-sm font-bold tabular-nums text-text">
                  {formatBytes(storage?.totalBytes ?? 0)}
                </p>
              </div>

              <dl className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-2xl border border-text/10 bg-text/3 px-4 py-3.5">
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-text/45">
                    <Camera className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("ছবি", "Photos")}
                  </dt>
                  <dd className="mt-1.5 font-mono text-lg font-bold tabular-nums text-text">
                    {formatBytes(storage?.imageBytes ?? 0)}
                  </dd>
                  <dd className="mt-0.5 text-[11px] tabular-nums text-text/50">
                    {t(
                      `${storage?.imageCount ?? 0} টি ছবি · ${handwriting.count} টি সাবমিশন`,
                      `${storage?.imageCount ?? 0} photos · ${handwriting.count} submissions`,
                    )}
                  </dd>
                </div>

                <div className="rounded-2xl border border-text/10 bg-text/3 px-4 py-3.5">
                  <dt className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-[0.1em] text-text/45">
                    <Mic className="h-3.5 w-3.5" aria-hidden="true" />
                    {t("অডিও", "Audio")}
                  </dt>
                  <dd className="mt-1.5 font-mono text-lg font-bold tabular-nums text-text">
                    {formatBytes(storage?.audioBytes ?? 0)}
                  </dd>
                  <dd className="mt-0.5 flex items-center gap-1.5 text-[11px] tabular-nums text-text/50">
                    <Clock className="h-3 w-3" aria-hidden="true" />
                    {t(
                      `${storage?.audioCount ?? 0} টি রেকর্ডিং · ${formatDuration(storage?.audioSeconds ?? 0)}`,
                      `${storage?.audioCount ?? 0} recordings · ${formatDuration(storage?.audioSeconds ?? 0)}`,
                    )}
                  </dd>
                </div>
              </dl>

              {storage && storage.unsizedCount > 0 && (
                <p className="mt-3 text-[11px] text-text/45">
                  {t(
                    `${storage.unsizedCount} টি পুরোনো ফাইলের আকার লেখা ছিল না, তাই শুধু নতুন আপলোডের হিসাব দেখানো হলো।`,
                    `${storage.unsizedCount} older uploads have no recorded size, so only newer ones are counted.`,
                  )}
                </p>
              )}

              {(dialogue.marked > 0 || handwriting.marked > 0) && (
                <p className="mt-3 border-t border-text/10 pt-3 text-[11px] tabular-nums text-text/55">
                  {t("গড় মার্ক", "Average mark")}:{" "}
                  <span className="font-semibold text-text">
                    {t("সংলাপ", "Dialogue")} {dialogue.average ?? "—"}
                  </span>
                  {" · "}
                  <span className="font-semibold text-text">
                    {t("হাতের লেখা", "Handwriting")} {handwriting.average ?? "—"}
                  </span>
                </p>
              )}
            </Card>
          </section>

          {/* Attendance history, per course. */}
          <section className="mt-10">
            <Eyebrow seal="录" label={t("উপস্থিতির রেকর্ড", "Attendance record")} />
            {!attendance || attendance.byCourse.length === 0 ? (
              <Card className="mt-4 p-6 text-sm text-text/60">
                {t("এই শিক্ষার্থী এখনও কোনো কোর্সে যুক্ত নন।", "This scholar isn't in any course yet.")}
              </Card>
            ) : (
              <div className="mt-4 space-y-6">
                {attendance.byCourse.map((c) => (
                  <Card key={c.courseId} className="p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex items-center gap-2">
                        <span className="rounded-md border border-text/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-text/70">
                          {c.courseId}
                        </span>
                        <h2 className="text-sm font-bold text-text">{c.courseName}</h2>
                      </div>
                      <span className="text-xs font-semibold tabular-nums text-text">
                        {c.attended} / {c.held} {t("ক্লাস", "classes")}
                        {c.rate !== null && <span className="ml-2 text-text/45">{c.rate}%</span>}
                      </span>
                    </div>

                    <div className="mt-3">
                      <ProgressBar
                        value={c.attended}
                        max={c.held || 1}
                        label={t("উপস্থিতি", "Attendance")}
                      />
                    </div>

                    {c.sessions.length > 0 && (
                      <ul className="mt-4 divide-y divide-text/10 border-t border-text/10">
                        {c.sessions.map((s) => (
                          <li key={s.key} className="flex items-center justify-between gap-3 py-2.5 text-sm">
                            <span className="min-w-0">
                              <span className="block tabular-nums text-text/50">{s.date}</span>
                              {s.title && (
                                <span className="block truncate text-xs text-text/45">
                                  {s.title}
                                  {s.live && (
                                    <span className="ml-1.5 font-semibold text-danger">
                                      {t("লাইভ", "live")}
                                    </span>
                                  )}
                                </span>
                              )}
                            </span>
                            {s.present ? (
                              <StatusMark tone="done">
                                <CheckCircle2 className="size-3" />
                                {t("উপস্থিত", "Present")}
                              </StatusMark>
                            ) : (
                              <StatusMark tone="closed">
                                <XCircle className="size-3" />
                                {t("অনুপস্থিত", "Absent")}
                              </StatusMark>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </Card>
                ))}
              </div>
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
