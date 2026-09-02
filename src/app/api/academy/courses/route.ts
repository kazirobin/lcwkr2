import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { Course } from "@/features/academy/models";

export async function GET() {
  try {
    await connectDB();
    const courses = await Course.find({}).sort({ createdAt: 1 });
    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    await connectDB();
    const course = await Course.create(body);
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}