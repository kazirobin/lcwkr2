// app/data/vocabulary/lesson4-text4.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson4text4: VocabularyData = {
  hskLevel: 2,
  lesson: 4,
  text: 4,
  dialogue: {
    title: "Colors",
    lines: [
      {
        speaker: "Narrator",
        hanzi:
          "颜色在我们的生活中非常重要。每个人都有自己的颜色，红色代表幸福，白色代表纯洁，绿色代表自然。",
        pinyin:
          "Yánsè zài wǒmen de shēnghuó zhōng fēicháng zhòngyào. Měi gè rén dōu yǒu zìjǐ de yánsè, hóngsè dàibiǎo xìngfú, báisè dàibiǎo chúnjié, lǜsè dàibiǎo zìrán.",
        english:
          "Colors are very important in our lives. Everyone has their own color. Red represents happiness, white represents purity, and green represents nature.",
      },
      {
        speaker: "Narrator",
        hanzi: "买衣服的时候，你会选择什么颜色的衣服？",
        pinyin: "Mǎi yīfú de shíhou, nǐ huì xuǎnzé shénme yánsè de yīfú?",
        english: "When buying clothes, what color of clothes would you choose?",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "颜色",
      pinyin: "yánsè",
      english: "Color",
      bangla: "রঙ",
      characters: [
        { hanzi: "颜", pinyin: "yán", meaning: "Face/Expression" },
        { hanzi: "色", pinyin: "sè", meaning: "Color/Look" },
      ],
      example: {
        hanzi: "你喜欢什么颜色？",
        pinyin: "Nǐ xǐhuan shénme yánsè?",
        english: "What color do you like?",
        bangla: "তুমি কোন রঙ পছন্দ করো?",
      },
      similar: [{ hanzi: "色彩", pinyin: "sècǎi", english: "Color/Hue" }],
    },
  ],
};
