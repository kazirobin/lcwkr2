import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ClassLog } from "@/features/academy/models";

export async function GET() {
  try {
    await connectDB();
    const pendingClasses = await ClassLog.find({ approvalStatus: "Pending" }).sort({ createdAt: -1 });
    return NextResponse.json({ success: true, pendingClasses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}