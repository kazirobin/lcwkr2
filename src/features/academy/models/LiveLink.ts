import mongoose, { Schema, model, models } from "mongoose";

export interface ILiveLinkDoc {
  courseId: string;
  label: string;
  meetLink: string;
  topic: string;
  /**
   * Recurring class times, so a saved link is also a timetable entry.
   * `days` uses JS getDay() numbering (0 = Saturday, 1 = Sunday … 6 = Friday)
   * because that is what Date#getDay returns and the conversion is the only
   * place where a week index is needed.
   */
  days: number[];
  /** Start time as HH:MM in `timezone`. */
  time: string;
  /** How long the class runs, in minutes. */
  durationMin: number;
  /** Whether the recurring slot is shown to students. */
  active: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const LiveLinkSchema = new Schema<ILiveLinkDoc>(
  {
    courseId: { type: String, required: true, index: true },
    label: { type: String, default: "" },
    meetLink: { type: String, required: true, trim: true },
    topic: { type: String, default: "" },
    days: { type: [Number], default: [] },
    time: { type: String, default: "" },
    durationMin: { type: Number, default: 60, min: 5, max: 480 },
    active: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

LiveLinkSchema.index({ active: 1, days: 1 });

export const LiveLink =
  models.LiveLink || model<ILiveLinkDoc>("LiveLink", LiveLinkSchema);
export default LiveLink;
