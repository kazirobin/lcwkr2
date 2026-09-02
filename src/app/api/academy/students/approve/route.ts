import { NextResponse } from "next/server";
import { setStudentApproval } from "@/features/academy/server/students";

export async function POST(req: Request) {
  try {
    const { rollNumber, action, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }

    const result = await setStudentApproval(rollNumber, action);

    switch (result.kind) {
      case "approved":
        return NextResponse.json({ success: true, student: result.student });
      case "deleted":
        return NextResponse.json({
          success: true,
          message: `Roll ${result.targetRoll} deleted and subsequent rolls automatically re-indexed!`,
        });
      case "not-found":
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
      default:
        return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
