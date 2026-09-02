// app/data/vocabulary/lesson11-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson11text1: VocabularyData = {
  hskLevel: 3,
  lesson: 11,
  text: 1,
  dialogue: {
    title: "Meeting Arrangement",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "会议下午几点开始？",
        pinyin: "Huìyì xiàwǔ jǐ diǎn kāishǐ?",
        english: "What time does the meeting start this afternoon?",
      },
      {
        speaker: "Yang Tongle",
        hanzi: "今天下午经理不在，不开会了。",
        pinyin: "Jīntiān xiàwǔ jīnglǐ bú zài, bù kāihuì le.",
        english: "The manager is not here this afternoon, so there won't be a meeting.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "那什么时候开会？",
        pinyin: "Nà shénme shíhou kāihuì?",
        english: "Then when will the meeting be held?",
      },
      {
        speaker: "Yang Tongle",
        hanzi: "后天上午十点，会议地点换到第一会议室。我正要给大家发邮件。",
        pinyin: "Hòutiān shàngwǔ shí diǎn, huìyì dìdiǎn huàn dào dì-yī huìyìshì. Wǒ zhèng yào gěi dàjiā fā yóujiàn.",
        english: "At 10:00 AM the day after tomorrow, the venue has been moved to Meeting Room 1. I was just about to send everyone an email.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "开会的时候，我们用会议室的电脑还是自己的笔记本电脑？",
        pinyin: "Kāihuì de shíhou, wǒmen yòng huìyìshì de diànnǎo háishi zìjǐ de bǐjìběn diànnǎo?",
        english: "During the meeting, do we use the meeting room's computer or our own laptops?",
      },
      {
        speaker: "Yang Tongle",
        hanzi: "会议室的电脑或者自己的电脑都可以。",
        pinyin: "Huìyìshì de diànnǎo huòzhě zìjǐ de diànnǎo dōu kěyǐ.",
        english: "Either the meeting room's computer or your own laptop is fine.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "那到时候咱们早点儿过去，你帮我把电脑接好吧。",
        pinyin: "Nà dào shíhou zánmen zǎodiǎnr guòqù, nǐ bāng wǒ bǎ diànnǎo jiē hǎo ba.",
        english: "Then let's go over a bit earlier when the time comes, and you can help me set up my laptop.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "会议",
      pinyin: "huìyì",
      english: "Meeting",
      bangla: "সভা",
      characters: [
        { hanzi: "会", pinyin: "huì", meaning: "Gathering" },
        { hanzi: "议", pinyin: "yì", meaning: "Discuss" },
      ],
      example: {
        hanzi: "会议很重要。",
        pinyin: "Huìyì hěn zhòngyào.",
        english: "The meeting is very important.",
        bangla: "সভাটি খুব গুরুত্বপূর্ণ।",
      },
      similar: [{ hanzi: "开会", pinyin: "kāihuì", english: "Have a meeting" }],
    },
    {
      hanzi: "经理",
      pinyin: "jīnglǐ",
      english: "Manager",
      bangla: "ম্যানেজার",
      characters: [
        { hanzi: "经", pinyin: "jīng", meaning: "Manage" },
        { hanzi: "理", pinyin: "lǐ", meaning: "Manage" },
      ],
      example: {
        hanzi: "经理来了。",
        pinyin: "Jīnglǐ lái le.",
        english: "The manager has arrived.",
        bangla: "ম্যানেজার এসেছেন।",
      },
      similar: [{ hanzi: "主管", pinyin: "zhǔguǎn", english: "Supervisor" }],
    },
    {
      hanzi: "开会",
      pinyin: "kāihuì",
      english: "Have a meeting",
      bangla: "মিটিং করা",
      characters: [
        { hanzi: "开", pinyin: "kāi", meaning: "Open" },
        { hanzi: "会", pinyin: "huì", meaning: "Meeting" },
      ],
      example: {
        hanzi: "今天下午开会。",
        pinyin: "Jīntiān xiàwǔ kāihuì.",
        english: "There is a meeting this afternoon.",
        bangla: "আজ বিকেলে মিটিং আছে।",
      },
      similar: [{ hanzi: "会议", pinyin: "huìyì", english: "Meeting" }],
    },
    {
      hanzi: "后天",
      pinyin: "hòutiān",
      english: "Day after tomorrow",
      bangla: "আগামী পরশু",
      characters: [
        { hanzi: "后", pinyin: "hòu", meaning: "After" },
        { hanzi: "天", pinyin: "tiān", meaning: "Day" },
      ],
      example: {
        hanzi: "后天见。",
        pinyin: "Hòutiān jiàn.",
        english: "See you the day after tomorrow.",
        bangla: "আগামী পরশু দেখা হবে।",
      },
      similar: [{ hanzi: "明天", pinyin: "míngtiān", english: "Tomorrow" }],
    },
    {
      hanzi: "地点",
      pinyin: "dìdiǎn",
      english: "Place/Venue",
      bangla: "স্থান",
      characters: [
        { hanzi: "地", pinyin: "dì", meaning: "Place" },
        { hanzi: "点", pinyin: "diǎn", meaning: "Point" },
      ],
      example: {
        hanzi: "地点在哪儿？",
        pinyin: "Dìdiǎn zài nǎr?",
        english: "Where is the venue?",
        bangla: "স্থান কোথায়?",
      },
      similar: [{ hanzi: "场所", pinyin: "chǎngsuǒ", english: "Venue" }],
    },
    {
      hanzi: "室",
      pinyin: "shì",
      english: "Room",
      bangla: "কক্ষ",
      characters: [
        { hanzi: "宀", pinyin: "mián", meaning: "Roof" },
        { hanzi: "至", pinyin: "zhì", meaning: "Arrive" },
      ],
      example: {
        hanzi: "会议室。",
        pinyin: "Huìyìshì.",
        english: "Meeting room.",
        bangla: "মিটিং রুম।",
      },
      similar: [{ hanzi: "房间", pinyin: "fángjiān", english: "Room" }],
    },
    {
      hanzi: "发",
      pinyin: "fā",
      english: "Send",
      bangla: "পাঠানো",
      characters: [
        { hanzi: "发", pinyin: "fā", meaning: "Send" },
      ],
      example: {
        hanzi: "我发了一封邮件。",
        pinyin: "Wǒ fā le yì fēng yóujiàn.",
        english: "I sent an email.",
        bangla: "আমি একটি ইমেইল পাঠিয়েছি।",
      },
      similar: [{ hanzi: "发送", pinyin: "fāsòng", english: "Send" }],
    },
    {
      hanzi: "笔记本电脑",
      pinyin: "bǐjìběn diànnǎo",
      english: "Laptop",
      bangla: "ল্যাপটপ",
      characters: [
        { hanzi: "笔记", pinyin: "bǐjì", meaning: "Notes" },
        { hanzi: "本", pinyin: "běn", meaning: "Book" },
        { hanzi: "电脑", pinyin: "diànnǎo", meaning: "Computer" },
      ],
      example: {
        hanzi: "这是我的笔记本电脑。",
        pinyin: "Zhè shì wǒ de bǐjìběn diànnǎo.",
        english: "This is my laptop.",
        bangla: "এটা আমার ল্যাপটপ।",
      },
      similar: [{ hanzi: "台式电脑", pinyin: "táishì diànnǎo", english: "Desktop computer" }],
    },
    {
      hanzi: "或者",
      pinyin: "huòzhě",
      english: "Or",
      bangla: "অথবা",
      characters: [
        { hanzi: "或", pinyin: "huò", meaning: "Or" },
        { hanzi: "者", pinyin: "zhě", meaning: "Person" },
      ],
      example: {
        hanzi: "你或者他都可以。",
        pinyin: "Nǐ huòzhě tā dōu kěyǐ.",
        english: "Either you or him is fine.",
        bangla: "তুমি অথবা সে—দুজনের কেউ হতে পারে।",
      },
      similar: [{ hanzi: "还是", pinyin: "háishì", english: "Or" }],
    },
  ],
};