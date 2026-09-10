"use client";

import React from "react";
import { useLanguage } from "@/i18n";
import type { MatchingQuestion } from "../exam-types";

interface Props {
  questions: MatchingQuestion[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled?: boolean;
  results?: Record<string, { earned: number; marks: number }>;
}

export default function MatchingSection({ questions, answers, onChange, disabled, results }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  return (
    <section className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-3">
        <h2 className="text-base sm:text-xl font-semibold text-text">
          2. {t("মিলকরণ — চাইনিজের সাথে বাংলা অর্থ মেলান", "Matching — Connect Chinese with Bengali Meaning")}
        </h2>
        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
          {questions.reduce((n, q) => n + q.marks, 0)} {t("নম্বর", "Marks")}
        </span>
      </div>

      {questions.map((q, idx) => {
        const selected: Record<string, string> = {};
        for (const pair of q.pairs) {
          const v = answers[`${q.id}:${pair.hanzi}`];
          if (v) selected[pair.hanzi] = v;
        }
        const res = results?.[q.id];
        const usedCount = Object.keys(selected).length;

        return (
          <div key={q.id} className="bg-background p-4 rounded-xl space-y-3 border border-border">
            <div className="flex items-start justify-between gap-2">
              <p className="font-medium text-text text-sm">
                {idx + 1}.{" "}
                {t(
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
                {usedCount}/{q.pairs.length} {t("মিল দেওয়া হয়েছে", "matched")}
              </p>
            )}
          </div>
        );
      })}
    </section>
  );
}
