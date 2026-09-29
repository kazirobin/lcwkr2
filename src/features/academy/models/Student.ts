import mongoose, { Schema, model, models } from "mongoose";

export interface IStudentDoc {
  rollNumber: number;
  nameEnglish: string;
  whatsapp: string;
  isWhatsAppGroupJoined: boolean;
  /** Pro subscriber (marked from /admin/students) — shows a Pro badge. */
  isPro: boolean;
  location: string;
  avatarUrl?: string;
  enrolledCourseId: string; // একজন শিক্ষার্থী একটিমাত্র কোর্স করতে পারবে
  /** Every course the student is on. `enrolledCourseId` stays the first one for
   *  the older readers; this is the list the admin actually edits. It was being
   *  written but not declared, so Mongoose dropped it and multi-course
   *  enrolment silently reverted to a single course. */
  enrolledCourseIds: string[];
  registrationStatus: "Pending" | "Approved" | "Rejected";
  /** scrypt hash (`scrypt:salt:hash`). Empty = never set (default password works once, then upgrades). */
  passwordHash: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSchema = new Schema<IStudentDoc>(
  {
    rollNumber: { type: Number, required: true, unique: true },
    nameEnglish: { type: String, required: true },
    whatsapp: { type: String, required: true, index: true },
    isWhatsAppGroupJoined: { type: Boolean, default: false },
    isPro: { type: Boolean, default: false, index: true },
    location: { type: String, default: "Dhaka, Bangladesh" },
    avatarUrl: { type: String },
    /* Not `required`, because a student on no courses is a real state — it is
       what you get after the last enrollment is taken away, and it is what a
       student who has paid but not yet been seated is. With `required: true`
       clearing the field threw a validation error, so deleting the final
       course left the save half-applied: the enrollment row was already gone
       and the student record was left behind, stuck. Every path that creates a
       student still passes a real course id, so nothing is lost. */
    enrolledCourseId: { type: String, default: "" },
    enrolledCourseIds: { type: [String], default: [] },
    registrationStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
      index: true,
    },
    passwordHash: { type: String, default: "" },
  },
  { timestamps: true }
);

export const Student = models.Student || model<IStudentDoc>("Student", StudentSchema);
export default Student;
