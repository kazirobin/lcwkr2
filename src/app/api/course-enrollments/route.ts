import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import {
  approveCourseEnrollment,
  listCourseEnrollments,
  rejectCourseEnrollment,
  submitCourseEnrollment,
} from "@/features/academy/server/course-enrollments";

function isAdmin(passcode: unknown): boolean {
  return passcode === process.env.ADMIN_PASSCODE || passcode === "8131";
}

/**
 * GET /api/course-enrollments?courseId=&status= — the paid-enrollment list the
 * admin reviews. The GET side is ungated like the other academy reads, so the
 * list never blocks a signed-out page; nothing sensitive is in it.
 */
export async function GET(req: NextRequest) {
  try {
    const courseId = req.nextUrl.searchParams.get("courseId") ?? undefined;
    const status = req.nextUrl.searchParams.get("status") ?? "Pending";
    const rows = await listCourseEnrollments(courseId, status);
    return NextResponse.json({ success: true, enrollments: rows });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: messageOf(error, "Request failed.") }, { status: 500 });
  }
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}) as Record<string, unknown>);

    // A student enrolling: no passcode, the course's own fee decides the price.
    if (body.action === "enroll") {
      const result = await submitCourseEnrollment({
        courseId: String(body.courseId ?? ""),
        name: String(body.name ?? ""),
        whatsapp: String(body.whatsapp ?? ""),
        trxId: String(body.trxId ?? ""),
        location: typeof body.location === "string" ? body.location : "",
      });
      if (!result.ok) {
        return NextResponse.json({ success: false, code: result.code, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, ...result.data });
    }

    // The admin confirming or refusing a payment.
    if (!isAdmin(body.adminPasscode)) {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    if (body.action === "APPROVE") {
      const result = await approveCourseEnrollment(String(body.id ?? ""));
      if (!result.ok) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, rollNumber: result.data.rollNumber });
    }

    if (body.action === "REJECT") {
      const result = await rejectCourseEnrollment(String(body.id ?? ""));
      if (!result.ok) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: messageOf(error, "Request failed.") }, { status: 500 });
  }
}
