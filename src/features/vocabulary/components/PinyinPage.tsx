// src/features/vocabulary/components/PinyinPage.tsx
//
// Interactive pinyin reference: the 21 initials and the main finals, each
// syllable shown as a card with its tone-marked pinyin, hanzi, and English and
// Bangla glosses.
//
// Tapping a card speaks it. The audio goes through the shared Chinese speech
// helper and always reads the hanzi, because a zh-CN engine reads 女 or 卷
// correctly but silently mis-handles the letters "nü" or "juan".
//
// A "Practice" toggle hides the hanzi and glosses so the learner can recall
// them and tap to reveal. Everything is client-rendered but also prerenders
// fully, so the reference is readable without JavaScript.

"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import {
  BookOpen,
  Check,
  Ear,
  Info,
  RotateCcw,
  Search,
  Sparkles,
  TriangleAlert,
  Volume2,
} from "lucide-react";

import { useLanguage } from "@/i18n";
import {
  chineseVoice,
  speechSupported,
  speakChineseAsync,
  stopSpeaking,
} from "@/lib/chinese-speech";
import {
  FINALS_ORDER,
  INITIALS,
  groupByFinal,
  groupByInitial,
  plainPinyin,
  syllableKey,
  toneMark,
  type Syllable,
} from "../pinyin-data";

type Tab = "initials" | "finals";

const COPY = {
  en: {
    eyebrow: "Pinyin master",
    title: "Pinyin fundamentals",
    intro:
      "Every Chinese syllable is an initial plus a final. Browse them by sound, tap any card to hear it, or switch on Practice to hide the answers and test yourself.",
    initials: "Initials",
    initialsHint: "The consonant a syllable starts with.",
    finals: "Finals",
    finalsHint: "The part that carries the vowel and the tone.",
    practice: "Practice mode",
    reading: "Reading mode",
    search: "Search pinyin, hanzi or meaning",
    noResults: "Nothing matches that search.",
    clear: "Clear search",
    played: "syllables heard",
    reset: "Reset",
    reveal: "Reveal",
    tones: "The four tones",
    toneHint: "Tone marks sit on the vowel that carries them.",
    tone1: "high and level",
    tone2: "rising",
    tone3: "low and dipping",
    tone4: "sharp and falling",
    tone5: "neutral",
    voiceOk: "Tap any card to hear it.",
    voiceMissing:
      "No Chinese voice is installed, so the browser cannot speak. On Windows: Settings → Time & language → Language → add Chinese (Mandarin) and install its speech pack.",
    voiceNone: "This browser has no speech support, so audio is unavailable.",
    syllables: "syllables",
  },
  bn: {
    eyebrow: "পিনয়িন মাস্টার",
    title: "পিনয়িন ভিত্তি",
    intro:
      "প্রতিটি চীনা ধ্বনি = চূহ্বর + স্বর। শব্দ অনুযায়ী দেখুন, যেকোনো কার্ডে ট্যাপ করে শুনুন, অথবা অনুশীলন মোডে উত্তর লুকিয়ে নিজে যাচাই করুন।",
    initials: "চূহ্বর (Initials)",
    initialsHint: "ধ্বনি যেই ব্যঞ্জন দিয়ে শুরু হয়।",
    finals: "স্বরাংশ (Finals)",
    finalsHint: "যে অংশে স্বর ও সুর থাকে।",
    practice: "অনুশীলন মোড",
    reading: "পড়ার মোড",
    search: "পিনয়িন, হানজি বা অর্থ লিখুন",
    noResults: "এই সার্চে কিছু মেলেনি।",
    clear: "সার্চ মুছুন",
    played: "ধ্বনি শোনা হয়েছে",
    reset: "রিসেট",
    reveal: "উত্তর দেখান",
    tones: "চারটি সুর",
    toneHint: "সুর-চিহ্ন বসে সেই স্বরের উপর যেটি সুরটি ধারণ করে।",
    tone1: "উচ্চ ও সমতল",
    tone2: "ওর্ণামান",
    tone3: "নিচু ও ডোবা",
    tone4: "তীক্ষ্ণ ও নামমাত্র",
    tone5: "উচ্চারণহীন",
    voiceOk: "শুনতে যেকোনো কার্ডে ট্যাপ করুন।",
    voiceMissing:
      "এই ডিভাইসে চীনা ভয়েস ইনস্টল করা নেই, তাই ব্রাউজার উচ্চারণ করতে পারছে না। Windows: Settings → Time & language → Language → Chinese (Mandarin) যোগ করে তার speech pack ইনস্টল করুন।",
    voiceNone: "এই ব্রাউজারে স্পিচ সাপোর্ট নেই, তাই অডিও পাওয়া যাবে না।",
    syllables: "ধ্বনি",
  },
} as const;

