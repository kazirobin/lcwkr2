// Hanzi Pro challenge — server-side student registry (MongoDB).

import mongoose, { Schema, Document, Model } from "mongoose";
import connectDB from "@/lib/db";

export interface IHanziProStudent extends Document {
  name: string;
  phone: string;
  trxId: string;
  amount: number;
  learnedCount: number;
  status: "Pending" | "Active";
  createdAt: Date;
  updatedAt: Date;
}

const HanziProStudentSchema = new Schema<IHanziProStudent>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    trxId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    amount: { type: Number, default: 200 },
    learnedCount: { type: Number, default: 0 },
    status: { type: String, enum: ["Pending", "Active"], default: "Pending" },
  },
  { timestamps: true },
);

export const HanziProStudentModel: Model<IHanziProStudent> =
  mongoose.models.HanziProStudent ||
  mongoose.model<IHanziProStudent>("HanziProStudent", HanziProStudentSchema);

export async function getAllHanziProStudents() {
  await connectDB();
  const docs = await HanziProStudentModel.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({ ...d, _id: d._id.toString() }));
}

export async function createHanziProStudent(data: {
  name: string;
  phone: string;
  trxId: string;
  amount?: number;
}) {
  await connectDB();
  const trxId = data.trxId.trim().toUpperCase();

  const existing = await HanziProStudentModel.findOne({ trxId });
  if (existing) {
    throw new Error("This TrxID has already been submitted.");
  }

  const created = await HanziProStudentModel.create({
    name: data.name.trim(),
    phone: data.phone.trim(),
    trxId,
    amount: data.amount ?? 200,
  });
  return { ...created.toObject(), _id: created._id.toString() };
}

export async function updateHanziProStudent(
  id: string,
  patch: { learnedCount?: number; status?: "Pending" | "Active"; name?: string; phone?: string },
) {
  await connectDB();
  const updated = await HanziProStudentModel.findByIdAndUpdate(
    id,
    { $set: patch },
    { new: true },
  ).lean();
  if (!updated) throw new Error("Student not found.");
  return { ...updated, _id: updated._id.toString() };
}

export async function deleteHanziProStudent(id: string) {
  await connectDB();
  const deleted = await HanziProStudentModel.findByIdAndDelete(id);
  if (!deleted) throw new Error("Student not found.");
  return true;
}
