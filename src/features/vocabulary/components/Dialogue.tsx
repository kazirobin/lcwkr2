"use client";

import { useState } from "react";

import { Eye, EyeOff } from "lucide-react";

import { useLanguage } from "@/i18n";
import type { Dialogue as DialogueType } from "@/features/vocabulary/types";
import SpeakerButton from "@/components/ui/SpeakerButton";

/**
 * The short dialogue that opens some texts, shown as the conversation it is:
 * a two-person exchange sits left / right like a chat; three or more speakers
 * (or a scene with a Narrator) fall back to a stacked, avatared transcript.
 * Bubble position carries the speaker — the text inside every bubble stays
 * left-aligned so it reads cleanly.
 */

const NARRATOR = new Set(["Narrator", "旁白", "Narration"]);

/** First code point — works for "Wang Yixue" → W and "服务员" → 服. */
const initialOf = (name: string) => [...name.trim()][0] ?? "·";

export default function Dialogue({
  dialogue,
  speakersLabel,
}: {
  dialogue: DialogueType;
  speakersLabel: string;
}) {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);
  const [showEnglish, setShowEnglish] = useState(true);

  const speakers: string[] = [];
  const firstLineOf = new Map<string, number>();
  dialogue.lines.forEach((line, i) => {
    if (NARRATOR.has(line.speaker)) return;
    if (!speakers.includes(line.speaker)) {
      speakers.push(line.speaker);
      firstLineOf.set(line.speaker, i);
    }
  });
  const duo = speakers.length <= 2;

  return (
    <figure className="mt-3">
      <figcaption className="flex flex-wrap items-center justify-between gap-2">
        <span className="font-serif text-base font-medium text-text">
          {dialogue.title}
        </span>

        {/* self-testing toggle: hide/show the English lines */}
        <button
          type="button"
          onClick={() => setShowEnglish((v) => !v)}
          aria-pressed={!showEnglish}
          title={showEnglish ? t("ইংরেজি লুকান", "Hide English") : t("ইংরেজি দেখান", "Show English")}
          className={`inline-flex shrink-0 items-center gap-1.5 rounded-full border px-2.5 py-1 text-[11px] font-semibold transition-colors focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text ${
            showEnglish
              ? "border-text/15 text-text/55 hover:border-text/40 hover:text-text"
              : "border-primary/50 bg-primary/10 text-primary"
          }`}
        >
          {showEnglish ? (
            <Eye className="size-3.5" aria-hidden="true" />
          ) : (
            <EyeOff className="size-3.5" aria-hidden="true" />
          )}
          {showEnglish ? t("ইংরেজি লুকান", "Hide English") : t("ইংরেজি দেখান", "Show English")}
        </button>
      </figcaption>

      <ol aria-label={speakersLabel} className="mt-4 space-y-1.5">
        {dialogue.lines.map((line, i) => {
          const sameAsPrev = dialogue.lines[i - 1]?.speaker === line.speaker;

          if (NARRATOR.has(line.speaker)) {
            return (
              <li key={i} className="px-4 py-2 text-center">
                {/* Narrator Chinese text with font-chinese and larger size */}
                <p lang="zh" className="font-chinese text-4xl leading-relaxed text-text/60">
                  {line.hanzi}
                </p>
                {(showEnglish || line.bangla) && (
                  <p className="mt-0.5 text-[12px] italic leading-5 text-text/45">
                    {showEnglish && line.english}
                    {showEnglish && line.bangla ? " · " : ""}
                    {line.bangla}
                  </p>
                )}
              </li>
            );
          }

          const side = duo && speakers.indexOf(line.speaker) === 1;
          const isAB = /^[AB]$/.test(line.speaker);
          // Duo mode: name once (position + avatar carry it after). Group
          // mode: name on every turn change.
          const showName =
            !isAB &&
            (duo ? firstLineOf.get(line.speaker) === i : !sameAsPrev);

          return (
            <li
              key={i}
              className={`flex items-start gap-2.5 ${side ? "flex-row-reverse" : ""} ${
                sameAsPrev ? "" : "pt-2"
              }`}
            >
              <span
                aria-hidden="true"
                className={`mt-0.5 flex size-8 shrink-0 items-center justify-center rounded-full text-[13px] font-semibold ${
                  sameAsPrev
                    ? "invisible"
                    : side
                      ? "bg-primary/15 text-text/70"
                      : "bg-text/10 text-text/65"
                }`}
              >
                {initialOf(line.speaker)}
              </span>

              <div
                className={`max-w-[82%] rounded-2xl border px-4 py-2.5 ${
                  side
                    ? "rounded-tr-sm border-primary/15 bg-primary/[0.07]"
                    : "rounded-tl-sm border-text/10 bg-card/75"
                }`}
              >
                <span className="sr-only">{line.speaker}: </span>
                {showName && (
                  <span className="mb-1 block text-[11px] font-medium uppercase tracking-[0.08em] text-text/45">
                    {line.speaker}
                  </span>
                )}
                {/* Dialogue Chinese text with per-line pronunciation button */}
                <div className="flex items-start justify-between gap-2">
                  <p lang="zh" className="font-chinese text-3xl leading-relaxed text-text">
                    {line.hanzi}
                  </p>
                  <SpeakerButton text={line.hanzi} className="mt-1.5 size-7" />
                </div>
                <p
                  data-pinyin
                  lang="zh-Latn-pinyin"
                  className="mt-0.5 text-[13px] leading-5 text-text/55"
                >
                  {line.pinyin}
                </p>
                {(showEnglish || line.bangla) && (
                  <p className="mt-1 text-[13px] leading-relaxed text-text/70">
                    {showEnglish && line.english}
                    {showEnglish && line.bangla ? " · " : ""}
                    {line.bangla}
                  </p>
                )}
              </div>
            </li>
          );
        })}
      </ol>
    </figure>
  );
}