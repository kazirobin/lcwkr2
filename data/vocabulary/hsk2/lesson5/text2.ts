// app/data/vocabulary/lesson5-text2.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson5text2: VocabularyData = {
  hskLevel: 2,
  lesson: 5,
  text: 2,
  dialogue: {
    title: "Meeting the Grandparents",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "家月、安妮，快进来！我给你们介绍一下，这是孩子们的爷爷、奶奶。",
        pinyin:
          "Jiāyuè, Ānnī, kuài jìnlái! Wǒ gěi nǐmen jièshào yíxià, zhè shì háizimen de yéye, nǎinai.",
        english:
          "Jiayue, Anni, come in quickly! Let me introduce you. These are the children's grandfather and grandmother.",
      },
      {
        speaker: "Bai Jiayue & Anni",
        hanzi: "你们好！",
        pinyin: "Nǐmen hǎo!",
        english: "Hello!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "爸，妈，这是白家月，这是安妮。她们都是一飞的学生。",
        pinyin:
          "Bà, mā, zhè shì Bái Jiāyuè, zhè shì Ānnī. Tāmen dōu shì Yīfēi de xuésheng.",
        english:
          "Dad, Mom, this is Bai Jiayue, and this is Anni. They are both Yifei's students.",
      },
      {
        speaker: "Liu Yeye",
        hanzi: "家月、安妮，你们好！",
        pinyin: "Jiāyuè, Ānnī, nǐmen hǎo!",
        english: "Jiayue, Anni, hello!",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "这是送你们的礼物。",
        pinyin: "Zhè shì sòng nǐmen de lǐwù.",
        english: "This is a gift for you.",
      },
      {
        speaker: "Liu Yeye",
        hanzi: "你们太客气了，还拿这么多礼物来！",
        pinyin: "Nǐmen tài kèqi le, hái ná zhème duō lǐwù lái!",
        english: "You're too kind! You even brought so many gifts!",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "一雪姐，这是给孩子们准备的礼物。",
        pinyin: "Yìxuě jiě, zhè shì gěi háizimen zhǔnbèi de lǐwù.",
        english: "Sister Yixue, these are gifts prepared for the children.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "谢谢！你们别客气，快坐吧！",
        pinyin: "Xièxie! Nǐmen bié kèqi, kuài zuò ba!",
        english: "Thank you! Please don't be so formal. Have a seat!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "进来",
      pinyin: "jìnlái",
      english: "Come in",
      bangla: "ভেতরে আসা",
      characters: [
        { hanzi: "进", pinyin: "jìn", meaning: "Enter" },
        { hanzi: "来", pinyin: "lái", meaning: "Come" },
      ],
      example: {
        hanzi: "请进来。",
        pinyin: "Qǐng jìnlái.",
        english: "Please come in.",
        bangla: "অনুগ্রহ করে ভেতরে আসুন।",
      },
      similar: [{ hanzi: "进入", pinyin: "jìnrù", english: "Enter" }],
    },
    {
      hanzi: "爷爷",
      pinyin: "yéye",
      english: "Grandfather (paternal)",
      bangla: "দাদা (বাবার বাবা)",
      characters: [
        { hanzi: "爷", pinyin: "yé", meaning: "Grandfather" },
        { hanzi: "爷", pinyin: "yé", meaning: "Grandfather" },
      ],
      example: {
        hanzi: "我爷爷七十岁了。",
        pinyin: "Wǒ yéye qīshí suì le.",
        english: "My grandfather is seventy years old.",
        bangla: "আমার দাদা সত্তর বছর বয়সী।",
      },
      similar: [{ hanzi: "祖父", pinyin: "zǔfù", english: "Grandfather" }],
    },
    {
      hanzi: "奶奶",
      pinyin: "nǎinai",
      english: "Grandmother (paternal)",
      bangla: "দাদি (বাবার মা)",
      characters: [
        { hanzi: "奶", pinyin: "nǎi", meaning: "Milk/Grandma" },
        { hanzi: "奶", pinyin: "nǎi", meaning: "Milk/Grandma" },
      ],
      example: {
        hanzi: "奶奶在看电视。",
        pinyin: "Nǎinai zài kàn diànshì.",
        english: "Grandma is watching TV.",
        bangla: "দাদি টিভি দেখছেন।",
      },
      similar: [{ hanzi: "祖母", pinyin: "zǔmǔ", english: "Grandmother" }],
    },
    {
      hanzi: "礼物",
      pinyin: "lǐwù",
      english: "Gift",
      bangla: "উপহার",
      characters: [
        { hanzi: "礼", pinyin: "lǐ", meaning: "Etiquette/Gift" },
        { hanzi: "物", pinyin: "wù", meaning: "Object" },
      ],
      example: {
        hanzi: "这是给你的礼物。",
        pinyin: "Zhè shì gěi nǐ de lǐwù.",
        english: "This is a gift for you.",
        bangla: "এটি তোমার জন্য উপহার।",
      },
      similar: [{ hanzi: "礼品", pinyin: "lǐpǐn", english: "Gift item" }],
    },
    {
      hanzi: "准备",
      pinyin: "zhǔnbèi",
      english: "Prepare",
      bangla: "প্রস্তুত করা",
      characters: [
        { hanzi: "准", pinyin: "zhǔn", meaning: "Accurate/Standard" },
        { hanzi: "备", pinyin: "bèi", meaning: "Prepare" },
      ],
      example: {
        hanzi: "我准备好了。",
        pinyin: "Wǒ zhǔnbèi hǎo le.",
        english: "I am ready.",
        bangla: "আমি প্রস্তুত।",
      },
      similar: [{ hanzi: "打算", pinyin: "dǎsuàn", english: "Plan" }],
    },
  ],
};
