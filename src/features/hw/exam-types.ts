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

export type ExamSectionId =
  | "writing"
  | "matching"
  | "dialogue"
  | "mcq"
  | "speaking";

export interface WritingQuestion {
  kind: "writing";
  id: string;
  prompt: string; // meaning shown (En per language handled at render)
  target: string; // the hanzi to type
  pinyin: string;
  marks: number; // equal share of the part's 10 marks
}

export interface MatchingPair {
  hanzi: string;
  pinyin: string;
  bn: string;
  en: string;
  marks: number; // equal share of the part's 10 marks
}

export interface MatchingQuestion {
  kind: "matching";
  id: string;
  pairs: MatchingPair[]; // 5 per question
  options: string[]; // shuffled Bangla meanings to choose from
  marks: number; // sum of the pair marks
}

export interface DialogueBlank {
  id: string;
  lineIndex: number;
  hanzi: string; // line with the word replaced by ＿＿＿
  answer: string; // the removed word
  pinyin: string;
  en: string;
  choices: { hanzi: string; pinyin: string }[];
  marks: number; // equal share of the part's 10 marks
}

export interface DialogueQuestion {
  kind: "dialogue";
  id: string;
  title: string;
  lines: { s: string; h: string; p: string }[];
  blanks: DialogueBlank[];
  marks: number; // sum of the blank marks
}

export interface SpeakingQuestion {
  kind: "speaking";
  id: string;
  line: string; // hanzi to pronounce
  pinyin: string;
  en: string;
  bn: string;
  marks: number; // 0 - practice only, not graded
}

/** MCQ: hanzi shown, pick the correct Bangla meaning. Each question carries an
 *  equal share of the part's 10 marks. */
export interface McqQuestion {
  kind: "mcq";
  id: string;
  hanzi: string;
  pinyin: string;
  en: string;
  bn: string; // correct Bangla
  choices: string[]; // 4 Bangla options (includes bn)
  marks: number;
}

export type ExamQuestion =
  | WritingQuestion
  | MatchingQuestion
  | DialogueQuestion
  | McqQuestion
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
  mcq: McqQuestion[];
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
