// app/data/vocabulary/lesson12-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson12text3: VocabularyData = {
  hskLevel: 2,
  lesson: 12,
  text: 3,
  dialogue: {
    title: "Let's Go Running",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "喂，家月，今天天气不错，我们去跑步吧！",
        pinyin: "Wéi, Jiāyuè, jīntiān tiānqì búcuò, wǒmen qù pǎobù ba!",
        english: "Hello, Jiayue. The weather is nice today. Let's go running!",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "你跑步跑得比我快，我们能一起跑吗？",
        pinyin: "Nǐ pǎobù pǎo de bǐ wǒ kuài, wǒmen néng yìqǐ pǎo ma?",
        english: "You run faster than me. Can we run together?",
      },
      {
        speaker: "Li Wen",
        hanzi: "可以的，我慢慢跑，等着你。",
        pinyin: "Kěyǐ de, wǒ mànmàn pǎo, děngzhe nǐ.",
        english: "Sure. I'll run slowly and wait for you.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "好吧。你真爱跑步啊！",
        pinyin: "Hǎo ba. Nǐ zhēn ài pǎobù a!",
        english: "Okay. You really love running!",
      },
      {
        speaker: "Li Wen",
        hanzi: "我从小就经常跟爸爸跑步，跑步能让人快乐！",
        pinyin:
          "Wǒ cóngxiǎo jiù jīngcháng gēn bàba pǎobù, pǎobù néng ràng rén kuàilè!",
        english:
          "I've often gone running with my father since I was little. Running can make people happy!",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "好，那我准备一下。",
        pinyin: "Hǎo, nà wǒ zhǔnbèi yíxià.",
        english: "Okay, then I'll get ready.",
      },
      {
        speaker: "Li Wen",
        hanzi: "我现在坐地铁去找你，一会儿楼下见。",
        pinyin: "Wǒ xiànzài zuò dìtiě qù zhǎo nǐ, yíhuìr lóu xià jiàn.",
        english:
          "I'll take the subway to find you now. See you downstairs in a little while.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "从小",
      pinyin: "cóngxiǎo",
      english: "Since childhood",
      bangla: "ছোটবেলা থেকে",
      characters: [
        { hanzi: "从", pinyin: "cóng", meaning: "From" },
        { hanzi: "小", pinyin: "xiǎo", meaning: "Small/Young" },
      ],
      example: {
        hanzi: "他从小就喜欢画画。",
        pinyin: "Tā cóngxiǎo jiù xǐhuan huàhuà.",
        english: "He has liked drawing since childhood.",
        bangla: "সে ছোটবেলা থেকে ছবি আঁকতে পছন্দ করে।",
      },
      similar: [{ hanzi: "童年", pinyin: "tóngnián", english: "Childhood" }],
    },
    {
      hanzi: "地铁",
      pinyin: "dìtiě",
      english: "Subway/Metro",
      bangla: "পাতাল রেল/মেট্রো",
      characters: [
        { hanzi: "地", pinyin: "dì", meaning: "Ground" },
        { hanzi: "铁", pinyin: "tiě", meaning: "Iron/Rail" },
      ],
      example: {
        hanzi: "我每天坐地铁去上班。",
        pinyin: "Wǒ měitiān zuò dìtiě qù shàngbān.",
        english: "I take the subway to work every day.",
        bangla: "আমি প্রতিদিন মেট্রো করে অফিসে যাই।",
      },
      similar: [
        { hanzi: "地下铁", pinyin: "dìxiàtiě", english: "Underground railway" },
      ],
    },
    {
      hanzi: "楼",
      pinyin: "lóu",
      english: "Building/Floor",
      bangla: "বহুতল ভবন/তলা",
      characters: [
        { hanzi: "木", pinyin: "mù", meaning: "Wood" },
        { hanzi: "娄", pinyin: "lóu", meaning: "Multi-story" },
      ],
      example: {
        hanzi: "我住在这栋楼的三楼。",
        pinyin: "Wǒ zhù zài zhè dòng lóu de sān lóu.",
        english: "I live on the third floor of this building.",
        bangla: "আমি এই ভবনের তৃতীয় তলায় থাকি।",
      },
      similar: [{ hanzi: "建筑物", pinyin: "jiànzhùwù", english: "Building" }],
    },
  ],
};
