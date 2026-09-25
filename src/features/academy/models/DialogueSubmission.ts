import { Schema, model, models } from "mongoose";

/**
 * A student's spoken-dialogue recording, uploaded to Cloudinary.
 * Visible only to the submitter (by phone) + admin. `mark` is 0–10.
 */
export interface IDialogueSubmissionDoc {
  name: string;
  /** Normalized BD mobile: 01XXXXXXXXX (see server/dialogues normalizePhone). */
  whatsapp: string;
  level: number;
  lesson: number;
  audioUrl: string;
  durationSec: number;
  mark: number | null;
  feedback: string;
  status: "Pending" | "Marked";
  /** Admin removed it from their queue — the recording STAYS with the user. */
  adminHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const DialogueSubmissionSchema = new Schema<IDialogueSubmissionDoc>(
  {
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true, index: true },
    level: { type: Number, required: true, min: 1, max: 6 },
    lesson: { type: Number, required: true, min: 1 },
    audioUrl: { type: String, required: true, trim: true },
    durationSec: { type: Number, default: 0, min: 0 },
    mark: { type: Number, default: null, min: 0, max: 10 },
    feedback: { type: String, default: "" },
    status: {
      type: String,
      enum: ["Pending", "Marked"],
      default: "Pending",
      index: true,
    },
    adminHidden: { type: Boolean, default: false, index: true },
  },
  { timestamps: true },
);

DialogueSubmissionSchema.index({ whatsapp: 1, createdAt: -1 });

export const DialogueSubmission =
  models.DialogueSubmission ||
  model<IDialogueSubmissionDoc>("DialogueSubmission", DialogueSubmissionSchema);
export default DialogueSubmission;
