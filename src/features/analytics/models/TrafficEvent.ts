import { Schema, model, models } from "mongoose";

/**
 * How often one label was seen on one day — a page path for "page" events, or
 * a button name for "click" events. Rolled up per day so "which pages do people
 * actually browse" and "which buttons get used" are both a sort of a small
 * table, not a scan of raw traffic.
 */
export interface ITrafficEventDoc {
  day: string;
  kind: "page" | "click";
  /** A path such as "/hsk/1/lesson/9", or a button name such as "পাঠের বই". */
  label: string;
  count: number;
}

const TrafficEventSchema = new Schema<ITrafficEventDoc>({
  day: { type: String, required: true, index: true },
  kind: { type: String, required: true, enum: ["page", "click"], index: true },
  label: { type: String, required: true, trim: true },
  count: { type: Number, default: 0, min: 0 },
});
TrafficEventSchema.index({ day: 1, kind: 1, label: 1 }, { unique: true });

export const TrafficEvent =
  models.TrafficEvent || model<ITrafficEventDoc>("TrafficEvent", TrafficEventSchema);
export default TrafficEvent;
