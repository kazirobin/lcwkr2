// app/data/vocabulary/lesson1-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson1text4: VocabularyData = {
  hskLevel: 2,
  lesson: 1,
  text: 4,
  dialogue: {
    title: "Arriving in Beijing",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi:
          "王老师，我们已经到北京了，是您姐姐来接的我们。她请我们吃了北京烤鸭，还给我们介绍了很多东西。我们的中文不太好，有时不太懂她的意思。",
        pinyin:
          "Wáng lǎoshī, wǒmen yǐjīng dào Běijīng le, shì nín jiějie lái jiē de wǒmen. Tā qǐng wǒmen chī le Běijīng kǎoyā, hái gěi wǒmen jièshào le hěn duō dōngxi. Wǒmen de Zhōngwén bú tài hǎo, yǒushí bú tài dǒng tā de yìsi.",
        english:
          "Teacher Wang, we have already arrived in Beijing. Your older sister came to pick us up. She treated us to Beijing roast duck and also introduced us to many things. Our Chinese is not very good, so sometimes we don't quite understand what she means.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "介绍",
      pinyin: "jièshào",
      english: "Introduce",
      bangla: "পরিচয় করিয়ে দেওয়া",
      characters: [
        { hanzi: "介", pinyin: "jiè", meaning: "Between" },
        { hanzi: "绍", pinyin: "shào", meaning: "Connect" },
      ],
      example: {
        hanzi: "我来介绍一下。",
        pinyin: "Wǒ lái jièshào yíxià.",
        english: "Let me introduce.",
        bangla: "আমি পরিচয় করিয়ে দিই।",
      },
      similar: [{ hanzi: "推荐", pinyin: "tuījiàn", english: "Recommend" }],
    },
    {
      hanzi: "有时",
      pinyin: "yǒushí",
      english: "Sometimes",
      bangla: "মাঝে মাঝে",
      characters: [
        { hanzi: "有", pinyin: "yǒu", meaning: "Have" },
        { hanzi: "时", pinyin: "shí", meaning: "Time" },
      ],
      example: {
        hanzi: "我有时去公园。",
        pinyin: "Wǒ yǒushí qù gōngyuán.",
        english: "I sometimes go to the park.",
        bangla: "আমি মাঝে মাঝে পার্কে যাই।",
      },
      similar: [{ hanzi: "偶尔", pinyin: "ǒu'ěr", english: "Occasionally" }],
    },
    {
      hanzi: "懂",
      pinyin: "dǒng",
      english: "Understand",
      bangla: "বুঝতে পারা",
      characters: [{ hanzi: "懂", pinyin: "dǒng", meaning: "Understand" }],
      example: {
        hanzi: "你懂了吗？",
        pinyin: "Nǐ dǒng le ma?",
        english: "Do you understand?",
        bangla: "তুমি কি বুঝতে পেরেছ?",
      },
      similar: [{ hanzi: "明白", pinyin: "míngbai", english: "Understand" }],
    },
    {
      hanzi: "意思",
      pinyin: "yìsi",
      english: "Meaning",
      bangla: "অর্থ",
      characters: [
        { hanzi: "意", pinyin: "yì", meaning: "Idea" },
        { hanzi: "思", pinyin: "sī", meaning: "Thought" },
      ],
      example: {
        hanzi: "这是什么意思？",
        pinyin: "Zhè shì shénme yìsi?",
        english: "What does this mean?",
        bangla: "এর মানে কি?",
      },
      similar: [{ hanzi: "含义", pinyin: "hányì", english: "Meaning" }],
    },
    {
      hanzi: "北京烤鸭",
      pinyin: "Běijīng Kǎoyā",
      english: "Peking Duck",
      bangla: "বেইজিং রোস্ট ডাক",
      characters: [
        { hanzi: "北京", pinyin: "Běijīng", meaning: "Beijing" },
        { hanzi: "烤", pinyin: "kǎo", meaning: "Roast" },
        { hanzi: "鸭", pinyin: "yā", meaning: "Duck" },
      ],
      example: {
        hanzi: "北京烤鸭很好吃。",
        pinyin: "Běijīng Kǎoyā hěn hǎochī.",
        english: "Peking duck is very delicious.",
        bangla: "বেইজিং রোস্ট ডাক খুব সুস্বাদু।",
      },
      similar: [],
    },
  ],
};
