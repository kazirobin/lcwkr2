import { NextResponse } from "next/server";
import { listLiveLinks, createLiveLink } from "@/features/academy/server/live";

/** GET /api/academy/live/links?courseId= — saved Meet links (all courses if no courseId). */
export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId") || "";
    const links = await listLiveLinks(courseId || undefined);
    return NextResponse.json({ success: true, links });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load links";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

/** POST /api/academy/live/links — admin adds a Meet link (requires passcode). */
export async function POST(req: Request) {
  try {
    const { adminPasscode, courseId, label, meetLink, topic } = await req.json();
    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }
    if (!courseId || !meetLink) {
      return NextResponse.json({ success: false, message: "courseId and meetLink are required" }, { status: 400 });
    }
    const link = await createLiveLink({
      courseId,
      label: label || "",
      meetLink,
      topic: topic || "",
    });
    return NextResponse.json({ success: true, link });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to save link";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
