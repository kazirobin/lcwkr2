import { NextResponse } from "next/server";
import {
  getAllHanziProSessions,
  openHanziProSession,
  submitHanziProEntry,
  submitHanziProEntries,
  closeHanziProSession,
  reopenHanziProSession,
  updateHanziProSessionEntry,
  removeHanziProSessionEntry,
  deleteHanziProSession,
} from "@/features/hanzi-pro/server/students";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "8131";

function authorized(adminPasscode: unknown) {
  return adminPasscode === ADMIN_PASSCODE || adminPasscode === "8131";
}

/** GET /api/hanzi-pro/sessions — public: open session + full history. */
export async function GET() {
  try {
    const sessions = await getAllHanziProSessions();
    return NextResponse.json({ success: true, sessions }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch sessions";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * POST /api/hanzi-pro/sessions — action-based endpoint.
 *   open          (admin)  { date }
 *   submit        (public) { sessionId, studentId, learnedCount }  — only while open
 *   close         (admin)  { sessionId }  — merges entries into students
 *   reopen        (admin)  { sessionId }
 *   update-entry  (admin)  { sessionId, studentId, learnedCount }
 *   remove-entry  (admin)  { sessionId, studentId }
 *   delete        (admin)  { sessionId }
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { action } = body;

    if (action === "submit") {
      const { sessionId, studentId, learnedCount } = body;
      if (!sessionId || !studentId) {
        return NextResponse.json({ error: "sessionId and studentId are required." }, { status: 400 });
      }
      const session = await submitHanziProEntry(sessionId, String(studentId), Number(learnedCount) || 0);
      return NextResponse.json({ success: true, session }, { status: 200 });
    }

    if (action === "submit-many") {
      const { sessionId, entries } = body;
      if (!sessionId || !Array.isArray(entries)) {
        return NextResponse.json({ error: "sessionId and entries are required." }, { status: 400 });
      }
      const session = await submitHanziProEntries(
        sessionId,
        entries.map((e: { studentId?: unknown; learnedCount?: unknown }) => ({
          studentId: String(e.studentId ?? ""),
          learnedCount: Number(e.learnedCount) || 0,
        })),
      );
      return NextResponse.json({ success: true, session, saved: session.saved }, { status: 200 });
    }

    if (!authorized(body.adminPasscode)) {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    switch (action) {
      case "open": {
        const session = await openHanziProSession(body.date || new Date().toISOString().slice(0, 10));
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "close": {
        const session = await closeHanziProSession(body.sessionId);
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "reopen": {
        const session = await reopenHanziProSession(body.sessionId);
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "update-entry": {
        const session = await updateHanziProSessionEntry(
          body.sessionId,
          String(body.studentId),
          Number(body.learnedCount) || 0,
        );
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "remove-entry": {
        const session = await removeHanziProSessionEntry(body.sessionId, String(body.studentId));
        return NextResponse.json({ success: true, session }, { status: 200 });
      }
      case "delete": {
        await deleteHanziProSession(body.sessionId);
        return NextResponse.json({ success: true, message: "Session deleted." }, { status: 200 });
      }
      default:
        return NextResponse.json({ error: "Unknown action." }, { status: 400 });
    }
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Action failed";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
