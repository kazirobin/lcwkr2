// app/data/vocabulary/lesson7-text3.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson7text3: VocabularyData = {
  hskLevel: 2,
  lesson: 7,
  text: 3,
  dialogue: {
    title: "How Well Do You Play Sports?",
    lines: [
      {
        speaker: "Chen Tianzhong",
        hanzi: "你篮球打得怎么样？",
        pinyin: "Nǐ lánqiú dǎ de zěnmeyàng?",
        english: "How well do you play basketball?",
      },
      {
        speaker: "Anni",
        hanzi: "打得还可以。",
        pinyin: "Dǎ de hái kěyǐ.",
        english: "I'm pretty good at it.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "跑步呢？你跑得快不快？",
        pinyin: "Pǎobù ne? Nǐ pǎo de kuài bu kuài?",
        english: "What about running? Do you run fast?",
      },
      {
        speaker: "Anni",
        hanzi: "我跑得不快，也不太喜欢跑步。",
        pinyin: "Wǒ pǎo de bú kuài, yě bú tài xǐhuan pǎobù.",
        english: "I don't run fast, and I don't really like running either.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "那你喜欢游泳吗？",
        pinyin: "Nà nǐ xǐhuan yóuyǒng ma?",
        english: "Then do you like swimming?",
      },
      {
        speaker: "Anni",
        hanzi: "喜欢，但我游泳游得不快。",
        pinyin: "Xǐhuan, dàn wǒ yóuyǒng yóu de bú kuài.",
        english: "Yes, but I don't swim fast.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "跑步",
      pinyin: "pǎobù",
      english: "Running/Jogging",
      bangla: "দৌড়ানো/জগিং",
      characters: [
        { hanzi: "跑", pinyin: "pǎo", meaning: "Run" },
        { hanzi: "步", pinyin: "bù", meaning: "Step" },
      ],
      example: {
        hanzi: "我每天早上跑步。",
        pinyin: "Wǒ měitiān zǎoshang pǎobù.",
        english: "I run every morning.",
        bangla: "আমি প্রতিদিন সকালে দৌড়াই।",
      },
      similar: [{ hanzi: "奔跑", pinyin: "bēnpǎo", english: "Run" }],
    },
    {
      hanzi: "游泳",
      pinyin: "yóuyǒng",
      english: "Swimming",
      bangla: "সাঁতার কাটা",
      characters: [
        { hanzi: "游", pinyin: "yóu", meaning: "Swim/Roam" },
        { hanzi: "泳", pinyin: "yǒng", meaning: "Swim" },
      ],
      example: {
        hanzi: "他很喜欢游泳。",
        pinyin: "Tā hěn xǐhuān yóuyǒng.",
        english: "He likes swimming very much.",
        bangla: "সে সাঁতার কাটতে খুব পছন্দ করে।",
      },
      similar: [{ hanzi: "游水", pinyin: "yóushuǐ", english: "Swim" }],
    },
    {
      hanzi: "游",
      pinyin: "yóu",
      english: "To swim/roam",
      bangla: "সাঁতার কাটা/ঘুরে বেড়ানো",
      characters: [
        { hanzi: "氵", pinyin: "shuǐ", meaning: "Water" },
        { hanzi: "方", pinyin: "fāng", meaning: "Direction" },
      ],
      example: {
        hanzi: "鱼在水里游。",
        pinyin: "Yú zài shuǐ lǐ yóu.",
        english: "Fish swim in the water.",
        bangla: "মাছ পানিতে সাঁতার কাটে।",
      },
      similar: [{ hanzi: "泳", pinyin: "yǒng", english: "Swim" }],
    },
  ],
};
