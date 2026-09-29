// How much a student has done, and how much space their uploads take.
//
// The exam marks already exist per (phone, level, lesson) in HwExamResult, and
// the dialogue/handwriting marks in DialogueSubmission. The totals people
// actually want to see — "how many marks does this HSK have, how many did I
// get, how many exams are left" — were never assembled anywhere, so every page
// recomputed a different approximation. This is the one place that answers it.
import { connectDB } from "@/lib/db";
import {
  DialogueSubmission,
  HandwritingSubmission,
  HwExamResult,
  Student,
} from "@/features/academy/models";
import { normalizePhone } from "./dialogues";
import { getExamLessonNumbers, buildLessonExam } from "@/features/hw/data/exam";

export type LevelProgress = {
  level: number;
  /** Marks the whole level is worth, summed over every exam lesson in it. */
  totalMarks: number;
  /** Best score the student has earned across this level. */
  obtained: number;
  percent: number | null;
  /** How many of the level's exams they have taken at least once. */
  examsGiven: number;
  /** How many exams exist in the level. */
  examsTotal: number;
  examsLeft: number;
  /** Best score per lesson, so a profile can show where the marks came from. */
  perLesson: Array<{ lesson: number; best: number; attempts: number; outOf: number }>;
};

export type StorageTotals = {
  imageCount: number;
  imageBytes: number;
  audioCount: number;
  audioBytes: number;
  audioSeconds: number;
  totalBytes: number;
  /** How many rows predate the byte counters, so the number can be honest. */
  unsizedCount: number;
};

export type StudentProgress = {
  levels: LevelProgress[];
  storage: StorageTotals;
  dialogue: { count: number; marked: number; average: number | null; best: number | null };
  handwriting: { count: number; photos: number; marked: number; average: number | null };
};

/** Marks available in one level. Pure data, so it is computed once per level. */
const marksMemo = new Map<number, Map<number, number>>();

function totalMarksByLesson(level: number): Map<number, number> {
  const cached = marksMemo.get(level);
  if (cached) return cached;
  const map = new Map<number, number>();
  for (const lesson of getExamLessonNumbers(level)) {
    try {
      map.set(lesson, buildLessonExam(level, lesson)?.totalMarks ?? 0);
    } catch {
      map.set(lesson, 0);
    }
  }
  marksMemo.set(level, map);
  return map;
}

/** Every level the site has exam lessons for, in order. */
const LEVELS = [1, 2, 3] as const;

/** Marks a student is on the hook for, and what they have collected. */
export async function levelProgressFor(phone: string): Promise<LevelProgress[]> {
  const norm = normalizePhone(phone);
  if (!norm) return [];
  await connectDB();
  const rows = await HwExamResult.find({ whatsapp: norm }).lean();
  const best = new Map<string, { best: number; attempts: number }>();
  for (const row of rows) {
    const key = `${row.level}-${row.lesson}`;
    const prior = best.get(key);
    best.set(key, {
      best: Math.max(Number(row.best ?? 0), prior?.best ?? 0),
      attempts: (prior?.attempts ?? 0) + Number(row.attempts ?? 0),
    });
  }

  return LEVELS.map((level) => {
    const byLesson = totalMarksByLesson(level);
    const perLesson = [...byLesson.entries()]
      .map(([lesson, outOf]) => {
        const hit = best.get(`${level}-${lesson}`);
        return {
          lesson,
          outOf,
          best: hit?.best ?? 0,
          attempts: hit?.attempts ?? 0,
        };
      })
      .sort((a, b) => a.lesson - b.lesson);

    const totalMarks = perLesson.reduce((sum, l) => sum + l.outOf, 0);
    const obtained = perLesson.reduce((sum, l) => sum + Math.min(l.best, l.outOf), 0);
    const examsGiven = perLesson.filter((l) => l.attempts > 0).length;

    return {
      level,
      totalMarks: Math.round(totalMarks * 100) / 100,
      obtained: Math.round(obtained * 100) / 100,
      percent: totalMarks ? Math.round((obtained / totalMarks) * 100) : null,
      examsGiven,
      examsTotal: perLesson.length,
      examsLeft: Math.max(0, perLesson.length - examsGiven),
      perLesson,
    };
  });
}

