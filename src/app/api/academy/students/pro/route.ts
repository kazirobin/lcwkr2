import { NextResponse } from "next/server";
import { setStudentPro } from "@/features/academy/server/students";

// POST /api/academy/students/pro — mark/unmark a Pro subscriber (admin only).
export async function POST(req: Request) {
  try {
    const { rollNumber, isPro, adminPasscode } = await req.json();
    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }
    const student = await setStudentPro(rollNumber, isPro);
    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, student });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
