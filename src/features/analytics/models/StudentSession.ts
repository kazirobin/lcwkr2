import { Schema, model, models } from "mongoose";

/**
 * One row per student sign-in. Gives the admin "who logged in, when did they
 * log out, and how long were they in" without storing every page they looked
 * at — the per-day path totals live in TrafficEvent instead.
 */
export interface IStudentSessionDoc {
  /** Empty for a visitor who has not signed in, so anonymous rows are ignored. */
  whatsapp: string;
  rollNumber?: number | null;
  name: string;
  loginAt: Date;
  logoutAt?: Date | null;
  /** Seconds between login and logout. Filled in when the session is closed. */
  durationSec: number;
  /** False while the student is signed in; the admin sees these as "online". */
  active: boolean;
  /** Distinct pages seen this session, kept as a short list for the detail view. */
  paths: string[];
  /**
   * The same pages with a real count, so "which page do they open most" is a
   * number and not a set. `paths` stays because it is what the older readers
   * expect and it is the cheaper question to ask; this is the answer to the
   * newer one. Capped on write — a long session must not grow a document
   * without bound.
   */
  pageCounts: { path: string; count: number }[];
  clicks: number;
  userAgent: string;
  createdAt: Date;
  updatedAt: Date;
}

const StudentSessionSchema = new Schema<IStudentSessionDoc>(
  {
    whatsapp: { type: String, default: "", index: true },
    rollNumber: { type: Number, default: null, index: true },
    name: { type: String, default: "" },
    loginAt: { type: Date, default: Date.now, index: true },
    logoutAt: { type: Date, default: null },
    durationSec: { type: Number, default: 0, min: 0 },
    active: { type: Boolean, default: true, index: true },
    paths: { type: [String], default: [] },
    pageCounts: { type: [{ path: String, count: Number }], default: [] },
    clicks: { type: Number, default: 0, min: 0 },
    userAgent: { type: String, default: "" },
  },
  { timestamps: true },
);

export const StudentSession =
  models.StudentSession || model<IStudentSessionDoc>("StudentSession", StudentSessionSchema);
export default StudentSession;
