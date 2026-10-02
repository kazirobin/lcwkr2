// src/features/vocabulary/pdf-reader/annotations.ts
//
// Marks the reader makes on a page: ink, highlight, underline and sticky notes.
//
// Two decisions worth stating, because both would be easy to get wrong later:
//
// 1. **Marks are kept in the PDF's own coordinate space, normalised to 0–1 of
//    the un-rotated page.** Storing screen pixels would tie a highlight to one
//    zoom level, so zooming would smear it across the words. Storing in the
//    book's space and mapping through pdf.js's viewport transform at draw time
//    means a mark stays welded to its characters at any zoom, and rotates with
//    the page when the reader rotates it.
//
// 2. **Marks live in `localStorage`, not the database.** A highlight is a
//    private reading aid for one person on one device. Putting it behind an
//    account would mean a sync endpoint, a schema, a conflict rule for two
//    devices and a delete story — all to store something a student never
//    expects to follow them to another phone. If marks ever do need to travel,
//    the shape here is already the one that would be uploaded.

import type { MarkColorId } from "./types";

export interface InkMark {
  kind: "ink";
  id: string;
  /** Normalised (0–1) points along the stroke. */
  points: { x: number; y: number }[];
  color: string;
  /** Stroke width as a fraction of the page's shorter side. */
  width: number;
}

export interface RectMark {
  kind: "highlight" | "underline";
  id: string;
  x: number;
  y: number;
  w: number;
  h: number;
  color: string;
}

export interface NoteMark {
  kind: "note";
  id: string;
  x: number;
  y: number;
  text: string;
}

export type PageMark = InkMark | RectMark | NoteMark;

/** Marks keyed by page number, 1-based, as pdf.js counts them. */
export type MarkStore = Record<number, PageMark[]>;

const storageKey = (bookKey: string) => `lcwkr_pdf_marks_${bookKey}`;

export function loadMarks(bookKey: string): MarkStore {
  try {
    const raw = localStorage.getItem(storageKey(bookKey));
    if (!raw) return {};
    const parsed: unknown = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) return {};
    const out: MarkStore = {};
    for (const [page, marks] of Object.entries(parsed as Record<string, unknown>)) {
      const n = Number(page);
      if (!Number.isFinite(n) || !Array.isArray(marks)) continue;
      const clean = marks.filter(isPageMark);
      if (clean.length) out[n] = clean;
    }
    return out;
  } catch {
    /* private mode, quota, or someone hand-edited the key: start clean */
    return {};
  }
}

export function saveMarks(bookKey: string, store: MarkStore): boolean {
  try {
    localStorage.setItem(storageKey(bookKey), JSON.stringify(store));
    return true;
  } catch {
    /* over quota — the marks stay in memory for this session */
    return false;
  }
}

export function clearAllMarks(bookKey: string) {
  try {
    localStorage.removeItem(storageKey(bookKey));
  } catch {
    /* ignore */
  }
}

function isPageMark(value: unknown): value is PageMark {
  if (!value || typeof value !== "object") return false;
  const m = value as Record<string, unknown>;
  if (typeof m.id !== "string") return false;
  if (m.kind === "ink") return Array.isArray(m.points);
  if (m.kind === "highlight" || m.kind === "underline") return typeof m.x === "number";
  if (m.kind === "note") return typeof m.x === "number" && typeof m.text === "string";
  return false;
}

let counter = 0;
export function newMarkId(): string {
  counter += 1;
  return `${Date.now().toString(36)}-${counter.toString(36)}`;
}

export const MARK_DEFAULT_COLOR: Record<"highlight" | "underline" | "ink", MarkColorId> = {
  highlight: "yellow",
  underline: "green",
  ink: "blue",
};

/** Area in normalised units^2 below which a drag counts as a tap, not a mark. */
export const DRAG_THRESHOLD = 0.0015;

export function isMeaningfulDrag(x: number, y: number, w: number, h: number): boolean {
  return Math.abs(w) > DRAG_THRESHOLD || Math.abs(h) > DRAG_THRESHOLD;
}
