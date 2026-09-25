import { NextResponse } from "next/server";
import {
  createHandwritingSubmission,
  listAllHandwriting,
  listHandwritingByPhone,
} from "@/features/academy/server/handwriting";

const ADMIN_PASSCODE = process.env.ADMIN_PASSCODE || "8131";

function isAdmin(req: Request): boolean {
  const pass = req.headers.get("x-admin-passcode");
  return !!pass && (pass === process.env.ADMIN_PASSCODE || pass === ADMIN_PASSCODE);
}

// GET /api/hw/handwriting?phone=01XXXXXXXXX → own submissions only.
// GET /api/hw/handwriting?all=1 (+ x-admin-passcode header) → everything (admin).
export async function GET(req: Request) {
  try {
    const params = new URL(req.url).searchParams;
    if (params.get("all") === "1") {
      if (!isAdmin(req)) {
        return NextResponse.json({ success: false, error: "Forbidden." }, { status: 403 });
      }
      const submissions = await listAllHandwriting();
      return NextResponse.json({ success: true, submissions });
    }
    const phone = params.get("phone") ?? "";
    const submissions = await listHandwritingByPhone(phone);
    return NextResponse.json({ success: true, submissions });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    return NextResponse.json({ success: false, error: message }, { status: 500 });
  }
}

// POST /api/hw/handwriting → student photo submission (approved students only).
// body: { name, phone, level, lesson, images: [{ url, publicId }] }
export async function POST(req: Request) {
  try {
    const { name, phone, level, lesson, images } = await req.json();
    const submission = await createHandwritingSubmission({
      name: String(name ?? ""),
      phone: String(phone ?? ""),
      level: Number(level),
      lesson: Number(lesson),
      images: Array.isArray(images) ? images : [],
    });
    return NextResponse.json({ success: true, submission }, { status: 201 });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed.";
    const status = /Student list/i.test(message) ? 403 : 400;
    return NextResponse.json({ success: false, error: message }, { status });
  }
}
