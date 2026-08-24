// app/data/vocabulary/lesson9-text4.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk3lesson9text4: VocabularyData = {
  hskLevel: 3,
  lesson: 9,
  text: 4,
  dialogue: {
    title: "The Olympic Games",
    lines: [
      {
        speaker: "Narrator",
        hanzi: "我喜欢看体育比赛，最爱看的就是奥运会。奥运会是世界上影响最大的体育比赛。",
        pinyin: "Wǒ xǐhuān kàn tǐyù bǐsài, zuì ài kàn de jiùshì Àoyùnhuì. Àoyùnhuì shì shìjiè shang yǐngxiǎng zuì dà de tǐyù bǐsài.",
        english: "I like watching sports competitions, and my favorite is the Olympic Games. The Olympic Games is the most influential sports event in the world.",
      },
      {
        speaker: "Narrator",
        hanzi: "从1896年到2024年，每次奥运会都有非常多的运动员参加。",
        pinyin: "Cóng 1896 nián dào 2024 nián, měi cì Àoyùnhuì dōu yǒu fēicháng duō de yùndòngyuán cānjiā.",
        english: "From 1896 to 2024, a huge number of athletes have participated in every Olympics.",
      },
      {
        speaker: "Narrator",
        hanzi: "第一位参加奥运会的中国运动员是刘长春，他1932年参加了100米和200米短跑比赛。",
        pinyin: "Dì-yī wèi cānjiā Àoyùnhuì de Zhōngguó yùndòngyuán shì Liú Chángchūn, tā 1932 nián cānjiā le yìbǎi mǐ hé èrbǎi mǐ duǎnpǎo bǐsài.",
        english: "The first Chinese athlete to participate in the Olympics was Liu Changchun; in 1932, he took part in the 100-meter and 200-meter sprint races.",
      },
      {
        speaker: "Narrator",
        hanzi: "虽然他没有得到好成绩，但是他让世界认识了中国。",
        pinyin: "Suīrán tā méiyǒu dédào hǎo chéngjì, dànshì tā ràng shìjiè rènshi le Zhōngguó.",
        english: "Although he didn't get good results, he introduced China to the world.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "体育",
      pinyin: "tǐyù",
      english: "Sports",
      bangla: "খেলাধুলা",
      characters: [
        { hanzi: "体", pinyin: "tǐ", meaning: "Body" },
        { hanzi: "育", pinyin: "yù", meaning: "Education" },
      ],
      example: {
        hanzi: "我喜欢体育。",
        pinyin: "Wǒ xǐhuan tǐyù.",
        english: "I like sports.",
        bangla: "আমি খেলাধুলা পছন্দ করি।",
      },
      similar: [{ hanzi: "运动", pinyin: "yùndòng", english: "Exercise" }],
    },
    {
      hanzi: "世界",
      pinyin: "shìjiè",
      english: "World",
      bangla: "বিশ্ব",
      characters: [
        { hanzi: "世", pinyin: "shì", meaning: "World" },
        { hanzi: "界", pinyin: "jiè", meaning: "Boundary" },
      ],
      example: {
        hanzi: "世界很大。",
        pinyin: "Shìjiè hěn dà.",
        english: "The world is very big.",
        bangla: "বিশ্বটা খুব বড়।",
      },
      similar: [{ hanzi: "全球", pinyin: "quánqiú", english: "Global" }],
    },
    {
      hanzi: "运动员",
      pinyin: "yùndòngyuán",
      english: "Athlete",
      bangla: "অ্যাথলেট",
      characters: [
        { hanzi: "运动", pinyin: "yùndòng", meaning: "Sports" },
        { hanzi: "员", pinyin: "yuán", meaning: "Person" },
      ],
      example: {
        hanzi: "他是运动员。",
        pinyin: "Tā shì yùndòngyuán.",
        english: "He is an athlete.",
        bangla: "সে একজন অ্যাথলেট।",
      },
      similar: [{ hanzi: "选手", pinyin: "xuǎnshǒu", english: "Player" }],
    },
    {
      hanzi: "得到",
      pinyin: "dédào",
      english: "Get/Obtain",
      bangla: "পাওয়া",
      characters: [
        { hanzi: "得", pinyin: "dé", meaning: "Get" },
        { hanzi: "到", pinyin: "dào", meaning: "Arrive" },
      ],
      example: {
        hanzi: "我得到了很多帮助。",
        pinyin: "Wǒ dédào le hěnduō bāngzhù.",
        english: "I received a lot of help.",
        bangla: "আমি অনেক সাহায্য পেয়েছি।",
      },
      similar: [{ hanzi: "获得", pinyin: "huòdé", english: "Obtain" }],
    },
    {
      hanzi: "成绩",
      pinyin: "chéngjì",
      english: "Result/Achievement",
      bangla: "ফলাফল",
      characters: [
        { hanzi: "成", pinyin: "chéng", meaning: "Complete" },
        { hanzi: "绩", pinyin: "jì", meaning: "Accomplishment" },
      ],
      example: {
        hanzi: "他的成绩很好。",
        pinyin: "Tā de chéngjì hěn hǎo.",
        english: "His grades are very good.",
        bangla: "তার ফলাফল খুব ভালো।",
      },
      similar: [{ hanzi: "成果", pinyin: "chéngguǒ", english: "Achievement" }],
    },
  ],
};