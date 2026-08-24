// app/data/vocabulary/lesson8-text2.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson8text2: VocabularyData = {
  hskLevel: 2,
  lesson: 8,
  text: 2,
  dialogue: {
    title: "Going to the Movies",
    lines: [
      {
        speaker: "Liu Ming",
        hanzi: "今天有不少电影，我们看个电影吧。",
        pinyin: "Jīntiān yǒu bù shǎo diànyǐng, wǒmen kàn ge diànyǐng ba.",
        english: "There are quite a few movies today. Let's watch a movie.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "好啊！我们看哪个？",
        pinyin: "Hǎo a! Wǒmen kàn nǎge?",
        english: "Sure! Which one should we watch?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "我记得你喜欢看爱情片，我们看那个爱情片，怎么样？",
        pinyin:
          "Wǒ jìde nǐ xǐhuan kàn àiqíngpiàn, wǒmen kàn nàge àiqíngpiàn, zěnmeyàng?",
        english:
          "I remember you like romantic movies. How about we watch that romantic movie?",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "还是看这个吧，我看网上说这个电影比那个爱情片更有意思。",
        pinyin:
          "Háishi kàn zhège ba, wǒ kàn wǎngshàng shuō zhège diànyǐng bǐ nàge àiqíngpiàn gèng yǒu yìsi.",
        english:
          "Let's watch this one instead. I saw online that this movie is more interesting than that romantic movie.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "好。我去买票。",
        pinyin: "Hǎo. Wǒ qù mǎi piào.",
        english: "Okay. I'll go buy the tickets.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "到网上买吧，网上买比在这里买便宜。",
        pinyin: "Dào wǎngshàng mǎi ba, wǎngshàng mǎi bǐ zài zhèlǐ mǎi piányi.",
        english:
          "Let's buy them online. Buying online is cheaper than buying them here.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "记得",
      pinyin: "jìde",
      english: "Remember",
      bangla: "মনে রাখা",
      characters: [
        { hanzi: "记", pinyin: "jì", meaning: "To record" },
        { hanzi: "得", pinyin: "de", meaning: "To get" },
      ],
      example: {
        hanzi: "我记得你的名字。",
        pinyin: "Wǒ jìde nǐ de míngzi.",
        english: "I remember your name.",
        bangla: "আমি তোমার নাম মনে রাখি।",
      },
      similar: [{ hanzi: "记住", pinyin: "jìzhù", english: "Remember" }],
    },
    {
      hanzi: "爱情片",
      pinyin: "àiqíngpiàn",
      english: "Romance movie",
      bangla: "রোমান্স সিনেমা",
      characters: [
        { hanzi: "爱", pinyin: "ài", meaning: "Love" },
        { hanzi: "情", pinyin: "qíng", meaning: "Affection" },
        { hanzi: "片", pinyin: "piàn", meaning: "Film" },
      ],
      example: {
        hanzi: "她喜欢看爱情片。",
        pinyin: "Tā xǐhuan kàn àiqíngpiàn.",
        english: "She likes watching romance movies.",
        bangla: "সে রোমান্স সিনেমা দেখতে পছন্দ করে।",
      },
      similar: [
        { hanzi: "浪漫片", pinyin: "làngmànpiàn", english: "Romance movie" },
      ],
    },
    {
      hanzi: "有意思",
      pinyin: "yǒu yìsi",
      english: "Interesting",
      bangla: "আকর্ষণীয়/মজাদার",
      characters: [
        { hanzi: "有", pinyin: "yǒu", meaning: "To have" },
        { hanzi: "意", pinyin: "yì", meaning: "Meaning" },
        { hanzi: "思", pinyin: "sī", meaning: "Thought" },
      ],
      example: {
        hanzi: "这个汉语课很有意思。",
        pinyin: "Zhège hànyǔ kè hěn yǒu yìsi.",
        english: "This Chinese class is very interesting.",
        bangla: "এই চীনা ক্লাসটি খুব মজাদার।",
      },
      similar: [{ hanzi: "有趣", pinyin: "yǒuqù", english: "Interesting" }],
    },
  ],
};
