import type { PipelineStage } from "mongoose";
import { connectDB } from "@/lib/db";
import { StudentSession, DailyActivity } from "../models";
import type { IDailyActivityDoc } from "../models";

/**
 * Login / logout bookkeeping for the per-student summary the admin asked for:
 * who signed in, when they signed out, and how long the session lasted.
 *
 * A student can have more than one tab open, so signing in twice simply closes
 * the earlier session rather than starting a second overlapping one.
 */

/** Distinct pages kept per session — beyond this the list stops growing. */
const PAGE_COUNT_CAP = 40;

export type StartSessionInput = {
  whatsapp: string;
  rollNumber?: number | null;
  name: string;
  userAgent?: string;
};

export async function startSession(input: StartSessionInput): Promise<void> {
  try {
    await connectDB();
    const now = new Date();
    // Close anything still marked active for this student, so the totals stay
    // one row per real sign-in.
    await StudentSession.updateMany(
      { whatsapp: input.whatsapp, active: true },
      { $set: { active: false, logoutAt: now } },
    );
    // Duration has to be computed from the stored loginAt, which only an
    // aggregation pipeline can do in a single update.
    //
    // `updatePipeline: true` is required, not optional: mongoose rejects a bare
    // array with "Cannot pass an array to query updates unless the
    // `updatePipeline` option is set". Without it this threw on every sign-in,
    // and the catch below swallowed it — so no session was ever recorded and
    // the admin's login report was permanently empty. That is exactly the bug
    // it looked like from the outside.
    await StudentSession.updateMany(
      { whatsapp: input.whatsapp, active: false, logoutAt: null },
      [
        {
          $set: {
            logoutAt: now,
            durationSec: {
              $max: [0, { $divide: [{ $subtract: [now, "$loginAt"] }, 1000] }],
            },
          },
        },
      ],
      { updatePipeline: true },
    );
    // Check if this is the student's first ever login
    const existingCount = await StudentSession.countDocuments({ whatsapp: input.whatsapp });
    await StudentSession.create({
      whatsapp: input.whatsapp,
      rollNumber: input.rollNumber ?? null,
      name: input.name,
      userAgent: (input.userAgent ?? "").slice(0, 200),
      loginAt: now,
      active: true,
      firstLoginAt: existingCount === 0 ? now : null,
    });
  } catch (error) {
    // Analytics must never block a sign-in — but silence here hid a broken
    // write for the whole life of this function, so at least leave a trace.
    console.error("[sessions] startSession failed:", error);
  }
}

/** Close every open session for this student and finalise the durations. */
export async function endSessions(whatsapp: string): Promise<void> {
  try {
    await connectDB();
    const now = new Date();
    await StudentSession.updateMany(
      { whatsapp, active: true },
      {
        $set: { active: false, logoutAt: now },
      },
    );
    // Same `updatePipeline` requirement as above — see startSession.
    await StudentSession.updateMany(
      { whatsapp, logoutAt: { $ne: null }, durationSec: 0 },
      [
        {
          $set: {
            durationSec: {
              $max: [
                0,
                {
                  $divide: [{ $subtract: ["$logoutAt", "$loginAt"] }, 1000],
                },
              ],
            },
          },
        },
      ],
      { updatePipeline: true },
    );
  } catch (error) {
    console.error("[sessions] endSessions failed:", error);
  }
}

/** Note a page or click against the student's open session. */
export async function noteActivity(
  whatsapp: string,
  kind: "page" | "click",
  label: string,
): Promise<void> {
  try {
    if (!whatsapp) return;
    await connectDB();
    if (kind === "click") {
      await StudentSession.updateOne(
        { whatsapp, active: true },
        { $inc: { clicks: 1 } },
      );
      return;
    }
    // One aggregation-pipeline update does both: keep the distinct list the
    // old readers use, and count every visit so "which page do they open most"
    // comes out as a number. A bare $addToSet could only ever say yes or no.
    await StudentSession.updateOne(
      { whatsapp, active: true },
      [
        {
          $set: {
            paths: { $setUnion: [{ $ifNull: ["$paths", []] }, [label]] },
            pageCounts: {
              $cond: [
                { $in: [label, { $ifNull: ["$pageCounts.path", []] }] },
                {
                  $map: {
                    input: { $ifNull: ["$pageCounts", []] },
                    as: "p",
                    in: {
                      path: "$$p.path",
                      count: {
                        $cond: [
                          { $eq: ["$$p.path", label] },
                          { $add: [{ $ifNull: ["$$p.count", 0] }, 1] },
                          { $ifNull: ["$$p.count", 0] },
                        ],
                      },
                    },
                  },
                },
                {
                  // Newest page first, capped: the short list is the point, and
                  // an unbounded array would outlive the session it describes.
                  $slice: [
                    { $concatArrays: [[{ path: label, count: 1 }], { $ifNull: ["$pageCounts", []] }] },
                    0,
                    PAGE_COUNT_CAP,
                  ],
                },
              ],
            },
          },
        },
      ],
      { updatePipeline: true },
    );
  } catch {
    /* best effort */
  }
}

