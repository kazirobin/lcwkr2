// app/data/vocabulary/lesson9-text1.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson9text1: VocabularyData = {
  hskLevel: 2,
  lesson: 9,
  text: 1,
  dialogue: {
    title: "Buying New Pants",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "儿子的裤子坏了，我们给他买条新的吧。",
        pinyin: "Érzi de kùzi huài le, wǒmen gěi tā mǎi tiáo xīn de ba.",
        english: "Our son's pants are worn out. Let's buy him a new pair.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "好啊。",
        pinyin: "Hǎo a.",
        english: "Okay.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你看这条黑色的怎么样？",
        pinyin: "Nǐ kàn zhè tiáo hēisè de zěnmeyàng?",
        english: "What do you think of this black pair?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "没有你上次买的那条好看。",
        pinyin: "Méiyǒu nǐ shàng cì mǎi de nà tiáo hǎokàn.",
        english: "They don't look as good as the pair you bought last time.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "旁边那个男孩儿就穿了这样的裤子，我觉得很好看啊！",
        pinyin:
          "Pángbiān nàge nánháir jiù chuān le zhèyàng de kùzi, wǒ juéde hěn hǎokàn a!",
        english:
          "The boy over there is wearing pants like these. I think they look very nice!",
      },
      {
        speaker: "Liu Ming",
        hanzi: "儿子的个子没有他那么高，穿上就不会太好看。",
        pinyin:
          "Érzi de gèzi méiyǒu tā nàme gāo, chuānshàng jiù bú huì tài hǎokàn.",
        english:
          "Our son isn't as tall as him, so they won't look very good on him.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "好吧，我们再去那边看看。",
        pinyin: "Hǎo ba, wǒmen zài qù nàbiān kànkan.",
        english: "Okay, let's go over there and have another look.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "坏",
      pinyin: "huài",
      english: "Bad/Broken",
      bangla: "খারাপ/নষ্ট",
      characters: [
        { hanzi: "土", pinyin: "tǔ", meaning: "Earth" },
        { hanzi: "不", pinyin: "bù", meaning: "Not" },
      ],
      example: {
        hanzi: "这是一个坏消息。",
        pinyin: "Zhè shì yí gè huài xiāoxī.",
        english: "This is bad news.",
        bangla: "এটি একটি খারাপ খবর।",
      },
      similar: [{ hanzi: "糟糕", pinyin: "zāogāo", english: "Terrible" }],
    },
    {
      hanzi: "旁边",
      pinyin: "pángbiān",
      english: "Side/Beside",
      bangla: "পাশে/পাশ্ববর্তী",
      characters: [
        { hanzi: "旁", pinyin: "páng", meaning: "Side" },
        { hanzi: "边", pinyin: "biān", meaning: "Border/Side" },
      ],
      example: {
        hanzi: "医院在学校旁边。",
        pinyin: "Yīyuàn zài xuéxiào pángbiān.",
        english: "The hospital is beside the school.",
        bangla: "হাসপাতালটি স্কুলের পাশে।",
      },
      similar: [{ hanzi: "侧面", pinyin: "cèmiàn", english: "Side" }],
    },
    {
      hanzi: "男孩儿",
      pinyin: "nánháir",
      english: "Boy",
      bangla: "ছেলে/পুরুষ শিশু",
      characters: [
        { hanzi: "男", pinyin: "nán", meaning: "Male" },
        { hanzi: "孩", pinyin: "hái", meaning: "Child" },
        { hanzi: "儿", pinyin: "r", meaning: "Suffix" },
      ],
      example: {
        hanzi: "那个男孩儿很聪明。",
        pinyin: "Nàge nánháir hěn cōngmíng.",
        english: "That boy is very smart.",
        bangla: "ওই ছেলেটি খুব বুদ্ধিমান।",
      },
      similar: [
        { hanzi: "男生", pinyin: "nánshēng", english: "Male student/Boy" },
      ],
    },
    {
      hanzi: "这样",
      pinyin: "zhèyàng",
      english: "Like this/In this way",
      bangla: "এই রকম/এইভাবে",
      characters: [
        { hanzi: "这", pinyin: "zhè", meaning: "This" },
        { hanzi: "样", pinyin: "yàng", meaning: "Way/Type" },
      ],
      example: {
        hanzi: "这样做是对的。",
        pinyin: "Zhèyàng zuò shì duì de.",
        english: "Doing it this way is correct.",
        bangla: "এইভাবে করা সঠিক।",
      },
      similar: [{ hanzi: "如此", pinyin: "rúcǐ", english: "In this way" }],
    },
    {
      hanzi: "个子",
      pinyin: "gèzi",
      english: "Stature/Height",
      bangla: "উচ্চতা/শারীরিক গঠন",
      characters: [
        { hanzi: "个", pinyin: "gè", meaning: "Measure word" },
        { hanzi: "子", pinyin: "zi", meaning: "Suffix" },
      ],
      example: {
        hanzi: "他的个子很高。",
        pinyin: "Tā de gèzi hěn gāo.",
        english: "His height is very tall.",
        bangla: "তার উচ্চতা অনেক বেশি।",
      },
      similar: [{ hanzi: "身高", pinyin: "shēngāo", english: "Height" }],
    },
    {
      hanzi: "那么",
      pinyin: "nàme",
      english: "Like that/So",
      bangla: "ঐ রকম/এত",
      characters: [
        { hanzi: "那", pinyin: "nà", meaning: "That" },
        { hanzi: "么", pinyin: "me", meaning: "Suffix" },
      ],
      example: {
        hanzi: "你为什么那么高兴？",
        pinyin: "Nǐ wèishénme nàme gāoxìng?",
        english: "Why are you so happy?",
        bangla: "তুমি এত খুশি কেন?",
      },
      similar: [{ hanzi: "那样", pinyin: "nàyàng", english: "Like that" }],
    },
    {
      hanzi: "高",
      pinyin: "gāo",
      english: "Tall/High",
      bangla: "উঁচু/লম্বা",
      characters: [{ hanzi: "高", pinyin: "gāo", meaning: "Tall/High" }],
      example: {
        hanzi: "这座山很高。",
        pinyin: "Zhè zuò shān hěn gāo.",
        english: "This mountain is very high.",
        bangla: "এই পাহাড়টি খুব উঁচু।",
      },
      similar: [{ hanzi: "昂贵", pinyin: "ángguì", english: "Expensive" }],
    },
  ],
};
