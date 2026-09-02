// Lesson 4 - Text 2
import type { VocabularyData } from "@/features/vocabulary/types";

export const lesson4Text2Data: VocabularyData = {
  hskLevel: 1,

  lesson: 4,
  text: 2,
  dialogue: {
    title: "Family Members",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "我有两个哥哥，你呢？",
        pinyin: "Wǒ yǒu liǎng gè gēge, nǐ ne?",
        english: "I have two older brothers. What about you?",
      },
      {
        speaker: "Yang Tongle",
        hanzi: "我没有哥哥。",
        pinyin: "Wǒ méiyǒu gēge.",
        english: "I don't have any older brothers.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你家有几口人？",
        pinyin: "Nǐ jiā yǒu jǐ kǒu rén?",
        english: "How many people are there in your family?",
      },
      {
        speaker: "Yang Tongle",
        hanzi: "我家有四口人，爸爸、妈妈、妹妹和我。",
        pinyin: "Wǒ jiā yǒu sì kǒu rén, bàba, māma, mèimei hé wǒ.",
        english:
          "There are four people in my family: dad, mom, younger sister, and me.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "哥哥",
      pinyin: "gēge",
      english: "Older brother",
      bangla: "বড় ভাই",
      characters: [
        {
          hanzi: "哥",
          pinyin: "gē",
          meaning: "Elder brother",
        },
        {
          hanzi: "哥",
          pinyin: "gē",
          meaning: "Elder brother (reduplicated)",
        },
      ],
      example: {
        hanzi: "我哥哥很高。",
        pinyin: "Wǒ gēge hěn gāo.",
        english: "My older brother is very tall.",
        bangla: "আমার বড় ভাই খুব লম্বা।",
      },
      similar: [
        {
          hanzi: "大哥",
          pinyin: "dàgē",
          english: "Eldest brother / Big bro (respectful)",
        },
      ],
    },
    {
      hanzi: "呢",
      pinyin: "ne",
      english: "Question particle (non-yes/no questions / topic continuing)",
      bangla: "প্রশ্নবোধক শব্দ",
      characters: [
        {
          hanzi: "呢",
          pinyin: "ne",
          meaning: "Question particle (softens questions)",
        },
      ],
      example: {
        hanzi: "我在家，你呢？",
        pinyin: "Wǒ zài jiā, nǐ ne?",
        english: "I'm at home, and you?",
        bangla: "আমি বাড়িতে আছি, তুমি?",
      },
      similar: [
        {
          hanzi: "吗",
          pinyin: "ma",
          english: "Yes/no question particle",
        },
      ],
    },
    {
      hanzi: "没有",
      pinyin: "méiyǒu",
      english: "To not have / There is no / Haven't (done)",
      bangla: "নেই/না",
      characters: [
        {
          hanzi: "没",
          pinyin: "méi",
          meaning: "Not",
        },
        {
          hanzi: "有",
          pinyin: "yǒu",
          meaning: "Have",
        },
      ],
      example: {
        hanzi: "我没有钱。",
        pinyin: "Wǒ méiyǒu qián.",
        english: "I don't have money.",
        bangla: "আমার টাকা নেই।",
      },
      similar: [
        {
          hanzi: "无",
          pinyin: "wú",
          english: "Without (formal/literary)",
        },
      ],
    },
    {
      hanzi: "家",
      pinyin: "jiā",
      english: "Home / Family / House",
      bangla: "বাড়ি/পরিবার",
      characters: [
        {
          hanzi: "家",
          pinyin: "jiā",
          meaning: "Home, family",
        },
      ],
      example: {
        hanzi: "我家在北京。",
        pinyin: "Wǒ jiā zài Běijīng.",
        english: "My home/family is in Beijing.",
        bangla: "আমার বাড়ি বেইজিং-এ।",
      },
      similar: [
        {
          hanzi: "家庭",
          pinyin: "jiātíng",
          english: "Family (formal)",
        },
      ],
    },
    {
      hanzi: "几",
      pinyin: "jǐ",
      english: "How many (small numbers, usually under 10)",
      bangla: "কত (ছোট সংখ্যার জন্য)",
      characters: [
        {
          hanzi: "几",
          pinyin: "jǐ",
          meaning: "How many (expecting small number answer)",
        },
      ],
      example: {
        hanzi: "你有几个姐姐？",
        pinyin: "Nǐ yǒu jǐ ge jiějie?",
        english: "How many older sisters do you have?",
        bangla: "তোমার কয়জন বড় বোন আছে?",
      },
      similar: [
        {
          hanzi: "多少",
          pinyin: "duōshǎo",
          english: "How many (any number range)",
        },
      ],
    },
    {
      hanzi: "口",
      pinyin: "kǒu",
      english: "Measure word for family members / Mouth",
      bangla: "জন (পরিবারের সদস্যের জন্য)/মুখ",
      characters: [
        {
          hanzi: "口",
          pinyin: "kǒu",
          meaning: "Mouth; measure word for family members",
        },
      ],
      example: {
        hanzi: "我家有五口人。",
        pinyin: "Wǒ jiā yǒu wǔ kǒu rén.",
        english: "My family has five people.",
        bangla: "আমার পরিবারে পাঁচ জন।",
      },
      similar: [
        {
          hanzi: "个",
          pinyin: "gè",
          english: "Generic measure word",
        },
        {
          hanzi: "位",
          pinyin: "wèi",
          english: "Polite measure word for people",
        },
      ],
    },
    {
      hanzi: "爸爸",
      pinyin: "bàba",
      english: "Dad / Father",
      bangla: "বাবা",
      characters: [
        {
          hanzi: "爸",
          pinyin: "bà",
          meaning: "Dad",
        },
        {
          hanzi: "爸",
          pinyin: "bà",
          meaning: "Dad (reduplicated)",
        },
      ],
      example: {
        hanzi: "我爸爸是老师。",
        pinyin: "Wǒ bàba shì lǎoshī.",
        english: "My dad is a teacher.",
        bangla: "আমার বাবা একজন শিক্ষক।",
      },
      similar: [
        {
          hanzi: "父亲",
          pinyin: "fùqīn",
          english: "Father (formal)",
        },
      ],
    },
    {
      hanzi: "妈妈",
      pinyin: "māma",
      english: "Mom / Mother",
      bangla: "মা",
      characters: [
        {
          hanzi: "妈",
          pinyin: "mā",
          meaning: "Mom",
        },
        {
          hanzi: "妈",
          pinyin: "mā",
          meaning: "Mom (reduplicated)",
        },
      ],
      example: {
        hanzi: "我妈妈很漂亮。",
        pinyin: "Wǒ māma hěn piàoliang.",
        english: "My mom is very beautiful.",
        bangla: "আমার মা খুব সুন্দর।",
      },
      similar: [
        {
          hanzi: "母亲",
          pinyin: "mǔqīn",
          english: "Mother (formal)",
        },
      ],
    },
    {
      hanzi: "妹妹",
      pinyin: "mèimei",
      english: "Younger sister",
      bangla: "ছোট বোন",
      characters: [
        {
          hanzi: "妹",
          pinyin: "mèi",
          meaning: "Younger sister",
        },
        {
          hanzi: "妹",
          pinyin: "mèi",
          meaning: "Younger sister (reduplicated)",
        },
      ],
      example: {
        hanzi: "我妹妹在上大学。",
        pinyin: "Wǒ mèimei zài shàng dàxué.",
        english: "My younger sister is in college.",
        bangla: "আমার ছোট বোন বিশ্ববিদ্যালয়ে পড়ে।",
      },
      similar: [
        {
          hanzi: "小妹",
          pinyin: "xiǎomèi",
          english: "Little sister (affectionate)",
        },
      ],
    },
    {
      hanzi: "和",
      pinyin: "hé",
      english: "And / With",
      bangla: "এবং/সাথে",
      characters: [
        {
          hanzi: "和",
          pinyin: "hé",
          meaning: "And, with (connects nouns)",
        },
      ],
      example: {
        hanzi: "我和你去。",
        pinyin: "Wǒ hé nǐ qù.",
        english: "I'll go with you.",
        bangla: "আমি তোমার সাথে যাব।",
      },
      similar: [
        {
          hanzi: "跟",
          pinyin: "gēn",
          english: "With (following)",
        },
        {
          hanzi: "与",
          pinyin: "yǔ",
          english: "And (formal/written)",
        },
        {
          hanzi: "及",
          pinyin: "jí",
          english: "And (formal)",
        },
      ],
    },
  ],
};
