import { connectDB } from "@/lib/db";
import { Student, StudentRegistration } from "@/features/academy/models";
import { normalizePhone } from "./dialogues";

/**
 * The two ways a visitor becomes part of the academy:
 *
 *  1. A ৳500 student-account registration (/register). Previously this only
 *     opened a WhatsApp message, so the admin retyped every field. Now the
 *     submission is a row the admin can approve with one click.
 *  2. A course enrollment, which only opens once the course has been launched
 *     and charges the fee the course was launched with.
 */

export const REGISTRATION_FEE_BDT = 500;

export type SubmitRegistrationInput = {
  name: string;
  whatsapp: string;
  trxId: string;
  location?: string;
};

export type SubmitResult<T> =
  | { ok: true; data: T }
  | { ok: false; code: "invalid" | "duplicate-trx" | "exists" | "not-launched" | "full" | "closed"; message: string };

/**
 * Reduce any of the shapes a phone number arrives in to one local 11-digit
 * string, so a student is found whichever way they typed it.
 *
 * Re-exported from dialogues.ts, which is the single home for this. It used to
 * have its own weaker copy here, and the two disagreed on `+880…`, `00880…`
 * and bare national numbers — which is how an approved Pro payment could
 * silently fail to match the student it was meant to unlock.
 */
export { normalizePhone } from "./dialogues";

export async function listRegistrations(status = "Pending") {
  await connectDB();
  return StudentRegistration.find(status === "All" ? {} : { status })
    .sort({ createdAt: -1 })
    .lean();
}

export async function submitRegistration(
  input: SubmitRegistrationInput,
): Promise<SubmitResult<{ id: string }>> {
  await connectDB();

  const name = input.name?.trim();
  const whatsapp = normalizePhone(input.whatsapp);
  const trxId = (input.trxId ?? "").trim().toUpperCase();

  if (!name || whatsapp.length < 10 || !trxId) {
    return { ok: false, code: "invalid", message: "নাম, ফোন ও TrxID আবশ্যক।" };
  }

  const dupeTrx = await StudentRegistration.findOne({ trxId });
  if (dupeTrx) {
    return { ok: false, code: "duplicate-trx", message: "এই TrxID আগেই ব্যবহার হয়েছে।" };
  }

  // One open application per number; a rejected row may be replaced.
  const open = await StudentRegistration.findOne({ whatsapp, status: "Pending" });
  if (open) {
    return { ok: false, code: "exists", message: "এই নম্বরে একটি অনুরোধ ইতিমধ্যে আছে।" };
  }

  const created = await StudentRegistration.create({
    name,
    whatsapp,
    trxId,
    location: input.location?.trim() ?? "",
    amount: REGISTRATION_FEE_BDT,
    status: "Pending",
  });

  return { ok: true, data: { id: created.id } };
}

export type RegistrationRow = {
  id: string;
  name: string;
  whatsapp: string;
  trxId: string;
  location: string;
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  note: string;
  createdAt: string;
};

/**
 * Turn an approved registration into a real student account. Kept here rather
 * than in the route so the same rule is used by any future self-approve path.
 */
export async function approveRegistration(
  id: string,
  newRoll: number,
  courseId: string,
): Promise<SubmitResult<{ rollNumber: number }>> {
  await connectDB();
  const row = await StudentRegistration.findById(id);
  if (!row) return { ok: false, code: "invalid", message: "আবেদন পাওয়া যায়নি।" };
  if (row.status === "Approved") {
    return { ok: false, code: "invalid", message: "ইতিমধ্যে অনুমোদিত।" };
  }

  const maxStudent = await Student.findOne({}).sort({ rollNumber: -1 }).select("rollNumber").lean();
  const roll = Math.max(newRoll, (maxStudent?.rollNumber ?? 0) + 1);

  await Student.create({
    rollNumber: roll,
    nameEnglish: row.name,
    whatsapp: row.whatsapp,
    isPro: false,
    enrolledCourseId: courseId,
    registrationStatus: "Approved",
    location: row.location || "Dhaka, Bangladesh",
  });

  row.status = "Approved";
  row.rollNumber = roll;
  row.decidedAt = new Date();
  await row.save();

  return { ok: true, data: { rollNumber: roll } };
}

export async function rejectRegistration(id: string): Promise<SubmitResult<null>> {
  await connectDB();
  const row = await StudentRegistration.findByIdAndUpdate(
    id,
    { $set: { status: "Rejected", decidedAt: new Date() } },
    { new: true },
  );
  if (!row) return { ok: false, code: "invalid", message: "আবেদন পাওয়া যায়নি।" };
  return { ok: true, data: null };
}
