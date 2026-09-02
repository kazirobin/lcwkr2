// app/data/vocabulary/lesson7-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson7text3: VocabularyData = {
  hskLevel: 3,
  lesson: 7,
  text: 3,
  dialogue: {
    title: "Buying Fruit at the Market",
    lines: [
      {
        speaker: "Shop Assistant",
        hanzi: "西瓜又大又新鲜，不甜不要钱！",
        pinyin: "Xīguā yòu dà yòu xīnxiān, bù tián bú yào qián!",
        english: "Watermelons are big and fresh, no charge if it's not sweet!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "西瓜看起来不错，怎么卖？",
        pinyin: "Xīguā kàn qǐlái búcuò, zěnme mài?",
        english: "The watermelon looks nice, how much is it?",
      },
      {
        speaker: "Shop Assistant",
        hanzi: "五块钱一公斤。来，您先尝尝这款冰西瓜，甜极了！",
        pinyin: "Wǔ kuài qián yì gōngjīn. Lái, nín xiān chángchang zhè kuǎn bīng xīguā, tián jí le!",
        english: "Five yuan per kilogram. Here, try this chilled watermelon first, it's extremely sweet!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "是挺甜的！帮我选个大点儿的，再来两斤香蕉。",
        pinyin: "Shì tǐng tián de! Bāng wǒ xuǎn gè dà diǎnr de, zài lái liǎng jīn xiāngjiāo.",
        english: "It really is quite sweet! Help me pick a larger one, and also give me two jin of bananas.",
      },
      {
        speaker: "Shop Assistant",
        hanzi: "一共五十八块五毛。",
        pinyin: "Yígòng wǔshí bā kuài wǔ máo.",
        english: "Altogether it's 58.5 yuan.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "我买了这么多，便宜点儿吧。",
        pinyin: "Wǒ mǎi le zhème duō, piányi diǎnr ba.",
        english: "I bought so much, make it a bit cheaper please.",
      },
      {
        speaker: "Shop Assistant",
        hanzi: "您给五十五吧，不能再便宜了。",
        pinyin: "Nín gěi wǔshí wǔ ba, bù néng zài piányi le.",
        english: "You can pay 55 yuan, it can't be any cheaper than that.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "西瓜",
      pinyin: "xīguā",
      english: "Watermelon",
      bangla: "তরমুজ",
      characters: [
        { hanzi: "西", pinyin: "xī", meaning: "West" },
        { hanzi: "瓜", pinyin: "guā", meaning: "Melon" },
      ],
      example: {
        hanzi: "夏天吃西瓜很凉快。",
        pinyin: "Xiàtiān chī xīguā hěn liángkuai.",
        english: "Eating watermelon in summer is very refreshing.",
        bangla: "গ্রীষ্মে তরমুজ খেলে খুব আরাম লাগে।",
      },
      similar: [{ hanzi: "哈密瓜", pinyin: "hāmìguā", english: "Cantaloupe" }],
    },
    {
      hanzi: "新鲜",
      pinyin: "xīnxiān",
      english: "Fresh",
      bangla: "তাজা",
      characters: [
        { hanzi: "新", pinyin: "xīn", meaning: "New" },
        { hanzi: "鲜", pinyin: "xiān", meaning: "Fresh" },
      ],
      example: {
        hanzi: "这些水果很新鲜。",
        pinyin: "Zhèxiē shuǐguǒ hěn xīnxiān.",
        english: "These fruits are very fresh.",
        bangla: "এই ফলগুলো খুব তাজা।",
      },
      similar: [{ hanzi: "新鲜", pinyin: "xīnxiān", english: "Fresh" }],
    },
    {
      hanzi: "甜",
      pinyin: "tián",
      english: "Sweet",
      bangla: "মিষ্টি",
      characters: [
        { hanzi: "舌", pinyin: "shé", meaning: "Tongue" },
        { hanzi: "甘", pinyin: "gān", meaning: "Sweet" },
      ],
      example: {
        hanzi: "这个苹果很甜。",
        pinyin: "Zhège píngguǒ hěn tián.",
        english: "This apple is very sweet.",
        bangla: "এই আপেলটা খুব মিষ্টি।",
      },
      similar: [{ hanzi: "甜味", pinyin: "tiánwèi", english: "Sweet taste" }],
    },
    {
      hanzi: "公斤",
      pinyin: "gōngjīn",
      english: "Kilogram",
      bangla: "কেজি",
      characters: [
        { hanzi: "公", pinyin: "gōng", meaning: "Metric" },
        { hanzi: "斤", pinyin: "jīn", meaning: "Catty" },
      ],
      example: {
        hanzi: "一公斤等于两斤。",
        pinyin: "Yī gōngjīn děngyú liǎng jīn.",
        english: "One kilogram equals two jin.",
        bangla: "এক কেজি সমান দুই জিন।",
      },
      similar: [{ hanzi: "千克", pinyin: "qiānkè", english: "Kilogram" }],
    },
    {
      hanzi: "冰",
      pinyin: "bīng",
      english: "Ice/Iced",
      bangla: "ঠান্ডা",
      characters: [
        { hanzi: "冫", pinyin: "bīng", meaning: "Ice" },
        { hanzi: "水", pinyin: "shuǐ", meaning: "Water" },
      ],
      example: {
        hanzi: "我要一杯冰水。",
        pinyin: "Wǒ yào yì bēi bīng shuǐ.",
        english: "I want a glass of iced water.",
        bangla: "আমি এক গ্লাস ঠান্ডা পানি চাই।",
      },
      similar: [{ hanzi: "冰块", pinyin: "bīngkuài", english: "Ice cube" }],
    },
    {
      hanzi: "极",
      pinyin: "jí",
      english: "Extremely",
      bangla: "অত্যন্ত",
      characters: [
        { hanzi: "木", pinyin: "mù", meaning: "Wood" },
        { hanzi: "及", pinyin: "jí", meaning: "Reach" },
      ],
      example: {
        hanzi: "好极了！",
        pinyin: "Hǎo jí le!",
        english: "Excellent!",
        bangla: "দারুণ!",
      },
      similar: [{ hanzi: "极其", pinyin: "jíqí", english: "Extremely" }],
    },
    {
      hanzi: "斤",
      pinyin: "jīn",
      english: "Jin (0.5 kg)",
      bangla: "জিন (০.৫ কেজি)",
      characters: [
        { hanzi: "斤", pinyin: "jīn", meaning: "Catty" },
      ],
      example: {
        hanzi: "一斤苹果。",
        pinyin: "Yī jīn píngguǒ.",
        english: "One jin of apples.",
        bangla: "এক জিন আপেল।",
      },
      similar: [{ hanzi: "公斤", pinyin: "gōngjīn", english: "Kilogram" }],
    },
    {
      hanzi: "香蕉",
      pinyin: "xiāngjiāo",
      english: "Banana",
      bangla: "কলা",
      characters: [
        { hanzi: "香", pinyin: "xiāng", meaning: "Fragrant" },
        { hanzi: "蕉", pinyin: "jiāo", meaning: "Plantain" },
      ],
      example: {
        hanzi: "我喜欢吃香蕉。",
        pinyin: "Wǒ xǐhuan chī xiāngjiāo.",
        english: "I like eating bananas.",
        bangla: "আমি কলা খেতে পছন্দ করি।",
      },
      similar: [{ hanzi: "香蕉", pinyin: "xiāngjiāo", english: "Banana" }],
    },
    {
      hanzi: "一共",
      pinyin: "yígòng",
      english: "Altogether",
      bangla: "সর্বমোট",
      characters: [
        { hanzi: "一", pinyin: "yī", meaning: "One" },
        { hanzi: "共", pinyin: "gòng", meaning: "Together" },
      ],
      example: {
        hanzi: "一共多少钱？",
        pinyin: "Yígòng duōshao qián?",
        english: "How much in total?",
        bangla: "সব মিলিয়ে কত টাকা?",
      },
      similar: [{ hanzi: "总计", pinyin: "zǒngjì", english: "Total" }],
    },
    {
      hanzi: "毛",
      pinyin: "máo",
      english: "Mao (1/10 yuan)",
      bangla: "মাও (ইউয়ানের ১/১০ অংশ)",
      characters: [
        { hanzi: "毛", pinyin: "máo", meaning: "Hair" },
      ],
      example: {
        hanzi: "五毛钱。",
        pinyin: "Wǔ máo qián.",
        english: "Five mao.",
        bangla: "পাঁচ মাও।",
      },
      similar: [{ hanzi: "分", pinyin: "fēn", english: "Fen (1/100 yuan)" }],
    },
  ],
};