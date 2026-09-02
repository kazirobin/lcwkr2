// app/data/vocabulary/lesson2-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson2text3: VocabularyData = {
  hskLevel: 2,
  lesson: 2,
  text: 3,
  dialogue: {
    title: "The Cinema at Peking University",
    lines: [
      {
        speaker: "Anni",
        hanzi: "家月，你看，学校里有家电影院！",
        pinyin: "Jiāyuè, nǐ kàn, xuéxiào lǐ yǒu jiā diànyǐngyuàn!",
        english: "Jiayue, look! There is a cinema in the school!",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "是啊，电影院还不小。",
        pinyin: "Shì a, diànyǐngyuàn hái bù xiǎo.",
        english: "Yes, the cinema is quite big.",
      },
      {
        speaker: "Anni",
        hanzi: "他们卖的电影票也很便宜。",
        pinyin: "Tāmen mài de diànyǐngpiào yě hěn piányi.",
        english: "The movie tickets they sell are also very cheap.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "天啊！有的还不到二十块钱。",
        pinyin: "Tiān a! Yǒude hái bú dào èrshí kuài qián.",
        english: "Oh my! Some of them are less than twenty yuan.",
      },
      {
        speaker: "Anni",
        hanzi: "那你想不想去看个电影？",
        pinyin: "Nà nǐ xiǎng bu xiǎng qù kàn ge diànyǐng?",
        english: "Then, do you want to go watch a movie?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "还是别看电影了，北京大学就很好看！",
        pinyin: "Háishi bié kàn diànyǐng le, Běijīng Dàxué jiù hěn hǎokàn!",
        english:
          "Let's not watch a movie. Peking University itself is very beautiful!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "票",
      pinyin: "piào",
      english: "Ticket",
      bangla: "টিকিট",
      characters: [
        { hanzi: "覀", pinyin: "xī", meaning: "Cover" },
        { hanzi: "示", pinyin: "shì", meaning: "Altar/Show" },
      ],
      example: {
        hanzi: "我买了两张电影票。",
        pinyin: "Wǒ mǎile liǎng zhāng diànyǐng piào.",
        english: "I bought two movie tickets.",
        bangla: "আমি দুটি সিনেমার টিকিট কিনেছি।",
      },
      similar: [{ hanzi: "券", pinyin: "quàn", english: "Ticket/Coupon" }],
    },
    {
      hanzi: "别",
      pinyin: "bié",
      english: "Don't",
      bangla: "নিষেধ/না",
      characters: [
        { hanzi: "另", pinyin: "lìng", meaning: "Other" },
        { hanzi: "刂", pinyin: "dāo", meaning: "Knife" },
      ],
      example: {
        hanzi: "别担心，一切都会好的。",
        pinyin: "Bié dānxīn, yīqiè dūhuì hǎo de.",
        english: "Don't worry, everything will be fine.",
        bangla: "চিন্তা করো না, সব ঠিক হয়ে যাবে।",
      },
      similar: [{ hanzi: "不要", pinyin: "bùyào", english: "Don't" }],
    },
  ],
};
