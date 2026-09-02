// app/data/vocabulary/lesson12-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson12text1: VocabularyData = {
  hskLevel: 2,
  lesson: 12,
  text: 1,
  dialogue: {
    title: "The Weather",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "喂，家月，是你啊！有什么事情吗？",
        pinyin: "Wéi, Jiāyuè, shì nǐ a! Yǒu shénme shìqing ma?",
        english: "Hello, Jiayue, it's you! What's the matter?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "没什么事，就想跟您说说话。",
        pinyin: "Méi shénme shì, jiù xiǎng gēn nín shuōshuo huà.",
        english: "Nothing much. I just wanted to talk with you.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "好啊。你今天没课吗？",
        pinyin: "Hǎo a. Nǐ jīntiān méi kè ma?",
        english: "Sure. Don't you have classes today?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "下午有课。您那里天气怎么样？",
        pinyin: "Xiàwǔ yǒu kè. Nín nàli tiānqì zěnmeyàng?",
        english: "I have class in the afternoon. How is the weather there?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "北京这几天虽然是晴天，但是有点儿冷。",
        pinyin:
          "Běijīng zhè jǐ tiān suīrán shì qíngtiān, dànshì yǒudiǎnr lěng.",
        english:
          "Although it has been sunny in Beijing these days, it is a little cold.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我这里比北京冷多了，外边还正下着雪呢！",
        pinyin:
          "Wǒ zhèlǐ bǐ Běijīng lěng duō le, wàibian hái zhèng xiàzhe xuě ne!",
        english:
          "It is much colder here than in Beijing. It is even snowing outside!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "事情",
      pinyin: "shìqing",
      english: "Matter/Thing",
      bangla: "বিষয়/কাজ",
      characters: [
        { hanzi: "事", pinyin: "shì", meaning: "Matter" },
        { hanzi: "情", pinyin: "qíng", meaning: "Situation" },
      ],
      example: {
        hanzi: "我有很多事情要做。",
        pinyin: "Wǒ yǒu hěnduō shìqing yào zuò.",
        english: "I have a lot of things to do.",
        bangla: "আমার অনেক কাজ করতে হবে।",
      },
      similar: [
        { hanzi: "事务", pinyin: "shìwù", english: "Business/Affairs" },
      ],
    },
    {
      hanzi: "晴",
      pinyin: "qíng",
      english: "Sunny/Clear",
      bangla: "রৌদ্রোজ্জ্বল",
      characters: [
        { hanzi: "日", pinyin: "rì", meaning: "Sun" },
        { hanzi: "青", pinyin: "qīng", meaning: "Blue/Green" },
      ],
      example: {
        hanzi: "今天是晴天。",
        pinyin: "Jīntiān shì qíngtiān.",
        english: "Today is a sunny day.",
        bangla: "আজ রৌদ্রোজ্জ্বল দিন।",
      },
      similar: [{ hanzi: "晴朗", pinyin: "qínglǎng", english: "Sunny/Clear" }],
    },
    {
      hanzi: "正",
      pinyin: "zhèng",
      english: "Just/Right now",
      bangla: "ঠিক এই মুহূর্তে",
      characters: [
        { hanzi: "一", pinyin: "yī", meaning: "One" },
        { hanzi: "止", pinyin: "zhǐ", meaning: "Stop" },
      ],
      example: {
        hanzi: "他正看书呢。",
        pinyin: "Tā zhèng kànshū ne.",
        english: "He is just reading a book.",
        bangla: "সে ঠিক এখন বই পড়ছে।",
      },
      similar: [
        { hanzi: "正在", pinyin: "zhèngzài", english: "In the process of" },
      ],
    },
  ],
};
