// app/data/vocabulary/lesson9-text2.ts
import { VocabularyData } from "@/features/vocabulary/types";

export const hsk2lesson9text2: VocabularyData = {
  hskLevel: 2,
  lesson: 9,
  text: 2,
  dialogue: {
    title: "Milk Tea or Coffee",
    lines: [
      {
        speaker: "Wang Yixue",
        hanzi: "门口有家奶茶店。你想喝杯奶茶吗？",
        pinyin: "Ménkǒu yǒu jiā nǎichádiàn. Nǐ xiǎng hē bēi nǎichá ma?",
        english:
          "There is a milk tea shop at the entrance. Do you want to have a cup of milk tea?",
      },
      {
        speaker: "Liu Ming",
        hanzi: "我想喝咖啡，还是去咖啡店吧。",
        pinyin: "Wǒ xiǎng hē kāfēi, háishi qù kāfēidiàn ba.",
        english: "I want to drink coffee. Let's go to the coffee shop instead.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "咖啡店离这儿有点儿远。",
        pinyin: "Kāfēidiàn lí zhèr yǒudiǎnr yuǎn.",
        english: "The coffee shop is a little far from here.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "没关系，那家店的咖啡很好喝。",
        pinyin: "Méi guānxi, nà jiā diàn de kāfēi hěn hǎo hē.",
        english: "That's okay. The coffee at that shop is very good.",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "那你等一下，我去买杯奶茶。",
        pinyin: "Nà nǐ děng yíxià, wǒ qù mǎi bēi nǎichá.",
        english: "Then wait a moment. I'll go buy a cup of milk tea.",
      },
      {
        speaker: "Liu Ming",
        hanzi: "你不想喝咖啡吗？",
        pinyin: "Nǐ bù xiǎng hē kāfēi ma?",
        english: "Don't you want to drink coffee?",
      },
      {
        speaker: "Wang Yixue",
        hanzi: "喝了咖啡，晚上就别想睡觉了。",
        pinyin: "Hē le kāfēi, wǎnshang jiù bié xiǎng shuìjiào le.",
        english: "If I drink coffee, I won't be able to sleep at night.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "门口",
      pinyin: "ménkǒu",
      english: "Entrance",
      bangla: "দরজা/প্রবেশদ্বার",
      characters: [
        { hanzi: "门", pinyin: "mén", meaning: "Door" },
        { hanzi: "口", pinyin: "kǒu", meaning: "Mouth/Opening" },
      ],
      example: {
        hanzi: "我们在门口见面吧。",
        pinyin: "Wǒmen zài ménkǒu jiànmiàn ba.",
        english: "Let's meet at the entrance.",
        bangla: "আমরা দরজার সামনে দেখা করি।",
      },
      similar: [{ hanzi: "入口", pinyin: "rùkǒu", english: "Entrance" }],
    },
    {
      hanzi: "咖啡",
      pinyin: "kāfēi",
      english: "Coffee",
      bangla: "কফি",
      characters: [
        { hanzi: "咖", pinyin: "kā", meaning: "Coffee (phonetic)" },
        { hanzi: "啡", pinyin: "fēi", meaning: "Coffee (phonetic)" },
      ],
      example: {
        hanzi: "我喜欢喝咖啡。",
        pinyin: "Wǒ xǐhuān hē kāfēi.",
        english: "I like to drink coffee.",
        bangla: "আমি কফি খেতে পছন্দ করি।",
      },
      similar: [{ hanzi: "茶", pinyin: "chá", english: "Tea" }],
    },
    {
      hanzi: "离",
      pinyin: "lí",
      english: "Away from",
      bangla: "থেকে দূরে",
      characters: [{ hanzi: "离", pinyin: "lí", meaning: "Leave/Distance" }],
      example: {
        hanzi: "我家离学校很近。",
        pinyin: "Wǒ jiā lí xuéxiào hěn jìn.",
        english: "My home is very close to the school.",
        bangla: "আমার বাড়ি স্কুলের খুব কাছে।",
      },
      similar: [{ hanzi: "距", pinyin: "jù", english: "From/Distance" }],
    },
  ],
};
