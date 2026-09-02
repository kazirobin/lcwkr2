// src/features/vocabulary/types.ts

/** Character-level breakdown of a word. */
export interface Character {
  hanzi: string; // the component character
  pinyin: string; // its pronunciation
  meaning: string; // its meaning in English
}

/** A word offered for comparison / disambiguation. */
export interface SimilarWord {
  hanzi: string;
  pinyin: string;
  english: string;
}

/** An example sentence for a vocabulary item. */
export interface Example {
  hanzi: string;
  pinyin: string;
  english: string;
  bangla: string;
}

/** One vocabulary entry. */
export interface VocabularyItem {
  hanzi: string; // the word
  pinyin: string; // pronunciation
  english: string; // English gloss
  bangla: string; // Bangla gloss — the primary gloss for this audience
  characters: Character[]; // per-character breakdown
  example: Example; // example sentence
  similar: SimilarWord[]; // words worth contrasting
}

/** One line of a lesson dialogue. */
export interface DialogueLine {
  speaker: string; // speaker key (e.g. "A", "Teacher")
  hanzi: string;
  pinyin: string;
  english: string;
  bangla?: string; // optional Bangla translation (older data predates this field)
}

/** The dialogue that opens some texts. */
export interface Dialogue {
  title: string;
  lines: DialogueLine[];
}

/** Everything for one HSK level / lesson / text. */
export interface VocabularyData {
  hskLevel: number; // HSK level, 1–6
  lesson: number; // lesson number within the level
  text: number; // text number within the lesson
  dialogue?: Dialogue;
  vocabulary: VocabularyItem[];
}

/** Internal registry shape — `data/hsk{1,2,3}/index.ts` build these. */
export interface VocabularyDataMap {
  [key: string]: VocabularyData;
}

// ── Derived summary shapes (built once in `data/index.ts`) ────────────

/** A single HSK level as shown on the `/hsk` picker. */
export interface LevelSummary {
  level: number;
  available: boolean; // false for 4–6 until their data lands
  lessons: number;
  texts: number;
  words: number;
}

/** One text as shown on a lesson picker. */
export interface TextSummary {
  text: number;
  words: number;
  hasDialogue: boolean;
  preview: string[]; // first few hanzi, for scent
}

/** One lesson as shown on a level picker. */
export interface LessonSummary {
  lesson: number;
  texts: number;
  words: number;
  hasDialogue: boolean;
}

/** Full breakdown of one level. */
export interface LevelDetail {
  level: number;
  lessons: LessonSummary[];
  texts: number;
  words: number;
}

/** Full breakdown of one lesson. */
export interface LessonDetail {
  level: number;
  lesson: number;
  texts: TextSummary[];
  words: number;
}

/** Where a text sits in its level, and where to go next. */
export interface TextNav {
  indexInLevel: number; // 1-based
  totalInLevel: number;
  lessonTexts: number[]; // every text number in the current lesson
  totalLessons: number;
  prev: { lesson: number; text: number } | null;
  next: { lesson: number; text: number } | null;
}
