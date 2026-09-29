import type { QueryFilter } from "mongoose";
import { connectDB } from "@/lib/db";
import { ProTrial, type IProTrialDoc } from "../models";
import { normalizePhone } from "@/features/academy/server/dialogues";
import { findStudentDocByPhone } from "@/features/academy/server/student-auth";

/**
 * The ten-minute Pro preview, kept on the server.
 *
 * The rule being enforced is deliberately small: the first time somebody opens
 * a Pro page they get ten minutes, they are not asked to sign in for it, and
 * the site owner can see that it happened and push it out again if they ask.
 *
 * Two decisions worth knowing about:
 *
 *  1. Signing in does not restart the clock. A student who browsed for four
 *     minutes and then logged in has six left, not ten, so the preview cannot
 *     be farmed by logging out and back in. The only thing that moves
 *     `expiresAt` is an explicit renew, and the admin is the one who decides
 *     that.
 *  2. The renew is an extension, not a reset. Someone on a ৳500 sale who has
 *     already spent twenty minutes keeps that twenty minutes; they simply get
 *     the window moved out from under them. Otherwise a renewal would quietly
 *     hand back time the visitor had already used.
 */

/** Ten minutes. Kept in step with TRIAL_MS in pro-access.ts. */
export const PRO_TRIAL_MS = 10 * 60 * 1000;

export type ProTrialState = {
  trialId: string;
  /** True while the preview is still running. */
  active: boolean;
  /** Milliseconds left, never negative. */
  remainingMs: number;
  expiresAt: string;
  startedAt: string;
  renewals: number;
  usedMs: number;
  /** The visitor signed in, so the admin can put a name to this trial. */
  signedIn: boolean;
};

/** A visitor id the browser has not been able to generate, e.g. private mode. */
function usable(id: string): boolean {
  return id.length >= 8;
}

/**
 * Every trial this browser is allowed to claim.
 *
 * A browser is known either as the one that opened the trial or as one that was
 * added to it later, because the ten minutes belong to the person and not to the
 * device.
 */
function byBrowser(visitorId: string): QueryFilter<IProTrialDoc> {
  return { $or: [{ visitorId }, { visitorIds: visitorId }] };
}

function stateOf(doc: IProTrialDoc & { _id: unknown }): ProTrialState {
  const now = Date.now();
  const remainingMs = doc.revokedAt ? 0 : Math.max(0, doc.expiresAt.getTime() - now);
  return {
    trialId: String(doc._id),
    active: remainingMs > 0,
    remainingMs,
    expiresAt: doc.expiresAt.toISOString(),
    startedAt: doc.startedAt.toISOString(),
    renewals: doc.renewals,
    usedMs: doc.usedMs,
    signedIn: Boolean(doc.whatsapp),
  };
}

/** The three things a person has to say before the clock starts. */
export type TrialRequest = {
  visitorId: string;
  name: string;
  whatsapp: string;
  location: string;
  rollNumber?: number | null;
};

export type TrialStartResult =
  | { ok: true; trial: ProTrialState }
  | { ok: false; code: "no-id" | "incomplete"; message: string; trial?: ProTrialState | null };

/**
 * Start this person's ten minutes, or hand back the one they already have.
 *
 * The name, number and location are required the first time. That is the whole
 * difference from before: an anonymous row could be renewed by the admin, but
 * nobody could tell whose it was, so a renewal meant guessing. A row with a name
 * and a number on it can be matched to the roster and renewed with confidence.
 *
 * Approval is automatic. The ten minutes are the marketing, so making somebody
 * wait for an answer before showing them the product would cost more than it
 * was worth; what the admin gets is the list, and the two buttons on it.
 *
 * Calling this again on the same browser never restarts the clock — it only
 * refreshes the contact details, so a second visit does not hand out a second
 * ten minutes. The only thing that moves `expiresAt` is an explicit renew.
 */
