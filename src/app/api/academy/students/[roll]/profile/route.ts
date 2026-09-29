import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Student } from "@/features/academy/models";
import { attendanceReport, courseIdsOf } from "@/features/academy/server/attendance";
import { progressFor } from "@/features/academy/server/student-progress";
import { canSeeContact } from "@/lib/admin-guard";

/**
 * GET /api/academy/students/[roll]/profile — the public scholar profile.
 *
 * Anyone may look at a classmate's progress, which is the point of the page, so
 * it is deliberately ungated. What it must not do is hand out the phone number
 * or accept a phone number from the caller: the older version of this page
 * fetched `/api/hw/marks?phone=…`, which meant the roll number was a working
 * substitute for someone's personal number and a scraper could walk the roster.
 * Everything is joined here by roll instead, and the number is only added back
 * for an admin.
 */
export async function GET(
  req: Request,
  props: { params: Promise<{ roll: string }> },
) {
  try {
    const { roll } = await props.params;
    const rollNumber = Number(roll);
    if (!Number.isInteger(rollNumber)) {
      return NextResponse.json({ success: false, error: "Bad roll" }, { status: 400 });
    }

    await connectDB();
    const doc = await Student.findOne({ rollNumber })
      .select("rollNumber nameEnglish location avatarUrl isPro isWhatsAppGroupJoined enrolledCourseId enrolledCourseIds registrationStatus whatsapp")
      .lean();
    if (!doc) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    const { whatsapp, ...publicStudent } = doc;
    const courseIds = courseIdsOf(doc);

    const [attendance, progress] = await Promise.all([
      attendanceReport(rollNumber, courseIds),
      progressFor(whatsapp),
    ]);

    return NextResponse.json({
      success: true,
      student: publicStudent,
      courseIds,
      attendance,
      progress,
      // Contact details are the one thing on this profile that needs a passcode.
      ...(canSeeContact(req, new URL(req.url)) ? { contact: { whatsapp } } : {}),
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to build profile";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
