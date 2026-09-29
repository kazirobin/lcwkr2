import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import {
  deleteTrial,
  endTrial,
  listProTrials,
  noteTrialUse,
  peekTrial,
  renewTrial,
  requestTrial,
} from "@/features/analytics/server/pro-trials";

/**
 * POST /api/pro/trial — the ten-minute Pro preview.
 *
 * Two audiences, one route, following the shape /api/pro/subscriptions uses:
 *
 *  - No `action`: the public path. `CHECK` asks whether this browser already has
 *    a window; `START` opens one once the visitor has given a name, a WhatsApp
 *    number and a location. That is what puts a real person on the admin's list
 *    instead of an anonymous row nobody can act on.
 *  - With `action` plus `adminPasscode`: LIST, RENEW, END, DELETE or USE, which
 *    is the /admin/pro-trials page.
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
    const visitorId = typeof body.visitorId === "string" ? body.visitorId.slice(0, 64) : "";

    // ---- public: is there a window to count down? -------------------------
    if (action === "CHECK") {
      return NextResponse.json({ success: true, trial: await peekTrial(visitorId) });
    }

    // ---- public: open one, given who is asking ----------------------------
    if (action === "START") {
      const result = await requestTrial({
        visitorId,
        name: typeof body.name === "string" ? body.name : "",
        whatsapp: typeof body.whatsapp === "string" ? body.whatsapp : "",
        location: typeof body.location === "string" ? body.location : "",
        rollNumber: typeof body.rollNumber === "number" ? body.rollNumber : null,
      });
      if (!result.ok) {
        return NextResponse.json(
          { success: false, code: result.code, message: result.message, trial: result.trial ?? null },
          { status: result.code === "no-id" ? 400 : 422 },
        );
      }
      return NextResponse.json({ success: true, trial: result.trial });
    }

    // Records preview time actually spent. Deliberately open, and deliberately
    // before the passcode check: this is a counter for a row the caller already
    // has a handle to, and it carries no more than the visitor id the browser
    // keeps anyway. Making it wait for an admin PIN would mean the browser could
    // never report its own time.
    if (action === "USE") {
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

    // Removes the row rather than just stopping the clock, for a duplicate or a
    // name and number somebody would rather not keep on file.
    if (action === "DELETE") {
      const gone = await deleteTrial(String(body.trialId ?? ""));
      if (!gone) {
        return NextResponse.json({ success: false, message: "Trial not found." }, { status: 404 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, message: messageOf(error, "Request failed.") },
      { status: 500 },
    );
  }
}
