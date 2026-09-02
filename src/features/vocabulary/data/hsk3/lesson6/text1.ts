// app/data/vocabulary/lesson6-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson6text1: VocabularyData = {
  hskLevel: 3,
  lesson: 6,
  text: 1,
  dialogue: {
    title: "Planning the Trip to Shanghai",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "家月，咱们该买去上海的票了。你打算怎么去上海？",
        pinyin: "Jiāyuè, zánmen gāi mǎi qù Shànghǎi de piào le. Nǐ dǎsuàn zěnme qù Shànghǎi?",
        english: "Jiayue, we should buy tickets to Shanghai. How do you plan to go to Shanghai?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我还没坐过高铁，咱们坐高铁去，怎么样？",
        pinyin: "Wǒ hái méi zuòguò gāotiě, zánmen zuò gāotiě qù, zěnmeyàng?",
        english: "I haven't taken the high-speed train yet. How about we go by high-speed train?",
      },
      {
        speaker: "Li Wen",
        hanzi: "没问题，从北京到上海的高铁很多，非常方便。",
        pinyin: "Méi wèntí, cóng Běijīng dào Shànghǎi de gāotiě hěn duō, fēicháng fāngbiàn.",
        english: "No problem, there are many high-speed trains from Beijing to Shanghai, very convenient.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "行！怎么买高铁票？",
        pinyin: "Xíng! Zěnme mǎi gāotiě piào?",
        english: "Okay! How do we buy high-speed train tickets?",
      },
      {
        speaker: "Li Wen",
        hanzi: "用手机App就能买。给我你的护照，我帮你买。",
        pinyin: "Yòng shǒujī App jiù néng mǎi. Gěi wǒ nǐ de hùzhào, wǒ bāng nǐ mǎi.",
        english: "You can buy them using a mobile app. Give me your passport, I'll buy it for you.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "早就听说过高铁，终于可以坐上了。",
        pinyin: "Zǎo jiù tīngshuō guò gāotiě, zhōngyú kěyǐ zuò shang le.",
        english: "I've heard about the high-speed train long ago, and finally I can ride it.",
      },
      {
        speaker: "Li Wen",
        hanzi: "高铁又快又舒服，你一定会喜欢的。",
        pinyin: "Gāotiě yòu kuài yòu shūfu, nǐ yídìng huì xǐhuan de.",
        english: "High-speed trains are both fast and comfortable, you will definitely like it.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "该",
      pinyin: "gāi",
      english: "Should/Ought to",
      bangla: "উচিত",
      characters: [
        { hanzi: "讠", pinyin: "yán", meaning: "Speech" },
        { hanzi: "亥", pinyin: "hài", meaning: "Pig" },
      ],
      example: {
        hanzi: "我们该走了。",
        pinyin: "Wǒmen gāi zǒu le.",
        english: "We should go.",
        bangla: "আমাদের যাওয়া উচিত।",
      },
      similar: [{ hanzi: "应该", pinyin: "yīnggāi", english: "Should" }],
    },
    {
      hanzi: "打算",
      pinyin: "dǎsuàn",
      english: "Plan/Intend",
      bangla: "পরিকল্পনা করা",
      characters: [
        { hanzi: "打", pinyin: "dǎ", meaning: "Hit" },
        { hanzi: "算", pinyin: "suàn", meaning: "Calculate" },
      ],
      example: {
        hanzi: "你打算去哪儿？",
        pinyin: "Nǐ dǎsuàn qù nǎr?",
        english: "Where do you plan to go?",
        bangla: "তুমি কোথায় যাওয়ার পরিকল্পনা করছ?",
      },
      similar: [{ hanzi: "计划", pinyin: "jìhuà", english: "Plan" }],
    },
    {
      hanzi: "高铁",
      pinyin: "gāotiě",
      english: "High-speed train",
      bangla: "বুলেট ট্রেন",
      characters: [
        { hanzi: "高", pinyin: "gāo", meaning: "High" },
        { hanzi: "铁", pinyin: "tiě", meaning: "Iron/Rail" },
      ],
      example: {
        hanzi: "高铁很快。",
        pinyin: "Gāotiě hěn kuài.",
        english: "High-speed trains are very fast.",
        bangla: "বুলেট ট্রেন খুব দ্রুতগতির।",
      },
      similar: [{ hanzi: "动车", pinyin: "dòngchē", english: "Bullet train" }],
    },
    {
      hanzi: "行",
      pinyin: "xíng",
      english: "Okay/All right",
      bangla: "ঠিক আছে",
      characters: [
        { hanzi: "彳", pinyin: "chì", meaning: "Step" },
        { hanzi: "亍", pinyin: "chù", meaning: "Step" },
      ],
      example: {
        hanzi: "行，就这么办。",
        pinyin: "Xíng, jiù zhème bàn.",
        english: "Okay, let's do it that way.",
        bangla: "ঠিক আছে, তাই করি।",
      },
      similar: [{ hanzi: "好", pinyin: "hǎo", english: "Good/Okay" }],
    },
  ],
};