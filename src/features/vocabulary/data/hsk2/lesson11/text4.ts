// app/data/vocabulary/lesson11-text4.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson11text4: VocabularyData = {
  hskLevel: 2,
  lesson: 11,
  text: 4,
  dialogue: {
    title: "After Visiting the Hospital",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi:
          "我这几天经常头疼，从药店买了点儿药，没去医院。今天下课后，王老师看我不舒服，就送我去医院了。",
        pinyin:
          "Wǒ zhè jǐ tiān jīngcháng tóu téng, cóng yàodiàn mǎi le diǎnr yào, méi qù yīyuàn. Jīntiān xiàkè hòu, Wáng lǎoshī kàn wǒ bù shūfu, jiù sòng wǒ qù yīyuàn le.",
        english:
          "I've often had headaches these past few days. I bought some medicine from a pharmacy but didn't go to the hospital. After class today, Teacher Wang saw that I wasn't feeling well, so she took me to the hospital.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "从医院回来，李文也来看我了。",
        pinyin: "Cóng yīyuàn huílái, Lǐ Wén yě lái kàn wǒ le.",
        english:
          "After I came back from the hospital, Li Wen also came to see me.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "现在他们都回去了，我也要睡觉了。",
        pinyin: "Xiànzài tāmen dōu huíqù le, wǒ yě yào shuìjiào le.",
        english: "Now they have all gone home, and I'm going to sleep too.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "药店",
      pinyin: "yàodiàn",
      english: "Pharmacy",
      bangla: "ওষুধের দোকান",
      characters: [
        { hanzi: "药", pinyin: "yào", meaning: "Medicine" },
        { hanzi: "店", pinyin: "diàn", meaning: "Shop" },
      ],
      example: {
        hanzi: "我去药店买一些药。",
        pinyin: "Wǒ qù yàodiàn mǎi yīxiē yào.",
        english: "I am going to the pharmacy to buy some medicine.",
        bangla: "আমি ওষুধের দোকানে কিছু ওষুধ কিনতে যাচ্ছি।",
      },
      similar: [{ hanzi: "药房", pinyin: "yàofáng", english: "Pharmacy" }],
    },
  ],
};
