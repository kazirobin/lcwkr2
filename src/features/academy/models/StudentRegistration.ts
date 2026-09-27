import mongoose, { Schema, model, models } from "mongoose";

/**
 * A paid student-account registration (৳500). The form on /register used to
 * only open a WhatsApp message, so nothing was stored and the admin had to
 * retype everything. Each submission now lands here as a pending row that the
 * admin approves into a real Student account.
 */
export interface IStudentRegistrationDoc {
  name: string;
  whatsapp: string;
  trxId: string;
  location: string;
  /** BDT actually sent, captured so the fee can change without rewriting history. */
  amount: number;
  status: "Pending" | "Approved" | "Rejected";
  note: string;
  /** Roll number of the Student created from this row, once approved. */
  rollNumber?: number | null;
  decidedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const StudentRegistrationSchema = new Schema<IStudentRegistrationDoc>(
  {
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, index: true, trim: true },
    trxId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    location: { type: String, default: "", trim: true },
    amount: { type: Number, default: 500, min: 0 },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    note: { type: String, default: "", trim: true },
    rollNumber: { type: Number, default: null },
    decidedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const StudentRegistration =
  models.StudentRegistration ||
  model<IStudentRegistrationDoc>("StudentRegistration", StudentRegistrationSchema);
export default StudentRegistration;
