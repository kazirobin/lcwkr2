import { NextResponse } from "next/server";
import { createReview, listAllReviews, listApprovedReviews } from "@/features/academy/server/reviews";

// GET /api/academy/reviews — public list of approved reviews. ?all=1 returns
// everything (incl. pending) for the admin console.
export async function GET(req: Request) {
  try {
    const all = new URL(req.url).searchParams.get("all") === "1";
    const reviews = all ? await listAllReviews() : await listApprovedReviews();
    return NextResponse.json({ success: true, reviews });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

// POST /api/academy/reviews — public submission (awaiting approval).
export async function POST(req: Request) {
  try {
    const { name, mobile, location, message, rating } = await req.json();
    if (!name || !name.trim() || !message || !message.trim()) {
      return NextResponse.json(
        { success: false, error: "Name and review are required." },
        { status: 400 },
      );
    }
    const review = await createReview({
      name: String(name),
      mobile: String(mobile ?? ""),
      location: String(location ?? ""),
      message: String(message),
      rating: Number(rating ?? 0),
    });
    return NextResponse.json({ success: true, review }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}