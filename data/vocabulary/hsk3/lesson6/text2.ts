// app/data/vocabulary/lesson6-text2.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk3lesson6text2: VocabularyData = {
  hskLevel: 3,
  lesson: 6,
  text: 2,
  dialogue: {
    title: "On the Way to the Station",
    lines: [
      {
        speaker: "Liu Ming",
        hanzi: "过了前面的路口就到高铁站了。",
        pinyin: "Guò le qiánmiàn de lùkǒu jiù dào gāotiě zhàn le.",
        english: "After passing the intersection ahead, we'll arrive at the high-speed railway station.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我看见了。马上就到了，这条路车很多，您小心点儿。",
        pinyin: "Wǒ kànjiàn le. Mǎshàng jiù dào le, zhè tiáo lù chē hěn duō, nín xiǎoxīn diǎnr.",
        english: "I see it. We'll be there soon. There are a lot of cars on this road, please be careful.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "好，你们还有一个小时，应该不会迟到的。",
        pinyin: "Hǎo, nǐmen hái yǒu yí gè xiǎoshí, yīnggāi bú huì chídào de.",
        english: "Okay, you still have one hour, you shouldn't be late.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我发现这条路车多，红绿灯也多。",
        pinyin: "Wǒ fāxiàn zhè tiáo lù chē duō, hónglǜdēng yě duō.",
        english: "I noticed that this road has many cars and also many traffic lights.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "是啊，这条路我走过一次，后来再也不走了。",
        pinyin: "Shì a, zhè tiáo lù wǒ zǒuguò yí cì, hòulái zài yě bù zǒu le.",
        english: "Yeah, I drove on this road once, and after that I never took it again.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "那您今天为什么走了这条路？",
        pinyin: "Nà nín jīntiān wèi shénme zǒu le zhè tiáo lù?",
        english: "Then why did you take this road today?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "我一急就走错了。如果没有走错，二十分钟以前就到了。",
        pinyin: "Wǒ yì jí jiù zǒu cuò le. Rúguǒ méiyǒu zǒu cuò, èrshí fēnzhōng yǐqián jiù dào le.",
        english: "I made a wrong turn because I was in a hurry. If I hadn't gone wrong, we would have arrived 20 minutes ago.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "路口",
      pinyin: "lùkǒu",
      english: "Intersection",
      bangla: "মোড়/চৌরাস্তা",
      characters: [
        { hanzi: "路", pinyin: "lù", meaning: "Road" },
        { hanzi: "口", pinyin: "kǒu", meaning: "Mouth" },
      ],
      example: {
        hanzi: "在前面路口右转。",
        pinyin: "Zài qiánmiàn lùkǒu yòu zhuǎn.",
        english: "Turn right at the intersection ahead.",
        bangla: "সামনের মোড়ে ডানে মোড় নাও।",
      },
      similar: [{ hanzi: "十字路口", pinyin: "shízì lùkǒu", english: "Crossroads" }],
    },
    {
      hanzi: "小心",
      pinyin: "xiǎoxīn",
      english: "Careful",
      bangla: "সাবধানে",
      characters: [
        { hanzi: "小", pinyin: "xiǎo", meaning: "Small" },
        { hanzi: "心", pinyin: "xīn", meaning: "Heart" },
      ],
      example: {
        hanzi: "开车要小心。",
        pinyin: "Kāichē yào xiǎoxīn.",
        english: "Drive carefully.",
        bangla: "গাড়ি চালানোর সময় সাবধান থাকো।",
      },
      similar: [{ hanzi: "注意", pinyin: "zhùyì", english: "Pay attention" }],
    },
    {
      hanzi: "迟到",
      pinyin: "chídào",
      english: "Be late",
      bangla: "দেরি করা",
      characters: [
        { hanzi: "迟", pinyin: "chí", meaning: "Late" },
        { hanzi: "到", pinyin: "dào", meaning: "Arrive" },
      ],
      example: {
        hanzi: "他经常迟到。",
        pinyin: "Tā jīngcháng chídào.",
        english: "He is often late.",
        bangla: "সে প্রায়ই দেরি করে।",
      },
      similar: [{ hanzi: "晚点", pinyin: "wǎndiǎn", english: "Be late" }],
    },
    {
      hanzi: "红绿灯",
      pinyin: "hónglǜdēng",
      english: "Traffic lights",
      bangla: "ট্রাফিক লাইট",
      characters: [
        { hanzi: "红", pinyin: "hóng", meaning: "Red" },
        { hanzi: "绿", pinyin: "lǜ", meaning: "Green" },
        { hanzi: "灯", pinyin: "dēng", meaning: "Light" },
      ],
      example: {
        hanzi: "前面有红绿灯。",
        pinyin: "Qiánmiàn yǒu hónglǜdēng.",
        english: "There are traffic lights ahead.",
        bangla: "সামনে ট্রাফিক লাইট আছে।",
      },
      similar: [{ hanzi: "信号灯", pinyin: "xìnhàodēng", english: "Signal light" }],
    },
    {
      hanzi: "后来",
      pinyin: "hòulái",
      english: "Afterward/Later",
      bangla: "পরবর্তীতে",
      characters: [
        { hanzi: "后", pinyin: "hòu", meaning: "After" },
        { hanzi: "来", pinyin: "lái", meaning: "Come" },
      ],
      example: {
        hanzi: "后来我才知道。",
        pinyin: "Hòulái wǒ cái zhīdào.",
        english: "I only found out later.",
        bangla: "পরে আমি জানতে পারলাম।",
      },
      similar: [{ hanzi: "以后", pinyin: "yǐhòu", english: "After" }],
    },
    {
      hanzi: "急",
      pinyin: "jí",
      english: "Urgent/Anxious",
      bangla: "তাড়াহুড়ো করা",
      characters: [
        { hanzi: "心", pinyin: "xīn", meaning: "Heart" },
        { hanzi: "及", pinyin: "jí", meaning: "Reach" },
      ],
      example: {
        hanzi: "别急。",
        pinyin: "Bié jí.",
        english: "Don't rush.",
        bangla: "তাড়াহুড়ো করো না।",
      },
      similar: [{ hanzi: "着急", pinyin: "zháojí", english: "Worried" }],
    },
    {
      hanzi: "如果",
      pinyin: "rúguǒ",
      english: "If",
      bangla: "যদি",
      characters: [
        { hanzi: "如", pinyin: "rú", meaning: "If" },
        { hanzi: "果", pinyin: "guǒ", meaning: "Fruit" },
      ],
      example: {
        hanzi: "如果明天下雨，我就不去。",
        pinyin: "Rúguǒ míngtiān xiàyǔ, wǒ jiù bú qù.",
        english: "If it rains tomorrow, I won't go.",
        bangla: "যদি কাল বৃষ্টি হয়, আমি যাব না।",
      },
      similar: [{ hanzi: "假如", pinyin: "jiǎrú", english: "If" }],
    },
    {
      hanzi: "以前",
      pinyin: "yǐqián",
      english: "Ago/Before",
      bangla: "আগে",
      characters: [
        { hanzi: "以", pinyin: "yǐ", meaning: "With" },
        { hanzi: "前", pinyin: "qián", meaning: "Before" },
      ],
      example: {
        hanzi: "五年以前。",
        pinyin: "Wǔ nián yǐqián.",
        english: "Five years ago.",
        bangla: "পাঁচ বছর আগে।",
      },
      similar: [{ hanzi: "之前", pinyin: "zhīqián", english: "Before" }],
    },
  ],
};