import mongoose, { Schema, Document, Model } from "mongoose";
import { CLASS_SLOTS, HOMEWORK_SLOTS } from "../lib";

export interface IPaidEntry extends Document {
  name: string;
  whatsapp?: string;
  address?: string;
  occupation?: string;
  dateOfBirth?: string;
  details?: string;
  hskLevel?: string;
  classMarks?: boolean[];
  homeworkMarks?: boolean[];
  createdAt: Date;
  updatedAt: Date;
}

const PaidEntrySchema: Schema = new Schema(
  {
    name: {
      type: String,
      required: [true, "Name is required"],
      trim: true,
    },
    whatsapp: { type: String, trim: true, default: "" },
    address: { type: String, trim: true, default: "" },
    occupation: { type: String, trim: true, default: "" },
    dateOfBirth: { type: String, trim: true, default: "" },
    details: { type: String, trim: true, default: "" },
    hskLevel: { type: String, trim: true, default: "" },
    // One cell per class / homework. Set by the admin from the /paid page
    // (toggle grid, individually or in bulk) — see the marks routes.
    classMarks: { type: [Boolean], default: () => Array(CLASS_SLOTS).fill(false) },
    homeworkMarks: { type: [Boolean], default: () => Array(HOMEWORK_SLOTS).fill(false) },
  },
  { timestamps: true }
);

const PaidEntry: Model<IPaidEntry> =
  mongoose.models.PaidEntry || mongoose.model<IPaidEntry>("PaidEntry", PaidEntrySchema);

export { PaidEntry };
export default PaidEntry;
