// app/data/vocabulary/lesson5-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson5text4: VocabularyData = {
  hskLevel: 2,
  lesson: 5,
  text: 4,
  dialogue: {
    title: "Going Back to the Hotel",
    lines: [
      {
        speaker: "Narrator",
        hanzi: "回国前一天，我们去一雪姐家了。",
        pinyin: "Huí guó qián yì tiān, wǒmen qù Yìxuě jiě jiā le.",
        english:
          "The day before returning to our country, we went to Sister Yixue's home.",
      },
      {
        speaker: "Narrator",
        hanzi: "到她家的时候，饭菜都做好了。",
        pinyin: "Dào tā jiā de shíhou, fàncài dōu zuòhǎo le.",
        english:
          "When we arrived at her home, all the food had already been prepared.",
      },
      {
        speaker: "Narrator",
        hanzi: "刘爷爷还准备了奶茶。",
        pinyin: "Liú yéye hái zhǔnbèile nǎichá.",
        english: "Grandpa Liu had also prepared bubble tea.",
      },
      {
        speaker: "Narrator",
        hanzi: "因为吃了太多东西，我们吃完饭是走回酒店的。",
        pinyin:
          "Yīnwèi chī le tài duō dōngxi, wǒmen chī wán fàn shì zǒu huí jiǔdiàn de.",
        english:
          "Because we ate too much, we walked back to the hotel after the meal.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "走",
      pinyin: "zǒu",
      english: "Walk/Go",
      bangla: "হাঁটা/যাওয়া",
      characters: [{ hanzi: "走", pinyin: "zǒu", meaning: "Walk" }],
      example: {
        hanzi: "我们走吧。",
        pinyin: "Wǒmen zǒu ba.",
        english: "Let's go.",
        bangla: "চলো যাই।",
      },
      similar: [{ hanzi: "去", pinyin: "qù", english: "Go" }],
    },
    {
      hanzi: "酒店",
      pinyin: "jiǔdiàn",
      english: "Hotel",
      bangla: "হোটেল",
      characters: [
        { hanzi: "酒", pinyin: "jiǔ", meaning: "Alcohol/Drink" },
        { hanzi: "店", pinyin: "diàn", meaning: "Shop" },
      ],
      example: {
        hanzi: "我住在这家酒店。",
        pinyin: "Wǒ zhù zài zhè jiā jiǔdiàn.",
        english: "I live in this hotel.",
        bangla: "আমি এই হোটেলে থাকি।",
      },
      similar: [
        { hanzi: "饭店", pinyin: "fàndiàn", english: "Hotel/Restaurant" },
      ],
    },
  ],
};
