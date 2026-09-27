"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Check, Ticket, Trash2, UserPlus, X } from "lucide-react";
import { useLanguage } from "@/i18n";
import {
  Button,
  Card,
  Dialog,
  EmptyState,
  Field,
  IconButton,
  LoadingBlock,
  SectionHanzi,
  SelectField,
  StatusMark,
  TableFrame,
  Td,
  Th,
  useConfirm,
  useToast,
} from "@/components/ui";
import { AdminShell } from "@/features/academy/components/admin/AdminShell";

/**
 * Course enrollment in one place: the payments waiting to be confirmed, and a
 * way to put a student on a course directly.
 *
 * The second part matters more than it looks. A student who paid in cash, or who
 * came from an older batch, should not have to fill in a TrxID form only for
 * the admin to approve it again — they just get added, and the ledger records
 * that the admin did it.
 */

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

type Enrollment = {
  _id: string;
  courseId: string;
  courseName: string;
  name: string;
  whatsapp: string;
  trxId: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  note?: string;
  rollNumber?: number | null;
  createdAt: string;
};

type Course = {
  courseId: string;
  courseName: string;
  targetLevel?: string;
  launched?: boolean;
  completed?: boolean;
  fee?: number;
};

type Student = { rollNumber: number; nameEnglish: string; whatsapp: string };

