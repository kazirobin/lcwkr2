// app/data/vocabulary/lesson1-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson1text1: VocabularyData = {
  hskLevel: 2,
  lesson: 1,
  text: 1,
  dialogue: {
    title: "Meeting Wang Yifei's Sister",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "请问，您是王一飞老师的姐姐吗？",
        pinyin: "Qǐngwèn, nín shì Wáng Yīfēi lǎoshī de jiějie ma?",
        english: "Excuse me, are you Teacher Wang Yifei's older sister?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "是的，你们就是她的学生吧？",
        pinyin: "Shì de, nǐmen jiù shì tā de xuésheng ba?",
        english: "Yes. You must be her students, right?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "对。我是白家月，她是安妮。",
        pinyin: "Duì. Wǒ shì Bái Jiāyuè, tā shì Ānnī.",
        english: "Yes. I am Bai Jiayue, and she is Anni.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你们好，我叫王一雪。一飞给我打电话了，让我来接你们。",
        pinyin:
          "Nǐmen hǎo, wǒ jiào Wáng Yīxuě. Yīfēi gěi wǒ dǎ diànhuà le, ràng wǒ lái jiē nǐmen.",
        english:
          "Hello. My name is Wang Yixue. Yifei called me and asked me to come pick you up.",
      },
      {
        speaker: "Bai Jiayue & Anni",
        hanzi: "谢谢您。",
        pinyin: "Xièxie nín.",
        english: "Thank you.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "不客气。",
        pinyin: "Bú kèqi.",
        english: "You're welcome.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "就",
      pinyin: "jiù",
      english: "Exactly/Precisely",
      bangla: "ঠিক/অবিলম্বে",
      characters: [
        { hanzi: "京", pinyin: "jīng", meaning: "Capital" },
        { hanzi: "尤", pinyin: "yóu", meaning: "Special" },
      ],
      example: {
        hanzi: "我就来。",
        pinyin: "Wǒ jiù lái.",
        english: "I am coming right away.",
        bangla: "আমি এখনই আসছি।",
      },
      similar: [{ hanzi: "正", pinyin: "zhèng", english: "Exactly" }],
    },
    {
      hanzi: "给",
      pinyin: "gěi",
      english: "To/For",
      bangla: "দেওয়া/জন্য",
      characters: [
        { hanzi: "纟", pinyin: "sī", meaning: "Silk thread" },
        { hanzi: "合", pinyin: "hé", meaning: "Combine" },
      ],
      example: {
        hanzi: "给我这个。",
        pinyin: "Gěi wǒ zhè gè.",
        english: "Give this to me.",
        bangla: "এটি আমাকে দাও।",
      },
      similar: [{ hanzi: "为", pinyin: "wèi", english: "For" }],
    },
    {
      hanzi: "让",
      pinyin: "ràng",
      english: "Let/Allow",
      bangla: "অনুমতি দেওয়া",
      characters: [
        { hanzi: "讠", pinyin: "yán", meaning: "Speech" },
        { hanzi: "上", pinyin: "shàng", meaning: "Up" },
      ],
      example: {
        hanzi: "让我看看。",
        pinyin: "Ràng wǒ kàn kàn.",
        english: "Let me take a look.",
        bangla: "আমাকে দেখতে দাও।",
      },
      similar: [{ hanzi: "叫", pinyin: "jiào", english: "Let/Make/Call" }],
    },
    {
      hanzi: "接",
      pinyin: "jiē",
      english: "Meet/Welcome/Receive",
      bangla: "গ্রহণ করা/স্বাগত জানানো",
      characters: [
        { hanzi: "扌", pinyin: "shǒu", meaning: "Hand" },
        { hanzi: "妾", pinyin: "qiè", meaning: "Concubine" },
      ],
      example: {
        hanzi: "我去接你。",
        pinyin: "Wǒ qù jiē nǐ.",
        english: "I will go to pick you up.",
        bangla: "আমি তোমাকে নিতে আসব।",
      },
      similar: [{ hanzi: "迎", pinyin: "yíng", english: "Welcome/Meet" }],
    },
  ],
};
