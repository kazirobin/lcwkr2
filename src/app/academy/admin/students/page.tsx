"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import { ArrowRightLeft, RefreshCw, Trash2 } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { AdminShell } from "@/features/academy/components/admin/AdminShell";
import {
  Button,
  Dialog,
  EmptyState,
  IconButton,
  InlineSelect,
  LoadingBlock,
  SelectField,
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
  const [newTrack, setNewTrack] = useState("");
  const [saving, setSaving] = useState(false);
  const [busy, setBusy] = useState<number | null>(null);

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
    fetchData();
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
    if (!transferring || !newTrack) return;
    setSaving(true);
    try {
      const res = await fetch("/api/academy/students/change-course", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber: Number(transferring.rollNumber),
          newCourseId: newTrack,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (data.success) {
        toast(t("ট্র্যাক পরিবর্তিত হয়েছে।", "Track updated."), "success");
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
      {loading ? (
        <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={3} />
      ) : rows.length === 0 ? (
        <EmptyState title={t("কোনো শিক্ষার্থী নেই", "No students")} />
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
              <Th className="text-right">{t("কাজ", "Actions")}</Th>
            </>
          }
        >
          {rows.map((s) => (
            <tr key={s.rollNumber}>
              <Td className="tabular-nums text-text/60">#{s.rollNumber}</Td>
              <Td className="font-semibold text-text">{s.nameEnglish}</Td>
              <Td className="tabular-nums">{trackOf(s)}</Td>
              <Td className="tabular-nums">{s.whatsapp}</Td>
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
              <Td className="text-right">
                <div className="flex justify-end gap-1.5">
                  <IconButton
                    label={t("ট্র্যাক পরিবর্তন", "Change track")}
                    size="sm"
                    onClick={() => {
                      setTransferring(s);
                      setNewTrack(trackOf(s) === "—" ? courses[0]?.courseId ?? "" : trackOf(s));
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
          <SelectField
            label={t("নতুন কোর্স ট্র্যাক", "New course track")}
            value={newTrack}
            onChange={(e) => setNewTrack(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseId} — {c.courseName}
              </option>
            ))}
          </SelectField>
        </form>
      </Dialog>
    </AdminShell>
  );
}
