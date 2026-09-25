"use client";

import React, { useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/i18n";
import type { MatchingQuestion } from "../exam-types";
import SectionShell from "./SectionShell";

interface Props {
  questions: MatchingQuestion[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled?: boolean;
  results?: Record<string, { earned: number; marks: number }>;
  collapsible?: boolean;
  twoSided?: boolean;
}

/** Deterministic shuffle (stable across renders for the same question). */
function shuffled<T>(arr: T[], seed: string): T[] {
  const a = [...arr];
  let h = 0;
  for (const c of seed) h = (Math.imul(h, 31) + c.charCodeAt(0)) | 0;
  for (let i = a.length - 1; i > 0; i--) {
    h = (Math.imul(h, 1103515245) + 12345) | 0;
    const j = Math.abs(h) % (i + 1);
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function MatchingSection({ questions, answers, onChange, disabled, results, collapsible, twoSided = false }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const totalMarks = questions.reduce((n, q) => n + q.marks, 0);

  interface Line {
    key: string;
    x1: number;
    y1: number;
    x2: number;
    y2: number;
    dashed?: boolean;
  }

  // Right-column order per question (shuffled once, stable).
  const rightOrder = useMemo(() => {
    const map: Record<string, string[]> = {};
    for (const q of questions) {
      map[q.id] = shuffled(
        q.pairs.map((p) => p.bn),
        q.id,
      );
    }
    return map;
  }, [questions]);

  // `${q.id}:${hanzi}` of the currently picked left card, else null.
  const [picked, setPicked] = useState<string | null>(null);
  const wrapRefs = useRef<Record<string, HTMLDivElement | null>>({});
  const leftEls = useRef<Record<string, HTMLButtonElement | null>>({});
  const rightEls = useRef<Record<string, HTMLButtonElement | null>>({});
  const [lines, setLines] = useState<Record<string, Line[]>>({});
  const [geom, setGeom] = useState(0);
  const showReview = Boolean(results);

  useEffect(() => {
    queueMicrotask(() => setGeom((v) => v + 1));
    const bump = () => setGeom((v) => v + 1);
    window.addEventListener("resize", bump);
    window.addEventListener("orientationchange", bump);
    return () => {
      window.removeEventListener("resize", bump);
      window.removeEventListener("orientationchange", bump);
    };
  }, []);

  const keyOf = (qid: string, hanzi: string) => `${qid}:${hanzi}`;
  const savedOf = (qid: string, hanzi: string) => answers[keyOf(qid, hanzi)] ?? "";

  const pickLeft = (q: MatchingQuestion, hanzi: string) => {
    if (disabled) return;
    const pair = q.pairs.find((p) => p.hanzi === hanzi);
    if (!pair) return;
    const key = keyOf(q.id, hanzi);
    setPicked((prev) => (prev === key ? null : key));
  };

  const pickRight = (q: MatchingQuestion, choice: string) => {
    if (disabled || !picked) return;
    const [qid, ...hanziParts] = picked.split(":");
    if (qid !== q.id) return;
    const hanzi = hanziParts.join(":");
    const pair = q.pairs.find((p) => p.hanzi === hanzi);
    if (!pair) {
      setPicked(null);
      return;
    }
    for (const other of q.pairs) {
      if (other.hanzi !== hanzi && savedOf(q.id, other.hanzi) === choice) {
        onChange(keyOf(q.id, other.hanzi), "");
      }
    }
    onChange(keyOf(q.id, hanzi), choice);
    setPicked(null);
  };

  useEffect(() => {
    if (!twoSided || !showReview) {
      queueMicrotask(() => setLines({}));
      return;
    }

    let cancelled = false;
    const update = () => {
      if (cancelled) return;
      const next: Record<string, Line[]> = {};

      for (const q of questions) {
        const wrap = wrapRefs.current[q.id];
        if (!wrap) continue;
        const container = wrap.getBoundingClientRect();
        if (container.width === 0) continue;

        const point = (element: HTMLElement | null, side: "r" | "l") => {
          if (!element) return null;
          const rect = element.getBoundingClientRect();
          if (rect.width === 0 && rect.height === 0) return null;
          return {
            x: side === "r" ? rect.left - container.left + rect.width : rect.left - container.left,
            y: rect.top - container.top + rect.height / 2,
          };
        };

        const questionLines: Line[] = [];
        for (const pair of q.pairs) {
          if (answers[keyOf(q.id, pair.hanzi)] !== pair.bn) continue;
          const start = point(leftEls.current[keyOf(q.id, pair.hanzi)], "r");
          const end = point(rightEls.current[`${q.id}::${pair.bn}`], "l");
          if (start && end) {
            questionLines.push({
              key: keyOf(q.id, pair.hanzi),
              x1: start.x,
              y1: start.y,
              x2: end.x,
              y2: end.y,
            });
          }
        }

        if (picked && picked.startsWith(`${q.id}:`)) {
          const start = point(leftEls.current[picked], "r");
          if (start) {
            questionLines.push({
              key: `pending:${picked}`,
              x1: start.x,
              y1: start.y,
              x2: container.width - 6,
              y2: start.y,
              dashed: true,
            });
          }
        }
        next[q.id] = questionLines;
      }

      queueMicrotask(() => {
        if (!cancelled) setLines(next);
      });
    };

    const frame = window.requestAnimationFrame(update);
    const observer =
      typeof ResizeObserver !== "undefined"
        ? new ResizeObserver(() => queueMicrotask(update))
        : null;
    if (observer) {
      for (const wrap of Object.values(wrapRefs.current)) {
        if (wrap) observer.observe(wrap);
      }
    }

    return () => {
      cancelled = true;
      window.cancelAnimationFrame(frame);
      observer?.disconnect();
    };
  }, [answers, geom, picked, questions, showReview, twoSided]);

  const renderLines = (q: MatchingQuestion) => (
    <svg aria-hidden="true" className="pointer-events-none absolute inset-0 z-10 h-full w-full">
      {(lines[q.id] ?? []).map((line) => (
        <line
          key={line.key}
          x1={line.x1}
          y1={line.y1}
          x2={line.x2}
          y2={line.y2}
          stroke={line.dashed ? "currentColor" : "#10b981"}
          strokeWidth={line.dashed ? 1.5 : 2.5}
          strokeDasharray={line.dashed ? "5 4" : undefined}
          strokeLinecap="round"
          className={line.dashed ? "text-text/30" : undefined}
          opacity={line.dashed ? 0.8 : 0.9}
        />
      ))}
    </svg>
  );

  return (
    <SectionShell
      index="2"
      title={t("মিলকরণ — চাইনিজের সাথে বাংলা অর্থ মেলান", "Matching — Connect Chinese with Bengali Meaning")}
      marks={totalMarks}
      marksLabel={t("নম্বর", "Marks")}
      collapsible={collapsible}
    >
      {questions.map((q, idx) => {
        const res = results?.[q.id];
        const selectedCount = q.pairs.filter((p) => savedOf(q.id, p.hanzi)).length;

        return (
          <div key={q.id} className="bg-background p-4 rounded-xl space-y-3 border border-border">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-text text-sm">
                {idx + 1}.{" "}
                {twoSided
                  ? t(
                      "বাম থেকে চাইনিজ শব্দে চাপ দিন, তারপর ডান থেকে সঠিক বাংলা অর্থে চাপ দিন।",
                      "Tap a Chinese word on the left, then its Bangla meaning on the right."
                    )
                  : t(
                      "প্রতিটি চাইনিজ শব্দের জন্য ড্রপডাউন থেকে সঠিক বাংলা অর্থ বেছে নিন।",
                      "Pick the correct Bengali meaning for each Chinese word from the dropdown."
                    )}
              </p>
              {res && (
                <span
                  className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                    res.earned === res.marks
                      ? "bg-ok/10 text-ok border border-ok/30"
                      : "bg-danger/10 text-danger border border-danger/30"
                  }`}
                >
                  {res.earned}/{res.marks}
                </span>
              )}
            </div>

            {twoSided ? (
              <div ref={(el) => { wrapRefs.current[q.id] = el; }} className="relative">
                <div className="grid grid-cols-2 gap-2.5">
                  {/* left: hanzi */}
                  <div className="space-y-2">
                    {q.pairs.map((pair) => {
                      const key = keyOf(q.id, pair.hanzi);
                      const answer = savedOf(q.id, pair.hanzi);
                      const answered = Boolean(answer);
                      const reviewCorrect = showReview && answer === pair.bn;
                      const reviewWrong = showReview && answered && !reviewCorrect;
                      const active = picked === key;
                      return (
                        <div key={key} className="space-y-1">
                          <button
                            type="button"
                            disabled={disabled || reviewCorrect}
                            onClick={() => pickLeft(q, pair.hanzi)}
                            ref={(el) => { leftEls.current[key] = el; }}
                            className={`w-full p-3 rounded-xl border text-center transition ${
                              reviewCorrect
                                ? "border-ok/50 bg-ok/5 opacity-90"
                                : reviewWrong
                                  ? "border-danger/50 bg-danger/5"
                                  : active
                                    ? "border-primary bg-primary/10 ring-2 ring-primary/40"
                                    : answered
                                      ? "border-primary/50 bg-primary/5"
                                      : "border-border bg-card hover:border-primary/50"
                            } disabled:cursor-default`}
                          >
                            <span className="block text-xl font-chinese font-bold text-text">
                              {pair.hanzi}
                            </span>
                            <span data-pinyin className="mt-0.5 block text-[10px] font-mono text-muted">
                              {pair.pinyin}
                            </span>
                          </button>
                          {showReview && !reviewCorrect && (
                            <p className="text-[11px] text-ok font-bn px-1">
                              {t("সঠিক", "Correct")}: {pair.bn}
                            </p>
                          )}
                        </div>
                      );
                    })}
                  </div>
                  {/* right: shuffled bangla */}
                  <div className="space-y-2">
                    {(rightOrder[q.id] ?? []).map((choice) => {
                      const usedBy = q.pairs.find((p) => savedOf(q.id, p.hanzi) === choice);
                      const used = !!usedBy;
                      const reviewCorrect = showReview && used && usedBy?.bn === choice;
                      const reviewWrong = showReview && used && !reviewCorrect;
                      return (
                        <button
                          key={`${q.id}::${choice}`}
                          type="button"
                          disabled={disabled || !picked}
                          onClick={() => pickRight(q, choice)}
                          ref={(el) => { rightEls.current[`${q.id}::${choice}`] = el; }}
                          className={`w-full min-h-[68px] px-2 py-3 rounded-xl border text-sm font-bn transition ${
                            reviewCorrect
                              ? "border-ok/50 bg-ok/5 text-text/40"
                              : reviewWrong
                                ? "border-danger/50 bg-danger/5 text-danger"
                                : used
                                  ? "border-primary/50 bg-primary/5 text-text"
                                  : picked
                                    ? "border-border bg-card text-text hover:border-primary/60 hover:bg-primary/5"
                                    : "border-border/60 bg-card/50 text-text/40"
                          } disabled:cursor-default`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                </div>

                {!showReview && (
                  <p className="text-[11px] text-muted tabular-nums">
                    {selectedCount}/{q.pairs.length} {t("নির্বাচিত", "selected")}
                  </p>
                )}
                {showReview && renderLines(q)}
              </div>
            ) : (
              <>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-2.5">
                  {q.pairs.map((pair) => {
                    const key = `${q.id}:${pair.hanzi}`;
                    const val = answers[key] ?? "";
                    const isCorrect = results ? pair.bn === val : null;

                    return (
                      <div
                        key={key}
                        className={`p-3 rounded-xl border space-y-2 transition ${
                          isCorrect === true
                            ? "border-ok/50 bg-ok/5"
                            : isCorrect === false
                              ? "border-danger/50 bg-danger/5"
                              : "border-border bg-card"
                        }`}
                      >
                        <div className="flex items-center justify-between gap-2">
                          <span className="text-xl font-chinese font-bold text-text">{pair.hanzi}</span>
                          <span data-pinyin className="text-[10px] font-mono text-muted">{pair.pinyin}</span>
                        </div>
                        <select
                          value={val}
                          disabled={disabled}
                          onChange={(e) => onChange(key, e.target.value)}
                          className="w-full bg-background border border-border rounded-lg p-2 text-text text-sm outline-none focus:ring-2 focus:ring-primary font-bn"
                        >
                          <option value="">{t("-- অর্থ বেছে নিন --", "-- Pick meaning --")}</option>
                          {q.options.map((opt) => (
                            <option key={opt} value={opt}>
                              {opt}
                            </option>
                          ))}
                        </select>
                        {isCorrect === false && (
                          <p className="text-xs text-ok font-bn">
                            {t("সঠিক", "Correct")}: {pair.bn}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>

                {!res && (
                  <p className="text-[11px] text-muted">
                    {q.pairs.filter((pair) => answers[`${q.id}:${pair.hanzi}`]).length}/{q.pairs.length}{" "}
                    {t("মিল দেওয়া হয়েছে", "matched")}
                  </p>
                )}
              </>
            )}
          </div>
        );
      })}
    </SectionShell>
  );
}
