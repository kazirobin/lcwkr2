import { Schema, model, models } from "mongoose";

/**
 * One row per student per day. Tracks daily time spent and activity breakdown.
 * Used for streaks, goals, and detailed analytics.
 */
export interface IDailyActivityDoc {
  whatsapp: string;
  date: Date; // UTC midnight of that day
  totalSeconds: number;
  /** Breakdown by page category */
  breakdown: {
    lessons: number;      // /hsk/*, /hw/*
    practice: number;     // /pinyin, /hanzi-pro
    exams: number;        // /exam, /hw/exam
    translate: number;    // /translate
    vocabulary: number;   // /chinese-words
    other: number;
  };
  /** Whether they met the daily goal (default 15 min = 900s) */
  goalMet: boolean;
  /** Streak count as of this day */
  streak: number;
  createdAt: Date;
  updatedAt: Date;
}

const DailyActivitySchema = new Schema<IDailyActivityDoc>(
  {
    whatsapp: { type: String, default: "", index: true },
    date: { type: Date, default: Date.now, index: true },
    totalSeconds: { type: Number, default: 0, min: 0 },
    breakdown: {
      lessons: { type: Number, default: 0, min: 0 },
      practice: { type: Number, default: 0, min: 0 },
      exams: { type: Number, default: 0, min: 0 },
      translate: { type: Number, default: 0, min: 0 },
      vocabulary: { type: Number, default: 0, min: 0 },
      other: { type: Number, default: 0, min: 0 },
    },
    goalMet: { type: Boolean, default: false },
    streak: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

// Compound index for efficient streak queries
DailyActivitySchema.index({ whatsapp: 1, date: -1 });

export const DailyActivity =
  models.DailyActivity || model<IDailyActivityDoc>("DailyActivity", DailyActivitySchema);
export default DailyActivity;