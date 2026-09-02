// app/data/vocabulary/lesson3-text1.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson3text1: VocabularyData = {
  hskLevel: 2,
  lesson: 3,
  text: 1,
  dialogue: {
    title: "After Work",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "今天回来这么晚啊！",
        pinyin: "Jīntiān huílái zhème wǎn a!",
        english: "You came back so late today!",
      },
      {
        speaker: "Liu Ming",
        hanzi: "工作太多了，下班的时候没做完。",
        pinyin: "Gōngzuò tài duō le, xiàbān de shíhou méi zuòwán.",
        english:
          "There was too much work, and I hadn't finished it when it was time to get off work.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "菜都做好了，过来吃饭吧。",
        pinyin: "Cài dōu zuòhǎo le, guòlái chīfàn ba.",
        english: "The dishes are all ready. Come over and eat.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "我想休息一下，喝杯水。",
        pinyin: "Wǒ xiǎng xiūxi yíxià, hē bēi shuǐ.",
        english: "I want to rest for a while and have a glass of water.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "好的。",
        pinyin: "Hǎo de.",
        english: "Okay.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "我们找个时间去旅游，怎么样？",
        pinyin: "Wǒmen zhǎo ge shíjiān qù lǚyóu, zěnmeyàng?",
        english: "How about we find some time to go traveling?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "好啊，我也很想一起出去玩。",
        pinyin: "Hǎo a, wǒ yě hěn xiǎng yìqǐ chūqù wán.",
        english: "Sure, I also really want to go out and have fun together.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "你想去哪儿？",
        pinyin: "Nǐ xiǎng qù nǎr?",
        english: "Where do you want to go?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "我还没想好呢。",
        pinyin: "Wǒ hái méi xiǎnghǎo ne.",
        english: "I haven't decided yet.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "那你再想一想，你想好了，我来买票。",
        pinyin: "Nà nǐ zài xiǎng yì xiǎng, nǐ xiǎnghǎo le, wǒ lái mǎi piào.",
        english:
          "Then think about it some more. Once you've decided, I'll buy the tickets.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "回来",
      pinyin: "huílái",
      english: "Come back",
      bangla: "ফিরে আসা",
      characters: [
        { hanzi: "回", pinyin: "huí", meaning: "Return" },
        { hanzi: "来", pinyin: "lái", meaning: "Come" },
      ],
      example: {
        hanzi: "你什么时候回来？",
        pinyin: "Nǐ shénme shíhou huílái?",
        english: "When will you come back?",
        bangla: "তুমি কখন ফিরে আসবে?",
      },
      similar: [{ hanzi: "归来", pinyin: "guīlái", english: "Come back" }],
    },
    {
      hanzi: "这么",
      pinyin: "zhème",
      english: "So/Such",
      bangla: "এইরকম/এত",
      characters: [
        { hanzi: "这", pinyin: "zhè", meaning: "This" },
        { hanzi: "么", pinyin: "me", meaning: "Suffix" },
      ],
      example: {
        hanzi: "你为什么这么高兴？",
        pinyin: "Nǐ wèishénme zhème gāoxìng?",
        english: "Why are you so happy?",
        bangla: "তুমি এত খুশি কেন?",
      },
      similar: [{ hanzi: "这样", pinyin: "zhèyàng", english: "This way/Such" }],
    },
    {
      hanzi: "完",
      pinyin: "wán",
      english: "Finish/Complete",
      bangla: "শেষ করা/সম্পন্ন হওয়া",
      characters: [{ hanzi: "完", pinyin: "wán", meaning: "Finish/Complete" }],
      example: {
        hanzi: "我做完了我的工作。",
        pinyin: "Wǒ zuò wán le wǒ de gōngzuò.",
        english: "I have finished my work.",
        bangla: "আমি আমার কাজ শেষ করেছি।",
      },
      similar: [{ hanzi: "结束", pinyin: "jiéshù", english: "Finish/End" }],
    },
  ],
};
