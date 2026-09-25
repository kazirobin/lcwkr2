"use client";

import React, { useEffect, useState } from "react";
import { Eye, EyeOff } from "lucide-react";
import { useLanguage } from "@/i18n";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { speakChinese, stopSpeaking } from "@/lib/chinese-speech";
import type { HwDialogueLine } from "../data/hsk1/lesson1-dialogue";
import SectionShell from "./SectionShell";

interface Props {
  lines: HwDialogueLine[];
  collapsible?: boolean;
}

/**
 * Playable dialogue script — chat bubbles with per-line pronunciation
 * (same SpeakerButton/TTS as the vocabulary pages, works offline),
 * pinyin under every line, hideable meanings for self-testing,
 * plus play-all / stop controls.
 */
export default function DialoguePlayer({ lines, collapsible }: Props) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const [showMeaning, setShowMeaning] = useState(true);

  useEffect(() => () => stopSpeaking(), []);

  const playAll = () => {
    stopSpeaking();
    for (const line of lines) speakChinese(line.hanzi);
  };

  return (
    <SectionShell
      index="💬"
      title={t("ডায়লগ শুনুন ও বলুন", "Listen & say the dialogue")}
      marks={lines.length}
      marksLabel={t("লাইন", "lines")}
      collapsible={collapsible}
    >
      <div className="flex flex-wrap items-center gap-2">
        <button
          type="button"
          onClick={playAll}
          className="px-4 py-2 rounded-xl font-semibold text-sm transition bg-primary text-primary-foreground hover:opacity-90"
        >
          ▶ {t("সবগুলো শুনুন", "Play all")}
        </button>
        <button
          type="button"
          onClick={stopSpeaking}
          className="px-4 py-2 rounded-xl font-semibold text-sm transition border border-border bg-card text-text hover:bg-text/5"
        >
          ⏹ {t("থামান", "Stop")}
        </button>
        <button
          type="button"
          onClick={() => setShowMeaning((v) => !v)}
          aria-pressed={!showMeaning}
          className={`ml-auto inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors ${
            showMeaning
              ? "border-text/15 text-text/55 hover:border-text/40 hover:text-text"
              : "border-primary/50 bg-primary/10 text-primary"
          }`}
        >
          {showMeaning ? (
            <Eye className="size-3.5" aria-hidden="true" />
          ) : (
            <EyeOff className="size-3.5" aria-hidden="true" />
          )}
          {showMeaning ? t("অর্থ লুকান", "Hide meaning") : t("অর্থ দেখান", "Show meaning")}
        </button>
      </div>

      <ol className="space-y-1.5">
        {lines.map((line, i) => {
          const right = line.speaker === "B";
          return (
            <li key={i} className={`flex items-start gap-2.5 ${right ? "flex-row-reverse" : ""}`}>
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                  right ? "bg-primary/15 text-text/70" : "bg-text/10 text-text/65"
                }`}
              >
                {line.speaker}
              </span>
              <div
                className={`max-w-[82%] rounded-2xl border px-4 py-2.5 ${
                  right
                    ? "rounded-tr-sm border-primary/15 bg-primary/[0.07]"
                    : "rounded-tl-sm border-text/10 bg-card/75"
                }`}
              >
                <div className="flex items-start justify-between gap-2">
                  <p lang="zh" className="font-chinese text-2xl sm:text-3xl leading-relaxed text-text">
                    {line.hanzi}
                  </p>
                  <SpeakerButton text={line.hanzi} className="mt-1.5 size-7" />
                </div>
                <p data-pinyin lang="zh-Latn-pinyin" className="mt-0.5 text-[13px] leading-5 text-text/55">
                  {line.pinyin}
                </p>
                {showMeaning && (
                  <p className="mt-1 text-[13px] leading-relaxed text-text/70">
                    {language === "bn" ? line.bn : line.en}
                    <span className="block text-xs text-text/50">
                      {language === "bn" ? line.en : line.bn}
                    </span>
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </SectionShell>
  );
}
