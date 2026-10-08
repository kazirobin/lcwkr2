"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
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

/** Sign-in totals the students table shows next to each name. */
type SessionInfo = {
  logins: number;
  totalSeconds: number;
  lastLoginAt: string | null;
  lastLogoutAt: string | null;
  onlineNow: boolean;
  /** Pages they opened, best first — the answer to "where do they spend it". */
  topPages?: { path: string; count: number }[];
};

/** One student's whole sign-in history, for the activity panel. */
type SignInDetail = {
  summary: {
    logins: number;
    totalSeconds: number;
    lastLoginAt: string | null;
    lastLogoutAt: string | null;
    activeLoginAt: string | null;
    onlineNow: boolean;
  };
  recent: { loginAt: string; logoutAt: string | null; durationSec: number; active: boolean }[];
  topPages: { path: string; count: number }[];
};

/** School-wide sign-in figures, for the summary strip above the table. */
type LoginTotals = {
  distinctStudents: number;
  logins: number;
  onlineNow: number;
  lastLoginAt: string | null;
};

/** "2h 15m" reads faster than a minute count when a row is 60 students tall. */
function humanTime(seconds: number): string {
  if (!seconds || seconds < 60) return seconds ? `${Math.round(seconds)}s` : "—";
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

function daysAgo(iso: string | null): string {
  if (!iso) return "—";
  const then = new Date(iso).getTime();
  if (Number.isNaN(then)) return "—";
  const days = Math.floor((Date.now() - then) / 86400000);
  if (days <= 0) return "today";
  if (days === 1) return "1d ago";
  if (days < 30) return `${days}d ago`;
  return new Date(iso).toLocaleDateString("en-GB", { day: "2-digit", month: "short" });
}

/** "06 Oct, 14:02" — when one visit in the history started. */
function clock(iso: string | null): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    hour: "2-digit",
    minute: "2-digit",
  });
}

/** Total time including a visit that is still running, so "so far" means so far. */
function liveSeconds(detail: SignInDetail): number {
  const { summary } = detail;
  const running =
    summary.onlineNow && summary.activeLoginAt
      ? Math.max(0, (Date.now() - new Date(summary.activeLoginAt).getTime()) / 1000)
      : 0;
  return (summary.totalSeconds ?? 0) + running;
}

/** How long one visit lasted — including one that has not ended yet. */
function visitLength(r: {
  loginAt: string;
  logoutAt: string | null;
  durationSec: number;
  active: boolean;
}): number {
  if (r.active) return Math.max(0, (Date.now() - new Date(r.loginAt).getTime()) / 1000);
  if (r.durationSec) return r.durationSec;
  if (r.logoutAt) {
    return Math.max(0, (new Date(r.logoutAt).getTime() - new Date(r.loginAt).getTime()) / 1000);
  }
  return 0;
}

/** Every column the students table can be sorted by — all but Actions. */
type SortKey =
  | "roll"
  | "name"
  | "track"
  | "logins"
  | "seconds"
  | "lastSeen"
  | "topPage"
  | "whatsapp"
  | "group"
  | "pro";

/** null means no sort is chosen, so the table keeps its natural roll order. */
type SortState = { key: SortKey; dir: "asc" | "desc" } | null;

/** The value a column sorts on. It never renders — it only has to compare. */
function sortValue(
  s: Student,
  k: SortKey,
  info: SessionInfo | undefined,
): string | number | null {
  switch (k) {
    case "roll":
      return s.rollNumber;
    case "name":
      return s.nameEnglish;
    case "track":
      return s.enrolledCourseId || s.enrolledCourseIds?.[0] || "";
    case "logins":
      return info?.logins ?? 0;
    case "seconds":
      return info?.totalSeconds ?? 0;
    case "lastSeen": {
      const iso = info?.lastLoginAt;
      if (!iso) return null;
      const ms = new Date(iso).getTime();
      return Number.isNaN(ms) ? null : ms;
    }
    case "topPage":
      return info?.topPages?.[0]?.count ?? 0;
    case "whatsapp":
      return s.whatsapp;
    case "group":
      return s.isWhatsAppGroupJoined ? 1 : 0;
    case "pro":
      return s.isPro ? 1 : 0;
    default:
      return null;
  }
}

