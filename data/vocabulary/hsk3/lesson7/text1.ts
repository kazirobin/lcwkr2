// app/data/vocabulary/lesson7-text1.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk3lesson7text1: VocabularyData = {
  hskLevel: 3,
  lesson: 7,
  text: 1,
  dialogue: {
    title: "Buying a New Bicycle",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "这辆自行车是小雪八岁的时候买的，看起来有点儿旧了。",
        pinyin: "Zhè liàng zìxíngchē shì Xiǎoxuě bā suì de shíhou mǎi de, kàn qǐlái yǒudiǎnr jiù le.",
        english: "This bicycle was bought when Xiaoxue was eight years old; it looks a bit old.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "是啊，她现在长高了，这辆车已经太矮了。",
        pinyin: "Shì a, tā xiànzài zhǎng gāo le, zhè liàng chē yǐjīng tài ǎi le.",
        english: "Yes, she has grown taller now, and this bike is already too short.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "商场里开了一家自行车店，咱们给她买辆新的吧。",
        pinyin: "Shāngchǎng lǐ kāi le yì jiā zìxíngchē diàn, zánmen gěi tā mǎi liàng xīn de ba.",
        english: "A bicycle shop has opened in the mall, let's buy her a new one.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "好，咱们带小雪一起去，让她试一下。",
        pinyin: "Hǎo, zánmen dài Xiǎoxuě yìqǐ qù, ràng tā shì yíxià.",
        english: "Okay, let's take Xiaoxue along so she can try it out.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "那今天就去吧！我也想再看看衣服。咱们怎么去？",
        pinyin: "Nà jīntiān jiù qù ba! Wǒ yě xiǎng zài kànkan yīfu. Zánmen zěnme qù?",
        english: "Then let's go today! I also want to look at some more clothes. How shall we go?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "商场不远，我们可以走着去。",
        pinyin: "Shāngchǎng bù yuǎn, wǒmen kěyǐ zǒuzhe qù.",
        english: "The mall is not far, we can walk there.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "辆",
      pinyin: "liàng",
      english: "Measure word for vehicles",
      bangla: "যানবাহন গণনার একক",
      characters: [
        { hanzi: "车", pinyin: "chē", meaning: "Vehicle" },
        { hanzi: "两", pinyin: "liǎng", meaning: "Two" },
      ],
      example: {
        hanzi: "一辆车。",
        pinyin: "Yī liàng chē.",
        english: "A car/vehicle.",
        bangla: "একটি গাড়ি।",
      },
      similar: [{ hanzi: "台", pinyin: "tái", english: "Measure word for machines" }],
    },
    {
      hanzi: "自行车",
      pinyin: "zìxíngchē",
      english: "Bicycle",
      bangla: "সাইকেল",
      characters: [
        { hanzi: "自", pinyin: "zì", meaning: "Self" },
        { hanzi: "行", pinyin: "xíng", meaning: "Go" },
        { hanzi: "车", pinyin: "chē", meaning: "Vehicle" },
      ],
      example: {
        hanzi: "我骑自行车去学校。",
        pinyin: "Wǒ qí zìxíngchē qù xuéxiào.",
        english: "I ride a bicycle to school.",
        bangla: "আমি সাইকেলে করে স্কুলে যাই।",
      },
      similar: [{ hanzi: "单车", pinyin: "dānchē", english: "Bicycle" }],
    },
    {
      hanzi: "旧",
      pinyin: "jiù",
      english: "Old",
      bangla: "পুরোনো",
      characters: [
        { hanzi: "丨", pinyin: "gǔn", meaning: "Line" },
        { hanzi: "日", pinyin: "rì", meaning: "Day" },
      ],
      example: {
        hanzi: "这件衣服太旧了。",
        pinyin: "Zhè jiàn yīfu tài jiù le.",
        english: "This piece of clothing is too old.",
        bangla: "এই পোশাকটা খুব পুরোনো।",
      },
      similar: [{ hanzi: "古老", pinyin: "gǔlǎo", english: "Ancient" }],
    },
    {
      hanzi: "矮",
      pinyin: "ǎi",
      english: "Short (height)",
      bangla: "নিচু/খাটো",
      characters: [
        { hanzi: "矢", pinyin: "shǐ", meaning: "Arrow" },
        { hanzi: "委", pinyin: "wěi", meaning: "Entrust" },
      ],
      example: {
        hanzi: "他比我矮。",
        pinyin: "Tā bǐ wǒ ǎi.",
        english: "He is shorter than me.",
        bangla: "সে আমার চেয়ে খাটো।",
      },
      similar: [{ hanzi: "低", pinyin: "dī", english: "Low" }],
    },
    {
      hanzi: "试",
      pinyin: "shì",
      english: "Try",
      bangla: "চেষ্টা করা",
      characters: [
        { hanzi: "讠", pinyin: "yán", meaning: "Speech" },
        { hanzi: "式", pinyin: "shì", meaning: "Style" },
      ],
      example: {
        hanzi: "你可以试一下。",
        pinyin: "Nǐ kěyǐ shì yíxià.",
        english: "You can try it.",
        bangla: "তুমি একটু চেষ্টা করে দেখতে পারো।",
      },
      similar: [{ hanzi: "尝试", pinyin: "chángshì", english: "Attempt" }],
    },
  ],
};