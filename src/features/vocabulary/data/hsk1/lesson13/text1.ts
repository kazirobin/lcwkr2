// Lesson 13 - Text 1
import type { VocabularyData } from "@/features/vocabulary/types";

export const lesson13Text1Data: VocabularyData = {
  hskLevel: 1,

  lesson: 13,
  text: 1,
  dialogue: {
    title: "Ordering Dumplings",
    lines: [
      {
        speaker: "服务员",
        hanzi: "先生，请坐！您要什么？",
        pinyin: "Xiānsheng, qǐng zuò! Nín yào shénme?",
        english: "Sir, please have a seat! What would you like?",
      },
      {
        speaker: "刘明",
        hanzi: "我要一斤饺子。",
        pinyin: "Wǒ yào yì jīn jiǎozi.",
        english: "I want one jin of dumplings.",
      },
      {
        speaker: "服务员",
        hanzi: "好的。一斤饺子四十个。",
        pinyin: "Hǎo de. Yì jīn jiǎozi sìshí ge.",
        english: "Okay. One jin of dumplings is 40 pieces.",
      },
      {
        speaker: "刘明",
        hanzi: "四十个太多了，我要一半吧。",
        pinyin: "Sìshí ge tài duō le, wǒ yào yíbàn ba.",
        english: "Forty is too many. I'll have half, then.",
      },
      {
        speaker: "服务员",
        hanzi: "半斤20个。您想喝什么？",
        pinyin: "Bàn jīn èrshí ge. Nín xiǎng hē shénme?",
        english: "Half a jin is 20 pieces. What would you like to drink?",
      },
      {
        speaker: "刘明",
        hanzi: "请给我一杯茶吧。",
        pinyin: "Qǐng gěi wǒ yì bēi chá ba.",
        english: "Please give me a cup of tea.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "可以",
      pinyin: "kěyǐ",
      english: "Can / May",
      bangla: "পারা/অনুমতি থাকা",
      characters: [
        {
          hanzi: "可",
          pinyin: "kě",
          meaning: "Can",
        },
        {
          hanzi: "以",
          pinyin: "yǐ",
          meaning: "By means of",
        },
      ],
      example: {
        hanzi: "我可以进来吗？",
        pinyin: "Wǒ kěyǐ jìnlái ma?",
        english: "May I come in?",
        bangla: "আমি কি ভেতরে আসতে পারি?",
      },
      similar: [
        {
          hanzi: "能",
          pinyin: "néng",
          english: "Can",
        },
      ],
    },
    {
      hanzi: "再",
      pinyin: "zài",
      english: "Again / Once more",
      bangla: "আবার",
      characters: [
        {
          hanzi: "再",
          pinyin: "zài",
          meaning: "Again",
        },
      ],
      example: {
        hanzi: "请再说一遍。",
        pinyin: "Qǐng zài shuō yí biàn.",
        english: "Please say it again.",
        bangla: "দয়া করে আবার বলুন।",
      },
      similar: [
        {
          hanzi: "又",
          pinyin: "yòu",
          english: "Again",
        },
      ],
    },
    {
      hanzi: "问题",
      pinyin: "wèntí",
      english: "Question / Problem",
      bangla: "প্রশ্ন/সমস্যা",
      characters: [
        {
          hanzi: "问",
          pinyin: "wèn",
          meaning: "Ask",
        },
        {
          hanzi: "题",
          pinyin: "tí",
          meaning: "Topic",
        },
      ],
      example: {
        hanzi: "我有一个问题。",
        pinyin: "Wǒ yǒu yí gè wèntí.",
        english: "I have a question.",
        bangla: "আমার একটি প্রশ্ন আছে।",
      },
      similar: [
        {
          hanzi: "疑问",
          pinyin: "yíwèn",
          english: "Question / Doubt",
        },
      ],
    },
    {
      hanzi: "卖",
      pinyin: "mài",
      english: "To sell",
      bangla: "বিক্রি করা",
      characters: [
        {
          hanzi: "卖",
          pinyin: "mài",
          meaning: "Sell",
        },
      ],
      example: {
        hanzi: "这个怎么卖？",
        pinyin: "Zhège zěnme mài?",
        english: "How much is this sold for?",
        bangla: "এটার দাম কত?",
      },
      similar: [
        {
          hanzi: "出售",
          pinyin: "chūshòu",
          english: "To sell",
        },
      ],
    },
    {
      hanzi: "打电话",
      pinyin: "dǎ diànhuà",
      english: "To make a phone call",
      bangla: "ফোন করা",
      characters: [
        {
          hanzi: "打",
          pinyin: "dǎ",
          meaning: "Make/Hit",
        },
        {
          hanzi: "电话",
          pinyin: "diànhuà",
          meaning: "Phone",
        },
      ],
      example: {
        hanzi: "我给他打电话。",
        pinyin: "Wǒ gěi tā dǎ diànhuà.",
        english: "I am calling him.",
        bangla: "আমি তাকে ফোন করছি।",
      },
      similar: [
        {
          hanzi: "通话",
          pinyin: "tōnghuà",
          english: "To converse on phone",
        },
      ],
    },
    {
      hanzi: "一下",
      pinyin: "yíxià",
      english: "A bit / A short while",
      bangla: "একটু",
      characters: [
        {
          hanzi: "一",
          pinyin: "yī",
          meaning: "One",
        },
        {
          hanzi: "下",
          pinyin: "xià",
          meaning: "Time/Measure",
        },
      ],
      example: {
        hanzi: "请等一下。",
        pinyin: "Qǐng děng yíxià.",
        english: "Please wait a moment.",
        bangla: "দয়া করে একটু অপেক্ষা করুন।",
      },
      similar: [
        {
          hanzi: "一会儿",
          pinyin: "yíhuìr",
          english: "A moment",
        },
      ],
    },
  ],
};
