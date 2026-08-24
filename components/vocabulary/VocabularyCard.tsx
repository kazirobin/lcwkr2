"use client";

import { VocabularyItem } from "@/types/vocabulary";
import { useState } from "react";

interface VocabularyCardProps {
  vocabulary: VocabularyItem;
}

export default function VocabularyCard({ vocabulary }: VocabularyCardProps) {
  const [isExpanded, setIsExpanded] = useState(false);

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation();
    setIsExpanded(!isExpanded);
  };

  return (
    <div
      className="bg-background rounded-xl shadow-md hover:shadow-lg transition-all duration-300 overflow-hidden border border-secondary/20 cursor-pointer"
      onClick={toggleExpand}
    >
      <div className="p-5">
        {/* Header */}
        <div className="flex items-start justify-between">
          <div className="flex-1">
            <h3 className="text-2xl font-bold text-text">
              {vocabulary.hanzi}
            </h3>
            <p className="text-sm text-text/60 mt-1">{vocabulary.pinyin}</p>
          </div>
          <span className="px-3 py-1 bg-primary/10 text-primary rounded-full text-xs font-medium whitespace-nowrap ml-2 border border-primary/20">
            {vocabulary.english}
          </span>
        </div>

        {/* Bengali */}
        <p className="text-text/70 mt-2 text-sm">{vocabulary.bangla}</p>

        {/* Expanded Content */}
        {isExpanded && (
          <div className="mt-4 pt-4 border-t border-secondary/20 space-y-4">
            {/* Characters */}
            {vocabulary.characters && vocabulary.characters.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-text/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  ✏️ Characters
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vocabulary.characters.map((char, idx) => (
                    <div
                      key={idx}
                      className="bg-secondary/10 px-3 py-1.5 rounded-lg border border-secondary/10"
                    >
                      <span className="font-medium text-text">
                        {char.hanzi}
                      </span>
                      <span className="text-xs text-text/60 ml-2">
                        {char.pinyin}
                      </span>
                      <span className="text-xs text-text/60 ml-1">
                        ({char.meaning})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Example */}
            {vocabulary.example && (
              <div>
                <h4 className="text-xs font-semibold text-text/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  💬 Example
                </h4>
                <div className="bg-secondary/5 p-4 rounded-lg border border-secondary/10 space-y-1.5">
                  <p className="text-text font-medium">
                    {vocabulary.example.hanzi}
                  </p>
                  <p className="text-sm text-text/60">
                    {vocabulary.example.pinyin}
                  </p>
                  <p className="text-sm text-text/70 pt-1 border-t border-secondary/10">
                    {vocabulary.example.english}
                  </p>
                  <p className="text-sm text-text/70">
                    {vocabulary.example.bangla}
                  </p>
                </div>
              </div>
            )}

            {/* Similar Words */}
            {vocabulary.similar && vocabulary.similar.length > 0 && (
              <div>
                <h4 className="text-xs font-semibold text-text/60 uppercase tracking-wider mb-2.5 flex items-center gap-1.5">
                  🔄 Similar
                </h4>
                <div className="flex flex-wrap gap-2">
                  {vocabulary.similar.map((sim, idx) => (
                    <div
                      key={idx}
                      className="px-3 py-1.5 bg-accent/10 rounded-full border border-accent/20"
                    >
                      <span className="text-sm text-text">{sim.hanzi}</span>
                      <span className="text-xs text-text/60 ml-1.5">
                        ({sim.pinyin})
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}

        {/* Toggle Button */}
        <button
          className="mt-4 text-sm text-primary hover:text-primary/80 transition-colors font-medium flex items-center gap-1"
          onClick={toggleExpand}
        >
          {isExpanded ? (
            <>
              Show less
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 15l7-7 7 7" />
              </svg>
            </>
          ) : (
            <>
              Show more
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
              </svg>
            </>
          )}
        </button>
      </div>
    </div>
  );
}