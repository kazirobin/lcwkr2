"use client";

import React from "react";
import { useLanguage } from "@/i18n";
import type { DialogueQuestion } from "../exam-types";

interface Props {
  questions: DialogueQuestion[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled?: boolean;
  results?: Record<string, { earned: number; marks: number; correctAnswer?: string }>;
}

export default function DialogueSection({ questions, answers, onChange, disabled, results }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  return (
    <section className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-3">
        <h2 className="text-base sm:text-xl font-semibold text-text">
          3. {t("ডায়লগ সম্পূর্ণ করুন", "Complete the Dialogue")}
        </h2>
        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
          {questions.reduce((n, q) => n + q.marks, 0)} {t("নম্বর", "Marks")}
        </span>
      </div>

      {questions.length === 0 && (
        <p className="text-xs text-muted">
          {t("এই লেসনে ডায়লগ প্রশ্ন নেই।", "No dialogue questions for this lesson.")}
        </p>
      )}

      {questions.map((q, idx) => (
        <div key={q.id} className="bg-background p-4 rounded-xl space-y-3 border border-border">
          <div className="flex items-start justify-between gap-2">
            <p className="font-medium text-text text-sm">
              {idx + 1}. {q.title || t("ডায়লগ", "Dialogue")}
            </p>
            {results?.[q.blanks[0].id] && (
              <span
                className={`shrink-0 text-[10px] font-mono px-2 py-0.5 rounded-full ${
                  results[q.blanks[0].id].earned === results[q.blanks[0].id].marks
                    ? "bg-ok/10 text-ok border border-ok/30"
                    : "bg-danger/10 text-danger border border-danger/30"
                }`}
              >
                {results[q.blanks[0].id].earned}/{results[q.blanks[0].id].marks}
              </span>
            )}
          </div>

          <div className="space-y-1.5 bg-card rounded-xl p-3 border border-border/60">
            {q.lines.map((ln, i) => {
              const blank = q.blanks.find((b) => b.lineIndex === i);
              if (!blank) {
                return (
                  <p key={i} className="text-sm font-chinese text-text">
                    <span className="text-[10px] font-mono text-muted mr-2 align-middle">
                      {ln.s}
                    </span>
                    {ln.h}
                  </p>
                );
              }
              const val = answers[blank.id] ?? "";
              const res = results?.[blank.id];

              return (
                <div key={i} className="py-1">
                  <p className="text-sm font-chinese text-text mb-1.5">
                    <span className="text-[10px] font-mono text-muted mr-2 align-middle">{ln.s}</span>
                    {blank.hanzi}
                  </p>
                  <div className="flex flex-wrap gap-1.5 pl-1">
                    {blank.choices.map((choice) => {
                      const active = val === choice;
                      return (
                        <button
                          key={choice}
                          type="button"
                          disabled={disabled}
                          onClick={() => onChange(blank.id, active ? "" : choice)}
                          className={`px-3 py-1.5 rounded-lg text-sm font-chinese transition border ${
                            active
                              ? "bg-primary text-primary-foreground border-primary font-bold"
                              : "bg-card border-border text-text hover:border-primary/50"
                          }`}
                        >
                          {choice}
                        </button>
                      );
                    })}
                  </div>
                  {res && res.earned < res.marks && res.correctAnswer && (
                    <p className="text-xs text-ok font-chinese mt-1.5">
                      {t("সঠিক উত্তর", "Correct")}: {res.correctAnswer}
                    </p>
                  )}
                  <p data-pinyin className="text-[10px] font-mono text-muted mt-1">{blank.pinyin}</p>
                </div>
              );
            })}
          </div>
        </div>
      ))}
    </section>
  );
}
