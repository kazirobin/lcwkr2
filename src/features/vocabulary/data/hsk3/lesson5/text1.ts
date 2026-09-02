// app/data/vocabulary/lesson5-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson5text1: VocabularyData = {
  hskLevel: 3,
  lesson: 5,
  text: 1,
  dialogue: {
    title: "Finally Sunny Weather",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "这个星期总是阴天，今天终于晴了。",
        pinyin: "Zhège xīngqī zǒngshì yīntiān, jīntiān zhōngyú qíng le.",
        english: "It was always cloudy this week, but today it has finally cleared up.",
      },
      {
        speaker: "Li Wen",
        hanzi: "现在天气好得很！我们去爬山怎么样？",
        pinyin: "Xiànzài tiānqì hǎo de hěn! Wǒmen qù pá shān zěnmeyàng?",
        english: "The weather is great right now! How about we go mountain climbing?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "好啊！又能锻炼身体，又能照好看的照片。",
        pinyin: "Hǎo a! Yòu néng duànliàn shēntǐ, yòu néng zhào hǎokàn de zhàopiàn.",
        english: "Great! We can both exercise and take nice photos.",
      },
      {
        speaker: "Li Wen",
        hanzi: "那我带点儿水和吃的，咱们现在就去？",
        pinyin: "Nà wǒ dài diǎnr shuǐ hé chī de, zánmen xiànzài jiù qù?",
        english: "Then I'll bring some water and food, shall we go right now?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我回去穿上运动鞋，拿上大衣。要不要叫一雪姐一起去？",
        pinyin: "Wǒ huíqù chuān shang yùndòngxié, ná shang dàyī. Yào bú yào jiào Yīxuě jiě yìqǐ qù?",
        english: "I'll go back to put on sports shoes and grab an overcoat. Should we invite Sister Yixue to go together?",
      },
      {
        speaker: "Li Wen",
        hanzi: "好主意。给她打个电话吧。",
        pinyin: "Hǎo zhǔyi. Gěi tā dǎ gè diànhuà ba.",
        english: "Good idea. Give her a call.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "总是",
      pinyin: "zǒngshì",
      english: "Always",
      bangla: "সর্বদা",
      characters: [
        { hanzi: "总", pinyin: "zǒng", meaning: "Always/Total" },
        { hanzi: "是", pinyin: "shì", meaning: "Is" },
      ],
      example: {
        hanzi: "他总是迟到。",
        pinyin: "Tā zǒngshì chídào.",
        english: "He is always late.",
        bangla: "সে সবসময় দেরি করে।",
      },
      similar: [{ hanzi: "一直", pinyin: "yìzhí", english: "Always/Continuously" }],
    },
    {
      hanzi: "终于",
      pinyin: "zhōngyú",
      english: "Finally",
      bangla: "অবশেষে",
      characters: [
        { hanzi: "终", pinyin: "zhōng", meaning: "End" },
        { hanzi: "于", pinyin: "yú", meaning: "At" },
      ],
      example: {
        hanzi: "终于结束了。",
        pinyin: "Zhōngyú jiéshù le.",
        english: "It's finally over.",
        bangla: "অবশেষে শেষ হলো।",
      },
      similar: [{ hanzi: "到底", pinyin: "dàodǐ", english: "Finally/After all" }],
    },
    {
      hanzi: "爬",
      pinyin: "pá",
      english: "Climb",
      bangla: "চড়া",
      characters: [
        { hanzi: "爪", pinyin: "zhuǎ", meaning: "Claw" },
        { hanzi: "巴", pinyin: "bā", meaning: "Bar" },
      ],
      example: {
        hanzi: "我们爬山去。",
        pinyin: "Wǒmen pá shān qù.",
        english: "We're going mountain climbing.",
        bangla: "আমরা পাহাড়ে চড়তে যাচ্ছি।",
      },
      similar: [{ hanzi: "攀登", pinyin: "pāndēng", english: "Climb/Scale" }],
    },
    {
      hanzi: "山",
      pinyin: "shān",
      english: "Mountain",
      bangla: "পাহাড়",
      characters: [
        { hanzi: "山", pinyin: "shān", meaning: "Mountain" },
      ],
      example: {
        hanzi: "这座山很高。",
        pinyin: "Zhè zuò shān hěn gāo.",
        english: "This mountain is very high.",
        bangla: "এই পাহাড়টি খুব উঁচু।",
      },
      similar: [{ hanzi: "山峰", pinyin: "shānfēng", english: "Mountain peak" }],
    },
    {
      hanzi: "锻炼",
      pinyin: "duànliàn",
      english: "Exercise",
      bangla: "ব্যায়াম করা",
      characters: [
        { hanzi: "锻", pinyin: "duàn", meaning: "Forge" },
        { hanzi: "炼", pinyin: "liàn", meaning: "Refine" },
      ],
      example: {
        hanzi: "我每天锻炼身体。",
        pinyin: "Wǒ měitiān duànliàn shēntǐ.",
        english: "I exercise every day.",
        bangla: "আমি প্রতিদিন ব্যায়াম করি।",
      },
      similar: [{ hanzi: "运动", pinyin: "yùndòng", english: "Exercise/Sports" }],
    },
    {
      hanzi: "照",
      pinyin: "zhào",
      english: "Take (a picture)",
      bangla: "ছবি তোলা",
      characters: [
        { hanzi: "日", pinyin: "rì", meaning: "Sun" },
        { hanzi: "召", pinyin: "zhào", meaning: "Call" },
      ],
      example: {
        hanzi: "我来照一张相。",
        pinyin: "Wǒ lái zhào yì zhāng xiàng.",
        english: "Let me take a picture.",
        bangla: "আমি একটা ছবি তুলি।",
      },
      similar: [{ hanzi: "拍", pinyin: "pāi", english: "Take (photo)" }],
    },
    {
      hanzi: "鞋",
      pinyin: "xié",
      english: "Shoe",
      bangla: "জুতো",
      characters: [
        { hanzi: "革", pinyin: "gé", meaning: "Leather" },
        { hanzi: "圭", pinyin: "guī", meaning: "Jade" },
      ],
      example: {
        hanzi: "这双鞋很舒服。",
        pinyin: "Zhè shuāng xié hěn shūfu.",
        english: "These shoes are very comfortable.",
        bangla: "এই জুতো খুব আরামদায়ক।",
      },
      similar: [{ hanzi: "靴子", pinyin: "xuēzi", english: "Boots" }],
    },
    {
      hanzi: "大衣",
      pinyin: "dàyī",
      english: "Overcoat",
      bangla: "ওভারকোট",
      characters: [
        { hanzi: "大", pinyin: "dà", meaning: "Big" },
        { hanzi: "衣", pinyin: "yī", meaning: "Clothes" },
      ],
      example: {
        hanzi: "天冷了大衣。",
        pinyin: "Tiān lěng le dàyī.",
        english: "It's cold, wear an overcoat.",
        bangla: "ঠান্ডা পড়েছে, ওভারকোট পরো।",
      },
      similar: [{ hanzi: "外套", pinyin: "wàitào", english: "Jacket/Coat" }],
    },
  ],
};