import type { MarksKind, PaidEntry, PaidInput, PaidMarks } from "../types";

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
