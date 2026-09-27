"use client";

import { useCallback, useEffect, useState } from "react";
import { Banknote, Check, X } from "lucide-react";
import { useLanguage } from "@/i18n";
import {
  Button,
  EmptyState,
  LoadingBlock,
  SectionHanzi,
  SelectField,
  StatusMark,
  TableFrame,
  Td,
  Th,
  useToast,
} from "@/components/ui";
import { AdminShell } from "@/features/academy/components/admin/AdminShell";

/**
 * Review queue for the ৳500 student-account registrations.
 *
 * Each row is a real submission from /register with the bKash TrxID the
 * student typed in. Approving one creates the student account with the next
 * roll number and marks it approved, so there is nothing left to retype.
 */

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

type Row = {
  _id: string;
  name: string;
  whatsapp: string;
  trxId: string;
  location: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  note?: string;
  rollNumber?: number | null;
  createdAt: string;
};

export default function AdminRegistrationsPage() {
  const { language } = useLanguage();
  const toast = useToast();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [status, setStatus] = useState("Pending");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [courses, setCourses] = useState<Array<{ courseId: string; courseName: string }>>([]);
  const [courseId, setCourseId] = useState("");
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/registrations?status=${status}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) setRows(data.registrations as Row[]);
      else setRows([]);
    } catch {
      setRows([]);
    }
  }, [status]);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) void load();
    });
    return () => {
      alive = false;
    };
  }, [load]);

  // A new student needs a course on their record, so default to the first one.
  useEffect(() => {
    let alive = true;
    fetch("/api/academy/courses", { cache: "no-store" })
      .then((r) => r.json())
      .then((d) => {
        if (!alive || !d.success) return;
        const list = (d.courses ?? []).map((c: { courseId: string; courseName: string }) => ({
          courseId: c.courseId,
          courseName: c.courseName,
        }));
        setCourses(list);
        if (list.length) setCourseId((prev) => prev || list[0].courseId);
      })
      .catch(() => undefined);
    return () => {
      alive = false;
    };
  }, []);

  const decide = async (id: string, action: "APPROVE" | "REJECT") => {
    setBusy(id);
    try {
      const res = await fetch("/api/registrations", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action,
          id,
          adminPasscode: ADMIN_PASSCODE,
          rollNumber: 1,
          courseId: courseId || courses[0]?.courseId || "HSK-101",
        }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(data.message || t("কাজটি হয়নি।", "That did not work."), "error");
        return;
      }
      toast(
        action === "APPROVE"
          ? t(`অ্যাকাউন্ট তৈরি হয়েছে — রোল #${data.rollNumber}`, `Account created — roll #${data.rollNumber}`)
          : t("আবেদন বাতিল হয়েছে।", "Application rejected."),
        "success",
      );
      void load();
    } catch {
      toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminShell
      title={t("৳৫০০ রেজিস্ট্রেশন", "৳500 registrations")}
      crumb={t("রেজিস্ট্রেশন", "Registrations")}
      seal="册"
      lede={t(
        "যারা ৳৫০০ পাঠিয়ে অ্যাকাউন্ট চেয়েছেন। Approve করলেই student account তৈরি হয়ে যাবে।",
        "Students who paid ৳500 and asked for an account. Approving creates the student account for you.",
      )}
    >
      <SectionHanzi char="册" className="-top-16 right-4" />

      <div className="mb-6 grid max-w-lg gap-3 sm:grid-cols-2">
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
        {courses.length > 0 && (
          <SelectField
            label={t("যে কোর্সে যুক্ত করবেন", "Course to attach")}
            value={courseId}
            onChange={(e) => setCourseId(e.target.value)}
          >
            {courses.map((c) => (
              <option key={c.courseId} value={c.courseId}>
                {c.courseName}
              </option>
            ))}
          </SelectField>
        )}
      </div>

      {rows === null ? (
        <LoadingBlock label={t("তথ্য আসছে…", "Loading…")} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={t("কোনো আবেদন নেই", "No applications")}
          description={t(
            "নতুন রেজিস্ট্রেশন এলে এখানে দেখা যাবে।",
            "New registrations will show up here.",
          )}
        />
      ) : (
        <TableFrame
          caption={t("৳৫০০ রেজিস্ট্রেশন", "৳500 registrations")}
          head={
            <>
              <Th>{t("নাম", "Name")}</Th>
              <Th>{t("মোবাইল", "Mobile")}</Th>
              <Th>{t("TrxID", "TrxID")}</Th>
              <Th>{t("ফি", "Fee")}</Th>
              <Th>{t("অবস্থা", "Status")}</Th>
              <Th>{t("ব্যবস্থা", "Action")}</Th>
            </>
          }
        >
          {rows.map((r) => (
            <tr key={r._id}>
              <Td>
                <span className="block font-semibold text-text">{r.name}</span>
                {r.location && (
                  <span className="block text-[11px] text-text/50">{r.location}</span>
                )}
              </Td>
              <Td className="font-mono text-[12px]">{r.whatsapp}</Td>
              <Td className="font-mono text-[12px]">{r.trxId}</Td>
              <Td className="tabular-nums">
                <span className="flex items-center gap-1">
                  <Banknote className="size-3.5 text-text/40" aria-hidden="true" />
                  {r.amount}
                </span>
              </Td>
              <Td>
                <StatusMark tone={r.status === "Approved" ? "done" : r.status === "Rejected" ? "neutral" : "pending"}>
                  {r.status}
                </StatusMark>
                {r.rollNumber != null && (
                  <span className="mt-1 block font-mono text-[11px] text-text/50">
                    #{r.rollNumber}
                  </span>
                )}
              </Td>
              <Td>
                {r.status === "Pending" ? (
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      disabled={busy === r._id}
                      onClick={() => decide(r._id, "APPROVE")}
                      iconLeft={<Check className="h-3.5 w-3.5" />}
                    >
                      {t("অনুমোদন", "Approve")}
                    </Button>
                    <Button
                      size="sm"
                      variant="danger"
                      disabled={busy === r._id}
                      onClick={() => decide(r._id, "REJECT")}
                      iconLeft={<X className="h-3.5 w-3.5" />}
                    >
                      {t("বাতিল", "Reject")}
                    </Button>
                  </div>
                ) : (
                  <span className="text-[11px] text-text/50">
                    {new Date(r.createdAt).toLocaleDateString("en-GB")}
                  </span>
                )}
              </Td>
            </tr>
          ))}
        </TableFrame>
      )}
    </AdminShell>
  );
}
