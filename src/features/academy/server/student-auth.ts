// Student account auth — mobile number + password.
// Session lives client-side (localStorage); every sensitive call re-checks
// approval server-side by phone, so there is no token to steal.
import { connectDB } from "@/lib/db";
import { DEFAULT_STUDENT_PASSWORD, hashPassword, verifyPassword } from "@/lib/student-auth";
import { Student } from "@/features/academy/models";
import { normalizePhone } from "./dialogues";

export type PublicStudent = {
  rollNumber: number;
  nameEnglish: string;
  whatsapp: string;
  isWhatsAppGroupJoined: boolean;
  isPro: boolean;
  location: string;
  avatarUrl?: string;
  enrolledCourseId: string;
  registrationStatus: string;
};

export function toPublicStudent(doc: {
  rollNumber: number;
  nameEnglish: string;
  whatsapp: string;
  isWhatsAppGroupJoined: boolean;
  isPro?: boolean;
  location: string;
  avatarUrl?: string;
  enrolledCourseId: string;
  registrationStatus: string;
}): PublicStudent {
  return {
    rollNumber: doc.rollNumber,
    nameEnglish: doc.nameEnglish,
    whatsapp: doc.whatsapp,
    isWhatsAppGroupJoined: doc.isWhatsAppGroupJoined,
    isPro: !!doc.isPro,
    location: doc.location,
    avatarUrl: doc.avatarUrl,
    enrolledCourseId: doc.enrolledCourseId,
    registrationStatus: doc.registrationStatus,
  };
}

async function findByPhone(phone: string) {
  await connectDB();
  const norm = normalizePhone(phone);
  if (!norm) return null;
  const all = await Student.find({})
    .select(
      "nameEnglish whatsapp registrationStatus passwordHash isPro isWhatsAppGroupJoined location avatarUrl enrolledCourseId rollNumber",
    )
    .lean();
  const hit = all.find((s) => normalizePhone(s.whatsapp) === norm);
  return hit ?? null;
}

/** Approved students only. Upgrades default-password logins to a hash. */
export async function verifyStudentLogin(
  phone: string,
  password: string,
): Promise<{ ok: true; student: PublicStudent } | { ok: false; error: string }> {
  const norm = normalizePhone(phone);
  if (!norm) return { ok: false, error: "সঠিক মোবাইল নম্বর দিন।" };
  const doc = await findByPhone(norm);
  if (!doc || doc.registrationStatus !== "Approved") {
    return { ok: false, error: "এই নম্বরে কোনো approved account নেই।" };
  }
  const ok = await verifyPassword(password, doc.passwordHash ?? "");
  if (!ok) return { ok: false, error: "ভুল পাসওয়ার্ড।" };
  // First login with the default password → store a real hash.
  if (!doc.passwordHash) {
    await Student.updateOne(
      { _id: doc._id },
      { passwordHash: await hashPassword(DEFAULT_STUDENT_PASSWORD) },
    );
  }
  return { ok: true, student: toPublicStudent(doc) };
}

export async function changeStudentPassword(
  phone: string,
  currentPassword: string,
  newPassword: string,
): Promise<{ ok: true } | { ok: false; error: string }> {
  const norm = normalizePhone(phone);
  const next = String(newPassword ?? "").trim();
  if (!norm) return { ok: false, error: "সঠিক মোবাইল নম্বর দিন।" };
  if (next.length < 4) return { ok: false, error: "নতুন পাসওয়ার্ড কমপক্ষে ৪ অক্ষরের হতে হবে।" };
  if (next.length > 72) return { ok: false, error: "পাসওয়ার্ড অনেক বড়।" };
  const doc = await findByPhone(norm);
  if (!doc || doc.registrationStatus !== "Approved") {
    return { ok: false, error: "Account পাওয়া যায়নি।" };
  }
  const ok = await verifyPassword(currentPassword, doc.passwordHash ?? "");
  if (!ok) return { ok: false, error: "বর্তমান পাসওয়ার্ড ভুল।" };
  await Student.updateOne({ _id: doc._id }, { passwordHash: await hashPassword(next) });
  return { ok: true };
}

/** Fresh public profile (Pro/status changes reflect immediately). */
export async function getPublicStudent(
  phone: string,
): Promise<{ ok: true; student: PublicStudent } | { ok: false; error: string }> {
  const doc = await findByPhone(phone);
  if (!doc || doc.registrationStatus !== "Approved") {
    return { ok: false, error: "Account পাওয়া যায়নি।" };
  }
  return { ok: true, student: toPublicStudent(doc) };
}
