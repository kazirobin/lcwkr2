import type { VocabularyData } from "@/features/vocabulary/types";

// Lesson 2 - Text 3

export const lesson2Text3Data: VocabularyData = {
  hskLevel: 1,

  lesson: 2,
  text: 3,
  dialogue: {
    title: "Nice to Meet You",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "你好！",
        pinyin: "Nǐ hǎo!",
        english: "Hello!",
      },
      {
        speaker: "Li Wen",
        hanzi: "我叫李文。",
        pinyin: "Wǒ jiào Lǐ Wén.",
        english: "My name is Li Wen.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "你好！",
        pinyin: "Nǐ hǎo!",
        english: "Hello!",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我叫白家月。",
        pinyin: "Wǒ jiào Bái Jiāyuè.",
        english: "My name is Bai Jiayue.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "很高兴认识你。",
        pinyin: "Hěn gāoxìng rènshi nǐ.",
        english: "Nice to meet you.",
      },
      {
        speaker: "Li Wen",
        hanzi: "认识你我也很高兴。",
        pinyin: "Rènshi nǐ wǒ yě hěn gāoxìng.",
        english: "Nice to meet you too.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "很",
      pinyin: "hěn",
      english: "Very; quite",
      bangla: "খুব",
      characters: [
        {
          hanzi: "很",
          pinyin: "hěn",
          meaning: "Very",
        },
      ],
      example: {
        hanzi: "我很高兴。",
        pinyin: "Wǒ hěn gāoxìng.",
        english: "I am very happy.",
        bangla: "আমি খুব খুশি।",
      },
      similar: [
        {
          hanzi: "非常",
          pinyin: "fēicháng",
          english: "Very; extremely",
        },
      ],
    },
    {
      hanzi: "高兴",
      pinyin: "gāoxìng",
      english: "Happy; glad",
      bangla: "খুশি",
      characters: [
        {
          hanzi: "高",
          pinyin: "gāo",
          meaning: "High",
        },
        {
          hanzi: "兴",
          pinyin: "xìng",
          meaning: "Interest/Mood",
        },
      ],
      example: {
        hanzi: "很高兴认识你。",
        pinyin: "Hěn gāoxìng rènshi nǐ.",
        english: "Nice to meet you.",
        bangla: "আপনার সাথে পরিচিত হয়ে খুব খুশি হলাম।",
      },
      similar: [
        {
          hanzi: "开心",
          pinyin: "kāixīn",
          english: "Happy; joyful",
        },
      ],
    },
    {
      hanzi: "认识",
      pinyin: "rènshi",
      english: "To know; to meet; to get acquainted",
      bangla: "চেনা/পরিচিত হওয়া",
      characters: [
        {
          hanzi: "认",
          pinyin: "rèn",
          meaning: "Recognize",
        },
        {
          hanzi: "识",
          pinyin: "shi",
          meaning: "Know/Knowledge",
        },
      ],
      example: {
        hanzi: "我认识他。",
        pinyin: "Wǒ rènshi tā.",
        english: "I know him.",
        bangla: "আমি তাকে চিনি।",
      },
      similar: [
        {
          hanzi: "知道",
          pinyin: "zhīdào",
          english: "To know (a fact)",
        },
      ],
    },
    {
      hanzi: "也",
      pinyin: "yě",
      english: "Also; too",
      bangla: "ও",
      characters: [
        {
          hanzi: "也",
          pinyin: "yě",
          meaning: "Also/Too",
        },
      ],
      example: {
        hanzi: "我也是学生。",
        pinyin: "Wǒ yě shì xuéshēng.",
        english: "I am also a student.",
        bangla: "আমিও একজন ছাত্র।",
      },
      similar: [
        {
          hanzi: "还",
          pinyin: "hái",
          english: "Also; still (depending on context)",
        },
      ],
    },
  ],
};
