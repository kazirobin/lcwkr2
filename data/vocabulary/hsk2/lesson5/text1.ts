// app/data/vocabulary/lesson5-text1.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson5text1: VocabularyData = {
  hskLevel: 2,
  lesson: 5,
  text: 1,
  dialogue: {
    title: "Going Down",
    lines: [
      {
        speaker: "Anni",
        hanzi: "家月，快下来吧，第一次去中国朋友家，别晚了。",
        pinyin:
          "Jiāyuè, kuài xiàlái ba, dì-yī cì qù Zhōngguó péngyou jiā, bié wǎn le.",
        english:
          "Jiayue, come down quickly. It's your first time going to a Chinese friend's home, so don't be late.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "还有时间，你上来吧。",
        pinyin: "Hái yǒu shíjiān, nǐ shànglái ba.",
        english: "There's still time. Come upstairs.",
      },
      {
        speaker: "Anni",
        hanzi: "我不上去了，就在下面等你。",
        pinyin: "Wǒ bù shàngqù le, jiù zài xiàmiàn děng nǐ.",
        english: "I'm not coming upstairs. I'll wait for you downstairs.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "那我一会儿就下去。",
        pinyin: "Nà wǒ yíhuìr jiù xiàqù.",
        english: "Then I'll come down in a little while.",
      },
      {
        speaker: "Anni",
        hanzi: "你快点儿吧。",
        pinyin: "Nǐ kuài diǎnr ba.",
        english: "Please hurry up.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "没事，一雪姐说11点前到就可以。",
        pinyin: "Méishì, Yìxuě jiě shuō shíyī diǎn qián dào jiù kěyǐ.",
        english:
          "It's okay. Sister Yixue said that arriving before 11 o'clock is fine.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "快",
      pinyin: "kuài",
      english: "Fast/Quickly",
      bangla: "দ্রুত",
      characters: [{ hanzi: "快", pinyin: "kuài", meaning: "Fast" }],
      example: {
        hanzi: "火车很快。",
        pinyin: "Huǒchē hěn kuài.",
        english: "The train is very fast.",
        bangla: "ট্রেনটি খুব দ্রুত।",
      },
      similar: [{ hanzi: "速", pinyin: "sù", english: "Fast" }],
    },
    {
      hanzi: "下来",
      pinyin: "xiàlái",
      english: "Come down",
      bangla: "নিচে নামা",
      characters: [
        { hanzi: "下", pinyin: "xià", meaning: "Down" },
        { hanzi: "来", pinyin: "lái", meaning: "Come" },
      ],
      example: {
        hanzi: "你下来吧。",
        pinyin: "Nǐ xiàlái ba.",
        english: "You come down.",
        bangla: "তুমি নিচে নেমে এসো।",
      },
      similar: [{ hanzi: "落", pinyin: "luò", english: "Fall" }],
    },
    {
      hanzi: "上来",
      pinyin: "shànglái",
      english: "Come up",
      bangla: "উপরে আসা",
      characters: [
        { hanzi: "上", pinyin: "shàng", meaning: "Up" },
        { hanzi: "来", pinyin: "lái", meaning: "Come" },
      ],
      example: {
        hanzi: "你上来吧。",
        pinyin: "Nǐ shànglái ba.",
        english: "You come up.",
        bangla: "তুমি উপরে এসো।",
      },
      similar: [{ hanzi: "升", pinyin: "shēng", english: "Rise" }],
    },
    {
      hanzi: "上去",
      pinyin: "shàngqù",
      english: "Go up",
      bangla: "উপরে যাওয়া",
      characters: [
        { hanzi: "上", pinyin: "shàng", meaning: "Up" },
        { hanzi: "去", pinyin: "qù", meaning: "Go" },
      ],
      example: {
        hanzi: "他上去了。",
        pinyin: "Tā shàngqù le.",
        english: "He went up.",
        bangla: "সে উপরে গেল।",
      },
      similar: [{ hanzi: "登", pinyin: "dēng", english: "Ascend" }],
    },
    {
      hanzi: "下面",
      pinyin: "xiàmiàn",
      english: "Below",
      bangla: "নিচে",
      characters: [
        { hanzi: "下", pinyin: "xià", meaning: "Down" },
        { hanzi: "面", pinyin: "miàn", meaning: "Side" },
      ],
      example: {
        hanzi: "猫在桌子下面。",
        pinyin: "Māo zài zhuōzi xiàmiàn.",
        english: "The cat is under the table.",
        bangla: "বিড়ালটি টেবিলের নিচে।",
      },
      similar: [{ hanzi: "底下", pinyin: "dǐxia", english: "Underneath" }],
    },
    {
      hanzi: "面",
      pinyin: "miàn",
      english: "Side/Surface",
      bangla: "পাশ/তল",
      characters: [{ hanzi: "面", pinyin: "miàn", meaning: "Face/Surface" }],
      example: {
        hanzi: "他在我前面。",
        pinyin: "Tā zài wǒ qiánmiàn.",
        english: "He is in front of me.",
        bangla: "সে আমার সামনে আছে।",
      },
      similar: [{ hanzi: "边", pinyin: "biān", english: "Side" }],
    },
    {
      hanzi: "等",
      pinyin: "děng",
      english: "Wait",
      bangla: "অপেক্ষা করা",
      characters: [{ hanzi: "等", pinyin: "děng", meaning: "Wait" }],
      example: {
        hanzi: "请等一会儿。",
        pinyin: "Qǐng děng yíhuìr.",
        english: "Please wait a moment.",
        bangla: "অনুগ্রহ করে একটু অপেক্ষা করুন।",
      },
      similar: [{ hanzi: "候", pinyin: "hòu", english: "Wait" }],
    },
    {
      hanzi: "一会儿",
      pinyin: "yíhuìr",
      english: "A moment",
      bangla: "একটু পরে",
      characters: [
        { hanzi: "一", pinyin: "yī", meaning: "One" },
        { hanzi: "会", pinyin: "huì", meaning: "Moment" },
        { hanzi: "儿", pinyin: "r", meaning: "Suffix" },
      ],
      example: {
        hanzi: "我一会儿来。",
        pinyin: "Wǒ yíhuìr lái.",
        english: "I will come in a little while.",
        bangla: "আমি একটু পরে আসব।",
      },
      similar: [{ hanzi: "一下", pinyin: "yíxià", english: "A bit" }],
    },
    {
      hanzi: "下去",
      pinyin: "xiàqù",
      english: "Go down",
      bangla: "নিচে যাওয়া",
      characters: [
        { hanzi: "下", pinyin: "xià", meaning: "Down" },
        { hanzi: "去", pinyin: "qù", meaning: "Go" },
      ],
      example: {
        hanzi: "你们下去吧。",
        pinyin: "Nǐmen xiàqù ba.",
        english: "You guys go down.",
        bangla: "তোমরা নিচে যাও।",
      },
      similar: [{ hanzi: "降", pinyin: "jiàng", english: "Descend" }],
    },
  ],
};
