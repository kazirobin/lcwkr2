import { Schema, model, models } from "mongoose";

/**
 * The ten-minute Pro preview, recorded on the server so the admin can see who
 * used it and extend it.
 *
 * Until this existed the preview lived entirely in the browser under
 * `cw:guest-start`, which made it useful to the visitor and invisible to the
 * site owner: nobody could answer "has this person already had their ten
 * minutes" or "give them another ten because they asked?". The browser clock is
 * still kept as an offline fallback, but `expiresAt` here is the authority
 * whenever the server can be reached.
 *
 * One row per person. They are asked for their name, WhatsApp number and
 * location before the clock starts, which is what makes a row matchable to a
 * human and a renewal grantable — an anonymous row can be renewed, but the
 * owner has no idea who is holding it. Approval is automatic: a request with all
 * three filled in is granted the ten minutes at once, because the ten minutes
 * are the marketing rather than a purchase. What the admin is given is the list.
 *
 * `visitorId` is still kept, because it is how the same browser is recognised
 * on a return visit without making them type their details in again. It is a
 * random value, not derived from the device, so on its own it says nothing.
 */
export interface IProTrialDoc {
  /** Random per-browser id from localStorage. Never derived from the device. */
  visitorId: string;
  /**
   * Further browsers this same person has used.
   *
   * The ten minutes belong to the person, not to the browser, so somebody who
   * opens a second browser, or clears their site data, must land on the window
   * they already have rather than a fresh ten minutes. Their extra browsers are
   * collected here so `expiresAt` keeps being the single authority instead of
   * each device keeping a private copy of a clock.
   */
  visitorIds?: string[];
  /** As the person gave it, so it can be matched to a roster by eye. */
  name: string;
  /** Normalised to 01XXXXXXXXX, so it lines up with a student record. */
  whatsapp: string;
  /** Free text as typed, e.g. "Mirpur 10". */
  location: string;
  rollNumber?: number | null;
  /** When this person first opened a Pro page. */
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
  visitorIds: { type: [String], default: [] },
  name: { type: String, default: "", trim: true },
  whatsapp: { type: String, default: "", trim: true, index: true },
  location: { type: String, default: "", trim: true },
  rollNumber: { type: Number, default: null },
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
