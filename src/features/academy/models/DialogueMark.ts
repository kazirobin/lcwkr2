import { Schema, model, models } from "mongoose";

/**
 * Per-student dialogue marks shown on the academy students directory.
 * Source "recording" = admin marked a submitted recording;
 * source "manual" = admin gave a mark directly (no recording needed).
 * Latest record per student is what displays.
 */
export interface IDialogueMarkDoc {
  name: string;
  /** Normalized BD mobile: 01XXXXXXXXX. */
  whatsapp: string;
  level: number;
  /** 0 = overall (any lesson). */
  lesson: number;
  mark: number;
  feedback: string;
  source: "recording" | "manual";
  submissionId?: string;
  createdAt: Date;
  updatedAt: Date;
}

const DialogueMarkSchema = new Schema<IDialogueMarkDoc>(
  {
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true, index: true },
    level: { type: Number, required: true, min: 1, max: 6 },
    lesson: { type: Number, required: true, min: 0 },
    mark: { type: Number, required: true, min: 0, max: 10 },
    feedback: { type: String, default: "" },
    source: { type: String, enum: ["recording", "manual"], required: true, index: true },
    submissionId: { type: String, default: "" },
  },
  { timestamps: true },
);

DialogueMarkSchema.index({ whatsapp: 1, createdAt: -1 });

export const DialogueMark =
  models.DialogueMark || model<IDialogueMarkDoc>("DialogueMark", DialogueMarkSchema);
export default DialogueMark;
