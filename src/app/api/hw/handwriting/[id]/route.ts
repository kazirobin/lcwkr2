import { NextResponse } from "next/server";
import {
  archiveHandwritingSubmission,
  deleteOwnHandwriting,
  markHandwritingSubmission,
} from "@/features/academy/server/handwriting";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "8131";

type Props = { params: Promise<{ id: string }> };

// PATCH /api/hw/handwriting/:id → admin marks (body: { mark, feedback, adminPasscode }).
export async function PATCH(req: Request, props: Props) {
  try {
    const { id } = await props.params;
    const { mark, feedback, adminPasscode } = await req.json();
    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== ADMIN_PASSCODE) {
      return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
    }
    const submission = await markHandwritingSubmission(id, { mark, feedback });
    return NextResponse.json({ success: true, submission });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}

// DELETE /api/hw/handwriting/:id → admin archives from THEIR queue
// (body: { adminPasscode }) — photo, mark & comment stay with the student;
// or the submitter removes their own (body: { phone } must match).
export async function DELETE(req: Request, props: Props) {
  try {
    const { id } = await props.params;
    const { adminPasscode, phone } = await req.json().catch(() => ({}));
    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== ADMIN_PASSCODE) {
      if (!phone) {
        return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
      }
      await deleteOwnHandwriting(id, String(phone));
      return NextResponse.json({ success: true });
    }
    await archiveHandwritingSubmission(id);
    return NextResponse.json({ success: true, archived: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    const status = /Forbidden/i.test(message) ? 403 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
