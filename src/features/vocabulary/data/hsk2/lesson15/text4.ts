// app/data/vocabulary/lesson15-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson15text4: VocabularyData = {
  hskLevel: 2,
  lesson: 15,
  text: 4,
  dialogue: {
    title: "Going Home for the New Year",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "我六月的时候回过一次北京，现在有半年多没回去了，我有点儿想家。",
        pinyin:
          "Wǒ Liùyuè de shíhou huíguo yí cì Běijīng, xiànzài yǒu bàn nián duō méi huíqù le, wǒ yǒudiǎnr xiǎng jiā.",
        english:
          "I went back to Beijing once in June. Now I haven't been back for more than half a year, and I'm a little homesick.",
      },
      {
        speaker: "Li Wen",
        hanzi: "就要过年了，我要回家过年。",
        pinyin: "Jiù yào guònián le, wǒ yào huí jiā guònián.",
        english:
          "The Chinese New Year is coming, so I'm going home to celebrate it.",
      },
      {
        speaker: "Li Wen",
        hanzi: "家月这次也要去北京，我们都是星期五的飞机。",
        pinyin:
          "Jiāyuè zhè cì yě yào qù Běijīng, wǒmen dōu shì Xīngqīwǔ de fēijī.",
        english:
          "Jiayue is also going to Beijing this time. We are both taking the Friday flight.",
      },
      {
        speaker: "Li Wen",
        hanzi: "家月说我们好像小鸟，一起飞到北京，再一起飞回这里。",
        pinyin:
          "Jiāyuè shuō wǒmen hǎoxiàng xiǎoniǎo, yìqǐ fēidào Běijīng, zài yìqǐ fēihuí zhèlǐ.",
        english:
          "Jiayue said that we are like little birds, flying together to Beijing and then flying back here together.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "好像",
      pinyin: "hǎoxiàng",
      english: "Seem/Like",
      bangla: "মনে হওয়া/যেন",
      characters: [
        { hanzi: "好", pinyin: "hǎo", meaning: "Very" },
        { hanzi: "像", pinyin: "xiàng", meaning: "Like/Resemble" },
      ],
      example: {
        hanzi: "他好像很高兴。",
        pinyin: "Tā hǎoxiàng hěn gāoxìng.",
        english: "He seems very happy.",
        bangla: "তাকে খুব খুশি মনে হচ্ছে।",
      },
      similar: [{ hanzi: "似乎", pinyin: "sìhū", english: "Seem" }],
    },
    {
      hanzi: "鸟",
      pinyin: "niǎo",
      english: "Bird",
      bangla: "পাখি",
      characters: [{ hanzi: "鸟", pinyin: "niǎo", meaning: "Bird" }],
      example: {
        hanzi: "天上有一只鸟在飞。",
        pinyin: "Tiānshàng yǒu yī zhī niǎo zài fēi.",
        english: "A bird is flying in the sky.",
        bangla: "আকাশে একটি পাখি উড়ছে।",
      },
      similar: [{ hanzi: "飞禽", pinyin: "fēiqín", english: "Flying bird" }],
    },
  ],
};
