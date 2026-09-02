// app/data/vocabulary/lesson8-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson8text3: VocabularyData = {
  hskLevel: 3,
  lesson: 8,
  text: 3,
  dialogue: {
    title: "Hospital Visit",
    lines: [
      {
        speaker: "Anni",
        hanzi: "你怎么突然住院了？大家都很担心你。",
        pinyin: "Nǐ zěnme tūrán zhùyuàn le? Dàjiā dōu hěn dānxīn nǐ.",
        english: "Why were you hospitalized all of a sudden? Everyone was very worried about you.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "我的腿疼了几个星期了，医生说需要住院做检查。",
        pinyin: "Wǒ de tuǐ téng le jǐ gè xīngqī le, yīshēng shuō xūyào zhùyuàn zuò jiǎnchá.",
        english: "My leg has been hurting for a few weeks, the doctor said I needed to be hospitalized for tests.",
      },
      {
        speaker: "Anni",
        hanzi: "你看起来一点儿也不像病人。",
        pinyin: "Nǐ kàn qǐlái yìdiǎnr yě bú xiàng bìngrén.",
        english: "You don't look like a sick person at all.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "是啊，我很少生病。我上次来医院已经过去差不多两年了。",
        pinyin: "Shì a, wǒ hěn shǎo shēngbìng. Wǒ shàng cì lái yīyuàn yǐjīng guòqù chàbuduō liǎng nián le.",
        english: "Yeah, I rarely get sick. The last time I came to the hospital was almost two years ago.",
      },
      {
        speaker: "Anni",
        hanzi: "你每天跑步，有时候还去游泳，是不是运动太多了？",
        pinyin: "Nǐ měitiān pǎobù, yǒushíhou hái qù yóuyǒng, shì bú shì yùndòng tài duō le?",
        english: "You jog every day, and sometimes go swimming, could it be that you exercise too much?",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "医生也这么说，但是还得做完检查才能知道。",
        pinyin: "Yīshēng yě zhème shuō, dànshì hái děi zuò wán jiǎnchá cái néng zhīdào.",
        english: "The doctor said so too, but we still have to finish all tests to know for sure.",
      },
      {
        speaker: "Anni",
        hanzi: "别担心！听医生的话，好好休息，你的腿一定能好。",
        pinyin: "Bié dānxīn! Tīng yīshēng de huà, hǎohǎo xiūxi, nǐ de tuǐ yídìng néng hǎo.",
        english: "Don't worry! Listen to the doctor, rest well, and your leg will definitely get better.",
      },
      {
        speaker: "Chen Tianzhong",
        hanzi: "谢谢。有人来看看我，我就开心多了。",
        pinyin: "Xièxie. Yǒu rén lái kànkan wǒ, wǒ jiù kāixīn duō le.",
        english: "Thank you. I feel much happier when people come to visit me.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "突然",
      pinyin: "tūrán",
      english: "Sudden/Suddenly",
      bangla: "হঠাৎ",
      characters: [
        { hanzi: "突", pinyin: "tū", meaning: "Suddenly" },
        { hanzi: "然", pinyin: "rán", meaning: "Like that" },
      ],
      example: {
        hanzi: "他突然来了。",
        pinyin: "Tā tūrán lái le.",
        english: "He suddenly came.",
        bangla: "সে হঠাৎ চলে এল।",
      },
      similar: [{ hanzi: "忽然", pinyin: "hūrán", english: "Suddenly" }],
    },
    {
      hanzi: "住院",
      pinyin: "zhùyuàn",
      english: "Be hospitalized",
      bangla: "হাসপাতালে ভর্তি",
      characters: [
        { hanzi: "住", pinyin: "zhù", meaning: "Stay" },
        { hanzi: "院", pinyin: "yuàn", meaning: "Institution" },
      ],
      example: {
        hanzi: "他住院了。",
        pinyin: "Tā zhùyuàn le.",
        english: "He was hospitalized.",
        bangla: "সে হাসপাতালে ভর্তি হয়েছে।",
      },
      similar: [{ hanzi: "入院", pinyin: "rùyuàn", english: "Admit to hospital" }],
    },
    {
      hanzi: "担心",
      pinyin: "dānxīn",
      english: "Worry",
      bangla: "চিন্তা করা",
      characters: [
        { hanzi: "担", pinyin: "dān", meaning: "Carry" },
        { hanzi: "心", pinyin: "xīn", meaning: "Heart" },
      ],
      example: {
        hanzi: "我很担心你。",
        pinyin: "Wǒ hěn dānxīn nǐ.",
        english: "I am very worried about you.",
        bangla: "আমি তোমার জন্য খুব চিন্তিত।",
      },
      similar: [{ hanzi: "忧虑", pinyin: "yōulǜ", english: "Worry" }],
    },
    {
      hanzi: "腿",
      pinyin: "tuǐ",
      english: "Leg",
      bangla: "পা",
      characters: [
        { hanzi: "月", pinyin: "yuè", meaning: "Body part" },
        { hanzi: "退", pinyin: "tuì", meaning: "Retreat" },
      ],
      example: {
        hanzi: "我的腿很疼。",
        pinyin: "Wǒ de tuǐ hěn téng.",
        english: "My leg hurts a lot.",
        bangla: "আমার পা খুব ব্যথা করছে।",
      },
      similar: [{ hanzi: "脚", pinyin: "jiǎo", english: "Foot" }],
    },
    {
      hanzi: "病人",
      pinyin: "bìngrén",
      english: "Patient",
      bangla: "রোগী",
      characters: [
        { hanzi: "病", pinyin: "bìng", meaning: "Sick" },
        { hanzi: "人", pinyin: "rén", meaning: "Person" },
      ],
      example: {
        hanzi: "医院里有很多病人。",
        pinyin: "Yīyuàn lǐ yǒu hěnduō bìngrén.",
        english: "There are many patients in the hospital.",
        bangla: "হাসপাতালে অনেক রোগী আছে।",
      },
      similar: [{ hanzi: "患者", pinyin: "huànzhě", english: "Patient" }],
    },
    {
      hanzi: "差不多",
      pinyin: "chàbuduō",
      english: "Almost",
      bangla: "প্রায়",
      characters: [
        { hanzi: "差", pinyin: "chà", meaning: "Difference" },
        { hanzi: "不", pinyin: "bù", meaning: "Not" },
        { hanzi: "多", pinyin: "duō", meaning: "Many" },
      ],
      example: {
        hanzi: "差不多两个小时。",
        pinyin: "Chàbuduō liǎng gè xiǎoshí.",
        english: "Almost two hours.",
        bangla: "প্রায় দুই ঘণ্টা।",
      },
      similar: [{ hanzi: "大概", pinyin: "dàgài", english: "Roughly" }],
    },
    {
      hanzi: "得",
      pinyin: "děi",
      english: "Have to/Need to",
      bangla: "আবশ্যক",
      characters: [
        { hanzi: "彳", pinyin: "chì", meaning: "Step" },
        { hanzi: "日", pinyin: "rì", meaning: "Sun" },
        { hanzi: "寸", pinyin: "cùn", meaning: "Inch" },
      ],
      example: {
        hanzi: "你得去看看。",
        pinyin: "Nǐ děi qù kànkan.",
        english: "You have to go see.",
        bangla: "তোমাকে গিয়ে দেখতে হবে।",
      },
      similar: [{ hanzi: "必须", pinyin: "bìxū", english: "Must" }],
    },
    {
      hanzi: "开心",
      pinyin: "kāixīn",
      english: "Happy",
      bangla: "খুশি",
      characters: [
        { hanzi: "开", pinyin: "kāi", meaning: "Open" },
        { hanzi: "心", pinyin: "xīn", meaning: "Heart" },
      ],
      example: {
        hanzi: "我很开心。",
        pinyin: "Wǒ hěn kāixīn.",
        english: "I am very happy.",
        bangla: "আমি খুব খুশি।",
      },
      similar: [{ hanzi: "高兴", pinyin: "gāoxìng", english: "Happy" }],
    },
  ],
};