import mongoose, { Schema, model, models } from "mongoose";

export interface IEnrollmentDoc {
  courseId: string;
  name: string;
  whatsapp: string;
  trxId: string;
  location: string;
  note?: string;
  createdAt: Date;
  updatedAt: Date;
}

const EnrollmentSchema = new Schema<IEnrollmentDoc>(
  {
    courseId: { type: String, required: true, index: true },
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true },
    trxId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    location: { type: String, default: "", trim: true },
    note: { type: String, default: "", trim: true },
  },
  { timestamps: true },
);

export const Enrollment = models.Enrollment || model<IEnrollmentDoc>("Enrollment", EnrollmentSchema);
export default Enrollment;