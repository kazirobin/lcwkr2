import { NextResponse } from "next/server";
import { getLevelParams, getLessonParams, getTextParams } from "@/features/vocabulary/data";
import { lessonPdfUrl } from "@/features/vocabulary/pdf";
import { EXAM_LEVELS, getExamLessonNumbers } from "@/features/hw/data/exam";

/** All public pages + read-only API endpoints the PWA preloads for offline use. */
const PAGES = [
  "/",
  "/intro",
  "/academy",
  "/academy/courses",
  "/academy/students",
  "/academy/groups",
  "/academy/admission",
  "/community",
  "/hsk",
  "/hanzi-pro",
  "/chinese-words",
  "/todos",
  "/msg",
  "/donate",
  "/pdf",
  "/apps",
];

const API_ENDPOINTS = [
  "/api/academy/courses",
  "/api/academy/students?status=Approved",
  "/api/academy/groups",
  "/api/academy/reviews",
  "/api/academy/live",
  "/api/academy/live/links",
  "/api/hanzi-pro",
  "/api/donations/target",
  "/api/donations",
  "/api/chinese-words",
  "/api/todos",
];

function hskRoutes(): string[] {
  const levels = getLevelParams().map(({ level }) => `/hsk/${level}`);
  const lessons = getLessonParams().map(
    ({ level, lessonNumber }) => `/hsk/${level}/lesson/${lessonNumber}`,
  );
  const texts = getTextParams().map(
    ({ level, lessonNumber, textNumber }) =>
      `/hsk/${level}/lesson/${lessonNumber}/text/${textNumber}`,
  );
  return [...levels, ...lessons, ...texts];
}

function hwRoutes(): string[] {
  return EXAM_LEVELS.flatMap((level) =>
    getExamLessonNumbers(level).map((lesson) => `/hw/hsk${level}/${lesson}`),
  );
}

/**
 * The printed lesson books — 105 MB of PDFs.
 *
 * They have to be listed explicitly. The download scraper can only find files
 * whose URLs appear in a page's HTML, and the reader only mounts its download
 * link once a book has actually been opened, so without this list a Pro user
 * downloads the whole site and still has no books to read on the plane.
 * Built from the lesson data rather than typed out, so a new lesson brings its
 * book along by itself.
 */
function documents(): string[] {
  const books = getLessonParams()
    .map(({ level, lessonNumber }) => lessonPdfUrl(Number(level), Number(lessonNumber)))
    .filter((url): url is string => Boolean(url));
  return [...books, "/assets/documents/hsk1-starter-guide.pdf"];
}

export async function GET() {
  return NextResponse.json({
    success: true,
    pages: [...PAGES, ...hskRoutes(), ...hwRoutes()],
    api: API_ENDPOINTS,
    documents: documents(),
  });
}