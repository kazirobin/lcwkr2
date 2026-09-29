"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { CalendarClock, Check, ExternalLink, X } from "lucide-react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import { Button } from "@/components/ui";

type RoutineClass = {
  id: string;
  courseId: string;
  label: string;
  topic: string;
  meetLink: string;
  days: number[];
  time: string;
  durationMin: number;
  live: boolean;
  minutesToStart: number;
  minutesAhead: number;
};

type Language = "bn" | "en";

const DAY_NAMES: Record<Language, string[]> = {
  bn: ["শনিবার", "রবিবার", "সোমবার", "মঙ্গলবার", "বুধবার", "বৃহস্পতিবার", "শুক্রবার"],
  en: ["Saturday", "Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday"],
};
const DAY_SHORT: Record<Language, string[]> = {
  bn: ["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র"],
  en: ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"],
};

const DHAKA_TZ = "Asia/Dhaka";

const dhakaNow = (at: Date) => {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DHAKA_TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(at);
  const get = (t: string) => parts.find((p) => p.type === t)?.value ?? "";
  const hours = Number(get("hour")) % 24;
  return { day: ({ Sat: 6, Sun: 0, Mon: 1, Tue: 2, Wed: 3, Thu: 4, Fri: 5 } as Record<string, number>)[get("weekday")] ?? 0, minutes: hours * 60 + Number(get("minute")) };
};

const parseTime = (time: string) => {
  const [h, m] = String(time).split(":").map(Number);
  return Number.isFinite(h) && Number.isFinite(m) ? h * 60 + m : NaN;
};

/** Signed distance to the class, plus the forward distance to its next
 *  occurrence. Mirrors server/routine.ts so the popup can open the moment the
 *  hour arrives without waiting for the next poll. */
const distances = (day: number, nowMin: number, days: number[], start: number) => {
  let signed = Infinity;
  let ahead = Infinity;
  for (const d of days) {
    const delta = ((d - day + 7) % 7) * 1440 + (start - nowMin);
    if (delta < signed) signed = delta;
    const forward = delta < 0 ? delta + 7 * 1440 : delta;
    if (forward < ahead) ahead = forward;
  }
  return signed === Infinity ? null : { signed, ahead };
};

const formatTime = (time: string, lang: Language) => {
  const [h, m] = String(time).split(":").map(Number);
  if (!Number.isFinite(h)) return time;
  const suffix = lang === "bn" ? (h < 12 ? "পূর্বাহ্ণ" : "অপরাহ্ণ") : h < 12 ? "AM" : "PM";
  const h12 = h % 12 === 0 ? 12 : h % 12;
  return lang === "bn" ? `${h12}টা ${m}মিন ${suffix}` : `${h12}:${String(m).padStart(2, "0")} ${suffix}`;
};

const countdown = (mins: number, lang: Language) => {
  if (mins <= 0) return lang === "bn" ? "এখন চলছে" : "running now";
  const d = Math.floor(mins / 1440);
  const h = Math.floor((mins % 1440) / 60);
  const m = mins % 60;
  if (lang === "bn") {
    if (d) return `${d} দিন পরে`;
    if (h) return `${h} ঘণ্টা পরে`;
    return `${m} মিনিট পরে`;
  }
  if (d) return `in ${d}d`;
  if (h) return `in ${h}h`;
  return `in ${m}m`;
};

const meetHref = (raw: string) => {
  const v = (raw ?? "").trim();
  if (!v) return v;
  return /^[a-z][a-z0-9+.-]*:\/\//i.test(v) ? v : `https://${v}`;
};

/**
 * The weekly class timetable, with a popup when a class is about to start or
 * already running.
 *
 * The join button is a plain link with no attendance attached — a guest can
 * click it like anyone else. Attendance is a separate, optional step offered
 * only to a signed-in student, because attendance is recorded against an
 * account, and the teacher takes it from the class list.
 */