export type StudentSessionSummary = {
  whatsapp: string;
  rollNumber: number | null;
  name: string;
  logins: number;
  totalSeconds: number;
  lastLoginAt: Date | null;
  lastLogoutAt: Date | null;
  active: boolean;
  topPaths: Array<{ path: string; count: number }>;
};

/** One row per student: sign-in count, total time, and most-visited pages. */
export async function sessionSummaries(limit = 100): Promise<StudentSessionSummary[]> {
  await connectDB();
  const rows = await StudentSession.aggregate<{
    _id: string;
    rollNumber: number | null;
    name: string;
    logins: number;
    totalSeconds: number;
    lastLoginAt: Date | null;
    lastLogoutAt: Date | null;
    active: boolean;
  }>([
    { $match: { whatsapp: { $nin: ["", null] } } },
    {
      $group: {
        _id: "$whatsapp",
        rollNumber: { $last: "$rollNumber" },
        name: { $last: "$name" },
        logins: { $sum: 1 },
        totalSeconds: { $sum: "$durationSec" },
        lastLoginAt: { $max: "$loginAt" },
        lastLogoutAt: { $max: "$logoutAt" },
        active: { $max: { $cond: [{ $ifNull: ["$active", false] }, true, false] } },
      },
    },
    { $sort: { lastLoginAt: -1 } },
    { $limit: limit },
  ]);

  return Promise.all(
    rows.map(async (r) => {
      const sessions = await StudentSession.find({ whatsapp: r._id })
        .sort({ loginAt: -1 })
        .limit(5)
        .lean();
      const tally = new Map<string, number>();
      for (const s of sessions) {
        for (const [path, count] of tallyOf(s)) tally.set(path, (tally.get(path) ?? 0) + count);
      }
      return {
        whatsapp: r._id,
        rollNumber: r.rollNumber ?? null,
        name: r.name,
        logins: r.logins,
        totalSeconds: r.totalSeconds ?? 0,
        lastLoginAt: r.lastLoginAt ?? null,
        lastLogoutAt: r.lastLogoutAt ?? null,
        active: r.active === true,
        topPaths: [...tally.entries()]
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([path, count]) => ({ path, count })),
      };
    }),
  );
}

/** One session's page tally: counted where a count exists, once per path where it does not. */
function tallyOf(s: {
  paths?: string[] | null;
  pageCounts?: Array<{ path: string; count?: number | null }> | null;
}): Array<[string, number]> {
  if (s.pageCounts && s.pageCounts.length > 0) {
    return s.pageCounts.map((p) => [p.path, p.count ?? 1]);
  }
  // Written before the counter existed: the distinct list still says which
  // pages were opened, only not how often, so each one counts as one.
  return (s.paths ?? []).map((p) => [p, 1]);
}

/** The same rule as `tallyOf`, for the reads that cannot afford a round trip per session. */
const PAGE_TALLY: PipelineStage = {
  $set: {
    tally: {
      $cond: [
        { $gt: [{ $size: { $ifNull: ["$pageCounts", []] } }, 0] },
        "$pageCounts",
        {
          $map: {
            input: { $ifNull: ["$paths", []] },
            as: "p",
            in: { path: "$$p", count: 1 },
          },
        },
      ],
    },
  },
};

/** Flatten sessions into (path, total visits), already sorted best first. */
function topPagesStage(limit: number): PipelineStage[] {
  return [
    PAGE_TALLY,
    { $unwind: "$tally" },
    {
      $group: {
        _id: { w: "$whatsapp", p: "$tally.path" },
        count: { $sum: { $ifNull: ["$tally.count", 1] } },
      },
    },
    { $sort: { count: -1 } },
    {
      $group: {
        _id: "$_id.w",
        pages: { $push: { path: "$_id.p", count: "$count" } },
      },
    },
    { $project: { pages: { $slice: ["$pages", limit] } } },
  ];
}

export type TopPage = { path: string; count: number };

