import { NextRequest, NextResponse } from "next/server";
import {
  getCourseById,
  updateCourse,
  deleteCoursePermanently,
} from "@/features/academy/server/courses";
import { isAdminPasscode } from "@/lib/admin-guard";
import { messageOf } from "@/lib/api-error";

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
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not load the course.") },
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
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not save the course.") },
      { status: 500 }
    );
  }
}

// কোর্স স্থায়ীভাবে ডিলিট — admin passcode ছাড়া কেউ পারবে না।
export async function DELETE(req: NextRequest, props: Props) {
  try {
    const { id } = await props.params;

    let passcode = "";
    try {
      const body = await req.json();
      passcode = String((body as { adminPasscode?: unknown })?.adminPasscode ?? "");
    } catch {
      // No body sent — treat as an unauthenticated delete.
    }
    if (!isAdminPasscode(passcode)) {
      return NextResponse.json(
        { success: false, message: "Unauthorized Admin PIN" },
        { status: 401 }
      );
    }

    const deletedCourse = await deleteCoursePermanently(id);
    if (!deletedCourse) {
      return NextResponse.json(
        { success: false, message: "Course not found" },
        { status: 404 }
      );
    }
    return NextResponse.json({
      success: true,
      message: "Course deleted permanently",
    });
  } catch (error: unknown) {
    return NextResponse.json(
      { success: false, error: messageOf(error, "Could not delete the course.") },
      { status: 500 }
    );
  }
}
