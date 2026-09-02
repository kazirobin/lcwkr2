import { NextRequest, NextResponse } from "next/server";
import {
  getCourseById,
  updateCourse,
  deleteCourse,
} from "@/features/academy/server/courses";

type Props = {
  params: Promise<{ id: string }>;
};

// কোর্স বিস্তারিত ফেচ
export async function GET(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;

    const course = await getCourseById(id);
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

    const updatedCourse = await updateCourse(id, body);

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

    const deletedCourse = await deleteCourse(id);
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
