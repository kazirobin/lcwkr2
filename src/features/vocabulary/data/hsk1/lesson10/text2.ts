import type { VocabularyData } from "@/features/vocabulary/types";
// Lesson 10 - Text 2
export const lesson10Text2Data: VocabularyData = {
  hskLevel: 1,

  lesson: 10,
  text: 2,
  dialogue: {
    title: "Buying Apples",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "这儿的水果真不少！",
        pinyin: "Zhèr de shuǐguǒ zhēn bù shǎo!",
        english: "There are really quite a lot of fruits here!",
      },
      {
        speaker: "Salesperson",
        hanzi: "您想买什么？",
        pinyin: "Nín xiǎng mǎi shénme?",
        english: "What would you like to buy?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "我想买两斤苹果。",
        pinyin: "Wǒ xiǎng mǎi liǎng jīn píngguǒ.",
        english: "I’d like to buy two jin of apples.",
      },
      {
        speaker: "Salesperson",
        hanzi: "苹果三块五一斤。这些七块二，七块钱吧。",
        pinyin:
          "Píngguǒ sān kuài wǔ yì jīn. Zhèxiē qī kuài èr, qī kuài qián ba.",
        english:
          "Apples are 3.5 yuan per jin. These come to 7.2 yuan; let’s make it 7 yuan.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "好的，这儿的苹果真便宜！",
        pinyin: "Hǎo de, zhèr de píngguǒ zhēn piányi!",
        english: "Okay, the apples here are really cheap!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "这儿",
      pinyin: "zhèr",
      english: "Here",
      bangla: "এখানে",
      characters: [
        {
          hanzi: "这",
          pinyin: "zhè",
          meaning: "This",
        },
        {
          hanzi: "儿",
          pinyin: "r",
          meaning: "Er-suffix (colloquial)",
        },
      ],
      example: {
        hanzi: "我在这儿等你。",
        pinyin: "Wǒ zài zhèr děng nǐ.",
        english: "I'll wait for you here.",
        bangla: "আমি এখানে তোমার জন্য অপেক্ষা করব।",
      },
      similar: [
        {
          hanzi: "这里",
          pinyin: "zhèlǐ",
          english: "Here",
        },
      ],
    },
    {
      hanzi: "水果",
      pinyin: "shuǐguǒ",
      english: "Fruit",
      bangla: "ফল",
      characters: [
        {
          hanzi: "水",
          pinyin: "shuǐ",
          meaning: "Water",
        },
        {
          hanzi: "果",
          pinyin: "guǒ",
          meaning: "Fruit",
        },
      ],
      example: {
        hanzi: "我喜欢吃水果。",
        pinyin: "Wǒ xǐhuān chī shuǐguǒ.",
        english: "I like to eat fruit.",
        bangla: "আমি ফল খেতে পছন্দ করি।",
      },
      similar: [
        {
          hanzi: "果实",
          pinyin: "guǒshí",
          english: "Fruit (botanical)",
        },
      ],
    },
    {
      hanzi: "少",
      pinyin: "shǎo",
      english: "Few/Little",
      bangla: "কম",
      characters: [
        {
          hanzi: "少",
          pinyin: "shǎo",
          meaning: "Few/Less",
        },
      ],
      example: {
        hanzi: "这里人很少。",
        pinyin: "Zhèlǐ rén hěn shǎo.",
        english: "There are very few people here.",
        bangla: "এখানে মানুষ খুব কম।",
      },
      similar: [
        {
          hanzi: "不多",
          pinyin: "bù duō",
          english: "Not many",
        },
      ],
    },
    {
      hanzi: "斤",
      pinyin: "jīn",
      english: "Catty (Chinese weight unit = 500g)",
      bangla: "ক্যাটি (৫০০ গ্রাম)",
      characters: [
        {
          hanzi: "斤",
          pinyin: "jīn",
          meaning: "Weight unit",
        },
      ],
      example: {
        hanzi: "我买了两斤苹果。",
        pinyin: "Wǒ mǎi le liǎng jīn píngguǒ.",
        english: "I bought two catties of apples.",
        bangla: "আমি দুই ক্যাটি আপেল কিনলাম।",
      },
      similar: [
        {
          hanzi: "公斤",
          pinyin: "gōngjīn",
          english: "Kilogram (1 kg = 2 jin)",
        },
      ],
    },
    {
      hanzi: "苹果",
      pinyin: "píngguǒ",
      english: "Apple",
      bangla: "আপেল",
      characters: [
        {
          hanzi: "苹",
          pinyin: "píng",
          meaning: "Apple",
        },
        {
          hanzi: "果",
          pinyin: "guǒ",
          meaning: "Fruit",
        },
      ],
      example: {
        hanzi: "这个苹果很甜。",
        pinyin: "Zhège píngguǒ hěn tián.",
        english: "This apple is very sweet.",
        bangla: "এই আপেলটি খুব মিষ্টি।",
      },
      similar: [
        {
          hanzi: "苹果树",
          pinyin: "píngguǒshù",
          english: "Apple tree",
        },
      ],
    },
    {
      hanzi: "便宜",
      pinyin: "piányi",
      english: "Cheap",
      bangla: "সস্তা",
      characters: [
        {
          hanzi: "便",
          pinyin: "pián",
          meaning: "Cheap",
        },
        {
          hanzi: "宜",
          pinyin: "yi",
          meaning: "Suitable",
        },
      ],
      example: {
        hanzi: "这件衣服很便宜。",
        pinyin: "Zhè jiàn yīfu hěn piányi.",
        english: "This piece of clothing is very cheap.",
        bangla: "এই পোশাকটি খুব সস্তা।",
      },
      similar: [
        {
          hanzi: "廉价",
          pinyin: "liánjià",
          english: "Low-priced / Cheap",
        },
      ],
    },
  ],
};
