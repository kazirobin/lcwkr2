// app/data/vocabulary/lesson3-text3.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson3text3: VocabularyData = {
  hskLevel: 2,
  lesson: 3,
  text: 3,
  dialogue: {
    title: "Going to Xi'an",
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
      hanzi: "洗",
      pinyin: "xǐ",
      english: "Wash",
      bangla: "ধোয়া",
      characters: [
        { hanzi: "氵", pinyin: "shuǐ", meaning: "Water" },
        { hanzi: "先", pinyin: "xiān", meaning: "Before/First" },
      ],
      example: {
        hanzi: "我去洗手。",
        pinyin: "Wǒ qù xǐshǒu.",
        english: "I am going to wash my hands.",
        bangla: "আমি হাত ধুতে যাচ্ছি।",
      },
      similar: [{ hanzi: "刷", pinyin: "shuā", english: "Brush/Clean" }],
    },
    {
      hanzi: "自己",
      pinyin: "zìjǐ",
      english: "Oneself",
      bangla: "নিজে/আত্ম",
      characters: [
        { hanzi: "自", pinyin: "zì", meaning: "Self" },
        { hanzi: "己", pinyin: "jǐ", meaning: "Personal" },
      ],
      example: {
        hanzi: "我自己去学校。",
        pinyin: "Wǒ zìjǐ qù xuéxiào.",
        english: "I go to school by myself.",
        bangla: "আমি নিজে স্কুলে যাই।",
      },
      similar: [{ hanzi: "自身", pinyin: "zìshēn", english: "Oneself" }],
    },
    {
      hanzi: "拿",
      pinyin: "ná",
      english: "Take/Hold",
      bangla: "নেওয়া/ধরা",
      characters: [
        { hanzi: "合", pinyin: "hé", meaning: "Combine" },
        { hanzi: "手", pinyin: "shǒu", meaning: "Hand" },
      ],
      example: {
        hanzi: "请拿这一本书。",
        pinyin: "Qǐng ná zhè yī běn shū.",
        english: "Please take this book.",
        bangla: "অনুগ্রহ করে এই বইটি নিন।",
      },
      similar: [{ hanzi: "带", pinyin: "dài", english: "Bring/Take along" }],
    },
    {
      hanzi: "手",
      pinyin: "shǒu",
      english: "Hand",
      bangla: "হাত",
      characters: [{ hanzi: "手", pinyin: "shǒu", meaning: "Hand" }],
      example: {
        hanzi: "你的手很冷。",
        pinyin: "Nǐ de shǒu hěn lěng.",
        english: "Your hands are very cold.",
        bangla: "তোমার হাত খুব ঠান্ডা।",
      },
      similar: [{ hanzi: "掌", pinyin: "zhǎng", english: "Palm" }],
    },
    {
      hanzi: "为什么",
      pinyin: "wèishénme",
      english: "Why",
      bangla: "কেন",
      characters: [
        { hanzi: "为", pinyin: "wèi", meaning: "For" },
        { hanzi: "什么", pinyin: "shénme", meaning: "What" },
      ],
      example: {
        hanzi: "你为什么没来？",
        pinyin: "Nǐ wèishénme méi lái?",
        english: "Why didn't you come?",
        bangla: "তুমি কেন আসোনি?",
      },
      similar: [{ hanzi: "怎么", pinyin: "zěnme", english: "Why/How" }],
    },
    {
      hanzi: "不错",
      pinyin: "búcuò",
      english: "Not bad/Pretty good",
      bangla: "বেশ ভালো/খারাপ না",
      characters: [
        { hanzi: "不", pinyin: "bù", meaning: "Not" },
        { hanzi: "错", pinyin: "cuò", meaning: "Wrong/Mistake" },
      ],
      example: {
        hanzi: "这儿的菜不错。",
        pinyin: "Zhèr de cài búcuò.",
        english: "The food here is not bad.",
        bangla: "এখানকার খাবার বেশ ভালো।",
      },
      similar: [{ hanzi: "挺好", pinyin: "tǐnghǎo", english: "Pretty good" }],
    },
  ],
};
