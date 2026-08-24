// app/data/vocabulary/lesson2-text3.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk3lesson2text3: VocabularyData = {
  hskLevel: 3,
  lesson: 2,
  text: 3,
  dialogue: {
    title: "Takeout Delivery",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "这个鸡肉饭太好吃了，我要再来吃一次。",
        pinyin: "Zhè gè jīròufàn tài hǎochī le, wǒ yào zài lái chī yí cì.",
        english: "This chicken rice is delicious, I want to come back and eat it again!",
      },
      {
        speaker: "Li Wen",
        hanzi: "你可以拿走这张菜单，看看下次还想点儿什么。",
        pinyin: "Nǐ kěyǐ názǒu zhè zhāng càidān, kànkan xià cì hái xiǎng diǎnr shénme.",
        english: "You can take this menu card with you and see what else you want to order next time.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "不用拿菜单，在手机上就能看到，也可以选好了让他们给你送。",
        pinyin: "Búyòng ná càidān, zài shǒujī shang jiù néng kàndào, yě kěyǐ xuǎnhǎo le ràng tāmen gěi nǐ sòng.",
        english: "No need to take the menu, you can see it on your mobile phone, and you can also choose it and have them deliver it to you.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "他们家还能送外卖？",
        pinyin: "Tāmen jiā hái néng sòng wàimài?",
        english: "Do they offer food delivery as well?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "对，现在很多饭馆都能送外卖，想吃什么就点什么。",
        pinyin: "Duì, xiànzài hěn duō fànguǎn dōu néng sòng wàimài, xiǎng chī shénme jiù diǎn shénme.",
        english: "Yes, nowadays many restaurants deliver takeout; you can order whatever you want to eat.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "那真是太方便了！",
        pinyin: "Nà zhēn shì tài fāngbiàn le!",
        english: "That really is so convenient!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "鸡",
      pinyin: "jī",
      english: "Chicken",
      bangla: "মুরগি",
      characters: [
        { hanzi: "又", pinyin: "yòu", meaning: "Again" },
        { hanzi: "鸟", pinyin: "niǎo", meaning: "Bird" },
      ],
      example: {
        hanzi: "鸡肉很好吃。",
        pinyin: "Jīròu hěn hǎochī.",
        english: "Chicken is delicious.",
        bangla: "মুরগির মাংস খুব সুস্বাদু।",
      },
      similar: [{ hanzi: "鸡鸭", pinyin: "jīyā", english: "Chicken and duck" }],
    },
    {
      hanzi: "张",
      pinyin: "zhāng",
      english: "Measure word for flat objects",
      bangla: "টি",
      characters: [
        { hanzi: "弓", pinyin: "gōng", meaning: "Bow" },
        { hanzi: "长", pinyin: "cháng", meaning: "Long" },
      ],
      example: {
        hanzi: "一张纸。",
        pinyin: "Yì zhāng zhǐ.",
        english: "A piece of paper.",
        bangla: "একটা কাগজ।",
      },
      similar: [{ hanzi: "纸张", pinyin: "zhǐzhāng", english: "Paper" }],
    },
    {
      hanzi: "不用",
      pinyin: "búyòng",
      english: "Need not",
      bangla: "প্রয়োজন নেই",
      characters: [
        { hanzi: "不", pinyin: "bù", meaning: "Not" },
        { hanzi: "用", pinyin: "yòng", meaning: "Use" },
      ],
      example: {
        hanzi: "你不用担心。",
        pinyin: "Nǐ búyòng dānxīn.",
        english: "You don't need to worry.",
        bangla: "তোমার চিন্তা করার দরকার নেই।",
      },
      similar: [{ hanzi: "不必", pinyin: "búbì", english: "Need not" }],
    },
    {
      hanzi: "选",
      pinyin: "xuǎn",
      english: "Choose/Select",
      bangla: "নির্বাচন করা",
      characters: [
        { hanzi: "辶", pinyin: "chuò", meaning: "Walk" },
        { hanzi: "先", pinyin: "xiān", meaning: "First" },
      ],
      example: {
        hanzi: "你选哪一个？",
        pinyin: "Nǐ xuǎn nǎ yí gè?",
        english: "Which one do you choose?",
        bangla: "তুমি কোনটি বেছে নাও?",
      },
      similar: [{ hanzi: "挑选", pinyin: "tiāoxuǎn", english: "Select/Choose" }],
    },
    {
      hanzi: "外卖",
      pinyin: "wàimài",
      english: "Takeout/Food delivery",
      bangla: "ডেলিভারি",
      characters: [
        { hanzi: "外", pinyin: "wài", meaning: "Outside" },
        { hanzi: "卖", pinyin: "mài", meaning: "Sell" },
      ],
      example: {
        hanzi: "我想点外卖。",
        pinyin: "Wǒ xiǎng diǎn wàimài.",
        english: "I want to order takeout.",
        bangla: "আমি ডেলিভারি অর্ডার করতে চাই।",
      },
      similar: [{ hanzi: "外卖送餐", pinyin: "wàimài sòngcān", english: "Food delivery" }],
    },
    {
      hanzi: "方便",
      pinyin: "fāngbiàn",
      english: "Convenient",
      bangla: "সুবিধাজনক",
      characters: [
        { hanzi: "方", pinyin: "fāng", meaning: "Square/Side" },
        { hanzi: "便", pinyin: "biàn", meaning: "Convenient" },
      ],
      example: {
        hanzi: "这里很方便。",
        pinyin: "Zhèlǐ hěn fāngbiàn.",
        english: "It's very convenient here.",
        bangla: "এখানে খুব সুবিধাজনক।",
      },
      similar: [{ hanzi: "便利", pinyin: "biànlì", english: "Convenient" }],
    },
  ],
};