// src/features/vocabulary/pdf.ts
//
// Where the printed course books live. One PDF per lesson, served as a plain
// static file from /public so it can be read without any auth round-trip.
// Keep the file names in sync with scripts/copy-pdf-worker.mjs and the
// public/assets/documents folder (Lesson1.pdf ... Lesson18.pdf).

const LEVEL_DIR: Record<number, string> = { 1: "hsk1", 2: "hsk2", 3: "hsk3" };

/** The lesson book URL, or null when that level has no book. */
export function lessonPdfUrl(level: number, lesson: number): string | null {
  const dir = LEVEL_DIR[level];
  if (!dir || !Number.isInteger(lesson) || lesson < 1) return null;
  return `/assets/documents/${dir}/Lesson${lesson}.pdf`;
}
