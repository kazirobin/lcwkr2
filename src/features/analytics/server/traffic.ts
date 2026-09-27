import { connectDB } from "@/lib/db";
import { StudentSession, TrafficDay, TrafficEvent, VisitorMark } from "../models";

/**
 * Traffic recording and reporting.
 *
 * Two rules keep this cheap enough to leave switched on:
 *
 *  1. Nothing is written per page view. Events are rolled up per day into a
 *     handful of rows, so the collection grows with days and distinct labels,
 *     not with traffic.
 *  2. Only the paths that matter are kept. Lesson and text pages collapse to
 *     their level ("/hsk/1") so 200 lessons do not become 200 rows, while
 *     /hsk/1/lesson/9 is still visible in the admin detail view.
 */

/** Today in Asia/Dhaka as YYYY-MM-DD, so the day rolls over at local midnight. */
export function today(): string {
  return new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Dhaka",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(new Date());
}

/** The last n days as YYYY-MM-DD, oldest first. */
export function recentDays(n: number): string[] {
  const out: string[] = [];
  for (let i = n - 1; i >= 0; i--) {
    const d = new Date();
    d.setDate(d.getDate() - i);
    out.push(
      new Intl.DateTimeFormat("en-CA", {
        timeZone: "Asia/Dhaka",
        year: "numeric",
        month: "2-digit",
        day: "2-digit",
      }).format(d),
    );
  }
  return out;
}

/**
 * Fold a real path into a groupable label. Keeps the route shape but drops the
 * per-item id, so every HSK 1 lesson rolls up under one row.
 */
export function normalizePath(path: string): string {
  const clean = (path || "/").split("?")[0].split("#")[0] || "/";
  return clean
    .replace(/\/hsk\/(\d)\/lesson\/\d+(\/text\/\d+)?(\/all)?\/?$/, "/hsk/$1")
    .replace(/\/academy\/students\/\d+$/, "/academy/students")
    .replace(/\/hw\/(\d+)\/\d+$/, "/hw")
    .replace(/\/admin\/?$/, "/admin")
    .replace(/\/$/, "") || "/";
}

/** Keep the traffic table from being filled with one-off asset or API URLs. */
function isTrackablePath(path: string): boolean {
  if (!path.startsWith("/")) return false;
  if (path.startsWith("/_next")) return false;
  if (path.startsWith("/api/")) return false;
  if (/\.[a-z0-9]{2,5}$/i.test(path)) return false; // files: pdf, png, js
  return true;
}

/** A short, readable name for a button, taken from whatever label it carries. */
export function normalizeClickLabel(raw: string): string {
  const value = (raw || "").replace(/\s+/g, " ").trim();
  if (!value) return "";
  return value.length > 48 ? `${value.slice(0, 45)}…` : value;
}

async function bumpEvent(
  day: string,
  kind: "page" | "click",
  label: string,
  amount: number,
): Promise<void> {
  await TrafficEvent.updateOne(
    { day, kind, label },
    { $inc: { count: amount } },
    { upsert: true },
  );
}

export type TrackInput = {
  kind: "page" | "click";
  label: string;
  visitorId?: string;
  phone?: string;
};

/**
 * Record one page view or button click. Never throws: a failed beacon must not
 * disturb the page the visitor is actually trying to read.
 */
export async function recordEvent(input: TrackInput): Promise<void> {
  try {
    await connectDB();
    const day = today();

    if (input.kind === "page") {
      if (!isTrackablePath(input.label)) return;
      const label = normalizePath(input.label);
      await TrafficDay.updateOne(
        { day },
        { $inc: { pageViews: 1 } },
        { upsert: true },
      );
      await bumpEvent(day, "page", label, 1);
    } else {
      const label = normalizeClickLabel(input.label);
      if (!label) return;
      await TrafficDay.updateOne({ day }, { $inc: { clicks: 1 } }, { upsert: true });
      await bumpEvent(day, "click", label, 1);
    }

    if (input.visitorId) await markVisitor(day, input.visitorId);
  } catch {
    /* tracking is best-effort and must never break the page */
  }
}

/**
 * Remember that this visitor was here today. The first ever visit also bumps
 * the new-visitor counter for the day, which is why the duplicate-key error
 * from the unique index is the signal we actually want.
 */
