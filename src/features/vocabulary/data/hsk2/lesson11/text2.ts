// app/data/vocabulary/lesson11-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson11text2: VocabularyData = {
  hskLevel: 2,
  lesson: 11,
  text: 2,
  dialogue: {
    title: "On the Way to the Hospital",
    lines: [
      {
        speaker: "Wang Yifei",
        hanzi: "现在路上车多，还有下着雪，我开慢一点儿。",
        pinyin: "Xiànzài lùshang chē duō, hái xiàzhe xuě, wǒ kāi màn yìdiǎnr.",
        english:
          "There are a lot of cars on the road now, and it's also snowing, so I'll drive a little slower.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "没问题，现在头没那么疼了。",
        pinyin: "Méi wèntí, xiànzài tóu méi nàme téng le.",
        english: "No problem. My head doesn't hurt as much now.",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "好。李文来电话了，你帮我接一下。",
        pinyin: "Hǎo. Lǐ Wén lái diànhuà le, nǐ bāng wǒ jiē yíxià.",
        english: "Okay. Li Wen is calling. Please answer the phone for me.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "喂，李文，王老师开着车呢，你找她有事吗？",
        pinyin:
          "Wéi, Lǐ Wén, Wáng lǎoshī kāizhe chē ne, nǐ zhǎo tā yǒu shì ma?",
        english:
          "Hello, Li Wen. Teacher Wang is driving. Do you need to talk to her about something?",
      },
      {
        speaker: "Li Wen",
        hanzi: "没什么事。今天雪这么大，你们开车去哪儿啊？",
        pinyin: "Méi shénme shì. Jīntiān xuě zhème dà, nǐmen kāichē qù nǎr a?",
        english:
          "Nothing much. It's snowing so heavily today. Where are you driving to?",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "去医院，我头有点儿疼。",
        pinyin: "Qù yīyuàn, wǒ tóu yǒudiǎnr téng.",
        english: "We're going to the hospital. I have a bit of a headache.",
      },
      {
        speaker: "Li Wen",
        hanzi: "那我一会儿去看看你。",
        pinyin: "Nà wǒ yíhuìr qù kànkan nǐ.",
        english: "Then I'll come see you in a little while.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "路上",
      pinyin: "lùshang",
      english: "On the way/On the road",
      bangla: "রাস্তায়/পথে",
      characters: [
        { hanzi: "路", pinyin: "lù", meaning: "Road" },
        { hanzi: "上", pinyin: "shàng", meaning: "On/Above" },
      ],
      example: {
        hanzi: "我在路上。",
        pinyin: "Wǒ zài lùshang.",
        english: "I am on the way.",
        bangla: "আমি পথে আছি।",
      },
      similar: [{ hanzi: "途中", pinyin: "túzhōng", english: "En route" }],
    },
    {
      hanzi: "慢",
      pinyin: "màn",
      english: "Slow",
      bangla: "ধীর",
      characters: [{ hanzi: "慢", pinyin: "màn", meaning: "Slow" }],
      example: {
        hanzi: "请慢一点儿。",
        pinyin: "Qǐng màn yīdiǎnr.",
        english: "Please be a bit slower.",
        bangla: "অনুগ্রহ করে একটু ধীরে করুন।",
      },
      similar: [{ hanzi: "迟缓", pinyin: "chíhuǎn", english: "Sluggish" }],
    },
  ],
};
