// app/data/vocabulary/lesson7-text4.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk3lesson7text4: VocabularyData = {
  hskLevel: 3,
  lesson: 7,
  text: 4,
  dialogue: {
    title: "Thinking About a New TV",
    lines: [
      {
        speaker: "Liu Ming",
        hanzi: "这几天我们在新家坐着看电视的时候，又发现了新问题。房子大了，电视看起来就有点儿小。",
        pinyin: "Zhè jǐ tiān wǒmen zài xīn jiā zuòzhe kàn diànshì de shíhou, yòu fāxiàn le xīn wèntí. Fángzi dà le, diànshì kàn qǐlái jiù yǒudiǎnr xiǎo.",
        english: "These past few days, while sitting and watching TV in our new home, we found a new problem. The house is bigger now, so the TV looks a bit small.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "这个电视是我们结婚时买的，是时候换个新电视了。",
        pinyin: "Zhège diànshì shì wǒmen jiéhūn shí mǎi de, shì shíhou huàn gè xīn diànshì le.",
        english: "This TV was bought when we got married, it's time to change to a new TV.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "今天我一直在网上选电视，没想到，现在的电视不但便宜，而且用着非常方便，有的电视叫它一声就能开机。",
        pinyin: "Jīntiān wǒ yìzhí zài wǎngshang xuǎn diànshì, méi xiǎngdào, xiànzài de diànshì búdàn piányi, érqiě yòngzhe fēicháng fāngbiàn, yǒu de diànshì jiào tā yì shēng jiù néng kāijī.",
        english: "Today I've been selecting TVs online, and I didn't expect that TVs nowadays are not only cheap, but also very convenient to use; some TVs can turn on just by calling out to them.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "看了好几个，都很满意，晚上让一雪来决定吧。",
        pinyin: "Kàn le hǎo jǐ gè, dōu hěn mǎnyì, wǎnshang ràng Yīxuě lái juédìng ba.",
        english: "I've looked at quite a few and am very satisfied with them; I'll let Yixue make the decision tonight.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "结婚",
      pinyin: "jiéhūn",
      english: "Marry/Get married",
      bangla: "বিয়ে করা",
      characters: [
        { hanzi: "结", pinyin: "jié", meaning: "Tie/Knot" },
        { hanzi: "婚", pinyin: "hūn", meaning: "Wedding" },
      ],
      example: {
        hanzi: "他们去年结婚了。",
        pinyin: "Tāmen qùnián jiéhūn le.",
        english: "They got married last year.",
        bangla: "তারা গত বছর বিয়ে করেছে।",
      },
      similar: [{ hanzi: "婚礼", pinyin: "hūnlǐ", english: "Wedding ceremony" }],
    },
    {
      hanzi: "不但",
      pinyin: "búdàn",
      english: "Not only",
      bangla: "শুধু তা-ই নয়",
      characters: [
        { hanzi: "不", pinyin: "bù", meaning: "Not" },
        { hanzi: "但", pinyin: "dàn", meaning: "But" },
      ],
      example: {
        hanzi: "他不但会中文，还会英语。",
        pinyin: "Tā búdàn huì Zhōngwén, hái huì Yīngyǔ.",
        english: "He not only speaks Chinese, but also English.",
        bangla: "সে শুধু চীনা পারে তা-ই নয়, ইংরেজিও পারে।",
      },
      similar: [{ hanzi: "不仅", pinyin: "bùjǐn", english: "Not only" }],
    },
    {
      hanzi: "而且",
      pinyin: "érqiě",
      english: "But also",
      bangla: "উপরন্তু",
      characters: [
        { hanzi: "而", pinyin: "ér", meaning: "And" },
        { hanzi: "且", pinyin: "qiě", meaning: "Moreover" },
      ],
      example: {
        hanzi: "不但便宜，而且好用。",
        pinyin: "Búdàn piányi, érqiě hǎoyòng.",
        english: "Not only cheap, but also easy to use.",
        bangla: "শুধু সস্তা তাই নয়, উপরন্তু ভালো।",
      },
      similar: [{ hanzi: "并且", pinyin: "bìngqiě", english: "Moreover" }],
    },
    {
      hanzi: "声",
      pinyin: "shēng",
      english: "Sound (measure word)",
      bangla: "শব্দ",
      characters: [
        { hanzi: "声", pinyin: "shēng", meaning: "Sound" },
      ],
      example: {
        hanzi: "一声。",
        pinyin: "Yì shēng.",
        english: "One sound.",
        bangla: "একটা শব্দ।",
      },
      similar: [{ hanzi: "声音", pinyin: "shēngyīn", english: "Voice/Sound" }],
    },
    {
      hanzi: "开机",
      pinyin: "kāijī",
      english: "Power on/Start up",
      bangla: "চালু করা",
      characters: [
        { hanzi: "开", pinyin: "kāi", meaning: "Open" },
        { hanzi: "机", pinyin: "jī", meaning: "Machine" },
      ],
      example: {
        hanzi: "电视开机了。",
        pinyin: "Diànshì kāijī le.",
        english: "The TV is powered on.",
        bangla: "টিভি চালু হয়ে গেছে।",
      },
      similar: [{ hanzi: "启动", pinyin: "qǐdòng", english: "Start" }],
    },
  ],
};