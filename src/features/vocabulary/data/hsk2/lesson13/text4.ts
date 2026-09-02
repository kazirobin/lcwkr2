// app/data/vocabulary/lesson13-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson13text4: VocabularyData = {
  hskLevel: 2,
  lesson: 13,
  text: 4,
  dialogue: {
    title: "New Year Gifts for Teacher Wang",
    lines: [
      {
        speaker: "Narrator",
        hanzi:
          "新年就要到了，安妮送给我一个新本子。她告诉我是在网上买的，比我的本子贵一点儿。我们班同学也送了王老师漂亮的花，希望她高高兴兴地过个新年。",
        pinyin:
          "Xīnnián jiù yào dào le, Ānnī sòng gěi wǒ yí ge xīn běnzi. Tā gàosu wǒ shì zài wǎngshàng mǎi de, bǐ wǒ de běnzi guì yìdiǎnr. Wǒmen bān tóngxué yě sòng le Wáng lǎoshī piàoliang de huā, xīwàng tā gāogāoxìngxìng de guò ge xīnnián.",
        english:
          "The New Year is almost here. Anni gave me a new notebook. She told me that she bought it online, and it was a little more expensive than my notebook. Our classmates also gave Teacher Wang some beautiful flowers. We hope she has a very happy New Year.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "告诉",
      pinyin: "gàosu",
      english: "To tell",
      bangla: "বলা/জানানো",
      characters: [
        { hanzi: "告", pinyin: "gào", meaning: "Inform" },
        { hanzi: "诉", pinyin: "sù", meaning: "Speak" },
      ],
      example: {
        hanzi: "请告诉我你的名字。",
        pinyin: "Qǐng gàosu wǒ nǐ de míngzi.",
        english: "Please tell me your name.",
        bangla: "অনুগ্রহ করে আমাকে তোমার নাম বলো।",
      },
      similar: [{ hanzi: "告知", pinyin: "gàozhī", english: "To inform" }],
    },
    {
      hanzi: "班",
      pinyin: "bān",
      english: "Class",
      bangla: "শ্রেণী",
      characters: [
        { hanzi: "王", pinyin: "wáng", meaning: "Jade" },
        { hanzi: "刀", pinyin: "dāo", meaning: "Knife" },
        { hanzi: "王", pinyin: "wáng", meaning: "Jade" },
      ],
      example: {
        hanzi: "我们班有二十个学生。",
        pinyin: "Wǒmen bān yǒu èrshí gè xuésheng.",
        english: "Our class has twenty students.",
        bangla: "আমাদের শ্রেণীতে বিশ জন শিক্ষার্থী আছে।",
      },
      similar: [{ hanzi: "班级", pinyin: "bānjí", english: "Class" }],
    },
  ],
};
