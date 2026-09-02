import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Student } from "@/features/academy/models/Student";
import { Course } from "@/features/academy/models/Course";

type Props = {
  params: Promise<{ roll: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  try {
    const { roll } = await props.params;
    await connectDB();

    const rollNum = Number(roll);
    const student = await Student.findOne({ rollNumber: rollNum });

    if (!student) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    const courses = await Course.find({ courseId: student.enrolledCourseId });
    return NextResponse.json({ success: true, student, courses });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}