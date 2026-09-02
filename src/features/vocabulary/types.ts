// app/types/vocabulary.ts

// Character breakdown of a Chinese character
export interface Character {
  hanzi: string;      // The Chinese character
  pinyin: string;     // Pronunciation
  meaning: string;    // Meaning in English
}

// Similar word for comparison
export interface SimilarWord {
  hanzi: string;      // The similar word
  pinyin: string;     // Pronunciation
  english: string;    // English meaning
}

// Example sentence
export interface Example {
  hanzi: string;      // Chinese sentence
  pinyin: string;     // Pinyin
  english: string;    // English translation
  bangla: string;     // Bengali translation
}

// Individual vocabulary item
export interface VocabularyItem {
  hanzi: string;               // The main word
  pinyin: string;              // Pronunciation
  english: string;             // English meaning
  bangla: string;              // Bengali meaning
  characters: Character[];     // Character breakdown
  example: Example;           // Example sentence
  similar: SimilarWord[];     // Similar words
}

// Dialogue line
export interface DialogueLine {
  speaker: string;     // Who is speaking
  hanzi: string;       // Chinese text
  pinyin: string;      // Pinyin
  english: string;     // English translation
}

// Dialogue section
export interface Dialogue {
  title: string;       // Title of the dialogue
  lines: DialogueLine[]; // All dialogue lines
}

// Complete vocabulary data for a lesson-text
export interface VocabularyData {
  hskLevel: number;      // HSK level (1-6)
  lesson: number;      // HSK level (1-6)
  text: number;        // Text number within the lesson
  dialogue?: Dialogue; // Optional dialogue
  vocabulary: VocabularyItem[]; // All vocabulary items
}

// Map for all vocabulary data (key: "level-text")
export interface VocabularyDataMap {
  [key: string]: VocabularyData;
}

// Navigation item for breadcrumbs
export interface NavItem {
  label: string;
  href: string;
  isActive: boolean;
}

// Component props
export interface VocabularyListProps {
  data: VocabularyData;
  level: string;
  text: string;
}

export interface VocabularyCardProps {
  vocabulary: VocabularyItem;
}

export interface DialogueComponentProps {
  dialogue: Dialogue;
}

// Utility types
export type LevelTextKey = `${number}-${number}`; // e.g., "1-1", "2-3"

export interface LevelInfo {
  level: number;
  texts: number[];
}

export interface NavigationInfo {
  currentLevel: number;
  currentText: number;
  totalLevels: number[];
  textsInLevel: number[];
  prevText?: LevelTextKey;
  nextText?: LevelTextKey;
}