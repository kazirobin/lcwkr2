// Lesson 13 - Text 3
import type { VocabularyData } from "@/features/vocabulary/types";

export const lesson13Text3Data: VocabularyData = {
  hskLevel: 1,

  lesson: 13,
  text: 3,
  dialogue: {
    title: "Asking About a Phone Shop",
    lines: [
      {
        speaker: "白家月",
        hanzi: "王老师，我可以再问您一个问题吗？",
        pinyin: "Wáng lǎoshī, wǒ kěyǐ zài wèn nín yí ge wèntí ma?",
        english: "Teacher Wang, may I ask you one more question?",
      },
      {
        speaker: "王一飞",
        hanzi: "可以。你有什么问题？",
        pinyin: "Kěyǐ. Nǐ yǒu shénme wèntí?",
        english: "Sure. What question do you have?",
      },
      {
        speaker: "白家月",
        hanzi: "那个小店卖不卖手机？",
        pinyin: "Nàge xiǎodiàn mài bu mài shǒujī?",
        english: "Does that little shop sell mobile phones?",
      },
      {
        speaker: "王一飞",
        hanzi: "我不知道。你可以打电话问一下。",
        pinyin: "Wǒ bù zhīdào. Nǐ kěyǐ dǎ diànhuà wèn yíxià.",
        english: "I don't know. You can call and ask.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "先生",
      pinyin: "xiānsheng",
      english: "Mr. / Sir",
      bangla: "জনাব/মহোদয়",
      characters: [
        {
          hanzi: "先",
          pinyin: "xiān",
          meaning: "Before",
        },
        {
          hanzi: "生",
          pinyin: "shēng",
          meaning: "Born",
        },
      ],
      example: {
        hanzi: "先生，请坐。",
        pinyin: "Xiānsheng, qǐng zuò.",
        english: "Sir, please sit down.",
        bangla: "জনাব, দয়া করে বসুন।",
      },
      similar: [
        {
          hanzi: "老板",
          pinyin: "lǎobǎn",
          english: "Boss/Owner",
        },
      ],
    },
    {
      hanzi: "一半",
      pinyin: "yíbàn",
      english: "Half",
      bangla: "অর্ধেক",
      characters: [
        {
          hanzi: "一",
          pinyin: "yī",
          meaning: "One",
        },
        {
          hanzi: "半",
          pinyin: "bàn",
          meaning: "Half",
        },
      ],
      example: {
        hanzi: "我喝了一半茶。",
        pinyin: "Wǒ hē le yíbàn chá.",
        english: "I drank half of the tea.",
        bangla: "আমি অর্ধেক চা পান করেছি।",
      },
      similar: [
        {
          hanzi: "半",
          pinyin: "bàn",
          english: "Half",
        },
      ],
    },
    {
      hanzi: "茶",
      pinyin: "chá",
      english: "Tea",
      bangla: "চা",
      characters: [
        {
          hanzi: "艹",
          pinyin: "cǎo",
          meaning: "Grass/Plant radical",
        },
        {
          hanzi: "人",
          pinyin: "rén",
          meaning: "Person",
        },
        {
          hanzi: "木",
          pinyin: "mù",
          meaning: "Tree",
        },
      ],
      example: {
        hanzi: "你想喝茶吗？",
        pinyin: "Nǐ xiǎng hē chá ma?",
        english: "Do you want to drink tea?",
        bangla: "তুমি কি চা খেতে চাও?",
      },
      similar: [
        {
          hanzi: "绿茶",
          pinyin: "lǜchá",
          english: "Green tea",
        },
      ],
    },
  ],
};
