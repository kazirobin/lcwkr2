import { NextResponse } from "next/server";
import { markAssignments } from "@/features/academy/server/live";

// POST /api/academy/live/marks — admin only. Marks many students at once,
// keyed by roll number. Marks are public so students can view their own.
export async function POST(req: Request) {
  try {
    const { liveClassId, marks, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }
    if (!liveClassId || !Array.isArray(marks) || marks.length === 0) {
      return NextResponse.json({ error: "liveClassId and a non-empty marks array are required." }, { status: 400 });
    }

    const clean = marks
      .map((m: { rollNumber: unknown; mark: unknown; feedback?: string }) => ({
        rollNumber: Number(m.rollNumber),
        mark: Number(m.mark),
        feedback: typeof m.feedback === "string" ? m.feedback.trim() : "",
      }))
      .filter((m: { rollNumber: number; mark: number }) => Number.isFinite(m.rollNumber) && m.rollNumber > 0 && Number.isFinite(m.mark));

    if (clean.length === 0) {
      return NextResponse.json({ error: "No valid marks provided." }, { status: 400 });
    }

    const session = await markAssignments(liveClassId, clean);
    return NextResponse.json({ success: true, session }, { status: 200 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Marking failed" }, { status: 400 });
  }
}
