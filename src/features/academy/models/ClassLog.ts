import mongoose, { Schema, model, models } from "mongoose";

export interface IClassLogDoc {
  courseId: string;
  classId: string;
  date: string;
  time: string;
  contentCovered: {
    summary: string;
    fromLesson: number;
    fromText: number;
    toLesson: number;
    toText: number;
  };
  presentStudents: number[];
  absentStudents: number[];
  approvalStatus: "Pending" | "Approved" | "Rejected";
  submittedBy: string;
  createdAt: Date;
}

const ClassLogSchema = new Schema<IClassLogDoc>(
  {
    courseId: { type: String, required: true },
    classId: { type: String, required: true },
    date: { type: String, required: true },
    time: { type: String, required: true },
    contentCovered: {
      summary: String,
      fromLesson: Number,
      fromText: Number,
      toLesson: Number,
      toText: Number,
    },
    presentStudents: [Number],
    absentStudents: [Number],
    approvalStatus: {
      type: String,
      enum: ["Pending", "Approved", "Rejected"],
      default: "Pending",
    },
    submittedBy: { type: String, default: "Teacher" },
  },
  { timestamps: true }
);

export const ClassLog = models.ClassLog || model<IClassLogDoc>("ClassLog", ClassLogSchema);
export default ClassLog;
