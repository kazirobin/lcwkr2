import { NextResponse } from "next/server";
import connectToDatabase from "@/lib/mongodb";
import ChineseWord from "@/models/ChineseWord";

// আপনি যতগুলো ইচ্ছা Core Word এখানে একসাথে সাজিয়ে রাখতে পারেন
const SEED_DATA = [
  {
    character: "学",
    pinyin: "xué",
    meaningEn: "to learn; to study",
    meaningBn: "শেখা; পড়াশোনা করা",
    hskLevel: 1,
    strokeCount: 8,
    relatedWords: [
      {
        word: "学习",
        pinyin: "xuéxí",
        meaningEn: "to study; to learn",
        meaningBn: "পড়াশোনা করা",
        wordType: "Verb",
        hskLevel: 1,
        examples: [
          {
            chinese: "我学习中文。",
            pinyin: "Wǒ xuéxí Zhōngwén.",
            meaningEn: "I study Chinese.",
            meaningBn: "আমি চাইনিজ শিখি।",
          },
        ],
      },
      {
        word: "学生",
        pinyin: "xuéshēng",
        meaningEn: "student",
        meaningBn: "শিক্ষার্থী / ছাত্র",
        wordType: "Noun",
        hskLevel: 1,
        examples: [
          {
            chinese: "他是大学生。",
            pinyin: "Tā shì dàxuéshēng.",
            meaningEn: "He is a university student.",
            meaningBn: "তিনি একজন বিশ্ববিদ্যালয়ের ছাত্র।",
          },
        ],
      },
      {
        word: "学校",
        pinyin: "xuéxiào",
        meaningEn: "school",
        meaningBn: "বিদ্যালয় / স্কুল",
        wordType: "Noun",
        hskLevel: 1,
        examples: [],
      },
    ],
  },
  {
    character: "人",
    pinyin: "rén",
    meaningEn: "person; people; human",
    meaningBn: "মানুষ; ব্যক্তি",
    hskLevel: 1,
    strokeCount: 2,
    relatedWords: [
      {
        word: "中国人",
        pinyin: "Zhōngguórén",
        meaningEn: "Chinese person",
        meaningBn: "চীনা নাগরিক",
        wordType: "Noun",
        hskLevel: 1,
        examples: [
          {
            chinese: "他是中国人。",
            pinyin: "Tā shì Zhōngguórén.",
            meaningEn: "He is Chinese.",
            meaningBn: "তিনি একজন চীনা নাগরিক।",
          },
        ],
      },
      {
        word: "大人",
        pinyin: "dàren",
        meaningEn: "adult",
        meaningBn: "প্রাপ্তবয়স্ক",
        wordType: "Noun",
        hskLevel: 2,
        examples: [],
      },
    ],
  },
  {
    character: "大",
    pinyin: "dà",
    meaningEn: "big; large; great",
    meaningBn: "বড়; বিশাল",
    hskLevel: 1,
    strokeCount: 3,
    relatedWords: [
      {
        word: "大家",
        pinyin: "dàjiā",
        meaningEn: "everyone; all of us",
        meaningBn: "সবাই; সকলে",
        wordType: "Pronoun",
        hskLevel: 1,
        examples: [
          {
            chinese: "大家好！",
            pinyin: "Dàjiā hǎo!",
            meaningEn: "Hello everyone!",
            meaningBn: "সবাইকে হ্যালো!",
          },
        ],
      },
      {
        word: "大学",
        pinyin: "dàxué",
        meaningEn: "university",
        meaningBn: "বিশ্ববিদ্যালয়",
        wordType: "Noun",
        hskLevel: 2,
        examples: [],
      },
    ],
  },
  {
    character: "好",
    pinyin: "hǎo",
    meaningEn: "good; fine; well",
    meaningBn: "ভালো; সুন্দর",
    hskLevel: 1,
    strokeCount: 6,
    relatedWords: [
      {
        word: "你好",
        pinyin: "nǐ hǎo",
        meaningEn: "hello; hi",
        meaningBn: "হ্যালো; নমস্কার",
        wordType: "Phrase",
        hskLevel: 1,
        examples: [
          {
            chinese: "你好！很高兴认识你。",
            pinyin: "Nǐ hǎo! Hěn gāoxìng rènshi nǐ.",
            meaningEn: "Hello! Nice to meet you.",
            meaningBn: "হ্যালো! আপনার সাথে পরিচিত হয়ে ভালো লাগলো।",
          },
        ],
      },
      {
        word: "好看",
        pinyin: "hǎokàn",
        meaningEn: "good-looking; pretty",
        meaningBn: "দেখতে সুন্দর",
        wordType: "Adjective",
        hskLevel: 2,
        examples: [],
      },
    ],
  },
  {
    character: "生",
    pinyin: "shēng",
    meaningEn: "to be born; life; student",
    meaningBn: "জন্ম নেওয়া; জীবন",
    hskLevel: 1,
    strokeCount: 5,
    relatedWords: [
      {
        word: "生日",
        pinyin: "shēngrì",
        meaningEn: "birthday",
        meaningBn: "জন্মদিন",
        wordType: "Noun",
        hskLevel: 2,
        examples: [
          {
            chinese: "祝你生日快乐！",
            pinyin: "Zhù nǐ shēngrì kuàilè!",
            meaningEn: "Happy birthday to you!",
            meaningBn: "শুভ জন্মদিন!",
          },
        ],
      },
      {
        word: "医生",
        pinyin: "yīshēng",
        meaningEn: "doctor",
        meaningBn: "ডাক্তার",
        wordType: "Noun",
        hskLevel: 1,
        examples: [],
      },
    ],
  },
];

export async function POST() {
  try {
    await connectToDatabase();

    // ডুপ্লিকেট রোধ করে ডাটা আপডেট বা নতুন ইনসার্ট (Upsert) করা
    const bulkOps = SEED_DATA.map((item) => ({
      updateOne: {
        filter: { character: item.character },
        update: { $set: item },
        upsert: true,
      },
    }));

    const result = await ChineseWord.bulkWrite(bulkOps);

    return NextResponse.json({
      success: true,
      message: `${SEED_DATA.length} core words processed successfully!`,
      result,
    });
  } catch (error: any) {
    return NextResponse.json(
      { success: false, message: error.message || "Failed to seed data" },
      { status: 500 }
    );
  }
}