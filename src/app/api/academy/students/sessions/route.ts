import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Student } from "@/features/academy/models";
import { StudentSession } from "@/features/analytics/models";
import { messageOf } from "@/lib/api-error";
import { canSeeContact } from "@/lib/admin-guard";
import { normalizePhone } from "@/features/academy/server/dialogues";

/**
 * GET /api/admin/students-login-report — a compact sign-in summary per student.
 *
 * Deliberately separate from /api/analytics/overview: the students table wants
 * two numbers per row, and pulling the whole traffic report for that would be
 * wasteful on a page with 60+ rows.
 *
 * This report is keyed by phone number, which is also the identity the students
 * table uses — but only when the caller is allowed to see phone numbers at all.
 * Before, the admin table asked for the redacted list and then looked sessions
 * up by a field that was not in the response, so every row showed a blank login
 * history and the report looked broken. Keying the join on a field the caller
 * actually receives is the fix, and requiring the passcode is what makes it
 * possible to return it.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    await connectDB();

    const staff = canSeeContact(req, url);
    const rows = await StudentSession.aggregate<{
      _id: string;
      logins: number;
      totalSeconds: number;
      lastLoginAt: Date | null;
      lastLogoutAt: Date | null;
      /** 1 while a session is open, 0 once it closed. Not a boolean: the
       *  placeholder rows for students who never signed in are pushed onto this
       *  same array below, and a mixed boolean/number list is a bug waiting to
       *  happen at the next comparison. */
      active: number;
    }>([
      { $match: { whatsapp: { $nin: ["", null] } } },
      {
        $group: {
          _id: "$whatsapp",
          logins: { $sum: 1 },
          totalSeconds: { $sum: { $ifNull: ["$durationSec", 0] } },
          lastLoginAt: { $max: "$loginAt" },
          lastLogoutAt: { $max: "$logoutAt" },
          // $max over a boolean is true if *any* session is still open, which
          // is the right answer: the student is online if one tab is alive.
          active: { $max: { $cond: [{ $ifNull: ["$active", false] }, 1, 0] } },
        },
      },
    ]);

    // A student who never signed in still deserves a row, so the report can be
    // lined up against the roll and the difference is visible.
    if (staff) {
      // Duplicate detection is done on the normalised form, because the same
      // person can be stored either way round. The row's own key, though, is
      // the raw stored value — which is what the students table hands the
      // browser, and therefore exactly what it will look this report up with.
      // Keying the filler rows by the normalised number instead put them under
      // a name the lookup would never try.
      const seen = new Set(rows.map((r) => normalizePhone(r._id)));
      const students = await Student.find({ registrationStatus: "Approved" })
        .select("whatsapp")
        .lean();
      for (const s of students) {
        const raw = String(s.whatsapp ?? "").trim();
        const key = normalizePhone(raw);
        if (!key || seen.has(key)) continue;
        seen.add(key);
        rows.push({
          _id: raw,
          logins: 0,
          totalSeconds: 0,
          lastLoginAt: null,
          lastLogoutAt: null,
          active: 0,
        });
      }
    }

    // Without the passcode a caller gets the school-wide totals but no per-phone
    // breakdown, so nobody can walk the endpoint harvesting sign-in times.
    if (!staff) {
      const loginsToday = new Date();
      loginsToday.setHours(0, 0, 0, 0);
      return NextResponse.json({
        success: true,
        restricted: true,
        totals: {
          distinctStudents: rows.length,
          logins: rows.reduce((n, r) => n + r.logins, 0),
          onlineNow: rows.filter((r) => r.active === 1).length,
          lastLoginAt: rows.reduce<Date | null>(
            (max, r) => (!max || (r.lastLoginAt && r.lastLoginAt > max) ? r.lastLoginAt : max),
            null,
          ),
          since: loginsToday.toISOString(),
        },
        sessions: {},
      });
    }

    const byPhone: Record<string, unknown> = {};
    for (const r of rows) {
      byPhone[r._id] = {
        logins: r.logins,
        totalSeconds: r.totalSeconds ?? 0,
        lastLoginAt: r.lastLoginAt ?? null,
        lastLogoutAt: r.lastLogoutAt ?? null,
        onlineNow: r.active === 1,
      };
    }

    return NextResponse.json({ success: true, restricted: false, sessions: byPhone });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not load sessions.") },
      { status: 500 },
    );
  }
}
