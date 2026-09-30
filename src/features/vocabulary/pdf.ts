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

/**
 * How many lessons each level has. This is what decides whether a workbook is
 * offered at all: the files are named by lesson number, so a lesson past the end
 * of the book would open a reader on a 404 instead of a workbook.
 *
 * 15 / 15 / 18, matching the hsk1workbook, hsk2workbook and hsk3workbook
 * folders. `npm run check:workbooks` fails if a file goes missing or is added.
 */
export const WORKBOOK_LESSONS: Record<number, number> = { 1: 15, 2: 15, 3: 18 };

/**
 * The workbook URL for a lesson, or null when that level has no workbook or the
 * lesson is past its last page.
 *
 * The workbooks live beside the lesson books in
 * public/assets/documents/hsk<level>workbook/, one file per lesson, named
 * hsk-course-<level>-workbook-lesson-<lesson>.pdf. The homework page links these
 * so a student sitting the exam can turn to the same lesson's exercises rather
 * than hunting for the file.
 */
export function workbookPdfUrl(level: number, lesson: number): string | null {
  const last = WORKBOOK_LESSONS[level];
  if (!last || !Number.isInteger(lesson) || lesson < 1 || lesson > last) return null;
  return `/assets/documents/hsk${level}workbook/hsk-course-${level}-workbook-lesson-${lesson}.pdf`;
}
