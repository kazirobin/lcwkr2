// app/data/vocabulary/lesson1-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson1text4: VocabularyData = {
  hskLevel: 3,
  lesson: 1,
  text: 4,
  dialogue: {
    title: "Arrival in Beijing",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "昨天我到北京了。虽然路上花了十几个小时，但是跟家月坐在一起，我觉得时间过得很快。",
        pinyin: "Zuótiān wǒ dào Běijīng le. Suīrán lùshang huā le shí jǐ gè xiǎoshí, dànshì gēn Jiāyuè zuò zài yìqǐ, wǒ juéde shíjiān guò de hěn kuài.",
        english: "Yesterday I arrived in Beijing. Although it took more than ten hours on the way, sitting together with Jiayue made me feel time passed very quickly.",
      },
      {
        speaker: "Li Wen",
        hanzi: "到机场的时候，家月发现行李箱不见了，我带她去服务台，帮助她找到了行李箱。",
        pinyin: "Dào jīchǎng de shíhou, Jiāyuè fāxiàn xíngli xiāng bújiàn le, wǒ dài tā qù fúwùtái, bāngzhù tā zhǎodào le xíngli xiāng.",
        english: "When we arrived at the airport, Jiayue discovered her suitcase was missing; I took her to the service desk and helped her find it.",
      },
      {
        speaker: "Li Wen",
        hanzi: "走出机场的时候，已经八点多了，我们一出来就看见了王老师的姐姐，她看起来比照片上年轻。",
        pinyin: "Zǒuchū jīchǎng de shíhou, yǐjīng bā diǎn duō le, wǒmen yì chūlái jiù kànjiàn le Wáng lǎoshī de jiějie, tā kàn qǐlái bǐ zhàopiàn shang niánqīng.",
        english: "When we walked out of the airport, it was already past eight o'clock. As soon as we came out, we saw Teacher Wang's older sister; she looks younger than in photos.",
      },
      {
        speaker: "Li Wen",
        hanzi: "晚上，一雪姐带我们去吃了一家很好吃的中国菜。",
        pinyin: "Wǎnshang, Yīxuě jiě dài wǒmen qù chī le yì jiā hěn hǎochī de Zhōngguó cài.",
        english: "In the evening, Yixue-jie took us to eat at a delicious Chinese restaurant.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "发现",
      pinyin: "fāxiàn",
      english: "Discover/Find",
      bangla: "আবিষ্কার করা",
      characters: [
        { hanzi: "发", pinyin: "fā", meaning: "Send/Discover" },
        { hanzi: "现", pinyin: "xiàn", meaning: "Appear/Show" },
      ],
      example: {
        hanzi: "我发现了一个问题。",
        pinyin: "Wǒ fāxiàn le yí gè wèntí.",
        english: "I discovered a problem.",
        bangla: "আমি একটি সমস্যা আবিষ্কার করেছি।",
      },
      similar: [{ hanzi: "找到", pinyin: "zhǎodào", english: "Find" }],
    },
    {
      hanzi: "不见",
      pinyin: "bújiàn",
      english: "Be lost/Disappear",
      bangla: "হারিয়ে যাওয়া",
      characters: [
        { hanzi: "不", pinyin: "bù", meaning: "Not" },
        { hanzi: "见", pinyin: "jiàn", meaning: "See" },
      ],
      example: {
        hanzi: "我的书不见了。",
        pinyin: "Wǒ de shū bújiàn le.",
        english: "My book is lost.",
        bangla: "আমার বইটি হারিয়ে গেছে।",
      },
      similar: [{ hanzi: "丢失", pinyin: "diūshī", english: "Lose" }],
    },
    {
      hanzi: "带",
      pinyin: "dài",
      english: "Take/Bring/Carry",
      bangla: "নিয়ে যাওয়া",
      characters: [
        { hanzi: "廾", pinyin: "gǒng", meaning: "Two hands" },
        { hanzi: "戴", pinyin: "dài", meaning: "Wear (simplified)" },
      ],
      example: {
        hanzi: "我带你去看电影。",
        pinyin: "Wǒ dài nǐ qù kàn diànyǐng.",
        english: "I'll take you to watch a movie.",
        bangla: "আমি তোমাকে সিনেমা দেখতে নিয়ে যাব।",
      },
      similar: [{ hanzi: "带领", pinyin: "dàilǐng", english: "Lead/Take" }],
    },
    {
      hanzi: "帮助",
      pinyin: "bāngzhù",
      english: "Help/Assist",
      bangla: "সাহায্য করা",
      characters: [
        { hanzi: "帮", pinyin: "bāng", meaning: "Help/Assist" },
        { hanzi: "助", pinyin: "zhù", meaning: "Help/Aid" },
      ],
      example: {
        hanzi: "他帮助了我。",
        pinyin: "Tā bāngzhù le wǒ.",
        english: "He helped me.",
        bangla: "সে আমাকে সাহায্য করেছে।",
      },
      similar: [{ hanzi: "协助", pinyin: "xiézhù", english: "Assist" }],
    },
    {
      hanzi: "照片",
      pinyin: "zhàopiàn",
      english: "Photo/Picture",
      bangla: "ছবি",
      characters: [
        { hanzi: "照", pinyin: "zhào", meaning: "Take photo/Shine" },
        { hanzi: "片", pinyin: "piàn", meaning: "Piece/Card" },
      ],
      example: {
        hanzi: "这张照片很漂亮。",
        pinyin: "Zhè zhāng zhàopiàn hěn piàoliang.",
        english: "This photo is very beautiful.",
        bangla: "এই ছবিটি খুব সুন্দর।",
      },
      similar: [{ hanzi: "图片", pinyin: "túpiàn", english: "Picture/Image" }],
    },
  ],
};