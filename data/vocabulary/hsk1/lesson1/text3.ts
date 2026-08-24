// app/data/vocabularyData.ts

import type { VocabularyData } from "@/types/vocabulary";

// Lesson 1 - Text 3
export const lesson1Text3Data: VocabularyData = {
  hskLevel: 1,
  lesson: 1,
  text: 3,
  dialogue: {
    title: "Thank You & Goodbye",
    lines: [
      {
        speaker: "Students",
        hanzi: "谢谢！",
        pinyin: "Xièxie!",
        english: "Thank you!",
      },
      {
        speaker: "Xiaoyu",
        hanzi: "不客气！",
        pinyin: "Bú kèqi!",
        english: "You're welcome!",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "同学们，再见！",
        pinyin: "Tóngxuémen, zàijiàn!",
        english: "Goodbye, students!",
      },
      {
        speaker: "Students",
        hanzi: "老师，再见！",
        pinyin: "Lǎoshī, zàijiàn!",
        english: "Goodbye, teacher!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "谢谢",
      pinyin: "xièxie",
      english: "Thank you",
      bangla: "ধন্যবাদ",
      characters: [
        {
          hanzi: "谢",
          pinyin: "xiè",
          meaning: "Thank",
        },
      ],
      example: {
        hanzi: "谢谢你！",
        pinyin: "Xièxie nǐ!",
        english: "Thank you!",
        bangla: "ধন্যবাদ!",
      },
      similar: [
        {
          hanzi: "多谢",
          pinyin: "duōxiè",
          english: "Many thanks",
        },
      ],
    },
    {
      hanzi: "不客气",
      pinyin: "bú kèqi",
      english: "You're welcome",
      bangla: "স্বাগতম",
      characters: [
        {
          hanzi: "不",
          pinyin: "bù",
          meaning: "Not",
        },
        {
          hanzi: "客气",
          pinyin: "kèqi",
          meaning: "Polite",
        },
      ],
      example: {
        hanzi: "不客气！",
        pinyin: "Bú kèqi!",
        english: "You're welcome!",
        bangla: "স্বাগতম!",
      },
      similar: [
        {
          hanzi: "没关系",
          pinyin: "méi guānxi",
          english: "It doesn't matter",
        },
      ],
    },
    {
      hanzi: "同学",
      pinyin: "tóngxué",
      english: "Classmate",
      bangla: "সহপাঠী",
      characters: [
        {
          hanzi: "同",
          pinyin: "tóng",
          meaning: "Same",
        },
        {
          hanzi: "学",
          pinyin: "xué",
          meaning: "Study",
        },
      ],
      example: {
        hanzi: "他是我的同学。",
        pinyin: "Tā shì wǒ de tóngxué.",
        english: "He is my classmate.",
        bangla: "সে আমার সহপাঠী।",
      },
      similar: [
        {
          hanzi: "朋友",
          pinyin: "péngyou",
          english: "Friend",
        },
      ],
    },
    {
      hanzi: "再见",
      pinyin: "zàijiàn",
      english: "Goodbye",
      bangla: "বিদায়",
      characters: [
        {
          hanzi: "再",
          pinyin: "zài",
          meaning: "Again",
        },
        {
          hanzi: "见",
          pinyin: "jiàn",
          meaning: "See",
        },
      ],
      example: {
        hanzi: "再见！",
        pinyin: "Zàijiàn!",
        english: "Goodbye!",
        bangla: "বিদায়!",
      },
      similar: [
        {
          hanzi: "拜拜",
          pinyin: "bàibài",
          english: "Bye-bye",
        },
      ],
    },
  ],
};
