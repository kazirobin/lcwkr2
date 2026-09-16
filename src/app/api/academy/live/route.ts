import { NextResponse } from "next/server";
import {
  listLiveClasses,
  openLiveClass,
  closeLiveClass,
  closeLiveClassAndMerge,
  deleteLiveClass,
  setLiveMeta,
  ensureLiveLink,
} from "@/features/academy/server/live";
import { isSubAdminPasscode } from "@/features/academy/subAdminPasswords";

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
    const { action, courseId, meetLink, date, time, id, adminPasscode, contentCovered, topic, assignmentPrompt, newMeetLink, presentStudents, absentStudents } = await req.json();

    // Full admin (course/lesson edits, deleting logs, etc.) — main PIN only.
    const isAdmin =
      adminPasscode === process.env.ADMIN_PASSCODE ||
      adminPasscode === "8131";
    // Sub-admins (teachers/assistants) may only start a class and submit it.
    const isLiveManager = isAdmin || isSubAdminPasscode(adminPasscode ?? "");

    switch (action) {
      case "open": {
        if (!isLiveManager) {
          return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
        }
        if (!courseId || !meetLink) {
          return NextResponse.json({ error: "courseId and meetLink are required." }, { status: 400 });
        }
        const session = await openLiveClass(
          courseId,
          meetLink,
          date || new Date().toISOString().slice(0, 10),
          time,
          topic,
          assignmentPrompt,
        );
        // persist the meet link so the admin can reuse / edit / delete it later
        await ensureLiveLink(courseId, meetLink, topic);
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "set-meta": {
        if (!isAdmin) {
          return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
        }
        if (!id) {
          return NextResponse.json({ error: "id is required." }, { status: 400 });
        }
        const session = await setLiveMeta(id, {
          meetLink: newMeetLink,
          topic,
          assignmentPrompt,
        });
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "close": {
        if (!isAdmin) {
          return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
        }
        const session = await closeLiveClass(id);
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "close-merge": {
        if (!isLiveManager) {
          return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
        }
        const session = await closeLiveClassAndMerge(id, {
          date: contentCovered?.date,
          time: contentCovered?.time,
          topic: contentCovered?.topic,
          summary: contentCovered?.summary,
          fromLesson: contentCovered?.fromLesson,
          fromText: contentCovered?.fromText,
          toLesson: contentCovered?.toLesson,
          toText: contentCovered?.toText,
          presentStudents,
          absentStudents,
        });
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "delete": {
        if (!isAdmin) {
          return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
        }
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