function compareSortValues(a: string | number | null, b: string | number | null, dir: "asc" | "desc") {
  // Empty cells sink to the bottom whichever way the column is sorted, the way
  // a spreadsheet keeps blanks out of the way.
  if (a === null) return b === null ? 0 : 1;
  if (b === null) return -1;
  const diff =
    typeof a === "number" && typeof b === "number"
      ? a - b
      : // numeric: so 2 sorts before 10 — phone numbers and rolls are strings
        // in the table but must not read as lexicographic noise.
        String(a).localeCompare(String(b), undefined, { numeric: true, sensitivity: "base" });
  return dir === "asc" ? diff : -diff;
}

/** A header that sorts its column on click, like a spreadsheet column head. */
function SortTh({
  label,
  hint,
  column,
  sort,
  onSort,
  className = "",
}: {
  label: string;
  hint: string;
  column: SortKey;
  sort: SortState;
  onSort: (k: SortKey) => void;
  className?: string;
}) {
  const active = sort?.key === column;
  const dir = active ? sort?.dir : null;
  return (
    <Th
      className={className}
      aria-sort={active ? (dir === "asc" ? "ascending" : "descending") : "none"}
    >
      <button
        type="button"
        onClick={() => onSort(column)}
        title={`${hint}: ${label}`}
        className="group -mx-1 inline-flex max-w-full items-center gap-1 rounded px-1 py-0.5 text-left hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
      >
        <span className="truncate">{label}</span>
        {/* Click cycles small → large → unset, so the third click clears the
            arrow instead of leaving a column stuck sorted forever. */}
        <span
          aria-hidden="true"
          className={`shrink-0 text-[9px] leading-none transition-colors ${
            active ? "text-text/80" : "text-text/25 group-hover:text-text/60"
          }`}
        >
          {dir === "asc" ? "▲" : dir === "desc" ? "▼" : "⇅"}
        </span>
      </button>
    </Th>
  );
}

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
  /** Keyed by the student's phone, the same identity the login uses. */
  const [sessions, setSessions] = useState<Record<string, SessionInfo>>({});
  const [loginTotals, setLoginTotals] = useState<LoginTotals | null>(null);
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
  /** Sign-in history and favourite pages for the student in the panel. */
  const [signins, setSignins] = useState<SignInDetail | null>(null);
  const [signinsLoading, setSigninsLoading] = useState(false);

  const openActivity = (s: Student) => {
    setActivityFor(s);
    setActivity(null);
    setActivityLoading(true);
    setSignins(null);
    setSigninsLoading(true);
    const qp = encodeURIComponent(s.whatsapp);
    fetch(`/api/academy/students/sessions?passcode=${encodeURIComponent(ADMIN_PASSCODE)}&phone=${qp}`, {
      cache: "no-store",
    })
      .then((r) => r.json())
      .then((d) => setSignins(d?.success && d.summary ? (d as SignInDetail) : null))
      .catch(() => setSignins(null))
      .finally(() => setSigninsLoading(false));
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
      // The session summary is a separate read so a database hiccup there
      // cannot stop the student list itself from rendering.
      //
      // Both of these need the passcode. The public student list deliberately
      // withholds phone numbers, and the login report is keyed by phone — so
      // without the passcode the table was looking sessions up by a field that
      // was not in the response, and every row showed a blank history.
      const qs = `passcode=${encodeURIComponent(ADMIN_PASSCODE)}`;
      const [s, c, sess] = await Promise.all([
        fetch(`/api/academy/students?status=Approved&include=contact&${qs}`, {
          cache: "no-store",
        }).then((r) => r.json()),
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch(`/api/academy/students/sessions?${qs}`, { cache: "no-store" })
          .then((r) => r.json())
          .catch(() => null),
      ]);
      if (s.success) setStudents(s.students || []);
      if (c.success) setCourses(c.courses || []);
      if (sess?.success) {
        setSessions(sess.sessions || {});
        if (sess.totals) setLoginTotals(sess.totals);
      }
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

  // Column sorting, spreadsheet-style: a click sorts up, the next sorts down,
  // and a third returns the column to the natural roll order. Sorting runs over
  // the searched list, so "who signed in most out of the rows I searched" works.
  const [sort, setSort] = useState<SortState>(null);
  const toggleSort = useCallback((k: SortKey) => {
    setSort((cur) =>
      cur?.key === k ? (cur.dir === "asc" ? { key: k, dir: "desc" } : null) : { key: k, dir: "asc" },
    );
  }, []);

  const sorted = useMemo(() => {
    if (!sort) return filtered;
    return [...filtered].sort((a, b) =>
      compareSortValues(
        sortValue(a, sort.key, sessions[a.whatsapp]),
        sortValue(b, sort.key, sessions[b.whatsapp]),
        sort.dir,
      ),
    );
  }, [filtered, sessions, sort]);

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

      {/* Sign-in reach across the school. Per-row figures are only trustworthy
          next to the total, because a table of 66 rows does not tell you that
          3 of them have ever signed in. */}
      {loginTotals ? (
        <dl className="mb-4 grid grid-cols-2 gap-2 sm:grid-cols-4">
          {(
            [
              { k: t("অন্তত একবার সাইন ইন", "Ever signed in"), v: String(loginTotals.distinctStudents) },
              { k: t("মোট সাইন ইন", "Total sign-ins"), v: String(loginTotals.logins) },
              { k: t("এখন অনলাইন", "Online now"), v: String(loginTotals.onlineNow) },
              { k: t("শেষ সাইন ইন", "Last sign-in"), v: daysAgo(loginTotals.lastLoginAt) },
            ] as const
          ).map((cell) => (
            <div key={cell.k} className="rounded-xl border border-text/15 bg-card px-3.5 py-2.5">
              <dt className="text-[11px] text-text/55">{cell.k}</dt>
              <dd className="mt-0.5 text-lg font-semibold tabular-nums text-text">{cell.v}</dd>
            </div>
          ))}
        </dl>
      ) : null}

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
          minWidth="86rem"
          head={
            <>
              <SortTh
                label={t("রোল", "Roll")}
                hint={t("সাজান", "Sort")}
                column="roll"
                sort={sort}
                onSort={toggleSort}
                className="w-14"
              />
              <SortTh label={t("নাম", "Name")} hint={t("সাজান", "Sort")} column="name" sort={sort} onSort={toggleSort} />
              <SortTh label={t("ট্র্যাক", "Track")} hint={t("সাজান", "Sort")} column="track" sort={sort} onSort={toggleSort} />
              <SortTh label={t("লগইন", "Sign-ins")} hint={t("সাজান", "Sort")} column="logins" sort={sort} onSort={toggleSort} />
              <SortTh label={t("সময় দিয়েছেন", "Time spent")} hint={t("সাজান", "Sort")} column="seconds" sort={sort} onSort={toggleSort} />
              <SortTh label={t("শেষ এসেছেন", "Last seen")} hint={t("সাজান", "Sort")} column="lastSeen" sort={sort} onSort={toggleSort} />
              <SortTh label={t("বেশি দেখা পেজ", "Most visited")} hint={t("সাজান", "Sort")} column="topPage" sort={sort} onSort={toggleSort} />
              <SortTh label={t("হোয়াটসঅ্যাপ", "WhatsApp")} hint={t("সাজান", "Sort")} column="whatsapp" sort={sort} onSort={toggleSort} />
              <SortTh label={t("গ্রুপ", "Group")} hint={t("সাজান", "Sort")} column="group" sort={sort} onSort={toggleSort} />
              <SortTh label={t("প্রো", "Pro")} hint={t("সাজান", "Sort")} column="pro" sort={sort} onSort={toggleSort} />
              <Th className="text-right">{t("কাজ", "Actions")}</Th>            </>
          }
        >
          {sorted.map((s) => (
            <tr key={s.rollNumber}>
              <Td className="tabular-nums text-text/60">#{s.rollNumber}</Td>
              <Td className="font-semibold text-text">
                <Link
                  href={`/admin/students/${s.rollNumber}`}
                  className="underline-offset-2 hover:underline"
                >
                  {s.nameEnglish}
                </Link>
              </Td>
              <Td className="tabular-nums">{trackOf(s)}</Td>
              {/* How engaged each student is: sign-in count, time on the
                  site, and when they were last here. */}
              <Td className="tabular-nums">
                {(() => {
                  const info = sessions[s.whatsapp];
                  if (!info) {
                    return (
                      <span className="text-text/40" title={t("কখনো লগইন করেননি", "never signed in")}>
                        0
                      </span>
                    );
                  }
                  return (
                    <span className="inline-flex items-center gap-1.5">
                      {info.logins}
                      {info.onlineNow && (
                        <span
                          className="size-1.5 rounded-full bg-ok"
                          title={t("এখন অনলাইন", "online now")}
                        />
                      )}
                    </span>
                  );
                })()}
              </Td>
              <Td className="tabular-nums">
                {humanTime(sessions[s.whatsapp]?.totalSeconds ?? 0)}
              </Td>
              <Td className="whitespace-nowrap text-text/60">
                {daysAgo(sessions[s.whatsapp]?.lastLoginAt ?? null)}
              </Td>
              {/* Which page they keep coming back to. The row carries the
                  favourite; the whole list lives in the activity panel. */}
              <Td>
                {(() => {
                  const pages = sessions[s.whatsapp]?.topPages ?? [];
                  if (pages.length === 0) {
                    return (
                      <span className="text-text/40" title={t("কোনো পেজ রেকর্ড নেই", "no page views recorded")}>
                        —
                      </span>
                    );
                  }
                  return (
                    <span
                      className="block max-w-[15rem] truncate font-mono text-[11px] text-text/70"
                      title={pages.map((p) => `${p.path} ×${p.count}`).join("\n")}
                    >
                      {pages[0].path}{" "}
                      <span className="font-sans font-semibold text-text/50">×{pages[0].count}</span>
                      {pages.length > 1 && (
                        <span className="font-sans text-text/35"> +{pages.length - 1}</span>
                      )}
                    </span>
                  );
                })()}
              </Td>
              <Td className="tabular-nums">
                {/* Plain text on purpose. It was a wa.me link, so clicking a row
                    to read it threw open WhatsApp on the admin's own machine,
                    which is not what anybody reading a roster wants. The number
                    is still selectable and copyable. */}
                <span
                  className="select-all"
                  title={t("কপি করতে নম্বরটি সিলেক্ট করুন", "Select to copy the number")}
                >
                  {s.whatsapp}
                </span>
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

            {/* Sign-in history first: how many times they came, how long each
                visit lasted, and which pages they keep coming back to. */}
            <div>
              <h4 className="mb-1.5 text-xs font-bold text-text">
                🔐 {t("লগইন", "Sign-ins")}
                {signins ? ` (${signins.summary.logins})` : ""}
              </h4>
              {signinsLoading ? (
                <p className="text-[11px] text-text/40">{t("লোড হচ্ছে...", "Loading...")}</p>
              ) : !signins ? (
                <p className="text-[11px] text-text/40">
                  {t("কোনো লগইন রেকর্ড নেই।", "No sign-ins recorded.")}
                </p>
              ) : (
                <div className="space-y-2">
                  <p className="text-[11px] leading-5 tabular-nums text-text/60">
                    {t("মোট", "Total")}:{" "}
                    <span className="font-semibold text-text">
                      {signins.summary.logins} {t("বার", "times")}
                    </span>
                    {" · "}
                    {t("সময়", "Time")}:{" "}
                    <span className="font-semibold text-text">{humanTime(liveSeconds(signins))}</span>
                    {" · "}
                    {t("শেষ এসেছেন", "Last seen")}:{" "}
                    <span className="font-semibold text-text">{daysAgo(signins.summary.lastLoginAt)}</span>
                    {signins.summary.onlineNow && (
                      <span className="ml-1 font-bold text-ok">{t("· এখন অনলাইন", "· online now")}</span>
                    )}
                  </p>
                  <ul className="divide-y divide-text/10 rounded-lg border border-text/10">
                    {signins.recent.map((r, i) => (
                      <li
                        key={`${r.loginAt}-${i}`}
                        className="flex items-center justify-between gap-2 px-2.5 py-1.5 text-[11px]"
                      >
                        <span className="tabular-nums text-text/60">{clock(r.loginAt)}</span>
                        <span
                          className={`font-semibold tabular-nums ${
                            r.active ? "text-ok" : "text-text"
                          }`}
                        >
                          {r.active
                            ? t(
                                `এখন অনলাইন · ${humanTime(visitLength(r))}`,
                                `online now · ${humanTime(visitLength(r))}`,
                              )
                            : humanTime(visitLength(r))}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <div>
              <h4 className="mb-1.5 text-xs font-bold text-text">
                📄 {t("বেশি দেখা পেজ", "Pages opened most")}
              </h4>
              {signinsLoading ? (
                <p className="text-[11px] text-text/40">{t("লোড হচ্ছে...", "Loading...")}</p>
              ) : !signins || signins.topPages.length === 0 ? (
                <p className="text-[11px] text-text/40">
                  {t("কোনো পেজ রেকর্ড করা হয়নি।", "No page views recorded.")}
                </p>
              ) : (
                <ul className="space-y-1">
                  {signins.topPages.map((p) => (
                    <li key={p.path} className="flex items-center justify-between gap-2 text-xs">
                      <span className="min-w-0 truncate font-mono text-[11px] text-text/70">{p.path}</span>
                      <span className="font-mono font-bold tabular-nums text-text">×{p.count}</span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

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
