// Isolated home of the current paid surface (Chinese Core Word Builder).
// The page runs entirely on LOCAL data (features/chinese-words/data) —
// no MongoDB. Server code and models remain for a future migration.
export { default as ProSubscriptionForm } from "./components/ProSubscriptionForm";
export { default as PracticeGame } from "./components/PracticeGame";
export {
  CHINESE_WORDS,
  WORDS_BY_LEVEL,
  WORD_LEVELS,
  LESSON_WORDS,
  LESSON_LEVELS,
  getLessonWords,
  buildKnownWordSet,
  findWordEntry,
  searchWords,
  searchTokens,
  makeSearchCorpus,
  stripTones,
} from "./data";
export type {
  ChineseWordEntry,
  RelatedWord,
  WordExample,
  LessonWord,
} from "./types";
