import { hsk1EverydayDialogues } from "../hsk1-everyday";

export interface HwDialogueLine {
  speaker: "A" | "B";
  hanzi: string;
  /** Absent for admin-entered lines (hanzi-only scripts still play). */
  pinyin?: string;
  en?: string;
  bn?: string;
}

/**
 * Lesson-1 script = the everyday dialogue (single source of truth lives
 * in hsk1-everyday.ts — edit there; this re-export keeps existing
 * imports, e.g. the admin default text, working).
 */
export const lesson1Dialogue: HwDialogueLine[] = hsk1EverydayDialogues[1];
