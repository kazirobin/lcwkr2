import React from 'react';
import { HomeworkQuestion } from '../types';

interface Props {
  questions: HomeworkQuestion[];
  answers: Record<string, string>;
  onChange: (id: string, value: string) => void;
}

export default function MatchingSection({ questions, answers, onChange }: Props) {
  return (
    <section className="bg-card border border-border p-6 rounded-2xl shadow-sm space-y-4">
      <div className="flex justify-between items-center border-b border-border pb-3">
        <h2 className="text-xl font-semibold text-text font-bn">
          2. Matching - Connect Chinese with Bengali Meaning
        </h2>
        <span className="text-xs font-bold bg-primary/10 text-primary px-3 py-1 rounded-full">
          10 Marks
        </span>
      </div>

      {questions.map((q, idx) => (
        <div key={q.id} className="bg-background p-4 rounded-xl space-y-3 border border-border">
          <p className="font-medium text-text font-en">{idx + 1}. {q.questionEn}</p>
          <p className="text-sm text-muted font-bn">{q.questionBn}</p>
          
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 mt-2">
            {q.optionsBn?.map((opt, i) => (
              <label 
                key={i} 
                className={`flex items-center space-x-3 p-3 border rounded-xl cursor-pointer transition ${
                  answers[q.id] === opt 
                    ? 'border-primary bg-primary/5 text-text font-semibold' 
                    : 'border-border bg-card hover:border-primary/50 text-muted'
                }`}
              >
                <input
                  type="radio"
                  name={q.id}
                  value={opt}
                  checked={answers[q.id] === opt}
                  onChange={(e) => onChange(q.id, e.target.value)}
                  className="text-primary focus:ring-primary"
                />
                <span className="font-bn">{opt}</span>
              </label>
            ))}
          </div>
        </div>
      ))}
    </section>
  );
}