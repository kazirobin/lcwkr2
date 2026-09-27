import { NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import { connectDB } from "@/lib/db";
import { Course } from "@/features/academy/models";
import { listCourseSummaries } from "@/features/academy/server/course-enrollments";

/**
 * GET /api/course-enrollments/summary — the public course catalogue.
 *
 * Only launched courses are returned, and only the fields a visitor needs to
 * decide: name, level, tagline, duration, fee, free-class count, what it
 * covers, and how many seats are left.
 *
 * The tail also carries how many courses have been finished, so the academy
 * page can say "N courses completed so far" — the number of batches a student
 * has actually been through is the strongest thing on the page to show a
 * newcomer, and it can only come from the courses marked complete.
 */
export async function GET() {
  try {
    const courses = await listCourseSummaries(false);
    await connectDB();
    const completed = await Course.countDocuments({ completed: true });
    return NextResponse.json({ success: true, courses, completedCourses: completed });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not load courses.") },
      { status: 500 },
    );
  }
}
