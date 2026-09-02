// app/data/vocabulary/lesson1-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson1text3: VocabularyData = {
  hskLevel: 2,
  lesson: 1,
  text: 3,
  dialogue: {
    title: "Asking for Help",
    lines: [
      {
        speaker: "Chen Tianzhong",
        hanzi: "喂，家月，你明天有时间吗？我想请你帮个忙。",
        pinyin:
          "Wéi, Jiāyuè, nǐ míngtiān yǒu shíjiān ma? Wǒ xiǎng qǐng nǐ bāng ge máng.",
        english:
          "Hello, Jiayue. Do you have time tomorrow? I want to ask you for a favor.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "不好意思，天中，我已经到北京了。",
        pinyin: "Bù hǎoyìsi, Tiānzhōng, wǒ yǐjīng dào Běijīng le.",
        english: "Sorry, Tianzhong. I have already arrived in Beijing.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "你是什么时候到的？",
        pinyin: "Nǐ shì shénme shíhou dào de?",
        english: "When did you arrive?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我是今天早上到的。你有事可以叫李文帮忙，他还在学校呢。",
        pinyin:
          "Wǒ shì jīntiān zǎoshang dào de. Nǐ yǒu shì kěyǐ jiào Lǐ Wén bāngmáng, tā hái zài xuéxiào ne.",
        english:
          "I arrived this morning. If you need help, you can ask Li Wen. He is still at school.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "好的，那我给他打个电话。",
        pinyin: "Hǎo de, nà wǒ gěi tā dǎ ge diànhuà.",
        english: "Okay, then I'll give him a call.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "好，再见！",
        pinyin: "Hǎo, zàijiàn!",
        english: "Okay, goodbye!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "帮忙",
      pinyin: "bāngmáng",
      english: "Help",
      bangla: "সাহায্য করা",
      characters: [
        { hanzi: "帮", pinyin: "bāng", meaning: "Help" },
        { hanzi: "忙", pinyin: "máng", meaning: "Busy/Work" },
      ],
      example: {
        hanzi: "你能帮个忙吗？",
        pinyin: "Nǐ néng bāng gè máng ma?",
        english: "Can you help me?",
        bangla: "তুমি কি আমাকে সাহায্য করতে পারো?",
      },
      similar: [{ hanzi: "帮助", pinyin: "bāngzhù", english: "Help" }],
    },
    {
      hanzi: "不好意思",
      pinyin: "bù hǎoyìsi",
      english: "Sorry/Embarrassed",
      bangla: "লজ্জিত/দুঃখিত",
      characters: [
        { hanzi: "不", pinyin: "bù", meaning: "Not" },
        { hanzi: "好", pinyin: "hǎo", meaning: "Good" },
        { hanzi: "意思", pinyin: "yìsi", meaning: "Meaning/Intention" },
      ],
      example: {
        hanzi: "不好意思，我迟到了。",
        pinyin: "Bù hǎoyìsi, wǒ chídào le.",
        english: "Sorry, I'm late.",
        bangla: "দুঃখিত, আমি দেরি করে ফেলেছি।",
      },
      similar: [{ hanzi: "对不起", pinyin: "duìbuqǐ", english: "Sorry" }],
    },
    {
      hanzi: "已经",
      pinyin: "yǐjīng",
      english: "Already",
      bangla: "ইতিমধ্যে",
      characters: [
        { hanzi: "已", pinyin: "yǐ", meaning: "Already" },
        { hanzi: "经", pinyin: "jīng", meaning: "Pass through" },
      ],
      example: {
        hanzi: "他已经走了。",
        pinyin: "Tā yǐjīng zǒu le.",
        english: "He has already left.",
        bangla: "সে ইতিমধ্যে চলে গেছে।",
      },
      similar: [{ hanzi: "早就", pinyin: "zǎojiù", english: "Long ago" }],
    },
    {
      hanzi: "那",
      pinyin: "nà",
      english: "Then/In that case",
      bangla: "তাহলে/সেক্ষেত্রে",
      characters: [{ hanzi: "那", pinyin: "nà", meaning: "That/Then" }],
      example: {
        hanzi: "那我们明天去吧。",
        pinyin: "Nà wǒmen míngtiān qù ba.",
        english: "Then let's go tomorrow.",
        bangla: "তাহলে আমরা আগামীকাল যাই।",
      },
      similar: [{ hanzi: "那么", pinyin: "nàme", english: "Then/So" }],
    },
  ],
};
