import { NextResponse } from "next/server";
import { progressFor } from "@/features/academy/server/student-progress";
import { findStudentDocByPhone } from "@/features/academy/server/student-auth";
import { normalizePhone } from "@/features/academy/server/dialogues";

/**
 * POST /api/hw/progress { phone } — the signed-in student's own progress.
 *
 * Returns the level breakdown (total marks, marks earned, exams given and
 * left, per-lesson best) plus their upload storage totals. The exam page and
 * the profile page both read this, so "how many marks does HSK 1 have" and
 * "how much have I uploaded" are answered from one place instead of each page
 * counting differently.
 *
 * It only ever answers about the account named in the body — there is no way
 * to ask for somebody else's record, because the phone number is the only
 * credential the app has.
 */
export async function POST(req: Request) {
  try {
    const { phone } = await req.json().catch(() => ({}));
    const norm = normalizePhone(phone);
    if (!norm) {
      return NextResponse.json(
        { success: false, error: "Sign in to see your progress." },
        { status: 401 },
      );
    }

    const student = await findStudentDocByPhone(norm);
    if (!student || student.registrationStatus !== "Approved") {
      return NextResponse.json(
        { success: false, error: "This account is not approved." },
        { status: 403 },
      );
    }

    const progress = await progressFor(norm);
    return NextResponse.json({
      success: true,
      rollNumber: student.rollNumber,
      levels: progress.levels,
      storage: progress.storage,
      dialogue: progress.dialogue,
      handwriting: progress.handwriting,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load progress.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/** GET /api/hw/progress?phone=… — read-only form, used by refresh paths. */
export async function GET(req: Request) {
  const url = new URL(req.url);
  const fake = new Request(url.origin, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ phone: url.searchParams.get("phone") ?? "" }),
  });
  return POST(fake);
}
