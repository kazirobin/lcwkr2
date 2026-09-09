// Exam data registry — assembles the generated per-level lesson data and
// derives the full exam (4 sections, 50 marks) for any HSK 1–3 lesson.
// Everything is local static data; no database involved.

import type {
  DialogueBlank,
  DialogueQuestion,
  LessonExam,
  MatchingPair,
  MatchingQuestion,
  SpeakingQuestion,
  WritingQuestion,
} from "../exam-types";
import { hsk1ExamLessons } from "./generated/hsk1";
import { hsk2ExamLessons } from "./generated/hsk2";
import { hsk3ExamLessons } from "./generated/hsk3";
import type { GenLesson } from "../exam-types";

const ALL_LESSONS: GenLesson[] = [
  ...hsk1ExamLessons,
  ...hsk2ExamLessons,
  ...hsk3ExamLessons,
];

export const EXAM_LEVELS = [1, 2, 3] as const;

export const LEVEL_TITLES: Record<number, string> = {
  1: "HSK 1",
  2: "HSK 2",
  3: "HSK 3",
};

/** Sorted lesson numbers available for a level. */
export function getExamLessonNumbers(level: number): number[] {
  return ALL_LESSONS.filter((l) => l.level === level)
    .map((l) => l.lesson)
    .sort((a, b) => a - b);
}

export function getExamLesson(level: number, lesson: number): GenLesson | null {
  return ALL_LESSONS.find((l) => l.level === level && l.lesson === lesson) ?? null;
}

// ── deterministic PRNG so every visitor gets the same exam per lesson ──
function mulberry32(seed: number) {
  let a = seed >>> 0;
  return () => {
    a |= 0;
    a = (a + 0x6d2b79f5) | 0;
    let t = Math.imul(a ^ (a >>> 15), 1 | a);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

function shuffled<T>(items: T[], rand: () => number): T[] {
  const arr = [...items];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(rand() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// ── section builders ────────────────────────────────────────────────────

function buildWriting(data: GenLesson, rand: () => number): WritingQuestion[] {
  // 10 × 1 mark: show meaning (+pinyin hint), type the hanzi.
  const pool = shuffled(
    data.words.filter((w) => w.h && w.b),
    rand,
  );
  const picked = pool.slice(0, 10);
  return picked.map((w, i) => ({
    kind: "writing" as const,
    id: `w${i}`,
    prompt: w.b,
    target: w.h,
    pinyin: w.p,
    marks: 1,
  }));
}

function buildMatching(data: GenLesson, rand: () => number): MatchingQuestion[] {
  // 1 question, 5 pairs × 2 marks: hanzi ↔ Bangla meaning.
  const pool = shuffled(
    data.words.filter((w) => w.h && w.b),
    rand,
  );
  const picked = pool.slice(0, 5);
  if (picked.length < 2) return [];

  const allBn = picked.map((w) => w.b);
  const pairs: MatchingPair[] = picked.map((w) => ({
    hanzi: w.h,
    pinyin: w.p,
    bn: w.b,
    en: w.e,
  }));

  return [
    {
      kind: "matching",
      id: "m0",
      pairs,
      options: shuffled(allBn, rand),
      marks: 2 * pairs.length,
    },
  ];
}

function buildDialogues(data: GenLesson, rand: () => number): DialogueQuestion[] {
  // 3 questions × 5 marks. A known lesson word is blanked out of a real
  // dialogue line; the user picks the missing hanzi from 4 choices.
  const questions: DialogueQuestion[] = [];
  const used = new Set<string>();

  // longest words first so we blank meaningful chunks, not single chars
  const words = [...data.words]
    .filter((w) => w.h.length >= 2)
    .sort((a, b) => b.h.length - a.h.length);

  for (const d of data.dialogues) {
    if (questions.length >= 3) break;

    for (let i = 0; i < d.lines.length; i++) {
      if (questions.length >= 3) break;
      const line = d.lines[i];
      if (line.h.length < 4) continue;

      const word = words.find((w) => line.h.includes(w.h) && !used.has(`${d.title}-${w.h}`));
      if (!word) continue;
      used.add(`${d.title}-${word.h}`);

      const distractors = shuffled(
        data.words.filter((w) => w.h !== word.h && w.h.length === word.h.length),
        rand,
      );
      const fallback = shuffled(
        data.words.filter((w) => w.h !== word.h && !distractors.some((x) => x.h === w.h)),
        rand,
      );
      const wrong = [...distractors, ...fallback].slice(0, 3);
      if (wrong.length < 3) continue;

      const blank: DialogueBlank = {
        id: `d${questions.length}b0`,
        lineIndex: i,
        hanzi: line.h.replace(word.h, "＿＿＿"),
        answer: word.h,
        pinyin: line.p,
        en: line.e,
        choices: shuffled([word.h, ...wrong.map((w) => w.h)], rand),
      };

      questions.push({
        kind: "dialogue",
        id: `dq${questions.length}`,
        title: d.title,
        lines: d.lines.map((ln) => ({ s: ln.s, h: ln.h })),
        blanks: [blank],
        marks: 5,
      });
      break;
    }
  }

  return questions;
}

function buildSpeaking(data: GenLesson, rand: () => number): SpeakingQuestion[] {
  // 3 × 5 marks: read a dialogue line / example aloud and record it.
  const prompts: { h: string; p: string; e: string; b: string }[] = [];

  for (const d of data.dialogues) {
    if (prompts.length >= 3) break;
    const line = d.lines.find((ln) => ln.h.length >= 3);
    if (line && !prompts.some((p) => p.h === line.h)) {
      prompts.push({ h: line.h, p: line.p, e: line.e, b: "" });
    }
  }
  for (const ex of data.examples) {
    if (prompts.length >= 3) break;
    if (ex.h.length >= 3 && !prompts.some((p) => p.h === ex.h)) {
      prompts.push({ h: ex.h, p: ex.p, e: ex.e, b: ex.b });
    }
  }
  if (prompts.length === 0 && data.words.length > 0) {
    const combo = shuffled(data.words, rand).slice(0, 3);
    prompts.push({
      h: combo.map((w) => w.h).join(""),
      p: combo.map((w) => w.p).join(" "),
      e: combo.map((w) => w.e).join(", "),
      b: combo.map((w) => w.b).join(", "),
    });
  }

  return prompts.map((p, i) => ({
    kind: "speaking" as const,
    id: `s${i}`,
    line: p.h,
    pinyin: p.p,
    en: p.e,
    bn: p.b,
    marks: 5,
  }));
}

/** Full 50-mark exam for a lesson (writing 10 + matching 10 + dialogue 15 + speaking 15). */
export function buildLessonExam(level: number, lesson: number): LessonExam | null {
  const data = getExamLesson(level, lesson);
  if (!data) return null;

  const rand = mulberry32(level * 1000 + lesson * 7 + 13);
  const writing = buildWriting(data, rand);
  const matching = buildMatching(data, rand);
  const dialogues = buildDialogues(data, rand);
  const speaking = buildSpeaking(data, rand);

  const totalMarks =
    writing.reduce((n, q) => n + q.marks, 0) +
    matching.reduce((n, q) => n + q.marks, 0) +
    dialogues.reduce((n, q) => n + q.marks, 0) +
    speaking.reduce((n, q) => n + q.marks, 0);

  return {
    level,
    lesson,
    titleEn: `HSK ${level} · Lesson ${lesson}`,
    titleBn: `এইচএসকে ${level} · লেসন ${lesson}`,
    totalMarks,
    writing,
    matching,
    dialogues,
    speaking,
  };
}
