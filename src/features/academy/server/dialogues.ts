// Homework dialogue recordings — only Approved students may submit;
// a submission is visible only to its submitter (by phone) + admin.
import { connectDB } from "@/lib/db";
import { DialogueMark, DialogueSubmission } from "@/features/academy/models";
import { Student } from "@/features/academy/models";

/** Normalize BD mobiles to 01XXXXXXXXX for comparison + storage. */
export function normalizePhone(raw: unknown): string {
  const digits = String(raw ?? "").replace(/\D/g, "");
  if (digits.startsWith("880") && digits.length >= 12) return `0${digits.slice(3)}`;
  return digits;
}

export async function findApprovedStudentByPhone(phone: string) {
  await connectDB();
  const norm = normalizePhone(phone);
  if (!norm) return null;
  // Stored numbers may carry +880/880/spaces — compare normalized.
  const candidates = await Student.find({ registrationStatus: "Approved" })
    .select("nameEnglish whatsapp")
    .lean();
  const hit = candidates.find((s) => normalizePhone(s.whatsapp) === norm);
  return hit ?? null;
}

export type DialogueSubmissionInput = {
  name: string;
  phone: string;
  level: number;
  lesson: number;
  audioUrl: string;
  durationSec?: number;
};

export async function createDialogueSubmission(input: DialogueSubmissionInput) {
  const name = input.name.trim();
  const norm = normalizePhone(input.phone);
  const level = Number(input.level);
  const lesson = Number(input.lesson);
  if (!name) throw new Error("Name is required.");
  if (!norm || norm.length < 10) throw new Error("Valid mobile number is required.");
  if (!Number.isFinite(level) || level < 1 || level > 6) throw new Error("Invalid level.");
  if (!Number.isFinite(lesson) || lesson < 1) throw new Error("Invalid lesson.");
  const audioUrl = String(input.audioUrl ?? "").trim();
  if (!/^https:\/\/res\.cloudinary\.com\//.test(audioUrl)) {
    throw new Error("Invalid audio URL.");
  }

  const student = await findApprovedStudentByPhone(norm);
  if (!student) {
    throw new Error("Student list-এ এই নম্বর নেই — শুধু approved student পাঠাতে পারবে।");
  }

  await connectDB();
  const created = await DialogueSubmission.create({
    name,
    whatsapp: norm,
    level,
    lesson,
    audioUrl,
    durationSec: Math.max(0, Math.round(Number(input.durationSec ?? 0))),
    mark: null,
    feedback: "",
    status: "Pending",
  });
  return { ...created.toObject(), _id: created._id.toString() };
}

