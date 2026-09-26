// Copies the pdf.js worker out of node_modules into public/ so the browser can
// fetch it as a plain static file. Run `npm run sync:pdf-worker` after bumping
// pdfjs-dist, otherwise the lesson PDF viewer fails to start.
import { copyFileSync, mkdirSync, statSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const from = join(root, "node_modules", "pdfjs-dist", "build", "pdf.worker.min.mjs");
const to = join(root, "public", "pdfjs", "pdf.worker.min.mjs");

try {
  mkdirSync(dirname(to), { recursive: true });
  copyFileSync(from, to);
  console.log(`pdf worker copied (${Math.round(statSync(to).size / 1024)} KB) -> public/pdfjs/`);
} catch (error) {
  console.warn(`pdf worker copy skipped: ${error.message}`);
}