/**
 * Most-opened pages for every student, in one pass over the sessions — the
 * students table asks this for all rows at once and 70 queries would defeat
 * the point of a single report.
 */
export async function topPagesByPhone(limit = 8): Promise<Record<string, TopPage[]>> {
  await connectDB();
  const rows = await StudentSession.aggregate<{ _id: string; pages: TopPage[] }>(
    [{ $match: { whatsapp: { $nin: ["", null] } } }, ...topPagesStage(limit)],
  );
  const out: Record<string, TopPage[]> = {};
  for (const r of rows) out[r._id] = r.pages ?? [];
  return out;
}

export type SignInRow = {
  loginAt: Date;
  logoutAt: Date | null;
  durationSec: number;
  active: boolean;
};

export type StudentSignInDetail = {
  logins: number;
  totalSeconds: number;
  lastLoginAt: Date | null;
  lastLogoutAt: Date | null;
  /** When the still-open session began, so its time can be counted live. */
  activeLoginAt: Date | null;
  /** First ever login time for this student (across all sessions). */
  firstLoginAt: Date | null;
  online: boolean;
  recent: SignInRow[];
  topPages: TopPage[];
};

/**
 * Everything one student's sign-in history is made of: how many times, how
 * long in total, when each visit started and stopped, and which pages they
 * kept coming back to.
 */
export async function signInDetailFor(
  whatsapp: string,
  recentLimit = 8,
): Promise<StudentSignInDetail | null> {
  if (!whatsapp) return null;
  await connectDB();

  const [summary] = await StudentSession.aggregate<{
    _id: string;
    logins: number;
    totalSeconds: number;
    lastLoginAt: Date | null;
    lastLogoutAt: Date | null;
    firstLoginAt: Date | null;
    activeLoginAt: Date | null;
    active: boolean;
  }>([
    { $match: { whatsapp } },
    {
      $group: {
        _id: "$whatsapp",
        logins: { $sum: 1 },
        totalSeconds: { $sum: { $ifNull: ["$durationSec", 0] } },
        lastLoginAt: { $max: "$loginAt" },
        lastLogoutAt: { $max: "$logoutAt" },
        firstLoginAt: { $min: "$firstLoginAt" },
        activeLoginAt: { $max: { $cond: [{ $ifNull: ["$active", false] }, "$loginAt", null] } },
        active: { $max: { $cond: [{ $ifNull: ["$active", false] }, true, false] } },
      },
    },
  ]);

  const [recent, top] = await Promise.all([
    StudentSession.find({ whatsapp })
      .sort({ loginAt: -1 })
      .limit(recentLimit)
      .select("loginAt logoutAt durationSec active")
      .lean(),
    StudentSession.aggregate<{ pages: TopPage[] }>([
      { $match: { whatsapp } },
      ...topPagesStage(8),
    ]),
  ]);

  if (!summary) return null;
  return {
    logins: summary.logins,
    totalSeconds: summary.totalSeconds ?? 0,
    lastLoginAt: summary.lastLoginAt ?? null,
    lastLogoutAt: summary.lastLogoutAt ?? null,
    firstLoginAt: summary.firstLoginAt ?? null,
    activeLoginAt: summary.activeLoginAt ?? null,
    online: summary.active === true,
    recent: recent.map((r) => ({
      loginAt: r.loginAt,
      logoutAt: r.logoutAt ?? null,
      durationSec: r.durationSec ?? 0,
      active: r.active === true,
    })),
    topPages: top[0]?.pages ?? [],
  };
}

/* ═══════════════════════════════════════════════════════════════════
   Daily Activity & Gamification
   ═══════════════════════════════════════════════════════════════════ */

/** Daily goal in seconds (15 minutes default) */
export const DAILY_GOAL_SECONDS = 15 * 60;

/** Map a path to its activity category */
function categorizePath(path: string): keyof IDailyActivityDoc["breakdown"] {
  if (path.startsWith("/hsk/") || path.startsWith("/hw/")) return "lessons";
  if (path.startsWith("/pinyin") || path.startsWith("/hanzi-pro")) return "practice";
  if (path.startsWith("/exam") || path.includes("/exam-results")) return "exams";
  if (path.startsWith("/translate")) return "translate";
  if (path.startsWith("/chinese-words")) return "vocabulary";
  return "other";
}

/** Get UTC midnight for a given date */
function startOfDay(d: Date = new Date()): Date {
  const date = new Date(d);
  date.setUTCHours(0, 0, 0, 0);
  return date;
}

