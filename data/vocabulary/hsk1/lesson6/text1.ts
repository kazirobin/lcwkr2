import type { VocabularyData } from "@/types/vocabulary";

// Lesson 6 - Text 1
export const lesson6Text1Data: VocabularyData = {
  hskLevel: 1,

  lesson: 6,
  text: 1,
  dialogue: {
    title: "Phone Numbers",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "家月，你的手机号是多少？",
        pinyin: "Jiāyuè, nǐ de shǒujīhào shì duōshǎo?",
        english: "Jiayue, what is your phone number?",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "我的手机号是 +33 601493190。",
        pinyin:
          "Wǒ de shǒujīhào shì sān sān liù líng yāo sì jiǔ sān yāo jiǔ líng.",
        english: "My phone number is +33 601493190.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我的手机号是 +86 13552721160。",
        pinyin:
          "Wǒ de shǒujīhào shì bā liù yāo sān wǔ wǔ èr qī èr yāo yāo liù líng.",
        english: "My phone number is +86 13552721160.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "好的。",
        pinyin: "Hǎo de.",
        english: "Okay.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "手机",
      pinyin: "shǒujī",
      english: "Cell phone / Mobile phone",
      bangla: "মোবাইল ফোন",
      characters: [
        {
          hanzi: "手",
          pinyin: "shǒu",
          meaning: "Hand",
        },
        {
          hanzi: "机",
          pinyin: "jī",
          meaning: "Machine",
        },
      ],
      example: {
        hanzi: "这是我的手机。",
        pinyin: "Zhè shì wǒ de shǒujī.",
        english: "This is my cell phone.",
        bangla: "এটি আমার মোবাইল ফোন।",
      },
      similar: [
        {
          hanzi: "移动电话",
          pinyin: "yídòng diànhuà",
          english: "Mobile phone",
        },
      ],
    },
    {
      hanzi: "电话",
      pinyin: "diànhuà",
      english: "Telephone / Phone",
      bangla: "টেলিফোন",
      characters: [
        {
          hanzi: "电",
          pinyin: "diàn",
          meaning: "Electricity",
        },
        {
          hanzi: "话",
          pinyin: "huà",
          meaning: "Speech/Talk",
        },
      ],
      example: {
        hanzi: "留个电话吧。",
        pinyin: "Liú gè diànhuà ba.",
        english: "Leave a phone number.",
        bangla: "একটি ফোন নম্বর রেখে যাও।",
      },
      similar: [
        {
          hanzi: "固话",
          pinyin: "gùhuà",
          english: "Landline phone",
        },
      ],
    },
    {
      hanzi: "号",
      pinyin: "hào",
      english: "Number",
      bangla: "নম্বর",
      characters: [
        {
          hanzi: "号",
          pinyin: "hào",
          meaning: "Sign/Number",
        },
      ],
      example: {
        hanzi: "你的房间是几号？",
        pinyin: "Nǐ de fángjiān shì jǐ hào?",
        english: "What is your room number?",
        bangla: "তোমার রুম নম্বর কত?",
      },
      similar: [
        {
          hanzi: "号码",
          pinyin: "hàomǎ",
          english: "Number",
        },
      ],
    },
  ],
};
