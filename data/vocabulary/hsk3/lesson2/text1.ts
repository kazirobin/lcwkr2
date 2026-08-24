// app/data/vocabulary/lesson2-text1.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk3lesson2text1: VocabularyData = {
  hskLevel: 3,
  lesson: 2,
  text: 1,
  dialogue: {
    title: "Ordering Food",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "家月、李文，你们看看菜单，想吃点儿什么？",
        pinyin: "Jiāyuè, Lǐ Wén, nǐmen kànkan càidān, xiǎng chī diǎnr shénme?",
        english: "Jiayue, Li Wen, take a look at the menu, what would you like to eat?",
      },
      {
        speaker: "Li Wen",
        hanzi: "谢谢一雪姐，我都可以，你们点吧。",
        pinyin: "Xièxie Yīxuě jiě, wǒ dōu kěyǐ, nǐmen diǎn ba.",
        english: "Thanks, Yixue-jie, anything is fine with me, you guys order.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "飞了这么远，现在还真是又饿又渴。",
        pinyin: "Fēi le zhème yuǎn, xiànzài hái zhēn shì yòu è yòu kě.",
        english: "After flying such a long distance, I'm really both hungry and thirsty now.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "那多点点儿，别客气。你们喝什么饮料？",
        pinyin: "Nà duō diǎn diǎnr, bié kèqi. Nǐmen hē shénme yǐnliào?",
        english: "Then order a bit more, don't be polite! What drinks would you like?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "好久没喝中国茶，也好久没吃饺子了。我想喝绿茶、吃饺子，可以吗？",
        pinyin: "Hǎojiǔ méi hē Zhōngguó chá, yě hǎojiǔ méi chī jiǎozi le. Wǒ xiǎng hē lǜchá, chī jiǎozi, kěyǐ ma?",
        english: "It's been a long time since I drank Chinese tea and ate dumplings. I'd like to drink green tea and eat dumplings, is that okay?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "没问题。你们看看还想吃什么。",
        pinyin: "Méi wèntí. Nǐmen kànkan hái xiǎng chī shénme.",
        english: "No problem. Take a look at what else you want to eat.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "菜单",
      pinyin: "càidān",
      english: "Menu",
      bangla: "মেনু কার্ড",
      characters: [
        { hanzi: "菜", pinyin: "cài", meaning: "Dish/Food" },
        { hanzi: "单", pinyin: "dān", meaning: "List/Card" },
      ],
      example: {
        hanzi: "请给我菜单。",
        pinyin: "Qǐng gěi wǒ càidān.",
        english: "Please give me the menu.",
        bangla: "অনুগ্রহ করে আমাকে মেনু কার্ড দিন।",
      },
      similar: [{ hanzi: "菜谱", pinyin: "càipǔ", english: "Recipe/Cookbook" }],
    },
    {
      hanzi: "又",
      pinyin: "yòu",
      english: "And/Also",
      bangla: "এবং",
      characters: [
        { hanzi: "又", pinyin: "yòu", meaning: "Again/Also" },
      ],
      example: {
        hanzi: "他又高又帅。",
        pinyin: "Tā yòu gāo yòu shuài.",
        english: "He is both tall and handsome.",
        bangla: "সে লম্বাও আবার হ্যান্ডসামও।",
      },
      similar: [{ hanzi: "也", pinyin: "yě", english: "Also" }],
    },
    {
      hanzi: "饿",
      pinyin: "è",
      english: "Hungry",
      bangla: "ক্ষুধার্ত",
      characters: [
        { hanzi: "饣", pinyin: "shí", meaning: "Food/Eat" },
        { hanzi: "我", pinyin: "wǒ", meaning: "I/Me" },
      ],
      example: {
        hanzi: "我饿了。",
        pinyin: "Wǒ è le.",
        english: "I'm hungry.",
        bangla: "আমার ক্ষুধা পেয়েছে।",
      },
      similar: [{ hanzi: "饥饿", pinyin: "jī'è", english: "Starving" }],
    },
    {
      hanzi: "渴",
      pinyin: "kě",
      english: "Thirsty",
      bangla: "তৃষ্ণার্ত",
      characters: [
        { hanzi: "氵", pinyin: "shuǐ", meaning: "Water" },
        { hanzi: "曷", pinyin: "hé", meaning: "How" },
      ],
      example: {
        hanzi: "我渴了。",
        pinyin: "Wǒ kě le.",
        english: "I'm thirsty.",
        bangla: "আমার তৃষ্ণা পেয়েছে।",
      },
      similar: [{ hanzi: "干渴", pinyin: "gānkě", english: "Parched" }],
    },
    {
      hanzi: "客气",
      pinyin: "kèqi",
      english: "Polite",
      bangla: "সৌজন্য দেখাানো",
      characters: [
        { hanzi: "客", pinyin: "kè", meaning: "Guest" },
        { hanzi: "气", pinyin: "qì", meaning: "Air/Manner" },
      ],
      example: {
        hanzi: "别客气。",
        pinyin: "Bié kèqi.",
        english: "Don't be polite.",
        bangla: "দ্বিধা কোরো না।",
      },
      similar: [{ hanzi: "礼貌", pinyin: "lǐmào", english: "Polite/Courteous" }],
    },
    {
      hanzi: "饮料",
      pinyin: "yǐnliào",
      english: "Drink/Beverage",
      bangla: "পানীয়",
      characters: [
        { hanzi: "饮", pinyin: "yǐn", meaning: "Drink" },
        { hanzi: "料", pinyin: "liào", meaning: "Material/Ingredient" },
      ],
      example: {
        hanzi: "你想喝什么饮料？",
        pinyin: "Nǐ xiǎng hē shénme yǐnliào?",
        english: "What drink would you like?",
        bangla: "তুমি কী পানীয় খেতে চাও?",
      },
      similar: [{ hanzi: "饮品", pinyin: "yǐnpǐn", english: "Beverage" }],
    },
    {
      hanzi: "好久",
      pinyin: "hǎojiǔ",
      english: "Long time",
      bangla: "দীর্ঘ সময়",
      characters: [
        { hanzi: "好", pinyin: "hǎo", meaning: "Good/Very" },
        { hanzi: "久", pinyin: "jiǔ", meaning: "Long time" },
      ],
      example: {
        hanzi: "好久不见。",
        pinyin: "Hǎojiǔ bújiàn.",
        english: "Long time no see.",
        bangla: "অনেকদিন দেখি না।",
      },
      similar: [{ hanzi: "很久", pinyin: "hěnjiǔ", english: "Very long time" }],
    },
  ],
};