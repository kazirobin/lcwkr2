// app/data/vocabulary/lesson10-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson10text2: VocabularyData = {
  hskLevel: 2,
  lesson: 10,
  text: 2,
  dialogue: {
    title: "Preparing for an Exam",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "小雪，你在做什么呢？",
        pinyin: "Xiǎoxuě, nǐ zài zuò shénme ne?",
        english: "Xiaoxue, what are you doing?",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "明天考试，我在看书呢。",
        pinyin: "Míngtiān kǎoshì, wǒ zài kàn shū ne.",
        english: "There is an exam tomorrow. I'm studying.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "这些词要好好看看。",
        pinyin: "Zhèxiē cí yào hǎohāo kànkan.",
        english: "You should review these words carefully.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "我看过了，意思也都懂了。",
        pinyin: "Wǒ kàn guo le, yìsi yě dōu dǒng le.",
        english:
          "I've already reviewed them, and I understand all the meanings.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你的本子呢？本子上做错的题也要看一看。",
        pinyin: "Nǐ de běnzi ne? Běnzi shàng zuòcuò de tí yě yào kàn yi kàn.",
        english:
          "What about your notebook? You should also review the questions you got wrong in the notebook.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "妈妈，是您准备考试还是我准备考试？",
        pinyin: "Māma, shì nín zhǔnbèi kǎoshì háishì wǒ zhǔnbèi kǎoshì?",
        english:
          "Mom, are you preparing for the exam, or am I preparing for the exam?",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "考试",
      pinyin: "kǎoshì",
      english: "Exam",
      bangla: "পরীক্ষা",
      characters: [
        { hanzi: "考", pinyin: "kǎo", meaning: "Test" },
        { hanzi: "试", pinyin: "shì", meaning: "Try" },
      ],
      example: {
        hanzi: "明天有一个重要的考试。",
        pinyin: "Míngtiān yǒu yí gè zhòngyào de kǎoshì.",
        english: "Tomorrow there is an important exam.",
        bangla: "আগামীকাল একটি গুরুত্বপূর্ণ পরীক্ষা আছে।",
      },
      similar: [{ hanzi: "测试", pinyin: "cèshì", english: "Test" }],
    },
    {
      hanzi: "词",
      pinyin: "cí",
      english: "Word",
      bangla: "শব্দ",
      characters: [{ hanzi: "词", pinyin: "cí", meaning: "Word" }],
      example: {
        hanzi: "这是一个新词。",
        pinyin: "Zhè shì yí gè xīn cí.",
        english: "This is a new word.",
        bangla: "এটি একটি নতুন শব্দ।",
      },
      similar: [{ hanzi: "词语", pinyin: "cíyǔ", english: "Words/Phrases" }],
    },
    {
      hanzi: "本子",
      pinyin: "běnzi",
      english: "Notebook",
      bangla: "নোটবুক/খাতা",
      characters: [
        { hanzi: "本", pinyin: "běn", meaning: "Root/Measure word" },
        { hanzi: "子", pinyin: "zi", meaning: "Suffix" },
      ],
      example: {
        hanzi: "请把字写在本子上。",
        pinyin: "Qǐng bǎ zì xiě zài běnzi shang.",
        english: "Please write the words in the notebook.",
        bangla: "অনুগ্রহ করে কথাগুলো খাতায় লেখো।",
      },
      similar: [{ hanzi: "笔记本", pinyin: "bǐjìběn", english: "Notebook" }],
    },
    {
      hanzi: "错",
      pinyin: "cuò",
      english: "Wrong",
      bangla: "ভুল",
      characters: [{ hanzi: "错", pinyin: "cuò", meaning: "Wrong" }],
      example: {
        hanzi: "这个答案是错的。",
        pinyin: "Zhè gè dá'àn shì cuò de.",
        english: "This answer is wrong.",
        bangla: "এই উত্তরটি ভুল।",
      },
      similar: [{ hanzi: "错误", pinyin: "cuòwù", english: "Mistake/Error" }],
    },
    {
      hanzi: "题",
      pinyin: "tí",
      english: "Question",
      bangla: "প্রশ্ন",
      characters: [{ hanzi: "题", pinyin: "tí", meaning: "Question/Topic" }],
      example: {
        hanzi: "这道题很难。",
        pinyin: "Zhè dào tí hěn nán.",
        english: "This question is very difficult.",
        bangla: "এই প্রশ্নটি খুব কঠিন।",
      },
      similar: [
        { hanzi: "问题", pinyin: "wèntí", english: "Question/Problem" },
      ],
    },
    {
      hanzi: "还是",
      pinyin: "háishi",
      english: "Or (in questions)",
      bangla: "অথবা (প্রশ্নে)",
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
  ],
};
