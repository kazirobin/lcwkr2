// Study groups — admin pairs students (e.g. roll 2–30) for next-class prep.
import { connectDB } from "@/lib/db";
import { StudyGroup } from "@/features/academy/models";

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
) {
  await connectDB();
  const created = await StudyGroup.create({
    courseId,
    label: label.trim(),
    memberRolls,
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
