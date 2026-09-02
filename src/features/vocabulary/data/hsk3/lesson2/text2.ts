// app/data/vocabulary/lesson2-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson2text2: VocabularyData = {
  hskLevel: 3,
  lesson: 2,
  text: 2,
  dialogue: {
    title: "At the Restaurant",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "服务员，再给我们拿一双筷子、一个勺子和一个碗。",
        pinyin: "Fúwùyuán, zài gěi wǒmen ná yì shuāng kuàizi, yí gè sháozi hé yí gè wǎn.",
        english: "Waiter, please bring us another pair of chopsticks, a spoon, and a bowl.",
      },
      {
        speaker: "Waiter",
        hanzi: "好的，请稍等一下，我马上拿来。",
        pinyin: "Hǎo de, qǐng shāo děng yíxià, wǒ mǎshàng ná lái.",
        english: "Okay, please wait a moment, I'll bring them right away.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "这家饭馆的服务很热情，菜也都做得很好吃。你们尝尝，看喜不喜欢这些菜。",
        pinyin: "Zhè jiā fànguǎn de fúwù hěn rèqíng, cài yě dōu zuò de hěn hǎochī. Nǐmen chángchang, kàn xǐ bù xǐhuan zhèxiē cài.",
        english: "The service in this restaurant is very warm, and the food is delicious. Try them and see if you like these dishes.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "哪个菜都好吃。您点的这些菜真不错。",
        pinyin: "Nǎ gè cài dōu hǎochī. Nín diǎn de zhèxiē cài zhēn búcuò.",
        english: "Every dish is delicious. These dishes you ordered are really great!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "这里的饭菜又便宜又好吃，我们经常来，服务员都记住我们爱吃的菜了。",
        pinyin: "Zhèlǐ de fàncài yòu piányi yòu hǎochī, wǒmen jīngcháng lái, fúwùyuán dōu jìzhù wǒmen ài chī de cài le.",
        english: "The food here is both cheap and delicious; we often come here, and the waiters have even remembered the dishes we love.",
      },
      {
        speaker: "Waiter",
        hanzi: "王姐，您经常来吃饭，今天送您一些水果，请慢用。",
        pinyin: "Wáng jiě, nín jīngcháng lái chīfàn, jīntiān sòng nín yìxiē shuǐguǒ, qǐng màn yòng.",
        english: "Sister Wang, you often come to eat here, today we're giving you some complimentary fruit, please enjoy!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "服务",
      pinyin: "fúwù",
      english: "Serve/Service",
      bangla: "সেবা দেওয়া",
      characters: [
        { hanzi: "服", pinyin: "fú", meaning: "Serve" },
        { hanzi: "务", pinyin: "wù", meaning: "Business/Affair" },
      ],
      example: {
        hanzi: "这里的服务很好。",
        pinyin: "Zhèlǐ de fúwù hěn hǎo.",
        english: "The service here is very good.",
        bangla: "এখানকার সার্ভিস খুব ভালো।",
      },
      similar: [{ hanzi: "招待", pinyin: "zhāodài", english: "Entertain/Receive" }],
    },
    {
      hanzi: "员",
      pinyin: "yuán",
      english: "Person",
      bangla: "কর্মী",
      characters: [
        { hanzi: "口", pinyin: "kǒu", meaning: "Mouth" },
        { hanzi: "贝", pinyin: "bèi", meaning: "Shell/Money" },
      ],
      example: {
        hanzi: "他是服务员。",
        pinyin: "Tā shì fúwùyuán.",
        english: "He is a waiter.",
        bangla: "সে একজন ওয়েটার।",
      },
      similar: [{ hanzi: "人员", pinyin: "rényuán", english: "Personnel" }],
    },
    {
      hanzi: "双",
      pinyin: "shuāng",
      english: "Pair",
      bangla: "জোড়া",
      characters: [
        { hanzi: "又", pinyin: "yòu", meaning: "Again" },
        { hanzi: "又", pinyin: "yòu", meaning: "Again" },
      ],
      example: {
        hanzi: "一双筷子。",
        pinyin: "Yì shuāng kuàizi.",
        english: "A pair of chopsticks.",
        bangla: "এক জোড়া চপস্টিক।",
      },
      similar: [{ hanzi: "对", pinyin: "duì", english: "Pair/Couple" }],
    },
    {
      hanzi: "筷子",
      pinyin: "kuàizi",
      english: "Chopsticks",
      bangla: "চপস্টিক",
      characters: [
        { hanzi: "筷", pinyin: "kuài", meaning: "Chopsticks" },
        { hanzi: "子", pinyin: "zi", meaning: "Noun suffix" },
      ],
      example: {
        hanzi: "你会用筷子吗？",
        pinyin: "Nǐ huì yòng kuàizi ma?",
        english: "Can you use chopsticks?",
        bangla: "তুমি কি চপস্টিক ব্যবহার করতে পারো?",
      },
      similar: [{ hanzi: "筷子", pinyin: "kuàizi", english: "Chopsticks" }],
    },
    {
      hanzi: "勺子",
      pinyin: "sháozi",
      english: "Spoon",
      bangla: "চামচ",
      characters: [
        { hanzi: "勺", pinyin: "sháo", meaning: "Spoon" },
        { hanzi: "子", pinyin: "zi", meaning: "Noun suffix" },
      ],
      example: {
        hanzi: "请给我一把勺子。",
        pinyin: "Qǐng gěi wǒ yì bǎ sháozi.",
        english: "Please give me a spoon.",
        bangla: "অনুগ্রহ করে আমাকে একটা চামচ দিন।",
      },
      similar: [{ hanzi: "汤匙", pinyin: "tāngchí", english: "Spoon" }],
    },
    {
      hanzi: "碗",
      pinyin: "wǎn",
      english: "Bowl",
      bangla: "বাটি",
      characters: [
        { hanzi: "石", pinyin: "shí", meaning: "Stone" },
        { hanzi: "宛", pinyin: "wǎn", meaning: "Like" },
      ],
      example: {
        hanzi: "一碗米饭。",
        pinyin: "Yì wǎn mǐfàn.",
        english: "A bowl of rice.",
        bangla: "এক বাটি ভাত।",
      },
      similar: [{ hanzi: "碗筷", pinyin: "wǎnkuài", english: "Bowl and chopsticks" }],
    },
    {
      hanzi: "马上",
      pinyin: "mǎshàng",
      english: "Immediately/Right away",
      bangla: "এখনই",
      characters: [
        { hanzi: "马", pinyin: "mǎ", meaning: "Horse" },
        { hanzi: "上", pinyin: "shàng", meaning: "On/Up" },
      ],
      example: {
        hanzi: "我马上来。",
        pinyin: "Wǒ mǎshàng lái.",
        english: "I'm coming right away.",
        bangla: "আমি এখনই আসছি।",
      },
      similar: [{ hanzi: "立刻", pinyin: "lìkè", english: "Immediately" }],
    },
    {
      hanzi: "热情",
      pinyin: "rèqíng",
      english: "Warm/Enthusiastic",
      bangla: "আন্তরিক",
      characters: [
        { hanzi: "热", pinyin: "rè", meaning: "Hot" },
        { hanzi: "情", pinyin: "qíng", meaning: "Feeling/Emotion" },
      ],
      example: {
        hanzi: "她很热情。",
        pinyin: "Tā hěn rèqíng.",
        english: "She is very warm.",
        bangla: "সে খুব আন্তরিক।",
      },
      similar: [{ hanzi: "热心", pinyin: "rèxīn", english: "Warm-hearted" }],
    },
    {
      hanzi: "尝",
      pinyin: "cháng",
      english: "Taste",
      bangla: "স্বাদ নেওয়া",
      characters: [
        { hanzi: "口", pinyin: "kǒu", meaning: "Mouth" },
        { hanzi: "云", pinyin: "yún", meaning: "Cloud" },
      ],
      example: {
        hanzi: "你尝一尝这个。",
        pinyin: "Nǐ cháng yì cháng zhè gè.",
        english: "Try this.",
        bangla: "এটির স্বাদ নাও।",
      },
      similar: [{ hanzi: "品尝", pinyin: "pǐncháng", english: "Savor/Taste" }],
    },
    {
      hanzi: "记",
      pinyin: "jì",
      english: "Remember",
      bangla: "মনে রাখা",
      characters: [
        { hanzi: "讠", pinyin: "yán", meaning: "Speech" },
        { hanzi: "己", pinyin: "jǐ", meaning: "Self" },
      ],
      example: {
        hanzi: "我记得你。",
        pinyin: "Wǒ jìde nǐ.",
        english: "I remember you.",
        bangla: "আমি তোমাকে মনে রেখেছি।",
      },
      similar: [{ hanzi: "记住", pinyin: "jìzhù", english: "Remember" }],
    },
    {
      hanzi: "用",
      pinyin: "yòng",
      english: "Use/Eat",
      bangla: "ব্যবহার করা",
      characters: [
        { hanzi: "用", pinyin: "yòng", meaning: "Use" },
      ],
      example: {
        hanzi: "请慢用。",
        pinyin: "Qǐng màn yòng.",
        english: "Please enjoy (your meal).",
        bangla: "আপনি ধীরে সুস্থে খান।",
      },
      similar: [{ hanzi: "使用", pinyin: "shǐyòng", english: "Use" }],
    },
  ],
};