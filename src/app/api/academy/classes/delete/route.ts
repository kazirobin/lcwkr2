import { NextResponse } from "next/server";
import { deleteClass } from "@/features/academy/server/classes";

export async function POST(req: Request) {
  try {
    const { courseId, classId, adminPasscode } = await req.json();

    const expectedPasscode = process.env.ADMIN_PASSCODE || process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";
    if (adminPasscode !== expectedPasscode) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }

    const result = await deleteClass(courseId, classId);

    if (result.kind === "course-not-found") {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Class session deleted. Subsequent classes re-indexed to fill the sequence.`,
      classes: result.classes,
      completedClassesCount: result.completedClassesCount,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
