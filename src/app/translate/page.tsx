"use client";

import { useCallback, useMemo, useState } from "react";
import { useLanguage } from "@/i18n";
import { SelectableText } from "@/features/chinese-words";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { TOPICS, translateBanglaToChinese, type Topic, type TranslateWord, type TranslateSentence } from "@/features/translate";
import { banglishToBangla, searchWithBanglishSupport, isBanglish } from "@/features/translate";

const RECENT_KEY = "translate:recent";

function loadRecent(): string[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(RECENT_KEY) ?? "[]") as string[];
  } catch {
    return [];
  }
}

function saveRecent(query: string) {
  if (typeof window === "undefined") return;
  try {
    const recent = loadRecent();
    const next = [query, ...recent.filter((q) => q !== query)].slice(0, 8);
    localStorage.setItem(RECENT_KEY, JSON.stringify(next));
  } catch {
    /* ignore */
  }
}

function stripTones(pinyin: string): string {
  return pinyin
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "")
    .replace(/[ǖǘǚǜ]/g, "v")
    .replace(/[^a-z0-9\s]/g, "")
    .trim();
}

// Call backend translation API for arbitrary text
async function translateViaAPI(text: string, sourceLang: string, targetLang: string): Promise<{
  translatedText: string;
  confidence: number;
} | null> {
  try {
    const res = await fetch("/api/translate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ text, sourceLang, targetLang }),
    });
    const data = await res.json();
    if (data.success) {
      return { translatedText: data.translatedText, confidence: data.confidence };
    }
  } catch {
    // API failed, will fallback
  }
  return null;
}

