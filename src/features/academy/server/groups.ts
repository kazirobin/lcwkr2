// Study groups — admin pairs students (e.g. roll 2–30) for next-class prep,
// and enrolled students can create/join their own open study groups.
import { connectDB } from "@/lib/db";
import { StudyGroup, Student, Course } from "@/features/academy/models";

export async function listStudyGroups(courseId?: string) {
  await connectDB();
  const filter = courseId && courseId.trim() ? { courseId } : {};
  const docs = await StudyGroup.find(filter).sort({ createdAt: 1 }).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export async function createStudyGroup(
  courseId: string,
  label: string,
  memberRolls: number[],
  createdByRoll?: number,
) {
  await connectDB();
  const created = await StudyGroup.create({
    courseId,
    label: label.trim(),
    memberRolls: Array.from(new Set(memberRolls)),
    ...(createdByRoll ? { createdByRoll } : {}),
  });
  return { ...created.toObject(), _id: created._id.toString() };
}

export async function updateStudyGroup(
  id: string,
  label: string,
  memberRolls: number[],
) {
  await connectDB();
  const updated = await StudyGroup.findByIdAndUpdate(
    id,
    { label: label.trim(), memberRolls },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Group not found.");
  return { ...updated, _id: updated._id.toString() };
}

export async function deleteStudyGroup(id: string) {
  await connectDB();
  await StudyGroup.findByIdAndDelete(id);
  return true;
}

/** Is `roll` an approved student enrolled in `courseId`? */
export async function findEnrolledStudent(roll: unknown, courseId: string) {
  await connectDB();
  const target = Number(roll);
  if (!Number.isFinite(target) || target <= 0) return null;
  const student = await Student.findOne({ rollNumber: target }).lean();
  if (!student || student.registrationStatus !== "Approved") return null;
  const enrolled = String(student.enrolledCourseId ?? "").trim();
  if (!enrolled || enrolled.toLowerCase() !== courseId.toLowerCase()) return null;
  return { rollNumber: student.rollNumber, nameEnglish: student.nameEnglish };
}

/** Does `courseId` actually exist? */
export async function courseExists(courseId: string) {
  await connectDB();
  const c = await Course.findOne({ courseId }).lean();
  return Boolean(c);
}

/** Resolve a group by id, mapping _id to string. */
export async function getStudyGroup(id: string) {
  await connectDB();
  const g = await StudyGroup.findById(id).lean();
  if (!g) throw new Error("Group not found.");
  return { ...g, _id: g._id.toString() };
}

/** Already a member of any group in this course? (one open group per student per course) */
export async function memberOfCourseGroup(roll: number, courseId: string) {
  await connectDB();
  return StudyGroup.exists({ courseId, memberRolls: roll });
}

export async function joinStudyGroup(id: string, roll: number) {
  await connectDB();
  const group = await StudyGroup.findById(id);
  if (!group) throw new Error("Group not found.");
  const rolls = group.memberRolls ?? [];
  if (rolls.includes(roll)) throw new Error("You are already in this group.");
  group.memberRolls = [...rolls, roll];
  await group.save();
  return { ...group.toObject(), _id: group._id.toString() };
}

export async function leaveStudyGroup(id: string, roll: number) {
  await connectDB();
  const group = await StudyGroup.findById(id);
  if (!group) throw new Error("Group not found.");
  const rolls = (group.memberRolls ?? []).filter((r: number) => r !== roll);
  group.memberRolls = rolls;
  await group.save();
  return { ...group.toObject(), _id: group._id.toString() };
}