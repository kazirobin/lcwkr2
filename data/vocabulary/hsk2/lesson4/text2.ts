// app/data/vocabulary/lesson4-text2.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson4text2: VocabularyData = {
  hskLevel: 2,
  lesson: 4,
  text: 2,
  dialogue: {
    title: "Choosing Pants",
    lines: [
      {
        speaker: "Liu Xiaoxue",
        hanzi: "妈妈，我想买这条白色的裤子。",
        pinyin: "Māma, wǒ xiǎng mǎi zhè tiáo báisè de kùzi.",
        english: "Mom, I want to buy these white pants.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你有很多白色的衣服，为什么还买白色的？",
        pinyin: "Nǐ yǒu hěn duō báisè de yīfu, wèishénme hái mǎi báisè de?",
        english:
          "You have a lot of white clothes. Why are you still buying white ones?",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "因为我喜欢白色啊！",
        pinyin: "Yīnwèi wǒ xǐhuan báisè a!",
        english: "Because I like white!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "我觉得这条白色的不太好看，你试试那条红色的吧。",
        pinyin:
          "Wǒ juéde zhè tiáo báisè de bú tài hǎokàn, nǐ shìshi nà tiáo hóngsè de ba.",
        english:
          "I don't think these white ones look very good. Try that red pair.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "我没穿过红色的，红色的好看吗？",
        pinyin: "Wǒ méi chuānguo hóngsè de, hóngsè de hǎokàn ma?",
        english: "I've never worn red ones. Do the red ones look good?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "就是因为没穿过，所以要试试啊！",
        pinyin: "Jiùshì yīnwèi méi chuānguo, suǒyǐ yào shìshi a!",
        english: "Exactly because you've never worn them, you should try them!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "白色",
      pinyin: "báisè",
      english: "White",
      bangla: "সাদা রঙ",
      characters: [
        { hanzi: "白", pinyin: "bái", meaning: "White" },
        { hanzi: "色", pinyin: "sè", meaning: "Color" },
      ],
      example: {
        hanzi: "我喜欢白色的衣服。",
        pinyin: "Wǒ xǐhuān báisè de yīfú.",
        english: "I like white clothes.",
        bangla: "আমি সাদা রঙের কাপড় পছন্দ করি।",
      },
      similar: [{ hanzi: "雪白", pinyin: "xuěbái", english: "Snow white" }],
    },
    {
      hanzi: "因为",
      pinyin: "yīnwèi",
      english: "Because",
      bangla: "কারণ",
      characters: [
        { hanzi: "因", pinyin: "yīn", meaning: "Reason" },
        { hanzi: "为", pinyin: "wèi", meaning: "For/Because" },
      ],
      example: {
        hanzi: "因为下雨，我们没去公园。",
        pinyin: "Yīnwèi xià yǔ, wǒmen méi qù gōngyuán.",
        english: "Because it rained, we didn't go to the park.",
        bangla: "বৃষ্টি হওয়ায়, আমরা পার্কে যাইনি।",
      },
      similar: [{ hanzi: "由于", pinyin: "yóuyú", english: "Due to" }],
    },
    {
      hanzi: "试",
      pinyin: "shì",
      english: "Try/Test",
      bangla: "চেষ্টা করা/পরখ করা",
      characters: [{ hanzi: "试", pinyin: "shì", meaning: "Try/Test" }],
      example: {
        hanzi: "我可以试一下这件衣服吗？",
        pinyin: "Wǒ kěyǐ shì yīxià zhè jiàn yīfú ma?",
        english: "Can I try on this clothing?",
        bangla: "আমি কি এই কাপড়টি একটু পরতে পারি?",
      },
      similar: [{ hanzi: "尝试", pinyin: "chángshì", english: "Attempt" }],
    },
    {
      hanzi: "红色",
      pinyin: "hóngsè",
      english: "Red",
      bangla: "লাল রঙ",
      characters: [
        { hanzi: "红", pinyin: "hóng", meaning: "Red" },
        { hanzi: "色", pinyin: "sè", meaning: "Color" },
      ],
      example: {
        hanzi: "这朵红色的花很漂亮。",
        pinyin: "Zhè duǒ hóngsè de huā hěn piàoliang.",
        english: "This red flower is very beautiful.",
        bangla: "এই লাল ফুলটি খুব সুন্দর।",
      },
      similar: [{ hanzi: "火红", pinyin: "huǒhóng", english: "Fiery red" }],
    },
    {
      hanzi: "所以",
      pinyin: "suǒyǐ",
      english: "So/Therefore",
      bangla: "তাই/অতএব",
      characters: [
        { hanzi: "所", pinyin: "suǒ", meaning: "That/Place" },
        { hanzi: "以", pinyin: "yǐ", meaning: "By/With" },
      ],
      example: {
        hanzi: "生病了，所以没来上课。",
        pinyin: "Shēngbìng le, suǒyǐ méi lái shàngkè.",
        english: "Sick, so didn't come to class.",
        bangla: "অসুস্থ ছিলাম, তাই ক্লাসে আসিনি।",
      },
      similar: [{ hanzi: "因此", pinyin: "yīncǐ", english: "Therefore" }],
    },
  ],
};
