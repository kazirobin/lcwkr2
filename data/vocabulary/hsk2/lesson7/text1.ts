// app/data/vocabulary/lesson7-text1.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson7text1: VocabularyData = {
  hskLevel: 2,
  lesson: 7,
  text: 1,
  dialogue: {
    title: "Playing Basketball",
    lines: [
      {
        speaker: "Chen Tianzhong",
        hanzi: "安妮，你是什么时候从北京回来的？",
        pinyin: "Ānnī, nǐ shì shénme shíhou cóng Běijīng huílái de?",
        english: "Anni, when did you come back from Beijing?",
      },
      {
        speaker: "Anni",
        hanzi: "昨天下午。天中，你怎么一下课就往外跑？",
        pinyin: "Zuótiān xiàwǔ. Tiānzhōng, nǐ zěnme yí xiàkè jiù wǎng wài pǎo?",
        english:
          "Yesterday afternoon. Tianzhong, why did you run outside as soon as class ended?",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "我跟同学说好了，一起去打篮球。",
        pinyin: "Wǒ gēn tóngxué shuō hǎo le, yìqǐ qù dǎ lánqiú.",
        english:
          "I made plans with my classmates to go play basketball together.",
      },
      {
        speaker: "Anni",
        hanzi: "我也想跟你们一起玩。",
        pinyin: "Wǒ yě xiǎng gēn nǐmen yìqǐ wán.",
        english: "I also want to play with you guys.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "没问题，走吧。",
        pinyin: "Méi wèntí, zǒu ba.",
        english: "No problem. Let's go.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "从",
      pinyin: "cóng",
      english: "From",
      bangla: "থেকে",
      characters: [{ hanzi: "从", pinyin: "cóng", meaning: "From" }],
      example: {
        hanzi: "我从北京来。",
        pinyin: "Wǒ cóng Běijīng lái.",
        english: "I come from Beijing.",
        bangla: "আমি বেইজিং থেকে এসেছি।",
      },
      similar: [{ hanzi: "自", pinyin: "zì", english: "From" }],
    },
    {
      hanzi: "往",
      pinyin: "wǎng",
      english: "Towards/Go",
      bangla: "দিকে/যাওয়া",
      characters: [{ hanzi: "往", pinyin: "wǎng", meaning: "Towards" }],
      example: {
        hanzi: "往前走。",
        pinyin: "Wǎng qián zǒu.",
        english: "Walk straight ahead.",
        bangla: "সামনের দিকে হাঁটুন।",
      },
      similar: [{ hanzi: "向", pinyin: "xiàng", english: "Towards" }],
    },
    {
      hanzi: "跑",
      pinyin: "pǎo",
      english: "Run",
      bangla: "দৌড়ানো",
      characters: [{ hanzi: "跑", pinyin: "pǎo", meaning: "Run" }],
      example: {
        hanzi: "他跑得很快。",
        pinyin: "Tā pǎo de hěn kuài.",
        english: "He runs very fast.",
        bangla: "সে খুব দ্রুত দৌড়ায়।",
      },
      similar: [{ hanzi: "奔", pinyin: "bēn", english: "Run" }],
    },
    {
      hanzi: "打",
      pinyin: "dǎ",
      english: "Play/Hit",
      bangla: "খেলা/আঘাত করা",
      characters: [{ hanzi: "打", pinyin: "dǎ", meaning: "Hit/Play" }],
      example: {
        hanzi: "我们打篮球吧。",
        pinyin: "Wǒmen dǎ lánqiú ba.",
        english: "Let's play basketball.",
        bangla: "আমরা বাস্কেটবল খেলি।",
      },
      similar: [{ hanzi: "击", pinyin: "jī", english: "Hit" }],
    },
    {
      hanzi: "篮球",
      pinyin: "lánqiú",
      english: "Basketball",
      bangla: "বাস্কেটবল",
      characters: [
        { hanzi: "篮", pinyin: "lán", meaning: "Basket" },
        { hanzi: "球", pinyin: "qiú", meaning: "Ball" },
      ],
      example: {
        hanzi: "我喜欢打篮球。",
        pinyin: "Wǒ xǐhuān dǎ lánqiú.",
        english: "I like playing basketball.",
        bangla: "আমি বাস্কেটবল খেলতে পছন্দ করি।",
      },
      similar: [{ hanzi: "皮球", pinyin: "píqiú", english: "Ball" }],
    },
  ],
};
