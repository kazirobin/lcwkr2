"use client";

import React, { useMemo, useState } from "react";
import { useLanguage } from "@/i18n";
import {
  CHINESE_WORDS,
  LESSON_LEVELS,
  buildKnownWordSet,
  findWordEntry,
  getLessonWords,
} from "@/features/chinese-words";
import type { LessonWord } from "@/features/chinese-words";

export default function ChineseWordBuilderPage() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const [view, setView] = useState<"root" | "words">("root");

  // ── shared ──────────────────────────────────────────────────────────
  const knownWords = useMemo(() => buildKnownWordSet(), []);

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
    return { found, total: lessonWordList.length };
  }, [lessonWordList, knownWords]);

  const filteredLessonWords = useMemo(() => {
    const q = wordSearch.toLowerCase().trim();
    return lessonWordList.filter((w) => {
      const inDataset = knownWords.has(w.hanzi);
      if (onlyMissing && inDataset) return false;
      if (!q) return true;
      return (
        w.hanzi.includes(q) ||
        w.pinyin.toLowerCase().includes(q) ||
        w.en.toLowerCase().includes(q) ||
        w.bn.includes(q)
      );
    });
  }, [lessonWordList, knownWords, onlyMissing, wordSearch]);

  // ── root view filtering (local data, no fetch) ──────────────────────
  const filteredWords = CHINESE_WORDS.filter((item) => {
    const matchHsk = selectedHsk === "All" || item.hskLevel === Number(selectedHsk);
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.character?.includes(q) ||
      item.pinyin?.toLowerCase().includes(q) ||
      item.meaningEn?.toLowerCase().includes(q) ||
      item.meaningBn?.includes(q) ||
      item.relatedWords?.some(
        (rw) =>
          rw.word?.includes(q) ||
          rw.pinyin?.toLowerCase().includes(q) ||
          rw.meaningEn?.toLowerCase().includes(q) ||
          rw.meaningBn?.includes(q)
      );

    return matchHsk && matchSearch;
  });

  return (
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
          </div>
        </div>

        {view === "root" ? (
          <>
            {/* Search & HSK Filters */}
            <div className="flex flex-col sm:flex-row gap-3 items-center justify-between">
              <input
                type="text"
                placeholder={t(
                  "খুঁজুন (যেমন: 学, xue, শেখা, student)...",
                  "Search (e.g. 学, xue, study, student)..."
                )}
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                className="w-full sm:max-w-md px-4 py-2.5 rounded-xl border border-text/20 bg-background/60 text-text placeholder-text/40 focus:outline-none focus:border-secondary transition text-sm"
              />

              <div className="flex flex-wrap gap-1.5 justify-center">
                {["All", "1", "2", "3", "4", "5", "6"].map((lvl) => (
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

            {/* Core Words Accordion List */}
            {filteredWords.length === 0 ? (
              <div className="text-center py-16 border border-dashed border-text/20 rounded-2xl text-text/60 text-sm">
                {t("কোনো শব্দ পাওয়া যায়নি।", "No words found matching your search.")}
              </div>
            ) : (
              <div className="space-y-4">
                {filteredWords.map((item) => {
                  const isExpanded = expandedId === item.character;
                  const relatedCount = item.relatedWords?.length || 0;

                  return (
                    <div
                      key={item.character}
                      className={`border rounded-2xl transition-all overflow-hidden ${
                        isExpanded
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
                              <h2 className="font-semibold text-lg text-text">
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

                        <div className="flex items-center gap-3">
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
                    "শব্দ খুঁজুন (যেমন: 你, nǐ, তুমি)...",
                    "Search words (e.g. 你, nǐ, you)..."
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
                  <span className="px-2.5 py-1 text-[11px] rounded-full border border-text/15 bg-text/5 text-text/60 font-mono">
                    {lessonStats.found}/{lessonStats.total} {t("আছে", "in list")}
                  </span>
                </div>
              </div>

              {/* Words grid */}
              {filteredLessonWords.length === 0 ? (
                <div className="text-center py-16 border border-dashed border-text/20 rounded-2xl text-text/60 text-sm">
                  {t("এই লেসনে কোনো শব্দ পাওয়া যায়নি।", "No words found for this lesson.")}
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {filteredLessonWords.map((w, idx) => {
                    const inDataset = knownWords.has(w.hanzi);
                    const root = findWordEntry(w.hanzi);
                    const relatedCount = root?.relatedWords?.length ?? 0;

                    return (
                      <div
                        key={`${w.level}-${w.lesson}-${w.text}-${w.hanzi}-${idx}`}
                        className={`border rounded-2xl p-4 space-y-2.5 shadow-sm transition-colors ${
                          inDataset
                            ? "border-ok/30 bg-ok-surface/40"
                            : "border-warn/30 bg-warn-surface/30"
                        }`}
                      >
                        <div className="flex items-start justify-between gap-3">
                          <span className="text-3xl font-chinese font-bold text-text leading-tight">
                            {w.hanzi}
                          </span>
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
    </div>
  );
}
