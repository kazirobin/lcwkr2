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

/** Toneless pinyin with no spaces — "nǐ hǎo" → "nihao". */
function tonelessCompact(pinyin: string): string {
  return stripTones(pinyin).replace(/\s+/g, "");
}

/**
 * Split any query (hanzi / pinyin with or without tones or tone numbers /
 * English / Bangla) into searchable tokens. Punctuation and digits are
 * dropped; CJK and Bangla clusters stay intact.
 */
export function searchTokens(query: string): string[] {
  const q = query
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
  return q
    .split(/[^\p{L}\p{M}\p{N}]+/u)
    .map((t) => t.replace(/\d+/g, "").normalize("NFC"))
    .filter((t) => t.length > 0);
}

/** Build the lowercase search corpus for one entry from its text fields. */
export function makeSearchCorpus(fields: string[]): string {
  return fields.map((f) => f.toLowerCase()).join("\n");
}

/** Precomputed lowercase search corpus per entry (hanzi/pinyin/en/bn). */
const searchCorpus = new Map<ChineseWordEntry, string>();
for (const entry of CHINESE_WORDS) {
  const parts: string[] = [
    entry.character,
    entry.pinyin,
    stripTones(entry.pinyin),
    tonelessCompact(entry.pinyin),
    entry.meaningEn,
    entry.meaningBn,
  ];
  for (const rw of entry.relatedWords ?? []) {
    parts.push(
      rw.word,
      rw.pinyin,
      stripTones(rw.pinyin),
      tonelessCompact(rw.pinyin),
      rw.meaningEn,
      rw.meaningBn,
    );
  }
  searchCorpus.set(entry, makeSearchCorpus(parts));
}

/**
 * Dynamic search across hanzi, pinyin (with or without tones/numbers),
 * English and Bangla — any direction, partial matches allowed.
 * Multi-token queries must all match ("xue sheng" finds 学生).
 */
export function searchWords(query: string, level: number | "All"): ChineseWordEntry[] {
  const tokens = searchTokens(query);

  const pool =
    level === "All" ? CHINESE_WORDS : WORDS_BY_LEVEL[level] ?? CHINESE_WORDS;
  if (tokens.length === 0) return pool;

  return pool.filter((entry) => {
    const corpus = searchCorpus.get(entry) ?? "";
    return tokens.every((tok) => corpus.includes(tok));
  });
}