/** One student's own submissions (privacy: filtered by phone). */
export async function listSubmissionsByPhone(phone: string) {
  const norm = normalizePhone(phone);
  if (!norm) return [];
  await connectDB();
  const docs = await DialogueSubmission.find({ whatsapp: norm })
    .sort({ createdAt: -1 })
    .lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

/** Every non-archived submission — admin console only (route gates passcode).
 *  Joins rollNumber so admin can jump to the student's profile. */
export async function listAllSubmissions() {
  await connectDB();
  const docs = await DialogueSubmission.find({ adminHidden: { $ne: true } })
    .sort({ createdAt: -1 })
    .lean();
  const students = await Student.find({}).select("whatsapp rollNumber").lean();
  const rollByPhone = new Map(
    students.map((s) => [normalizePhone(s.whatsapp), s.rollNumber]),
  );
  return docs.map((d) => ({
    ...d,
    _id: d._id.toString(),
    rollNumber: rollByPhone.get(normalizePhone(d.whatsapp)) ?? null,
  }));
}

export async function markDialogueSubmission(
  id: string,
  patch: { mark?: number; feedback?: string },
) {
  await connectDB();
  const update: Record<string, unknown> = { status: "Marked" };
  if (patch.mark !== undefined) {
    const m = Number(patch.mark);
    if (!Number.isFinite(m) || m < 0 || m > 10) throw new Error("Mark must be 0–10.");
    update.mark = m;
  }
  if (patch.feedback !== undefined) update.feedback = String(patch.feedback).slice(0, 500);
  const updated = await DialogueSubmission.findByIdAndUpdate(id, update, {
    new: true,
  }).lean();
  if (!updated) throw new Error("Submission not found.");
  // Mirror into the marks table (single source for the students directory).
  if (patch.mark !== undefined) {
    await DialogueMark.create({
      name: updated.name,
      whatsapp: updated.whatsapp,
      level: updated.level,
      lesson: updated.lesson,
      mark: Number(patch.mark),
      feedback: typeof patch.feedback === "string" ? patch.feedback.slice(0, 500) : "",
      source: "recording",
      submissionId: updated._id.toString(),
    });
  }
  return { ...updated, _id: updated._id.toString() };
}

export async function deleteDialogueSubmission(id: string) {
  await connectDB();
  await DialogueSubmission.findByIdAndDelete(id);
  return true;
}

/** Admin "delete" = archive from the admin queue ONLY.
 *  The recording, mark and comment stay visible to the student. */
export async function archiveSubmission(id: string) {
  await connectDB();
  const updated = await DialogueSubmission.findByIdAndUpdate(
    id,
    { adminHidden: true },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Submission not found.");
  return { ...updated, _id: updated._id.toString() };
}

/** Student deletes their OWN submission (phone must match the record). */
export async function deleteOwnSubmission(id: string, phone: string) {
  await connectDB();
  const doc = await DialogueSubmission.findById(id).lean();
  if (!doc) throw new Error("Submission not found.");
  const norm = normalizePhone(phone);
  if (!norm || norm !== doc.whatsapp) throw new Error("Forbidden.");
  await DialogueSubmission.findByIdAndDelete(id);
  return true;
}

/* ── manual marks (no recording needed) ── */

export type ManualMarkInput = {
  phone: string;
  level: number;
  lesson: number;
  mark: number;
  feedback?: string;
};

export async function createManualMark(input: ManualMarkInput) {
  const norm = normalizePhone(input.phone);
  if (!norm || norm.length < 10) throw new Error("Valid mobile number is required.");
  const level = Number(input.level);
  const lesson = Number(input.lesson);
  const mark = Number(input.mark);
  if (!Number.isFinite(level) || level < 1 || level > 6) throw new Error("Invalid level.");
  if (!Number.isFinite(lesson) || lesson < 0) throw new Error("Invalid lesson.");
  if (!Number.isFinite(mark) || mark < 0 || mark > 10) throw new Error("Mark must be 0–10.");

  const student = await findApprovedStudentByPhone(norm);
  if (!student) {
    throw new Error("Student list-এ এই নম্বর নেই — শুধু approved student-কে mark দেওয়া যাবে।");
  }

  await connectDB();
  const created = await DialogueMark.create({
    name: student.nameEnglish,
    whatsapp: norm,
    level,
    lesson,
    mark,
    feedback: String(input.feedback ?? "").slice(0, 500),
    source: "manual",
    submissionId: "",
  });
  return { ...created.toObject(), _id: created._id.toString() };
}

export type LatestMark = {
  rollNumber: number;
  name: string;
  mark: number;
  level: number;
  lesson: number;
  source: string;
  updatedAt: string;
};

/** Latest dialogue mark per student, joined to roll numbers for display. */
export async function listLatestMarks(): Promise<LatestMark[]> {
  await connectDB();
  const docs = await DialogueMark.find({}).sort({ createdAt: -1 }).lean();
  const seen = new Set<string>();
  const latest = docs.filter((d) => {
    if (seen.has(d.whatsapp)) return false;
    seen.add(d.whatsapp);
    return true;
  });
  const students = await Student.find({ registrationStatus: "Approved" })
    .select("nameEnglish whatsapp rollNumber")
    .lean();
  const rollByPhone = new Map(
    students.map((s) => [normalizePhone(s.whatsapp), s.rollNumber]),
  );
  return latest.flatMap((d) => {
    const rollNumber = rollByPhone.get(normalizePhone(d.whatsapp));
    if (rollNumber === undefined) return [];
    return [
      {
        rollNumber,
        name: d.name,
        mark: d.mark,
        level: d.level,
        lesson: d.lesson,
        source: d.source,
        updatedAt: d.updatedAt ? new Date(d.updatedAt).toISOString() : "",
      },
    ];
  });
}

/** One student's full mark history (for profile pages). */
export async function listMarksByPhone(phone: string) {
  const norm = normalizePhone(phone);
  if (!norm) return [];
  await connectDB();
  const docs = await DialogueMark.find({ whatsapp: norm }).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

/** Full mark history (admin), newest first. */
export async function listMarkHistory() {
  await connectDB();
  const docs = await DialogueMark.find({}).sort({ createdAt: -1 }).limit(200).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export async function deleteDialogueMark(id: string) {
  await connectDB();
  await DialogueMark.findByIdAndDelete(id);
  return true;
}
