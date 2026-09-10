// Local data access for the Chinese Core Word Builder. Everything here is
// static and client-safe — the page bundles it, so there is no fetch and
// no MongoDB involved.

import type { ChineseWordEntry, LessonWord } from "../types";
import { HSK1_WORDS } from "./hsk1";
import { HSK2_WORDS } from "./hsk2";
import { HSK3_WORDS } from "./hsk3";
import { LESSON_WORDS } from "./lesson-words";

export { LESSON_WORDS };

/** All root-word entries, HSK 1 → 3. */
export const CHINESE_WORDS: ChineseWordEntry[] = [
  ...HSK1_WORDS,
  ...HSK2_WORDS,
  ...HSK3_WORDS,
];

export const WORDS_BY_LEVEL: Record<number, ChineseWordEntry[]> = {
  1: HSK1_WORDS,
  2: HSK2_WORDS,
  3: HSK3_WORDS,
};

/** HSK levels present in the local lesson data. */
export const LESSON_LEVELS = [...new Set(LESSON_WORDS.map((w) => w.level))].sort(
  (a, b) => a - b,
);

/** Root-word levels present in the local dataset. */
export const WORD_LEVELS = [1, 2, 3];

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

/**
 * Strip tone marks from pinyin so "ni hao", "nihao", "ni3 hao" style
 * queries match "nǐ hǎo".
 */
export function stripTones(pinyin: string): string {
  return pinyin
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ǖǘǚǜ]/g, "v")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

/** Precomputed lowercase search corpus per entry (hanzi/pinyin/en/bn). */
const searchCorpus = new Map<ChineseWordEntry, string>();
for (const entry of CHINESE_WORDS) {
  const parts: string[] = [
    entry.character,
    stripTones(entry.pinyin),
    entry.pinyin.toLowerCase(),
    entry.meaningEn.toLowerCase(),
    entry.meaningBn,
  ];
  for (const rw of entry.relatedWords ?? []) {
    parts.push(
      rw.word,
      stripTones(rw.pinyin),
      rw.pinyin.toLowerCase(),
      rw.meaningEn.toLowerCase(),
      rw.meaningBn,
    );
  }
  searchCorpus.set(entry, parts.join("\n").toLowerCase());
}

/**
 * Dynamic search across hanzi, toneless pinyin, English and Bangla.
 * Multi-token queries must all match ("xue sheng" finds 学生).
 */
export function searchWords(query: string, level: number | "All"): ChineseWordEntry[] {
  const q = query.trim().toLowerCase();
  const qToneless = stripTones(query);
  const tokens = (qToneless || q).split(/\s+/).filter(Boolean);

  const pool =
    level === "All" ? CHINESE_WORDS : WORDS_BY_LEVEL[level] ?? CHINESE_WORDS;
  if (!q && !qToneless) return pool;

  return pool.filter((entry) => {
    const corpus = searchCorpus.get(entry) ?? "";
    return tokens.every((tok) => corpus.includes(tok));
  });
}
