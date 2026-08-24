// app/data/vocabulary/lesson9-text3.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson9text3: VocabularyData = {
  hskLevel: 2,
  lesson: 9,
  text: 3,
  dialogue: {
    title: "Walking Home",
    lines: [
      {
        speaker: "Liu Ming",
        hanzi: "我们打车回去吧。",
        pinyin: "Wǒmen dǎchē huíqù ba.",
        english: "Let's take a taxi back.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "这里离家很近，还是走路吧。",
        pinyin: "Zhèlǐ lí jiā hěn jìn, háishi zǒulù ba.",
        english: "It's very close to home from here. Let's walk instead.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "要走多长时间？",
        pinyin: "Yào zǒu duō cháng shíjiān?",
        english: "How long will it take to walk?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "走半个多小时就到了。",
        pinyin: "Zǒu bàn ge duō xiǎoshí jiù dào le.",
        english: "It will take a little more than half an hour to get there.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "好的。每天上下班都坐车，今天运动运动吧。",
        pinyin:
          "Hǎo de. Měitiān shàngxiàbān dōu zuò chē, jīntiān yùndòng yùndòng ba.",
        english:
          "Okay. We take a vehicle to and from work every day, so let's get some exercise today.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "近",
      pinyin: "jìn",
      english: "Near",
      bangla: "কাছে",
      characters: [
        { hanzi: "斤", pinyin: "jīn", meaning: "Axe/Phonetic" },
        { hanzi: "辶", pinyin: "chuò", meaning: "Movement" },
      ],
      example: {
        hanzi: "我的家很近。",
        pinyin: "Wǒ de jiā hěn jìn.",
        english: "My house is very near.",
        bangla: "আমার বাড়ি খুব কাছে।",
      },
      similar: [{ hanzi: "靠近", pinyin: "kàojìn", english: "Near" }],
    },
    {
      hanzi: "走路",
      pinyin: "zǒulù",
      english: "To walk",
      bangla: "হাঁটা",
      characters: [
        { hanzi: "走", pinyin: "zǒu", meaning: "Walk" },
        { hanzi: "路", pinyin: "lù", meaning: "Road" },
      ],
      example: {
        hanzi: "我们走路去学校。",
        pinyin: "Wǒmen zǒulù qù xuéxiào.",
        english: "We walk to school.",
        bangla: "আমরা হেঁটে স্কুলে যাই।",
      },
      similar: [
        { hanzi: "步行", pinyin: "bùxíng", english: "To walk on foot" },
      ],
    },
  ],
};
