"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Lock } from "lucide-react";

import { useLanguage } from "@/i18n";
import type { LevelSummary } from "@/features/vocabulary/types";
import { vocabularyCopy, localizeNumber } from "@/features/vocabulary/i18n";
import { PaperPage, PaperHeader } from "./workbook";
import ProAccessButton, { type ProAccessHandle } from "@/features/chinese-words/components/ProAccessButton";

const PRO_KEY = "cw:pro";
const FREE_LEVELS = [1];

/** `/hsk` — the whole track. Levels 4–6 show as "coming". */
export default function LevelPicker({ levels }: { levels: LevelSummary[] }) {
  const { language } = useLanguage();
  const c = vocabularyCopy[language];
  const isBn = language === "bn";
  const n = (x: number) => localizeNumber(x, language);

  const [isPro, setIsPro] = useState(false);
  const [ready, setReady] = useState(false);
  const proRef = useRef<ProAccessHandle>(null);

  useEffect(() => {
    try {
      setIsPro(localStorage.getItem(PRO_KEY) === "1");
    } catch {
      /* storage unavailable */
    }
    setReady(true);
  }, []);

  const refreshPro = () => {
    try {
      setIsPro(localStorage.getItem(PRO_KEY) === "1");
    } catch {
      /* ignore */
    }
  };

  return (
    <PaperPage isBn={isBn}>
      <PaperHeader
        seal="汉"
        eyebrow={c.section}
        title={c.indexTitle}
        accent={c.indexTitleAccent}
        intro={c.indexLede}
      />

      <div className="mx-auto max-w-3xl px-5 pt-10 pb-24 sm:px-6 md:pt-14">
        <ol className="border-t border-text/12">
          {levels.map((level, i) => {
            const label = `HSK ${n(level.level)}`;
            const scope = `${n(level.lessons)} ${c.levelLessons} · ${n(
              level.texts,
            )} ${c.levelTexts} · ${n(level.words)} ${c.levelWord}`;

            if (!level.available) {
              const firstComing = levels.findIndex((l) => !l.available) === i;
              return (
                <li
                  key={level.level}
                  className="flex flex-wrap items-baseline gap-x-4 gap-y-1 border-b border-text/10 py-7"
                >
                  <span className="font-serif text-[1.6rem] font-medium text-text/35">
                    {label}
                  </span>
                  {firstComing && (
                    <span className="text-[13px] text-text/40">{c.soonNote}</span>
                  )}
                  <span className="ml-auto text-[13px] font-medium text-text/40">
                    {c.soon}
                  </span>
                </li>
              );
            }

            return (
              <li key={level.level}>
                <Link
                  href={`/hsk/${level.level}`}
                  aria-label={`${label} — ${c.start}`}
                  className="group flex flex-col gap-1.5 border-b border-text/10 py-8 transition-colors hover:bg-text/[0.025] focus-visible:bg-text/[0.04] focus-visible:outline focus-visible:outline-2 focus-visible:-outline-offset-2 focus-visible:outline-text sm:flex-row sm:items-baseline sm:gap-x-5"
                >
                  <span className="font-serif text-[2rem] font-medium leading-none text-text transition-colors group-hover:text-secondary">
                    {label}
                  </span>
                  <span className="text-sm text-text/60">{scope}</span>
                  {ready && !isPro && !FREE_LEVELS.includes(level.level) && (
                    <span className="inline-flex items-center gap-1 self-start rounded-full border border-secondary/30 bg-secondary/10 px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-[0.12em] text-secondary sm:self-center">
                      <Lock className="size-3" aria-hidden="true" />
                      Pro
                    </span>
                  )}
                  <span className="mt-1 self-start text-[13px] font-medium text-text/55 transition-colors group-hover:text-text sm:ml-auto sm:mt-0 sm:self-center">
                    {i === 0 ? c.start : c.open}
                    <span
                      aria-hidden="true"
                      className="ml-1.5 inline-block transition-transform group-hover:translate-x-0.5 motion-reduce:transition-none"
                    >
                      →
                    </span>
                  </span>
                </Link>
              </li>
            );
          })}
        </ol>
      </div>

      <ProAccessButton ref={proRef} onUnlock={refreshPro} />
    </PaperPage>
  );
}
