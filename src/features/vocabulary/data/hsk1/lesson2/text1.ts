// Lesson 2 - Text 1

import type { VocabularyData } from "@/features/vocabulary/types";

export const lesson2Text1Data: VocabularyData = {
  hskLevel: 1,

  lesson: 2,
  text: 1,
  dialogue: {
    title: "Meeting Someone New",
    lines: [
      {
        speaker: "Wang Yifei",
        hanzi: "请问，你叫什么名字？",
        pinyin: "Qǐngwèn, nǐ jiào shénme míngzi?",
        english: "May I ask, what is your name?",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "我叫陈天中。",
        pinyin: "Wǒ jiào Chén Tiānzhōng.",
        english: "My name is Chen Tianzhong.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "请问",
      pinyin: "qǐngwèn",
      english: "Excuse me; May I ask",
      bangla: "দয়া করে জিজ্ঞাসা",
      characters: [
        {
          hanzi: "请",
          pinyin: "qǐng",
          meaning: "Please",
        },
        {
          hanzi: "问",
          pinyin: "wèn",
          meaning: "Ask",
        },
      ],
      example: {
        hanzi: "请问，你叫什么名字？",
        pinyin: "Qǐngwèn, nǐ jiào shénme míngzi?",
        english: "Excuse me, what's your name?",
        bangla: "দয়া করে, আপনার নাম কি?",
      },
      similar: [
        {
          hanzi: "劳驾",
          pinyin: "láojià",
          english: "Excuse me (polite)",
        },
      ],
    },
    {
      hanzi: "你",
      pinyin: "nǐ",
      english: "You",
      bangla: "তুমি",
      characters: [
        {
          hanzi: "你",
          pinyin: "nǐ",
          meaning: "You",
        },
      ],
      example: {
        hanzi: "你好吗？",
        pinyin: "Nǐ hǎo ma?",
        english: "How are you?",
        bangla: "তুমি কেমন আছ?",
      },
      similar: [
        {
          hanzi: "您",
          pinyin: "nín",
          english: "You (formal)",
        },
      ],
    },
    {
      hanzi: "叫",
      pinyin: "jiào",
      english: "To be called; to call",
      bangla: "ডাক দেওয়া",
      characters: [
        {
          hanzi: "叫",
          pinyin: "jiào",
          meaning: "Call/Name",
        },
      ],
      example: {
        hanzi: "我叫李明。",
        pinyin: "Wǒ jiào Lǐ Míng.",
        english: "My name is Li Ming.",
        bangla: "আমার নাম লি মিং।",
      },
      similar: [
        {
          hanzi: "名叫",
          pinyin: "míngjiào",
          english: "To be named",
        },
      ],
    },
    {
      hanzi: "什么",
      pinyin: "shénme",
      english: "What",
      bangla: "কি",
      characters: [
        {
          hanzi: "什",
          pinyin: "shén",
          meaning: "What",
        },
        {
          hanzi: "么",
          pinyin: "me",
          meaning: "Suffix",
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
          hanzi: "哪个",
          pinyin: "nǎge",
          english: "Which",
        },
      ],
    },
    {
      hanzi: "名字",
      pinyin: "míngzi",
      english: "Name",
      bangla: "নাম",
      characters: [
        {
          hanzi: "名",
          pinyin: "míng",
          meaning: "Name",
        },
        {
          hanzi: "字",
          pinyin: "zì",
          meaning: "Character/Word",
        },
      ],
      example: {
        hanzi: "你的名字是什么？",
        pinyin: "Nǐ de míngzi shì shénme?",
        english: "What is your name?",
        bangla: "তোমার নাম কি?",
      },
      similar: [
        {
          hanzi: "姓名",
          pinyin: "xìngmíng",
          english: "Full name",
        },
      ],
    },
    {
      hanzi: "我",
      pinyin: "wǒ",
      english: "I; Me",
      bangla: "আমি",
      characters: [
        {
          hanzi: "我",
          pinyin: "wǒ",
          meaning: "I/Me",
        },
      ],
      example: {
        hanzi: "我是学生。",
        pinyin: "Wǒ shì xuéshēng.",
        english: "I am a student.",
        bangla: "আমি একজন ছাত্র।",
      },
      similar: [
        {
          hanzi: "本人",
          pinyin: "běnrén",
          english: "Oneself (formal)",
        },
      ],
    },
  ],
};