const TONE_LEGEND: { tone: number; mark: string; label: keyof typeof COPY.en }[] = [
  { tone: 1, mark: "ā", label: "tone1" },
  { tone: 2, mark: "á", label: "tone2" },
  { tone: 3, mark: "ǎ", label: "tone3" },
  { tone: 4, mark: "à", label: "tone4" },
  { tone: 5, mark: "a", label: "tone5" },
];

function SyllableCard({
  syllable,
  practice,
  speaking,
  onSpeak,
}: {
  syllable: Syllable;
  practice: boolean;
  speaking: boolean;
  onSpeak: (s: Syllable) => void;
}) {
  const [revealed, setRevealed] = useState(false);
  const mark = toneMark(syllable);
  const plain = plainPinyin(syllable);

  return (
    <button
      type="button"
      onClick={() => {
        onSpeak(syllable);
        if (practice) setRevealed((v) => !v);
      }}
      aria-label={`${mark} ${syllable.hanzi} — ${syllable.meaning}`}
      className={`group relative flex min-w-[7.5rem] flex-1 flex-col items-center gap-1.5 rounded-xl border px-3 py-3 text-center transition-all hover:-translate-y-0.5 hover:shadow-md focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-secondary ${
        practice && !revealed
          ? "border-text/20 bg-card hover:border-primary/50"
          : practice
            ? "border-primary/45 bg-primary/10"
            : "border-text/12 bg-card hover:border-secondary/50 hover:bg-secondary/7"
      }`}
    >
      <span className="flex items-center gap-1.5">
        <span className="font-mono text-[15px] font-bold tracking-wide text-text">
          {mark}
        </span>
        {speaking && (
          <Volume2 className="size-3.5 shrink-0 text-secondary" aria-hidden="true" />
        )}
      </span>

      {practice && !revealed ? (
        <span className="flex size-8 items-center justify-center rounded-full bg-text/5 text-text/55">
          <Ear className="size-4" aria-hidden="true" />
        </span>
      ) : (
        <>
          <span lang="zh" className="text-2xl font-chinese leading-none text-text">
            {syllable.hanzi}
          </span>
          <span className="text-[11px] leading-snug text-text/60">{syllable.meaning}</span>
          <span className="font-bn text-[11px] leading-snug text-text/60">
            {syllable.meaningBn}
          </span>
        </>
      )}

      <span className="sr-only">
        {plain} {syllable.meaningBn}
      </span>
    </button>
  );
}

function LetterGroup({
  label,
  items,
  practice,
  speakingKey,
  onSpeak,
  countLabel,
}: {
  label: string;
  items: Syllable[];
  practice: boolean;
  speakingKey: string | null;
  onSpeak: (s: Syllable) => void;
  countLabel: string;
}) {
  if (items.length === 0) return null;
  return (
    <div className="rounded-xl border border-text/10 bg-background/60 p-3">
      <div className="mb-2.5 flex items-center justify-between gap-2">
        <span className="inline-flex size-8 items-center justify-center rounded-lg bg-secondary/15 font-mono text-lg font-bold text-secondary">
          {label}
        </span>
        <span className="text-[11px] text-text/60">
          {items.length} {countLabel}
        </span>
      </div>
      <div className="flex flex-wrap gap-2">
        {items.map((s) => (
          <SyllableCard
            key={syllableKey(s)}
            syllable={s}
            practice={practice}
            speaking={speakingKey === syllableKey(s)}
            onSpeak={onSpeak}
          />
        ))}
      </div>
    </div>
  );
}

