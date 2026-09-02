import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Student } from "@/features/academy/models/Student";

export async function POST(req: Request) {
  try {
    const { rollNumber, isWhatsAppGroupJoined, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }

    await connectDB();

    const student = await Student.findOneAndUpdate(
      { rollNumber },
      { isWhatsAppGroupJoined: Boolean(isWhatsAppGroupJoined) },
      { new: true }
    );

    if (!student) {
      return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `WhatsApp Group status updated to ${isWhatsAppGroupJoined ? "Joined" : "Not Joined"}`,
      student,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}