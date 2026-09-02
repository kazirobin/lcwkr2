// app/data/vocabulary/lesson8-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson8text2: VocabularyData = {
  hskLevel: 3,
  lesson: 8,
  text: 2,
  dialogue: {
    title: "Feeling Sick",
    lines: [
      {
        speaker: "Anni",
        hanzi: "你怎么了？看上去有点儿不舒服。",
        pinyin: "Nǐ zěnme le? Kàn shangqù yǒudiǎnr bù shūfu.",
        english: "What's wrong with you? You look a bit uncomfortable.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "昨天游完泳以后，耳朵一直有点儿疼。",
        pinyin: "Zuótiān yóu wán yǒng yǐhòu, ěrduo yìzhí yǒudiǎnr téng.",
        english: "After I finished swimming yesterday, my ear has been hurting a bit.",
      },
      {
        speaker: "Anni",
        hanzi: "是不是感冒了？发烧吗？",
        pinyin: "Shì bú shì gǎnmào le? Fāshāo ma?",
        english: "Is it a cold? Do you have a fever?",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "好像发低烧了。",
        pinyin: "Hǎoxiàng fā dīshāo le.",
        english: "It seems like I have a low fever.",
      },
      {
        speaker: "Anni",
        hanzi: "我送你去医院，让医生检查一下吧。",
        pinyin: "Wǒ sòng nǐ qù yīyuàn, ràng yīshēng jiǎnchá yíxià ba.",
        english: "Let me take you to the hospital and have the doctor check you.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "我先回去睡一觉，可能休息休息就好了。",
        pinyin: "Wǒ xiān huíqù shuì yí jiào, kěnéng xiūxi xiūxi jiù hǎo le.",
        english: "I'll go back and sleep first, maybe I'll get better after some rest.",
      },
      {
        speaker: "Anni",
        hanzi: "好吧，如果下午还发烧，就一定要去看医生。",
        pinyin: "Hǎo ba, rúguǒ xiàwǔ hái fāshāo, jiù yídìng yào qù kàn yīshēng.",
        english: "Alright, if you still have a fever this afternoon, you must go see a doctor.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "谢谢关心，我会注意的。",
        pinyin: "Xièxie guānxīn, wǒ huì zhùyì de.",
        english: "Thank you for your concern, I will be careful.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "耳朵",
      pinyin: "ěrduo",
      english: "Ear",
      bangla: "কান",
      characters: [
        { hanzi: "耳", pinyin: "ěr", meaning: "Ear" },
        { hanzi: "朵", pinyin: "duǒ", meaning: "Flower" },
      ],
      example: {
        hanzi: "我的耳朵疼。",
        pinyin: "Wǒ de ěrduo téng.",
        english: "My ear hurts.",
        bangla: "আমার কান ব্যথা করছে।",
      },
      similar: [{ hanzi: "耳", pinyin: "ěr", english: "Ear" }],
    },
    {
      hanzi: "感冒",
      pinyin: "gǎnmào",
      english: "Catch a cold",
      bangla: "ঠান্ডা লাগা",
      characters: [
        { hanzi: "感", pinyin: "gǎn", meaning: "Feel" },
        { hanzi: "冒", pinyin: "mào", meaning: "Risk" },
      ],
      example: {
        hanzi: "我感冒了。",
        pinyin: "Wǒ gǎnmào le.",
        english: "I caught a cold.",
        bangla: "আমার ঠান্ডা লেগেছে।",
      },
      similar: [{ hanzi: "伤风", pinyin: "shāngfēng", english: "Catch a cold" }],
    },
    {
      hanzi: "发烧",
      pinyin: "fāshāo",
      english: "Have a fever",
      bangla: "জ্বর হওয়া",
      characters: [
        { hanzi: "发", pinyin: "fā", meaning: "Send" },
        { hanzi: "烧", pinyin: "shāo", meaning: "Burn" },
      ],
      example: {
        hanzi: "我发烧了。",
        pinyin: "Wǒ fāshāo le.",
        english: "I have a fever.",
        bangla: "আমার জ্বর এসেছে।",
      },
      similar: [{ hanzi: "发热", pinyin: "fārè", english: "Have a fever" }],
    },
    {
      hanzi: "低",
      pinyin: "dī",
      english: "Low",
      bangla: "কম",
      characters: [
        { hanzi: "亻", pinyin: "rén", meaning: "Person" },
        { hanzi: "底", pinyin: "dǐ", meaning: "Bottom" },
      ],
      example: {
        hanzi: "低烧。",
        pinyin: "Dīshāo.",
        english: "Low fever.",
        bangla: "হালকা জ্বর।",
      },
      similar: [{ hanzi: "低矮", pinyin: "dī'ǎi", english: "Low" }],
    },
    {
      hanzi: "关心",
      pinyin: "guānxīn",
      english: "Be concerned",
      bangla: "যত্ন নেওয়া",
      characters: [
        { hanzi: "关", pinyin: "guān", meaning: "Concern" },
        { hanzi: "心", pinyin: "xīn", meaning: "Heart" },
      ],
      example: {
        hanzi: "父母很关心我。",
        pinyin: "Fùmǔ hěn guānxīn wǒ.",
        english: "My parents care about me.",
        bangla: "আমার বাবা-মা আমার অনেক যত্ন নেন।",
      },
      similar: [{ hanzi: "关怀", pinyin: "guānhuái", english: "Care for" }],
    },
    {
      hanzi: "注意",
      pinyin: "zhùyì",
      english: "Pay attention",
      bangla: "সতর্ক থাকা",
      characters: [
        { hanzi: "注", pinyin: "zhù", meaning: "Concentrate" },
        { hanzi: "意", pinyin: "yì", meaning: "Idea" },
      ],
      example: {
        hanzi: "注意安全。",
        pinyin: "Zhùyì ānquán.",
        english: "Pay attention to safety.",
        bangla: "নিরাপত্তার দিকে খেয়াল রাখো।",
      },
      similar: [{ hanzi: "小心", pinyin: "xiǎoxīn", english: "Be careful" }],
    },
  ],
};