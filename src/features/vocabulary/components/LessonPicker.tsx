"use client";

import { useLanguage } from "@/i18n";
import type { LevelDetail } from "@/features/vocabulary/types";
import { vocabularyCopy, localizeNumber, localizePad2 } from "@/features/vocabulary/i18n";
import { PaperPage, PaperHeader, Breadcrumb, Glance, NumberedList, NumberedRow } from "./workbook";

/** `/hsk/[level]` — the lessons of one level, as a numbered sequence. */
export default function LessonPicker({ detail }: { detail: LevelDetail }) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];
  const isBn = language === "bn";
  const n = (x: number) => localizeNumber(x, language);
  const pad = (x: number) => localizePad2(x, language);

  const levelLabel = `HSK ${n(detail.level)}`;

  return (
    <PaperPage isBn={isBn}>
      <PaperHeader
        seal="课"
        eyebrow={`${c.section} · ${levelLabel}`}
        title={levelLabel}
        intro={c.levelOverview(n(detail.level))}
        aside={
          <div className="space-y-5">
            <Breadcrumb
              label={c.breadcrumbHome}
              trail={[
                { name: c.home, href: "/hsk" },
                { name: levelLabel },
              ]}
            />
            <Glance
              items={[
                [c.glanceLessons, n(detail.lessons.length)],
                [c.glanceTexts, n(detail.texts)],
                [c.glanceWords, n(detail.words)],
              ]}
            />
          </div>
        }
      />

      <div className="mx-auto max-w-3xl px-5 pt-12 pb-24 sm:px-6 md:pt-16">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text/45">
          {c.lessonList}
        </h2>
        <NumberedList>
          {detail.lessons.map((lesson) => {
            const label = `${c.lesson} ${n(lesson.lesson)}`;
            const meta = [
              `${n(lesson.texts)} ${c.text.toLowerCase()}`,
              `${n(lesson.words)} ${c.words}`,            ]
              .filter(Boolean)
              .join(" · ");
            return (
              <NumberedRow
                key={lesson.lesson}
                href={`/hsk/${detail.level}/lesson/${lesson.lesson}`}
                index={pad(lesson.lesson)}
                title={label}
                meta={meta}
                cta={c.open}
                ariaLabel={`${levelLabel} ${label} — ${c.open}`}
              />
            );
          })}
        </NumberedList>
      </div>
    </PaperPage>
  );
}
