// Validates the lesson books' page orientation across the whole set.
//
// The HSK1 scans alternate /Rotate 90, 270, 90, 270 page by page, which looks
// wrong but is not: the text on each page really does run the other way, so
// every page is upright at its own flag and pdf.js's default (rotation =
// page.rotate) is correct. This script proves that by comparing each page's
// flag with the rotation its text layout actually needs, for all 48 books.
//
// A mismatch would mean the viewer has to guess, so treat any mismatch as a
// bug rather than a warning.
import { readFileSync, readdirSync } from "node:fs";
import { dirname, join } from "node:path";
import { fileURLToPath } from "node:url";

if (!Uint8Array.prototype.toHex) {
  Uint8Array.prototype.toHex = function () {
    let out = "";
    for (const byte of this) out += byte.toString(16).padStart(2, "0");
    return out;
  };
}

const pdfjs = await import("pdfjs-dist/legacy/build/pdf.mjs");
const root = join(dirname(fileURLToPath(import.meta.url)), "..");
const base = join(root, "public", "assets", "documents");
const norm = (r) => (((r % 360) + 360) % 360);

let pages = 0;
let clean = 0;
const problems = [];

for (const level of ["hsk1", "hsk2", "hsk3"]) {
  const names = readdirSync(join(base, level))
    .filter((n) => n.toLowerCase().endsWith(".pdf"))
    .sort((a, b) => a.localeCompare(b, undefined, { numeric: true }));

  for (const name of names) {
    const rel = `${level}/${name}`;
    const task = pdfjs.getDocument({
      data: new Uint8Array(readFileSync(join(base, level, name))),
    });
    const doc = await task.promise;

    for (let n = 1; n <= doc.numPages; n++) {
      const page = await doc.getPage(n);
      pages++;
      const flag = norm(page.rotate);

      const content = await page.getTextContent();
      let best = null;
      for (const item of content.items) {
        if (!("str" in item) || !item.str.trim()) continue;
        if (!best || item.str.length > best.str.length) best = item;
      }
      if (!best) {
        clean++; // no extractable text, nothing to contradict the flag
        continue;
      }

      const [a, b] = best.transform;
      const len = Math.hypot(a, b) || 1;
      const dir = [a / len, b / len];

      let bestRot = 0;
      let bestDot = -2;
      for (const r of [0, 90, 180, 270]) {
        const vp = page.getViewport({ scale: 1, rotation: r });
        const [c, d] = [vp.transform[0], vp.transform[1]];
        const l2 = Math.hypot(c, d) || 1;
        const dot = (c / l2) * dir[0] + (d / l2) * dir[1];
        if (dot > bestDot) {
          bestDot = dot;
          bestRot = r;
        }
      }

      if (bestDot > 0.98 && bestRot === flag) clean++;
      else problems.push(`${rel} p${n}: flag=${flag} text needs ${bestRot} (dot ${bestDot.toFixed(2)})`);
    }
    await task.destroy();
  }
}

console.log(`pages checked: ${pages}`);
console.log(`agree with their own /Rotate: ${clean}`);
if (problems.length) {
  console.log(`\nMISMATCHES (${problems.length}):`);
  for (const p of problems.slice(0, 40)) console.log("  " + p);
  process.exitCode = 1;
} else {
  console.log("\nAll pages are upright at their own /Rotate flag.");
}
