// app/data/vocabulary/lesson8-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson8text4: VocabularyData = {
  hskLevel: 2,
  lesson: 8,
  text: 4,
  dialogue: {
    title: "A Happy Birthday",
    lines: [
      {
        speaker: "Narrator",
        hanzi: "虽然妻子忘了今天是自己的生日，但是丈夫记得。",
        pinyin:
          "Suīrán qīzi wàng le jīntiān shì zìjǐ de shēngrì, dànshì zhàngfu jìde.",
        english:
          "Although the wife forgot that today was her birthday, her husband remembered.",
      },
      {
        speaker: "Narrator",
        hanzi:
          "丈夫请妻子去饭馆吃饭、去电影院看电影，还给妻子买了一块非常漂亮的手表。",
        pinyin:
          "Zhàngfu qǐng qīzi qù fànguǎn chīfàn, qù diànyǐngyuàn kàn diànyǐng, hái gěi qīzi mǎi le yí kuài fēicháng piàoliang de shǒubiǎo.",
        english:
          "The husband took his wife to a restaurant for dinner, took her to the cinema to watch a movie, and also bought her a very beautiful watch.",
      },
      {
        speaker: "Narrator",
        hanzi: "妻子觉得今天很快乐。",
        pinyin: "Qīzi juéde jīntiān hěn kuàilè.",
        english: "The wife felt very happy today.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "妻子",
      pinyin: "qīzi",
      english: "Wife",
      bangla: "স্ত্রী",
      characters: [
        { hanzi: "妻", pinyin: "qī", meaning: "Wife" },
        { hanzi: "子", pinyin: "zi", meaning: "Suffix" },
      ],
      example: {
        hanzi: "他的妻子是医生。",
        pinyin: "Tā de qīzi shì yīshēng.",
        english: "His wife is a doctor.",
        bangla: "তার স্ত্রী একজন ডাক্তার।",
      },
      similar: [{ hanzi: "老婆", pinyin: "lǎopo", english: "Wife" }],
    },
    {
      hanzi: "丈夫",
      pinyin: "zhàngfu",
      english: "Husband",
      bangla: "স্বামী",
      characters: [
        { hanzi: "丈", pinyin: "zhàng", meaning: "Elder male" },
        { hanzi: "夫", pinyin: "fū", meaning: "Husband/Man" },
      ],
      example: {
        hanzi: "她的丈夫在银行工作。",
        pinyin: "Tā de zhàngfu zài yínháng gōngzuò.",
        english: "Her husband works in a bank.",
        bangla: "তার স্বামী ব্যাংকে কাজ করে।",
      },
      similar: [{ hanzi: "老公", pinyin: "lǎogōng", english: "Husband" }],
    },
    {
      hanzi: "饭馆",
      pinyin: "fànguǎn",
      english: "Restaurant",
      bangla: "রেস্তোরাঁ",
      characters: [
        { hanzi: "饭", pinyin: "fàn", meaning: "Meal/Rice" },
        { hanzi: "馆", pinyin: "guǎn", meaning: "Building/Shop" },
      ],
      example: {
        hanzi: "我们去那家饭馆吃饭吧。",
        pinyin: "Wǒmen qù nà jiā fànguǎn chīfàn ba.",
        english: "Let's go eat at that restaurant.",
        bangla: "আমরা ঐ রেস্তোরাঁয় খেতে যাই।",
      },
      similar: [
        { hanzi: "餐厅", pinyin: "cāntīng", english: "Restaurant/Dining hall" },
      ],
    },
  ],
};
