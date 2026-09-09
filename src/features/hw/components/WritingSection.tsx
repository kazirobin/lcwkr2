"use client";

import React from "react";
import { useLanguage } from "@/i18n";
import type { WritingQuestion } from "../exam-types";

interface Props {
  questions: WritingQuestion[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled?: boolean;
  results?: Record<string, { earned: number; marks: number }>;
}

export default function WritingSection({ questions, answers, onChange, disabled, results }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const totalMarks = questions.reduce((n, q) => n + q.marks, 0);

  return (
    <section className="bg-card border border-border p-5 sm:p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-3">
        <h2 className="text-base sm:text-xl font-semibold text-text">
          1. {t("ক্যারেক্টার লেখা ও পিনইন প্র্যাকটিস", "Character Writing & Pinyin Practice")}
        </h2>
        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full whitespace-nowrap">
          {totalMarks} {t("নম্বর", "Marks")}
        </span>
      </div>

      <p className="text-xs text-muted">
        {t(
          "বাংলা অর্থটি পড়ুন এবং সঠিক চাইনিজ শব্দটি টাইপ করুন।",
          "Read the meaning and type the correct Chinese word."
        )}
      </p>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
        {questions.map((q, idx) => {
          const res = results?.[q.id];
          const val = answers[q.id] ?? "";
          const correct = res && res.earned === res.marks;
          const wrong = res && res.earned < res.marks;

          return (
            <div key={q.id} className="bg-background p-4 rounded-xl space-y-2 border border-border">
              <div className="flex items-start justify-between gap-2">
                <p className="font-medium text-text text-sm">
                  <span className="text-muted mr-1">{idx + 1}.</span>
                  {language === "bn" ? q.prompt : q.pinyin + " — " + q.prompt}
                </p>
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
              <p className="text-xs text-muted">{q.pinyin}</p>
              <input
                type="text"
                value={val}
                disabled={disabled}
                onChange={(e) => onChange(q.id, e.target.value)}
                placeholder={t("চাইনিজ লিখুন...", "Type Chinese...")}
                className={`w-full bg-card border rounded-lg p-2.5 text-text outline-none font-chinese transition text-lg ${
                  wrong ? "border-danger/60" : "border-border focus:ring-2 focus:ring-primary"
                }`}
              />
              {wrong && (
                <p className="text-xs text-ok font-chinese">
                  {t("সঠিক উত্তর", "Correct")}: {q.target}
                </p>
              )}
            </div>
          );
        })}
      </div>
    </section>
  );
}
