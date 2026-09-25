import { NextResponse } from "next/server";
import { isValidProPassword } from "@/features/chinese-words/data/pro-passwords";

const PRO_CODE = process.env.PRO_CODE ?? "LCWKR2026";

export async function POST(req: Request) {
  try {
    const { code } = await req.json().catch(() => ({}));
    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, error: "Pro কোড লিখুন।" }, { status: 400 });
    }
    const value = code.trim();
    // Single source of truth: pro-passwords.ts list (+ server-only PRO_CODE env).
    if (!isValidProPassword(value) && value.toUpperCase() !== PRO_CODE.toUpperCase()) {
      return NextResponse.json({ success: false, error: "কোডটি সঠিক নয়।" }, { status: 403 });
    }
    return NextResponse.json({ success: true, pro: true });
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}