export async function requestTrial(input: TrialRequest): Promise<TrialStartResult> {
  if (!usable(input.visitorId)) {
    return {
      ok: false,
      code: "no-id",
      message:
        "This browser is blocking storage, so the preview cannot be started here. Try a normal window.",
    };
  }

  const name = (input.name ?? "").trim();
  const location = (input.location ?? "").trim();
  const phoneRaw = (input.whatsapp ?? "").trim();
  const phone = normalizePhone(phoneRaw);

  try {
    await connectDB();
    const now = new Date();

    // An existing row is checked before the details are demanded, so somebody
    // coming back for a second visit is never asked to type their details in
    // again — only somebody starting for the first time is.
    const existing = await ProTrial.findOne(byBrowser(input.visitorId)).lean();
    if (existing) {
      const patch: Record<string, unknown> = {};
      if (name && name !== existing.name) patch.name = name;
      if (phone && phone !== existing.whatsapp) patch.whatsapp = phone;
      if (location && location !== existing.location) patch.location = location;
      if (input.rollNumber != null) patch.rollNumber = input.rollNumber;
      if (Object.keys(patch).length) {
        await ProTrial.updateOne({ _id: existing._id }, { $set: patch });
      }
      const doc = await ProTrial.findById(existing._id).lean();
      return { ok: true, trial: stateOf(doc!) };
    }

    // First visit: the three fields, or nothing.
    const missing: string[] = [];
    if (name.length < 2) missing.push("name");
    if (phone.length < 10) missing.push("whatsapp");
    if (location.length < 2) missing.push("location");
    if (missing.length) {
      return {
        ok: false,
        code: "incomplete",
        message: "Name, WhatsApp number and location are all needed to start the ten minutes.",
        trial: null,
      };
    }

    // The ten minutes are per person, and the number is what says who the person
    // is. Without this a second browser, or a cleared site data, would hand out
    // another ten minutes to somebody who had already had theirs — which is the
    // one rule the whole preview rests on. Their existing window is returned
    // instead, and this browser is added to it so both keep counting the same
    // clock. Only the admin can move that clock.
    const forPhone = await ProTrial.findOne({ whatsapp: phone }).lean();
    if (forPhone) {
      const known = [forPhone.visitorId, ...(forPhone.visitorIds ?? [])];
      if (!known.includes(input.visitorId)) {
        await ProTrial.updateOne(
          { _id: forPhone._id },
          { $addToSet: { visitorIds: input.visitorId } },
        );
      }
      const doc = await ProTrial.findById(forPhone._id).lean();
      return { ok: true, trial: stateOf(doc!) };
    }

    // Match a student record if we can, so the admin's list lines up with the
    // roster and the row is attributed to a real person.
    const student = await findStudentDocByPhone(phone);
    const created = await ProTrial.create({
      visitorId: input.visitorId,
      name,
      whatsapp: phone,
      location,
      rollNumber: student?.rollNumber ?? input.rollNumber ?? null,
      startedAt: now,
      expiresAt: new Date(now.getTime() + PRO_TRIAL_MS),
    });
    return { ok: true, trial: stateOf(created) };
  } catch (err) {
    if (process.env.NODE_ENV !== "production") {
      console.warn("[pro-trial] could not start the trial:", err);
    }
    return { ok: false, code: "incomplete", message: "Could not start the preview. Try again.", trial: null };
  }
}

/**
 * Read an existing trial without creating one.
 *
 * The gate calls this on every Pro page view to learn whether there is a window
 * to count down. A browser that has never asked for one gets null, which is what
 * puts the name-and-number form in front of them instead of a clock.
 */
export async function peekTrial(visitorId: string): Promise<ProTrialState | null> {
  if (!usable(visitorId)) return null;
  try {
    await connectDB();
    const doc = await ProTrial.findOne(byBrowser(visitorId)).lean();
    return doc ? stateOf(doc) : null;
  } catch {
    return null;
  }
}

