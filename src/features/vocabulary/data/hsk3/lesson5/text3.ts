// app/data/vocabulary/lesson5-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson5text3: VocabularyData = {
  hskLevel: 3,
  lesson: 5,
  text: 3,
  dialogue: {
    title: "Taking Photos on the Mountain",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "家月，这里挺漂亮的，咱们在这里拍照吧。",
        pinyin: "Jiāyuè, zhèlǐ tǐng piàoliang de, zánmen zài zhèlǐ pāizhào ba.",
        english: "Jiayue, it's pretty here, let's take pictures here.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "这边没有太阳，咱们去那边吧。",
        pinyin: "Zhèbiān méiyǒu tàiyáng, zánmen qù nàbiān ba.",
        english: "There is no sun here, let's go over there.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "好。你觉得我站在这些树中间怎么样？",
        pinyin: "Hǎo. Nǐ juéde wǒ zhàn zài zhèxiē shù zhōngjiān zěnmeyàng?",
        english: "Okay. What do you think if I stand in the middle of these trees?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "挺好的。等一下，后边走过去两个人。",
        pinyin: "Tǐng hǎo de. Děng yíxià, hòubiān zǒu guòqù liǎng gè rén.",
        english: "Very good. Wait a moment, two people are walking past behind you.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "我准备好了，你照的时候告诉我。",
        pinyin: "Wǒ zhǔnbèi hǎo le, nǐ zhào de shíhou gàosù wǒ.",
        english: "I'm ready, tell me when you take the shot.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "你不用看着我，想干什么都可以。",
        pinyin: "Nǐ búyòng kànzhe wǒ, xiǎng gàn shénme dōu kěyǐ.",
        english: "You don't need to look at me, you can do whatever you want.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "树上飞来了几只鸟，我就看它们吧。",
        pinyin: "Shù shang fēi lái le jǐ zhī niǎo, wǒ jiù kàn tāmen ba.",
        english: "A few birds flew onto the tree, I'll just look at them.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "啊，手机没电了。",
        pinyin: "A, shǒujī méi diàn le.",
        english: "Ah, my phone ran out of battery.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "太阳",
      pinyin: "tàiyáng",
      english: "Sun",
      bangla: "সূর্য",
      characters: [
        { hanzi: "太", pinyin: "tài", meaning: "Great" },
        { hanzi: "阳", pinyin: "yáng", meaning: "Sun" },
      ],
      example: {
        hanzi: "太阳出来了。",
        pinyin: "Tàiyáng chūlái le.",
        english: "The sun has come out.",
        bangla: "সূর্য বেরিয়েছে।",
      },
      similar: [{ hanzi: "阳光", pinyin: "yángguāng", english: "Sunlight" }],
    },
    {
      hanzi: "树",
      pinyin: "shù",
      english: "Tree",
      bangla: "গাছ",
      characters: [
        { hanzi: "木", pinyin: "mù", meaning: "Wood" },
        { hanzi: "对", pinyin: "duì", meaning: "Pair" },
      ],
      example: {
        hanzi: "这棵树很高。",
        pinyin: "Zhè kē shù hěn gāo.",
        english: "This tree is very tall.",
        bangla: "এই গাছটি খুব লম্বা।",
      },
      similar: [{ hanzi: "树木", pinyin: "shùmù", english: "Trees" }],
    },
    {
      hanzi: "干",
      pinyin: "gàn",
      english: "Do",
      bangla: "করা",
      characters: [
        { hanzi: "干", pinyin: "gàn", meaning: "Do" },
      ],
      example: {
        hanzi: "你想干什么？",
        pinyin: "Nǐ xiǎng gàn shénme?",
        english: "What do you want to do?",
        bangla: "তুমি কী করতে চাও?",
      },
      similar: [{ hanzi: "做", pinyin: "zuò", english: "Do/Make" }],
    },
    {
      hanzi: "电",
      pinyin: "diàn",
      english: "Electricity",
      bangla: "বিদ্যুৎ",
      characters: [
        { hanzi: "电", pinyin: "diàn", meaning: "Electricity" },
      ],
      example: {
        hanzi: "手机没电了。",
        pinyin: "Shǒujī méi diàn le.",
        english: "The phone is out of battery.",
        bangla: "ফোনে চার্জ নেই।",
      },
      similar: [{ hanzi: "电池", pinyin: "diànchí", english: "Battery" }],
    },
  ],
};