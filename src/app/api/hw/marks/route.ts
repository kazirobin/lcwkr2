import { NextResponse } from "next/server";
import {
  createManualMark,
  listLatestMarks,
  listMarkHistory,
  listMarksByPhone,
} from "@/features/academy/server/dialogues";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "8131";

// GET /api/hw/marks → latest mark per student (public, for the directory).
// GET /api/hw/marks?history=1 (+ x-admin-passcode) → full history (admin).
// GET /api/hw/marks?phone=01XXX → one student's mark history (profile pages).
export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    const phone = params.get("phone");
    if (phone) {
      const marks = await listMarksByPhone(phone);
      return NextResponse.json({ success: true, marks });
    }
    if (params.get("history") === "1") {
      const pass = req.headers.get("x-admin-passcode");
      if (!pass || (pass !== process.env.ADMIN_PASSCODE && pass !== ADMIN_PASSCODE)) {
        return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
      }
      const history = await listMarkHistory();
      return NextResponse.json({ success: true, history });
    }
    const marks = await listLatestMarks();
    return NextResponse.json({ success: true, marks });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/hw/marks → manual mark for any approved student (admin only).
export async function POST(req: Request) {
  try {
    const { phone, level, lesson, mark, feedback, adminPasscode } = await req.json();
    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== ADMIN_PASSCODE) {
      return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
    }
    const created = await createManualMark({
      phone: String(phone ?? ""),
      level: Number(level),
      lesson: Number(lesson ?? 0),
      mark: Number(mark),
      feedback: String(feedback ?? ""),
    });
    return NextResponse.json({ success: true, mark: created }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    const status = /Student list/i.test(message) ? 403 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