/** Add seconds to today's daily activity for a student */
export async function addDailyActivity(
  whatsapp: string,
  seconds: number,
  path: string,
): Promise<void> {
  if (!whatsapp || seconds <= 0) return;
  try {
    await connectDB();
    const today = startOfDay();
    const category = categorizePath(path);

    await DailyActivity.findOneAndUpdate(
      { whatsapp, date: today },
      {
        $inc: {
          totalSeconds: seconds,
          [`breakdown.${category}`]: seconds,
        },
        $setOnInsert: { whatsapp, date: today, streak: 0 },
      },
      { upsert: true, new: true },
    );
  } catch {
    /* best effort */
  }
}

/** Check and update daily goal status */
export async function checkDailyGoal(whatsapp: string): Promise<void> {
  if (!whatsapp) return;
  try {
    await connectDB();
    const today = startOfDay();
    const doc = await DailyActivity.findOne({ whatsapp, date: today }).lean();
    if (doc && !doc.goalMet && doc.totalSeconds >= DAILY_GOAL_SECONDS) {
      await DailyActivity.updateOne(
        { whatsapp, date: today },
        { $set: { goalMet: true } },
      );
    }
  } catch {
    /* best effort */
  }
}

/** Calculate current streak for a student */
export async function calculateStreak(whatsapp: string): Promise<number> {
  if (!whatsapp) return 0;
  try {
    await connectDB();
    const today = startOfDay();
    const days = await DailyActivity.find({ whatsapp, date: { $lte: today } })
      .sort({ date: -1 })
      .select("date goalMet")
      .lean();

    let streak = 0;
    let checkDate = new Date(today);

    for (const day of days) {
      const dayDate = startOfDay(day.date);
      const diffDays = Math.round((checkDate.getTime() - dayDate.getTime()) / 86400000);

      if (diffDays === 0 || diffDays === 1) {
        // Today or yesterday - check if goal was met
        if (day.goalMet || dayDate.getTime() === today.getTime()) {
          streak++;
          checkDate = new Date(dayDate.getTime() - 86400000);
        } else {
          break;
        }
      } else if (diffDays > 1) {
        // Gap in streak
        break;
      }
    }

    // Update today's streak count
    if (streak > 0) {
      await DailyActivity.updateOne(
        { whatsapp, date: today },
        { $set: { streak } },
      ).catch(() => {});
    }

    return streak;
  } catch {
    return 0;
  }
}

/** Get streak history for calendar display (last 365 days) */
export async function getStreakHistory(whatsapp: string, days = 365): Promise<Array<{ date: Date; goalMet: boolean; totalSeconds: number }>> {
  if (!whatsapp) return [];
  try {
    await connectDB();
    const today = startOfDay();
    const cutoff = new Date(today.getTime() - days * 86400000);

    const history = await DailyActivity.find({
      whatsapp,
      date: { $gte: cutoff, $lte: today },
    })
      .select("date goalMet totalSeconds")
      .sort({ date: 1 })
      .lean();

    return history.map((d) => ({
      date: d.date,
      goalMet: d.goalMet,
      totalSeconds: d.totalSeconds,
    }));
  } catch {
    return [];
  }
}

/** Get weekly stats for progress ring */
export async function getWeeklyStats(whatsapp: string): Promise<{
  thisWeek: number;
  lastWeek: number;
  dailyAvg: number;
  goalDays: number;
}> {
  if (!whatsapp) return { thisWeek: 0, lastWeek: 0, dailyAvg: 0, goalDays: 0 };
  try {
    await connectDB();
    const today = startOfDay();
    const thisWeekStart = new Date(today.getTime() - today.getUTCDay() * 86400000);
    const lastWeekStart = new Date(thisWeekStart.getTime() - 7 * 86400000);
    const lastWeekEnd = new Date(thisWeekStart.getTime() - 1);

    const [thisWeekDocs, lastWeekDocs, allDocs] = await Promise.all([
      DailyActivity.find({ whatsapp, date: { $gte: thisWeekStart, $lte: today } })
        .select("totalSeconds goalMet")
        .lean(),
      DailyActivity.find({ whatsapp, date: { $gte: lastWeekStart, $lte: lastWeekEnd } })
        .select("totalSeconds goalMet")
        .lean(),
      DailyActivity.find({ whatsapp, date: { $lte: today } })
        .select("totalSeconds goalMet")
        .lean(),
    ]);

    const thisWeek = thisWeekDocs.reduce((sum, d) => sum + d.totalSeconds, 0);
    const lastWeek = lastWeekDocs.reduce((sum, d) => sum + d.totalSeconds, 0);
    const goalDays = allDocs.filter((d) => d.goalMet).length;
    const dailyAvg = allDocs.length > 0
      ? allDocs.reduce((sum, d) => sum + d.totalSeconds, 0) / allDocs.length
      : 0;

    return { thisWeek, lastWeek, dailyAvg, goalDays };
  } catch {
    return { thisWeek: 0, lastWeek: 0, dailyAvg: 0, goalDays: 0 };
  }
}

