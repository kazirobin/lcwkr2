// app/data/vocabulary/lesson2-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson2text4: VocabularyData = {
  hskLevel: 2,
  lesson: 2,
  text: 4,
  dialogue: {
    title: "Peking University",
    lines: [
      {
        speaker: "Narrator",
        hanzi: "北京大学很大，有四万多名学生。",
        pinyin: "Běijīng Dàxué hěn dà, yǒu sì wàn duō míng xuéshēng.",
        english:
          "Peking University is very big, with more than forty thousand students.",
      },
      {
        speaker: "Narrator",
        hanzi: "学校很漂亮，里边还有家电影院，电影票也不贵。",
        pinyin:
          "Xuéxiào hěn piàoliang, lǐbian hái yǒu jiā diànyǐngyuàn, diànyǐngpiào yě bú guì.",
        english:
          "The school is very beautiful. There is also a cinema inside, and the movie tickets are not expensive.",
      },
      {
        speaker: "Narrator",
        hanzi: "我们有时间还想再过来看个电影。",
        pinyin: "Wǒmen yǒu shíjiān hái xiǎng zài guòlái kàn ge diànyǐng.",
        english:
          "When we have time, we also want to come back again to watch a movie.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "过来",
      pinyin: "guòlái",
      english: "Come over",
      bangla: "চলে আসা/এদিকে আসা",
      characters: [
        { hanzi: "过", pinyin: "guò", meaning: "Pass through" },
        { hanzi: "来", pinyin: "lái", meaning: "Come" },
      ],
      example: {
        hanzi: "你过来一下。",
        pinyin: "Nǐ guòlái yīxià.",
        english: "Come over here for a moment.",
        bangla: "একটু এদিকে এসো।",
      },
      similar: [{ hanzi: "靠近", pinyin: "kàojìn", english: "Come closer" }],
    },
  ],
};
