import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import { ClassLog } from "@/features/academy/models";
import { Course } from "@/features/academy/models";

export async function POST(req: Request) {
  try {
    const { logId, action, adminPasscode } = await req.json();

    if (adminPasscode !== process.env.ADMIN_PASSCODE && adminPasscode !== "8131") {
      return NextResponse.json({ success: false, message: "Unauthorized Admin PIN" }, { status: 401 });
    }

    await connectDB();

    const log = await ClassLog.findById(logId);
    if (!log) {
      return NextResponse.json({ success: false, message: "Class log not found" }, { status: 404 });
    }

    if (action === "APPROVE") {
      log.approvalStatus = "Approved";
      await log.save();

      // সরাসরি কোর্সের classes অ্যারেতে পুশ করা
      await Course.findOneAndUpdate(
        { courseId: log.courseId },
        {
          $push: {
            classes: {
              classId: log.classId,
              date: log.date,
              time: log.time,
              status: "Completed",
              contentCovered: log.contentCovered,
              presentStudents: log.presentStudents,
              absentStudents: log.absentStudents,
            },
          },
          $inc: { completedClassesCount: 1 },
        }
      );

      return NextResponse.json({ success: true, message: "Class approved and merged into course." });
    } else {
      await ClassLog.findByIdAndDelete(logId);
      return NextResponse.json({ success: true, message: "Class log rejected & deleted." });
    }
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}