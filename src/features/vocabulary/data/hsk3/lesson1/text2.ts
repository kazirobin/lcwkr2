// app/data/vocabulary/lesson1-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson1text2: VocabularyData = {
  hskLevel: 3,
  lesson: 1,
  text: 2,
  dialogue: {
    title: "Lost Luggage",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "我的行李怎么还没出来？是不是丢了？",
        pinyin: "Wǒ de xíngli zěnme hái méi chūlái? Shì bú shì diū le?",
        english: "How come my luggage hasn't come out yet? Is it lost?",
      },
      {
        speaker: "Li Wen",
        hanzi: "你的行李箱是什么样的？",
        pinyin: "Nǐ de xíngli xiāng shì shénme yàng de?",
        english: "What does your suitcase look like?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "是一个黑色的箱子，上面写着我的名字和电话号码。",
        pinyin: "Shì yí gè hēisè de xiāngzi, shàngmian xiězhe wǒ de míngzi hé diànhuà hàomǎ.",
        english: "It's a black suitcase with my name and phone number written on it.",
      },
      {
        speaker: "Li Wen",
        hanzi: "我好像在哪儿看到过这个箱子，是不是有人拿错了？",
        pinyin: "Wǒ hǎoxiàng zài nǎr kàndào guo zhè gè xiāngzi, shì bú shì yǒu rén ná cuò le?",
        english: "I feel like I saw this suitcase somewhere; did someone take it by mistake?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我们快找谁问一下吧，箱子里有不少重要的东西。",
        pinyin: "Wǒmen kuài zhǎo shéi wèn yíxià ba, xiāngzi lǐ yǒu bù shǎo zhòngyào de dōngxi.",
        english: "Let's quickly ask someone, there are quite a few important things inside the box.",
      },
      {
        speaker: "Li Wen",
        hanzi: "别着急，我们拿着护照和机票，去服务台问问吧。",
        pinyin: "Bié zháojí, wǒmen názhe hùzhào hé jīpiào, qù fúwùtái wènwen ba.",
        english: "Don't worry, let's take our passports and plane tickets and go ask at the service desk.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "行李",
      pinyin: "xíngli",
      english: "Luggage/Baggage",
      bangla: "লাগেজ",
      characters: [
        { hanzi: "行", pinyin: "xíng", meaning: "Go/Travel" },
        { hanzi: "李", pinyin: "lǐ", meaning: "Plum" },
      ],
      example: {
        hanzi: "我的行李很重。",
        pinyin: "Wǒ de xíngli hěn zhòng.",
        english: "My luggage is very heavy.",
        bangla: "আমার লাগেজ খুব ভারী।",
      },
      similar: [{ hanzi: "行李包", pinyin: "xíngli bāo", english: "Bag/Luggage bag" }],
    },
    {
      hanzi: "丢",
      pinyin: "diū",
      english: "Lose/Misplace",
      bangla: "হারানো",
      characters: [
        { hanzi: "丿", pinyin: "piě", meaning: "Stroke" },
        { hanzi: "去", pinyin: "qù", meaning: "Go" },
      ],
      example: {
        hanzi: "我的钥匙丢了。",
        pinyin: "Wǒ de yàoshi diū le.",
        english: "I lost my keys.",
        bangla: "আমার চাবি হারিয়ে গেছে।",
      },
      similar: [{ hanzi: "遗失", pinyin: "yíshī", english: "Lose/Misplace" }],
    },
    {
      hanzi: "箱子",
      pinyin: "xiāngzi",
      english: "Suitcase/Box/Chest",
      bangla: "ট্রলি/বাক্স",
      characters: [
        { hanzi: "箱", pinyin: "xiāng", meaning: "Box/Chest" },
        { hanzi: "子", pinyin: "zi", meaning: "Noun suffix" },
      ],
      example: {
        hanzi: "这个箱子很漂亮。",
        pinyin: "Zhè gè xiāngzi hěn piàoliang.",
        english: "This suitcase is very beautiful.",
        bangla: "এই ট্রলিটি খুব সুন্দর।",
      },
      similar: [{ hanzi: "行李箱", pinyin: "xíngli xiāng", english: "Suitcase" }],
    },
    {
      hanzi: "号码",
      pinyin: "hàomǎ",
      english: "Number",
      bangla: "নম্বর",
      characters: [
        { hanzi: "号", pinyin: "hào", meaning: "Number/Name" },
        { hanzi: "码", pinyin: "mǎ", meaning: "Code/Number" },
      ],
      example: {
        hanzi: "你的电话号码是多少？",
        pinyin: "Nǐ de diànhuà hàomǎ shì duōshao?",
        english: "What is your phone number?",
        bangla: "তোমার ফোন নম্বর কত?",
      },
      similar: [{ hanzi: "数字", pinyin: "shùzì", english: "Digit/Number" }],
    },
    {
      hanzi: "好像",
      pinyin: "hǎoxiàng",
      english: "Seemingly/It seems",
      bangla: "মনে হয়",
      characters: [
        { hanzi: "好", pinyin: "hǎo", meaning: "Good" },
        { hanzi: "像", pinyin: "xiàng", meaning: "Like/Resemble" },
      ],
      example: {
        hanzi: "他好像很忙。",
        pinyin: "Tā hǎoxiàng hěn máng.",
        english: "He seems very busy.",
        bangla: "তাকে ব্যস্ত মনে হচ্ছে।",
      },
      similar: [{ hanzi: "似乎", pinyin: "sìhū", english: "It seems/Apparently" }],
    },
    {
      hanzi: "重要",
      pinyin: "zhòngyào",
      english: "Important",
      bangla: "গুরুত্বপূর্ণ",
      characters: [
        { hanzi: "重", pinyin: "zhòng", meaning: "Heavy/Important" },
        { hanzi: "要", pinyin: "yào", meaning: "Need/Important" },
      ],
      example: {
        hanzi: "这件事很重要。",
        pinyin: "Zhè jiàn shì hěn zhòngyào.",
        english: "This matter is very important.",
        bangla: "এই বিষয়টি খুব গুরুত্বপূর্ণ।",
      },
      similar: [{ hanzi: "重大", pinyin: "zhòngdà", english: "Significant/Major" }],
    },
    {
      hanzi: "着急",
      pinyin: "zháojí",
      english: "Worried/Anxious",
      bangla: "চিন্তিত",
      characters: [
        { hanzi: "着", pinyin: "zháo", meaning: "Touch/Feel" },
        { hanzi: "急", pinyin: "jí", meaning: "Urgent/Anxious" },
      ],
      example: {
        hanzi: "你别着急。",
        pinyin: "Nǐ bié zháojí.",
        english: "Don't worry.",
        bangla: "তুমি চিন্তা করো না।",
      },
      similar: [{ hanzi: "着急", pinyin: "zháojí", english: "Worried" }],
    },
    {
      hanzi: "护照",
      pinyin: "hùzhào",
      english: "Passport",
      bangla: "পাসপোর্ট",
      characters: [
        { hanzi: "护", pinyin: "hù", meaning: "Protect" },
        { hanzi: "照", pinyin: "zhào", meaning: "Photo/Shine" },
      ],
      example: {
        hanzi: "请出示你的护照。",
        pinyin: "Qǐng chūshì nǐ de hùzhào.",
        english: "Please show your passport.",
        bangla: "অনুগ্রহ করে আপনার পাসপোর্ট দেখান।",
      },
      similar: [{ hanzi: "签证", pinyin: "qiānzhèng", english: "Visa" }],
    },
    {
      hanzi: "服务台",
      pinyin: "fúwùtái",
      english: "Service desk/Counter",
      bangla: "হেল্পডেস্ক/সার্ভিস ডেস্ক",
      characters: [
        { hanzi: "服", pinyin: "fú", meaning: "Serve/Service" },
        { hanzi: "务", pinyin: "wù", meaning: "Business/Affair" },
        { hanzi: "台", pinyin: "tái", meaning: "Desk/Platform" },
      ],
      example: {
        hanzi: "我们去服务台问问。",
        pinyin: "Wǒmen qù fúwùtái wènwen.",
        english: "Let's go ask at the service desk.",
        bangla: "চলো হেল্পডেস্কে গিয়ে জিজ্ঞেস করি।",
      },
      similar: [{ hanzi: "前台", pinyin: "qiántái", english: "Front desk" }],
    },
  ],
};