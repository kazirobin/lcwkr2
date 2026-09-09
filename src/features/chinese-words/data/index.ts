// Local data access for the Chinese Core Word Builder. Everything here is
// static and client-safe — the page bundles it, so there is no fetch and
// no MongoDB involved.

import type { ChineseWordEntry, LessonWord } from "../types";
import { CHINESE_WORDS } from "./words";
import { LESSON_WORDS } from "./lesson-words";

export { CHINESE_WORDS, LESSON_WORDS };

/** HSK levels present in the local lesson data. */
export const LESSON_LEVELS = [
  ...new Set(LESSON_WORDS.map((w) => w.level)),
].sort((a, b) => a - b);

/** lesson → words for one level. */
export function getLessonWords(level: number): Map<number, LessonWord[]> {
  const map = new Map<number, LessonWord[]>();
  for (const w of LESSON_WORDS) {
    if (w.level !== level) continue;
    const list = map.get(w.lesson) ?? [];
    list.push(w);
    map.set(w.lesson, list);
  }
  return map;
}

/**
 * Every hanzi known to the root-word dataset — root characters plus all
 * their related words. The lesson browser checks membership against this.
 */
export function buildKnownWordSet(): Set<string> {
  const set = new Set<string>();
  for (const entry of CHINESE_WORDS) {
    set.add(entry.character);
    for (const rw of entry.relatedWords ?? []) {
      if (rw.word) set.add(rw.word);
    }
  }
  return set;
}

/** The root entry for a hanzi, if the dataset has it as a root. */
export function findWordEntry(hanzi: string): ChineseWordEntry | undefined {
  return CHINESE_WORDS.find((w) => w.character === hanzi);
}
