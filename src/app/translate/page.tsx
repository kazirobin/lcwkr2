"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { useLanguage } from "@/i18n";
import { useAccount } from "@/features/student-auth";
import { SelectableText } from "@/features/chinese-words";
import SpeakerButton from "@/components/ui/SpeakerButton";
import { Mic, MicOff, ArrowRightLeft, ExternalLink, Plus, Edit2, Trash2, Save, X, UserPlus } from "lucide-react";
import { TOPICS, translateBanglaToChinese, type Topic, type TranslateWord, type TranslateSentence } from "@/features/translate";
import { banglishToBangla, searchWithBanglishSupport, isBanglish, getBanglishSuggestions } from "@/features/translate";
import { chineseToPinyin, chineseToCharPinyinPairs } from "@/features/translate/lib/pinyin";

// Type declaration for SpeechRecognition (webkit)
interface SpeechRecognition extends EventTarget {
  lang: string;
  continuous: boolean;
  interimResults: boolean;
  start: () => void;
  stop: () => void;
  onresult: (event: any) => void;
  onerror: (event: any) => void;
  onend: () => void;
}

interface SpeechRecognitionStatic {
  new (): SpeechRecognition;
}

declare global {
  interface Window {
    webkitSpeechRecognition: SpeechRecognitionStatic;
  }
}

const RECENT_KEY = "translate:recent";
const USER_TOPICS_KEY = "translate:userTopics";

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

function loadUserTopics(): Topic[] {
  if (typeof window === "undefined") return [];
  try {
    return JSON.parse(localStorage.getItem(USER_TOPICS_KEY) ?? "[]") as Topic[];
  } catch {
    return [];
  }
}

