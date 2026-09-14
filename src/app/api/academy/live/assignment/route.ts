import { NextResponse } from "next/server";
import { submitAssignment } from "@/features/academy/server/live";

// POST /api/academy/live/assignment — public, roll-based. Students paste a
// written answer or a Google Doc/Drive link for the active (or just-ended) class.
export async function POST(req: Request) {
  try {
    const { liveClassId, rollNumber, content } = await req.json();

    if (!liveClassId || !rollNumber || !content || !String(content).trim()) {
      return NextResponse.json(
        { error: "liveClassId, rollNumber and content are required." },
        { status: 400 },
      );
    }
    const roll = Number(rollNumber);
    if (!Number.isFinite(roll) || roll <= 0) {
      return NextResponse.json({ error: "Invalid roll number." }, { status: 400 });
    }

    const session = await submitAssignment(liveClassId, roll, String(content).trim());
    return NextResponse.json(
      {
        success: true,
        duplicate: (session.submissions ?? []).filter((s) => s.rollNumber === roll).length > 1,
        message: "Assignment submitted.",
        session,
      },
      { status: 200 },
    );
  } catch (error: any) {
    return NextResponse.json({ error: error.message || "Submit failed" }, { status: 400 });
  }
}
