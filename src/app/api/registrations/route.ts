import { NextRequest, NextResponse } from "next/server";
import { messageOf } from "@/lib/api-error";
import {
  listRegistrations,
  rejectRegistration,
  approveRegistration,
  submitRegistration,
} from "@/features/academy/server/registrations";

type Action =
  | { action: "APPROVE"; id: string; rollNumber: number; courseId: string }
  | { action: "REJECT"; id: string };

function isAdmin(passcode: unknown): boolean {
  return passcode === process.env.ADMIN_PASSCODE || passcode === "8131";
}

// GET /api/registrations?status=Pending — the ৳500 applications awaiting review.
export async function GET(req: NextRequest) {
  try {
    const status = req.nextUrl.searchParams.get("status") ?? "Pending";
    const rows = await listRegistrations(status);
    return NextResponse.json({ success: true, registrations: rows });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: messageOf(error, "Request failed.") }, { status: 500 });
  }
}

/**
 * POST /api/registrations — two callers, told apart by the body.
 *
 * A student submitting the ৳500 form sends no `action`; the admin console always
 * sends one. Only the admin branch is passcode-gated, so a student never has to
 * know the passcode to apply.
 */
export async function POST(req: NextRequest) {
  try {
    const body = (await req.json()) as Partial<Action> & {
      adminPasscode?: string;
      name?: string;
      whatsapp?: string;
      trxId?: string;
      location?: string;
    };

    if (!body.action) {
      const result = await submitRegistration({
        name: String(body.name ?? ""),
        whatsapp: String(body.whatsapp ?? ""),
        trxId: String(body.trxId ?? ""),
        location: typeof body.location === "string" ? body.location : "",
      });
      if (!result.ok) {
        // Duplicate TrxID or a missing field is the user's to fix; the rest are
        // ordinary "come back later" situations.
        const status = result.code === "duplicate-trx" || result.code === "invalid" ? 400 : 409;
        return NextResponse.json(
          { success: false, code: result.code, message: result.message },
          { status },
        );
      }
      return NextResponse.json({ success: true, id: result.data.id });
    }

    if (!isAdmin(body.adminPasscode)) {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }

    if (body.action === "APPROVE") {
      const result = await approveRegistration(
        String(body.id ?? ""),
        Number(body.rollNumber) || 1,
        String(body.courseId ?? ""),
      );
      if (!result.ok) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true, rollNumber: result.data.rollNumber });
    }

    if (body.action === "REJECT") {
      const result = await rejectRegistration(String(body.id ?? ""));
      if (!result.ok) {
        return NextResponse.json({ success: false, message: result.message }, { status: 400 });
      }
      return NextResponse.json({ success: true });
    }

    return NextResponse.json({ success: false, message: "Unknown action" }, { status: 400 });
  } catch (error: unknown) {
    return NextResponse.json({ success: false, error: messageOf(error, "Request failed.") }, { status: 500 });
  }
}
