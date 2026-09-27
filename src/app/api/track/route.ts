import { NextResponse } from "next/server";
import { recordEvent } from "@/features/analytics/server/traffic";
import { noteActivity } from "@/features/analytics/server/sessions";

/**
 * POST /api/track — the single write endpoint for traffic.
 *
 * Called with sendBeacon from the tracker, so it has to stay cheap and it must
 * never answer with an error the page has to handle. Traffic is rolled up per
 * day rather than stored per view, and a signed-in student's activity is
 * attributed to their open session at the same time.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const kind = body?.kind === "click" ? "click" : "page";
    const label = typeof body?.label === "string" ? body.label.slice(0, 200) : "";
    if (!label) return NextResponse.json({ success: true });

    const visitorId = typeof body?.visitorId === "string" ? body.visitorId.slice(0, 64) : "";
    const phone = typeof body?.phone === "string" ? body.phone : "";

    await recordEvent({ kind, label, visitorId });

    if (phone) {
      await noteActivity(
        phone,
        kind,
        kind === "page" ? label.split("?")[0] : label,
      );
    }

    return NextResponse.json({ success: true });
  } catch {
    // A dropped beacon is never worth surfacing to the visitor.
    return NextResponse.json({ success: true });
  }
}
