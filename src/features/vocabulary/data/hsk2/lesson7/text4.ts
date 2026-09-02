// app/data/vocabulary/lesson7-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson7text4: VocabularyData = {
  hskLevel: 2,
  lesson: 7,
  text: 4,
  dialogue: {
    title: "My Hobby Is Sports",
    lines: [
      {
        speaker: "Chen Tianzhong",
        hanzi:
          "我的爱好是运动。从上小学开始，我每天都跟爸爸去运动。现在我篮球打得很好，足球踢得不错，游泳游得也很快。我一有时间就去运动。",
        pinyin:
          "Wǒ de àihào shì yùndòng. Cóng shàng xiǎoxué kāishǐ, wǒ měitiān dōu gēn bàba qù yùndòng. Xiànzài wǒ lánqiú dǎ de hěn hǎo, zúqiú tī de búcuò, yóuyǒng yóu de yě hěn kuài. Wǒ yí yǒu shíjiān jiù qù yùndòng.",
        english:
          "My hobby is sports. Since I started primary school, I have exercised with my father every day. Now I play basketball very well, I play soccer pretty well, and I also swim very fast. Whenever I have time, I exercise.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "爱好",
      pinyin: "àihào",
      english: "Hobby",
      bangla: "শখ",
      characters: [
        { hanzi: "爱", pinyin: "ài", meaning: "Love" },
        { hanzi: "好", pinyin: "hào", meaning: "Like" },
      ],
      example: {
        hanzi: "我的爱好是看书。",
        pinyin: "Wǒ de àihào shì kànshū.",
        english: "My hobby is reading books.",
        bangla: "আমার শখ হলো বই পড়া।",
      },
      similar: [{ hanzi: "兴趣", pinyin: "xìngqù", english: "Interest" }],
    },
    {
      hanzi: "开始",
      pinyin: "kāishǐ",
      english: "To start/Begin",
      bangla: "শুরু করা",
      characters: [
        { hanzi: "开", pinyin: "kāi", meaning: "Open" },
        { hanzi: "始", pinyin: "shǐ", meaning: "Begin" },
      ],
      example: {
        hanzi: "比赛什么时候开始？",
        pinyin: "Bǐsài shénme shíhou kāishǐ?",
        english: "When does the match start?",
        bangla: "ম্যাচ কখন শুরু হবে?",
      },
      similar: [{ hanzi: "开启", pinyin: "kāiqǐ", english: "To open/start" }],
    },
  ],
};
