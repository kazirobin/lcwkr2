// app/data/vocabulary/lesson2-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson2text2: VocabularyData = {
  hskLevel: 2,
  lesson: 2,
  text: 2,
  dialogue: {
    title: "Students at Peking University",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "学校里人真多啊！",
        pinyin: "Xuéxiào lǐ rén zhēn duō a!",
        english: "There are really so many people at the school!",
      },
      {
        speaker: "Anni",
        hanzi: "是啊，北京大学有四万多名学生呢！",
        pinyin: "Shì a, Běijīng Dàxué yǒu sì wàn duō míng xuéshēng ne!",
        english:
          "Yes, Peking University has more than forty thousand students!",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "你是怎么知道的？",
        pinyin: "Nǐ shì zěnme zhīdào de?",
        english: "How did you know that?",
      },
      {
        speaker: "Anni",
        hanzi: "是网上说的，网上还说北京大学有三千多名外国学生。",
        pinyin:
          "Shì wǎngshàng shuō de, wǎngshàng hái shuō Běijīng Dàxué yǒu sānqiān duō míng wàiguó xuéshēng.",
        english:
          "I read it online. It also says online that Peking University has more than three thousand international students.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我也想来这儿学习。",
        pinyin: "Wǒ yě xiǎng lái zhèr xuéxí.",
        english: "I also want to come here to study.",
      },
      {
        speaker: "Anni",
        hanzi: "那边就有一间教室，我们去看一下吧。",
        pinyin: "Nàbiān jiù yǒu yì jiān jiàoshì, wǒmen qù kàn yíxià ba.",
        english: "There is a classroom over there. Let's go take a look.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "啊",
      pinyin: "a",
      english: "Exclamation particle",
      bangla: "বিস্ময়সূচক কণা",
      characters: [
        { hanzi: "啊", pinyin: "a", meaning: "Exclamation particle" },
      ],
      example: {
        hanzi: "今天天气真好啊！",
        pinyin: "Jīntiān tiānqì zhēn hǎo a!",
        english: "The weather today is really nice!",
        bangla: "আজ আবহাওয়া খুব ভালো!",
      },
      similar: [{ hanzi: "呀", pinyin: "ya", english: "Particle" }],
    },
    {
      hanzi: "万",
      pinyin: "wàn",
      english: "Ten thousand",
      bangla: "দশ হাজার",
      characters: [{ hanzi: "万", pinyin: "wàn", meaning: "Ten thousand" }],
      example: {
        hanzi: "这个手机一万块。",
        pinyin: "Zhège shǒujī yíwàn kuài.",
        english: "This phone costs ten thousand yuan.",
        bangla: "এই ফোনটির দাম দশ হাজার ইউয়ান।",
      },
      similar: [{ hanzi: "仟", pinyin: "qiān", english: "Thousand" }],
    },
    {
      hanzi: "名",
      pinyin: "míng",
      english: "Measure word for people",
      bangla: "ব্যক্তির জন্য পরিমাণবাচক শব্দ",
      characters: [{ hanzi: "名", pinyin: "míng", meaning: "Name/Status" }],
      example: {
        hanzi: "我们班来了三名新学生。",
        pinyin: "Wǒmen bān lái le sān míng xīn xuéshēng.",
        english: "Three new students came to our class.",
        bangla: "আমাদের ক্লাসে তিন জন নতুন শিক্ষার্থী এসেছে।",
      },
      similar: [{ hanzi: "个", pinyin: "gè", english: "General measure word" }],
    },
    {
      hanzi: "网上",
      pinyin: "wǎngshàng",
      english: "Online",
      bangla: "অনলাইনে/ইন্টারনেটে",
      characters: [
        { hanzi: "网", pinyin: "wǎng", meaning: "Network" },
        { hanzi: "上", pinyin: "shàng", meaning: "Above/On" },
      ],
      example: {
        hanzi: "我喜欢在网上买书。",
        pinyin: "Wǒ xǐhuān zài wǎngshàng mǎi shū.",
        english: "I like to buy books online.",
        bangla: "আমি অনলাইনে বই কিনতে পছন্দ করি।",
      },
      similar: [{ hanzi: "网络", pinyin: "wǎngluò", english: "Internet" }],
    },
    {
      hanzi: "外国",
      pinyin: "wàiguó",
      english: "Foreign country",
      bangla: "বিদেশ",
      characters: [
        { hanzi: "外", pinyin: "wài", meaning: "Outside" },
        { hanzi: "国", pinyin: "guó", meaning: "Country" },
      ],
      example: {
        hanzi: "他在一个外国公司工作。",
        pinyin: "Tā zài yígè wàiguó gōngsī gōngzuò.",
        english: "He works in a foreign company.",
        bangla: "সে একটি বিদেশি কোম্পানিতে কাজ করে।",
      },
      similar: [{ hanzi: "海外", pinyin: "hǎiwài", english: "Overseas" }],
    },
    {
      hanzi: "间",
      pinyin: "jiān",
      english: "Measure word for rooms",
      bangla: "কক্ষের জন্য পরিমাণবাচক শব্দ",
      characters: [{ hanzi: "间", pinyin: "jiān", meaning: "Room/Space" }],
      example: {
        hanzi: "这间教室很大。",
        pinyin: "Zhè jiān jiàoshì hěn dà.",
        english: "This classroom is very big.",
        bangla: "এই শ্রেণীকক্ষটি অনেক বড়।",
      },
      similar: [{ hanzi: "个", pinyin: "gè", english: "General measure word" }],
    },
    {
      hanzi: "教室",
      pinyin: "jiàoshì",
      english: "Classroom",
      bangla: "শ্রেণীকক্ষ",
      characters: [
        { hanzi: "教", pinyin: "jiào", meaning: "Teach" },
        { hanzi: "室", pinyin: "shì", meaning: "Room" },
      ],
      example: {
        hanzi: "老师现在在教室里。",
        pinyin: "Lǎoshī xiànzài zài jiàoshì lǐ.",
        english: "The teacher is in the classroom now.",
        bangla: "শিক্ষক এখন শ্রেণীকক্ষে আছেন।",
      },
      similar: [{ hanzi: "课堂", pinyin: "kètáng", english: "Classroom" }],
    },
  ],
};