export default function PinyinPage() {
  const { language } = useLanguage();
  const c = COPY[language];

  const [tab, setTab] = useState<Tab>("initials");
  const [practice, setPractice] = useState(false);
  const [query, setQuery] = useState("");
  const [heard, setHeard] = useState(0);
  const [speakingKey, setSpeakingKey] = useState<string | null>(null);
  const [voiceState, setVoiceState] = useState<"unknown" | "ready" | "missing" | "none">(
    "unknown",
  );

  const byInitial = useMemo(() => groupByInitial(), []);
  const byFinal = useMemo(() => groupByFinal(), []);

  // Work out whether this device can actually speak Chinese, so the page can
  // say so up front instead of looking broken on the first tap. chineseVoice()
  // resolves straight away when the browser has no speech at all, so the
  // "unsupported" case still settles immediately.
  useEffect(() => {
    let alive = true;
    void chineseVoice().then((voice) => {
      if (!alive) return;
      if (!speechSupported()) setVoiceState("none");
      else setVoiceState(voice ? "ready" : "missing");
    });
    return () => {
      alive = false;
    };
  }, []);

  // Stop any audio when the page goes away.
  useEffect(() => stopSpeaking, []);

  const groups =
    tab === "initials"
      ? INITIALS.map((key) => [key, byInitial.get(key) ?? []] as const)
      : FINALS_ORDER.map((key) => [key, byFinal.get(key) ?? []] as const);

  const needle = query.trim().toLowerCase();

  const filtered = useMemo(() => {
    if (!needle) return groups;
    return groups
      .map(([key, items]) => {
        const hits = items.filter(
          (s) =>
            plainPinyin(s).includes(needle) ||
            s.pinyin.includes(needle) ||
            s.hanzi.includes(needle) ||
            s.meaning.toLowerCase().includes(needle) ||
            s.meaningBn.includes(needle) ||
            key.toLowerCase().includes(needle),
        );
        return [key, hits] as const;
      })
      .filter(([, items]) => items.length > 0);
  }, [groups, needle]);

  const total = filtered.reduce((sum, [, items]) => sum + items.length, 0);

  const speak = useCallback((s: Syllable) => {
    // Read the hanzi: a Chinese engine pronounces the character reliably,
    // whereas the pinyin spelling is often skipped or read letter by letter.
    void speakChineseAsync(s.hanzi).then((ok) => {
      if (!ok) setVoiceState("missing");
    });
    setSpeakingKey(syllableKey(s));
    setHeard((n) => n + 1);
    const clear = setTimeout(() => {
      setSpeakingKey((current) => (current === syllableKey(s) ? null : current));
    }, 1200);
    return () => clearTimeout(clear);
  }, []);

  return (
    // `bg-paper` and `bg-card` are theme tokens, so the page follows the site's
    // own light and dark palettes instead of a fixed cream that only ever
    // looked right in one of them.
    <div className="min-h-screen bg-paper text-text">
      <div className="mx-auto max-w-5xl px-5 pt-28 pb-16 sm:px-6 md:pt-32">
        {/* header */}
        <div className="flex items-center gap-2.5">
          <span
            lang="zh"
            aria-hidden="true"
            className="flex size-7 items-center justify-center rounded-md bg-secondary text-[13px] font-bold text-white"
          >
            拼
          </span>
          <span className="text-xs font-semibold uppercase tracking-[0.16em] text-text/65">
            {c.eyebrow}
          </span>
        </div>

        <h1 className="mt-5 font-serif text-[2.4rem] font-medium leading-[1.1] tracking-[-0.01em] text-balance">
          {c.title}
        </h1>
        <p className="mt-4 max-w-[60ch] text-[15px] leading-7 text-text/70">{c.intro}</p>

        {/* audio status */}
        {voiceState === "none" && (
          <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-warn/35 bg-warn-surface px-4 py-3 text-sm text-text/80">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {c.voiceNone}
          </p>
        )}
        {voiceState === "missing" && (
          <p className="mt-5 flex items-start gap-2.5 rounded-xl border border-warn/35 bg-warn-surface px-4 py-3 text-sm text-text/80">
            <TriangleAlert className="mt-0.5 size-4 shrink-0" aria-hidden="true" />
            {c.voiceMissing}
          </p>
        )}

        {/* search */}
        <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-text/15 bg-card px-3.5 py-2.5 shadow-sm transition-colors focus-within:border-secondary/60">
          <Search className="size-4 shrink-0 text-text/55" aria-hidden="true" />
          <input
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={c.search}
            aria-label={c.search}
            className="w-full bg-transparent text-sm text-text outline-none placeholder:text-text/55"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={c.clear}
              className="shrink-0 text-xs font-semibold text-text/60 hover:text-text"
            >
              {c.clear}
            </button>
          )}
        </div>

        {/* tabs */}
        <div className="mt-4 flex flex-wrap gap-2">
          {(
            [
              ["initials", c.initials, c.initialsHint, BookOpen],
              ["finals", c.finals, c.finalsHint, Sparkles],
            ] as const
          ).map(([value, label, hint, Icon]) => (
            <button
              key={value}
              type="button"
              onClick={() => setTab(value)}
              aria-pressed={tab === value}
              className={`inline-flex flex-1 items-center justify-center gap-2 rounded-xl px-4 py-2.5 text-sm font-semibold transition-colors sm:flex-none ${
                tab === value
                  ? "bg-secondary text-white"
                  : "border border-text/12 bg-card text-text/65 hover:border-secondary/50 hover:text-text"
              }`}
            >
              <Icon className="size-4" aria-hidden="true" />
              <span>{label}</span>
              <span className="hidden text-[11px] font-normal opacity-70 sm:inline">{hint}</span>
            </button>
          ))}
        </div>

        {/* controls */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <button
            type="button"
            onClick={() => {
              setPractice((v) => !v);
              setHeard(0);
            }}
            className={`inline-flex items-center gap-2 rounded-full border px-4 py-2 text-sm font-semibold transition-colors ${
              practice
                ? "border-primary/40 bg-primary/15 text-primary"
                : "border-text/15 bg-card text-text/65 hover:border-primary/50"
            }`}
            aria-pressed={practice}
          >
            <Sparkles className="size-4" aria-hidden="true" />
            {practice ? c.practice : c.reading}
          </button>
          <span className="inline-flex items-center gap-1.5 text-xs text-text/60">
            {heard > 0 && <Check className="size-3.5" aria-hidden="true" />}
            {heard} {c.played}
          </span>
          {heard > 0 && (
            <button
              type="button"
              onClick={() => {
                setHeard(0);
                stopSpeaking();
                setSpeakingKey(null);
              }}
              className="inline-flex items-center gap-1.5 text-xs text-text/60 underline decoration-text/20 underline-offset-4 hover:text-text"
            >
              <RotateCcw className="size-3" aria-hidden="true" />
              {c.reset}
            </button>
          )}
          {voiceState === "ready" && (
            <span className="inline-flex items-center gap-1.5 text-xs text-text/60">
              <Volume2 className="size-3.5" aria-hidden="true" />
              {c.voiceOk}
            </span>
          )}
        </div>

        {/* tone legend */}
        <div className="mt-6 rounded-xl border border-text/12 bg-card p-3.5">
          <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.14em] text-text/65">
            <Info className="size-3.5" aria-hidden="true" />
            {c.tones}
          </p>
          <div className="mt-2.5 flex flex-wrap gap-x-5 gap-y-2">
            {TONE_LEGEND.map(({ tone, mark, label }) => (
              <span key={tone} className="flex items-baseline gap-1.5 text-xs text-text/65">
                <span className="font-mono text-base font-bold text-text">{mark}</span>
                <span className="font-mono text-[10px] text-text/55">{tone}</span>
                <span>{c[label]}</span>
              </span>
            ))}
          </div>
          <p className="mt-2 text-[11px] text-text/60">{c.toneHint}</p>
        </div>

        {/* groups */}
        {total === 0 ? (
          <p className="mt-10 rounded-xl border border-dashed border-text/20 px-4 py-10 text-center text-sm text-text/65">
            {c.noResults}
          </p>
        ) : (
          <>
            <section className="mt-8">
              <h2 className="mb-1 font-serif text-xl font-semibold tracking-tight">
                {tab === "initials" ? c.initials : c.finals}
              </h2>
              <p className="mb-4 text-xs text-text/60">
                {tab === "initials" ? c.initialsHint : c.finalsHint}
              </p>
              <div className="space-y-3">
                {filtered.map(([key, items]) => (
                  <LetterGroup
                    key={key}
                    label={key || "—"}
                    items={items}
                    practice={practice}
                    speakingKey={speakingKey}
                    onSpeak={speak}
                    countLabel={c.syllables}
                  />
                ))}
              </div>
            </section>
            <p className="mt-6 text-center text-xs text-text/55">
              {total} {c.syllables}
            </p>
          </>
        )}
      </div>
    </div>
  );
}
