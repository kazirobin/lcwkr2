import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Student } from "@/models/Student";

export async function POST(req: Request) {
  try {
    const { rollNumber, action, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }

    await connectDB();

    if (action === "APPROVE") {
      const student = await Student.findOneAndUpdate(
        { rollNumber },
        { registrationStatus: "Approved" },
        { new: true }
      );
      return NextResponse.json({ success: true, student });
    } else if (action === "REJECT" || action === "DELETE") {
      await Student.findOneAndDelete({ rollNumber });
      return NextResponse.json({ success: true, message: "Application removed" });
    }

    return NextResponse.json({ success: false, message: "Invalid action" }, { status: 400 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}