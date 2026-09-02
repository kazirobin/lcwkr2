import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/features/academy/models/Course";

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

    await connectDB();

    // 👈 রোল নম্বরগুলোকে সুসংগত স্ট্রিং ফরম্যাটে কনভার্ট করা
    const cleanPresent = (presentStudents || []).map((r: any) => String(r).trim());
    const cleanAbsent = (absentStudents || []).map((r: any) => String(r).trim());

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    // ক্লাস খুঁজে আপডেট করা
    const targetClass = course.classes.find((cls: any) => cls.classId === classId);
    if (!targetClass) {
      return NextResponse.json({ success: false, message: "Class session not found" }, { status: 404 });
    }

    targetClass.date = date;
    targetClass.time = time;
    targetClass.contentCovered = contentCovered;
    targetClass.presentStudents = cleanPresent;
    targetClass.absentStudents = cleanAbsent;

    course.markModified("classes");
    await course.save();

    return NextResponse.json({
      success: true,
      message: "Class attendance updated live in MongoDB",
      course,
    });
  } catch (error: any) {
    console.error("Class edit API error:", error);
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}