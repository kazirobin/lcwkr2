"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { useRouter } from "next/navigation";
import { Check, Users } from "lucide-react";
import { ICourse, IStudent } from "@/features/academy/types";
import { useLanguage } from "@/i18n/LanguageContext";
import {
  Breadcrumb,
  Button,
  Card,
  EmptyState,
  Eyebrow,
  Field,
  LoadingBlock,
  PageHeader,
  SectionHanzi,
  SelectField,
  useToast,
} from "@/components/ui";

const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

export default function TeacherClassLogPage() {
  const router = useRouter();
  const toast = useToast();
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const [courseId, setCourseId] = useState("");
  const [passcode, setPasscode] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00 PM - 10:10 PM");
  const [range, setRange] = useState({ fromLesson: 1, fromText: 1, toLesson: 1, toText: 2 });
  const [presentRolls, setPresentRolls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    (async () => {
      setLoading(true);
      try {
        const [c, s] = await Promise.all([
          fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
          fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        ]);
        if (c.success && c.courses?.length) {
          setCourses(c.courses);
          setCourseId(c.courses[0].courseId);
        }
        if (s.success && s.students) setStudents(s.students);
      } catch {
        toast(t("তথ্য লোড করা যায়নি।", "Couldn't load data."), "error");
      } finally {
        setLoading(false);
      }
    })();
  }, [t, toast]);

  const enrolled = useMemo(() => {
    const code = courseId.toLowerCase();
    return students.filter((s) => {
      if (Array.isArray(s.enrolledCourseIds))
        return s.enrolledCourseIds.some((id) => id.toLowerCase() === code);
      const legacy = (s as { enrolledCourseId?: string }).enrolledCourseId;
      return legacy ? legacy.toLowerCase() === code : false;
    });
  }, [students, courseId]);

  const allRolls = useMemo(() => enrolled.map((s) => String(s.rollNumber).trim()), [enrolled]);
  const allPresent = allRolls.length > 0 && presentRolls.length === allRolls.length;

  const toggle = (roll: string) =>
    setPresentRolls((prev) =>
      prev.includes(roll) ? prev.filter((r) => r !== roll) : [...prev, roll],
    );

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    const absent = allRolls.filter((r) => !presentRolls.includes(r));
    const summary = `Lesson ${range.fromLesson} Text ${range.fromText} to Lesson ${range.toLesson} Text ${range.toText}`;
    try {
      const res = await fetch("/api/academy/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherPasscode: passcode || ADMIN_SECRET_PIN,
          courseId,
          date,
          time,
          contentCovered: { summary, ...range },
          presentStudents: presentRolls,
          absentStudents: absent,
        }),
      });
      const result = await res.json();
      if (result.success) {
        toast(t("ক্লাস লগ জমা হয়েছে — অনুমোদনের অপেক্ষায়।", "Class log submitted for approval."), "success");
        router.push("/academy");
      } else {
        toast(result.message || t("জমা হয়নি।", "Submission failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে, আবার চেষ্টা করুন।", "Something went wrong. Try again."), "error");
    } finally {
      setSubmitting(false);
    }
  };

  const num = (key: keyof typeof range, label: string) => (
    <Field
      key={key}
      type="number"
      min={1}
      label={label}
      value={range[key]}
      onChange={(e) => setRange((r) => ({ ...r, [key]: Number(e.target.value) }))}
      className="tabular-nums"
    />
  );

  return (
    <div className="relative isolate mx-auto max-w-3xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="堂" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("ক্লাস লগ", "Class log") },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={<Eyebrow seal="堂" label={t("শিক্ষক", "Teacher")} detail={t("শুধু স্টাফ", "Staff only")} />}
        title={t("ক্লাস সেশন লগ করুন", "Log a class session")}
        lede={t(
          "লাইভ ব্যাচের অগ্রগতি ও উপস্থিতি রেকর্ড করুন। জমা দেওয়ার পর অ্যাডমিন অনুমোদন করবেন।",
          "Record progress and attendance for a live cohort. An admin approves it after you submit.",
        )}
      />

      <div className="mt-10">
        {loading ? (
          <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={2} />
        ) : courses.length === 0 ? (
          <EmptyState title={t("কোনো ব্যাচ নেই", "No cohorts")} />
        ) : (
          <form onSubmit={handleSubmit} className="space-y-6">
            <Card className="space-y-5 p-6">
              <Field
                type="password"
                label={t("শিক্ষক / অ্যাডমিন পাসকোড", "Teacher / admin passcode")}
                hint={t("এই ফর্মটি শুধু ক্লাস পরিচালনাকারীদের জন্য।", "This form is for whoever runs the class.")}
                required
                value={passcode}
                onChange={(e) => setPasscode(e.target.value)}
                className="tracking-widest"
                autoComplete="off"
              />
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                <SelectField
                  label={t("কোর্স ট্র্যাক", "Course track")}
                  value={courseId}
                  onChange={(e) => {
                    setCourseId(e.target.value);
                    setPresentRolls([]);
                  }}
                >
                  {courses.map((c) => (
                    <option key={c.courseId} value={c.courseId}>
                      {c.courseId} — {c.courseName}
                    </option>
                  ))}
                </SelectField>
                <Field
                  type="date"
                  label={t("ক্লাসের তারিখ", "Class date")}
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                />
              </div>
              <Field
                label={t("ক্লাসের সময়", "Class time")}
                value={time}
                onChange={(e) => setTime(e.target.value)}
              />
            </Card>

            <Card className="p-6">
              <Eyebrow label={t("সিলেবাসের অগ্রগতি", "Syllabus covered")} />
              <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-4">
                {num("fromLesson", t("পাঠ থেকে", "From lesson"))}
                {num("fromText", t("টেক্সট থেকে", "From text"))}
                {num("toLesson", t("পাঠ পর্যন্ত", "To lesson"))}
                {num("toText", t("টেক্সট পর্যন্ত", "To text"))}
              </div>
            </Card>

            <Card className="p-6">
              <div className="flex flex-wrap items-center justify-between gap-3 border-b border-text/10 pb-4">
                <div className="flex items-center gap-2">
                  <Users className="h-5 w-5 text-text/40" aria-hidden="true" />
                  <div>
                    <h2 className="text-sm font-bold text-text">
                      {t("উপস্থিত শিক্ষার্থী চিহ্নিত করুন", "Mark present students")}
                    </h2>
                    <p className="mt-0.5 text-xs tabular-nums text-text/55">
                      {t(
                        `উপস্থিত ${presentRolls.length} · অনুপস্থিত ${enrolled.length - presentRolls.length} · মোট ${enrolled.length}`,
                        `${presentRolls.length} present · ${enrolled.length - presentRolls.length} absent · ${enrolled.length} total`,
                      )}
                    </p>
                  </div>
                </div>
                {enrolled.length > 0 && (
                  <Button
                    type="button"
                    variant="secondary"
                    size="sm"
                    aria-pressed={allPresent}
                    onClick={() => setPresentRolls(allPresent ? [] : allRolls)}
                  >
                    {allPresent ? t("সব বাদ দিন", "Clear all") : t("সবাইকে উপস্থিত", "Mark all present")}
                  </Button>
                )}
              </div>

              {enrolled.length === 0 ? (
                <p className="py-8 text-center text-xs text-text/45">
                  {t("এই ট্র্যাকে এখনও কোনো শিক্ষার্থী নেই।", "No students in this track yet.")}
                </p>
              ) : (
                <ul className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
                  {enrolled.map((s) => {
                    const roll = String(s.rollNumber).trim();
                    const present = presentRolls.includes(roll);
                    return (
                      <li key={roll}>
                        <button
                          type="button"
                          onClick={() => toggle(roll)}
                          aria-pressed={present}
                          className={`flex w-full items-center justify-between gap-3 rounded-xl border px-3.5 py-3 text-left transition-colors focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                            present
                              ? "border-ok/40 bg-ok-surface"
                              : "border-text/12 bg-card hover:border-text/25"
                          }`}
                        >
                          <span className="min-w-0">
                            <span className="block text-[11px] tabular-nums text-text/45">#{roll}</span>
                            <span className="block truncate text-sm font-semibold text-text">
                              {s.nameEnglish}
                            </span>
                          </span>
                          <span
                            className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full border ${
                              present ? "border-ok bg-ok text-card" : "border-text/25 text-transparent"
                            }`}
                            aria-hidden="true"
                          >
                            <Check className="h-3.5 w-3.5" strokeWidth={3} />
                          </span>
                        </button>
                      </li>
                    );
                  })}
                </ul>
              )}
            </Card>

            <Button type="submit" loading={submitting} className="w-full">
              {submitting ? t("জমা হচ্ছে…", "Submitting…") : t("ক্লাস সেশন জমা দিন", "Submit class session")}
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
