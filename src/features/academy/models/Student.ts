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
    enrolledCourseId: { type: String, required: true },
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
