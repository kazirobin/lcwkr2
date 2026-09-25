import { NextResponse } from "next/server";
import {
  appendHandwritingImages,
  removeOwnHandwritingImage,
} from "@/features/academy/server/handwriting";

type Props = { params: Promise<{ id: string }> };

// POST /api/hw/handwriting/:id/photos → student adds more photos to their
// OWN lesson submission (body: { phone, images: [{ url, publicId }] }).
export async function POST(req: Request, props: Props) {
  try {
    const { id } = await props.params;
    const { phone, images } = await req.json();
    const submission = await appendHandwritingImages(id, String(phone ?? ""), images);
    return NextResponse.json({ success: true, submission });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    const status = /Forbidden/i.test(message) ? 403 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}

// DELETE /api/hw/handwriting/:id/photos?index=0 → student drops ONE photo
// from their own submission (body/query: { phone, index }). Removing the last
// photo removes the whole submission.
export async function DELETE(req: Request, props: Props) {
  try {
    const { id } = await props.params;
    const { phone } = await req.json().catch(() => ({}));
    const index = new URL(req.url).searchParams.get("index");
    const result = await removeOwnHandwritingImage(id, String(phone ?? ""), Number(index));
    if (result.deleted) return NextResponse.json({ success: true, deleted: true });
    return NextResponse.json({ success: true, submission: result.submission });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    const status = /Forbidden/i.test(message) ? 403 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
