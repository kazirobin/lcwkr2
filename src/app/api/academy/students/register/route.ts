import { NextResponse } from "next/server";
import { registerStudent } from "@/features/academy/server/students";

export async function POST(req: Request) {
  try {
    const { nameEnglish, whatsapp, location, avatarUrl, enrolledCourseId } = await req.json();

    if (!nameEnglish || !whatsapp || !enrolledCourseId) {
      return NextResponse.json({ success: false, message: "Missing required fields" }, { status: 400 });
    }

    const result = await registerStudent({
      nameEnglish,
      whatsapp,
      location,
      avatarUrl,
      enrolledCourseId,
    });

    if (result.kind === "course-not-open") {
      return NextResponse.json(
        {
          success: false,
          message: "Registration is only open for upcoming (Coming Soon) courses.",
          nextBatchDate: result.nextBatchDate,
        },
        { status: 403 }
      );
    }

    return NextResponse.json({
      success: true,
      message: "Application submitted successfully and is pending admin approval.",
      student: result.student,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
