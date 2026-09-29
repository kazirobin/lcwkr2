import { NextResponse } from "next/server";
import { markLiveAttendance, unmarkLiveAttendance } from "@/features/academy/server/live";
import { findStudentDocByPhone } from "@/features/academy/server/student-auth";
import { isAdminOrSub, passcodeFrom } from "@/lib/admin-guard";

/**
 * POST /api/academy/live/attendance — mark yourself present in the open class.
 *
 * A student sends their own account phone number and the server works out the
 * roll from it, so the button marks the person who is signed in rather than
 * whatever roll the request body happened to name. A roll sent on its own is
 * still accepted, but only for a teacher or admin passcode — that is the
 * admin-on-the-call case, and before this change anyone could mark anyone else
 * present by guessing a two-digit roll.
 */
export async function POST(req: Request) {
  try {
    const { courseId, rollNumber, phone, action, adminPasscode } = await req.json();

    if (!courseId) {
      return NextResponse.json({ error: "courseId is required." }, { status: 400 });
    }

    // This route already parses its body, so the staff passcode is read from
    // there as well as from the header/query helper.
    const isStaff =
      isAdminOrSub(adminPasscode) || isAdminOrSub(passcodeFrom(req, new URL(req.url)));

    let roll = Number(rollNumber);

    if (!isStaff || !roll) {
      if (!phone) {
        return NextResponse.json(
          { error: "Sign in to mark your attendance.", needLogin: true },
          { status: 401 },
        );
      }
      const student = await findStudentDocByPhone(phone);
      if (!student || student.registrationStatus !== "Approved") {
        return NextResponse.json(
          { error: "This account is not approved yet.", needLogin: true },
          { status: 403 },
        );
      }
      // A student may only ever mark themselves.
      if (!isStaff) roll = student.rollNumber;
    }

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
