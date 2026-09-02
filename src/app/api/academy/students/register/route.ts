import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Student } from "@/features/academy/models";
import { Course } from "@/features/academy/models";

export async function POST(req: Request) {
  try {
    const { nameEnglish, whatsapp, location, avatarUrl, enrolledCourseId } = await req.json();

    if (!nameEnglish || !whatsapp || !enrolledCourseId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    await connectDB();

    // ভ্যালিডেশন: কোর্সটি কি Coming Soon আছে কিনা
    const targetCourse = await Course.findOne({ courseId: enrolledCourseId });
    if (!targetCourse || targetCourse.status !== "Coming Soon") {
      return NextResponse.json(
        {
          success: false,
          message: "Registration is only open for upcoming (Coming Soon) courses.",
          nextBatchDate: targetCourse?.nextBatchRegistrationDate || "TBA",
        },
        { status: 403 }
      );
    }

    // বিজনেস রুল: একই WhatsApp নম্বর আগে থাকলে পূর্বের ডাটা মুছে নতুন আবেদন প্রতিস্থাপন
    await Student.deleteMany({ whatsapp });

    // নতুন রোল নম্বর নির্ধারণ
    const maxRollStudent = await Student.findOne({}).sort({ rollNumber: -1 });
    const nextRoll = maxRollStudent ? maxRollStudent.rollNumber + 1 : 1;

    const newStudent = await Student.create({
      rollNumber: nextRoll,
      nameEnglish,
      whatsapp,
      isWhatsAppGroupJoined: false,
      location: location || "Dhaka, Bangladesh",
      avatarUrl: avatarUrl || `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(nameEnglish)}`,
      enrolledCourseId,
      registrationStatus: "Pending",
    });

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully and is pending admin approval.",
      student: newStudent,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}