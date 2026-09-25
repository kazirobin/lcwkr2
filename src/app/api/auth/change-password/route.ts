import { NextResponse } from "next/server";
import { changeStudentPassword } from "@/features/academy/server/student-auth";

// POST /api/auth/change-password { phone, currentPassword, newPassword }.
export async function POST(req: Request) {
  try {
    const { phone, currentPassword, newPassword } = await req.json().catch(() => ({}));
    const result = await changeStudentPassword(
      String(phone ?? ""),
      String(currentPassword ?? ""),
      String(newPassword ?? ""),
    );
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 400 });
    }
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
