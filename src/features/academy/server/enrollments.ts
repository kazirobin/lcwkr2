import { connectDB } from "@/lib/db";
import { Enrollment } from "@/features/academy/models";

/** Maximum seats for the upcoming HSK-1 batch. */
export const BATCH_CAPACITY = 20;

export type EnrollmentInput = {
  courseId: string;
  name: string;
  whatsapp: string;
  trxId: string;
  location: string;
  note?: string;
};

export type EnrollmentResult =
  | { kind: "created"; enrolled: number; remaining: number }
  | { kind: "full"; enrolled: number; remaining: number }
  | { kind: "duplicate-trx" };

export async function enrollmentCounts(courseId: string): Promise<{ enrolled: number; capacity: number; remaining: number }> {
  await connectDB();
  const enrolled = await Enrollment.countDocuments({ courseId });
  const capacity = BATCH_CAPACITY;
  return { enrolled, capacity, remaining: Math.max(0, capacity - enrolled) };
}

export async function createEnrollment(input: EnrollmentInput): Promise<EnrollmentResult> {
  const { courseId } = input;
  await connectDB();

  const { enrolled, remaining } = await enrollmentCounts(courseId);
  if (remaining <= 0) return { kind: "full", enrolled, remaining: 0 };

  const existing = await Enrollment.findOne({ trxId: input.trxId.toUpperCase() });
  if (existing) return { kind: "duplicate-trx" };

  await Enrollment.create({
    courseId,
    name: input.name.trim(),
    whatsapp: input.whatsapp.trim(),
    trxId: input.trxId.trim().toUpperCase(),
    location: input.location.trim(),
    note: input.note?.trim() ?? "",
  });

  const after = await enrollmentCounts(courseId);
  return { kind: "created", enrolled: after.enrolled, remaining: after.remaining };
}