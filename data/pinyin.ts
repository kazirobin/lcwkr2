/**
 * The Pinyin sound chart a learner reads aloud before recording their
 * Level 1 submission. Sounds and example characters are language-neutral
 * (they are the same in every UI language), so they live here rather than
 * in the translation files. Only the surrounding labels are translated.
 *
 * Order and example words follow the standard 声母表 / 单韵母 wall chart.
 */

export type PinyinSound = {
  /** The initial or final, written in Pinyin. */
  sound: string;
  /** A common example character that starts with / uses this sound. */
  hanzi: string;
  /** The example character's reading, with tone mark. */
  reading: string;
};

/** 声母 — the 23 initials. */
export const initials: PinyinSound[] = [
  { sound: "b", hanzi: "播", reading: "bō" },
  { sound: "p", hanzi: "泼", reading: "pō" },
  { sound: "m", hanzi: "摸", reading: "mō" },
  { sound: "f", hanzi: "佛", reading: "fó" },
  { sound: "d", hanzi: "得", reading: "dé" },
  { sound: "t", hanzi: "特", reading: "tè" },
  { sound: "n", hanzi: "讷", reading: "nè" },
  { sound: "l", hanzi: "勒", reading: "lè" },
  { sound: "g", hanzi: "鸽", reading: "gē" },
  { sound: "k", hanzi: "科", reading: "kē" },
  { sound: "h", hanzi: "喝", reading: "hē" },
  { sound: "j", hanzi: "鸡", reading: "jī" },
  { sound: "q", hanzi: "气", reading: "qì" },
  { sound: "x", hanzi: "西", reading: "xī" },
  { sound: "zh", hanzi: "知", reading: "zhī" },
  { sound: "ch", hanzi: "吃", reading: "chī" },
  { sound: "sh", hanzi: "师", reading: "shī" },
  { sound: "r", hanzi: "日", reading: "rì" },
  { sound: "z", hanzi: "字", reading: "zì" },
  { sound: "c", hanzi: "刺", reading: "cì" },
  { sound: "s", hanzi: "丝", reading: "sī" },
  { sound: "y", hanzi: "医", reading: "yī" },
  { sound: "w", hanzi: "屋", reading: "wū" },
];

/** 单韵母 — the 6 simple finals. */
export const finals: PinyinSound[] = [
  { sound: "a", hanzi: "啊", reading: "ā" },
  { sound: "o", hanzi: "哦", reading: "ó" },
  { sound: "e", hanzi: "鹅", reading: "é" },
  { sound: "i", hanzi: "衣", reading: "yī" },
  { sound: "u", hanzi: "乌", reading: "wū" },
  { sound: "ü", hanzi: "鱼", reading: "yú" },
];
