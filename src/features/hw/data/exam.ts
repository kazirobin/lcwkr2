// Exam data registry — assembles the generated per-level lesson data and
// derives the full exam (5 sections, dynamic total) for any HSK 1–3 lesson.
// Everything is local static data; no database involved.

import type {
  DialogueBlank,
  DialogueQuestion,
  GenLesson,
  LessonExam,
  MatchingPair,
  MatchingQuestion,
  McqQuestion,
  SpeakingQuestion,
  WritingQuestion,
} from "../exam-types";
import { round2, sumMarks } from "../marks";
import { hsk1ExamLessons } from "./generated/hsk1";
import { hsk2ExamLessons } from "./generated/hsk2";
import { hsk3ExamLessons } from "./generated/hsk3";

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

function maskPinyin(linePinyin: string, wordPinyin: string): string {
  const chars: { value: string; index: number }[] = [];
  for (let i = 0; i < linePinyin.length; i += 1) {
    const normalized = linePinyin[i]
      .normalize("NFD")
      .replace(/[\u0300-\u036f]/g, "")
      .toLowerCase();
    for (const value of normalized) {
      if (/[a-z]/.test(value)) chars.push({ value, index: i });
    }
  }

  const letters = chars.map(({ value }) => value).join("");
  const target = wordPinyin
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .toLowerCase()
    .replace(/[^a-z]/g, "");
  if (!target) return "____";

  const start = letters.indexOf(target);
  if (start < 0) return "____";

  const from = chars[start].index;
  const to = chars[start + target.length - 1].index + 1;
  return `${linePinyin.slice(0, from)}____${linePinyin.slice(to)}`;
}

// ── section builders ────────────────────────────────────────────────────

/** Split `total` marks across `count` items. Marks are fractional so the
 *  share is exactly equal and the part always adds back up to `total`
 *  (10 over 5 = 2 each, 10 over 7 = 1.43 each). */
function splitMarks(count: number, total = 10): number[] {
  if (count <= 0) return [];
  const each = total / count;
  return Array.from({ length: count }, () => each);
}

function buildWriting(data: GenLesson, rand: () => number): WritingQuestion[] {
  // Up to 10 words, each carrying an equal share of the part's 10 marks.
  const pool = shuffled(
    data.words.filter((w) => w.h && w.b),
    rand,
  );
  const picked = pool.slice(0, 10);
  const marks = splitMarks(picked.length);
  return picked.map((w, i) => ({
    kind: "writing" as const,
    id: `w${i}`,
    prompt: w.b,
    target: w.h,
    pinyin: w.p,
    marks: marks[i],
  }));
}

function buildMatching(data: GenLesson, rand: () => number): MatchingQuestion[] {
  // 1 question; its pairs split the part's 10 marks evenly.
  const pool = shuffled(
    data.words.filter((w) => w.h && w.b),
    rand,
  );
  const picked = pool.slice(0, 5);
  if (picked.length < 2) return [];

  const allBn = picked.map((w) => w.b);
  const pairMarks = splitMarks(picked.length);
  const pairs: MatchingPair[] = picked.map((w, i) => ({
    hanzi: w.h,
    pinyin: w.p,
    bn: w.b,
    en: w.e,
    marks: pairMarks[i],
  }));

  return [
    {
      kind: "matching",
      id: "m0",
      pairs,
      options: shuffled(allBn, rand),
      marks: sumMarks(pairs),
    },
  ];
}

