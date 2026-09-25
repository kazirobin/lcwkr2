import { NextResponse } from "next/server";
import { deleteExamResult } from "@/features/academy/server/hw-exams";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "8131";

type Props = { params: Promise<{ id: string }> };

// DELETE /api/hw/exam-results/:id → admin removes a scoreboard entry.
export async function DELETE(req: Request, props: Props) {
  try {
    const { id } = await props.params;
    const { adminPasscode } = await req.json().catch(() => ({}));
    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== ADMIN_PASSCODE) {
      return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
    }
    await deleteExamResult(id);
    return NextResponse.json({ success: true });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 400 });
  }
}
