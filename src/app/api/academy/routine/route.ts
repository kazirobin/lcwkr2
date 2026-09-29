import { NextResponse } from "next/server";
import { listLiveLinks } from "@/features/academy/server/live";
import { buildRoutine } from "@/features/academy/server/routine";

/**
 * GET /api/academy/routine — the public weekly timetable.
 *
 * Anyone may read it: the point is that a student can see when class is and
 * join it. Only links an admin has marked active are included, and a class is
 * only reported as running inside its own window in Dhaka time.
 */
export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    // `?at=` lets a caller (and a test) ask about a specific moment.
    const atParam = url.searchParams.get("at");
    const at = atParam ? new Date(atParam) : new Date();
    const links = await listLiveLinks();
    const routine = buildRoutine(links, Number.isNaN(at.getTime()) ? new Date() : at);
    return NextResponse.json({
      success: true,
      timezone: "Asia/Dhaka",
      at: at.toISOString(),
      ...routine,
    });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load routine.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}
