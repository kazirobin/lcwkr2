// app/data/vocabulary/lesson3-text2.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk3lesson3text2: VocabularyData = {
  hskLevel: 3,
  lesson: 3,
  text: 2,
  dialogue: {
    title: "Problems at Home",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "我今天早上来的时候，灯还开着。",
        pinyin: "Wǒ jīntiān zǎoshang lái de shíhou, dēng hái kāizhe.",
        english: "When I came this morning, the light was still on.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "我这几天忙坏了，可能走的时候忘关了。",
        pinyin: "Wǒ zhè jǐ tiān máng huài le, kěnéng zǒu de shíhou wàng guān le.",
        english: "I've been so busy these days, maybe I forgot to turn it off when I left.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "冰箱不能用，这些吃的东西放在哪儿？",
        pinyin: "Bīngxiāng bù néng yòng, zhèxiē chī de dōngxi fàng zài nǎr?",
        english: "The fridge doesn't work, where should we put these food items?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "不可能吧？冰箱是新买的，我来看看。",
        pinyin: "Bù kěnéng ba? Bīngxiāng shì xīn mǎi de, wǒ lái kànkan.",
        english: "Impossible! The fridge is new, let me take a look.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "洗衣机也坏了吗？",
        pinyin: "Xǐyījī yě huài le ma?",
        english: "Is the washing machine broken too?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "没坏，但是卫生间还没打扫好，还不能洗衣服。",
        pinyin: "Méi huài, dànshì wèishēngjiān hái méi dǎsǎo hǎo, hái bù néng xǐ yīfu.",
        english: "It's not broken, but the bathroom hasn't been cleaned yet, so we can't wash clothes.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "星期天我们真的能搬家吗？",
        pinyin: "Xīngqītiān wǒmen zhēnde néng bānjiā ma?",
        english: "Can we really move on Sunday?",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "坏",
      pinyin: "huài",
      english: "Broken/Bad",
      bangla: "নষ্ট/খারাপ",
      characters: [
        { hanzi: "土", pinyin: "tǔ", meaning: "Earth" },
        { hanzi: "不", pinyin: "bù", meaning: "Not" },
      ],
      example: {
        hanzi: "电脑坏了。",
        pinyin: "Diànnǎo huài le.",
        english: "The computer is broken.",
        bangla: "কম্পিউটার নষ্ট হয়েছে।",
      },
      similar: [{ hanzi: "破损", pinyin: "pòsǔn", english: "Damaged" }],
    },
    {
      hanzi: "忘记",
      pinyin: "wàngjì",
      english: "Forget",
      bangla: "ভুলে যাওয়া",
      characters: [
        { hanzi: "忘", pinyin: "wàng", meaning: "Forget" },
        { hanzi: "记", pinyin: "jì", meaning: "Remember" },
      ],
      example: {
        hanzi: "我忘记带钥匙了。",
        pinyin: "Wǒ wàngjì dài yàoshi le.",
        english: "I forgot to bring the key.",
        bangla: "আমি চাবি আনতে ভুলে গেছি।",
      },
      similar: [{ hanzi: "忘掉", pinyin: "wàngdiào", english: "Forget" }],
    },
    {
      hanzi: "关",
      pinyin: "guān",
      english: "Turn off/Close",
      bangla: "বন্ধ করা",
      characters: [
        { hanzi: "关", pinyin: "guān", meaning: "Close" },
      ],
      example: {
        hanzi: "请关灯。",
        pinyin: "Qǐng guān dēng.",
        english: "Please turn off the light.",
        bangla: "অনুগ্রহ করে লাইট বন্ধ করুন।",
      },
      similar: [{ hanzi: "关闭", pinyin: "guānbì", english: "Close" }],
    },
    {
      hanzi: "冰箱",
      pinyin: "bīngxiāng",
      english: "Refrigerator",
      bangla: "ফ্রিজ",
      characters: [
        { hanzi: "冰", pinyin: "bīng", meaning: "Ice" },
        { hanzi: "箱", pinyin: "xiāng", meaning: "Box" },
      ],
      example: {
        hanzi: "冰箱里有牛奶。",
        pinyin: "Bīngxiāng lǐ yǒu niúnǎi.",
        english: "There is milk in the fridge.",
        bangla: "ফ্রিজে দুধ আছে।",
      },
      similar: [{ hanzi: "冷冻", pinyin: "lěngdòng", english: "Freeze" }],
    },
    {
      hanzi: "卫生间",
      pinyin: "wèishēngjiān",
      english: "Bathroom",
      bangla: "বাথরুম",
      characters: [
        { hanzi: "卫生", pinyin: "wèishēng", meaning: "Hygiene" },
        { hanzi: "间", pinyin: "jiān", meaning: "Room" },
      ],
      example: {
        hanzi: "卫生间在哪儿？",
        pinyin: "Wèishēngjiān zài nǎr?",
        english: "Where is the bathroom?",
        bangla: "বাথরুম কোথায়?",
      },
      similar: [{ hanzi: "厕所", pinyin: "cèsuǒ", english: "Toilet" }],
    },
    {
      hanzi: "打扫",
      pinyin: "dǎsǎo",
      english: "Clean",
      bangla: "পরিষ্কার করা",
      characters: [
        { hanzi: "打", pinyin: "dǎ", meaning: "Beat/Do" },
        { hanzi: "扫", pinyin: "sǎo", meaning: "Sweep" },
      ],
      example: {
        hanzi: "我在打扫房间。",
        pinyin: "Wǒ zài dǎsǎo fángjiān.",
        english: "I am cleaning the room.",
        bangla: "আমি রুম পরিষ্কার করছি।",
      },
      similar: [{ hanzi: "清洁", pinyin: "qīngjié", english: "Clean" }],
    },
    {
      hanzi: "搬家",
      pinyin: "bānjiā",
      english: "Move (house)",
      bangla: "বাসা বদলানো",
      characters: [
        { hanzi: "搬", pinyin: "bān", meaning: "Move/Carry" },
        { hanzi: "家", pinyin: "jiā", meaning: "Home" },
      ],
      example: {
        hanzi: "我们下个月搬家。",
        pinyin: "Wǒmen xià gè yuè bānjiā.",
        english: "We're moving next month.",
        bangla: "আমরা আগামী মাসে বাসা বদলাব।",
      },
      similar: [{ hanzi: "迁移", pinyin: "qiānyí", english: "Relocate" }],
    },
  ],
};