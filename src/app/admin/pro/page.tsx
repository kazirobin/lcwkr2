"use client";

import { useCallback, useEffect, useState } from "react";
import { Check, Infinity as InfinityIcon, Sparkles, X } from "lucide-react";
import { useLanguage } from "@/i18n";
import {
  Button,
  Card,
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
 * The Pro queue.
 *
 * Pro is ৳500 for life, so this is a short list: students who have sent the
 * money, waiting to be switched on. Approving sets `isPro` on the account,
 * which unlocks every Pro tool on every device that student signs in on.
 */

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

type Row = {
  _id: string;
  name: string;
  whatsapp: string;
  rollNumber?: number | null;
  trxId: string;
  amount: number;
  status: "Pending" | "Active" | "Rejected";
  createdAt: string;
  activatedAt?: string | null;
  expiresAt?: string | null;
};

type Summary = { pending: number; active: number; price: number; lifetime: boolean };

export default function AdminProPage() {
  const { language } = useLanguage();
  const toast = useToast();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [status, setStatus] = useState("Pending");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch(`/api/pro/subscriptions?status=${status}`, { cache: "no-store" });
      const data = await res.json();
      if (data.success) {
        setRows(data.subscriptions ?? []);
        setSummary(data.summary ?? null);
      } else {
        setRows([]);
      }
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

  const act = async (id: string, action: "APPROVE" | "REJECT") => {
    setBusy(id);
    try {
      const res = await fetch("/api/pro/subscriptions", {
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
          ? t("Pro চালু হয়েছে — সব ডিভাইসে কাজ করবে।", "Pro is on — it now works on all their devices.")
          : t("আবেদন বাতিল হয়েছে।", "Payment rejected."),
        "success",
      );
      void load();
    } catch {
      toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
    } finally {
      setBusy(null);
    }
  };

  const revoke = async (rollNumber: number) => {
    setBusy(`revoke-${rollNumber}`);
    try {
      const res = await fetch("/api/pro/subscriptions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "REVOKE", rollNumber, adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(data.message || t("কাজটি হয়নি।", "That did not work."), "error");
        return;
      }
      toast(t("Pro বন্ধ করা হয়েছে।", "Pro switched off."), "success");
      void load();
    } catch {
      toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminShell
      title={t("Pro সাবস্ক্রিপশন", "Pro subscriptions")}
      crumb={t("Pro", "Pro")}
      seal="星"
      lede={t(
        "৳৫০০ সারাজীবন। যারা টাকা পাঠিয়েছে তাদের approve করলেই তাদের সব Pro টুল খুলে যাবে।",
        "৳500 for life. Confirm someone who has paid and every Pro tool opens for them.",
      )}
    >
      <SectionHanzi char="星" className="-top-16 right-4" />

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <Card className="px-4 py-4">
          <p className="font-mono text-2xl font-bold tabular-nums text-text">
            ৳{summary?.price ?? 500}
          </p>
          <p className="mt-0.5 text-[11px] text-text/55">{t("একবারের ফি", "one-off price")}</p>
        </Card>
        <Card className="px-4 py-4">
          <p className="font-mono text-2xl font-bold tabular-nums text-text">
            {summary?.pending ?? 0}
          </p>
          <p className="mt-0.5 text-[11px] text-text/55">{t("অপেক্ষমাণ", "awaiting approval")}</p>
        </Card>
        <Card className="px-4 py-4">
          <p className="flex items-center gap-1.5 font-mono text-2xl font-bold tabular-nums text-text">
            {summary?.active ?? 0}
            <InfinityIcon className="size-4 text-ok" aria-hidden="true" />
          </p>
          <p className="mt-0.5 text-[11px] text-text/55">{t("চালু Pro সদস্য", "Pro members")}</p>
        </Card>
      </div>

      <div className="mb-6 max-w-xs">
        <SelectField
          label={t("অবস্থা", "Status")}
          value={status}
          onChange={(e) => setStatus(e.target.value)}
        >
          <option value="Pending">{t("অপেক্ষমাণ", "Pending")}</option>
          <option value="Active">{t("চালু", "Active")}</option>
          <option value="Rejected">{t("বাতিল", "Rejected")}</option>
          <option value="All">{t("সব", "All")}</option>
        </SelectField>
      </div>

      {rows === null ? (
        <LoadingBlock label={t("তথ্য আসছে…", "Loading…")} />
      ) : rows.length === 0 ? (
        <EmptyState
          title={t("কোনো Pro আবেদন নেই", "No Pro payments yet")}
          description={t(
            "কোনো শিক্ষার্থী ৳৫০০ পাঠালে এখানে তার TrxID দেখা যাবে।",
            "When a student pays ৳500 their TrxID shows up here.",
          )}
          icon={<Sparkles className="size-5" />}
        />
      ) : (
        <TableFrame
          caption={t("Pro সাবস্ক্রিপশন", "Pro subscriptions")}
          head={
            <>
              <Th>{t("শিক্ষার্থী", "Student")}</Th>
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
                <span className="block font-semibold text-text">{r.name || "—"}</span>
                <span className="block font-mono text-[11px] text-text/50">
                  {r.rollNumber != null ? `#${r.rollNumber} · ` : ""}
                  {r.whatsapp}
                </span>
              </Td>
              <Td className="font-mono text-[12px]">{r.trxId}</Td>
              <Td className="tabular-nums">৳{r.amount}</Td>
              <Td>
                <StatusMark
                  tone={r.status === "Active" ? "done" : r.status === "Rejected" ? "neutral" : "pending"}
                >
                  {r.status}
                </StatusMark>
                {r.status === "Active" && (
                  <span className="mt-1 block text-[10px] text-text/45">
                    {t("আজীবন মেয়াদ", "lifetime")}
                  </span>
                )}
              </Td>
              <Td>
                <div className="flex justify-end gap-2">
                  {r.status === "Pending" && (
                    <>
                      <Button
                        size="sm"
                        disabled={busy === r._id}
                        onClick={() => act(r._id, "APPROVE")}
                        iconLeft={<Check className="h-3.5 w-3.5" />}
                      >
                        {t("Pro চালু", "Activate")}
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
                  {r.status === "Active" && r.rollNumber != null && (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy === `revoke-${r.rollNumber}`}
                      onClick={() => revoke(r.rollNumber as number)}
                    >
                      {t("Pro বন্ধ করুন", "Switch off")}
                    </Button>
                  )}
                </div>
              </Td>
            </tr>
          ))}
        </TableFrame>
      )}
    </AdminShell>
  );
}
