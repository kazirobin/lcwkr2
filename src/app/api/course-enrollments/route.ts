import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import { adminPasscode, canSeeContact } from "@/lib/admin-guard";
import {
  approveCourseEnrollment,
  deleteCourseEnrollment,
  enrollStudentDirectly,
  listCourseEnrollments,
  rejectCourseEnrollment,
  submitCourseEnrollment,
} from "@/features/academy/server/course-enrollments";

function isAdmin(passcode: unknown): boolean {
  return passcode === adminPasscode();
}

/**
 * GET /api/course-enrollments?courseId=&status= — the paid-enrollment list the
 * admin reviews.
 *
 * This was left ungated on the grounds that it held "nothing sensitive". It
 * does: every row is a person's name, WhatsApp number, bKash TrxID and amount,
 * so an unauthenticated caller could read the whole payment ledger of the
 * academy — including customers who never appear anywhere else. The public
 * pages do not use this; the catalogue reads `/summary` instead, and the public
 * "join" form only POSTs. So gating it costs the site nothing.
 *
 * Sub-admin passcodes are accepted too, since a sub-admin reviewing a roster is
 * exactly the intended reader.
 */
export async function GET(req: NextRequest) {
  try {
    if (!canSeeContact(req, req.nextUrl)) {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }
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

    // The admin adding a student who is already registered — no payment step.
    if (body.action === "ADD_STUDENT") {
      const result = await enrollStudentDirectly({
        courseId: String(body.courseId ?? ""),
        rollNumber: Number(body.rollNumber),
        note: typeof body.note === "string" ? body.note : "",
      });
      if (!result.ok) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, ...result.data });
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

    // Removing a row altogether — for a wrong entry or a duplicate payment.
    if (body.action === "DELETE") {
      const result = await deleteCourseEnrollment(
        String(body.id ?? ""),
        body.alsoRemoveFromStudent === true,
      );
      if (!result.ok) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, ...result.data });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: messageOf(error, "Request failed.") }, { status: 500 });
  }
}
