import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import { courseBroadcastText } from "@/features/academy/server/courses";

/**
 * GET /api/academy/courses/[id]/broadcast — the WhatsApp message for a course
 * launch, pre-written so the admin can copy it into a group instead of typing
 * the details out again.
 */
export async function GET(
  _req: NextRequest,
  props: { params: Promise<{ id: string }> },
) {
  try {
    const { id } = await props.params;
    const text = await courseBroadcastText(id);
    if (!text) {
      return NextResponse.json({ success: false, error: "Course not found" }, { status: 404 });
    }
    return NextResponse.json({ success: true, text });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not build the message.") },
      { status: 500 },
    );
  }
}
