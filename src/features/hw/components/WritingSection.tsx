"use client";

import React from "react";
import { useLanguage } from "@/i18n";
import SpeakerButton from "@/components/ui/SpeakerButton";
import type { WritingQuestion } from "../exam-types";
import SectionShell from "./SectionShell";

interface Props {
  questions: WritingQuestion[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
  disabled?: boolean;
  results?: Record<string, { earned: number; marks: number }>;
  collapsible?: boolean;
  /** Lesson-1 mode: pinyin is recommended (accepted for full marks),
   * hanzi is optional — plus a richer correct-answer reveal. */
  acceptPinyin?: boolean;
}

export default function WritingSection({
  questions,
  answers,
  onChange,
  disabled,
  results,
  collapsible,
  acceptPinyin = false,
}: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const totalMarks = questions.reduce((n, q) => n + q.marks, 0);

  return (
    <SectionShell
      index="1"
      title={t("ক্যারেক্টার লেখা ও পিনইন প্র্যাকটিস", "Character Writing & Pinyin Practice")}
      marks={totalMarks}
      marksLabel={t("নম্বর", "Marks")}
      collapsible={collapsible}
    >
      <p className="text-xs text-muted">
        {acceptPinyin
          ? t(
              "বাংলা অর্থটি পড়ুন — Pinyin লিখলেই full marks! Hanzi লেখা optional (বোনাস প্র্যাকটিস)।",
              "Read the meaning — typing the pinyin earns full marks! Hanzi is optional (bonus practice)."
            )
          : t(
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
              {acceptPinyin ? (
                <p className="flex flex-wrap items-center gap-2">
                  <span data-pinyin className="text-base font-mono font-bold text-secondary">
                    {q.pinyin}
                  </span>
                  <span className="text-[10px] font-bold uppercase tracking-wide px-2 py-0.5 rounded-full bg-secondary/10 text-secondary border border-secondary/25">
                    {t("recommended", "recommended")}
                  </span>
                </p>
              ) : (
                <p data-pinyin className="text-xs text-muted">{q.pinyin}</p>
              )}
              <input
                type="text"
                value={val}
                disabled={disabled}
                onChange={(e) => onChange(q.id, e.target.value)}
                placeholder={
                  acceptPinyin
                    ? t("Pinyin বা Hanzi লিখুন...", "Type pinyin or hanzi...")
                    : t("চাইনিজ লিখুন...", "Type Chinese...")
                }
                className={`w-full bg-card border rounded-lg p-2.5 text-text outline-none font-chinese transition text-lg ${
                  wrong ? "border-danger/60" : "border-border focus:ring-2 focus:ring-primary"
                }`}
              />
              {wrong &&
                (acceptPinyin ? (
                  <div className="rounded-lg bg-ok/5 border border-ok/20 p-2.5 space-y-1.5">
                    <p className="text-xs text-ok font-semibold">
                      {t("সঠিক উত্তর", "Correct answer")}
                    </p>
                    <div className="flex items-center gap-2">
                      <span className="font-chinese text-lg text-text">{q.target}</span>
                      <SpeakerButton text={q.target} className="size-6" />
                    </div>
                    <p data-pinyin className="text-xs font-mono text-secondary">{q.pinyin}</p>
                  </div>
                ) : (
                  <p className="text-xs text-ok font-chinese">
                    {t("সঠিক উত্তর", "Correct")}: {q.target}
                  </p>
                ))}
            </div>
          );
        })}
      </div>
    </SectionShell>
  );
}
