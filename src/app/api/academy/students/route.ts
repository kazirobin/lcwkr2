import { NextResponse } from "next/server";
import { listStudents } from "@/features/academy/server/students";
import { canSeeContact } from "@/lib/admin-guard";

export async function GET(req: Request) {
  try {
    const url = new URL(req.url);
    const { searchParams } = url;
    const status = searchParams.get("status") || "Approved"; // ডিফল্টভাবে কেবল অনুমোদিত ছাত্র দেখাবে

    // Phone numbers are only released to an admin/teacher caller. A visitor
    // asking for them without a passcode simply gets the redacted list.
    const wantsContact = searchParams.get("include") === "contact";
    const students = await listStudents(status, wantsContact && canSeeContact(req, url));
    return NextResponse.json({ success: true, students });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
