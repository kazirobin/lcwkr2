"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useLanguage } from "@/i18n";
import {
  EXAM_LEVELS,
  LEVEL_TITLES,
  buildLessonExam,
  getExamLessonNumbers,
} from "@/features/hw/data/exam";
import {
  clearAnswers,
  loadAnswers,
  loadResults,
  saveAnswers,
  saveResult,
  summarizeResults,
} from "@/features/hw/data/storage";
import type {
  ExamAnswers,
  ExamResult,
  ExamResultItem,
  LessonExam,
} from "@/features/hw/exam-types";
import WritingSection from "@/features/hw/components/WritingSection";
import MatchingSection from "@/features/hw/components/MatchingSection";
import DialogueSection from "@/features/hw/components/DialogueSection";
import McqSection from "@/features/hw/components/McqSection";
import SpeakingSection from "@/features/hw/components/SpeakingSection";

interface MistakeItem {
  section: string;
  prompt: string;
  userAnswer: string;
  correctAnswer: string;
  earned: number;
  marks: number;
}

export default function HomeworkDynamicPage() {
  const params = useParams();
  const router = useRouter();
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const levelParam = String(params?.hskLavel ?? "hsk1").replace(/[^0-9]/g, "");
  const level = EXAM_LEVELS.includes(Number(levelParam) as 1 | 2 | 3) ? Number(levelParam) : 1;
  const lessonNo = Number(params?.lessonNo) || 1;

  const availableLessons = useMemo(() => getExamLessonNumbers(level), [level]);
  const exam: LessonExam | null = useMemo(
    () => buildLessonExam(level, lessonNo),
    [level, lessonNo],
  );

  const [answers, setAnswers] = useState<ExamAnswers>({});
  const [submitted, setSubmitted] = useState(false);
  const [result, setResult] = useState<ExamResult | null>(null);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);
  const [history, setHistory] = useState<ReturnType<typeof summarizeResults>>({});
  const [showHistory, setShowHistory] = useState(false);
  const [hydrated, setHydrated] = useState(false);

  // restore draft + history from localStorage on lesson change
  useEffect(() => {
    queueMicrotask(() => {
      setHydrated(false);
      setAnswers(loadAnswers(level, lessonNo));
      const prior = loadResults().find((r) => r.key === `${level}-${lessonNo}`);
      if (prior) {
        setResult(prior);
        setSubmitted(true);
      } else {
        setResult(null);
        setSubmitted(false);
      }
      setHistory(summarizeResults());
      setHydrated(true);
    });
  }, [level, lessonNo]);

  // persist draft
  useEffect(() => {
    if (hydrated) saveAnswers(level, lessonNo, answers);
  }, [answers, hydrated, level, lessonNo]);

  // redirect invalid lesson numbers to the first available lesson
  useEffect(() => {
    if (hydrated && availableLessons.length > 0 && !availableLessons.includes(lessonNo)) {
      router.replace(`/hw/hsk${level}/${availableLessons[0]}`);
    }
  }, [hydrated, availableLessons, lessonNo, level, router]);

  if (!exam) {
    return (
      <main className="max-w-4xl mx-auto p-6 my-8 text-center">
        <h1 className="text-2xl font-bold text-text">
          {t("এই লেসনের পরীক্ষা পাওয়া যায়নি", "Exam not found for this lesson")}
        </h1>
      </main>
    );
  }

  const handleInputChange = (id: string, value: string) => {
    setAnswers((prev) => ({ ...prev, [id]: value }));
  };

  const resultBySection = () =>
    (result?.items ?? []).reduce<Record<string, { earned: number; marks: number; correctAnswer?: string }>>(
      (acc, item) => {
        acc[item.id] = { earned: item.earned, marks: item.marks, correctAnswer: item.correctAnswer };
        return acc;
      },
      {},
    );

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const items: ExamResultItem[] = [];
    let totalScore = 0;

    // writing: exact hanzi match, trim spaces
    for (const q of exam.writing) {
      const user = (answers[q.id] ?? "").trim();
      const ok = user === q.target;
      const earned = ok ? q.marks : 0;
      totalScore += earned;
      items.push({
        section: "writing",
        id: q.id,
        prompt: `${q.prompt} (${q.pinyin})`,
        userAnswer: user || "—",
        correctAnswer: q.target,
        earned,
        marks: q.marks,
      });
    }

    // matching: 2 marks per correct pair
    for (const q of exam.matching) {
      let earned = 0;
      for (const pair of q.pairs) {
        const user = (answers[`${q.id}:${pair.hanzi}`] ?? "").trim();
        if (user === pair.bn) earned += 2;
      }
      totalScore += earned;
      items.push({
        section: "matching",
        id: q.id,
        prompt: t("মিলকরণ", "Matching"),
        userAnswer: `${earned}/${q.marks}`,
        correctAnswer: `${q.marks}/${q.marks}`,
        earned,
        marks: q.marks,
      });
    }

    // dialogue: per-blank choice match
    for (const q of exam.dialogues) {
      for (const blank of q.blanks) {
        const user = (answers[blank.id] ?? "").trim();
        const ok = user === blank.answer;
        const earned = ok ? q.marks : 0;
        totalScore += earned;
        items.push({
          section: "dialogue",
          id: blank.id,
          prompt: `${blank.hanzi} — ${blank.pinyin}`,
          userAnswer: user || "—",
          correctAnswer: blank.answer,
          earned,
          marks: q.marks,
        });
      }
    }

    // MCQ: 1 mark per word, hanzi → Bangla meaning
    for (const q of exam.mcq) {
      const user = (answers[q.id] ?? "").trim();
      const ok = user === q.bn;
      const earned = ok ? q.marks : 0;
      totalScore += earned;
      items.push({
        section: "mcq",
        id: q.id,
        prompt: `${q.hanzi} (${q.pinyin})`,
        userAnswer: user || "—",
        correctAnswer: q.bn,
        earned,
        marks: q.marks,
      });
    }

    // speaking: full marks when a recording exists
    for (const q of exam.speaking) {
      const has = Boolean(answers[q.id]);
      const earned = has ? q.marks : 0;
      totalScore += earned;
      items.push({
        section: "speaking",
        id: q.id,
        prompt: `${q.line} (${q.pinyin})`,
        userAnswer: has ? "🎙️" : "—",
        correctAnswer: q.line,
        earned,
        marks: q.marks,
      });
    }

    const res: ExamResult = {
      key: `${level}-${lessonNo}`,
      level,
      lesson: lessonNo,
      totalScore,
      totalMarks: exam.totalMarks,
      items,
      submittedAt: new Date().toISOString(),
    };

    setResult(res);
    setSubmitted(true);
    saveResult(res);
    setHistory(summarizeResults());
    setMistakes(
      items
        .filter((i) => i.earned < i.marks)
        .map((i) => ({
          section: i.section,
          prompt: i.prompt,
          userAnswer: i.userAnswer,
          correctAnswer: i.correctAnswer,
          earned: i.earned,
          marks: i.marks,
        })),
    );
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleRetake = () => {
    clearAnswers(level, lessonNo);
    setAnswers({});
    setSubmitted(false);
    setResult(null);
    setMistakes([]);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const scorePercent = result ? Math.round((result.totalScore / result.totalMarks) * 100) : 0;
  const writingRes = resultBySection();
  const matchingRes = resultBySection();
  const dialogueRes = resultBySection();
  const mcqRes = resultBySection();
  const speakingRes = resultBySection();

  const SECTION_LABELS: Record<string, string> = {
    writing: t("সেকশন ১ — লেখা", "Section 1 — Writing"),
    matching: t("সেকশন ২ — মিলকরণ", "Section 2 — Matching"),
    dialogue: t("সেকশন ৩ — ডায়লগ", "Section 3 — Dialogue"),
    mcq: t("সেকশন ৪ — MCQ", "Section 4 — MCQ"),
    speaking: t("সেকশন ৫ — স্পিকিং", "Section 5 — Speaking"),
  };

  return (
    <main
      className={`max-w-4xl mx-auto p-4 sm:p-6 bg-card border border-border shadow-sm rounded-3xl my-8 hsk-page ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      {/* Level & Lesson selectors */}
      <div className="bg-background p-4 rounded-2xl mb-6 border border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          {EXAM_LEVELS.map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => {
                const first = getExamLessonNumbers(lvl)[0] ?? 1;
                router.push(`/hw/hsk${lvl}/${first}`);
              }}
              className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase transition ${
                level === lvl
                  ? "bg-primary text-primary-foreground shadow"
                  : "bg-card text-text border border-border hover:bg-primary/10"
              }`}
            >
              {LEVEL_TITLES[lvl]}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="lessonSelect" className="text-sm font-semibold text-muted">
            {t("লেসন", "Lesson")}:
          </label>
          <select
            id="lessonSelect"
            value={lessonNo}
            onChange={(e) => router.push(`/hw/hsk${level}/${e.target.value}`)}
            className="border border-border rounded-xl px-3 py-1.5 bg-card text-text text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
          >
            {availableLessons.map((num) => (
              <option key={num} value={num}>
                {t("লেসন", "Lesson")} {num}
              </option>
            ))}
          </select>
        </div>
      </div>

      {/* Header */}
      <header className="border-b border-border pb-4 mb-6 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase">
            {LEVEL_TITLES[level]}
          </span>
          <h1 className="text-2xl sm:text-3xl font-bold mt-3 text-text">
            {t(exam.titleBn, exam.titleEn)}
          </h1>
          <p className="text-sm text-muted mt-1">
            {t(
              `লেখা, মিলকরণ, ডায়লগ, MCQ ও স্পিকিং — প্রতিটি শব্দে ১ নম্বর করে।`,
              `Writing, matching, dialogue, MCQ and speaking — 1 mark per word.`
            )}
          </p>
        </div>
        <button
          type="button"
          onClick={() => setShowHistory((v) => !v)}
          className="self-start text-xs font-semibold border border-border rounded-xl px-3 py-2 text-muted hover:bg-text/5 transition"
        >
          📊 {t("আমার রেজাল্ট", "My Results")}
        </button>
      </header>

      {/* History panel */}
      {showHistory && (
        <div className="mb-6 p-4 bg-background border border-border rounded-2xl space-y-2">
          <h3 className="font-semibold text-text text-sm">
            {t("সেরা স্কোর (এই ডিভাইসে সেভ করা)", "Best scores (saved on this device)")}
          </h3>
          {Object.keys(history).length === 0 ? (
            <p className="text-xs text-muted">
              {t("এখনো কোনো পরীক্ষা দেওয়া হয়নি।", "No exams taken yet.")}
            </p>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {Object.entries(history)
                .sort(([a], [b]) => {
                  const [la, sa] = a.split("-").map(Number);
                  const [lb, sb] = b.split("-").map(Number);
                  return la - lb || sa - sb;
                })
                .map(([key, s]) => {
                  const [l, les] = key.split("-").map(Number);
                  const pct = Math.round((s.best / s.totalMarks) * 100);
                  return (
                    <button
                      key={key}
                      type="button"
                      onClick={() => router.push(`/hw/hsk${l}/${les}`)}
                      className="flex items-center justify-between p-2.5 rounded-xl border border-border bg-card hover:border-primary/50 transition text-sm"
                    >
                      <span className="text-text font-medium">
                        {LEVEL_TITLES[l]} · {t("লেসন", "Lesson")} {les}
                      </span>
                      <span className="flex items-center gap-2">
                        <span
                          className={`font-mono text-xs ${
                            pct >= 80 ? "text-ok" : pct >= 40 ? "text-warn" : "text-danger"
                          }`}
                        >
                          {s.best}/{s.totalMarks} ({pct}%)
                        </span>
                        <span className="text-[10px] text-muted">
                          ×{s.attempts}
                        </span>
                      </span>
                    </button>
                  );
                })}
            </div>
          )}
        </div>
      )}

      {/* Result banner */}
      {submitted && result && (
        <div className="mb-6 p-6 bg-background border border-border rounded-2xl space-y-4">
          <div className="text-center pb-4 border-b border-border">
            <h3 className="text-xl sm:text-2xl font-bold text-text">
              🎯 {t("পরীক্ষার ফলাফল", "Exam Result")}
            </h3>
            <p className="text-lg font-semibold text-primary mt-2">
              {result.totalScore} / {result.totalMarks} — {scorePercent}%
            </p>
            <div className="max-w-xs mx-auto mt-3 h-2.5 rounded-full bg-text/10 overflow-hidden">
              <div
                className={`h-full rounded-full transition-all ${
                  scorePercent >= 80 ? "bg-ok" : scorePercent >= 40 ? "bg-warn" : "bg-danger"
                }`}
                style={{ width: `${scorePercent}%` }}
              />
            </div>
            <p className="text-xs text-muted mt-2">
              {scorePercent >= 80
                ? t("🎉 অভিনন্দন! দুর্দান্ত ফলাফল!", "🎉 Excellent work!")
                : scorePercent >= 40
                  ? t("👍 ভালো চেষ্টা! আরেকবার চেষ্টা করলে আরও ভালো হবে।", "👍 Good try! Practice again to improve.")
                  : t("💪 হতাশ হবেন না — আবার চেষ্টা করুন!", "💪 Keep going — try again!")}
            </p>
          </div>

          {mistakes.length === 0 ? (
            <p className="text-center text-ok font-medium">
              🎉 {t("অভিনন্দন! আপনার সব উত্তর সঠিক হয়েছে!", "Perfect score — every answer correct!")}
            </p>
          ) : (
            <div className="space-y-3">
              <h4 className="font-semibold text-danger text-base">
                ❌ {t("যে ভুলগুলো সংশোধন করতে হবে:", "Answers to review:")}
              </h4>
              {mistakes.map((item, index) => (
                <div
                  key={index}
                  className="bg-danger-surface border border-danger/20 p-4 rounded-xl text-sm space-y-1"
                >
                  <p className="text-[10px] font-mono uppercase text-muted">{SECTION_LABELS[item.section]}</p>
                  <p className="font-medium text-text font-chinese">{item.prompt}</p>
                  <p className="text-muted">
                    {t("আপনার উত্তর", "Your answer")}:{" "}
                    <span className="text-danger font-semibold font-chinese">{item.userAnswer}</span>
                  </p>
                  <p className="text-muted">
                    {t("সঠিক উত্তর", "Correct answer")}:{" "}
                    <span className="text-ok font-semibold font-chinese">{item.correctAnswer}</span>
                  </p>
                </div>
              ))}
            </div>
          )}

          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <button
              type="button"
              onClick={handleRetake}
              className="flex-1 bg-primary text-primary-foreground font-semibold py-3 rounded-2xl hover:opacity-90 transition"
            >
              🔄 {t("আবার পরীক্ষা দিন", "Retake Exam")}
            </button>
            {lessonNo < availableLessons[availableLessons.length - 1] && (
              <button
                type="button"
                onClick={() => router.push(`/hw/hsk${level}/${lessonNo + 1}`)}
                className="flex-1 border border-border bg-card text-text font-semibold py-3 rounded-2xl hover:bg-text/5 transition"
              >
                {t("পরের লেসন →", "Next Lesson →")}
              </button>
            )}
          </div>
        </div>
      )}

      {/* Exam form */}
      {!submitted && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <WritingSection
            questions={exam.writing}
            answers={answers}
            onChange={handleInputChange}
            results={undefined}
          />
          <MatchingSection questions={exam.matching} answers={answers} onChange={handleInputChange} />
          <DialogueSection questions={exam.dialogues} answers={answers} onChange={handleInputChange} />
          <McqSection questions={exam.mcq} answers={answers} onChange={handleInputChange} />
          <SpeakingSection questions={exam.speaking} answers={answers} onChange={handleInputChange} />

          <div className="sticky bottom-4">
            <button
              type="submit"
              className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-2xl hover:opacity-90 transition shadow-lg cursor-pointer text-base"
            >
              {t("জমা দিন ও রেজাল্ট দেখুন", "Submit & See Result")} ({exam.totalMarks} {t("নম্বর", "marks")})
            </button>
          </div>
        </form>
      )}

      {/* Review mode: sections rendered read-only with results after submit */}
      {submitted && result && (
        <div className="space-y-6 opacity-90">
          <h3 className="text-sm font-mono uppercase tracking-wider text-muted">
            {t("উত্তরপত্র পর্যালোচনা", "Answer sheet review")}
          </h3>
          <WritingSection
            questions={exam.writing}
            answers={answers}
            onChange={handleInputChange}
            disabled
            results={writingRes}
          />
          <MatchingSection
            questions={exam.matching}
            answers={answers}
            onChange={handleInputChange}
            disabled
            results={matchingRes}
          />
          <DialogueSection
            questions={exam.dialogues}
            answers={answers}
            onChange={handleInputChange}
            disabled
            results={dialogueRes}
          />
          <McqSection
            questions={exam.mcq}
            answers={answers}
            onChange={handleInputChange}
            disabled
            results={mcqRes}
          />
          <SpeakingSection
            questions={exam.speaking}
            answers={answers}
            onChange={handleInputChange}
            disabled
            results={speakingRes}
          />
        </div>
      )}
    </main>
  );
}
