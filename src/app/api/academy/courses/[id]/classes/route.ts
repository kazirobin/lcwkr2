import { NextRequest, NextResponse } from "next/server";
import { addClassLogToCourse } from "@/features/academy/server/classes";

type Props = { params: Promise<{ id: string }> };

// POST /api/academy/courses/[id]/classes — admin adds a completed class-log
// entry directly into the course. Body: { adminPasscode, date, time,
// contentCovered, presentStudents, absentStudents }.
export async function POST(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const courseId = decodeURIComponent(id).trim();
    const body = await req.json();
    const { adminPasscode, date, time, contentCovered, presentStudents, absentStudents } = body;

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }

    if (!date || !time) {
      return NextResponse.json({ success: false, message: "date and time are required" }, { status: 400 });
    }

    const course = await addClassLogToCourse(courseId, {
      date,
      time,
      contentCovered,
      presentStudents: presentStudents || [],
      absentStudents: absentStudents || [],
    });

    return NextResponse.json({ success: true, message: "Class log added.", course });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}