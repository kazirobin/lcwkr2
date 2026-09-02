// app/data/vocabulary/lesson10-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson10text2: VocabularyData = {
  hskLevel: 3,
  lesson: 10,
  text: 2,
  dialogue: {
    title: "After the Exam",
    lines: [
      {
        speaker: "Classmate",
        hanzi: "小雪，昨天的考试，你考得怎么样？",
        pinyin: "Xiǎoxuě, zuótiān de kǎoshì, nǐ kǎo de zěnmeyàng?",
        english: "Xiaoxue, how did you do on yesterday's exam?",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "我觉得历史有点儿难，你呢？",
        pinyin: "Wǒ juéde lìshǐ yǒudiǎnr nán, nǐ ne?",
        english: "I felt history was a bit difficult, what about you?",
      },
      {
        speaker: "Classmate",
        hanzi: "数学考试我没看清楚要求，做错了好几个题，考得挺差的。",
        pinyin: "Shùxué kǎoshì wǒ méi kàn qīngchu yāoqiú, zuòcuò le hǎo jǐ gè tí, kǎo de tǐng chà de.",
        english: "In the math exam, I didn't read the requirements clearly and got several questions wrong; I did pretty poorly.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "明天还有考试呢，别想那么多了，先复习外语吧。",
        pinyin: "Míngtiān hái yǒu kǎoshì ne, bié xiǎng nàme duō le, xiān fùxí wàiyǔ ba.",
        english: "There are still exams tomorrow, don't think about it so much, let's review foreign languages first.",
      },
      {
        speaker: "Classmate",
        hanzi: "外语作业里有几个问题，我可以问问你吗？",
        pinyin: "Wàiyǔ zuòyè lǐ yǒu jǐ gè wèntí, wǒ kěyǐ wènwen nǐ ma?",
        english: "There are a few questions in the foreign language homework, can I ask you?",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "当然可以。在学习上，遇到什么问题都可以问我。",
        pinyin: "Dāngrán kěyǐ. Zài xuéxí shang, yùdào shénme wèntí dōu kěyǐ wèn wǒ.",
        english: "Of course. Whatever problems you encounter in study, you can ask me.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "不好意思，这几个题我也不会。咱们还是一起去办公室问问李老师吧。",
        pinyin: "Bù hǎoyìsi, zhè jǐ gè tí wǒ yě bú huì. Zánmen háishi yìqǐ qù bàngōngshì wènwen Lǐ lǎoshī ba.",
        english: "Sorry, I don't know these questions either. Let's go to the office together and ask Teacher Li.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "历史",
      pinyin: "lìshǐ",
      english: "History",
      bangla: "ইতিহাস",
      characters: [
        { hanzi: "历", pinyin: "lì", meaning: "Calendar" },
        { hanzi: "史", pinyin: "shǐ", meaning: "History" },
      ],
      example: {
        hanzi: "我对历史感兴趣。",
        pinyin: "Wǒ duì lìshǐ gǎn xìngqù.",
        english: "I am interested in history.",
        bangla: "ইতিহাসে আমার আগ্রহ আছে।",
      },
      similar: [{ hanzi: "历史", pinyin: "lìshǐ", english: "History" }],
    },
    {
      hanzi: "难",
      pinyin: "nán",
      english: "Difficult",
      bangla: "কঠিন",
      characters: [
        { hanzi: "又", pinyin: "yòu", meaning: "Again" },
        { hanzi: "隹", pinyin: "zhuī", meaning: "Bird" },
      ],
      example: {
        hanzi: "这道题很难。",
        pinyin: "Zhè dào tí hěn nán.",
        english: "This question is very difficult.",
        bangla: "এই প্রশ্নটা খুব কঠিন।",
      },
      similar: [{ hanzi: "困难", pinyin: "kùnnán", english: "Difficult" }],
    },
    {
      hanzi: "要求",
      pinyin: "yāoqiú",
      english: "Requirement",
      bangla: "নির্দেশনা",
      characters: [
        { hanzi: "要", pinyin: "yào", meaning: "Want" },
        { hanzi: "求", pinyin: "qiú", meaning: "Seek" },
      ],
      example: {
        hanzi: "老师的要求很高。",
        pinyin: "Lǎoshī de yāoqiú hěn gāo.",
        english: "The teacher's requirements are very high.",
        bangla: "শিক্ষকের নির্দেশনা অনেক কঠোর।",
      },
      similar: [{ hanzi: "条件", pinyin: "tiáojiàn", english: "Condition" }],
    },
    {
      hanzi: "差",
      pinyin: "chà",
      english: "Poor",
      bangla: "খারাপ",
      characters: [
        { hanzi: "羊", pinyin: "yáng", meaning: "Sheep" },
        { hanzi: "工", pinyin: "gōng", meaning: "Work" },
      ],
      example: {
        hanzi: "他的成绩很差。",
        pinyin: "Tā de chéngjì hěn chà.",
        english: "His grades are very poor.",
        bangla: "তার ফলাফল খুব খারাপ।",
      },
      similar: [{ hanzi: "糟糕", pinyin: "zāogāo", english: "Terrible" }],
    },
    {
      hanzi: "复习",
      pinyin: "fùxí",
      english: "Review",
      bangla: "পুনরাবৃত্তি করা",
      characters: [
        { hanzi: "复", pinyin: "fù", meaning: "Repeat" },
        { hanzi: "习", pinyin: "xí", meaning: "Practice" },
      ],
      example: {
        hanzi: "我要复习功课。",
        pinyin: "Wǒ yào fùxí gōngkè.",
        english: "I need to review my lessons.",
        bangla: "আমার পড়া পুনরাবৃত্তি করতে হবে।",
      },
      similar: [{ hanzi: "预习", pinyin: "yùxí", english: "Preview" }],
    },
    {
      hanzi: "外语",
      pinyin: "wàiyǔ",
      english: "Foreign language",
      bangla: "বিদেশি ভাষা",
      characters: [
        { hanzi: "外", pinyin: "wài", meaning: "Outside" },
        { hanzi: "语", pinyin: "yǔ", meaning: "Language" },
      ],
      example: {
        hanzi: "她学外语。",
        pinyin: "Tā xué wàiyǔ.",
        english: "She learns foreign languages.",
        bangla: "সে বিদেশি ভাষা শেখে।",
      },
      similar: [{ hanzi: "外语", pinyin: "wàiyǔ", english: "Foreign language" }],
    },
    {
      hanzi: "当然",
      pinyin: "dāngrán",
      english: "Of course",
      bangla: "অবশ্যই",
      characters: [
        { hanzi: "当", pinyin: "dāng", meaning: "Should" },
        { hanzi: "然", pinyin: "rán", meaning: "So" },
      ],
      example: {
        hanzi: "当然可以。",
        pinyin: "Dāngrán kěyǐ.",
        english: "Of course you can.",
        bangla: "অবশ্যই পারো।",
      },
      similar: [{ hanzi: "自然", pinyin: "zìrán", english: "Naturally" }],
    },
    {
      hanzi: "遇到",
      pinyin: "yùdào",
      english: "Encounter",
      bangla: "সম্মুখীন হওয়া",
      characters: [
        { hanzi: "遇", pinyin: "yù", meaning: "Meet" },
        { hanzi: "到", pinyin: "dào", meaning: "Arrive" },
      ],
      example: {
        hanzi: "我遇到了朋友。",
        pinyin: "Wǒ yùdào le péngyou.",
        english: "I ran into a friend.",
        bangla: "আমি একজন বন্ধুর সাথে দেখা পেলাম।",
      },
      similar: [{ hanzi: "碰到", pinyin: "pèngdào", english: "Run into" }],
    },
    {
      hanzi: "办公室",
      pinyin: "bàngōngshì",
      english: "Office",
      bangla: "অফিস",
      characters: [
        { hanzi: "办", pinyin: "bàn", meaning: "Handle" },
        { hanzi: "公", pinyin: "gōng", meaning: "Public" },
        { hanzi: "室", pinyin: "shì", meaning: "Room" },
      ],
      example: {
        hanzi: "老师在办公室。",
        pinyin: "Lǎoshī zài bàngōngshì.",
        english: "The teacher is in the office.",
        bangla: "শিক্ষক অফিসে আছেন।",
      },
      similar: [{ hanzi: "办公室", pinyin: "bàngōngshì", english: "Office" }],
    },
  ],
};