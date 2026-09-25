import { NextResponse } from "next/server";
import { getPublicStudent } from "@/features/academy/server/student-auth";

// POST /api/auth/me { phone } — fresh profile (Pro/status changes reflect).
export async function POST(req: Request) {
  try {
    const { phone } = await req.json().catch(() => ({}));
    const result = await getPublicStudent(String(phone ?? ""));
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 404 });
    }
    return NextResponse.json({ success: true, student: result.student });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
