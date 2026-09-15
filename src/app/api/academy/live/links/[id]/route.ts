import { NextRequest, NextResponse } from "next/server";
import { updateLiveLink, deleteLiveLink } from "@/features/academy/server/live";

type Props = { params: Promise<{ id: string }> };

/** PUT /api/academy/live/links/[id] — admin edits a saved Meet link. */
export async function PUT(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const { adminPasscode, label, meetLink, topic } = await req.json();
    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }
    const link = await updateLiveLink(id, { label, meetLink, topic });
    return NextResponse.json({ success: true, link });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update link";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/** DELETE /api/academy/live/links/[id] — admin removes a saved Meet link. */
export async function DELETE(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const { adminPasscode } = await req.json();
    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }
    await deleteLiveLink(id);
    return NextResponse.json({ success: true, message: "Link deleted." });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete link";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
