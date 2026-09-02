import { NextRequest, NextResponse } from "next/server";
import { getStudentWithCourses } from "@/features/academy/server/students";

type Props = {
  params: Promise<{ roll: string }>;
};

export async function GET(req: NextRequest, props: Props) {
  try {
    const { roll } = await props.params;

    const result = await getStudentWithCourses(roll);

    if (!result) {
      return NextResponse.json(
        { success: false, message: "Student not found" },
        { status: 404 }
      );
    }

    return NextResponse.json({ success: true, ...result });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, error: error.message },
      { status: 500 }
    );
  }
}
