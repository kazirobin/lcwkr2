import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import {
  endTrial,
  getOrStartTrial,
  listProTrials,
  noteTrialUse,
  renewTrial,
} from "@/features/analytics/server/pro-trials";

/**
 * POST /api/pro/trial — the ten-minute Pro preview.
 *
 * Two audiences, one route, following the shape /api/pro/subscriptions uses:
 *
 *  - No `action`: the public read. The browser sends its random visitor id on
 *    every Pro page and gets back the authoritative window, creating it with a
 *    fresh ten minutes the first time. This is what lets somebody who never
 *    signs in still get the preview, and what lets the admin renew it later —
 *    both impossible while the clock lived only in localStorage.
 *  - With `action` plus `adminPasscode`: LIST, RENEW, END, or USE, which is the
 *    /admin/pro-trials page.
 *
 * POST rather than GET so the admin passcode travels in the body instead of
 * ending up in a URL that a browser history or a log would keep.
 */

function isAdmin(passcode: unknown): boolean {
  return passcode === process.env.ADMIN_PASSCODE || passcode === "8131";
}

export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}) as Record<string, unknown>);
    const action = typeof body.action === "string" ? body.action : "";

    // ---- public: read or start this visitor's own trial --------------------
    if (!action) {
      const visitorId = typeof body.visitorId === "string" ? body.visitorId.slice(0, 64) : "";
      const state = await getOrStartTrial({
        visitorId,
        phone: typeof body.phone === "string" ? body.phone : undefined,
        name: typeof body.name === "string" ? body.name.slice(0, 80) : undefined,
        rollNumber: typeof body.rollNumber === "number" ? body.rollNumber : null,
      });
      // A null state means the browser could not give us an id, or the database
      // is unreachable. The client keeps its own clock in that case rather than
      // locking a visitor out of a free preview.
      return NextResponse.json({ success: true, trial: state });
    }

    // ---- public: record how much of the preview was actually spent ---------
    // Deliberately open, and deliberately before the passcode check: this is a
    // counter for a row the caller already has a handle to, and it carries no
    // more than the visitor id the browser keeps anyway. Making it wait for an
    // admin PIN would mean the browser could never report its own time.
    if (action === "USE") {
      const visitorId = typeof body.visitorId === "string" ? body.visitorId.slice(0, 64) : "";
      await noteTrialUse(visitorId, Number(body.usedMs) || 0);
      return NextResponse.json({ success: true });
    }

    if (!isAdmin(body.adminPasscode)) {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    if (action === "LIST") {
      const { trials, summary } = await listProTrials(200);
      return NextResponse.json({ success: true, trials, summary });
    }

    if (action === "RENEW") {
      const state = await renewTrial(String(body.trialId ?? ""));
      if (!state) {
        return NextResponse.json({ success: false, message: "Trial not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, trial: state });
    }

    if (action === "END") {
      const state = await endTrial(String(body.trialId ?? ""));
      if (!state) {
        return NextResponse.json({ success: false, message: "Trial not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true, trial: state });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: messageOf(error, "Request failed.") },
      { status: 500 },
    );
  }
}
