"use client";

import { useId, useState } from "react";

import type { VocabularyItem } from "@/features/vocabulary/types";
import type { VocabularyCopy } from "@/features/vocabulary/i18n";
import SpeakerButton from "@/components/ui/SpeakerButton";

/**
 * One glossary entry in the reader. Everything a learner needs to read is
 * visible at rest — character, pinyin, Bangla and English meaning. The
 * character breakdown, example and confusable words sit behind one quiet
 * toggle (a real <button aria-expanded aria-controls>).
 */
export default function VocabularyCard({
  item,
  copy,
}: {
  item: VocabularyItem;
  copy: VocabularyCopy;
}) {
  const [open, setOpen] = useState(false);
  const regionId = useId();
  const hasDetail =
    item.characters.length > 0 || item.example != null || item.similar.length > 0;

  return (
    <li className="grid gap-x-6 gap-y-2.5 border-b border-text/10 py-7 sm:grid-cols-[9.5rem_1fr]">
      {/* headword */}
      <div className="sm:pt-1">
        <div className="flex items-start gap-2">
          <p lang="zh" className="font-chinese text-[2.2rem] font-normal leading-none text-text">
            {item.hanzi}
          </p>
          <SpeakerButton text={item.hanzi} className="mt-0.5 size-8" />
        </div>
        <p
          data-pinyin
          lang="zh-Latn-pinyin"
          className="mt-2 text-[15px] tracking-wide text-text/55"
        >
          {item.pinyin}
        </p>
      </div>

      {/* meaning */}
      <div>
        <p className="text-base leading-7 text-text">{item.bangla}</p>
        <p className="mt-0.5 text-sm leading-6 text-text/55">{item.english}</p>

        {hasDetail && (
          <>
            <button
              type="button"
              onClick={() => setOpen((v) => !v)}
              aria-expanded={open}
              aria-controls={regionId}
              className="mt-3 inline-flex items-center gap-2 rounded-md py-1 text-[13px] font-medium text-text/60 transition-colors hover:text-text focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
            >
              <span
                aria-hidden="true"
                className={`inline-block text-[10px] transition-transform ${
                  open ? "rotate-90" : ""
                } motion-reduce:transition-none`}
              >
                ▸
              </span>
              {open ? copy.showLess : copy.showMore}
            </button>

            <div
              id={regionId}
              hidden={!open}
              className="mt-4 space-y-5 border-l-2 border-primary/30 pl-4"
            >
              {item.characters.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text/45">
                    {copy.characters}
                  </h4>
                  <ul className="mt-2 flex flex-wrap gap-2">
                    {item.characters.map((ch, i) => (
                    <li
                      key={i}
                      className="border border-text/12 bg-card/50 px-2.5 py-1.5 text-sm"
                    >
                      <span lang="zh" className="font-chinese font-medium text-text">
                        {ch.hanzi}
                      </span>
                      <span data-pinyin className="ml-1.5 text-text/55">{ch.pinyin}</span>
                      <span className="ml-1 text-text/45">· {ch.meaning}</span>
                      {ch.bangla && (
                        <span className="ml-1 text-text/70">· {ch.bangla}</span>
                      )}
                    </li>
                    ))}
                  </ul>
                </div>
              )}

              {item.example && (
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text/45">
                    {copy.example}
                  </h4>
                  <div className="flex items-start justify-between gap-2">
                    <p
                      lang="zh"
                      className="font-chinese mt-2 text-[1.2rem] leading-relaxed text-text"
                    >
                      {item.example.hanzi}
                    </p>
                    <SpeakerButton
                      text={item.example.hanzi}
                      className="mt-2 size-7 shrink-0"
                    />
                  </div>
                  <p
                    data-pinyin
                    lang="zh-Latn-pinyin"
                    className="mt-0.5 text-sm text-text/55"
                  >
                    {item.example.pinyin}
                  </p>
                  <p className="mt-1.5 text-sm leading-6 text-text/70">
                    {item.example.english}
                  </p>
                  {item.example.bangla && (
                    <p className="mt-0.5 text-sm leading-6 text-text/70">
                      {item.example.bangla}
                    </p>
                  )}
                </div>
              )}

              {item.similar.length > 0 && (
                <div>
                  <h4 className="text-[11px] font-semibold uppercase tracking-[0.14em] text-text/45">
                    {copy.similar}
                  </h4>
                  <ul className="mt-2 flex flex-wrap gap-x-5 gap-y-1.5">
                    {item.similar.map((s, i) => (
                    <li key={i} className="text-sm">
                      <span lang="zh" className="font-chinese text-text">
                        {s.hanzi}
                      </span>
                      <span data-pinyin className="ml-1.5 text-text/55">{s.pinyin}</span>
                      <span className="ml-1 text-text/45">· {s.english}</span>
                      {s.bangla && (
                        <span className="ml-1 text-text/70">· {s.bangla}</span>
                      )}
                    </li>
                    ))}
                  </ul>
                </div>
              )}
            </div>
          </>
        )}
      </div>
    </li>
  );
}