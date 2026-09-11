import { NextResponse } from "next/server";
import { setStudentCourses } from "@/features/academy/server/students";

/**
 * POST /api/academy/students/change-course — admin.
 * { rollNumber, courseIds: string[], adminPasscode }
 * Sets the student's full enrollment list — supports MULTIPLE courses.
 */
export async function POST(req: Request) {
  try {
    const { rollNumber, courseIds, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }
    if (!rollNumber || !Array.isArray(courseIds) || courseIds.length === 0) {
      return NextResponse.json(
        { success: false, message: "rollNumber and at least one course are required." },
        { status: 400 },
      );
    }

    const student = await setStudentCourses(rollNumber, courseIds);
    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({ success: true, student });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update enrollment";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
