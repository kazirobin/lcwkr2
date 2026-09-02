// Lesson 4 - Text 1
import type { VocabularyData } from "@/features/vocabulary/types";

export const lesson4Text1Data: VocabularyData = {
  hskLevel: 1,

  lesson: 4,
  text: 1,
  dialogue: {
    title: "Yifei's Students",
    lines: [
      {
        speaker: "Liu Ming",
        hanzi: "一飞忙吗？",
        pinyin: "Yīfēi máng ma?",
        english: "Is Yifei busy?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "她很忙。",
        pinyin: "Tā hěn máng.",
        english: "She is very busy.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "她有多少个学生？",
        pinyin: "Tā yǒu duōshao gè xuéshēng?",
        english: "How many students does she have?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "她有二十个学生。",
        pinyin: "Tā yǒu èrshí gè xuéshēng.",
        english: "She has twenty students.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "有",
      pinyin: "yǒu",
      english: "To have / There is / There are",
      bangla: "থাকা/আছে",
      characters: [
        {
          hanzi: "有",
          pinyin: "yǒu",
          meaning: "Have, exist, possess",
        },
      ],
      example: {
        hanzi: "我有一本书。",
        pinyin: "Wǒ yǒu yī běn shū.",
        english: "I have a book.",
        bangla: "আমার একটি বই আছে।",
      },
      similar: [
        {
          hanzi: "拥有",
          pinyin: "yōngyǒu",
          english: "To possess (formal)",
        },
        {
          hanzi: "存在",
          pinyin: "cúnzài",
          english: "To exist",
        },
      ],
    },
    {
      hanzi: "多少",
      pinyin: "duōshǎo",
      english: "How many / How much (with measure words)",
      bangla: "কত",
      characters: [
        {
          hanzi: "多",
          pinyin: "duō",
          meaning: "Many/Much",
        },
        {
          hanzi: "少",
          pinyin: "shǎo",
          meaning: "Few/Little",
        },
      ],
      example: {
        hanzi: "你有多少本书？",
        pinyin: "Nǐ yǒu duōshǎo běn shū?",
        english: "How many books do you have?",
        bangla: "তোমার কতগুলো বই আছে?",
      },
      similar: [
        {
          hanzi: "几",
          pinyin: "jǐ",
          english: "How many (small numbers, under 10)",
        },
      ],
    },
    {
      hanzi: "个",
      pinyin: "gè",
      english: "Generic measure word",
      bangla: "টি/জন (গণনাবাচক শব্দ)",
      characters: [
        {
          hanzi: "个",
          pinyin: "gè",
          meaning: "Generic measure word",
        },
      ],
      example: {
        hanzi: "一个人",
        pinyin: "yī gè rén",
        english: "One person",
        bangla: "একজন ব্যক্তি",
      },
      similar: [
        {
          hanzi: "位",
          pinyin: "wèi",
          english: "Polite measure word for people",
        },
        {
          hanzi: "只",
          pinyin: "zhī",
          english: "Measure word for animals, one of a pair",
        },
      ],
    },
  ],
};
