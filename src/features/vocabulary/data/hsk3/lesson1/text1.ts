// app/data/vocabulary/lesson1-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson1text1: VocabularyData = {
  hskLevel: 3,
  lesson: 1,
  text: 1,
  dialogue: {
    title: "Who Is That?",
    lines: [
      {
        speaker: "Liu Ming",
        hanzi: "这是杨同乐吗？他怎么跟白家月在一起？",
        pinyin: "Zhè shì Yáng Tónglè ma? Tā zěnme gēn Bái Jiāyuè zài yìqǐ?",
        english: "Is this Yang Tongle? How come he is with Bai Jiayue?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "他不是杨同乐，他叫李文，是白家月的好朋友。",
        pinyin: "Tā bú shì Yáng Tónglè, tā jiào Lǐ Wén, shì Bái Jiāyuè de hǎo péngyou.",
        english: "He isn't Yang Tongle, his name is Li Wen, and he is Bai Jiayue's good friend.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "我还以为是同乐呢，他们看上去有点儿像。",
        pinyin: "Wǒ hái yǐwéi shì Tónglè ne, tāmen kàn shàngqù yǒudiǎnr xiàng.",
        english: "I thought it was Tongle; they look a bit alike.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "是长得有点儿像，但是他比同乐高，身高有一米八。",
        pinyin: "Shì zhǎng de yǒudiǎnr xiàng, dànshì tā bǐ Tónglè gāo, shēngāo yǒu yì mǐ bā.",
        english: "They do look a bit alike, but he is taller than Tongle; his height is 1.8 meters.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "看起来也比同乐瘦一点儿。",
        pinyin: "Kàn qǐlái yě bǐ Tónglè shòu yìdiǎnr.",
        english: "He also looks a bit thinner than Tongle.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "下个星期家月和李文要来北京，我去机场接他们。",
        pinyin: "Xià gè xīngqī Jiāyuè hé Lǐ Wén yào lái Běijīng, wǒ qù jīchǎng jiē tāmen.",
        english: "Next week Jiayue and Li Wen are coming to Beijing, I'm going to the airport to pick them up.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "他们哪天到北京？我跟你一起去机场接他们吧。",
        pinyin: "Tāmen nǎ tiān dào Běijīng? Wǒ gēn nǐ yìqǐ qù jīchǎng jiē tāmen ba.",
        english: "What day are they arriving in Beijing? Let me go with you to the airport to pick them up.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "以为",
      pinyin: "yǐwéi",
      english: "Mistakenly think",
      bangla: "মনে করা",
      characters: [
        { hanzi: "以", pinyin: "yǐ", meaning: "With/By" },
        { hanzi: "为", pinyin: "wéi", meaning: "Think/Believe" },
      ],
      example: {
        hanzi: "我以为他是老师。",
        pinyin: "Wǒ yǐwéi tā shì lǎoshī.",
        english: "I mistakenly thought he was a teacher.",
        bangla: "আমি ভেবেছিলাম তিনি শিক্ষক।",
      },
      similar: [{ hanzi: "认为", pinyin: "rènwéi", english: "Think/Believe" }],
    },
    {
      hanzi: "像",
      pinyin: "xiàng",
      english: "Be like/Resemble",
      bangla: "মতো/সাদৃশ্য",
      characters: [
        { hanzi: "亻", pinyin: "rén", meaning: "Person" },
        { hanzi: "象", pinyin: "xiàng", meaning: "Elephant/Image" },
      ],
      example: {
        hanzi: "他像他爸爸。",
        pinyin: "Tā xiàng tā bàba.",
        english: "He resembles his father.",
        bangla: "সে তার বাবার মতো।",
      },
      similar: [{ hanzi: "似", pinyin: "sì", english: "Seem/Like" }],
    },
    {
      hanzi: "长",
      pinyin: "zhǎng",
      english: "Grow",
      bangla: "বেড়ে ওঠা",
      characters: [
        { hanzi: "镸", pinyin: "cháng", meaning: "Long" },
        { hanzi: "丿", pinyin: "piě", meaning: "Stroke" },
      ],
      example: {
        hanzi: "他长得很高。",
        pinyin: "Tā zhǎng de hěn gāo.",
        english: "He has grown very tall.",
        bangla: "সে অনেক লম্বা হয়েছে।",
      },
      similar: [{ hanzi: "生长", pinyin: "shēngzhǎng", english: "Grow" }],
    },
    {
      hanzi: "身高",
      pinyin: "shēngāo",
      english: "Height",
      bangla: "উচ্চতা",
      characters: [
        { hanzi: "身", pinyin: "shēn", meaning: "Body" },
        { hanzi: "高", pinyin: "gāo", meaning: "Tall/High" },
      ],
      example: {
        hanzi: "他的身高是一米八。",
        pinyin: "Tā de shēngāo shì yì mǐ bā.",
        english: "His height is 1.8 meters.",
        bangla: "তার উচ্চতা ১.৮ মিটার।",
      },
      similar: [{ hanzi: "高度", pinyin: "gāodù", english: "Height/Altitude" }],
    },
    {
      hanzi: "米",
      pinyin: "mǐ",
      english: "Meter",
      bangla: "মিটার",
      characters: [
        { hanzi: "米", pinyin: "mǐ", meaning: "Rice/Meter" },
      ],
      example: {
        hanzi: "这个房间有五米长。",
        pinyin: "Zhè gè fángjiān yǒu wǔ mǐ cháng.",
        english: "This room is five meters long.",
        bangla: "এই ঘরটি পাঁচ মিটার লম্বা।",
      },
      similar: [{ hanzi: "公里", pinyin: "gōnglǐ", english: "Kilometer" }],
    },
    {
      hanzi: "瘦",
      pinyin: "shòu",
      english: "Thin",
      bangla: "রোগা",
      characters: [
        { hanzi: "疒", pinyin: "bìng", meaning: "Sickness" },
        { hanzi: "叟", pinyin: "sǒu", meaning: "Old man" },
      ],
      example: {
        hanzi: "他比以前瘦了。",
        pinyin: "Tā bǐ yǐqián shòu le.",
        english: "He has gotten thinner than before.",
        bangla: "সে আগের চেয়ে রোগা হয়েছে।",
      },
      similar: [{ hanzi: "瘦弱", pinyin: "shòuruò", english: "Thin and weak" }],
    },
    {
      hanzi: "接",
      pinyin: "jiē",
      english: "Pick up/Meet",
      bangla: "রিসিভ করা",
      characters: [
        { hanzi: "扌", pinyin: "shǒu", meaning: "Hand" },
        { hanzi: "妾", pinyin: "qiè", meaning: "Concubine" },
      ],
      example: {
        hanzi: "我去机场接你。",
        pinyin: "Wǒ qù jīchǎng jiē nǐ.",
        english: "I'll go to the airport to pick you up.",
        bangla: "আমি তোমাকে এয়ারপোর্টে রিসিভ করতে যাব।",
      },
      similar: [{ hanzi: "迎接", pinyin: "yíngjiē", english: "Welcome/Meet" }],
    },
  ],
};