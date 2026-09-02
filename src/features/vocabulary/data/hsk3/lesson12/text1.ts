// app/data/vocabulary/lesson12-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson12text1: VocabularyData = {
  hskLevel: 3,
  lesson: 12,
  text: 1,
  dialogue: {
    title: "Spring Flowers",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "王老师，您看，这条街上的树都开花了。",
        pinyin: "Wáng lǎoshī, nín kàn, zhè tiáo jiē shang de shù dōu kāihuā le.",
        english: "Teacher Wang, look, the trees on this street are all in bloom.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "上周我去公园坐船了，公园里的花也开了。",
        pinyin: "Shàng zhōu wǒ qù gōngyuán zuòchuán le, gōngyuán lǐ de huā yě kāi le.",
        english: "Last week I went to the park to ride a boat; the flowers in the park have bloomed too.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "天气这么好，下午我也想去公园坐船。",
        pinyin: "Tiānqì zhème hǎo, xiàwǔ wǒ yě xiǎng qù gōngyuán zuòchuán.",
        english: "The weather is so nice, I want to go to the park to ride a boat this afternoon too.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "去吧！今天是工作日，人应该不多。",
        pinyin: "Qù ba! Jīntiān shì gōngzuòrì, rén yīnggāi bù duō.",
        english: "Go ahead! Today is a workday, so there shouldn't be many people.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "您有时间吗？我想跟您一起去。",
        pinyin: "Nín yǒu shíjiān ma? Wǒ xiǎng gēn nín yìqǐ qù.",
        english: "Do you have time? I'd like to go with you.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "我今天下午有课，不能去太远的地方。",
        pinyin: "Wǒ jīntiān xiàwǔ yǒu kè, bù néng qù tài yuǎn de dìfang.",
        english: "I have classes this afternoon, so I can't go anywhere too far.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "那咱们换一天去？",
        pinyin: "Nà zánmen huàn yì tiān qù?",
        english: "Then shall we go another day?",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "行。或者明天去，或者后天去，我给你打电话。",
        pinyin: "Xíng. Huòzhě míngtiān qù, huòzhě hòutiān qù, wǒ gěi nǐ dǎ diànhuà.",
        english: "Okay. Either tomorrow or the day after, I'll call you.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "街",
      pinyin: "jiē",
      english: "Street",
      bangla: "রাস্তা",
      characters: [
        { hanzi: "彳", pinyin: "chì", meaning: "Step" },
        { hanzi: "圭", pinyin: "guī", meaning: "Jade" },
      ],
      example: {
        hanzi: "这条街很长。",
        pinyin: "Zhè tiáo jiē hěn cháng.",
        english: "This street is very long.",
        bangla: "এই রাস্তাটি খুব লম্বা।",
      },
      similar: [{ hanzi: "马路", pinyin: "mǎlù", english: "Road" }],
    },
    {
      hanzi: "开花",
      pinyin: "kāihuā",
      english: "Bloom",
      bangla: "ফুল ফোটা",
      characters: [
        { hanzi: "开", pinyin: "kāi", meaning: "Open" },
        { hanzi: "花", pinyin: "huā", meaning: "Flower" },
      ],
      example: {
        hanzi: "春天花开了。",
        pinyin: "Chūntiān huā kāi le.",
        english: "The flowers bloom in spring.",
        bangla: "বসন্তে ফুল ফোটে।",
      },
      similar: [{ hanzi: "花开", pinyin: "huākāi", english: "Flower blossom" }],
    },
    {
      hanzi: "公园",
      pinyin: "gōngyuán",
      english: "Park",
      bangla: "পার্ক",
      characters: [
        { hanzi: "公", pinyin: "gōng", meaning: "Public" },
        { hanzi: "园", pinyin: "yuán", meaning: "Garden" },
      ],
      example: {
        hanzi: "公园里有很多树。",
        pinyin: "Gōngyuán lǐ yǒu hěnduō shù.",
        english: "There are many trees in the park.",
        bangla: "পার্কে অনেক গাছ আছে।",
      },
      similar: [{ hanzi: "花园", pinyin: "huāyuán", english: "Garden" }],
    },
    {
      hanzi: "船",
      pinyin: "chuán",
      english: "Boat",
      bangla: "নৌকা",
      characters: [
        { hanzi: "舟", pinyin: "zhōu", meaning: "Boat" },
        { hanzi: "铅", pinyin: "qiān", meaning: "Lead" },
      ],
      example: {
        hanzi: "我想坐船。",
        pinyin: "Wǒ xiǎng zuòchuán.",
        english: "I want to ride a boat.",
        bangla: "আমি নৌকা চড়তে চাই।",
      },
      similar: [{ hanzi: "小船", pinyin: "xiǎochuán", english: "Small boat" }],
    },
    {
      hanzi: "工作日",
      pinyin: "gōngzuòrì",
      english: "Workday",
      bangla: "কর্মদিবস",
      characters: [
        { hanzi: "工作", pinyin: "gōngzuò", meaning: "Work" },
        { hanzi: "日", pinyin: "rì", meaning: "Day" },
      ],
      example: {
        hanzi: "今天是工作日。",
        pinyin: "Jīntiān shì gōngzuòrì.",
        english: "Today is a workday.",
        bangla: "আজ কর্মদিবস।",
      },
      similar: [{ hanzi: "上班日", pinyin: "shàngbānrì", english: "Workday" }],
    },
    {
      hanzi: "地方",
      pinyin: "dìfang",
      english: "Place",
      bangla: "জায়গা",
      characters: [
        { hanzi: "地", pinyin: "dì", meaning: "Land" },
        { hanzi: "方", pinyin: "fāng", meaning: "Direction" },
      ],
      example: {
        hanzi: "这是个好地方。",
        pinyin: "Zhè shì gè hǎo dìfang.",
        english: "This is a good place.",
        bangla: "এটা একটা ভালো জায়গা।",
      },
      similar: [{ hanzi: "场所", pinyin: "chǎngsuǒ", english: "Venue" }],
    },
  ],
};