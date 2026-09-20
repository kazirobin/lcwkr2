"use client";

import { useState, useEffect, use, useMemo, useCallback } from "react";
import { ArrowLeft, Check, ChevronDown, Lock, Pencil, Plus, RefreshCw, Trash2, Radio, ClipboardList, Users, Link2, GraduationCap } from "lucide-react";
import { ICourse, IClassSession, IStudent, ILiveClassView, IStudyGroup, ILiveLink } from "@/features/academy";
import { isSubAdminPasscode } from "@/features/academy/subAdminPasswords";
import { useLanguage } from "@/i18n";
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
  StatusMark,
  StatusPill,
  TextArea,
  useConfirm,
  useToast,
} from "@/components/ui";

const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

interface Props {
  params: Promise<{ id: string }>;
}

type EditForm = {
  classId: string;
  date: string;
  time: string;
  topic: string;
  presentStudents: string[];
};

export default function CourseDetailsPage({ params }: Props) {
  const resolved = use(params);
  const courseId = decodeURIComponent(resolved.id).trim();
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
  const toast = useToast();
  const confirm = useConfirm();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [allStudents, setAllStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);

  // live class + study groups + assignment
  const [live, setLive] = useState<ILiveClassView | null>(null);
  const [groups, setGroups] = useState<IStudyGroup[]>([]);
  const [submitRoll, setSubmitRoll] = useState("");
  const [submitContent, setSubmitContent] = useState("");
  const [submitMsg, setSubmitMsg] = useState<{ ok: boolean; text: string }>({ ok: false, text: "" });
  const [submitBusy, setSubmitBusy] = useState(false);

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [adminPin, setAdminPin] = useState("");
  const [adminIsSub, setAdminIsSub] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const [edit, setEdit] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [toggleBusy, setToggleBusy] = useState<number | null>(null);
  const [closeOpen, setCloseOpen] = useState(false);
  const [closeForm, setCloseForm] = useState({
    date: "",
    time: "",
    topic: "",
    presentStudents: [] as string[],
  });
  const [closeBusy, setCloseBusy] = useState(false);

  // ── start-class (saved Meet links) ─────────────────────────────────────
  const [links, setLinks] = useState<ILiveLink[]>([]);
  const [startLinkId, setStartLinkId] = useState<string>("new");
  const [startMeet, setStartMeet] = useState("");
  const [startTopic, setStartTopic] = useState("");
  const [startBusy, setStartBusy] = useState(false);

  useEffect(() => {
    setAdminUnlocked(sessionStorage.getItem("academy_admin_unlocked") === "true");
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s, liveRes, grpRes, linksRes] = await Promise.all([
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/live", { cache: "no-store" }).then((r) => r.json()),
        fetch(`/api/academy/groups?courseId=${encodeURIComponent(courseId)}`, { cache: "no-store" }).then((r) => r.json()),
        fetch(`/api/academy/live/links?courseId=${encodeURIComponent(courseId)}`, { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (c.success && Array.isArray(c.courses)) {
        setCourse(
          c.courses.find((x: ICourse) => x.courseId.toLowerCase() === courseId.toLowerCase()) ?? null,
        );
      }
      if (s.success && Array.isArray(s.students)) setAllStudents(s.students);

      if (liveRes.success && Array.isArray(liveRes.sessions)) {
        const sessions = liveRes.sessions as ILiveClassView[];
        // prefer an open session for this course, else the latest with marks
        const mine = sessions.filter((s) => s.courseId.toLowerCase() === courseId.toLowerCase());
        const open = mine.find((s) => s.open);
        const closed = mine.filter((s) => !s.open && (s.marks?.length || s.submissions?.length));
        setLive(open ?? closed.sort((a, b) => (a.date < b.date ? 1 : -1))[0] ?? null);
      }
      if (grpRes.success && Array.isArray(grpRes.groups)) setGroups(grpRes.groups);
      if (linksRes.success && Array.isArray(linksRes.links)) setLinks(linksRes.links);
    } catch (err) {
      console.error("Failed to load course:", err);
    } finally {
      setLoading(false);
    }
  }, [courseId]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const code = (course?.courseId || courseId).toLowerCase();
  const enrolled = useMemo(
    () =>
      allStudents.filter((s) => {
        if (Array.isArray(s.enrolledCourseIds))
          return s.enrolledCourseIds.some((id) => id.toLowerCase() === code);
        const legacy = (s as { enrolledCourseId?: string }).enrolledCourseId;
        return legacy ? legacy.toLowerCase() === code : false;
      }),
    [allStudents, code],
  );
  const nameByRoll = useMemo(() => {
    const m = new Map<string, string>();
    allStudents.forEach((s) => m.set(String(s.rollNumber).trim(), s.nameEnglish));
    return m;
  }, [allStudents]);

  const requireAdmin = (then: () => void) => {
    if (adminUnlocked) then();
    else {
      setPin("");
      setPinError("");
      setPinOpen(true);
    }
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

  const openEdit = (cls: IClassSession) =>
    requireAdmin(() =>
      setEdit({
        classId: cls.classId,
        date: cls.date,
        time: cls.time,
        topic: cls.contentCovered?.topic || cls.contentCovered?.summary || "",
        presentStudents: (cls.presentStudents ?? []).map((r) => String(r).trim()),
      }),
    );

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    setSaving(true);
    const allRolls = enrolled.map((s) => String(s.rollNumber).trim());
    const absent = allRolls.filter((r) => !edit.presentStudents.includes(r));
    const isCreate = !edit.classId;
    const payload = {
      date: edit.date,
      time: edit.time,
      contentCovered: {
        topic: edit.topic.trim(),
        summary: edit.topic.trim() || `Class ${edit.date}`,
      },
      presentStudents: edit.presentStudents,
      absentStudents: absent,
    };
    try {
      const res = isCreate
        ? await fetch(`/api/academy/courses/${encodeURIComponent(course?.courseId || courseId)}/classes`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ ...payload, adminPasscode: ADMIN_SECRET_PIN }),
          })
        : await fetch("/api/academy/classes/edit", {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              ...payload,
              courseId: course?.courseId || courseId,
              classId: edit.classId,
              adminPasscode: ADMIN_SECRET_PIN,
            }),
          });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        setEdit(null);
        toast(
          isCreate
            ? t("নতুন ক্লাস লগ যোগ হয়েছে।", "New class log added.")
            : t("ক্লাস লগ আপডেট হয়েছে।", "Class log updated."),
          "success",
        );
      } else {
        toast(data.message || t("সংরক্ষণ হয়নি।", "Save failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setSaving(false);
    }
  };

  const deleteClass = (classId: string) =>
    requireAdmin(async () => {
      const ok = await confirm({
        title: t("ক্লাস লগ মুছবেন?", "Delete this class log?"),
        message: t(
          `${classId} মুছে ফেলা হবে এবং পরের ক্লাসগুলো এক ধাপ এগিয়ে আসবে।`,
          `${classId} will be removed and later classes shift up to fill the gap.`,
        ),
        confirmLabel: t("মুছুন", "Delete"),
        destructive: true,
      });
      if (!ok) return;
      setDeletingId(classId);
      try {
        const res = await fetch("/api/academy/classes/delete", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: course?.courseId || courseId,
            classId,
            adminPasscode: ADMIN_SECRET_PIN,
          }),
        });
        const result = await res.json();
        if (result.success) {
          await fetchData();
          toast(t("ক্লাস লগ মুছে ফেলা হয়েছে।", "Class log deleted."), "success");
        } else {
          toast(result.message || t("মোছা যায়নি।", "Delete failed."), "error");
        }
      } catch {
        toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
      } finally {
        setDeletingId(null);
      }
    });

  const done = course?.classes?.length ?? course?.completedClassesCount ?? 0;
  const planned = course?.totalClassesPlanned || 24;

  const refreshLive = useCallback(async () => {
    try {
      const liveRes = await fetch("/api/academy/live", { cache: "no-store" });
      const ld = await liveRes.json();
      if (ld.success && Array.isArray(ld.sessions)) {
        const sessions = ld.sessions as ILiveClassView[];
        const mine = sessions.filter((s) => s.courseId.toLowerCase() === courseId.toLowerCase());
        const open = mine.find((s) => s.open);
        const closed = mine.filter((s) => !s.open && (s.marks?.length || s.submissions?.length));
        setLive(open ?? closed.sort((a, b) => (a.date < b.date ? 1 : -1))[0] ?? null);
      }
    } catch {
      /* ignore */
    }
  }, [courseId]);

  useEffect(() => {
    const iv = setInterval(refreshLive, 20000);
    return () => clearInterval(iv);
  }, [refreshLive]);

  const toggleAttendance = async (roll: number) => {
    if (!live?.open) return;
    const present = (live.attendance ?? []).some((a) => a.rollNumber === roll);
    setToggleBusy(roll);
    try {
      const res = await fetch("/api/academy/live/attendance", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course?.courseId || courseId,
          rollNumber: roll,
          ...(present ? { action: "unmark" } : {}),
        }),
      });
      const data = await res.json();
      if (data.success) {
        await refreshLive();
        toast(
          present
            ? t("হাজিরা বাতিল হয়েছে।", "Attendance removed.")
            : t("হাজিরা হয়েছে — ধন্যবাদ!", "Attendance marked — thank you!"),
          "success",
        );
      } else {
        toast(data.error || t("সমস্যা হয়েছে।", "Something went wrong."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setToggleBusy(null);
    }
  };

  const openCreate = () =>
    requireAdmin(() => {
      const presentFromLive = (live?.attendance ?? []).map((a) => String(a.rollNumber).trim());
      setEdit({
        classId: "",
        date: live?.date || new Date().toISOString().slice(0, 10),
        time: live?.time || "",
        topic: live?.topic || course?.nextClassTopic || "",
        presentStudents: live?.open ? presentFromLive : [],
      });
    });

  const openClose = () =>
    requireAdmin(() => {
      if (!live) return;
      setCloseForm({
        date: live.date || new Date().toISOString().slice(0, 10),
        time: live.time || "",
        topic: live.topic || course?.nextClassTopic || "",
        presentStudents: (live.attendance ?? []).map((a) => String(a.rollNumber).trim()),
      });
      setCloseOpen(true);
    });

  const startClass = () =>
    requireAdmin(async () => {
      const link = startLinkId === "new" ? null : links.find((l) => l._id === startLinkId);
      const meet = meetHref(link?.meetLink || startMeet);
      const topic = (link?.topic || startTopic).trim();
      if (!meet) {
        toast(t("মিট লিংক দিন বা সিলেক্ট করুন।", "Enter or select a Meet link."), "error");
        return;
      }
      setStartBusy(true);
      try {
        const res = await fetch("/api/academy/live", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "open",
            courseId: course?.courseId || courseId,
            meetLink: meet,
            date: new Date().toISOString().slice(0, 10),
            time: "",
            topic,
            adminPasscode: adminPin || ADMIN_SECRET_PIN,
          }),
        });
        const data = await res.json();
        if (data.success) {
          setStartLinkId("new");
          setStartMeet("");
          setStartTopic("");
          await fetchData();
          toast(t("ক্লাস চালু হয়েছে।", "Class is live."), "success");
        } else {
          toast(data.error || t("চালু হয়নি।", "Failed."), "error");
        }
      } catch {
        toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
      } finally {
        setStartBusy(false);
      }
    });

  const saveClose = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!live) return;
    const allRolls = enrolled.map((s) => String(s.rollNumber).trim());
    const absent = allRolls.filter((r) => !closeForm.presentStudents.includes(r));
    setCloseBusy(true);
    try {
      const res = await fetch("/api/academy/live", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "close-merge",
          id: live._id,
          contentCovered: {
            date: closeForm.date,
            time: closeForm.time,
            topic: closeForm.topic.trim(),
          },
          presentStudents: closeForm.presentStudents,
          absentStudents: absent,
          adminPasscode: adminPin || ADMIN_SECRET_PIN,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setCloseOpen(false);
        await fetchData();
        toast(
          t("ক্লাস বন্ধ হয়েছে এবং ক্লাস লগ সংরক্ষিত হয়েছে।", "Class ended and the class log was saved."),
          "success",
        );
      } else {
        toast(data.error || t("বন্ধ হয়নি।", "Failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setCloseBusy(false);
    }
  };

  const submitAssignment = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!live) return;
    const roll = Number(submitRoll.trim());
    if (!roll || roll <= 0) {
      setSubmitMsg({ ok: false, text: t("রোল নম্বর লিখুন।", "Enter your roll number.") });
      return;
    }
    if (!submitContent.trim()) {
      setSubmitMsg({ ok: false, text: t("অ্যাসাইনমেন্ট লিখুন বা লিংক দিন।", "Write the assignment or paste a link.") });
      return;
    }
    setSubmitBusy(true);
    try {
      const res = await fetch("/api/academy/live/assignment", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ liveClassId: live._id, rollNumber: roll, content: submitContent.trim() }),
      });
      const data = await res.json();
      if (data.success) {
        setSubmitMsg({ ok: true, text: t("অ্যাসাইনমেন্ট জমা দেওয়া হয়েছে।", "Assignment submitted. Thank you!") });
        fetchData();
      } else {
        setSubmitMsg({ ok: false, text: data.error || t("জমা দেওয়া যায়নি।", "Submit failed.") });
      }
    } catch {
      setSubmitMsg({ ok: false, text: t("সমস্যা হয়েছে।", "Something went wrong.") });
    } finally {
      setSubmitBusy(false);
    }
  };

  const myMark = useMemo(() => {
    if (!live || !submitRoll.trim()) return null;
    const roll = Number(submitRoll.trim());
    return (live.marks ?? []).find((m) => m.rollNumber === roll) ?? null;
  }, [live, submitRoll]);
  const editNum = (key: keyof EditForm, label: string) =>
    edit && (
      <Field
        key={key}
        label={label}
        value={String(edit[key])}
        onChange={(ev) => setEdit({ ...edit, [key]: ev.target.value })}
      />
    );

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="课" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("কোর্স", "Courses"), href: "/academy/courses" },
          { label: loading || !course ? courseId : course.courseName },
        ]}
      />

      {loading ? (
        <div className="mt-10">
          <LoadingBlock label={t("কোর্স লোড হচ্ছে", "Loading course")} rows={3} />
        </div>
      ) : !course ? (
        <div className="mt-10">
          <PageHeader
            title={t(`"${courseId}" পাওয়া যায়নি`, `"${courseId}" not found`)}
            lede={t("এই কোর্স আইডিতে কোনো ট্র্যাক নেই।", "No track has this course id.")}
          />
          <ButtonLink href="/academy/courses" variant="secondary" size="sm" className="mt-6" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            {t("কোর্সে ফিরুন", "Back to courses")}
          </ButtonLink>
        </div>
      ) : (
        <>
          <PageHeader
            className="mt-6"
            eyebrow={
              <Eyebrow seal="课" label={course.courseId} detail={course.targetLevel} />
            }
            title={course.courseName}
            lede={t(
              `${course.totalLessons} পাঠ · ${enrolled.length} জন ভর্তি`,
              `${course.totalLessons} lessons · ${enrolled.length} enrolled`,
            )}
            actions={
              <>
                <StatusPill tone={course.status === "Running" ? "done" : "pending"}>
                  {course.status === "Running" ? t("চলমান", "Running") : t("আসছে", "Coming soon")}
                </StatusPill>
                <IconButton
                  label={t("রিফ্রেশ করুন", "Refresh")}
                  size="sm"
                  spinning={loading}
                  onClick={fetchData}
                >
                  <RefreshCw className="h-4 w-4" />
                </IconButton>
              </>
            }
          />

          <Card className="mt-8 p-6">
            <div className="flex items-center justify-between text-sm">
              <span className="text-text/55">{t("সিলেবাসের অগ্রগতি", "Syllabus progress")}</span>
              <span className="font-semibold tabular-nums text-text">
                {done} / {planned} {t("ক্লাস", "classes")}
              </span>
            </div>
            <div className="mt-2">
              <ProgressBar value={done} max={planned} label={t("সিলেবাসের অগ্রগতি", "Syllabus progress")} />
            </div>
          </Card>

          {/* ── registration status ── */}
          {course && (
            <Card className="mt-6 flex flex-wrap items-center justify-between gap-3 p-5">
              <div>
                <p className="text-sm font-bold text-text">
                  {course.registrationOpen
                    ? t("এই কোর্সে ভর্তি চলছে", "Admission is open for this course")
                    : t("এই কোর্সে ভর্তি বন্ধ", "Admission is closed for this course")}
                </p>
                <p className="mt-0.5 text-xs text-text/60">
                  {course.registrationOpen && course.registrationLastDate
                    ? t(`শেষ তারিখ: ${course.registrationLastDate}`, `Last date: ${course.registrationLastDate}`)
                    : course.registrationOpen
                      ? t("কোনো শেষ তারিখ নেই।", "No deadline set.")
                      : course.nextBatchRegistrationDate
                        ? t(
                            `পরবর্তী ভর্তি শুরু হবে: ${course.nextBatchRegistrationDate}`,
                            `Next admission opens: ${course.nextBatchRegistrationDate}`,
                          )
                        : t("অ্যাডমিন পরবর্তী ব্যাচ খুললে জানানো হবে।", "You'll be notified when the admin opens the next batch.")}
                </p>
              </div>
              {course.registrationOpen && (
                <ButtonLink href={`/academy/admission?course=${encodeURIComponent(course.courseId)}`} size="sm" iconRight={<GraduationCap className="h-4 w-4" />}>
                  {t("এখন ভর্তি করুন", "Apply now")}
                </ButtonLink>
              )}
            </Card>
          )}

          {/* ── announced topics ── */}
          {(() => {
            const topics =
              course?.topics && course.topics.length
                ? course.topics
                : course?.nextClassTopic
                  ? [course.nextClassTopic]
                  : [];
            if (!topics.length) return null;
            return (
              <Card className="mt-6 border-secondary/30 bg-secondary/[0.05] p-5">
                <details open>
                  <summary className="flex cursor-pointer list-none items-center justify-between gap-2 text-xs font-bold uppercase tracking-[0.12em] text-secondary">
                    <span className="flex items-center gap-2">
                      <Radio className="h-4 w-4" />
                      {t("ঘোষিত টপিকসমূহ", "Announced topics")} · {topics.length}
                    </span>
                    <ChevronDown className="h-4 w-4 transition-transform [details[open]_&]:rotate-180 motion-reduce:transition-none" />
                  </summary>
                  <ul className="mt-3 space-y-2">
                    {topics.map((tp, i) => (
                      <li
                        key={i}
                        className="rounded-lg border border-secondary/20 bg-background px-3 py-2 text-sm font-semibold text-text"
                      >
                        {tp}
                      </li>
                    ))}
                  </ul>
                </details>
                <p className="mt-2 text-xs text-text/60">
                  {t("এই টপিকগুলো ভালো করে পড়ে ক্লাসে যোগ দিন।", "Study these topics well, then join the class.")}
                </p>
              </Card>
            );
          })()}

          {/* ── study groups ── */}
          {groups.length > 0 && (
            <section className="mt-6">
              <Eyebrow seal="组" label={t("স্টাডি গ্রুপ", "Study groups")} detail={`${groups.length}`} />
              <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2">
                {groups.map((g) => (
                  <Card key={g._id} className="overflow-hidden p-0">
                    <details className="group">
                      <summary className="flex cursor-pointer list-none items-center justify-between gap-2 px-4 py-3 text-sm font-bold text-text">
                        <span>{g.label || t("গ্রুপ", "Group")}</span>
                        <span className="flex items-center gap-2 text-xs font-normal text-text/55">
                          {g.memberRolls.length} {t("জন", "members")}
                          <ChevronDown className="h-4 w-4 transition-transform group-open:rotate-180 motion-reduce:transition-none" />
                        </span>
                      </summary>
                      <ul className="space-y-1 border-t border-text/10 px-4 py-3">
                        {g.memberRolls.map((r) => (
                          <li key={r} className="flex items-baseline gap-2 text-xs">
                            <span className="w-9 shrink-0 font-mono text-[11px] text-text/40">#{r}</span>
                            <span className="text-text/85">
                              {nameByRoll.get(String(r).trim()) ?? t("অজানা শিক্ষার্থী", "Unknown student")}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </Card>
                ))}
              </div>
            </section>
          )}

          {/* ── assignment & marks ── */}
          <section className="mt-10">
            <Eyebrow seal="业" label={t("অ্যাসাইনমেন্ট ও নম্বর", "Assignment & marks")} />
            {!live ? (
              <Card className="mt-4 p-8 text-center text-sm text-text/55">
                {t(
                  "ক্লাস চালু হলে এখানে অ্যাসাইনমেন্ট জমা ও নম্বর দেখা যাবে।",
                  "Assignment submission and marks appear here once a class goes live.",
                )}
              </Card>
            ) : (
              <Card className="mt-4 space-y-5 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-text/55">
                    {t("অ্যাসাইনমেন্ট জমা দিন", "Submit your assignment")}
                  </p>
                  {live.open ? (
                    <form onSubmit={submitAssignment} className="mt-3 space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_1fr]">
                        <Field
                          type="number"
                          min={1}
                          label={t("রোল নম্বর", "Roll number")}
                          value={submitRoll}
                          onChange={(e) => setSubmitRoll(e.target.value)}
                          className="tabular-nums"
                        />
                        <Field
                          label={t("অ্যাসাইনমেন্ট / লিংক", "Assignment / link")}
                          placeholder="https://… or text"
                          value={submitContent}
                          onChange={(e) => setSubmitContent(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button type="submit" size="sm" loading={submitBusy}>
                          {t("জমা দিন", "Submit")}
                        </Button>
                        {submitMsg.text && (
                          <span className={`text-xs font-medium ${submitMsg.ok ? "text-ok" : "text-danger"}`}>
                            {submitMsg.text}
                          </span>
                        )}
                      </div>
                    </form>
                  ) : (
                    <p className="mt-3 text-xs text-text/50">
                      {t(
                        "লাইভ ক্লাস চালু থাকলে অ্যাসাইনমেন্ট জমা দেওয়া যাবে।",
                        "Assignments can be submitted while the live class is running.",
                      )}
                    </p>
                  )}
                  {myMark && (
                    <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ok/10 px-3 py-2 text-sm font-semibold text-ok">
                      <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                      {t(`আপনার নম্বর: ${myMark.mark}`, `Your mark: ${myMark.mark}`)}
                      {myMark.feedback ? (
                        <span className="font-normal text-text/60">— {myMark.feedback}</span>
                      ) : null}
                    </p>
                  )}
                </div>

                {live.submissions && live.submissions.length > 0 && (
                  <div className="border-t border-text/10 pt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-text/55">
                      {t("জমা দেওয়া অ্যাসাইনমেন্ট", "Submitted assignments")} · {live.submissions.length}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {live.submissions.map((sub, i) => {
                        const mark = (live.marks ?? []).find((m) => m.rollNumber === sub.rollNumber);
                        return (
                          <li key={`${sub.rollNumber}-${i}`} className="rounded-xl border border-text/10 bg-card px-3.5 py-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-text">
                                <span className="font-mono text-[11px] text-text/45">#{sub.rollNumber}</span>{" "}
                                {nameByRoll.get(String(sub.rollNumber).trim()) ?? t("অজানা শিক্ষার্থী", "Unknown student")}
                              </span>
                              {mark && (
                                <StatusMark tone="done">
                                  {t("নম্বর", "Mark")}: <span className="tabular-nums">{mark.mark}</span>
                                </StatusMark>
                              )}
                            </div>
                            <p className="mt-1 break-words text-xs text-text/70">{sub.content}</p>
                            {mark?.feedback && (
                              <p className="mt-1 text-[11px] italic text-text/50">
                                {t("মন্তব্য", "Feedback")}: {mark.feedback}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </Card>
            )}
          </section>

          {/* ── live attendance ── */}
          {!live?.open && (
            <section id="attendance" className="mt-10 scroll-mt-24">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Eyebrow seal="到" label={t("ক্লাস চালু করুন", "Start a live class")} />
                {adminUnlocked ? (
                  <StatusMark tone="done">{t("অ্যাডমিন মোড", "Admin mode")}</StatusMark>
                ) : (
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => requireAdmin(() => {})}
                    iconLeft={<Lock className="h-3.5 w-3.5" />}
                  >
                    {t("অ্যাডমিন আনলক", "Admin unlock")}
                  </Button>
                )}
              </div>
              <Card className="mt-4 p-5 space-y-4">
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
                        {l.label ? `${l.label} · ` : ""}
                        {l.meetLink}
                      </option>
                    ))}
                  </select>
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
                    <p className="text-[11px] text-text/45">
                      {t(
                        "ক্লাস চালু করলে এই লিংকটি সংরক্ষিত হবে — পরে আবার ব্যবহার / এডিট / ডিলিট করা যাবে।",
                        "Starting the class saves this link — you can reuse, edit or delete it later.",
                      )}
                    </p>
                  </>
                )}
                {adminUnlocked ? (
                  <Button size="sm" loading={startBusy} iconLeft={<Radio className="h-4 w-4" />} onClick={startClass}>
                    {t("ক্লাস চালু করুন", "Go live")}
                  </Button>
                ) : (
                  <p className="text-xs text-text/45">
                    {t("ক্লাস চালু করতে আগে অ্যাডমিন আনলক করুন।", "Unlock admin first to start a class.")}
                  </p>
                )}
              </Card>
            </section>
          )}

          {live?.open && (
            <section id="attendance" className="mt-10 scroll-mt-24">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <Eyebrow
                  seal="到"
                  label={t("লাইভ হাজিরা", "Live attendance")}
                  detail={`${(live.attendance ?? []).length}/${enrolled.length}`}
                />
                <div className="flex items-center gap-2">
                  <span className="inline-flex items-center gap-1.5 rounded-full border border-danger/40 bg-danger/10 px-2.5 py-1 text-[10px] font-bold uppercase tracking-wide text-danger">
                    <Radio className="h-3 w-3" />
                    {t("ক্লাস চলছে", "Class is running")}
                  </span>
                  <Button variant="danger" size="sm" onClick={openClose} iconLeft={<Radio className="h-4 w-4" />}>
                    {t("ক্লাস শেষ ও লগ সেভ", "End class & save log")}
                  </Button>
                </div>
              </div>
              <Card className="mt-4 p-5">
                <p className="text-xs text-text/55">
                  {t(
                    "নিজের নামে ক্লিক করে হাজিরা দিন — আবার ক্লিক করলে বাতিল হবে।",
                    "Click your own name to mark attendance — click again to undo.",
                  )}
                </p>
                {enrolled.length === 0 ? (
                  <p className="mt-4 text-sm text-text/45">
                    {t("এই কোর্সে এখনো কোনো ছাত্র ভর্তি হয়নি।", "No students enrolled yet.")}
                  </p>
                ) : (
                  <ul className="mt-4 grid grid-cols-2 gap-2 md:grid-cols-3">
                    {enrolled.map((s) => {
                      const roll = Number(s.rollNumber);
                      const present = (live.attendance ?? []).some((a) => a.rollNumber === roll);
                      const busy = toggleBusy === roll;
                      return (
                        <li key={roll}>
                          <button
                            type="button"
                            aria-pressed={present}
                            disabled={busy}
                            onClick={() => toggleAttendance(roll)}
                            className={`flex w-full items-center gap-2 rounded-xl border px-3 py-2 text-left text-sm transition-colors disabled:opacity-50 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                              present ? "border-ok/40 bg-ok-surface" : "border-text/12 bg-card hover:border-text/25"
                            }`}
                          >
                            <span className="min-w-0 flex-1">
                              <span className="block text-[11px] tabular-nums text-text/45">#{roll}</span>
                              <span className="block truncate font-semibold text-text">{s.nameEnglish}</span>
                            </span>
                            <span
                              aria-hidden="true"
                              className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                                present ? "border-ok bg-ok text-card" : "border-text/25 text-transparent"
                              }`}
                            >
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

          {/* ── assignment & marks ── */}
          <section className="mt-10">
            <Eyebrow seal="业" label={t("অ্যাসাইনমেন্ট ও নম্বর", "Assignment & marks")} />
            {!live ? (
              <Card className="mt-4 p-8 text-center text-sm text-text/55">
                {t(
                  "ক্লাস চালু হলে এখানে অ্যাসাইনমেন্ট জমা ও নম্বর দেখা যাবে।",
                  "Assignment submission and marks appear here once a class goes live.",
                )}
              </Card>
            ) : (
              <Card className="mt-4 space-y-5 p-5">
                <div>
                  <p className="text-xs font-bold uppercase tracking-[0.12em] text-text/55">
                    {t("অ্যাসাইনমেন্ট জমা দিন", "Submit your assignment")}
                  </p>
                  {live.open ? (
                    <form onSubmit={submitAssignment} className="mt-3 space-y-3">
                      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[10rem_1fr]">
                        <Field
                          type="number"
                          min={1}
                          label={t("রোল নম্বর", "Roll number")}
                          value={submitRoll}
                          onChange={(e) => setSubmitRoll(e.target.value)}
                          className="tabular-nums"
                        />
                        <Field
                          label={t("অ্যাসাইনমেন্ট / লিংক", "Assignment / link")}
                          placeholder="https://… or text"
                          value={submitContent}
                          onChange={(e) => setSubmitContent(e.target.value)}
                        />
                      </div>
                      <div className="flex flex-wrap items-center gap-3">
                        <Button type="submit" size="sm" loading={submitBusy}>
                          {t("জমা দিন", "Submit")}
                        </Button>
                        {submitMsg.text && (
                          <span className={`text-xs font-medium ${submitMsg.ok ? "text-ok" : "text-danger"}`}>
                            {submitMsg.text}
                          </span>
                        )}
                      </div>
                    </form>
                  ) : (
                    <p className="mt-3 text-xs text-text/50">
                      {t(
                        "লাইভ ক্লাস চালু থাকলে অ্যাসাইনমেন্ট জমা দেওয়া যাবে।",
                        "Assignments can be submitted while the live class is running.",
                      )}
                    </p>
                  )}
                  {myMark && (
                    <p className="mt-3 inline-flex items-center gap-2 rounded-lg bg-ok/10 px-3 py-2 text-sm font-semibold text-ok">
                      <Check className="h-4 w-4" strokeWidth={3} aria-hidden="true" />
                      {t(`আপনার নম্বর: ${myMark.mark}`, `Your mark: ${myMark.mark}`)}
                      {myMark.feedback ? (
                        <span className="font-normal text-text/60">— {myMark.feedback}</span>
                      ) : null}
                    </p>
                  )}
                </div>

                {live.submissions && live.submissions.length > 0 && (
                  <div className="border-t border-text/10 pt-4">
                    <p className="text-xs font-bold uppercase tracking-[0.12em] text-text/55">
                      {t("জমা দেওয়া অ্যাসাইনমেন্ট", "Submitted assignments")} · {live.submissions.length}
                    </p>
                    <ul className="mt-3 space-y-2">
                      {live.submissions.map((sub, i) => {
                        const mark = (live.marks ?? []).find((m) => m.rollNumber === sub.rollNumber);
                        return (
                          <li key={`${sub.rollNumber}-${i}`} className="rounded-xl border border-text/10 bg-card px-3.5 py-2.5">
                            <div className="flex flex-wrap items-center justify-between gap-2">
                              <span className="text-sm font-semibold text-text">
                                <span className="font-mono text-[11px] text-text/45">#{sub.rollNumber}</span>{" "}
                                {nameByRoll.get(String(sub.rollNumber).trim()) ?? t("অজানা শিক্ষার্থী", "Unknown student")}
                              </span>
                              {mark && (
                                <StatusMark tone="done">
                                  {t("নম্বর", "Mark")}: <span className="tabular-nums">{mark.mark}</span>
                                </StatusMark>
                              )}
                            </div>
                            <p className="mt-1 break-words text-xs text-text/70">{sub.content}</p>
                            {mark?.feedback && (
                              <p className="mt-1 text-[11px] italic text-text/50">
                                {t("মন্তব্য", "Feedback")}: {mark.feedback}
                              </p>
                            )}
                          </li>
                        );
                      })}
                    </ul>
                  </div>
                )}
              </Card>
            )}
          </section>

          <section className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Eyebrow seal="录" label={t("ক্লাস লগ", "Class log")} detail={`${course.classes?.length ?? 0}`} />
              {adminUnlocked && !adminIsSub && (
                <div className="flex items-center gap-2">
                  <Button size="sm" onClick={openCreate} iconLeft={<Plus className="h-4 w-4" />}>
                    {t("নতুন ক্লাস লগ", "Add class log")}
                  </Button>
                  <StatusMark tone="done">{t("অ্যাডমিন মোড", "Admin mode")}</StatusMark>
                </div>
              )}
              {adminUnlocked && adminIsSub && (
                <StatusMark tone="done">{t("সাব-অ্যাডমিন মোড", "Sub-admin mode")}</StatusMark>
              )}
              {!adminUnlocked && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => requireAdmin(() => {})}
                  iconLeft={<Lock className="h-3.5 w-3.5" />}
                >
                  {t("অ্যাডমিন আনলক", "Admin unlock")}
                </Button>
              )}
            </div>

            {!course.classes || course.classes.length === 0 ? (
              <Card className="mt-4 p-8 text-center text-sm text-text/55">
                {t("এই ব্যাচে এখনও কোনো ক্লাস লগ করা হয়নি।", "No classes logged for this cohort yet.")}
              </Card>
            ) : (
              <ul className="mt-4 space-y-3">
                {course.classes.map((cls, i) => {
                  const present = (cls.presentStudents ?? []).map((r) => String(r).trim());
                  const absent = (cls.absentStudents ?? []).map((r) => String(r).trim());
                  const total = present.length + absent.length;
                  const rate = total > 0 ? Math.round((present.length / total) * 100) : null;
                  // name-first, alphabetical; students no longer on the roster sink to the bottom by roll
                  const roster = (rolls: string[]) =>
                    rolls
                      .map((r) => ({ roll: r, name: nameByRoll.get(r) ?? null }))
                      .sort((a, b) => {
                        if (a.name && b.name) return a.name.localeCompare(b.name);
                        if (a.name) return -1;
                        if (b.name) return 1;
                        return Number(a.roll) - Number(b.roll);
                      });
                  const groups = [
                    { key: "present", label: t("উপস্থিত", "Present"), rows: roster(present), rule: "border-ok/40", ink: "text-ok" },
                    { key: "absent", label: t("অনুপস্থিত", "Absent"), rows: roster(absent), rule: "border-danger/40", ink: "text-danger" },
                  ];
                  return (
                    <li key={cls._id ? String(cls._id) : `${cls.classId}-${i}`}>
                      <Card className="p-5">
                        <div className="flex flex-wrap items-start justify-between gap-3">
                          <div className="min-w-0">
                            <div className="flex flex-wrap items-center gap-2">
                              <span className="rounded-md border border-text/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-text/70">
                                {cls.classId}
                              </span>
                              <span className="text-xs tabular-nums text-text/50">{cls.date}</span>
                              <span className="text-xs text-text/40">·</span>
                              <span className="text-xs text-text/50">{cls.time}</span>
                            </div>
                            <p className="mt-2 text-sm font-semibold text-text">
                              {cls.contentCovered?.topic ||
                                cls.contentCovered?.summary ||
                                t("নিয়মিত ক্লাস", "Regular session")}
                            </p>
                          </div>
                          {adminUnlocked && !adminIsSub && (
                            <div className="flex gap-1.5">
                              <IconButton label={t("সম্পাদনা", "Edit")} size="sm" onClick={() => openEdit(cls)}>
                                <Pencil className="h-4 w-4" />
                              </IconButton>
                              <IconButton
                                label={t("মুছুন", "Delete")}
                                size="sm"
                                spinning={deletingId === cls.classId}
                                onClick={() => deleteClass(cls.classId)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </IconButton>
                            </div>
                          )}
                        </div>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-1 border-t border-text/10 pt-3 text-xs">
                          <StatusMark tone="done">
                            {t("উপস্থিত", "Present")} <span className="tabular-nums">{present.length}</span>
                          </StatusMark>
                          <StatusMark tone="closed">
                            {t("অনুপস্থিত", "Absent")} <span className="tabular-nums">{absent.length}</span>
                          </StatusMark>
                          {rate !== null && (
                            <span className="ml-auto tabular-nums text-text/45">
                              {rate}% {t("উপস্থিতি", "attendance")}
                            </span>
                          )}
                        </div>

                        {total > 0 && (
                          <details className="group mt-2">
                            <summary className="-mx-1 flex w-fit cursor-pointer list-none items-center gap-1.5 rounded-md px-1 py-1.5 text-xs font-medium text-text/55 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text">
                              <ChevronDown className="h-3.5 w-3.5 transition-transform group-open:rotate-180 motion-reduce:transition-none" aria-hidden="true" />
                              <span className="group-open:hidden">{t("রোল কল দেখুন", "Show roll call")}</span>
                              <span className="hidden group-open:inline">{t("রোল কল লুকান", "Hide roll call")}</span>
                            </summary>
                            <div className="mt-3 grid gap-x-8 gap-y-5 sm:grid-cols-2">
                              {groups.map((group) =>
                                group.rows.length === 0 ? null : (
                                  <div key={group.key} className={`border-l-2 ${group.rule} pl-3`}>
                                    <p className={`text-[10px] font-semibold uppercase tracking-wide ${group.ink}`}>
                                      {group.label}
                                      <span className="ml-1.5 tabular-nums text-text/40">{group.rows.length}</span>
                                    </p>
                                    <ul className="mt-2 space-y-1">
                                      {group.rows.map((m) => (
                                        <li key={m.roll} className="flex items-baseline gap-2 text-xs leading-relaxed">
                                          <span className="w-9 shrink-0 tabular-nums text-[11px] text-text/40">
                                            #{m.roll}
                                          </span>
                                          <span className={m.name ? "text-text/80" : "text-text/45 italic"}>
                                            {m.name ?? t("অজানা শিক্ষার্থী", "Unknown student")}
                                          </span>
                                        </li>
                                      ))}
                                    </ul>
                                  </div>
                                ),
                              )}
                            </div>
                          </details>
                        )}
                      </Card>
                    </li>
                  );
                })}
              </ul>
            )}
          </section>
        </>
      )}

      {/* Admin PIN */}
      <Dialog
        open={pinOpen}
        onClose={() => setPinOpen(false)}
        title={t("অ্যাডমিন যাচাই", "Admin verification")}
        description={t(
          "ক্লাস চালু / জমা দিতে অ্যাডমিন বা সাব-অ্যাডমিন পাসকোড দিন। লগ এডিট/ডিলিট শুধু অ্যাডমিনের।",
          "Enter the admin or sub-admin passcode to start or submit a class. Editing/deleting logs is admin-only.",
        )}
        size="sm"
      >
        <form onSubmit={submitPin} className="space-y-4">
          <Field
            type="password"
            label={t("অ্যাডমিন পাসকোড", "Admin passcode")}
            autoFocus
            value={pin}
            error={pinError}
            onChange={(e) => {
              setPin(e.target.value);
              setPinError("");
            }}
            className="text-center tracking-widest"
          />
          <div className="flex justify-end gap-2">
            <Button type="button" variant="secondary" size="sm" onClick={() => setPinOpen(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button type="submit" size="sm">
              {t("আনলক", "Unlock")}
            </Button>
          </div>
        </form>
      </Dialog>

      {/* Edit class */}
      <Dialog
        open={edit !== null}
        onClose={() => setEdit(null)}
        title={
          edit
            ? edit.classId
              ? t(`${edit.classId} সম্পাদনা`, `Edit ${edit.classId}`)
              : t("নতুন ক্লাস লগ", "New class log")
            : ""
        }
        description={course?.courseName}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setEdit(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" loading={saving} onClick={saveEdit}>
              {edit?.classId ? t("আপডেট সংরক্ষণ", "Save changes") : t("লগ যোগ করুন", "Add log")}
            </Button>
          </>
        }
      >
        {edit && (
          <form onSubmit={saveEdit} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                type="date"
                label={t("তারিখ", "Date")}
                value={edit.date}
                onChange={(e) => setEdit({ ...edit, date: e.target.value })}
              />
              <Field
                label={t("সময়", "Time")}
                value={edit.time}
                onChange={(e) => setEdit({ ...edit, time: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              {editNum("topic", t("আজকের বিষয়", "Today's topic"))}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-text">
                  {t("উপস্থিত শিক্ষার্থী", "Present students")}
                  <span className="ml-2 text-xs tabular-nums text-text/50">
                    {edit.presentStudents.length} / {enrolled.length}
                  </span>
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() =>
                    setEdit({
                      ...edit,
                      presentStudents:
                        edit.presentStudents.length === enrolled.length
                          ? []
                          : enrolled.map((s) => String(s.rollNumber).trim()),
                    })
                  }
                >
                  {edit.presentStudents.length === enrolled.length
                    ? t("সব বাদ", "Clear all")
                    : t("সবাই উপস্থিত", "All present")}
                </Button>
              </div>
              <ul className="mt-3 grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                {enrolled.map((s) => {
                  const roll = String(s.rollNumber).trim();
                  const isPresent = edit.presentStudents.includes(roll);
                  return (
                    <li key={roll}>
                      <button
                        type="button"
                        aria-pressed={isPresent}
                        onClick={() =>
                          setEdit({
                            ...edit,
                            presentStudents: isPresent
                              ? edit.presentStudents.filter((r) => r !== roll)
                              : [...edit.presentStudents, roll],
                          })
                        }
                        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                          isPresent ? "border-ok/40 bg-ok-surface" : "border-text/12 bg-card hover:border-text/25"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block text-[11px] tabular-nums text-text/45">#{roll}</span>
                          <span className="block truncate font-semibold text-text">{s.nameEnglish}</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isPresent ? "border-ok bg-ok text-card" : "border-text/25 text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </form>
        )}
      </Dialog>

      {/* End class */}
      <Dialog
        open={closeOpen}
        onClose={() => setCloseOpen(false)}
        title={t("ক্লাস শেষ করুন — ক্লাস লগ পূরণ করে সংরক্ষণ করুন", "End class — fill the class log & save")}
        description={t(
          "উপস্থিত তালিকা হাজিরা থেকে আগেই বসে আছে, সম্পাদনা করতে পারেন। সংরক্ষণ করলে ক্লাস বন্ধ হয়ে লগ তৈরি হবে।",
          "The present list is pre-filled from attendance — adjust it if needed. Saving ends the class and creates the log.",
        )}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setCloseOpen(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" variant="danger" loading={closeBusy} onClick={saveClose} iconLeft={<Radio className="h-4 w-4" />}>
              {t("সংরক্ষণ ও ক্লাস বন্ধ", "Save & end class")}
            </Button>
          </>
        }
      >
        {closeOpen && (
          <form onSubmit={saveClose} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                type="date"
                label={t("তারিখ", "Date")}
                value={closeForm.date}
                onChange={(e) => setCloseForm({ ...closeForm, date: e.target.value })}
              />
              <Field
                label={t("সময়", "Time")}
                hint={t("যেমন: 9:00 PM - 10:10 PM", "e.g. 9:00 PM - 10:10 PM")}
                value={closeForm.time}
                onChange={(e) => setCloseForm({ ...closeForm, time: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-1 gap-3">
              <Field
                label={t("আজকের বিষয়", "Today's topic")}
                hint={t("যেমন: HSK 3 Lesson 4 — Weather", "e.g. HSK 3 Lesson 4 — Weather")}
                value={closeForm.topic}
                onChange={(e) => setCloseForm({ ...closeForm, topic: e.target.value })}
                placeholder={t("ক্লাসের বিষয় লিখুন", "Enter the class topic")}
              />
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-text">
                  {t("উপস্থিত শিক্ষার্থী", "Present students")}
                  <span className="ml-2 text-xs tabular-nums text-text/50">
                    {closeForm.presentStudents.length} / {enrolled.length}
                  </span>
                </p>
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    const all = enrolled.map((s) => String(s.rollNumber).trim());
                    setCloseForm({
                      ...closeForm,
                      presentStudents: closeForm.presentStudents.length === all.length ? [] : all,
                    });
                  }}
                >
                  {closeForm.presentStudents.length === enrolled.length
                    ? t("সব বাদ", "Clear all")
                    : t("সবাই উপস্থিত", "All present")}
                </Button>
              </div>
              <ul className="mt-3 grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                {enrolled.map((s) => {
                  const roll = String(s.rollNumber).trim();
                  const isPresent = closeForm.presentStudents.includes(roll);
                  return (
                    <li key={roll}>
                      <button
                        type="button"
                        aria-pressed={isPresent}
                        onClick={() =>
                          setCloseForm({
                            ...closeForm,
                            presentStudents: isPresent
                              ? closeForm.presentStudents.filter((r) => r !== roll)
                              : [...closeForm.presentStudents, roll],
                          })
                        }
                        className={`flex w-full items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-left text-sm transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                          isPresent ? "border-ok/40 bg-ok-surface" : "border-text/12 bg-card hover:border-text/25"
                        }`}
                      >
                        <span className="min-w-0">
                          <span className="block text-[11px] tabular-nums text-text/45">#{roll}</span>
                          <span className="block truncate font-semibold text-text">{s.nameEnglish}</span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex h-5 w-5 shrink-0 items-center justify-center rounded-full border ${
                            isPresent ? "border-ok bg-ok text-card" : "border-text/25 text-transparent"
                          }`}
                        >
                          <Check className="h-3 w-3" strokeWidth={3} />
                        </span>
                      </button>
                    </li>
                  );
                })}
              </ul>
            </div>
          </form>
        )}
      </Dialog>
    </div>
  );
}
