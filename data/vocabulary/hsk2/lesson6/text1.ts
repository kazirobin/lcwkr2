// app/data/vocabulary/lesson6-text1.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson6text1: VocabularyData = {
  hskLevel: 2,
  lesson: 6,
  text: 1,
  dialogue: {
    title: "Preparing for a Birthday",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "明天就是女儿的生日了。",
        pinyin: "Míngtiān jiù shì nǚ'ér de shēngrì le.",
        english: "Tomorrow is our daughter's birthday.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "你不说，我还真忘了。我们给她准备个什么礼物呢？",
        pinyin:
          "Nǐ bù shuō, wǒ hái zhēn wàng le. Wǒmen gěi tā zhǔnbèi ge shénme lǐwù ne?",
        english:
          "If you hadn't said it, I really would have forgotten. What gift should we prepare for her?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "她喜欢画画，你觉得画笔怎么样？",
        pinyin: "Tā xǐhuan huàhuà, nǐ juéde huàbǐ zěnmeyàng?",
        english: "She likes drawing. What do you think about drawing brushes?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "就送画笔吧！",
        pinyin: "Jiù sòng huàbǐ ba!",
        english: "Let's just give her drawing brushes!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "那我明天上午就去买。",
        pinyin: "Nà wǒ míngtiān shàngwǔ jiù qù mǎi.",
        english: "Then I'll go buy them tomorrow morning.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "好的！我再给她买个大大的生日蛋糕。",
        pinyin: "Hǎo de! Wǒ zài gěi tā mǎi ge dàdà de shēngrì dàngāo.",
        english: "Okay! I'll also buy her a big birthday cake.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "生日",
      pinyin: "shēngrì",
      english: "Birthday",
      bangla: "জন্মদিন",
      characters: [
        { hanzi: "生", pinyin: "shēng", meaning: "Birth/Life" },
        { hanzi: "日", pinyin: "rì", meaning: "Day" },
      ],
      example: {
        hanzi: "祝你生日快乐！",
        pinyin: "Zhù nǐ shēngrì kuàilè!",
        english: "Happy birthday to you!",
        bangla: "তোমার জন্মদিনের শুভেচ্ছা!",
      },
      similar: [
        { hanzi: "诞辰", pinyin: "dànchén", english: "Birthday (formal)" },
      ],
    },
    {
      hanzi: "忘",
      pinyin: "wàng",
      english: "To forget",
      bangla: "ভুলে যাওয়া",
      characters: [
        { hanzi: "亡", pinyin: "wáng", meaning: "Lost/Die" },
        { hanzi: "心", pinyin: "xīn", meaning: "Heart" },
      ],
      example: {
        hanzi: "我忘了他的名字。",
        pinyin: "Wǒ wàngle tā de míngzi.",
        english: "I forgot his name.",
        bangla: "আমি তার নাম ভুলে গেছি।",
      },
      similar: [{ hanzi: "忘记", pinyin: "wàngjì", english: "To forget" }],
    },
    {
      hanzi: "画",
      pinyin: "huà",
      english: "To draw/paint",
      bangla: "ছবি আঁকা",
      characters: [
        { hanzi: "一", pinyin: "yī", meaning: "One" },
        { hanzi: "由", pinyin: "yóu", meaning: "Cause" },
        { hanzi: "凵", pinyin: "qiàn", meaning: "Container" },
      ],
      example: {
        hanzi: "他喜欢画画。",
        pinyin: "Tā xǐhuan huàhuà.",
        english: "He likes to draw pictures.",
        bangla: "সে ছবি আঁকতে পছন্দ করে।",
      },
      similar: [{ hanzi: "绘", pinyin: "huì", english: "To paint/draw" }],
    },
    {
      hanzi: "画笔",
      pinyin: "huàbǐ",
      english: "Paintbrush",
      bangla: "ছবি আঁকার তুলি",
      characters: [
        { hanzi: "画", pinyin: "huà", meaning: "Draw" },
        { hanzi: "笔", pinyin: "bǐ", meaning: "Pen/Brush" },
      ],
      example: {
        hanzi: "妹妹用画笔画了一朵花。",
        pinyin: "Mèimei yòng huàbǐ huàle yī duǒ huā.",
        english: "Younger sister drew a flower with a paintbrush.",
        bangla: "বোন ছবি আঁকার তুলি দিয়ে একটি ফুল এঁকেছে।",
      },
      similar: [{ hanzi: "毛笔", pinyin: "máobǐ", english: "Ink brush" }],
    },
    {
      hanzi: "蛋糕",
      pinyin: "dàngāo",
      english: "Cake",
      bangla: "কেক",
      characters: [
        { hanzi: "蛋", pinyin: "dàn", meaning: "Egg" },
        { hanzi: "糕", pinyin: "gāo", meaning: "Cake" },
      ],
      example: {
        hanzi: "我们一起吃蛋糕吧。",
        pinyin: "Wǒmen yīqǐ chī dàngāo ba.",
        english: "Let's eat cake together.",
        bangla: "আমরা একসাথে কেক খাই।",
      },
      similar: [{ hanzi: "甜点", pinyin: "tiándiǎn", english: "Dessert" }],
    },
  ],
};
