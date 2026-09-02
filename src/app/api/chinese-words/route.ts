import { NextRequest, NextResponse } from "next/server";
import {
  listWords,
  createWord,
  updateWord,
  deleteWord,
} from "@/features/chinese-words/server/words";

// 1. GET: সব ওয়ার্ড আনা
export async function GET(req: NextRequest) {
  try {
    const words = await listWords();
    return NextResponse.json({ success: true, data: words });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 2. POST: নতুন কোর ওয়ার্ড যোগ করা
export async function POST(req: NextRequest) {
  try {
    const body = await req.json();
    const created = await createWord(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// 3. PUT: কোর ওয়ার্ড এডিট/আপডেট করা
export async function PUT(req: NextRequest) {
  try {
    const body = await req.json();
    const updated = await updateWord(body);
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// 4. DELETE: কোর ওয়ার্ড ডিলিট করা
export async function DELETE(req: NextRequest) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await deleteWord(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}
