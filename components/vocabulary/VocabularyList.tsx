"use client";

import { VocabularyData } from "@/types/vocabulary";
import DialogueComponent from "./Dialogue";
import VocabularyCard from "./VocabularyCard";
import { getTextsForLesson } from "@/data/vocabulary";
import Link from "next/link";

interface VocabularyListProps {
  data: VocabularyData;
  level: string;
  text: string;
}

export default function VocabularyList({
  data,
  level,
  text,
}: VocabularyListProps) {
  const levelNum = parseInt(level);
  const textNum = parseInt(text);
  const lessonNum = data.lesson;

  // Get all texts for this lesson
  const textsInLesson = getTextsForLesson(levelNum, lessonNum);
  const currentIndex = textsInLesson.indexOf(textNum);

  // Get prev and next within the same lesson
  const prevText = currentIndex > 0 ? textsInLesson[currentIndex - 1] : null;
  const nextText =
    currentIndex < textsInLesson.length - 1
      ? textsInLesson[currentIndex + 1]
      : null;

  return (
    <div className="space-y-8">
      {/* Navigation */}
      <div className="flex flex-wrap justify-between items-center gap-4">
        <div className="flex gap-4">
          {prevText && (
            <Link
              href={`/hsk/${level}/lesson/${lessonNum}/text/${prevText}`}
              className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-text rounded-lg transition-colors font-medium border border-secondary/20"
            >
              ← Previous Text
            </Link>
          )}
        </div>

        <div className="flex gap-2">
          <Link
            href={`/hsk/${level}`}
            className="px-4 py-2 bg-primary hover:bg-primary/90 text-background rounded-lg transition-colors font-medium shadow-sm hover:shadow-md"
          >
            Back to HSK Level {level}
          </Link>
        </div>

        <div className="flex gap-4">
          {nextText && (
            <Link
              href={`/hsk/${level}/lesson/${lessonNum}/text/${nextText}`}
              className="px-4 py-2 bg-secondary/20 hover:bg-secondary/30 text-text rounded-lg transition-colors font-medium border border-secondary/20"
            >
              Next Text →
            </Link>
          )}
        </div>
      </div>

      {/* Quick navigation to all texts in this lesson */}
      {textsInLesson.length > 1 && (
        <div className="flex flex-wrap items-center justify-center gap-2 text-sm">
          <span className="text-text/60 font-medium">Jump to:</span>
          {textsInLesson.map((t) => (
            <Link
              key={t}
              href={`/hsk/${level}/lesson/${lessonNum}/text/${t}`}
              className={`px-3 py-1.5 rounded-lg transition-all duration-200 font-medium ${
                t === textNum
                  ? "bg-primary text-background shadow-sm ring-2 ring-primary/20"
                  : "bg-secondary/20 hover:bg-secondary/30 text-text border border-secondary/10"
              }`}
            >
              Text {t}
            </Link>
          ))}
        </div>
      )}

      {/* Dialogue */}
      {data.dialogue && (
        <div className="mb-8">
          <DialogueComponent dialogue={data.dialogue} />
        </div>
      )}

      {/* Lesson Header */}
      <div className="flex flex-wrap items-center justify-between border-b border-secondary/20 pb-4">
        <div>
          <h2 className="text-2xl md:text-3xl font-bold text-text">
            HSK {level} - Lesson {lessonNum} - Text {text}
          </h2>
          <p className="text-text/60 mt-1">
            {data.vocabulary.length} vocabulary words
          </p>
        </div>
        <div className="px-4 py-2 bg-primary/10 text-primary rounded-full text-sm font-medium border border-primary/20">
          Total: {data.vocabulary.length}
        </div>
      </div>

      {/* Vocabulary Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {data.vocabulary.map((item, index) => (
          <VocabularyCard key={index} vocabulary={item} />
        ))}
      </div>
    </div>
  );
}