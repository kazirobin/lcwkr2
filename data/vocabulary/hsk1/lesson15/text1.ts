// Lesson 15 - Text 1
import type { VocabularyData } from "@/types/vocabulary";

export const lesson15Text1Data: VocabularyData = {
  hskLevel: 1,

  lesson: 15,
  text: 1,
  dialogue: {
    title: "Chinese Food",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "你们爱吃哪个菜？",
        pinyin: "Nǐmen ài chī nǎge cài?",
        english: "Which dish do you like to eat?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我喜欢这个，也喜欢那个。",
        pinyin: "Wǒ xǐhuan zhège, yě xǐhuan nàge.",
        english: "I like this one, and I also like that one.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "这些菜都好吃，还很好看。",
        pinyin: "Zhèxiē cài dōu hǎochī, hái hěn hǎokàn.",
        english:
          "All these dishes are delicious, and they also look very nice.",
      },
      {
        speaker: "Li Wen",
        hanzi: "我爱吃中国菜，也喜欢做。大家多吃点儿。",
        pinyin: "Wǒ ài chī Zhōngguó cài, yě xǐhuan zuò. Dàjiā duō chī diǎnr.",
        english:
          "I love eating Chinese food, and I also like cooking it. Everyone, eat a little more.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "爱",
      pinyin: "ài",
      english: "Like / Love",
      bangla: "পছন্দ করা/ভালোবাসা",
      characters: [
        {
          hanzi: "爫",
          pinyin: "zhǎo",
          meaning: "Claw",
        },
        {
          hanzi: "冖",
          pinyin: "mì",
          meaning: "Cover",
        },
        {
          hanzi: "友",
          pinyin: "yǒu",
          meaning: "Friend",
        },
      ],
      example: {
        hanzi: "我爱吃中国菜。",
        pinyin: "Wǒ ài chī Zhōngguó cài.",
        english: "I love eating Chinese food.",
        bangla: "আমি চাইনিজ খাবার খেতে ভালোবাসি।",
      },
      similar: [
        {
          hanzi: "喜欢",
          pinyin: "xǐhuān",
          english: "Like",
        },
      ],
    },
    {
      hanzi: "哪个",
      pinyin: "nǎge",
      english: "Which one",
      bangla: "কোনটি",
      characters: [
        {
          hanzi: "哪",
          pinyin: "nǎ",
          meaning: "Which",
        },
        {
          hanzi: "个",
          pinyin: "ge",
          meaning: "Measure word",
        },
      ],
      example: {
        hanzi: "你喜欢哪个？",
        pinyin: "Nǐ xǐhuān nǎge?",
        english: "Which one do you like?",
        bangla: "তুমি কোনটি পছন্দ কর?",
      },
      similar: [
        {
          hanzi: "哪",
          pinyin: "nǎ",
          english: "Which",
        },
      ],
    },
  ],
};
