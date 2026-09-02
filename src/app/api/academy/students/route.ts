import { NextResponse } from "next/server";
import { listStudents } from "@/features/academy/server/students";

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const status = searchParams.get("status") || "Approved"; // ডিফল্টভাবে কেবল অনুমোদিত ছাত্র দেখাবে

    const students = await listStudents(status);
    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
