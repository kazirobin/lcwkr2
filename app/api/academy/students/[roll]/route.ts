import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Student } from "@/models/Student";
import { Course } from "@/models/Course";

export async function GET(req: Request, { params }: { params: { roll: string } }) {
  try {
    await connectDB();
    const rollNum = Number(params.roll);
    const student = await Student.findOne({ rollNumber: rollNum });

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    const courses = await Course.find({ courseId: student.enrolledCourseId });
    return NextResponse.json({ success: true, student, courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}