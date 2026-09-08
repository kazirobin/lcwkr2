'use client';

import React, { useState } from 'react';
import { hsk1Lessons } from '../data/hw';
import { LessonHomework } from '../types';

interface HwComponentProps {
  level?: string;
  lessonNo?: number;
}

export default function HwComponent({ level = 'hsk1', lessonNo = 1 }: HwComponentProps) {
  // আপাতত hsk1 এর জন্য সেট করা, পরবর্তীতে লেভেল অনুযায়ী ডাইনামিক করতে পারবেন
  const lessonData: LessonHomework | undefined = hsk1Lessons[lessonNo];

  const [answers, setAnswers] = useState<Record<string, string>>({});
  const [submitted, setSubmitted] = useState(false);

  if (!lessonData) {
    return (
      <div className="p-8 text-center">
        <h1 className="text-2xl font-bold text-red-600">Homework Not Found / হোমওয়ার্ক পাওয়া যায়নি</h1>
      </div>
    );
  }

  const handleInputChange = (questionId: string, value: string) => {
    setAnswers({ ...answers, [questionId]: value });
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <main className="max-w-4xl mx-auto p-6 bg-white shadow-md rounded-lg my-8">
      <header className="border-b pb-4 mb-6">
        <span className="text-sm font-semibold bg-blue-100 text-blue-800 px-3 py-1 rounded-full uppercase">
          {level}
        </span>
        <h1 className="text-3xl font-bold mt-2">
          Lesson {lessonData.lessonNumber}: {lessonData.lessonTitleEn} / {lessonData.lessonTitleBn}
        </h1>
      </header>

      <form onSubmit={handleSubmit} className="space-y-8">
        {/* Section 1: Character Writing */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-3">
            1. Character Writing & Pinyin Practice (10 Marks)
          </h2>
          {lessonData.sections.characterWriting.map((q, idx) => (
            <div key={q.id} className="bg-gray-50 p-4 rounded-md space-y-2">
              <p className="font-medium">{idx + 1}. {q.questionEn}</p>
              <p className="text-sm text-gray-600">{q.questionBn}</p>
              <input
                type="text"
                placeholder="Type your answer..."
                className="w-full border rounded p-2 focus:ring-2 focus:ring-blue-400"
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                required
              />
            </div>
          ))}
        </section>

        {/* Section 2: Matching */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-3">
            2. Matching - Connect Chinese with Bengali Meaning (10 Marks)
          </h2>
          {lessonData.sections.matching.map((q, idx) => (
            <div key={q.id} className="bg-gray-50 p-4 rounded-md space-y-2">
              <p className="font-medium">{idx + 1}. {q.questionEn}</p>
              <p className="text-sm text-gray-600">{q.questionBn}</p>
              <div className="grid grid-cols-2 gap-2 mt-2">
                {q.optionsBn?.map((opt, i) => (
                  <label key={i} className="flex items-center space-x-2 bg-white p-2 border rounded cursor-pointer hover:bg-blue-50">
                    <input
                      type="radio"
                      name={q.id}
                      value={opt}
                      onChange={(e) => handleInputChange(q.id, e.target.value)}
                    />
                    <span>{opt}</span>
                  </label>
                ))}
              </div>
            </div>
          ))}
        </section>

        {/* Section 3: Complete the Dialogue */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-3">
            3. Complete the Dialogue (15 Marks)
          </h2>
          {lessonData.sections.dialogueCompletion.map((q, idx) => (
            <div key={q.id} className="bg-gray-50 p-4 rounded-md space-y-2">
              <p className="font-medium">{idx + 1}. {q.questionEn}</p>
              <p className="text-sm text-gray-600">{q.questionBn}</p>
              <select
                className="w-full border rounded p-2 bg-white"
                onChange={(e) => handleInputChange(q.id, e.target.value)}
                defaultValue=""
                required
              >
                <option value="" disabled>-- Select Correct Option / সঠিক উত্তর বেছে নিন --</option>
                {q.optionsEn?.map((opt, i) => (
                  <option key={i} value={opt}>{opt} ({q.optionsBn?.[i]})</option>
                ))}
              </select>
            </div>
          ))}
        </section>

        {/* Section 4: Voice Recording */}
        <section className="space-y-4">
          <h2 className="text-xl font-semibold text-gray-800 border-l-4 border-blue-500 pl-3">
            4. Voice Recording & Speaking Activity (15 Marks)
          </h2>
          {lessonData.sections.speakingActivity.map((q, idx) => (
            <div key={q.id} className="bg-gray-50 p-4 rounded-md space-y-2">
              <p className="font-medium">{idx + 1}. {q.questionEn}</p>
              <p className="text-sm text-gray-600">{q.questionBn}</p>
              <button
                type="button"
                onClick={() => alert('Voice recorder mock: Recording started!')}
                className="bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600 transition"
              >
                🎙️ Record Audio / রেকর্ড শুরু করুন
              </button>
            </div>
          ))}
        </section>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-semibold py-3 rounded-lg hover:bg-blue-700 transition"
        >
          Submit Homework / হোমওয়ার্ক জমা দিন
        </button>
      </form>

      {submitted && (
        <div className="mt-6 p-4 bg-green-100 text-green-800 rounded-md text-center font-medium">
          🎉 Your homework has been successfully submitted! / আপনার হোমওয়ার্ক সফলভাবে জমা হয়েছে!
        </div>
      )}
    </main>
  );
}