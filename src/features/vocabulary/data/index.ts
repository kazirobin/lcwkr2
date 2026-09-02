// src/features/vocabulary/data/index.ts
//
// The vocabulary lookup layer. The three `hsk{1,2,3}/index.ts` registries
// each hand-list their text modules under ad-hoc string keys that are NOT
// consistent across levels ("1-1" vs "1-1-1" vs "2-1-1"). We ignore those
// keys entirely and re-index every record by the one identity that IS
// reliable and present on every file: `hskLevel` / `lesson` / `text`.
//
// SERVER ONLY in spirit — this module closes over every text file, so it
// must never be imported into a client component. Route pages call it,
// derive exactly what a view needs, and pass plain props down.

import type {
  VocabularyData,
  LevelSummary,
  LevelDetail,
  LessonDetail,
  LessonSummary,
  TextSummary,
  TextNav,
} from "@/features/vocabulary/types";

import { hsk1DataMap } from "./hsk1";
import { hsk2DataMap } from "./hsk2";
import { hsk3DataMap } from "./hsk3";

/** Levels that have content today. 4–6 are planned — see {@link ALL_LEVELS}. */
const LEVELS_WITH_DATA = [1, 2, 3] as const;
/** Every level the track promises, present or not. */
export const ALL_LEVELS = [1, 2, 3, 4, 5, 6] as const;

const key = (level: number, lesson: number, text: number) =>
  `${level}-${lesson}-${text}`;

// ── one-time index ───────────────────────────────────────────────────

const records: VocabularyData[] = [
  ...Object.values(hsk1DataMap),
  ...Object.values(hsk2DataMap),
  ...Object.values(hsk3DataMap),
];

const byKey = new Map<string, VocabularyData>();
/** level → sorted lesson numbers */
const lessonsByLevel = new Map<number, number[]>();
/** `${level}-${lesson}` → sorted text numbers */
const textsByLesson = new Map<string, number[]>();
/** level → every text as {lesson,text}, ordered for prev/next */
const orderedTexts = new Map<number, { lesson: number; text: number }[]>();

for (const r of records) {
  byKey.set(key(r.hskLevel, r.lesson, r.text), r);

  const lessons = lessonsByLevel.get(r.hskLevel) ?? [];
  if (!lessons.includes(r.lesson)) lessons.push(r.lesson);
  lessonsByLevel.set(r.hskLevel, lessons);

  const lk = `${r.hskLevel}-${r.lesson}`;
  const texts = textsByLesson.get(lk) ?? [];
  if (!texts.includes(r.text)) texts.push(r.text);
  textsByLesson.set(lk, texts);
}

for (const [level, lessons] of lessonsByLevel) {
  lessons.sort((a, b) => a - b);
  for (const lesson of lessons) {
    textsByLesson.get(`${level}-${lesson}`)?.sort((a, b) => a - b);
  }
  const flat = lessons.flatMap((lesson) =>
    (textsByLesson.get(`${level}-${lesson}`) ?? []).map((text) => ({
      lesson,
      text,
    })),
  );
  orderedTexts.set(level, flat);
}

const wordCount = (level: number, lesson?: number, text?: number): number => {
  let total = 0;
  for (const r of records) {
    if (r.hskLevel !== level) continue;
    if (lesson !== undefined && r.lesson !== lesson) continue;
    if (text !== undefined && r.text !== text) continue;
    total += r.vocabulary.length;
  }
  return total;
};

// ── public API ───────────────────────────────────────────────────────

/** Every level for the `/hsk` picker, including the not-yet-built 4–6. */
export function getLevelSummaries(): LevelSummary[] {
  return ALL_LEVELS.map((level) => {
    const lessons = lessonsByLevel.get(level) ?? [];
    const texts = orderedTexts.get(level) ?? [];
    return {
      level,
      available: LEVELS_WITH_DATA.includes(level as 1 | 2 | 3),
      lessons: lessons.length,
      texts: texts.length,
      words: wordCount(level),
    };
  });
}

/** Lesson-by-lesson breakdown of one level, or null if it has no data. */
export function getLevelDetail(level: number): LevelDetail | null {
  const lessons = lessonsByLevel.get(level);
  if (!lessons || lessons.length === 0) return null;

  const lessonSummaries: LessonSummary[] = lessons.map((lesson) => {
    const texts = textsByLesson.get(`${level}-${lesson}`) ?? [];
    const hasDialogue = texts.some(
      (text) => byKey.get(key(level, lesson, text))?.dialogue != null,
    );
    return {
      lesson,
      texts: texts.length,
      words: wordCount(level, lesson),
      hasDialogue,
    };
  });

  return {
    level,
    lessons: lessonSummaries,
    texts: (orderedTexts.get(level) ?? []).length,
    words: wordCount(level),
  };
}

/** Text-by-text breakdown of one lesson, or null if it has no data. */
export function getLessonDetail(
  level: number,
  lesson: number,
): LessonDetail | null {
  const texts = textsByLesson.get(`${level}-${lesson}`);
  if (!texts || texts.length === 0) return null;

  const textSummaries: TextSummary[] = texts.map((text) => {
    const record = byKey.get(key(level, lesson, text));
    return {
      text,
      words: record?.vocabulary.length ?? 0,
      hasDialogue: record?.dialogue != null,
      preview: (record?.vocabulary ?? []).slice(0, 5).map((v) => v.hanzi),
    };
  });

  return {
    level,
    lesson,
    texts: textSummaries,
    words: wordCount(level, lesson),
  };
}

/** The full record for one text, or null. */
export function getText(
  level: number,
  lesson: number,
  text: number,
): VocabularyData | null {
  return byKey.get(key(level, lesson, text)) ?? null;
}

/** Ordered text numbers for a lesson (used by the in-lesson jump strip). */
export function getTextsForLesson(level: number, lesson: number): number[] {
  return textsByLesson.get(`${level}-${lesson}`) ?? [];
}

/** Where a text sits in its level and where prev / next lead. */
export function getTextNav(
  level: number,
  lesson: number,
  text: number,
): TextNav | null {
  const flat = orderedTexts.get(level);
  if (!flat) return null;
  const i = flat.findIndex((t) => t.lesson === lesson && t.text === text);
  if (i === -1) return null;

  return {
    indexInLevel: i + 1,
    totalInLevel: flat.length,
    lessonTexts: getTextsForLesson(level, lesson),
    totalLessons: (lessonsByLevel.get(level) ?? []).length,
    prev: i > 0 ? flat[i - 1] : null,
    next: i < flat.length - 1 ? flat[i + 1] : null,
  };
}

// ── static-params helpers (build time only) ──────────────────────────

export function getLevelParams(): { level: string }[] {
  return [...lessonsByLevel.keys()]
    .sort((a, b) => a - b)
    .map((level) => ({ level: String(level) }));
}

export function getLessonParams(): { level: string; lessonNumber: string }[] {
  return [...lessonsByLevel.entries()]
    .sort(([a], [b]) => a - b)
    .flatMap(([level, lessons]) =>
      lessons.map((lesson) => ({
        level: String(level),
        lessonNumber: String(lesson),
      })),
    );
}

export function getTextParams(): {
  level: string;
  lessonNumber: string;
  textNumber: string;
}[] {
  return [...orderedTexts.entries()]
    .sort(([a], [b]) => a - b)
    .flatMap(([level, texts]) =>
      texts.map(({ lesson, text }) => ({
        level: String(level),
        lessonNumber: String(lesson),
        textNumber: String(text),
      })),
    );
}
