import { stripTones } from "@/features/chinese-words";

/**
 * Beginner-friendly pinyin normalization for homework grading.
 * Builds on the shared `stripTones` helper (tone marks stripped,
 * case-insensitive) and additionally drops tone numbers and collapses
 * whitespace — so "ni hao", "Ni Hao" and "ni3 hao3" all match "ni hao".
 */
export function normalizePinyin(input: string): string {
  return stripTones(input)
    .replace(/[0-9]/g, "")
    .replace(/\s+/g, " ")
    .trim();
}

/** True when a typed answer matches the expected pinyin (empty-safe). */
export function matchesPinyinAnswer(answer: string, expectedPinyin: string): boolean {
  const a = normalizePinyin(answer);
  if (!a) return false;
  return a === normalizePinyin(expectedPinyin);
}
