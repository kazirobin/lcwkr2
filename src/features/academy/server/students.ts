import { connectDB } from "@/lib/db";
import { Student, Course } from "@/features/academy/models";

/** Data-access + business rules for academy students. Route handlers own
 *  request parsing, passcode checks, and HTTP status mapping. */

/**
 * Every scholar's phone number is a personal detail, and this list is served to
 * anonymous visitors. So the number is left out of the projection entirely and
 * only handed over when a caller proves they are an admin — the old behaviour
 * sent the real number to everyone and merely covered it up on screen, which
 * meant the digits were still in the JSON for anyone to copy out of devtools.
 */
export async function listStudents(status: string, includeContact = false) {
  await connectDB();
  // Never leak password hashes to list consumers.
  const projection = includeContact ? "-passwordHash" : "-passwordHash -whatsapp";
  return Student.find(
    status === "All" ? {} : { registrationStatus: status },
  )
    .select(projection)
    .sort({ rollNumber: 1 });
}

export async function getStudentWithCourses(roll: string) {
  await connectDB();
  const student = await Student.findOne({ rollNumber: Number(roll) }).select(
    "-passwordHash",
  );
  if (!student) return null;
  const courses = await Course.find({ courseId: student.enrolledCourseId });
  return { student, courses };
}

export type StudentApprovalResult =
  | { kind: "approved"; student: unknown }
  | { kind: "deleted"; targetRoll: number }
  | { kind: "not-found" }
  | { kind: "invalid" };

export async function setStudentApproval(
  rollNumber: unknown,
  action: string,
): Promise<StudentApprovalResult> {
  await connectDB();
  const targetRoll = Number(rollNumber);

  if (action === "APPROVE") {
    const student = await Student.findOneAndUpdate(
      { rollNumber: targetRoll },
      { registrationStatus: "Approved" },
      { new: true },
    );
    return { kind: "approved", student };
  }

  if (action === "REJECT" || action === "DELETE") {
    const deletedStudent = await Student.findOneAndDelete({ rollNumber: targetRoll });
    if (!deletedStudent) return { kind: "not-found" };
    await Student.updateMany(
      { rollNumber: { $gt: targetRoll } },
      { $inc: { rollNumber: -1 } },
    );
    return { kind: "deleted", targetRoll };
  }

  return { kind: "invalid" };
}

export async function setStudentGroupJoined(
  rollNumber: unknown,
  isWhatsAppGroupJoined: unknown,
) {
  await connectDB();
  return Student.findOneAndUpdate(
    { rollNumber },
    { isWhatsAppGroupJoined: Boolean(isWhatsAppGroupJoined) },
    { new: true },
  );
}

export async function setStudentPro(rollNumber: unknown, isPro: unknown) {
  await connectDB();
  return Student.findOneAndUpdate(
    { rollNumber },
    { isPro: Boolean(isPro) },
    { new: true },
  );
}

export type RegisterStudentInput = {
  nameEnglish: string;
  whatsapp: string;
  location?: string;
  avatarUrl?: string;
  enrolledCourseId: string;
};

export type RegisterStudentResult =
  | { kind: "created"; student: unknown }
  | { kind: "course-not-open"; nextBatchDate: string };

export async function registerStudent(
  input: RegisterStudentInput,
): Promise<RegisterStudentResult> {
  const { nameEnglish, whatsapp, location, avatarUrl, enrolledCourseId } = input;

  await connectDB();

  const targetCourse = await Course.findOne({ courseId: enrolledCourseId });

  const regOpen =
    targetCourse?.registrationOpen === true &&
    (!targetCourse.registrationLastDate ||
      targetCourse.registrationLastDate >=
        new Date().toISOString().slice(0, 10));

  if (!regOpen) {
    return {
      kind: "course-not-open",
      nextBatchDate:
        targetCourse?.nextBatchRegistrationDate || "TBA",
    };
  }

  await Student.deleteMany({ whatsapp });

  const maxRollStudent = await Student.findOne({}).sort({ rollNumber: -1 });
  const nextRoll = maxRollStudent ? maxRollStudent.rollNumber + 1 : 1;

  const student = await Student.create({
    rollNumber: nextRoll,
    nameEnglish,
    whatsapp,
    isWhatsAppGroupJoined: false,
    location: location || "Dhaka, Bangladesh",
    avatarUrl:
      avatarUrl ||
      `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(nameEnglish)}`,
    enrolledCourseId,
    registrationStatus: "Pending",
  });

  return { kind: "created", student };
}

/** Admin: set a student's enrolled courses (supports multiple). */
export async function setStudentCourses(rollNumber: unknown, courseIds: string[]) {
  await connectDB();
  const clean = [...new Set(courseIds.map((c) => String(c).trim()).filter(Boolean))];
  const student = await Student.findOneAndUpdate(
    { rollNumber: Number(rollNumber) },
    { enrolledCourseIds: clean, enrolledCourseId: clean[0] ?? undefined },
    { new: true },
  );
  return student;
}
