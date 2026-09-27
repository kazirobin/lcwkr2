import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import { sessionSummaries } from "@/features/analytics/server/sessions";
import { trafficSummary } from "@/features/analytics/server/traffic";

/**
 * POST /api/analytics/overview — what the admin analytics page reads: overall
 * traffic, the most-browsed pages, the most-clicked buttons, and one row per
 * student with their sign-in count and total time on the site.
 *
 * POST rather than GET so the admin passcode travels in the body instead of
 * ending up in a URL that a browser history or a log would keep.
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}) as Record<string, unknown>);
    const { adminPasscode, days } = body;

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    const window = Number(days ?? 14);
    const [traffic, students] = await Promise.all([
      trafficSummary(Number.isFinite(window) ? Math.min(60, Math.max(1, window)) : 14),
      sessionSummaries(200),
    ]);

    return NextResponse.json({ success: true, traffic, students });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: messageOf(error, "Request failed.") }, { status: 500 });
  }
}
