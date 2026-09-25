import { NextResponse } from "next/server";
import {
  listAllExamResults,
  listExamResultsByPhone,
  recordExamResult,
} from "@/features/academy/server/hw-exams";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "8131";

// GET /api/hw/exam-results?phone=01XXX → own scoreboard.
// GET /api/hw/exam-results?all=1 (+ x-admin-passcode) → everything (admin).
export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    if (params.get("all") === "1") {
      const pass = req.headers.get("x-admin-passcode");
      if (!pass || (pass !== process.env.ADMIN_PASSCODE && pass !== ADMIN_PASSCODE)) {
        return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
      }
      const results = await listAllExamResults();
      return NextResponse.json({ success: true, results });
    }
    const results = await listExamResultsByPhone(params.get("phone") ?? "");
    return NextResponse.json({ success: true, results });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/hw/exam-results → sync a submit (approved students only).
export async function POST(req: Request) {
  try {
    const { phone, level, lesson, totalScore, totalMarks } = await req.json();
    const result = await recordExamResult({
      phone: String(phone ?? ""),
      level: Number(level),
      lesson: Number(lesson),
      totalScore: Number(totalScore),
      totalMarks: Number(totalMarks),
    });
    return NextResponse.json({ success: true, result }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    const status = /Student list/i.test(message) ? 403 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
