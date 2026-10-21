import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { StudentSession } from "@/features/analytics/models";

// GET /api/student/time-spent?phone=01XXX → own time spent (for student dashboard)
export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const phone = params.get("phone")?.trim() ?? "";

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone required" }, { status: 400 });
    }

    await connectDB();

    const [summary] = await StudentSession.aggregate<{
      _id: string;
      logins: number;
      totalSeconds: number;
      firstLoginAt: Date | null;
      activeLoginAt: Date | null;
      active: boolean;
    }>([
      { $match: { whatsapp: phone } },
      {
        $group: {
          _id: "$whatsapp",
          logins: { $sum: 1 },
          totalSeconds: { $sum: { $ifNull: ["$durationSec", 0] } },
          firstLoginAt: { $min: "$firstLoginAt" },
          activeLoginAt: { $max: { $cond: [{ $ifNull: ["$active", false] }, "$loginAt", null] } },
          active: { $max: { $cond: [{ $ifNull: ["$active", false] }, true, false] } },
        },
      },
    ]);

    if (!summary) {
      return NextResponse.json({
        success: true,
        logins: 0,
        totalSeconds: 0,
        firstLoginAt: null,
        activeLoginAt: null,
        onlineNow: false,
      });
    }

    // Calculate live seconds if currently online
    const running =
      summary.active && summary.activeLoginAt
        ? Math.max(0, (Date.now() - new Date(summary.activeLoginAt).getTime()) / 1000)
        : 0;
    const liveTotalSeconds = (summary.totalSeconds ?? 0) + running;

    return NextResponse.json({
      success: true,
      logins: summary.logins,
      totalSeconds: liveTotalSeconds,
      firstLoginAt: summary.firstLoginAt,
      activeLoginAt: summary.activeLoginAt,
      onlineNow: summary.active === true,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load time spent.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}