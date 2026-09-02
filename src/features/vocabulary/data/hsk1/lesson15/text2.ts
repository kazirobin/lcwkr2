// Lesson 15 - Text 2
import type { VocabularyData } from "@/features/vocabulary/types";

export const lesson15Text2Data: VocabularyData = {
  hskLevel: 1,

  lesson: 15,
  text: 2,
  dialogue: {
    title: "Travel Plans",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "你们都想去哪儿？",
        pinyin: "Nǐmen dōu xiǎng qù nǎr?",
        english: "Where do you all want to go?",
      },
      {
        speaker: "Anni",
        hanzi: "去年我和男朋友去了西安，今年我想去北京。",
        pinyin:
          "Qùnián wǒ hé nánpéngyou qù le Xī’ān, jīnnián wǒ xiǎng qù Běijīng.",
        english:
          "Last year, my boyfriend and I went to Xi’an. This year, I want to go to Beijing.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "前几年我去了西安，非常好玩儿。今年我也想去北京。",
        pinyin:
          "Qián jǐ nián wǒ qù le Xī’ān, fēicháng hǎowánr. Jīnnián wǒ yě xiǎng qù Běijīng.",
        english:
          "A few years ago, I went to Xi’an. It was very fun. This year, I also want to go to Beijing.",
      },
      {
        speaker: "Li Wen",
        hanzi: "我和王老师都是北京人，北京非常漂亮。",
        pinyin:
          "Wǒ hé Wáng lǎoshī dōu shì Běijīng rén, Běijīng fēicháng piàoliang.",
        english:
          "Teacher Wang and I are both from Beijing. Beijing is very beautiful.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "去年",
      pinyin: "qùnián",
      english: "Last year",
      bangla: "গত বছর",
      characters: [
        {
          hanzi: "去",
          pinyin: "qù",
          meaning: "Go/Past",
        },
        {
          hanzi: "年",
          pinyin: "nián",
          meaning: "Year",
        },
      ],
      example: {
        hanzi: "我去年去了北京。",
        pinyin: "Wǒ qùnián qù le Běijīng.",
        english: "I went to Beijing last year.",
        bangla: "আমি গত বছর বেইজিং গিয়েছিলাম।",
      },
      similar: [
        {
          hanzi: "上年",
          pinyin: "shàngnián",
          english: "Last year",
        },
      ],
    },
    {
      hanzi: "男朋友",
      pinyin: "nánpéngyou",
      english: "Boyfriend",
      bangla: "বয়ফ্রেন্ড",
      characters: [
        {
          hanzi: "男",
          pinyin: "nán",
          meaning: "Male",
        },
        {
          hanzi: "朋友",
          pinyin: "péngyou",
          meaning: "Friend",
        },
      ],
      example: {
        hanzi: "她有一个男朋友。",
        pinyin: "Tā yǒu yī gè nánpéngyou.",
        english: "She has a boyfriend.",
        bangla: "তার একটি বয়ফ্রেন্ড আছে।",
      },
      similar: [
        {
          hanzi: "男友",
          pinyin: "nányǒu",
          english: "Boyfriend",
        },
      ],
    },
    {
      hanzi: "几",
      pinyin: "jǐ",
      english: "How many (few, usually <10)",
      bangla: "কত (ছোট সংখ্যা)",
      characters: [
        {
          hanzi: "几",
          pinyin: "jǐ",
          meaning: "How many",
        },
      ],
      example: {
        hanzi: "你有几个朋友？",
        pinyin: "Nǐ yǒu jǐ gè péngyou?",
        english: "How many friends do you have?",
        bangla: "তোমার কয়জন বন্ধু আছে?",
      },
      similar: [
        {
          hanzi: "多少",
          pinyin: "duōshao",
          english: "How many",
        },
      ],
    },
    {
      hanzi: "年",
      pinyin: "nián",
      english: "Year",
      bangla: "বছর",
      characters: [
        {
          hanzi: "年",
          pinyin: "nián",
          meaning: "Year",
        },
      ],
      example: {
        hanzi: "一年有十二个月。",
        pinyin: "Yī nián yǒu shí'èr gè yuè.",
        english: "One year has twelve months.",
        bangla: "এক বছরে বারো মাস আছে।",
      },
      similar: [
        {
          hanzi: "载",
          pinyin: "zǎi",
          english: "Year",
        },
      ],
    },
    {
      hanzi: "好玩儿",
      pinyin: "hǎowánr",
      english: "Fun / Interesting",
      bangla: "মজার",
      characters: [
        {
          hanzi: "好",
          pinyin: "hǎo",
          meaning: "Good",
        },
        {
          hanzi: "玩儿",
          pinyin: "wánr",
          meaning: "Play",
        },
      ],
      example: {
        hanzi: "这个地方很好玩儿。",
        pinyin: "Zhège dìfang hěn hǎowánr.",
        english: "This place is very fun.",
        bangla: "এই জায়গাটি খুব মজার।",
      },
      similar: [
        {
          hanzi: "有趣",
          pinyin: "yǒuqù",
          english: "Interesting",
        },
      ],
    },
  ],
};
