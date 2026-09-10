"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/i18n";
import { CHINESE_WORDS, WORD_LEVELS } from "../data";
import type { ChineseWordEntry } from "../types";

const ROUND_SIZE = 10;
const BEST_KEY = "cw:game-best";
const READ_KEY = "cw:read";

interface GameQuestion {
  type: "hanzi-to-bn" | "bn-to-hanzi";
  prompt: string;
  hint: string;
  options: string[];
  answer: string;
  reveal: string; // extra info shown after answering
}

function shuffle<T>(arr: T[]): T[] {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function sampleDistractors(pool: ChineseWordEntry[], pick: (e: ChineseWordEntry) => string, exclude: string, n: number): string[] {
  const out: string[] = [];
  const seen = new Set([exclude]);
  for (let tries = 0; tries < 200 && out.length < n; tries++) {
    const e = pool[Math.floor(Math.random() * pool.length)];
    const v = pick(e);
    if (!v || seen.has(v)) continue;
    seen.add(v);
    out.push(v);
  }
  return out;
}

function buildQuestions(pool: ChineseWordEntry[], onlyMarked: boolean): GameQuestion[] {
  let source = pool;
  if (onlyMarked) {
    let marked: string[] = [];
    try {
      marked = JSON.parse(localStorage.getItem(READ_KEY) ?? "[]") as string[];
    } catch {
      marked = [];
    }
    const markedSet = new Set(marked);
    const filtered = pool.filter((e) => markedSet.has(e.character));
    if (filtered.length >= 4) source = filtered;
  }

  const picked = shuffle(source).slice(0, Math.min(ROUND_SIZE, source.length));
  return picked.map((entry) => {
    const meaning = entry.meaningBn || entry.meaningEn;
    const toBn = Math.random() < 0.5;
    if (toBn) {
      const distractors = sampleDistractors(source, (e) => e.meaningBn || e.meaningEn, meaning, 3);
      return {
        type: "hanzi-to-bn" as const,
        prompt: entry.character,
        hint: entry.pinyin,
        options: shuffle([meaning, ...distractors]),
        answer: meaning,
        reveal: `${entry.character} (${entry.pinyin}) — ${entry.meaningBn || entry.meaningEn} / ${entry.meaningEn}`,
      };
    }
    const distractors = sampleDistractors(source, (e) => e.character, entry.character, 3);
    return {
      type: "bn-to-hanzi" as const,
      prompt: meaning,
      hint: entry.meaningEn,
      options: shuffle([entry.character, ...distractors]),
      answer: entry.character,
      reveal: `${entry.character} (${entry.pinyin}) — ${entry.meaningBn || entry.meaningEn} / ${entry.meaningEn}`,
    };
  });
}

export default function PracticeGame() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const [phase, setPhase] = useState<"start" | "playing" | "done">("start");
  const [level, setLevel] = useState<number | "All">("All");
  const [onlyMarked, setOnlyMarked] = useState(false);
  const [questions, setQuestions] = useState<GameQuestion[]>([]);
  const [qIndex, setQIndex] = useState(0);
  const [selected, setSelected] = useState<string | null>(null);
  const [score, setScore] = useState(0);
  const [streak, setStreak] = useState(0);
  const [bestStreak, setBestStreak] = useState(0);
  const [best, setBest] = useState(0);
  const [newRecord, setNewRecord] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  useEffect(() => {
    queueMicrotask(() => {
      try {
        setBest(Number(localStorage.getItem(BEST_KEY) ?? "0") || 0);
      } catch {
        /* ignore */
      }
    });
    return () => {
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  const pool = useMemo(
    () => (level === "All" ? CHINESE_WORDS : CHINESE_WORDS.filter((e) => e.hskLevel === level)),
    [level],
  );

  const start = () => {
    const qs = buildQuestions(pool, onlyMarked);
    if (qs.length === 0) return;
    setQuestions(qs);
    setQIndex(0);
    setSelected(null);
    setScore(0);
    setStreak(0);
    setBestStreak(0);
    setNewRecord(false);
    setPhase("playing");
  };

  const current = questions[qIndex];

  const answer = (opt: string) => {
    if (!current || selected !== null) return;
    setSelected(opt);
    const correct = opt === current.answer;
    const nextScore = correct ? score + 1 : score;
    const nextStreak = correct ? streak + 1 : 0;
    setScore(nextScore);
    setStreak(nextStreak);
    setBestStreak((b) => Math.max(b, nextStreak));

    timerRef.current = setTimeout(() => {
      setSelected(null);
      if (qIndex + 1 >= questions.length) {
        try {
          const prevBest = Number(localStorage.getItem(BEST_KEY) ?? "0") || 0;
          if (nextScore > prevBest) {
            localStorage.setItem(BEST_KEY, String(nextScore));
            setBest(nextScore);
            setNewRecord(true);
          } else {
            setBest(prevBest);
          }
        } catch {
          /* ignore */
        }
        setPhase("done");
      } else {
        setQIndex((i) => i + 1);
      }
    }, correct ? 900 : 1600);
  };

  const percent = questions.length > 0 ? Math.round((qIndex / questions.length) * 100) : 0;

  return (
    <div className="max-w-2xl mx-auto">
      {phase === "start" && (
        <div className="bg-card border border-border rounded-3xl p-8 text-center space-y-5 shadow-sm">
          <div className="text-5xl">🎮</div>
          <h2 className="text-2xl font-bold text-text">
            {t("শব্দ অভ্যাস গেম", "Word Practice Game")}
          </h2>
          <p className="text-sm text-muted max-w-md mx-auto">
            {t(
              "হানজি দেখে বাংলা অর্থ বা বাংলা অর্থ দেখে হানজি বাছুন — ১০ প্রশ্নের রাউন্ড, স্ট্রিক বানাও, সেরা স্কোর ভাঙো!",
              "Pick the Bangla meaning for a hanzi — or the hanzi for a meaning. 10 questions a round, build your streak, beat your best!"
            )}
          </p>

          <div className="flex flex-wrap gap-1.5 justify-center">
            {(["All", ...WORD_LEVELS] as const).map((lvl) => (
              <button
                key={String(lvl)}
                onClick={() => setLevel(lvl)}
                className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                  level === lvl
                    ? "bg-secondary text-background font-bold shadow-sm"
                    : "border border-text/15 hover:bg-text/5 text-text/70"
                }`}
              >
                {lvl === "All" ? "All" : `HSK ${lvl}`}
              </button>
            ))}
          </div>

          <label className="flex items-center justify-center gap-2 text-xs text-text/70 cursor-pointer select-none">
            <input
              type="checkbox"
              checked={onlyMarked}
              onChange={(e) => setOnlyMarked(e.target.checked)}
              className="accent-ok w-3.5 h-3.5"
            />
            {t("শুধু মার্ক করা (পড়া) শব্দগুলো দিয়ে খেলুন", "Play with marked (read) words only")}
          </label>

          <div className="text-xs font-mono text-text/60">
            🏆 {t("সেরা স্কোর", "Best score")}: {best}/{ROUND_SIZE}
          </div>

          <button
            type="button"
            onClick={start}
            className="px-8 py-3 rounded-2xl bg-primary text-primary-foreground font-bold shadow hover:opacity-90 transition"
          >
            {t("শুরু করুন ▶", "Start ▶")}
          </button>
        </div>
      )}

      {phase === "playing" && current && (
        <div className="bg-card border border-border rounded-3xl p-6 sm:p-8 space-y-5 shadow-sm">
          {/* HUD */}
          <div className="flex items-center justify-between gap-3 text-xs font-mono">
            <span className="text-text/60">
              {qIndex + 1}/{questions.length}
            </span>
            <span className="text-primary font-bold">
              {t("স্কোর", "Score")}: {score}
            </span>
            <span className={streak >= 2 ? "text-secondary font-bold" : "text-text/50"}>
              🔥 {t("স্ট্রিক", "Streak")}: {streak}
            </span>
          </div>
          <div className="h-2 rounded-full bg-text/10 overflow-hidden">
            <div
              className="h-full bg-primary rounded-full transition-all duration-300"
              style={{ width: `${percent}%` }}
            />
          </div>

          {/* Question */}
          <div className="text-center space-y-2 py-4">
            {current.type === "hanzi-to-bn" ? (
              <>
                <p className="text-xs text-muted">{t("এর বাংলা অর্থ কোনটি?", "What does this mean?")}</p>
                <p className="text-6xl font-chinese font-bold text-text leading-tight">{current.prompt}</p>
                <p className="text-xs font-mono text-secondary">{current.hint}</p>
              </>
            ) : (
              <>
                <p className="text-xs text-muted">{t("কোন হানজি এই অর্থ প্রকাশ করে?", "Which hanzi means this?")}</p>
                <p className="text-3xl font-bold text-text leading-snug">{current.prompt}</p>
                <p className="text-xs text-text/50">{current.hint}</p>
              </>
            )}
          </div>

          {/* Options */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
            {current.options.map((opt) => {
              const isAnswer = opt === current.answer;
              const isPicked = selected === opt;
              const reveal = selected !== null;
              const hanziOpt = current.type === "bn-to-hanzi";

              return (
                <button
                  key={opt}
                  type="button"
                  disabled={reveal}
                  onClick={() => answer(opt)}
                  className={`px-4 py-3 rounded-xl border text-sm transition text-left ${
                    reveal && isAnswer
                      ? "bg-ok text-background border-ok font-bold"
                      : reveal && isPicked
                        ? "bg-danger text-background border-danger"
                        : "bg-background border-border text-text hover:border-primary/60"
                  } ${hanziOpt ? "font-chinese text-xl text-center" : "font-bn"}`}
                >
                  {opt}
                </button>
              );
            })}
          </div>

          {/* Reveal */}
          {selected !== null && (
            <p
              className={`text-center text-xs font-chinese ${
                selected === current.answer ? "text-ok" : "text-danger"
              }`}
            >
              {selected === current.answer
                ? `✓ ${current.reveal}`
                : `✗ ${t("সঠিক উত্তর", "Correct")}: ${current.answer} — ${current.reveal}`}
            </p>
          )}
        </div>
      )}

      {phase === "done" && (
        <div className="bg-card border border-border rounded-3xl p-8 text-center space-y-4 shadow-sm">
          <div className="text-5xl">
            {score === questions.length ? "🏆" : score >= questions.length * 0.6 ? "🎉" : "💪"}
          </div>
          <h2 className="text-2xl font-bold text-text">
            {score}/{questions.length} {t("সঠিক!", "correct!")}
          </h2>
          <p className="text-sm text-muted">
            {score === questions.length
              ? t("নিখুঁত! আপনি মাস্টার!", "Perfect! You're a master!")
              : score >= questions.length * 0.6
                ? t("দারুণ খেলেছেন! আরেকবার চেষ্টা করুন।", "Great game! Try another round.")
                : t("অভ্যাস চালিয়ে যান — আপনি পারবেন!", "Keep practicing — you've got this!")}
          </p>
          <p className="text-xs font-mono text-text/60">
            🔥 {t("সেরা স্ট্রিক", "Best streak")}: {bestStreak} · 🏆 {t("সেরা স্কোর", "Best")}: {best}/{ROUND_SIZE}
          </p>
          {newRecord && (
            <p className="text-secondary font-bold text-sm">🎉 {t("নতুন রেকর্ড!", "New record!")}</p>
          )}
          <div className="flex flex-col sm:flex-row gap-3 justify-center pt-2">
            <button
              type="button"
              onClick={start}
              className="px-6 py-2.5 rounded-2xl bg-primary text-primary-foreground font-bold hover:opacity-90 transition"
            >
              {t("আবার খেলুন 🔄", "Play again 🔄")}
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
