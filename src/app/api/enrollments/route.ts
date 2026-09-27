import { NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import { Course, CourseEnrollment } from "@/features/academy/models";
import { submitCourseEnrollment } from "@/features/academy/server/course-enrollments";
import { connectDB } from "@/lib/db";

/**
 * GET /api/enrollments?courseId= — kept for the seat counter on the academy
 * page, which expects { enrolled, capacity, remaining }.
 */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId") || "HSK-101";
    await connectDB();
    const [enrolled, course] = await Promise.all([
      CourseEnrollment.countDocuments({ courseId, status: { $ne: "Rejected" } }),
      Course.findOne({ courseId }).select("seats").lean(),
    ]);
    // The capacity now lives on the course rather than in a constant, so a
    // course with no seat limit reports 0 and the UI hides the meter.
    const capacity = course?.seats ?? 0;
    return NextResponse.json({
      success: true,
      enrolled,
      capacity,
      remaining: capacity ? Math.max(0, capacity - enrolled) : null,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Failed to load enrollments") },
      { status: 500 },
    );
  }
}

/**
 * POST /api/enrollments — the academy page's seat-reservation form.
 *
 * This used to write to its own `enrollments` collection, which the admin
 * could not see, approve or undo. It now goes through the same
 * CourseEnrollment path as every other course, so all courses share one queue.
 * The TrxID stays mandatory here because this form is only ever used for a paid
 * seat.
 */
export async function POST(req: Request) {
  try {
    const { courseId, name, whatsapp, trxId, location, note } = await req.json();
    if (!courseId || !name?.trim() || !whatsapp?.trim() || !trxId?.trim()) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }

    const result = await submitCourseEnrollment({
      courseId,
      name,
      whatsapp,
      trxId,
      location: location || "",
    });
    if (!result.ok) {
      const status = result.code === "full" || result.code === "closed" ? 409 : 400;
      return NextResponse.json({ success: false, message: result.message }, { status });
    }

    void note;
    return NextResponse.json({
      success: true,
      message: "Seat reserved. Your details were sent to the academy.",
      enrolled: undefined,
      remaining: undefined,
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Enrollment failed") },
      { status: 500 },
    );
  }
}
