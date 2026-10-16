import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PaidSettingsModel from "@/features/paid/models/PaidSettings";
import { normalizeWaMessage, serializePaidSettings } from "@/features/paid/lib";
import { isAdminPasscode } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

/**
 * GET /api/paid/settings — the shared page options everyone reads (currently
 * just the WhatsApp greeting). Falls back to the default when none is saved.
 */
export async function GET() {
  try {
    await connectDB();
    const doc = await PaidSettingsModel.findOne({}).lean();
    return NextResponse.json(serializePaidSettings(doc ?? {}), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to load";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/**
 * PUT /api/paid/settings — admin sets the WhatsApp greeting. Body:
 * { waMessage: string, passcode: string }
 */
export async function PUT(req: Request) {
  try {
    const body = (await req.json()) as { waMessage?: unknown; passcode?: unknown };
    if (!isAdminPasscode(body.passcode)) {
      return NextResponse.json(
        { error: "Invalid admin passcode. Only admin can change the message." },
        { status: 403 }
      );
    }

    const waMessage = normalizeWaMessage(body.waMessage);
    await connectDB();
    const doc = await PaidSettingsModel.findOneAndUpdate(
      {},
      { $set: { waMessage } },
      { new: true, upsert: true, setDefaultsOnInsert: true }
    ).lean();

    return NextResponse.json(serializePaidSettings(doc), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to save";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
