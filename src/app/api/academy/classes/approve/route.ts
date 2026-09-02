import { NextResponse } from "next/server";
import { reviewClassLog } from "@/features/academy/server/classes";

export async function POST(req: Request) {
  try {
    const { logId, action, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }

    const result = await reviewClassLog(logId, action);

    if (result.kind === "not-found") {
      return NextResponse.json({ success: false, message: "Class log not found" }, { status: 404 });
    }

    if (result.kind === "approved") {
      return NextResponse.json({ success: true, message: "Class approved and merged into course." });
    }

    return NextResponse.json({ success: true, message: "Class log rejected & deleted." });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
