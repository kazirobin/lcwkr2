// app/data/vocabulary/lesson18-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson18text2: VocabularyData = {
  hskLevel: 3,
  lesson: 18,
  text: 2,
  dialogue: {
    title: "Visiting the Family",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "张阿姨，李叔叔。过年好！这是我准备的礼物，请收下。",
        pinyin: "Zhāng āyí, Lǐ shūshu. Guònián hǎo! Zhè shì wǒ zhǔnbèi de lǐwù, qǐng shōuxià.",
        english: "Auntie Zhang, Uncle Li. Happy New Year! This is a gift I prepared, please accept it.",
      },
      {
        speaker: "Uncle Li",
        hanzi: "谢谢家月，你太客气了！",
        pinyin: "Xièxie Jiāyuè, nǐ tài kèqi le!",
        english: "Thank you Jiayue, you're too polite!",
      },
      {
        speaker: "Auntie Zhang",
        hanzi: "总听小文提起你，今天终于有机会见面了。",
        pinyin: "Zǒng tīng Xiǎowén tíqǐ nǐ, jīntiān zhōngyú yǒu jīhuì jiànmiàn le.",
        english: "Xiaowen always talks about you; today we finally have the chance to meet.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "谢谢您和叔叔请我来家里做客。",
        pinyin: "Xièxie nín hé shūshu qǐng wǒ lái jiālǐ zuòkè.",
        english: "Thank you and Uncle for inviting me to your home as a guest.",
      },
      {
        speaker: "Uncle Li",
        hanzi: "桌子上有饮料，还有矿泉水，你想喝什么就自己拿。",
        pinyin: "Zhuōzi shang yǒu yǐnliào, hái yǒu kuàngquánshuǐ, nǐ xiǎng hē shénme jiù zìjǐ ná.",
        english: "There are drinks and mineral water on the table, help yourself to whatever you want to drink.",
      },
      {
        speaker: "Auntie Zhang",
        hanzi: "你先坐着看会儿电视，饺子很快就包好了。",
        pinyin: "Nǐ xiān zuòzhe kàn huìr diànshì, jiǎozi hěn kuài jiù bāo hǎo le.",
        english: "Sit down and watch some TV for a while, the dumplings will be ready soon.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我刚刚看视频学会了包饺子，我跟你们一起包吧。",
        pinyin: "Wǒ gānggāng kàn shìpín xuéhuì le bāo jiǎozi, wǒ gēn nǐmen yìqǐ bāo ba.",
        english: "I just learned how to make dumplings by watching a video; let me make them together with you.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "阿姨",
      pinyin: "āyí",
      english: "Aunt",
      bangla: "খালাম্মা",
      characters: [
        { hanzi: "阿", pinyin: "ā", meaning: "Prefix" },
        { hanzi: "姨", pinyin: "yí", meaning: "Aunt" },
      ],
      example: {
        hanzi: "张阿姨很好。",
        pinyin: "Zhāng āyí hěn hǎo.",
        english: "Auntie Zhang is very nice.",
        bangla: "ঝাং খালাম্মা খুব ভালো।",
      },
      similar: [{ hanzi: "阿姨", pinyin: "āyí", english: "Aunt" }],
    },
    {
      hanzi: "叔叔",
      pinyin: "shūshu",
      english: "Uncle",
      bangla: "খালু",
      characters: [
        { hanzi: "叔", pinyin: "shū", meaning: "Uncle" },
        { hanzi: "叔", pinyin: "shū", meaning: "Uncle" },
      ],
      example: {
        hanzi: "李叔叔是医生。",
        pinyin: "Lǐ shūshu shì yīshēng.",
        english: "Uncle Li is a doctor.",
        bangla: "লি খালু একজন ডাক্তার।",
      },
      similar: [{ hanzi: "叔叔", pinyin: "shūshu", english: "Uncle" }],
    },
    {
      hanzi: "收",
      pinyin: "shōu",
      english: "Accept/Receive",
      bangla: "গ্রহণ করা",
      characters: [
        { hanzi: "攵", pinyin: "pū", meaning: "Knock" },
        { hanzi: "收", pinyin: "shōu", meaning: "Receive" },
      ],
      example: {
        hanzi: "请收下礼物。",
        pinyin: "Qǐng shōuxià lǐwù.",
        english: "Please accept the gift.",
        bangla: "অনুগ্রহ করে উপহারটি গ্রহণ করুন।",
      },
      similar: [{ hanzi: "收到", pinyin: "shōudào", english: "Receive" }],
    },
    {
      hanzi: "总",
      pinyin: "zǒng",
      english: "Always",
      bangla: "সবসময়",
      characters: [
        { hanzi: "总", pinyin: "zǒng", meaning: "Always" },
      ],
      example: {
        hanzi: "他总是迟到。",
        pinyin: "Tā zǒngshì chídào.",
        english: "He is always late.",
        bangla: "সে সবসময় দেরি করে।",
      },
      similar: [{ hanzi: "总是", pinyin: "zǒngshì", english: "Always" }],
    },
    {
      hanzi: "起",
      pinyin: "qǐ",
      english: "Used after verb",
      bangla: "উঠে আসা",
      characters: [
        { hanzi: "走", pinyin: "zǒu", meaning: "Walk" },
        { hanzi: "己", pinyin: "jǐ", meaning: "Self" },
      ],
      example: {
        hanzi: "提起。",
        pinyin: "Tíqǐ.",
        english: "Mention.",
        bangla: "উল্লেখ করা।",
      },
      similar: [{ hanzi: "起", pinyin: "qǐ", english: "Up" }],
    },
    {
      hanzi: "见面",
      pinyin: "jiànmiàn",
      english: "Meet",
      bangla: "সাক্ষাৎ করা",
      characters: [
        { hanzi: "见", pinyin: "jiàn", meaning: "See" },
        { hanzi: "面", pinyin: "miàn", meaning: "Face" },
      ],
      example: {
        hanzi: "我们明天见面。",
        pinyin: "Wǒmen míngtiān jiànmiàn.",
        english: "We will meet tomorrow.",
        bangla: "আমরা আগামীকাল দেখা করব।",
      },
      similar: [{ hanzi: "见面", pinyin: "jiànmiàn", english: "Meet" }],
    },
    {
      hanzi: "矿泉水",
      pinyin: "kuàngquánshuǐ",
      english: "Mineral water",
      bangla: "মিনারেল ওয়াটার",
      characters: [
        { hanzi: "矿", pinyin: "kuàng", meaning: "Mine" },
        { hanzi: "泉", pinyin: "quán", meaning: "Spring" },
        { hanzi: "水", pinyin: "shuǐ", meaning: "Water" },
      ],
      example: {
        hanzi: "我想喝矿泉水。",
        pinyin: "Wǒ xiǎng hē kuàngquánshuǐ.",
        english: "I want to drink mineral water.",
        bangla: "আমি মিনারেল ওয়াটার খেতে চাই।",
      },
      similar: [{ hanzi: "矿泉水", pinyin: "kuàngquánshuǐ", english: "Mineral water" }],
    },
    {
      hanzi: "刚刚",
      pinyin: "gānggāng",
      english: "Just now",
      bangla: "এইমাত্র",
      characters: [
        { hanzi: "刚", pinyin: "gāng", meaning: "Just" },
        { hanzi: "刚", pinyin: "gāng", meaning: "Just" },
      ],
      example: {
        hanzi: "他刚刚走了。",
        pinyin: "Tā gānggāng zǒu le.",
        english: "He just left.",
        bangla: "সে এইমাত্র চলে গেছে।",
      },
      similar: [{ hanzi: "刚才", pinyin: "gāngcái", english: "Just now" }],
    },
  ],
};