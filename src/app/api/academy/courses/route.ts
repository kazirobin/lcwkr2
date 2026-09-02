import { NextResponse } from "next/server";
import { listCourses, createCourse } from "@/features/academy/server/courses";

export async function GET() {
  try {
    const courses = await listCourses();
    return NextResponse.json({ success: true, courses });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const course = await createCourse(body);
    return NextResponse.json({ success: true, course }, { status: 201 });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 400 });
  }
}
