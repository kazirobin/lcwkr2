// app/data/vocabulary/lesson2-text1.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson2text1: VocabularyData = {
  hskLevel: 2,
  lesson: 2,
  text: 1,
  dialogue: {
    title: "Going to Peking University",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "请问，这儿有到北京大学的公交车吗？",
        pinyin: "Qǐngwèn, zhèr yǒu dào Běijīng Dàxué de gōngjiāochē ma?",
        english: "Excuse me, is there a bus from here to Peking University?",
      },
      {
        speaker: "Service Staff",
        hanzi: "有，但车站有点儿远。",
        pinyin: "Yǒu, dàn chēzhàn yǒudiǎnr yuǎn.",
        english: "Yes, but the bus stop is a little far.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "这儿好打车吗？",
        pinyin: "Zhèr hǎo dǎchē ma?",
        english: "Is it easy to get a taxi here?",
      },
      {
        speaker: "Service Staff",
        hanzi: "好打车。",
        pinyin: "Hǎo dǎchē.",
        english: "It is easy to get a taxi.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "谢谢。安妮，我们还是打车去吧。",
        pinyin: "Xièxie. Ānnī, wǒmen háishi dǎchē qù ba.",
        english: "Thank you. Anni, let's take a taxi instead.",
      },
      {
        speaker: "Anni",
        hanzi: "好，没问题。",
        pinyin: "Hǎo, méi wèntí.",
        english: "Okay, no problem.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "公交车",
      pinyin: "gōngjiāochē",
      english: "Bus",
      bangla: "গণপরিবহন বাস",
      characters: [
        { hanzi: "公", pinyin: "gōng", meaning: "Public" },
        { hanzi: "交", pinyin: "jiāo", meaning: "Transport" },
        { hanzi: "车", pinyin: "chē", meaning: "Vehicle" },
      ],
      example: {
        hanzi: "我坐公交车去学校。",
        pinyin: "Wǒ zuò gōngjiāochē qù xuéxiào.",
        english: "I take the bus to school.",
        bangla: "আমি বাসে করে স্কুলে যাই।",
      },
      similar: [
        { hanzi: "公共汽车", pinyin: "gōnggòng qìchē", english: "Bus" },
      ],
    },
    {
      hanzi: "但",
      pinyin: "dàn",
      english: "But",
      bangla: "কিন্তু",
      characters: [
        { hanzi: "亻", pinyin: "rén", meaning: "Person" },
        { hanzi: "旦", pinyin: "dàn", meaning: "Dawn" },
      ],
      example: {
        hanzi: "我想去，但我没时间。",
        pinyin: "Wǒ xiǎng qù, dàn wǒ méi shíjiān.",
        english: "I want to go, but I don't have time.",
        bangla: "আমি যেতে চাই, কিন্তু আমার সময় নেই।",
      },
      similar: [{ hanzi: "但是", pinyin: "dànshì", english: "But" }],
    },
    {
      hanzi: "车站",
      pinyin: "chēzhàn",
      english: "Station/Stop",
      bangla: "স্টেশন/স্টপ",
      characters: [
        { hanzi: "车", pinyin: "chē", meaning: "Vehicle" },
        { hanzi: "站", pinyin: "zhàn", meaning: "Stand/Stop" },
      ],
      example: {
        hanzi: "我们在车站见面吧。",
        pinyin: "Wǒmen zài chēzhàn jiànmiàn ba.",
        english: "Let's meet at the station.",
        bangla: "আমরা স্টেশনে দেখা করি।",
      },
      similar: [{ hanzi: "站台", pinyin: "zhàntái", english: "Platform" }],
    },
    {
      hanzi: "远",
      pinyin: "yuǎn",
      english: "Far",
      bangla: "দূরবর্তী",
      characters: [
        { hanzi: "辶", pinyin: "chuò", meaning: "Walk/Movement" },
        { hanzi: "元", pinyin: "yuán", meaning: "Primary" },
      ],
      example: {
        hanzi: "我家离这里很远。",
        pinyin: "Wǒ jiā lí zhèlǐ hěn yuǎn.",
        english: "My home is very far from here.",
        bangla: "আমার বাড়ি এখান থেকে অনেক দূরে।",
      },
      similar: [{ hanzi: "遥远", pinyin: "yáoyuǎn", english: "Distant" }],
    },
    {
      hanzi: "打车",
      pinyin: "dǎchē",
      english: "Take a taxi",
      bangla: "ট্যাক্সি ভাড়া করা",
      characters: [
        { hanzi: "打", pinyin: "dǎ", meaning: "Call/Hit" },
        { hanzi: "车", pinyin: "chē", meaning: "Vehicle" },
      ],
      example: {
        hanzi: "下雨了，我们打车吧。",
        pinyin: "Xià yǔ le, wǒmen dǎchē ba.",
        english: "It's raining, let's take a taxi.",
        bangla: "বৃষ্টি হচ্ছে, আমরা ট্যাক্সি নিই।",
      },
      similar: [{ hanzi: "叫车", pinyin: "jiàochē", english: "Call a car" }],
    },
    {
      hanzi: "还是",
      pinyin: "háishi",
      english: "Or/Had better",
      bangla: "অথবা/বরং",
      characters: [
        { hanzi: "还", pinyin: "hái", meaning: "Still" },
        { hanzi: "是", pinyin: "shì", meaning: "Is" },
      ],
      example: {
        hanzi: "你喝茶还是咖啡？",
        pinyin: "Nǐ hē chá háishi kāfēi?",
        english: "Do you drink tea or coffee?",
        bangla: "তুমি চা নাকি কফি খাও?",
      },
      similar: [
        { hanzi: "或者", pinyin: "huòzhě", english: "Or (in statements)" },
      ],
    },
    {
      hanzi: "北京大学",
      pinyin: "Běijīng Dàxué",
      english: "Peking University",
      bangla: "বেইজিং বিশ্ববিদ্যালয়",
      characters: [
        { hanzi: "北京", pinyin: "Běijīng", meaning: "Beijing" },
        { hanzi: "大学", pinyin: "dàxué", meaning: "University" },
      ],
      example: {
        hanzi: "他在北京大学学习。",
        pinyin: "Tā zài Běijīng Dàxué xuéxí.",
        english: "He studies at Peking University.",
        bangla: "সে বেইজিং বিশ্ববিদ্যালয়ে পড়াশোনা করে।",
      },
      similar: [
        { hanzi: "北大", pinyin: "Běidà", english: "PKU (abbreviation)" },
      ],
    },
  ],
};
