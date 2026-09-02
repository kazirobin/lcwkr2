"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n/LanguageContext";
import { AdminShell } from "@/features/academy/components/admin/AdminShell";
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
    fetchPending();
  }, [fetchPending]);

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
        <IconButton label={t("রিফ্রেশ", "Refresh")} size="sm" spinning={loading} onClick={fetchPending}>
          <RefreshCw className="h-4 w-4" />
        </IconButton>
      }
    >
      {loading ? (
        <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={2} />
      ) : students.length === 0 ? (
        <EmptyState
          title={t("কোনো অপেক্ষমাণ আবেদন নেই", "No pending applications")}
          description={t("নতুন আবেদন এলে এখানে দেখা যাবে।", "New requests will appear here.")}
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
          {students.map((s) => (
            <tr key={s.rollNumber}>
              <Td className="font-semibold text-text">{s.nameEnglish}</Td>
              <Td className="tabular-nums">{s.whatsapp}</Td>
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