export default function TranslatePage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [searchQuery, setSearchQuery] = useState("");
  const [activeTopicId, setActiveTopicId] = useState<string>("common");
  const [showTopics, setShowTopics] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  // Full translation (Google Translate style) - for arbitrary text
  const [fullTranslation, setFullTranslation] = useState<{
    text: string;
    translatedText: string;
    confidence: number;
    isLoading: boolean;
  } | null>(null);

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { words: [] as TranslateWord[], sentences: [] as TranslateSentence[] };
    // Use Banglish-aware search: tries original query, then transliterated Bangla
    return searchWithBanglishSupport(searchQuery.trim(), translateBanglaToChinese) as { words: TranslateWord[]; sentences: TranslateSentence[] };
  }, [searchQuery]);

  // Trigger full translation API when local results are empty and query is substantial
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const triggerFullTranslation = useCallback(async () => {
    if (!searchQuery.trim() || searchResults.words.length > 0 || searchResults.sentences.length > 0) {
      setFullTranslation(null);
      return;
    }
    if (searchQuery.trim().length < 2) {
      setFullTranslation(null);
      return;
    }

    setFullTranslation({ text: searchQuery, translatedText: "", confidence: 0, isLoading: true });

    // Determine source language (Bangla or auto-detect from Banglish)
    const banglaQuery = banglishToBangla(searchQuery);
    const isBanglaScript = /[\u0980-\u09FF]/.test(banglaQuery);
    const sourceLang = isBanglaScript ? "bn" : "bn"; // MyMemory supports "bn" for both

    const result = await translateViaAPI(banglaQuery, sourceLang, "zh-CN");
    if (result) {
      setFullTranslation({
        text: searchQuery,
        translatedText: result.translatedText,
        confidence: result.confidence,
        isLoading: false,
      });
    } else {
      setFullTranslation(null);
    }
  }, [searchQuery, searchResults.words.length, searchResults.sentences.length]);

  // Call translation when search results change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _translationEffect = useMemo(() => { triggerFullTranslation(); return 0; }, [triggerFullTranslation]);

  const activeTopic = useMemo(
    () => TOPICS.find((t) => t.id === activeTopicId) ?? TOPICS[0],
    [activeTopicId],
  );

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    setShowTopics(false);
    if (query.trim()) {
      saveRecent(query.trim());
      const updated = loadRecent();
      setRecentSearches(updated);
    }
  };

  const handleRecentClick = (query: string) => {
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowTopics(true);
  };

  // Load recent searches on mount
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const loadRecentEffect = useCallback(() => {
    setRecentSearches(loadRecent());
  }, []);
  // Using a simple effect
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _ = useMemo(() => { loadRecentEffect(); return 0; }, []);

  return (
    <div
      className={`min-h-screen bg-background text-text py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="text-center space-y-3">
          <span className="inline-block px-3 py-1 bg-secondary text-background text-xs font-mono rounded font-bold uppercase tracking-wider">
            {t("বাংলা → চাইনিজ অনুবাদক", "Bangla → Chinese Translator")}
          </span>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {t("বাংলা থেকে চাইনিজ শব্দ ও বাক্য খুঁজুন", "Find Chinese words & sentences from Bangla")}
          </h1>
          <p className="text-text/75 text-sm sm:text-base max-w-xl mx-auto">
            {t(
              "বাংলা লিখে চাইনিজ হানজি, পিনইন আর অর্থ পান। টপিক-ভিত্তিক শব্দভাণ্ডার ব্রাউজ করুন।",
              "Type in Bangla to get Chinese hanzi, pinyin, and meanings. Browse topic-based vocabulary."
            )}
          </p>
        </div>

        {/* Search Box */}
        <div className="space-y-4">
          <div className="relative">
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => handleSearch(e.target.value)}
              placeholder={t(
                "বাংলা বা বাংলিশ লিখুন: ami, khub bhalo, kemon achen, khabar...",
                "Type Bangla or Banglish: ami, khub bhalo, kemon achen, khabar..."
              )}
              className="w-full px-5 py-3.5 pr-14 text-base rounded-2xl border border-text/20 bg-background/60 text-text placeholder-text/40 focus:outline-none focus:border-secondary transition"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={clearSearch}
                className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition"
                aria-label={t("মুছুন", "Clear")}
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            )}
          </div>

          {/* Banglish indicator - shows transliterated Bangla when typing in Banglish */}
          {searchQuery && isBanglish(searchQuery) && (
            <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/10 border border-secondary/20 text-sm">
              <span className="text-secondary font-mono text-xs">Banglish →</span>
              <span className="font-medium text-text font-bn">{banglishToBangla(searchQuery)}</span>
              <span className="text-xs text-text/50 ml-auto">
                {t("বাংলা স্ক্রিপ্টে কনভার্ট হয়েছে", "Converted to Bangla script")}
              </span>
            </div>
          )}

          {/* Recent searches */}
          {recentSearches.length > 0 && !searchQuery && (
            <div className="flex flex-wrap gap-2">
              <span className="text-xs text-text/50 px-2">{t("সাম্প্রতিক:", "Recent:")}</span>
              {recentSearches.map((q) => (
                <button
                  key={q}
                  type="button"
                  onClick={() => handleRecentClick(q)}
                  className="px-3 py-1.5 text-sm rounded-xl border border-text/15 bg-background hover:border-secondary/50 hover:bg-secondary/10 transition"
                >
                  {q}
                </button>
              ))}
            </div>
          )}

          {/* Search Results */}
          {searchQuery.trim() && (searchResults.words.length > 0 || searchResults.sentences.length > 0) && (
            <div className="space-y-6 border-t border-text/10 pt-6">
              <h2 className="flex items-center gap-2 text-lg font-bold text-text">
                <span className="px-2 py-0.5 text-xs font-mono bg-secondary/10 text-secondary rounded">
                  {t("ফলাফল", "Results")}
                </span>
                {t(
                  `"${searchQuery}" এর জন্য`,
                  `for "${searchQuery}"`
                )}
              </h2>

              {searchResults.words.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text/70 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-secondary/10 flex items-center justify-center">
                      <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                      </svg>
                    </span>
                    {t("শব্দ", "Words")} ({searchResults.words.length})
                  </h3>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    {searchResults.words.map((w, idx) => (
                      <div
                        key={`${w.hanzi}-${w.pinyin}-${idx}`}
                        className="border border-text/15 rounded-xl p-4 bg-background shadow-sm hover:border-secondary/30 transition"
                      >
                        <div className="flex items-start justify-between gap-2">
                          <div className="min-w-0 flex-1">
                            <p data-pinyin className="mb-1 text-xs font-mono font-medium text-secondary break-words">
                              {w.pinyin}
                            </p>
                            <div className="flex items-center gap-2.5">
                              <SelectableText className="text-2xl sm:text-3xl font-chinese font-bold text-text leading-tight break-words cursor-text">
                                {w.hanzi}
                              </SelectableText>
                              <SpeakerButton text={w.hanzi} className="size-7" />
                            </div>
                          </div>
                        </div>
                        <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                          <span className="font-semibold text-base sm:text-lg text-text">
                            {language === "bn" ? w.meaningBn : w.meaningEn}
                          </span>
                          <span className="text-xs text-text/50">
                            ({language === "bn" ? w.meaningEn : w.meaningBn})
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {searchResults.sentences.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-sm font-semibold text-text/70 flex items-center gap-2">
                    <span className="w-5 h-5 rounded bg-secondary/10 flex items-center justify-center">
                      <svg className="w-3 h-3 text-secondary" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 12h.01M12 12h.01M16 12h.01M21 12c0 4.418-4.03 8-9 8a9.863 9.863 0 01-4.255-.949L3 20l1.395-3.72C3.512 15.042 3 13.574 3 12c0-4.418 4.03-8 9-8s9 3.582 9 8z" />
                      </svg>
                    </span>
                    {t("বাক্য", "Sentences")} ({searchResults.sentences.length})
                  </h3>
                  <div className="space-y-3">
                    {searchResults.sentences.map((s, idx) => (
                      <div
                        key={`${s.chinese}-${idx}`}
                        className="border border-text/15 rounded-xl p-4 bg-background shadow-sm hover:border-secondary/30 transition"
                      >
                        <div className="space-y-1.5">
                          <SelectableText className="text-base sm:text-lg font-chinese font-normal cursor-text break-words">
                            {s.chinese}
                          </SelectableText>
                          <p className="text-xs font-mono text-secondary">{s.pinyin}</p>
                          <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="font-medium text-text">
                              {language === "bn" ? s.meaningBn : s.meaningEn}
                            </span>
                            <span className="text-xs text-text/50">
                              ({language === "bn" ? s.meaningEn : s.meaningBn})
                            </span>
                          </div>
                          <SpeakerButton text={s.chinese} className="size-6" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Full Translation Result (Google Translate style) */}
          {fullTranslation && !fullTranslation.isLoading && (
            <div className="border border-ok/30 bg-ok-surface/20 rounded-2xl p-6 space-y-4">
              <div className="flex items-center gap-2 text-sm font-medium text-ok">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
                <span>{t("পূর্ণ অনুবাদ", "Full Translation")}</span>
                <span className="px-2 py-0.5 text-xs font-mono bg-ok/20 rounded">{Math.round(fullTranslation.confidence)}% match</span>
              </div>

              {/* Original text (Bangla) */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text/60 uppercase tracking-wide">
                  {t("মূল (বাংলা)", "Original (Bangla)")}
                </label>
                <div className="p-4 bg-background rounded-xl border border-text/15 text-text font-bn text-lg select-all">
                  {fullTranslation.text}
                </div>
              </div>

              {/* Translated text (Chinese) */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text/60 uppercase tracking-wide">
                  {t("অনুবাদ (চাইনিজ)", "Translation (Chinese)")}
                </label>
                <div className="p-4 bg-background rounded-xl border border-text/15 text-text font-chinese text-2xl select-all flex items-center gap-3">
                  <SelectableText>{fullTranslation.translatedText}</SelectableText>
                  <SpeakerButton text={fullTranslation.translatedText} className="size-8" />
                </div>
              </div>

              <p className="text-xs text-text/50 text-center">
                {t("MyMemory Translation API দ্বারা অনুবাদ করা", "Translated via MyMemory Translation API")}
              </p>
            </div>
          )}

          {/* Loading state */}
          {fullTranslation?.isLoading && (
            <div className="text-center py-16 border border-dashed border-text/20 rounded-2xl text-text/60 text-sm space-y-4">
              <div className="inline-flex items-center gap-2 text-secondary">
                <svg className="animate-spin h-6 w-6" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" fill="none" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
                </svg>
                <span>{t("অনুবাদ হচ্ছে...", "Translating...")}</span>
              </div>
              <p className="text-xs">
                {t("অনলাইন অনুবাদ সার্ভিস থেকে ফলাফল আনছে...", "Fetching from online translation service...")}
              </p>
            </div>
          )}

          {/* No results - with Google Translate fallback */}
          {searchQuery.trim() && searchResults.words.length === 0 && searchResults.sentences.length === 0 && !fullTranslation && (
            <div className="text-center py-16 border border-dashed border-text/20 rounded-2xl text-text/60 text-sm space-y-4">
              <p className="text-danger font-semibold">
                {t("কোনো ফলাফল পাওয়া যায়নি।", "No results found.")}
              </p>
              <p className="text-xs">
                {t(
                  `"${searchQuery.trim()}" এর জন্য কোনো ম্যাচ নেই — অন্য শব্দ দিয়ে চেষ্টা করুন বা নিচের টপিকগুলো ব্রাউজ করুন।`,
                  `No match for "${searchQuery.trim()}" — try another word or browse topics below.`
                )}
              </p>
              <a
                href={`https://translate.google.com/?sl=bn&tl=zh-CN&text=${encodeURIComponent(searchQuery.trim())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary font-medium text-sm hover:bg-secondary/20 transition"
              >
                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm-1 17.93c-3.95-.49-7-3.85-7-7.93 0-.62.08-1.21.21-1.79L9 15v1c0 1.1.9 2 2 2v1.93zm6.9-2.54c-.26-.81-1-1.39-1.9-1.39h-1v-3c0-.55-.45-1-1-1H8v-2h2c1.1 0 2-.9 2-2v-.41c2.93 1.19 5 4.06 5 7.41 0 2.08-.8 3.97-2.1 5.39z"/>
                </svg>
                {t("Google Translate-এ খুঁজুন", "Search on Google Translate")}
              </a>
            </div>
          )}

          {/* Topics Browser */}
          {showTopics && (
            <div className="border-t border-text/10 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text">
                  {t("টপিক অনুযায়ী শব্দভাণ্ডার", "Vocabulary by Topic")}
                </h2>
                <span className="text-xs text-text/50">
                  {TOPICS.length} {t("টপিক", "topics")}
                </span>
              </div>

              {/* Topic Tabs */}
              <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label={t("টপিক নির্বাচন করুন", "Select topic")}>
                {TOPICS.map((topic) => (
                  <button
                    key={topic.id}
                    role="tab"
                    aria-selected={activeTopicId === topic.id}
                    onClick={() => {
                      setActiveTopicId(topic.id);
                      setShowTopics(true);
                      setSearchQuery("");
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition ${
                      activeTopicId === topic.id
                        ? "bg-secondary text-background font-bold shadow-sm"
                        : "border border-text/15 hover:bg-text/5 text-text/70"
                    }`}
                  >
                    <span className="mr-1">{topic.icon}</span>
                    {t(topic.nameBn, topic.nameEn)}
                  </button>
                ))}
              </div>

              {/* Active Topic Content */}
              <div className="space-y-6">
                {/* Words */}
                {activeTopic.words.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-text flex items-center gap-2 mb-4">
                      <span className="px-2 py-0.5 text-xs font-mono bg-secondary/10 text-secondary rounded">
                        {t("শব্দ", "Words")}
                      </span>
                      {t(activeTopic.nameBn, activeTopic.nameEn)} ({activeTopic.words.length})
                    </h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
                      {activeTopic.words.map((w, idx) => (
                        <div
                          key={`${activeTopic.id}-${w.hanzi}-${w.pinyin}-${idx}`}
                          className="border border-text/15 rounded-xl p-4 bg-background shadow-sm hover:border-secondary/30 transition"
                        >
                          <div className="flex items-start justify-between gap-2">
                            <div className="min-w-0 flex-1">
                              <p data-pinyin className="mb-1 text-xs font-mono font-medium text-secondary break-words">
                                {w.pinyin}
                              </p>
                              <div className="flex items-center gap-2.5">
                                <SelectableText className="text-2xl sm:text-3xl font-chinese font-bold text-text leading-tight break-words cursor-text">
                                  {w.hanzi}
                                </SelectableText>
                                <SpeakerButton text={w.hanzi} className="size-7" />
                              </div>
                            </div>
                          </div>
                          <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                            <span className="font-semibold text-base sm:text-lg text-text">
                              {language === "bn" ? w.meaningBn : w.meaningEn}
                            </span>
                            <span className="text-xs text-text/50">
                              ({language === "bn" ? w.meaningEn : w.meaningBn})
                            </span>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Sentences */}
                {activeTopic.sentences.length > 0 && (
                  <div>
                    <h3 className="text-lg font-semibold text-text flex items-center gap-2 mb-4">
                      <span className="px-2 py-0.5 text-xs font-mono bg-secondary/10 text-secondary rounded">
                        {t("বাক্য", "Sentences")}
                      </span>
                      {t(activeTopic.nameBn, activeTopic.nameEn)} ({activeTopic.sentences.length})
                    </h3>
                    <div className="space-y-3">
                      {activeTopic.sentences.map((s, idx) => (
                        <div
                          key={`${activeTopic.id}-${s.chinese}-${idx}`}
                          className="border border-text/15 rounded-xl p-4 bg-background shadow-sm hover:border-secondary/30 transition"
                        >
                          <div className="space-y-1.5">
                            <SelectableText className="text-base sm:text-lg font-chinese font-normal cursor-text break-words">
                              {s.chinese}
                            </SelectableText>
                            <p className="text-xs font-mono text-secondary">{s.pinyin}</p>
                            <div className="flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                              <span className="font-medium text-text">
                                {language === "bn" ? s.meaningBn : s.meaningEn}
                              </span>
                              <span className="text-xs text-text/50">
                                ({language === "bn" ? s.meaningEn : s.meaningBn})
                              </span>
                            </div>
                            <SpeakerButton text={s.chinese} className="size-6" />
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state for topic with no content */}
                {activeTopic.words.length === 0 && activeTopic.sentences.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-text/20 rounded-2xl text-text/60">
                    <p className="text-lg font-medium">{t("এই টপিকের জন্য ডেটা যোগ করা হচ্ছে।", "Data for this topic is being added.")}</p>
                  </div>
                )}
              </div>
            </div>
          )}
        </div>

        {/* Footer tip */}
        <div className="mt-10 p-4 rounded-2xl border border-text/10 bg-text/[0.02] text-center text-sm text-text/60">
          <p>
            {t(
              "টিপ: বাংলা বা বাংলিশ (ফোনেটিক) লিখুন — হানজি, পিনইন আর বাংলা/ইংরেজি অর্থ একসাথে পাবেন।",
              "Tip: Type Bangla or Banglish (phonetic) — get hanzi, pinyin, and Bangla/English meanings together."
            )}
          </p>
        </div>
      </div>
    </div>
  );
}