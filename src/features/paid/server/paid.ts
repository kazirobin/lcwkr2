import type {
  MarksKind,
  PaidEntry,
  PaidInput,
  PaidMarks,
  PaidSettings,
  PaidTeamInput,
  PaidTeamView,
} from "../types";

export async function listPaid(): Promise<PaidEntry[]> {
  const res = await fetch("/api/paid", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load entries");
  return res.json();
}

export async function createPaid(input: PaidInput): Promise<PaidEntry> {
  const res = await fetch("/api/paid", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(input),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save entry");
  return data;
}

export async function updatePaid(
  id: string,
  input: PaidInput,
  options?: { marks?: PaidMarks; passcode?: string },
): Promise<PaidEntry> {
  const res = await fetch(`/api/paid/${id}`, {
    method: "PATCH",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      ...input,
      ...(options?.marks ?? {}),
      passcode: options?.passcode ?? "",
    }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to update entry");
  return data;
}

/**
 * Set one class/homework slot present (or clear) for the given members.
 * Pass the ids picked in the bulk panel — pass every id to hit the whole list.
 */
export async function bulkPaidMarks(
  kind: MarksKind,
  index: number,
  value: boolean,
  passcode: string,
  ids: string[],
): Promise<void> {
  const res = await fetch("/api/paid/bulk", {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ kind, index, value, passcode, ids }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Admin passcode required to update attendance.");
  }
}

export async function deletePaid(id: string, passcode: string): Promise<void> {
  const res = await fetch(`/api/paid/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passcode }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Admin passcode required to delete.");
  }
}

/** Load the shared page settings (the WhatsApp greeting). */
export async function getPaidSettings(): Promise<PaidSettings> {
  const res = await fetch("/api/paid/settings", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load settings");
  return res.json();
}

/** Save the admin-set WhatsApp greeting. Passcode required. */
export async function savePaidMessage(waMessage: string, passcode: string): Promise<PaidSettings> {
  const res = await fetch("/api/paid/settings", {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ waMessage, passcode }),
  });
  const data = await res.json();
  if (!res.ok) throw new Error(data.error || "Failed to save message");
  return data;
}

/** Every team, resolved to captain and member names. Public read. */
export async function listPaidTeams(): Promise<PaidTeamView[]> {
  const res = await fetch("/api/paid/teams", { cache: "no-store" });
  if (!res.ok) throw new Error("Failed to load teams");
  return res.json();
}

/** Create (no id) or update (id given) a team. Admin passcode required. */
export async function savePaidTeam(
  input: PaidTeamInput & { _id?: string },
  passcode: string
): Promise<void> {
  const { _id, ...fields } = input;
  const res = await fetch(_id ? `/api/paid/teams/${_id}` : "/api/paid/teams", {
    method: _id ? "PATCH" : "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...fields, passcode }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Admin passcode required to manage teams.");
  }
}

export async function deletePaidTeam(id: string, passcode: string): Promise<void> {
  const res = await fetch(`/api/paid/teams/${id}`, {
    method: "DELETE",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ passcode }),
  });
  if (!res.ok) {
    const data = await res.json().catch(() => ({}));
    throw new Error(data.error || "Admin passcode required to delete a team.");
  }
}
