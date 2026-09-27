import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import { endSessions } from "@/features/analytics/server/sessions";

/**
 * POST /api/auth/logout { phone } — closes the student's open analytics
 * session so the admin can see a real sign-out time instead of a session that
 * never ended.
 */
export async function POST(req: NextRequest) {
  try {
    const { phone } = await req.json().catch(() => ({}) as { phone?: string });
    if (phone) await endSessions(String(phone));
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: messageOf(error, "Request failed.") }, { status: 500 });
  }
}