export default function AdminEnrollmentsPage() {
  const { language } = useLanguage();
  const toast = useToast();
  const confirm = useConfirm();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [courseId, setCourseId] = useState("all");
  const [status, setStatus] = useState("Pending");
  const [rows, setRows] = useState<Enrollment[] | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [students, setStudents] = useState<Student[]>([]);
  const [busy, setBusy] = useState<string | null>(null);

  // The direct-add dialog.
  const [addOpen, setAddOpen] = useState(false);
  const [addCourse, setAddCourse] = useState("");
  const [addRoll, setAddRoll] = useState("");
  const [addQuery, setAddQuery] = useState("");

  const load = useCallback(async () => {
    try {
      const q = new URLSearchParams({ status });
      if (courseId !== "all") q.set("courseId", courseId);
      const res = await fetch(`/api/course-enrollments?${q}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) setRows(data.enrollments ?? []);
      else setRows([]);
    } catch {
      setRows([]);
    }
  }, [courseId, status]);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) void load();
    });
    return () => {
      alive = false;
    };
  }, [load]);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (!alive) return;
      Promise.all([
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
      ])
        .then(([c, s]) => {
          if (!alive) return;
          const list = (c.courses ?? []) as Course[];
          setCourses(list);
          setStudents(s.students ?? []);
          if (!addCourse && list.length) setAddCourse(list[0].courseId);
        })
        .catch(() => undefined);
    });
    return () => {
      alive = false;
    };
    // Deliberately runs once: the course list is the source for the select, and
    // re-running it on every addCourse change would fight the user's choice.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const act = async (id: string, action: "APPROVE" | "REJECT") => {
    setBusy(id);
    try {
      const res = await fetch("/api/course-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action, id, adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(data.message || t("কাজটি হয়নি।", "That did not work."), "error");
        return;
      }
      toast(
        action === "APPROVE"
          ? t("শিক্ষার্থী কোর্সে যুক্ত হয়েছেন।", "Student added to the course.")
          : t("ভর্তি বাতিল হয়েছে।", "Enrollment rejected."),
        "success",
      );
      void load();
    } catch {
      toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
    } finally {
      setBusy(null);
    }
  };

  const addStudent = async () => {
    const roll = Number(addRoll);
    if (!roll || !addCourse) return;
    setBusy("add");
    try {
      const res = await fetch("/api/course-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "ADD_STUDENT",
          courseId: addCourse,
          rollNumber: roll,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(data.message || t("যোগ করা যায়নি।", "Could not add them."), "error");
        return;
      }
      toast(
        data.alreadyOn
          ? t("শিক্ষার্থী ইতিমধ্যে এই কোর্সে আছেন।", "They are already on this course.")
          : t("শিক্ষার্থী কোর্সে যুক্ত হয়েছেন।", "Student added to the course."),
        "success",
      );
      setAddOpen(false);
      setAddRoll("");
      void load();
    } catch {
      toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
    } finally {
      setBusy(null);
    }
  };

  /**
   * Removing a row is the one destructive thing on this page, so it asks first
   * and offers to also take the student off the course. Rejecting is the softer
   * option and keeps the record.
   */
  const confirmDelete = async (row: Enrollment) => {
    const ok = await confirm({
      title: t("ভর্তি মুছে ফেলবেন?", "Delete this enrollment?"),
      message: t(
        `${row.name} — ${row.courseName}। রেকর্ডটি সম্পূর্ণ মুছে যাবে এবং শিক্ষার্থী কোর্স থেকে বাদ যাবেন। আর ফেরানো যাবে না।`,
        `${row.name} — ${row.courseName}. The record will be erased and the student taken off the course. This cannot be undone.`,
      ),
      confirmLabel: t("মুছে ফেলুন", "Delete"),
      destructive: true,
    });
    if (!ok) return;

    setBusy(row._id);
    try {
      const res = await fetch("/api/course-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "DELETE",
          id: row._id,
          alsoRemoveFromStudent: true,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(data.message || t("মুছে ফেলা যায়নি।", "Could not delete it."), "error");
        return;
      }
      toast(
        data.removedFromCourse
          ? t("মুছে ফেলা হয়েছে এবং শিক্ষার্থী কোর্স থেকে বাদ দেওয়া হয়েছে।", "Deleted, and the student was taken off the course.")
          : t("মুছে ফেলা হয়েছে।", "Deleted."),
        "success",
      );
      void load();
    } catch {
      toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
    } finally {
      setBusy(null);
    }
  };

  const filteredStudents = useMemo(() => {
    const q = addQuery.trim().toLowerCase();
    const list = q
      ? students.filter(
          (s) =>
            s.nameEnglish.toLowerCase().includes(q) || String(s.rollNumber) === q || s.whatsapp.includes(q),
        )
      : students;
    return list.slice(0, 40);
  }, [students, addQuery]);

  return (
    <AdminShell
      title={t("ভর্তির তালিকা", "Enrollments")}
      crumb={t("ভর্তি", "Enrollments")}
      seal="席"
      lede={t(
        "ফি পাঠানো ভর্তিগুলো এখানে জমা হয়। আর যে শিক্ষার্থী ইতিমধ্যে আছে, তাকে সরাসরি কোর্সে যোগ করা যায়।",
        "Paid enrollments land here. A student you already have can also be added to a course directly.",
      )}
      actions={
        <Button
          size="sm"
          onClick={() => setAddOpen(true)}
          iconLeft={<UserPlus className="h-4 w-4" />}
        >
          {t("শিক্ষার্থী যোগ করুন", "Add a student")}
        </Button>
      }
    >
      <SectionHanzi char="席" className="-top-16 right-4" />

      <div className="mb-6 grid max-w-2xl gap-3 sm:grid-cols-2">
        <SelectField
          label={t("কোর্স", "Course")}
          value={courseId}
          onChange={(e) => setCourseId(e.target.value)}
        >
          <option value="all">{t("সব কোর্স", "All courses")}</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseName}
            </option>
          ))}
        </SelectField>
        <SelectField
          label={t("অবস্থা", "Status")}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">{t("অপেক্ষমাণ", "Pending")}</option>
          <option value="Approved">{t("অনুমোদিত", "Approved")}</option>
          <option value="Rejected">{t("বাতিল", "Rejected")}</option>
          <option value="All">{t("সব", "All")}</option>
        </SelectField>
      </div>

      {rows === null ? (
        <LoadingBlock label={t("তথ্য আসছে…", "Loading…")} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={t("কোনো ভর্তি নেই", "No enrollments")}
          description={t(
            "কোর্স চালু করলে এখানে ফি পাঠানো ভর্তি জমা হবে।",
            "Once a course is on sale, paid enrollments will appear here.",
          )}
          icon={<Ticket className="size-5" />}
        />
      ) : (
        <TableFrame
          caption={t("কোর্স ভর্তি", "Course enrollments")}
          head={
            <>
              <Th>{t("শিক্ষার্থী", "Student")}</Th>
              <Th>{t("কোর্স", "Course")}</Th>
              <Th>{t("TrxID", "TrxID")}</Th>
              <Th>{t("পরিশোধ", "Paid")}</Th>
              <Th>{t("অবস্থা", "Status")}</Th>
              <Th className="text-right">{t("কাজ", "Actions")}</Th>
            </>
          }
        >
          {rows.map((r) => (
            <tr key={r._id}>
              <Td>
                <span className="block font-semibold text-text">{r.name}</span>
                <span className="block font-mono text-[11px] text-text/50">{r.whatsapp}</span>
              </Td>
              <Td className="text-[13px]">{r.courseName}</Td>
              <Td className="font-mono text-[12px]">{r.trxId}</Td>
              <Td className="tabular-nums">
                {r.amount > 0 ? `৳${r.amount}` : <span className="text-text/45">{t("ফ্রি", "free")}</span>}
              </Td>
              <Td>
                <StatusMark
                  tone={r.status === "Approved" ? "done" : r.status === "Rejected" ? "neutral" : "pending"}
                >
                  {r.status}
                </StatusMark>
                {r.note && (
                  <span className="mt-1 block text-[10px] text-text/45">{r.note}</span>
                )}
              </Td>
              <Td>
                <div className="flex items-center justify-end gap-1">
                  {r.status === "Pending" && (
                    <>
                      <Button
                        size="sm"
                        disabled={busy === r._id}
                        onClick={() => act(r._id, "APPROVE")}
                        iconLeft={<Check className="h-3.5 w-3.5" />}
                      >
                        {t("অনুমোদন", "Approve")}
                      </Button>
                      <Button
                        size="sm"
                        variant="danger"
                        disabled={busy === r._id}
                        onClick={() => act(r._id, "REJECT")}
                        iconLeft={<X className="h-3.5 w-3.5" />}
                      >
                        {t("বাতিল", "Reject")}
                      </Button>
                    </>
                  )}
                  {r.status !== "Pending" && (
                    <span className="mr-1 text-[11px] text-text/45">
                      {new Date(r.createdAt).toLocaleDateString("en-GB")}
                    </span>
                  )}
                  {/* Delete works on pending and approved rows alike — a wrong
                      entry should be removable either way. */}
                  <IconButton
                    label={t("মুছে ফেলুন", "Delete")}
                    size="sm"
                    disabled={busy === r._id}
                    onClick={() => confirmDelete(r)}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </div>
              </Td>
            </tr>
          ))}
        </TableFrame>
      )}

      {/* Direct add — no TrxID, because the admin already knows. */}
      <Dialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        title={t("শিক্ষার্থী সরাসরি কোর্সে যোগ করুন", "Add a student to a course")}
        description={t(
          "যে শিক্ষার্থী ইতিমধ্যে আছেন, তাকে ফি ছাড়াই যুক্ত করা যায়।",
          "Someone who is already registered can be added without a payment step.",
        )}
        size="md"
        footer={
          <>
            <Button variant="secondary" size="sm" onClick={() => setAddOpen(false)}>
              {t("বাতিল", "Cancel")}
            </Button>
            <Button
              size="sm"
              onClick={addStudent}
              disabled={busy === "add" || !addRoll || !addCourse}
            >
              {busy === "add" ? t("যোগ হচ্ছে…", "Adding…") : t("কোর্সে যোগ করুন", "Add to course")}
            </Button>
          </>
        }
      >
        <div className="space-y-4">
          <SelectField
            label={t("কোর্স", "Course")}
            value={addCourse}
            onChange={(e) => setAddCourse(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseName}
                {c.completed ? ` — ${t("সম্পন্ন", "completed")}` : ""}
              </option>
            ))}
          </SelectField>

          <Field
            label={t("শিক্ষার্থী খুঁজুন", "Find the student")}
            value={addQuery}
            onChange={(e) => setAddQuery(e.target.value)}
            placeholder={t("নাম, রোল বা মোবাইল", "name, roll or mobile")}
          />

          <div>
            <p className="mb-1.5 text-sm font-medium text-text">
              {t("যে শিক্ষার্থী", "Which student")}
            </p>
            <div className="max-h-56 space-y-1 overflow-y-auto rounded-xl border border-text/12 p-1">
              {filteredStudents.map((s) => (
                <button
                  key={s.rollNumber}
                  type="button"
                  onClick={() => setAddRoll(String(s.rollNumber))}
                  className={`flex w-full items-center justify-between gap-3 rounded-lg px-3 py-2 text-left text-sm transition ${
                    addRoll === String(s.rollNumber)
                      ? "bg-secondary/15 text-text"
                      : "text-text/75 hover:bg-text/5"
                  }`}
                >
                  <span className="truncate">{s.nameEnglish}</span>
                  <span className="shrink-0 font-mono text-[11px] text-text/50">
                    #{s.rollNumber}
                  </span>
                </button>
              ))}
              {filteredStudents.length === 0 && (
                <p className="px-3 py-3 text-sm text-text/50">{t("কোনো শিক্ষার্থী নেই।", "No students found.")}</p>
              )}
            </div>
          </div>

          {addRoll && (
            <Card className="px-4 py-3 text-sm">
              {t("নির্বাচিত", "Selected")}:{" "}
              <span className="font-semibold text-text">
                {students.find((s) => String(s.rollNumber) === addRoll)?.nameEnglish ?? `#${addRoll}`}
              </span>
            </Card>
          )}
        </div>
      </Dialog>
    </AdminShell>
  );
}
