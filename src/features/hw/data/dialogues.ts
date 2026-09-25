import { getText } from "@/features/vocabulary/data";
import { hsk1EverydayDialogues } from "./hsk1-everyday";
import type { HwDialogueLine } from "./hsk1/lesson1-dialogue";

/**
 * Built-in listening script for any HSK level + lesson.
 *
 * Resolution order (server-side — the vocabulary dataset must never be
 * bundled into client JS, so this runs in the /api/hw/dialogue route):
 *   1. HSK-1 everyday dialogues (hsk1-everyday.ts — the course scripts).
 *   2. The lesson's own textbook dialogue (text 1), speakers mapped to
 *      A/B by order of appearance; narrator lines are skipped.
 *   3. undefined → the player hides itself.
 */
const NARRATOR = new Set(["Narrator", "旁白", "Narration"]);

export function getBuiltinDialogueSource(level: number, lesson: number): "everyday" | "textbook" | null {
  if (level === 1 && hsk1EverydayDialogues[lesson]?.length) return "everyday";
  try {
    const data = getText(level, lesson, 1);
    if (data?.dialogue?.lines?.length) return "textbook";
  } catch {
    /* ignore */
  }
  return null;
}

export function getBuiltinDialogue(level: number, lesson: number): HwDialogueLine[] | undefined {
  if (level === 1) {
    const own = hsk1EverydayDialogues[lesson];
    if (own?.length) return own;
  }
  try {
    const data = getText(level, lesson, 1);
    const dlg = data?.dialogue;
    if (!dlg?.lines?.length) return undefined;
    const order: string[] = [];
    const out: HwDialogueLine[] = [];
    for (const ln of dlg.lines) {
      if (NARRATOR.has(ln.speaker)) continue;
      let idx = order.indexOf(ln.speaker);
      if (idx === -1) {
        order.push(ln.speaker);
        idx = order.length - 1;
      }
      out.push({
        speaker: idx % 2 === 0 ? "A" : "B",
        hanzi: ln.hanzi,
        pinyin: ln.pinyin,
        en: ln.english,
        bn: ln.bangla ?? "",
      });
    }
    return out.length ? out : undefined;
  } catch {
    return undefined;
  }
}
