import { NextResponse } from "next/server";
import {
  createEnrollment,
  enrollmentCounts,
} from "@/features/academy/server/enrollments";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const courseId = searchParams.get("courseId") || "HSK-101";
    const counts = await enrollmentCounts(courseId);
    return NextResponse.json({ success: true, ...counts });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to load enrollments";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const { courseId, name, whatsapp, trxId, location, note } = await req.json();
    if (!courseId || !name?.trim() || !whatsapp?.trim() || !trxId?.trim()) {
      return NextResponse.json(
        { success: false, message: "Missing required fields" },
        { status: 400 },
      );
    }
    const result = await createEnrollment({ courseId, name, whatsapp, trxId, location: location || "", note });
    if (result.kind === "full") {
      return NextResponse.json(
        { success: false, message: "Batch is full — all seats booked.", enrolled: result.enrolled, remaining: result.remaining },
        { status: 409 },
      );
    }
    if (result.kind === "duplicate-trx") {
      return NextResponse.json(
        { success: false, message: "This TrxID was already submitted.", enrolled: undefined, remaining: undefined },
        { status: 409 },
      );
    }
    return NextResponse.json(
      { success: true, message: "Seat reserved. Your details were sent to the academy.", enrolled: result.enrolled, remaining: result.remaining },
    );
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Enrollment failed";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}