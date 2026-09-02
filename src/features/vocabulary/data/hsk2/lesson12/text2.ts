// app/data/vocabulary/lesson12-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson12text2: VocabularyData = {
  hskLevel: 2,
  lesson: 12,
  text: 2,
  dialogue: {
    title: "Snowy Weather",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "喂，一飞，听家月说你那边下雪了，下得大不大？",
        pinyin:
          "Wéi, Yīfēi, tīng Jiāyuè shuō nǐ nàbian xià xuě le, xià de dà bu dà?",
        english:
          "Hello, Yifei. I heard Jiayue say that it is snowing there. Is it snowing heavily?",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "今天不大，昨天比今天下得大。",
        pinyin: "Jīntiān bú dà, zuótiān bǐ jīntiān xià de dà.",
        english:
          "Not heavily today. It snowed more heavily yesterday than today.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "天气不好，你去外面的时候多穿点儿衣服。",
        pinyin: "Tiānqì bù hǎo, nǐ qù wàimiàn de shíhou duō chuān diǎnr yīfu.",
        english: "The weather is bad. Wear more clothes when you go outside.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "这几天我在网上上课，没出去过。",
        pinyin: "Zhè jǐ tiān wǒ zài wǎngshàng shàngkè, méi chūqù guo.",
        english:
          "These days I've been taking classes online, so I haven't gone outside.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "那就好，有事记得给我打电话。",
        pinyin: "Nà jiù hǎo, yǒu shì jìde gěi wǒ dǎ diànhuà.",
        english: "That's good. If anything happens, remember to call me.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "好的。现在不下雪了，我出去买点儿吃的。",
        pinyin: "Hǎo de. Xiànzài bú xià xuě le, wǒ chūqù mǎi diǎnr chī de.",
        english:
          "Okay. It's not snowing now, so I'm going out to buy something to eat.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "一次多买点儿，明天下雪什么的就少出去吧。",
        pinyin:
          "Yí cì duō mǎi diǎnr, míngtiān xià xuě shénmede jiù shǎo chūqù ba.",
        english:
          "Buy a little more at once. If it snows tomorrow or something, try to go outside less.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "外面",
      pinyin: "wàimiàn",
      english: "Outside",
      bangla: "বাইরে",
      characters: [
        { hanzi: "外", pinyin: "wài", meaning: "Outside" },
        { hanzi: "面", pinyin: "miàn", meaning: "Side" },
      ],
      example: {
        hanzi: "外面在下雪。",
        pinyin: "Wàimiàn zài xiàxuě.",
        english: "It is snowing outside.",
        bangla: "বাইরে তুষার পড়ছে।",
      },
      similar: [{ hanzi: "外头", pinyin: "wàitou", english: "Outside" }],
    },
    {
      hanzi: "阴",
      pinyin: "yīn",
      english: "Cloudy/Overcast",
      bangla: "মেঘলা",
      characters: [{ hanzi: "阴", pinyin: "yīn", meaning: "Cloudy" }],
      example: {
        hanzi: "今天是阴天。",
        pinyin: "Jīntiān shì yīntiān.",
        english: "Today is a cloudy day.",
        bangla: "আজ মেঘলা দিন।",
      },
      similar: [{ hanzi: "多云", pinyin: "duōyún", english: "Cloudy" }],
    },
  ],
};
