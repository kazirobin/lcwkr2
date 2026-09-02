import { connectDB } from "@/lib/db";
import { Student, Course } from "@/features/academy/models";

/** Data-access + business rules for academy students. Route handlers own
 *  request parsing, passcode checks, and HTTP status mapping. */

export async function listStudents(status: string) {
  await connectDB();
  return Student.find(
    status === "All" ? {} : { registrationStatus: status },
  ).sort({ rollNumber: 1 });
}

export async function getStudentWithCourses(roll: string) {
  await connectDB();
  const student = await Student.findOne({ rollNumber: Number(roll) });
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
  if (!targetCourse || targetCourse.status !== "Coming Soon") {
    return {
      kind: "course-not-open",
      nextBatchDate: targetCourse?.nextBatchRegistrationDate || "TBA",
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
