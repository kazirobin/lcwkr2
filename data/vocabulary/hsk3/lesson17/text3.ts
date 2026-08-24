// app/data/vocabulary/lesson17-text3.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk3lesson17text3: VocabularyData = {
  hskLevel: 3,
  lesson: 17,
  text: 3,
  dialogue: {
    title: "Studying Abroad",
    lines: [
      {
        speaker: "Li Wen",
        hanzi: "天中，你的手机怎么关机了？",
        pinyin: "Tiānzhōng, nǐ de shǒujī zěnme guānjī le?",
        english: "Tianzhong, why is your phone turned off?",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "我的手机没电了。你找我有事吗？",
        pinyin: "Wǒ de shǒujī méi diàn le. Nǐ zhǎo wǒ yǒu shì ma?",
        english: "My phone ran out of battery. Did you need something from me?",
      },
      {
        speaker: "Li Wen",
        hanzi: "前天我看见家月了，她告诉我你打算继续留学？",
        pinyin: "Qiántiān wǒ kànjiàn Jiāyuè le, tā gàosu wǒ nǐ dǎsuàn jìxù liúxué?",
        english: "I saw Jiayue the day before yesterday, she told me you plan to continue studying abroad?",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "是，可是我还没想好学什么，更还没想好去哪个国家。",
        pinyin: "Shì, kěshì wǒ hái méi xiǎng hǎo xué shénme, gèng hái méi xiǎng hǎo qù nǎ gè guójiā.",
        english: "Yes, but I haven't decided what to study yet, let alone which country to go to.",
      },
      {
        speaker: "Li Wen",
        hanzi: "你可以去中国学中文啊。比如可以去北京、上海这样的大城市，那里有很多好大学，也有很多留学生。",
        pinyin: "Nǐ kěyǐ qù Zhōngguó xué Zhōngwén a. Bǐrú kěyǐ qù Běijīng, Shànghǎi zhèyàng de dà chéngshì, nàli yǒu hěn duō hǎo dàxué, yě yǒu hěn duō liúxuéshēng.",
        english: "You could go to China to study Chinese. For example, you could go to big cities like Beijing or Shanghai; there are many good universities and many international students there.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "好，那我上网查一查。",
        pinyin: "Hǎo, nà wǒ shàngwǎng chá yì chá.",
        english: "Okay, then I'll look it up online.",
      },
      {
        speaker: "Li Wen",
        hanzi: "我给你介绍几个有用的网站。",
        pinyin: "Wǒ gěi nǐ jièshào jǐ gè yǒuyòng de wǎngzhàn.",
        english: "I'll introduce a few useful websites to you.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "关机",
      pinyin: "guānjī",
      english: "Turn off phone",
      bangla: "ফোন বন্ধ করা",
      characters: [
        { hanzi: "关", pinyin: "guān", meaning: "Close" },
        { hanzi: "机", pinyin: "jī", meaning: "Machine" },
      ],
      example: {
        hanzi: "请关机。",
        pinyin: "Qǐng guānjī.",
        english: "Please turn off the phone.",
        bangla: "অনুগ্রহ করে ফোন বন্ধ করুন।",
      },
      similar: [{ hanzi: "关机", pinyin: "guānjī", english: "Power off" }],
    },
    {
      hanzi: "前天",
      pinyin: "qiántiān",
      english: "Day before yesterday",
      bangla: "পরশুদিন",
      characters: [
        { hanzi: "前", pinyin: "qián", meaning: "Before" },
        { hanzi: "天", pinyin: "tiān", meaning: "Day" },
      ],
      example: {
        hanzi: "前天我去了北京。",
        pinyin: "Qiántiān wǒ qù le Běijīng.",
        english: "I went to Beijing the day before yesterday.",
        bangla: "পরশু আমি বেইজিং গিয়েছিলাম।",
      },
      similar: [{ hanzi: "昨天", pinyin: "zuótiān", english: "Yesterday" }],
    },
    {
      hanzi: "留学",
      pinyin: "liúxué",
      english: "Study abroad",
      bangla: "বিদেশে পড়াশোনা",
      characters: [
        { hanzi: "留", pinyin: "liú", meaning: "Stay" },
        { hanzi: "学", pinyin: "xué", meaning: "Study" },
      ],
      example: {
        hanzi: "他去美国留学。",
        pinyin: "Tā qù Měiguó liúxué.",
        english: "He went to study abroad in the US.",
        bangla: "সে আমেরিকায় পড়তে গেছে।",
      },
      similar: [{ hanzi: "留学", pinyin: "liúxué", english: "Study abroad" }],
    },
    {
      hanzi: "国家",
      pinyin: "guójiā",
      english: "Country",
      bangla: "দেশ",
      characters: [
        { hanzi: "国", pinyin: "guó", meaning: "Country" },
        { hanzi: "家", pinyin: "jiā", meaning: "Home" },
      ],
      example: {
        hanzi: "中国是一个大国。",
        pinyin: "Zhōngguó shì yí gè dà guójiā.",
        english: "China is a big country.",
        bangla: "চীন একটি বড় দেশ।",
      },
      similar: [{ hanzi: "国家", pinyin: "guójiā", english: "Country" }],
    },
    {
      hanzi: "比如",
      pinyin: "bǐrú",
      english: "For example",
      bangla: "উদাহরণস্বরূপ",
      characters: [
        { hanzi: "比", pinyin: "bǐ", meaning: "Compare" },
        { hanzi: "如", pinyin: "rú", meaning: "Like" },
      ],
      example: {
        hanzi: "我喜欢运动，比如跑步。",
        pinyin: "Wǒ xǐhuan yùndòng, bǐrú pǎobù.",
        english: "I like sports, for example, running.",
        bangla: "আমি ব্যায়াম পছন্দ করি, যেমন দৌড়ানো।",
      },
      similar: [{ hanzi: "例如", pinyin: "lìrú", english: "For example" }],
    },
    {
      hanzi: "查",
      pinyin: "chá",
      english: "Look up",
      bangla: "খোঁজা",
      characters: [
        { hanzi: "木", pinyin: "mù", meaning: "Wood" },
        { hanzi: "旦", pinyin: "dàn", meaning: "Dawn" },
      ],
      example: {
        hanzi: "我查一下字典。",
        pinyin: "Wǒ chá yíxià zìdiǎn.",
        english: "I'll look it up in the dictionary.",
        bangla: "আমি অভিধানে খুঁজে দেখি।",
      },
      similar: [{ hanzi: "查找", pinyin: "cházhǎo", english: "Search" }],
    },
    {
      hanzi: "有用",
      pinyin: "yǒuyòng",
      english: "Useful",
      bangla: "দরকারী",
      characters: [
        { hanzi: "有", pinyin: "yǒu", meaning: "Have" },
        { hanzi: "用", pinyin: "yòng", meaning: "Use" },
      ],
      example: {
        hanzi: "这个软件很有用。",
        pinyin: "Zhège ruǎnjiàn hěn yǒuyòng.",
        english: "This software is very useful.",
        bangla: "এই সফটওয়্যারটি খুব দরকারী।",
      },
      similar: [{ hanzi: "有用", pinyin: "yǒuyòng", english: "Useful" }],
    },
  ],
};