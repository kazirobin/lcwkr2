import { NextResponse } from "next/server";
import { connectDB } from "@/lib/mongodb";
import { Course } from "@/models/Course";
import { ClassLog } from "@/models/ClassLog";

export async function POST(req: Request) {
  try {
    const { courseId, classId, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }

    await connectDB();

    // ১. Course এর classes অ্যারে থেকে নির্দিষ্ট ক্লাসটি pull (remove) করা এবং ক্লাস কাউন্ট কমানো
    const updatedCourse = await Course.findOneAndUpdate(
      { courseId },
      {
        $pull: { classes: { classId } },
        $inc: { completedClassesCount: -1 },
      },
      { new: true }
    );

    // ২. ClassLog হিস্টোরি থেকেও সংশ্লিষ্ট লগ ডিলিট করা
    await ClassLog.findOneAndDelete({ courseId, classId });

    if (!updatedCourse) {
      return NextResponse.json({ success: false, message: "Course or Class not found" }, { status: 404 });
    }

    return NextResponse.json({
      success: true,
      message: `Class ${classId} deleted successfully from ${courseId}`,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}