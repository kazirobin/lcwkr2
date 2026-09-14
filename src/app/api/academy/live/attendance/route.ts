import { NextResponse } from "next/server";
import { markLiveAttendance, unmarkLiveAttendance } from "@/features/academy/server/live";

/**
 * POST /api/academy/live/attendance — public, roll-number based toggle.
 * { courseId, rollNumber } → marks attendance in the open class.
 * { courseId, rollNumber, action: "unmark" } → removes attendance.
 */
export async function POST(req: Request) {
  try {
    const { courseId, rollNumber, action } = await req.json();

    if (!courseId || !rollNumber) {
      return NextResponse.json({ error: "courseId and rollNumber are required." }, { status: 400 });
    }

    const roll = Number(rollNumber);
    if (!Number.isFinite(roll) || roll <= 0) {
      return NextResponse.json({ error: "Invalid roll number." }, { status: 400 });
    }

    if (action === "unmark") {
      const result = await unmarkLiveAttendance(courseId, roll);
      return NextResponse.json(
        { success: true, message: "Attendance removed.", session: result },
        { status: 200 },
      );
    }

    const result = await markLiveAttendance(courseId, roll);
    return NextResponse.json(
      {
        success: true,
        duplicate: result.duplicate ?? false,
        message: result.duplicate
          ? "Attendance already marked."
          : "Attendance marked successfully.",
        session: result,
      },
      { status: 200 },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update attendance";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
