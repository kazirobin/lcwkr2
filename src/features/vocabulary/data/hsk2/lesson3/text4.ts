// app/data/vocabulary/lesson3-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson3text4: VocabularyData = {
  hskLevel: 2,
  lesson: 3,
  text: 4,
  dialogue: {
    title: "Liu Ming's Busy Month",
    lines: [
      {
        speaker: "Narrator",
        hanzi:
          "早上，刘明开车送孩子去学校，送完孩子回家后，医院就来电话了，让他回去上班。我觉得他这个月每天都很累，真想让他休息休息。",
        pinyin:
          "Zǎoshang, Liú Míng kāichē sòng háizi qù xuéxiào, sòng wán háizi huí jiā hòu, yīyuàn jiù lái diànhuà le, ràng tā huíqù shàngbān. Wǒ juéde tā zhège yuè měitiān dōu hěn lèi, zhēn xiǎng ràng tā xiūxi xiūxi.",
        english:
          "In the morning, Liu Ming drove his child to school. After taking his child home, the hospital called and asked him to go back to work. I think he has been very tired every day this month. I really want him to get some rest.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "送",
      pinyin: "sòng",
      english: "Send/Deliver",
      bangla: "পাঠানো/পৌঁছে দেওয়া",
      characters: [{ hanzi: "送", pinyin: "sòng", meaning: "Send/Deliver" }],
      example: {
        hanzi: "他送孩子去学校。",
        pinyin: "Tā sòng háizi qù xuéxiào.",
        english: "He sends the child to school.",
        bangla: "সে বাচ্চাকে স্কুলে পৌঁছে দেয়।",
      },
      similar: [{ hanzi: "寄", pinyin: "jì", english: "Send/Mail" }],
    },
    {
      hanzi: "医院",
      pinyin: "yīyuàn",
      english: "Hospital",
      bangla: "হাসপাতাল",
      characters: [
        { hanzi: "医", pinyin: "yī", meaning: "Medicine/Doctor" },
        { hanzi: "院", pinyin: "yuàn", meaning: "Institution" },
      ],
      example: {
        hanzi: "他在医院工作。",
        pinyin: "Tā zài yīyuàn gōngzuò.",
        english: "He works at a hospital.",
        bangla: "সে হাসপাতালে কাজ করে।",
      },
      similar: [{ hanzi: "诊所", pinyin: "zhěnsuǒ", english: "Clinic" }],
    },
    {
      hanzi: "累",
      pinyin: "lèi",
      english: "Tired",
      bangla: "ক্লান্ত",
      characters: [{ hanzi: "累", pinyin: "lèi", meaning: "Tired" }],
      example: {
        hanzi: "我今天很累。",
        pinyin: "Wǒ jīntiān hěn lèi.",
        english: "I am very tired today.",
        bangla: "আমি আজ খুব ক্লান্ত।",
      },
      similar: [{ hanzi: "疲劳", pinyin: "píláo", english: "Fatigued" }],
    },
  ],
};
