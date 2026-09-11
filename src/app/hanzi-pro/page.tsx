"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  ArrowUpRight,
  CalendarDays,
  Check,
  Copy,
  Lock,
  Radio,
  Target,
  Trophy,
  Users,
  Wallet,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { LESSON_WORDS } from "@/features/chinese-words";
import { Button, Field } from "@/components/ui";
import { StrokeTrainer, WordStrokePractice } from "@/features/hanzi-pro";

const BKASH_NUMBER = "01787881334";
const ADMIN_WHATSAPP = "8801787881334";

// HSK 1 lesson-wise word breakdown — the challenge curriculum
const LESSON_COUNTS = (() => {
  const per = new Map<number, number>();
  for (const w of LESSON_WORDS) {
    if (w.level !== 1) continue;
    per.set(w.lesson, (per.get(w.lesson) ?? 0) + 1);
  }
  return [...per.entries()].sort((a, b) => a[0] - b[0]);
})();

const TOTAL_WORDS = LESSON_COUNTS.reduce((n, [, c]) => n + c, 0);

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

type HPSession = {
  _id: string;
  date: string;
  open: boolean;
  merged: boolean;
  entries: { studentId: string; name: string; learnedCount: number }[];
};

const bnDate = (iso?: string) =>
  iso ? new Date(iso).toLocaleDateString("bn-BD", { day: "numeric", month: "long", year: "numeric" }) : "—";

