import { Schema, model, models } from "mongoose";

/**
 * The ten-minute Pro preview, recorded on the server so the admin can see who
 * used it and extend it.
 *
 * Until this existed the preview lived entirely in the browser under
 * `cw:guest-start`, which made it useful to the visitor and invisible to the
 * site owner: nobody could answer "has this person already had their ten
 * minutes" or "give them another ten". The browser clock is still kept as an
 * offline fallback, but `expiresAt` here is the authority whenever the server
 * can be reached.
 *
 * One row per browser, keyed by the same random `visitorId` the traffic
 * counters use, so an anonymous visitor and a signed-in student are both
 * covered and neither is identifiable beyond what they typed in themselves.
 * `whatsapp` is filled in only if they are signed in, which is what lets the
 * admin list a trial next to a name.
 */
export interface IProTrialDoc {
  /** Random per-browser id from localStorage. Never derived from the device. */
  visitorId: string;
  /** Empty until the visitor signs in; a student then has a trial we can name. */
  whatsapp: string;
  rollNumber?: number | null;
  name: string;
  /** When this visitor first opened a Pro page. */
  startedAt: Date;
  /** The authority: the preview is over the moment this passes. */
  expiresAt: Date;
  /** Preview milliseconds actually consumed, for "how much did they use". */
  usedMs: number;
  /** How many times the admin has pushed the window out. */
  renewals: number;
  lastRenewedAt?: Date | null;
  /** Set when the admin stops the preview early. */
  revokedAt?: Date | null;
  note: string;
  createdAt: Date;
  updatedAt: Date;
}

const ProTrialSchema = new Schema<IProTrialDoc>({
  // Indexed only through the unique index below; declaring `index: true` as
  // well would ask mongoose for the same key twice.
  visitorId: { type: String, required: true, trim: true },
  whatsapp: { type: String, default: "", trim: true, index: true },
  rollNumber: { type: Number, default: null },
  name: { type: String, default: "" },
  startedAt: { type: Date, default: Date.now, index: true },
  expiresAt: { type: Date, required: true, index: true },
  usedMs: { type: Number, default: 0, min: 0 },
  renewals: { type: Number, default: 0, min: 0 },
  lastRenewedAt: { type: Date, default: null },
  revokedAt: { type: Date, default: null },
  note: { type: String, default: "", trim: true },
});
ProTrialSchema.index({ visitorId: 1 }, { unique: true });

export const ProTrial = models.ProTrial || model<IProTrialDoc>("ProTrial", ProTrialSchema);
export default ProTrial;
