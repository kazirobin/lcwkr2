"use client";

import { useState } from "react";
import { Users, Plus, Pencil, Trash2, Crown } from "lucide-react";
import { Button, Card, IconButton } from "@/components/ui";
import type { PaidEntry, PaidTeamView } from "../types";
import { savePaidTeam, deletePaidTeam } from "../server/paid";

const inputClass =
  "w-full rounded-xl border border-text/15 bg-card px-3.5 py-2.5 text-sm text-text transition-colors placeholder:text-text/40 focus:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text";

const selectClass =
  "w-full rounded-xl border border-text/15 bg-card px-3 py-2.5 text-sm text-text transition-colors focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text";

interface Props {
  entries: PaidEntry[];
  teams: PaidTeamView[];
  isAdmin: boolean;
  passcode: string;
  /** Called after any create/update/delete so the parent can reload the list. */
  onChanged: () => void;
  onError: (msg: string) => void;
}

/**
 * Small teams: one captain over the students under them. Everyone can see who
 * captains whom; creating, editing and deleting is admin-only.
 */
export default function PaidTeams({ entries, teams, isAdmin, passcode, onChanged, onError }: Props) {
  const [formOpen, setFormOpen] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [name, setName] = useState("");
  const [captainId, setCaptainId] = useState("");
  const [memberIds, setMemberIds] = useState<string[]>([]);
  const [busy, setBusy] = useState(false);

  const close = () => {
    setFormOpen(false);
    setEditingId(null);
    setName("");
    setCaptainId("");
    setMemberIds([]);
  };

  const openCreate = () => {
    close();
    setFormOpen(true);
  };

  const openEdit = (team: PaidTeamView) => {
    setEditingId(team._id);
    setName(team.name);
    setCaptainId(team.captain?._id ?? "");
    setMemberIds(team.members.map((m) => m._id));
    setFormOpen(true);
  };

  const toggleMember = (id: string) =>
    setMemberIds((prev) => (prev.includes(id) ? prev.filter((x) => x !== id) : [...prev, id]));

  const selectedMembers = memberIds.filter((id) => id !== captainId);

  // Students already placed in another team are hidden so no one can sit in two
  // teams. The team being edited keeps its own students selectable.
  const usedIds = new Set<string>();
  for (const team of teams) {
    if (team._id === editingId) continue;
    if (team.captain) usedIds.add(team.captain._id);
    for (const m of team.members) usedIds.add(m._id);
  }
  const candidates = entries.filter((e) => !usedIds.has(e._id));
  const memberCandidates = candidates.filter((e) => e._id !== captainId);

  const save = async () => {
    if (!captainId) {
      onError("Pick a captain for the team.");
      return;
    }
    if (selectedMembers.length < 2) {
      onError("A team needs at least 2 members under the captain.");
      return;
    }
    try {
      setBusy(true);
      await savePaidTeam({ _id: editingId ?? undefined, name, captainId, memberIds: selectedMembers }, passcode);
      close();
      onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to save team.");
    } finally {
      setBusy(false);
    }
  };

  const remove = async (id: string) => {
    try {
      setBusy(true);
      await deletePaidTeam(id, passcode);
      if (editingId === id) close();
      onChanged();
    } catch (err) {
      onError(err instanceof Error ? err.message : "Failed to delete team.");
    } finally {
      setBusy(false);
    }
  };

  // Students only see teams when there is something to show.
  if (!isAdmin && teams.length === 0) return null;

  return (
    <section className="flex flex-col gap-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <p className="inline-flex items-center gap-2 text-[11px] font-semibold uppercase tracking-[0.15em] text-text/60">
          <Users className="h-3.5 w-3.5" aria-hidden="true" /> Teams · ক্যাপ্টেন ও দল
        </p>
        {isAdmin && !formOpen && (
          <Button size="sm" iconLeft={<Plus className="h-4 w-4" aria-hidden="true" />} onClick={openCreate}>
            New team · নতুন টিম
          </Button>
        )}
      </div>

      {/* Admin editor — create a team or edit the selected one. */}
      {isAdmin && formOpen && (
        <Card className="p-4">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-text/70">Team name (optional) · টিমের নাম</span>
              <input
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Team Dragon"
                className={inputClass}
              />
            </label>
            <label className="flex flex-col gap-1.5 text-sm">
              <span className="font-semibold text-text/70">Captain · ক্যাপ্টেন</span>
              <select
                value={captainId}
                onChange={(e) => setCaptainId(e.target.value)}
                className={selectClass}
              >
                <option value="">Pick a captain…</option>
                {candidates.map((e) => (
                  <option key={e._id} value={e._id}>
                    {e.name}
                    {e.hskLevel ? ` · ${e.hskLevel}` : ""}
                  </option>
                ))}
              </select>
            </label>
          </div>

          <div className="mt-4">
            <div className="mb-2 flex items-center justify-between">
              <span className="text-sm font-semibold text-text/70">Members under the captain</span>
              <span className="text-xs font-semibold tabular-nums text-text/50">
                {selectedMembers.length} selected
              </span>
            </div>
            <div className="max-h-56 overflow-y-auto rounded-xl border border-text/10 bg-card">
              {memberCandidates.length === 0 ? (
                <p className="px-3 py-3 text-sm text-text/50">
                  No unassigned students left — everyone is already in a team.
                </p>
              ) : (
                memberCandidates.map((e) => (
                  <label
                    key={e._id}
                    className="flex cursor-pointer items-center gap-2 border-b border-text/5 px-3 py-2 text-sm last:border-b-0 hover:bg-text/[0.03]"
                  >
                    <input
                      type="checkbox"
                      checked={memberIds.includes(e._id)}
                      onChange={() => toggleMember(e._id)}
                      className="accent-text"
                    />
                    <span className="text-text">{e.name}</span>
                    {e.hskLevel && <span className="ml-auto text-[11px] text-text/45">{e.hskLevel}</span>}
                  </label>
                ))
              )}
            </div>
          </div>

          <div className="mt-4 flex items-center justify-end gap-2 border-t border-text/10 pt-4">
            <Button variant="secondary" size="sm" onClick={close} disabled={busy}>
              Cancel
            </Button>
            <Button size="sm" onClick={save} loading={busy}>
              {editingId ? "Save changes" : "Create team"}
            </Button>
          </div>
        </Card>
      )}

      {teams.length === 0 ? (
        <Card className="px-5 py-8 text-center text-sm text-text/55">
          No teams yet. Create one to group students under a captain.
        </Card>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2">
          {teams.map((team) => (
            <Card key={team._id} className="p-4">
              <div className="flex items-start justify-between gap-3">
                <div className="min-w-0">
                  <p className="text-[11px] font-semibold uppercase tracking-[0.15em] text-text/45">
                    {team.name || "Team"}
                  </p>
                  <p className="mt-1 flex flex-wrap items-center gap-1.5 text-sm font-semibold text-text">
                    <Crown className="h-4 w-4 text-primary" aria-hidden="true" />
                    <span className="truncate">{team.captain?.name ?? "—"}</span>
                    <span className="rounded-full border border-primary/30 bg-primary/10 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-primary">
                      Captain
                    </span>
                  </p>
                </div>
                {isAdmin && (
                  <div className="flex shrink-0 items-center gap-1">
                    <IconButton label="Edit team" size="sm" onClick={() => openEdit(team)}>
                      <Pencil className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                    <IconButton label="Delete team" size="sm" onClick={() => void remove(team._id)}>
                      <Trash2 className="h-4 w-4" aria-hidden="true" />
                    </IconButton>
                  </div>
                )}
              </div>

              {team.members.length > 0 && (
                <ul className="mt-3 flex flex-wrap gap-1.5">
                  {team.members.map((m) => (
                    <li
                      key={m._id}
                      className="rounded-full border border-text/10 bg-text/5 px-2.5 py-1 text-[11px] font-medium text-text/70"
                    >
                      {m.name}
                      {m.hskLevel ? ` · ${m.hskLevel}` : ""}
                    </li>
                  ))}
                </ul>
              )}

              <p className="mt-3 text-xs text-text/50">
                {team.members.length} {team.members.length === 1 ? "member" : "members"} under the captain
              </p>
            </Card>
          ))}
        </div>
      )}
    </section>
  );
}
