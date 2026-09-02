// app/data/vocabulary/lesson16-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk3lesson16text1: VocabularyData = {
  hskLevel: 3,
  lesson: 16,
  text: 1,
  dialogue: {
    title: "A Little Kitten",
    lines: [
      {
        speaker: "Liu Xiaoxue",
        hanzi: "这只小猫你们养了多久了？",
        pinyin: "Zhè zhī xiǎomāo nǐmen yǎng le duōjiǔ le?",
        english: "How long have you been keeping this kitten?",
      },
      {
        speaker: "Server",
        hanzi: "已经一年多了。第一天看见它的时候，它又脏又小。",
        pinyin: "Yǐjīng yì nián duō le. Dì-yī tiān kànjiàn tā de shíhou, tā yòu zāng yòu xiǎo.",
        english: "Already for more than a year. The first day I saw it, it was both dirty and small.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "现在它变得又干净又漂亮了。",
        pinyin: "Xiànzài tā biànde yòu gānjìng yòu piàoliang le.",
        english: "Now it has become both clean and pretty.",
      },
      {
        speaker: "Server",
        hanzi: "是啊。它还特别可爱，一会儿在你脚边睡觉，一会儿在你身上爬。",
        pinyin: "Shì a. Tā hái tèbié kě'ài, yìhuǐr zài nǐ jiǎobiān shuìjiào, yìhuǐr zài nǐ shēnshang pá.",
        english: "Yes. It is also extremely cute; one moment it sleeps near your feet, and the next moment it climbs on you.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "你们把它照顾得真好。",
        pinyin: "Nǐmen bǎ tā zhàogù de zhēn hǎo.",
        english: "You've taken such good care of it.",
      },
      {
        speaker: "Server",
        hanzi: "它就好像我们的孩子，我们照顾它，它也认得我们了。",
        pinyin: "Tā jiù hǎoxiàng wǒmen de háizi, wǒmen zhàogù tā, tā yě rènde wǒmen le.",
        english: "It's just like our child; we take care of it, and it also recognizes us.",
      },
      {
        speaker: "Liu Xiaoxue",
        hanzi: "妈妈，咱们家也养一只小猫吧。",
        pinyin: "Māma, zánmen jiā yě yǎng yì zhī xiǎomāo ba.",
        english: "Mom, let's also raise a kitten at our house.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "咱们没时间照顾，还是别养了，我周末带你们去北京动物园看动物吧。",
        pinyin: "Zánmen méi shíjiān zhàogù, háishi bié yǎng le, wǒ zhōumò dài nǐmen qù Běijīng Dòngwùyuán kàn dòngwù ba.",
        english: "We don't have time to take care of it, so better not raise one. I'll take you to the Beijing Zoo to see animals this weekend.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "脏",
      pinyin: "zāng",
      english: "Dirty",
      bangla: "নোংরা",
      characters: [
        { hanzi: "月", pinyin: "yuè", meaning: "Moon" },
        { hanzi: "脏", pinyin: "zāng", meaning: "Dirty" },
      ],
      example: {
        hanzi: "这件衣服很脏。",
        pinyin: "Zhè jiàn yīfu hěn zāng.",
        english: "This piece of clothing is very dirty.",
        bangla: "এই পোশাকটি খুব নোংরা।",
      },
      similar: [{ hanzi: "肮脏", pinyin: "āngzāng", english: "Dirty" }],
    },
    {
      hanzi: "可爱",
      pinyin: "kě'ài",
      english: "Cute",
      bangla: "কিউট",
      characters: [
        { hanzi: "可", pinyin: "kě", meaning: "Can" },
        { hanzi: "爱", pinyin: "ài", meaning: "Love" },
      ],
      example: {
        hanzi: "这只小猫很可爱。",
        pinyin: "Zhè zhī xiǎomāo hěn kě'ài.",
        english: "This kitten is very cute.",
        bangla: "এই বিড়ালছানাটি খুব সুন্দর।",
      },
      similar: [{ hanzi: "可爱", pinyin: "kě'ài", english: "Adorable" }],
    },
    {
      hanzi: "一会儿",
      pinyin: "yìhuǐr",
      english: "One moment... next",
      bangla: "কখনো... কখনো",
      characters: [
        { hanzi: "一", pinyin: "yī", meaning: "One" },
        { hanzi: "会", pinyin: "huì", meaning: "Moment" },
      ],
      example: {
        hanzi: "他一会儿来，一会儿走。",
        pinyin: "Tā yìhuǐr lái, yìhuǐr zǒu.",
        english: "He comes and goes.",
        bangla: "সে কখনো আসে, কখনো যায়।",
      },
      similar: [{ hanzi: "一会儿", pinyin: "yìhuǐr", english: "A while" }],
    },
    {
      hanzi: "脚",
      pinyin: "jiǎo",
      english: "Foot",
      bangla: "পা",
      characters: [
        { hanzi: "月", pinyin: "yuè", meaning: "Body part" },
        { hanzi: "却", pinyin: "què", meaning: "But" },
      ],
      example: {
        hanzi: "我的脚疼。",
        pinyin: "Wǒ de jiǎo téng.",
        english: "My foot hurts.",
        bangla: "আমার পা ব্যথা করছে।",
      },
      similar: [{ hanzi: "足", pinyin: "zú", english: "Foot" }],
    },
    {
      hanzi: "照顾",
      pinyin: "zhàogù",
      english: "Take care of",
      bangla: "যত্ন নেওয়া",
      characters: [
        { hanzi: "照", pinyin: "zhào", meaning: "Look after" },
        { hanzi: "顾", pinyin: "gù", meaning: "Care for" },
      ],
      example: {
        hanzi: "她照顾孩子。",
        pinyin: "Tā zhàogù háizi.",
        english: "She takes care of the children.",
        bangla: "সে বাচ্চাদের যত্ন নেয়।",
      },
      similar: [{ hanzi: "照料", pinyin: "zhàoliào", english: "Care for" }],
    },
    {
      hanzi: "好像",
      pinyin: "hǎoxiàng",
      english: "Seem/Be like",
      bangla: "মনে হওয়া",
      characters: [
        { hanzi: "好", pinyin: "hǎo", meaning: "Good" },
        { hanzi: "像", pinyin: "xiàng", meaning: "Like" },
      ],
      example: {
        hanzi: "他好像生病了。",
        pinyin: "Tā hǎoxiàng shēngbìng le.",
        english: "He seems to be sick.",
        bangla: "মনে হচ্ছে সে অসুস্থ।",
      },
      similar: [{ hanzi: "似乎", pinyin: "sìhū", english: "Seem" }],
    },
    {
      hanzi: "认得",
      pinyin: "rènde",
      english: "Recognize",
      bangla: "চিনতে পারা",
      characters: [
        { hanzi: "认", pinyin: "rèn", meaning: "Recognize" },
        { hanzi: "得", pinyin: "de", meaning: "Can" },
      ],
      example: {
        hanzi: "我认得他。",
        pinyin: "Wǒ rènde tā.",
        english: "I recognize him.",
        bangla: "আমি তাকে চিনি।",
      },
      similar: [{ hanzi: "认识", pinyin: "rènshi", english: "Know" }],
    },
    {
      hanzi: "周末",
      pinyin: "zhōumò",
      english: "Weekend",
      bangla: "সপ্তাহান্ত",
      characters: [
        { hanzi: "周", pinyin: "zhōu", meaning: "Week" },
        { hanzi: "末", pinyin: "mò", meaning: "End" },
      ],
      example: {
        hanzi: "周末我们去公园。",
        pinyin: "Zhōumò wǒmen qù gōngyuán.",
        english: "We go to the park on weekends.",
        bangla: "সপ্তাহান্তে আমরা পার্কে যাই।",
      },
      similar: [{ hanzi: "周末", pinyin: "zhōumò", english: "Weekend" }],
    },
    {
      hanzi: "动物园",
      pinyin: "dòngwùyuán",
      english: "Zoo",
      bangla: "চিড়িয়াখানা",
      characters: [
        { hanzi: "动", pinyin: "dòng", meaning: "Animal" },
        { hanzi: "物", pinyin: "wù", meaning: "Creature" },
        { hanzi: "园", pinyin: "yuán", meaning: "Park" },
      ],
      example: {
        hanzi: "动物园有很多动物。",
        pinyin: "Dòngwùyuán yǒu hěnduō dòngwù.",
        english: "There are many animals at the zoo.",
        bangla: "চিড়িয়াখানায় অনেক প্রাণী আছে।",
      },
      similar: [{ hanzi: "动物园", pinyin: "dòngwùyuán", english: "Zoo" }],
    },
    {
      hanzi: "动物",
      pinyin: "dòngwù",
      english: "Animal",
      bangla: "প্রাণী",
      characters: [
        { hanzi: "动", pinyin: "dòng", meaning: "Move" },
        { hanzi: "物", pinyin: "wù", meaning: "Thing" },
      ],
      example: {
        hanzi: "我喜欢动物。",
        pinyin: "Wǒ xǐhuan dòngwù.",
        english: "I like animals.",
        bangla: "আমি প্রাণী পছন্দ করি।",
      },
      similar: [{ hanzi: "动物", pinyin: "dòngwù", english: "Animal" }],
    },
  ],
};