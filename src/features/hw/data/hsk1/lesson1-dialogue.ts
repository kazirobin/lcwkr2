/**
 * Lesson 1 listening-practice dialogue script.
 *
 * HOW TO ADD MORE LESSONS LATER — copy this pattern:
 *   1. Take the raw dialogue text (lines starting with "：" like below)...
 *
 *      ：同学们好！
 *      ：老师好！
 *
 *   2. ...and write one entry per line, alternating speaker "A" / "B"
 *      (A = left bubble, B = right bubble), with pinyin + meanings:
 *
 *      { speaker: "A", hanzi: "同学们好！", pinyin: "Tóngxuémen hǎo!",
 *        en: "Hello, students!", bn: "হ্যালো, ছাত্ররা!" },
 *
 *   3. Export it (e.g. `lesson2Dialogue`) and render
 *      `<DialoguePlayer lines={lesson2Dialogue} />` on that lesson page.
 *
 * Playback uses the same device TTS as the vocabulary pages
 * (SpeakerButton per line + play-all), so it works offline.
 */

export interface HwDialogueLine {
  speaker: "A" | "B";
  hanzi: string;
  pinyin: string;
  en: string;
  bn: string;
}

export const lesson1Dialogue: HwDialogueLine[] = [
  { speaker: "A", hanzi: "同学们好！", pinyin: "Tóngxuémen hǎo!", en: "Hello, students!", bn: "হ্যালো, ছাত্ররা!" },
  { speaker: "B", hanzi: "老师好！", pinyin: "Lǎoshī hǎo!", en: "Hello, teacher!", bn: "হ্যালো, শিক্ষক!" },
  { speaker: "A", hanzi: "你好！你也是新学生吗？", pinyin: "Nǐ hǎo! Nǐ yě shì xīn xuéshēng ma?", en: "Hi! Are you a new student too?", bn: "হাই! তুমিও কি নতুন ছাত্র?" },
  { speaker: "B", hanzi: "是的。我叫...你呢？", pinyin: "Shì de. Wǒ jiào... nǐ ne?", en: "Yes. My name is... and you?", bn: "হ্যাঁ। আমার নাম... তুমি?" },
  { speaker: "A", hanzi: "我叫...", pinyin: "Wǒ jiào...", en: "My name is...", bn: "আমার নাম..." },
  { speaker: "B", hanzi: "很高兴认识你！", pinyin: "Hěn gāoxìng rènshi nǐ!", en: "Nice to meet you!", bn: "তোমার সাথে পরিচিত হয়ে ভালো লাগলো!" },
  { speaker: "A", hanzi: "认识你我也很高兴。再见！", pinyin: "Rènshi nǐ wǒ yě hěn gāoxìng. Zàijiàn!", en: "Nice to meet you too. Goodbye!", bn: "তোমার সাথে পরিচিত হয়ে আমিও খুশি। বিদায়!" },
  { speaker: "B", hanzi: "再见！", pinyin: "Zàijiàn!", en: "Goodbye!", bn: "বিদায়!" },
];
