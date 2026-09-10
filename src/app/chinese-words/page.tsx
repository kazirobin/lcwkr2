"use client";

import React, { useEffect, useMemo, useState } from "react";
import { useLanguage } from "@/i18n";
import {
  CHINESE_WORDS,
  LESSON_LEVELS,
  WORD_LEVELS,
  buildKnownWordSet,
  findWordEntry,
  getLessonWords,
  makeSearchCorpus,
  searchTokens,
  searchWords,
  stripTones,
} from "@/features/chinese-words";
import { PracticeGame } from "@/features/chinese-words";
import ProGate from "@/features/chinese-words/components/ProGate";
import type { LessonWord } from "@/features/chinese-words";

const READ_KEY = "cw:read";

function loadReadSet(): Set<string> {
  if (typeof window === "undefined") return new Set();
  try {
    return new Set(JSON.parse(localStorage.getItem(READ_KEY) ?? "[]") as string[]);
  } catch {
    return new Set();
  }
}

export default function ChineseWordBuilderPage() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const [view, setView] = useState<"root" | "words" | "game">("root");

  // ── shared ──────────────────────────────────────────────────────────
  const knownWords = useMemo(() => buildKnownWordSet(), []);

  // read/unread marks — persisted in localStorage
  const [readSet, setReadSet] = useState<Set<string>>(new Set());
  useEffect(() => {
    queueMicrotask(() => setReadSet(loadReadSet()));
  }, []);
  const toggleRead = (hanzi: string) => {
    setReadSet((prev) => {
      const next = new Set(prev);
      if (next.has(hanzi)) next.delete(hanzi);
      else next.add(hanzi);
      try {
        localStorage.setItem(READ_KEY, JSON.stringify([...next]));
      } catch {
        /* storage full — ignore */
      }
      return next;
    });
  };

  // go-to-top visibility
  const [showTop, setShowTop] = useState(false);
  useEffect(() => {
    const onScroll = () => setShowTop(window.scrollY > 400);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  // ── root network view state ─────────────────────────────────────────
  const [search, setSearch] = useState("");
  const [selectedHsk, setSelectedHsk] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  // ── words view state ────────────────────────────────────────────────
  const [level, setLevel] = useState(LESSON_LEVELS[0] ?? 1);
  const [lesson, setLesson] = useState<number | null>(1);
  const [wordSearch, setWordSearch] = useState("");
  const [onlyMissing, setOnlyMissing] = useState(false);

  const lessonMap = useMemo(() => getLessonWords(level), [level]);
  const lessons = useMemo(
    () => [...lessonMap.keys()].sort((a, b) => a - b),
    [lessonMap],
  );
  const activeLesson = lesson != null && lessons.includes(lesson) ? lesson : lessons[0] ?? null;
  const lessonWordList: LessonWord[] = useMemo(
    () => (activeLesson != null ? lessonMap.get(activeLesson) ?? [] : []),
    [lessonMap, activeLesson],
  );

  const lessonStats = useMemo(() => {
    const found = lessonWordList.filter((w) => knownWords.has(w.hanzi)).length;
    const marked = lessonWordList.filter((w) => readSet.has(w.hanzi)).length;
    return { found, total: lessonWordList.length, marked };
  }, [lessonWordList, knownWords, readSet]);

  const filteredLessonWords = useMemo(() => {
    const tokens = searchTokens(wordSearch);
    return lessonWordList.filter((w) => {
      const inDataset = knownWords.has(w.hanzi);
      if (onlyMissing && inDataset) return false;
      if (tokens.length === 0) return true;
      const corpus = makeSearchCorpus([
        w.hanzi,
        w.pinyin,
        stripTones(w.pinyin),
        stripTones(w.pinyin).replace(/\s+/g, ""),
        w.en,
        w.bn,
      ]);
      return tokens.every((tok) => corpus.includes(tok));
    });
  }, [lessonWordList, knownWords, onlyMissing, wordSearch]);

  // ── root view filtering (local data, no fetch) ──────────────────────
  const filteredWords = useMemo(
    () => searchWords(search, selectedHsk === "All" ? "All" : Number(selectedHsk)),
    [search, selectedHsk],
  );

  const markedCount = useMemo(
    () => filteredWords.filter((w) => readSet.has(w.character)).length,
    [filteredWords, readSet],
  );

  return (
    <ProGate>
      <div
        className={`min-h-screen bg-background text-text py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
          language === "bn" ? "font-bn" : "font-en"
        }`}
      >
      <div className="max-w-5xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-block px-3 py-1 bg-secondary text-background text-xs font-mono rounded font-bold uppercase tracking-wider">
            {t("রুট ওয়ার্ড নেটওয়ার্ক", "Root Word Network")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("চাইনিজ কোর ওয়ার্ড বিল্ডার", "Chinese Core Word Builder")}
          </h1>
          <p className="text-text/75 text-sm sm:text-base max-w-xl mx-auto">
            {t(
              "একটি মূল ক্যারেক্টার শিখুন এবং তা দিয়ে তৈরি হওয়া অন্যান্য শব্দগুলো সহজে মনে রাখুন।",
              "Learn one core character and discover how multiple words are formed from it."
            )}
          </p>
          {/* Total marked progress */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full border border-ok/30 bg-ok/10 text-ok text-xs font-mono">
            ✓ {readSet.size} / {CHINESE_WORDS.length} {t("টি শব্দ পড়া হয়েছে", "words marked as read")}
          </div>
        </div>

        {/* View Toggle */}
        <div className="flex justify-center">
          <div className="inline-flex rounded-xl border border-text/15 bg-background/60 p-1">
            <button
              onClick={() => setView("root")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                view === "root"
                  ? "bg-secondary text-background font-bold shadow-sm"
                  : "text-text/70 hover:bg-text/5"
              }`}
            >
              {t("রুট নেটওয়ার্ক", "Root Network")}
            </button>
            <button
              onClick={() => setView("words")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                view === "words"
                  ? "bg-secondary text-background font-bold shadow-sm"
                  : "text-text/70 hover:bg-text/5"
              }`}
            >
              {t("শব্দ তালিকা", "Words")}
            </button>
            <button
              onClick={() => setView("game")}
              className={`px-4 py-2 rounded-lg text-sm font-medium transition ${
                view === "game"
                  ? "bg-secondary text-background font-bold shadow-sm"
                  : "text-text/70 hover:bg-text/5"
              }`}
            >
              🎮 {t("অভ্যাস গেম", "Practice")}
            </button>
          </div>
        </div>

        {view === "game" ? (
          <PracticeGame />
        ) : view === "root" ? (
          <>
            {/* Search & HSK Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <input
                type="text"
                placeholder={t(
                  "যেভাবে খুঁজুন: 学 / xue / ni hao / শেখা / student",
                  "Search any way: 学 / xue / ni hao / study"
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:max-w-md px-4 py-2.5 rounded-xl border border-text/20 bg-background/60 text-text placeholder-text/40 focus:outline-none focus:border-secondary transition text-sm"
              />

              <div className="flex items-center gap-3">
                {search.trim() && (
                  <span className="text-[11px] font-mono text-text/60 whitespace-nowrap">
                    {filteredWords.length} {t("টি পাওয়া গেছে", "found")} · {markedCount}{" "}
                    {t("মার্ক করা", "read")}
                  </span>
                )}
                <div className="flex flex-wrap gap-1.5 justify-center">
                  {["All", ...WORD_LEVELS.map(String)].map((lvl) => (
                    <button
                      key={lvl}
                      onClick={() => setSelectedHsk(lvl)}
                      className={`px-3 py-1.5 rounded-lg text-xs font-medium transition ${
                        selectedHsk === lvl
                          ? "bg-secondary text-background font-bold shadow-sm"
                          : "border border-text/15 hover:bg-text/5 text-text/70"
                      }`}
                    >
                      {lvl === "All" ? "All" : `HSK ${lvl}`}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Core Words Accordion List */}
            {filteredWords.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-text/20 rounded-2xl text-text/60 text-sm space-y-1">
                <p className="text-danger font-semibold">
                  {t("কোনো শব্দ পাওয়া যায়নি।", "No words found.")}
                </p>
                <p className="text-xs">
                  {t(
                    `"${search.trim()}" এর জন্য কোনো ম্যাচ নেই — হানজি, পিনইন, ইংরেজি বা বাংলা দিয়ে আবার চেষ্টা করুন।`,
                    `No match for "${search.trim()}" — try hanzi, pinyin, English or Bangla.`
                  )}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWords.map((item) => {
                  const isExpanded = expandedId === item.character;
                  const relatedCount = item.relatedWords?.length || 0;
                  const isRead = readSet.has(item.character);

                  return (
                    <div
                      key={item.character}
                      className={`border rounded-2xl transition-all overflow-hidden ${
                        isRead
                          ? "border-ok/40 bg-ok-surface/30"
                          : isExpanded
                            ? "border-secondary shadow-md bg-background/80"
                            : "border-text/15 bg-background hover:border-text/30"
                      }`}
                    >
                      {/* Top Clickable Bar */}
                      <div
                        onClick={() => setExpandedId(isExpanded ? null : item.character)}
                        className="p-5 flex items-center justify-between cursor-pointer select-none"
                      >
                        <div className="flex items-center gap-5">
                          <div className="w-14 h-14 rounded-xl bg-secondary/10 border border-secondary/20 flex flex-col items-center justify-center shrink-0">
                            <span className="text-2xl font-chinese font-bold text-secondary">
                              {item.character}
                            </span>
                            <span className="text-[10px] text-secondary font-mono">{item.pinyin}</span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h2 className={`font-semibold text-lg ${isRead ? "text-ok" : "text-text"}`}>
                                {language === "bn" ? item.meaningBn : item.meaningEn}
                              </h2>
                              <span className="text-xs text-text/50">
                                ({language === "bn" ? item.meaningEn : item.meaningBn})
                              </span>
                            </div>
                            <p className="text-xs text-text/60 mt-0.5">
                              {relatedCount} {t("টি সংযুক্ত শব্দ", "related words")}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2.5">
                          {/* Read / Unread toggle */}
                          <button
                            type="button"
                            onClick={(e) => {
                              e.stopPropagation();
                              toggleRead(item.character);
                            }}
                            title={isRead ? t("আনমার্ক করুন", "Mark as unread") : t("পড়া হয়েছে", "Mark as read")}
                            className={`w-8 h-8 rounded-full border flex items-center justify-center text-sm transition ${
                              isRead
                                ? "bg-ok text-background border-ok"
                                : "border-text/25 text-text/40 hover:border-ok/60 hover:text-ok"
                            }`}
                          >
                            {isRead ? "✓" : "○"}
                          </button>
                          {item.hskLevel && (
                            <span className="px-2.5 py-1 text-[11px] rounded-full border border-secondary/30 bg-secondary/10 text-secondary font-mono">
                              HSK {item.hskLevel}
                            </span>
                          )}
                          <span className="text-text/40 text-sm">{isExpanded ? "▲" : "▼"}</span>
                        </div>
                      </div>

                      {/* Expanded Related Words Section */}
                      {isExpanded && (
                        <div className="p-5 border-t border-text/10 bg-text/[0.02] space-y-4">
                          <h3 className="text-xs font-mono uppercase tracking-wider text-text/50">
                            {t(
                              `"${item.character}" দিয়ে তৈরি শব্দসমূহ`,
                              `Words built with "${item.character}"`
                            )}
                          </h3>

                          {relatedCount === 0 ? (
                            <p className="text-xs text-text/50">
                              {t(
                                "এখনো কোনো সংযুক্ত শব্দ যোগ করা হয়নি।",
                                "No related words added yet."
                              )}
                            </p>
                          ) : (
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              {item.relatedWords?.map((rw, idx) => (
                                <div
                                  key={idx}
                                  className="border border-text/10 rounded-xl p-4 bg-background space-y-2.5 shadow-sm"
                                >
                                  <div className="flex items-baseline justify-between">
                                    <span className="text-2xl font-chinese font-bold text-text">
                                      {rw.word}
                                    </span>
                                    <span className="text-xs font-mono font-medium text-secondary">
                                      {rw.pinyin}
                                    </span>
                                  </div>

                                  <p className="text-sm font-medium text-text">
                                    {language === "bn" ? rw.meaningBn : rw.meaningEn}
                                    <span className="block text-xs font-normal text-text/60 mt-0.5">
                                      {language === "bn" ? rw.meaningEn : rw.meaningBn}
                                    </span>
                                  </p>

                                  {/* Examples */}
                                  {rw.examples && rw.examples.length > 0 && (
                                    <div className="pt-2 border-t border-text/10 space-y-2">
                                      {rw.examples.map((ex, eIdx) => (
                                        <div
                                          key={eIdx}
                                          className="p-2.5 rounded-lg bg-text/[0.03] border border-text/5 text-xs space-y-0.5"
                                        >
                                          <p className="text-sm font-chinese font-normal">{ex.chinese}</p>
                                          <p className="text-[11px] font-mono text-secondary">{ex.pinyin}</p>
                                          <p className="text-text/80">
                                            {language === "bn" ? ex.meaningBn : ex.meaningEn}
                                          </p>
                                        </div>
                                      ))}
                                    </div>
                                  )}
                                </div>
                              ))}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </>
        ) : (
          <>
            {/* Lesson Word Browser */}
            <div className="space-y-4">
              {/* Level tabs */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {LESSON_LEVELS.map((lvl) => (
                  <button
                    key={lvl}
                    onClick={() => {
                      setLevel(lvl);
                      setLesson(1);
                    }}
                    className={`px-3.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      level === lvl
                        ? "bg-secondary text-background font-bold shadow-sm"
                        : "border border-text/15 hover:bg-text/5 text-text/70"
                    }`}
                  >
                    HSK {lvl}
                  </button>
                ))}
              </div>

              {/* Lesson chips */}
              <div className="flex flex-wrap gap-1.5 justify-center">
                {lessons.map((l) => (
                  <button
                    key={l}
                    onClick={() => setLesson(l)}
                    className={`min-w-9 px-2.5 py-1.5 rounded-lg text-xs font-medium transition ${
                      activeLesson === l
                        ? "bg-secondary text-background font-bold shadow-sm"
                        : "border border-text/15 hover:bg-text/5 text-text/70"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>

              {/* Search + only-missing + stats */}
              <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
                <input
                  type="text"
                  placeholder={t(
                    "যেভাবে খুঁজুন: 你 / ni / ni hao / তুমি / you",
                    "Search any way: 你 / ni / ni hao / you"
                  )}
                  value={wordSearch}
                  onChange={(e) => setWordSearch(e.target.value)}
                  className="w-full sm:max-w-md px-4 py-2.5 rounded-xl border border-text/20 bg-background/60 text-text placeholder-text/40 focus:outline-none focus:border-secondary transition text-sm"
                />

                <div className="flex items-center gap-3">
                  <label className="flex items-center gap-2 text-xs text-text/70 cursor-pointer select-none">
                    <input
                      type="checkbox"
                      checked={onlyMissing}
                      onChange={(e) => setOnlyMissing(e.target.checked)}
                      className="accent-secondary w-3.5 h-3.5"
                    />
                    {t("শুধু বাদ পড়াগুলো", "Only missing")}
                  </label>
                  <span className="px-2.5 py-1 text-[11px] rounded-full border border-text/15 bg-text/5 text-text/60 font-mono whitespace-nowrap">
                    {lessonStats.found}/{lessonStats.total} {t("আছে", "in list")} · {lessonStats.marked}{" "}
                    {t("মার্ক করা", "read")}
                  </span>
                </div>
              </div>

              {/* Words grid */}
              {filteredLessonWords.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-text/20 rounded-2xl text-text/60 text-sm space-y-1">
                  <p className="text-danger font-semibold">
                    {t("কোনো শব্দ পাওয়া যায়নি।", "No words found.")}
                  </p>
                  <p className="text-xs">
                    {t(
                      `"${wordSearch.trim()}" এর জন্য কোনো ম্যাচ নেই — হানজি, পিনইন, ইংরেজি বা বাংলা দিয়ে আবার চেষ্টা করুন।`,
                      `No match for "${wordSearch.trim()}" — try hanzi, pinyin, English or Bangla.`
                    )}
                  </p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredLessonWords.map((w, idx) => {
                    const inDataset = knownWords.has(w.hanzi);
                    const root = findWordEntry(w.hanzi);
                    const relatedCount = root?.relatedWords?.length ?? 0;
                    const isRead = readSet.has(w.hanzi);

                    return (
                      <div
                        key={`${w.level}-${w.lesson}-${w.text}-${w.hanzi}-${idx}`}
                        className={`border rounded-2xl p-4 space-y-2.5 shadow-sm transition-colors ${
                          isRead
                            ? "border-ok/40 bg-ok-surface/40"
                            : inDataset
                              ? "border-ok/30 bg-ok-surface/20"
                              : "border-warn/30 bg-warn-surface/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <div className="flex items-center gap-2.5">
                            {/* Read / Unread toggle */}
                            <button
                              type="button"
                              onClick={() => toggleRead(w.hanzi)}
                              title={isRead ? t("আনমার্ক করুন", "Mark as unread") : t("পড়া হয়েছে", "Mark as read")}
                              className={`w-7 h-7 rounded-full border flex items-center justify-center text-xs transition shrink-0 ${
                                isRead
                                  ? "bg-ok text-background border-ok"
                                  : "border-text/25 text-text/40 hover:border-ok/60 hover:text-ok"
                              }`}
                            >
                              {isRead ? "✓" : "○"}
                            </button>
                            <span className="text-3xl font-chinese font-bold text-text leading-tight">
                              {w.hanzi}
                            </span>
                          </div>
                          <span
                            className={`shrink-0 px-2 py-0.5 text-[10px] font-mono rounded-full border ${
                              inDataset
                                ? "border-ok/40 bg-ok/10 text-ok"
                                : "border-warn/40 bg-warn/10 text-warn"
                            }`}
                          >
                            {inDataset
                              ? `✓ ${t("তালিকায় আছে", "in list")}`
                              : `✗ ${t("নেই", "missing")}`}
                          </span>
                        </div>

                        <p className="text-xs font-mono font-medium text-secondary">{w.pinyin}</p>

                        <p className="text-sm font-medium text-text">
                          {language === "bn" ? w.bn || w.en : w.en}
                          <span className="block text-xs font-normal text-text/60 mt-0.5">
                            {language === "bn" ? w.en : w.bn || w.en}
                          </span>
                        </p>

                        {inDataset && root && relatedCount > 0 && (
                          <p className="text-[11px] text-text/60 pt-1 border-t border-text/10">
                            {t(
                              `রুট হিসেবে আছে — ${relatedCount} টি সংযুক্ত শব্দ`,
                              `In root network — ${relatedCount} related words`
                            )}
                          </p>
                        )}
                      </div>
                    );
                  })}
                </div>
              )}
            </div>
          </>
        )}
      </div>

      {/* Go to top */}
      {showTop && (
        <button
          type="button"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          title={t("উপরে যান", "Go to top")}
          className="fixed bottom-6 right-6 z-50 w-11 h-11 rounded-full bg-primary text-primary-foreground shadow-lg flex items-center justify-center text-lg font-bold hover:opacity-90 transition"
        >
          ↑
        </button>
      )}
      </div>
    </ProGate>
  );
}
