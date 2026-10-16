import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import PaidEntry from "@/features/paid/models/PaidEntry";
import {
  hasMarksFields,
  normalizePaidInput,
  normalizePaidMarks,
  serializePaidEntry,
} from "@/features/paid/lib";
import { isAdminPasscode } from "@/lib/admin-guard";

export const dynamic = "force-dynamic";

export async function PATCH(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const body = await req.json();

    const base = normalizePaidInput(body);
    if (!base.name) {
      return NextResponse.json({ error: "Name is required" }, { status: 400 });
    }

    await connectDB();
    const existing = await PaidEntry.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    const updateData: Record<string, unknown> = { ...base };

    // The class / homework toggle grids are admin-only. A public edit never
    // sends them, so they are only touched when the body carries them — and
    // then only with a valid passcode.
    if (hasMarksFields(body)) {
      if (!isAdminPasscode((body as { passcode?: unknown }).passcode)) {
        return NextResponse.json(
          { error: "Admin passcode required to change classes or homework." },
          { status: 403 }
        );
      }
      Object.assign(updateData, normalizePaidMarks(body));
    }

    const updated = await PaidEntry.findByIdAndUpdate(id, updateData, { new: true });
    return NextResponse.json(serializePaidEntry(updated?.toObject() ?? updated), { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: Promise<{ id: string }> }) {
  try {
    const { id } = await params;
    const { passcode } = await req.json();

    if (!isAdminPasscode(passcode)) {
      return NextResponse.json(
        { error: "Invalid admin passcode. Only admin can delete." },
        { status: 403 }
      );
    }

    await connectDB();
    const deleted = await PaidEntry.findByIdAndDelete(id).lean();
    if (!deleted) {
      return NextResponse.json({ error: "Entry not found" }, { status: 404 });
    }

    return NextResponse.json({ message: "Deleted successfully" }, { status: 200 });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
