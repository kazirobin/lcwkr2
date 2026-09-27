"use client";

import { useCallback, useEffect, useState } from "react";
import { CalendarClock, CheckCircle2, Gift, Ticket, Users } from "lucide-react";
import { useLanguage } from "@/i18n";
import { Button, Dialog, Field, LoadingBlock, useToast } from "@/components/ui";

/**
 * The course catalogue on the academy page.
 *
 * A course appears here once the admin has launched it, and it is sold at the
 * price stored on the course — there is no separate start/stop switch to keep in
 * step. Each card shows the things a student actually decides on: what it
 * teaches, how long it runs, what it costs, how many free classes they get
 * before paying, and how many seats are left.
 */

type CourseSummary = {
  courseId: string;
  courseName: string;
  targetLevel: string;
  tagline: string;
  duration: string;
  fee: number;
  freeClassCount: number;
  covers: string[];
  seats: number;
  launched: boolean;
  enrollmentDeadline: string;
  enrolled: number;
  remaining: number | null;
};

const BKASH_NUMBER = "01787881334";
const WHATSAPP_NUMBER = "8801787881334";

function money(n: number): string {
  return `৳${n.toLocaleString("en-US")}`;
}

export default function CourseCatalogue() {
  const { language } = useLanguage();
  const toast = useToast();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [courses, setCourses] = useState<CourseSummary[] | null>(null);
  const [open, setOpen] = useState<CourseSummary | null>(null);
  const [form, setForm] = useState({ name: "", whatsapp: "", trxId: "", location: "" });
  const [errors, setErrors] = useState<Record<string, string>>({});
  const [busy, setBusy] = useState(false);
  const [done, setDone] = useState<{ course: string; free: number } | null>(null);

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/course-enrollments/summary", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setCourses(data.courses as CourseSummary[]);
      else setCourses([]);
    } catch {
      setCourses([]);
    }
  }, []);

  // Deferred through a microtask rather than set inside the effect body — the
  // pattern the rest of the app uses to avoid a cascading render on mount.
  useEffect(() => {
    let alive = true;
    queueMicrotask(() => {
      if (alive) void load();
    });
    return () => {
      alive = false;
    };
  }, [load]);

  const startEnroll = (course: CourseSummary) => {
    setForm({ name: "", whatsapp: "", trxId: "", location: "" });
    setErrors({});
    setDone(null);
    setOpen(course);
  };

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!open) return;
    const errs: Record<string, string> = {};
    if (form.name.trim().length < 2)
      errs.name = t("নাম লিখুন।", "Enter your name.");
    if (!/^[0-9+\- ]{9,}$/.test(form.whatsapp.trim()))
      errs.whatsapp = t("সঠিক মোবাইল নম্বর দিন।", "Enter a valid mobile number.");
    if (open.fee > 0 && form.trxId.trim().length < 4)
      errs.trxId = t("bKash TrxID লিখুন।", "Enter the bKash TrxID.");
    setErrors(errs);
    if (Object.keys(errs).length) return;

    setBusy(true);
    try {
      const res = await fetch("/api/course-enrollments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ action: "enroll", courseId: open.courseId, ...form }),
      });
      const data = await res.json();
      if (!res.ok || !data.success) {
        toast(data.message || t("ভর্তি হয়নি।", "Enrollment failed."), "error");
        return;
      }
      setDone({ course: open.courseName, free: open.freeClassCount });
      setOpen(null);
      void load();
    } catch {
      toast(t("নেটওয়ার্ক সমস্যা। আবার চেষ্টা করুন।", "Network problem. Try again."), "error");
    } finally {
      setBusy(false);
    }
  };

  if (courses === null) {
    return (
      <section className="mt-16">
        <LoadingBlock label={t("কোর্স লোড হচ্ছে…", "Loading courses…")} />
      </section>
    );
  }

  if (courses.length === 0) return null;

  return (
    <section id="courses" className="mt-16">
      <h2 className="font-serif text-2xl font-medium tracking-tight text-text">
        {t("কোর্স ও ভর্তি", "Courses & enrollment")}
      </h2>
      <p className="mt-2 max-w-[60ch] text-sm leading-6 text-text/65">
        {t(
          "প্রতিটি কোর্সের ফি, সময়কাল ও বিষয়বস্তু নিচে দেওয়া আছে। ফি পাঠিয়ে ভর্তি করলে আপনি সরাসরি কোর্সে যুক্ত হবেন।",
          "Each course lists its fee, length and what it covers. Pay the fee and you join the course directly.",
        )}
      </p>

      <div className="mt-6 grid gap-4 sm:grid-cols-2">
        {courses.map((c) => {
          const soldOut = c.remaining !== null && c.remaining <= 0;
          const closed = Boolean(c.enrollmentDeadline) && c.enrollmentDeadline < today();
          return (
            <article
              key={c.courseId}
              className="flex flex-col rounded-2xl border border-text/12 bg-card p-5"
            >
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.14em] text-secondary">
                    {c.targetLevel}
                  </p>
                  <h3 className="mt-1 font-serif text-xl font-medium text-text">{c.courseName}</h3>
                </div>
                <span className="shrink-0 rounded-full bg-text/8 px-3 py-1 font-mono text-sm font-bold tabular-nums text-text">
                  {c.fee > 0 ? money(c.fee) : t("ফ্রি", "Free")}
                </span>
              </div>

              {c.tagline && (
                <p className="mt-2 text-sm leading-6 text-text/70">{c.tagline}</p>
              )}

              <dl className="mt-4 space-y-2 text-sm">
                {c.duration && (
                  <div className="flex items-center gap-2 text-text/70">
                    <CalendarClock className="size-4 shrink-0 text-text/40" aria-hidden="true" />
                    <dt className="sr-only">{t("সময়কাল", "Duration")}</dt>
                    <dd>{c.duration}</dd>
                  </div>
                )}
                {c.freeClassCount > 0 && (
                  <div className="flex items-center gap-2 text-text/70">
                    <Gift className="size-4 shrink-0 text-text/40" aria-hidden="true" />
                    <dt className="sr-only">{t("ফ্রি ক্লাস", "Free classes")}</dt>
                    <dd>
                      {t(
                        `${c.freeClassCount} টি ফ্রি ক্লাস আগে`,
                        `${c.freeClassCount} free classes first`,
                      )}
                    </dd>
                  </div>
                )}
                {c.seats > 0 && (
                  <div className="flex items-center gap-2 text-text/70">
                    <Users className="size-4 shrink-0 text-text/40" aria-hidden="true" />
                    <dt className="sr-only">{t("সিট", "Seats")}</dt>
                    <dd>
                      {t(
                        `${c.remaining} টি সিট বাকি`,
                        `${c.remaining} seats left`,
                      )}
                    </dd>
                  </div>
                )}
              </dl>

              {c.covers.length > 0 && (
                <ul className="mt-4 space-y-1.5">
                  {c.covers.map((item) => (
                    <li key={item} className="flex items-start gap-2 text-sm text-text/70">
                      <CheckCircle2
                        className="mt-0.5 size-4 shrink-0 text-ok"
                        aria-hidden="true"
                      />
                      <span>{item}</span>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-5 pt-1">
                {soldOut ? (
                  <p className="text-sm font-semibold text-text/55">
                    {t("সিট পূর্ণ", "All seats taken")}
                  </p>
                ) : closed ? (
                  <p className="text-sm font-semibold text-text/55">
                    {t("ভর্তির সময় শেষ", "Enrollment closed")}
                  </p>
                ) : (
                  <Button size="sm" onClick={() => startEnroll(c)}>
                    {t("ভর্তি করুন", "Enroll")}
                  </Button>
                )}
              </div>
            </article>
          );
        })}
      </div>

      <Dialog
        open={open !== null}
        onClose={() => setOpen(null)}
        title={t("কোর্সে ভর্তি", "Enroll in the course")}
        description={open ? `${open.courseName} — ${open.fee > 0 ? money(open.fee) : t("ফ্রি", "Free")}` : undefined}
        size="md"
      >
        {open && (
          <form onSubmit={submit} className="space-y-4">
            {open.fee > 0 && (
              <div className="rounded-xl border border-text/12 bg-background px-4 py-3 text-sm">
                <p className="font-semibold text-text">
                  {t("bKash পাঠান", "Send via bKash")}
                </p>
                <p className="mt-1 text-text/70">
                  {BKASH_NUMBER} — {money(open.fee)}
                </p>
                <p className="mt-1 text-xs text-text/55">
                  {t(
                    "পাঠানোর পর TrxID লিখে জমা দিন।",
                    "After sending, submit the TrxID below.",
                  )}
                </p>
              </div>
            )}
            <Field
              label={t("আপনার নাম", "Your name")}
              required
              value={form.name}
              onChange={(e) => setForm({ ...form, name: e.target.value })}
              error={errors.name}
            />
            <Field
              label={t("মোবাইল নম্বর", "Mobile number")}
              required
              value={form.whatsapp}
              onChange={(e) => setForm({ ...form, whatsapp: e.target.value })}
              error={errors.whatsapp}
            />
            <Field
              label={t("ঠিকানা", "Location")}
              value={form.location}
              onChange={(e) => setForm({ ...form, location: e.target.value })}
            />
            {open.fee > 0 && (
              <Field
                label={t("bKash TrxID", "bKash TrxID")}
                required
                value={form.trxId}
                onChange={(e) => setForm({ ...form, trxId: e.target.value.toUpperCase() })}
                error={errors.trxId}
                hint={t("যেমন: BL92A8XKQ", "e.g. BL92A8XKQ")}
              />
            )}
            <div className="flex items-center gap-3 pt-1">
              <Button type="submit" size="sm" disabled={busy}>
                {busy
                  ? t("জমা হচ্ছে…", "Submitting…")
                  : open.fee > 0
                    ? t("জমা দিন", "Submit")
                    : t("ভর্তি করুন", "Enroll")}
              </Button>
              {open.fee > 0 && (
                <a
                  href={`https://wa.me/${WHATSAPP_NUMBER}`}
                  target="_blank"
                  rel="noreferrer"
                  className="text-xs text-text/55 underline-offset-2 hover:underline"
                >
                  {t("সাহায্য লাগলে জিজ্ঞাসা করুন", "Ask for help")}
                </a>
              )}
            </div>
          </form>
        )}
      </Dialog>

      {/* Confirmation: what happens next, and what they can try first. */}
      <Dialog
        open={done !== null}
        onClose={() => setDone(null)}
        title={t("ভর্তি হয়েছে!", "You are enrolled")}
        size="sm"
        footer={
          <Button size="sm" onClick={() => setDone(null)}>
            {t("ঠিক আছে", "Got it")}
          </Button>
        }
      >
        {done && (
          <div className="space-y-3 text-sm leading-6 text-text/75">
            <p className="flex items-start gap-2">
              <Ticket className="mt-0.5 size-4 shrink-0 text-ok" aria-hidden="true" />
              <span>
                {t(
                  `${done.course} কোর্সের জন্য আপনার আবেদন পেয়েছি। ট্রানজেকশন যাচাই হলে আপনাকে জানানো হবে।`,
                  `We have your request for ${done.course}. You will be told once the payment is verified.`,
                )}
              </span>
            </p>
            {done.free > 0 && (
              <p className="flex items-start gap-2">
                <Gift className="mt-0.5 size-4 shrink-0 text-secondary" aria-hidden="true" />
                <span>
                  {t(
                    `ফি পাঠানোর আগে ${done.free} টি ফ্রি ক্লাসে যেতে পারবেন।`,
                    `You can join ${done.free} free classes before paying.`,
                  )}
                </span>
              </p>
            )}
          </div>
        )}
      </Dialog>
    </section>
  );
}

function today(): string {
  return new Date().toISOString().slice(0, 10);
}
