// app/data/vocabulary/lesson5-text3.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson5text3: VocabularyData = {
  hskLevel: 2,
  lesson: 5,
  text: 3,
  dialogue: {
    title: "Having a Meal",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "都12点了，我们吃饭吧。",
        pinyin: "Dōu shí'èr diǎn le, wǒmen chī fàn ba.",
        english: "It's already 12 o'clock. Let's eat.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "这么多好吃的，您太客气了！",
        pinyin: "Zhème duō hǎochī de, nín tài kèqi le!",
        english: "There are so many delicious dishes. You're really too kind!",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "都是我自己做的，你们多吃点儿。",
        pinyin: "Dōu shì wǒ zìjǐ zuò de, nǐmen duō chī diǎnr.",
        english: "I made all of them myself. Please eat more.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "奶茶也很好喝，是您自己做的吗？",
        pinyin: "Nǎichá yě hěn hǎohē, shì nín zìjǐ zuò de ma?",
        english:
          "The bubble tea is also very delicious. Did you make it yourself?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "不是，奶茶是爷爷买的。",
        pinyin: "Bú shì, nǎichá shì yéye mǎi de.",
        english: "No, Grandpa bought the bubble tea.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "在哪儿买的？我还没喝过这么好喝的奶茶。",
        pinyin: "Zài nǎr mǎi de? Wǒ hái méi hēguo zhème hǎohē de nǎichá.",
        english:
          "Where did he buy it? I've never had bubble tea this delicious before.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "就在前边的商场，吃完饭你们可以跟我去看看。",
        pinyin:
          "Jiù zài qiánbiān de shāngchǎng, chī wán fàn nǐmen kěyǐ gēn wǒ qù kànkan.",
        english:
          "He bought it at the mall up ahead. After we finish eating, you can come with me to have a look.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "奶茶",
      pinyin: "nǎichá",
      english: "Milk tea",
      bangla: "দুধ চা",
      characters: [
        { hanzi: "奶", pinyin: "nǎi", meaning: "Milk" },
        { hanzi: "茶", pinyin: "chá", meaning: "Tea" },
      ],
      example: {
        hanzi: "我想喝一杯奶茶。",
        pinyin: "Wǒ xiǎng hē yī bēi nǎichá.",
        english: "I want to drink a cup of milk tea.",
        bangla: "আমি এক কাপ দুধ চা খেতে চাই।",
      },
      similar: [
        {
          hanzi: "珍珠奶茶",
          pinyin: "zhēnzhū nǎichá",
          english: "Bubble milk tea",
        },
      ],
    },
    {
      hanzi: "跟",
      pinyin: "gēn",
      english: "With",
      bangla: "সাথে",
      characters: [{ hanzi: "跟", pinyin: "gēn", meaning: "Heel/Follow" }],
      example: {
        hanzi: "我跟你一起去。",
        pinyin: "Wǒ gēn nǐ yīqǐ qù.",
        english: "I will go together with you.",
        bangla: "আমি তোমার সাথে যাব।",
      },
      similar: [{ hanzi: "和", pinyin: "hé", english: "With/And" }],
    },
  ],
};
