import { Schema, model, models } from "mongoose";

/**
 * One row per visitor per day, used only to count unique visitors without
 * keeping a growing list inside the day document.
 *
 * `visitorId` is a random value the browser generates and keeps in
 * localStorage. It is deliberately not derived from anything about the device,
 * so clearing site data really does make you a new visitor and the id cannot be
 * traced back to a person.
 */
export interface IVisitorMarkDoc {
  day: string;
  visitorId: string;
  createdAt: Date;
}

const VisitorMarkSchema = new Schema<IVisitorMarkDoc>({
  day: { type: String, required: true, index: true },
  visitorId: { type: String, required: true, trim: true },
});
VisitorMarkSchema.index({ day: 1, visitorId: 1 }, { unique: true });

export const VisitorMark =
  models.VisitorMark || model<IVisitorMarkDoc>("VisitorMark", VisitorMarkSchema);
export default VisitorMark;
