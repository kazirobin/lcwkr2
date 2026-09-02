// app/data/vocabulary/lesson14-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson14text2: VocabularyData = {
  hskLevel: 2,
  lesson: 14,
  text: 2,
  dialogue: {
    title: "Tongle Comes to Visit",
    lines: [
      {
        speaker: "Wang Yifei",
        hanzi:
          "同乐，真是你啊！上次打电话，你说有时间过来看我，没想到这么快就来了！",
        pinyin:
          "Tónglè, zhēn shì nǐ a! Shàng cì dǎ diànhuà, nǐ shuō yǒu shíjiān guòlái kàn wǒ, méi xiǎngdào zhème kuài jiù lái le!",
        english:
          "Tongle, it's really you! Last time we talked on the phone, you said you'd come to see me when you had time. I didn't expect you to come so soon!",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "你在中国过年吗？",
        pinyin: "Nǐ zài Zhōngguó guònián ma?",
        english: "Are you spending the New Year in China?",
      },
      {
        speaker: "Zhou Tongle",
        hanzi: "是啊，我准备在这儿过年。",
        pinyin: "Shì a, wǒ zhǔnbèi zài zhèr guònián.",
        english: "Yes, I plan to spend the New Year here.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "太好了！过年就你一个人，多没意思啊！",
        pinyin: "Tài hǎo le! Guònián jiù nǐ yí ge rén, duō méi yìsi a!",
        english:
          "That's great! But spending the New Year all alone is so boring!",
      },
      {
        speaker: "Zhou Tongle",
        hanzi: "我不是一个人，有位朋友跟我一起。",
        pinyin: "Wǒ bú shì yí ge rén, yǒu wèi péngyou gēn wǒ yìqǐ.",
        english: "I'm not alone. A friend is with me.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "是你女朋友吗？快带过来让我看看！",
        pinyin: "Shì nǐ nǚpéngyou ma? Kuài dài guòlái ràng wǒ kànkan!",
        english:
          "Is it your girlfriend? Quickly bring her over and let me see her!",
      },
      {
        speaker: "Zhou Tongle",
        hanzi: "她在前面那家咖啡店等我呢。",
        pinyin: "Tā zài qiánmiàn nà jiā kāfēidiàn děng wǒ ne.",
        english: "She's waiting for me at the coffee shop up ahead.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "那你还等什么？快带我去见她！",
        pinyin: "Nà nǐ hái děng shénme? Kuài dài wǒ qù jiàn tā!",
        english: "Then what are you waiting for? Quickly take me to meet her!",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "过年",
      pinyin: "guònián",
      english: "Celebrate the New Year",
      bangla: "নতুন বছর উদযাপন করা",
      characters: [
        { hanzi: "过", pinyin: "guò", meaning: "Spend" },
        { hanzi: "年", pinyin: "nián", meaning: "Year" },
      ],
      example: {
        hanzi: "你在哪儿过年？",
        pinyin: "Nǐ zài nǎr guònián?",
        english: "Where do you celebrate the New Year?",
        bangla: "তুমি কোথায় নতুন বছর উদযাপন করো?",
      },
      similar: [
        { hanzi: "度岁", pinyin: "dùsuì", english: "Spend the New Year" },
      ],
    },
    {
      hanzi: "没意思",
      pinyin: "méi yìsi",
      english: "Boring",
      bangla: "বিরক্তিকর",
      characters: [
        { hanzi: "没", pinyin: "méi", meaning: "Not have" },
        { hanzi: "意思", pinyin: "yìsi", meaning: "Fun/Meaning" },
      ],
      example: {
        hanzi: "这部电影没意思。",
        pinyin: "Zhè bù diànyǐng méi yìsi.",
        english: "This movie is boring.",
        bangla: "এই সিনেমাটি বিরক্তিকর।",
      },
      similar: [{ hanzi: "无聊", pinyin: "wúliáo", english: "Boring" }],
    },
    {
      hanzi: "位",
      pinyin: "wèi",
      english: "Measure word for people (polite)",
      bangla: "জন (সম্মানসূচক পরিমাপক শব্দ)",
      characters: [{ hanzi: "位", pinyin: "wèi", meaning: "Position/Person" }],
      example: {
        hanzi: "这位是林老师。",
        pinyin: "Zhè wèi shì Lín lǎoshī.",
        english: "This is teacher Lin.",
        bangla: "ইনি হলেন শিক্ষক লিন।",
      },
      similar: [
        { hanzi: "个", pinyin: "gè", english: "Measure word (general)" },
      ],
    },
    {
      hanzi: "前面",
      pinyin: "qiánmiàn",
      english: "Ahead/Front",
      bangla: "সামনে",
      characters: [
        { hanzi: "前", pinyin: "qián", meaning: "Front" },
        { hanzi: "面", pinyin: "miàn", meaning: "Side" },
      ],
      example: {
        hanzi: "车站就在前面。",
        pinyin: "Chēzhàn jiù zài qiánmiàn.",
        english: "The station is right ahead.",
        bangla: "স্টেশনটি ঠিক সামনে।",
      },
      similar: [{ hanzi: "前方", pinyin: "qiánfāng", english: "Ahead" }],
    },
  ],
};