/** Move the window out by another ten minutes, keeping any time already used. */
export async function renewTrial(trialId: string): Promise<ProTrialState | null> {
  try {
    await connectDB();
    const now = new Date();
    const doc = await ProTrial.findByIdAndUpdate(
      trialId,
      {
        $set: {
          expiresAt: new Date(now.getTime() + PRO_TRIAL_MS),
          lastRenewedAt: now,
          revokedAt: null,
        },
        $inc: { renewals: 1 },
      },
      { returnDocument: "after" },
    );
    return doc ? stateOf(doc) : null;
  } catch {
    return null;
  }
}

/** Stop the preview now, without deleting the history of it. */
export async function endTrial(trialId: string): Promise<ProTrialState | null> {
  try {
    await connectDB();
    const doc = await ProTrial.findByIdAndUpdate(
      trialId,
      { $set: { expiresAt: new Date(), revokedAt: new Date() } },
      { returnDocument: "after" },
    );
    return doc ? stateOf(doc) : null;
  } catch {
    return null;
  }
}

/**
 * Remove the record entirely.
 *
 * For clearing out a duplicate, or a name and number somebody would rather not
 * have on file. `endTrial` is the gentler option — it stops the clock and keeps
 * the row so the history stays readable; this one forgets it.
 */
export async function deleteTrial(trialId: string): Promise<boolean> {
  try {
    await connectDB();
    const res = await ProTrial.deleteOne({ _id: trialId });
    return res.deletedCount > 0;
  } catch {
    return false;
  }
}

/** Give back time a visitor has actually sat in Pro content, for the summary. */
export async function noteTrialUse(visitorId: string, usedMs: number): Promise<void> {
  if (!usable(visitorId) || usedMs <= 0) return;
  try {
    await connectDB();
    await ProTrial.updateOne(
      byBrowser(visitorId),
      { $inc: { usedMs: Math.min(usedMs, PRO_TRIAL_MS * 4) } },
    );
  } catch {
    /* analytics only */
  }
}

export type ProTrialRow = {
  _id: string;
  visitorId: string;
  name: string;
  whatsapp: string;
  location: string;
  rollNumber?: number | null;
  startedAt: string;
  expiresAt: string;
  usedMs: number;
  renewals: number;
  lastRenewedAt?: string | null;
  revokedAt?: string | null;
  note: string;
  remainingMs: number;
  active: boolean;
};

export type ProTrialSummary = {
  total: number;
  activeNow: number;
  /** Rows whose number matches a student record. */
  students: number;
  /** Rows from people who are not on the roster. */
  others: number;
  renewals: number;
  usedMsTotal: number;
};

export async function listProTrials(limit = 200): Promise<{
  trials: ProTrialRow[];
  summary: ProTrialSummary;
}> {
  await connectDB();
  const now = Date.now();
  const docs = await ProTrial.find({}).sort({ startedAt: -1 }).limit(limit).lean();

  const trials: ProTrialRow[] = docs.map((d) => ({
    _id: String(d._id),
    visitorId: d.visitorId,
    name: d.name ?? "",
    whatsapp: d.whatsapp ?? "",
    location: d.location ?? "",
    rollNumber: d.rollNumber ?? null,
    startedAt: d.startedAt.toISOString(),
    expiresAt: d.expiresAt.toISOString(),
    usedMs: d.usedMs ?? 0,
    renewals: d.renewals ?? 0,
    lastRenewedAt: d.lastRenewedAt ? d.lastRenewedAt.toISOString() : null,
    revokedAt: d.revokedAt ? d.revokedAt.toISOString() : null,
    note: d.note ?? "",
    remainingMs: d.revokedAt ? 0 : Math.max(0, new Date(d.expiresAt).getTime() - now),
    active: !d.revokedAt && new Date(d.expiresAt).getTime() > now,
  }));

  return {
    trials,
    summary: {
      total: trials.length,
      activeNow: trials.filter((t) => t.active).length,
      // A matched number means the person is already on the student roster,
      // which is the useful split: those can be renewed without a phone call.
      students: trials.filter((t) => t.rollNumber != null).length,
      others: trials.filter((t) => t.rollNumber == null).length,
      renewals: trials.reduce((n, t) => n + t.renewals, 0),
      usedMsTotal: trials.reduce((n, t) => n + t.usedMs, 0),
    },
  };
}
