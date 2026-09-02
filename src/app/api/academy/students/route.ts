import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Student } from "@/features/academy/models";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "Approved"; // ডিফল্টভাবে কেবল অনুমোদিত ছাত্র দেখাবে

    await connectDB();
    const students = await Student.find(status === "All" ? {} : { registrationStatus: status }).sort({ rollNumber: 1 });
    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}