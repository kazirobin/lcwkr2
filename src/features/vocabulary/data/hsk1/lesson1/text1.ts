// app/data/vocabulary/lesson1-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const lesson1Text1Data: VocabularyData = {
  hskLevel: 1,
  lesson: 1,
  text: 1,
  dialogue: {
    title: "First Meeting",
    lines: [
      {
        speaker: "A",
        hanzi: "你好！",
        pinyin: "Nǐ hǎo!",
        english: "Hello!",
      },
      {
        speaker: "B",
        hanzi: "你好！",
        pinyin: "Nǐ hǎo!",
        english: "Hello!",
      },
      {
        speaker: "A",
        hanzi: "我叫小明。",
        pinyin: "Wǒ jiào Xiǎo Míng.",
        english: "My name is Xiao Ming.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "你",
      pinyin: "nǐ",
      english: "You",
      bangla: "তুমি",
      characters: [{ hanzi: "你", pinyin: "nǐ", meaning: "You" }],
      example: {
        hanzi: "你好！",
        pinyin: "Nǐ hǎo!",
        english: "Hello!",
        bangla: "হ্যালো!",
      },
      similar: [{ hanzi: "您", pinyin: "nín", english: "You (polite)" }],
    },
    {
      hanzi: "好",
      pinyin: "hǎo",
      english: "Good",
      bangla: "ভালো",
      characters: [
        { hanzi: "女", pinyin: "nǚ", meaning: "Woman" },
        { hanzi: "子", pinyin: "zǐ", meaning: "Child" },
      ],
      example: {
        hanzi: "很好。",
        pinyin: "Hěn hǎo.",
        english: "Very good.",
        bangla: "খুব ভালো।",
      },
      similar: [{ hanzi: "棒", pinyin: "bàng", english: "Great/Awesome" }],
    },
    {
      hanzi: "叫",
      pinyin: "jiào",
      english: "To be called",
      bangla: "ডাকা হয়",
      characters: [{ hanzi: "叫", pinyin: "jiào", meaning: "Call/Name" }],
      example: {
        hanzi: "我叫小明。",
        pinyin: "Wǒ jiào Xiǎo Míng.",
        english: "My name is Xiao Ming.",
        bangla: "আমার নাম জিয়াও মিং।",
      },
      similar: [{ hanzi: "名字", pinyin: "míngzi", english: "Name" }],
    },
  ],
};
