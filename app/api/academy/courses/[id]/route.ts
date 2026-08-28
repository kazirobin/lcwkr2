import { NextRequest, NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";

type Props = {
  params: Promise<{ id: string }>;
};

// কোর্স বিস্তারিত ফেচ
export async function GET(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    await connectDB();

    const course = await Course.findOne({ courseId: id });
    if (!course) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, course });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// কোর্স এডিট / মডিফাই
export async function PUT(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    const body = await req.json();
    await connectDB();

    const updatedCourse = await Course.findOneAndUpdate(
      { courseId: id },
      { $set: body },
      { new: true }
    );

    if (!updatedCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({ success: true, course: updatedCourse });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}

// কোর্স ডিলিট
export async function DELETE(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;
    await connectDB();

    const deletedCourse = await Course.findOneAndDelete({ courseId: id });
    if (!deletedCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Course deleted successfully",
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}