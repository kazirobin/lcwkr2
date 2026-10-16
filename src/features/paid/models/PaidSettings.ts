import mongoose, { Schema, Document, Model } from "mongoose";

export interface IPaidSettings extends Document {
  waMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

/**
 * Single shared document holding the paid page's admin-set options. There is
 * only ever one row — the server upserts it — so no key is needed.
 */
const PaidSettingsSchema: Schema = new Schema(
  {
    waMessage: { type: String, trim: true, default: "" },
  },
  { timestamps: true }
);

export const PaidSettingsModel: Model<IPaidSettings> =
  mongoose.models.PaidSettings || mongoose.model<IPaidSettings>("PaidSettings", PaidSettingsSchema);

export default PaidSettingsModel;
