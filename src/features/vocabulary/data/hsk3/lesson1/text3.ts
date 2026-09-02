// app/data/vocabulary/lesson1-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson1text3: VocabularyData = {
  hskLevel: 3,
  lesson: 1,
  text: 3,
  dialogue: {
    title: "Waiting at the Airport",
    lines: [
      {
        speaker: "Liu Ming",
        hanzi: "飞机早就到了，看见白家月他们了吗？",
        pinyin: "Fēijī zǎo jiù dào le, kànjiàn Bái Jiāyuè tāmen le ma?",
        english: "The plane arrived long ago, have you seen Bai Jiayue and the others?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "没有，他们应该快出来了。",
        pinyin: "Méiyǒu, tāmen yīnggāi kuài chūlái le.",
        english: "No, they should be coming out soon.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "我们站到中间去吧，这样他们好找一些。",
        pinyin: "Wǒmen zhàn dào zhōngjiān qù ba, zhèyàng tāmen hǎo zhǎo yìxiē.",
        english: "Let's stand in the middle, so it's easier for them to spot us.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你看那个高个子的人是李文吗？",
        pinyin: "Nǐ kàn nà gè gāo gèzi de rén shì Lǐ Wén ma?",
        english: "Look, is that tall person over there Li Wen?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "你说的是哪个？那个穿着黑衣服的短头发的年轻人？",
        pinyin: "Nǐ shuō de shì nǎ gè? Nà gè chuānzhe hēi yīfu de duǎn tóufa de niánqīng rén?",
        english: "Which one are you talking about? That young person wearing black clothes with short hair?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "对，那个人就是李文！你看，家月在他后面呢。",
        pinyin: "Duì, nà gè rén jiùshì Lǐ Wén! Nǐ kàn, Jiāyuè zài tā hòumiàn ne.",
        english: "Yes, that person is Li Wen! Look, Jiayue is right behind him.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "应该",
      pinyin: "yīnggāi",
      english: "Should/Ought to",
      bangla: "উচিত",
      characters: [
        { hanzi: "应", pinyin: "yīng", meaning: "Ought/Should" },
        { hanzi: "该", pinyin: "gāi", meaning: "Ought/Should" },
      ],
      example: {
        hanzi: "你应该去看医生。",
        pinyin: "Nǐ yīnggāi qù kàn yīshēng.",
        english: "You should go see a doctor.",
        bangla: "তোমার ডাক্তারের কাছে যাওয়া উচিত।",
      },
      similar: [{ hanzi: "应当", pinyin: "yīngdāng", english: "Should/Ought" }],
    },
    {
      hanzi: "站",
      pinyin: "zhàn",
      english: "Stand",
      bangla: "দাঁড়ানো",
      characters: [
        { hanzi: "立", pinyin: "lì", meaning: "Stand" },
        { hanzi: "占", pinyin: "zhàn", meaning: "Occupy" },
      ],
      example: {
        hanzi: "请站在这儿。",
        pinyin: "Qǐng zhàn zài zhèr.",
        english: "Please stand here.",
        bangla: "অনুগ্রহ করে এখানে দাঁড়ান।",
      },
      similar: [{ hanzi: "站立", pinyin: "zhànlì", english: "Stand" }],
    },
    {
      hanzi: "中间",
      pinyin: "zhōngjiān",
      english: "Middle/Center",
      bangla: "মাঝখানে",
      characters: [
        { hanzi: "中", pinyin: "zhōng", meaning: "Middle/Center" },
        { hanzi: "间", pinyin: "jiān", meaning: "Between/Among" },
      ],
      example: {
        hanzi: "他站在中间。",
        pinyin: "Tā zhàn zài zhōngjiān.",
        english: "He stands in the middle.",
        bangla: "সে মাঝখানে দাঁড়ায়।",
      },
      similar: [{ hanzi: "中心", pinyin: "zhōngxīn", english: "Center" }],
    },
    {
      hanzi: "短",
      pinyin: "duǎn",
      english: "Short",
      bangla: "ছোট",
      characters: [
        { hanzi: "矢", pinyin: "shǐ", meaning: "Arrow" },
        { hanzi: "豆", pinyin: "dòu", meaning: "Bean" },
      ],
      example: {
        hanzi: "他的头发很短。",
        pinyin: "Tā de tóufa hěn duǎn.",
        english: "His hair is very short.",
        bangla: "তার চুল খুব ছোট।",
      },
      similar: [{ hanzi: "短小", pinyin: "duǎnxiǎo", english: "Short/Small" }],
    },
    {
      hanzi: "头发",
      pinyin: "tóufa",
      english: "Hair",
      bangla: "চুল",
      characters: [
        { hanzi: "头", pinyin: "tóu", meaning: "Head" },
        { hanzi: "发", pinyin: "fà", meaning: "Hair" },
      ],
      example: {
        hanzi: "她的头发很长。",
        pinyin: "Tā de tóufa hěn cháng.",
        english: "Her hair is very long.",
        bangla: "তার চুল খুব লম্বা।",
      },
      similar: [{ hanzi: "毛发", pinyin: "máofà", english: "Hair" }],
    },
    {
      hanzi: "年轻",
      pinyin: "niánqīng",
      english: "Young",
      bangla: "তরুণ/যুবক",
      characters: [
        { hanzi: "年", pinyin: "nián", meaning: "Year/Age" },
        { hanzi: "轻", pinyin: "qīng", meaning: "Light/Young" },
      ],
      example: {
        hanzi: "她看起来很年轻。",
        pinyin: "Tā kàn qǐlái hěn niánqīng.",
        english: "She looks very young.",
        bangla: "তাকে খুব কম বয়সী দেখাচ্ছে।",
      },
      similar: [{ hanzi: "青年", pinyin: "qīngnián", english: "Youth" }],
    },
  ],
};