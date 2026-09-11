"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Check, Pencil, Plus, RefreshCw, Trash2 } from "lucide-react";
import { useLanguage } from "@/i18n";
import { AdminShell } from "@/features/academy";
import {
  Button,
  Card,
  Dialog,
  EmptyState,
  Field,
  IconButton,
  LoadingBlock,
  SelectField,
  StatusPill,
  useConfirm,
  useToast,
} from "@/components/ui";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";
const TEACHER_PASSCODE = process.env.TEACHER_PASSCODE || "2026";

type ClassRow = {
  classId: string;
  date?: string;
  time?: string;
  contentCovered?: {
    summary?: string;
    fromLesson?: number;
    fromText?: number;
    toLesson?: number;
    toText?: number;
  };
  presentStudents?: (string | number)[];
  absentStudents?: (string | number)[];
};

type Course = {
  courseId: string;
  courseName: string;
  targetLevel: string;
  status: string;
  startDate?: string;
  nextBatchRegistrationDate?: string;
  totalLessons: number;
  totalClassesPlanned: number;
  classes?: ClassRow[];
};

type Student = {
  rollNumber: string | number;
  nameEnglish: string;
  enrolledCourseIds?: string[];
  enrolledCourseId?: string;
};

type PendingLog = {
  _id: string;
  courseId: string;
  classId: string;
  date?: string;
  time?: string;
  contentCovered?: { summary?: string };
};

type ClassForm = {
  courseId: string;
  classId: string; // empty for create
  date: string;
  time: string;
  fromLesson: number;
  fromText: number;
  toLesson: number;
  toText: number;
  presentStudents: string[];
};

const EMPTY_COURSE: Course = {
  courseId: "",
  courseName: "",
  targetLevel: "HSK 1",
  status: "Coming Soon",
  startDate: "",
  nextBatchRegistrationDate: "",
  totalLessons: 15,
  totalClassesPlanned: 24,
};

const summaryOf = (f: { fromLesson: number; fromText: number; toLesson: number; toText: number }) =>
  `Lesson ${f.fromLesson} Text ${f.fromText} to Lesson ${f.toLesson} Text ${f.toText}`;

