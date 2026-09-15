import mongoose, { Schema, model, models } from "mongoose";

export interface ILiveLinkDoc {
  courseId: string;
  label: string;
  meetLink: string;
  topic: string;
  createdAt: Date;
}

const LiveLinkSchema = new Schema<ILiveLinkDoc>(
  {
    courseId: { type: String, required: true, index: true },
    label: { type: String, default: "" },
    meetLink: { type: String, required: true, trim: true },
    topic: { type: String, default: "" },
  },
  { timestamps: true },
);

export const LiveLink =
  models.LiveLink || model<ILiveLinkDoc>("LiveLink", LiveLinkSchema);
export default LiveLink;
