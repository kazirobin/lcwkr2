import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/features/academy/models";

export async function POST(req: Request) {
  try {
    const { courseId, classId, adminPasscode } = await req.json();

    const expectedPasscode = process.env.ADMIN_PASSCODE || process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";
    if (adminPasscode !== expectedPasscode) {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }

    await connectDB();

    const course = await Course.findOne({ courseId });
    if (!course) {
      return NextResponse.json({ success: false, message: "Course not found" }, { status: 404 });
    }

    // ১. টার্গেট ক্লাস ফিল্টার করে মুছে ফেলা
    const remainingClasses = course.classes.filter((cls: any) => cls.classId !== classId);

    // ২. 👈 স্বয়ংক্রিয় সিরিয়াল রিনাম্বার (Re-index auto prefix)
    // ফরম্যাট: CLS-HSK101-01, CLS-HSK101-02, CLS-HSK101-03 ...
    const reindexedClasses = remainingClasses.map((cls: any, index: number) => {
      const cleanCourseCode = courseId.replace(/[^a-zA-Z0-9]/g, "");
      const newIndex = String(index + 1).padStart(2, "0");
      const newClassId = `CLS-${cleanCourseCode}-${newIndex}`;

      return {
        ...cls.toObject?.() || cls,
        classId: newClassId,
      };
    });

    course.classes = reindexedClasses;
    course.completedClassesCount = reindexedClasses.length;
    await course.save();

    return NextResponse.json({
      success: true,
      message: `Class session deleted. Subsequent classes re-indexed to fill the sequence.`,
      classes: reindexedClasses,
      completedClassesCount: reindexedClasses.length,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}