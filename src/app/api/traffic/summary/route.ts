import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import { trafficSummary } from "@/features/analytics/server/traffic";

/**
 * GET /api/traffic/summary — daily traffic for the home-page dashboard.
 *
 * Deliberately open: the site owner wants these numbers public as a sign of
 * life. Only rolled-up totals are returned, never anything about a person.
 */
export async function GET(req: NextRequest) {
  try {
    const raw = Number(req.nextUrl.searchParams.get("days") ?? 14);
    const days = Number.isFinite(raw) ? Math.min(60, Math.max(1, Math.round(raw))) : 14;
    const summary = await trafficSummary(days);
    return NextResponse.json({ success: true, ...summary });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: messageOf(error, "Request failed.") }, { status: 500 });
  }
}
