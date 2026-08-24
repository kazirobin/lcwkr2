// Lesson 3 - Text 3
import type { VocabularyData } from "@/types/vocabulary";

export const lesson3Text3Data: VocabularyData = {
  hskLevel: 1,

  lesson: 3,
  text: 3,
  dialogue: {
    title: "A Phone Call Between Sisters",
    lines: [
      {
        speaker: "Wang Yifei",
        hanzi: "喂，一飞！",
        pinyin: "Wèi, Yīfēi!",
        english: "Hey, Yifei!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "姐姐！",
        pinyin: "Jiějie!",
        english: "Big sister!",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "王一雪",
        pinyin: "Wáng Yīxuě",
        english: "Wang Yixue",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你工作还忙吗？",
        pinyin: "Nǐ gōngzuò hái máng ma?",
        english: "Are you still busy with work?",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "对，还很忙。你",
        pinyin: "Duì, hái hěn máng. Nǐ",
        english: "Yes, still very busy. You",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "也很忙吗？",
        pinyin: "Yě hěn máng ma?",
        english: "Are you also very busy?",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "我不太忙。我们",
        pinyin: "Wǒ bù tài máng. Wǒmen",
        english: "I'm not too busy. We",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "很想你。",
        pinyin: "Hěn xiǎng nǐ.",
        english: "Miss you a lot.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "我也想你们。",
        pinyin: "Wǒ yě xiǎng nǐmen.",
        english: "I miss you all too.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "喂",
      pinyin: "wèi",
      english: "Hello (on phone) / Hey",
      bangla: "হ্যালো (ফোনে)",
      characters: [
        {
          hanzi: "喂",
          pinyin: "wèi",
          meaning: "Hello (phone call interjection)",
        },
      ],
      example: {
        hanzi: "喂，你是谁？",
        pinyin: "Wèi, nǐ shì shéi?",
        english: "Hello, who is this?",
        bangla: "হ্যালো, আপনি কে?",
      },
      similar: [
        {
          hanzi: "你好",
          pinyin: "nǐ hǎo",
          english: "Hello (general)",
        },
      ],
    },
    {
      hanzi: "姐姐",
      pinyin: "jiějie",
      english: "Older sister",
      bangla: "বড় বোন",
      characters: [
        {
          hanzi: "姐",
          pinyin: "jiě",
          meaning: "Elder sister",
        },
        {
          hanzi: "姐",
          pinyin: "jiě",
          meaning: "Elder sister (reduplicated)",
        },
      ],
      example: {
        hanzi: "我姐姐是医生。",
        pinyin: "Wǒ jiějie shì yīshēng.",
        english: "My older sister is a doctor.",
        bangla: "আমার বড় বোন একজন ডাক্তার।",
      },
      similar: [
        {
          hanzi: "大姐",
          pinyin: "dàjiě",
          english: "Eldest sister / Big sis",
        },
      ],
    },
    {
      hanzi: "工作",
      pinyin: "gōngzuò",
      english: "Work / Job",
      bangla: "কাজ/চাকরি",
      characters: [
        {
          hanzi: "工",
          pinyin: "gōng",
          meaning: "Work/Labor",
        },
        {
          hanzi: "作",
          pinyin: "zuò",
          meaning: "Do/Make",
        },
      ],
      example: {
        hanzi: "你在哪里工作？",
        pinyin: "Nǐ zài nǎli gōngzuò?",
        english: "Where do you work?",
        bangla: "আপনি কোথায় কাজ করেন?",
      },
      similar: [
        {
          hanzi: "职业",
          pinyin: "zhíyè",
          english: "Profession/Career",
        },
      ],
    },
    {
      hanzi: "还",
      pinyin: "hái",
      english: "Still / Yet / Also",
      bangla: "এখনও/আরও",
      characters: [
        {
          hanzi: "还",
          pinyin: "hái",
          meaning: "Still, yet, in addition",
        },
      ],
      example: {
        hanzi: "我还没吃饭。",
        pinyin: "Wǒ hái méi chīfàn.",
        english: "I haven't eaten yet.",
        bangla: "আমি এখনও খাইনি।",
      },
      similar: [
        {
          hanzi: "仍然",
          pinyin: "réngrán",
          english: "Still (formal)",
        },
      ],
    },
    {
      hanzi: "忙",
      pinyin: "máng",
      english: "Busy",
      bangla: "ব্যস্ত",
      characters: [
        {
          hanzi: "忙",
          pinyin: "máng",
          meaning: "Busy",
        },
      ],
      example: {
        hanzi: "我今天很忙。",
        pinyin: "Wǒ jīntiān hěn máng.",
        english: "I am very busy today.",
        bangla: "আমি আজ খুব ব্যস্ত।",
      },
      similar: [
        {
          hanzi: "忙碌",
          pinyin: "mánglù",
          english: "Busy (stressed)",
        },
      ],
    },
    {
      hanzi: "吗",
      pinyin: "ma",
      english: "Question particle",
      bangla: "প্রশ্নবোধক চিহ্ন",
      characters: [
        {
          hanzi: "吗",
          pinyin: "ma",
          meaning: "Question marker (yes/no questions)",
        },
      ],
      example: {
        hanzi: "你好吗？",
        pinyin: "Nǐ hǎo ma?",
        english: "How are you?",
        bangla: "আপনি কেমন আছেন?",
      },
      similar: [
        {
          hanzi: "呢",
          pinyin: "ne",
          english: "Question particle (non-yes/no questions)",
        },
      ],
    },
    {
      hanzi: "对",
      pinyin: "duì",
      english: "Correct / Right / Towards",
      bangla: "সঠিক/ঠিক",
      characters: [
        {
          hanzi: "对",
          pinyin: "duì",
          meaning: "Correct, right, toward",
        },
      ],
      example: {
        hanzi: "你说得对。",
        pinyin: "Nǐ shuō de duì.",
        english: "You are right.",
        bangla: "তুমি ঠিক বলেছ।",
      },
      similar: [
        {
          hanzi: "正确",
          pinyin: "zhèngquè",
          english: "Correct (formal)",
        },
      ],
    },
    {
      hanzi: "太",
      pinyin: "tài",
      english: "Too / Very (excessive)",
      bangla: "খুব/অত্যধিক",
      characters: [
        {
          hanzi: "太",
          pinyin: "tài",
          meaning: "Too, extremely",
        },
      ],
      example: {
        hanzi: "太好了！",
        pinyin: "Tài hǎo le!",
        english: "Great! / Too good!",
        bangla: "খুব ভালো!",
      },
      similar: [
        {
          hanzi: "非常",
          pinyin: "fēicháng",
          english: "Very (neutral)",
        },
      ],
    },
    {
      hanzi: "我们",
      pinyin: "wǒmen",
      english: "We / Us",
      bangla: "আমরা",
      characters: [
        {
          hanzi: "我",
          pinyin: "wǒ",
          meaning: "I/Me",
        },
        {
          hanzi: "们",
          pinyin: "men",
          meaning: "Plural marker",
        },
      ],
      example: {
        hanzi: "我们是学生。",
        pinyin: "Wǒmen shì xuéshēng.",
        english: "We are students.",
        bangla: "আমরা ছাত্র।",
      },
      similar: [
        {
          hanzi: "咱们",
          pinyin: "zánmen",
          english: "We (inclusive, colloquial)",
        },
      ],
    },
    {
      hanzi: "想",
      pinyin: "xiǎng",
      english: "To think / To want / To miss",
      bangla: "ভাবা/চাওয়া/মিস করা",
      characters: [
        {
          hanzi: "想",
          pinyin: "xiǎng",
          meaning: "Think, want, miss",
        },
      ],
      example: {
        hanzi: "我想去中国。",
        pinyin: "Wǒ xiǎng qù Zhōngguó.",
        english: "I want to go to China.",
        bangla: "আমি চীনে যেতে চাই।",
      },
      similar: [
        {
          hanzi: "要",
          pinyin: "yào",
          english: "Want (stronger/will)",
        },
        {
          hanzi: "思考",
          pinyin: "sīkǎo",
          english: "To think deeply",
        },
      ],
    },
  ],
};
