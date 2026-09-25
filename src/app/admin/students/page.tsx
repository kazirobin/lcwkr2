"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowRightLeft, Activity, Check, RefreshCw, Search, Trash2 } from "lucide-react";
import { useLanguage } from "@/i18n";
import { AdminShell } from "@/features/academy";
import {
  Button,
  Dialog,
  EmptyState,
  IconButton,
  InlineSelect,
  LoadingBlock,
  StatusMark,
  TableFrame,
  Td,
  Th,
  useConfirm,
  useToast,
} from "@/components/ui";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

type Student = {
  rollNumber: number;
  nameEnglish: string;
  whatsapp: string;
  isWhatsAppGroupJoined: boolean;
  isPro?: boolean;
  enrolledCourseId?: string;
  enrolledCourseIds?: string[];
};
type Course = { courseId: string; courseName: string };

export default function AdminStudentsPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const toast = useToast();
  const confirm = useConfirm();

  const [students, setStudents] = useState<Student[]>([]);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<"all" | "joined" | "pending">("all");

  const [transferring, setTransferring] = useState<Student | null>(null);
  const [newTracks, setNewTracks] = useState<string[]>([]);
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);
  const [activityFor, setActivityFor] = useState<Student | null>(null);
  const [activity, setActivity] = useState<{
    exams: { level: number; lesson: number; best: number; latest: number; attempts: number; totalMarks: number }[];
    subs: { _id: string; level: number; lesson: number; audioUrl: string; mark: number | null; status: string; createdAt: string }[];
    marks: { _id: string; level: number; lesson: number; mark: number; source: string; createdAt: string }[];
  } | null>(null);
  const [activityLoading, setActivityLoading] = useState(false);

  const openActivity = (s: Student) => {
    setActivityFor(s);
    setActivity(null);
    setActivityLoading(true);
    const qp = encodeURIComponent(s.whatsapp);
    Promise.all([
      fetch(`/api/hw/exam-results?phone=${qp}`, { cache: "no-store" }).then((r) => r.json()).catch(() => null),
      fetch(`/api/hw/dialogues?phone=${qp}`, { cache: "no-store" }).then((r) => r.json()).catch(() => null),
      fetch(`/api/hw/marks?phone=${qp}`, { cache: "no-store" }).then((r) => r.json()).catch(() => null),
    ])
      .then(([e, d, m]) => {
        setActivity({
          exams: e?.success ? (e.results ?? []) : [],
          subs: d?.success ? (d.submissions ?? []) : [],
          marks: m?.success ? (m.marks ?? []) : [],
        });
      })
      .finally(() => setActivityLoading(false));
  };

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (s.success) setStudents(s.students || []);
      if (c.success) setCourses(c.courses || []);
    } catch {
      toast(t("তথ্য লোড করা যায়নি।", "Couldn't load data."), "error");
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    queueMicrotask(() => {
      void fetchData();
    });
  }, [fetchData]);

  const trackOf = (s: Student) => s.enrolledCourseId || s.enrolledCourseIds?.[0] || "—";

  const rows = useMemo(
    () =>
      students.filter((s) =>
        filter === "joined"
          ? s.isWhatsAppGroupJoined
          : filter === "pending"
            ? !s.isWhatsAppGroupJoined
            : true,
      ),
    [students, filter],
  );

  // search by name / roll / phone / track
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return rows;
    return rows.filter(
      (s) =>
        s.nameEnglish.toLowerCase().includes(q) ||
        String(s.rollNumber).includes(q) ||
        String(s.whatsapp).includes(q) ||
        trackOf(s).toLowerCase().includes(q),
    );
  }, [rows, query]);

  const toggleGroup = async (s: Student) => {
    setBusy(s.rollNumber);
    try {
      const res = await fetch("/api/academy/students/toggle-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: s.rollNumber,
          isWhatsAppGroupJoined: !s.isWhatsAppGroupJoined,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (data.success ?? res.ok) fetchData();
      else toast(data.message || t("আপডেট হয়নি।", "Update failed."), "error");
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusy(null);
    }
  };

  const togglePro = async (s: Student) => {
    setBusy(s.rollNumber);
    try {
      const res = await fetch("/api/academy/students/pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: s.rollNumber,
          isPro: !s.isPro,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (data.success ?? res.ok) fetchData();
      else toast(data.message || t("আপডেট হয়নি।", "Update failed."), "error");
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusy(null);
    }
  };

  const removeStudent = async (s: Student) => {
    const ok = await confirm({
      title: t("শিক্ষার্থী মুছবেন?", "Delete this student?"),
      message: t(
        `রোল #${s.rollNumber} (${s.nameEnglish}) স্থায়ীভাবে মুছে যাবে।`,
        `Roll #${s.rollNumber} (${s.nameEnglish}) will be permanently removed.`,
      ),
      confirmLabel: t("মুছুন", "Delete"),
      destructive: true,
    });
    if (!ok) return;
    setBusy(s.rollNumber);
    try {
      const res = await fetch("/api/academy/students/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber: s.rollNumber, action: "DELETE", adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success ?? res.ok) {
        toast(t("শিক্ষার্থী মুছে ফেলা হয়েছে।", "Student removed."), "success");
        fetchData();
      } else {
        toast(data.message || t("মোছা যায়নি।", "Delete failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusy(null);
    }
  };

  const saveTransfer = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!transferring) return;
    if (newTracks.length === 0) {
      toast(t("অন্তত একটি কোর্স সিলেক্ট করুন।", "Select at least one course."), "error");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/academy/students/change-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: Number(transferring.rollNumber),
          courseIds: newTracks,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(t("কোর্স এনরোলমেন্ট আপডেট হয়েছে।", "Enrollment updated."), "success");
        setTransferring(null);
        fetchData();
      } else {
        toast(data.message || t("পরিবর্তন হয়নি।", "Update failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <AdminShell
      title={t("শিক্ষার্থী ও ট্র্যাক", "Students & tracks")}
      crumb={t("শিক্ষার্থী", "Students")}
      seal="生"
      lede={t("গ্রুপ যাচাই, ট্র্যাক পরিবর্তন ও শিক্ষার্থী ব্যবস্থাপনা।", "Verify group status, move tracks, and manage students.")}
      actions={
        <>
          <InlineSelect
            label={t("গ্রুপ ফিল্টার", "Group filter")}
            hideLabel
            value={filter}
            onChange={(e) => setFilter(e.target.value as typeof filter)}
          >
            <option value="all">{t("সব", "All")}</option>
            <option value="joined">{t("গ্রুপে যুক্ত", "In group")}</option>
            <option value="pending">{t("গ্রুপে নেই", "Not in group")}</option>
          </InlineSelect>
          <IconButton label={t("রিফ্রেশ", "Refresh")} size="sm" spinning={loading} onClick={fetchData}>
            <RefreshCw className="h-4 w-4" />
          </IconButton>
        </>
      }
    >
      {/* search */}
      <div className="relative mb-4">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text/40"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("নাম, রোল, ফোন বা ট্র্যাক দিয়ে খুঁজুন…", "Search by name, roll, phone or track…")}
          className="w-full rounded-xl border border-text/15 bg-card py-2.5 pl-10 pr-3.5 text-sm text-text placeholder:text-text/35 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
        />
      </div>

      {loading ? (
        <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={3} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("কোনো শিক্ষার্থী নেই", "No students")} />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t("ম্যাচ পাওয়া যায়নি", "No matches")}
          description={t("অন্য কিছু দিয়ে খুঁজে দেখুন।", "Try a different search.")}
        />
      ) : (
        <TableFrame
          caption={t("অনুমোদিত শিক্ষার্থীর তালিকা", "Approved students")}
          minWidth="48rem"
          head={
            <>
              <Th className="w-14">{t("রোল", "Roll")}</Th>
              <Th>{t("নাম", "Name")}</Th>
              <Th>{t("ট্র্যাক", "Track")}</Th>
              <Th>{t("হোয়াটসঅ্যাপ", "WhatsApp")}</Th>
              <Th>{t("গ্রুপ", "Group")}</Th>
              <Th>{t("প্রো", "Pro")}</Th>
              <Th className="text-right">{t("কাজ", "Actions")}</Th>
            </>
          }
        >
          {filtered.map((s) => (
            <tr key={s.rollNumber}>
              <Td className="tabular-nums text-text/60">#{s.rollNumber}</Td>
              <Td className="font-semibold text-text">{s.nameEnglish}</Td>
              <Td className="tabular-nums">{trackOf(s)}</Td>
              <Td className="tabular-nums">
                <a
                  href={`https://wa.me/${String(s.whatsapp).replace(/[^0-9]/g, "")}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline decoration-text/25 underline-offset-4 transition-colors hover:text-primary hover:decoration-primary/50"
                >
                  {s.whatsapp}
                </a>
              </Td>
              <Td>
                <button
                  type="button"
                  onClick={() => toggleGroup(s)}
                  disabled={busy === s.rollNumber}
                  className="rounded-md px-1.5 py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text disabled:opacity-50"
                >
                  <StatusMark tone={s.isWhatsAppGroupJoined ? "done" : "pending"}>
                    {s.isWhatsAppGroupJoined ? t("যুক্ত", "Joined") : t("যুক্ত নয়", "Not yet")}
                  </StatusMark>
                </button>
              </Td>
              <Td>
                <button
                  type="button"
                  onClick={() => togglePro(s)}
                  disabled={busy === s.rollNumber}
                  title={t("Pro subscriber mark করুন", "Mark Pro subscriber")}
                  className="rounded-md px-1.5 py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text disabled:opacity-50"
                >
                  <StatusMark tone={s.isPro ? "done" : "pending"}>
                    {s.isPro ? "⭐ Pro" : t("সাধারণ", "Regular")}
                  </StatusMark>
                </button>
              </Td>
              <Td className="text-right">
                <div className="flex justify-end gap-1.5">
                  <IconButton
                    label={t("অ্যাক্টিভিটি দেখুন", "View activity")}
                    size="sm"
                    onClick={() => openActivity(s)}
                  >
                    <Activity className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label={t("কোর্স এনরোলমেন্ট", "Manage enrollment")}
                    size="sm"
                    onClick={() => {
                      setTransferring(s);
                      const current = s.enrolledCourseIds?.length
                        ? s.enrolledCourseIds
                        : s.enrolledCourseId
                          ? [s.enrolledCourseId]
                          : [];
                      setNewTracks(current);
                    }}
                  >
                    <ArrowRightLeft className="h-4 w-4" />
                  </IconButton>
                  <IconButton
                    label={t("শিক্ষার্থী মুছুন", "Delete student")}
                    size="sm"
                    spinning={busy === s.rollNumber}
                    onClick={() => removeStudent(s)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </Td>
            </tr>
          ))}
        </TableFrame>
      )}

      <Dialog
        open={activityFor !== null}
        onClose={() => setActivityFor(null)}
        title={t("শিক্ষার্থী অ্যাক্টিভিটি", "Student activity")}
        description={activityFor ? `${activityFor.nameEnglish} · #${activityFor.rollNumber}` : ""}
        footer={
          <Button variant="secondary" size="sm" onClick={() => setActivityFor(null)}>
            {t("বন্ধ করুন", "Close")}
          </Button>
        }
      >
        {activityLoading ? (
          <p className="py-6 text-center text-xs text-text/50">
            {t("লোড হচ্ছে...", "Loading...")}
          </p>
        ) : !activity ? (
          <p className="py-6 text-center text-xs text-text/50">
            {t("তথ্য পাওয়া যায়নি।", "No data.")}
          </p>
        ) : (
          <div className="space-y-4">
            {(() => {
              const examBest = activity.exams.reduce((n, r) => n + r.best, 0);
              const latestByLesson = new Map<string, number>();
              for (const m of activity.marks) {
                const key = `${m.level}-${m.lesson}`;
                if (!latestByLesson.has(key)) latestByLesson.set(key, m.mark);
              }
              const dialogueTotal = [...latestByLesson.values()].reduce((n, v) => n + v, 0);
              return (
                <div className="grid grid-cols-4 gap-2 text-center">
                  {[
                    { v: String(activity.exams.reduce((n, r) => n + r.attempts, 0)), l: t("পরীক্ষা", "Exams") },
                    { v: `${examBest}`, l: t("সেরা", "Best") },
                    { v: String(activity.subs.length), l: t("রেকর্ডিং", "Recordings") },
                    { v: String(examBest + dialogueTotal), l: t("মোট", "Total") },
                  ].map((c) => (
                    <div key={c.l} className="rounded-xl border border-text/10 bg-background px-2 py-2.5">
                      <p className="font-mono text-base font-bold tabular-nums text-text">{c.v}</p>
                      <p className="text-[10px] text-text/50">{c.l}</p>
                    </div>
                  ))}
                </div>
              );
            })()}

            <div>
              <h4 className="mb-1.5 text-xs font-bold text-text">
                📝 {t("পরীক্ষা", "Exams")} ({activity.exams.length})
              </h4>
              {activity.exams.length === 0 ? (
                <p className="text-[11px] text-text/40">{t("কিছু নেই।", "None.")}</p>
              ) : (
                <ul className="space-y-1">
                  {activity.exams.map((r) => (
                    <li key={`${r.level}-${r.lesson}`} className="flex justify-between text-xs">
                      <span className="text-text/70">
                        HSK {r.level} · {t("লেসন", "Lesson")} {r.lesson} ×{r.attempts}
                      </span>
                      <span className="font-mono font-bold tabular-nums text-text">
                        {r.best}/{r.totalMarks}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h4 className="mb-1.5 text-xs font-bold text-text">
                🎙️ {t("রেকর্ডিং", "Recordings")} ({activity.subs.length})
              </h4>
              {activity.subs.length === 0 ? (
                <p className="text-[11px] text-text/40">{t("কিছু নেই।", "None.")}</p>
              ) : (
                <div className="max-h-44 space-y-2 overflow-y-auto">
                  {activity.subs.map((s) => (
                    <div key={s._id} className="rounded-lg border border-text/10 bg-background p-2">
                      <p className="mb-1 font-mono text-[11px] text-text/60">
                        HSK {s.level} · {t("লেসন", "Lesson")} {s.lesson} ·{" "}
                        {s.status === "Marked" && s.mark !== null ? `${s.mark}/10` : t("অপেক্ষমাণ", "Pending")}
                      </p>
                      <audio controls src={s.audioUrl} className="h-8 w-full" />
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div>
              <h4 className="mb-1.5 text-xs font-bold text-text">
                ⭐ {t("মার্ক", "Marks")} ({activity.marks.length})
              </h4>
              {activity.marks.length === 0 ? (
                <p className="text-[11px] text-text/40">{t("কিছু নেই।", "None.")}</p>
              ) : (
                <ul className="space-y-1">
                  {activity.marks.slice(0, 10).map((m) => (
                    <li key={m._id} className="flex justify-between text-xs">
                      <span className="text-text/70">
                        HSK {m.level} · {m.lesson === 0 ? t("সামগ্রিক", "Overall") : `${t("লেসন", "Lesson")} ${m.lesson}`}
                      </span>
                      <span className="font-mono font-bold tabular-nums text-ok">{m.mark}/10</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </div>
        )}
      </Dialog>

      <Dialog
        open={transferring !== null}
        onClose={() => setTransferring(null)}
        title={t("ট্র্যাক পরিবর্তন", "Change track")}
        description={transferring ? `${transferring.nameEnglish} · #${transferring.rollNumber}` : ""}
        size="sm"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setTransferring(null)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button size="sm" loading={saving} onClick={saveTransfer}>
              {t("সংরক্ষণ", "Save")}
            </Button>
          </>
        }
      >
        <form onSubmit={saveTransfer}>
          <p className="mb-2 text-[13px] font-semibold text-text">
            {t("কোন কোন কোর্সে এনরোল করবেন (একাধিক সিলেক্ট করা যায়)", "Which courses to enroll in (multiple allowed)")}
          </p>
          <div className="space-y-2">
            {courses.map((c) => {
              const checked = newTracks.includes(c.courseId);
              return (
                <label
                  key={c.courseId}
                  className={`flex cursor-pointer items-center justify-between gap-2 rounded-xl border px-3 py-2.5 text-sm transition-colors focus-within:outline-2 focus-within:outline-offset-1 focus-within:outline-text ${
                    checked ? "border-ok/40 bg-ok-surface" : "border-text/12 bg-card hover:border-text/25"
                  }`}
                >
                  <span className="flex items-center gap-2.5">
                    <input
                      type="checkbox"
                      checked={checked}
                      onChange={() =>
                        setNewTracks((prev) =>
                          checked ? prev.filter((id) => id !== c.courseId) : [...prev, c.courseId],
                        )
                      }
                      className="accent-ok size-4"
                    />
                    <span className="font-semibold text-text">{c.courseId} — {c.courseName}</span>
                  </span>
                  {checked && (
                    <Check className="size-4 text-ok" aria-hidden="true" />
                  )}
                </label>
              );
            })}
          </div>
        </form>
      </Dialog>
    </AdminShell>
  );
}
