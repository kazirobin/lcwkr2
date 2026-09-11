"use client";

import { useMemo, useState } from "react";
import { useLanguage } from "@/i18n";
import { LESSON_WORDS } from "@/features/chinese-words";
import StrokeOrderButton from "@/components/ui/StrokeOrderButton";

/**
 * Per-lesson stroke practice list for the Hanzi Pro challenge — every
 * challenge word with its pinyin and a stroke-order animation button, so
 * learners can see the name and practice writing it.
 */
export default function WordStrokePractice() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const groups = useMemo(() => {
    const map = new Map<number, { hanzi: string; pinyin: string }[]>();
    for (const w of LESSON_WORDS) {
      if (w.level !== 1) continue;
      const list = map.get(w.lesson) ?? [];
      if (!list.some((x) => x.hanzi === w.hanzi)) {
        list.push({ hanzi: w.hanzi, pinyin: w.pinyin });
      }
      map.set(w.lesson, list);
    }
    return [...map.entries()].sort((a, b) => a[0] - b[0]);
  }, []);

  const [openLesson, setOpenLesson] = useState<number | null>(1);

  return (
    <div className="space-y-2.5">
      {groups.map(([lesson, words]) => {
        const open = openLesson === lesson;
        return (
          <details
            key={lesson}
            open={open}
            onToggle={(e) => {
              if ((e.currentTarget as HTMLDetailsElement).open) setOpenLesson(lesson);
            }}
            className="rounded-2xl border border-text/12 bg-card/70 open:border-primary/30"
          >
            <summary className="flex cursor-pointer list-none flex-wrap items-center justify-between gap-2 px-4 py-3 text-sm font-semibold text-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text">
              <span>
                {t("লেসন", "Lesson")} {lesson}
              </span>
              <span className="font-mono text-xs tabular-nums text-text/50">
                {words.length} {t("টি শব্দ", "words")}
              </span>
            </summary>

            <ul className="flex flex-wrap gap-2 border-t border-text/10 px-4 py-3.5">
              {words.map((w, i) => (
                <li
                  key={`${w.hanzi}-${i}`}
                  className="flex items-center gap-2 rounded-xl border border-text/12 bg-background px-3 py-2"
                >
                  <span lang="zh" className="font-chinese text-2xl font-bold text-text">
                    {w.hanzi}
                  </span>
                  <span className="flex flex-col">
                    <span className="text-[11px] font-mono text-secondary">{w.pinyin}</span>
                    <span className="text-[10px] text-text/45">
                      {t("স্ট্রোক দেখুন", "Practice strokes")}
                    </span>
                  </span>
                  <StrokeOrderButton hanzi={w.hanzi} className="size-8" />
                </li>
              ))}
            </ul>
          </details>
        );
      })}
    </div>
  );
}