/** Photos and recordings a student has uploaded, counted and measured. */
export async function storageFor(phone: string): Promise<StorageTotals> {
  const norm = normalizePhone(phone);
  const empty: StorageTotals = {
    imageCount: 0,
    imageBytes: 0,
    audioCount: 0,
    audioBytes: 0,
    audioSeconds: 0,
    totalBytes: 0,
    unsizedCount: 0,
  };
  if (!norm) return empty;
  await connectDB();

  const [writing, audio] = await Promise.all([
    HandwritingSubmission.find({ whatsapp: norm }).select("images").lean(),
    DialogueSubmission.find({ whatsapp: norm }).select("audioUrl bytes durationSec").lean(),
  ]);

  let imageCount = 0;
  let imageBytes = 0;
  let unsizedCount = 0;
  for (const doc of writing) {
    for (const img of doc.images ?? []) {
      imageCount += 1;
      const bytes = Number((img as { bytes?: number }).bytes ?? 0);
      if (bytes > 0) imageBytes += bytes;
      else unsizedCount += 1;
    }
  }

  let audioCount = 0;
  let audioBytes = 0;
  let audioSeconds = 0;
  for (const doc of audio) {
    audioCount += 1;
    const bytes = Number(doc.bytes ?? 0);
    if (bytes > 0) audioBytes += bytes;
    else unsizedCount += 1;
    audioSeconds += Number(doc.durationSec ?? 0);
  }

  return {
    imageCount,
    imageBytes,
    audioCount,
    audioBytes,
    audioSeconds,
    totalBytes: imageBytes + audioBytes,
    unsizedCount,
  };
}

export async function progressFor(phone: string): Promise<StudentProgress> {
  const norm = normalizePhone(phone);
  const levels = await levelProgressFor(norm);
  const storage = await storageFor(norm);
  if (!norm) {
    return {
      levels,
      storage,
      dialogue: { count: 0, marked: 0, average: null, best: null },
      handwriting: { count: 0, photos: 0, marked: 0, average: null },
    };
  }

  await connectDB();
  const [dialogueRows, writingRows] = await Promise.all([
    DialogueSubmission.find({ whatsapp: norm }).select("mark").lean(),
    HandwritingSubmission.find({ whatsapp: norm }).select("mark images").lean(),
  ]);

  const dialogueMarks = dialogueRows
    .map((d) => Number(d.mark))
    .filter((m) => Number.isFinite(m));
  const writingMarks = writingRows
    .map((d) => Number(d.mark))
    .filter((m) => Number.isFinite(m));
  const avg = (list: number[]) =>
    list.length ? Math.round((list.reduce((a, b) => a + b, 0) / list.length) * 10) / 10 : null;

  return {
    levels,
    storage,
    dialogue: {
      count: dialogueRows.length,
      marked: dialogueMarks.length,
      average: avg(dialogueMarks),
      best: dialogueMarks.length ? Math.max(...dialogueMarks) : null,
    },
    handwriting: {
      count: writingRows.length,
      photos: writingRows.reduce((n, d) => n + (d.images?.length ?? 0), 0),
      marked: writingMarks.length,
      average: avg(writingMarks),
    },
  };
}

/** Marks and exam counts for every approved student, for the directory. */
export async function progressForRolls(
  rolls: number[],
): Promise<
  Map<number, { totalMarks: number; obtained: number; percent: number | null; examsGiven: number; examsTotal: number }>
> {
  const out = new Map<
    number,
    { totalMarks: number; obtained: number; percent: number | null; examsGiven: number; examsTotal: number }
  >();
  if (!rolls.length) return out;
  await connectDB();

  const [students, results] = await Promise.all([
    Student.find({ rollNumber: { $in: rolls } }).select("rollNumber whatsapp").lean(),
    HwExamResult.find({}).select("whatsapp level lesson best").lean(),
  ]);
  const phoneByRoll = new Map(students.map((s) => [s.rollNumber, normalizePhone(s.whatsapp)]));

  // One pass over every exam result, bucketed by phone — the directory shows
  // every student at once, so a per-student query here would be 20+ round trips.
  const perPhone = new Map<string, { total: number; given: number }>();
  for (const row of results) {
    const norm = normalizePhone(row.whatsapp);
    if (!norm) continue;
    const lessonTotal = totalMarksByLesson(row.level).get(row.lesson) ?? 0;
    const entry = perPhone.get(norm) ?? { total: 0, given: 0 };
    entry.total += Math.min(Number(row.best ?? 0), lessonTotal);
    entry.given += 1;
    perPhone.set(norm, entry);
  }

  for (const [roll, phone] of phoneByRoll) {
    const totalMarks = LEVELS.reduce(
      (sum, level) => sum + [...totalMarksByLesson(level).values()].reduce((a, b) => a + b, 0),
      0,
    );
    const entry = perPhone.get(phone);
    const obtained = entry?.total ?? 0;
    out.set(roll, {
      totalMarks: Math.round(totalMarks * 100) / 100,
      obtained: Math.round(obtained * 100) / 100,
      percent: totalMarks ? Math.round((obtained / totalMarks) * 100) : null,
      examsGiven: entry?.given ?? 0,
      examsTotal: LEVELS.reduce((sum, level) => sum + totalMarksByLesson(level).size, 0),
    });
  }

  return out;
}
