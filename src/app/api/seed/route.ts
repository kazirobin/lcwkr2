import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/features/academy/models";
import { Student } from "@/features/academy/models";
import { academyData } from "@/features/academy/data";

export async function GET() {
  try {
    await connectDB();

    // পূর্বের ডাটা সিঙ্ক
    await Course.deleteMany({});
    await Student.deleteMany({});

    for (const c of academyData.courses) {
      await Course.create(c);
    }

    for (const s of academyData.students) {
      await Student.create({
        ...s,
        enrolledCourseId: s.enrolledCourseIds[0] || "HSK-101",
        registrationStatus: "Approved",
      });
    }

    return NextResponse.json({
      success: true,
      message: "Database seeded with static data successfully!",
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}