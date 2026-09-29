// Weekly class timetable, derived from the saved Google Meet links.
//
// A recurring class is not a "live class" — those are opened by hand on the day
// and carry the attendance. This is the timetable: which courses meet, on which
// days, at what time, and where to join. It is stored on the saved link itself
// rather than in a second model, so there is only ever one place a Meet URL and
// its schedule live together and they cannot drift apart.
//
// The school is in Bangladesh, so the schedule is stored and read in
// Asia/Dhaka regardless of where the visitor's browser is — a student opening
// the page from Toronto must still see "9:00 PM" if the class is at 9 PM Dhaka
// time. Everything is computed from the wall clock in that zone, never from the
// visitor's own offset.

export type RoutineClass = {
  id: string;
  courseId: string;
  label: string;
  topic: string;
  meetLink: string;
  /** JS day numbers, e.g. [6, 1, 3] for Sat, Mon, Wed. */
  days: number[];
  /** "HH:MM" local Dhaka time. */
  time: string;
  durationMin: number;
  /** True when the class is running at the requested moment. */
  live: boolean;
  /**
   * Signed distance to the class: minutes until it starts, or — once it has
   * started — how many minutes ago that was. The sign is what makes "is it
   * running right now" a question about `> -durationMin` rather than a
   * separate lookup.
   */
  minutesToStart: number;
  /**
   * Minutes until the next occurrence, always >= 0, so a class that is
   * running now does not drag the ordering back to seven days' time.
   */
  minutesAhead: number;
};

export const DHAKA_TZ = "Asia/Dhaka";

/** Day names indexed the same way as JS `Date#getDay()`. */
export const DAY_NAMES = [
  "Saturday",
  "Sunday",
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
] as const;

const DAY_SHORT_BN = ["শনি", "রবি", "সোম", "মঙ্গল", "বুধ", "বৃহ", "শুক্র"] as const;
const DAY_SHORT_EN = ["Sat", "Sun", "Mon", "Tue", "Wed", "Thu", "Fri"] as const;

export function dayShort(day: number, language: "bn" | "en"): string {
  const i = ((day % 7) + 7) % 7;
  return (language === "bn" ? DAY_SHORT_BN : DAY_SHORT_EN)[i];
}

export function formatTime(time: string, language: "bn" | "en"): string {
  const [h, m] = String(time ?? "")
    .split(":")
    .map((n) => Number(n));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return time ?? "";
  const suffix = language === "bn" ? (h < 12 ? "পূর্বাহ্ণ" : "অপরাহ্ণ") : h < 12 ? "AM" : "PM";
  const hour12 = h % 12 === 0 ? 12 : h % 12;
  return language === "bn"
    ? `${hour12}টা ${m}মিন ${suffix}`
    : `${hour12}:${String(m).padStart(2, "0")} ${suffix}`;
}

/**
 * The current wall clock in Dhaka, as parts.
 *
 * `Intl` with an explicit time zone gives the same answer for a viewer anywhere
 * in the world, which is the whole point: the class is at 9 PM in Dhaka, and
 * that must not shift because someone opened the site in another country.
 */
export function dhakaNow(at: Date = new Date()): {
  day: number;
  minutes: number;
  hours: number;
} {
  const parts = new Intl.DateTimeFormat("en-US", {
    timeZone: DHAKA_TZ,
    weekday: "short",
    hour: "2-digit",
    minute: "2-digit",
    hour12: false,
  }).formatToParts(at);
  const get = (type: string) => parts.find((p) => p.type === type)?.value ?? "";
  const dayMap: Record<string, number> = {
    Sat: 6,
    Sun: 0,
    Mon: 1,
    Tue: 2,
    Wed: 3,
    Thu: 4,
    Fri: 5,
  };
  const hours = Number(get("hour")) % 24;
  const minutes = Number(get("minute"));
  return { day: dayMap[get("weekday")] ?? 0, hours, minutes: hours * 60 + minutes };
}

