"use client";

import Link from "next/link";

import { useLanguage } from "@/i18n";
import type { VocabularyData, TextNav } from "@/features/vocabulary/types";
import { vocabularyCopy, localizeNumber } from "@/features/vocabulary/i18n";
import { PaperPage, Breadcrumb } from "./workbook";
import VocabularyCard from "./VocabularyCard";
import Dialogue from "./Dialogue";

/**
 * The reader — where a learner actually studies. Workbook register: warm
 * paper, a reading serif for the lesson heading, then the dialogue and a
 * bilingual glossary of the text's words with the character column aligned
 * so the eye runs straight down it. One forward path: Back / Continue.
 * No data import — the page hands it one text's props.
 */
export default function TextReader({
  data,
  nav,
}: {
  data: VocabularyData;
  nav: TextNav;
}) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];
  const isBn = language === "bn";
  const n = (x: number) => localizeNumber(x, language);

  const { hskLevel: level, lesson, text } = data;
  const levelLabel = `HSK ${n(level)}`;
  const lessonLabel = `${c.lesson} ${n(lesson)}`;
  const textHref = (l: number, t: number) =>
    `/hsk/${level}/lesson/${l}/text/${t}`;

  const nextIsNewLesson = nav.next != null && nav.next.lesson !== lesson;

  return (
    <PaperPage isBn={isBn}>
      <header className="relative isolate mx-auto max-w-3xl overflow-hidden px-5 pt-28 pb-2 sm:px-6 md:pt-32">
        <span
          aria-hidden="true"
          lang="zh"
          className="pointer-events-none absolute -top-8 right-0 select-none text-[13rem] leading-none font-medium text-text/[0.05] sm:text-[16rem]"
        >
          {data.vocabulary[0]?.hanzi ?? "字"}
        </span>

        <div className="relative">
          <Breadcrumb
            label={c.breadcrumbHome}
            trail={[
              { name: c.home, href: "/hsk" },
              { name: levelLabel, href: `/hsk/${level}` },
              { name: lessonLabel, href: `/hsk/${level}/lesson/${lesson}` },
              { name: `${c.text} ${n(text)}` },
            ]}
          />

          <p className="mt-6 text-xs font-semibold uppercase tracking-[0.16em] text-text/55">
            {c.section} · {levelLabel}
          </p>
          <h1 className="mt-2 font-serif text-[2.3rem] font-medium leading-[1.1] tracking-[-0.01em] text-text sm:text-[2.75rem]">
            {levelLabel} · {lessonLabel}
          </h1>
          <p className="mt-2.5 text-[15px] text-text/65">
            {c.positionInLevel(n(nav.indexInLevel), n(nav.totalInLevel))} ·{" "}
            {n(data.vocabulary.length)} {c.words}
            {data.dialogue ? ` · ${c.dialogue}` : ""}
          </p>

          {nav.lessonTexts.length > 1 && (
            <div className="mt-6 flex flex-wrap items-center gap-2.5 text-sm">
              <span className="text-xs uppercase tracking-[0.12em] text-text/45">
                {c.inThisLesson}
              </span>
              {nav.lessonTexts.map((t) => {
                const current = t === text;
                return (
                  <Link
                    key={t}
                    href={textHref(lesson, t)}
                    aria-current={current ? "page" : undefined}
                    className={`inline-flex h-9 min-w-9 items-center justify-center rounded-full border px-3 font-serif text-[15px] tabular-nums transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
                      current
                        ? "border-secondary bg-secondary text-white"
                        : "border-text/20 text-text/65 hover:border-text/45 hover:text-text"
                    }`}
                  >
                    {n(t)}
                  </Link>
                );
              })}
            </div>
          )}
        </div>
      </header>

      <div className="mx-auto max-w-3xl px-5 pt-10 pb-24 sm:px-6">
        {data.dialogue && (
          <section className="mb-14">
            <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text/45">
              {c.dialogueHeading}
            </h2>
            <Dialogue dialogue={data.dialogue} speakersLabel={c.speakers} />
          </section>
        )}

        <section>
          <div className="flex items-baseline justify-between border-b-2 border-text/15 pb-2.5">
            <h2 className="font-serif text-xl font-medium text-text">
              {c.vocabHeading}
            </h2>
            <span className="font-serif text-sm tabular-nums text-text/50">
              {n(data.vocabulary.length)}
            </span>
          </div>

          <ol>
            {data.vocabulary.map((item, i) => (
              <VocabularyCard key={`${item.hanzi}-${i}`} item={item} copy={c} />
            ))}
          </ol>
        </section>

        {/* one forward path */}
        <nav
          aria-label={c.breadcrumbHome}
          className="mt-12 flex items-stretch justify-between gap-4 border-t border-text/15 pt-6"
        >
          {nav.prev ? (
            <Link
              href={textHref(nav.prev.lesson, nav.prev.text)}
              className="group flex flex-col justify-center gap-1 rounded-lg px-2 py-2 transition-colors hover:bg-text/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
            >
              <span className="text-xs uppercase tracking-[0.12em] text-text/45">
                ← {c.prevText}
              </span>
              <span className="text-sm font-medium text-text">
                {c.lesson} {n(nav.prev.lesson)} · {c.text} {n(nav.prev.text)}
              </span>
            </Link>
          ) : (
            <span />
          )}

          {nav.next ? (
            <Link
              href={textHref(nav.next.lesson, nav.next.text)}
              className="group flex flex-col items-end justify-center gap-1 rounded-lg px-3 py-2 text-right transition-colors hover:bg-text/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
            >
              <span className="text-xs uppercase tracking-[0.12em] text-text/45">
                {nextIsNewLesson ? c.finishLesson : c.nextText} →
              </span>
              <span className="text-sm font-medium text-text">
                {c.lesson} {n(nav.next.lesson)} · {c.text} {n(nav.next.text)}
              </span>
            </Link>
          ) : (
            <span />
          )}
        </nav>
      </div>
    </PaperPage>
  );
}
