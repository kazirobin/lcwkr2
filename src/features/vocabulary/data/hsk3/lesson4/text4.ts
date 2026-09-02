// app/data/vocabulary/lesson4-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson4text4: VocabularyData = {
  hskLevel: 3,
  lesson: 4,
  text: 4,
  dialogue: {
    title: "Diary Entry - First Day",
    lines: [
      {
        speaker: "Wang Yifei",
        hanzi: "今天是我们旅游的第一天。我们很早就起床去机场了，没想到飞机晚点了。",
        pinyin: "Jīntiān shì wǒmen lǚyóu de dì-yī tiān. Wǒmen hěn zǎo jiù qǐchuáng qù jīchǎng le, méi xiǎngdào fēijī wǎndiǎn le.",
        english: "Today is the first day of our trip. We got up very early to go to the airport, but unexpectedly the flight was delayed.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "我们到的时候，天已经黑了，但是司机小李一直在机场等我们，一点儿也没着急。",
        pinyin: "Wǒmen dào de shíhou, tiān yǐjīng hēi le, dànshì sījī Xiǎo Lǐ yìzhí zài jīchǎng děng wǒmen, yìdiǎnr yě méi zhāojí.",
        english: "When we arrived, it was already dark, but the driver Xiao Li had been waiting for us at the airport all along and wasn't impatient at all.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "他特别热情，路上给我们介绍了许多东西，还准备了水果。",
        pinyin: "Tā tèbié rèqíng, lùshang gěi wǒmen jièshào le xǔduō dōngxi, hái zhǔnbèi le shuǐguǒ.",
        english: "He was extremely warm and friendly, introduced a lot of things to us along the way, and even prepared fruits.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "宾馆的房间跟我想的一样漂亮，又大又干净，我非常满意。",
        pinyin: "Bīnguǎn de fángjiān gēn wǒ xiǎng de yíyàng piàoliang, yòu dà yòu gānjìng, wǒ fēicháng mǎnyì.",
        english: "The hotel room was as beautiful as I had imagined, both large and clean, and I am very satisfied.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "一直",
      pinyin: "yìzhí",
      english: "All along/Continuously",
      bangla: "সবসময়/একটানা",
      characters: [
        { hanzi: "一", pinyin: "yī", meaning: "One" },
        { hanzi: "直", pinyin: "zhí", meaning: "Straight" },
      ],
      example: {
        hanzi: "我一直等你。",
        pinyin: "Wǒ yìzhí děng nǐ.",
        english: "I've been waiting for you all along.",
        bangla: "আমি সবসময় তোমার জন্য অপেক্ষা করছি।",
      },
      similar: [{ hanzi: "一直", pinyin: "yìzhí", english: "Always/Continuously" }],
    },
    {
      hanzi: "干净",
      pinyin: "gānjìng",
      english: "Clean",
      bangla: "পরিষ্কার",
      characters: [
        { hanzi: "干", pinyin: "gān", meaning: "Dry" },
        { hanzi: "净", pinyin: "jìng", meaning: "Clean" },
      ],
      example: {
        hanzi: "房间很干净。",
        pinyin: "Fángjiān hěn gānjìng.",
        english: "The room is very clean.",
        bangla: "রুমটি খুব পরিষ্কার।",
      },
      similar: [{ hanzi: "清洁", pinyin: "qīngjié", english: "Clean" }],
    },
    {
      hanzi: "满意",
      pinyin: "mǎnyì",
      english: "Be satisfied",
      bangla: "সন্তুষ্ট",
      characters: [
        { hanzi: "满", pinyin: "mǎn", meaning: "Full" },
        { hanzi: "意", pinyin: "yì", meaning: "Meaning" },
      ],
      example: {
        hanzi: "我对这个结果很满意。",
        pinyin: "Wǒ duì zhège jiéguǒ hěn mǎnyì.",
        english: "I am very satisfied with this result.",
        bangla: "আমি এই ফলাফলে খুব সন্তুষ্ট।",
      },
      similar: [{ hanzi: "满意", pinyin: "mǎnyì", english: "Satisfied" }],
    },
  ],
};