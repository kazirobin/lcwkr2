// Client-safe domain types for the Chinese Core Word Builder.
// `ChineseWordEntry` mirrors the ChineseWord Mongo model
// (features/chinese-words/models/ChineseWord.ts) so a future Mongo
// migration needs no shape change — but the page runs on LOCAL data.

export interface WordExample {
  chinese: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
  type?: string;
}

export interface RelatedWord {
  word: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
  wordType?: string;
  hskLevel?: number;
  examples?: WordExample[];
}

export interface ChineseWordEntry {
  character: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
  descriptionEn?: string;
  descriptionBn?: string;
  hskLevel?: number;
  strokeCount?: number;
  relatedWords: RelatedWord[];
}

/** One lesson word derived from the HSK vocabulary data. */
export interface LessonWord {
  level: number;
  lesson: number;
  text: number;
  hanzi: string;
  pinyin: string;
  en: string;
  bn: string;
}
