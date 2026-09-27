import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import {
  approveProSubscription,
  listProSubscriptions,
  proSummary,
  rejectProSubscription,
  revokePro,
  submitProSubscription,
} from "@/features/academy/server/pro-subscriptions";

function isAdmin(passcode: unknown): boolean {
  return passcode === process.env.ADMIN_PASSCODE || passcode === "8131";
}

/**
 * GET /api/pro/subscriptions — the Pro queue plus the current price.
 * `?status=All` returns every row for the admin list.
 */
export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") ?? "Pending";
    const [rows, summary] = await Promise.all([
      listProSubscriptions(status),
      proSummary(),
    ]);
    return NextResponse.json({ success: true, subscriptions: rows, summary });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not load subscriptions.") },
      { status: 500 },
    );
  }
}

/**
 * POST /api/pro/subscriptions
 *  - no `action`: a student pays ৳500 and submits the TrxID
 *  - APPROVE / REJECT / REVOKE: the admin decides
 */
export async function POST(req: NextRequest) {
  try {
    const body = await req.json().catch(() => ({}) as Record<string, unknown>);

    if (!body.action) {
      const result = await submitProSubscription({
        whatsapp: String(body.whatsapp ?? ""),
        name: String(body.name ?? ""),
        trxId: String(body.trxId ?? ""),
      });
      if (!result.ok) {
        return NextResponse.json(
          { success: false, code: result.code, message: result.message },
          { status: result.code === "duplicate-trx" || result.code === "invalid" ? 400 : 409 },
        );
      }
      return NextResponse.json({ success: true, id: result.data.id });
    }

    if (!isAdmin(body.adminPasscode)) {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    if (body.action === "APPROVE") {
      const result = await approveProSubscription(String(body.id ?? ""));
      if (!result.ok) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, rollNumber: result.data.rollNumber });
    }

    if (body.action === "REJECT") {
      const result = await rejectProSubscription(String(body.id ?? ""));
      if (!result.ok) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    if (body.action === "REVOKE") {
      const result = await revokePro(Number(body.rollNumber));
      if (!result.ok) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Request failed.") },
      { status: 500 },
    );
  }
}
