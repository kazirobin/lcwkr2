import { NextResponse } from "next/server";
import { verifyStudentLogin } from "@/features/academy/server/student-auth";

// POST /api/auth/login { phone, password } — approved students only.
export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json().catch(() => ({}));
    const result = await verifyStudentLogin(String(phone ?? ""), String(password ?? ""));
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 });
    }
    return NextResponse.json({ success: true, student: result.student });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
