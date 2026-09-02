import { NextResponse } from "next/server";
import { editClass } from "@/features/academy/server/classes";

export async function PUT(req: Request) {
  try {
    const body = await req.json();
    const {
      courseId,
      classId,
      date,
      time,
      contentCovered,
      presentStudents,
      absentStudents,
      adminPasscode,
    } = body;

    const expectedPasscode =
      process.env.ADMIN_PASSCODE ||
      process.env.NEXT_PUBLIC_ADMIN_PASSCODE ||
      "8131";

    if (adminPasscode !== expectedPasscode) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Admin PIN" },
        { status: 401 }
      );
    }

    const result = await editClass({
      courseId,
      classId,
      date,
      time,
      contentCovered,
      presentStudents,
      absentStudents,
    });

    if (result.kind === "course-not-found") {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    if (result.kind === "class-not-found") {
      return NextResponse.json({ success: false, message: "Class session not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: "Class attendance updated live in MongoDB",
      course: result.course,
    });
  } catch (error: any) {
    console.error("Class edit API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
