import { connectDB } from "@/lib/db";
import { ProTrial, type IProTrialDoc } from "../models";

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

/**
 * Read this visitor's trial, creating it with a fresh ten minutes the first
 * time. Safe to call on every Pro page view.
 *
 * `phone`/`name` are only passed by a signed-in student, and are used to label
 * the row for the admin. They never create a second trial — a browser has one,
 * whoever is using it, and they never restart the clock.
 */
export async function getOrStartTrial(input: {
  visitorId: string;
  phone?: string;
  name?: string;
  rollNumber?: number | null;
}): Promise<ProTrialState | null> {
  if (!usable(input.visitorId)) return null;

  try {
    await connectDB();
    const now = new Date();

    // A signed-in student should appear under their name in the admin list.
    // These go in $set, never $setOnInsert, so they are applied to the row that
    // already exists too.
    const identity: Record<string, unknown> = {};
    if (input.phone) {
      identity.whatsapp = input.phone;
      identity.name = input.name ?? "";
      identity.rollNumber = input.rollNumber ?? null;
    }

    // One upsert rather than find-then-create. A Pro page mounts three watchers
    // at once — the nav, the level gate and the corner badge — so three of
    // these used to arrive together and each inserted a row of its own, and the
    // admin's list showed the same visitor three times. An upsert matches the
    // existing row instead of writing past it.
    //
    // `$setOnInsert` carries only `expiresAt` on purpose. Mongo copies the
    // filter's equality fields onto an upserted document by itself, and
    // setDefaultsOnInsert fills the rest from the schema, so naming those same
    // paths here would be a conflict rather than a help.
    const doc = await ProTrial.findOneAndUpdate(
      { visitorId: input.visitorId },
      {
        $setOnInsert: { expiresAt: new Date(now.getTime() + PRO_TRIAL_MS) },
        ...(Object.keys(identity).length ? { $set: identity } : {}),
      },
      { upsert: true, returnDocument: "after" },
    );

    return doc ? stateOf(doc) : null;
  } catch (err) {
    // A trial must never be the reason a page fails to render. The caller
    // falls back to its own browser clock, which is the right behaviour for a
    // visitor. Locally it is worth a word though, because a silent null here
    // looks exactly like "the preview is not being recorded".
    if (process.env.NODE_ENV !== "production") {
      console.warn("[pro-trial] could not read or start the trial:", err);
    }
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

/** Give back time a visitor has actually sat in Pro content, for the summary. */
export async function noteTrialUse(visitorId: string, usedMs: number): Promise<void> {
  if (!usable(visitorId) || usedMs <= 0) return;
  try {
    await connectDB();
    await ProTrial.updateOne(
      { visitorId },
      { $inc: { usedMs: Math.min(usedMs, PRO_TRIAL_MS * 4) } },
    );
  } catch {
    /* analytics only */
  }
}

export type ProTrialRow = {
  _id: string;
  visitorId: string;
  whatsapp: string;
  name: string;
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
  signedIn: number;
  anonymous: number;
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
    whatsapp: d.whatsapp ?? "",
    name: d.name ?? "",
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
      signedIn: trials.filter((t) => t.whatsapp).length,
      anonymous: trials.filter((t) => !t.whatsapp).length,
      renewals: trials.reduce((n, t) => n + t.renewals, 0),
      usedMsTotal: trials.reduce((n, t) => n + t.usedMs, 0),
    },
  };
}
