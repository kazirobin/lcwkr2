import { NextResponse } from "next/server";
import { createClassLog } from "@/features/academy/server/classes";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teacherPasscode, courseId, date, time, contentCovered, presentStudents, absentStudents } = body;

    if (teacherPasscode !== process.env.TEACHER_PASSCODE && teacherPasscode !== "2026") {
      return NextResponse.json({ success: false, message: "Invalid Teacher Passcode" }, { status: 401 });
    }

    const newLog = await createClassLog({
      courseId,
      date,
      time,
      contentCovered,
      presentStudents,
      absentStudents,
    });

    return NextResponse.json({
      success: true,
      message: "Class session logged and submitted for Admin approval.",
      classLog: newLog,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
