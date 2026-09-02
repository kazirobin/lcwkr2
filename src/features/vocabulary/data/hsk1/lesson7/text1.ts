import type { VocabularyData } from "@/features/vocabulary/types";
// Lesson 7 - Text 1
export const lesson7Text1Data: VocabularyData = {
  hskLevel: 1,

  lesson: 7,
  text: 1,
  dialogue: {
    title: "Time and Class",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "现在几点？",
        pinyin: "Xiànzài jǐ diǎn?",
        english: "What time is it now?",
      },
      {
        speaker: "Anni",
        hanzi: "早上八点四十。",
        pinyin: "Zǎoshang bā diǎn sìshí.",
        english: "It’s 8:40 in the morning.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我上午十点十分有课。",
        pinyin: "Wǒ shàngwǔ shí diǎn shí fēn yǒu kè.",
        english: "I have a class at 10:10 in the morning.",
      },
      {
        speaker: "Anni",
        hanzi: "好的，我们下午两点见吧。",
        pinyin: "Hǎo de, wǒmen xiàwǔ liǎng diǎn jiàn ba.",
        english: "Okay, let’s meet at 2:00 p.m.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "现在",
      pinyin: "xiànzài",
      english: "Now",
      bangla: "এখন",
      characters: [
        {
          hanzi: "现",
          pinyin: "xiàn",
          meaning: "Current",
        },
        {
          hanzi: "在",
          pinyin: "zài",
          meaning: "Be at",
        },
      ],
      example: {
        hanzi: "现在几点了？",
        pinyin: "Xiànzài jǐ diǎn le?",
        english: "What time is it now?",
        bangla: "এখন ক'taয় বাজে?",
      },
      similar: [
        {
          hanzi: "目前",
          pinyin: "mùqián",
          english: "Currently",
        },
      ],
    },
    {
      hanzi: "点",
      pinyin: "diǎn",
      english: "O'clock",
      bangla: "টা",
      characters: [
        {
          hanzi: "点",
          pinyin: "diǎn",
          meaning: "Point/Hour",
        },
      ],
      example: {
        hanzi: "现在八点。",
        pinyin: "Xiànzài bā diǎn.",
        english: "It's eight o'clock now.",
        bangla: "এখন আটটা বাজে।",
      },
      similar: [
        {
          hanzi: "小时",
          pinyin: "xiǎoshí",
          english: "Hour",
        },
      ],
    },
    {
      hanzi: "早上",
      pinyin: "zǎoshang",
      english: "Early morning",
      bangla: "সকাল",
      characters: [
        {
          hanzi: "早",
          pinyin: "zǎo",
          meaning: "Early",
        },
        {
          hanzi: "上",
          pinyin: "shang",
          meaning: "Up",
        },
      ],
      example: {
        hanzi: "我早上六点起床。",
        pinyin: "Wǒ zǎoshang liù diǎn qǐchuáng.",
        english: "I get up at 6 in the morning.",
        bangla: "আমি সকাল ৬টায় উঠি।",
      },
      similar: [
        {
          hanzi: "早晨",
          pinyin: "zǎochén",
          english: "Morning",
        },
      ],
    },
    {
      hanzi: "上午",
      pinyin: "shàngwǔ",
      english: "Morning (before noon)",
      bangla: "সকাল/পূর্বাহ্ন",
      characters: [
        {
          hanzi: "上",
          pinyin: "shàng",
          meaning: "Before",
        },
        {
          hanzi: "午",
          pinyin: "wǔ",
          meaning: "Noon",
        },
      ],
      example: {
        hanzi: "我们上午有课。",
        pinyin: "Wǒmen shàngwǔ yǒu kè.",
        english: "We have class in the morning.",
        bangla: "আমাদের সকালে ক্লাস আছে।",
      },
      similar: [
        {
          hanzi: "早上",
          pinyin: "zǎoshang",
          english: "Morning",
        },
      ],
    },
    {
      hanzi: "分",
      pinyin: "fēn",
      english: "Minute",
      bangla: "মিনিট",
      characters: [
        {
          hanzi: "分",
          pinyin: "fēn",
          meaning: "Divide",
        },
      ],
      example: {
        hanzi: "现在八点十分。",
        pinyin: "Xiànzài bā diǎn shí fēn.",
        english: "It is 8:10 now.",
        bangla: "এখন আটটা দশ মিনিট।",
      },
      similar: [
        {
          hanzi: "分钟",
          pinyin: "fēnzhōng",
          english: "Minute",
        },
      ],
    },
    {
      hanzi: "课",
      pinyin: "kè",
      english: "Class",
      bangla: "ক্লাস",
      characters: [
        {
          hanzi: "课",
          pinyin: "kè",
          meaning: "Lesson/Class",
        },
      ],
      example: {
        hanzi: "今天我没有课。",
        pinyin: "Jīntiān wǒ méiyǒu kè.",
        english: "I don't have class today.",
        bangla: "আজ আমার ক্লাস নেই।",
      },
      similar: [
        {
          hanzi: "课程",
          pinyin: "kèchéng",
          english: "Course",
        },
      ],
    },
    {
      hanzi: "下午",
      pinyin: "xiàwǔ",
      english: "Afternoon",
      bangla: "বিকেল/অপরাহ্ন",
      characters: [
        {
          hanzi: "下",
          pinyin: "xià",
          meaning: "After",
        },
        {
          hanzi: "午",
          pinyin: "wǔ",
          meaning: "Noon",
        },
      ],
      example: {
        hanzi: "下午我们去见朋友。",
        pinyin: "Xiàwǔ wǒmen qù jiàn péngyou.",
        english: "We will meet a friend this afternoon.",
        bangla: "বিকেলে আমরা বন্ধুর সাথে দেখা করব।",
      },
      similar: [
        {
          hanzi: "傍晚",
          pinyin: "bàngwǎn",
          english: "Evening",
        },
      ],
    },
    {
      hanzi: "见",
      pinyin: "jiàn",
      english: "Meet",
      bangla: "দেখা করা",
      characters: [
        {
          hanzi: "见",
          pinyin: "jiàn",
          meaning: "See",
        },
      ],
      example: {
        hanzi: "明天见！",
        pinyin: "Míngtiān jiàn!",
        english: "See you tomorrow!",
        bangla: "আগামীকাল দেখা হবে!",
      },
      similar: [
        {
          hanzi: "见面",
          pinyin: "jiànmiàn",
          english: "Meet up",
        },
      ],
    },
    {
      hanzi: "吧",
      pinyin: "ba",
      english: "Suggestion particle",
      bangla: "প্রস্তাববাচক অব্যয়",
      characters: [
        {
          hanzi: "吧",
          pinyin: "ba",
          meaning: "Suggestion particle",
        },
      ],
      example: {
        hanzi: "我们走吧。",
        pinyin: "Wǒmen zǒu ba.",
        english: "Let's go.",
        bangla: "চলো যাই।",
      },
      similar: [
        {
          hanzi: "啊",
          pinyin: "a",
          english: "Emphatic particle",
        },
      ],
    },
  ],
};
