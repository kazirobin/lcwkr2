// app/data/vocabulary/lesson1-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson1text2: VocabularyData = {
  hskLevel: 2,
  lesson: 1,
  text: 2,
  dialogue: {
    title: "First Time in Beijing",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "你们是第一次来北京吗？",
        pinyin: "Nǐmen shì dì-yī cì lái Běijīng ma?",
        english: "Is this your first time coming to Beijing?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "是的，我们都是第一次来。",
        pinyin: "Shì de, wǒmen dōu shì dì-yī cì lái.",
        english: "Yes, it is. It is our first time coming here.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你们是来学中文的吗？",
        pinyin: "Nǐmen shì lái xué Zhōngwén de ma?",
        english: "Did you come here to study Chinese?",
      },
      {
        speaker: "Anni",
        hanzi: "不是，我们是来旅游的。",
        pinyin: "Bú shì, wǒmen shì lái lǚyóu de.",
        english: "No, we came here to travel.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "我这几天都不忙，你们有事就找我。",
        pinyin: "Wǒ zhè jǐ tiān dōu bù máng, nǐmen yǒu shì jiù zhǎo wǒ.",
        english:
          "I am not busy these days. If you need anything, just come to me.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "好的，谢谢您。",
        pinyin: "Hǎo de, xièxie nín.",
        english: "Okay, thank you.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "次",
      pinyin: "cì",
      english: "Time/Occurrence",
      bangla: "বার/পর্যায়",
      characters: [
        { hanzi: "冫", pinyin: "bīng", meaning: "Ice" },
        { hanzi: "欠", pinyin: "qiàn", meaning: "Yawn/Shortage" },
      ],
      example: {
        hanzi: "我去过三次中国。",
        pinyin: "Wǒ qùguo sān cì Zhōngguó.",
        english: "I have been to China three times.",
        bangla: "আমি চীনে তিনবার গিয়েছি।",
      },
      similar: [{ hanzi: "遍", pinyin: "biàn", english: "Time (Occurrence)" }],
    },
    {
      hanzi: "旅游",
      pinyin: "lǚyóu",
      english: "Travel",
      bangla: "ভ্রমণ করা",
      characters: [
        { hanzi: "旅", pinyin: "lǚ", meaning: "Travel" },
        { hanzi: "游", pinyin: "yóu", meaning: "Roam" },
      ],
      example: {
        hanzi: "我们明年去中国旅游。",
        pinyin: "Wǒmen míngnián qù Zhōngguó lǚyóu.",
        english: "We will travel to China next year.",
        bangla: "আমরা আগামী বছর চীনে ভ্রমণ করব।",
      },
      similar: [{ hanzi: "旅行", pinyin: "lǚxíng", english: "Travel" }],
    },
  ],
};
