"use client";

import { useCallback, useEffect, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Banknote,
  CalendarClock,
  Mic,
  PenLine,
  Star,
  Trophy,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import {
  Button,
  Card,
  EmptyState,
  LoadingBlock,
  SectionHanzi,
  StatusMark,
} from "@/components/ui";
import { AdminShell } from "@/features/academy/components/admin/AdminShell";

/**
 * One student's complete record, on one page: who they are, what they have
 * paid, everything they have submitted, their exam results, and their sign-in
 * history. This is the "show me everything about this student" view.
 */

type Detail = {
  student: {
    rollNumber: number;
    nameEnglish: string;
    whatsapp: string;
    isPro: boolean;
    isWhatsAppGroupJoined: boolean;
    location: string;
    enrolledCourseId: string;
    enrolledCourseIds?: string[];
    registrationStatus: string;
    createdAt: string;
  };
  courses: Array<{ courseId: string; courseName: string; launched?: boolean; fee?: number }>;
  enrollments: Array<{
    _id: string;
    courseId: string;
    courseName: string;
    amount: number;
    trxId: string;
    status: string;
    createdAt: string;
  }>;
  registration: { amount: number; trxId: string; status: string; createdAt: string } | null;
  activity: {
    dialogues: Array<{
      _id: string;
      name: string;
      level: number;
      lesson: number;
      durationSec?: number;
      status?: string;
      createdAt: string;
    }>;
    dialogueMarks: Array<{ _id: string; level: number; lesson: number; mark: number; feedback?: string; createdAt: string }>;
    handwriting: Array<{
      _id: string;
      level: number;
      lesson: number;
      mark?: number | null;
      status?: string;
      createdAt: string;
      images?: Array<{ url: string }>;
    }>;
    exams: Array<{ _id: string; level: number; lesson: number; best: number; latest: number; attempts: number; totalMarks: number }>;
  };
  session: {
    logins: number;
    totalSeconds: number;
    lastLoginAt: string | null;
    lastLogoutAt: string | null;
    /** When the still-open visit began, so its time can count up live. */
    activeLoginAt: string | null;
    active: boolean;
    onlineNow: boolean;
    topPaths: Array<{ path: string; count: number }>;
    /** Every visit with its own start and length — the history itself. */
    recent: Array<{
      loginAt: string;
      logoutAt: string | null;
      durationSec: number;
      active: boolean;
    }>;
  } | null;
};

const ADMIN_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

function when(iso: string | null | undefined): string {
  if (!iso) return "—";
  const d = new Date(iso);
  if (Number.isNaN(d.getTime())) return "—";
  return d.toLocaleString("en-GB", {
    day: "2-digit",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function human(seconds: number): string {
  if (!seconds) return "0m";
  const m = Math.round(seconds / 60);
  if (m < 60) return `${m}m`;
  return `${Math.floor(m / 60)}h ${m % 60}m`;
}

/** How long one visit lasted — including one that is still running. */
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

/** Total time including a visit that is still open, so "so far" means so far. */
function liveTotal(s: {
  totalSeconds: number;
  onlineNow: boolean;
  activeLoginAt: string | null;
}): number {
  const running =
    s.onlineNow && s.activeLoginAt
      ? Math.max(0, (Date.now() - new Date(s.activeLoginAt).getTime()) / 1000)
      : 0;
  return (s.totalSeconds ?? 0) + running;
}

export default function AdminStudentDetailPage({
  params,
}: {
  params: Promise<{ roll: string }>;
}) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const [roll, setRoll] = useState("1");
  const [data, setData] = useState<Detail | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    let alive = true;
    void params.then((p) => {
      if (alive) setRoll(p.roll);
    });
    return () => {
      alive = false;
    };
  }, [params]);

  const load = useCallback(async () => {
    setLoading(true);
    setError("");
    try {
      // This route is the private record, so it wants the passcode like every
      // other admin read. Sending the bare URL is what turned this page into a
      // permanent "Admin passcode required." error.
      const res = await fetch(`/api/academy/students/${roll}?passcode=${encodeURIComponent(ADMIN_PASSCODE)}`, {
        cache: "no-store",
      });
      const d = await res.json();
      if (!res.ok || !d.success) {
        setError(d.error || t("তথ্য পাওয়া যায়নি।", "Could not load this student."));
        setData(null);
        return;
      }
      setData(d as Detail);
    } catch {
      setError(t("নেটওয়ার্ক সমস্যা।", "Network problem."));
    } finally {
      setLoading(false);
    }
    // `t` closes over `language`, which is in the array via `roll` changing with
    // the language, but be explicit so the list stays honest.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roll, language]);

  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) void load();
    });
    return () => {
      alive = false;
    };
  }, [load]);

  return (
    <AdminShell
      title={
        data
          ? `${data.student.nameEnglish} · #${data.student.rollNumber}`
          : t("শিক্ষার্থীর তথ্য", "Student details")
      }
      crumb={t("শিক্ষার্থী", "Students")}
      seal="生"
      lede={t(
        "অ্যাকাউন্ট, ভর্তি, হোমওয়ার্ক ও লগইন — সবকিছু এক জায়গায়।",
        "Account, enrollments, homework and sign-ins, all in one place.",
      )}
      actions={
        <Link href="/admin/students">
          <Button size="sm" variant="secondary" iconLeft={<ArrowLeft className="h-4 w-4" />}>
            {t("শিক্ষার্থীর তালিকা", "All students")}
          </Button>
        </Link>
      }
    >
      <SectionHanzi char="生" className="-top-16 right-4" />

      {error && (
        <p role="alert" className="mb-4 text-sm font-medium text-danger">
          {error}
        </p>
      )}

      {loading || !data ? (
        <LoadingBlock label={t("তথ্য আসছে…", "Loading…")} />
      ) : (
        <div className="space-y-8">
          {/* Account */}
          <Card className="p-5">
            <div className="flex flex-wrap items-start justify-between gap-4">
              <div>
                <h2 className="font-serif text-xl font-medium text-text">
                  {data.student.nameEnglish}
                </h2>
                <p className="mt-1 font-mono text-sm text-text/60">
                  #{data.student.rollNumber} · {data.student.whatsapp}
                </p>
                <p className="mt-0.5 text-sm text-text/60">
                  {data.student.location} · {t("যোগদান", "joined")}{" "}
                  {when(data.student.createdAt)}
                </p>
              </div>
              <div className="flex flex-wrap gap-2">
                <StatusMark tone={data.student.isPro ? "done" : "pending"}>
                  {data.student.isPro ? "⭐ Pro" : t("সাধারণ", "Regular")}
                </StatusMark>
                <StatusMark
                  tone={data.student.registrationStatus === "Approved" ? "done" : "pending"}
                >
                  {data.student.registrationStatus}
                </StatusMark>
                <StatusMark tone={data.student.isWhatsAppGroupJoined ? "done" : "closed"}>
                  {data.student.isWhatsAppGroupJoined
                    ? t("গ্রুপে আছে", "In group")
                    : t("গ্রুপে নেই", "Not in group")}
                </StatusMark>
              </div>
            </div>
          </Card>

          <div className="grid gap-6 lg:grid-cols-2">
            {/* Payment history */}
            <section>
              <h3 className="flex items-center gap-2 font-serif text-lg font-medium text-text">
                <Banknote className="size-4 text-secondary" aria-hidden="true" />
                {t("পেমেন্ট ও ভর্তি", "Payments & enrollments")}
              </h3>
              <div className="mt-3 space-y-2">
                {data.registration && (
                  <Card className="p-4">
                    <p className="text-sm font-semibold text-text">
                      {t("৳৫০০ রেজিস্ট্রেশন", "৳500 registration")} · ৳
                      {data.registration.amount}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-text/55">
                      {data.registration.trxId} · {data.registration.status} ·{" "}
                      {when(data.registration.createdAt)}
                    </p>
                  </Card>
                )}
                {data.enrollments.map((e) => (
                  <Card key={e._id} className="p-4">
                    <p className="text-sm font-semibold text-text">
                      {e.courseName} · ৳{e.amount}
                    </p>
                    <p className="mt-0.5 font-mono text-[11px] text-text/55">
                      {e.trxId} · {e.status} · {when(e.createdAt)}
                    </p>
                  </Card>
                ))}
                {!data.registration && data.enrollments.length === 0 && (
                  <p className="text-sm text-text/55">
                    {t("কোনো পেমেন্ট নেই।", "No payments recorded.")}
                  </p>
                )}
              </div>

              <h3 className="mt-6 font-serif text-lg font-medium text-text">
                {t("কোর্স", "Courses")}
              </h3>
              <ul className="mt-2 space-y-1.5 text-sm text-text/70">
                {(data.courses ?? []).map((c) => (
                  <li key={c.courseId}>
                    {c.courseName}{" "}
                    <span className="font-mono text-[11px] text-text/45">{c.courseId}</span>
                  </li>
                ))}
                {data.courses.length === 0 && (
                  <li className="text-text/55">{t("কোর্সে নেই।", "Not on a course.")}</li>
                )}
              </ul>
            </section>

            {/* Sign-ins */}
            <section>
              <h3 className="flex items-center gap-2 font-serif text-lg font-medium text-text">
                <CalendarClock className="size-4 text-secondary" aria-hidden="true" />
                {t("লগইন ও ব্রাউজ সময়", "Sign-ins and time")}
              </h3>
              {data.session ? (
                <Card className="mt-3 p-4">
                  <dl className="grid grid-cols-2 gap-3 text-sm">
                    <div>
                      <dt className="text-[11px] text-text/50">{t("লগইন সংখ্যা", "Sign-ins")}</dt>
                      <dd className="font-mono text-lg font-bold tabular-nums text-text">
                        {data.session.logins}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-text/50">{t("মোট সময়", "Total time")}</dt>
                      <dd className="font-mono text-lg font-bold tabular-nums text-text">
                        {human(liveTotal(data.session))}
                      </dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-text/50">{t("শেষ লগইন", "Last sign-in")}</dt>
                      <dd className="text-text/75">{when(data.session.lastLoginAt)}</dd>
                    </div>
                    <div>
                      <dt className="text-[11px] text-text/50">{t("শেষ লগআউট", "Last sign-out")}</dt>
                      <dd className="text-text/75">{when(data.session.lastLogoutAt)}</dd>
                    </div>
                  </dl>

                  {data.session.onlineNow && (
                    <p className="mt-3 text-xs font-semibold text-ok">
                      ● {t("এখন অনলাইন", "Online right now")}
                    </p>
                  )}

                  {/* The history itself: when each visit started and how long it lasted. */}
                  {data.session.recent.length > 0 && (
                    <>
                      <p className="mt-4 text-[11px] text-text/50">
                        {t("সাম্প্রতিক লগইন", "Recent sign-ins")}
                        {data.session.logins > data.session.recent.length && (
                          <span className="text-text/40">
                            {" "}
                            ({t(
                              `সর্বশেষ ${data.session.recent.length} টি`,
                              `latest ${data.session.recent.length}`,
                            )})
                          </span>
                        )}
                      </p>
                      <ul className="mt-1 divide-y divide-text/10 rounded-lg border border-text/10">
                        {data.session.recent.map((r, i) => (
                          <li
                            key={`${r.loginAt}-${i}`}
                            className="flex items-center justify-between gap-2 px-2.5 py-1.5 text-xs"
                          >
                            <span className="tabular-nums text-text/60">{when(r.loginAt)}</span>
                            <span
                              className={`font-semibold tabular-nums ${
                                r.active ? "text-ok" : "text-text"
                              }`}
                            >
                              {r.active
                                ? t(
                                    `এখন চলছে · ${human(visitLength(r))}`,
                                    `running · ${human(visitLength(r))}`,
                                  )
                                : human(visitLength(r))}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}

                  {data.session.topPaths.length > 0 && (
                    <>
                      <p className="mt-4 text-[11px] text-text/50">
                        {t("সবচেয়ে বেশি দেখা পেজ", "Pages opened most")}
                      </p>
                      <ul className="mt-1 space-y-0.5 text-[12px] text-text/65">
                        {data.session.topPaths.map((p) => (
                          <li key={p.path} className="flex justify-between gap-3">
                            <span className="truncate font-mono text-[11px]">{p.path}</span>
                            <span className="font-mono font-bold tabular-nums text-text/55">
                              ×{p.count}
                            </span>
                          </li>
                        ))}
                      </ul>
                    </>
                  )}
                </Card>
              ) : (
                <p className="mt-3 text-sm text-text/55">
                  {t("কোনো লগইন নেই।", "No sign-ins yet.")}
                </p>
              )}
            </section>
          </div>

          {/* Exams */}
          <section>
            <h3 className="flex items-center gap-2 font-serif text-lg font-medium text-text">
              <Trophy className="size-4 text-secondary" aria-hidden="true" />
              {t("পরীক্ষার ফল", "Exam results")}
            </h3>
            {data.activity.exams.length === 0 ? (
              <p className="mt-2 text-sm text-text/55">{t("কোনো পরীক্ষা নেই।", "No exams yet.")}</p>
            ) : (
              <div className="mt-3 flex flex-wrap gap-2">
                {data.activity.exams.map((e) => (
                  <Card key={e._id} className="px-3 py-2 text-sm">
                    <span className="font-semibold text-text">
                      HSK {e.level} · L{e.lesson}
                    </span>
                    <span className="ml-2 font-mono tabular-nums text-text/65">
                      {e.best}/{e.totalMarks}
                    </span>
                    <span className="ml-2 text-[11px] text-text/45">
                      {t("চেষ্টা", "attempts")} {e.attempts}
                    </span>
                  </Card>
                ))}
              </div>
            )}
          </section>

          {/* Homework submissions */}
          <section className="grid gap-6 lg:grid-cols-2">
            <div>
              <h3 className="flex items-center gap-2 font-serif text-lg font-medium text-text">
                <Mic className="size-4 text-secondary" aria-hidden="true" />
                {t("ডায়ালগ রেকর্ডিং", "Dialogue recordings")}
                <span className="font-mono text-sm text-text/45">
                  {data.activity.dialogues.length}
                </span>
              </h3>
              {data.activity.dialogues.length === 0 ? (
                <p className="mt-2 text-sm text-text/55">{t("কোনো রেকর্ডিং নেই।", "No recordings.")}</p>
              ) : (
                <ul className="mt-3 space-y-1.5 text-sm">
                  {data.activity.dialogues.slice(0, 12).map((d) => (
                    <li key={d._id} className="flex items-center justify-between gap-3 text-text/70">
                      <span>
                        HSK {d.level} · L{d.lesson}
                      </span>
                      <span className="font-mono text-[11px] text-text/45">
                        {when(d.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            <div>
              <h3 className="flex items-center gap-2 font-serif text-lg font-medium text-text">
                <PenLine className="size-4 text-secondary" aria-hidden="true" />
                {t("হাতের লেখা", "Handwriting")}
                <span className="font-mono text-sm text-text/45">
                  {data.activity.handwriting.length}
                </span>
              </h3>
              {data.activity.handwriting.length === 0 ? (
                <p className="mt-2 text-sm text-text/55">
                  {t("কোনো ছবি নেই।", "No photos.")}
                </p>
              ) : (
                <ul className="mt-3 space-y-1.5 text-sm">
                  {data.activity.handwriting.slice(0, 12).map((h) => (
                    <li key={h._id} className="flex items-center justify-between gap-3 text-text/70">
                      <span>
                        HSK {h.level} · L{h.lesson}
                        {h.mark != null && (
                          <span className="ml-2 font-mono text-[11px] text-text/55">
                            {h.mark}/10
                          </span>
                        )}
                      </span>
                      <span className="font-mono text-[11px] text-text/45">
                        {when(h.createdAt)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </div>
          </section>

          {data.activity.dialogueMarks.length > 0 && (
            <section>
              <h3 className="flex items-center gap-2 font-serif text-lg font-medium text-text">
                <Star className="size-4 text-secondary" aria-hidden="true" />
                {t("দেওয়া নম্বর", "Marks given")}
              </h3>
              <div className="mt-3 flex flex-wrap gap-2">
                {data.activity.dialogueMarks.map((m) => (
                  <Card key={m._id} className="px-3 py-2 text-sm">
                    <span className="font-semibold text-text">
                      HSK {m.level} · L{m.lesson}
                    </span>
                    <span className="ml-2 font-mono tabular-nums text-text/65">{m.mark}/10</span>
                    {m.feedback && (
                      <span className="ml-2 text-[11px] text-text/50">{m.feedback}</span>
                    )}
                  </Card>
                ))}
              </div>
            </section>
          )}

          {data.courses.length === 0 &&
            data.enrollments.length === 0 &&
            data.activity.dialogues.length === 0 &&
            data.activity.handwriting.length === 0 &&
            data.activity.exams.length === 0 && (
              <EmptyState
                title={t("কোনো তথ্য নেই", "Nothing recorded yet")}
                description={t(
                  "এই শিক্ষার্থী এখনো কিছু জমা দেননি।",
                  "This student has not submitted anything yet.",
                )}
              />
            )}
        </div>
      )}
    </AdminShell>
  );
}
