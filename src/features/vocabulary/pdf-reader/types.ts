// src/features/vocabulary/pdf-reader/types.ts
//
// Shared vocabulary for the reader. Kept in one file because these types are
// meaningless apart — a reader without its tools and its themes is just a PDF
// view, which is what this used to be.

/** How a book's pages are laid out in the reading area. */
export type PageLayout = "single" | "continuous" | "twoPage";

/** Reading surfaces. Light is the book's own paper; the rest are for eyes. */
export type ReaderTheme = "light" | "sepia" | "dark" | "night";

/** What a pointer drag does on the page. */
export type ReaderTool = "none" | "pan" | "ink" | "highlight" | "underline" | "note" | "area";

export interface ReaderThemeSpec {
  id: ReaderTheme;
  /** Written for the button tooltip, in both languages. */
  label: { bn: string; en: string };
  /** The area behind the paper. */
  backdrop: string;
  /** Drop shadow colour for the paper. */
  shadow: string;
  /**
   * A CSS filter over the rendered page. The books are colour artwork, so a
   * theme has to recolour the pixels rather than tint a box behind them —
   * a backdrop alone leaves white paper glaring in a dark room.
   */
  filter: string;
  /** Colour of selectable text drawn on top of the filtered page. */
  textColor: string;
  /** Backing store for a text-selection highlight. */
  selectionColor: string;
}

/**
 * `invert` alone turns a white page black but leaves the black text white and
 * the artwork's colours inverted; the hue rotation puts the hues back. The
 * `brightness`/contrast pair is what makes reading text off an inverted page
 * comfortable rather than merely possible.
 */
export const READER_THEMES: Record<ReaderTheme, ReaderThemeSpec> = {
  light: {
    id: "light",
    label: { bn: "সাধারণ", en: "Paper" },
    backdrop: "#1c1815",
    shadow: "rgba(0,0,0,0.55)",
    filter: "none",
    textColor: "#111111",
    selectionColor: "rgba(59,130,246,0.35)",
  },
  sepia: {
    id: "sepia",
    label: { bn: "আই কেয়ার", en: "Sepia" },
    backdrop: "#2b2119",
    shadow: "rgba(0,0,0,0.5)",
    filter: "sepia(0.42) saturate(1.15) brightness(0.97) contrast(1.03)",
    textColor: "#3a2c1d",
    selectionColor: "rgba(180,120,40,0.35)",
  },
  dark: {
    id: "dark",
    label: { bn: "ডার্ক", en: "Dark" },
    backdrop: "#0b0b0d",
    shadow: "rgba(0,0,0,0.8)",
    filter: "invert(1) hue-rotate(180deg) brightness(0.93) contrast(0.95)",
    textColor: "#e8e6e3",
    selectionColor: "rgba(96,165,250,0.4)",
  },
  night: {
    id: "night",
    label: { bn: "রাতের মোড", en: "Night" },
    backdrop: "#000000",
    shadow: "rgba(0,0,0,0.9)",
    filter: "invert(1) hue-rotate(180deg) brightness(0.62) contrast(0.9)",
    textColor: "#b9b6b0",
    selectionColor: "rgba(120,160,220,0.35)",
  },
};

export const READER_THEME_ORDER: ReaderTheme[] = ["light", "sepia", "dark", "night"];

/** Ink colours offered for highlighting and underlining. */
export const MARK_COLORS = [
  { id: "yellow", value: "#facc15" },
  { id: "green", value: "#4ade80" },
  { id: "blue", value: "#60a5fa" },
  { id: "pink", value: "#f472b6" },
  { id: "orange", value: "#fb923c" },
] as const;

export type MarkColorId = (typeof MARK_COLORS)[number]["id"];

export const MARK_COLOR_BY_ID: Record<string, string> = Object.fromEntries(
  MARK_COLORS.map((c) => [c.id, c.value]),
);
