import { connectDB } from "@/lib/db";
import { ProSubscription, Student } from "@/features/academy/models";
import { normalizePhone, type SubmitResult } from "./registrations";

/**
 * Pro is ৳500 for life. A student sends the money and types the TrxID, the
 * admin confirms, and only then does `isPro` go on their account.
 *
 * The price is held in one place so the payment form, the admin queue and the
 * "join Pro" button can never quote different amounts.
 */

export const PRO_PRICE_BDT = 500;
/** Lifetime: no expiry is ever written. */
export const PRO_PERIOD_DAYS = 0;

export type ProSummary = {
  pending: number;
  active: number;
  price: number;
  lifetime: boolean;
};

export async function listProSubscriptions(status = "Pending") {
  await connectDB();
  return ProSubscription.find(status === "All" ? {} : { status })
    .sort({ createdAt: -1 })
    .lean();
}

export async function proSummary(): Promise<ProSummary> {
  await connectDB();
  const [pending, active] = await Promise.all([
    ProSubscription.countDocuments({ status: "Pending" }),
    ProSubscription.countDocuments({ status: "Active" }),
  ]);
  return { pending, active, price: PRO_PRICE_BDT, lifetime: PRO_PERIOD_DAYS === 0 };
}

export async function submitProSubscription(input: {
  whatsapp: string;
  name: string;
  trxId: string;
}): Promise<SubmitResult<{ id: string }>> {
  await connectDB();

  const whatsapp = normalizePhone(input.whatsapp);
  const trxId = (input.trxId ?? "").trim().toUpperCase();
  if (whatsapp.length < 10 || !trxId) {
    return { ok: false, code: "invalid", message: "মোবাইল নম্বর ও TrxID লিখুন।" };
  }

  const student = await Student.findOne({ whatsapp });
  if (!student) {
    return {
      ok: false,
      code: "invalid",
      message: "প্রথমে ৳৫০০ দিয়ে student account খুলুন, তারপর Pro নিন।",
    };
  }
  if (student.isPro) {
    return { ok: false, code: "exists", message: "আপনি ইতিমধ্যে Pro সদস্য।" };
  }

  const dupeTrx = await ProSubscription.findOne({ trxId });
  if (dupeTrx) {
    return { ok: false, code: "duplicate-trx", message: "এই TrxID আগেই ব্যবহার হয়েছে।" };
  }

  const waiting = await ProSubscription.findOne({ whatsapp, status: "Pending" });
  if (waiting) {
    return { ok: false, code: "exists", message: "আপনার আবেদন ইতিমধ্যে অপেক্ষমাণ আছে।" };
  }

  const created = await ProSubscription.create({
    whatsapp,
    rollNumber: student.rollNumber,
    name: student.nameEnglish,
    trxId,
    amount: PRO_PRICE_BDT,
    status: "Pending",
  });

  return { ok: true, data: { id: created.id } };
}

/** Confirm a payment: set the account's Pro flag and stamp the activation. */
export async function approveProSubscription(id: string): Promise<SubmitResult<{ rollNumber: number | null }>> {
  await connectDB();
  const row = await ProSubscription.findById(id);
  if (!row) return { ok: false, code: "invalid", message: "আবেদন পাওয়া যায়নি।" };
  if (row.status === "Active") {
    return { ok: false, code: "invalid", message: "ইতিমধ্যে চালু করা হয়েছে।" };
  }

  const student = await Student.findOne({ whatsapp: row.whatsapp });
  if (!student) {
    return {
      ok: false,
      code: "invalid",
      message: "এই নম্বরে student account নেই।",
    };
  }

  student.isPro = true;
  await student.save();

  row.status = "Active";
  row.rollNumber = student.rollNumber;
  row.activatedAt = new Date();
  row.decidedAt = new Date();
  await row.save();

  return { ok: true, data: { rollNumber: student.rollNumber } };
}

export async function rejectProSubscription(id: string): Promise<SubmitResult<null>> {
  await connectDB();
  const row = await ProSubscription.findByIdAndUpdate(
    id,
    { $set: { status: "Rejected", decidedAt: new Date() } },
    { new: true },
  );
  if (!row) return { ok: false, code: "invalid", message: "আবেদন পাওয়া যায়নি।" };
  return { ok: true, data: null };
}

/** Switch Pro off for a student who asked to cancel or was refunded. */
export async function revokePro(rollNumber: number): Promise<SubmitResult<null>> {
  await connectDB();
  const student = await Student.findOneAndUpdate(
    { rollNumber },
    { $set: { isPro: false } },
    { new: true },
  );
  if (!student) return { ok: false, code: "invalid", message: "শিক্ষার্থী পাওয়া যায়নি।" };
  return { ok: true, data: null };
}
