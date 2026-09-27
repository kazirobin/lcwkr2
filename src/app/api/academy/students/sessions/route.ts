import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { StudentSession } from "@/features/analytics/models";
import { messageOf } from "@/lib/api-error";

/**
 * GET /api/academy/students/sessions — a compact sign-in summary per student,
 * keyed by the phone number the student list already has.
 *
 * Deliberately separate from /api/analytics/overview: the students table wants
 * two numbers per row, and pulling the whole traffic report for that would be
 * wasteful on a page with 60+ rows.
 */
export async function GET() {
  try {
    await connectDB();
    const rows = await StudentSession.aggregate<{
      _id: string;
      logins: number;
      totalSeconds: number;
      lastLoginAt: Date | null;
      active: boolean;
    }>([
      { $match: { whatsapp: { $nin: ["", null] } } },
      {
        $group: {
          _id: "$whatsapp",
          logins: { $sum: 1 },
          totalSeconds: { $sum: "$durationSec" },
          lastLoginAt: { $max: "$loginAt" },
          active: { $max: { $cond: [{ $ifNull: ["$active", false] }, true, false] } },
        },
      },
    ]);

    const byPhone: Record<string, unknown> = {};
    for (const r of rows) {
      byPhone[r._id] = {
        logins: r.logins,
        totalSeconds: r.totalSeconds ?? 0,
        lastLoginAt: r.lastLoginAt ?? null,
        active: r.active === true,
      };
    }

    return NextResponse.json({ success: true, sessions: byPhone });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not load sessions.") },
      { status: 500 },
    );
  }
}
