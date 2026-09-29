import { NextResponse } from "next/server";
import { connectDB } from "@/lib/db";
import {
  Course,
  CourseEnrollment,
  DialogueMark,
  DialogueSubmission,
  HandwritingSubmission,
  HwExamResult,
  Student,
  StudentRegistration,
} from "@/features/academy/models";
import { sessionSummaries } from "@/features/analytics/server/sessions";
import { canSeeContact } from "@/lib/admin-guard";

/**
 * GET /api/academy/students/[roll] — everything the admin console needs about
 * one student on a single page: the account itself, which courses they are on
 * and what they have paid for, every homework item ever submitted with its
 * mark, exam results, and their sign-in history.
 *
 * This is the full private record — phone number, transaction history, every
 * submission — so unlike the public profile it is admin-only. It used to be
 * open to anyone, which meant the whole roster could be read one roll at a
 * time without a passcode. The public view lives at `[roll]/profile`.
 */
export async function GET(
  req: Request,
  props: { params: Promise<{ roll: string }> },
) {
  try {
    const url = new URL(req.url);
    if (!canSeeContact(req, url)) {
      return NextResponse.json(
        { success: false, error: "Admin passcode required." },
        { status: 403 },
      );
    }

    const { roll } = await props.params;
    const rollNumber = Number(roll);
    if (!Number.isInteger(rollNumber)) {
      return NextResponse.json({ success: false, error: "Bad roll" }, { status: 400 });
    }

    await connectDB();

    const student = await Student.findOne({ rollNumber })
      .select("-passwordHash")
      .lean();
    if (!student) {
      return NextResponse.json({ success: false, error: "Student not found" }, { status: 404 });
    }

    const [
      courses,
      enrollments,
      registration,
      dialogues,
      dialogueMarks,
      handwriting,
      exams,
      sessions,
    ] = await Promise.all([
      Course.find({ courseId: student.enrolledCourseId }).lean(),
      CourseEnrollment.find({ whatsapp: student.whatsapp }).sort({ createdAt: -1 }).lean(),
      StudentRegistration.findOne({ whatsapp: student.whatsapp }).sort({ createdAt: -1 }).lean(),
      DialogueSubmission.find({ whatsapp: student.whatsapp })
        .sort({ createdAt: -1 })
        .lean(),
      DialogueMark.find({ whatsapp: student.whatsapp })
        .sort({ createdAt: -1 })
        .lean(),
      HandwritingSubmission.find({ whatsapp: student.whatsapp })
        .sort({ createdAt: -1 })
        .lean(),
      HwExamResult.find({ whatsapp: student.whatsapp }).lean(),
      sessionSummaries(500),
    ]);

    // The session summary for this student comes back inside the full list, so
    // pull just their row rather than querying twice.
    const mine = sessions.find((s) => s.whatsapp === student.whatsapp) ?? null;

    return NextResponse.json({
      success: true,
      student,
      courses,
      enrollments,
      registration,
      activity: {
        dialogues: dialogues.slice(0, 40),
        dialogueMarks: dialogueMarks.slice(0, 40),
        handwriting: handwriting.slice(0, 40),
        exams,
      },
      session: mine,
    });
  } catch (error: any) {
    return NextResponse.json({ success: false, error: error.message }, { status: 500 });
  }
}
