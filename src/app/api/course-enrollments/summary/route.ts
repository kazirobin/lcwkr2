import { NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import { listCourseSummaries } from "@/features/academy/server/course-enrollments";

/**
 * GET /api/course-enrollments/summary — the public course catalogue.
 *
 * Only launched courses are returned, and only the fields a visitor needs to
 * decide: name, level, tagline, duration, fee, free-class count, what it
 * covers, and how many seats are left.
 */
export async function GET() {
  try {
    const courses = await listCourseSummaries(false);
    return NextResponse.json({ success: true, courses });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: messageOf(error, "Request failed.") }, { status: 500 });
  }
}