function buildDialogues(data: GenLesson, rand: () => number): DialogueQuestion[] {
  // Up to 4 questions, one blank each; the blanks split the part's 10 marks.
  const questions: DialogueQuestion[] = [];
  const used = new Set<string>();

  // longest words first so we blank meaningful chunks, not single chars
  const words = [...data.words]
    .filter((w) => w.h.length >= 2)
    .sort((a, b) => b.h.length - a.h.length);

  for (const d of data.dialogues) {
    if (questions.length >= 4) break;

    for (let i = 0; i < d.lines.length; i++) {
      if (questions.length >= 4) break;
      const line = d.lines[i];
      if (line.h.length < 4) continue;

      const word = words.find((w) => line.h.includes(w.h) && !used.has(`${d.title}-${w.h}`));
      if (!word) continue;
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

      used.add(`${d.title}-${word.h}`);

      const blank: DialogueBlank = {
        id: `d${questions.length}b0`,
        lineIndex: i,
        hanzi: line.h.replace(word.h, "＿＿＿"),
        answer: word.h,
        pinyin: maskPinyin(line.p, word.p),
        en: line.e,
        choices: shuffled([word, ...wrong], rand).map((choice) => ({
          hanzi: choice.h,
          pinyin: choice.p,
        })),
        marks: 0, // filled in below, once the part's 10 marks are split
      };

      questions.push({
        kind: "dialogue",
        id: `dq${questions.length}`,
        title: d.title,
        lines: d.lines.map((ln) => ({ s: ln.s, h: ln.h, p: ln.p })),
        blanks: [blank],
        marks: 5,
      });
    }
  }

  // The blanks share the part's 10 marks evenly.
  const blankMarks = splitMarks(questions.length);
  return questions.map((q, i) => ({
    ...q,
    marks: round2(q.blanks.length * blankMarks[i]),
    blanks: q.blanks.map((b) => ({ ...b, marks: blankMarks[i] })),
  }));
}

function buildSpeaking(data: GenLesson, rand: () => number): SpeakingQuestion[] {
  // Practice only - read a line aloud and record it. Worth 0 marks.
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
    marks: 0,
  }));
}

function buildMcq(data: GenLesson, level: number, rand: () => number): McqQuestion[] {
  // One MCQ per unique lesson word: hanzi shown, pick the Bangla meaning.
  // Every word in the lesson is asked and shares the part's 10 marks.
  const words = data.words.filter((w) => w.h && w.b);
  // Bangla distractor pool: same lesson first, then the whole level
  const levelPool = ALL_LESSONS.filter((l) => l.level === level).flatMap(
    (l) => l.words.map((w) => w.b),
  );
  const seenBn = new Set<string>();
  const bnPool = [...new Set([...words.map((w) => w.b), ...levelPool])];

  const marks = splitMarks(words.length);
  return words.map((w, i) => {
    const distractors: string[] = [];
    for (const bn of shuffled(bnPool, rand)) {
      if (bn === w.b || distractors.includes(bn)) continue;
      distractors.push(bn);
      if (distractors.length === 3) break;
    }
    seenBn.add(w.b);
    const choices = shuffled([w.b, ...distractors], rand);
    return {
      kind: "mcq" as const,
      id: `q${i}`,
      hanzi: w.h,
      pinyin: w.p,
      en: w.e,
      bn: w.b,
      choices,
      marks: marks[i],
    };
  });
}

/** Full exam: writing 10 + matching 10 + dialogue 10 + MCQ 10. Speaking is
 *  practice only and carries no marks. */
export function buildLessonExam(level: number, lesson: number): LessonExam | null {
  const data = getExamLesson(level, lesson);
  if (!data) return null;

  const rand = mulberry32(level * 1000 + lesson * 7 + 13);
  const writing = buildWriting(data, rand);
  const matching = buildMatching(data, rand);
  const dialogues = buildDialogues(data, rand);
  const mcq = buildMcq(data, level, rand);
  const speaking = buildSpeaking(data, rand);

  const totalMarks =
    sumMarks(writing) + sumMarks(matching) + sumMarks(dialogues) + sumMarks(mcq);

  return {
    level,
    lesson,
    titleEn: `HSK ${level} · Lesson ${lesson}`,
    titleBn: `এইচএসকে ${level} · লেসন ${lesson}`,
    totalMarks,
    writing,
    matching,
    dialogues,
    mcq,
    speaking,
  };
}
