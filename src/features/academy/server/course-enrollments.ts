import { connectDB } from "@/lib/db";
import { Course, CourseEnrollment, Student } from "@/features/academy/models";
import { normalizePhone, type SubmitResult } from "./registrations";

/**
 * Paid enrollment into a launched course.
 *
 * A course only accepts enrollments once it has been launched, and it charges
 * the fee stored on the course at that moment. The legacy `Enrollment` model
 * (bKash seat reservations from the old academy page) is left untouched.
 */

export type CourseSummary = {
  courseId: string;
  courseName: string;
  targetLevel: string;
  tagline: string;
  duration: string;
  fee: number;
  freeClassCount: number;
  covers: string[];
  seats: number;
  launched: boolean;
  enrollmentDeadline: string;
  /** Seats already taken by approved or pending enrollments. */
  enrolled: number;
  /** Seats left, or null when the course is unlimited. */
  remaining: number | null;
};

/** Only the fields the academy pages need, plus a live seat count. */
export async function listCourseSummaries(includeUnlaunched = false): Promise<CourseSummary[]> {
  await connectDB();
  const filter = includeUnlaunched ? {} : { launched: true };
  const courses = await Course.find(filter).sort({ createdAt: 1 }).lean();
  if (!courses.length) return [];

  const counts = await CourseEnrollment.aggregate<{ _id: string; n: number }>([
    { $match: { courseId: { $in: courses.map((c) => c.courseId) }, status: { $ne: "Rejected" } } },
    { $group: { _id: "$courseId", n: { $sum: 1 } } },
  ]);
  const byCourse = new Map(counts.map((c) => [c._id, c.n]));

  return courses.map((c) => {
    const enrolled = byCourse.get(c.courseId) ?? 0;
    return {
      courseId: c.courseId,
      courseName: c.courseName,
      targetLevel: c.targetLevel,
      tagline: c.tagline ?? "",
      duration: c.duration ?? "",
      fee: c.fee ?? 0,
      freeClassCount: c.freeClassCount ?? 0,
      covers: c.covers ?? [],
      seats: c.seats ?? 0,
      launched: Boolean(c.launched),
      enrollmentDeadline: c.enrollmentDeadline ?? "",
      enrolled,
      remaining: c.seats ? Math.max(0, c.seats - enrolled) : null,
    };
  });
}

export type SubmitCourseEnrollmentInput = {
  courseId: string;
  name: string;
  whatsapp: string;
  trxId: string;
  location?: string;
};

export async function submitCourseEnrollment(
  input: SubmitCourseEnrollmentInput,
): Promise<SubmitResult<{ id: string; amount: number; courseName: string }>> {
  await connectDB();

  const name = input.name?.trim();
  const whatsapp = normalizePhone(input.whatsapp);
  const trxId = (input.trxId ?? "").trim().toUpperCase();
  if (!name || whatsapp.length < 10 || !trxId) {
    return { ok: false, code: "invalid", message: "নাম, ফোন ও TrxID আবশ্যক।" };
  }

  const course = await Course.findOne({ courseId: input.courseId });
  if (!course) return { ok: false, code: "invalid", message: "কোর্সটি পাওয়া যায়নি।" };
  if (!course.launched) {
    return { ok: false, code: "not-launched", message: "এই কোর্স এখনো চালু হয়নি।" };
  }

  const deadline = course.enrollmentDeadline;
  if (deadline && deadline < new Date().toISOString().slice(0, 10)) {
    return { ok: false, code: "closed", message: "ভর্তির সময় শেষ হয়ে গেছে।" };
  }

  const already = await CourseEnrollment.findOne({
    courseId: course.courseId,
    whatsapp,
    status: { $ne: "Rejected" },
  });
  if (already) {
    return { ok: false, code: "exists", message: "আপনি ইতিমধ্যে এই কোর্সে ভর্তি হয়েছেন।" };
  }

  const dupeTrx = await CourseEnrollment.findOne({ trxId });
  if (dupeTrx) {
    return { ok: false, code: "duplicate-trx", message: "এই TrxID আগেই ব্যবহার হয়েছে।" };
  }

  if (course.seats) {
    const taken = await CourseEnrollment.countDocuments({
      courseId: course.courseId,
      status: { $ne: "Rejected" },
    });
    if (taken >= course.seats) {
      return { ok: false, code: "full", message: "এই কোর্সে সিট পূর্ণ হয়ে গেছে।" };
    }
  }

  const created = await CourseEnrollment.create({
    courseId: course.courseId,
    courseName: course.courseName,
    name,
    whatsapp,
    trxId,
    // Free courses do not need a transaction id, so store an empty marker
    // rather than the word "free" (which would collide with the unique index).
    amount: course.fee ?? 0,
    location: input.location?.trim() ?? "",
    status: "Pending",
  });

  return { ok: true, data: { id: created.id, amount: course.fee ?? 0, courseName: course.courseName } };
}

export async function listCourseEnrollments(courseId?: string, status = "Pending") {
  await connectDB();
  const filter: Record<string, unknown> = {};
  if (courseId) filter.courseId = courseId;
  if (status !== "All") filter.status = status;
  return CourseEnrollment.find(filter).sort({ createdAt: -1 }).lean();
}

/**
 * Confirm a payment and put the student on the course. The student's
 * `enrolledCourseIds` list is written as well as the primary id, because the
 * schema only declares the singular field.
 */
export async function approveCourseEnrollment(
  id: string,
): Promise<SubmitResult<{ rollNumber: number | null }>> {
  await connectDB();
  const row = await CourseEnrollment.findById(id);
  if (!row) return { ok: false, code: "invalid", message: "ভর্তির আবেদন পাওয়া যায়নি।" };
  if (row.status === "Approved") {
    return { ok: false, code: "invalid", message: "ইতিমধ্যে অনুমোদিত।" };
  }

  const student = await Student.findOne({ whatsapp: row.whatsapp });
  if (student) {
    const existing = Array.isArray(student.enrolledCourseIds)
      ? (student.enrolledCourseIds as string[])
      : [];
    if (!existing.includes(row.courseId)) existing.push(row.courseId);
    student.enrolledCourseIds = existing as never;
    student.enrolledCourseId = existing[0] ?? row.courseId;
    await student.save();

    row.rollNumber = student.rollNumber;
  }

  row.status = "Approved";
  row.decidedAt = new Date();
  await row.save();

  return { ok: true, data: { rollNumber: row.rollNumber ?? null } };
}

export async function rejectCourseEnrollment(id: string): Promise<SubmitResult<null>> {
  await connectDB();
  const row = await CourseEnrollment.findByIdAndUpdate(
    id,
    { $set: { status: "Rejected", decidedAt: new Date() } },
    { new: true },
  );
  if (!row) return { ok: false, code: "invalid", message: "ভর্তির আবেদন পাওয়া যায়নি।" };
  return { ok: true, data: null };
}
