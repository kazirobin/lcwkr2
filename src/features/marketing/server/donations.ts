import mongoose, { Schema, Document, Model } from "mongoose";
import connectDB from "@/lib/db";

export interface IDonation extends Document {
  name: string;
  phone: string;
  location: string;
  trxId: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
}

const DonationSchema = new Schema<IDonation>(
  {
    name: { type: String, required: true, trim: true },
    phone: { type: String, required: true, trim: true },
    location: { type: String, default: "Bangladesh", trim: true },
    trxId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    amount: { type: Number, default: 200 },
  },
  {
    timestamps: true,
  }
);

export const DonationModel: Model<IDonation> =
  mongoose.models.Donation || mongoose.model<IDonation>("Donation", DonationSchema);

export async function getAllDonations() {
  await connectDB();
  const docs = await DonationModel.find({}).sort({ createdAt: -1 }).lean();
  return docs.map((d) => ({
    ...d,
    _id: d._id.toString(),
  }));
}

export async function createDonation(data: {
  name: string;
  phone: string;
  location?: string;
  trxId: string;
  amount?: number;
}) {
  await connectDB();
  const cleanTrxId = data.trxId.trim().toUpperCase();

  const existing = await DonationModel.findOne({ trxId: cleanTrxId });
  if (existing) {
    throw new Error("This TrxID has already been submitted.");
  }

  const doc = await DonationModel.create({
    name: data.name.trim(),
    phone: data.phone.trim(),
    location: (data.location || "Bangladesh").trim(),
    trxId: cleanTrxId,
    amount: Number(data.amount) || 200,
  });

  return {
    ...doc.toObject(),
    _id: doc._id.toString(),
  };
}

export async function updateDonation(
  id: string,
  data: {
    name?: string;
    phone?: string;
    location?: string;
    trxId?: string;
    amount?: number;
  }
) {
  await connectDB();
  const updated = await DonationModel.findByIdAndUpdate(
    id,
    {
      ...(data.name && { name: data.name.trim() }),
      ...(data.phone && { phone: data.phone.trim() }),
      ...(data.location && { location: data.location.trim() }),
      ...(data.trxId && { trxId: data.trxId.trim().toUpperCase() }),
      ...(data.amount !== undefined && { amount: Number(data.amount) }),
    },
    { new: true }
  ).lean();

  if (!updated) {
    throw new Error("Donation record not found.");
  }

  return {
    ...updated,
    _id: updated._id.toString(),
  };
}

export async function deleteDonation(id: string) {
  await connectDB();
  const deleted = await DonationModel.findByIdAndDelete(id);
  if (!deleted) {
    throw new Error("Donation record not found.");
  }
  return true;
}