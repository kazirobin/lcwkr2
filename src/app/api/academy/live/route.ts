import { NextResponse } from "next/server";
import {
  listLiveClasses,
  openLiveClass,
  closeLiveClass,
  closeLiveClassAndMerge,
  deleteLiveClass,
} from "@/features/academy/server/live";

/** GET /api/academy/live — every live-class session (open ones first). */
export async function GET() {
  try {
    const sessions = await listLiveClasses();
    return NextResponse.json({ success: true, sessions }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch live classes";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/academy/live — admin actions (passcode required):
 *   open   { courseId, meetLink, date? }
 *   close  { id }
 *   close-merge { id, contentCovered? { date?, time?, fromLesson?, fromText?, toLesson?, toText? } }
 *   delete { id }
 */
export async function POST(req: Request) {
  try {
    const { action, courseId, meetLink, date, time, id, adminPasscode, contentCovered } = await req.json();

    if (
      adminPasscode !== process.env.ADMIN_PASSCODE &&
      adminPasscode !== "8131"
    ) {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    switch (action) {
      case "open": {
        if (!courseId || !meetLink) {
          return NextResponse.json({ error: "courseId and meetLink are required." }, { status: 400 });
        }
        const session = await openLiveClass(courseId, meetLink, date || new Date().toISOString().slice(0, 10), time);
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "close": {
        const session = await closeLiveClass(id);
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "close-merge": {
        const session = await closeLiveClassAndMerge(
          id,
          contentCovered && typeof contentCovered === "object"
            ? {
                date: contentCovered.date,
                time: contentCovered.time,
                fromLesson: contentCovered.fromLesson,
                fromText: contentCovered.fromText,
                toLesson: contentCovered.toLesson,
                toText: contentCovered.toText,
              }
            : undefined,
        );
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "delete": {
        await deleteLiveClass(id);
        return NextResponse.json({ success: true, message: "Deleted." }, { status: 200 });
      }
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Action failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
