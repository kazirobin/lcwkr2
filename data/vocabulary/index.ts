// app/data/vocabulary/index.ts
import {
  VocabularyData,
  VocabularyDataMap,
  LevelInfo,
  LevelTextKey,
} from "@/types/vocabulary";


import { hsk2DataMap } from "./hsk2";
import { hsk1DataMap } from "./hsk1";
import { hsk3DataMap } from "./hsk3";

// ============ DATA MAP ============

export const vocabularyDataMap: VocabularyDataMap = {
  ...hsk1DataMap,
  ...hsk2DataMap,
  ...hsk3DataMap,
};
// ============= HELPER FUNCTIONS =============

// Get all unique HSK levels
export function getAllLevels(): number[] {
  const levels = new Set<number>();
  Object.values(vocabularyDataMap).forEach((data) => {
    levels.add(data.hskLevel || data.lesson);
  });
  return Array.from(levels).sort((a, b) => a - b);
}

// Get all texts for a specific HSK level
export function getTextsForLevel(hskLevel: number): number[] {
  const texts = new Set<number>();
  Object.values(vocabularyDataMap).forEach((data) => {
    const level = data.hskLevel || data.lesson;
    if (level === hskLevel) {
      texts.add(data.text);
    }
  });
  return Array.from(texts).sort((a, b) => a - b);
}

// Get data for a specific lesson and text
export function getLessonTextData(
  level: number,
  lesson: number,
  text: number,
): VocabularyData | undefined {
  // Search through all entries
  for (const [key, data] of Object.entries(vocabularyDataMap)) {
    const hskLevel = data.hskLevel || data.lesson;
    if (hskLevel === level && data.lesson === lesson && data.text === text) {
      return data;
    }
  }
  return undefined;
}

// Get all lesson numbers for a specific HSK level
export function getLessonsForLevel(hskLevel: number): number[] {
  const lessons = new Set<number>();
  Object.values(vocabularyDataMap).forEach((data) => {
    const level = data.hskLevel || data.lesson;
    if (level === hskLevel) {
      lessons.add(data.lesson);
    }
  });
  return Array.from(lessons).sort((a, b) => a - b);
}

// Get all texts for a specific lesson
export function getTextsForLesson(hskLevel: number, lesson: number): number[] {
  const texts = new Set<number>();
  Object.values(vocabularyDataMap).forEach((data) => {
    const level = data.hskLevel || data.lesson;
    if (level === hskLevel && data.lesson === lesson) {
      texts.add(data.text);
    }
  });
  return Array.from(texts).sort((a, b) => a - b);
}

// Get lesson data with texts for a specific HSK level
export function getLevelLessonData(hskLevel: number): {
  lesson: number;
  texts: number[];
  totalVocabulary: number;
}[] {
  const lessonMap = new Map<
    number,
    { texts: Set<number>; vocabularyCount: number }
  >();

  Object.values(vocabularyDataMap).forEach((data) => {
    const level = data.hskLevel || data.lesson;
    if (level === hskLevel) {
      const lesson = data.lesson;
      if (!lessonMap.has(lesson)) {
        lessonMap.set(lesson, {
          texts: new Set<number>(),
          vocabularyCount: 0,
        });
      }
      const lessonData = lessonMap.get(lesson)!;
      lessonData.texts.add(data.text);
      lessonData.vocabularyCount += data.vocabulary.length;
    }
  });

  return Array.from(lessonMap.entries())
    .map(([lesson, data]) => ({
      lesson,
      texts: Array.from(data.texts).sort((a, b) => a - b),
      totalVocabulary: data.vocabularyCount,
    }))
    .sort((a, b) => a.lesson - b.lesson);
}

// Get all vocabulary data as array
export function getAllVocabularyData(): VocabularyData[] {
  return Object.values(vocabularyDataMap);
}

// Get level information
export function getLevelInfo(): LevelInfo[] {
  const levelMap = new Map<number, number[]>();

  Object.values(vocabularyDataMap).forEach((data) => {
    const level = data.hskLevel || data.lesson;
    const texts = levelMap.get(level) || [];
    texts.push(data.text);
    levelMap.set(level, texts);
  });

  return Array.from(levelMap.entries())
    .map(([level, texts]) => ({
      level,
      texts: texts.sort((a, b) => a - b),
    }))
    .sort((a, b) => a.level - b.level);
}

// Get next and previous navigation info
export function getNavigationInfo(
  level: number,
  text: number,
): {
  prevText: LevelTextKey | null;
  nextText: LevelTextKey | null;
  currentLevel: number;
  currentText: number;
} {
  const allData = Object.entries(vocabularyDataMap).sort(([keyA], [keyB]) => {
    const partsA = keyA.split("-").map(Number);
    const partsB = keyB.split("-").map(Number);
    const levelA = partsA[0];
    const levelB = partsB[0];
    if (levelA !== levelB) return levelA - levelB;
    return partsA[partsA.length - 1] - partsB[partsB.length - 1];
  });

  const currentKey = `${level}-${text}` as LevelTextKey;
  const currentIndex = allData.findIndex(([key]) => key === currentKey);

  if (currentIndex === -1) {
    return {
      prevText: null,
      nextText: null,
      currentLevel: level,
      currentText: text,
    };
  }

  const prevKey =
    currentIndex > 0 ? (allData[currentIndex - 1][0] as LevelTextKey) : null;
  const nextKey =
    currentIndex < allData.length - 1
      ? (allData[currentIndex + 1][0] as LevelTextKey)
      : null;

  return {
    prevText: prevKey,
    nextText: nextKey,
    currentLevel: level,
    currentText: text,
  };
}

