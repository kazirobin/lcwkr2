// app/data/vocabulary/lesson9-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson9text1: VocabularyData = {
  hskLevel: 3,
  lesson: 9,
  text: 1,
  dialogue: {
    title: "Returning the Campus Card",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "家月，对不起，我昨天忘了还你校园卡了。",
        pinyin: "Jiāyuè, duìbuqǐ, wǒ zuótiān wàng le huán nǐ xiàoyuánkǎ le.",
        english: "Jiayue, I'm sorry, I forgot to return your campus card yesterday.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "没关系。你怎么这么快就跑出来了？",
        pinyin: "Méi guānxi. Nǐ zěnme zhème kuài jiù pǎo chūlái le?",
        english: "It's okay. How did you run out here so fast?",
      },
      {
        speaker: "Li Wen",
        hanzi: "我正在球场打球呢，接了你的电话就跑出来了。",
        pinyin: "Wǒ zhèngzài qiúchǎng dǎqiú ne, jiē le nǐ de diànhuà jiù pǎo chūlái le.",
        english: "I was playing on the court; I ran over as soon as I picked up your call.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "听说为了准备运动会，你们几个男生每天都练球。",
        pinyin: "Tīngshuō wèile zhǔnbèi yùndònghuì, nǐmen jǐ gè nánshēng měitiān dōu liàn qiú.",
        english: "I heard that to prepare for the sports meet, you boys practice ball every day.",
      },
      {
        speaker: "Li Wen",
        hanzi: "是啊！你打算参加运动会吗？",
        pinyin: "Shì a! Nǐ dǎsuàn cānjiā yùndònghuì ma?",
        english: "Yes! Are you planning to participate in the sports meet?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我想参加网球比赛，最近一直在练习。",
        pinyin: "Wǒ xiǎng cānjiā wǎngqiú bǐsài, zuìjìn yìzhí zài liànxí.",
        english: "I want to join the tennis match, I've been practicing recently.",
      },
      {
        speaker: "Li Wen",
        hanzi: "好，到时候去看你的比赛。",
        pinyin: "Hǎo, dào shíhou wǒ qù kàn nǐ de bǐsài.",
        english: "Great, when the time comes, I'll go watch your match.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "校园",
      pinyin: "xiàoyuán",
      english: "Campus",
      bangla: "ক্যাম্পাস",
      characters: [
        { hanzi: "校", pinyin: "xiào", meaning: "School" },
        { hanzi: "园", pinyin: "yuán", meaning: "Garden" },
      ],
      example: {
        hanzi: "校园很大。",
        pinyin: "Xiàoyuán hěn dà.",
        english: "The campus is very big.",
        bangla: "ক্যাম্পাসটা খুব বড়।",
      },
      similar: [{ hanzi: "校园", pinyin: "xiàoyuán", english: "Campus" }],
    },
    {
      hanzi: "卡",
      pinyin: "kǎ",
      english: "Card",
      bangla: "কার্ড",
      characters: [
        { hanzi: "卡", pinyin: "kǎ", meaning: "Card" },
      ],
      example: {
        hanzi: "校园卡。",
        pinyin: "Xiàoyuánkǎ.",
        english: "Campus card.",
        bangla: "ক্যাম্পাস কার্ড।",
      },
      similar: [{ hanzi: "卡片", pinyin: "kǎpiàn", english: "Card" }],
    },
    {
      hanzi: "球场",
      pinyin: "qiúchǎng",
      english: "Court/Field",
      bangla: "খেলার মাঠ",
      characters: [
        { hanzi: "球", pinyin: "qiú", meaning: "Ball" },
        { hanzi: "场", pinyin: "chǎng", meaning: "Field" },
      ],
      example: {
        hanzi: "球场很大。",
        pinyin: "Qiúchǎng hěn dà.",
        english: "The court is very big.",
        bangla: "মাঠটা খুব বড়।",
      },
      similar: [{ hanzi: "运动场", pinyin: "yùndòngchǎng", english: "Sports field" }],
    },
    {
      hanzi: "为了",
      pinyin: "wèile",
      english: "For/In order to",
      bangla: "জন্য",
      characters: [
        { hanzi: "为", pinyin: "wèi", meaning: "For" },
        { hanzi: "了", pinyin: "le", meaning: "Particle" },
      ],
      example: {
        hanzi: "为了健康，我每天运动。",
        pinyin: "Wèile jiànkāng, wǒ měitiān yùndòng.",
        english: "For health, I exercise every day.",
        bangla: "স্বাস্থ্যের জন্য আমি প্রতিদিন ব্যায়াম করি।",
      },
      similar: [{ hanzi: "为", pinyin: "wèi", english: "For" }],
    },
    {
      hanzi: "运动会",
      pinyin: "yùndònghuì",
      english: "Sports meet",
      bangla: "বার্ষিক ক্রীড়া প্রতিযোগিতা",
      characters: [
        { hanzi: "运动", pinyin: "yùndòng", meaning: "Sports" },
        { hanzi: "会", pinyin: "huì", meaning: "Meeting" },
      ],
      example: {
        hanzi: "学校开运动会。",
        pinyin: "Xuéxiào kāi yùndònghuì.",
        english: "The school holds a sports meet.",
        bangla: "স্কুলে ক্রীড়া প্রতিযোগিতা হয়।",
      },
      similar: [{ hanzi: "体育节", pinyin: "tǐyùjié", english: "Sports festival" }],
    },
    {
      hanzi: "男生",
      pinyin: "nánshēng",
      english: "Male student",
      bangla: "ছেলে",
      characters: [
        { hanzi: "男", pinyin: "nán", meaning: "Male" },
        { hanzi: "生", pinyin: "shēng", meaning: "Student" },
      ],
      example: {
        hanzi: "这个班有十五个男生。",
        pinyin: "Zhège bān yǒu shíwǔ gè nánshēng.",
        english: "This class has fifteen male students.",
        bangla: "এই ক্লাসে পনেরো জন ছেলে আছে।",
      },
      similar: [{ hanzi: "女生", pinyin: "nǚshēng", english: "Female student" }],
    },
    {
      hanzi: "练",
      pinyin: "liàn",
      english: "Practice",
      bangla: "অনুশীলন করা",
      characters: [
        { hanzi: "纟", pinyin: "sī", meaning: "Silk" },
        { hanzi: "柬", pinyin: "jiǎn", meaning: "Select" },
      ],
      example: {
        hanzi: "我每天练字。",
        pinyin: "Wǒ měitiān liàn zì.",
        english: "I practice handwriting every day.",
        bangla: "আমি প্রতিদিন হাতের লেখা অনুশীলন করি।",
      },
      similar: [{ hanzi: "练习", pinyin: "liànxí", english: "Practice" }],
    },
    {
      hanzi: "参加",
      pinyin: "cānjiā",
      english: "Join/Participate",
      bangla: "অংশগ্রহণ করা",
      characters: [
        { hanzi: "参", pinyin: "cān", meaning: "Participate" },
        { hanzi: "加", pinyin: "jiā", meaning: "Add" },
      ],
      example: {
        hanzi: "我想参加比赛。",
        pinyin: "Wǒ xiǎng cānjiā bǐsài.",
        english: "I want to participate in the competition.",
        bangla: "আমি প্রতিযোগিতায় অংশ নিতে চাই।",
      },
      similar: [{ hanzi: "加入", pinyin: "jiārù", english: "Join" }],
    },
    {
      hanzi: "网球",
      pinyin: "wǎngqiú",
      english: "Tennis",
      bangla: "টেনিস",
      characters: [
        { hanzi: "网", pinyin: "wǎng", meaning: "Net" },
        { hanzi: "球", pinyin: "qiú", meaning: "Ball" },
      ],
      example: {
        hanzi: "我喜欢打网球。",
        pinyin: "Wǒ xǐhuan dǎ wǎngqiú.",
        english: "I like playing tennis.",
        bangla: "আমি টেনিস খেলতে পছন্দ করি।",
      },
      similar: [{ hanzi: "网球", pinyin: "wǎngqiú", english: "Tennis" }],
    },
    {
      hanzi: "比赛",
      pinyin: "bǐsài",
      english: "Match/Competition",
      bangla: "প্রতিযোগিতা",
      characters: [
        { hanzi: "比", pinyin: "bǐ", meaning: "Compare" },
        { hanzi: "赛", pinyin: "sài", meaning: "Competition" },
      ],
      example: {
        hanzi: "足球比赛很精彩。",
        pinyin: "Zúqiú bǐsài hěn jīngcǎi.",
        english: "The football match is very exciting.",
        bangla: "ফুটবল ম্যাচটা খুব উত্তেজনাপূর্ণ।",
      },
      similar: [{ hanzi: "竞赛", pinyin: "jìngsài", english: "Competition" }],
    },
    {
      hanzi: "练习",
      pinyin: "liànxí",
      english: "Practice",
      bangla: "অনুশীলন",
      characters: [
        { hanzi: "练", pinyin: "liàn", meaning: "Practice" },
        { hanzi: "习", pinyin: "xí", meaning: "Practice" },
      ],
      example: {
        hanzi: "我正在练习中文。",
        pinyin: "Wǒ zhèngzài liànxí Zhōngwén.",
        english: "I am practicing Chinese.",
        bangla: "আমি চীনা ভাষা অনুশীলন করছি।",
      },
      similar: [{ hanzi: "训练", pinyin: "xùnliàn", english: "Train" }],
    },
  ],
};