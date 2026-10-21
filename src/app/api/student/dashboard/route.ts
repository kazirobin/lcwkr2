import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { StudentSession } from "@/features/analytics/models";
import {
  calculateStreak,
  getStreakHistory,
  getWeeklyStats,
  checkMilestones,
  getNextMilestone,
  DAILY_GOAL_SECONDS,
} from "@/features/analytics/server/sessions";

export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const phone = params.get("phone")?.trim() ?? "";

    if (!phone) {
      return NextResponse.json({ success: false, error: "Phone required" }, { status: 400 });
    }

    await connectDB();

    // Total time across all sessions
    const totalDoc = await StudentSession.aggregate<{ total: number; logins: number }>([
      { $match: { whatsapp: phone } },
      {
        $group: {
          _id: "$whatsapp",
          total: { $sum: { $ifNull: ["$durationSec", 0] } },
          logins: { $sum: 1 },
        },
      },
    ]);
    const totalSeconds = totalDoc[0]?.total ?? 0;
    const totalLogins = totalDoc[0]?.logins ?? 0;

    // Current streak
    const streak = await calculateStreak(phone);

    // Weekly stats
    const weekly = await getWeeklyStats(phone);

    // Streak history for calendar
    const history = await getStreakHistory(phone, 365);

    // Milestones
    const [earnedMilestones, nextMilestone] = await Promise.all([
      checkMilestones(phone),
      getNextMilestone(phone),
    ]);

    // Today's activity
    const today = new Date();
    today.setUTCHours(0, 0, 0, 0);
    const todayDoc = await StudentSession.aggregate<{ todaySeconds: number }>([
      { $match: { whatsapp: phone, loginAt: { $gte: today } } },
      { $group: { _id: "$whatsapp", todaySeconds: { $sum: { $ifNull: ["$durationSec", 0] } } } },
    ]);
    const todaySeconds = todayDoc[0]?.todaySeconds ?? 0;

    // Progress toward daily goal
    const dailyGoalProgress = Math.min(100, Math.round((todaySeconds / DAILY_GOAL_SECONDS) * 100));

    return NextResponse.json({
      success: true,
      totalSeconds,
      totalLogins,
      todaySeconds,
      dailyGoalSeconds: DAILY_GOAL_SECONDS,
      dailyGoalProgress,
      streak,
      weekly,
      history,
      earnedMilestones,
      nextMilestone,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load dashboard.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}