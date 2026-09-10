import { NextResponse } from "next/server";
import { listCourses, createCourse } from "@/features/academy/server/courses";

/**
 * GET /api/academy/courses
 * Returns every course. Classes with a duplicated `classId` (e.g. legacy
 * rows created twice by the add-class flow) are collapsed to the first
 * occurrence so consumers never render duplicate React keys.
 */
export async function GET() {
  try {
    const courses = await listCourses();
    const deduped = courses.map((course: { classes?: { classId: string }[] }) => {
      if (!Array.isArray(course.classes) || course.classes.length === 0) return course;
      const seen = new Set<string>();
      course.classes = course.classes.filter((cls) => {
        const id = String(cls.classId ?? "");
        if (!id || seen.has(id)) return false;
        seen.add(id);
        return true;
      });
      return course;
    });
    return NextResponse.json({ success: true, courses: deduped });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const course = await createCourse(body);
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
