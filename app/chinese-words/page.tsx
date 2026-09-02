"use client";

import React, { useState, useEffect } from "react";
import { useLanguage } from "@/context/LanguageContext";

export default function ChineseWordBuilderPage() {
  const { language } = useLanguage();
  const t = (bn: string, en: string) => (language === "bn" ? bn : en);

  const [words, setWords] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [selectedHsk, setSelectedHsk] = useState("All");
  const [expandedId, setExpandedId] = useState<string | null>(null);

  useEffect(() => {
    fetch("/api/chinese-words")
      .then((res) => res.json())
      .then((res) => {
        if (res.success) setWords(res.data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const filteredWords = words.filter((item) => {
    const matchHsk = selectedHsk === "All" || item.hskLevel === Number(selectedHsk);
    const q = search.toLowerCase().trim();
    const matchSearch =
      !q ||
      item.character?.includes(q) ||
      item.pinyin?.toLowerCase().includes(q) ||
      item.meaningEn?.toLowerCase().includes(q) ||
      item.meaningBn?.includes(q) ||
      item.relatedWords?.some(
        (rw: any) =>
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
              "একটি মূল ক্যারেক্টার শিখুন এবং তা দিয়ে তৈরি হওয়া অন্যান্য শব্দগুলো সহজে মনে রাখুন।",
              "Learn one core character and discover how multiple words are formed from it."
            )}
          </p>
        </div>

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
        {loading ? (
          <div className="text-center py-20 text-text/50 font-mono text-sm">
            {t("শব্দ লোড হচ্ছে...", "Loading words...")}
          </div>
        ) : filteredWords.length === 0 ? (
          <div className="text-center py-16 border border-dashed border-text/20 rounded-2xl text-text/60 text-sm">
            {t("কোনো শব্দ পাওয়া যায়নি।", "No words found matching your search.")}
          </div>
        ) : (
          <div className="space-y-4">
            {filteredWords.map((item) => {
              const isExpanded = expandedId === item._id;
              const relatedCount = item.relatedWords?.length || 0;

              return (
                <div
                  key={item._id}
                  className={`border rounded-2xl transition-all overflow-hidden ${
                    isExpanded
                      ? "border-secondary shadow-md bg-background/80"
                      : "border-text/15 bg-background hover:border-text/30"
                  }`}
                >
                  {/* Top Clickable Bar */}
                  <div
                    onClick={() => setExpandedId(isExpanded ? null : item._id)}
                    className="p-5 flex items-center justify-between cursor-pointer select-none"
                  >
                    <div className="flex items-center gap-5">
                      <div className="w-14 h-14 rounded-xl bg-secondary/10 border border-secondary/20 flex flex-col items-center justify-center shrink-0">
                        <span className="text-2xl font-serif font-bold text-secondary">
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

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {item.relatedWords?.map((rw: any, idx: number) => (
                          <div
                            key={idx}
                            className="border border-text/10 rounded-xl p-4 bg-background space-y-2.5 shadow-sm"
                          >
                            <div className="flex items-baseline justify-between">
                              <span className="text-2xl font-serif font-bold text-text">
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
                            {rw.examples?.length > 0 && (
                              <div className="pt-2 border-t border-text/10 space-y-2">
                                {rw.examples.map((ex: any, eIdx: number) => (
                                  <div
                                    key={eIdx}
                                    className="p-2.5 rounded-lg bg-text/[0.03] border border-text/5 text-xs space-y-0.5"
                                  >
                                    <p className="text-sm font-serif font-normal">{ex.chinese}</p>
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
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}