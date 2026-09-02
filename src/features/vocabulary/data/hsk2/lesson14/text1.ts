// app/data/vocabulary/lesson14-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson14text1: VocabularyData = {
  hskLevel: 2,
  lesson: 14,
  text: 1,
  dialogue: {
    title: "Someone Downstairs",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "王老师，你家楼下站着一个人。",
        pinyin: "Wáng lǎoshī, nǐ jiā lóu xià zhànzhe yí ge rén.",
        english:
          "Teacher Wang, there is someone standing downstairs at your home.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "我家楼下？我看看。",
        pinyin: "Wǒ jiā lóu xià? Wǒ kànkan.",
        english: "Downstairs at my home? Let me have a look.",
      },
      {
        speaker: "Li Wen",
        hanzi: "那个人穿着黑色的裤子，手里还拿着一个黑色的包。",
        pinyin:
          "Nàge rén chuānzhe hēisè de kùzi, shǒuli hái názhe yí ge hēisè de bāo.",
        english:
          "That person is wearing black pants and is also holding a black bag.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "我看见那个人了，他是我男朋友。",
        pinyin: "Wǒ kànjiàn nàge rén le, tā shì wǒ nánpéngyou.",
        english: "I see that person. He is my boyfriend.",
      },
      {
        speaker: "Li Wen",
        hanzi: "那我们快过去吧。",
        pinyin: "Nà wǒmen kuài guòqù ba.",
        english: "Then let's go over there quickly.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "站",
      pinyin: "zhàn",
      english: "To stand",
      bangla: "দাঁড়ানো",
      characters: [
        { hanzi: "立", pinyin: "lì", meaning: "Stand" },
        { hanzi: "占", pinyin: "zhàn", meaning: "Occupy" },
      ],
      example: {
        hanzi: "他在楼下站着。",
        pinyin: "Tā zài lóuxià zhànzhe.",
        english: "He is standing downstairs.",
        bangla: "সে নিচতলায় দাঁড়িয়ে আছে।",
      },
      similar: [{ hanzi: "立", pinyin: "lì", english: "Stand" }],
    },
    {
      hanzi: "包",
      pinyin: "bāo",
      english: "Bag/Wrap",
      bangla: "ব্যাগ/জড়ানো",
      characters: [
        { hanzi: "勹", pinyin: "bāo", meaning: "Wrap" },
        { hanzi: "己", pinyin: "jǐ", meaning: "Self" },
      ],
      example: {
        hanzi: "他手里拿着一个黑色的包。",
        pinyin: "Tā shǒu lǐ názhe yīgè hēisè de bāo.",
        english: "He is holding a black bag in his hand.",
        bangla: "সে হাতে একটি কালো ব্যাগ ধরে আছে।",
      },
      similar: [{ hanzi: "袋", pinyin: "dài", english: "Bag" }],
    },
  ],
};
