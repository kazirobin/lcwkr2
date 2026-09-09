// Exam types for the /hw homework/exam feature. Client-safe.
// Questions are derived at runtime from the generated HSK vocabulary data
// (data/generated) so the exam content always matches the lesson content.

// ── generated source data shapes (data/generated/*.ts) ────────────────

export interface GenWord {
  h: string; // hanzi
  p: string; // pinyin
  e: string; // English meaning
  b: string; // Bangla meaning
}

export interface GenDialogueLine {
  s: string; // speaker
  h: string; // hanzi
  p: string; // pinyin
  e: string; // English
}

export interface GenDialogue {
  text: number;
  title: string;
  lines: GenDialogueLine[];
}

export interface GenLesson {
  level: number;
  lesson: number;
  words: GenWord[];
  dialogues: GenDialogue[];
  examples: GenWord[];
}

// ── exam engine shapes ──────────────────────────────────────────────────

export type ExamSectionId = "writing" | "matching" | "dialogue" | "speaking";

export interface WritingQuestion {
  kind: "writing";
  id: string;
  prompt: string; // meaning shown (En per language handled at render)
  target: string; // the hanzi to type
  pinyin: string;
  marks: number; // 1 each
}

export interface MatchingPair {
  hanzi: string;
  pinyin: string;
  bn: string;
  en: string;
}

export interface MatchingQuestion {
  kind: "matching";
  id: string;
  pairs: MatchingPair[]; // 5 per question
  options: string[]; // shuffled Bangla meanings to choose from
  marks: number; // 2 per correct pair
}

export interface DialogueBlank {
  id: string;
  lineIndex: number;
  hanzi: string; // line with the word replaced by ＿＿＿
  answer: string; // the removed word
  pinyin: string;
  en: string;
  choices: string[]; // 4 options
}

export interface DialogueQuestion {
  kind: "dialogue";
  id: string;
  title: string;
  lines: { s: string; h: string }[];
  blanks: DialogueBlank[];
  marks: number; // 3 per blank
}

export interface SpeakingQuestion {
  kind: "speaking";
  id: string;
  line: string; // hanzi to pronounce
  pinyin: string;
  en: string;
  bn: string;
  marks: number; // 5 each
}

export type ExamQuestion =
  | WritingQuestion
  | MatchingQuestion
  | DialogueQuestion
  | SpeakingQuestion;

/** Fully-derived exam for one lesson. */
export interface LessonExam {
  level: number;
  lesson: number;
  titleEn: string;
  titleBn: string;
  totalMarks: number;
  writing: WritingQuestion[];
  matching: MatchingQuestion[];
  dialogues: DialogueQuestion[];
  speaking: SpeakingQuestion[];
}

/** One graded answer for the result review. */
export interface ExamResultItem {
  section: ExamSectionId;
  id: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  earned: number;
  marks: number;
}

export interface ExamResult {
  key: string; // `${level}-${lesson}`
  level: number;
  lesson: number;
  totalScore: number;
  totalMarks: number;
  items: ExamResultItem[];
  submittedAt: string; // ISO timestamp
}

/** Stored per question id for draft persistence. */
export type ExamAnswers = Record<string, string>;
