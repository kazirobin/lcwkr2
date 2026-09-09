// Isolated home of the current paid surface (Chinese Core Word Builder).
// The page runs entirely on LOCAL data (features/chinese-words/data) —
// no MongoDB. Server code and models remain for a future migration.
export { default as ProSubscriptionForm } from "./components/ProSubscriptionForm";
export {
  CHINESE_WORDS,
  LESSON_WORDS,
  LESSON_LEVELS,
  getLessonWords,
  buildKnownWordSet,
  findWordEntry,
} from "./data";
export type {
  ChineseWordEntry,
  RelatedWord,
  WordExample,
  LessonWord,
} from "./types";
