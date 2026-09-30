// The homework page links a workbook per lesson. The button is only correct if
// the URL it builds points at a file that is really there — a wrong name gives
// the student a reader showing a 404, which reads as a broken site.
//
// This checks the helper against the filesystem for every level and lesson,
// and the boundaries that decide whether the button shows at all.
import { existsSync } from "node:fs";
import { join } from "node:path";
import { workbookPdfUrl, WORKBOOK_LESSONS } from "@/features/vocabulary/pdf";
import { EXAM_LEVELS, getExamLessonNumbers } from "@/features/hw/data/exam";

let failed = 0;
const check = (ok: boolean, label: string, detail = "") => {
  if (!ok) failed += 1;
  console.log(`  ${ok ? "ok  " : "FAIL"}  ${label}${detail ? `  ${detail}` : ""}`);
};

// 1. Every lesson the app will offer has a workbook on disk. The helper returns
//    a site-absolute path, so `/assets/...` resolves under public/.
const onDisk = join(process.cwd(), "public");
let offered = 0;
let missingFiles = 0;
for (const [levelText, last] of Object.entries(WORKBOOK_LESSONS)) {
  const level = Number(levelText);
  for (let lesson = 1; lesson <= last; lesson += 1) {
    const url = workbookPdfUrl(level, lesson);
    offered += 1;
    if (!url) {
      check(false, `hsk${level} lesson ${lesson} has a URL`);
      continue;
    }
    if (!existsSync(join(onDisk, url))) {
      check(false, `hsk${level} lesson ${lesson} file exists`, url);
      missingFiles += 1;
    }
  }
}
check(
  missingFiles === 0,
  `every offered lesson resolves to a real file`,
  `n=${offered}`,
);

// 2. The URL is the one the file is actually named.
check(
  workbookPdfUrl(1, 1) === "/assets/documents/hsk1workbook/hsk-course-1-workbook-lesson-1.pdf",
  "hsk1 lesson 1 builds the right path",
  workbookPdfUrl(1, 1) ?? "null",
);
check(
  workbookPdfUrl(3, 18) === "/assets/documents/hsk3workbook/hsk-course-3-workbook-lesson-18.pdf",
  "hsk3 lesson 18 builds the right path",
  workbookPdfUrl(3, 18) ?? "null",
);

// 3. Past the last lesson, and for a level with no workbook, the button hides
//    itself rather than opening a reader on a missing file.
check(workbookPdfUrl(1, 16) === null, "hsk1 lesson 16 has no workbook", "hidden");
check(workbookPdfUrl(2, 16) === null, "hsk2 lesson 16 has no workbook", "hidden");
check(workbookPdfUrl(3, 19) === null, "hsk3 lesson 19 has no workbook", "hidden");
check(workbookPdfUrl(4, 1) === null, "hsk4 has no workbook", "hidden");
check(workbookPdfUrl(0, 1) === null, "level 0 has no workbook", "hidden");
check(workbookPdfUrl(1, 0) === null, "lesson 0 has no workbook", "hidden");
check(workbookPdfUrl(1, -1) === null, "negative lesson has no workbook", "hidden");
check(workbookPdfUrl(1, 1.5) === null, "fractional lesson has no workbook", "hidden");

// 4. The counts agree with the exam lessons, so no lesson is silently without a
//    workbook because the exam knows a lesson the books do not.
for (const level of EXAM_LEVELS) {
  const lessons = getExamLessonNumbers(level);
  const missing = lessons.filter((n) => !workbookPdfUrl(level, n));
  check(
    missing.length === 0,
    `hsk${level}: all ${lessons.length} exam lessons have a workbook`,
    missing.length ? `missing ${missing.join(",")}` : "",
  );
}

console.log(failed === 0 ? "\nall workbook checks passed" : `\n${failed} check(s) failed`);
process.exit(failed === 0 ? 0 : 1);
