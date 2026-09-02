// Lesson 13 - Text 2
import type { VocabularyData } from "@/features/vocabulary/types";

export const lesson13Text2Data: VocabularyData = {
  hskLevel: 1,

  lesson: 13,
  text: 2,
  dialogue: {
    title: "Ordering Breakfast",
    lines: [
      {
        speaker: "服务员",
        hanzi: "女士，请坐！您喝什么？",
        pinyin: "Nǚshì, qǐng zuò! Nín hē shénme?",
        english: "Ma'am, please have a seat! What would you like to drink?",
      },
      {
        speaker: "王一雪",
        hanzi: "我看一下。请给我一杯牛奶。",
        pinyin: "Wǒ kàn yíxià. Qǐng gěi wǒ yì bēi niúnǎi.",
        english: "Let me take a look. Please give me a glass of milk.",
      },
      {
        speaker: "服务员",
        hanzi: "好的。您还要什么？",
        pinyin: "Hǎo de. Nín hái yào shénme?",
        english: "Okay. What else would you like?",
      },
      {
        speaker: "王一雪",
        hanzi: "我还没吃早饭，再要这个面包和鸡蛋吧。",
        pinyin: "Wǒ hái méi chī zǎofàn, zài yào zhège miànbāo hé jīdàn ba.",
        english:
          "I haven't had breakfast yet. I'll also have this bread and an egg.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "服务员",
      pinyin: "fúwùyuán",
      english: "Waiter / Waitress",
      bangla: "ওয়েটার/সেবাকর্মী",
      characters: [
        {
          hanzi: "服",
          pinyin: "fú",
          meaning: "Service",
        },
        {
          hanzi: "务",
          pinyin: "wù",
          meaning: "Work",
        },
        {
          hanzi: "员",
          pinyin: "yuán",
          meaning: "Member/Person",
        },
      ],
      example: {
        hanzi: "服务员，请给我一杯水。",
        pinyin: "Fúwùyuán, qǐng gěi wǒ yì bēi shuǐ.",
        english: "Waiter, please give me a glass of water.",
        bangla: "ওয়েটার, দয়া করে আমাকে এক গ্লাস পানি দিন।",
      },
      similar: [
        {
          hanzi: "侍者",
          pinyin: "shìzhě",
          english: "Waiter",
        },
      ],
    },
    {
      hanzi: "女士",
      pinyin: "nǚshì",
      english: "Lady / Madam",
      bangla: "ভদ্রমহিলা",
      characters: [
        {
          hanzi: "女",
          pinyin: "nǚ",
          meaning: "Female",
        },
        {
          hanzi: "士",
          pinyin: "shì",
          meaning: "Gentleman/Lady",
        },
      ],
      example: {
        hanzi: "王女士在吗？",
        pinyin: "Wáng nǚshì zài ma?",
        english: "Is Ms. Wang here?",
        bangla: "মিসেস ওয়াং এখানে আছেন?",
      },
      similar: [
        {
          hanzi: "小姐",
          pinyin: "xiǎojiě",
          english: "Miss",
        },
      ],
    },
    {
      hanzi: "请",
      pinyin: "qǐng",
      english: "Please",
      bangla: "দয়া করে",
      characters: [
        {
          hanzi: "请",
          pinyin: "qǐng",
          meaning: "Please/Request",
        },
      ],
      example: {
        hanzi: "请坐。",
        pinyin: "Qǐng zuò.",
        english: "Please sit down.",
        bangla: "দয়া করে বসুন।",
      },
      similar: [
        {
          hanzi: "拜托",
          pinyin: "bàituō",
          english: "Please",
        },
      ],
    },
    {
      hanzi: "坐",
      pinyin: "zuò",
      english: "To sit",
      bangla: "বসা",
      characters: [
        {
          hanzi: "坐",
          pinyin: "zuò",
          meaning: "Sit",
        },
      ],
      example: {
        hanzi: "请坐在这里。",
        pinyin: "Qǐng zuò zài zhèlǐ.",
        english: "Please sit here.",
        bangla: "দয়া করে এখানে বসুন।",
      },
      similar: [
        {
          hanzi: "歇",
          pinyin: "xiē",
          english: "To rest/sit",
        },
      ],
    },
    {
      hanzi: "给",
      pinyin: "gěi",
      english: "To give",
      bangla: "দেওয়া",
      characters: [
        {
          hanzi: "给",
          pinyin: "gěi",
          meaning: "Give",
        },
      ],
      example: {
        hanzi: "请给我那本书。",
        pinyin: "Qǐng gěi wǒ nà běn shū.",
        english: "Please give me that book.",
        bangla: "দয়া করে আমাকে ওই বইটি দিন।",
      },
      similar: [
        {
          hanzi: "递",
          pinyin: "dì",
          english: "To pass/hand over",
        },
      ],
    },
    {
      hanzi: "杯",
      pinyin: "bēi",
      english: "Cup / Glass",
      bangla: "কাপ/গ্লাস",
      characters: [
        {
          hanzi: "杯",
          pinyin: "bēi",
          meaning: "Cup/Glass",
        },
      ],
      example: {
        hanzi: "我要一杯茶。",
        pinyin: "Wǒ yào yì bēi chá.",
        english: "I want a cup of tea.",
        bangla: "আমি এক কাপ চা চাই।",
      },
      similar: [
        {
          hanzi: "盏",
          pinyin: "zhǎn",
          english: "Small cup",
        },
      ],
    },
    {
      hanzi: "要",
      pinyin: "yào",
      english: "To want",
      bangla: "চাওয়া",
      characters: [
        {
          hanzi: "要",
          pinyin: "yào",
          meaning: "Want/Need",
        },
      ],
      example: {
        hanzi: "你要什么？",
        pinyin: "Nǐ yào shénme?",
        english: "What do you want?",
        bangla: "তুমি কী চাও?",
      },
      similar: [
        {
          hanzi: "想",
          pinyin: "xiǎng",
          english: "To want/would like",
        },
      ],
    },
    {
      hanzi: "早饭",
      pinyin: "zǎofàn",
      english: "Breakfast",
      bangla: "সকালের খাবার",
      characters: [
        {
          hanzi: "早",
          pinyin: "zǎo",
          meaning: "Early/Morning",
        },
        {
          hanzi: "饭",
          pinyin: "fàn",
          meaning: "Meal",
        },
      ],
      example: {
        hanzi: "你吃早饭了吗？",
        pinyin: "Nǐ chī zǎofàn le ma?",
        english: "Have you eaten breakfast?",
        bangla: "তুমি সকালের খাবার খেয়েছ?",
      },
      similar: [
        {
          hanzi: "早餐",
          pinyin: "zǎocān",
          english: "Breakfast",
        },
      ],
    },
    {
      hanzi: "这个",
      pinyin: "zhège",
      english: "This / This one",
      bangla: "এইটি",
      characters: [
        {
          hanzi: "这",
          pinyin: "zhè",
          meaning: "This",
        },
        {
          hanzi: "个",
          pinyin: "ge",
          meaning: "Measure word",
        },
      ],
      example: {
        hanzi: "我喜欢这个。",
        pinyin: "Wǒ xǐhuān zhège.",
        english: "I like this one.",
        bangla: "আমি এইটি পছন্দ করি।",
      },
      similar: [
        {
          hanzi: "这儿",
          pinyin: "zhèr",
          english: "Here",
        },
      ],
    },
    {
      hanzi: "面包",
      pinyin: "miànbāo",
      english: "Bread",
      bangla: "পাউরুটি",
      characters: [
        {
          hanzi: "面",
          pinyin: "miàn",
          meaning: "Flour",
        },
        {
          hanzi: "包",
          pinyin: "bāo",
          meaning: "Wrap/Bun",
        },
      ],
      example: {
        hanzi: "我在吃面包。",
        pinyin: "Wǒ zài chī miànbāo.",
        english: "I am eating bread.",
        bangla: "আমি পাউরুটি খাচ্ছি।",
      },
      similar: [
        {
          hanzi: "吐司",
          pinyin: "tǔsī",
          english: "Toast",
        },
      ],
    },
    {
      hanzi: "鸡蛋",
      pinyin: "jīdàn",
      english: "Egg",
      bangla: "ডিম",
      characters: [
        {
          hanzi: "鸡",
          pinyin: "jī",
          meaning: "Chicken",
        },
        {
          hanzi: "蛋",
          pinyin: "dàn",
          meaning: "Egg",
        },
      ],
      example: {
        hanzi: "我每天吃一个鸡蛋。",
        pinyin: "Wǒ měitiān chī yí gè jīdàn.",
        english: "I eat an egg every day.",
        bangla: "আমি প্রতিদিন একটি ডিম খাই।",
      },
      similar: [
        {
          hanzi: "鸟蛋",
          pinyin: "niǎodàn",
          english: "Bird egg",
        },
      ],
    },
  ],
};
