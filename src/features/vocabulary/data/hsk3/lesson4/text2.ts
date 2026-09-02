// app/data/vocabulary/lesson4-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson4text2: VocabularyData = {
  hskLevel: 3,
  lesson: 4,
  text: 2,
  dialogue: {
    title: "Preparing for the Trip",
    lines: [
      {
        speaker: "Yang Tongle",
        hanzi: "出去玩的机票买好了吗？",
        pinyin: "Chūqù wán de jīpiào mǎi hǎo le ma?",
        english: "Have you bought the plane tickets for the trip?",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "买好了。星期六上午十点一刻起飞。",
        pinyin: "Mǎi hǎo le. Xīngqīliù shàngwǔ shí diǎn yí kè qǐfēi.",
        english: "Yes. It takes off on Saturday morning at 10:15.",
      },
      {
        speaker: "Yang Tongle",
        hanzi: "宾馆也选好了吗？",
        pinyin: "Bīnguǎn yě xuǎn hǎo le ma?",
        english: "Have you chosen the hotel as well?",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "是的，这家宾馆很特别，跟别的都不一样，一出门就能看见牛和羊！",
        pinyin: "Shì de, zhè jiā bīnguǎn hěn tèbié, gēn bié de dōu bù yíyàng, yì chū mén jiù néng kànjiàn niú hé yáng!",
        english: "Yes, this hotel is very special, different from others; as soon as you step out, you can see cattle and sheep!",
      },
      {
        speaker: "Yang Tongle",
        hanzi: "太好了！你看看到底要带什么东西？",
        pinyin: "Tài hǎo le! Nǐ kànkan yào dài shénme dōngxi?",
        english: "Awesome! Take a look at what we need to bring?",
      },
      {
        speaker: "Wang Yifei",
        hanzi: "我们不用带太多东西，别忘了拿上新买的相机。",
        pinyin: "Wǒmen búyòng dài tài duō dōngxi, bié wàng le ná shang xīn mǎi de xiàngjī.",
        english: "We don't need to bring too much stuff, just don't forget to take the newly bought camera.",
      },
      {
        speaker: "Yang Tongle",
        hanzi: "一定不会忘带的。我现在就去准备行李。",
        pinyin: "Yídìng bú huì wàng dài de. Wǒ xiànzài jiù qù zhǔnbèi xíngli.",
        english: "Definitely won't forget it. I'm going to pack the luggage right now.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "刻",
      pinyin: "kè",
      english: "Quarter (15 minutes)",
      bangla: "এক কোয়ার্টার",
      characters: [
        { hanzi: "刂", pinyin: "dāo", meaning: "Knife" },
        { hanzi: "亥", pinyin: "hài", meaning: "Pig" },
      ],
      example: {
        hanzi: "十点一刻。",
        pinyin: "Shí diǎn yí kè.",
        english: "Quarter past ten.",
        bangla: "সাড়ে দশটা বাজে।",
      },
      similar: [{ hanzi: "小时", pinyin: "xiǎoshí", english: "Hour" }],
    },
    {
      hanzi: "起飞",
      pinyin: "qǐfēi",
      english: "Take off",
      bangla: "টেক অফ করা",
      characters: [
        { hanzi: "起", pinyin: "qǐ", meaning: "Rise" },
        { hanzi: "飞", pinyin: "fēi", meaning: "Fly" },
      ],
      example: {
        hanzi: "飞机马上起飞。",
        pinyin: "Fēijī mǎshàng qǐfēi.",
        english: "The plane is taking off soon.",
        bangla: "প্লেন এখনই টেক অফ করবে।",
      },
      similar: [{ hanzi: "降落", pinyin: "jiàngluò", english: "Land" }],
    },
    {
      hanzi: "宾馆",
      pinyin: "bīnguǎn",
      english: "Hotel",
      bangla: "হোটেল",
      characters: [
        { hanzi: "宾", pinyin: "bīn", meaning: "Guest" },
        { hanzi: "馆", pinyin: "guǎn", meaning: "Building" },
      ],
      example: {
        hanzi: "我们住在宾馆。",
        pinyin: "Wǒmen zhù zài bīnguǎn.",
        english: "We are staying at a hotel.",
        bangla: "আমরা হোটেলে থাকি।",
      },
      similar: [{ hanzi: "酒店", pinyin: "jiǔdiàn", english: "Hotel" }],
    },
    {
      hanzi: "特别",
      pinyin: "tèbié",
      english: "Special/Especially",
      bangla: "বিশেষ",
      characters: [
        { hanzi: "特", pinyin: "tè", meaning: "Special" },
        { hanzi: "别", pinyin: "bié", meaning: "Other" },
      ],
      example: {
        hanzi: "这家店特别好吃。",
        pinyin: "Zhè jiā diàn tèbié hǎochī.",
        english: "This restaurant is especially delicious.",
        bangla: "এই দোকানটার খাবার বিশেষভাবে সুস্বাদু।",
      },
      similar: [{ hanzi: "特殊", pinyin: "tèshū", english: "Special" }],
    },
    {
      hanzi: "别的",
      pinyin: "biéde",
      english: "Other",
      bangla: "অন্যান্য",
      characters: [
        { hanzi: "别", pinyin: "bié", meaning: "Other" },
        { hanzi: "的", pinyin: "de", meaning: "Possessive" },
      ],
      example: {
        hanzi: "别的我都不要。",
        pinyin: "Biéde wǒ dōu bú yào.",
        english: "I don't want anything else.",
        bangla: "আমি অন্য কিছু চাই না।",
      },
      similar: [{ hanzi: "其它", pinyin: "qítā", english: "Other" }],
    },
    {
      hanzi: "一样",
      pinyin: "yíyàng",
      english: "The same",
      bangla: "একই",
      characters: [
        { hanzi: "一", pinyin: "yī", meaning: "One" },
        { hanzi: "样", pinyin: "yàng", meaning: "Kind" },
      ],
      example: {
        hanzi: "他们长得一样。",
        pinyin: "Tāmen zhǎng de yíyàng.",
        english: "They look the same.",
        bangla: "তারা দেখতে একই রকম।",
      },
      similar: [{ hanzi: "相同", pinyin: "xiāngtóng", english: "Identical" }],
    },
    {
      hanzi: "牛",
      pinyin: "niú",
      english: "Cattle/Cow",
      bangla: "গরু",
      characters: [
        { hanzi: "牛", pinyin: "niú", meaning: "Cow" },
      ],
      example: {
        hanzi: "草原上有牛。",
        pinyin: "Cǎoyuán shang yǒu niú.",
        english: "There are cows on the grassland.",
        bangla: "তৃণভূমিতে গরু আছে।",
      },
      similar: [{ hanzi: "奶牛", pinyin: "nǎiniú", english: "Dairy cow" }],
    },
    {
      hanzi: "相机",
      pinyin: "xiàngjī",
      english: "Camera",
      bangla: "ক্যামেরা",
      characters: [
        { hanzi: "相", pinyin: "xiàng", meaning: "Picture" },
        { hanzi: "机", pinyin: "jī", meaning: "Machine" },
      ],
      example: {
        hanzi: "我用相机拍照。",
        pinyin: "Wǒ yòng xiàngjī pāizhào.",
        english: "I take photos with a camera.",
        bangla: "আমি ক্যামেরা দিয়ে ছবি তুলি।",
      },
      similar: [{ hanzi: "手机", pinyin: "shǒujī", english: "Mobile phone" }],
    },
  ],
};