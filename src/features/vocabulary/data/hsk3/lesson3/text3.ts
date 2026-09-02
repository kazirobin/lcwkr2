// app/data/vocabulary/lesson3-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson3text3: VocabularyData = {
  hskLevel: 3,
  lesson: 3,
  text: 3,
  dialogue: {
    title: "Getting a Credit Card",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "这个月花了不少钱。",
        pinyin: "Zhège yuè huā le bù shǎo qián.",
        english: "We spent quite a lot of money this month.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "是的，我们买了很多搬家时要用的东西。",
        pinyin: "Shì de, wǒmen mǎi le hěn duō bānjiā shí yào yòng de dōngxi.",
        english: "Yes, we bought a lot of things needed for moving.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "咱们办张信用卡吧，花的钱可以慢慢还。听说中国银行的服务不错，办了信用卡买东西还能便宜。",
        pinyin: "Zánmen bàn zhāng xìnyòngkǎ ba, huā de qián kěyǐ mànmàn huán. Tīngshuō Zhōngguó Yínháng de fúwù búcuò, bàn le xìnyòngkǎ mǎi dōngxi hái néng piányi.",
        english: "Let's get a credit card, we can pay back the money slowly. I heard Bank of China has good service, and with a credit card you can get discounts on purchases.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "好啊！中国银行很近，走路几分钟就能到。咱们什么时候去？",
        pinyin: "Hǎo a! Zhōngguó Yínháng hěn jìn, zǒulù jǐ fēnzhōng jiù néng dào. Zánmen shénme shíhou qù?",
        english: "Great! Bank of China is very close, just a few minutes' walk. When should we go?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "今天下午？",
        pinyin: "Jīntiān xiàwǔ?",
        english: "This afternoon?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "我下午要去医院，很晚才能回来。",
        pinyin: "Wǒ xiàwǔ yào qù yīyuàn, hěn wǎn cái néng huílái.",
        english: "I have to go to the hospital this afternoon, I won't be back until late.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "那我下午自己去吧。",
        pinyin: "Nà wǒ xiàwǔ zìjǐ qù ba.",
        english: "Then I'll go by myself this afternoon.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "花",
      pinyin: "huā",
      english: "Spend (money)",
      bangla: "খরচ করা",
      characters: [
        { hanzi: "艹", pinyin: "cǎo", meaning: "Grass" },
        { hanzi: "化", pinyin: "huà", meaning: "Change" },
      ],
      example: {
        hanzi: "我花了太多钱。",
        pinyin: "Wǒ huā le tài duō qián.",
        english: "I spent too much money.",
        bangla: "আমি অনেক টাকা খরচ করেছি।",
      },
      similar: [{ hanzi: "花费", pinyin: "huāfèi", english: "Spend" }],
    },
    {
      hanzi: "办",
      pinyin: "bàn",
      english: "Handle/Apply for",
      bangla: "করানো/আবেদন করা",
      characters: [
        { hanzi: "力", pinyin: "lì", meaning: "Power" },
        { hanzi: "八", pinyin: "bā", meaning: "Eight" },
      ],
      example: {
        hanzi: "我要办一张银行卡。",
        pinyin: "Wǒ yào bàn yì zhāng yínhángkǎ.",
        english: "I want to apply for a bank card.",
        bangla: "আমি একটি ব্যাংক কার্ড করাতে চাই।",
      },
      similar: [{ hanzi: "申请", pinyin: "shēnqǐng", english: "Apply" }],
    },
    {
      hanzi: "信用卡",
      pinyin: "xìnyòngkǎ",
      english: "Credit card",
      bangla: "ক্রেডিট কার্ড",
      characters: [
        { hanzi: "信用", pinyin: "xìnyòng", meaning: "Credit/Trust" },
        { hanzi: "卡", pinyin: "kǎ", meaning: "Card" },
      ],
      example: {
        hanzi: "我用信用卡付钱。",
        pinyin: "Wǒ yòng xìnyòngkǎ fù qián.",
        english: "I pay with a credit card.",
        bangla: "আমি ক্রেডিট কার্ড দিয়ে টাকা পরিশোধ করি।",
      },
      similar: [{ hanzi: "借记卡", pinyin: "jièjìkǎ", english: "Debit card" }],
    },
    {
      hanzi: "还",
      pinyin: "huán",
      english: "Pay back/Return",
      bangla: "শোধ করা/ফেরত দেওয়া",
      characters: [
        { hanzi: "辶", pinyin: "chuò", meaning: "Walk" },
        { hanzi: "不", pinyin: "bù", meaning: "Not" },
      ],
      example: {
        hanzi: "我下个月还钱。",
        pinyin: "Wǒ xià gè yuè huán qián.",
        english: "I'll pay back the money next month.",
        bangla: "আমি আগামী মাসে টাকা শোধ করব।",
      },
      similar: [{ hanzi: "归还", pinyin: "guīhuán", english: "Return" }],
    },
    {
      hanzi: "银行",
      pinyin: "yínháng",
      english: "Bank",
      bangla: "ব্যাংক",
      characters: [
        { hanzi: "银", pinyin: "yín", meaning: "Silver" },
        { hanzi: "行", pinyin: "háng", meaning: "Business" },
      ],
      example: {
        hanzi: "银行在哪儿？",
        pinyin: "Yínháng zài nǎr?",
        english: "Where is the bank?",
        bangla: "ব্যাংক কোথায়?",
      },
      similar: [{ hanzi: "金库", pinyin: "jīnkù", english: "Vault" }],
    },
    {
      hanzi: "医院",
      pinyin: "yīyuàn",
      english: "Hospital",
      bangla: "হাসপাতাল",
      characters: [
        { hanzi: "医", pinyin: "yī", meaning: "Doctor/Medicine" },
        { hanzi: "院", pinyin: "yuàn", meaning: "Institution" },
      ],
      example: {
        hanzi: "他去医院了。",
        pinyin: "Tā qù yīyuàn le.",
        english: "He went to the hospital.",
        bangla: "সে হাসপাতালে গেছে।",
      },
      similar: [{ hanzi: "诊所", pinyin: "zhěnsuǒ", english: "Clinic" }],
    },
  ],
};