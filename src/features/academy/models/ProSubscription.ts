import { Schema, model, models } from "mongoose";

/**
 * A paid Pro subscription, currently ৳500 for life.
 *
 * Pro used to be a localStorage flag with no record of who paid, so there was
 * no way to answer "who has Pro" or to switch it off for someone. Each payment
 * is a row the admin confirms, and confirming it sets `isPro` on the student's
 * account. `expiresAt` stays null for a lifetime purchase but is kept so a
 * term-based plan needs no schema change later.
 */
export interface IProSubscriptionDoc {
  whatsapp: string;
  rollNumber?: number | null;
  name: string;
  trxId: string;
  /** BDT sent, copied in at submission so a price change keeps the history. */
  amount: number;
  status: "Pending" | "Active" | "Rejected";
  note: string;
  /** Null means lifetime. */
  expiresAt?: Date | null;
  activatedAt?: Date | null;
  decidedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const ProSubscriptionSchema = new Schema<IProSubscriptionDoc>(
  {
    whatsapp: { type: String, required: true, index: true, trim: true },
    rollNumber: { type: Number, default: null, index: true },
    name: { type: String, default: "" },
    trxId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    amount: { type: Number, default: 500, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Active", "Rejected"],
      default: "Pending",
      index: true,
    },
    note: { type: String, default: "", trim: true },
    expiresAt: { type: Date, default: null },
    activatedAt: { type: Date, default: null },
    decidedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const ProSubscription =
  models.ProSubscription || model<IProSubscriptionDoc>("ProSubscription", ProSubscriptionSchema);
export default ProSubscription;
