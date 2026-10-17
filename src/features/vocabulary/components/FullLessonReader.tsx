"use client";

import { useState } from "react";
import Link from "next/link";
import { ChevronDown } from "lucide-react";

import { useLanguage } from "@/i18n";
import type { VocabularyData, VocabularyItem, LessonNav } from "@/features/vocabulary/types";
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
  nav,
}: {
  level: number;
  lesson: number;
  records: VocabularyData[];
  words: VocabularyItem[];
  nav: LessonNav | null;
}) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];
  const isBn = language === "bn";
  const n = (x: number) => localizeNumber(x, language);

  const levelLabel = `HSK ${n(level)}`;
  const lessonLabel = `${c.lesson} ${n(lesson)}`;
  const withDialogue = records.filter((r) => r.dialogue != null);

  // first text open by default, the rest collapsed; "Show all" flips them
  const [open, setOpen] = useState<number[]>(() =>
    withDialogue.length > 0 ? [withDialogue[0].text] : [],
  );
  const allOpen =
    withDialogue.length > 0 && withDialogue.every((r) => open.includes(r.text));
  const isOpen = (t: number) => open.includes(t);
  const toggle = (t: number) =>
    setOpen((prev) =>
      prev.includes(t) ? prev.filter((x) => x !== t) : [...prev, t],
    );
  const toggleAll = () =>
    setOpen((prev) =>
      prev.length === withDialogue.length ? [] : withDialogue.map((r) => r.text),
    );

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
        {/* ── dialogues, text by text — collapsible ── */}
        {withDialogue.length > 0 && (
          <section className="mb-14">
            <div className="flex items-center justify-between gap-3">
              <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text/45">
                {c.allTextsHeading}
              </h2>
              {withDialogue.length > 1 && (
                <button
                  type="button"
                  onClick={toggleAll}
                  aria-expanded={allOpen}
                  className="inline-flex items-center gap-1.5 rounded-full border border-text/20 px-3 py-1.5 text-xs font-semibold uppercase tracking-[0.1em] text-text/60 transition-colors hover:border-text/45 hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                >
                  {allOpen ? c.hideAll : c.showAll}
                  <ChevronDown
                    aria-hidden="true"
                    className={`size-3.5 transition-transform duration-200 ${
                      allOpen ? "rotate-180" : ""
                    }`}
                  />
                </button>
              )}
            </div>

            <div className="mt-6 border-t border-text/15">
              {withDialogue.map((r) => {
                const openText = isOpen(r.text);
                return (
                  <div
                    key={`${r.hskLevel}-${r.lesson}-${r.text}`}
                    className="border-b border-text/15"
                  >
                    <button
                      type="button"
                      onClick={() => toggle(r.text)}
                      aria-expanded={openText}
                      aria-controls={`text-panel-${r.text}`}
                      className="flex w-full items-center justify-between gap-3 py-3.5 text-left focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                    >
                      <span className="flex min-w-0 items-baseline gap-2.5">
                        <span className="font-serif text-lg font-medium text-text">
                          {c.text} {n(r.text)}
                        </span>
                        <span className="truncate text-xs text-text/45">
                          {r.dialogue?.title}
                        </span>
                      </span>
                      <ChevronDown
                        aria-hidden="true"
                        className={`size-4 shrink-0 text-text/45 transition-transform duration-200 ${
                          openText ? "rotate-180" : ""
                        }`}
                      />
                    </button>

                    {openText && (
                      <div
                        id={`text-panel-${r.text}`}
                        className="font-chinese pb-6"
                      >
                        <Dialogue
                          dialogue={r.dialogue!}
                          speakersLabel={c.speakers}
                        />
                      </div>
                    )}
                  </div>
                );
              })}
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

        {/* prev / next lesson — same all-texts view, one lesson over */}
        <nav
          aria-label={c.backToLesson}
          className="mt-12 flex items-stretch justify-between gap-3 border-t border-text/15 pt-6"
        >
          {nav?.prev != null ? (
            <Link
              href={`/hsk/${level}/lesson/${nav.prev}/all`}
              className="group flex max-w-[45%] flex-col justify-center gap-1 rounded-lg px-2 py-2 transition-colors hover:bg-text/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
            >
              <span className="text-xs uppercase tracking-[0.12em] text-text/45">
                ← {c.prevLesson}
              </span>
              <span className="text-sm font-medium text-text">
                {levelLabel} · {c.lesson} {n(nav.prev)}
              </span>
            </Link>
          ) : (
            <span />
          )}

          <Link
            href={`/hsk/${level}/lesson/${lesson}`}
            className="self-center rounded-lg px-3 py-2 text-center text-xs font-semibold uppercase tracking-[0.12em] text-text/55 transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
          >
            {c.backToLesson}
          </Link>

          {nav?.next != null ? (
            <Link
              href={`/hsk/${level}/lesson/${nav.next}/all`}
              className="group flex max-w-[45%] flex-col items-end justify-center gap-1 rounded-lg px-2 py-2 text-right transition-colors hover:bg-text/[0.03] focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
            >
              <span className="text-xs uppercase tracking-[0.12em] text-text/45">
                {c.nextLesson} →
              </span>
              <span className="text-sm font-medium text-text">
                {levelLabel} · {c.lesson} {n(nav.next)}
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