/** Milestone definitions */
export const MILESTONES = [
  { id: "first-day", seconds: 0, label: { bn: "প্রথম দিন", en: "First Day" }, icon: "🎉", type: "time" as const },
  { id: "1-hour", seconds: 3600, label: { bn: "১ ঘন্টা", en: "1 Hour" }, icon: "⭐", type: "time" as const },
  { id: "5-hours", seconds: 5 * 3600, label: { bn: "৫ ঘন্টা", en: "5 Hours" }, icon: "🌟", type: "time" as const },
  { id: "10-hours", seconds: 10 * 3600, label: { bn: "১০ ঘন্টা", en: "10 Hours" }, icon: "🏆", type: "time" as const },
  { id: "25-hours", seconds: 25 * 3600, label: { bn: "২৫ ঘন্টা", en: "25 Hours" }, icon: "🥇", type: "time" as const },
  { id: "50-hours", seconds: 50 * 3600, label: { bn: "৫০ ঘন্টা", en: "50 Hours" }, icon: "💎", type: "time" as const },
  { id: "100-hours", seconds: 100 * 3600, label: { bn: "১০০ ঘন্টা", en: "100 Hours" }, icon: "🏅", type: "time" as const },
  { id: "streak-3", seconds: 0, label: { bn: "৩ দিন স্ট্রিক", en: "3-Day Streak" }, icon: "🔥", type: "streak" as const },
  { id: "streak-7", seconds: 0, label: { bn: "৭ দিন স্ট্রিক", en: "7-Day Streak" }, icon: "🔥🔥", type: "streak" as const },
  { id: "streak-30", seconds: 0, label: { bn: "৩০ দিন স্ট্রিক", en: "30-Day Streak" }, icon: "🏆🔥", type: "streak" as const },
] as const;

export type Milestone = (typeof MILESTONES)[number];

/** Check and return newly earned milestones */
export async function checkMilestones(whatsapp: string): Promise<Milestone[]> {
  if (!whatsapp) return [];
  try {
    await connectDB();
    const totalDoc = await StudentSession.aggregate<{ total: number }>([
      { $match: { whatsapp } },
      { $group: { _id: "$whatsapp", total: { $sum: { $ifNull: ["$durationSec", 0] } } } },
    ]);
    const totalSeconds = totalDoc[0]?.total ?? 0;
    const streak = await calculateStreak(whatsapp);

    // Get already earned milestones from a simple key in localStorage equivalent
    // For now, we'll compute based on current totals
    const earned: Milestone[] = [];

    for (const m of MILESTONES) {
      let achieved = false;
      if (m.type === "streak") {
        const streakNum = parseInt(m.id.replace("streak-", ""));
        achieved = streak >= streakNum;
      } else if (m.id === "first-day") {
        achieved = totalSeconds > 0;
      } else {
        achieved = totalSeconds >= m.seconds;
      }
      if (achieved) earned.push(m);
    }

    return earned;
  } catch {
    return [];
  }
}

/** Get next milestone to work towards */
export async function getNextMilestone(whatsapp: string): Promise<Milestone | null> {
  if (!whatsapp) return null;
  try {
    await connectDB();
    const totalDoc = await StudentSession.aggregate<{ total: number }>([
      { $match: { whatsapp } },
      { $group: { _id: "$whatsapp", total: { $sum: { $ifNull: ["$durationSec", 0] } } } },
    ]);
    const totalSeconds = totalDoc[0]?.total ?? 0;
    const streak = await calculateStreak(whatsapp);

    for (const m of MILESTONES) {
      let achieved = false;
      if (m.type === "streak") {
        const streakNum = parseInt(m.id.replace("streak-", ""));
        achieved = streak >= streakNum;
      } else if (m.id === "first-day") {
        achieved = totalSeconds > 0;
      } else {
        achieved = totalSeconds >= m.seconds;
      }
      if (!achieved) return m;
    }
    return null;
  } catch {
    return null;
  }
}
