import { Schema, model, models } from "mongoose";

/**
 * One row per calendar day. Written with an atomic $inc so many visitors
 * hitting the site at once never lose a count, and so the home-page dashboard
 * is a single indexed read rather than a scan over every event ever recorded.
 */
export interface ITrafficDayDoc {
  /** YYYY-MM-DD in Asia/Dhaka, so the day rolls over at the local midnight. */
  day: string;
  pageViews: number;
  clicks: number;
  logins: number;
  /** First-time visitors whose first ever visit was this day. */
  newVisitors: number;
  updatedAt: Date;
}

const TrafficDaySchema = new Schema<ITrafficDayDoc>(
  {
    day: { type: String, required: true, unique: true, index: true },
    pageViews: { type: Number, default: 0, min: 0 },
    clicks: { type: Number, default: 0, min: 0 },
    logins: { type: Number, default: 0, min: 0 },
    newVisitors: { type: Number, default: 0, min: 0 },
  },
  { timestamps: true },
);

export const TrafficDay =
  models.TrafficDay || model<ITrafficDayDoc>("TrafficDay", TrafficDaySchema);
export default TrafficDay;