function saveUserTopics(topics: Topic[]) {
  if (typeof window === "undefined") return;
  try {
    localStorage.setItem(USER_TOPICS_KEY, JSON.stringify(topics));
  } catch {
    /* ignore */
  }
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

// Generate unique ID
function genId(): string {
  return Date.now().toString(36) + Math.random().toString(36).slice(2);
}

// Auto-translate Bangla to Chinese using API
async function autoTranslateToChinese(banglaText: string): Promise<{ hanzi: string; pinyin: string } | null> {
  const result = await translateViaAPI(banglaText, "bn", "zh-CN");
  if (!result) return null;
  
  // Extract pinyin from the result (MyMemory doesn't provide pinyin directly)
  // We'll use a simple approach - for now return the Chinese text
  // In production, you'd use a proper pinyin library
  return { hanzi: result.translatedText, pinyin: "" };
}

export default function TranslatePage() {
  const { language } = useLanguage();
  const { student, checking } = useAccount();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  // Banner visibility - show for 2 seconds then hide
  const [showBanner, setShowBanner] = useState(true);
  useEffect(() => {
    const timer = setTimeout(() => setShowBanner(false), 2000);
    return () => clearTimeout(timer);
  }, []);

  // Translation direction: "bn-zh" (Bangla to Chinese) or "zh-bn" (Chinese to Bangla)
  const [direction, setDirection] = useState<"bn-zh" | "zh-bn">("bn-zh");
  
  const [searchQuery, setSearchQuery] = useState("");
  const [banglishSuggestions, setBanglishSuggestions] = useState<string[]>([]);
  const [showBanglishSuggestions, setShowBanglishSuggestions] = useState(false);
  const [activeTopicId, setActiveTopicId] = useState<string>("common");
  const [showTopics, setShowTopics] = useState(true);
  const [recentSearches, setRecentSearches] = useState<string[]>([]);
  const [fullTranslation, setFullTranslation] = useState<{
    text: string;
    translatedText: string;
    confidence: number;
    isLoading: boolean;
  } | null>(null);

  // Voice recognition
  const [isListening, setIsListening] = useState(false);
  const [voiceError, setVoiceError] = useState<string | null>(null);
  const recognitionRef = useRef<SpeechRecognition | null>(null);

  // User topic management
  const [userTopics, setUserTopicsState] = useState<Topic[]>([]);
  const [editingTopicId, setEditingTopicId] = useState<string | null>(null);
  const [newTopic, setNewTopic] = useState({ nameBn: "", nameEn: "", icon: "📝" });
  const [editingWord, setEditingWord] = useState<{ topicId: string; word: TranslateWord } | null>(null);
  const [editingSentence, setEditingSentence] = useState<{ topicId: string; sentence: TranslateSentence } | null>(null);

  // Load user topics on mount
  useEffect(() => {
    setUserTopicsState(loadUserTopics());
  }, []);

  // Initialize speech recognition
  useEffect(() => {
    if (typeof window !== "undefined" && "webkitSpeechRecognition" in window) {
      const SpeechRecognition = (window as any).webkitSpeechRecognition;
      const recognition = new SpeechRecognition();
      recognition.lang = "bn-BD";
      recognition.continuous = false;
      recognition.interimResults = true;

      recognition.onresult = (event: any) => {
        const transcript = Array.from(event.results)
          .map((r: any) => r[0].transcript)
          .join("");
        setSearchQuery(transcript);
      };

      recognition.onerror = (event: any) => {
        setVoiceError(event.error);
        setIsListening(false);
      };

      recognition.onend = () => {
        setIsListening(false);
      };

      recognitionRef.current = recognition;
    }
  }, []);

  const toggleListening = () => {
    if (!recognitionRef.current) {
      setVoiceError(t("ভয়েস রিকগনিশন সমর্থিত নয়", "Voice recognition not supported"));
      return;
    }
    if (isListening) {
      recognitionRef.current.stop();
      setIsListening(false);
    } else {
      setVoiceError(null);
      recognitionRef.current.start();
      setIsListening(true);
    }
  };

  const searchResults = useMemo(() => {
    if (!searchQuery.trim()) return { words: [] as TranslateWord[], sentences: [] as TranslateSentence[] };
    // Use Banglish-aware search: tries original query, then transliterated Bangla
    if (direction === "bn-zh") {
      return searchWithBanglishSupport(searchQuery.trim(), translateBanglaToChinese) as { words: TranslateWord[]; sentences: TranslateSentence[] };
    }
    // For Chinese to Bangla, we'd need a reverse search - for now return empty
    return { words: [] as TranslateWord[], sentences: [] as TranslateSentence[] };
  }, [searchQuery, direction]);

  // Trigger full translation API when local results are empty and query is substantial
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

    const banglaQuery = direction === "bn-zh" ? banglishToBangla(searchQuery) : searchQuery;
    const sourceLang = direction === "bn-zh" ? "bn" : "zh-CN";
    const targetLang = direction === "bn-zh" ? "zh-CN" : "bn";

    const result = await translateViaAPI(banglaQuery, sourceLang, targetLang);
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
  }, [searchQuery, searchResults.words.length, searchResults.sentences.length, direction]);

  // Call translation when search results change
  // eslint-disable-next-line react-hooks/exhaustive-deps
  const _translationEffect = useMemo(() => { triggerFullTranslation(); return 0; }, [triggerFullTranslation]);

  const handleSearch = (query: string) => {
    setSearchQuery(query);
    if (query.trim()) {
      saveRecent(query.trim());
      setRecentSearches(loadRecent());
    }
    // Update Banglish suggestions
    if (direction === "bn-zh" && isBanglish(query)) {
      const suggestions = getBanglishSuggestions(query);
      setBanglishSuggestions(suggestions);
      setShowBanglishSuggestions(suggestions.length > 0);
    } else {
      setBanglishSuggestions([]);
      setShowBanglishSuggestions(false);
    }
  };

  const handleRecentClick = (query: string) => {
    handleSearch(query);
  };

  const clearSearch = () => {
    setSearchQuery("");
    setShowTopics(true);
    setFullTranslation(null);
    setBanglishSuggestions([]);
    setShowBanglishSuggestions(false);
  };

  const swapDirection = () => {
    setDirection(d => d === "bn-zh" ? "zh-bn" : "bn-zh");
    // Swap the query if there's a full translation
    if (fullTranslation && !fullTranslation.isLoading) {
      setSearchQuery(fullTranslation.translatedText);
    }
  };

  // Load recent searches on mount
  useEffect(() => {
    setRecentSearches(loadRecent());
  }, []);

  // All topics (built-in + user created)
  const allTopics = useMemo(() => [...TOPICS, ...userTopics], [userTopics]);
  const activeTopic = useMemo(
    () => allTopics.find((t) => t.id === activeTopicId) ?? allTopics[0],
    [activeTopicId, allTopics],
  );

  // User topic management functions
  const addTopic = async () => {
    if (!newTopic.nameBn.trim()) return;
    const topic: Topic = {
      id: genId(),
      nameEn: newTopic.nameEn || newTopic.nameBn,
      nameBn: newTopic.nameBn,
      icon: newTopic.icon || "📝",
      words: [],
      sentences: [],
    };
    const updated = [...userTopics, topic];
    setUserTopicsState(updated);
    saveUserTopics(updated);
    setNewTopic({ nameBn: "", nameEn: "", icon: "📝" });
    setActiveTopicId(topic.id);
  };

  const deleteTopic = (id: string) => {
    const updated = userTopics.filter(t => t.id !== id);
    setUserTopicsState(updated);
    saveUserTopics(updated);
    if (activeTopicId === id) setActiveTopicId("common");
  };

  const startEditTopic = (topic: Topic) => {
    setEditingTopicId(topic.id);
    setNewTopic({ nameBn: topic.nameBn, nameEn: topic.nameEn, icon: topic.icon });
  };

  const saveEditTopic = () => {
    if (!editingTopicId || !newTopic.nameBn.trim()) return;
    const updated = userTopics.map(t => 
      t.id === editingTopicId ? { ...t, nameBn: newTopic.nameBn, nameEn: newTopic.nameEn, icon: newTopic.icon } : t
    );
    setUserTopicsState(updated);
    saveUserTopics(updated);
    setEditingTopicId(null);
    setNewTopic({ nameBn: "", nameEn: "", icon: "📝" });
  };

  const cancelEditTopic = () => {
    setEditingTopicId(null);
    setNewTopic({ nameBn: "", nameEn: "", icon: "📝" });
  };

  const addWordToTopic = async (topicId: string) => {
    const wordBn = prompt(t("বাংলা শব্দ লিখুন:", "Enter Bangla word:"));
    if (!wordBn) return;
    
    // Auto-translate to Chinese
    const translation = await autoTranslateToChinese(wordBn);
    if (!translation) {
      alert(t("অনুবাদ ব্যর্থ হয়েছে", "Translation failed"));
      return;
    }

    const wordEn = prompt(t("ইংরেজি অর্থ লিখুন (ঐচ্ছিক):", "Enter English meaning (optional):")) || "";
    
    const newWord: TranslateWord = {
      hanzi: translation.hanzi,
      pinyin: translation.pinyin || "",
      meaningEn: wordEn,
      meaningBn: wordBn,
    };

    const updated = userTopics.map(t => 
      t.id === topicId ? { ...t, words: [...t.words, newWord] } : t
    );
    setUserTopicsState(updated);
    saveUserTopics(updated);
  };

  const addSentenceToTopic = async (topicId: string) => {
    const sentenceBn = prompt(t("বাংলা বাক্য লিখুন:", "Enter Bangla sentence:"));
    if (!sentenceBn) return;
    
    const translation = await autoTranslateToChinese(sentenceBn);
    if (!translation) {
      alert(t("অনুবাদ ব্যর্থ হয়েছে", "Translation failed"));
      return;
    }

    const sentenceEn = prompt(t("ইংরেজি অর্থ লিখুন (ঐচ্ছিক):", "Enter English meaning (optional):")) || "";
    
    const newSentence: TranslateSentence = {
      chinese: translation.hanzi,
      pinyin: translation.pinyin || "",
      meaningEn: sentenceEn,
      meaningBn: sentenceBn,
    };

    const updated = userTopics.map(t => 
      t.id === topicId ? { ...t, sentences: [...t.sentences, newSentence] } : t
    );
    setUserTopicsState(updated);
    saveUserTopics(updated);
  };

  const deleteWord = (topicId: string, wordIndex: number) => {
    const updated = userTopics.map(t => 
      t.id === topicId ? { ...t, words: t.words.filter((_, i) => i !== wordIndex) } : t
    );
    setUserTopicsState(updated);
    saveUserTopics(updated);
  };

  const deleteSentence = (topicId: string, sentenceIndex: number) => {
    const updated = userTopics.map(t => 
      t.id === topicId ? { ...t, sentences: t.sentences.filter((_, i) => i !== sentenceIndex) } : t
    );
    setUserTopicsState(updated);
    saveUserTopics(updated);
  };

  const startEditWord = (topicId: string, word: TranslateWord, index: number) => {
    setEditingWord({ topicId, word: { ...word } });
  };

  const saveEditWord = () => {
    if (!editingWord) return;
    const updated = userTopics.map(t => 
      t.id === editingWord.topicId 
        ? { ...t, words: t.words.map(w => w.hanzi === editingWord.word.hanzi ? editingWord.word : w) }
        : t
    );
    setUserTopicsState(updated);
    saveUserTopics(updated);
    setEditingWord(null);
  };

  const startEditSentence = (topicId: string, sentence: TranslateSentence, index: number) => {
    setEditingSentence({ topicId, sentence: { ...sentence } });
  };

  const saveEditSentence = () => {
    if (!editingSentence) return;
    const updated = userTopics.map(t => 
      t.id === editingSentence.topicId 
        ? { ...t, sentences: t.sentences.map(s => s.chinese === editingSentence.sentence.chinese ? editingSentence.sentence : s) }
        : t
    );
    setUserTopicsState(updated);
    saveUserTopics(updated);
    setEditingSentence(null);
  };

  return (
    <div
      className={`min-h-screen bg-background text-text py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300 ${
        language === "bn" ? "font-bn" : "font-en"
      }`}
    >
      {/* Banner - shows for 2 seconds, with registration button if not logged in */}
      {showBanner && !checking && !student && (
        <div className="fixed top-0 left-0 right-0 z-50 bg-secondary text-background py-2 px-4">
          <div className="max-w-4xl mx-auto flex items-center justify-between">
            <span className="text-sm font-medium">
              {t("নামমাত্র এন্ট্রি ফি-তে আজই শুরু করুন চাইনিজ শেখা।", "Start learning Chinese today with just a nominal entry fee.")}
            </span>
            <a
              href="/register"
              className="flex items-center gap-1.5 px-3 py-1.5 bg-background text-secondary text-sm font-semibold rounded-xl hover:bg-background/90 transition"
            >
              <UserPlus className="w-4 h-4" />
              {t("নিবন্ধন", "Register")}
            </a>
          </div>
        </div>
      )}

      <div className="max-w-4xl mx-auto space-y-8 pt-12">
        {/* Header */}
        <div className="text-center space-y-3">
          <div className="flex items-center justify-center gap-2">
            <span className="inline-block px-3 py-1 bg-secondary text-background text-xs font-mono rounded font-bold uppercase tracking-wider">
              {t("বাংলা ⇄ চাইনিজ অনুবাদক", "Bangla ⇄ Chinese Translator")}
            </span>
            <button
              onClick={swapDirection}
              className="p-2 rounded-xl border border-text/20 hover:bg-text/5 transition"
              aria-label={t("ভাষা বদলান", "Swap languages")}
              title={t("ভাষা বদলান", "Swap languages")}
            >
              <ArrowRightLeft className="w-5 h-5 text-secondary" />
            </button>
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight">
            {direction === "bn-zh" 
              ? t("বাংলা থেকে চাইনিজ শব্দ ও বাক্য খুঁজুন", "Find Chinese words & sentences from Bangla")
              : t("চাইনিজ থেকে বাংলা শব্দ ও বাক্য খুঁজুন", "Find Bangla words & sentences from Chinese")
            }
          </h1>
          <p className="text-text/75 text-sm sm:text-base max-w-xl mx-auto">
            {direction === "bn-zh"
              ? t("বাংলা বা বাংলিশ লিখে চাইনিজ হানজি, পিনইন আর অর্থ পান। ভয়েস টু টেক্সট, টপিক ব্রাউজ ও পূর্ণ অনুবাদ।", 
                 "Type Bangla or Banglish to get Chinese hanzi, pinyin, and meanings. Voice-to-text, topic browse, and full translation.")
              : t("চাইনিজ লিখে বাংলা অর্থ পান। পূর্ণ অনুবাদ এবং ভয়েস ইনপুট।",
                 "Type Chinese to get Bangla meanings. Full translation and voice input.")
            }
          </p>
        </div>

        {/* Search Box with Mic & Google Translate */}
        <div className="space-y-4">
          <div className="relative">
            <div className="flex items-center gap-2">
              <div className="flex-1 relative">
                <input
                  type="text"
                  value={searchQuery}
                  onChange={(e) => handleSearch(e.target.value)}
                  placeholder={
                    direction === "bn-zh"
                      ? t("বাংলা বা বাংলিশ লিখুন: ami, khub bhalo, kemon achen, khabar...", "Type Bangla or Banglish: ami, khub bhalo, kemon achen, khabar...")
                      : t("চাইনিজ লিখুন: 你好, 谢谢, 我爱你...", "Type Chinese: 你好, 谢谢, 我爱你...")
                  }
                  className="w-full px-5 py-3.5 pr-14 pl-12 text-base rounded-2xl border border-text/20 bg-background/60 text-text placeholder-text/40 focus:outline-none focus:border-secondary transition"
                />
                {/* Mic button inside input */}
                <button
                  type="button"
                  onClick={toggleListening}
                  className="absolute left-3 top-1/2 -translate-y-1/2 p-2 rounded-xl transition"
                  aria-label={isListening ? t("শোনা বন্ধ করুন", "Stop listening") : t("ভয়েস ইনপুট", "Voice input")}
                  title={isListening ? t("শোনা বন্ধ করুন", "Stop listening") : t("ভয়েস ইনপুট", "Voice input")}
                >
                  {isListening ? (
                    <Mic className="w-5 h-5 text-secondary animate-pulse" />
                  ) : (
                    <MicOff className="w-5 h-5 text-text/40 hover:text-text" />
                  )}
                </button>
                {searchQuery && (
                  <button
                    type="button"
                    onClick={clearSearch}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-text/40 hover:text-text transition"
                    aria-label={t("মুছুন", "Clear")}
                  >
                    <X className="w-5 h-5" />
                  </button>
                )}
              </div>
              {/* Google Translate button */}
              <a
                href={`https://translate.google.com/?sl=${direction === "bn-zh" ? "bn" : "zh-CN"}&tl=${direction === "bn-zh" ? "zh-CN" : "bn"}&text=${encodeURIComponent(searchQuery.trim())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="px-4 py-3.5 rounded-2xl border border-secondary/30 bg-secondary/10 text-secondary font-medium text-sm hover:bg-secondary/20 transition flex items-center gap-2"
                title={t("Google Translate-এ খুলুন", "Open in Google Translate")}
              >
                <ExternalLink className="w-4 h-4" />
                <span className="hidden sm:inline">{t("Google Translate", "Google Translate")}</span>
              </a>
            </div>
            {voiceError && (
              <p className="text-xs text-danger text-center">{voiceError}</p>
            )}
          </div>

          {/* Banglish indicator & suggestions dropdown */}
          {searchQuery && isBanglish(searchQuery) && direction === "bn-zh" && (
            <div className="relative">
              <div className="flex items-center gap-2 px-3 py-2 rounded-xl bg-secondary/10 border border-secondary/20 text-sm">
                <span className="text-secondary font-mono text-xs">Banglish →</span>
                <span className="font-medium text-text font-bn">{banglishToBangla(searchQuery)}</span>
                <span className="text-xs text-text/50 ml-auto">
                  {t("বাংলা স্ক্রিপ্টে কনভার্ট হয়েছে", "Converted to Bangla script")}
                </span>
              </div>
              
              {/* Banglish suggestions dropdown */}
              {showBanglishSuggestions && banglishSuggestions.length > 0 && (
                <div className="absolute top-full left-0 right-0 mt-1 z-20 bg-background border border-text/20 rounded-xl shadow-lg overflow-hidden">
                  <div className="px-2 py-1.5 border-b border-text/10">
                    <span className="text-xs text-text/50 font-medium">
                      {t("সাজেশন:", "Suggestions:")}
                    </span>
                  </div>
                  <div className="max-h-48 overflow-y-auto">
                    {banglishSuggestions.map((suggestion, idx) => (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => {
                          setSearchQuery(suggestion);
                          saveRecent(suggestion);
                          setRecentSearches(loadRecent());
                          setBanglishSuggestions([]);
                          setShowBanglishSuggestions(false);
                          setShowTopics(false);
                        }}
                        className="w-full px-3 py-2 text-sm text-left font-bn hover:bg-secondary/10 transition border-b border-text/5 last:border-0"
                      >
                        {suggestion}
                      </button>
                    ))}
                  </div>
                </div>
              )}
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
                            {/* Ruby-style pinyin above hanzi */}
                            <div className="relative inline-block mb-1">
                              <ruby>
                                <span className="text-2xl sm:text-3xl font-chinese font-bold text-text leading-tight break-words cursor-text">
                                  {w.hanzi}
                                </span>
                                <rt className="text-xs font-mono font-medium text-secondary leading-none">
                                  {w.pinyin}
                                </rt>
                              </ruby>
                            </div>
                         <div className="flex items-center gap-2.5">
                               <SpeakerButton text={w.hanzi} className="size-7" />
                               <button
                                 type="button"
                                 onClick={() => {
                                   setSearchQuery(w.hanzi);
                                   saveRecent(w.hanzi);
                                   setRecentSearches(loadRecent());
                                   setShowTopics(false);
                                 }}
                                 className="p-1.5 rounded-lg border border-text/15 hover:bg-text/5 hover:border-secondary/30 transition"
                                 aria-label={t("সার্চ বক্সে কপি করুন", "Copy to search")}
                                 title={t("সার্চ বক্সে কপি করুন", "Copy to search")}
                               >
                                 <Mic className="w-4 h-4 text-text/50 hover:text-secondary" />
                               </button>
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
                           <div className="flex items-center gap-2">
                             <SpeakerButton text={s.chinese} className="size-6" />
                             <button
                               type="button"
                               onClick={() => {
                                 setSearchQuery(s.chinese);
                                 saveRecent(s.chinese);
                                 setRecentSearches(loadRecent());
                                 setShowTopics(false);
                               }}
                               className="p-1.5 rounded-lg border border-text/15 hover:bg-text/5 hover:border-secondary/30 transition"
                               aria-label={t("সার্চ বক্সে কপি করুন", "Copy to search")}
                               title={t("সার্চ বক্সে কপি করুন", "Copy to search")}
                             >
                               <Mic className="w-4 h-4 text-text/50 hover:text-secondary" />
                             </button>
                           </div>
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

              {/* Original text */}
              <div className="space-y-2">
                <label className="text-xs font-medium text-text/60 uppercase tracking-wide">
                  {direction === "bn-zh" 
                    ? t("মূল (বাংলা)", "Original (Bangla)") 
                    : t("মূল (চাইনিজ)", "Original (Chinese)")}
                </label>
                <div className="p-4 bg-background rounded-xl border border-text/15 text-text font-bn text-lg select-all">
                  {fullTranslation.text}
                </div>
              </div>

               {/* Translated text (Chinese/Bangla) */}
               <div className="space-y-2">
                 <label className="text-xs font-medium text-text/60 uppercase tracking-wide">
                   {direction === "bn-zh" 
                     ? t("অনুবাদ (চাইনিজ)", "Translation (Chinese)") 
                     : t("অনুবাদ (বাংলা)", "Translation (Bangla)")}
                 </label>
                  <div className="p-4 bg-background rounded-xl border border-text/15 text-text font-chinese text-2xl select-all flex items-center gap-3">
                    {direction === "bn-zh" ? (
                      <>
                        <div className="flex flex-wrap items-center gap-1">
                          {chineseToCharPinyinPairs(fullTranslation.translatedText).map((pair, idx) => (
                            <ruby key={idx} className="inline-flex flex-col items-center">
                              <span className="font-bold leading-tight cursor-text text-2xl">{pair.char}</span>
                              <rt className="text-[0.55em] font-mono font-medium text-secondary leading-none whitespace-nowrap">
                                {pair.pinyin}
                              </rt>
                            </ruby>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <SpeakerButton text={fullTranslation.translatedText} className="size-8" />
                          <button
                            type="button"
                            onClick={() => {
                              setSearchQuery(fullTranslation.translatedText);
                              saveRecent(fullTranslation.translatedText);
                              setRecentSearches(loadRecent());
                              setShowTopics(false);
                            }}
                            className="p-2 rounded-lg border border-text/15 hover:bg-text/5 hover:border-secondary/30 transition"
                            aria-label={t("সার্চ বক্সে কপি করুন", "Copy to search")}
                            title={t("সার্চ বক্সে কপি করুন", "Copy to search")}
                          >
                            <Mic className="w-5 h-5 text-text/50 hover:text-secondary" />
                          </button>
                        </div>
                      </>
                    ) : (
                     <>
                       <SelectableText>{fullTranslation.translatedText}</SelectableText>
                       <div className="flex items-center gap-2">
                         <SpeakerButton text={fullTranslation.translatedText} className="size-8" />
                         <button
                           type="button"
                           onClick={() => {
                             setSearchQuery(fullTranslation.translatedText);
                             saveRecent(fullTranslation.translatedText);
                             setRecentSearches(loadRecent());
                             setShowTopics(false);
                           }}
                           className="p-2 rounded-lg border border-text/15 hover:bg-text/5 hover:border-secondary/30 transition"
                           aria-label={t("সার্চ বক্সে কপি করুন", "Copy to search")}
                           title={t("সার্চ বক্সে কপি করুন", "Copy to search")}
                         >
                           <Mic className="w-5 h-5 text-text/50 hover:text-secondary" />
                         </button>
                       </div>
                     </>
                   )}
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
                href={`https://translate.google.com/?sl=${direction === "bn-zh" ? "bn" : "zh-CN"}&tl=${direction === "bn-zh" ? "zh-CN" : "bn"}&text=${encodeURIComponent(searchQuery.trim())}`}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-secondary/10 border border-secondary/30 text-secondary font-medium text-sm hover:bg-secondary/20 transition"
              >
                <ExternalLink className="w-4 h-4" />
                {t("Google Translate-এ খুঁজুন", "Search on Google Translate")}
              </a>
            </div>
          )}

          {/* Topics Browser */}
          <div className="border-t border-text/10 pt-8">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-2xl font-bold text-text">
                  {t("টপিক অনুযায়ী শব্দভাণ্ডার", "Vocabulary by Topic")}
                </h2>
                <span className="text-xs text-text/50">
                  {allTopics.length} {t("টপিক", "topics")}
                </span>
              </div>

              {/* Topic Tabs */}
              <div className="flex flex-wrap gap-2 mb-6" role="tablist" aria-label={t("টপিক নির্বাচন করুন", "Select topic")}>
                {allTopics.map((topic) => (
                  <button
                    key={topic.id}
                    role="tab"
                    aria-selected={activeTopicId === topic.id}
                    onClick={() => {
                      setActiveTopicId(topic.id);
                      setShowTopics(true);
                      setSearchQuery("");
                    }}
                    className={`px-4 py-2 rounded-xl text-sm font-medium transition flex items-center gap-1.5 ${
                      activeTopicId === topic.id
                        ? "bg-secondary text-background font-bold shadow-sm"
                        : "border border-text/15 hover:bg-text/5 text-text/70"
                    }`}
                  >
                    <span>{topic.icon}</span>
                    {t(topic.nameBn, topic.nameEn)}
                    {userTopics.some(t => t.id === topic.id) && (
                      <span className="ml-1 px-1.5 py-0.5 text-[10px] font-mono bg-secondary/20 text-secondary rounded">
                        {t("আপনার", "Yours")}
                      </span>
                    )}
                  </button>
                ))}
              </div>

              {/* Active Topic Content */}
              <div className="space-y-6">
                {/* Topic Management for User Topics */}
                {userTopics.some(t => t.id === activeTopicId) && (
                  <div className="border border-secondary/30 bg-secondary/5 rounded-2xl p-4 space-y-4">
                    <h3 className="font-semibold text-text flex items-center gap-2">
                      <Plus className="w-4 h-4 text-secondary" />
                      {t("আপনার টপিক পরিচালনা", "Manage Your Topic")}
                    </h3>
                    
                    {/* Add Word/Sentence */}
                    <div className="flex flex-wrap gap-2">
                      <button
                        onClick={() => addWordToTopic(activeTopicId)}
                        className="px-4 py-2 rounded-xl border border-text/20 bg-background text-text hover:border-secondary/50 hover:bg-secondary/10 transition text-sm flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        {t("শব্দ যোগ করুন", "Add Word")}
                      </button>
                      <button
                        onClick={() => addSentenceToTopic(activeTopicId)}
                        className="px-4 py-2 rounded-xl border border-text/20 bg-background text-text hover:border-secondary/50 hover:bg-secondary/10 transition text-sm flex items-center gap-2"
                      >
                        <Plus className="w-4 h-4" />
                        {t("বাক্য যোগ করুন", "Add Sentence")}
                      </button>
                    </div>

                    {/* Edit/Delete Topic */}
                    <div className="flex items-center gap-2 pt-2 border-t border-text/10">
                      {editingTopicId === activeTopicId ? (
                        <>
                          <input
                            type="text"
                            value={newTopic.nameBn}
                            onChange={(e) => setNewTopic({ ...newTopic, nameBn: e.target.value })}
                            placeholder={t("বাংলা নাম", "Bangla name")}
                            className="flex-1 px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm"
                          />
                          <input
                            type="text"
                            value={newTopic.nameEn}
                            onChange={(e) => setNewTopic({ ...newTopic, nameEn: e.target.value })}
                            placeholder={t("ইংরেজি নাম (ঐচ্ছিক)", "English name (optional)")}
                            className="px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm"
                          />
                          <input
                            type="text"
                            value={newTopic.icon}
                            onChange={(e) => setNewTopic({ ...newTopic, icon: e.target.value })}
                            placeholder="📝"
                            className="w-12 px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm text-center"
                          />
                          <button
                            onClick={saveEditTopic}
                            className="px-4 py-2 rounded-xl bg-secondary text-background text-sm font-medium"
                          >
                            <Save className="w-4 h-4" />
                          </button>
                          <button
                            onClick={cancelEditTopic}
                            className="px-4 py-2 rounded-xl border border-text/20 bg-background text-text text-sm"
                          >
                            <X className="w-4 h-4" />
                          </button>
                        </>
                      ) : (
                        <>
                          <button
                            onClick={() => startEditTopic(activeTopic!)}
                            className="px-4 py-2 rounded-xl border border-text/20 bg-background text-text text-sm hover:border-secondary/50 hover:bg-secondary/10 transition"
                          >
                            <Edit2 className="w-4 h-4" />
                          </button>
                          <button
                            onClick={() => deleteTopic(activeTopicId)}
                            className="px-4 py-2 rounded-xl border border-danger/30 bg-danger/5 text-danger text-sm hover:bg-danger/10 transition"
                          >
                            <Trash2 className="w-4 h-4" />
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                )}

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
                          className="border border-text/15 rounded-xl p-4 bg-background shadow-sm hover:border-secondary/30 transition relative"
                        >
                          {editingWord?.word.hanzi === w.hanzi && editingWord?.topicId === activeTopic.id ? (
                            <div className="space-y-2 w-full">
                              <input
                                type="text"
                                value={editingWord.word.hanzi}
                                onChange={(e) => setEditingWord({ ...editingWord!, word: { ...editingWord!.word, hanzi: e.target.value } })}
                                className="w-full px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-2xl font-chinese font-bold text-center"
                              />
                              <input
                                type="text"
                                value={editingWord.word.pinyin}
                                onChange={(e) => setEditingWord({ ...editingWord!, word: { ...editingWord!.word, pinyin: e.target.value } })}
                                className="w-full px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm font-mono text-center text-secondary"
                                placeholder="pinyin"
                              />
                              <input
                                type="text"
                                value={editingWord.word.meaningBn}
                                onChange={(e) => setEditingWord({ ...editingWord!, word: { ...editingWord!.word, meaningBn: e.target.value } })}
                                className="w-full px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm"
                                placeholder={t("বাংলা অর্থ", "Bangla meaning")}
                              />
                              <input
                                type="text"
                                value={editingWord.word.meaningEn}
                                onChange={(e) => setEditingWord({ ...editingWord!, word: { ...editingWord!.word, meaningEn: e.target.value } })}
                                className="w-full px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm"
                                placeholder={t("ইংরেজি অর্থ", "English meaning")}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={saveEditWord}
                                  className="flex-1 px-3 py-2 rounded-xl bg-secondary text-background text-sm font-medium"
                                >
                                  <Save className="w-4 h-4 mx-auto" />
                                </button>
                                <button
                                  onClick={() => setEditingWord(null)}
                                  className="px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm"
                                >
                                  <X className="w-4 h-4 mx-auto" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="flex items-start justify-between gap-2">
                                <div className="min-w-0 flex-1">
                                  {/* Ruby-style pinyin above hanzi */}
                                  <div className="relative inline-block mb-1">
                                  <ruby>
                                    <span className="text-2xl sm:text-3xl font-chinese font-bold text-text leading-tight break-words cursor-text">
                                      {w.hanzi}
                                    </span>
                                    <rt className="text-xs font-mono font-medium text-secondary leading-none">
                                      {w.pinyin}
                                    </rt>
                                  </ruby>
                                  </div>
                                  <div className="flex items-center gap-2.5">
                                    <SpeakerButton text={w.hanzi} className="size-7" />
                                  </div>
                                </div>
                                {userTopics.some(t => t.id === activeTopicId) && (
                                  <div className="flex items-center gap-1">
                                    <button
                                      onClick={() => startEditWord(activeTopicId, w, idx)}
                                      className="p-1.5 rounded-lg hover:bg-text/5 transition"
                                      title={t("সম্পাদনা", "Edit")}
                                    >
                                      <Edit2 className="w-4 h-4 text-text/50" />
                                    </button>
                                    <button
                                      onClick={() => deleteWord(activeTopicId, idx)}
                                      className="p-1.5 rounded-lg hover:bg-danger/10 text-danger/50 transition"
                                      title={t("মুছুন", "Delete")}
                                    >
                                      <Trash2 className="w-4 h-4" />
                                    </button>
                                  </div>
                                )}
                              </div>
                              <div className="mt-2.5 flex flex-wrap items-baseline gap-x-2 gap-y-0.5">
                                <span className="font-semibold text-base sm:text-lg text-text">
                                  {language === "bn" ? w.meaningBn : w.meaningEn}
                                </span>
                                <span className="text-xs text-text/50">
                                  ({language === "bn" ? w.meaningEn : w.meaningBn})
                                </span>
                              </div>
                            </>
                          )}
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
                          className="border border-text/15 rounded-xl p-4 bg-background shadow-sm hover:border-secondary/30 transition relative"
                        >
                          {editingSentence?.sentence.chinese === s.chinese && editingSentence?.topicId === activeTopicId ? (
                            <div className="space-y-2 w-full">
                              <input
                                type="text"
                                value={editingSentence.sentence.chinese}
                                onChange={(e) => setEditingSentence({ ...editingSentence!, sentence: { ...editingSentence!.sentence, chinese: e.target.value } })}
                                className="w-full px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-lg font-chinese font-normal"
                              />
                              <input
                                type="text"
                                value={editingSentence.sentence.pinyin}
                                onChange={(e) => setEditingSentence({ ...editingSentence!, sentence: { ...editingSentence!.sentence, pinyin: e.target.value } })}
                                className="w-full px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm font-mono text-secondary"
                                placeholder="pinyin"
                              />
                              <input
                                type="text"
                                value={editingSentence.sentence.meaningBn}
                                onChange={(e) => setEditingSentence({ ...editingSentence!, sentence: { ...editingSentence!.sentence, meaningBn: e.target.value } })}
                                className="w-full px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm"
                                placeholder={t("বাংলা অর্থ", "Bangla meaning")}
                              />
                              <input
                                type="text"
                                value={editingSentence.sentence.meaningEn}
                                onChange={(e) => setEditingSentence({ ...editingSentence!, sentence: { ...editingSentence!.sentence, meaningEn: e.target.value } })}
                                className="w-full px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm"
                                placeholder={t("ইংরেজি অর্থ", "English meaning")}
                              />
                              <div className="flex gap-2">
                                <button
                                  onClick={saveEditSentence}
                                  className="flex-1 px-3 py-2 rounded-xl bg-secondary text-background text-sm font-medium"
                                >
                                  <Save className="w-4 h-4 mx-auto" />
                                </button>
                                <button
                                  onClick={() => setEditingSentence(null)}
                                  className="px-3 py-2 rounded-xl border border-text/20 bg-background text-text text-sm"
                                >
                                  <X className="w-4 h-4 mx-auto" />
                                </button>
                              </div>
                            </div>
                          ) : (
                            <>
                              <div className="space-y-1.5">
                                <div className="flex items-start justify-between">
                                  <SelectableText className="text-base sm:text-lg font-chinese font-normal cursor-text break-words">
                                    {s.chinese}
                                  </SelectableText>
                                  {userTopics.some(t => t.id === activeTopicId) && (
                                    <div className="flex items-center gap-1">
                                      <button
                                        onClick={() => startEditSentence(activeTopicId, s, idx)}
                                        className="p-1.5 rounded-lg hover:bg-text/5 transition"
                                        title={t("সম্পাদনা", "Edit")}
                                      >
                                        <Edit2 className="w-4 h-4 text-text/50" />
                                      </button>
                                      <button
                                        onClick={() => deleteSentence(activeTopicId, idx)}
                                        className="p-1.5 rounded-lg hover:bg-danger/10 text-danger/50 transition"
                                        title={t("মুছুন", "Delete")}
                                      >
                                        <Trash2 className="w-4 h-4" />
                                      </button>
                                    </div>
                                  )}
                                </div>
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
                            </>
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {/* Empty state for topic with no content */}
                {activeTopic.words.length === 0 && activeTopic.sentences.length === 0 && (
                  <div className="text-center py-12 border border-dashed border-text/20 rounded-2xl text-text/60">
                    <p className="text-lg font-medium">{t("এই টপিকের জন্য ডেটা যোগ করা হচ্ছে।", "Data for this topic is being added.")}</p>
                    {userTopics.some(t => t.id === activeTopicId) && (
                      <div className="mt-4 flex justify-center gap-2">
                        <button
                          onClick={() => addWordToTopic(activeTopicId)}
                          className="px-4 py-2 rounded-xl border border-text/20 bg-background text-text hover:border-secondary/50 hover:bg-secondary/10 transition text-sm flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t("শব্দ যোগ করুন", "Add Word")}
                        </button>
                        <button
                          onClick={() => addSentenceToTopic(activeTopicId)}
                          className="px-4 py-2 rounded-xl border border-text/20 bg-background text-text hover:border-secondary/50 hover:bg-secondary/10 transition text-sm flex items-center gap-2"
                        >
                          <Plus className="w-4 h-4" />
                          {t("বাক্য যোগ করুন", "Add Sentence")}
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>

          {/* Create New Topic */}
          <div className="border-t border-text/10 pt-8">
              <h3 className="text-lg font-semibold text-text flex items-center gap-2 mb-4">
                <Plus className="w-5 h-5 text-secondary" />
                {t("নতুন টপিক তৈরি করুন", "Create New Topic")}
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 mb-4">
                <input
                  type="text"
                  value={newTopic.nameBn}
                  onChange={(e) => setNewTopic({ ...newTopic, nameBn: e.target.value })}
                  placeholder={t("বাংলা নাম (যেমন: রান্না)", "Bangla name (e.g. Cooking)")}
                  className="px-4 py-3 rounded-xl border border-text/20 bg-background text-text placeholder-text/40 focus:outline-none focus:border-secondary transition"
                />
                <input
                  type="text"
                  value={newTopic.nameEn}
                  onChange={(e) => setNewTopic({ ...newTopic, nameEn: e.target.value })}
                  placeholder={t("ইংরেজি নাম (ঐচ্ছিক)", "English name (optional)")}
                  className="px-4 py-3 rounded-xl border border-text/20 bg-background text-text placeholder-text/40 focus:outline-none focus:border-secondary transition"
                />
                <input
                  type="text"
                  value={newTopic.icon}
                  onChange={(e) => setNewTopic({ ...newTopic, icon: e.target.value })}
                  placeholder="📝"
                  className="px-4 py-3 rounded-xl border border-text/20 bg-background text-text placeholder-text/40 focus:outline-none focus:border-secondary transition text-center text-2xl"
                  maxLength={2}
                />
              </div>
              <button
                onClick={addTopic}
                disabled={!newTopic.nameBn.trim()}
                className="w-full sm:w-auto px-6 py-3 rounded-xl bg-secondary text-background font-medium text-sm hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
              >
                <Plus className="w-4 h-4" />
                {t("টপিক যোগ করুন", "Add Topic")}
              </button>
            </div>
        </div>

        {/* Footer tip */}
        <div className="mt-10 p-4 rounded-2xl border border-text/10 bg-text/[0.02] text-center text-sm text-text/60">
          <p>
            {direction === "bn-zh"
              ? t("টিপ: বাংলা বা বাংলিশ (ফোনেটিক) লিখুন — হানজি, পিনইন আর বাংলা/ইংরেজি অর্থ একসাথে পাবেন। মাইক চাপুন ভয়েস ইনপুটের জন্য।", 
                 "Tip: Type Bangla or Banglish (phonetic) — get hanzi, pinyin, and Bangla/English meanings together. Tap mic for voice input.")
              : t("টিপ: চাইনিজ লিখুন — বাংলা অর্থ পাবেন। মাইক চাপুন ভয়েস ইনপুটের জন্য।", 
                 "Tip: Type Chinese — get Bangla meanings. Tap mic for voice input.")
            }
          </p>
        </div>
      </div>
    </div>
  );
}