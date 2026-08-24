// app/data/vocabulary/lesson11-text1.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson11text1: VocabularyData = {
  hskLevel: 2,
  lesson: 11,
  text: 1,
  dialogue: {
    title: "Going to the Hospital",
    lines: [
      {
        speaker: "Wang Yifei",
        hanzi: "家月，都下课了，你怎么还不回家？",
        pinyin: "Jiāyuè, dōu xiàkè le, nǐ zěnme hái bù huí jiā?",
        english:
          "Jiayue, class is already over. Why aren't you going home yet?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我头疼，不太舒服。",
        pinyin: "Wǒ tóu téng, bú tài shūfu.",
        english: "I have a headache. I don't feel very well.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "你这几天经常头疼，去医院看看吧。",
        pinyin: "Nǐ zhè jǐ tiān jīngcháng tóu téng, qù yīyuàn kànkan ba.",
        english:
          "You've been having headaches often these past few days. You should go to the hospital and get checked.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我想休息一下，现在不能动，一动就疼。",
        pinyin: "Wǒ xiǎng xiūxi yíxià, xiànzài bù néng dòng, yí dòng jiù téng.",
        english:
          "I want to rest for a while. I can't move right now; it hurts whenever I move.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "那你在这儿坐着，我去开车，一会儿送你去医院。",
        pinyin:
          "Nà nǐ zài zhèr zuòzhe, wǒ qù kāichē, yíhuìr sòng nǐ qù yīyuàn.",
        english:
          "Then sit here. I'll go get the car and take you to the hospital in a little while.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "谢谢王老师。",
        pinyin: "Xièxie Wáng lǎoshī.",
        english: "Thank you, Teacher Wang.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "头",
      pinyin: "tóu",
      english: "Head",
      bangla: "মাথা",
      characters: [{ hanzi: "头", pinyin: "tóu", meaning: "Head" }],
      example: {
        hanzi: "我头很疼。",
        pinyin: "Wǒ tóu hěn téng.",
        english: "My head hurts a lot.",
        bangla: "আমার মাথা খুব ব্যথা করছে।",
      },
      similar: [{ hanzi: "脑袋", pinyin: "nǎodai", english: "Head" }],
    },
    {
      hanzi: "疼",
      pinyin: "téng",
      english: "Painful/Ache",
      bangla: "ব্যথা হওয়া",
      characters: [{ hanzi: "疼", pinyin: "téng", meaning: "Pain" }],
      example: {
        hanzi: "你的脚还疼吗？",
        pinyin: "Nǐ de jiǎo hái téng ma?",
        english: "Does your foot still hurt?",
        bangla: "তোমার পা এখনও ব্যথা করছে?",
      },
      similar: [{ hanzi: "痛", pinyin: "tòng", english: "Pain/Hurt" }],
    },
    {
      hanzi: "经常",
      pinyin: "jīngcháng",
      english: "Often",
      bangla: "প্রায়ই",
      characters: [
        { hanzi: "经", pinyin: "jīng", meaning: "Pass through" },
        { hanzi: "常", pinyin: "cháng", meaning: "Often" },
      ],
      example: {
        hanzi: "他经常去图书馆。",
        pinyin: "Tā jīngcháng qù túshūguǎn.",
        english: "He often goes to the library.",
        bangla: "সে প্রায়ই লাইব্রেরিতে যায়।",
      },
      similar: [{ hanzi: "常常", pinyin: "chángcháng", english: "Often" }],
    },
    {
      hanzi: "动",
      pinyin: "dòng",
      english: "To move",
      bangla: "নড়াচড়া করা",
      characters: [{ hanzi: "动", pinyin: "dòng", meaning: "Move" }],
      example: {
        hanzi: "别动，让我看看。",
        pinyin: "Bié dòng, ràng wǒ kànkan.",
        english: "Don't move, let me take a look.",
        bangla: "নড়ো না, আমাকে দেখতে দাও।",
      },
      similar: [{ hanzi: "移动", pinyin: "yídòng", english: "To move" }],
    },
    {
      hanzi: "着",
      pinyin: "zhe",
      english: "Aspect particle (ongoing/static state)",
      bangla: "ক্রিয়ার চলমান বা স্থায়ী অবস্থা নির্দেশক কণা",
      characters: [{ hanzi: "着", pinyin: "zhe", meaning: "Aspect particle" }],
      example: {
        hanzi: "门开着。",
        pinyin: "Mén kāi zhe.",
        english: "The door is open.",
        bangla: "দরজা খোলা আছে।",
      },
      similar: [
        { hanzi: "正在", pinyin: "zhèngzài", english: "In the process of" },
      ],
    },
  ],
};
