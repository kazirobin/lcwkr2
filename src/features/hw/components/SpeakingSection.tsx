'use client';

import React, { useState } from 'react';
import { HomeworkQuestion } from '../types';

interface Props {
  questions: HomeworkQuestion[];
  onChange: (id: string, value: string) => void;
}

export default function SpeakingSection({ questions, onChange }: Props) {
  const [recordingId, setRecordingId] = useState<string | null>(null);

  const handleRecordToggle = (id: string) => {
    setRecordingId(id);
    setTimeout(() => {
      onChange(id, 'Audio_Recorded_Success.wav');
      setRecordingId(null);
      alert('Audio Recorded! / অডিও রেকর্ড সম্পন্ন হয়েছে!');
    }, 2000);
  };

  return (
    <section className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-3">
        <h2 className="text-xl font-semibold text-text font-bn">
          4. Voice Recording & Speaking Activity
        </h2>
        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
          15 Marks
        </span>
      </div>

      {/* WhatsApp Group Submission Banner */}
      <div className="bg-primary/5 border border-primary/20 p-4 rounded-xl flex flex-col sm:flex-row justify-between items-center gap-3">
        <p className="text-sm text-text font-bn">
          📢 আপনার ভয়েস রেকর্ডিং আমাদের WhatsApp গ্রুপে সাবমিট করুন:
        </p>
        <a
          href="https://chat.whatsapp.com/KG0IULhFkCk0crck8q9MRP"
          target="_blank"
          rel="noopener noreferrer"
          className="bg-green-600 hover:bg-green-700 text-white text-sm font-semibold px-4 py-2 rounded-xl transition flex items-center gap-2 shrink-0"
        >
          💬 Join WhatsApp Group
        </a>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="bg-background p-4 rounded-xl space-y-3 border border-border">
          <p className="font-medium text-text font-en">{idx + 1}. {q.questionEn}</p>
          <p className="text-sm text-muted font-bn">{q.questionBn}</p>
          
          <button
            type="button"
            onClick={() => handleRecordToggle(q.id)}
            className={`px-5 py-2.5 rounded-xl font-semibold text-sm transition flex items-center gap-2 ${
              recordingId === q.id 
                ? 'bg-secondary text-white animate-pulse' 
                : 'bg-primary text-primary-foreground hover:opacity-90'
            }`}
          >
            🎙️ {recordingId === q.id ? 'Recording... / রেকর্ড হচ্ছে...' : 'Record Audio / রেকর্ড করুন'}
          </button>
        </div>
      ))}
    </section>
  );
}