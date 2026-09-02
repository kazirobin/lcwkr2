// app/data/vocabulary/lesson6-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson6text2: VocabularyData = {
  hskLevel: 2,
  lesson: 6,
  text: 2,
  dialogue: {
    title: "Birthday Gifts",
    lines: [
      {
        speaker: "Liu Ming",
        hanzi: "小雪，生日快乐！",
        pinyin: "Xiǎoxuě, shēngrì kuàilè!",
        english: "Xiaoxue, happy birthday!",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "姐姐，生日快乐！",
        pinyin: "Jiějie, shēngrì kuàilè!",
        english: "Sister, happy birthday!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "小雪，这是爸爸、妈妈送你的礼物。",
        pinyin: "Xiǎoxuě, zhè shì bàba, māma sòng nǐ de lǐwù.",
        english: "Xiaoxue, this is the gift from Dad and Mom for you.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "你打开看看喜不喜欢。",
        pinyin: "Nǐ dǎkāi kànkan xǐhuan bu xǐhuan.",
        english: "Open it and see if you like it.",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "画笔！我很喜欢！",
        pinyin: "Huàbǐ! Wǒ hěn xǐhuan!",
        english: "Drawing brushes! I really like them!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "那你想画点儿什么？",
        pinyin: "Nà nǐ xiǎng huà diǎnr shénme?",
        english: "Then what would you like to draw?",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "画我们的家！有爸爸、妈妈、弟弟，还有黑色的狗、白色的猫什么的。",
        pinyin:
          "Huà wǒmen de jiā! Yǒu bàba, māma, dìdi, hái yǒu hēisè de gǒu, báisè de māo shénmede.",
        english:
          "I'll draw our family! There will be Dad, Mom, my little brother, a black dog, a white cat, and so on.",
      },
      {
        speaker: "Liu Xiaoming",
        hanzi: "那我要画一个穿白色衣服的姐姐。",
        pinyin: "Nà wǒ yào huà yí ge chuān báisè yīfu de jiějie.",
        english: "Then I'll draw an older sister wearing white clothes.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "快乐",
      pinyin: "kuàilè",
      english: "Happy",
      bangla: "খুশি/আনন্দিত",
      characters: [
        { hanzi: "快", pinyin: "kuài", meaning: "Happy/Fast" },
        { hanzi: "乐", pinyin: "lè", meaning: "Happy/Music" },
      ],
      example: {
        hanzi: "祝你生日快乐！",
        pinyin: "Zhù nǐ shēngrì kuàilè!",
        english: "Happy birthday to you!",
        bangla: "তোমার জন্মদিনের শুভেচ্ছা!",
      },
      similar: [{ hanzi: "高兴", pinyin: "gāoxìng", english: "Happy" }],
    },
    {
      hanzi: "打开",
      pinyin: "dǎkāi",
      english: "Open",
      bangla: "খোলা",
      characters: [
        { hanzi: "打", pinyin: "dǎ", meaning: "Hit/Do" },
        { hanzi: "开", pinyin: "kāi", meaning: "Open" },
      ],
      example: {
        hanzi: "请打开书。",
        pinyin: "Qǐng dǎkāi shū.",
        english: "Please open the book.",
        bangla: "অনুগ্রহ করে বইটি খুলুন।",
      },
      similar: [{ hanzi: "开启", pinyin: "kāiqǐ", english: "Open" }],
    },
  ],
};
