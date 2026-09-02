"use client";

import { useLanguage } from "@/i18n";
import type { LessonDetail } from "@/features/vocabulary/types";
import { vocabularyCopy, localizeNumber, localizePad2 } from "@/features/vocabulary/i18n";
import { PaperPage, PaperHeader, Breadcrumb, NumberedList, NumberedRow } from "./workbook";

/** `/hsk/[level]/lesson/[lessonNumber]` — the texts in one lesson. */
export default function TextPicker({ detail }: { detail: LessonDetail }) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];
  const isBn = language === "bn";
  const n = (x: number) => localizeNumber(x, language);
  const pad = (x: number) => localizePad2(x, language);

  const levelLabel = `HSK ${n(detail.level)}`;
  const lessonLabel = `${c.lesson} ${n(detail.lesson)}`;

  return (
    <PaperPage isBn={isBn}>
      <PaperHeader
        seal="文"
        eyebrow={`${c.section} · ${levelLabel}`}
        title={lessonLabel}
        intro={c.lessonOverviewN(n(detail.texts.length))}
        aside={
          <Breadcrumb
            label={c.breadcrumbHome}
            trail={[
              { name: c.home, href: "/hsk" },
              { name: levelLabel, href: `/hsk/${detail.level}` },
              { name: lessonLabel },
            ]}
          />
        }
      />

      <div className="mx-auto max-w-3xl px-5 pt-12 pb-24 sm:px-6 md:pt-16">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text/45">
          {c.textList}
        </h2>
        <NumberedList>
          {detail.texts.map((text) => {
            const label = `${c.text} ${n(text.text)}`;
            const meta = [
              `${n(text.words)} ${c.words}`,
              text.hasDialogue ? c.dialogue : null,
            ]
              .filter(Boolean)
              .join(" · ");
            return (
              <NumberedRow
                key={text.text}
                href={`/hsk/${detail.level}/lesson/${detail.lesson}/text/${text.text}`}
                index={pad(text.text)}
                title={label}
                hanzi={text.preview.join("  ")}
                meta={meta}
                cta={c.open}
                ariaLabel={`${levelLabel} ${lessonLabel} ${label} — ${c.open}`}
              />
            );
          })}
        </NumberedList>
      </div>
    </PaperPage>
  );
}
