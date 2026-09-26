// src/features/vocabulary/components/PinyinPage.tsx
//
// Interactive pinyin reference: initials (b…s) and finals (a…ong), each
// syllable shown as a card with its hanzi and gloss. Clicking / pressing a
// card reads it aloud through the browser's SpeechSynthesis API. A
// "Practice" toggle hides the hanzi so the learner can recall, then tap to
// reveal and hear the answer. Fully responsive.

"use client";

import { useCallback, useState } from "react";
import { Volume2, Sparkles } from "lucide-react";

import { useLanguage } from "@/i18n";
import {
  groupByInitial,
  groupByFinal,
  speechPinyin,
  INITIALS,
  FINALS_ORDER,
  type Syllable,
} from "../pinyin-data";

/** Where the tone mark sits in each final (a>o>e>i>u>ü, with iu/uei on the last vowel). */
const TONE_VOWEL: Record<string, number> = {
  a: 0, o: 0, e: 0,
  ai: 0, ei: 0, ui: 0, ao: 0, ou: 0, iu: 1, ie: 1, ue: 0, er: 0,
  an: 0, en: 0, in: 0, un: 0, ang: 0, eng: 0, ing: 0, ong: 0,
  ian: 1, uang: 1, iang: 1, iong: 1, uai: 1,
};

/** Place the tone diacritic on the correct vowel of the nucleus. */
function toneMark(final: string, pinyin: string): string {
  const body = pinyin.replace(/\d$/, "");
  const tone = Number(pinyin.slice(-1));
  if (!body || isNaN(tone) || tone === 5) return body;
  const diac: Record<number, string> = {
    1: "\u0304",
    2: "\u0301",
    3: "\u0300",
    4: "\u0302",
  };
  const di = diac[tone];
  if (!di) return body;
  const pos = TONE_VOWEL[final] ?? 0;
  const chars = [...body];
  let count = 0;
  for (let i = 0; i < chars.length; i++) {
    if (/[aeoiuü]/i.test(chars[i])) {
      if (count === pos) {
        chars[i] = chars[i] + di;
        break;
      }
      count++;
    }
  }
  return chars.join("");
}

/** A single syllable chip. */
function SyllableChip({
  syllable,
  practice,
  onSpeak,
}: {
  syllable: Syllable;
  practice: boolean;
  onSpeak: (s: Syllable) => void;
}) {
  const [revealed, setRevealed] = useState(false);

  return (
    <button
      type="button"
      onClick={() => {
        onSpeak(syllable);
        if (practice) setRevealed((v) => !v);
      }}
      className={`group relative flex min-w-[108px] flex-col items-center gap-1 rounded-xl border px-3 py-2.5 text-left transition-all hover:-translate-y-0.5 hover:shadow-md ${
        practice
          ? revealed
            ? "border-primary/50 bg-primary/10 shadow-sm"
            : "border-text/15 bg-background/80 hover:border-primary/40"
          : "border-text/12 bg-background/80 hover:border-secondary/50 hover:bg-secondary/7 hover:shadow-sm"
      }`}
      aria-label={`${syllable.pinyin} ${syllable.hanzi}`}
    >
      <span className="font-mono text-[15px] font-bold tracking-wide text-text">
        {toneMark(syllable.final, syllable.pinyin)}
      </span>
      {practice ? (
        <>
          {revealed ? (
            <>
              <span lang="zh" className="text-2xl font-chinese leading-none">
                {syllable.hanzi}
              </span>
              <span className="text-[11px] text-text/55">{syllable.meaning}</span>
            </>
          ) : (
            <span className="inline-flex size-7 items-center justify-center rounded-full bg-text/5 text-text/40">
              <Volume2 className="size-3" />
            </span>
          )}
        </>
      ) : (
        <>
          <span lang="zh" className="text-xl font-chinese leading-none">
            {syllable.hanzi}
          </span>
          <span className="text-[11px] text-text/55">{syllable.meaning}</span>
        </>
      )}
      <span className="sr-only">{speechPinyin(syllable.pinyin)}</span>
    </button>
  );
}

/** A letter group: header + chips row. */
function LetterGroup({
  label,
  syllables,
  practice,
  onSpeak,
}: {
  label: string;
  syllables: Syllable[];
  practice: boolean;
  onSpeak: (s: Syllable) => void;
}) {
  if (syllables.length === 0) return null;
  return (
    <div className="rounded-xl border border-text/10 bg-background/60 p-3">
      <div className="mb-2 flex items-center justify-between gap-2">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-secondary/15 font-mono text-lg font-bold text-secondary">
          {label}
        </span>
        <span className="text-[11px] text-text/45">{syllables.length} syllable{syllables.length !== 1 && "s"}</span>
      </div>
      <div className="flex flex-wrap gap-2">
        {syllables.map((s) => (
          <SyllableChip key={s.pinyin} syllable={s} practice={practice} onSpeak={onSpeak} />
        ))}
      </div>
    </div>
  );
}

