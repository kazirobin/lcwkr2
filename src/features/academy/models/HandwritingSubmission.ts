import { Schema, model, models } from "mongoose";

/**
 * A student's handwritten-homework photos for one lesson (up to
 * MAX_PHOTOS), uploaded to Cloudinary. Visible only to the submitter (by
 * phone) + admin. The whole set is marked once by the admin, 0–10.
 */
export interface IHandwritingImage {
  url: string;
  publicId: string;
}

export interface IHandwritingSubmissionDoc {
  name: string;
  /** Normalized BD mobile: 01XXXXXXXXX (see server/dialogues normalizePhone). */
  whatsapp: string;
  level: number;
  lesson: number;
  images: IHandwritingImage[];
  mark: number | null;
  feedback: string;
  status: "Pending" | "Marked";
  /** Admin removed it from their queue — the photos STAY with the user. */
  adminHidden: boolean;
  createdAt: Date;
  updatedAt: Date;
}

const HandwritingImageSchema = new Schema<IHandwritingImage>(
  {
    url: { type: String, required: true, trim: true },
    publicId: { type: String, default: "" },
  },
  { _id: false },
);

const HandwritingSubmissionSchema = new Schema<IHandwritingSubmissionDoc>(
  {
    name: { type: String, required: true, trim: true },
    whatsapp: { type: String, required: true, trim: true, index: true },
    level: { type: Number, required: true, min: 1, max: 6 },
    lesson: { type: Number, required: true, min: 1 },
    images: {
      type: [HandwritingImageSchema],
      required: true,
      validate: {
        validator: (v: unknown) => Array.isArray(v) && v.length >= 1 && v.length <= 8,
        message: "A submission needs 1–8 photos.",
      },
    },
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

HandwritingSubmissionSchema.index({ whatsapp: 1, createdAt: -1 });

export const HandwritingSubmission =
  models.HandwritingSubmission ||
  model<IHandwritingSubmissionDoc>("HandwritingSubmission", HandwritingSubmissionSchema);
export default HandwritingSubmission;
