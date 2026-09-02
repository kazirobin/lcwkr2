// app/data/vocabulary/lesson7-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson7text2: VocabularyData = {
  hskLevel: 3,
  lesson: 7,
  text: 2,
  dialogue: {
    title: "Shopping for Clothes",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "你看我穿这条黄色的短裤好看吗？",
        pinyin: "Nǐ kàn wǒ chuān zhè tiáo huángsè de duǎnkù hǎokàn ma?",
        english: "Do you think I look good in these yellow shorts?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "大小合适，但我觉得那条裙子比短裤更好看。",
        pinyin: "Dàxiǎo héshì, dàn wǒ juéde nà tiáo qúnzi bǐ duǎnkù gèng hǎokàn.",
        english: "The size is suitable, but I think that skirt looks even better than the shorts.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "裙子比短裤贵一点儿。",
        pinyin: "Qúnzi bǐ duǎnkù guì yìdiǎnr.",
        english: "The skirt is a bit more expensive than the shorts.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "贵多少？",
        pinyin: "Guì duōshao?",
        english: "How much more expensive?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "裙子480，短裤400。",
        pinyin: "Qúnzi sìbǎi bāshí, duǎnkù sìbǎi.",
        english: "The skirt is 480 (yuan), and the shorts are 400 (yuan).",
      },
      {
        speaker: "Liu Ming",
        hanzi: "裙子不比短裤贵多少，还是买裙子吧，你穿裙子更好看。",
        pinyin: "Qúnzi bù bǐ duǎnkù guì duōshao, háishi mǎi qúnzi ba, nǐ chuān qúnzi gèng hǎokàn.",
        english: "The skirt isn't much more expensive than the shorts, better buy the skirt, you look better in a skirt.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "我多看看再决定。你看，那边有买二送一！",
        pinyin: "Wǒ duō kànkan zài juédìng. Nǐ kàn, nàbiān yǒu mǎi èr sòng yī!",
        english: "Let me look around a bit more before deciding. Look, over there is 'Buy Two, Get One Free'!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "黄色",
      pinyin: "huángsè",
      english: "Yellow",
      bangla: "হলুদ রঙ",
      characters: [
        { hanzi: "黄", pinyin: "huáng", meaning: "Yellow" },
        { hanzi: "色", pinyin: "sè", meaning: "Color" },
      ],
      example: {
        hanzi: "我喜欢黄色。",
        pinyin: "Wǒ xǐhuan huángsè.",
        english: "I like yellow.",
        bangla: "আমি হলুদ রঙ পছন্দ করি।",
      },
      similar: [{ hanzi: "金色", pinyin: "jīnsè", english: "Gold" }],
    },
    {
      hanzi: "短裤",
      pinyin: "duǎnkù",
      english: "Shorts",
      bangla: "হাফপ্যান্ট",
      characters: [
        { hanzi: "短", pinyin: "duǎn", meaning: "Short" },
        { hanzi: "裤", pinyin: "kù", meaning: "Pants" },
      ],
      example: {
        hanzi: "夏天我穿短裤。",
        pinyin: "Xiàtiān wǒ chuān duǎnkù.",
        english: "I wear shorts in summer.",
        bangla: "গ্রীষ্মে আমি হাফপ্যান্ট পরি।",
      },
      similar: [{ hanzi: "长裤", pinyin: "chángkù", english: "Long pants" }],
    },
    {
      hanzi: "大小",
      pinyin: "dàxiǎo",
      english: "Size",
      bangla: "সাইজ",
      characters: [
        { hanzi: "大", pinyin: "dà", meaning: "Big" },
        { hanzi: "小", pinyin: "xiǎo", meaning: "Small" },
      ],
      example: {
        hanzi: "这个大小合适吗？",
        pinyin: "Zhège dàxiǎo héshì ma?",
        english: "Is this size suitable?",
        bangla: "এই সাইজটি ঠিক আছে?",
      },
      similar: [{ hanzi: "尺寸", pinyin: "chǐcùn", english: "Dimension" }],
    },
    {
      hanzi: "合适",
      pinyin: "héshì",
      english: "Suitable",
      bangla: "উপযুক্ত",
      characters: [
        { hanzi: "合", pinyin: "hé", meaning: "Combine" },
        { hanzi: "适", pinyin: "shì", meaning: "Suitable" },
      ],
      example: {
        hanzi: "这双鞋很合适。",
        pinyin: "Zhè shuāng xié hěn héshì.",
        english: "These shoes are very suitable.",
        bangla: "এই জুতো খুব উপযুক্ত।",
      },
      similar: [{ hanzi: "适合", pinyin: "shìhé", english: "Fit" }],
    },
    {
      hanzi: "裙子",
      pinyin: "qúnzi",
      english: "Skirt",
      bangla: "স্কার্ট",
      characters: [
        { hanzi: "裙", pinyin: "qún", meaning: "Skirt" },
        { hanzi: "子", pinyin: "zi", meaning: "Noun suffix" },
      ],
      example: {
        hanzi: "她穿了一条红裙子。",
        pinyin: "Tā chuān le yī tiáo hóng qúnzi.",
        english: "She is wearing a red skirt.",
        bangla: "সে একটা লাল স্কার্ট পরে আছে।",
      },
      similar: [{ hanzi: "长裙", pinyin: "chángqún", english: "Long skirt" }],
    },
    {
      hanzi: "更",
      pinyin: "gèng",
      english: "More",
      bangla: "আরও",
      characters: [
        { hanzi: "更", pinyin: "gèng", meaning: "More" },
      ],
      example: {
        hanzi: "这件更便宜。",
        pinyin: "Zhè jiàn gèng piányi.",
        english: "This one is cheaper.",
        bangla: "এটি আরও সস্তা।",
      },
      similar: [{ hanzi: "更加", pinyin: "gèngjiā", english: "Even more" }],
    },
    {
      hanzi: "决定",
      pinyin: "juédìng",
      english: "Decide",
      bangla: "সিদ্ধান্ত নেওয়া",
      characters: [
        { hanzi: "决", pinyin: "jué", meaning: "Decide" },
        { hanzi: "定", pinyin: "dìng", meaning: "Set" },
      ],
      example: {
        hanzi: "我决定了。",
        pinyin: "Wǒ juédìng le.",
        english: "I've decided.",
        bangla: "আমি সিদ্ধান্ত নিয়েছি।",
      },
      similar: [{ hanzi: "决定", pinyin: "juédìng", english: "Decide" }],
    },
  ],
};