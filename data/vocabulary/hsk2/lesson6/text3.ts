// app/data/vocabulary/lesson6-text3.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson6text3: VocabularyData = {
  hskLevel: 2,
  lesson: 6,
  text: 3,
  dialogue: {
    title: "Birthday Food and Fun",
    lines: [
      {
        speaker: "Liu Xiaoming",
        hanzi: "小雪，看看今天有什么好吃的。",
        pinyin: "Xiǎoxuě, kànkan jīntiān yǒu shénme hǎochī de.",
        english: "Xiaoxue, take a look at what delicious food we have today.",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "长长的面条儿，大大的蛋糕。",
        pinyin: "Chángcháng de miàntiáor, dàdà de dàngāo.",
        english: "Long noodles and a big cake.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "你看，还有鱼啊肉啊什么的，都是你喜欢吃的。",
        pinyin:
          "Nǐ kàn, hái yǒu yú a ròu a shénmede, dōu shì nǐ xǐhuan chī de.",
        english:
          "Look, there's also fish, meat, and other things. They're all foods you like to eat.",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "谢谢爸爸、妈妈！",
        pinyin: "Xièxie bàba, māma!",
        english: "Thank you, Dad and Mom!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "快去叫弟弟过来吃饭吧，吃完饭我们还要出去玩呢。",
        pinyin:
          "Kuài qù jiào dìdi guòlái chī fàn ba, chīwán fàn wǒmen hái yào chūqù wán ne.",
        english:
          "Go quickly and call your little brother to come eat. After dinner, we're still going out to have fun.",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "过生日真好啊！",
        pinyin: "Guò shēngrì zhēn hǎo a!",
        english: "Having a birthday is really wonderful!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "是的，过生日就要吃好吃的，还要高高兴兴地玩。",
        pinyin:
          "Shì de, guò shēngrì jiù yào chī hǎochī de, hái yào gāogāoxìngxìng de wán.",
        english:
          "That's right. On your birthday, you should eat delicious food and have lots of fun happily.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "长",
      pinyin: "cháng",
      english: "Long",
      bangla: "লম্বা",
      characters: [{ hanzi: "长", pinyin: "cháng", meaning: "Long/Length" }],
      example: {
        hanzi: "这条路很长。",
        pinyin: "Zhè tiáo lù hěn cháng.",
        english: "This road is very long.",
        bangla: "এই রাস্তাটি খুব লম্বা।",
      },
      similar: [{ hanzi: "久", pinyin: "jiǔ", english: "Long (time)" }],
    },
    {
      hanzi: "鱼",
      pinyin: "yú",
      english: "Fish",
      bangla: "মাছ",
      characters: [{ hanzi: "鱼", pinyin: "yú", meaning: "Fish" }],
      example: {
        hanzi: "水里有很多鱼。",
        pinyin: "Shuǐ lǐ yǒu hěn duō yú.",
        english: "There are many fish in the water.",
        bangla: "পানিতে অনেক মাছ আছে।",
      },
      similar: [{ hanzi: "海鲜", pinyin: "hǎixiān", english: "Seafood" }],
    },
    {
      hanzi: "肉",
      pinyin: "ròu",
      english: "Meat",
      bangla: "মাংস",
      characters: [{ hanzi: "肉", pinyin: "ròu", meaning: "Meat/Flesh" }],
      example: {
        hanzi: "我今天想吃肉。",
        pinyin: "Wǒ jīntiān xiǎng chī ròu.",
        english: "I want to eat meat today.",
        bangla: "আমি আজ মাংস খেতে চাই।",
      },
      similar: [{ hanzi: "荤", pinyin: "hūn", english: "Non-vegetarian food" }],
    },
    {
      hanzi: "过",
      pinyin: "guò",
      english: "Pass/Spend (time)",
      bangla: "কাটানো/অতিক্রম করা",
      characters: [
        { hanzi: "辶", pinyin: "chuò", meaning: "Walk/Movement" },
        { hanzi: "寸", pinyin: "cùn", meaning: "Inch/Rule" },
      ],
      example: {
        hanzi: "生日快乐！你想怎么过？",
        pinyin: "Shēngrì kuàilè! Nǐ xiǎng zěnme guò?",
        english: "Happy birthday! How do you want to spend it?",
        bangla: "জন্মদিনের শুভেচ্ছা! তুমি কীভাবে কাটাতে চাও?",
      },
      similar: [{ hanzi: "度", pinyin: "dù", english: "Spend/Pass (time)" }],
    },
    {
      hanzi: "地",
      pinyin: "de",
      english: "Adverbial particle",
      bangla: "ক্রিয়াবিশেষণ মার্কার",
      characters: [
        { hanzi: "土", pinyin: "tǔ", meaning: "Earth" },
        { hanzi: "也", pinyin: "yě", meaning: "Also" },
      ],
      example: {
        hanzi: "他高兴地笑了。",
        pinyin: "Tā gāoxìng de xiào le.",
        english: "He smiled happily.",
        bangla: "সে খুশি হয়ে হাসল।",
      },
      similar: [
        { hanzi: "的", pinyin: "de", english: "Adjective particle" },
        { hanzi: "得", pinyin: "de", english: "Complement particle" },
      ],
    },
  ],
};
