// Lesson 3 - Text 2
import type { VocabularyData } from "@/features/vocabulary/types";

export const lesson3Text2Data: VocabularyData = {
  hskLevel: 1,

  lesson: 3,
  text: 2,
  dialogue: {
    title: "Introducing a Girlfriend",
    lines: [
      {
        speaker: "Chen Tianzhong",
        hanzi: "这是谁？",
        pinyin: "Zhè shì shéi?",
        english: "Who is this?",
      },
      {
        speaker: "Annie",
        hanzi: "这是我女朋友。",
        pinyin: "Zhè shì wǒ nǚpéngyou.",
        english: "This is my girlfriend.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "你女朋友是哪国人？",
        pinyin: "Nǐ nǚpéngyou shì nǎ guó rén?",
        english: "What nationality is your girlfriend?",
      },
      {
        speaker: "Annie",
        hanzi: "她也是泰国人。",
        pinyin: "Tā yě shì Tàiguó rén.",
        english: "She is also Thai.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "这",
      pinyin: "zhè",
      english: "This",
      bangla: "এই",
      characters: [
        {
          hanzi: "这",
          pinyin: "zhè",
          meaning: "This",
        },
      ],
      example: {
        hanzi: "这是什么？",
        pinyin: "Zhè shì shénme?",
        english: "What is this?",
        bangla: "এটা কি?",
      },
      similar: [
        {
          hanzi: "这个",
          pinyin: "zhè ge",
          english: "This one",
        },
      ],
    },
    {
      hanzi: "谁",
      pinyin: "shéi",
      english: "Who",
      bangla: "কে",
      characters: [
        {
          hanzi: "谁",
          pinyin: "shéi",
          meaning: "Who",
        },
      ],
      example: {
        hanzi: "他是谁？",
        pinyin: "Tā shì shéi?",
        english: "Who is he?",
        bangla: "সে কে?",
      },
      similar: [
        {
          hanzi: "何人",
          pinyin: "hé rén",
          english: "Who (formal)",
        },
      ],
    },
    {
      hanzi: "女朋友",
      pinyin: "nǚpéngyou",
      english: "Girlfriend",
      bangla: "বান্ধবী",
      characters: [
        {
          hanzi: "女",
          pinyin: "nǚ",
          meaning: "Female",
        },
        {
          hanzi: "朋友",
          pinyin: "péngyou",
          meaning: "Friend",
        },
      ],
      example: {
        hanzi: "我有女朋友。",
        pinyin: "Wǒ yǒu nǚpéngyou.",
        english: "I have a girlfriend.",
        bangla: "আমার বান্ধবী আছে।",
      },
      similar: [
        {
          hanzi: "对象",
          pinyin: "duìxiàng",
          english: "Partner/Significant other",
        },
      ],
    },
    {
      hanzi: "哪",
      pinyin: "nǎ",
      english: "Which",
      bangla: "কোন",
      characters: [
        {
          hanzi: "哪",
          pinyin: "nǎ",
          meaning: "Which",
        },
      ],
      example: {
        hanzi: "你是哪国人？",
        pinyin: "Nǐ shì nǎ guó rén?",
        english: "Which country are you from?",
        bangla: "তুমি কোন দেশের?",
      },
      similar: [
        {
          hanzi: "哪个",
          pinyin: "nǎ ge",
          english: "Which one",
        },
      ],
    },
    {
      hanzi: "国",
      pinyin: "guó",
      english: "Country",
      bangla: "দেশ",
      characters: [
        {
          hanzi: "国",
          pinyin: "guó",
          meaning: "Country",
        },
      ],
      example: {
        hanzi: "我爱我的国。",
        pinyin: "Wǒ ài wǒ de guó.",
        english: "I love my country.",
        bangla: "আমি আমার দেশকে ভালোবাসি।",
      },
      similar: [
        {
          hanzi: "国家",
          pinyin: "guójiā",
          english: "Nation/Country",
        },
      ],
    },
    {
      hanzi: "他",
      pinyin: "tā",
      english: "He/She/It",
      bangla: "সে",
      characters: [
        {
          hanzi: "他",
          pinyin: "tā",
          meaning: "He (male)",
        },
      ],
      example: {
        hanzi: "他是老师。",
        pinyin: "Tā shì lǎoshī.",
        english: "He is a teacher.",
        bangla: "সে একজন শিক্ষক।",
      },
      similar: [
        {
          hanzi: "其",
          pinyin: "qí",
          english: "It/That (formal)",
        },
      ],
    },
    {
      hanzi: "泰国",
      pinyin: "Tàiguó",
      english: "Thailand",
      bangla: "থাইল্যান্ড",
      characters: [
        {
          hanzi: "泰",
          pinyin: "Tài",
          meaning: "Thai (phonetic)",
        },
        {
          hanzi: "国",
          pinyin: "guó",
          meaning: "Country",
        },
      ],
      example: {
        hanzi: "我去过泰国。",
        pinyin: "Wǒ qùguo Tàiguó.",
        english: "I have been to Thailand.",
        bangla: "আমি থাইল্যান্ড গিয়েছি।",
      },
      similar: [
        {
          hanzi: "暹罗",
          pinyin: "Xiānluó",
          english: "Siam (historical)",
        },
      ],
    },
  ],
};
