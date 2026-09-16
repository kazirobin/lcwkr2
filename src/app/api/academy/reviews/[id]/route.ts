import { NextResponse } from "next/server";
import { deleteReview, updateReview } from "@/features/academy/server/reviews";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "8131";

type Props = { params: Promise<{ id: string }> };

// PUT /api/academy/reviews/[id] — admin edits + approval toggle.
export async function PUT(req: Request, props: Props) {
  try {
    const { id } = await props.params;
    const { adminPasscode, name, mobile, location, message, rating, approved } = await req.json();
    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== ADMIN_PASSCODE) {
      return NextResponse.json({ success: false, error: "Unauthorized Admin PIN" }, { status: 401 });
    }
    const review = await updateReview(id, {
      ...(name !== undefined ? { name } : {}),
      ...(mobile !== undefined ? { mobile } : {}),
      ...(location !== undefined ? { location } : {}),
      ...(message !== undefined ? { message } : {}),
      ...(rating !== undefined ? { rating } : {}),
      ...(approved !== undefined ? { approved } : {}),
    });
    return NextResponse.json({ success: true, review });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}

// DELETE /api/academy/reviews/[id] — admin removal.
export async function DELETE(req: Request, props: Props) {
  try {
    const { id } = await props.params;
    const { adminPasscode } = await req.json();
    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== ADMIN_PASSCODE) {
      return NextResponse.json({ success: false, error: "Unauthorized Admin PIN" }, { status: 401 });
    }
    await deleteReview(id);
    return NextResponse.json({ success: true, message: "Deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}