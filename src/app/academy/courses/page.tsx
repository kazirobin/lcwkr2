"use client";

import Image from "next/image";
import Link from "next/link";
import { useState, useEffect, useMemo, useCallback } from "react";
import {
  BookOpen,
  Check,
  ChevronDown,
  Lock,
  MapPin,
  Radio,
  RefreshCw,
  Trophy,
} from "lucide-react";
import { ICourse, IStudent, ILiveClassView, ILiveLink } from "@/features/academy";
import { isSubAdminPasscode } from "@/features/academy/subAdminPasswords";
import { useLanguage } from "@/i18n";
import {
  Breadcrumb,
  Button,
  Card,
  Dialog,
  EmptyState,
  Eyebrow,
  Field,
  IconButton,
  LoadingBlock,
  PageHeader,
  ProgressBar,
  SectionHanzi,
  StatusMark,
  StatusPill,
} from "@/components/ui";

const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

export default function CoursesListPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [allStudents, setAllStudents] = useState<IStudent[]>([]);
  const [liveSessions, setLiveSessions] = useState<ILiveClassView[]>([]);
  const [groups, setGroups] = useState<{ _id?: string; courseId: string; label: string; memberRolls: number[] }[]>([]);
  const [links, setLinks] = useState<ILiveLink[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedId, setSelectedId] = useState("");

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminIsSub, setAdminIsSub] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const [startLinkId, setStartLinkId] = useState("new");
  const [startMeet, setStartMeet] = useState("");
  const [startTopic, setStartTopic] = useState("");
  const [startBusy, setStartBusy] = useState(false);

  const [closeOpen, setCloseOpen] = useState(false);
  const [closeLesson, setCloseLesson] = useState(1);
  const [closePresent, setClosePresent] = useState<string[]>([]);
  const [closeBusy, setCloseBusy] = useState(false);
  const [closeTime, setCloseTime] = useState("");

  const [toggleBusy, setToggleBusy] = useState<number | null>(null);
  const [expandedStudent, setExpandedStudent] = useState<string | null>(null);

  useEffect(() => {
    setAdminUnlocked(sessionStorage.getItem("academy_admin_unlocked") === "true");
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [cRes, sRes, liveRes, grpRes] = await Promise.all([
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/live", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/groups", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (cRes.success && Array.isArray(cRes.courses)) setCourses(cRes.courses);
      if (sRes.success && Array.isArray(sRes.students)) setAllStudents(sRes.students);
      if (liveRes.success && Array.isArray(liveRes.sessions)) setLiveSessions(liveRes.sessions);
      if (grpRes.success && Array.isArray(grpRes.groups)) setGroups(grpRes.groups);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchLinks = useCallback(async () => {
    try {
      const res = await fetch(`/api/academy/live/links`, { cache: "no-store" }).then((r) => r.json());
      if (res.success && Array.isArray(res.links)) setLinks(res.links);
      else setLinks([]);
    } catch { setLinks([]); }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  useEffect(() => {
    const iv = setInterval(fetchData, 20000);
    return () => clearInterval(iv);
  }, [fetchData]);

  const selected = useMemo(
    () => courses.find((c) => c.courseId.toLowerCase() === selectedId.toLowerCase()) ?? courses[0] ?? null,
    [courses, selectedId],
  );

  useEffect(() => {
    if (selected) {
      fetchLinks();
      setStartLinkId("new");
    }
  }, [selected, fetchLinks]);

  const courseLive = useMemo(() => {
    if (!selected) return null;
    const mine = liveSessions.filter(
      (s) => s.courseId.toLowerCase() === selected.courseId.toLowerCase(),
    );
    const open = mine.find((s) => s.open);
    const closed = mine.filter((s) => !s.open && (s.marks?.length || s.submissions?.length));
    return open ?? closed.sort((a, b) => (a.date < b.date ? 1 : -1))[0] ?? null;
  }, [liveSessions, selected]);

  const courseStudents = useMemo(() => {
    if (!selected) return [];
    const cid = selected.courseId.toLowerCase();
    return allStudents.filter((s) => {
      if (Array.isArray(s.enrolledCourseIds))
        return s.enrolledCourseIds.some((id) => id.toLowerCase() === cid);
      const legacy = (s as { enrolledCourseId?: string }).enrolledCourseId;
      return legacy ? legacy.toLowerCase() === cid : false;
    });
  }, [allStudents, selected]);

  const nameByRoll = useMemo(() => {
    const m = new Map<string, string>();
    allStudents.forEach((s) => m.set(String(s.rollNumber).trim(), s.nameEnglish));
    return m;
  }, [allStudents]);

  const courseGroups = useMemo(
    () => (selected ? groups.filter((g) => g.courseId === selected.courseId) : []),
    [groups, selected],
  );

  const liveCourseIds = useMemo(
    () => liveSessions.filter((s) => s.open).map((s) => s.courseId.toLowerCase()),
    [liveSessions],
  );

  const requireAdmin = (then: () => void) => {
    if (adminUnlocked) then();
    else { setPin(""); setPinError(""); setPinOpen(true); }
  };

  const submitPin = (e: React.FormEvent) => {
    e.preventDefault();
    const v = pin.trim();
    if (v === ADMIN_SECRET_PIN.trim() || isSubAdminPasscode(v)) {
      setAdminUnlocked(true);
      setAdminPin(v);
      setAdminIsSub(v !== ADMIN_SECRET_PIN.trim());
      sessionStorage.setItem("academy_admin_unlocked", "true");
      setPinOpen(false);
    } else {
      setPinError(t("ভুল পাসকোড।", "Incorrect passcode."));
    }
  };

  const startClass = () =>
    requireAdmin(async () => {
      if (!selected) return;
      const link = startLinkId === "new" ? null : links.find((l) => l._id === startLinkId);
      const meet = (link?.meetLink || startMeet).trim();
      const topic = (link?.topic || startTopic).trim();
      if (!meet) {
        alert(t("মিট লিংক দিন বা সিলেক্ট করুন।", "Enter or select a Meet link."));
        return;
      }
      setStartBusy(true);
      try {
        const res = await fetch("/api/academy/live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "open",
            courseId: selected.courseId,
            meetLink: meet,
            date: new Date().toISOString().slice(0, 10),
            time: "",
            topic,
            adminPasscode: adminPin || ADMIN_SECRET_PIN,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setStartLinkId(""); setStartMeet(""); setStartTopic("");
          await fetchData();
        } else {
          alert(data.error || t("চালু হয়নি।", "Failed."));
        }
      } catch {
        alert(t("সমস্যা হয়েছে।", "Something went wrong."));
      } finally {
        setStartBusy(false);
      }
    });

  const openCloseForm = () =>
    requireAdmin(() => {
      if (!courseLive) return;
      setCloseLesson(1);
      setCloseTime(courseLive.time || "");
      setClosePresent((courseLive.attendance ?? []).map((a) => String(a.rollNumber).trim()));
      setCloseOpen(true);
    });

  const saveClose = async () => {
    if (!courseLive || !selected) return;
    const allRolls = courseStudents.map((s) => String(s.rollNumber).trim());
    const absent = allRolls.filter((r) => !closePresent.includes(r));
    setCloseBusy(true);
    try {
      const res = await fetch("/api/academy/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "close-merge",
          id: courseLive._id,
          contentCovered: {
            fromLesson: closeLesson, fromText: 1, toLesson: closeLesson, toText: 1,
            time: closeTime || courseLive.time || "Class",
          },
          presentStudents: closePresent,
          absentStudents: absent,
          adminPasscode: adminPin || ADMIN_SECRET_PIN,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCloseOpen(false);
        await fetchData();
      } else {
        alert(data.error || t("বন্ধ হয়নি।", "Failed."));
      }
    } catch {
      alert(t("সমস্যা হয়েছে।", "Something went wrong."));
    } finally {
      setCloseBusy(false);
    }
  };

  const toggleAttendance = async (roll: number) => {
    if (!courseLive?.open || !selected) return;
    const present = (courseLive.attendance ?? []).some((a) => a.rollNumber === roll);
    setToggleBusy(roll);
    try {
      const res = await fetch("/api/academy/live/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: selected.courseId, rollNumber: roll,
          ...(present ? { action: "unmark" } : {}),
        }),
      });
      const data = await res.json();
      if (data.success) await fetchData();
    } catch { /* ignore */ } finally { setToggleBusy(null); }
  };

  const done = selected?.classes?.length ?? selected?.completedClassesCount ?? 0;
  const planned = selected?.totalClassesPlanned || 24;

  const coveredLessons = useMemo(() => {
    const s = new Set<number>();
    (selected?.classes ?? []).forEach((c) => {
      const from = c.contentCovered?.fromLesson ?? 1;
      const to = c.contentCovered?.toLesson ?? from;
      for (let n = from; n <= to; n++) s.add(n);
    });
    return s;
  }, [selected]);
  const lessonTotal = (selected?.totalLessons ?? (selected?.lessons?.length ?? 0)) || 0;
  const lessonList =
    selected?.lessons?.length
      ? selected.lessons
      : Array.from({ length: Math.max(lessonTotal, 1) }, (_, i) => ({
          lessonNumber: i + 1,
          title: t(`পাঠ ${i + 1}`, `Lesson ${i + 1}`),
        }));

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="课" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("হোম", "Home"), href: "/" },
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("কোর্স", "Courses") },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={<Eyebrow seal="课" label={t("ম্যান্ডারিন কোর্স", "Mandarin courses")} />}
        title={t("একাডেমি কোর্সসমূহ", "Academy courses")}
        lede={t(
          "কোর্স সিলেক্ট করুন — শিক্ষার্থী, ক্লাস লগ ও লাইভ ক্লাস সব এক জায়গায়।",
          "Select a course — students, class logs and live classes, all in one place.",
        )}
        actions={
          <IconButton
            label={t("রিফ্রেশ", "Refresh")}
            size="sm"
            spinning={loading}
            onClick={fetchData}
          >
            <RefreshCw className="h-4 w-4" />
          </IconButton>
        }
      />

      {/* ═══════════════════════════════════════════
           COURSE TABS — horizontal scrollable chips
          ═══════════════════════════════════════════ */}
      <div className="mt-8">
        {loading ? (
          <LoadingBlock label={t("কোর্স লোড হচ্ছে", "Loading courses")} rows={2} />
        ) : courses.length === 0 ? (
          <EmptyState
            title={t("এখনও কোনো কোর্স নেই", "No courses yet")}
            description={t("নতুন ব্যাচ চালু হলে এখানে দেখা যাবে।", "New cohorts will appear here once they open.")}
          />
        ) : (
          <div className="flex gap-2 overflow-x-auto pb-2 -mx-1 px-1">
            {courses.map((c) => {
              const active = c.courseId === (selected?.courseId ?? selectedId);
              const isLive = liveCourseIds.includes(c.courseId.toLowerCase());
              const running = c.status === "Running";
              return (
                <button
                  key={c.courseId}
                  type="button"
                  onClick={() => setSelectedId(c.courseId)}
                  className={`flex shrink-0 items-center gap-2 rounded-xl border px-4 py-3 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                    active
                      ? "border-text bg-text text-background font-bold"
                      : "border-text/15 bg-card text-text/70 hover:border-text/30 hover:text-text font-medium"
                  }`}
                >
                  <span className="flex items-center gap-2">
                    <span className="text-xs font-mono opacity-70">{c.courseId}</span>
                    {isLive && (
                      <span className="size-2 rounded-full bg-danger animate-pulse" />
                    )}
                  </span>
                  <span className="hidden sm:inline">{c.courseName}</span>
                  <StatusPill tone={running ? "done" : "pending"}>
                    {running ? t("চলমান", "Run") : t("আসছে", "Soon")}
                  </StatusPill>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* ═══════════════════════════════════════════
           COURSE DETAIL PANEL
          ═══════════════════════════════════════════ */}
      {selected && (
        <div className="mt-8 space-y-8">

          {/* ── course overview card ── */}
          <Card className="p-6">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <div className="flex flex-wrap items-center gap-2">
                  <h2 className="text-xl font-bold text-text">{selected.courseName}</h2>
                  <StatusPill tone={selected.status === "Running" ? "done" : "pending"}>
                    {selected.status === "Running" ? t("চলমান", "Running") : t("আসছে", "Coming soon")}
                  </StatusPill>
                  {courseLive?.open && (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-white">
                      <Radio className="h-3 w-3" /> LIVE
                    </span>
                  )}
                </div>
                <p className="mt-1 text-sm text-text/60">
                  {selected.targetLevel} · {selected.totalLessons} {t("পাঠ", "lessons")} · {courseStudents.length} {t("জন ভর্তি", "enrolled")}
                </p>
              </div>
              <div className="flex items-center gap-3">
                {adminUnlocked ? (
                  <StatusMark tone="done">
                    {adminIsSub ? t("সাব-অ্যাডমিন", "Sub-admin") : t("অ্যাডমিন", "Admin")}
                  </StatusMark>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => requireAdmin(() => {})}
                    iconLeft={<Lock className="h-3.5 w-3.5" />}
                  >
                    {t("সাব-অ্যাডমিন লগইন", "Sub-admin login")}
                  </Button>
                )}
              </div>
            </div>
            <div className="mt-4">
              <div className="flex items-center justify-between text-xs">
                <span className="text-text/55">{t("সিলেবাস", "Progress")}</span>
                <span className="font-semibold tabular-nums">{done} / {planned}</span>
              </div>
              <ProgressBar value={done} max={planned} label={t("সিলেবাস", "Progress")} />
            </div>
            {selected.topics && selected.topics.length > 0 && (
              <div className="mt-4 rounded-xl border border-secondary/20 bg-secondary/[0.05] px-4 py-3">
                <p className="text-[10px] font-bold uppercase tracking-wide text-secondary">
                  {t("পরবর্তী টপিক", "Upcoming topics")}
                </p>
                <ul className="mt-2 flex flex-wrap gap-2">
                  {selected.topics.map((tp, i) => (
                    <li key={i} className="rounded-lg border border-secondary/15 bg-background px-3 py-1.5 text-xs font-medium text-text">
                      {tp}
                    </li>
                  ))}
                </ul>
              </div>
            )}

            {/* topics → study groups for this course */}
            {courseGroups.length > 0 && (
              <div className="mt-4 space-y-2.5">
                {courseGroups.map((g) => (
                  <details key={g._id || g.label} className="group rounded-xl border border-text/12 bg-text/[0.03]">
                    <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-bold text-text">
                      <span>{g.label}</span>
                      <span className="flex items-center gap-2 text-xs font-normal text-text/55">
                        {g.memberRolls.length} {t("জন", "members")}
                        <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180" />
                      </span>
                    </summary>
                    <ul className="space-y-1 border-t border-text/10 px-4 py-3">
                      {g.memberRolls.map((r) => (
                        <li key={r} className="flex items-baseline gap-2 text-xs">
                          <span className="w-9 shrink-0 font-mono text-[11px] text-text/40">#{r}</span>
                          <span className="text-text/85">
                            {nameByRoll.get(String(r).trim()) ?? t("অজানা", "Unknown")}
                          </span>
                        </li>
                      ))}
                    </ul>
                  </details>
                ))}
              </div>
            )}
          </Card>

          {/* ── lesson progress ── */}
          <Card className="p-6">
            <div className="flex items-center justify-between">
              <p className="text-xs font-bold uppercase tracking-[0.12em] text-text/55">
                {t("পাঠ তালিকা", "Lesson list")}
              </p>
              <span className="text-[11px] font-semibold tabular-nums text-text/45">
                {coveredLessons.size} / {lessonTotal}
              </span>
            </div>
            <ul className="mt-3 grid grid-cols-2 gap-1.5 sm:grid-cols-3 md:grid-cols-5">
              {lessonList.map((lesson) => {
                const covered = coveredLessons.has(lesson.lessonNumber);
                return (
                  <li
                    key={lesson.lessonNumber}
                    className={`flex items-start gap-2 rounded-lg border px-3 py-2 ${
                      covered
                        ? "border-ok/35 bg-ok-surface"
                        : "border-text/12 bg-text/[0.03]"
                    }`}
                  >
                    <span className={`flex h-4 w-4 shrink-0 items-center justify-center rounded-full border mt-0.5 ${
                      covered ? "border-ok bg-ok text-card" : "border-text/25 text-transparent"
                    }`}>
                      {covered && <Check className="h-2.5 w-2.5" strokeWidth={3} />}
                    </span>
                    <span className="min-w-0">
                      <span className="block text-[10px] tabular-nums text-text/45">#{lesson.lessonNumber}</span>
                      <span className="block truncate text-xs font-medium text-text">{lesson.title}</span>
                    </span>
                  </li>
                );
              })}
            </ul>
          </Card>

          {/* ═══════════════════════════════════════
               CLASS ON / LIVE CLASS — admin-gated
              ═══════════════════════════════════════ */}
          {adminUnlocked && !courseLive?.open && (
            <Card className="p-6 space-y-4">
              <div className="flex items-center gap-2">
                <Radio className="h-4 w-4 text-danger" />
                <h3 className="text-sm font-bold text-text">
                  {t("ক্লাস চালু করুন", "Start a live class")}
                </h3>
              </div>
              <div>
                <label className="mb-1.5 block text-[11px] font-bold uppercase tracking-[0.12em] text-text/55">
                  {t("সংরক্ষিত মিট লিংক", "Saved Meet link")}
                </label>
                <select
                  value={startLinkId}
                  onChange={(e) => setStartLinkId(e.target.value)}
                  className="w-full rounded-xl border border-text/20 bg-card px-3.5 py-2.5 text-sm font-semibold text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
                >
                  <option value="new">{t("— নতুন লিংক —", "— new link —")}</option>
                  {links.map((l) => (
                    <option key={l._id} value={l._id}>
                      {l.courseId !== selected.courseId ? `[${l.courseId}] ` : ""}{l.label ? `${l.label} · ` : ""}{l.meetLink}
                    </option>
                  ))}
                </select>
                {links.length > 0 && (
                  <p className="mt-1 text-[10px] text-text/40">
                    {t("যেকোনো কোর্সের সংরক্ষিত লিংক এখানে দেখানো হয় — সব কোর্সে একই লিংক ব্যবহার করতে পারবেন।", "Saved links from all courses are shown — you can reuse the same link for any course.")}
                  </p>
                )}
              </div>
              {startLinkId === "new" && (
                <>
                  <Field
                    label={t("Google Meet লিংক", "Google Meet link")}
                    required
                    placeholder="https://meet.google.com/xxx-xxxx-xxx"
                    value={startMeet}
                    onChange={(e) => setStartMeet(e.target.value)}
                  />
                  <Field
                    label={t("টপিক (ঐচ্ছিক)", "Topic (optional)")}
                    value={startTopic}
                    onChange={(e) => setStartTopic(e.target.value)}
                  />
                </>
              )}
              <Button size="sm" loading={startBusy} iconLeft={<Radio className="h-4 w-4" />} onClick={startClass}>
                {t("ক্লাস চালু করুন", "Go live")}
              </Button>
            </Card>
          )}

          {/* ═══════════════════════════════════════
               LIVE ATTENDANCE — when class is running
              ═══════════════════════════════════════ */}
          {courseLive?.open && (
            <section id="attendance" className="scroll-mt-24">
              <Card className="p-6 space-y-4">
                <div className="flex flex-wrap items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-danger px-3 py-1.5 text-[10px] font-bold uppercase tracking-wide text-white">
                      <span className="size-2 animate-pulse rounded-full bg-white" />
                      {t("ক্লাস চলছে", "Class running")}
                    </span>
                    <span className="text-xs text-text/50">
                      {(courseLive.attendance ?? []).length}/{courseStudents.length} {t("জন উপস্থিত", "present")}
                    </span>
                  </div>
                  {adminUnlocked && (
                    <Button variant="danger" size="sm" onClick={openCloseForm}>
                      {t("ক্লাস বন্ধ ও লগ সেভ", "End class & save log")}
                    </Button>
                  )}
                  <a
                    href={courseLive.meetLink}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 rounded-xl bg-danger px-4 py-2 text-sm font-bold text-white transition-transform hover:-translate-y-0.5"
                  >
                    ▶ {t("মিটে যান", "Join Meet")}
                  </a>
                </div>
                <p className="text-xs text-text/50">
                  {t("নিজের নামে ক্লিক করে হাজিরা দিন।", "Tap your name to mark attendance.")}
                </p>
                {courseStudents.length === 0 ? (
                  <p className="text-sm text-text/45">{t("কোনো শিক্ষার্থী নেই।", "No students enrolled.")}</p>
                ) : (
                  <ul className="grid grid-cols-2 gap-2 md:grid-cols-3">
                    {courseStudents.map((s) => {
                      const roll = Number(s.rollNumber);
                      const present = (courseLive.attendance ?? []).some((a) => a.rollNumber === roll);
                      const busy = toggleBusy === roll;
                      return (
                        <li key={roll}>
                          <button
                            type="button"
                            disabled={busy}
                            onClick={() => toggleAttendance(roll)}
                            className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors disabled:opacity-50 ${
                              present ? "border-ok/40 bg-ok-surface" : "border-text/12 bg-card hover:border-text/25"
                            }`}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block text-[11px] tabular-nums text-text/45">#{roll}</span>
                              <span className="block truncate font-semibold text-text">{s.nameEnglish}</span>
                            </span>
                            <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                              present ? "border-ok bg-ok text-card" : "border-text/25 text-transparent"
                            }`}>
                              <Check className="h-3 w-3" strokeWidth={3} />
                            </span>
                          </button>
                        </li>
                      );
                    })}
                  </ul>
                )}
              </Card>
            </section>
          )}

          {/* ═══════════════════════════════════════
               STUDENT ROSTER — card grid
              ═══════════════════════════════════════ */}
          <section>
            <Eyebrow seal="学" label={t("শিক্ষার্থী", "Students")} detail={`${courseStudents.length}`} />
            {courseStudents.length === 0 ? (
              <Card className="mt-3 p-6 text-center text-sm text-text/50">
                {t("এই কোর্সে এখনো কোনো শিক্ষার্থী নেই।", "No students enrolled in this course yet.")}
              </Card>
            ) : (
              <ul className="mt-3 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-4">
                {courseStudents.map((s) => {
                  const roll = String(s.rollNumber).trim();
                  const expanded = expandedStudent === roll;
                  const attended = (selected.classes ?? []).filter((c) =>
                    c.presentStudents?.some((r) => String(r).trim() === roll),
                  ).length;
                  const totalClasses = selected.classes?.length ?? 0;
                  const rate = totalClasses > 0 ? Math.round((attended / totalClasses) * 100) : null;
                  return (
                    <li key={roll}>
                      <button
                        type="button"
                        onClick={() => setExpandedStudent(expanded ? null : roll)}
                        className={`w-full overflow-hidden rounded-2xl border text-left transition-all focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                          expanded
                            ? "border-text/30 shadow-sm"
                            : "border-text/12 hover:border-text/25 hover:shadow-sm"
                        }`}
                      >
                        <div className="bg-text/[0.03] p-3">
                          <div className="flex items-center gap-2.5">
                            <span className="h-10 w-10 shrink-0 overflow-hidden rounded-xl border border-text/10 bg-background">
                              <Image
                                src={
                                  s.avatarUrl ||
                                  `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(s.nameEnglish || String(s.rollNumber))}`
                                }
                                alt=""
                                width={40}
                                height={40}
                                className="h-full w-full object-cover"
                                unoptimized
                              />
                            </span>
                            <span className="min-w-0">
                              <span className="block truncate text-sm font-bold text-text">{s.nameEnglish}</span>
                              <span className="block font-mono text-[11px] tabular-nums text-text/45">
                                #{roll}
                              </span>
                            </span>
                          </div>
                          <div className="mt-2.5 flex items-center justify-between gap-2">
                            <span className="truncate text-[11px] text-text/50">
                              {s.location || t("অবস্থান নেই", "No location")}
                            </span>
                            {rate !== null && (
                              <span
                                className={`inline-flex shrink-0 items-center gap-1 rounded-lg px-1.5 py-0.5 text-[10px] font-bold tabular-nums ${
                                  rate >= 75 ? "bg-ok/10 text-ok" : rate >= 50 ? "bg-secondary/10 text-secondary" : "bg-danger/10 text-danger"
                                }`}
                              >
                                <Trophy className="h-3 w-3" />
                                {rate}%
                              </span>
                            )}
                          </div>
                        </div>

                        <div className="flex items-center justify-between border-t border-text/10 px-3 py-2">
                          <span className="text-[11px] font-semibold text-text/55">
                            {attended}/{totalClasses} {t("ক্লাস", "classes")}
                          </span>
                          <ChevronDown
                            className={`h-4 w-4 shrink-0 text-text/30 transition-transform ${expanded ? "rotate-180" : ""}`}
                          />
                        </div>

                        {expanded && (
                          <div className="space-y-2 border-t border-text/10 bg-text/[0.02] px-3 py-3 text-xs text-text/60">
                            <p className="flex items-center gap-1.5">
                              <MapPin className="h-3.5 w-3.5 shrink-0 text-text/35" aria-hidden="true" />
                              {s.location || t("অবস্থান নেই", "Location not set")}
                            </p>
                            {s.whatsapp && (
                              <p className="flex items-center gap-1.5">
                                <span className="font-medium text-text/50">WhatsApp:</span>
                                {s.whatsapp}
                              </p>
                            )}
                            <p>
                              <span className="font-medium text-text/50">{t("উপস্থিতি", "Attendance")}:</span>{" "}
                              {attended}/{totalClasses} {t("ক্লাস", "classes")} ·{" "}
                              {rate !== null ? `${rate}%` : t("এখনও নেই", "—")}
                            </p>
                          </div>
                        )}
                      </button>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>

          {/* ═══════════════════════════════════════
               CLASS LOGS — collapsible
              ═══════════════════════════════════════ */}
          <section>
            <Eyebrow seal="录" label={t("ক্লাস লগ", "Class logs")} detail={`${selected.classes?.length ?? 0}`} />
            {!selected.classes || selected.classes.length === 0 ? (
              <Card className="mt-3 p-6 text-center text-sm text-text/50">
                {t("এখনো কোনো ক্লাস লগ নেই।", "No class logs yet.")}
              </Card>
            ) : (
              <div className="mt-3 space-y-2">
                {selected.classes.map((cls, i) => {
                  const present = (cls.presentStudents ?? []).map((r) => String(r).trim());
                  const absent = (cls.absentStudents ?? []).map((r) => String(r).trim());
                  const total = present.length + absent.length;
                  const rate = total > 0 ? Math.round((present.length / total) * 100) : null;
                  return (
                    <details key={cls._id ? String(cls._id) : `${cls.classId}-${i}`} className="group">
                      <Card className="overflow-hidden p-0">
                        <summary className="flex cursor-pointer list-none items-center justify-between gap-3 px-5 py-4 text-sm font-semibold text-text transition-colors hover:bg-text/[0.03]">
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="rounded-md border border-text/15 px-2 py-0.5 text-xs font-bold tabular-nums text-text/70">
                              {cls.classId}
                            </span>
                            <span className="text-xs tabular-nums text-text/50">{cls.date}</span>
                            {cls.time && <span className="text-xs text-text/40">· {cls.time}</span>}
                            {cls.contentCovered && (
                              <span className="inline-flex items-center gap-1 rounded-lg bg-primary/10 px-2 py-0.5 text-[11px] font-bold text-primary">
                                <BookOpen className="h-3 w-3" />
                                {cls.contentCovered.fromLesson === cls.contentCovered.toLesson
                                  ? t(`পাঠ ${cls.contentCovered.fromLesson}`, `Lesson ${cls.contentCovered.fromLesson}`)
                                  : t(`পাঠ ${cls.contentCovered.fromLesson}–${cls.contentCovered.toLesson}`, `Lesson ${cls.contentCovered.fromLesson}–${cls.contentCovered.toLesson}`)}
                              </span>
                            )}
                          </div>
                          <div className="flex items-center gap-3">
                            <span className="text-[11px] tabular-nums text-ok">{present.length} {t("উপস্থিত", "P")}</span>
                            <span className="text-[11px] tabular-nums text-danger">{absent.length} {t("অনুপস্থিত", "A")}</span>
                            {rate !== null && <span className="text-[11px] tabular-nums text-text/40">{rate}%</span>}
                            <ChevronDown className="h-4 w-4 text-text/30 transition-transform group-open:rotate-180" />
                          </div>
                        </summary>
                        <div className="border-t border-text/10 px-5 py-4 space-y-3">
                          {cls.contentCovered ? (
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="inline-flex items-center gap-1.5 rounded-lg bg-primary/10 px-2.5 py-1 text-xs font-bold text-primary">
                                <BookOpen className="h-3 w-3" />
                                {cls.contentCovered.fromLesson === cls.contentCovered.toLesson
                                  ? t(`পাঠ ${cls.contentCovered.fromLesson}`, `Lesson ${cls.contentCovered.fromLesson}`)
                                  : t(`পাঠ ${cls.contentCovered.fromLesson}–${cls.contentCovered.toLesson}`, `Lesson ${cls.contentCovered.fromLesson}–${cls.contentCovered.toLesson}`)}
                              </span>
                              {cls.contentCovered.fromText !== cls.contentCovered.toText && (
                                <span className="text-xs text-text/55">
                                  {t(`টেক্সট ${cls.contentCovered.fromText}–${cls.contentCovered.toText}`, `Text ${cls.contentCovered.fromText}–${cls.contentCovered.toText}`)}
                                </span>
                              )}
                            </div>
                          ) : (
                            <p className="text-sm font-medium text-text">
                              {t("নিয়মিত ক্লাস", "Regular session")}
                            </p>
                          )}
                          {(present.length > 0 || absent.length > 0) && (
                            <div className="grid gap-x-8 gap-y-4 sm:grid-cols-2">
                              {present.length > 0 && (
                                <div className="border-l-2 border-ok/40 pl-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-ok">
                                    {t("উপস্থিত", "Present")} <span className="text-text/40">{present.length}</span>
                                  </p>
                                  <ul className="mt-1.5 space-y-0.5">
                                    {present.map((r) => (
                                      <li key={r} className="text-xs text-text/70">
                                        <span className="font-mono text-[10px] text-text/40">#{r}</span>{" "}
                                        {nameByRoll.get(r) ?? ""}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                              {absent.length > 0 && (
                                <div className="border-l-2 border-danger/40 pl-3">
                                  <p className="text-[10px] font-bold uppercase tracking-wide text-danger">
                                    {t("অনুপস্থিত", "Absent")} <span className="text-text/40">{absent.length}</span>
                                  </p>
                                  <ul className="mt-1.5 space-y-0.5">
                                    {absent.map((r) => (
                                      <li key={r} className="text-xs text-text/70">
                                        <span className="font-mono text-[10px] text-text/40">#{r}</span>{" "}
                                        {nameByRoll.get(r) ?? ""}
                                      </li>
                                    ))}
                                  </ul>
                                </div>
                              )}
                            </div>
                          )}
                        </div>
                      </Card>
                    </details>
                  );
                })}
              </div>
            )}
          </section>

        </div>
      )}

      {/* ═══════════════════════════════════════
           PIN DIALOG
          ═══════════════════════════════════════ */}
      <Dialog
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        title={t("সাব-অ্যাডমিন যাচাই", "Sub-admin verification")}
        description={t(
          "পাসকোড দিয়ে ক্লাস চালু / বন্ধ করুন।",
          "Enter passcode to start or end a class.",
        )}
        size="sm"
      >
        <form onSubmit={submitPin} className="space-y-4">
          <Field
            type="password"
            label={t("পাসকোড", "Passcode")}
            autoFocus
            value={pin}
            error={pinError}
            onChange={(e) => { setPin(e.target.value); setPinError(""); }}
            className="text-center tracking-widest"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setPinOpen(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button type="submit" size="sm">{t("আনলক", "Unlock")}</Button>
          </div>
        </form>
      </Dialog>

      {/* ═══════════════════════════════════════
           CLOSE CLASS DIALOG — lesson number only
          ═══════════════════════════════════════ */}
      <Dialog
        open={closeOpen}
        onClose={() => setCloseOpen(false)}
        title={t("ক্লাস বন্ধ করুন — লগ সেভ", "End class — save log")}
        description={t(
          "শুধু পাঠ নম্বর দিন এবং উপস্থিত শিক্ষার্থী নির্বাচন করুন।",
          "Just enter the lesson number and select present students.",
        )}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCloseOpen(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" variant="danger" loading={closeBusy} onClick={saveClose}>
              {t("সেভ ও বন্ধ", "Save & close")}
            </Button>
          </>
        }
      >
        <div className="space-y-5">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <Field
              type="date"
              label={t("তারিখ", "Date")}
              value={courseLive?.date || new Date().toISOString().slice(0, 10)}
              disabled
            />
            <Field
              label={t("সময়", "Time")}
              hint={t("যেমন: 9:00 PM", "e.g. 9:00 PM")}
              value={closeTime}
              onChange={(e) => setCloseTime(e.target.value)}
            />
          </div>
          <Field
            type="number"
            min={1}
            label={t("পাঠ নম্বর", "Lesson number")}
            value={closeLesson}
            onChange={(e) => setCloseLesson(Number(e.target.value))}
            className="tabular-nums"
          />
          <div>
            <div className="flex items-center justify-between">
              <p className="text-[13px] font-semibold text-text">
                {t("উপস্থিত শিক্ষার্থী", "Present students")}
                <span className="ml-2 text-xs tabular-nums text-text/50">
                  {closePresent.length} / {courseStudents.length}
                </span>
              </p>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                onClick={() => {
                  const all = courseStudents.map((s) => String(s.rollNumber).trim());
                  setClosePresent(closePresent.length === all.length ? [] : all);
                }}
              >
                {closePresent.length === courseStudents.length
                  ? t("সব বাদ", "Clear all")
                  : t("সবাই উপস্থিত", "All present")}
              </Button>
            </div>
            <ul className="mt-3 grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
              {courseStudents.map((s) => {
                const roll = String(s.rollNumber).trim();
                const isPresent = closePresent.includes(roll);
                return (
                  <li key={roll}>
                    <button
                      type="button"
                      onClick={() =>
                        setClosePresent(
                          isPresent
                            ? closePresent.filter((r) => r !== roll)
                            : [...closePresent, roll],
                        )
                      }
                      className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors ${
                        isPresent ? "border-ok/40 bg-ok-surface" : "border-text/12 bg-card hover:border-text/25"
                      }`}
                    >
                      <span className="min-w-0">
                        <span className="block text-[11px] tabular-nums text-text/45">#{roll}</span>
                        <span className="block truncate font-semibold text-text">{s.nameEnglish}</span>
                      </span>
                      <span className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                        isPresent ? "border-ok bg-ok text-card" : "border-text/25 text-transparent"
                      }`}>
                        <Check className="h-3 w-3" strokeWidth={3} />
                      </span>
                    </button>
                  </li>
                );
              })}
            </ul>
          </div>
        </div>
      </Dialog>
    </div>
  );
}
