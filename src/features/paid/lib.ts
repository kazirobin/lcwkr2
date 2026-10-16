import type { PaidEntry, PaidInput, PaidMarks } from "./types";

/**
 * Lessons per HSK label: Label 1 → 15, Label 2 → 15, Label 3 → 18.
 * Each lesson has a class slot *and* a homework slot, so both grids total 48.
 */
export const LABEL_SIZES = [15, 15, 18];
export const LABEL_COUNT = LABEL_SIZES.length;
export const LABEL_OFFSETS = LABEL_SIZES.map((_, i) =>
  LABEL_SIZES.slice(0, i).reduce((sum, n) => sum + n, 0)
);
export const TOTAL_SLOTS = LABEL_SIZES.reduce((sum, n) => sum + n, 0);

/** Both grids have one cell per lesson across all labels (48). */
export const CLASS_SLOTS = TOTAL_SLOTS;
export const HOMEWORK_SLOTS = TOTAL_SLOTS;

/** Selectable HSK proficiency levels (old 1–6 + the combined new 7–9 band). */
export const HSK_LEVELS = ["HSK 1", "HSK 2", "HSK 3", "HSK 4", "HSK 5", "HSK 6", "HSK 7-9"];

export function labelName(label: number): string {
  return `Label ${label}`;
}

/** Which label (1-based) a flat slot index belongs to. */
export function labelForSlot(index: number): number {
  for (let i = 0; i < LABEL_COUNT; i++) {
    if (index < LABEL_OFFSETS[i] + LABEL_SIZES[i]) return i + 1;
  }
  return LABEL_COUNT;
}

/** Trim + hard-cap a field so a public submit can't store unbounded text. */
export function cleanText(value: unknown, max: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, max);
}

/**
 * Coerce anything into a fixed-length boolean[] of exactly `length` cells.
 * Missing / extra entries are normalised so the stored arrays never drift.
 */
export function normalizeMarks(value: unknown, length: number): boolean[] {
  const arr = Array.isArray(value) ? value : [];
  return Array.from({ length }, (_, i) => Boolean(arr[i]));
}

export function countMarks(marks: boolean[]): number {
  return marks.reduce((n, on) => (on ? n + 1 : n), 0);
}

/** Pull the public (anyone-can-edit) fields out of an untrusted body. */
export function normalizePaidInput(body: unknown): PaidInput {
  const raw = (body ?? {}) as Record<string, unknown>;
  return {
    name: cleanText(raw.name, 120),
    whatsapp: cleanText(raw.whatsapp, 40),
    address: cleanText(raw.address, 300),
    occupation: cleanText(raw.occupation, 120),
    dateOfBirth: cleanText(raw.dateOfBirth, 40),
    details: cleanText(raw.details, 4000),
    hskLevel: cleanText(raw.hskLevel, 20),
  };
}

/** True when a body carries either admin-only marks grid. */
export function hasMarksFields(body: unknown): boolean {
  const raw = (body ?? {}) as Record<string, unknown>;
  return "classMarks" in raw || "homeworkMarks" in raw;
}

/** Only the marks grids the body actually sent, each normalised to full length. */
export function normalizePaidMarks(body: unknown): PaidMarks {
  const raw = (body ?? {}) as Record<string, unknown>;
  const out: PaidMarks = {};
  if ("classMarks" in raw) out.classMarks = normalizeMarks(raw.classMarks, CLASS_SLOTS);
  if ("homeworkMarks" in raw) out.homeworkMarks = normalizeMarks(raw.homeworkMarks, HOMEWORK_SLOTS);
  return out;
}

/** Shape a Mongo doc/lean object into the client-facing entry. */
export function serializePaidEntry(input: unknown): PaidEntry {
  const doc = (input ?? {}) as Record<string, unknown>;
  const str = (key: string) => (typeof doc[key] === "string" ? (doc[key] as string) : "");
  const iso = (key: string) => {
    const value = doc[key];
    if (!value) return undefined;
    const date = new Date(value as string);
    return Number.isNaN(date.getTime()) ? undefined : date.toISOString();
  };
  const classMarks = normalizeMarks(doc.classMarks, CLASS_SLOTS);
  const homeworkMarks = normalizeMarks(doc.homeworkMarks, HOMEWORK_SLOTS);
  return {
    _id: String(doc._id),
    name: str("name"),
    whatsapp: str("whatsapp"),
    address: str("address"),
    occupation: str("occupation"),
    dateOfBirth: str("dateOfBirth"),
    details: str("details"),
    hskLevel: str("hskLevel"),
    classMarks,
    homeworkMarks,
    classesDone: countMarks(classMarks),
    homeworkDone: countMarks(homeworkMarks),
    createdAt: iso("createdAt"),
    updatedAt: iso("updatedAt"),
  };
}
