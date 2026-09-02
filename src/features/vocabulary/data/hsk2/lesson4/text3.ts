// app/data/vocabulary/lesson4-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson4text3: VocabularyData = {
  hskLevel: 2,
  lesson: 4,
  text: 3,
  dialogue: {
    title: "Choosing a New Schoolbag",
    lines: [
      {
        speaker: "Liu Xiaoxue",
        hanzi: "妈妈，我想买个新书包。",
        pinyin: "Māma, wǒ xiǎng mǎi ge xīn shūbāo.",
        english: "Mom, I want to buy a new schoolbag.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "好，那边卖书包，我们过去看看吧。",
        pinyin: "Hǎo, nàbiān mài shūbāo, wǒmen guòqù kànkan ba.",
        english: "Okay. They sell schoolbags over there. Let's go have a look.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "这么多漂亮的书包！",
        pinyin: "Zhème duō piàoliang de shūbāo!",
        english: "There are so many beautiful schoolbags!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你喜欢哪个颜色的？",
        pinyin: "Nǐ xǐhuan nǎge yánsè de?",
        english: "Which color do you like?",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "我想要那个绿色的。",
        pinyin: "Wǒ xiǎng yào nàge lǜsè de.",
        english: "I want that green one.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你已经有绿色的书包了，买个黑色的吧。",
        pinyin: "Nǐ yǐjīng yǒu lǜsè de shūbāo le, mǎi ge hēisè de ba.",
        english: "You already have a green schoolbag. Buy a black one.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "可是我觉得黑色不如绿色好看。",
        pinyin: "Kěshì wǒ juéde hēisè bùrú lǜsè hǎokàn.",
        english: "But I think black is not as beautiful as green.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "你看这个蓝色的怎么样？",
        pinyin: "Nǐ kàn zhège lánsè de zěnmeyàng?",
        english: "How about this blue one?",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "嗯...这个蓝色的比绿色的更漂亮！",
        pinyin: "Ēn... zhège lánsè de bǐ lǜsè de gèng piàoliang!",
        english:
          "Hmm... This blue one is even more beautiful than the green one!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "好吧，就买这个吧。",
        pinyin: "Hǎo ba, jiù mǎi zhège ba.",
        english: "Alright, let's buy this one then.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "书包",
      pinyin: "shūbāo",
      english: "Schoolbag",
      bangla: "স্কুলব্যাগ",
      characters: [
        { hanzi: "书", pinyin: "shū", meaning: "Book" },
        { hanzi: "包", pinyin: "bāo", meaning: "Bag" },
      ],
      example: {
        hanzi: "我的书包很重。",
        pinyin: "Wǒ de shūbāo hěn zhòng.",
        english: "My schoolbag is very heavy.",
        bangla: "আমার স্কুলব্যাগ খুব ভারী।",
      },
      similar: [{ hanzi: "背包", pinyin: "bēibāo", english: "Backpack" }],
    },
    {
      hanzi: "过去",
      pinyin: "guòqù",
      english: "Go over / Past",
      bangla: "পার হয়ে যাওয়া / অতীত",
      characters: [
        { hanzi: "过", pinyin: "guò", meaning: "Pass" },
        { hanzi: "去", pinyin: "qù", meaning: "Go" },
      ],
      example: {
        hanzi: "我们走过去吧。",
        pinyin: "Wǒmen zǒu guòqù ba.",
        english: "Let's walk over there.",
        bangla: "আমরা হেঁটে সেখানে যাই।",
      },
      similar: [{ hanzi: "以前", pinyin: "yǐqián", english: "Before/Past" }],
    },
    {
      hanzi: "绿色",
      pinyin: "lǜsè",
      english: "Green",
      bangla: "সবুজ রঙ",
      characters: [
        { hanzi: "绿", pinyin: "lǜ", meaning: "Green" },
        { hanzi: "色", pinyin: "sè", meaning: "Color" },
      ],
      example: {
        hanzi: "草地是绿色的。",
        pinyin: "Cǎodì shì lǜsè de.",
        english: "The lawn is green.",
        bangla: "ঘাসের মাঠ সবুজ।",
      },
      similar: [{ hanzi: "青色", pinyin: "qīngsè", english: "Cyan" }],
    },
    {
      hanzi: "黑色",
      pinyin: "hēisè",
      english: "Black",
      bangla: "কালো রঙ",
      characters: [
        { hanzi: "黑", pinyin: "hēi", meaning: "Black" },
        { hanzi: "色", pinyin: "sè", meaning: "Color" },
      ],
      example: {
        hanzi: "他有一辆黑色的汽车。",
        pinyin: "Tā yǒu yí liàng hēisè de qìchē.",
        english: "He has a black car.",
        bangla: "তার একটি কালো গাড়ি আছে।",
      },
      similar: [{ hanzi: "乌黑", pinyin: "wūhēi", english: "Jet black" }],
    },
    {
      hanzi: "更",
      pinyin: "gèng",
      english: "Even more",
      bangla: "আরও/আরও বেশি",
      characters: [{ hanzi: "更", pinyin: "gèng", meaning: "Even more" }],
      example: {
        hanzi: "今天比昨天更冷。",
        pinyin: "Jīntiān bǐ zuótiān gèng lěng.",
        english: "Today is even colder than yesterday.",
        bangla: "আজ গতকালের চেয়ে আরও ঠান্ডা।",
      },
      similar: [{ hanzi: "更加", pinyin: "gèngjiā", english: "Even more" }],
    },
  ],
};
