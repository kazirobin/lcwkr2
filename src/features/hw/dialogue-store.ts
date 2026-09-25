import type { HwDialogueLine } from "./data/hsk1/lesson1-dialogue";

/**
 * Admin-editable dialogue scripts, stored per lesson on this device
 * (localStorage) so they work fully offline.
 *
 * Key: `hw:dialogue:{level}-{lesson}` → raw script text, one turn per
 * line, each line starting with "：" (fullwidth colon), e.g.:
 *
 *   ：同学们好！
 *   ：老师好！
 *
 * Speakers auto-alternate A / B (A = left bubble). Blank lines are
 * skipped. Admin-entered lines carry hanzi only (no pinyin/meanings) —
 * playback still works because TTS reads hanzi directly.
 */

const keyFor = (level: number, lesson: number) => `hw:dialogue:${level}-${lesson}`;

/** Parse raw admin script text into playable lines (A/B alternating). */
export function parseDialogueScript(raw: string): HwDialogueLine[] {
  const lines: HwDialogueLine[] = [];
  let flip = false; // false → A, true → B
  for (const rawLine of raw.split("\n")) {
    const hanzi = rawLine
      .replace(/^[\s　：:]+/, "")
      .replace(/[\s　]+$/, "");
    if (!hanzi) continue;
    lines.push({ speaker: flip ? "B" : "A", hanzi, pinyin: "", en: "", bn: "" });
    flip = !flip;
  }
  return lines;
}

/** Built-in fallback serialised back to editable script text. */
export function stringifyDialogue(lines: HwDialogueLine[]): string {
  return lines.map((l) => `：${l.hanzi}`).join("\n");
}

/** Raw admin script for a lesson, or null when never saved. */
export function loadRawDialogue(level: number, lesson: number): string | null {
  try {
    if (typeof window === "undefined") return null;
    return window.localStorage.getItem(keyFor(level, lesson));
  } catch {
    return null;
  }
}

/** Parsed admin lines for a lesson (null = use built-in data). */
export function loadCustomDialogue(level: number, lesson: number): HwDialogueLine[] | null {
  const raw = loadRawDialogue(level, lesson);
  if (!raw || !raw.trim()) return null;
  const lines = parseDialogueScript(raw);
  return lines.length > 0 ? lines : null;
}

export function saveCustomDialogue(level: number, lesson: number, raw: string): void {
  try {
    window.localStorage.setItem(keyFor(level, lesson), raw);
  } catch {
    /* storage full — ignore */
  }
}

export function clearCustomDialogue(level: number, lesson: number): void {
  try {
    window.localStorage.removeItem(keyFor(level, lesson));
  } catch {
    /* ignore */
  }
}

/** Display-only mask: 01744156928 → 017••••928 (full value stays internal). */
export function maskPhone(phone: string): string {
  const d = phone.replace(/\D/g, "");
  if (d.length < 7) return "•••";
  return `${d.slice(0, 3)}••••${d.slice(-3)}`;
}

export interface MarkRecord {
  mark: number;
  level: number;
  lesson: number;
  createdAt: string;
}

/** Latest mark per lesson + their sum (for profile/account totals). */
export function summarizeDialogueMarks(history: MarkRecord[]): {
  perLesson: { level: number; lesson: number; mark: number }[];
  total: number;
} {
  const latest = new Map<string, { level: number; lesson: number; mark: number; at: string }>();
  for (const h of history) {
    const key = `${h.level}-${h.lesson}`;
    const prev = latest.get(key);
    if (!prev || h.createdAt >= prev.at) {
      latest.set(key, { level: h.level, lesson: h.lesson, mark: h.mark, at: h.createdAt });
    }
  }
  const perLesson = [...latest.values()].sort((a, b) => a.level - b.level || a.lesson - b.lesson);
  return { perLesson, total: perLesson.reduce((n, p) => n + p.mark, 0) };
}

/** "level-lesson" keys (e.g. "1-1") that have an admin script saved. */
export function listCustomDialogues(): string[] {
  try {
    if (typeof window === "undefined") return [];
    const out: string[] = [];
    for (let i = 0; i < window.localStorage.length; i += 1) {
      const k = window.localStorage.key(i);
      if (k?.startsWith("hw:dialogue:")) out.push(k.replace("hw:dialogue:", ""));
    }
    return out.sort();
  } catch {
    return [];
  }
}
