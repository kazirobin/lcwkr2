// Lesson 3 - Text 1
import type { VocabularyData } from "@/types/vocabulary";

export const lesson3Text1Data: VocabularyData = {
  hskLevel: 1,

  lesson: 3,
  text: 1,
  dialogue: {
    title: "Nationalities",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "我是中国人。",
        pinyin: "Wǒ shì Zhōngguó rén.",
        english: "I am Chinese.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我是法国人。我",
        pinyin: "Wǒ shì Fàguó rén. Wǒ",
        english: "I am French. My",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "的中文老师也是",
        pinyin: "de Zhōngwén lǎoshī yě shì",
        english: "Chinese teacher is also",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "中国人。",
        pinyin: "Zhōngguó rén.",
        english: "Chinese.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "人",
      pinyin: "rén",
      english: "Person; people",
      bangla: "ব্যক্তি/লোক",
      characters: [
        {
          hanzi: "人",
          pinyin: "rén",
          meaning: "Person",
        },
      ],
      example: {
        hanzi: "我是一个人。",
        pinyin: "Wǒ shì yī gè rén.",
        english: "I am a person.",
        bangla: "আমি একজন ব্যক্তি।",
      },
      similar: [
        {
          hanzi: "人民",
          pinyin: "rénmín",
          english: "People",
        },
      ],
    },
    {
      hanzi: "的",
      pinyin: "de",
      english: "Possessive particle / modifier marker",
      bangla: "এর/র (সম্বন্ধ পদ)",
      characters: [
        {
          hanzi: "的",
          pinyin: "de",
          meaning: "'s / of (modifier)",
        },
      ],
      example: {
        hanzi: "这是我的书。",
        pinyin: "Zhè shì wǒ de shū.",
        english: "This is my book.",
        bangla: "এটা আমার বই।",
      },
      similar: [
        {
          hanzi: "之",
          pinyin: "zhī",
          english: "Of (classical)",
        },
      ],
    },
    {
      hanzi: "中文",
      pinyin: "Zhōngwén",
      english: "Chinese language (written)",
      bangla: "চীনা ভাষা (লিখিত)",
      characters: [
        {
          hanzi: "中",
          pinyin: "Zhōng",
          meaning: "China",
        },
        {
          hanzi: "文",
          pinyin: "wén",
          meaning: "Language/Writing",
        },
      ],
      example: {
        hanzi: "你会说中文吗？",
        pinyin: "Nǐ huì shuō Zhōngwén ma?",
        english: "Can you speak Chinese?",
        bangla: "তুমি কি চীনা বলতে পারো?",
      },
      similar: [
        {
          hanzi: "汉语",
          pinyin: "Hànyǔ",
          english: "Chinese language (spoken)",
        },
      ],
    },
    {
      hanzi: "法国",
      pinyin: "Fǎguó",
      english: "France",
      bangla: "ফ্রান্স",
      characters: [
        {
          hanzi: "法",
          pinyin: "Fǎ",
          meaning: "France (phonetic)",
        },
        {
          hanzi: "国",
          pinyin: "guó",
          meaning: "Country",
        },
      ],
      example: {
        hanzi: "她来自法国。",
        pinyin: "Tā láizì Fǎguó.",
        english: "She comes from France.",
        bangla: "সে ফ্রান্স থেকে আসে।",
      },
      similar: [
        {
          hanzi: "法兰西",
          pinyin: "Fǎlánxī",
          english: "France (formal)",
        },
      ],
    },
    {
      hanzi: "中国",
      pinyin: "Zhōngguó",
      english: "China",
      bangla: "চীন",
      characters: [
        {
          hanzi: "中",
          pinyin: "Zhōng",
          meaning: "Middle/Central",
        },
        {
          hanzi: "国",
          pinyin: "guó",
          meaning: "Country",
        },
      ],
      example: {
        hanzi: "我在中国学习。",
        pinyin: "Wǒ zài Zhōngguó xuéxí.",
        english: "I study in China.",
        bangla: "আমি চীনে পড়াশোনা করি।",
      },
      similar: [
        {
          hanzi: "中华人民共和国",
          pinyin: "Zhōnghuá Rénmín Gònghéguó",
          english: "People's Republic of China (formal)",
        },
      ],
    },
  ],
};
