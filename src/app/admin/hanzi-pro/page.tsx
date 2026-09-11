"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import { Check, RefreshCw, Search, Trash2, Trophy } from "lucide-react";
import { useLanguage } from "@/i18n";
import { AdminShell } from "@/features/academy";
import {
  EmptyState,
  IconButton,
  LoadingBlock,
  TableFrame,
  Td,
  Th,
  useConfirm,
  useToast,
} from "@/components/ui";
import { LESSON_WORDS } from "@/features/chinese-words";

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

type HPStudent = {
  _id: string;
  name: string;
  phone: string;
  trxId: string;
  amount: number;
  learnedCount: number;
  status: "Pending" | "Active";
  createdAt?: string;
};

const TOTAL_WORDS = (() => {
  const seen = new Set<string>();
  for (const w of LESSON_WORDS) {
    if (w.level === 1) seen.add(w.hanzi);
  }
  return seen.size;
})();

export default function AdminHanziProPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );
  const toast = useToast();
  const confirm = useConfirm();

  const [students, setStudents] = useState<HPStudent[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [edits, setEdits] = useState<Record<string, number>>({});

  const fetchStudents = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/hanzi-pro", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setStudents(data.students || []);
    } catch {
      toast(t("তালিকা লোড করা যায়নি।", "Couldn't load the list."), "error");
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    queueMicrotask(() => fetchStudents());
  }, [fetchStudents]);

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        String(s.phone).includes(q) ||
        s.trxId.toLowerCase().includes(q),
    );
  }, [students, query]);

  const totalLearned = students.reduce((n, s) => n + (Number(s.learnedCount) || 0), 0);
  const activeCount = students.filter((s) => s.status === "Active").length;
  const avgProgress =
    students.length > 0 ? Math.round((totalLearned / (students.length * TOTAL_WORDS)) * 100) : 0;

  const updateStudent = async (s: HPStudent, learnedCount?: number, status?: "Pending" | "Active") => {
    setBusy(s._id);
    try {
      const res = await fetch("/api/hanzi-pro", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          id: s._id,
          learnedCount: learnedCount ?? s.learnedCount,
          status: status ?? s.status,
          adminPasscode: ADMIN_PASSCODE,
        }),
      });
      const data = await res.json();
      if (data.success) {
        setStudents((prev) => prev.map((x) => (x._id === s._id ? { ...x, ...data.student } : x)));
        setEdits((e) => {
          const next = { ...e };
          delete next[s._id];
          return next;
        });
        toast(t("আপডেট হয়েছে।", "Updated."), "success");
      } else {
        toast(data.error || t("আপডেট হয়নি।", "Update failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusy(null);
    }
  };

  const removeStudent = async (s: HPStudent) => {
    const ok = await confirm({
      title: t("শিক্ষার্থী মুছবেন?", "Delete this student?"),
      message: t(
        `${s.name} (${s.phone}) চ্যালেঞ্জ রেজিস্ট্রি থেকে স্থায়ীভাবে মুছে যাবে।`,
        `${s.name} (${s.phone}) will be permanently removed from the challenge.`,
      ),
      confirmLabel: t("মুছুন", "Delete"),
      destructive: true,
    });
    if (!ok) return;
    setBusy(s._id);
    try {
      const res = await fetch(
        `/api/hanzi-pro?id=${encodeURIComponent(s._id)}&adminPasscode=${encodeURIComponent(ADMIN_PASSCODE)}`,
        { method: "DELETE" },
      );
      const data = await res.json();
      if (data.success) {
        toast(t("মুছে ফেলা হয়েছে।", "Deleted."), "success");
        fetchStudents();
      } else {
        toast(data.error || t("মোছা যায়নি।", "Delete failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusy(null);
    }
  };

  return (
    <AdminShell
      title={t("হানজি প্রো চ্যালেঞ্জ", "Hanzi Pro challenge")}
      crumb={t("হানজি প্রো", "Hanzi Pro")}
      seal="挑"
      lede={t(
        "৩০০ শব্দের চ্যালেঞ্জের শিক্ষার্থীদের অগ্রগতি ট্র্যাক করুন — কে কতটা হানজি শিখল, এখান থেকেই আপডেট করুন।",
        "Track the 300-word challenge students — update how many hanzi each one has learned, right from here."
      )}
      actions={
        <IconButton label={t("রিফ্রেশ", "Refresh")} size="sm" spinning={loading} onClick={fetchStudents}>
          <RefreshCw className="h-4 w-4" />
        </IconButton>
      }
    >
      {/* overview tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
        {[
          { label: t("রেজিস্ট্রেশন", "Registered"), value: students.length, tone: "text-primary" },
          { label: t("অ্যাক্টিভ", "Active"), value: activeCount, tone: "text-ok" },
          { label: t("মোট শিখেছে", "Total learned"), value: totalLearned, tone: "text-text" },
          { label: t("গড় অগ্রগতি", "Avg progress"), value: `${avgProgress}%`, tone: "text-warn" },
        ].map((tile) => (
          <div key={tile.label} className="rounded-2xl border border-text/10 bg-card p-4 shadow-sm">
            <div className="flex items-center justify-between gap-2">
              <Trophy className={`size-4 ${tile.tone}`} aria-hidden="true" />
              <span className="font-mono text-xl font-bold tabular-nums text-text">
                {loading ? "—" : tile.value}
              </span>
            </div>
            <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-text/50">
              {tile.label}
            </p>
          </div>
        ))}
      </div>

      {/* search */}
      <div className="relative mt-6">
        <Search
          className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text/40"
          aria-hidden="true"
        />
        <input
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={t("নাম, ফোন বা TrxID দিয়ে খুঁজুন…", "Search by name, phone or TrxID…")}
          className="w-full rounded-xl border border-text/15 bg-card py-2.5 pl-10 pr-3.5 text-sm text-text placeholder:text-text/35 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
        />
      </div>

      {/* student table */}
      <div className="mt-6">
        {loading ? (
          <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={3} />
        ) : students.length === 0 ? (
          <EmptyState
            title={t("এখনো কোনো রেজিস্ট্রেশন নেই", "No registrations yet")}
            description={t(
              "/hanzi-pro পেজ থেকে শিক্ষার্থীরা রেজিস্ট্রেশন করলে এখানে দেখা যাবে।",
              "Registrations from the /hanzi-pro page will appear here.",
            )}
          />
        ) : filtered.length === 0 ? (
          <EmptyState
            title={t("ম্যাচ পাওয়া যায়নি", "No matches")}
            description={t("অন্য কিছু দিয়ে খুঁজে দেখুন।", "Try a different search.")}
          />
        ) : (
          <TableFrame
            caption={t("চ্যালেঞ্জ শিক্ষার্থীরা", "Challenge students")}
            minWidth="56rem"
            head={
              <>
                <Th>{t("নাম", "Name")}</Th>
                <Th>{t("হোয়াটসঅ্যাপ", "WhatsApp")}</Th>
                <Th>TrxID</Th>
                <Th className="text-right">{t("শিখেছে", "Learned")}</Th>
                <Th>{t("অগ্রগতি", "Progress")}</Th>
                <Th>{t("স্ট্যাটাস", "Status")}</Th>
                <Th className="text-right">{t("কাজ", "Actions")}</Th>
              </>
            }
          >
            {filtered.map((s) => {
              const learned = edits[s._id] ?? s.learnedCount;
              const pct = Math.min(100, Math.round((learned / TOTAL_WORDS) * 100));
              const dirty = edits[s._id] !== undefined && edits[s._id] !== s.learnedCount;
              return (
                <tr key={s._id}>
                  <Td className="font-semibold text-text">{s.name}</Td>
                  <Td className="tabular-nums">{s.phone}</Td>
                  <Td className="font-mono text-xs text-text/60">{s.trxId}</Td>
                  <Td className="text-right">
                    <input
                      type="number"
                      min={0}
                      max={TOTAL_WORDS}
                      value={learned}
                      onChange={(e) =>
                        setEdits((prev) => ({ ...prev, [s._id]: Math.max(0, Number(e.target.value) || 0) }))
                      }
                      className={`w-20 rounded-lg border bg-card px-2 py-1.5 text-right font-mono text-sm tabular-nums text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text ${
                        dirty ? "border-primary/60" : "border-text/15"
                      }`}
                      aria-label={t(`${s.name} এর শেখা শব্দ সংখ্যা`, `Learned count for ${s.name}`)}
                    />
                    <span className="ml-1 text-[11px] text-text/45">/{TOTAL_WORDS}</span>
                  </Td>
                  <Td>
                    <div className="flex w-32 items-center gap-2">
                      <div className="h-2 w-full overflow-hidden rounded-full bg-text/10">
                        <div
                          className={`h-full rounded-full transition-all ${
                            pct >= 80 ? "bg-ok" : pct >= 40 ? "bg-warn" : "bg-danger"
                          }`}
                          style={{ width: `${pct}%` }}
                        />
                      </div>
                      <span className="text-[11px] tabular-nums text-text/55">{pct}%</span>
                    </div>
                  </Td>
                  <Td>
                    <button
                      type="button"
                      disabled={busy === s._id}
                      onClick={() => updateStudent(s, learned, s.status === "Active" ? "Pending" : "Active")}
                      className="rounded-md px-1.5 py-1 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text disabled:opacity-50"
                      title={t("স্ট্যাটাস বদলান", "Toggle status")}
                    >
                      {s.status === "Active" ? (
                        <span className="rounded-full border border-ok/40 bg-ok/10 px-2 py-0.5 text-[11px] font-semibold text-ok">
                          ✓ Active
                        </span>
                      ) : (
                        <span className="rounded-full border border-warn/40 bg-warn/10 px-2 py-0.5 text-[11px] font-semibold text-warn">
                          Pending
                        </span>
                      )}
                    </button>
                  </Td>
                  <Td className="text-right">
                    <div className="flex justify-end gap-1.5">
                      <IconButton
                        label={t("শেখা শব্দ সেভ করুন", "Save learned count")}
                        size="sm"
                        disabled={!dirty || busy === s._id}
                        onClick={() => updateStudent(s, learned)}
                      >
                        <Check className="h-4 w-4" />
                      </IconButton>
                      <IconButton
                        label={t("মুছুন", "Delete")}
                        size="sm"
                        disabled={busy === s._id}
                        onClick={() => removeStudent(s)}
                      >
                        <Trash2 className="h-4 w-4" />
                      </IconButton>
                    </div>
                  </Td>
                </tr>
              );
            })}
          </TableFrame>
        )}
      </div>

    </AdminShell>
  );
}
