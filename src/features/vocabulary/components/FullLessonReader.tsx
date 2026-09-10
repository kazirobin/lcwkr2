"use client";

import Link from "next/link";

import { useLanguage } from "@/i18n";
import type { VocabularyData, VocabularyItem } from "@/features/vocabulary/types";
import { vocabularyCopy, localizeNumber } from "@/features/vocabulary/i18n";
import { PaperPage, Breadcrumb } from "./workbook";
import VocabularyCard from "./VocabularyCard";
import Dialogue from "./Dialogue";

/**
 * The whole lesson on one page — every text's dialogue in order, then the
 * full deduplicated word list. Reached from the lesson picker's "All texts"
 * row. Same workbook register as [[TextReader]].
 */
export default function FullLessonReader({
  level,
  lesson,
  records,
  words,
}: {
  level: number;
  lesson: number;
  records: VocabularyData[];
  words: VocabularyItem[];
}) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];
  const isBn = language === "bn";
  const n = (x: number) => localizeNumber(x, language);

  const levelLabel = `HSK ${n(level)}`;
  const lessonLabel = `${c.lesson} ${n(lesson)}`;
  const withDialogue = records.filter((r) => r.dialogue != null);

  return (
    <PaperPage isBn={isBn}>
      <header className="relative isolate mx-auto max-w-3xl overflow-hidden px-5 pt-28 pb-2 sm:px-6 md:pt-32">
        <span
          aria-hidden="true"
          lang="zh"
          className="font-chinese pointer-events-none absolute -top-8 right-0 select-none text-[13rem] leading-none font-medium text-text/[0.05] sm:text-[16rem]"
        >
          全
        </span>

        <div className="relative">
          <Breadcrumb
            label={c.breadcrumbHome}
            trail={[
              { name: c.home, href: "/hsk" },
              { name: levelLabel, href: `/hsk/${level}` },
              { name: lessonLabel, href: `/hsk/${level}/lesson/${lesson}` },
              { name: c.allTexts },
            ]}
          />

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-text/55">
            {c.section} · {levelLabel}
          </p>
          <h1 className="mt-2 font-serif text-[2.3rem] font-medium leading-[1.1] tracking-[-0.01em] text-text sm:text-[2.75rem]">
            {lessonLabel} · {c.allTexts}
          </h1>
          <p className="mt-2.5 text-[15px] text-text/65">
            {n(records.length)} {c.levelTexts} · {n(words.length)} {c.words}
            {withDialogue.length > 0 ? ` · ${c.dialogue}` : ""}
          </p>
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 pt-10 pb-24 sm:px-6">
        {/* ── dialogues, text by text ── */}
        {withDialogue.length > 0 && (
          <section className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text/45">
              {c.allTextsHeading}
            </h2>

            <div className="mt-6 space-y-10">
              {withDialogue.map((r) => (
                <div key={`${r.hskLevel}-${r.lesson}-${r.text}`}>
                  <div className="mb-3 flex items-baseline justify-between border-b-2 border-text/15 pb-2">
                    <h3 className="font-serif text-lg font-medium text-text">
                      {c.text} {n(r.text)}
                    </h3>
                    <span className="text-xs text-text/45">{r.dialogue?.title}</span>
                  </div>
                  <div className="font-chinese">
                    <Dialogue dialogue={r.dialogue!} speakersLabel={c.speakers} />
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── every word of the lesson ── */}
        <section>
          <div className="flex items-baseline justify-between border-b-2 border-text/15 pb-2.5">
            <h2 className="font-serif text-xl font-medium text-text">
              {c.allWordsHeading}
            </h2>
            <span className="font-serif text-sm tabular-nums text-text/50">
              {n(words.length)}
            </span>
          </div>

          <ol>
            {words.map((item, i) => (
              <VocabularyCard key={`${item.hanzi}-${i}`} item={item} copy={c} />
            ))}
          </ol>
        </section>

        {/* one way back */}
        <nav
          aria-label={c.backToLesson}
          className="mt-12 flex items-stretch justify-between gap-4 border-t border-text/15 pt-6"
        >
          <Link
            href={`/hsk/${level}/lesson/${lesson}`}
            className="group flex flex-col justify-center gap-1 rounded-lg px-2 py-2 transition-colors hover:bg-text/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
          >
            <span className="text-xs uppercase tracking-[0.12em] text-text/45">
              ← {c.backToLesson}
            </span>
            <span className="text-sm font-medium text-text">
              {levelLabel} · {lessonLabel}
            </span>
          </Link>
          <span />
        </nav>
      </div>
    </PaperPage>
  );
}
