import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PaidEntry from "@/features/paid/models/PaidEntry";
import { CLASS_SLOTS, HOMEWORK_SLOTS, normalizeMarks } from "@/features/paid/lib";
import { isAdminPasscode } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

/**
 * POST /api/paid/bulk — set one class or homework slot for a chosen set of
 * members (or everyone) at once. The admin picks a slot, ticks the students in
 * the bulk panel, then marks them present/done or clears them in one request.
 *
 * Body: { kind: "class" | "homework", index: number, value: boolean,
 *         passcode, ids?: string[] }
 */
export async function POST(req: Request) {
  try {
    const body = (await req.json()) as {
      kind?: unknown;
      index?: unknown;
      value?: unknown;
      passcode?: unknown;
      ids?: unknown;
    };

    if (!isAdminPasscode(body.passcode)) {
      return NextResponse.json(
        { error: "Invalid admin passcode. Only admin can update attendance." },
        { status: 403 }
      );
    }

    const kind = body.kind === "class" ? "class" : body.kind === "homework" ? "homework" : null;
    if (!kind) {
      return NextResponse.json({ error: "kind must be 'class' or 'homework'" }, { status: 400 });
    }

    const slots = kind === "class" ? CLASS_SLOTS : HOMEWORK_SLOTS;
    const index = Number(body.index);
    if (!Number.isInteger(index) || index < 0 || index >= slots) {
      return NextResponse.json({ error: `index must be between 0 and ${slots - 1}` }, { status: 400 });
    }
    const value = Boolean(body.value);

    // Only the ticked members; if none were sent, fall back to the whole list.
    const ids = Array.isArray(body.ids) ? body.ids.map(String).filter(Boolean) : [];
    const filter = ids.length ? { _id: { $in: ids } } : {};

    await connectDB();
    const entries = await PaidEntry.find(filter).select("classMarks homeworkMarks").lean();

    const ops = entries.map((entry) => {
      const current = normalizeMarks(
        kind === "class" ? entry.classMarks : entry.homeworkMarks,
        slots
      );
      current[index] = value;
      return {
        updateOne: {
          filter: { _id: entry._id },
          update: { $set: kind === "class" ? { classMarks: current } : { homeworkMarks: current } },
        },
      };
    });

    if (ops.length) await PaidEntry.bulkWrite(ops);

    return NextResponse.json({ success: true, updated: ops.length }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update attendance";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