export default function AdminCoursesPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const toast = useToast();
  const confirm = useConfirm();

  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [pendingLogs, setPendingLogs] = useState<PendingLog[]>([]);
  const [loading, setLoading] = useState(true);

  // course dialog
  const [form, setForm] = useState<Course | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  // class log dialog (create + edit share it)
  const [classForm, setClassForm] = useState<ClassForm | null>(null);
  const [savingClass, setSavingClass] = useState(false);
  const [busyLog, setBusyLog] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [crs, stu, pnd] = await Promise.all([
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/classes/pending", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (crs.success) setCourses(crs.courses || []);
      if (stu.success) setStudents(stu.students || []);
      if (pnd.success) setPendingLogs(pnd.pendingClasses || []);
    } catch {
      toast(t("ডেটা লোড করা যায়নি।", "Couldn't load data."), "error");
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    queueMicrotask(() => fetchAll());
  }, [fetchAll]);

  const set = <K extends keyof Course>(key: K, value: Course[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const enrolledFor = useCallback(
    (courseId: string) =>
      students.filter((s) => {
        if (Array.isArray(s.enrolledCourseIds))
          return s.enrolledCourseIds.some((id) => id.toLowerCase() === courseId.toLowerCase());
        return s.enrolledCourseId ? s.enrolledCourseId.toLowerCase() === courseId.toLowerCase() : false;
      }),
    [students],
  );

  // ── course dialog (existing behaviour) ────────────────────────────────
  const submitCourse = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    const payload = {
      courseId: form.courseId,
      courseName: form.courseName,
      targetLevel: form.targetLevel,
      status: form.status,
      startDate: form.startDate,
      nextBatchRegistrationDate: form.nextBatchRegistrationDate,
      totalLessons: Number(form.totalLessons),
      totalClassesPlanned: Number(form.totalClassesPlanned),
    };
    try {
      const res = await fetch(
        editing ? `/api/academy/courses/${form.courseId}` : "/api/academy/courses",
        {
          method: editing ? "PUT" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        },
      );
      const data = await res.json();
      if (data.success ?? res.ok) {
        toast(editing ? t("কোর্স আপডেট হয়েছে।", "Course updated.") : t("কোর্স তৈরি হয়েছে।", "Course created."), "success");
        setForm(null);
        fetchAll();
      } else {
        toast(data.error || data.message || t("সংরক্ষণ হয়নি।", "Save failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setSaving(false);
    }
  };

  // ── class log: create + edit ─────────────────────────────────────────
  const openClassCreate = (courseId: string) =>
    setClassForm({
      courseId,
      classId: "",
      date: new Date().toISOString().slice(0, 10),
      time: "",
      fromLesson: 1,
      fromText: 1,
      toLesson: 1,
      toText: 1,
      presentStudents: [],
    });

  const openClassEdit = (courseId: string, cls: ClassRow) =>
    setClassForm({
      courseId,
      classId: cls.classId,
      date: cls.date ?? "",
      time: cls.time ?? "",
      fromLesson: cls.contentCovered?.fromLesson ?? 1,
      fromText: cls.contentCovered?.fromText ?? 1,
      toLesson: cls.contentCovered?.toLesson ?? 1,
      toText: cls.contentCovered?.toText ?? 1,
      presentStudents: (cls.presentStudents ?? []).map((r) => String(r).trim()),
    });

  const saveClass = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!classForm) return;
    setSavingClass(true);
    const isCreate = !classForm.classId;
    const enrolled = enrolledFor(classForm.courseId).map((s) => String(s.rollNumber).trim());
    const absent = enrolled.filter((r) => !classForm.presentStudents.includes(r));
    try {
      if (isCreate) {
        // 1) create a pending class log
        const res = await fetch("/api/academy/classes", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            teacherPasscode: TEACHER_PASSCODE,
            courseId: classForm.courseId,
            date: classForm.date,
            time: classForm.time,
            contentCovered: {
              summary: summaryOf(classForm),
              fromLesson: classForm.fromLesson,
              fromText: classForm.fromText,
              toLesson: classForm.toLesson,
              toText: classForm.toText,
            },
            presentStudents: classForm.presentStudents,
            absentStudents: absent,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || t("তৈরি হয়নি।", "Create failed."));

        // 2) admin auto-approves so it merges straight into the course
        const ap = await fetch("/api/academy/classes/approve", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ logId: data.classLog._id, action: "APPROVE", adminPasscode: ADMIN_PASSCODE }),
        });
        const apData = await ap.json();
        if (!apData.success) throw new Error(apData.message || t("অনুমোদন হয়নি।", "Approval failed."));

        toast(t("নতুন ক্লাস লগ যোগ হয়েছে।", "New class log added."), "success");
      } else {
        const res = await fetch("/api/academy/classes/edit", {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            courseId: classForm.courseId,
            classId: classForm.classId,
            date: classForm.date,
            time: classForm.time,
            contentCovered: {
              summary: summaryOf(classForm),
              fromLesson: classForm.fromLesson,
              fromText: classForm.fromText,
              toLesson: classForm.toLesson,
              toText: classForm.toText,
            },
            presentStudents: classForm.presentStudents,
            absentStudents: absent,
            adminPasscode: ADMIN_PASSCODE,
          }),
        });
        const data = await res.json();
        if (!data.success) throw new Error(data.message || t("আপডেট হয়নি।", "Update failed."));
        toast(t("ক্লাস লগ আপডেট হয়েছে।", "Class log updated."), "success");
      }

      setClassForm(null);
      fetchAll();
    } catch (err) {
      toast(err instanceof Error ? err.message : t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setSavingClass(false);
    }
  };

  const removeClass = async (courseId: string, classId: string) => {
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
    setBusyLog(`${courseId}-${classId}`);
    try {
      const res = await fetch("/api/academy/classes/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, classId, adminPasscode: ADMIN_PASSCODE }),
      });
      const result = await res.json();
      if (result.success) {
        toast(t("ক্লাস লগ মুছে ফেলা হয়েছে।", "Class log deleted."), "success");
        fetchAll();
      } else {
        toast(result.message || t("মোছা যায়নি।", "Delete failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusyLog(null);
    }
  };

  // ── pending logs: approve / reject from right here ────────────────────
  const actOnLog = async (logId: string, action: "APPROVE" | "REJECT") => {
    if (action === "REJECT") {
      const ok = await confirm({
        title: t("ক্লাস লগ প্রত্যাখ্যান?", "Reject class log?"),
        message: t("এই লগটি মুছে ফেলা হবে।", "This log will be discarded."),
        confirmLabel: t("প্রত্যাখ্যান", "Reject"),
        destructive: true,
      });
      if (!ok) return;
    }
    setBusyLog(logId);
    try {
      const res = await fetch("/api/academy/classes/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, action, adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          action === "APPROVE" ? t("লগ অনুমোদিত — কোর্সে যুক্ত হয়েছে।", "Log approved and merged into the course.") : t("লগ প্রত্যাখ্যাত।", "Log rejected."),
          "success",
        );
        fetchAll();
      } else {
        toast(data.message || t("কাজটি সম্পন্ন হয়নি।", "Action failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusyLog(null);
    }
  };

  const classNum = (key: "fromLesson" | "fromText" | "toLesson" | "toText", label: string) =>
    classForm && (
      <Field
        key={key}
        type="number"
        min={1}
        label={label}
        value={classForm[key]}
        onChange={(e) => setClassForm((f) => (f ? { ...f, [key]: Number(e.target.value) } : f))}
        className="tabular-nums"
      />
    );

  const enrolledInClassForm = useMemo(
    () => (classForm ? enrolledFor(classForm.courseId) : []),
    [classForm, enrolledFor],
  );

  return (
    <AdminShell
      title={t("কোর্স ট্র্যাক", "Course tracks")}
      crumb={t("কোর্স", "Courses")}
      seal="书"
      lede={t(
        "নতুন কোর্স তৈরি করুন, ব্যাচের সময়সূচি সম্পাদনা করুন — প্রতিটি কোর্সের ক্লাস লগ এখান থেকেই তৈরি, সম্পাদনা ও অনুমোদন করুন।",
        "Create courses and edit cohort schedules — create, edit and approve each course's class logs right from here."
      )}
      actions={
        <>
          <Button
            size="sm"
            variant="secondary"
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditing(false);
              setForm({ ...EMPTY_COURSE });
            }}
          >
            {t("নতুন কোর্স", "New course")}
          </Button>
          <IconButton label={t("রিফ্রেশ", "Refresh")} size="sm" spinning={loading} onClick={fetchAll}>
            <RefreshCw className="h-4 w-4" />
          </IconButton>
        </>
      }
    >
      {loading ? (
        <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={3} />
      ) : courses.length === 0 ? (
        <EmptyState
          title={t("কোনো কোর্স নেই", "No courses yet")}
          description={t("প্রথম কোর্সটি তৈরি করুন।", "Create the first course to get started.")}
        />
      ) : (
        <div className="space-y-6">
          {courses.map((c) => {
            const coursePending = pendingLogs.filter(
              (p) => (p.courseId || "").toLowerCase() === c.courseId.toLowerCase(),
            );
            const enrolled = enrolledFor(c.courseId);

            return (
              <Card key={c.courseId} className="p-5">
                {/* course header */}
                <div className="flex flex-wrap items-start justify-between gap-3">
                  <div className="min-w-0">
                    <h2 className="text-base font-bold text-text">{c.courseName}</h2>
                    <p className="mt-0.5 text-xs font-mono tabular-nums text-text/55">
                      {c.courseId} · {c.targetLevel}
                    </p>
                  </div>
                  <div className="flex items-center gap-2">
                    <StatusPill
                      tone={c.status === "Running" ? "done" : c.status === "Completed" ? "neutral" : "pending"}
                    >
                      {c.status}
                    </StatusPill>
                    <IconButton
                      label={t("কোর্স সম্পাদনা", "Edit course")}
                      size="sm"
                      onClick={() => {
                        setEditing(true);
                        setForm({ ...EMPTY_COURSE, ...c });
                      }}
                    >
                      <Pencil className="h-4 w-4" />
                    </IconButton>
                  </div>
                </div>

                <div className="mt-2 flex flex-wrap items-center gap-2 text-xs text-text/55">
                  <span className="tabular-nums">
                    {t(
                      `${(c.classes?.length ?? 0)}/${c.totalClassesPlanned} ক্লাস`,
                      `${c.classes?.length ?? 0}/${c.totalClassesPlanned} classes`,
                    )}
                  </span>
                  <span aria-hidden="true">·</span>
                  <span className="tabular-nums">
                    {enrolled.length} {t("শিক্ষার্থী", "students")}
                  </span>
                </div>

                {/* ── pending logs for this course ── */}
                {coursePending.length > 0 && (
                  <div className="mt-4 rounded-xl border border-warn/30 bg-warn-surface/50 p-3.5">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-warn">
                      {t(
                        `${coursePending.length}টি অপেক্ষমাণ লগ — অনুমোদন দিন`,
                        `${coursePending.length} pending log(s) — approve here`,
                      )}
                    </p>
                    <ul className="mt-2.5 space-y-2">
                      {coursePending.map((log) => (
                        <li
                          key={log._id}
                          className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-warn/25 bg-card px-3 py-2 text-xs"
                        >
                          <span className="min-w-0 truncate">
                            <span className="font-mono font-semibold text-text/70">{log.classId}</span>{" "}
                            · {log.contentCovered?.summary || t("নিয়মিত ক্লাস", "Regular session")} ·{" "}
                            <span className="tabular-nums">{log.date}</span>
                          </span>
                          <span className="flex gap-1.5">
                            <Button
                              size="sm"
                              loading={busyLog === log._id}
                              onClick={() => actOnLog(log._id, "APPROVE")}
                              iconLeft={<Check className="h-3.5 w-3.5" />}
                            >
                              {t("অনুমোদন", "Approve")}
                            </Button>
                            <Button
                              size="sm"
                              variant="danger"
                              disabled={busyLog === log._id}
                              onClick={() => actOnLog(log._id, "REJECT")}
                            >
                              {t("বাতিল", "Reject")}
                            </Button>
                          </span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}

                {/* ── class log list ── */}
                <div className="mt-4 border-t border-text/10 pt-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text/50">
                      {t("ক্লাস লগ", "Class logs")}
                    </p>
                    <Button
                      size="sm"
                      variant="secondary"
                      iconLeft={<Plus className="h-4 w-4" />}
                      onClick={() => openClassCreate(c.courseId)}
                    >
                      {t("নতুন ক্লাস লগ", "New class log")}
                    </Button>
                  </div>

                  {c.classes && c.classes.length > 0 ? (
                    <ul className="mt-2.5 space-y-1.5">
                      {c.classes.map((cls, i) => (
                        <li
                          key={`${cls.classId}-${i}`}
                          className="flex items-center justify-between gap-2 rounded-lg border border-text/10 bg-text/2 px-3 py-2 text-xs"
                        >
                          <span className="min-w-0 truncate">
                            <span className="font-mono font-semibold text-text/70">{cls.classId}</span> ·{" "}
                            {cls.contentCovered?.summary} ·{" "}
                            <span className="tabular-nums">
                              {cls.date} · {(cls.presentStudents ?? []).length}
                            </span>
                          </span>
                          <span className="flex shrink-0 gap-1">
                            <IconButton
                              label={t("সম্পাদনা", "Edit")}
                              size="sm"
                              className="h-7 w-7"
                              onClick={() => openClassEdit(c.courseId, cls)}
                            >
                              <Pencil className="h-3.5 w-3.5" />
                            </IconButton>
                            <IconButton
                              label={t("মুছুন", "Delete")}
                              size="sm"
                              className="h-7 w-7"
                              disabled={busyLog === `${c.courseId}-${cls.classId}`}
                              onClick={() => removeClass(c.courseId, cls.classId)}
                            >
                              <Trash2 className="h-3.5 w-3.5" />
                            </IconButton>
                          </span>
                        </li>
                      ))}
                    </ul>
                  ) : (
                    <p className="mt-2.5 text-xs text-text/45">
                      {t("এখনো কোনো ক্লাস লগ নেই।", "No class logs yet.")}
                    </p>
                  )}
                </div>
              </Card>
            );
          })}
        </div>
      )}

      {/* ── course dialog ── */}
      <Dialog
        open={form !== null}
        onClose={() => setForm(null)}
        title={editing ? t("কোর্স সম্পাদনা", "Edit course") : t("নতুন কোর্স", "New course")}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setForm(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" loading={saving} onClick={submitCourse}>
              {t("সংরক্ষণ", "Save")}
            </Button>
          </>
        }
      >
        {form && (
          <form onSubmit={submitCourse} className="space-y-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                label={t("কোর্স আইডি", "Course id")}
                hint={editing ? t("সম্পাদনার সময় পরিবর্তন করা যায় না।", "Can't change while editing.") : "HSK-101"}
                disabled={editing}
                required
                value={form.courseId}
                onChange={(e) => set("courseId", e.target.value)}
              />
              <Field
                label={t("লক্ষ্য স্তর", "Target level")}
                value={form.targetLevel}
                onChange={(e) => set("targetLevel", e.target.value)}
              />
            </div>
            <Field
              label={t("কোর্সের নাম", "Course name")}
              required
              value={form.courseName}
              onChange={(e) => set("courseName", e.target.value)}
            />
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <SelectField label={t("অবস্থা", "Status")} value={form.status} onChange={(e) => set("status", e.target.value)}>
                <option value="Coming Soon">{t("আসছে", "Coming Soon")}</option>
                <option value="Running">{t("চলমান", "Running")}</option>
                <option value="Completed">{t("সম্পন্ন", "Completed")}</option>
              </SelectField>
              <Field
                type="date"
                label={t("শুরুর তারিখ", "Start date")}
                value={form.startDate ?? ""}
                onChange={(e) => set("startDate", e.target.value)}
              />
            </div>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Field
                label={t("পরবর্তী ভর্তি", "Next intake")}
                hint={t("যেমন: 20 Sept 2026", "e.g. Sept 20, 2026")}
                value={form.nextBatchRegistrationDate ?? ""}
                onChange={(e) => set("nextBatchRegistrationDate", e.target.value)}
              />
              <Field
                type="number"
                min={1}
                label={t("মোট পাঠ", "Total lessons")}
                value={form.totalLessons}
                onChange={(e) =>
                  set("totalLessons", e.target.value === "" ? ("" as unknown as number) : Number(e.target.value))
                }
                className="tabular-nums"
              />
              <Field
                type="number"
                min={1}
                label={t("পরিকল্পিত ক্লাস", "Planned classes")}
                value={form.totalClassesPlanned}
                onChange={(e) =>
                  set("totalClassesPlanned", e.target.value === "" ? ("" as unknown as number) : Number(e.target.value))
                }
                className="tabular-nums"
              />
            </div>
          </form>
        )}
      </Dialog>

      {/* ── class log dialog (create + edit) ── */}
      <Dialog
        open={classForm !== null}
        onClose={() => setClassForm(null)}
        title={
          classForm
            ? classForm.classId
              ? t(`${classForm.classId} সম্পাদনা`, `Edit ${classForm.classId}`)
              : t("নতুন ক্লাস লগ", "New class log")
            : ""
        }
        description={
          classForm
            ? `${courses.find((c) => c.courseId === classForm.courseId)?.courseName ?? classForm.courseId} · ${summaryOf(classForm)}`
            : undefined
        }
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setClassForm(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" loading={savingClass} onClick={saveClass}>
              {classForm?.classId ? t("আপডেট সংরক্ষণ", "Save changes") : t("তৈরি ও যুক্ত করুন", "Create & attach")}
            </Button>
          </>
        }
      >
        {classForm && (
          <form onSubmit={saveClass} className="space-y-5">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <Field
                type="date"
                label={t("তারিখ", "Date")}
                required
                value={classForm.date}
                onChange={(e) => setClassForm({ ...classForm, date: e.target.value })}
              />
              <Field
                label={t("সময়", "Time")}
                hint={t("যেমন: 05:00 PM - 06:30 PM", "e.g. 05:00 PM - 06:30 PM")}
                value={classForm.time}
                onChange={(e) => setClassForm({ ...classForm, time: e.target.value })}
              />
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {classNum("fromLesson", t("পাঠ থেকে", "From lesson"))}
              {classNum("fromText", t("টেক্সট থেকে", "From text"))}
              {classNum("toLesson", t("পাঠ পর্যন্ত", "To lesson"))}
              {classNum("toText", t("টেক্সট পর্যন্ত", "To text"))}
            </div>

            <div>
              <div className="flex items-center justify-between">
                <p className="text-[13px] font-semibold text-text">
                  {t("উপস্থিত শিক্ষার্থী", "Present students")}
                  <span className="ml-2 text-xs tabular-nums text-text/50">
                    {classForm.presentStudents.length} / {enrolledInClassForm.length}
                  </span>
                </p>
                {enrolledInClassForm.length > 0 && (
                  <Button
                    type="button"
                    variant="ghost"
                    size="sm"
                    onClick={() =>
                      setClassForm({
                        ...classForm,
                        presentStudents:
                          classForm.presentStudents.length === enrolledInClassForm.length
                            ? []
                            : enrolledInClassForm.map((s) => String(s.rollNumber).trim()),
                      })
                    }
                  >
                    {classForm.presentStudents.length === enrolledInClassForm.length
                      ? t("সব বাদ", "Clear all")
                      : t("সবাই উপস্থিত", "All present")}
                  </Button>
                )}
              </div>

              {enrolledInClassForm.length === 0 ? (
                <p className="mt-2 text-xs text-text/50">
                  {t(
                    "এই কোর্সে এখনো অনুমোদিত শিক্ষার্থী নেই — উপস্থিতি ছাড়াই লগ তৈরি হবে।",
                    "No approved students in this course yet — the log will be created without attendance.",
                  )}
                </p>
              ) : (
                <ul className="mt-3 grid max-h-64 grid-cols-1 gap-2 overflow-y-auto pr-1 sm:grid-cols-2">
                  {enrolledInClassForm.map((s) => {
                    const roll = String(s.rollNumber).trim();
                    const isPresent = classForm.presentStudents.includes(roll);
                    return (
                      <li key={roll}>
                        <button
                          type="button"
                          aria-pressed={isPresent}
                          onClick={() =>
                            setClassForm({
                              ...classForm,
                              presentStudents: isPresent
                                ? classForm.presentStudents.filter((r) => r !== roll)
                                : [...classForm.presentStudents, roll],
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
              )}
            </div>
          </form>
        )}
      </Dialog>
    </AdminShell>
  );
}
