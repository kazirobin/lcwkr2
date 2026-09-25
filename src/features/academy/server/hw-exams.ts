// Homework exam scoreboard — synced when a logged-in student submits.
import { connectDB } from "@/lib/db";
import { HwExamResult } from "@/features/academy/models";
import { findApprovedStudentByPhone, normalizePhone } from "./dialogues";

export type ExamScoreInput = {
  phone: string;
  level: number;
  lesson: number;
  totalScore: number;
  totalMarks: number;
};

export async function recordExamResult(input: ExamScoreInput) {
  const norm = normalizePhone(input.phone);
  const level = Number(input.level);
  const lesson = Number(input.lesson);
  const totalScore = Number(input.totalScore);
  const totalMarks = Number(input.totalMarks);
  if (!norm || norm.length < 10) throw new Error("Valid mobile number is required.");
  if (!Number.isFinite(level) || level < 1 || level > 6) throw new Error("Invalid level.");
  if (!Number.isFinite(lesson) || lesson < 1) throw new Error("Invalid lesson.");
  if (!Number.isFinite(totalScore) || totalScore < 0) throw new Error("Invalid score.");
  if (!Number.isFinite(totalMarks) || totalMarks <= 0) throw new Error("Invalid marks.");

  const student = await findApprovedStudentByPhone(norm);
  if (!student) throw new Error("Student list-এ এই নম্বর নেই।");

  await connectDB();
  const prev = await HwExamResult.findOne({ whatsapp: norm, level, lesson }).lean();
  if (!prev) {
    const created = await HwExamResult.create({
      whatsapp: norm,
      name: student.nameEnglish,
      level,
      lesson,
      best: totalScore,
      latest: totalScore,
      attempts: 1,
      totalMarks,
    });
    return { ...created.toObject(), _id: created._id.toString() };
  }
  const updated = await HwExamResult.findOneAndUpdate(
    { whatsapp: norm, level, lesson },
    {
      name: student.nameEnglish,
      best: Math.max(prev.best, totalScore),
      latest: totalScore,
      attempts: prev.attempts + 1,
      totalMarks,
    },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Update failed.");
  return { ...updated, _id: updated._id.toString() };
}

/** One student's per-lesson scoreboard. */
export async function listExamResultsByPhone(phone: string) {
  const norm = normalizePhone(phone);
  if (!norm) return [];
  await connectDB();
  const docs = await HwExamResult.find({ whatsapp: norm })
    .sort({ level: 1, lesson: 1 })
    .lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

/** Everything (admin activity views). */
export async function listAllExamResults() {
  await connectDB();
  const docs = await HwExamResult.find({}).sort({ updatedAt: -1 }).limit(500).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export async function deleteExamResult(id: string) {
  await connectDB();
  await HwExamResult.findByIdAndDelete(id);
  return true;
}
