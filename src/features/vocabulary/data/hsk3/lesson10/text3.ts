// app/data/vocabulary/lesson10-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson10text3: VocabularyData = {
  hskLevel: 3,
  lesson: 10,
  text: 3,
  dialogue: {
    title: "Asking the Teacher",
    lines: [
      {
        speaker: "Classmate",
        hanzi: "李老师，书上有几个问题，想问问您。",
        pinyin: "Lǐ lǎoshī, shū shang yǒu jǐ gè wèntí, wǒmen xiǎng wènwen nín.",
        english: "Teacher Li, there are a few questions in the book that we'd like to ask you.",
      },
      {
        speaker: "Teacher Li",
        hanzi: "好，坐下说吧，哪个题不会？",
        pinyin: "Hǎo, zuò xià shuō ba, nǎ gè tí bú huì?",
        english: "Sure, sit down and tell me. Which question don't you understand?",
      },
      {
        speaker: "Classmate",
        hanzi: "书上第五页的这个对话我看不懂，小雪也不明白。",
        pinyin: "Shū shang dì-wǔ yè de zhège duìhuà wǒ kàn bù dǒng, Xiǎoxuě yě bù míngbai.",
        english: "I don't understand this dialogue on page 5 of the book, and Xiaoxue doesn't get it either.",
      },
      {
        speaker: "Teacher Li",
        hanzi: "我课上讲过这几句话，再给你们讲一遍。",
        pinyin: "Wǒ kè shang jiǎngguò zhè jǐ jù huà, zài gěi nǐmen jiǎng yí biàn.",
        english: "I explained these sentences in class, let me explain them to you once more.",
      },
      {
        speaker: "Classmate",
        hanzi: "我终于懂了。这些句子一点儿也不难。",
        pinyin: "Wǒ zhōngyú dǒng le. Zhèxiē jùzi yìdiǎnr yě bù nán.",
        english: "I finally understand. These sentences aren't difficult at all.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "我也明白了，谢谢您，李老师。",
        pinyin: "Wǒ yě míngbai le, xièxie nín, Lǐ lǎoshī.",
        english: "I understand now too. Thank you, Teacher Li.",
      },
      {
        speaker: "Teacher Li",
        hanzi: "我这本书上还有几个练习，你们回家也做一做，明天再把书还给我。",
        pinyin: "Wǒ zhè běn shū shang hái yǒu jǐ gè liànxí, nǐmen huí jiā yě zuò yi zuò, míngtiān zài bǎ shū huán gěi wǒ.",
        english: "There are a few more exercises in my book. Do them at home as well, and return the book to me tomorrow.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "页",
      pinyin: "yè",
      english: "Page",
      bangla: "পৃষ্ঠা",
      characters: [
        { hanzi: "页", pinyin: "yè", meaning: "Page" },
      ],
      example: {
        hanzi: "第十页。",
        pinyin: "Dì-shí yè.",
        english: "Page 10.",
        bangla: "পৃষ্ঠা ১০।",
      },
      similar: [{ hanzi: "页码", pinyin: "yèmǎ", english: "Page number" }],
    },
    {
      hanzi: "对话",
      pinyin: "duìhuà",
      english: "Dialogue",
      bangla: "সংলাপ",
      characters: [
        { hanzi: "对", pinyin: "duì", meaning: "Pair" },
        { hanzi: "话", pinyin: "huà", meaning: "Speech" },
      ],
      example: {
        hanzi: "这个对话很有意思。",
        pinyin: "Zhège duìhuà hěn yǒu yìsi.",
        english: "This dialogue is very interesting.",
        bangla: "এই সংলাপটি খুব মজার।",
      },
      similar: [{ hanzi: "会话", pinyin: "huìhuà", english: "Conversation" }],
    },
    {
      hanzi: "明白",
      pinyin: "míngbai",
      english: "Understand",
      bangla: "বোঝা",
      characters: [
        { hanzi: "明", pinyin: "míng", meaning: "Bright" },
        { hanzi: "白", pinyin: "bái", meaning: "White" },
      ],
      example: {
        hanzi: "我明白了。",
        pinyin: "Wǒ míngbai le.",
        english: "I understand.",
        bangla: "আমি বুঝতে পেরেছি।",
      },
      similar: [{ hanzi: "理解", pinyin: "lǐjiě", english: "Understand" }],
    },
    {
      hanzi: "讲",
      pinyin: "jiǎng",
      english: "Explain/Speak",
      bangla: "ব্যাখ্যা করা",
      characters: [
        { hanzi: "讠", pinyin: "yán", meaning: "Speech" },
        { hanzi: "井", pinyin: "jǐng", meaning: "Well" },
      ],
      example: {
        hanzi: "老师讲课。",
        pinyin: "Lǎoshī jiǎngkè.",
        english: "The teacher gives a lecture.",
        bangla: "শিক্ষক ক্লাস নিচ্ছেন।",
      },
      similar: [{ hanzi: "讲解", pinyin: "jiǎngjiě", english: "Explain" }],
    },
    {
      hanzi: "句",
      pinyin: "jù",
      english: "Measure word for sentences",
      bangla: "বাক্যের একক",
      characters: [
        { hanzi: "口", pinyin: "kǒu", meaning: "Mouth" },
        { hanzi: "句", pinyin: "jù", meaning: "Sentence" },
      ],
      example: {
        hanzi: "一句话。",
        pinyin: "Yí jù huà.",
        english: "One sentence.",
        bangla: "একটি বাক্য।",
      },
      similar: [{ hanzi: "句", pinyin: "jù", english: "Sentence" }],
    },
    {
      hanzi: "句子",
      pinyin: "jùzi",
      english: "Sentence",
      bangla: "বাক্য",
      characters: [
        { hanzi: "句", pinyin: "jù", meaning: "Sentence" },
        { hanzi: "子", pinyin: "zi", meaning: "Noun suffix" },
      ],
      example: {
        hanzi: "这个句子很简单。",
        pinyin: "Zhège jùzi hěn jiǎndān.",
        english: "This sentence is very simple.",
        bangla: "এই বাক্যটি খুব সহজ।",
      },
      similar: [{ hanzi: "造句", pinyin: "zàojù", english: "Make a sentence" }],
    },
  ],
};