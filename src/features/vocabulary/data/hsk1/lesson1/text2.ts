import type { VocabularyData } from "@/features/vocabulary/types"; // Lesson 1 - Text 2

export const lesson1Text2Data: VocabularyData = {
  hskLevel: 1,
  lesson: 1,
  text: 2,
  dialogue: {
    title: "Greeting in the Classroom",
    lines: [
      {
        speaker: "Teacher",
        hanzi: "大家好！",
        pinyin: "Dàjiā hǎo!",
        english: "Hello everyone!",
      },
      {
        speaker: "Students",
        hanzi: "老师好！",
        pinyin: "Lǎoshī hǎo!",
        english: "Hello teacher!",
      },
      {
        speaker: "Student 1",
        hanzi: "你好！",
        pinyin: "Nǐ hǎo!",
        english: "Hello!",
      },
      {
        speaker: "Student 2",
        hanzi: "你好！",
        pinyin: "Nǐ hǎo!",
        english: "Hello!",
      },
      {
        speaker: "Teacher",
        hanzi: "你们好！",
        pinyin: "Nǐmen hǎo!",
        english: "Hello everyone (plural)!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "大家",
      pinyin: "dàjiā",
      english: "Everyone",
      bangla: "সবাই",
      characters: [
        {
          hanzi: "大",
          pinyin: "dà",
          meaning: "Big",
        },
        {
          hanzi: "家",
          pinyin: "jiā",
          meaning: "Family/Home",
        },
      ],
      example: {
        hanzi: "大家好！",
        pinyin: "Dàjiā hǎo!",
        english: "Hello everyone!",
        bangla: "সবাইকে হ্যালো!",
      },
      similar: [
        {
          hanzi: "每人",
          pinyin: "měi rén",
          english: "Everyone/Each person",
        },
      ],
    },
    {
      hanzi: "好",
      pinyin: "hǎo",
      english: "Good",
      bangla: "ভালো",
      characters: [
        {
          hanzi: "女",
          pinyin: "nǚ",
          meaning: "Woman",
        },
        {
          hanzi: "子",
          pinyin: "zǐ",
          meaning: "Child",
        },
      ],
      example: {
        hanzi: "很好。",
        pinyin: "Hěn hǎo.",
        english: "Very good.",
        bangla: "খুব ভালো।",
      },
      similar: [
        {
          hanzi: "棒",
          pinyin: "bàng",
          english: "Great/Awesome",
        },
      ],
    },
    {
      hanzi: "学生",
      pinyin: "xuéshēng",
      english: "Student",
      bangla: "ছাত্র",
      characters: [
        {
          hanzi: "学",
          pinyin: "xué",
          meaning: "Study/Learn",
        },
        {
          hanzi: "生",
          pinyin: "shēng",
          meaning: "Person/Born",
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
          hanzi: "同学",
          pinyin: "tóngxué",
          english: "Classmate",
        },
      ],
    },
    {
      hanzi: "们",
      pinyin: "men",
      english: "(plural suffix)",
      bangla: "বহুবচন প্রত্যয়",
      characters: [
        {
          hanzi: "们",
          pinyin: "men",
          meaning: "Plural suffix",
        },
      ],
      example: {
        hanzi: "我们。",
        pinyin: "Wǒmen.",
        english: "We/Us.",
        bangla: "আমরা।",
      },
      similar: [
        {
          hanzi: "大家",
          pinyin: "dàjiā",
          english: "Everyone",
        },
      ],
    },
    {
      hanzi: "老师",
      pinyin: "lǎoshī",
      english: "Teacher",
      bangla: "শিক্ষক",
      characters: [
        {
          hanzi: "老",
          pinyin: "lǎo",
          meaning: "Old/Experienced",
        },
        {
          hanzi: "师",
          pinyin: "shī",
          meaning: "Master/Expert",
        },
      ],
      example: {
        hanzi: "老师好。",
        pinyin: "Lǎoshī hǎo.",
        english: "Hello teacher.",
        bangla: "শিক্ষককে হ্যালো।",
      },
      similar: [
        {
          hanzi: "教师",
          pinyin: "jiàoshī",
          english: "Teacher (formal)",
        },
      ],
    },
    {
      hanzi: "您",
      pinyin: "nín",
      english: "You (polite)",
      bangla: "আপনি (সম্মানসূচক)",
      characters: [
        {
          hanzi: "你",
          pinyin: "nǐ",
          meaning: "You",
        },
        {
          hanzi: "心",
          pinyin: "xīn",
          meaning: "Heart (added respect)",
        },
      ],
      example: {
        hanzi: "您好！",
        pinyin: "Nín hǎo!",
        english: "Hello (polite)!",
        bangla: "আপনাকে হ্যালো!",
      },
      similar: [
        {
          hanzi: "你",
          pinyin: "nǐ",
          english: "You (informal)",
        },
      ],
    },
    {
      hanzi: "你们",
      pinyin: "nǐmen",
      english: "You (plural)",
      bangla: "তোমরা",
      characters: [
        {
          hanzi: "你",
          pinyin: "nǐ",
          meaning: "You",
        },
        {
          hanzi: "们",
          pinyin: "men",
          meaning: "Plural",
        },
      ],
      example: {
        hanzi: "你们好！",
        pinyin: "Nǐmen hǎo!",
        english: "Hello everyone!",
        bangla: "সবাইকে হ্যালো!",
      },
      similar: [
        {
          hanzi: "大家",
          pinyin: "dàjiā",
          english: "Everyone",
        },
      ],
    },
  ],
};
