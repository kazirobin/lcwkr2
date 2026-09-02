// src/features/vocabulary/i18n.ts
//
// Copy for the HSK vocabulary surface, in both languages. Plain module —
// safe to import from server and client. Chrome strings only; the teaching
// content (hanzi / pinyin / english / bangla) lives in the data files.

import type { Language } from "@/i18n";

const BN_DIGITS = ["০", "১", "২", "৩", "৪", "৫", "৬", "৭", "৮", "৯"];

/** Render a number in Bangla digits when the UI language is Bangla. */
export const localizeNumber = (n: number, language: Language): string =>
  language === "bn"
    ? String(n).replace(/\d/g, (d) => BN_DIGITS[Number(d)])
    : String(n);

/** Two-digit, language-aware — for the mono index columns. */
export const localizePad2 = (n: number, language: Language): string =>
  language === "bn"
    ? localizeNumber(n, "bn")
    : String(n).padStart(2, "0");

export const vocabularyCopy = {
  en: {
    section: "The HSK track",
    indexTitle: "Work through the",
    indexTitleAccent: "HSK vocabulary",
    indexLede:
      "The words from your HSK course books, level by level and lesson by lesson — each with pinyin, a Bangla and an English meaning, a character breakdown and an example. Made for the live classes.",
    levelWord: "words",
    levelLessons: "lessons",
    levelTexts: "texts",
    lesson: "Lesson",
    text: "Text",
    words: "words",
    dialogue: "with dialogue",
    glanceLessons: "Lessons",
    glanceTexts: "Texts",
    glanceWords: "Words",
    soon: "Coming",
    soonNote: "These words are added as the course reaches this level.",
    open: "Open",
    start: "Start",
    lessonList: "The lessons",
    textList: "The texts in this lesson",
    levelOverview: (n: string) =>
      `Fifteen lessons of HSK ${n}, in the order your class works through them.`,
    lessonOverviewN: (count: string) =>
      `${count} short texts. Pick up where your class left off.`,
    breadcrumbHome: "HSK",
    home: "HSK vocabulary",
    prevText: "Back",
    nextText: "Continue",
    finishLesson: "Next lesson",
    inThisLesson: "Texts in this lesson",
    positionInLevel: (i: string, total: string) => `Text ${i} of ${total} in this level`,
    positionInLesson: (i: string, total: string) => `Text ${i} of ${total}`,
    vocabHeading: "Vocabulary",
    dialogueHeading: "Dialogue",
    characters: "Character breakdown",
    example: "In a sentence",
    similar: "Don’t confuse with",
    showMore: "Character breakdown",
    showLess: "Hide breakdown",
    speakers: "Speakers",
    notFoundTitle: "That page isn’t here",
    notFoundBody:
      "The HSK track covers levels 1 to 3 for now. Check the level, lesson and text numbers, or start again from the level list.",
    notFoundCta: "Back to the HSK track",
    errorTitle: "This page didn’t load",
    errorBody: "Try again, or head back to the level list.",
    errorRetry: "Try again",
  },
  bn: {
    section: "এইচএসকে ট্র্যাক",
    indexTitle: "শিখতে থাকুন",
    indexTitleAccent: "এইচএসকে ভোকাবুলারি",
    indexLede:
      "আপনার এইচএসকে কোর্স বইয়ের শব্দগুলো — লেভেল ধরে, পাঠ ধরে। প্রতিটির সাথে পিনয়িন, বাংলা ও ইংরেজি অর্থ, অক্ষর বিশ্লেষণ আর একটি উদাহরণ। লাইভ ক্লাসের জন্য তৈরি।",
    levelWord: "শব্দ",
    levelLessons: "পাঠ",
    levelTexts: "টেক্সট",
    lesson: "পাঠ",
    text: "টেক্সট",
    words: "শব্দ",
    dialogue: "কথোপকথনসহ",
    glanceLessons: "পাঠ",
    glanceTexts: "টেক্সট",
    glanceWords: "শব্দ",
    soon: "আসছে",
    soonNote: "কোর্স এই লেভেলে পৌঁছালে শব্দগুলো যোগ করা হবে।",
    open: "খুলুন",
    start: "শুরু",
    lessonList: "পাঠসমূহ",
    textList: "এই পাঠের টেক্সটগুলো",
    levelOverview: (n: string) =>
      `এইচএসকে ${n}-এর পনেরোটি পাঠ, আপনার ক্লাস যে ক্রমে এগোয় সেভাবে সাজানো।`,
    lessonOverviewN: (count: string) =>
      `${count}টি ছোট টেক্সট। ক্লাস যেখানে রেখেছে সেখান থেকে শুরু করুন।`,
    breadcrumbHome: "এইচএসকে",
    home: "এইচএসকে ভোকাবুলারি",
    prevText: "আগেরটি",
    nextText: "পরেরটি",
    finishLesson: "পরের পাঠ",
    inThisLesson: "এই পাঠের টেক্সট",
    positionInLevel: (i: string, total: string) =>
      `এই লেভেলে ${total}-এর মধ্যে ${i} নং টেক্সট`,
    positionInLesson: (i: string, total: string) => `${total}-এর মধ্যে ${i} নং টেক্সট`,
    vocabHeading: "শব্দভাণ্ডার",
    dialogueHeading: "কথোপকথন",
    characters: "অক্ষর বিশ্লেষণ",
    example: "বাক্যে",
    similar: "যেগুলোর সাথে গুলিয়ে ফেলবেন না",
    showMore: "অক্ষর বিশ্লেষণ",
    showLess: "বিশ্লেষণ লুকান",
    speakers: "বক্তা",
    notFoundTitle: "এই পেজটি এখানে নেই",
    notFoundBody:
      "এইচএসকে ট্র্যাকে আপাতত লেভেল ১ থেকে ৩ আছে। লেভেল, পাঠ ও টেক্সট নম্বর মিলিয়ে দেখুন, অথবা লেভেল তালিকা থেকে আবার শুরু করুন।",
    notFoundCta: "এইচএসকে ট্র্যাকে ফিরে যান",
    errorTitle: "পেজটি লোড হয়নি",
    errorBody: "আবার চেষ্টা করুন, অথবা লেভেল তালিকায় ফিরে যান।",
    errorRetry: "আবার চেষ্টা করুন",
  },
} as const;

export type VocabularyCopy = (typeof vocabularyCopy)[Language];
