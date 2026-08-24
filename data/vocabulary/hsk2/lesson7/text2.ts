// app/data/vocabulary/lesson7-text2.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson7text2: VocabularyData = {
  hskLevel: 2,
  lesson: 7,
  text: 2,
  dialogue: {
    title: "Sports Hobbies",
    lines: [
      {
        speaker: "Anni",
        hanzi: "天中，你是不是很喜欢打篮球？",
        pinyin: "Tiānzhōng, nǐ shì bu shì hěn xǐhuan dǎ lánqiú?",
        english: "Tianzhong, do you really like playing basketball?",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "没错。",
        pinyin: "Méi cuò.",
        english: "That's right.",
      },
      {
        speaker: "Anni",
        hanzi: "你还喜欢什么运动？",
        pinyin: "Nǐ hái xǐhuan shénme yùndòng?",
        english: "What other sports do you like?",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "我还喜欢踢足球，一到星期天就跟朋友们去踢球。",
        pinyin:
          "Wǒ hái xǐhuan tī zúqiú, yí dào Xīngqītiān jiù gēn péngyoumen qù tī qiú.",
        english:
          "I also like playing soccer. As soon as Sunday comes, I go play soccer with my friends.",
      },
      {
        speaker: "Anni",
        hanzi: "你踢得怎么样？",
        pinyin: "Nǐ tī de zěnmeyàng?",
        english: "How well do you play soccer?",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "我踢得还可以。",
        pinyin: "Wǒ tī de hái kěyǐ.",
        english: "I'm pretty good at it.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "运动",
      pinyin: "yùndòng",
      english: "Sports/Exercise",
      bangla: "খেলাধুলা/ব্যায়াম",
      characters: [
        { hanzi: "运", pinyin: "yùn", meaning: "Move" },
        { hanzi: "动", pinyin: "dòng", meaning: "Move" },
      ],
      example: {
        hanzi: "我喜欢运动。",
        pinyin: "Wǒ xǐhuan yùndòng.",
        english: "I like sports.",
        bangla: "আমি খেলাধুলা পছন্দ করি।",
      },
      similar: [{ hanzi: "锻炼", pinyin: "duànliàn", english: "Exercise" }],
    },
    {
      hanzi: "踢",
      pinyin: "tī",
      english: "To kick",
      bangla: "লাথি দেওয়া",
      characters: [
        { hanzi: "⻊", pinyin: "zú", meaning: "Foot" },
        { hanzi: "易", pinyin: "yì", meaning: "Change" },
      ],
      example: {
        hanzi: "他踢了球。",
        pinyin: "Tā tī le qiú.",
        english: "He kicked the ball.",
        bangla: "সে বলটি লাথি মারল।",
      },
      similar: [{ hanzi: "踹", pinyin: "chuài", english: "Trample/Kick" }],
    },
    {
      hanzi: "足球",
      pinyin: "zúqiú",
      english: "Football/Soccer",
      bangla: "ফুটবল",
      characters: [
        { hanzi: "足", pinyin: "zú", meaning: "Foot" },
        { hanzi: "球", pinyin: "qiú", meaning: "Ball" },
      ],
      example: {
        hanzi: "我们去踢足球吧。",
        pinyin: "Wǒmen qù tī zúqiú ba.",
        english: "Let's go play soccer.",
        bangla: "চলো ফুটবল খেলতে যাই।",
      },
      similar: [{ hanzi: "橄榄球", pinyin: "gǎnlǎnqiú", english: "Rugby" }],
    },
    {
      hanzi: "球",
      pinyin: "qiú",
      english: "Ball",
      bangla: "বল",
      characters: [
        { hanzi: "王", pinyin: "wáng", meaning: "Jade/King" },
        { hanzi: "求", pinyin: "qiú", meaning: "Request" },
      ],
      example: {
        hanzi: "这个球很大。",
        pinyin: "Zhège qiú hěn dà.",
        english: "This ball is very big.",
        bangla: "এই বলটি খুব বড়।",
      },
      similar: [{ hanzi: "丸", pinyin: "wán", english: "Pill/Ball" }],
    },
    {
      hanzi: "得",
      pinyin: "de",
      english: "Structural particle",
      bangla: "ক্রিয়া বা গুণের মাত্রা নির্দেশক কণা",
      characters: [
        { hanzi: "彳", pinyin: "chì", meaning: "Step" },
        { hanzi: "旦", pinyin: "dàn", meaning: "Dawn" },
        { hanzi: "寸", pinyin: "cùn", meaning: "Inch" },
      ],
      example: {
        hanzi: "他跑得很快。",
        pinyin: "Tā pǎo de hěn kuài.",
        english: "He runs very fast.",
        bangla: "সে খুব দ্রুত দৌড়ায়।",
      },
      similar: [{ hanzi: "地", pinyin: "de", english: "Adverbial particle" }],
    },
  ],
};
