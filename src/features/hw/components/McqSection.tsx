"use client";

import React from "react";
import { useLanguage } from "@/i18n";
import type { McqQuestion } from "../exam-types";

interface Props {
  questions: McqQuestion[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled?: boolean;
  results?: Record<string, { earned: number; marks: number; correctAnswer?: string }>;
}

export default function McqSection({ questions, answers, onChange, disabled, results }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const answered = questions.filter((q) => answers[q.id]).length;
  const totalMarks = questions.reduce((n, q) => n + q.marks, 0);

  return (
    <section className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-3">
        <h2 className="text-base sm:text-xl font-semibold text-text">
          4. {t("শব্দভাণ্ডার MCQ — হানজি দেখে বাংলা অর্থ বাছুন", "Vocabulary MCQ — pick the Bangla meaning")}
        </h2>
        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
          {totalMarks} {t("নম্বর", "Marks")}
        </span>
      </div>

      <p className="text-xs text-muted">
        {t(
          "প্রতিটি হানজির জন্য সঠিক বাংলা অর্থটি বেছে নিন — একটি শব্দ = ১ নম্বর।",
          "Pick the correct Bangla meaning for each hanzi — 1 mark per word."
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {questions.map((q) => {
          const val = answers[q.id] ?? "";
          const res = results?.[q.id];
          const correct = res ? res.earned === res.marks : null;

          return (
            <div
              key={q.id}
              className={`bg-background p-4 rounded-xl space-y-2.5 border transition ${
                correct === true
                  ? "border-ok/50 bg-ok/5"
                  : correct === false
                    ? "border-danger/50 bg-danger/5"
                    : "border-border"
              }`}
            >
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2.5">
                  <span className="text-2xl font-chinese font-bold text-text">{q.hanzi}</span>
                  <span className="text-[10px] font-mono text-muted">{q.pinyin}</span>
                </div>
                {res && (
                  <span
                    className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                      correct
                        ? "bg-ok/10 text-ok border border-ok/30"
                        : "bg-danger/10 text-danger border border-danger/30"
                    }`}
                  >
                    {res.earned}/{res.marks}
                  </span>
                )}
              </div>

              <div className="grid grid-cols-1 gap-1.5">
                {q.choices.map((choice) => {
                  const active = val === choice;
                  return (
                    <button
                      key={choice}
                      type="button"
                      disabled={disabled}
                      onClick={() => onChange(q.id, active ? "" : choice)}
                      className={`text-left px-3 py-1.5 rounded-lg text-sm font-bn transition border ${
                        active
                          ? "bg-primary text-primary-foreground border-primary font-semibold"
                          : "bg-card border-border text-text hover:border-primary/50"
                      }`}
                    >
                      {choice}
                    </button>
                  );
                })}
              </div>

              {res && res.earned < res.marks && res.correctAnswer && (
                <p className="text-xs text-ok font-bn">
                  {t("সঠিক উত্তর", "Correct")}: {res.correctAnswer}
                </p>
              )}
            </div>
          );
        })}
      </div>

      {!results && (
        <p className="text-[11px] text-muted">
          {answered}/{questions.length} {t("উত্তর দেওয়া হয়েছে", "answered")}
        </p>
      )}
    </section>
  );
}
