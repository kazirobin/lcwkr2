import { Schema, model, models } from "mongoose";

/**
 * Homework exam scoreboard — one doc per student + lesson.
 * Synced from the hw pages when a logged-in student submits.
 */
export interface IHwExamResultDoc {
  /** Normalized BD mobile: 01XXXXXXXXX. */
  whatsapp: string;
  name: string;
  level: number;
  lesson: number;
  best: number;
  latest: number;
  attempts: number;
  totalMarks: number;
  createdAt: Date;
  updatedAt: Date;
}

const HwExamResultSchema = new Schema<IHwExamResultDoc>(
  {
    whatsapp: { type: String, required: true, trim: true, index: true },
    name: { type: String, required: true, trim: true },
    level: { type: Number, required: true, min: 1, max: 6 },
    lesson: { type: Number, required: true, min: 1 },
    best: { type: Number, required: true, min: 0 },
    latest: { type: Number, required: true, min: 0 },
    attempts: { type: Number, required: true, min: 1 },
    totalMarks: { type: Number, required: true, min: 0 },
  },
  { timestamps: true },
);

HwExamResultSchema.index({ whatsapp: 1, level: 1, lesson: 1 }, { unique: true });

export const HwExamResult =
  models.HwExamResult || model<IHwExamResultDoc>("HwExamResult", HwExamResultSchema);
export default HwExamResult;