async function markVisitor(day: string, visitorId: string): Promise<void> {
  const id = visitorId.slice(0, 64);
  let isNew = false;
  try {
    await VisitorMark.create({ day, visitorId: id });
    isNew = true;
  } catch (err) {
    // Duplicate key means we have already counted this visitor today.
    const code = (err as { code?: number })?.code;
    if (code !== 11000) return;
  }
  if (isNew) {
    const firstSeen = await VisitorMark.findOne({ visitorId: id }).sort({ day: 1 }).lean();
    if (firstSeen?.day === day) {
      await TrafficDay.updateOne({ day }, { $inc: { newVisitors: 1 } }, { upsert: true });
    }
  }
}

/** Count distinct visitors for one day from the mark table. */
export async function uniqueVisitorsOn(day: string): Promise<number> {
  return VisitorMark.countDocuments({ day });
}

export type TrafficSummary = {
  today: {
    day: string;
    pageViews: number;
    clicks: number;
    logins: number;
    newVisitors: number;
    uniqueVisitors: number;
  };
  /** Oldest first, one entry per day, zero-filled so the chart never has gaps. */
  daily: Array<{
    day: string;
    pageViews: number;
    clicks: number;
    logins: number;
    uniqueVisitors: number;
  }>;
  topPages: Array<{ label: string; count: number }>;
  topButtons: Array<{ label: string; count: number }>;
  totals: { pageViews: number; uniqueVisitorsAllTime: number; sessions: number };
};

/**
 * Everything the home-page dashboard and the admin analytics page read. The
 * heavy numbers are capped so this stays a fast read on a small database.
 */
export async function trafficSummary(days = 14): Promise<TrafficSummary> {
  await connectDB();
  const window = recentDays(days);
  const day = window[window.length - 1];

  const [dayRows, eventRows, visitorRows, allTimeVisitors, sessionCount] = await Promise.all([
    TrafficDay.find({ day: { $in: window } }).lean(),
    TrafficEvent.find({ day: { $in: window } }).lean(),
    VisitorMark.aggregate<{ _id: string; n: number }>([
      { $match: { day: { $in: window } } },
      { $group: { _id: "$day", n: { $sum: 1 } } },
    ]),
    VisitorMark.distinct("visitorId").then((ids) => ids.length),
    StudentSession.countDocuments({}),
  ]);

  const byDay = new Map(dayRows.map((d) => [d.day, d]));
  const visitorsByDay = new Map(visitorRows.map((v) => [v._id, v.n]));
  const todayRow = byDay.get(day);
  const todayDoc = {
    day,
    pageViews: todayRow?.pageViews ?? 0,
    clicks: todayRow?.clicks ?? 0,
    logins: todayRow?.logins ?? 0,
    newVisitors: todayRow?.newVisitors ?? 0,
    uniqueVisitors: visitorsByDay.get(day) ?? 0,
  };

  // Sum the per-day event rows across the whole window, then take the leaders.
  const pageTotals = new Map<string, number>();
  const clickTotals = new Map<string, number>();
  for (const e of eventRows) {
    const target = e.kind === "page" ? pageTotals : clickTotals;
    target.set(e.label, (target.get(e.label) ?? 0) + e.count);
  }

  const leaders = (m: Map<string, number>) =>
    [...m.entries()]
      .sort((a, b) => b[1] - a[1])
      .slice(0, 8)
      .map(([label, count]) => ({ label, count }));

  return {
    today: todayDoc,
    daily: window.map((d) => {
      const row = byDay.get(d);
      return {
        day: d,
        pageViews: row?.pageViews ?? 0,
        clicks: row?.clicks ?? 0,
        logins: row?.logins ?? 0,
        uniqueVisitors: visitorsByDay.get(d) ?? 0,
      };
    }),
    topPages: leaders(pageTotals),
    topButtons: leaders(clickTotals),
    totals: {
      pageViews: dayRows.reduce((s, d) => s + (d.pageViews ?? 0), 0),
      uniqueVisitorsAllTime: allTimeVisitors,
      sessions: sessionCount,
    },
  };
}

/** Count a sign-in against the day. */
export async function recordLogin(day = today()): Promise<void> {
  try {
    await connectDB();
    await TrafficDay.updateOne({ day }, { $inc: { logins: 1 } }, { upsert: true });
  } catch {
    /* best effort */
  }
}
