import { connectDB } from "@/lib/db";
import { StudentSession } from "../models";

/**
 * Login / logout bookkeeping for the per-student summary the admin asked for:
 * who signed in, when they signed out, and how long the session lasted.
 *
 * A student can have more than one tab open, so signing in twice simply closes
 * the earlier session rather than starting a second overlapping one.
 */

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
    await StudentSession.create({
      whatsapp: input.whatsapp,
      rollNumber: input.rollNumber ?? null,
      name: input.name,
      userAgent: (input.userAgent ?? "").slice(0, 200),
      loginAt: now,
      active: true,
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
    // $addToSet keeps the list of distinct pages without growing per repeat.
    await StudentSession.updateOne(
      { whatsapp, active: true },
      { $addToSet: { paths: label } },
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
        for (const p of s.paths ?? []) tally.set(p, (tally.get(p) ?? 0) + 1);
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
