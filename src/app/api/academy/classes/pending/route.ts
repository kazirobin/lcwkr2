import { NextResponse } from "next/server";
import { listPendingClasses } from "@/features/academy/server/classes";

export async function GET() {
  try {
    const pendingClasses = await listPendingClasses();
    return NextResponse.json({ success: true, pendingClasses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
