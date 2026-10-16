import mongoose from "mongoose";
import { connectDB } from "@/lib/db";
import { PaidEntry } from "../models/PaidEntry";
import { PaidTeam } from "../models/PaidTeam";
import { normalizeTeamInput, serializePaidTeam } from "../lib";
import type { PaidTeamInput, PaidTeamView, TeamMemberView } from "../types";

type Fail = { ok: false; error: string; status: number };

function memberView(doc: unknown): TeamMemberView | null {
  if (!doc) return null;
  const d = doc as Record<string, unknown>;
  return {
    _id: String(d._id),
    name: typeof d.name === "string" ? d.name : "",
    hskLevel: typeof d.hskLevel === "string" ? d.hskLevel : "",
  };
}

const validId = (value: string) => mongoose.Types.ObjectId.isValid(value);

/** Every student already placed in some team — captain or member. */
async function idsInOtherTeams(excludeId?: string): Promise<Set<string>> {
  await connectDB();
  const filter = excludeId ? { _id: { $ne: excludeId } } : {};
  const teams = await PaidTeam.find(filter).lean();
  const ids = new Set<string>();
  for (const team of teams) {
    if (team.captainId) ids.add(String(team.captainId));
    for (const id of team.memberIds ?? []) ids.add(String(id));
  }
  return ids;
}

/**
 * A team needs a real captain (a paid member) and at least two students under
 * them. Members are de-duped, the captain is never listed as their own member,
 * and no student can sit in two teams at once.
 */
async function validateTeam(
  input: PaidTeamInput,
  excludeId?: string
): Promise<{ ok: true; value: PaidTeamInput } | Fail> {
  if (!input.captainId || !validId(input.captainId)) {
    return { ok: false, error: "Pick a captain for the team.", status: 400 };
  }
  await connectDB();
  const captain = await PaidEntry.findById(input.captainId).lean();
  if (!captain) {
    return { ok: false, error: "That captain is no longer on the members list.", status: 400 };
  }
  const memberIds = input.memberIds.filter((id) => id !== input.captainId && validId(id));
  if (memberIds.length < 2) {
    return { ok: false, error: "Add at least 2 members under the captain.", status: 400 };
  }
  const used = await idsInOtherTeams(excludeId);
  const clash = [input.captainId, ...memberIds].some((id) => used.has(id));
  if (clash) {
    return { ok: false, error: "Some selected students are already in another team.", status: 400 };
  }
  return { ok: true, value: { ...input, memberIds } };
}

/** Every team resolved to its captain and members (names and levels only). */
export async function listPaidTeams(): Promise<PaidTeamView[]> {
  await connectDB();
  const teams = await PaidTeam.find({}).sort({ createdAt: 1 }).lean();

  const ids = new Set<string>();
  for (const team of teams) {
    if (team.captainId) ids.add(String(team.captainId));
    for (const id of team.memberIds ?? []) ids.add(String(id));
  }

  const valid = [...ids].filter(validId);
  const entries = valid.length ? await PaidEntry.find({ _id: { $in: valid } }).lean() : [];
  const byId = new Map(entries.map((e) => [String(e._id), e]));

  return teams.map((t) => ({
    _id: String(t._id),
    name: typeof t.name === "string" ? t.name : "",
    captain: memberView(byId.get(String(t.captainId))),
    members: (t.memberIds ?? [])
      .map((id) => memberView(byId.get(String(id))))
      .filter((m): m is TeamMemberView => Boolean(m)),
  }));
}

export async function createPaidTeam(
  body: unknown
): Promise<{ ok: true; team: ReturnType<typeof serializePaidTeam> } | Fail> {
  const check = await validateTeam(normalizeTeamInput(body));
  if (!check.ok) return check;
  const created = await PaidTeam.create(check.value);
  return { ok: true, team: serializePaidTeam(created.toObject()) };
}

export async function updatePaidTeam(
  id: string,
  body: unknown
): Promise<{ ok: true; team: ReturnType<typeof serializePaidTeam> } | Fail> {
  if (!validId(id)) return { ok: false, error: "Team not found.", status: 404 };
  const check = await validateTeam(normalizeTeamInput(body), id);
  if (!check.ok) return check;
  await connectDB();
  const updated = await PaidTeam.findByIdAndUpdate(id, check.value, { new: true }).lean();
  if (!updated) return { ok: false, error: "Team not found.", status: 404 };
  return { ok: true, team: serializePaidTeam(updated) };
}

export async function deletePaidTeam(id: string): Promise<{ ok: true } | Fail> {
  if (!validId(id)) return { ok: false, error: "Team not found.", status: 404 };
  await connectDB();
  const deleted = await PaidTeam.findByIdAndDelete(id).lean();
  if (!deleted) return { ok: false, error: "Team not found.", status: 404 };
  return { ok: true };
}