function parseTime(time: string): number {
  const [h, m] = String(time ?? "")
    .split(":")
    .map((n) => Number(n));
  if (!Number.isFinite(h) || !Number.isFinite(m)) return NaN;
  return h * 60 + m;
}

/**
 * The distance to a class.
 *
 * `signed` is negative once today's start time has passed, which is what makes
 * "is it running" a check on `-signed < durationMin` rather than a second
 * lookup — and it keeps a class that began an hour ago from being read as
 * though it starts next week.
 *
 * `ahead` is the same recurrence seen forwards, so it always names the next
 * time the class meets. A class that is running now is not "next"; the same
 * slot seven days out is.
 */
function distances(from: { day: number; minutes: number }, days: number[], start: number) {
  let signed = Infinity;
  let ahead = Infinity;
  for (const d of days) {
    const delta = ((d - from.day + 7) % 7) * 1440 + (start - from.minutes);
    if (delta < signed) signed = delta;
    const forward = delta < 0 ? delta + 7 * 1440 : delta;
    if (forward < ahead) ahead = forward;
  }
  return signed === Infinity ? null : { signed, ahead };
}

export type RoutineSource = {
  _id: string;
  courseId: string;
  label: string;
  topic: string;
  meetLink: string;
  days?: number[] | null;
  time?: string | null;
  durationMin?: number | null;
  active?: boolean | null;
};

/**
 * Turn saved links into the classes that are on now, and the ones coming up.
 * `at` is injectable so the schedule can be tested for any moment.
 */
export function buildRoutine(
  links: RoutineSource[],
  at: Date = new Date(),
): { classes: RoutineClass[]; liveNow: RoutineClass[]; next?: RoutineClass } {
  const now = dhakaNow(at);
  const classes: RoutineClass[] = [];

  for (const link of links) {
    if (!link.active) continue;
    const days = (link.days ?? []).map((d) => Number(d)).filter((d) => Number.isInteger(d));
    const start = parseTime(link.time ?? "");
    if (!days.length || !Number.isFinite(start) || !link.meetLink) continue;
    const duration = Math.max(5, Number(link.durationMin ?? 60));
    const d = distances(now, days, start);
    if (!d) continue;
    // A class is running from its start time until it has lasted `duration`.
    const live = d.signed <= 0 && -d.signed < duration;
    classes.push({
      id: link._id,
      courseId: link.courseId,
      label: link.label ?? "",
      topic: link.topic ?? "",
      meetLink: link.meetLink,
      days,
      time: link.time ?? "",
      durationMin: duration,
      live,
      minutesToStart: d.signed,
      minutesAhead: d.ahead,
    });
  }

  // Classes already running come first, longest-running at the top; everything
  // else is ordered by how soon it comes round.
  classes.sort((a, b) =>
    a.live && b.live ? a.minutesToStart - b.minutesToStart : a.minutesAhead - b.minutesAhead,
  );
  const nextLive = classes.find((c) => !c.live);
  return {
    classes,
    liveNow: classes.filter((c) => c.live),
    next: nextLive,
  };
}

/** "in 2h 15m" / "now" / "tomorrow" style countdown for the popup. */
export function countdownText(minutes: number, language: "bn" | "en"): string {
  if (minutes <= 0) return language === "bn" ? "এখন চলছে" : "running now";
  const days = Math.floor(minutes / 1440);
  const hrs = Math.floor((minutes % 1440) / 60);
  const mins = minutes % 60;
  if (language === "bn") {
    if (days) return `${days} দিন পরে`;
    if (hrs) return `${hrs} ঘণ্টা ${mins} মিনিট পরে`;
    return `${mins} মিনিট পরে`;
  }
  if (days) return `in ${days}d`;
  if (hrs) return `in ${hrs}h ${mins}m`;
  return `in ${mins}m`;
}
