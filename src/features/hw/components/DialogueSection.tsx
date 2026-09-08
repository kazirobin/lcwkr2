import React from 'react';
import { HomeworkQuestion } from '../types';

interface Props {
  questions: HomeworkQuestion[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
}

export default function DialogueSection({ questions, answers, onChange }: Props) {
  return (
    <section className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-3">
        <h2 className="text-xl font-semibold text-text font-bn">
          3. Complete the Dialogue
        </h2>
        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
          15 Marks
        </span>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="bg-background p-4 rounded-xl space-y-2 border border-border">
          <p className="font-medium text-text font-en">{idx + 1}. {q.questionEn}</p>
          <p className="text-sm text-muted font-bn">{q.questionBn}</p>
          
          <select
            value={answers[q.id] || ''}
            onChange={(e) => onChange(q.id, e.target.value)}
            className="w-full bg-card border border-border rounded-lg p-3 text-text focus:ring-2 focus:ring-primary outline-none"
            required
          >
            <option value="" disabled>-- সঠিক উত্তর সিলেক্ট করুন / Select Option --</option>
            {q.optionsEn?.map((opt, i) => (
              <option key={i} value={opt}>
                {opt} ({q.optionsBn?.[i]})
              </option>
            ))}
          </select>
        </div>
      ))}
    </section>
  );
}