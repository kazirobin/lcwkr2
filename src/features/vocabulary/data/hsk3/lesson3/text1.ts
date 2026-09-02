// app/data/vocabulary/lesson3-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson3text1: VocabularyData = {
  hskLevel: 3,
  lesson: 3,
  text: 1,
  dialogue: {
    title: "Looking for a New House",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "小雪的初中离家有点儿远，咱们换一个近点儿的房子吧。",
        pinyin: "Xiǎoxuě de chūzhōng lí jiā yǒudiǎnr yuǎn, zánmen huàn yí gè jìn diǎnr de fángzi ba.",
        english: "Xiaoxue's junior high is a bit far from home, let's change to a closer house.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "好啊，我上网看看。你觉得这个小区怎么样？",
        pinyin: "Hǎo a, wǒ shàngwǎng kànkan. Nǐ juéde zhège xiǎoqū zěnmeyàng?",
        english: "Great, I'll check online. What do you think of this complex?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "环境挺好的，离地铁站还不远。",
        pinyin: "Huánjìng tǐng hǎo de, lí dìtiězhàn hái bù yuǎn.",
        english: "The environment is good, and it's not far from the subway station.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "房子里面也不错，空调和洗衣机都是新的。",
        pinyin: "Fángzi lǐmiàn yě búcuò, kōngtiáo hé xǐyījī dōu shì xīn de.",
        english: "The inside of the house is nice too, the air conditioner and washing machine are both new.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "是不错，但我不喜欢住一层。",
        pinyin: "Shì búcuò, dàn wǒ bù xǐhuan zhù yī céng.",
        english: "It's nice, but I don't like living on the first floor.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "这个一层带一个小花园，我觉得咱们可以来看看。",
        pinyin: "Zhège yī céng dài yí gè xiǎo huāyuán, wǒ juéde zánmen kěyǐ lái kànkan.",
        english: "This first floor has a small garden, I think we can come take a look.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "初中",
      pinyin: "chūzhōng",
      english: "Junior high school",
      bangla: "জুনিয়র হাইস্কুল",
      characters: [
        { hanzi: "初", pinyin: "chū", meaning: "Beginner/First" },
        { hanzi: "中", pinyin: "zhōng", meaning: "Middle" },
      ],
      example: {
        hanzi: "他上初中了。",
        pinyin: "Tā shàng chūzhōng le.",
        english: "He is in junior high school.",
        bangla: "সে জুনিয়র হাইস্কুলে পড়ে।",
      },
      similar: [{ hanzi: "高中", pinyin: "gāozhōng", english: "High school" }],
    },
    {
      hanzi: "离",
      pinyin: "lí",
      english: "From",
      bangla: "থেকে",
      characters: [
        { hanzi: "亠", pinyin: "tóu", meaning: "Head" },
        { hanzi: "离", pinyin: "lí", meaning: "Leave" },
      ],
      example: {
        hanzi: "学校离家很近。",
        pinyin: "Xuéxiào lí jiā hěn jìn.",
        english: "The school is very close to home.",
        bangla: "স্কুল বাসার খুব কাছে।",
      },
      similar: [{ hanzi: "距离", pinyin: "jùlí", english: "Distance" }],
    },
    {
      hanzi: "上网",
      pinyin: "shàngwǎng",
      english: "Go online",
      bangla: "অনলাইনে যাওয়া",
      characters: [
        { hanzi: "上", pinyin: "shàng", meaning: "Up/On" },
        { hanzi: "网", pinyin: "wǎng", meaning: "Net/Internet" },
      ],
      example: {
        hanzi: "我每天上网。",
        pinyin: "Wǒ měitiān shàngwǎng.",
        english: "I go online every day.",
        bangla: "আমি প্রতিদিন অনলাইনে যাই।",
      },
      similar: [{ hanzi: "上网", pinyin: "shàngwǎng", english: "Go online" }],
    },
    {
      hanzi: "环境",
      pinyin: "huánjìng",
      english: "Environment",
      bangla: "পরিবেশ",
      characters: [
        { hanzi: "环", pinyin: "huán", meaning: "Ring/Circle" },
        { hanzi: "境", pinyin: "jìng", meaning: "Boundary" },
      ],
      example: {
        hanzi: "这里环境很好。",
        pinyin: "Zhèlǐ huánjìng hěn hǎo.",
        english: "The environment here is very good.",
        bangla: "এখানকার পরিবেশ খুব ভালো।",
      },
      similar: [{ hanzi: "气氛", pinyin: "qìfēn", english: "Atmosphere" }],
    },
    {
      hanzi: "空调",
      pinyin: "kōngtiáo",
      english: "Air conditioner",
      bangla: "এয়ার কন্ডিশনার",
      characters: [
        { hanzi: "空", pinyin: "kōng", meaning: "Air" },
        { hanzi: "调", pinyin: "tiáo", meaning: "Adjust" },
      ],
      example: {
        hanzi: "空调坏了。",
        pinyin: "Kōngtiáo huài le.",
        english: "The air conditioner is broken.",
        bangla: "এয়ার কন্ডিশনার নষ্ট হয়েছে।",
      },
      similar: [{ hanzi: "暖气", pinyin: "nuǎnqì", english: "Heating" }],
    },
    {
      hanzi: "洗衣机",
      pinyin: "xǐyījī",
      english: "Washing machine",
      bangla: "ওয়াশিং মেশিন",
      characters: [
        { hanzi: "洗", pinyin: "xǐ", meaning: "Wash" },
        { hanzi: "衣", pinyin: "yī", meaning: "Clothes" },
        { hanzi: "机", pinyin: "jī", meaning: "Machine" },
      ],
      example: {
        hanzi: "洗衣机是新的。",
        pinyin: "Xǐyījī shì xīn de.",
        english: "The washing machine is new.",
        bangla: "ওয়াশিং মেশিনটি নতুন।",
      },
      similar: [{ hanzi: "烘干机", pinyin: "hōnggānjī", english: "Dryer" }],
    },
    {
      hanzi: "层",
      pinyin: "céng",
      english: "Floor (of a building)",
      bangla: "তলা",
      characters: [
        { hanzi: "尸", pinyin: "shī", meaning: "Corpse" },
        { hanzi: "云", pinyin: "yún", meaning: "Cloud" },
      ],
      example: {
        hanzi: "我住在五层。",
        pinyin: "Wǒ zhù zài wǔ céng.",
        english: "I live on the fifth floor.",
        bangla: "আমি পঞ্চম তলায় থাকি।",
      },
      similar: [{ hanzi: "楼", pinyin: "lóu", english: "Floor/Story" }],
    },
    {
      hanzi: "带",
      pinyin: "dài",
      english: "Bring/Has",
      bangla: "আছে/নিয়ে যাওয়া",
      characters: [
        { hanzi: "廾", pinyin: "gǒng", meaning: "Two hands" },
        { hanzi: "戴", pinyin: "dài", meaning: "Wear" },
      ],
      example: {
        hanzi: "这个房间带阳台。",
        pinyin: "Zhè gè fángjiān dài yángtái.",
        english: "This room has a balcony.",
        bangla: "এই রুমে বারান্দা আছে।",
      },
      similar: [{ hanzi: "有", pinyin: "yǒu", english: "Have" }],
    },
  ],
};