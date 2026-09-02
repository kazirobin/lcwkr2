import { NextRequest, NextResponse } from "next/server";
import connectToDatabase from "@/lib/db";
import ChineseWord from "@/features/chinese-words/models";

// 1. GET: সব ওয়ার্ড আনা
export async function GET(req: NextRequest) {
  try {
    await connectToDatabase();
    const words = await ChineseWord.find({}).sort({ hskLevel: 1, createdAt: -1 }).lean();
    return NextResponse.json({ success: true, data: words });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 500 });
  }
}

// 2. POST: নতুন কোর ওয়ার্ড যোগ করা
export async function POST(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const created = await ChineseWord.create(body);
    return NextResponse.json({ success: true, data: created }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// 3. PUT: কোর ওয়ার্ড এডিট/আপডেট করা
export async function PUT(req: NextRequest) {
  try {
    await connectToDatabase();
    const body = await req.json();
    const { _id, ...updateData } = body;

    const updated = await ChineseWord.findByIdAndUpdate(_id, updateData, { new: true });
    return NextResponse.json({ success: true, data: updated });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}

// 4. DELETE: কোর ওয়ার্ড ডিলিট করা
export async function DELETE(req: NextRequest) {
  try {
    await connectToDatabase();
    const { searchParams } = new URL(req.url);
    const id = searchParams.get("id");

    await ChineseWord.findByIdAndDelete(id);
    return NextResponse.json({ success: true, message: "Deleted successfully" });
  } catch (error: any) {
    return NextResponse.json({ success: false, message: error.message }, { status: 400 });
  }
}