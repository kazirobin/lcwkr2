// Types for the Bangla → Chinese Translator feature

export interface TranslateWord {
  hanzi: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
}

export interface TranslateSentence {
  chinese: string;
  pinyin: string;
  meaningEn: string;
  meaningBn: string;
}

export interface Topic {
  id: string;
  nameEn: string;
  nameBn: string;
  icon: string;
  words: TranslateWord[];
  sentences: TranslateSentence[];
}

export interface TranslateResult {
  query: string;
  words: TranslateWord[];
  sentences: TranslateSentence[];
  topics: Topic[];
}