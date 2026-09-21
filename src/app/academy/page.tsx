"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import {
  ArrowRight,
  ArrowUpRight,
  BarChart3,
  CalendarDays,
  Check,
  ClipboardCheck,
  Clock,
  GraduationCap,
  Layers,
  Lock,
  MapPin,
  Phone,
  PlayCircle,
  RefreshCw,
  Rocket,
  Sparkles,
  Trophy,
  Users,
  Video,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { FacebookIcon } from "@/components/icons/FacebookIcon";
import { ICourse, IStudent } from "@/features/academy";
import {
  Breadcrumb,
  Button,
  ButtonLink,
  Card,
  Dialog,
  Eyebrow,
  Field,
  IconButton,
  LoadingBlock,
  PageHeader,
  ProgressBar,
  SectionHanzi,
  StatusPill,
} from "@/components/ui";

const WHATSAPP_URL = "https://chat.whatsapp.com/EBP79wEaAfAEvMtMee6HTY";
const FACEBOOK_GROUP_URL = "https://www.facebook.com/groups/lcwkr/";

export default function AcademyHubPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  /** normalize a meet link to a clickable URL (adds https:// when missing). */
  const meetHref = (raw: string | null | undefined) => {
    const v = (raw ?? "").trim();
    if (!v) return v;
    return /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
  };

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
    queueMicrotask(() => fetchData());
  }, [fetchData]);

  // ── Hanzi Pro challenge live stats ───────────────────────────────────
  const [hpStats, setHpStats] = useState({ enrolled: 0, learned: 0 });
  useEffect(() => {
    queueMicrotask(() => {
      fetch("/api/hanzi-pro", { cache: "no-store" })
        .then((r) => r.json())
        .then((d) => {
          if (d.success && Array.isArray(d.students)) {
            const active = d.students.filter((s: { status: string }) => s.status === "Active");
            setHpStats({
              enrolled: active.length,
              learned: active.reduce((n: number, s: { learnedCount: number }) => n + (Number(s.learnedCount) || 0), 0),
            });
          }
        })
        .catch(() => {
          /* keep defaults */
        });
    });
  }, []);

  // ── live class sessions ──────────────────────────────────────────────
  type LiveSession = {
    _id: string;
    courseId: string;
    meetLink: string;
    date: string;
    time?: string;
    open: boolean;
    attendance: { rollNumber: number; name: string }[];
  };
  const [liveSessions, setLiveSessions] = useState<LiveSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<string>("");
  const [attendBusy, setAttendBusy] = useState<string | null>(null);
  const [attendMsg, setAttendMsg] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [endPass, setEndPass] = useState<Record<string, string>>({});
  const [endBusy, setEndBusy] = useState<string | null>(null);
  const [endMsg, setEndMsg] = useState<Record<string, { ok: boolean; text: string }>>({});
  const [showMeet, setShowMeet] = useState<Record<string, boolean>>({});
  const [lessonForm, setLessonForm] = useState({ topic: "" });
  // time auto-fills from the session (set at "Class on"); user can override
  const [timeOverride, setTimeOverride] = useState<Record<string, string>>({});

  const fetchLive = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/live", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setLiveSessions(data.sessions || []);
    } catch {
      /* ignore */
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchLive());
  }, [fetchLive]);

  // ── upcoming HSK-1 batch enrollment ───────────────────────────────────
  const BATCH_COURSE_ID = "HSK-101";
  const BATCH_CAPACITY = 20;
  const BATCH_FEE = "১,০০০";
  const enrollmentAdminWhatsApp = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP?.replace(/[^0-9]/g, "") || "8801787881334";

  const [enrollCount, setEnrollCount] = useState<{ enrolled: number; remaining: number }>({
    enrolled: 0,
    remaining: BATCH_CAPACITY,
  });
  const [enrollForm, setEnrollForm] = useState({ name: "", whatsapp: "", trxId: "", location: "" });
  const [enrollErrors, setEnrollErrors] = useState<Record<string, string>>({});
  const [enrollBusy, setEnrollBusy] = useState(false);
  const [enrollMsg, setEnrollMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [enrollSubmitted, setEnrollSubmitted] = useState(false);
  // HSK-1 registration popup — "same as other course registration"
  const [enrollOpen, setEnrollOpen] = useState(false);

  const fetchEnrollCount = useCallback(async () => {
    try {
      const res = await fetch(`/api/enrollments?courseId=${encodeURIComponent(BATCH_COURSE_ID)}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setEnrollCount({ enrolled: Number(data.enrolled) || 0, remaining: Number(data.remaining) ?? BATCH_CAPACITY });
      }
    } catch {
      /* keep defaults */
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => fetchEnrollCount());
  }, [fetchEnrollCount]);

  const setEnroll = (key: keyof typeof enrollForm, value: string) => {
    setEnrollForm((f) => ({ ...f, [key]: value }));
    setEnrollErrors((e) => {
      if (!e[key]) return e;
      const next = { ...e };
      delete next[key];
      return next;
    });
  };

  const submitEnrollment = async () => {
    const errs: Record<string, string> = {};
    if (enrollForm.name.trim().length < 2)
      errs.name = t("অন্তত ২ অক্ষরের নাম দিন।", "Enter your name (min 2 chars).");
    if (!/^[0-9+\- ]{9,}$/.test(enrollForm.whatsapp.trim()))
      errs.whatsapp = t("সঠিক WhatsApp নম্বর দিন।", "Enter a valid WhatsApp number.");
    if (enrollForm.trxId.trim().length < 4)
      errs.trxId = t("bKash TrxID দিন।", "Enter the bKash TrxID.");
    if (enrollForm.location.trim().length < 2)
      errs.location = t("আপনার এলাকা লিখুন।", "Enter your location.");
    setEnrollErrors(errs);
    if (Object.keys(errs).length > 0) return;

    setEnrollBusy(true);
    setEnrollMsg(null);
    try {
      const res = await fetch("/api/enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: BATCH_COURSE_ID,
          name: enrollForm.name.trim(),
          whatsapp: enrollForm.whatsapp.trim(),
          trxId: enrollForm.trxId.trim(),
          location: enrollForm.location.trim(),
        }),
      });
      const data = await res.json();
      if (!data.success) {
        setEnrollMsg({ ok: false, text: data.message || data.error || t("রেজিস্ট্রেশন ব্যর্থ হয়েছে।", "Registration failed.") });
        return;
      }
      setEnrollCount({
        enrolled: Number(data.enrolled) || 0,
        remaining: Number(data.remaining) ?? BATCH_CAPACITY - (Number(data.enrolled) || 0),
      });
      setEnrollSubmitted(true);
      setEnrollOpen(false);
      // forward the details to the academy WhatsApp
      const waText = [
        "🎉 *HSK-1 Batch — New Enrollment!*",
        "",
        `👤 *Name:* ${enrollForm.name.trim()}`,
        `📱 *WhatsApp:* ${enrollForm.whatsapp.trim()}`,
        `📍 *Location:* ${enrollForm.location.trim()}`,
        `🧾 *TrxID:* ${enrollForm.trxId.trim()}`,
        `💰 *Fee:* ${BATCH_FEE} টাকা`,
        `🪑 *Seats left:* ${Number(data.remaining) ?? 0}`,
      ].join("\n");
      window.open(`https://wa.me/${enrollmentAdminWhatsApp}?text=${encodeURIComponent(waText)}`, "_blank", "noopener");
    } catch {
      setEnrollMsg({ ok: false, text: t("সার্ভারে সমস্যা হয়েছে, আবার চেষ্টা করুন।", "Something went wrong. Please try again.") });
    } finally {
      setEnrollBusy(false);
    }
  };

  // open sessions WITH a meet link — only those are joinable
  const openSessions = useMemo(
    () => liveSessions.filter((s) => s.open && s.meetLink),
    [liveSessions],
  );
  const selected = useMemo(
    () => openSessions.find((s) => s._id === selectedSessionId) ?? openSessions[0] ?? null,
    [openSessions, selectedSessionId],
  );

  const enrolledFor = useCallback(
    (courseId: string) =>
      students.filter((s) => {
        if (Array.isArray(s.enrolledCourseIds))
          return s.enrolledCourseIds.some((id) => id.toLowerCase() === courseId.toLowerCase());
        const legacy = (s as { enrolledCourseId?: string }).enrolledCourseId;
        return legacy ? legacy.toLowerCase() === courseId.toLowerCase() : false;
      }),
    [students],
  );

  const markAttendance = async (courseId: string, roll: string) => {
    if (!roll.trim()) {
      setAttendMsg((prev) => ({ ...prev, [courseId]: { ok: false, text: t("রোল নম্বর লিখুন।", "Enter your roll number.") } }));
      return;
    }
    setAttendBusy(courseId);
    try {
      const res = await fetch("/api/academy/live/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, rollNumber: Number(roll) }),
      });
      const data = await res.json();
      setAttendMsg((prev) => ({
        ...prev,
        [courseId]: data.success
          ? { ok: true, text: data.duplicate ? t("আপনার হাজিরা আগেই হয়ে গেছে।", "Attendance already marked.") : t("হাজিরা হয়ে গেছে — ধন্যবাদ!", "Attendance marked — thank you!") }
          : { ok: false, text: data.error || t("হাজিরা হয়নি।", "Failed to mark attendance.") },
      }));
      if (data.success) fetchLive();
    } catch {
      setAttendMsg((prev) => ({ ...prev, [courseId]: { ok: false, text: t("সমস্যা হয়েছে।", "Something went wrong.") } }));
    } finally {
      setAttendBusy(null);
    }
  };

  const endLiveClass = async (session: LiveSession, passcode: string) => {
    setEndBusy(session._id);
    try {
      const res = await fetch("/api/academy/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "close-merge",
          id: session._id,
          contentCovered: {
            topic: lessonForm.topic.trim(),
            time: timeOverride[session._id] || session.time || "Live class",
          },
          adminPasscode: passcode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setEndMsg((prev) => ({
          ...prev,
          [session._id]: {
            ok: true,
            text: t("সাবমিট হয়েছে — হাজিরা ক্লাস লগে যুক্ত হয়ে ক্লাস বন্ধ হয়ে গেছে।", "Submitted — attendance merged into the class log and the class ended."),
          },
        }));
        fetchData();
        fetchLive();
      } else {
        setEndMsg((prev) => ({ ...prev, [session._id]: { ok: false, text: data.error || t("হয়নি।", "Failed.") } }));
      }
    } catch {
      setEndMsg((prev) => ({ ...prev, [session._id]: { ok: false, text: t("সমস্যা হয়েছে।", "Something went wrong.") } }));
    } finally {
      setEndBusy(null);
    }
  };

  const openBatch = useMemo(() => {
    const today = new Date().toISOString().slice(0, 10);
    return courses.find(
      (c) =>
        c.registrationOpen === true &&
        (!c.registrationLastDate || c.registrationLastDate >= today),
    );
  }, [courses]);

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
            <a
              href={FACEBOOK_GROUP_URL}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center justify-center gap-2 rounded-xl border border-text/15 px-3.5 py-2 text-[13px] font-semibold text-text/80 transition-colors hover:border-secondary/50 hover:text-secondary focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
              title={t("Facebook গ্রুপে যোগ দিন", "Join the Facebook group")}
            >
              <FacebookIcon className="h-4 w-4" />
              <span className="hidden sm:inline">
                {t("Facebook গ্রুপ", "Facebook group")}
              </span>
            </a>
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

      {/* ═══════════ UPCOMING HSK-1 BATCH ═══════════ */}
      <section className="mt-8">
        <div className="relative overflow-hidden rounded-3xl border border-primary/20 bg-card">
          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-primary/15 via-transparent to-transparent" aria-hidden="true" />
          <div className="pointer-events-none absolute -right-10 -top-16 text-[180px] font-extrabold leading-none text-primary/[0.06]" aria-hidden="true">
            汉
          </div>

          <div className="relative p-6 sm:p-9">
            {/* heading row */}
            <div className="flex flex-wrap items-center justify-between gap-3">
              <Eyebrow seal="启" label={t("আসন্ন ব্যাচ", "Upcoming batch")} />
              <span className="inline-flex items-center gap-1.5 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 text-[11px] font-bold uppercase tracking-[0.14em] text-primary">
                <Rocket className="h-4 w-4" />
                {t("শীঘ্রই শুরু", "Starting soon")}
              </span>
            </div>

            <h2 className="mt-3 max-w-2xl text-3xl font-extrabold leading-tight tracking-tight text-text sm:text-4xl">
              {t("মাত্র ১ মাসে HSK 1 পরীক্ষার সম্পূর্ণ প্রস্তুতি!", "Complete HSK 1 exam prep in just 1 month!")}
            </h2>

            {/* motivation strip */}
            <div className="mt-4 flex items-start gap-3 rounded-2xl border border-primary/25 bg-primary/[0.08] px-4 py-3.5 sm:px-5">
              <Sparkles className="mt-0.5 size-5 shrink-0 text-primary" />
              <p className="text-sm font-semibold leading-relaxed text-text/85 sm:text-base">
                {t(
                  "এই কোর্সটি শেষ করতে পারলে ডিসেম্বরের HSK 1 পরীক্ষা — আপনার প্রথম HSK — সহজেই দেওয়া সম্ভব হবে। প্রতিদিন একটু একটু করে প্রস্তুতি নিন, আমরা বাকিটা গাইড করি।",
                  "Finish this course and the December HSK 1 exam — your very first HSK — becomes easy to crack. Prepare a little every day; we guide the rest.",
                )}
              </p>
            </div>

            <div className="mt-6 grid gap-6 lg:grid-cols-2 lg:gap-8">
              {/* left — benefits */}
              <div className="flex flex-col gap-5">
                <ul className="space-y-3">
                  {[
                    { bn: "সপ্তাহে ৩টি লাইভ ক্লাস — নতুন শিক্ষার্থীদের জন্য একদম সহজ ধাপ", en: "3 live classes a week — beginner-friendly, step by step" },
                    { bn: "মোট ১৫টি ক্লাসে পুরো সিলেবাস শেষ", en: "Full syllabus covered in 15 classes" },
                    { bn: "স্পেশাল মক টেস্ট ও প্র্যাকটিস ম্যাটেরিয়াল", en: "Special mock tests & practice material" },
                    { bn: "২০ জনের ছোট ব্যাচ — প্রতিটা শিক্ষার্থীর দিকে খেয়াল", en: "Small 20-seat batch — personal attention for everyone" },
                  ].map((it) => (
                    <li key={it.en} className="flex items-start gap-3 text-[15px] leading-relaxed text-text/80 sm:text-base">
                      <span className="mt-0.5 inline-flex size-5 shrink-0 items-center justify-center rounded-md bg-ok/15 text-ok">
                        <Check className="size-3.5" strokeWidth={3} />
                      </span>
                      {t(it.bn, it.en)}
                    </li>
                  ))}
                </ul>

                <div className="mt-auto grid grid-cols-2 gap-3">
                  <div className="rounded-2xl border border-text/10 bg-background/50 p-4">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-text/50">
                      <Users className="size-4" />
                      {t("ব্যাচ সাইজ", "Batch size")}
                    </p>
                    <p className="mt-1.5 text-lg font-extrabold text-text">
                      {t("মাত্র ২০ জন", "Only 20")}
                    </p>
                    <p className="text-xs text-text/50">
                      {t("ব্যক্তিগত পরিচর্যার জন্য", "For personal attention")}
                    </p>
                  </div>
                  <div className="rounded-2xl border border-primary/20 bg-primary/5 p-4">
                    <p className="flex items-center gap-1.5 text-[11px] font-bold uppercase tracking-wide text-primary">
                      <Wallet className="size-4" />
                      {t("কোর্স ফি", "Course fee")}
                    </p>
                    <p className="mt-1.5 text-lg font-extrabold text-primary">{BATCH_FEE} {t("টাকা", "BDT")}</p>
                    <p className="text-xs text-text/50">
                      {t("আজকের সেরা অফার", "This year's best offer")}
                    </p>
                  </div>
                </div>
              </div>

              {/* right — seats + registration */}
              <div className="flex flex-col gap-4 rounded-2xl border border-text/10 bg-background/40 p-5 sm:p-6">
                {/* seat meter */}
                <div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-bold uppercase tracking-[0.12em] text-text/55">
                      {t("আসন সংরক্ষণ", "Seats")}
                    </span>
                    <span className="font-mono text-sm font-bold tabular-nums text-text/70">
                      {enrollCount.enrolled}/{BATCH_CAPACITY} {t("বুকড", "booked")}
                    </span>
                  </div>
                  <ProgressBar
                    value={enrollCount.enrolled}
                    max={BATCH_CAPACITY}
                    label={t("বুকড আসন", "Seats booked")}
                  />
                  <p className="mt-2.5 text-sm text-text/60">
                    {enrollCount.remaining > 0 ? (
                      <>
                        {t("বাকি", "Only")}{" "}
                        <span className="font-bold text-text">{enrollCount.remaining} {t("টি আসন", "seats left")}</span>{" "}
                        — {t("২০ জন পূর্ণ হলে ব্যাচ শুরু হবে।", "the batch starts once 20 students enroll.")}
                      </>
                    ) : (
                      <span className="font-bold text-danger">
                        {t("সব আসন পূর্ণ — ব্যাচ শীঘ্রই শুরু হবে।", "Batch is full — starting soon.")}
                      </span>
                    )}
                  </p>
                </div>

                {/* registration */}
                {enrollSubmitted ? (
                  <div className="flex flex-1 flex-col items-center justify-center rounded-2xl border border-ok/30 bg-ok/[0.06] px-5 py-8 text-center">
                    <span className="inline-flex size-11 items-center justify-center rounded-full bg-ok/15 text-ok">
                      <Check className="size-6" strokeWidth={3} />
                    </span>
                    <p className="mt-3 text-base font-bold text-text">
                      {t("আপনার সিট নিশ্চিত হয়েছে!", "Your seat is reserved!")}
                    </p>
                    <p className="mt-1 text-sm text-text/60">
                      {t(
                        "আপনার তথ্য একাডেমিতে পাঠানো হয়েছে। WhatsApp নিশ্চিতকরণ চাইলে অপেক্ষা করুন।",
                        "Your details were sent to the academy. Watch your WhatsApp for confirmation.",
                      )}
                    </p>
                  </div>
                ) : (
                  <div className="flex flex-1 flex-col justify-center gap-3 rounded-2xl border border-primary/25 bg-primary/[0.06] p-5 sm:p-6">
                    <p className="flex items-start gap-1.5 rounded-lg border border-text/10 bg-background/50 px-3 py-2 text-xs text-text/55">
                      <Phone className="mt-0.5 size-3.5 shrink-0 text-primary" />
                      {t(
                        "১,০০০ টাকা bKash করুন 01787881334-এ → TrxID দিয়ে নিবন্ধন সম্পূর্ণ করুন।",
                        "Send 1,000 BDT to bKash 01787881334 → complete registration with your TrxID.",
                      )}
                    </p>
                    <Button
                      type="button"
                      size="md"
                      disabled={enrollCount.remaining <= 0}
                      className="mt-1 w-full"
                      onClick={() => {
                        setEnrollMsg(null);
                        setEnrollOpen(true);
                      }}
                      iconRight={<ArrowRight className="size-4" />}
                    >
                      {enrollCount.remaining <= 0
                        ? t("সিট পূর্ণ", "Batch full")
                        : t("রেজিস্ট্রেশন করুন", "Register now")}
                    </Button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ LIVE CLASS PANEL ═══════════ */}
       {openSessions.length > 0 && selected && (
        <section id="live-panel" className="mt-8 scroll-mt-32" aria-live="polite">
          <div className="relative overflow-hidden rounded-3xl border-2 border-danger/50 bg-danger/[0.05] p-6 sm:p-8">
            <span
              aria-hidden="true"
              lang="zh"
              className="font-chinese pointer-events-none absolute -top-4 right-2 select-none text-[9rem] leading-none font-bold text-danger/[0.05]"
            >
              直播
            </span>

            <div className="relative">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <span className="inline-flex items-center gap-2 rounded-full bg-danger px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.12em] text-white">
                  <span className="size-2 animate-pulse rounded-full bg-white" />
                  {t("লাইভ ক্লাস চলছে", "Live class running")}
                </span>
                <span className="rounded-full border border-danger/30 bg-danger/10 px-3 py-1 text-[11px] font-bold text-danger">
                  {openSessions.length} {t("টি ক্লাস চালু", "class(es) live")}
                </span>
              </div>

              {/* course selector — changes students + meet link */}
              <div className="mt-5 max-w-md">
                <label
                  htmlFor="live-course-select"
                  className="block text-[11px] font-bold uppercase tracking-[0.12em] text-text/55"
                >
                  {t("কোন ক্লাসে যোগ দেবেন সিলেক্ট করুন", "Select which class to join")}
                </label>
                <select
                  id="live-course-select"
                  value={selected._id}
                  onChange={(e) => setSelectedSessionId(e.target.value)}
                  className="mt-1.5 w-full rounded-xl border border-text/20 bg-card px-3.5 py-2.5 text-sm font-semibold text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
                >
                  {openSessions.map((s) => {
                    const c = courses.find((x) => x.courseId === s.courseId);
                    return (
                      <option key={s._id} value={s._id}>
                        {c?.courseName ?? s.courseId} · {s.date}
                      </option>
                    );
                  })}
                </select>
              </div>

              <h2 className="mt-4 text-xl font-bold text-text sm:text-2xl">
                {courses.find((c) => c.courseId === selected.courseId)?.courseName ?? selected.courseId}
              </h2>
              <p className="mt-1 text-xs tabular-nums text-text/55">
                {selected.date} · {(selected.attendance ?? []).length} {t("জন উপস্থিত", "attended")}
              </p>

              <div className="mt-5 flex flex-col gap-5">
                {/* join + reveal link */}
                <div className="flex flex-wrap items-center gap-3">
                  <a
                    href={meetHref(selected.meetLink)}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center justify-center gap-2 rounded-xl bg-danger px-6 py-3.5 text-sm font-bold text-white shadow-md transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-danger"
                  >
                    ▶ {t("লাইভ ক্লাসে যোগ দিন", "Join live class")}
                  </a>
                  <Button
                    type="button"
                    variant="secondary"
                    onClick={() => setShowMeet((prev) => ({ ...prev, [selected._id]: !prev[selected._id] }))}
                  >
                    {t("মিট লিংক দেখুন", "Show Meet link")}
                  </Button>
                  {showMeet[selected._id] && (
                    <code className="max-w-full truncate rounded-lg border border-text/15 bg-background px-3 py-2 font-mono text-xs text-text/80 select-all">
                      {selected.meetLink}
                    </code>
                  )}
                </div>

                {/* attendance: roll-number grid */}
                <div>
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text/55">
                      {t("রোল নম্বরে ক্লিক করে হাজিরা দিন", "Tap your roll number to mark attendance")}
                    </p>
                    <span className="text-[11px] font-mono tabular-nums text-text/50">
                      {(selected.attendance ?? []).length} {t("জন উপস্থিত", "attended")}
                    </span>
                  </div>

                  {(() => {
                    const roster = enrolledFor(selected.courseId);
                    if (roster.length === 0) {
                      return (
                        <p className="mt-2 text-xs text-text/50">
                          {t("এই কোর্সে এখনো শিক্ষার্থী নেই।", "No students enrolled in this course yet.")}
                        </p>
                      );
                    }
                    return (
                      <ul className="mt-2 flex flex-wrap gap-2">
                        {roster.map((s) => {
                          const marked = (selected.attendance ?? []).some(
                            (a) => a.rollNumber === s.rollNumber,
                          );
                          return (
                            <li key={s.rollNumber}>
                              <button
                                type="button"
                                disabled={attendBusy === selected.courseId}
                                onClick={() => markAttendance(selected.courseId, String(s.rollNumber))}
                                title={s.nameEnglish}
                                aria-pressed={marked}
                                className={`flex flex-col items-center gap-0.5 rounded-xl border px-3.5 py-2 transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text disabled:opacity-60 ${
                                  marked
                                    ? "border-ok/50 bg-ok/10 text-ok"
                                    : "border-text/15 bg-card text-text/70 hover:border-ok/50 hover:text-ok"
                                }`}
                              >
                                <span className="font-mono text-sm font-bold tabular-nums">
                                  #{s.rollNumber}
                                </span>
                                <span className="max-w-20 truncate text-[10px]">{s.nameEnglish}</span>
                                {marked && (
                                  <Check className="size-3" strokeWidth={3} aria-hidden="true" />
                                )}
                              </button>
                            </li>
                          );
                        })}
                      </ul>
                    );
                  })()}

                  {attendMsg[selected.courseId] && (
                    <p
                      role="status"
                      className={`mt-2 text-xs font-medium ${attendMsg[selected.courseId].ok ? "text-ok" : "text-danger"}`}
                    >
                      {attendMsg[selected.courseId].text}
                    </p>
                  )}
                </div>

                {/* Admin submit (passcode) — same fields as the class-log form */}
                <details className="w-full rounded-2xl border border-text/12 bg-card/80 open:border-primary/30">
                  <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-text/70 transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text">
                    <Lock className="size-4 text-text/40" aria-hidden="true" />
                    {t("অ্যাডমিন সাবমিট — ক্লাস লগ পূরণ করুন", "Admin submit — fill the class log")}
                    <span aria-hidden="true" className="ml-auto text-xs text-text/40 group-open/adm:hidden">
                      ▼
                    </span>
                  </summary>

                  <div className="mt-1 space-y-4 border-t border-text/10 px-4 pb-5 pt-4 sm:px-5">
                    <p className="text-xs font-semibold text-text">
                      {t(
                        "ক্লাস লগ পূরণ করে পাসকোড দিয়ে সাবমিট করুন — হাজিরা লগে যুক্ত হবে।",
                        "Fill the class log and submit with the passcode — attendance merges into the log.",
                      )}
                    </p>

                    <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
                      <Field type="date" label={t("তারিখ", "Date")} value={selected.date} disabled />
                      <Field
                        label={t("সময়", "Time")}
                        hint={t("যেমন: 9:00 PM", "e.g. 9:00 PM")}
                        value={timeOverride[selected._id] ?? selected.time ?? ""}
                        onChange={(e) =>
                          setTimeOverride((prev) => ({ ...prev, [selected._id]: e.target.value }))
                        }
                      />
                    </div>

                    <Field
                      label={t("আজকের বিষয়", "Today's topic")}
                      hint={t("যেমন: HSK 3 Lesson 4 — Weather", "e.g. HSK 3 Lesson 4 — Weather")}
                      value={lessonForm.topic}
                      onChange={(e) => setLessonForm({ topic: e.target.value })}
                      placeholder={t("ক্লাসের বিষয় লিখুন", "Enter the class topic")}
                    />

                    <Field
                      type="password"
                      label={t("অ্যাডমিন পাসকোড", "Admin passcode")}
                      value={endPass[selected._id] ?? ""}
                      error={endMsg[selected._id] && !endMsg[selected._id].ok ? endMsg[selected._id].text : undefined}
                      onChange={(e) => setEndPass((prev) => ({ ...prev, [selected._id]: e.target.value }))}
                      className="text-center tracking-widest"
                    />

                    <Button
                      variant="danger"
                      className="w-full"
                      loading={endBusy === selected._id}
                      onClick={() => endLiveClass(selected, endPass[selected._id] ?? "")}
                    >
                      {t("সাবমিট ও ক্লাস বন্ধ করুন", "Submit & end class")}
                    </Button>

                    {endMsg[selected._id]?.ok && (
                      <p className="text-xs font-medium text-ok" role="status">
                        {endMsg[selected._id].text}
                      </p>
                    )}
                   </div>
                 </details>
               </div>
             </div>
           </div>
         </section>
       )}

      {/* Stat row */}
      <dl className="mt-10 grid grid-cols-2 divide-text/10 rounded-2xl border border-text/10 bg-card sm:grid-cols-4 sm:divide-x">
        {(
          [
            [t("সক্রিয় ব্যাচ", "Active cohorts"), stats.batches, Layers],
            [t("চলমান এখন", "Running now"), stats.running, PlayCircle],
            [t("ক্লাস সম্পন্ন", "Classes held"), stats.held, CalendarDays],
            [t("মোট শিক্ষার্থী", "Scholars enrolled"), stats.scholars, Users],
          ] as const
        ).map(([label, value, Icon]) => (
          <div key={label} className="flex items-center gap-3 px-5 py-5">
            <span className="flex h-10 w-10 shrink-0 items-center justify-center rounded-xl border border-text/10 bg-text/5">
              <Icon className="h-4.5 w-4.5 text-text/55" aria-hidden="true" />
            </span>
            <div>
              <dt className="text-xs font-medium uppercase tracking-wide text-text/50">{label}</dt>
              <dd className="mt-0.5 text-2xl font-bold tabular-nums text-text">
                {loading ? <span className="text-text/30">—</span> : value}
              </dd>
            </div>
          </div>
        ))}
      </dl>

      {/* How it works — for new users */}
      <section className="mt-10">
        <Eyebrow seal="启" label={t("কীভাবে শুরু করবেন", "How to start")} />
        <h2 className="mt-3 text-2xl font-bold tracking-tight text-text sm:text-3xl">
          {t("ধাপে ধাপে", "Step by step")}
        </h2>
        <p className="mt-1.5 max-w-2xl text-sm leading-6 text-text/60">
          {t(
            "এই পেজে ব্যাচের সব তথ্য এক জায়গায় — কোর্স বাছুন, লাইভ ক্লাসে হাজিরা দিন, আর নিজের অগ্রগতি দেখুন।",
            "Everything about your batch in one place — pick a course, mark attendance live, and watch your progress.",
          )}
        </p>
        <div className="mt-5 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-4">
          {(
            [
              {
                n: "১",
                icon: GraduationCap,
                title: t("কোর্স বাছুন", "Pick a course"),
                text: t("সব কোর্স ও ব্যাচের অবস্থা নিচে দেখুন।", "See every course and its running status below."),
              },
              {
                n: "২",
                icon: Video,
                title: t("ক্লাসে যোগ দিন", "Join the class"),
                text: t("লাইভ ক্লাস চললে উপরে লাল প্যানেল থেকে মিট লিংকে ঢুকুন।", "When a class is live, join the Meet link from the red panel above."),
              },
              {
                n: "৩",
                icon: ClipboardCheck,
                title: t("হাজিরা দিন", "Mark attendance"),
                text: t("নিজের নামে ক্লিক করলেই হাজিরা হয়ে যায়।", "Tap your name — attendance is marked instantly."),
              },
              {
                n: "৪",
                icon: BarChart3,
                title: t("অগ্রগতি দেখুন", "Track progress"),
                text: t("পাঠ, ক্লাস লগ আর উপস্থিতির হার সব এখানে।", "Lessons, class logs and attendance rate — all here."),
              },
            ] as const
          ).map(({ n, icon: Icon, title, text }) => (
            <Card key={title} className="relative overflow-hidden p-5">
              <span
                aria-hidden="true"
                lang="zh"
                className="font-chinese pointer-events-none absolute -top-2 right-1 select-none text-6xl leading-none font-bold text-text/[0.04]"
              >
                {n}
              </span>
              <span className="flex h-10 w-10 items-center justify-center rounded-xl bg-text/5">
                <Icon className="h-5 w-5 text-text/60" aria-hidden="true" />
              </span>
              <p className="mt-3 text-sm font-bold text-text">{title}</p>
              <p className="mt-1 text-xs leading-5 text-text/60">{text}</p>
            </Card>
          ))}
        </div>
      </section>

      {/* Hanzi Pro paid class */}
      {!loading && (
        <section className="mt-10">
          <Card className="flex flex-col gap-5 border-secondary/30 bg-secondary/[0.05] p-6 sm:flex-row sm:items-center">
            <div className="flex size-14 shrink-0 items-center justify-center rounded-2xl border border-secondary/30 bg-secondary/10">
              <Trophy className="h-7 w-7 text-secondary" aria-hidden="true" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-lg font-bold text-text">
                  {t("হানজি প্রো — ৩০০ শব্দের চ্যালেঞ্জ", "Hanzi Pro — the 300-word challenge")}
                </h2>
                <span className="rounded bg-secondary/15 px-1.5 py-0.5 text-[10px] font-bold text-secondary">
                  PRO
                </span>
              </div>
              <p className="mt-1 text-sm leading-6 text-text/65">
                {t(
                  "HSK 1 এর লেসন-ভিত্তিক সব শব্দ এক চ্যালেঞ্জে — ২০ তারিখ থেকে ক্লাস, ফি মাত্র ৳২০০। ভর্তি হয়ে নিজের অগ্রগতি ট্র্যাক করুন।",
                  "Every HSK 1 lesson word in one paid challenge — classes start on the 20th, fee ৳200. Enroll and track your progress.",
                )}
              </p>
            </div>
            <div className="flex shrink-0 flex-col gap-2 sm:items-end">
              <ButtonLink href="/hanzi-pro" size="sm" iconRight={<ArrowRight className="h-4 w-4" />}>
                {t("বিস্তারিত ও ভর্তি", "Details & enroll")}
              </ButtonLink>
              {hpStats.enrolled > 0 && (
                <p className="text-[11px] font-mono text-text/55">
                  {t(
                    `${hpStats.enrolled} জন ভর্তি · ${hpStats.learned} শব্দ শেখা হয়েছে`,
                    `${hpStats.enrolled} enrolled · ${hpStats.learned} words learned`,
                  )}
                </p>
              )}
            </div>
          </Card>
        </section>
      )}

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
              const isLive = openSessions.some((s) => s.courseId === course.courseId);

              return (
                <Card key={course._id ? String(course._id) : course.courseId} className={`relative flex flex-col p-6 ${isLive ? "border-danger/50" : ""}`}>
                  <Link
                    href={`/academy/courses?course=${encodeURIComponent(course.courseId)}`}
                    aria-label={t("দেখুন", "View") + " " + course.courseName}
                    className="absolute inset-0 z-0 rounded-[inherit] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                  />
                  <div className="relative z-10 flex flex-col">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex flex-wrap items-center gap-2">
                      <span className="rounded-md border border-text/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-text/70">
                        {course.courseId}
                      </span>
                      <span className="text-xs text-text/50">{course.targetLevel}</span>
                    </div>
                    <div className="flex items-center gap-2">
                      {isLive && (
                        <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                          <span className="size-1.5 animate-pulse rounded-full bg-white" />
                          LIVE
                        </span>
                      )}
                      <StatusPill tone={running ? "done" : "pending"}>
                        {running ? t("চলমান", "Running") : t("আসছে", "Coming soon")}
                      </StatusPill>
                    </div>
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

                  <div className="mt-5 flex flex-wrap items-center gap-2">
                    <Link
                      href={`/academy/courses?course=${encodeURIComponent(course.courseId)}`}
                      className="inline-flex items-center gap-1 self-start border-t border-text/10 pt-4 text-sm font-semibold text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                    >
                      {t("সিলেবাস ও ক্লাস লগ", "Curriculum & class logs")}
                      <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                    </Link>
                    {isLive && (
                      <button
                        type="button"
                        onClick={() => {
                          const s = openSessions.find((x) => x.courseId === course.courseId);
                          if (s) setSelectedSessionId(s._id);
                          document.getElementById("live-course-select")?.scrollIntoView({ behavior: "smooth", block: "center" });
                        }}
                        className="inline-flex items-center gap-1 self-start rounded-xl bg-danger px-4 py-2 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                      >
                        ▶ {t("লাইভ ক্লাসে যান", "Go to live class")}
                      </button>
                    )}
                  </div>
                  </div>
                </Card>
              );
            })}
          </div>
        )}
      </section>

      {/* Admission notice */}
      {!loading && (
        <Card className="mt-6 flex flex-col gap-4 p-6 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <p className="text-sm font-bold text-text">
              {openBatch
                ? t("এখন ভর্তি চলছে", "Admission is open")
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
              <span className="font-mono font-bold text-primary">{nextIntake}</span>
            </div>
          )}
        </Card>
      )}

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

      {/* HSK-1 registration popup */}
      <Dialog
        open={enrollOpen}
        onClose={() => setEnrollOpen(false)}
        title={t("HSK 1 ব্যাচে রেজিস্ট্রেশন", "HSK 1 batch registration")}
        description={t(
          `ফি ${BATCH_FEE} টাকা bKash করুন 01787881334-এ, তারপর TrxID দিয়ে ফর্মটি পূরণ করুন।`,
          `Send the ${BATCH_FEE} BDT fee to bKash 01787881334, then fill the form below with your TrxID.`,
        )}
      >
        <form
          className="flex flex-col gap-3"
          onSubmit={(e) => {
            e.preventDefault();
            void submitEnrollment();
          }}
        >
          <Field
            label={t("নাম", "Name")}
            placeholder={t("আপনার পুরো নাম", "Your full name")}
            value={enrollForm.name}
            error={enrollErrors.name}
            onChange={(e) => setEnroll("name", e.target.value)}
          />
          <Field
            label={t("WhatsApp নম্বর", "WhatsApp number")}
            type="tel"
            placeholder="017XXXXXXXX"
            value={enrollForm.whatsapp}
            error={enrollErrors.whatsapp}
            onChange={(e) => setEnroll("whatsapp", e.target.value)}
          />
          <div className="grid gap-3 sm:grid-cols-2">
            <Field
              label={t("bKash TrxID", "bKash TrxID")}
              placeholder="ABC123456789"
              value={enrollForm.trxId}
              error={enrollErrors.trxId}
              onChange={(e) => setEnroll("trxId", e.target.value)}
            />
            <Field
              label={t("এলাকা", "Location")}
              placeholder={t("যে শহরে থাকেন", "Your city / area")}
              value={enrollForm.location}
              error={enrollErrors.location}
              onChange={(e) => setEnroll("location", e.target.value)}
            />
          </div>

          <p className="flex items-start gap-1.5 rounded-lg border border-text/10 bg-background/50 px-3 py-2 text-xs text-text/55">
            <Phone className="mt-0.5 size-3.5 shrink-0 text-primary" />
            {t(
              "আপনার তথ্য একাডেমির WhatsApp-এ (01787881334) পাঠানো হবে।",
              "Your details are forwarded to the academy on WhatsApp (01787881334).",
            )}
          </p>

          {enrollMsg && !enrollMsg.ok && (
            <p
              role="alert"
              className="rounded-lg border border-danger/30 bg-danger/[0.06] px-3 py-2 text-xs font-semibold text-danger"
            >
              {enrollMsg.text}
            </p>
          )}

          <Button
            type="submit"
            size="md"
            loading={enrollBusy}
            className="mt-1 w-full"
            iconRight={<ArrowRight className="size-4" />}
          >
            {t("আজই সিট নিশ্চিত করুন", "Secure your seat now")}
          </Button>

          <p className="text-center text-xs text-text/45">
            {t("২০ জন না হওয়া পর্যন্ত ব্যাচ শুরু হবে না।", "The batch won't start until 20 students enroll.")}
          </p>
        </form>
      </Dialog>

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
