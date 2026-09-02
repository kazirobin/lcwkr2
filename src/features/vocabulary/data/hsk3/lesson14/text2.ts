// app/data/vocabulary/lesson14-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson14text2: VocabularyData = {
  hskLevel: 3,
  lesson: 14,
  text: 2,
  dialogue: {
    title: "Library Trip",
    lines: [
      {
        speaker: "Anni",
        hanzi: "今天下课早，你一会儿做什么？",
        pinyin: "Jīntiān xiàkè zǎo, nǐ yìhuǐr zuò shénme?",
        english: "Class finished early today, what are you doing in a little while?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我今天忙得很，要先去图书馆借书，然后再去游泳。",
        pinyin: "Wǒ jīntiān máng de hěn, yào xiān qù túshūguǎn jiè shū, ránhòu zài qù yóuyǒng.",
        english: "I'm very busy today; I have to go to the library to borrow books first, and then go swimming.",
      },
      {
        speaker: "Anni",
        hanzi: "咱们一起走吧，我想去图书馆看看中文报纸。",
        pinyin: "Zánmen yìqǐ zǒu ba, wǒ xiǎng qù túshūguǎn kànkan Zhōngwén bàozhǐ.",
        english: "Let's go together, I want to go to the library to check out some Chinese newspapers.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "等等，我的校园卡不见了，没有卡进不去图书馆。",
        pinyin: "Děngděng, wǒ de xiàoyuánkǎ bú jiàn le, méiyǒu kǎ jìn bú qù túshūguǎn.",
        english: "Wait a minute, my campus card is missing; without the card I can't enter the library.",
      },
      {
        speaker: "Anni",
        hanzi: "你想想上一次用是什么时候？",
        pinyin: "Nǐ xiǎngxiang shàng yí cì yòng shì shénme shíhou?",
        english: "Think about when was the last time you used it?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我忘了，可能被我放在家里了。",
        pinyin: "Wǒ wàng le, kěnéng bèi wǒ fàng zài jiālǐ le.",
        english: "I forgot, it might have been left at home by me.",
      },
      {
        speaker: "Anni",
        hanzi: "进不去图书馆也没关系，上网看看有没有电子书。",
        pinyin: "Jìn bú qù túshūguǎn yě méi guānxi, shàngwǎng kànkan yǒu méiyǒu diànzǐshū.",
        english: "It doesn't matter if you can't enter the library; go online and see if there are e-books.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "不行，我必须去，我还得帮李文还书呢。",
        pinyin: "Bù xíng, wǒ bìxū qù, wǒ hái děi bāng Lǐ Wén huán shū ne.",
        english: "No way, I must go; I also have to help Li Wen return a book.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "然后",
      pinyin: "ránhòu",
      english: "Then",
      bangla: "তারপর",
      characters: [
        { hanzi: "然", pinyin: "rán", meaning: "So" },
        { hanzi: "后", pinyin: "hòu", meaning: "After" },
      ],
      example: {
        hanzi: "先吃饭，然后去看电影。",
        pinyin: "Xiān chīfàn, ránhòu qù kàn diànyǐng.",
        english: "Eat first, then go watch a movie.",
        bangla: "আগে খাও, তারপর সিনেমা দেখতে যাও।",
      },
      similar: [{ hanzi: "然后", pinyin: "ránhòu", english: "Afterwards" }],
    },
    {
      hanzi: "报纸",
      pinyin: "bàozhǐ",
      english: "Newspaper",
      bangla: "খবরের কাগজ",
      characters: [
        { hanzi: "报", pinyin: "bào", meaning: "Report" },
        { hanzi: "纸", pinyin: "zhǐ", meaning: "Paper" },
      ],
      example: {
        hanzi: "我看报纸。",
        pinyin: "Wǒ kàn bàozhǐ.",
        english: "I read the newspaper.",
        bangla: "আমি খবরের কাগজ পড়ি।",
      },
      similar: [{ hanzi: "报纸", pinyin: "bàozhǐ", english: "Newspaper" }],
    },
    {
      hanzi: "忘记",
      pinyin: "wàngjì",
      english: "Forget",
      bangla: "ভুলে যাওয়া",
      characters: [
        { hanzi: "忘", pinyin: "wàng", meaning: "Forget" },
        { hanzi: "记", pinyin: "jì", meaning: "Remember" },
      ],
      example: {
        hanzi: "我忘记带钥匙了。",
        pinyin: "Wǒ wàngjì dài yàoshi le.",
        english: "I forgot to bring the keys.",
        bangla: "আমি চাবি আনতে ভুলে গেছি।",
      },
      similar: [{ hanzi: "忘", pinyin: "wàng", english: "Forget" }],
    },
    {
      hanzi: "电子书",
      pinyin: "diànzǐshū",
      english: "E-book",
      bangla: "ই-বুক",
      characters: [
        { hanzi: "电", pinyin: "diàn", meaning: "Electric" },
        { hanzi: "子", pinyin: "zǐ", meaning: "Child" },
        { hanzi: "书", pinyin: "shū", meaning: "Book" },
      ],
      example: {
        hanzi: "我看电子书。",
        pinyin: "Wǒ kàn diànzǐshū.",
        english: "I read e-books.",
        bangla: "আমি ই-বুক পড়ি।",
      },
      similar: [{ hanzi: "电子书", pinyin: "diànzǐshū", english: "E-book" }],
    },
  ],
};