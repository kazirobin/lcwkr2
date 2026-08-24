// app/data/vocabulary/lesson10-text1.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson10text1: VocabularyData = {
  hskLevel: 2,
  lesson: 10,
  text: 1,
  dialogue: {
    title: "Getting Ready for School",
    lines: [
      {
        speaker: "Liu Ming",
        hanzi: "小明，你们明天开学，你准备好了吗？",
        pinyin: "Xiǎomíng, nǐmen míngtiān kāixué, nǐ zhǔnbèi hǎo le ma?",
        english: "Xiaoming, school starts tomorrow. Are you ready?",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "明天就开学啊？爸爸，我的书包你看见了吗？",
        pinyin: "Míngtiān jiù kāixué a? Bàba, wǒ de shūbāo nǐ kànjiàn le ma?",
        english: "School starts tomorrow? Dad, have you seen my schoolbag?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "书包在门后面。",
        pinyin: "Shūbāo zài mén hòumiàn.",
        english: "The schoolbag is behind the door.",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "书在哪儿呢？笔呢？",
        pinyin: "Shū zài nǎr ne? Bǐ ne?",
        english: "Where is the book? What about the pen?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "书在床上，笔在桌子上。",
        pinyin: "Shū zài chuáng shàng, bǐ zài zhuōzi shàng.",
        english: "The book is on the bed, and the pen is on the table.",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "太好了！现在都准备好了。",
        pinyin: "Tài hǎo le! Xiànzài dōu zhǔnbèi hǎo le.",
        english: "Great! Now everything is ready.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "这次爸爸帮你，下次你自己准备，好不好？",
        pinyin: "Zhè cì bàba bāng nǐ, xià cì nǐ zìjǐ zhǔnbèi, hǎo bu hǎo?",
        english:
          "Dad will help you this time. Next time, you prepare everything yourself, okay?",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "好！",
        pinyin: "Hǎo!",
        english: "Okay!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "开学",
      pinyin: "kāixué",
      english: "School starts",
      bangla: "স্কুল শুরু হওয়া",
      characters: [
        { hanzi: "开", pinyin: "kāi", meaning: "Open" },
        { hanzi: "学", pinyin: "xué", meaning: "School/Study" },
      ],
      example: {
        hanzi: "我们明天开学。",
        pinyin: "Wǒmen míngtiān kāixué.",
        english: "Our school starts tomorrow.",
        bangla: "আমাদের স্কুল আগামীকাল শুরু হবে।",
      },
      similar: [{ hanzi: "开课", pinyin: "kāikè", english: "Class starts" }],
    },
    {
      hanzi: "门",
      pinyin: "mén",
      english: "Door",
      bangla: "দরজা",
      characters: [{ hanzi: "门", pinyin: "mén", meaning: "Door" }],
      example: {
        hanzi: "请开门。",
        pinyin: "Qǐng kāi mén.",
        english: "Please open the door.",
        bangla: "দয়া করে দরজাটি খোলো।",
      },
      similar: [{ hanzi: "门口", pinyin: "ménkǒu", english: "Entrance" }],
    },
    {
      hanzi: "后面",
      pinyin: "hòumiàn",
      english: "Behind",
      bangla: "পেছনে",
      characters: [
        { hanzi: "后", pinyin: "hòu", meaning: "Behind" },
        { hanzi: "面", pinyin: "miàn", meaning: "Side" },
      ],
      example: {
        hanzi: "他站在我后面。",
        pinyin: "Tā zhàn zài wǒ hòumiàn.",
        english: "He is standing behind me.",
        bangla: "সে আমার পেছনে দাঁড়িয়ে আছে।",
      },
      similar: [{ hanzi: "后方", pinyin: "hòufāng", english: "Rear/Behind" }],
    },
    {
      hanzi: "笔",
      pinyin: "bǐ",
      english: "Pen",
      bangla: "কলম",
      characters: [{ hanzi: "笔", pinyin: "bǐ", meaning: "Pen" }],
      example: {
        hanzi: "这是谁的笔？",
        pinyin: "Zhè shì shéi de bǐ?",
        english: "Whose pen is this?",
        bangla: "এটি কার কলম?",
      },
      similar: [{ hanzi: "铅笔", pinyin: "qiānbǐ", english: "Pencil" }],
    },
    {
      hanzi: "帮",
      pinyin: "bāng",
      english: "To help",
      bangla: "সাহায্য করা",
      characters: [{ hanzi: "帮", pinyin: "bāng", meaning: "To help" }],
      example: {
        hanzi: "你能帮我吗？",
        pinyin: "Nǐ néng bāng wǒ ma?",
        english: "Can you help me?",
        bangla: "তুমি কি আমাকে সাহায্য করতে পারো?",
      },
      similar: [{ hanzi: "帮助", pinyin: "bāngzhù", english: "To help" }],
    },
  ],
};
