// Lesson 5 - Text 1
import type { VocabularyData } from "@/types/vocabulary";

export const lesson5Text1Data: VocabularyData = {
  hskLevel: 1,

  lesson: 5,
  text: 1,
  dialogue: {
    title: "Today's Date",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "今天几号？",
        pinyin: "Jīntiān jǐ hào?",
        english: "What's today's date?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "今天9月8号。",
        pinyin: "Jīntiān jiǔ yuè bā hào.",
        english: "Today is September 8th.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "星期几？",
        pinyin: "Xīngqī jǐ?",
        english: "What day of the week?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "星期日。今天我休息。",
        pinyin: "Xīngqīrì. Jīntiān wǒ xiūxi.",
        english: "Sunday. I'm resting today.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "今天",
      pinyin: "jīntiān",
      english: "Today",
      bangla: "আজ",
      characters: [
        {
          hanzi: "今",
          pinyin: "jīn",
          meaning: "Current",
        },
        {
          hanzi: "天",
          pinyin: "tiān",
          meaning: "Day",
        },
      ],
      example: {
        hanzi: "今天是九月八号。",
        pinyin: "Jīntiān shì jiǔyuè bā hào.",
        english: "Today is September 8th.",
        bangla: "আজ সেপ্টেম্বর ৮ তারিখ।",
      },
      similar: [
        {
          hanzi: "当日",
          pinyin: "dāngrì",
          english: "Today",
        },
      ],
    },
    {
      hanzi: "号",
      pinyin: "hào",
      english: "Date",
      bangla: "তারিখ/সংখ্যা",
      characters: [
        {
          hanzi: "号",
          pinyin: "hào",
          meaning: "Number/Date",
        },
      ],
      example: {
        hanzi: "今天几号？",
        pinyin: "Jīntiān jǐ hào?",
        english: "What's the date today?",
        bangla: "আজ কত তারিখ?",
      },
      similar: [
        {
          hanzi: "日",
          pinyin: "rì",
          english: "Date",
        },
      ],
    },
    {
      hanzi: "月",
      pinyin: "yuè",
      english: "Month",
      bangla: "মাস",
      characters: [
        {
          hanzi: "月",
          pinyin: "yuè",
          meaning: "Moon/Month",
        },
      ],
      example: {
        hanzi: "这个月是九月。",
        pinyin: "Zhège yuè shì jiǔyuè.",
        english: "This month is September.",
        bangla: "এই মাসটি সেপ্টেম্বর।",
      },
      similar: [
        {
          hanzi: "月份",
          pinyin: "yuèfèn",
          english: "Month",
        },
      ],
    },
    {
      hanzi: "日",
      pinyin: "rì",
      english: "Day",
      bangla: "দিন/তারিখ",
      characters: [
        {
          hanzi: "日",
          pinyin: "rì",
          meaning: "Sun/Day",
        },
      ],
      example: {
        hanzi: "九月八日是星期天。",
        pinyin: "Jiǔyuè bā rì shì xīngqītiān.",
        english: "September 8th is Sunday.",
        bangla: "সেপ্টেম্বর ৮ তারিখ হলো রবিবার।",
      },
      similar: [
        {
          hanzi: "号",
          pinyin: "hào",
          english: "Date",
        },
      ],
    },
    {
      hanzi: "星期",
      pinyin: "xīngqī",
      english: "Week",
      bangla: "সপ্তাহ",
      characters: [
        {
          hanzi: "星",
          pinyin: "xīng",
          meaning: "Star",
        },
        {
          hanzi: "期",
          pinyin: "qī",
          meaning: "Time period",
        },
      ],
      example: {
        hanzi: "一个星期有七天。",
        pinyin: "Yīge xīngqī yǒu qī tiān.",
        english: "There are seven days in a week.",
        bangla: "এক সপ্তাহে সাত দিন থাকে।",
      },
      similar: [
        {
          hanzi: "周",
          pinyin: "zhōu",
          english: "Week",
        },
      ],
    },
    {
      hanzi: "星期日",
      pinyin: "xīngqīrì",
      english: "Sunday",
      bangla: "রবিবার",
      characters: [
        {
          hanzi: "星期",
          pinyin: "xīngqī",
          meaning: "Week",
        },
        {
          hanzi: "日",
          pinyin: "rì",
          meaning: "Day",
        },
      ],
      example: {
        hanzi: "今天是星期日。",
        pinyin: "Jīntiān shì xīngqīrì.",
        english: "Today is Sunday.",
        bangla: "আজ রবিবার।",
      },
      similar: [
        {
          hanzi: "星期天",
          pinyin: "xīngqītiān",
          english: "Sunday",
        },
      ],
    },
    {
      hanzi: "星期天",
      pinyin: "xīngqītiān",
      english: "Sunday",
      bangla: "রবিবার",
      characters: [
        {
          hanzi: "星期",
          pinyin: "xīngqī",
          meaning: "Week",
        },
        {
          hanzi: "天",
          pinyin: "tiān",
          meaning: "Day",
        },
      ],
      example: {
        hanzi: "星期天我休息。",
        pinyin: "Xīngqītiān wǒ xiūxi.",
        english: "I rest on Sunday.",
        bangla: "রবিবার আমার ছুটি।",
      },
      similar: [
        {
          hanzi: "星期日",
          pinyin: "xīngqīrì",
          english: "Sunday",
        },
      ],
    },
    {
      hanzi: "休息",
      pinyin: "xiūxi",
      english: "Have a rest",
      bangla: "বিশ্রাম নেওয়া",
      characters: [
        {
          hanzi: "休",
          pinyin: "xiū",
          meaning: "Rest",
        },
        {
          hanzi: "息",
          pinyin: "xī",
          meaning: "Breathe/Stop",
        },
      ],
      example: {
        hanzi: "我今天休息。",
        pinyin: "Wǒ jīntiān xiūxi.",
        english: "I am resting today.",
        bangla: "আমি আজ ছুটিতে আছি।",
      },
      similar: [
        {
          hanzi: "歇息",
          pinyin: "xiēxi",
          english: "Rest",
        },
      ],
    },
  ],
};
