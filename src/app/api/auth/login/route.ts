import { NextResponse } from "next/server";
import { verifyStudentLogin } from "@/features/academy/server/student-auth";
import { recordLogin } from "@/features/analytics/server/traffic";
import { startSession } from "@/features/analytics/server/sessions";

// POST /api/auth/login { phone, password } — approved students only.
export async function POST(req: Request) {
  try {
    const { phone, password } = await req.json().catch(() => ({}));
    const result = await verifyStudentLogin(String(phone ?? ""), String(password ?? ""));
    if (!result.ok) {
      return NextResponse.json({ success: false, error: result.error }, { status: 401 });
    }

    // Bookkeeping for the admin analytics. Both calls swallow their own
    // errors, so a database hiccup here can never block a real sign-in.
    await recordLogin();
    await startSession({
      whatsapp: result.student.whatsapp,
      rollNumber: result.student.rollNumber,
      name: result.student.nameEnglish,
      userAgent: req.headers.get("user-agent") ?? "",
    });

    return NextResponse.json({ success: true, student: result.student });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
