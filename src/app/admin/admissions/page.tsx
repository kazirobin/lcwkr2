"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { RefreshCw, Search } from "lucide-react";
import { useLanguage } from "@/i18n";
import { AdminShell } from "@/features/academy";
import {
  Button,
  EmptyState,
  IconButton,
  LoadingBlock,
  TableFrame,
  Td,
  Th,
  useConfirm,
  useToast,
} from "@/components/ui";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

type Pending = {
  rollNumber: number;
  nameEnglish: string;
  whatsapp: string;
  enrolledCourseId?: string;
  enrolledCourseIds?: string[];
};

export default function PendingAdmissionsPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const toast = useToast();
  const confirm = useConfirm();

  const [students, setStudents] = useState<Pending[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<number | null>(null);

  const fetchPending = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/students?status=Pending", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setStudents(data.students || []);
    } catch {
      toast(t("তালিকা লোড করা যায়নি।", "Couldn't load the list."), "error");
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    queueMicrotask(() => fetchPending());
  }, [fetchPending]);

  // search by name / phone
  const [query, setQuery] = useState("");
  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.nameEnglish.toLowerCase().includes(q) ||
        String(s.whatsapp).includes(q),
    );
  }, [students, query]);

  const approveAll = async () => {
    if (students.length === 0) return;
    const ok = await confirm({
      title: t("সবাইকে অনুমোদন?", "Approve everyone?"),
      message: t(
        `${students.length} জনের আবেদন একসাথে অনুমোদিত হবে।`,
        `All ${students.length} applications will be approved at once.`,
      ),
      confirmLabel: t("সব অনুমোদন", "Approve all"),
    });
    if (!ok) return;
    setBusy(-1);
    try {
      const results = await Promise.allSettled(
        students.map((s) =>
          fetch("/api/academy/students/approve", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({ rollNumber: s.rollNumber, action: "APPROVE", adminPasscode: ADMIN_PASSCODE }),
          }).then((r) => r.json()),
        ),
      );
      const okCount = results.filter((r) => r.status === "fulfilled" && r.value?.success).length;
      toast(
        t(`${okCount} জন অনুমোদিত হয়েছে।`, `${okCount} student(s) approved.`),
        okCount > 0 ? "success" : "error",
      );
      fetchPending();
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusy(null);
    }
  };

  const act = async (rollNumber: number, action: "APPROVE" | "REJECT", name: string) => {
    if (action === "REJECT") {
      const ok = await confirm({
        title: t("আবেদন প্রত্যাখ্যান?", "Reject application?"),
        message: t(`${name} (রোল #${rollNumber}) এর আবেদন মুছে যাবে।`, `${name}'s application (roll #${rollNumber}) will be removed.`),
        confirmLabel: t("প্রত্যাখ্যান", "Reject"),
        destructive: true,
      });
      if (!ok) return;
    }
    setBusy(rollNumber);
    try {
      const res = await fetch("/api/academy/students/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, action, adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          action === "APPROVE"
            ? t("শিক্ষার্থী অনুমোদিত।", "Student approved.")
            : t("আবেদন প্রত্যাখ্যাত।", "Application rejected."),
          "success",
        );
        fetchPending();
      } else {
        toast(data.message || t("কাজটি সম্পন্ন হয়নি।", "Action failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminShell
      title={t("অপেক্ষমাণ ভর্তি", "Pending admissions")}
      crumb={t("ভর্তি", "Admissions")}
      seal="报"
      lede={t("নতুন শিক্ষার্থীর রেজিস্ট্রেশন অনুরোধ পর্যালোচনা করুন।", "Review new student registration requests.")}
      actions={
        <>
          <Button
            size="sm"
            variant="secondary"
            disabled={students.length === 0 || busy === -1}
            loading={busy === -1}
            onClick={approveAll}
          >
            {t("সব অনুমোদন", "Approve all")}
          </Button>
          <IconButton label={t("রিফ্রেশ", "Refresh")} size="sm" spinning={loading} onClick={fetchPending}>
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
          placeholder={t("নাম বা ফোন দিয়ে খুঁজুন…", "Search by name or phone…")}
          className="w-full rounded-xl border border-text/15 bg-card py-2.5 pl-10 pr-3.5 text-sm text-text placeholder:text-text/35 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
        />
      </div>

      {loading ? (
        <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={2} />
      ) : students.length === 0 ? (
        <EmptyState
          title={t("কোনো অপেক্ষমাণ আবেদন নেই", "No pending applications")}
          description={t("নতুন আবেদন এলে এখানে দেখা যাবে।", "New requests will appear here.")}
        />
      ) : filtered.length === 0 ? (
        <EmptyState
          title={t("ম্যাচ পাওয়া যায়নি", "No matches")}
          description={t("অন্য কিছু দিয়ে খুঁজে দেখুন।", "Try a different search.")}
        />
      ) : (
        <TableFrame
          caption={t("অপেক্ষমাণ ভর্তির তালিকা", "Pending admissions")}
          minWidth="40rem"
          head={
            <>
              <Th>{t("নাম", "Name")}</Th>
              <Th>{t("হোয়াটসঅ্যাপ", "WhatsApp")}</Th>
              <Th>{t("ট্র্যাক", "Track")}</Th>
              <Th className="text-right">{t("সিদ্ধান্ত", "Decision")}</Th>
            </>
          }
        >
          {filtered.map((s) => (
            <tr key={s.rollNumber}>
              <Td className="font-semibold text-text">{s.nameEnglish}</Td>
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
              <Td>{s.enrolledCourseId || s.enrolledCourseIds?.[0] || "—"}</Td>
              <Td className="text-right">
                <div className="flex justify-end gap-2">
                  <Button
                    size="sm"
                    loading={busy === s.rollNumber}
                    onClick={() => act(s.rollNumber, "APPROVE", s.nameEnglish)}
                  >
                    {t("অনুমোদন", "Approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={busy === s.rollNumber}
                    onClick={() => act(s.rollNumber, "REJECT", s.nameEnglish)}
                  >
                    {t("প্রত্যাখ্যান", "Reject")}
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </TableFrame>
      )}
    </AdminShell>
  );
}
