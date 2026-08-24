// app/data/vocabulary/lesson15-text3.ts
import { VocabularyData } from "@/types/vocabulary";

export const hsk2lesson15text3: VocabularyData = {
  hskLevel: 2,
  lesson: 15,
  text: 3,
  dialogue: {
    title: "Going Back to Beijing",
    lines: [
      {
        speaker: "Bai Jiayue",
        hanzi: "李文，你有一年没回国了吧？",
        pinyin: "Lǐ Wén, nǐ yǒu yì nián méi huí guó le ba?",
        english:
          "Li Wen, you haven't gone back to your country for a year, right?",
      },
      {
        speaker: "Li Wen",
        hanzi: "不到一年。我六月的时候回去了一次。",
        pinyin: "Bú dào yì nián. Wǒ Liùyuè de shíhou huíqù le yí cì.",
        english: "Not quite a year. I went back once in June.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我怎么忘了？还是我送你去的机场呢。",
        pinyin: "Wǒ zěnme wàng le? Hái shì wǒ sòng nǐ qù de jīchǎng ne.",
        english: "How did I forget? I was the one who took you to the airport.",
      },
      {
        speaker: "Li Wen",
        hanzi: "是啊。",
        pinyin: "Shì a.",
        english: "Yes.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "我记得你那次的机票很便宜。",
        pinyin: "Wǒ jìde nǐ nà cì de jīpiào hěn piányi.",
        english: "I remember your plane ticket that time was very cheap.",
      },
      {
        speaker: "Li Wen",
        hanzi: "没错，可能因为那个时候去北京的人不多吧。",
        pinyin:
          "Méi cuò, kěnéng yīnwèi nàge shíhou qù Běijīng de rén bù duō ba.",
        english:
          "That's right. Maybe it was because there weren't many people going to Beijing at that time.",
      },
      {
        speaker: "Bai Jiayue",
        hanzi: "这次的机票虽然有点儿贵，但想到就要飞北京了，我还是很高兴的。",
        pinyin:
          "Zhè cì de jīpiào suīrán yǒudiǎnr guì, dàn xiǎngdào jiù yào fēi Běijīng le, wǒ hái shì hěn gāoxìng de.",
        english:
          "Although the plane ticket is a little expensive this time, I'm still very happy when I think that I'm about to fly to Beijing.",
      },
    ],
  },
  vocabulary: [
    {
      hanzi: "机场",
      pinyin: "jīchǎng",
      english: "Airport",
      bangla: "বিমানবন্দর",
      characters: [
        { hanzi: "机", pinyin: "jī", meaning: "Machine/Plane" },
        { hanzi: "场", pinyin: "chǎng", meaning: "Field/Place" },
      ],
      example: {
        hanzi: "我要在机场接朋友。",
        pinyin: "Wǒ yào zài jīchǎng jiē péngyou.",
        english: "I need to pick up a friend at the airport.",
        bangla: "আমি বিমানবন্দরে বন্ধুকে নিতে যাব।",
      },
      similar: [
        { hanzi: "航空港", pinyin: "hángkōnggǎng", english: "Airport" },
      ],
    },
    {
      hanzi: "机票",
      pinyin: "jīpiào",
      english: "Air ticket",
      bangla: "বিমানের টিকিট",
      characters: [
        { hanzi: "机", pinyin: "jī", meaning: "Plane" },
        { hanzi: "票", pinyin: "piào", meaning: "Ticket" },
      ],
      example: {
        hanzi: "我已经买好了机票。",
        pinyin: "Wǒ yǐjīng mǎihǎole jīpiào.",
        english: "I have already bought the air ticket.",
        bangla: "আমি ইতিমধ্যে বিমানের টিকিট কিনে ফেলেছি।",
      },
      similar: [
        { hanzi: "飞机票", pinyin: "fēijīpiào", english: "Airplane ticket" },
      ],
    },
    {
      hanzi: "飞",
      pinyin: "fēi",
      english: "To fly",
      bangla: "ওড়া/উড়ে যাওয়া",
      characters: [{ hanzi: "飞", pinyin: "fēi", meaning: "Fly" }],
      example: {
        hanzi: "鸟儿在天上飞。",
        pinyin: "Niǎor zài tiānshàng fēi.",
        english: "Birds are flying in the sky.",
        bangla: "পাখিরা আকাশে উড়ছে।",
      },
      similar: [{ hanzi: "飞行", pinyin: "fēixíng", english: "To fly/Flight" }],
    },
  ],
};
