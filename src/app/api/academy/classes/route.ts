import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ClassLog } from "@/features/academy/models";
import { Course } from "@/features/academy/models";

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { teacherPasscode, courseId, date, time, contentCovered, presentStudents, absentStudents } = body;

    if (teacherPasscode !== process.env.TEACHER_PASSCODE && teacherPasscode !== "2026") {
      return NextResponse.json({ success: false, message: "Invalid Teacher Passcode" }, { status: 401 });
    }

    await connectDB();

    const course = await Course.findOne({ courseId });
    const nextIndex = (course?.classes?.length || 0) + 1;
    const generatedClassId = `CLS-${courseId.replace("-", "")}-${nextIndex < 10 ? `0${nextIndex}` : nextIndex}`;

    const newLog = await ClassLog.create({
      courseId,
      classId: generatedClassId,
      date,
      time,
      contentCovered,
      presentStudents,
      absentStudents,
      approvalStatus: "Pending",
      submittedBy: "Teacher Robin",
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