export default function HanziProPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [students, setStudents] = useState<HPStudent[]>([]);
  const [sessions, setSessions] = useState<HPSession[]>([]);
  const [loading, setLoading] = useState(true);

  const [copied, setCopied] = useState(false);
  const [regOpen, setRegOpen] = useState(false);
  const [form, setForm] = useState({ name: "", phone: "", location: "", trxId: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [loading2, setLoading2] = useState(false);
  const [regStatus, setRegStatus] = useState<{ type: "success" | "error"; msg: string } | null>(null);
  const [waLink, setWaLink] = useState("");

  // class-log submission (open session)
  const openSession = sessions.find((s) => s.open) ?? null;
  const [logBusy, setLogBusy] = useState(false);
  const [logMsg, setLogMsg] = useState<{ ok: boolean; text: string } | null>(null);
  const [lessonForm, setLessonForm] = useState({ fromLesson: 1, fromText: 1, toLesson: 1, toText: 1 });
  const [endPass, setEndPass] = useState<Record<string, string>>({});

  const activeStudents = useMemo(() => students.filter((s) => s.status === "Active"), [students]);
  const mergedSessions = useMemo(() => sessions.filter((s) => s.merged), [sessions]);
  const totalLearned = activeStudents.reduce((n, s) => n + (Number(s.learnedCount) || 0), 0);
  const totalEnrolled = activeStudents.length;

  const classesAttended = useCallback(
    (studentId: string) => mergedSessions.filter((s) => s.entries.some((e) => e.studentId === studentId)).length,
    [mergedSessions],
  );

  const loadAll = useCallback(async () => {
    try {
      const [stu, ses] = await Promise.all([
        fetch("/api/hanzi-pro", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/hanzi-pro/sessions", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (stu.success) setStudents(stu.students || []);
      if (ses.success) setSessions(ses.sessions || []);
    } catch {
      /* keep previous */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => loadAll());
  }, [loadAll]);

  const copyNumber = async () => {
    try {
      await navigator.clipboard.writeText(BKASH_NUMBER);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      /* clipboard unavailable */
    }
  };

  // group batch entry: selected students + their learned counts
  const [batchEntries, setBatchEntries] = useState<Record<string, number>>({});

  const toggleBatchStudent = (s: HPStudent) => {
    setBatchEntries((prev) => {
      const next = { ...prev };
      if (next[s._id] !== undefined) delete next[s._id];
      else next[s._id] = Number(s.learnedCount) || 0;
      return next;
    });
  };

  const submitBatch = async (closeSession: boolean, passcode: string) => {
    if (!openSession) return;
    const entries = Object.entries(batchEntries).map(([studentId, learnedCount]) => ({
      studentId,
      learnedCount,
    }));
    if (entries.length === 0) {
      setLogMsg({ ok: false, text: t("অন্তত একজন শিক্ষার্থী সিলেক্ট করুন।", "Select at least one student.") });
      return;
    }
    setLogBusy(true);
    try {
      const res = await fetch("/api/hanzi-pro/sessions", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "submit-many", sessionId: openSession._id, entries }),
      });
      const data = await res.json();
      if (!data.success) throw new Error(data.error || t("সেভ হয়নি।", "Save failed."));

      if (closeSession) {
        const res2 = await fetch("/api/hanzi-pro/sessions", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            action: "close-merge",
            sessionId: openSession._id,
            adminPasscode: passcode,
          }),
        });
        const data2 = await res2.json();
        if (!data2.success) throw new Error(data2.error || t("বন্ধ হয়নি।", "Close failed."));
        setLogMsg({
          ok: true,
          text: t(
            `${data.saved} জনের এন্ট্রি সেভ হয়ে সেশন বন্ধ হয়েছে — কাউন্ট আপডেট হয়েছে।`,
            `${data.saved} entries saved, session closed and counts updated.`,
          ),
        });
      } else {
        setLogMsg({
          ok: true,
          text: t(`${data.saved} জনের এন্ট্রি সেভ হয়েছে।`, `${data.saved} entries saved.`),
        });
      }
      setBatchEntries({});
      loadAll();
    } catch (err) {
      setLogMsg({
        ok: false,
        text: err instanceof Error ? err.message : t("সমস্যা হয়েছে।", "Something went wrong."),
      });
    } finally {
      setLogBusy(false);
    }
  };

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = t("নাম লিখুন।", "Please enter your name.");
    if (!form.phone.trim()) e.phone = t("হোয়াটসঅ্যাপ নম্বর দিন।", "Please enter your WhatsApp number.");
    if (!form.trxId.trim()) e.trxId = t("bKash TrxID দিন।", "Please enter the bKash TrxID.");
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const fieldErrors = validate();
    if (Object.keys(fieldErrors).length) {
      setErrors(fieldErrors);
      return;
    }

    setLoading2(true);
    setRegStatus(null);

    try {
      const res = await fetch("/api/hanzi-pro", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...form, amount: 200 }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || t("রেজিস্ট্রেশন হয়নি।", "Registration failed."));
      }

      const message = `🌟 *Hanzi Pro রেজিস্ট্রেশন*\n-------------------------------\n👤 *নাম:* ${form.name}\n📱 *হোয়াটসঅ্যাপ:* ${form.phone}\n📍 *লোকেশন:* ${form.location || "—"}\n💳 *bKash TrxID:* ${form.trxId.trim().toUpperCase()}\n💰 *ফি:* 200 BDT\n🎯 *চ্যালেঞ্জ:* HSK 1 — ${TOTAL_WORDS} টি শব্দ\n-------------------------------\nআমি রেজিস্ট্রেশন সম্পন্ন করেছি। দয়া করে আমাকে গ্রুপে অ্যাড করুন।`;
      const url = `https://wa.me/${ADMIN_WHATSAPP}?text=${encodeURIComponent(message)}`;
      setWaLink(url);
      setRegStatus({
        type: "success",
        msg: t(
          "রেজিস্ট্রেশন সফল! WhatsApp খুলে মেসেজটি পাঠান — অ্যাডমিন অনুমোদন করলে আপনার নাম নিচের তালিকায় দেখা যাবে।",
          "Registration successful! Open WhatsApp and send the message — once the admin approves you, your name appears in the list below.",
        ),
      });
      setForm({ name: "", phone: "", location: "", trxId: "" });
      window.open(url, "_blank", "noopener");
      loadAll();
    } catch (err) {
      setRegStatus({
        type: "error",
        msg: err instanceof Error ? err.message : t("সমস্যা হয়েছে।", "Something went wrong."),
      });
    } finally {
      setLoading2(false);
    }
  };

  const highlights = useMemo(
    () => [
      {
        icon: Target,
        title: t(`${TOTAL_WORDS} টি শব্দ`, `${TOTAL_WORDS} words`),
        desc: t("HSK 1 এর লেসন-ভিত্তিক প্রতিটি শব্দ — পিনইন, বাংলা ও ইংরেজি অর্থসহ।", "Every HSK 1 lesson word — with pinyin, Bangla and English meanings."),
      },
      {
        icon: CalendarDays,
        title: t("২০ তারিখ থেকে ক্লাস", "Classes start on the 20th"),
        desc: t("লেসন ধরে ধরে এগোবে — প্রতিদিন একটু একটু করে পুরো তালিকা শেষ।", "Lesson by lesson, a little every day until the whole list is done."),
      },
      {
        icon: Wallet,
        title: t("ফি মাত্র ৳২০০", "Fee only ৳200"),
        desc: t("এককালীন রেজিস্ট্রেশন ফি — bKash Send Money করে TrxID জমা দিন।", "One-time registration fee — send via bKash and submit the TrxID."),
      },
    ],
    [t],
  );

  return (
    <div className="bg-background text-text">
      {/* ═══════════ HERO ═══════════ */}
      <section className="relative isolate -mt-16 overflow-hidden bg-[#f8f3ea] in-[.dark]:bg-background sm:-mt-20">
        <span
          aria-hidden="true"
          lang="zh"
          className="pointer-events-none absolute -top-16 right-[4%] hidden select-none text-[22rem] leading-none font-bold text-text/[0.04] lg:block"
        >
          挑
        </span>

        <div className="relative z-10 mx-auto max-w-6xl px-4 pt-28 pb-16 sm:px-6 md:pt-32 md:pb-20 lg:px-8">
          <span className="inline-flex items-center gap-1.5 rounded-full border border-secondary/30 bg-secondary/10 px-3.5 py-1.5 text-xs font-bold uppercase tracking-[0.14em] text-secondary">
            <Trophy className="size-3.5" aria-hidden="true" />
            {t("প্রো চ্যালেঞ্জ", "Pro Challenge")}
          </span>

          <h1 className="mt-6 text-[2.4rem] leading-[1.12] font-bold tracking-tight sm:text-5xl">
            {t("হানজি প্রো — ৩০০ শব্দের চ্যালেঞ্জ", "Hanzi Pro — the 300-word challenge")}
          </h1>

          <p className="mt-5 max-w-[56ch] text-base leading-[1.9] text-text/70 sm:text-lg">
            {t(
              "HSK 1 এর লেসন-ভিত্তিক সবগুলো শব্দ এক চ্যালেঞ্জে — লেসন ধরে ধরে শিখুন, নিজের অগ্রগতি ট্র্যাক করুন এবং পুরো তালিকা শেষ করে চ্যাম্পিয়ন হন।",
              "Every HSK 1 lesson word in one challenge — learn lesson by lesson, track your progress and finish the whole list as a champion.",
            )}
          </p>

          {/* live stats */}
          <div className="mt-8 grid grid-cols-3 gap-3 sm:max-w-xl">
            {[
              { label: t("ভর্তি হয়েছে", "Enrolled"), value: totalEnrolled, icon: Users },
              { label: t("ক্লাস হয়েছে", "Classes held"), value: mergedSessions.length, icon: CalendarDays },
              { label: t("শব্দ শেখা হয়েছে", "Words learned"), value: totalLearned, icon: Trophy },
            ].map((s) => {
              const Icon = s.icon;
              return (
                <div key={s.label} className="rounded-2xl border border-text/12 bg-card/70 p-4 text-center backdrop-blur-sm">
                  <Icon className="mx-auto size-4 text-secondary" aria-hidden="true" />
                  <p className="mt-1.5 font-mono text-2xl font-bold tabular-nums text-text">{s.value}</p>
                  <p className="text-[10px] font-medium uppercase tracking-[0.1em] text-text/50">{s.label}</p>
                </div>
              );
            })}
          </div>

          {/* enroll CTA */}
          <button
            type="button"
            onClick={() => setRegOpen(true)}
            className="mt-8 inline-flex items-center gap-2 rounded-xl bg-secondary px-6 py-3.5 text-sm font-bold text-white shadow-md shadow-secondary/25 transition-transform hover:-translate-y-0.5 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary"
          >
            {t("রেজিস্ট্রেশন করুন — ৳২০০", "Register now — ৳200")}
            <ArrowUpRight className="size-4" aria-hidden="true" />
          </button>

          {/* highlights */}
          <div className="mt-10 grid gap-4 sm:grid-cols-3">
            {highlights.map((h) => {
              const Icon = h.icon;
              return (
                <div key={h.title} className="rounded-2xl border border-text/12 bg-card/70 p-5 backdrop-blur-sm">
                  <Icon className="size-5 text-secondary" aria-hidden="true" />
                  <h2 className="mt-3 text-sm font-bold text-text">{h.title}</h2>
                  <p className="mt-1 text-xs leading-6 text-text/60">{h.desc}</p>
                </div>
              );
            })}
          </div>

          {/* bKash number */}
          <div className="mt-8 max-w-lg border border-text/15 bg-background px-4 py-3.5">
            <div className="flex flex-wrap items-center justify-between gap-4">
              <div>
                <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text/50">
                  bKash/Rocket Personal Number
                </p>
                <p className="mt-1 font-mono text-xl tracking-[0.12em] text-text tabular-nums select-all">
                  {BKASH_NUMBER}
                </p>
              </div>
              <button
                type="button"
                onClick={copyNumber}
                className="inline-flex items-center gap-2 rounded-xl border border-text/15 px-3.5 py-2 text-sm font-medium text-text transition-colors hover:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
              >
                {copied ? (
                  <Check className="size-4 text-ok" aria-hidden="true" />
                ) : (
                  <Copy className="size-4 text-text/50" aria-hidden="true" />
                )}
                <span aria-live="polite">{copied ? t("কপি হয়েছে", "Copied") : t("কপি", "Copy")}</span>
              </button>
            </div>
          </div>
        </div>
      </section>

      {/* ═══════════ CLASS LOG (open session) ═══════════ */}
      {openSession && (
        <section className="border-t border-secondary/40 bg-secondary/[0.07] py-10">
          <div className="mx-auto max-w-3xl px-4 sm:px-6 lg:px-8">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1.5 rounded-full bg-secondary px-3 py-1 text-[11px] font-bold uppercase tracking-[0.12em] text-white">
                <Radio className="size-3.5 animate-pulse" aria-hidden="true" />
                {t("ক্লাস লগ চালু আছে", "Class log is open")}
              </span>
              <span className="text-xs tabular-nums text-text/55">
                {t("তারিখ", "Date")}: {openSession.date}
              </span>
            </div>

            <h2 className="mt-3 text-xl font-bold text-text">
              {t("আজকের ক্লাসে শেখা হানজি জমা দিন", "Submit today's learned hanzi")}
            </h2>
            <p className="mt-1 text-xs text-text/60">
              {t(
                "প্রত্যেকে নিজের নামের কার্ডে ক্লিক করে মোট শেখা শব্দের সংখ্যা লিখুন — সবার এন্ট্রি একসাথে জমা হবে।",
                "Everyone taps their own card and enters their total learned words — all entries submit together.",
              )}
            </p>

            {/* quick select buttons */}
            <div className="mt-4 flex flex-wrap items-center gap-2">
              <Button
                type="button"
                variant="secondary"
                onClick={() =>
                  setBatchEntries(
                    Object.fromEntries(activeStudents.map((s) => [s._id, Number(s.learnedCount) || 0])),
                  )
                }
              >
                {t("সবাই সিলেক্ট", "Select all")}
              </Button>
              <Button type="button" variant="secondary" onClick={() => setBatchEntries({})}>
                {t("সব বাদ", "Clear all")}
              </Button>
              <span className="text-xs font-mono tabular-nums text-text/55">
                {Object.keys(batchEntries).length}/{activeStudents.length} {t("সিলেক্টেড", "selected")}
              </span>
            </div>

            {/* student cards grid */}
            <ul className="mt-4 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {activeStudents.map((s) => {
                const selectedEntry = batchEntries[s._id];
                const isSelected = selectedEntry !== undefined;
                const alreadyLogged = (openSession.entries ?? []).some((e) => e.studentId === s._id);
                return (
                  <li key={s._id}>
                    <div
                      className={`rounded-2xl border p-4 transition-colors ${
                        isSelected
                          ? "border-ok/50 bg-ok-surface/50"
                          : alreadyLogged
                            ? "border-ok/25 bg-ok/[0.04]"
                            : "border-text/12 bg-card"
                      }`}
                    >
                      <button
                        type="button"
                        onClick={() => toggleBatchStudent(s)}
                        className="flex w-full items-center justify-between gap-3 text-left focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                      >
                        <span className="min-w-0">
                          <span className="block truncate font-semibold text-text">{s.name}</span>
                          <span className="block text-[11px] tabular-nums text-text/50">
                            {t("আগের মোট", "Previous total")}: {Number(s.learnedCount) || 0}
                            {alreadyLogged ? ` · ${t("আজ জমা দিয়েছে", "submitted today")}` : ""}
                          </span>
                        </span>
                        <span
                          aria-hidden="true"
                          className={`flex size-6 shrink-0 items-center justify-center rounded-full border ${
                            isSelected ? "border-ok bg-ok text-card" : "border-text/25 text-transparent"
                          }`}
                        >
                          <Check className="size-3.5" strokeWidth={3} />
                        </span>
                      </button>

                      {isSelected && (
                        <div className="mt-3 flex items-center gap-2 border-t border-text/10 pt-3">
                          <label
                            htmlFor={`cnt-${s._id}`}
                            className="text-[11px] font-semibold uppercase tracking-wide text-text/50"
                          >
                            {t("মোট শেখা", "Total learned")}
                          </label>
                          <input
                            id={`cnt-${s._id}`}
                            type="number"
                            min={0}
                            max={TOTAL_WORDS}
                            value={selectedEntry}
                            onChange={(e) =>
                              setBatchEntries((prev) => ({
                                ...prev,
                                [s._id]: Math.max(0, Number(e.target.value) || 0),
                              }))
                            }
                            className="w-24 rounded-lg border border-text/15 bg-background px-2 py-1.5 text-right font-mono text-sm tabular-nums text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
                          />
                          <span className="text-[11px] text-text/45">/{TOTAL_WORDS}</span>
                        </div>
                      )}
                    </div>
                  </li>
                );
              })}
            </ul>

            {/* admin submit */}
            <details className="mt-5 w-full rounded-2xl border border-text/12 bg-card/80">
              <summary className="flex cursor-pointer list-none items-center gap-2 px-4 py-3 text-sm font-semibold text-text/70 transition-colors hover:text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text">
                <Lock className="size-4 text-text/40" aria-hidden="true" />
                {t("অ্যাডমিন — লেসন ফিল্ড ও সাবমিট", "Admin — lesson fields & submit")}
              </summary>

              <div className="mt-1 space-y-4 border-t border-text/10 px-4 pb-5 pt-4 sm:px-5">
                <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                  <Field
                    type="number"
                    min={1}
                    label={t("পাঠ থেকে", "From lesson")}
                    value={lessonForm.fromLesson}
                    onChange={(e) => setLessonForm({ ...lessonForm, fromLesson: Number(e.target.value) })}
                    className="tabular-nums"
                  />
                  <Field
                    type="number"
                    min={1}
                    label={t("টেক্সট থেকে", "From text")}
                    value={lessonForm.fromText}
                    onChange={(e) => setLessonForm({ ...lessonForm, fromText: Number(e.target.value) })}
                    className="tabular-nums"
                  />
                  <Field
                    type="number"
                    min={1}
                    label={t("পাঠ পর্যন্ত", "To lesson")}
                    value={lessonForm.toLesson}
                    onChange={(e) => setLessonForm({ ...lessonForm, toLesson: Number(e.target.value) })}
                    className="tabular-nums"
                  />
                  <Field
                    type="number"
                    min={1}
                    label={t("টেক্সট পর্যন্ত", "To text")}
                    value={lessonForm.toText}
                    onChange={(e) => setLessonForm({ ...lessonForm, toText: Number(e.target.value) })}
                    className="tabular-nums"
                  />
                </div>

                    <Field
                      type="password"
                      label={t("অ্যাডমিন পাসকোড", "Admin passcode")}
                      value={endPass[openSession._id] ?? ""}
                      error={logMsg && !logMsg.ok ? logMsg.text : undefined}
                      onChange={(e) => setEndPass((prev) => ({ ...prev, [openSession._id]: e.target.value }))}
                      className="text-center tracking-widest"
                    />

                <div className="flex flex-col gap-2 sm:flex-row">
                  <Button
                    disabled={logBusy || Object.keys(batchEntries).length === 0}
                    onClick={() => submitBatch(false, "")}
                  >
                    {logBusy ? t("সেভ হচ্ছে…", "Saving…") : t("এন্ট্রি সেভ করুন", "Save entries")}
                  </Button>
                  <Button
                    variant="danger"
                    disabled={logBusy || Object.keys(batchEntries).length === 0}
                    onClick={() => submitBatch(true, endPass[openSession._id] ?? "")}
                  >
                    {t("সেভ ও সেশন বন্ধ করুন", "Save & close session")}
                  </Button>
                </div>
              </div>
            </details>

            {logMsg && (
              <p
                role={logMsg.ok ? "status" : "alert"}
                className={`mt-3 rounded-xl border px-4 py-2.5 text-sm font-medium ${logMsg.ok ? "border-ok/40 bg-ok-surface text-ok" : "border-danger/40 bg-danger-surface text-danger"}`}
              >
                {logMsg.text}
              </p>
            )}

            {/* live entries */}
            {openSession.entries.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">
                {openSession.entries.map((e) => (
                  <span
                    key={e.studentId}
                    className="inline-flex items-center gap-1.5 rounded-full border border-ok/30 bg-ok/10 px-3 py-1 text-xs font-medium text-ok"
                  >
                    <Check className="size-3" aria-hidden="true" />
                    {e.name} — {e.learnedCount}
                  </span>
                ))}
              </div>
            )}
          </div>
        </section>
      )}

      {/* ═══════════ STROKE LEARNING & PRACTICE ═══════════ */}
      <section className="border-t border-text/10 bg-background py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-text sm:text-3xl">
            {t("স্ট্রোক শেখা ও অনুশীলন", "Stroke learning & practice")}
          </h2>
          <p className="mt-2 text-sm text-text/60">
            {t(
              "৮টি মৌলিক স্ট্রোকের নাম শিখুন, কুইজে নিজেকে যাচাই করুন — আর নিচে চ্যালেঞ্জের প্রতিটি শব্দের স্ট্রোক অ্যানিমেশন দেখে লিখে অনুশীলন করুন।",
              "Learn the 8 basic stroke names, test yourself in the quiz — then watch each challenge word's stroke animation and practice writing it.",
            )}
          </p>

          <div className="mt-6">
            <StrokeTrainer />
          </div>

          <h3 className="mt-10 flex items-center gap-2 text-lg font-bold text-text">
            {t("শব্দে স্ট্রোক অনুশীলন", "Word stroke practice")}
          </h3>
          <p className="mt-1 text-xs text-text/55">
            {t(
              "লেসন খুলে যেকোনো শব্দের পাশে 🎬 চাপুন — স্ট্রোক অ্যানিমেশন, পজ/প্লে আর লিখে অনুশীলন।",
              "Open a lesson and tap 🎬 beside any word — stroke animation, pause/play and writing practice.",
            )}
          </p>
          <div className="mt-4">
            <WordStrokePractice />
          </div>
        </div>
      </section>

      {/* ═══════════ CHALLENGER ACTIVITY ═══════════ */}
      <section className="border-t border-text/10 bg-background py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-text sm:text-3xl">
            <Users className="size-6 text-secondary" aria-hidden="true" />
            {t("চ্যালেঞ্জারদের অগ্রগতি", "Challenger activity")}
          </h2>
          <p className="mt-2 text-sm text-text/60">
            {t(
              "যারা অনুমোদিত (Active) তাদের নাম, ভর্তির তারিখ, কতটা শিখেছে আর কতটা বাকি — সব এক নজরে।",
              "Every approved challenger — name, joined date, what they've learned and what's left.",
            )}
          </p>

          {loading ? (
            <p className="mt-6 text-sm text-text/50">{t("লোড হচ্ছে…", "Loading…")}</p>
          ) : activeStudents.length === 0 ? (
            <p className="mt-6 rounded-2xl border border-dashed border-text/20 p-8 text-center text-sm text-text/55">
              {t(
                "এখনো কোনো অনুমোদিত চ্যালেঞ্জার নেই — রেজিস্ট্রেশন করে প্রথম হন!",
                "No approved challengers yet — register and be the first!",
              )}
            </p>
          ) : (
            <ul className="mt-6 space-y-3">
              {activeStudents.map((s) => {
                const learned = Number(s.learnedCount) || 0;
                const pct = Math.min(100, Math.round((learned / TOTAL_WORDS) * 100));
                const remaining = Math.max(0, TOTAL_WORDS - learned);
                const classes = classesAttended(s._id);
                return (
                  <li key={s._id} className="rounded-2xl border border-text/12 bg-card p-5 shadow-sm">
                    <div className="flex flex-wrap items-start justify-between gap-3">
                      <div className="min-w-0">
                        <p className="text-base font-bold text-text">{s.name}</p>
                        <p className="mt-0.5 text-xs text-text/50">
                          {t("যোগ দিয়েছে", "Joined")}: {bnDate(s.createdAt)} ·{" "}
                          {t("ক্লাস", "Classes")}: {classes}
                        </p>
                      </div>
                      <span className="rounded-full border border-ok/30 bg-ok/10 px-3 py-1 font-mono text-sm font-bold tabular-nums text-ok">
                        {learned}/{TOTAL_WORDS}
                      </span>
                    </div>

                    <div className="mt-3 h-2 w-full overflow-hidden rounded-full bg-text/10">
                      <div
                        className={`h-full rounded-full transition-all duration-700 ${pct >= 80 ? "bg-ok" : pct >= 40 ? "bg-secondary" : "bg-warn"}`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                    <p className="mt-1.5 text-xs text-text/55">
                      {pct}% {t("সম্পন্ন", "done")} ·{" "}
                      <span className="font-semibold text-text">
                        {remaining} {t("টি শব্দ বাকি", "words left")}
                      </span>
                    </p>
                  </li>
                );
              })}
            </ul>
          )}
        </div>
      </section>

      {/* ═══════════ CURRICULUM ═══════════ */}
      <section className="border-t border-text/10 bg-background py-14 md:py-20">
        <div className="mx-auto max-w-4xl px-4 sm:px-6 lg:px-8">
          <h2 className="flex items-center gap-2 text-2xl font-bold tracking-tight text-text sm:text-3xl">
            <Target className="size-6 text-secondary" aria-hidden="true" />
            {t("চ্যালেঞ্জ কারিকুলাম", "The challenge curriculum")}
          </h2>
          <p className="mt-3 text-sm leading-7 text-text/60">
            {t(
              "HSK 1 এর ১৫টি লেসনে ছড়ানো মোট শব্দ — প্রতিটি লেসন শেষ করলেই অগ্রগতি বাড়বে।",
              "All HSK 1 words across 15 lessons — each finished lesson grows your progress.",
            )}
          </p>

          <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-5">
            {LESSON_COUNTS.map(([lesson, count]) => (
              <li
                key={lesson}
                className="rounded-xl border border-text/12 bg-card p-3.5 text-center shadow-sm"
              >
                <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-text/45">
                  {t("লেসন", "Lesson")} {lesson}
                </p>
                <p className="mt-1 font-mono text-xl font-bold tabular-nums text-text">{count}</p>
                <p className="text-[10px] uppercase tracking-[0.1em] text-text/40">
                  {t("শব্দ", "words")}
                </p>
              </li>
            ))}
            <li className="rounded-xl border border-secondary/40 bg-secondary/10 p-3.5 text-center">
              <p className="font-mono text-[11px] uppercase tracking-[0.12em] text-secondary">
                {t("মোট", "Total")}
              </p>
              <p className="mt-1 font-mono text-xl font-bold tabular-nums text-secondary">{TOTAL_WORDS}</p>
              <p className="text-[10px] uppercase tracking-[0.1em] text-secondary/70">
                {t("শব্দ", "words")}
              </p>
            </li>
          </ul>
        </div>
      </section>

      {/* ═══════════ REGISTRATION DIALOG ═══════════ */}
      {regOpen && (
        <div
          className="fixed inset-0 z-[60] overflow-y-auto bg-black/60 p-4"
          onClick={() => setRegOpen(false)}
        >
          <div
            className="relative mx-auto my-8 max-w-xl"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setRegOpen(false)}
              aria-label={t("বন্ধ করুন", "Close")}
              className="absolute -top-3 -right-3 z-10 flex size-9 items-center justify-center rounded-full border border-border bg-card text-text shadow-lg transition-colors hover:bg-text/5"
            >
              ✕
            </button>

            <div className="rounded-3xl border border-text/12 bg-card p-6 sm:p-8">
              <h2 className="text-xl font-bold text-text">
                {t("রেজিস্ট্রেশন ফর্ম", "Registration form")}
              </h2>
              <p className="mt-1 text-xs text-text/55">
                {t(
                  "৳২০০ bKash করে TrxID সহ ফর্মটি জমা দিন — অ্যাডমিন অনুমোদন করলেই আপনি চ্যালেঞ্জার তালিকায় যুক্ত হবেন।",
                  "Send ৳200 via bKash and submit the form with the TrxID — once the admin approves, you join the challenger list.",
                )}
              </p>

              <form onSubmit={handleSubmit} className="mt-5 space-y-4">
                {[
                  {
                    k: "name" as const,
                    label: t("আপনার নাম", "Full name"),
                    placeholder: t("যেমন: Kazi Robin", "e.g. Kazi Robin"),
                    type: "text" as const,
                  },
                  {
                    k: "phone" as const,
                    label: t("হোয়াটসঅ্যাপ নম্বর", "WhatsApp number"),
                    placeholder: "01XXXXXXXXX",
                    type: "tel" as const,
                  },
                  {
                    k: "location" as const,
                    label: t("আপনার লোকেশন / শহর", "Your location / city"),
                    placeholder: t("যেমন: Dhaka", "e.g. Dhaka"),
                    type: "text" as const,
                  },
                  {
                    k: "trxId" as const,
                    label: t("bKash TrxID (৳২০০)", "bKash TrxID (৳200)"),
                    placeholder: "যেমন: 9K2L1M4P",
                    type: "text" as const,
                  },
                ].map((f) => (
                  <div key={f.k}>
                    <label htmlFor={`hp-${f.k}`} className="block text-sm font-medium text-text">
                      {f.label}
                      <span className="ml-0.5 text-secondary" aria-hidden="true">
                        *
                      </span>
                    </label>
                    <input
                      id={`hp-${f.k}`}
                      type={f.type}
                      required
                      value={form[f.k]}
                      onChange={(e) => {
                        setForm((prev) => ({ ...prev, [f.k]: e.target.value }));
                        setErrors((prev) => ({ ...prev, [f.k]: "" }));
                      }}
                      placeholder={f.placeholder}
                      className={`mt-1.5 w-full rounded-xl border bg-background px-3.5 py-2.5 text-[15px] text-text transition-colors placeholder:text-text/35 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                        errors[f.k] ? "border-danger" : "border-text/20 focus-visible:border-text"
                      } ${f.k === "trxId" ? "uppercase" : ""}`}
                    />
                    {errors[f.k] && (
                      <p className="mt-1.5 text-xs font-medium text-danger">{errors[f.k]}</p>
                    )}
                  </div>
                ))}

                <button
                  type="submit"
                  disabled={loading2}
                  aria-busy={loading2}
                  className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-text px-5 py-3 text-sm font-semibold text-background transition-opacity hover:opacity-90 disabled:opacity-55"
                >
                  {loading2 ? t("জমা হচ্ছে…", "Submitting…") : t("রেজিস্ট্রেশন কনফার্ম করুন", "Confirm registration")}
                  <ArrowUpRight className="size-4" aria-hidden="true" />
                </button>

                <div aria-live="polite" className="empty:mt-0">
                  {regStatus && (
                    <div
                      role={regStatus.type === "error" ? "alert" : "status"}
                      className={`flex flex-wrap items-center gap-x-2 gap-y-3 border px-4 py-3 text-sm ${
                        regStatus.type === "error"
                          ? "border-danger/40 bg-danger-surface text-text"
                          : "border-ok/40 bg-ok-surface text-text"
                      }`}
                    >
                      {regStatus.type === "success" && (
                        <Check className="size-4 text-ok" aria-hidden="true" />
                      )}
                      <span>{regStatus.msg}</span>
                      {regStatus.type === "success" && waLink && (
                        <a
                          href={waLink}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 font-semibold text-text underline underline-offset-2"
                        >
                          {t("WhatsApp খুলুন", "Open WhatsApp")}
                          <ArrowUpRight className="size-3.5" aria-hidden="true" />
                        </a>
                      )}
                    </div>
                  )}
                </div>
              </form>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
