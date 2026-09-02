import type { VocabularyData } from "@/features/vocabulary/types";
// Lesson 2 - Text 2

export const lesson2Text2Data: VocabularyData = {
  hskLevel: 1,

  lesson: 2,
  text: 2,
  dialogue: {
    title: "Greeting in the Classroom",
    lines: [
      {
        speaker: "Chen Tianzhong",
        hanzi: "你好，安妮！",
        pinyin: "Nǐ hǎo, Ānní!",
        english: "Hello, Annie!",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "你好，陈天中！我不是安妮，我是白家月。",
        pinyin: "Nǐ hǎo, Chén Tiānzhōng! Wǒ bú shì Ānní, wǒ shì Bái Jiāyuè.",
        english: "Hello, Chen Tianzhong! I'm not Annie, I'm Bai Jiayue.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "对不起！",
        pinyin: "Duìbuqǐ!",
        english: "Sorry!",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "没关系！",
        pinyin: "Méi guānxi!",
        english: "That's okay / No problem!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "不",
      pinyin: "bù",
      english: "No; not",
      bangla: "না",
      characters: [
        {
          hanzi: "不",
          pinyin: "bù",
          meaning: "Not/No",
        },
      ],
      example: {
        hanzi: "我不是老师。",
        pinyin: "Wǒ bú shì lǎoshī.",
        english: "I am not a teacher.",
        bangla: "আমি শিক্ষক নই।",
      },
      similar: [
        {
          hanzi: "没",
          pinyin: "méi",
          english: "Not (past actions/don't have)",
        },
      ],
    },
    {
      hanzi: "是",
      pinyin: "shì",
      english: "To be; yes",
      bangla: "হওয়া",
      characters: [
        {
          hanzi: "是",
          pinyin: "shì",
          meaning: "To be/Is/Are/Am",
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
          hanzi: "对",
          pinyin: "duì",
          english: "Correct; right",
        },
      ],
    },
    {
      hanzi: "对不起",
      pinyin: "duìbuqǐ",
      english: "Sorry",
      bangla: "দুঃখিত",
      characters: [
        {
          hanzi: "对",
          pinyin: "duì",
          meaning: "Toward/Correct",
        },
        {
          hanzi: "不",
          pinyin: "bù",
          meaning: "Not",
        },
        {
          hanzi: "起",
          pinyin: "qǐ",
          meaning: "Rise",
        },
      ],
      example: {
        hanzi: "对不起，我迟到了。",
        pinyin: "Duìbuqǐ, wǒ chídào le.",
        english: "Sorry, I am late.",
        bangla: "দুঃখিত, আমি দেরি করে ফেলেছি।",
      },
      similar: [
        {
          hanzi: "抱歉",
          pinyin: "bàoqiàn",
          english: "Sorry; apologize",
        },
      ],
    },
    {
      hanzi: "没关系",
      pinyin: "méi guānxi",
      english: "It's okay; no problem",
      bangla: "কোনো সমস্যা নেই",
      characters: [
        {
          hanzi: "没",
          pinyin: "méi",
          meaning: "Not",
        },
        {
          hanzi: "关系",
          pinyin: "guānxi",
          meaning: "Relation/Matter",
        },
      ],
      example: {
        hanzi: "A: 对不起。B: 没关系。",
        pinyin: "A: Duìbuqǐ. B: Méi guānxi.",
        english: "A: Sorry. B: It's okay.",
        bangla: "A: দুঃখিত। B: কোনো সমস্যা নেই।",
      },
      similar: [
        {
          hanzi: "不要紧",
          pinyin: "bú yàojǐn",
          english: "No problem; it's all right",
        },
      ],
    },
    {
      hanzi: "没事",
      pinyin: "méi shì",
      english: "It's okay; nothing's wrong",
      bangla: "কিছু হয়নি",
      characters: [
        {
          hanzi: "没",
          pinyin: "méi",
          meaning: "Not",
        },
        {
          hanzi: "事",
          pinyin: "shì",
          meaning: "Matter/Problem",
        },
      ],
      example: {
        hanzi: "没事，别担心。",
        pinyin: "Méi shì, bié dānxīn.",
        english: "It's okay, don't worry.",
        bangla: "কিছু হয়নি, চিন্তা করো না।",
      },
      similar: [
        {
          hanzi: "没关系",
          pinyin: "méi guānxi",
          english: "It's okay; no problem",
        },
      ],
    },
  ],
};
