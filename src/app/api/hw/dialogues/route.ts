import { NextResponse } from "next/server";
import {
  createDialogueSubmission,
  listAllSubmissions,
  listSubmissionsByPhone,
} from "@/features/academy/server/dialogues";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "8131";

function isAdmin(req: Request): boolean {
  const pass = req.headers.get("x-admin-passcode");
  return !!pass && (pass === process.env.ADMIN_PASSCODE || pass === ADMIN_PASSCODE);
}

// GET /api/hw/dialogues?phone=01XXXXXXXXX → own submissions only.
// GET /api/hw/dialogues?all=1 (+ x-admin-passcode header) → everything (admin).
export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    if (params.get("all") === "1") {
      if (!isAdmin(req)) {
        return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
      }
      const submissions = await listAllSubmissions();
      return NextResponse.json({ success: true, submissions });
    }
    const phone = params.get("phone") ?? "";
    const submissions = await listSubmissionsByPhone(phone);
    return NextResponse.json({ success: true, submissions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/hw/dialogues → student submission (approved students only).
export async function POST(req: Request) {
  try {
    const { name, phone, level, lesson, audioUrl, durationSec } = await req.json();
    const submission = await createDialogueSubmission({
      name: String(name ?? ""),
      phone: String(phone ?? ""),
      level: Number(level),
      lesson: Number(lesson),
      audioUrl: String(audioUrl ?? ""),
      durationSec: Number(durationSec ?? 0),
    });
    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    // Validation / not-a-student → 400/403 style: use 400 unless forbidden wording.
    const status = /Student list/i.test(message) ? 403 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
