'use client';

import React, { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { allHskHomeworkDatabase, getAvailableLessonsForLevel } from '@/features/hw/data/hw';
import { LessonHomework } from '@/features/hw/types';

import CharacterWriting from '@/features/hw/components/CharacterWriting';
import MatchingSection from '@/features/hw/components/MatchingSection';
import DialogueSection from '@/features/hw/components/DialogueSection';
import SpeakingSection from '@/features/hw/components/SpeakingSection';

interface MistakeItem {
  question: string;
  userAnswer: string;
  correctAnswer: string;
}

export default function HomeworkDynamicPage() {
  const params = useParams();
  const router = useRouter();

  const currentLevel = (params?.hskLavel as string) || 'hsk1';
  const lessonNo = Number(params?.lessonNo) || 1;

  const levelLessons = allHskHomeworkDatabase[currentLevel] || {};
  const lessonData: LessonHomework | undefined = levelLessons[lessonNo];
  const availableLessons = getAvailableLessonsForLevel(currentLevel);

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);
  const [totalScore, setTotalScore] = useState(0);
  const [mistakes, setMistakes] = useState<MistakeItem[]>([]);

  const handleLevelChange = (level: string) => {
    const firstAvailableLesson = getAvailableLessonsForLevel(level)[0] || 1;
    router.push(`/hw/${level}/${firstAvailableLesson}`);
  };

  const handleLessonChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    router.push(`/hw/${currentLevel}/${e.target.value}`);
  };

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!lessonData) return;

    let score = 0;
    const recordedMistakes: MistakeItem[] = [];

    // সকল সেকশনের প্রশ্নগুলো চেক করা
    const allQuestions = [
      ...lessonData.sections.characterWriting,
      ...lessonData.sections.matching,
      ...lessonData.sections.dialogueCompletion,
      ...lessonData.sections.speakingActivity,
    ];

    allQuestions.forEach((q) => {
      const userAns = answers[q.id]?.trim().toLowerCase() || '';
      const correctAns = q.correctAnswer.trim().toLowerCase();

      // স্পিকিং বা রাইটিং এর ক্ষেত্রে মক টেস্টিং এ অ্যানসার থাকলেই মার্কস ধরা হয়েছে
      if (q.type === 'audio' || userAns !== '') {
        if (q.type === 'audio' || userAns === correctAns) {
          score += q.marks;
        } else {
          recordedMistakes.push({
            question: q.questionEn,
            userAnswer: answers[q.id] || 'Not answered',
            correctAnswer: q.correctAnswer,
          });
        }
      } else {
        recordedMistakes.push({
          question: q.questionEn,
          userAnswer: 'Not answered',
          correctAnswer: q.correctAnswer,
        });
      }
    });

    setTotalScore(score);
    setMistakes(recordedMistakes);
    setSubmitted(true);
  };

  return (
    <main className="max-w-4xl mx-auto p-6 bg-card border border-border shadow-sm rounded-3xl my-8 hsk-page font-bn">
      {/* Level & Lesson Selectors */}
      <div className="bg-background p-4 rounded-2xl mb-6 border border-border flex flex-col md:flex-row justify-between items-center gap-4">
        <div className="flex items-center gap-2 flex-wrap">
          <span className="text-sm font-semibold text-muted mr-2">HSK Level:</span>
          {['hsk1', 'hsk2', 'hsk3', 'hsk4', 'hsk5', 'hsk6'].map((lvl) => (
            <button
              key={lvl}
              type="button"
              onClick={() => handleLevelChange(lvl)}
              className={`px-4 py-1.5 rounded-full text-sm font-bold uppercase transition ${
                currentLevel === lvl
                  ? 'bg-primary text-primary-foreground shadow'
                  : 'bg-card text-text border border-border hover:bg-primary/10'
              }`}
            >
              {lvl}
            </button>
          ))}
        </div>

        <div className="flex items-center gap-2">
          <label htmlFor="lessonSelect" className="text-sm font-semibold text-muted">Lesson:</label>
          <select
            id="lessonSelect"
            value={lessonNo}
            onChange={handleLessonChange}
            className="border border-border rounded-xl px-3 py-1.5 bg-card text-text text-sm font-medium focus:ring-2 focus:ring-primary outline-none"
          >
            {availableLessons.map((num) => (
              <option key={num} value={num}>Lesson {num}</option>
            ))}
          </select>
        </div>
      </div>

      <header className="border-b border-border pb-4 mb-6">
        <span className="text-xs font-semibold bg-primary/10 text-primary px-3 py-1 rounded-full uppercase">
          {currentLevel}
        </span>
        <h1 className="text-3xl font-bold mt-3 text-text">
          {lessonData ? `Lesson ${lessonData.lessonNumber}: ${lessonData.lessonTitleEn} / ${lessonData.lessonTitleBn}` : 'Homework Not Found'}
        </h1>
      </header>

      {lessonData && (
        <form onSubmit={handleSubmit} className="space-y-6">
          <CharacterWriting questions={lessonData.sections.characterWriting} answers={answers} onChange={handleInputChange} />
          <MatchingSection questions={lessonData.sections.matching} answers={answers} onChange={handleInputChange} />
          <DialogueSection questions={lessonData.sections.dialogueCompletion} answers={answers} onChange={handleInputChange} />
          <SpeakingSection questions={lessonData.sections.speakingActivity} onChange={handleInputChange} />

          <button
            type="submit"
            className="w-full bg-primary text-primary-foreground font-semibold py-3.5 rounded-2xl hover:opacity-90 transition shadow-sm cursor-pointer text-base"
          >
            Submit Homework & Check Score / হোমওয়ার্ক জমা দিন ও স্কোর দেখুন
          </button>
        </form>
      )}

      {/* Submission Result, Score & Mistakes Review */}
      {submitted && (
        <div className="mt-8 p-6 bg-background border border-border rounded-2xl space-y-4">
          <div className="text-center pb-4 border-b border-border">
            <h3 className="text-2xl font-bold text-text">🎯 Homework Evaluation Result</h3>
            <p className="text-lg font-semibold text-primary mt-2">Total Score: {totalScore} / 50</p>
          </div>

          {mistakes.length === 0 ? (
            <p className="text-center text-ok font-medium">🎉 অভিনন্দন! আপনার সব উত্তর সঠিক হয়েছে!</p>
          ) : (
            <div className="space-y-3">
              <h4 className="font-semibold text-danger text-base">❌ যে ভুলগুলো সংশোধন করতে হবে:</h4>
              {mistakes.map((item, index) => (
                <div key={index} className="bg-danger-surface border border-danger/20 p-4 rounded-xl text-sm space-y-1">
                  <p className="font-medium text-text">Q: {item.question}</p>
                  <p className="text-muted">আপনার উত্তর: <span className="text-danger font-semibold">{item.userAnswer}</span></p>
                  <p className="text-muted">সঠিক উত্তর: <span className="text-ok font-semibold">{item.correctAnswer}</span></p>
                </div>
              ))}
            </div>
          )}
        </div>
      )}
    </main>
  );
}