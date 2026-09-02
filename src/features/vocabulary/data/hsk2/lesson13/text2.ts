// app/data/vocabulary/lesson13-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson13text2: VocabularyData = {
  hskLevel: 2,
  lesson: 13,
  text: 2,
  dialogue: {
    title: "Learning Chinese Characters",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "王老师，今天的词比昨天多了十个。",
        pinyin: "Wáng lǎoshī, jīntiān de cí bǐ zuótiān duō le shí ge.",
        english: "Teacher Wang, there are ten more words today than yesterday.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "是啊！你们都学会了吗？",
        pinyin: "Shì a! Nǐmen dōu xuéhuì le ma?",
        english: "Yes! Have you all learned them?",
      },
      {
        speaker: "Anni",
        hanzi: "学会了，没有问题。",
        pinyin: "Xuéhuì le, méiyǒu wèntí.",
        english: "Yes, we have. No problem.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "好。现在我来说，你们在本子上面写。",
        pinyin: "Hǎo. Xiànzài wǒ lái shuō, nǐmen zài běnzi shàngmiàn xiě.",
        english:
          "Okay. Now I will say them, and you write them in your notebooks.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "同学们，'洗手间'的'间'字写错了，它的里面是'日'，不是'口'。",
        pinyin:
          "Tóngxuémen, 'xǐshǒujiān' de 'jiān' zì xiěcuò le. Tā de lǐmiàn shì 'rì', bú shì 'kǒu'.",
        english:
          "Students, you wrote the character '间' in '洗手间' incorrectly. The inside is '日', not '口'.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "'日'比'口'多一笔，写'口'就是'问题'的'问'了。",
        pinyin:
          "'Rì' bǐ 'kǒu' duō yì bǐ, xiě 'kǒu' jiù shì 'wèntí' de 'wèn' le.",
        english:
          "'日' has one more stroke than '口'. If you write '口', it becomes the '问' in '问题'.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "没错，你说得很对。",
        pinyin: "Méi cuò, nǐ shuō de hěn duì.",
        english: "That's right. What you said is correct.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "上面",
      pinyin: "shàngmiàn",
      english: "On/Above",
      bangla: "উপরে",
      characters: [
        { hanzi: "上", pinyin: "shàng", meaning: "Above" },
        { hanzi: "面", pinyin: "miàn", meaning: "Side" },
      ],
      example: {
        hanzi: "桌子上面有一本书。",
        pinyin: "Zhuōzi shàngmiàn yǒu yī běn shū.",
        english: "There is a book on the table.",
        bangla: "টেবিলের উপরে একটি বই আছে।",
      },
      similar: [{ hanzi: "上边", pinyin: "shàngbian", english: "Above" }],
    },
    {
      hanzi: "洗手间",
      pinyin: "xǐshǒujiān",
      english: "Washroom/Restroom",
      bangla: "ওয়াশরুম",
      characters: [
        { hanzi: "洗", pinyin: "xǐ", meaning: "Wash" },
        { hanzi: "手", pinyin: "shǒu", meaning: "Hand" },
        { hanzi: "间", pinyin: "jiān", meaning: "Room" },
      ],
      example: {
        hanzi: "请问，洗手间在哪里？",
        pinyin: "Qǐngwèn, xǐshǒujiān zài nǎlǐ?",
        english: "Excuse me, where is the restroom?",
        bangla: "ওয়াশরুম কোথায়?",
      },
      similar: [{ hanzi: "厕所", pinyin: "cèsuǒ", english: "Toilet" }],
    },
    {
      hanzi: "里面",
      pinyin: "lǐmiàn",
      english: "Inside",
      bangla: "ভেতরে",
      characters: [
        { hanzi: "里", pinyin: "lǐ", meaning: "Inside" },
        { hanzi: "面", pinyin: "miàn", meaning: "Side" },
      ],
      example: {
        hanzi: "房间里面没有人。",
        pinyin: "Fángjiān lǐmiàn méiyǒu rén.",
        english: "There is no one inside the room.",
        bangla: "ঘরের ভেতরে কেউ নেই।",
      },
      similar: [{ hanzi: "里边", pinyin: "lǐbian", english: "Inside" }],
    },
    {
      hanzi: "笔",
      pinyin: "bǐ",
      english: "Pen",
      bangla: "কলম",
      characters: [
        { hanzi: "⺮", pinyin: "zhú", meaning: "Bamboo" },
        { hanzi: "毛", pinyin: "máo", meaning: "Hair/Feather" },
      ],
      example: {
        hanzi: "我可以用一下你的笔吗？",
        pinyin: "Wǒ kěyǐ yòng yīxià nǐ de bǐ ma?",
        english: "Can I use your pen?",
        bangla: "আমি কি তোমার কলমটি একটু ব্যবহার করতে পারি?",
      },
      similar: [{ hanzi: "铅笔", pinyin: "qiānbǐ", english: "Pencil" }],
    },
  ],
};
