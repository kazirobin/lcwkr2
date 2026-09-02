// app/data/vocabulary/lesson14-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson14text4: VocabularyData = {
  hskLevel: 2,
  lesson: 14,
  text: 4,
  dialogue: {
    title: "Tongle's Girlfriend",
    lines: [
      {
        speaker: "Narrator",
        hanzi:
          "同乐带着他的女朋友来看一飞。她的眼睛大大的，头发长长的，非常漂亮。",
        pinyin:
          "Tónglè dàizhe tā de nǚpéngyou lái kàn Yīfēi. Tā de yǎnjing dàdà de, tóufa chángcháng de, fēicháng piàoliang.",
        english:
          "Tongle brought his girlfriend to visit Yifei. Her eyes were big, her hair was long, and she was very beautiful.",
      },
      {
        speaker: "Narrator",
        hanzi: "一飞问她姓什么，她说她姓林。",
        pinyin: "Yīfēi wèn tā xìng shénme, tā shuō tā xìng Lín.",
        english:
          "Yifei asked her what her surname was, and she said her surname was Lin.",
      },
      {
        speaker: "Narrator",
        hanzi: "他们三个人一起去吃饭、跳舞，玩得非常开心。",
        pinyin:
          "Tāmen sān ge rén yìqǐ qù chīfàn, tiàowǔ, wán de fēicháng kāixīn.",
        english:
          "The three of them went to eat and dance together, and they had a great time.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "姓",
      pinyin: "xìng",
      english: "Surname",
      bangla: "বংশনাম/পদবি",
      characters: [
        { hanzi: "女", pinyin: "nǚ", meaning: "Woman" },
        { hanzi: "生", pinyin: "shēng", meaning: "Birth" },
      ],
      example: {
        hanzi: "你姓什么？",
        pinyin: "Nǐ xìng shénme?",
        english: "What is your surname?",
        bangla: "তোমার পদবি কী?",
      },
      similar: [{ hanzi: "姓名", pinyin: "xìngmíng", english: "Full name" }],
    },
    {
      hanzi: "眼睛",
      pinyin: "yǎnjing",
      english: "Eyes",
      bangla: "চোখ",
      characters: [
        { hanzi: "眼", pinyin: "yǎn", meaning: "Eye" },
        { hanzi: "睛", pinyin: "jīng", meaning: "Eyeball" },
      ],
      example: {
        hanzi: "她的眼睛很大。",
        pinyin: "Tā de yǎnjing hěn dà.",
        english: "Her eyes are very big.",
        bangla: "তার চোখ দুটি খুব বড়।",
      },
      similar: [{ hanzi: "眼", pinyin: "yǎn", english: "Eye" }],
    },
    {
      hanzi: "跳舞",
      pinyin: "tiàowǔ",
      english: "To dance",
      bangla: "নাচ করা",
      characters: [
        { hanzi: "跳", pinyin: "tiào", meaning: "Jump" },
        { hanzi: "舞", pinyin: "wǔ", meaning: "Dance" },
      ],
      example: {
        hanzi: "我们一起跳舞吧。",
        pinyin: "Wǒmen yìqǐ tiàowǔ ba.",
        english: "Let's dance together.",
        bangla: "আমরা একসাথে নাচ করি।",
      },
      similar: [{ hanzi: "舞蹈", pinyin: "wǔdǎo", english: "Dance" }],
    },
  ],
};
