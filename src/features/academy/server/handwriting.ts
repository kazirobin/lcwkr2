// Handwritten-homework photos — only Approved students may submit; a
// submission is visible only to its submitter (by phone) + admin, and the
// admin marks the whole photo set by hand, 0–10, after looking at it.
import { connectDB } from "@/lib/db";
import { HandwritingSubmission, Student } from "@/features/academy/models";
import type { IHandwritingImage } from "@/features/academy/models/HandwritingSubmission";
import { findApprovedStudentByPhone, normalizePhone } from "./dialogues";

/** Per-lesson cap, mirroring the model validator. */
export const MAX_PHOTOS = 8;

export type HandwritingImageInput = { url: string; publicId?: string };

export type HandwritingSubmissionInput = {
  name: string;
  phone: string;
  level: number;
  lesson: number;
  images: HandwritingImageInput[];
};

function cleanImages(raw: unknown): IHandwritingImage[] {
  if (!Array.isArray(raw) || raw.length === 0) throw new Error("At least one photo is required.");
  if (raw.length > MAX_PHOTOS) {
    throw new Error(`Maximum ${MAX_PHOTOS} photos per lesson.`);
  }
  return raw.map((item) => {
    const entry = (item ?? {}) as { url?: unknown; publicId?: unknown };
    const url = String(entry.url ?? "").trim();
    if (!/^https:\/\/res\.cloudinary\.com\//.test(url)) {
      throw new Error("Invalid image URL.");
    }
    return { url, publicId: String(entry.publicId ?? "").trim() };
  });
}

function assertApproved(phone: string) {
  const norm = normalizePhone(phone);
  if (!norm || norm.length < 10) throw new Error("Valid mobile number is required.");
  return norm;
}

export async function createHandwritingSubmission(input: HandwritingSubmissionInput) {
  const name = input.name.trim();
  const norm = assertApproved(input.phone);
  const level = Number(input.level);
  const lesson = Number(input.lesson);
  if (!name) throw new Error("Name is required.");
  if (!Number.isFinite(level) || level < 1 || level > 6) throw new Error("Invalid level.");
  if (!Number.isFinite(lesson) || lesson < 1) throw new Error("Invalid lesson.");
  const images = cleanImages(input.images);

  const student = await findApprovedStudentByPhone(norm);
  if (!student) {
    throw new Error("Student list-এ এই নম্বর নেই — শুধু approved student পাঠাতে পারবে।");
  }

  await connectDB();
  const created = await HandwritingSubmission.create({
    name,
    whatsapp: norm,
    level,
    lesson,
    images,
    mark: null,
    feedback: "",
    status: "Pending",
  });
  return { ...created.toObject(), _id: created._id.toString() };
}

/** One student's own submissions (privacy: filtered by phone). */
export async function listHandwritingByPhone(phone: string) {
  const norm = normalizePhone(phone);
  if (!norm) return [];
  await connectDB();
  const docs = await HandwritingSubmission.find({ whatsapp: norm })
    .sort({ createdAt: -1 })
    .lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

/** Every non-archived submission — admin console only (route gates passcode).
 *  Joins rollNumber so admin can jump to the student's profile. */
export async function listAllHandwriting() {
  await connectDB();
  const docs = await HandwritingSubmission.find({ adminHidden: { $ne: true } })
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

/** Student appends more photos to their OWN lesson submission.
 *  A re-submission resets the mark — the new photos need a fresh review. */
export async function appendHandwritingImages(
  id: string,
  phone: string,
  rawImages: unknown,
) {
  await connectDB();
  const doc = await HandwritingSubmission.findById(id).lean();
  if (!doc) throw new Error("Submission not found.");
  const norm = normalizePhone(phone);
  if (!norm || norm !== doc.whatsapp) throw new Error("Forbidden.");
  const images = cleanImages(rawImages);
  if (doc.images.length + images.length > MAX_PHOTOS) {
    throw new Error(`Maximum ${MAX_PHOTOS} photos per lesson.`);
  }
  const updated = await HandwritingSubmission.findByIdAndUpdate(
    id,
    {
      $push: { images: { $each: images } },
      // New photos → back to the queue for the admin.
      $set: { status: "Pending", mark: null },
    },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Submission not found.");
  return { ...updated, _id: updated._id.toString() };
}

/** Student drops ONE photo from their own submission; removing the last
 *  photo removes the whole submission. */
export async function removeOwnHandwritingImage(id: string, phone: string, index: number) {
  await connectDB();
  const doc = await HandwritingSubmission.findById(id).lean();
  if (!doc) throw new Error("Submission not found.");
  const norm = normalizePhone(phone);
  if (!norm || norm !== doc.whatsapp) throw new Error("Forbidden.");
  const i = Number(index);
  if (!Number.isInteger(i) || i < 0 || i >= doc.images.length) {
    throw new Error("Invalid photo.");
  }
  if (doc.images.length === 1) {
    await HandwritingSubmission.findByIdAndDelete(id);
    return { deleted: true as const };
  }
  // Replace the array by index — a $pull on `url` would also drop any
  // duplicate the student happened to send twice.
  const images: IHandwritingImage[] = (doc.images as IHandwritingImage[]).filter(
    (_img, idx) => idx !== Number(index),
  );
  const updated = await HandwritingSubmission.findByIdAndUpdate(
    id,
    { $set: { images } },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Submission not found.");
  return { deleted: false as const, submission: { ...updated, _id: updated._id.toString() } };
}

export async function markHandwritingSubmission(
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
  const updated = await HandwritingSubmission.findByIdAndUpdate(id, update, {
    new: true,
  }).lean();
  if (!updated) throw new Error("Submission not found.");
  return { ...updated, _id: updated._id.toString() };
}

/** Admin "delete" = archive from the admin queue ONLY.
 *  The photos, mark and comment stay visible to the student. */
export async function archiveHandwritingSubmission(id: string) {
  await connectDB();
  const updated = await HandwritingSubmission.findByIdAndUpdate(
    id,
    { adminHidden: true },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Submission not found.");
  return { ...updated, _id: updated._id.toString() };
}

/** Student deletes their OWN submission (phone must match the record). */
export async function deleteOwnHandwriting(id: string, phone: string) {
  await connectDB();
  const doc = await HandwritingSubmission.findById(id).lean();
  if (!doc) throw new Error("Submission not found.");
  const norm = normalizePhone(phone);
  if (!norm || norm !== doc.whatsapp) throw new Error("Forbidden.");
  await HandwritingSubmission.findByIdAndDelete(id);
  return true;
}
