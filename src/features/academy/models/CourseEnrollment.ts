import { Schema, model, models } from "mongoose";

/**
 * A student paying a course's seat fee. A course has to be launched before
 * anyone can enroll, and the fee it was launched with is copied onto the row
 * so a later price change never rewrites what someone actually paid.
 */
export interface ICourseEnrollmentDoc {
  courseId: string;
  /** Course name at the time of enrolling, for history that survives a rename. */
  courseName: string;
  name: string;
  whatsapp: string;
  trxId: string;
  /** BDT sent, copied from the course fee. */
  amount: number;
  location: string;
  status: "Pending" | "Approved" | "Rejected";
  note: string;
  /** True once the student has used up the course's free trial classes. */
  freeClassesUsed: boolean;
  rollNumber?: number | null;
  decidedAt?: Date | null;
  createdAt: Date;
  updatedAt: Date;
}

const CourseEnrollmentSchema = new Schema<ICourseEnrollmentDoc>(
  {
    courseId: { type: String, required: true, index: true, trim: true },
    courseName: { type: String, default: "" },
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, index: true, trim: true },
    trxId: { type: String, required: true, unique: true, uppercase: true, trim: true },
    amount: { type: Number, default: 0, min: 0 },
    location: { type: String, default: "", trim: true },
    status: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    note: { type: String, default: "", trim: true },
    freeClassesUsed: { type: Boolean, default: false },
    rollNumber: { type: Number, default: null },
    decidedAt: { type: Date, default: null },
  },
  { timestamps: true },
);

export const CourseEnrollment =
  models.CourseEnrollment ||
  model<ICourseEnrollmentDoc>("CourseEnrollment", CourseEnrollmentSchema);
export default CourseEnrollment;
