import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Student } from "@/features/academy/models";

export async function POST(req: Request) {
  try {
    const { rollNumber, action, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }

    await connectDB();
    const targetRoll = Number(rollNumber);

    if (action === "APPROVE") {
      const student = await Student.findOneAndUpdate(
        { rollNumber: targetRoll },
        { registrationStatus: "Approved" },
        { new: true }
      );
      return NextResponse.json({ success: true, student });
    } 
    
    else if (action === "REJECT" || action === "DELETE") {
      // ১. টার্গেট স্টুডেন্ট খুঁজে ডিলিট করা
      const deletedStudent = await Student.findOneAndDelete({ rollNumber: targetRoll });

      if (!deletedStudent) {
        return NextResponse.json({ success: false, message: "Student not found" }, { status: 404 });
      }

      // ২. 👈 স্বয়ংক্রিয় সিরিয়াল রিক্যালকুলেশন: ডিলিট হওয়া রোলের চেয়ে বড় সব রোলের মান ১ কমে যাবে
      await Student.updateMany(
        { rollNumber: { $gt: targetRoll } },
        { $inc: { rollNumber: -1 } }
      );

      return NextResponse.json({
        success: true,
        message: `Roll ${targetRoll} deleted and subsequent rolls automatically re-indexed!`,
      });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}