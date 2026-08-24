// app/data/vocabulary/lesson3-text2.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson3text2: VocabularyData = {
  hskLevel: 2,
  lesson: 3,
  text: 2,
  dialogue: {
    title: "Planning a Trip",
    lines: [
      {
        speaker: "Liu Ming",
        hanzi: "吃个苹果吧，我都洗好了。",
        pinyin: "Chī ge píngguǒ ba, wǒ dōu xǐhǎo le.",
        english: "Have an apple. I've already washed them.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "好的。",
        pinyin: "Hǎo de.",
        english: "Okay.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "就在桌子上，你自己拿。",
        pinyin: "Jiù zài zhuōzi shàng, nǐ zìjǐ ná.",
        english: "They're right on the table. Take one yourself.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "我去洗洗手。对了，我们去西安旅游，怎么样？",
        pinyin: "Wǒ qù xǐxi shǒu. Duì le, wǒmen qù Xī'ān lǚyóu, zěnmeyàng?",
        english:
          "I'll go wash my hands. By the way, how about we travel to Xi'an?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "为什么想去西安？",
        pinyin: "Wèi shénme xiǎng qù Xī'ān?",
        english: "Why do you want to go to Xi'an?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "我看了看网上的介绍，这个时候去西安很好！",
        pinyin:
          "Wǒ kàn le kàn wǎngshàng de jièshào, zhège shíhou qù Xī'ān hěn bùcuò!",
        english:
          "I looked at some information online. It's really nice to go to Xi'an at this time!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "一起",
      pinyin: "yìqǐ",
      english: "Together",
      bangla: "একসাথে",
      characters: [
        { hanzi: "一", pinyin: "yī", meaning: "One" },
        { hanzi: "起", pinyin: "qǐ", meaning: "Rise/Start" },
      ],
      example: {
        hanzi: "我们一起去吃饭吧。",
        pinyin: "Wǒmen yìqǐ qù chīfàn ba.",
        english: "Let's go eat together.",
        bangla: "চলো আমরা একসাথে খেতে যাই।",
      },
      similar: [{ hanzi: "一同", pinyin: "yìtóng", english: "Together" }],
    },
    {
      hanzi: "出去",
      pinyin: "chūqù",
      english: "Go out",
      bangla: "বাইরে যাওয়া",
      characters: [
        { hanzi: "出", pinyin: "chū", meaning: "Go out" },
        { hanzi: "去", pinyin: "qù", meaning: "Go" },
      ],
      example: {
        hanzi: "他已经出去了。",
        pinyin: "Tā yǐjīng chūqù le.",
        english: "He has already gone out.",
        bangla: "সে ইতিমধ্যেই বাইরে চলে গেছে।",
      },
      similar: [{ hanzi: "外出", pinyin: "wàichū", english: "Go out" }],
    },
  ],
};
