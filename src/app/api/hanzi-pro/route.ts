import { NextResponse } from "next/server";
import {
  getAllHanziProStudents,
  createHanziProStudent,
  updateHanziProStudent,
  deleteHanziProStudent,
} from "@/features/hanzi-pro/server/students";

/** GET /api/hanzi-pro — list all challenge students. */
export async function GET() {
  try {
    const students = await getAllHanziProStudents();
    return NextResponse.json({ success: true, students }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to fetch students";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** POST /api/hanzi-pro — public registration (৳200 bKash + TrxID). */
export async function POST(req: Request) {
  try {
    const { name, phone, location, trxId } = await req.json();

    if (!name || !phone || !trxId) {
      return NextResponse.json(
        { error: "Name, WhatsApp number and TrxID are required." },
        { status: 400 },
      );
    }

    const student = await createHanziProStudent({ name, phone, location, trxId, amount: 200 });
    return NextResponse.json({ success: true, student }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to register";
    const status = message.includes("already been submitted") ? 409 : 500;
    return NextResponse.json({ error: message }, { status });
  }
}

/** PUT /api/hanzi-pro — admin: update learned count / status / details. */
export async function PUT(req: Request) {
  try {
    const { id, learnedCount, status, name, phone, adminPasscode } = await req.json();

    if (
      adminPasscode !== process.env.ADMIN_PASSCODE &&
      adminPasscode !== "8131"
    ) {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    const patch: Record<string, unknown> = {};
    if (learnedCount !== undefined) {
      const n = Number(learnedCount);
      if (!Number.isFinite(n) || n < 0) {
        return NextResponse.json({ error: "learnedCount must be ≥ 0" }, { status: 400 });
      }
      patch.learnedCount = n;
    }
    if (status === "Pending" || status === "Active") patch.status = status;
    if (name) patch.name = String(name).trim();
    if (phone) patch.phone = String(phone).trim();

    const student = await updateHanziProStudent(id, patch);
    return NextResponse.json({ success: true, student }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to update";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}

/** DELETE /api/hanzi-pro?id= — admin: remove a student. */
export async function DELETE(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");
    const { adminPasscode } = Object.fromEntries(searchParams);

    if (
      adminPasscode !== process.env.ADMIN_PASSCODE &&
      adminPasscode !== "8131"
    ) {
      return NextResponse.json({ error: "Unauthorized Admin PIN" }, { status: 401 });
    }
    if (!id) {
      return NextResponse.json({ error: "Student ID is required." }, { status: 400 });
    }

    await deleteHanziProStudent(id);
    return NextResponse.json({ success: true, message: "Deleted successfully." }, { status: 200 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to delete";
    return NextResponse.json({ error: message }, { status: 500 });
  }
}
