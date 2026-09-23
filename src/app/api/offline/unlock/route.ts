import { NextResponse } from "next/server";

const PRO_CODE = process.env.PRO_CODE ?? "LCWKR2026";

export async function POST(req: Request) {
  try {
    const { code } = await req.json().catch(() => ({}));
    if (!code || typeof code !== "string") {
      return NextResponse.json({ success: false, error: "Pro কোড লিখুন।" }, { status: 400 });
    }
    if (code.trim().toUpperCase() !== PRO_CODE.toUpperCase()) {
      return NextResponse.json({ success: false, error: "কোডটি সঠিক নয়।" }, { status: 403 });
    }
    return NextResponse.json({ success: true, pro: true });
  } catch {
    return NextResponse.json({ success: false, error: "Something went wrong." }, { status: 500 });
  }
}