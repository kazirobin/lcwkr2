"use client";

import { useState, useEffect, use, useMemo, useCallback } from "react";
import { ArrowLeft, Check, ChevronDown, Lock, Pencil, RefreshCw, Trash2 } from "lucide-react";
import { ICourse, IClassSession, IStudent } from "@/features/academy";
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
  fromLesson: number;
  fromText: number;
  toLesson: number;
  toText: number;
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
  const toast = useToast();
  const confirm = useConfirm();

  const [course, setCourse] = useState<ICourse | null>(null);
  const [allStudents, setAllStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const [adminUnlocked, setAdminUnlocked] = useState(false);
  const [pinOpen, setPinOpen] = useState(false);
  const [pin, setPin] = useState("");
  const [pinError, setPinError] = useState("");

  const [edit, setEdit] = useState<EditForm | null>(null);
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    setAdminUnlocked(sessionStorage.getItem("academy_admin_unlocked") === "true");
  }, []);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [c, s] = await Promise.all([
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (c.success && Array.isArray(c.courses)) {
        setCourse(
          c.courses.find((x: ICourse) => x.courseId.toLowerCase() === courseId.toLowerCase()) ?? null,
        );
      }
      if (s.success && Array.isArray(s.students)) setAllStudents(s.students);
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
    if (pin.trim() === ADMIN_SECRET_PIN.trim()) {
      setAdminUnlocked(true);
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
        fromLesson: cls.contentCovered?.fromLesson ?? 1,
        fromText: cls.contentCovered?.fromText ?? 1,
        toLesson: cls.contentCovered?.toLesson ?? 1,
        toText: cls.contentCovered?.toText ?? 1,
        presentStudents: (cls.presentStudents ?? []).map((r) => String(r).trim()),
      }),
    );

  const saveEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!edit) return;
    setSaving(true);
    const allRolls = enrolled.map((s) => String(s.rollNumber).trim());
    const absent = allRolls.filter((r) => !edit.presentStudents.includes(r));
    try {
      const res = await fetch("/api/academy/classes/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course?.courseId || courseId,
          classId: edit.classId,
          date: edit.date,
          time: edit.time,
          contentCovered: {
            summary: `Lesson ${edit.fromLesson} Text ${edit.fromText} to Lesson ${edit.toLesson} Text ${edit.toText}`,
            fromLesson: edit.fromLesson,
            fromText: edit.fromText,
            toLesson: edit.toLesson,
            toText: edit.toText,
          },
          presentStudents: edit.presentStudents,
          absentStudents: absent,
          adminPasscode: ADMIN_SECRET_PIN,
        }),
      });
      const data = await res.json();
      if (data.success) {
        await fetchData();
        setEdit(null);
        toast(t("ক্লাস লগ আপডেট হয়েছে।", "Class log updated."), "success");
      } else {
        toast(data.message || t("আপডেট হয়নি।", "Update failed."), "error");
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
  const editNum = (key: keyof EditForm, label: string) =>
    edit && (
      <Field
        key={key}
        type="number"
        min={1}
        label={label}
        value={edit[key] as number}
        onChange={(ev) => setEdit({ ...edit, [key]: Number(ev.target.value) })}
        className="tabular-nums"
      />
    );

  return (
    <div className="relative isolate mx-auto max-w-4xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
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

          <section className="mt-10">
            <div className="flex flex-wrap items-center justify-between gap-2">
              <Eyebrow seal="录" label={t("ক্লাস লগ", "Class log")} detail={`${course.classes?.length ?? 0}`} />
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
                              {cls.contentCovered?.summary || t("নিয়মিত ক্লাস", "Regular session")}
                            </p>
                          </div>
                          {adminUnlocked && (
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
        description={t("ক্লাস লগ সম্পাদনা বা মুছতে পাসকোড দিন।", "Enter the passcode to edit or delete class logs.")}
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
        title={edit ? t(`${edit.classId} সম্পাদনা`, `Edit ${edit.classId}`) : ""}
        description={course?.courseName}
        size="lg"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setEdit(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" loading={saving} onClick={saveEdit}>
              {t("আপডেট সংরক্ষণ", "Save changes")}
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
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {editNum("fromLesson", t("পাঠ থেকে", "From lesson"))}
              {editNum("fromText", t("টেক্সট থেকে", "From text"))}
              {editNum("toLesson", t("পাঠ পর্যন্ত", "To lesson"))}
              {editNum("toText", t("টেক্সট পর্যন্ত", "To text"))}
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
    </div>
  );
}