/** Section title with a subtle divider. */
function Section({
  eyebrow,
  children,
}: {
  eyebrow: string;
  children: React.ReactNode;
}) {
  return (
    <section>
      <h2 className="mt-8 mb-4 text-xl font-serif font-semibold tracking-tight text-text">
        {eyebrow}
      </h2>
      <div className="space-y-3">{children}</div>
    </section>
  );
}

export default function PinyinPage() {
  const { language } = useLanguage();
  const c = {
    en: {
      eyebrow: "Pinyin master",
      title: "Pinyin fundamentals",
      intro:
        "The building blocks of every Chinese syllable. Click a card to hear it; in Practice mode the hanzi stays hidden until you tap again.",
      initials: "Initials (chūshēng)",
      finals: "Finals (yùnmǔ)",
      practice: "Practice",
      reading: "Reading",
      allDone: "All syllables revealed",
    },
    bn: {
      eyebrow: "পিনয়িন মাস্টার",
      title: "পিনয়িন ভিত্তি",
      intro:
        "প্রতিটি চীনা ধ্বনির অংশ। কার্ডে ক্লিক করে শুনুন; অনুশীলন মোডে হানজি লুকিয়ে রাখা হয় আবার ট্যাপ না হওয়া পর্যন্ত।",
      initials: "চূহ্বর (Initials)",
      finals: "ব্যঞ্জন-স্বর (Finals)",
      practice: "অনুশীলন",
      reading: "পড়া",
      allDone: "সব ধ্বনি প্রকাশ পেয়েছে",
    },
  }[language];

  const initials = groupByInitial();
  const finals = groupByFinal();
  const [practice, setPractice] = useState(false);
  const [played, setPlayed] = useState(0);

  const speak = useCallback(
    (s: Syllable) => {
      if (typeof window === "undefined") return;
      try {
        const u = new SpeechSynthesisUtterance(speechPinyin(s.pinyin));
        u.lang = "zh-CN";
        u.rate = 0.85;
        u.pitch = 1;
        window.speechSynthesis.speak(u);
      } catch {
        /* speech unsupported */
      }
      setPlayed((n) => n + 1);
    },
    [],
  );

  const reset = () => setPlayed(0);

  return (
    <div className="min-h-screen bg-[#f7f2e8] font-en text-text dark:bg-[#17130f]">
      <div className="mx-auto max-w-4xl px-5 pt-28 pb-16 sm:px-6 md:pt-32">
        {/* header */}
        <div className="flex items-center gap-2.5">
          <span
            lang="zh"
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-md bg-secondary text-[13px] font-bold text-white"
          >
            拼
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text/55">
            {c.eyebrow}
          </span>
        </div>

        <h1 className="mt-5 font-serif text-[2.4rem] font-medium leading-[1.1] tracking-[-0.01em] text-balance sm:text-3xl">
          {c.title}
        </h1>
        <p className="mt-4 max-w-[54ch] text-[15px] leading-7 text-text/70">
          {c.intro}
        </p>

        {/* practice toggle */}
        <div className="mt-6 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setPractice((v) => !v);
              setPlayed(0);
            }}
            className={`inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition-colors ${
              practice
                ? "bg-primary/15 text-primary border border-primary/40"
                : "bg-text/5 text-text/60 border border-text/15 hover:border-primary/40"
            }`}
            aria-pressed={practice}
          >
            <Sparkles className="size-4" />
            {practice ? c.reading : c.practice}
          </button>
          <span className="text-xs text-text/45">{played} syllables played</span>
          {played > 0 && (
            <button
              type="button"
              onClick={reset}
              className="text-xs underline decoration-text/20 underline-offset-4 text-text/45 hover:text-text"
            >
              Reset
            </button>
          )}
        </div>

        {/* initials */}
        <Section eyebrow={c.initials}>
          <div className="space-y-3">
            {INITIALS.map((init) => {
              const items = initials.get(init) ?? [];
              if (items.length === 0) return null;
              return (
                <LetterGroup
                  key={init}
                  label={init}
                  syllables={items}
                  practice={practice}
                  onSpeak={speak}
                />
              );
            })}
          </div>
        </Section>

        {/* finals */}
        <Section eyebrow={c.finals}>
          <div className="space-y-3">
            {FINALS_ORDER.map((fin) => {
              const items = finals.get(fin) ?? [];
              if (items.length === 0) return null;
              return (
                <LetterGroup
                  key={fin}
                  label={fin}
                  syllables={items}
                  practice={practice}
                  onSpeak={speak}
                />
              );
            })}
          </div>
        </Section>
      </div>
    </div>
  );
}
