// Checks that every workbook the app can link to actually exists on disk.
//
// src/features/vocabulary/pdf.ts offers a workbook for a lesson whenever the
// lesson number falls inside WORKBOOK_LESSONS (15 / 15 / 18). That is a hardcoded
// count, so it can drift from the folders: a file renamed or deleted would leave
// the homework page opening a reader on a 404, and a file added would not be
// reachable at all. This script fails if either happens.
//
// Run with: npm run check:workbooks
import { closeSync, existsSync, openSync, readFileSync, readSync, readdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const docs = join(root, "public", "assets", "documents");

// Kept in step with WORKBOOK_LESSONS in src/features/vocabulary/pdf.ts.
const LEVELS = { 1: 15, 2: 15, 3: 18 };

let problems = 0;
let checked = 0;

/**
 * Cheap sanity check on a PDF: the header has to say it is a PDF, and the last
 * chunk has to hold the end-of-file marker.
 *
 * The workbooks are 424 MB of scanned pages that used to live only on this
 * machine, so this is the one thing standing between a copy that got truncated
 * in transit and a student's reader hanging on a file that cannot open. A real
 * parse is the only sure test, but reading 424 MB on every check is not worth
 * it; `npm run check:pdf-upright` does that properly for the lesson books.
 */
function looksLikePdf(file) {
  const head = readFileSync(file, { length: 5 });
  if (head.subarray(0, 5).toString("latin1") !== "%PDF-") return "no %PDF- header";

  // The trailer can sit a little way back from the end, so read the tail.
  const fd = openSync(file, "r");
  try {
    const size = statSync(file).size;
    const tail = Buffer.alloc(Math.min(2048, size));
    const at = Math.max(0, size - tail.length);
    const read = readSync(fd, tail, 0, tail.length, at);
    if (!tail.subarray(0, read).toString("latin1").includes("%%EOF")) return "no %%EOF at the end";
  } finally {
    closeSync(fd);
  }
  return null;
}

for (const [level, last] of Object.entries(LEVELS)) {
  const dir = join(docs, `hsk${level}workbook`);
  if (!existsSync(dir)) {
    console.error(`missing folder: public/assets/documents/hsk${level}workbook`);
    problems += 1;
    continue;
  }

  for (let lesson = 1; lesson <= last; lesson += 1) {
    const file = join(dir, `hsk-course-${level}-workbook-lesson-${lesson}.pdf`);
    checked += 1;
    if (!existsSync(file)) {
      console.error(`missing: hsk${level}workbook/hsk-course-${level}-workbook-lesson-${lesson}.pdf`);
      problems += 1;
      continue;
    }
    const bad = looksLikePdf(file);
    if (bad) {
      console.error(`unreadable: hsk${level}workbook/...lesson-${lesson}.pdf — ${bad}`);
      problems += 1;
    }
  }

  // A lesson past `last` would be a dead link, so any extra file has to be
  // counted in WORKBOOK_LESSONS before the homework page will offer it.
  const onDisk = readdirSync(dir).filter((f) => f.toLowerCase().endsWith(".pdf"));
  if (onDisk.length > last) {
    console.error(
      `hsk${level}workbook holds ${onDisk.length} PDFs but WORKBOOK_LESSONS says ${last} — raise the count in src/features/vocabulary/pdf.ts`,
    );
    problems += 1;
  }
}

if (problems > 0) {
  console.error(`\n${problems} workbook problem(s) found.`);
  process.exit(1);
}

console.log(`workbooks checked: ${checked}`);
console.log("Every lesson the homework page can offer has its workbook on disk.");
