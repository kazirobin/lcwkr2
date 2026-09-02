"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n";
import { AdminShell } from "@/features/academy";
import {
  Button,
  Card,
  EmptyState,
  IconButton,
  LoadingBlock,
  useConfirm,
  useToast,
} from "@/components/ui";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

type Log = {
  _id: string;
  courseId: string;
  classId: string;
  date: string;
  time: string;
  contentCovered?: { summary?: string };
};

export default function PendingClassLogsPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const toast = useToast();
  const confirm = useConfirm();

  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);

  const fetchLogs = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/classes/pending", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setLogs(data.pendingClasses || []);
    } catch {
      toast(t("তালিকা লোড করা যায়নি।", "Couldn't load the list."), "error");
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    fetchLogs();
  }, [fetchLogs]);

  const act = async (logId: string, action: "APPROVE" | "REJECT") => {
    if (action === "REJECT") {
      const ok = await confirm({
        title: t("ক্লাস লগ প্রত্যাখ্যান?", "Reject class log?"),
        message: t("এই লগটি মুছে ফেলা হবে।", "This log will be discarded."),
        confirmLabel: t("প্রত্যাখ্যান", "Reject"),
        destructive: true,
      });
      if (!ok) return;
    }
    setBusy(logId);
    try {
      const res = await fetch("/api/academy/classes/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, action, adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) {
        toast(
          action === "APPROVE" ? t("লগ অনুমোদিত।", "Log approved.") : t("লগ প্রত্যাখ্যাত।", "Log rejected."),
          "success",
        );
        fetchLogs();
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
      title={t("ক্লাস লগ অনুমোদন", "Class log approvals")}
      crumb={t("ক্লাস লগ", "Class logs")}
      seal="录"
      lede={t("শিক্ষকের জমা দেওয়া উপস্থিতি সেশন পর্যালোচনা করুন।", "Review the attendance sessions teachers have submitted.")}
      actions={
        <IconButton label={t("রিফ্রেশ", "Refresh")} size="sm" spinning={loading} onClick={fetchLogs}>
          <RefreshCw className="h-4 w-4" />
        </IconButton>
      }
    >
      {loading ? (
        <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={2} />
      ) : logs.length === 0 ? (
        <EmptyState
          title={t("কোনো অপেক্ষমাণ লগ নেই", "No pending logs")}
          description={t("শিক্ষক ক্লাস লগ জমা দিলে এখানে দেখা যাবে।", "Submitted class logs will appear here for approval.")}
        />
      ) : (
        <ul className="space-y-3">
          {logs.map((log) => (
            <li key={log._id}>
              <Card className="flex flex-wrap items-center justify-between gap-4 p-5">
                <div className="min-w-0">
                  <p className="text-xs font-semibold tabular-nums text-text/60">
                    {log.courseId} · {log.classId}
                  </p>
                  <p className="mt-1 text-sm font-semibold text-text">
                    {log.contentCovered?.summary || t("নিয়মিত ক্লাস", "Regular session")}
                  </p>
                  <p className="mt-0.5 text-xs tabular-nums text-text/55">
                    {log.date} · {log.time}
                  </p>
                </div>
                <div className="flex gap-2">
                  <Button size="sm" loading={busy === log._id} onClick={() => act(log._id, "APPROVE")}>
                    {t("অনুমোদন", "Approve")}
                  </Button>
                  <Button
                    size="sm"
                    variant="danger"
                    disabled={busy === log._id}
                    onClick={() => act(log._id, "REJECT")}
                  >
                    {t("প্রত্যাখ্যান", "Reject")}
                  </Button>
                </div>
              </Card>
            </li>
          ))}
        </ul>
      )}
    </AdminShell>
  );
}