export default function ClassRoutine({ compact = false }: { compact?: boolean }) {
  const { language } = useLanguage();
  const lang: Language = language === "en" ? "en" : "bn";
  const t = useCallback((bn: string, en: string) => (lang === "bn" ? bn : en), [lang]);
  const { student } = useAccount();

  const [classes, setClasses] = useState<RoutineClass[]>([]);
  const [loading, setLoading] = useState(true);
  const [dismissed, setDismissed] = useState<string | null>(null);
  const [now, setNow] = useState(() => Date.now());

  const load = useCallback(async () => {
    try {
      const res = await fetch("/api/academy/routine", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setClasses(data.classes ?? []);
    } catch {
      /* offline — the section simply stays empty */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    queueMicrotask(() => void load());
    // A minute is the finest grain the schedule is expressed in.
    const iv = setInterval(() => {
      setNow(Date.now());
      void load();
    }, 60_000);
    return () => clearInterval(iv);
  }, [load]);

  // Re-derive live/upcoming from the clock so the popup opens by itself when
  // the class hour arrives, with no page reload.
  const view = useMemo(() => {
    const { day, minutes } = dhakaNow(new Date(now));
    return classes
      .map((c) => {
        const start = parseTime(c.time);
        if (!Number.isFinite(start)) return null;
        const d = distances(day, minutes, c.days, start);
        if (!d) return null;
        return {
          ...c,
          live: d.signed <= 0 && -d.signed < c.durationMin,
          minutesToStart: d.signed,
          minutesAhead: d.ahead,
        };
      })
      .filter((c): c is RoutineClass => c !== null)
      .sort((a, b) =>
        a.live && b.live
          ? a.minutesToStart - b.minutesToStart
          : a.minutesAhead - b.minutesAhead,
      );
  }, [classes, now]);

  const liveNow = view.filter((c) => c.live);
  // Nudge a few minutes ahead so the popup exists before the class does.
  const soon = view.find((c) => !c.live && c.minutesAhead <= 15);
  const popup = liveNow[0] ?? soon;

  if (loading || classes.length === 0) return null;

  return (
    <>
      {!compact && (
        <section className="mb-10" aria-labelledby="routine-heading">
          <h2
            id="routine-heading"
            className="mb-3 flex items-center gap-2 text-sm font-bold text-text"
          >
            <CalendarClock className="h-4 w-4 text-text/40" aria-hidden="true" />
            {t("ক্লাসের সময়সূচি", "Class schedule")}
            <span className="text-[11px] font-normal text-text/45">
              {t("(গুগল মিট টাইম, ঢাকা)", "(Google Meet time, Dhaka)")}
            </span>
          </h2>

          <ul className="grid gap-2 sm:grid-cols-2">
            {view.map((c) => (
              <li
                key={c.id}
                className={`rounded-2xl border px-4 py-3.5 transition-colors ${
                  c.live
                    ? "border-ok/50 bg-ok/8"
                    : "border-text/12 bg-card hover:border-text/25"
                }`}
              >
                <div className="flex flex-wrap items-baseline justify-between gap-x-3 gap-y-1">
                  <p className="text-sm font-bold text-text">
                    <span className="font-mono text-xs text-text/55">{c.courseId}</span>{" "}
                    {c.label || c.topic || t("লাইভ ক্লাস", "Live class")}
                  </p>
                  {c.live ? (
                    <span className="inline-flex items-center gap-1.5 rounded-full bg-ok/15 px-2 py-0.5 text-[10px] font-bold text-ok">
                      <span className="relative flex size-1.5">
                        <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-ok/70" />
                        <span className="relative inline-flex size-1.5 rounded-full bg-ok" />
                      </span>
                      {t("এখন চলছে", "Live now")}
                    </span>
                  ) : (
                    <span className="text-[11px] tabular-nums text-text/50">
                      {countdown(c.minutesAhead, lang)}
                    </span>
                  )}
                </div>

                <p className="mt-1 text-xs text-text/55">
                  {c.days.map((d) => DAY_SHORT[lang][((d % 7) + 7) % 7]).join(" · ")} ·{" "}
                  {formatTime(c.time, lang)}
                </p>

                <a
                  href={meetHref(c.meetLink)}
                  target="_blank"
                  rel="noopener noreferrer"
                  className={`mt-2.5 inline-flex items-center gap-1.5 rounded-xl px-3 py-1.5 text-xs font-bold transition-opacity hover:opacity-90 ${
                    c.live ? "bg-ok text-white" : "border border-text/15 text-text/70"
                  }`}
                >
                  <ExternalLink className="h-3.5 w-3.5" aria-hidden="true" />
                  {t("গুগল মিটে যোগ দিন", "Join Google Meet")}
                </a>
              </li>
            ))}
          </ul>
        </section>
      )}

      {/* Pre-class / in-class popup. */}
      {popup && dismissed !== popup.id && (
        <div className="fixed bottom-4 left-4 z-50 w-[min(92vw,22rem)] rounded-2xl border border-primary/40 bg-card p-4 shadow-2xl">
          <div className="flex items-start gap-3">
            <span className="flex size-9 shrink-0 items-center justify-center rounded-xl bg-primary/12 text-primary">
              <CalendarClock className="h-4.5 w-4.5" aria-hidden="true" />
            </span>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-bold text-text">
                {popup.live
                  ? t("ক্লাস চলছে", "Class is live")
                  : t("ক্লাস শুরু হবে", "Class starts soon")}
              </p>
              <p className="mt-0.5 truncate text-xs text-text/60">
                <span className="font-mono text-text/45">{popup.courseId}</span>{" "}
                {popup.label || popup.topic || t("লাইভ ক্লাস", "Live class")}
              </p>
              <p className="mt-0.5 text-[11px] tabular-nums text-text/50">
                {popup.days.map((d) => DAY_NAMES[lang][((d % 7) + 7) % 7]).join(", ")} ·{" "}
                {formatTime(popup.time, lang)} ·{" "}
                {countdown(popup.live ? popup.minutesToStart : popup.minutesAhead, lang)}
              </p>
            </div>
            <button
              type="button"
              onClick={() => setDismissed(popup.id)}
              aria-label={t("বন্ধ করুন", "Dismiss")}
              className="shrink-0 rounded-lg p-1.5 text-text/40 hover:bg-text/5 hover:text-text"
            >
              <X className="h-4 w-4" />
            </button>
          </div>

          <div className="mt-3 flex flex-wrap items-center gap-2">
            <Button
              size="sm"
              iconLeft={<ExternalLink className="h-3.5 w-3.5" />}
              onClick={() => window.open(meetHref(popup.meetLink), "_blank", "noopener,noreferrer")}
            >
              {t("যোগ দিন", "Join")}
            </Button>
            {/* Attendance is optional, and only a signed-in student can record
                it — the live-class dialog does the one-tap mark. */}
            {student ? (
              <span className="text-[11px] text-text/50">
                {t("হাজিরা দিতে চাইলে লাইভ ক্লাস বাজারে চাপ দিন।", "Tap the live-class badge to mark attendance.")}
              </span>
            ) : (
              <span className="inline-flex items-center gap-1 text-[11px] text-text/50">
                <Check className="h-3 w-3" aria-hidden="true" />
                {t("হাজিরা দিতে চাইলে লগইন করুন", "Sign in if you want attendance marked")}
              </span>
            )}
          </div>
        </div>
      )}
    </>
  );
}