// Get navigation info within the same level only
export function getLevelNavigationInfo(
  hskLevel: number,
  text: number,
): {
  prevText: number | null;
  nextText: number | null;
  totalTexts: number;
  currentIndex: number;
} {
  const texts = getTextsForLevel(hskLevel);
  const currentIndex = texts.indexOf(text);

  if (currentIndex === -1) {
    return {
      prevText: null,
      nextText: null,
      totalTexts: texts.length,
      currentIndex: -1,
    };
  }

  return {
    prevText: currentIndex > 0 ? texts[currentIndex - 1] : null,
    nextText: currentIndex < texts.length - 1 ? texts[currentIndex + 1] : null,
    totalTexts: texts.length,
    currentIndex: currentIndex,
  };
}

// Check if a level-text combination exists
export function isValidLevelText(level: number, text: number): boolean {
  const key = `${level}-${text}` as LevelTextKey;
  return key in vocabularyDataMap;
}

// Get total count of vocabulary items in a level
export function getVocabularyCountForLevel(hskLevel: number): number {
  let total = 0;
  Object.values(vocabularyDataMap).forEach((data) => {
    const level = data.hskLevel || data.lesson;
    if (level === hskLevel) {
      total += data.vocabulary.length;
    }
  });
  return total;
}

// Get all text keys for a level
export function getTextKeysForLevel(hskLevel: number): string[] {
  return getTextsForLevel(hskLevel).map((text) => `${hskLevel}-${text}`);
}

// Get total number of lessons for a specific HSK level
export function getTotalLessonsForLevel(hskLevel: number): number {
  return getLessonsForLevel(hskLevel).length;
}

// Get all lessons data for a specific HSK level with details
export function getDetailedLevelData(hskLevel: number): {
  level: number;
  lessons: {
    lesson: number;
    texts: number[];
    vocabulary: VocabularyData[];
  }[];
  totalVocabulary: number;
  totalTexts: number;
} {
  const lessons = getLevelLessonData(hskLevel);
  let totalVocabulary = 0;
  let totalTexts = 0;

  const detailedLessons = lessons.map((lessonData) => {
    const vocabularyData = lessonData.texts
      .map((text) => getLessonTextData(hskLevel, lessonData.lesson, text))
      .filter((data): data is VocabularyData => data !== undefined);

    totalVocabulary += lessonData.totalVocabulary;
    totalTexts += lessonData.texts.length;

    return {
      lesson: lessonData.lesson,
      texts: lessonData.texts,
      vocabulary: vocabularyData,
    };
  });

  return {
    level: hskLevel,
    lessons: detailedLessons,
    totalVocabulary,
    totalTexts,
  };
}

// Search vocabulary across all levels
export function searchVocabulary(searchTerm: string): {
  level: number;
  lesson: number;
  text: number;
  items: VocabularyData["vocabulary"];
}[] {
  const results: {
    level: number;
    lesson: number;
    text: number;
    items: VocabularyData["vocabulary"];
  }[] = [];

  const term = searchTerm.toLowerCase();

  Object.values(vocabularyDataMap).forEach((data) => {
    const matchingItems = data.vocabulary.filter(
      (item) =>
        item.hanzi.includes(term) ||
        item.pinyin.toLowerCase().includes(term) ||
        item.english.toLowerCase().includes(term) ||
        item.bangla.includes(term),
    );

    if (matchingItems.length > 0) {
      const level = data.hskLevel || data.lesson;
      results.push({
        level,
        lesson: data.lesson,
        text: data.text,
        items: matchingItems,
      });
    }
  });

  return results;
}

// Get statistics for all levels
export function getVocabularyStats(): {
  totalLevels: number;
  totalLessons: number;
  totalTexts: number;
  totalVocabulary: number;
  levelStats: {
    level: number;
    lessons: number;
    texts: number;
    vocabulary: number;
  }[];
} {
  const levels = getAllLevels();
  let totalLessons = 0;
  let totalTexts = 0;
  let totalVocabulary = 0;

  const levelStats = levels.map((level) => {
    const lessons = getLessonsForLevel(level);
    const texts = getTextsForLevel(level);
    const vocabulary = getVocabularyCountForLevel(level);

    totalLessons += lessons.length;
    totalTexts += texts.length;
    totalVocabulary += vocabulary;

    return {
      level,
      lessons: lessons.length,
      texts: texts.length,
      vocabulary,
    };
  });

  return {
    totalLevels: levels.length,
    totalLessons,
    totalTexts,
    totalVocabulary,
    levelStats,
  };
}
