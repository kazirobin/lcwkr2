"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { Clock, Hourglass, RefreshCw, Timer, Trash2, User, Users } from "lucide-react";
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
import { formatRemaining } from "@/features/chinese-words/components/pro-access";

/**
 * Who has used the ten-minute Pro preview, and who is in it right now.
 *
 * The preview used to live only in the visitor's browser, which made it
 * impossible to answer the two questions that matter: has this person already
 * had their ten minutes, and can I give them another ten because they asked?
 * Both are one button here now, and the window they move is the same one the
 * browser obeys — the visitor does not have to reload for a renewal to land,
 * because the page re-checks every thirty seconds.
 *
 * Somebody who never signs in is listed as an anonymous visitor, which is all
 * the site knows about them and all it needs to renew their time.
 */

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

type Row = {
  _id: string;
  visitorId: string;
  name: string;
  whatsapp: string;
  location: string;
  rollNumber?: number | null;
  startedAt: string;
  expiresAt: string;
  usedMs: number;
  renewals: number;
  lastRenewedAt?: string | null;
  revokedAt?: string | null;
  remainingMs: number;
  active: boolean;
};

type Summary = {
  total: number;
  activeNow: number;
  students: number;
  others: number;
  renewals: number;
  usedMsTotal: number;
};

function when(iso: string) {
  return new Date(iso).toLocaleString("en-GB", {
    day: "numeric",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** "4m 20s" of preview actually spent. */
function spent(ms: number) {
  const total = Math.round(ms / 1000);
  if (total < 60) return `${total}s`;
  return `${Math.floor(total / 60)}m ${total % 60}s`;
}

export default function AdminProTrialsPage() {
  const { language } = useLanguage();
  const toast = useToast();
  const t = useCallback((bn: string, en: string) => (language === "bn" ? bn : en), [language]);

  const [filter, setFilter] = useState("All");
  const [query, setQuery] = useState("");
  const [rows, setRows] = useState<Row[] | null>(null);
  const [summary, setSummary] = useState<Summary | null>(null);
  const [busy, setBusy] = useState<string | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/pro/trial", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "LIST", adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (res.ok && data.success) {
        setRows(data.trials ?? []);
        setSummary(data.summary ?? null);
      } else {
        setRows([]);
        toast(data.error || data.message || t("তথ্য আসেনি।", "Could not load."), "error");
      }
    } catch {
      setRows([]);
      toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
    }
  }, [t, toast]);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) void load();
    });
    return () => {
      alive = false;
    };
  }, [load]);

  const act = useCallback(
    async (trialId: string, action: "RENEW" | "END" | "DELETE") => {
      setBusy(`${action}-${trialId}`);
      try {
        const res = await fetch("/api/pro/trial", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ action, trialId, adminPasscode: ADMIN_PASSCODE }),
        });
        const data = await res.json();
        if (!res.ok || !data.success) {
          toast(data.message || t("কাজটি হয়নি।", "That did not work."), "error");
          return;
        }
        toast(
          action === "RENEW"
            ? t("আরও ১০ মিনিট দেওয়া হয়েছে।", "Another ten minutes granted.")
            : action === "END"
              ? t("প্রিভিউ বন্ধ করা হয়েছে।", "Preview stopped.")
              : t("রেকর্ড মুছে ফেলা হয়েছে।", "Record deleted."),
          "success",
        );
        void load();
      } catch {
        toast(t("নেটওয়ার্ক সমস্যা।", "Network problem."), "error");
      } finally {
        setBusy(null);
      }
    },
    [load, t, toast],
  );

  const shown = useMemo(() => {
    if (!rows) return null;
    const byState =
      filter === "Active" ? rows.filter((r) => r.active) : filter === "Ended" ? rows.filter((r) => !r.active) : rows;
    const needle = query.trim().toLowerCase();
    if (!needle) return byState;
    return byState.filter((r) => {
      const roll = r.rollNumber != null ? String(r.rollNumber) : "";
      return [r.name, r.whatsapp, r.location, roll].some((part) =>
        part.toLowerCase().includes(needle),
      );
    });
  }, [rows, filter, query]);

  return (
    <AdminShell
      title={t("ফ্রি Pro প্রিভিউ", "Free Pro preview")}
      crumb={t("১০ মিনিট", "Ten minutes")}
      seal="钟"
      lede={t(
        "প্রতিটি নতুন ভিজিটর একবার ১০ মিনিট Pro ফ্রি দেখতে পারে — লগইন না করলেও। যাঁরা শেষ করেছে তাদের এখান থেকে আরও ১০ মিনিট দেওয়া যাবে; সাইট খোলা থাকলে তারা নিজে থেকেই পাবে।",
        "Every new visitor gets ten minutes of Pro once, without signing in. When they run out you can grant another ten from here, and if their tab is still open they pick it up on their own within half a minute.",
      )}
      actions={
        <Button onClick={() => void load()} iconLeft={<RefreshCw className="h-4 w-4" />}>
          {t("রিফ্রেশ", "Refresh")}
        </Button>
      }
    >
      <SectionHanzi char="时" className="-top-16 right-4" />

      <div className="mb-6 grid gap-3 sm:grid-cols-2 lg:grid-cols-4">
        <Card className="px-4 py-4">
          <p className="flex items-center gap-1.5 font-mono text-2xl font-bold tabular-nums text-text">
            {summary?.activeNow ?? 0}
            <Timer className="size-4 text-secondary" aria-hidden="true" />
          </p>
          <p className="mt-0.5 text-[11px] text-text/55">{t("এখন প্রিভিউতে", "in a preview now")}</p>
        </Card>
        <Card className="px-4 py-4">
          <p className="font-mono text-2xl font-bold tabular-nums text-text">{summary?.total ?? 0}</p>
          <p className="mt-0.5 text-[11px] text-text/55">{t("মোট প্রিভিউ", "previews ever")}</p>
        </Card>
        <Card className="px-4 py-4">
          <p className="flex items-center gap-1.5 font-mono text-2xl font-bold tabular-nums text-text">
            {summary?.others ?? 0}
            <Users className="size-4 text-text/45" aria-hidden="true" />
          </p>
          <p className="mt-0.5 text-[11px] text-text/55">
            {t("রোস্টারে নেই", "not on the roster")}
          </p>
        </Card>
        <Card className="px-4 py-4">
          <p className="flex items-center gap-1.5 font-mono text-2xl font-bold tabular-nums text-text">
            {summary?.renewals ?? 0}
            <RefreshCw className="size-4 text-ok" aria-hidden="true" />
          </p>
          <p className="mt-0.5 text-[11px] text-text/55">{t("renew দেওয়া হয়েছে", "renewals given")}</p>
        </Card>
      </div>

      <div className="mb-6 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="min-w-0 max-w-sm flex-1">
          <label className="mb-1.5 block text-[12px] font-semibold text-text/70">
            {t("খুঁজুন", "Search")}
          </label>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("নাম, নম্বর বা #roll", "Name, number or #roll")}
            className="w-full rounded-xl border border-text/15 bg-card px-3.5 py-2.5 text-sm text-text outline-none transition focus-visible:border-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-1"
          />
        </div>
        <div className="max-w-xs">
          <SelectField label={t("দেখান", "Show")} value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="All">{t("সব", "All")}</option>
            <option value="Active">{t("এখন চলছে", "Running now")}</option>
            <option value="Ended">{t("শেষ হয়েছে", "Finished")}</option>
          </SelectField>
        </div>
      </div>

      {shown === null ? (
        <LoadingBlock label={t("তথ্য আসছে…", "Loading…")} />
      ) : shown.length === 0 ? (
        <EmptyState
          title={
            query.trim()
              ? t("কিছু পাওয়া যায়নি", "Nothing matches")
              : filter === "Active"
                ? t("এখন কারও প্রিভিউ চলছে না", "No preview running right now")
                : t("কোনো প্রিভিউ নেই", "No previews yet")
          }
          description={
            query.trim()
              ? t("অন্য নাম বা নম্বর দিয়ে খুঁজে দেখুন।", "Try a different name or number.")
              : filter === "Active"
                ? t(
                    "শেষ হওয়া প্রিভিউ দেখতে \"শেষ হয়েছে\" বাছাই করুন — সেখান থেকে আবার ১০ মিনিট দেওয়া যায়।",
                    "Pick \"Finished\" to see the ended previews — that is where another ten minutes is granted from.",
                  )
                : t(
                    "কেউ HSK 2 বা কোর ওয়ার্ডস খুললেই এখানে তার সারি তৈরি হবে।",
                    "A row appears the moment somebody opens HSK 2 or the Core Words builder.",
                  )
          }
          icon={<Hourglass className="size-5" />}
        />
      ) : (
        <TableFrame
          caption={t("ফ্রি Pro প্রিভিউ", "Free Pro previews")}
          minWidth="60rem"
          head={
            <>
              <Th>{t("যে চেয়েছে", "Who asked")}</Th>
              <Th>{t("অবস্থান", "Location")}</Th>
              <Th>{t("শুরু", "Started")}</Th>
              <Th>{t("বাকি সময়", "Time left")}</Th>
              <Th>{t("ব্যবহার", "Used")}</Th>
              <Th>{t("Renew", "Renewals")}</Th>
              <Th className="text-right">{t("কাজ", "Actions")}</Th>
            </>
          }
        >
          {shown.map((r) => (
            <tr key={r._id}>
              <Td>
                <span className="block font-semibold text-text">{r.name || "—"}</span>
                <span className="block font-mono text-[11px] text-text/50">
                  {r.rollNumber != null && (
                    <span className="text-ok">#{r.rollNumber} </span>
                  )}
                  {r.whatsapp || "—"}
                </span>
              </Td>
              <Td className="text-[12px] text-text/60">{r.location || "—"}</Td>
              <Td className="text-[12px] text-text/70">{when(r.startedAt)}</Td>
              <Td>
                {r.active ? (
                  <StatusMark tone="pending">
                    <Clock className="mr-1 inline h-3 w-3" aria-hidden="true" />
                    {formatRemaining(r.remainingMs)}
                  </StatusMark>
                ) : (
                  <StatusMark tone="neutral">{t("শেষ", "over")}</StatusMark>
                )}
                {r.lastRenewedAt && (
                  <span className="mt-1 block text-[10px] text-text/45">
                    {t("সর্বশেষ renew", "last renewed")} {when(r.lastRenewedAt)}
                  </span>
                )}
              </Td>
              <Td className="tabular-nums text-text/70">{spent(r.usedMs)}</Td>
              <Td className="tabular-nums text-text/70">{r.renewals}</Td>
              <Td>
                <div className="flex justify-end gap-2">
                  {r.active ? (
                    <Button
                      size="sm"
                      variant="ghost"
                      disabled={busy === `END-${r._id}`}
                      onClick={() => act(r._id, "END")}
                    >
                      {t("বন্ধ করুন", "Stop")}
                    </Button>
                  ) : (
                    <Button
                      size="sm"
                      disabled={busy === `RENEW-${r._id}`}
                      onClick={() => act(r._id, "RENEW")}
                      iconLeft={<RefreshCw className="h-3.5 w-3.5" />}
                    >
                      {t("আরও ১০ মিনিট", "Give 10 more")}
                    </Button>
                  )}
                  <Button
                    size="sm"
                    variant="ghost"
                    disabled={busy === `DELETE-${r._id}`}
                    onClick={() => act(r._id, "DELETE")}
                    aria-label={t("রেকর্ড মুছুন", "Delete record")}
                    title={t("রেকর্ড মুছে ফেলুন", "Delete this record for good")}
                  >
                    <Trash2 className="h-3.5 w-3.5" aria-hidden="true" />
                  </Button>
                </div>
              </Td>
            </tr>
          ))}
        </TableFrame>
      )}

      <p className="mt-6 flex items-start gap-2 text-[11px] leading-relaxed text-text/45">
        <User className="mt-0.5 size-3.5 shrink-0" aria-hidden="true" />
        {t(
          "ভিজিটর নিজে নাম, মোবাইল নম্বর ও অবস্থান দিয়েই ১০ মিনিট চালু করেন — কোনো অনুমোদনের অপেক্ষা ছাড়াই। যার নম্বর রোস্টারে মিলছে তার roll স্বয়ংক্রিয়ভাবে বসে যায়। মুছে ফেললে রেকর্ড চিরতরে চলে যায়, তাই ভুল নম্বর থাকলে ব্যবহার করুন।",
          "A visitor supplies their own name, number and location, and the ten minutes open there and then — no approval in between. A number that matches the roster fills in the roll by itself. Deleting removes the record for good, so use it for a number that is wrong.",
        )}
      </p>
    </AdminShell>
  );
}
