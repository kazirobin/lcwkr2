"use client";

import { useState, useEffect, useCallback, useMemo } from "react";
import {
  Check,
  Lock,
  Plus,
  RefreshCw,
  Search,
  Trash2,
  Unlock,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { AdminShell } from "@/features/academy";
import {
  Button,
  Card,
  EmptyState,
  Field,
  IconButton,
  LoadingBlock,
  SelectField,
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
  location?: string;
  trxId: string;
  learnedCount: number;
  status: "Pending" | "Active";
  createdAt?: string;
};

type HPEntry = { studentId: string; name: string; learnedCount: number };

type HPSession = {
  _id: string;
  date: string;
  open: boolean;
  merged: boolean;
  entries: HPEntry[];
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
  const [sessions, setSessions] = useState<HPSession[]>([]);
  const [loading, setLoading] = useState(true);
  const [busy, setBusy] = useState<string | null>(null);
  const [query, setQuery] = useState("");
  const [edits, setEdits] = useState<Record<string, number>>({});

  // session form
  const [openDate, setOpenDate] = useState(new Date().toISOString().slice(0, 10));
  // entry editing inside a session
  const [entryEdits, setEntryEdits] = useState<Record<string, number>>({});
  // add-student-to-session form
  const [addStudentId, setAddStudentId] = useState("");
  const [addCount, setAddCount] = useState("");

  const activeStudents = useMemo(() => students.filter((s) => s.status === "Active"), [students]);
  const openSession = useMemo(() => sessions.find((s) => s.open) ?? null, [sessions]);
  const closedSessions = useMemo(() => sessions.filter((s) => !s.open), [sessions]);

  const totalLearned = students.reduce((n, s) => n + (Number(s.learnedCount) || 0), 0);
  const activeCount = activeStudents.length;
  const pendingCount = students.length - activeCount;
  const avgProgress =
    students.length > 0 ? Math.round((totalLearned / (students.length * TOTAL_WORDS)) * 100) : 0;
  const classesHeld = sessions.filter((s) => s.merged).length;

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      const [stu, ses] = await Promise.all([
        fetch("/api/hanzi-pro", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/hanzi-pro/sessions", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (stu.success) setStudents(stu.students || []);
      if (ses.success) setSessions(ses.sessions || []);
    } catch {
      toast(t("ডেটা লোড করা যায়নি।", "Couldn't load data."), "error");
    } finally {
      setLoading(false);
    }
  }, [t, toast]);

  useEffect(() => {
    queueMicrotask(() => fetchAll());
  }, [fetchAll]);

  const sessionAction = async (payload: Record<string, unknown>, successMsg: string) => {
    setBusy("session");
    try {
      const res = await fetch("/api/hanzi-pro/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...payload, adminPasscode: ADMIN_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) {
        toast(successMsg, "success");
        fetchAll();
      } else {
        toast(data.error || t("কাজটি হয়নি।", "Action failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusy(null);
    }
  };

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

  const approveStudent = async (s: HPStudent) => {
    const ok = await confirm({
      title: t("অনুমোদন করবেন?", "Approve this student?"),
      message: t(
        `${s.name} Active হবে — তখন থেকে সে চ্যালেঞ্জার তালিকায় গণ্য হবে।`,
        `${s.name} will become Active and count as a challenger.`,
      ),
      confirmLabel: t("অনুমোদন", "Approve"),
    });
    if (!ok) return;
    updateStudent(s, s.learnedCount, "Active");
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
        fetchAll();
      } else {
        toast(data.error || t("মোছা যায়নি।", "Delete failed."), "error");
      }
    } catch {
      toast(t("সমস্যা হয়েছে।", "Something went wrong."), "error");
    } finally {
      setBusy(null);
    }
  };

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return students;
    return students.filter(
      (s) =>
        s.name.toLowerCase().includes(q) ||
        String(s.phone).includes(q) ||
        s.trxId.toLowerCase().includes(q) ||
        (s.location ?? "").toLowerCase().includes(q),
    );
  }, [students, query]);

  return (
    <AdminShell
      title={t("হানজি প্রো চ্যালেঞ্জ", "Hanzi Pro challenge")}
      crumb={t("হানজি প্রো", "Hanzi Pro")}
      seal="挑"
      lede={t(
        "৩০০ শব্দের চ্যালেঞ্জ — ক্লাস সেশন চালু করুন, শিক্ষার্থীদের শেখা হানজি অনুমোদন করুন, অগ্রগতি ট্র্যাক করুন।",
        "The 300-word challenge — open class sessions, approve learned hanzi and track progress."
      )}
      actions={
        <IconButton label={t("রিফ্রেশ", "Refresh")} size="sm" spinning={loading} onClick={fetchAll}>
          <RefreshCw className="h-4 w-4" />
        </IconButton>
      }
    >
      {/* overview tiles */}
      <div className="grid grid-cols-2 gap-3 sm:grid-cols-5">
        {[
          { label: t("রেজিস্ট্রেশন", "Registered"), value: students.length, tone: "text-primary" },
          { label: t("অ্যাক্টিভ", "Active"), value: activeCount, tone: "text-ok" },
          { label: t("অপেক্ষমাণ", "Pending"), value: pendingCount, tone: "text-warn" },
          { label: t("ক্লাস হয়েছে", "Classes held"), value: classesHeld, tone: "text-primary" },
          { label: t("গড় অগ্রগতি", "Avg progress"), value: `${avgProgress}%`, tone: "text-ok" },
        ].map((tile) => (
          <div key={tile.label} className="rounded-2xl border border-text/10 bg-card p-4 shadow-sm">
            <span className="font-mono text-xl font-bold tabular-nums text-text">
              {loading ? "—" : tile.value}
            </span>
            <p className="mt-1 text-[11px] font-medium uppercase tracking-[0.1em] text-text/50">
              {tile.label}
            </p>
          </div>
        ))}
      </div>

      {/* ═══════ CLASS SESSION PANEL ═══════ */}
      <section className="mt-8">
        <h2 className="flex items-center gap-2 text-base font-bold text-text">
          {t("ক্লাস লগ সেশন", "Class log sessions")}
        </h2>

        {/* open new session */}
        {!openSession && (
          <Card className="mt-3 p-4">
            <div className="flex flex-wrap items-end gap-3">
              <div className="w-48">
                <Field
                  type="date"
                  label={t("ক্লাসের তারিখ", "Class date")}
                  value={openDate}
                  onChange={(e) => setOpenDate(e.target.value)}
                />
              </div>
              <Button
                size="sm"
                iconLeft={<Unlock className="h-4 w-4" />}
                disabled={busy === "session"}
                onClick={() => sessionAction({ action: "open", date: openDate }, t("সেশন চালু হয়েছে — শিক্ষার্থীরা এখন জমা দিতে পারবে।", "Session open — students can now submit."))}
              >
                {t("সেশন চালু করুন", "Open session")}
              </Button>
              <p className="text-xs text-text/50">
                {t(
                  "চালু হলে /hanzi-pro পেজে শিক্ষার্থীরা নিজের নাম সিলেক্ট করে শেখা শব্দ জমা দিতে পারবে।",
                  "Once open, students submit their learned count on the /hanzi-pro page.",
                )}
              </p>
            </div>
          </Card>
        )}

        {/* open session card */}
        {openSession && (
          <Card className="mt-3 border-primary/40 bg-primary/[0.04] p-5">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <div>
                <p className="flex items-center gap-2 text-sm font-bold text-text">
                  <span className="inline-flex items-center gap-1 rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wide text-primary-foreground">
                    <span className="size-1.5 animate-pulse rounded-full bg-primary-foreground" />
                    {t("চালু", "Open")}
                  </span>
                  {t("সেশন", "Session")} · {openSession.date}
                </p>
                <p className="mt-1 text-xs text-text/55">
                  {openSession.entries.length} {t("টি এন্ট্রি জমা হয়েছে", "entries submitted")}
                </p>
              </div>
              <Button
                size="sm"
                iconLeft={<Lock className="h-4 w-4" />}
                disabled={busy === "session"}
                onClick={() => sessionAction({ action: "close", sessionId: openSession._id }, t("সেশন বন্ধ — সবার কাউন্ট আপডেট হয়েছে।", "Session closed — all counts updated."))}
              >
                {t("সাবমিট ও বন্ধ করুন", "Submit & close")}
              </Button>
            </div>

            {/* entries */}
            {openSession.entries.length === 0 ? (
              <p className="mt-3 text-xs text-text/50">
                {t("এখনো কোনো এন্ট্রি আসেনি।", "No entries yet.")}
              </p>
            ) : (
              <ul className="mt-3 space-y-2">
                {openSession.entries.map((e) => {
                  const val = entryEdits[`${openSession._id}:${e.studentId}`] ?? e.learnedCount;
                  const dirty = val !== e.learnedCount;
                  return (
                    <li
                      key={e.studentId}
                      className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-text/10 bg-card px-3 py-2 text-xs"
                    >
                      <span className="font-semibold text-text">{e.name}</span>
                      <span className="flex items-center gap-2">
                        <input
                          type="number"
                          min={0}
                          max={TOTAL_WORDS}
                          value={val}
                          onChange={(ev) =>
                            setEntryEdits((prev) => ({
                              ...prev,
                              [`${openSession._id}:${e.studentId}`]: Math.max(0, Number(ev.target.value) || 0),
                            }))
                          }
                          className="w-20 rounded-lg border border-text/15 bg-background px-2 py-1 text-right font-mono tabular-nums text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
                          aria-label={t(`${e.name} এর শেখা শব্দ`, `Learned count for ${e.name}`)}
                        />
                        <IconButton
                          label={t("সেভ", "Save")}
                          size="sm"
                          className="h-7 w-7"
                          disabled={!dirty || busy === "session"}
                          onClick={() =>
                            sessionAction(
                              { action: "update-entry", sessionId: openSession._id, studentId: e.studentId, learnedCount: val },
                              t("এন্ট্রি আপডেট হয়েছে।", "Entry updated."),
                            )
                          }
                        >
                          <Check className="h-3.5 w-3.5" />
                        </IconButton>
                        <IconButton
                          label={t("এন্ট্রি মুছুন", "Remove entry")}
                          size="sm"
                          className="h-7 w-7"
                          disabled={busy === "session"}
                          onClick={() =>
                            sessionAction(
                              { action: "remove-entry", sessionId: openSession._id, studentId: e.studentId },
                              t("এন্ট্রি মুছে ফেলা হয়েছে।", "Entry removed."),
                            )
                          }
                        >
                          <Trash2 className="h-3.5 w-3.5" />
                        </IconButton>
                      </span>
                    </li>
                  );
                })}
              </ul>
            )}

            {/* add student to session */}
            {activeStudents.length > 0 && (
              <div className="mt-3 flex flex-wrap items-end gap-2 border-t border-text/10 pt-3">
                <div className="w-56">
                  <SelectField
                    label={t("শিক্ষার্থী যোগ করুন", "Add a student")}
                    hint={t("যেভাবে হাতে এন্ট্রি দেবেন", "Manually add an entry")}
                    value={addStudentId}
                    onChange={(e) => setAddStudentId(e.target.value)}
                  >
                    <option value="">{t("-- সিলেক্ট --", "-- Select --")}</option>
                    {activeStudents.map((s) => (
                      <option key={s._id} value={s._id}>
                        {s.name} ({s.phone})
                      </option>
                    ))}
                  </SelectField>
                </div>
                <div className="w-28">
                  <Field
                    type="number"
                    min={0}
                    label={t("শেখা শব্দ", "Learned")}
                    value={addCount}
                    onChange={(e) => setAddCount(e.target.value)}
                    className="tabular-nums"
                  />
                </div>
                <Button
                  size="sm"
                  variant="secondary"
                  iconLeft={<Plus className="h-4 w-4" />}
                  disabled={!addStudentId || busy === "session"}
                  onClick={() => {
                    sessionAction(
                      { action: "submit", sessionId: openSession._id, studentId: addStudentId, learnedCount: Number(addCount) || 0 },
                      t("এন্ট্রি যোগ হয়েছে।", "Entry added."),
                    );
                    setAddStudentId("");
                    setAddCount("");
                  }}
                >
                  {t("যোগ করুন", "Add")}
                </Button>
              </div>
            )}
          </Card>
        )}

        {/* closed sessions */}
        {closedSessions.length > 0 && (
          <div className="mt-4 space-y-2">
            <p className="text-[11px] font-bold uppercase tracking-[0.12em] text-text/50">
              {t("পুরনো সেশন", "Past sessions")}
            </p>
            {closedSessions.map((s) => (
              <div
                key={s._id}
                className="flex flex-wrap items-center justify-between gap-2 rounded-lg border border-text/10 bg-card px-3.5 py-2.5 text-xs"
              >
                <span className="text-text/75">
                  <span className="font-mono font-semibold">{s.date}</span> ·{" "}
                  {s.entries.length} {t("টি এন্ট্রি", "entries")} ·{" "}
                  {s.merged ? t("মার্জড", "merged") : t("মার্জ হয়নি", "not merged")}
                </span>
                <span className="flex gap-1.5">
                  <Button
                    size="sm"
                    variant="secondary"
                    iconLeft={<Unlock className="h-3.5 w-3.5" />}
                    disabled={busy === "session" || Boolean(openSession)}
                    onClick={() => sessionAction({ action: "reopen", sessionId: s._id }, t("সেশন আবার চালু হয়েছে।", "Session reopened."))}
                  >
                    {t("আবার চালু", "Reopen")}
                  </Button>
                  <IconButton
                    label={t("সেশন মুছুন", "Delete session")}
                    size="sm"
                    disabled={busy === "session"}
                    onClick={() => {
                      confirm({
                        title: t("সেশন মুছবেন?", "Delete this session?"),
                        message: t("শিক্ষার্থীদের কাউন্ট পুনরায় হিসাব হবে।", "Student counts will be recalculated."),
                        confirmLabel: t("মুছুন", "Delete"),
                        destructive: true,
                      }).then((ok) => {
                        if (ok) sessionAction({ action: "delete", sessionId: s._id }, t("সেশন মুছে ফেলা হয়েছে।", "Session deleted."));
                      });
                    }}
                  >
                    <Trash2 className="h-4 w-4" />
                  </IconButton>
                </span>
              </div>
            ))}
          </div>
        )}
      </section>

      {/* ═══════ STUDENTS ═══════ */}
      <section className="mt-10">
        <h2 className="text-base font-bold text-text">
          {t("শিক্ষার্থীরা", "Students")}
          <span className="ml-2 text-sm font-normal text-text/50">
            {loading ? "" : `(${students.length})`}
          </span>
        </h2>

        {/* search */}
        <div className="relative mt-3">
          <Search
            className="pointer-events-none absolute left-3.5 top-1/2 size-4 -translate-y-1/2 text-text/40"
            aria-hidden="true"
          />
          <input
            type="text"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("নাম, ফোন, TrxID বা লোকেশন দিয়ে খুঁজুন…", "Search by name, phone, TrxID or location…")}
            className="w-full rounded-xl border border-text/15 bg-card py-2.5 pl-10 pr-3.5 text-sm text-text placeholder:text-text/35 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
          />
        </div>

        <div className="mt-4">
          {loading ? (
            <LoadingBlock label={t("লোড হচ্ছে", "Loading")} rows={3} />
          ) : students.length === 0 ? (
            <EmptyState
              title={t("এখনো কোনো রেজিস্ট্রেশন নেই", "No registrations yet")}
              description={t(
                "/hanzi-pro পেজ থেকে রেজিস্ট্রেশন এলে এখানে দেখা যাবে।",
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
              minWidth="60rem"
              head={
                <>
                  <Th>{t("নাম", "Name")}</Th>
                  <Th>{t("হোয়াটসঅ্যাপ", "WhatsApp")}</Th>
                  <Th>{t("লোকেশন", "Location")}</Th>
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
                    <Td className="text-text/70">{s.location || "—"}</Td>
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
                      <div className="flex w-28 items-center gap-2">
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
                      {s.status === "Active" ? (
                        <span className="rounded-full border border-ok/40 bg-ok/10 px-2 py-0.5 text-[11px] font-semibold text-ok">
                          ✓ Active
                        </span>
                      ) : (
                        <Button
                          size="sm"
                          variant="secondary"
                          disabled={busy === s._id}
                          onClick={() => approveStudent(s)}
                        >
                          {t("অনুমোদন", "Approve")}
                        </Button>
                      )}
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
      </section>
    </AdminShell>
  );
}
