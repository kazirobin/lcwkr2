import { connectDB } from "@/lib/db";
import { Course, CourseEnrollment, Student } from "@/features/academy/models";
import type { ICourseDoc } from "@/features/academy/models";
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
  completed: boolean;
  enrollmentDeadline: string;
  /** Seats already taken by approved or pending enrollments. */
  enrolled: number;
  /** Seats left, or null when the course is unlimited. */
  remaining: number | null;
  /** The syllabus, in order — this is the roadmap a student sees. */
  lessons: Array<{ lessonNumber: number; title: string; description?: string }>;
  topics: string[];
  totalLessons: number;
  totalClassesPlanned: number;
  completedClassesCount: number;
  /** How many classes have actually been logged, so progress can be shown. */
  classesHeld: number;
  /** Recent class logs, newest first, so the page can show real history. */
  classLog: Array<{
    classId: string;
    date: string;
    time: string;
    topic?: string;
    summary?: string;
    fromLesson?: number;
    toLesson?: number;
  }>;
  /** Lesson numbers the class log shows as already taught. */
  coveredLessons: number[];
};

/** Only the fields the academy pages need, plus a live seat count. */
export async function listCourseSummaries(includeUnlaunched = false): Promise<CourseSummary[]> {
  await connectDB();
  // A finished batch is off the shelf: the admin keeps its log, but nobody new
  // should see it as something they can still join.
  const filter = includeUnlaunched ? {} : { launched: true, completed: { $ne: true } };
  const courses = await Course.find(filter).sort({ createdAt: 1 }).lean();
  if (!courses.length) return [];

  const counts = await CourseEnrollment.aggregate<{ _id: string; n: number }>([
    { $match: { courseId: { $in: courses.map((c) => c.courseId) }, status: { $ne: "Rejected" } } },
    { $group: { _id: "$courseId", n: { $sum: 1 } } },
  ]);
  const byCourse = new Map(counts.map((c) => [c._id, c.n]));

  return courses.map((c) => {
    const enrolled = byCourse.get(c.courseId) ?? 0;
    // The class log is the record of what was actually taught, so it is what
    // the roadmap marks as done. Fall back to the counter when there are no
    // entries yet but the admin has ticked classes off.
    type ClassRow = NonNullable<ICourseDoc["classes"]>[number];
    const logs: ClassRow[] = (c.classes ?? [])
      .filter((k: ClassRow) => k.status !== "Cancelled")
      .slice()
      .sort((a: ClassRow, b: ClassRow) => String(b.date).localeCompare(String(a.date)));
    const covered = new Set<number>();
    for (const k of logs) {
      const from = k.contentCovered?.fromLesson;
      const to = k.contentCovered?.toLesson ?? from;
      if (typeof from === "number" && typeof to === "number") {
        for (let n = from; n <= to; n++) covered.add(n);
      } else if (typeof from === "number") {
        covered.add(from);
      }
    }
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
      completed: Boolean(c.completed),
      enrollmentDeadline: c.enrollmentDeadline ?? "",
      enrolled,
      remaining: c.seats ? Math.max(0, c.seats - enrolled) : null,
      lessons: c.lessons ?? [],
      topics: c.topics ?? [],
      totalLessons: c.totalLessons ?? 0,
      totalClassesPlanned: c.totalClassesPlanned ?? 0,
      completedClassesCount: c.completedClassesCount ?? 0,
      classesHeld: logs.length,
      classLog: logs.slice(0, 12).map((k) => ({
        classId: k.classId,
        date: k.date,
        time: k.time,
        topic: k.contentCovered?.topic || undefined,
        summary: k.contentCovered?.summary || undefined,
        fromLesson: k.contentCovered?.fromLesson,
        toLesson: k.contentCovered?.toLesson,
      })),
      // Which lessons the log shows as already covered, for the roadmap ticks.
      coveredLessons: [...covered].sort((a, b) => a - b),
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
  if (course.completed) {
    return { ok: false, code: "closed", message: "এই কোর্সের ভর্তি বন্ধ হয়ে গেছে।" };
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

/**
 * Remove an enrollment entirely, and take the student off the course if this
 * was the only thing putting them there.
 *
 * Used when a payment turns out to be a mistake, a duplicate submission, or
 * the wrong course. Rejecting keeps the row as a record; this erases it, which
 * is why the admin page asks for confirmation first.
 */
export async function deleteCourseEnrollment(
  id: string,
  alsoRemoveFromStudent: boolean,
): Promise<SubmitResult<{ removedFromCourse: boolean }>> {
  await connectDB();
  const row = await CourseEnrollment.findByIdAndDelete(id);
  if (!row) {
    return { ok: false, code: "invalid", message: "ভর্তির রেকর্ড পাওয়া যায়নি।" };
  }

  let removedFromCourse = false;
  if (alsoRemoveFromStudent) {
    const student = await Student.findOne({ whatsapp: row.whatsapp });
    if (student) {
      const existing = Array.isArray(student.enrolledCourseIds)
        ? (student.enrolledCourseIds as string[])
        : [];
      const next = existing.filter((id2) => id2 !== row.courseId);
      if (next.length !== existing.length) {
        removedFromCourse = true;
        student.enrolledCourseIds = next as never;
        // Keep the singular field pointing at something real.
        if (existing[0] === row.courseId) {
          student.enrolledCourseId = next[0] ?? "";
        }
        await student.save();
      }
    }
  }

  return { ok: true, data: { removedFromCourse } };
}

/**
 * Put a student on a course directly, with no payment step.
 *
 * This is the "already registered, just add them" path: a student who paid in
 * cash, came from another batch, or was added by mistake in the first place
 * should not have to fill in a TrxID form the admin then has to approve. The
 * row is recorded as approved with a note saying the admin added it, so the
 * ledger still shows who is on the course and why.
 */
export async function enrollStudentDirectly(input: {
  courseId: string;
  rollNumber: number;
  note?: string;
}): Promise<SubmitResult<{ alreadyOn: boolean }>> {
  await connectDB();

  const course = await Course.findOne({ courseId: input.courseId });
  if (!course) return { ok: false, code: "invalid", message: "কোর্সটি পাওয়া যায়নি।" };

  const student = await Student.findOne({ rollNumber: input.rollNumber });
  if (!student) return { ok: false, code: "invalid", message: "শিক্ষার্থী পাওয়া যায়নি।" };

  const existing = Array.isArray(student.enrolledCourseIds)
    ? (student.enrolledCourseIds as string[])
    : [];
  if (existing.includes(course.courseId)) {
    return { ok: true, data: { alreadyOn: true } };
  }

  const note = input.note?.trim() || "Admin যোগ করেছেন";
  // No TrxID from a direct add, so use a per-student marker that can never
  // collide with a real bKash transaction id.
  const marker = `ADMIN-${course.courseId}-${student.rollNumber}`;

  await CourseEnrollment.updateOne(
    { courseId: course.courseId, whatsapp: student.whatsapp, trxId: marker },
    {
      $set: {
        courseId: course.courseId,
        courseName: course.courseName,
        name: student.nameEnglish,
        whatsapp: student.whatsapp,
        trxId: marker,
        amount: 0,
        location: student.location ?? "",
        status: "Approved",
        note,
        rollNumber: student.rollNumber,
        decidedAt: new Date(),
      },
    },
    { upsert: true },
  );

  const next = [...existing, course.courseId];
  student.enrolledCourseIds = next as never;
  student.enrolledCourseId = next[0] ?? course.courseId;
  await student.save();

  return { ok: true, data: { alreadyOn: false } };
}
