"use client";

import { useState, useEffect, useCallback } from "react";
import { Plus, RefreshCw, Pencil, Trash2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { AdminShell } from "@/features/academy/components/admin/AdminShell";
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

type ClassRow = { classId: string; contentCovered?: { summary?: string } };
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

const EMPTY: Course = {
  courseId: "",
  courseName: "",
  targetLevel: "HSK 1",
  status: "Coming Soon",
  startDate: "",
  nextBatchRegistrationDate: "",
  totalLessons: 15,
  totalClassesPlanned: 24,
};

export default function AdminCoursesPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const toast = useToast();
  const confirm = useConfirm();

  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);

  const [form, setForm] = useState<Course | null>(null);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/courses", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setCourses(data.courses || []);
    } catch {
      toast(t("কোর্স লোড করা যায়নি।", "Couldn't load courses."), "error");
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  const set = <K extends keyof Course>(key: K, value: Course[K]) =>
    setForm((f) => (f ? { ...f, [key]: value } : f));

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!form) return;
    setSaving(true);
    // Send only the editable scalar fields — never spread embedded classes/exams
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
        fetchCourses();
      } else {
        toast(data.error || data.message || t("সংরক্ষণ হয়নি।", "Save failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setSaving(false);
    }
  };

  const removeCourse = async (c: Course) => {
    const ok = await confirm({
      title: t("কোর্স মুছবেন?", "Delete this course?"),
      message: t(`${c.courseId} এবং এর সব ক্লাস ইতিহাস মুছে যাবে।`, `${c.courseId} and all its class history will be removed.`),
      confirmLabel: t("মুছুন", "Delete"),
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch(`/api/academy/courses/${c.courseId}`, { method: "DELETE" });
      const data = await res.json();
      if (data.success ?? res.ok) {
        toast(t("কোর্স মুছে ফেলা হয়েছে।", "Course deleted."), "success");
        fetchCourses();
      } else toast(data.message || t("মোছা যায়নি।", "Delete failed."), "error");
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    }
  };

  const removeClass = async (courseId: string, classId: string) => {
    const ok = await confirm({
      title: t("ক্লাস লগ মুছবেন?", "Delete class log?"),
      message: `${classId} · ${courseId}`,
      confirmLabel: t("মুছুন", "Delete"),
      destructive: true,
    });
    if (!ok) return;
    try {
      const res = await fetch("/api/academy/classes/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, classId, adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success ?? res.ok) {
        toast(t("ক্লাস লগ মুছে ফেলা হয়েছে।", "Class log deleted."), "success");
        fetchCourses();
      } else toast(data.message || t("মোছা যায়নি।", "Delete failed."), "error");
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    }
  };

  return (
    <AdminShell
      title={t("কোর্স ট্র্যাক", "Course tracks")}
      crumb={t("কোর্স", "Courses")}
      seal="课"
      lede={t("নতুন কোর্স তৈরি করুন, ব্যাচের সময়সূচি সম্পাদনা করুন ও ক্লাস ইতিহাস পরিচালনা করুন।", "Create courses, edit cohort schedules, and manage class history.")}
      actions={
        <>
          <Button
            size="sm"
            iconLeft={<Plus className="h-4 w-4" />}
            onClick={() => {
              setEditing(false);
              setForm({ ...EMPTY });
            }}
          >
            {t("কোর্স যোগ", "Add course")}
          </Button>
          <IconButton label={t("রিফ্রেশ", "Refresh")} size="sm" spinning={loading} onClick={fetchCourses}>
            <RefreshCw className="h-4 w-4" />
          </IconButton>
        </>
      }
    >
      {loading ? (
        <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={2} />
      ) : courses.length === 0 ? (
        <EmptyState title={t("কোনো কোর্স নেই", "No courses")} />
      ) : (
        <div className="grid grid-cols-1 gap-4 md:grid-cols-2">
          {courses.map((c) => (
            <Card key={c.courseId} className="flex flex-col p-5">
              <div className="flex items-start justify-between gap-2">
                <div>
                  <span className="rounded-md border border-text/15 px-2 py-0.5 text-xs font-semibold tabular-nums text-text/70">
                    {c.courseId}
                  </span>
                  <h2 className="mt-2 text-base font-bold text-text">{c.courseName}</h2>
                </div>
                <div className="flex gap-1.5">
                  <IconButton
                    label={t("সম্পাদনা", "Edit")}
                    size="sm"
                    onClick={() => {
                      setEditing(true);
                      setForm({ ...EMPTY, ...c });
                    }}
                  >
                    <Pencil className="h-4 w-4" />
                  </IconButton>
                  <IconButton label={t("মুছুন", "Delete")} size="sm" onClick={() => removeCourse(c)}>
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </div>

              <div className="mt-3 flex flex-wrap items-center gap-2 text-xs text-text/55">
                <StatusPill tone={c.status === "Running" ? "done" : c.status === "Completed" ? "neutral" : "pending"}>
                  {c.status}
                </StatusPill>
                <span className="tabular-nums">{c.targetLevel}</span>
                <span aria-hidden="true">·</span>
                <span className="tabular-nums">{t(`${c.totalLessons} পাঠ`, `${c.totalLessons} lessons`)}</span>
              </div>

              {c.classes && c.classes.length > 0 && (
                <details className="group mt-4 border-t border-text/10 pt-3">
                  <summary className="flex cursor-pointer list-none items-center gap-1 text-xs font-medium text-text/55 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text">
                    {t(`${c.classes.length}টি ক্লাস লগ`, `${c.classes.length} class logs`)}
                  </summary>
                  <ul className="mt-2 space-y-1.5">
                    {c.classes.map((cls) => (
                      <li
                        key={cls.classId}
                        className="flex items-center justify-between gap-2 rounded-lg border border-text/10 bg-text/2 px-2.5 py-1.5 text-[11px]"
                      >
                        <span className="truncate">
                          {cls.classId} · {cls.contentCovered?.summary}
                        </span>
                        <IconButton
                          label={t("ক্লাস লগ মুছুন", "Delete class log")}
                          size="sm"
                          className="h-7 w-7"
                          onClick={() => removeClass(c.courseId, cls.classId)}
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconButton>
                      </li>
                    ))}
                  </ul>
                </details>
              )}
            </Card>
          ))}
        </div>
      )}

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
            <Button size="sm" loading={saving} onClick={submit}>
              {t("সংরক্ষণ", "Save")}
            </Button>
          </>
        }
      >
        {form && (
          <form onSubmit={submit} className="space-y-4">
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
                onChange={(e) => set("totalLessons", Number(e.target.value))}
                className="tabular-nums"
              />
              <Field
                type="number"
                min={1}
                label={t("পরিকল্পিত ক্লাস", "Planned classes")}
                value={form.totalClassesPlanned}
                onChange={(e) => set("totalClassesPlanned", Number(e.target.value))}
                className="tabular-nums"
              />
            </div>
          </form>
        )}
      </Dialog>
    </AdminShell>
  );
}
