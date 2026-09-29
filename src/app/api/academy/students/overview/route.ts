import { NextResponse } from "next/server";
import { attendanceLeaderboard } from "@/features/academy/server/attendance";
import { progressForRolls } from "@/features/academy/server/student-progress";

/**
 * GET /api/academy/students/overview — the whole scholars directory in one
 * request: each student's attendance, how much of their course work they have
 * actually collected, and who is at the two ends of the attendance table.
 *
 * It replaces three client-side calls (students + courses + marks) and, more
 * importantly, it is the only place the directory's numbers come from — the
 * "HW total" and the attendance percentage used to be re-derived per card, so
 * two students with the same record could show two different numbers.
 *
 * No phone numbers. A visitor gets names, rolls and results; contact details
 * need an admin passcode (see /api/academy/students?include=contact).
 */
export async function GET() {
  try {
    const rows = await attendanceLeaderboard();
    const progress = await progressForRolls(rows.map((r) => r.rollNumber));

    // Only rank students who have actually been marked, otherwise a brand-new
    // scholar with no classes yet would head the "most absent" table.
    const ranked = rows.filter((r) => r.held > 0);
    const top = [...ranked]
      .sort((a, b) => (b.rate ?? 0) - (a.rate ?? 0) || b.attended - a.attended)
      .slice(0, 3)
      .map((r) => r.rollNumber);
    const bottom = [...ranked]
      .sort((a, b) => (a.rate ?? 0) - (b.rate ?? 0) || a.attended - b.attended)
      .slice(0, 3)
      .map((r) => r.rollNumber);

    const students = rows.map((r) => ({
      rollNumber: r.rollNumber,
      nameEnglish: r.nameEnglish,
      avatarUrl: r.avatarUrl,
      isPro: r.isPro,
      location: r.location,
      courseIds: r.courseIds,
      attendance: { held: r.held, attended: r.attended, rate: r.rate },
      homework: progress.get(r.rollNumber) ?? {
        totalMarks: 0,
        obtained: 0,
        percent: null,
        examsGiven: 0,
        examsTotal: 0,
      },
      badges: {
        topAttendee: top.includes(r.rollNumber),
        leastAttendee: bottom.includes(r.rollNumber),
      },
    }));

    return NextResponse.json({
      success: true,
      students,
      leaders: {
        mostPresent: top,
        leastPresent: bottom,
        rankedCount: ranked.length,
      },
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to build overview";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
