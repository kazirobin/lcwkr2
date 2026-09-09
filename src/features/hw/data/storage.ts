// localStorage persistence for the /hw exam feature. Everything stays on
// the user's device — no server, no database.

import type { ExamAnswers, ExamResult } from "../exam-types";

const ANSWERS_KEY = (level: number, lesson: number) => `hw:answers:${level}-${lesson}`;
const RESULTS_KEY = "hw:results";

export function loadAnswers(level: number, lesson: number): ExamAnswers {
  if (typeof window === "undefined") return {};
  try {
    return JSON.parse(localStorage.getItem(ANSWERS_KEY(level, lesson)) ?? "{}") as ExamAnswers;
  } catch {
    return {};
  }
}

export function saveAnswers(level: number, lesson: number, answers: ExamAnswers) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(ANSWERS_KEY(level, lesson), JSON.stringify(answers));
  } catch {
    // storage full (e.g. big audio blobs) — drop audio blobs and retry
    try {
      const slim: ExamAnswers = {};
      for (const [k, v] of Object.entries(answers)) {
        if (!v.startsWith("data:")) slim[k] = v;
      }
      localStorage.setItem(ANSWERS_KEY(level, lesson), JSON.stringify(slim));
    } catch {
      /* give up silently */
    }
  }
}

export function clearAnswers(level: number, lesson: number) {
  if (typeof window === "undefined") return;
  try {
    localStorage.removeItem(ANSWERS_KEY(level, lesson));
  } catch {
    /* ignore */
  }
}

export function loadResults(): ExamResult[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RESULTS_KEY) ?? "[]") as ExamResult[];
  } catch {
    return [];
  }
}

export function saveResult(result: ExamResult) {
  if (typeof window === "undefined") return;
  try {
    const all = loadResults().filter((r) => r.key !== result.key);
    all.push(result);
    all.sort((a, b) => (a.submittedAt < b.submittedAt ? 1 : -1));
    // keep the latest 100 results
    localStorage.setItem(RESULTS_KEY, JSON.stringify(all.slice(0, 100)));
  } catch {
    /* ignore */
  }
}

/** Best + latest score per lesson key, for the history panel. */
export function summarizeResults(): Record<string, { best: number; latest: number; totalMarks: number; at: string; attempts: number }> {
  const all = loadResults();
  const map: Record<string, { best: number; latest: number; totalMarks: number; at: string; attempts: number }> = {};
  for (const r of all) {
    const cur = map[r.key];
    if (!cur) {
      map[r.key] = {
        best: r.totalScore,
        latest: r.totalScore,
        totalMarks: r.totalMarks,
        at: r.submittedAt,
        attempts: 1,
      };
    } else {
      cur.best = Math.max(cur.best, r.totalScore);
      cur.latest = r.totalScore;
      cur.attempts += 1;
    }
  }
  return map;
}
