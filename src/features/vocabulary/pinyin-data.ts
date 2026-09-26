// src/features/vocabulary/pinyin-data.ts
//
// Foundational pinyin: every initial (b…s) and every major final (a…ong)
// is represented by real syllables with hanzi and a short gloss.
// Pinyin are stored with a trailing tone digit; the UI renders the
// proper diacritic form, and SpeechSynthesis reads the plain syllable.

export interface Syllable {
  /** Initial, e.g. "b". "" for zero-initial syllables. */
  initial: string;
  /** Final, e.g. "a". */
  final: string;
  /** Pinyin with tone digit, e.g. "ba1". */
  pinyin: string;
  /** Hanzi for this syllable, e.g. "巴". */
  hanzi: string;
  /** Short gloss in the target language. */
  meaning: string;
}

// prettier-ignore
export const syllables: Syllable[] = [
  // ---- initials: b -------------------------------------------------
  { initial: "b", final: "a",  pinyin: "ba1",  hanzi: "巴", meaning: "to expect; to wait for" },
  { initial: "b", final: "o",  pinyin: "bo1",  hanzi: "波", meaning: "wave" },
  { initial: "b", final: "ie", pinyin: "bie2", hanzi: "别", meaning: "to separate; other" },
  { initial: "b", final: "in", pinyin: "bin1", hanzi: "滨", meaning: "shore; to be near" },
  { initial: "b", final: "ing", pinyin: "bing1", hanzi: "冰", meaning: "ice" },
  { initial: "b", final: "u",  pinyin: "bu4",  hanzi: "不", meaning: "not" },

  // ---- initials: p -------------------------------------------------
  { initial: "p", final: "a",  pinyin: "pa1",  hanzi: "趴", meaning: "to lie prone" },
  { initial: "p", final: "o",  pinyin: "po2",  hanzi: "婆", meaning: "old woman" },
  { initial: "p", final: "ian", pinyin: "pian1", hanzi: "片", meaning: "piece; slice" },
  { initial: "p", final: "in", pinyin: "pin2", hanzi: "频", meaning: "frequent" },
  { initial: "p", final: "ing", pinyin: "ping2", hanzi: "平", meaning: "flat; level" },

  // ---- initials: m -------------------------------------------------
  { initial: "m", final: "a",  pinyin: "ma1",  hanzi: "马", meaning: "horse" },
  { initial: "m", final: "o",  pinyin: "mo2",  hanzi: "墨", meaning: "ink" },
  { initial: "m", final: "i",  pinyin: "mi3",  hanzi: "米", meaning: "rice" },
  { initial: "m", final: "in", pinyin: "min2", hanzi: "民", meaning: "people" },
  { initial: "m", final: "ao", pinyin: "mao2", hanzi: "毛", meaning: "hair; fuzzy" },
  { initial: "m", final: "ian", pinyin: "mian1", hanzi: "棉", meaning: "cotton" },

  // ---- initials: f -------------------------------------------------
  { initial: "f", final: "a",  pinyin: "fa1",  hanzi: "发", meaning: "to develop; hair" },
  { initial: "f", final: "en", pinyin: "fen1", hanzi: "分", meaning: "to divide" },
  { initial: "f", final: "u",  pinyin: "fu4",  hanzi: "付", meaning: "to pay" },
  { initial: "f", final: "u",  pinyin: "fu2",  hanzi: "服", meaning: "clothes; to serve" },
  { initial: "f", final: "ei", pinyin: "fei4", hanzi: "飞", meaning: "to fly" },
  { initial: "f", final: "an", pinyin: "fan2", hanzi: "反", meaning: "opposite; to turn" },

  // ---- initials: d -------------------------------------------------
  { initial: "d", final: "a",  pinyin: "da1",  hanzi: "打", meaning: "to hit" },
  { initial: "d", final: "e",  pinyin: "de5",  hanzi: "的", meaning: "of; structural particle" },
  { initial: "d", final: "ai", pinyin: "dai4", hanzi: "带", meaning: "to lead; belt" },
  { initial: "d", final: "ing", pinyin: "ding1", hanzi: "丁", meaning: "male; worker" },
  { initial: "d", final: "an", pinyin: "dan1", hanzi: "单", meaning: "single; simple" },
  { initial: "d", final: "ie", pinyin: "die2", hanzi: "碟", meaning: "plate" },

  // ---- initials: t -------------------------------------------------
  { initial: "t", final: "a",  pinyin: "ta1",  hanzi: "她", meaning: "she" },
  { initial: "t", final: "e",  pinyin: "te4",  hanzi: "特", meaning: "special" },
  { initial: "t", final: "ai", pinyin: "tai4", hanzi: "太", meaning: "too; very" },
  { initial: "t", final: "ing", pinyin: "ting1", hanzi: "听", meaning: "to listen" },
  { initial: "t", final: "uan", pinyin: "tuan1", hanzi: "团", meaning: "group; circle" },
  { initial: "t", final: "ui", pinyin: "tui4", hanzi: "腿", meaning: "leg" },

  // ---- initials: n -------------------------------------------------
  { initial: "n", final: "a",  pinyin: "na3",  hanzi: "拿", meaning: "to take" },
  { initial: "n", final: "e",  pinyin: "ne5",  hanzi: "呢", meaning: "question particle" },
  { initial: "n", final: "i",  pinyin: "ni3",  hanzi: "你", meaning: "you" },
  { initial: "n", final: "v",  pinyin: "nv3",  hanzi: "女", meaning: "woman" },
  { initial: "n", final: "an", pinyin: "nan2", hanzi: "男", meaning: "male" },
  { initial: "n", final: "iao", pinyin: "niao3", hanzi: "鸟", meaning: "bird" },

  // ---- initials: l -------------------------------------------------
  { initial: "l", final: "a",  pinyin: "la1",  hanzi: "拉", meaning: "to pull" },
  { initial: "l", final: "e",  pinyin: "le5",  hanzi: "了", meaning: "aspect particle" },
  { initial: "l", final: "i",  pinyin: "li3",  hanzi: "里", meaning: "inside" },
  { initial: "l", final: "v",  pinyin: "lv4",  hanzi: "绿", meaning: "green" },
  { initial: "l", final: "ang", pinyin: "lang5", hanzi: "狼", meaning: "wolf" },
  { initial: "l", final: "iang", pinyin: "liang4", hanzi: "两", meaning: "two" },

  // ---- initials: g -------------------------------------------------
  { initial: "g", final: "a",  pinyin: "ga1",  hanzi: "咖", meaning: "coffee" },
  { initial: "g", final: "e",  pinyin: "ge5",  hanzi: "歌", meaning: "song" },
  { initial: "g", final: "u",  pinyin: "gu3",  hanzi: "古", meaning: "ancient" },
  { initial: "g", final: "uo", pinyin: "guo3", hanzi: "国", meaning: "country" },
  { initial: "g", final: "ai", pinyin: "gai1", hanzi: "改", meaning: "to change" },
  { initial: "g", final: "uang", pinyin: "guang1", hanzi: "光", meaning: "light" },

  // ---- initials: k -------------------------------------------------
  { initial: "k", final: "a",  pinyin: "ka1",  hanzi: "卡", meaning: "card" },
  { initial: "k", final: "e",  pinyin: "ke1",  hanzi: "可", meaning: "possible" },
  { initial: "k", final: "ou", pinyin: "kou3", hanzi: "口", meaning: "mouth" },
  { initial: "k", final: "an", pinyin: "kan1", hanzi: "看", meaning: "to look" },
  { initial: "k", final: "ai", pinyin: "kai3", hanzi: "开", meaning: "to open" },

  // ---- initials: h -------------------------------------------------
  { initial: "h", final: "a",  pinyin: "ha1",  hanzi: "哈", meaning: "to laugh" },
  { initial: "h", final: "e",  pinyin: "he1",  hanzi: "贺", meaning: "to congratulate" },
  { initial: "h", final: "uo", pinyin: "huo2", hanzi: "活", meaning: "to live" },
  { initial: "h", final: "an", pinyin: "han1", hanzi: "汉", meaning: "Han (people)" },
  { initial: "h", final: "ou", pinyin: "hou4", hanzi: "后", meaning: "after; behind" },
  { initial: "h", final: "ui", pinyin: "hui4", hanzi: "回", meaning: "to return" },

  // ---- initials: j -------------------------------------------------
  { initial: "j", final: "i",  pinyin: "ji1",  hanzi: "机", meaning: "machine" },
  { initial: "j", final: "ia", pinyin: "jia1", hanzi: "家", meaning: "home" },
  { initial: "j", final: "ie", pinyin: "jie3", hanzi: "解", meaning: "to solve" },
  { initial: "j", final: "iang", pinyin: "jiang1", hanzi: "将", meaning: "general" },
  { initial: "j", final: "uan", pinyin: "juan1", hanzi: "卷", meaning: "scroll" },
  { initial: "j", final: "v",  pinyin: "jv4",  hanzi: "巨", meaning: "huge" },

  // ---- initials: q -------------------------------------------------
  { initial: "q", final: "i",  pinyin: "qi1",  hanzi: "七", meaning: "seven" },
  { initial: "q", final: "ian", pinyin: "qian1", hanzi: "千", meaning: "thousand" },
  { initial: "q", final: "ie", pinyin: "qie4", hanzi: "切", meaning: "to cut" },
  { initial: "q", final: "ing", pinyin: "qing1", hanzi: "清", meaning: "clear" },
  { initial: "q", final: "iao", pinyin: "qiao1", hanzi: "巧", meaning: "clever" },
  { initial: "q", final: "v",  pinyin: "qu4",  hanzi: "去", meaning: "to go" },

  // ---- initials: x -------------------------------------------------
  { initial: "x", final: "i",  pinyin: "xi1",  hanzi: "希", meaning: "rare" },
  { initial: "x", final: "ia", pinyin: "xia1", hanzi: "下", meaning: "below; down" },
  { initial: "x", final: "ie", pinyin: "xie2", hanzi: "写", meaning: "to write" },
  { initial: "x", final: "in", pinyin: "xin1", hanzi: "心", meaning: "heart" },
  { initial: "x", final: "iang", pinyin: "xiang4", hanzi: "向", meaning: "direction" },
  { initial: "x", final: "iong", pinyin: "xiong2", hanzi: "熊", meaning: "bear" },

  // ---- initials: zh ------------------------------------------------
  { initial: "zh", final: "i",  pinyin: "zhi1", hanzi: "知", meaning: "to know" },
  { initial: "zh", final: "a",  pinyin: "zha1", hanzi: "扎", meaning: "to stick" },
  { initial: "zh", final: "ao", pinyin: "zhao3", hanzi: "照", meaning: "to shine" },
  { initial: "zh", final: "ou", pinyin: "zhou1", hanzi: "州", meaning: "zhou; province" },
  { initial: "zh", final: "eng", pinyin: "zheng1", hanzi: "正", meaning: "correct" },

  // ---- initials: ch ------------------------------------------------
  { initial: "ch", final: "a",  pinyin: "cha1", hanzi: "查", meaning: "to check" },
  { initial: "ch", final: "i",  pinyin: "chi1", hanzi: "吃", meaning: "to eat" },
  { initial: "ch", final: "u",  pinyin: "chu1", hanzi: "出", meaning: "to go out" },
  { initial: "ch", final: "an", pinyin: "chan2", hanzi: "产", meaning: "to produce" },
  { initial: "ch", final: "eng", pinyin: "cheng2", hanzi: "成", meaning: "to become" },

  // ---- initials: sh ------------------------------------------------
  { initial: "sh", final: "i",  pinyin: "shi1", hanzi: "诗", meaning: "poem" },
  { initial: "sh", final: "a",  pinyin: "sha1", hanzi: "沙", meaning: "sand" },
  { initial: "sh", final: "u",  pinyin: "shu1", hanzi: "书", meaning: "book" },
  { initial: "sh", final: "en", pinyin: "shen1", hanzi: "身", meaning: "body" },
  { initial: "sh", final: "i",  pinyin: "shi4", hanzi: "是", meaning: "to be" },

  // ---- initials: r -------------------------------------------------
  { initial: "r", final: "i",  pinyin: "ri1",  hanzi: "日", meaning: "sun; day" },
  { initial: "r", final: "en", pinyin: "ren2", hanzi: "人", meaning: "person" },
  { initial: "r", final: "uo", pinyin: "ruo4", hanzi: "若", meaning: "like; if" },

  // ---- initials: z -------------------------------------------------
  { initial: "z", final: "i",  pinyin: "zi1",  hanzi: "资", meaning: "capital" },
  { initial: "z", final: "ai", pinyin: "zai3", hanzi: "在", meaning: "to be at" },
  { initial: "z", final: "e",  pinyin: "ze2",  hanzi: "则", meaning: "rule" },
  { initial: "z", final: "ao", pinyin: "zao3", hanzi: "早", meaning: "early" },
  { initial: "z", final: "ui", pinyin: "zui4", hanzi: "醉", meaning: "drunk" },

  // ---- initials: c -------------------------------------------------
  { initial: "c", final: "i",  pinyin: "ci1",  hanzi: "词", meaning: "word" },
  { initial: "c", final: "ai", pinyin: "cai3", hanzi: "菜", meaning: "dish; vegetable" },
  { initial: "c", final: "ao", pinyin: "cao3", hanzi: "草", meaning: "grass" },
  { initial: "c", final: "ao", pinyin: "cao4", hanzi: "操", meaning: "exercise" },
  { initial: "c", final: "en", pinyin: "cen1", hanzi: "参", meaning: "to participate" },

  // ---- initials: s -------------------------------------------------
  { initial: "s", final: "i",  pinyin: "si1",  hanzi: "思", meaning: "to think" },
  { initial: "s", final: "an", pinyin: "san1", hanzi: "三", meaning: "three" },
  { initial: "s", final: "ui", pinyin: "sui4", hanzi: "岁", meaning: "age" },
  { initial: "s", final: "heng", pinyin: "sheng1", hanzi: "生", meaning: "to give birth" },
  { initial: "s", final: "ong", pinyin: "song1", hanzi: "松", meaning: "loose; pine" },

  // ---- zero-initial finals -----------------------------------------
  { initial: "", final: "a",   pinyin: "ya1",  hanzi: "压", meaning: "to press" },
  { initial: "", final: "o",   pinyin: "wo3",  hanzi: "我", meaning: "I" },
  { initial: "", final: "e",   pinyin: "ye4",  hanzi: "也", meaning: "also" },
  { initial: "", final: "ai",  pinyin: "ai1",  hanzi: "哀", meaning: "grief" },
  { initial: "", final: "ei",  pinyin: "bei4", hanzi: "杯", meaning: "cup" },
  { initial: "", final: "ao",  pinyin: "ao2",  hanzi: "凹", meaning: "concave" },
  { initial: "", final: "ou",  pinyin: "ou1",  hanzi: "欧", meaning: "European" },
  { initial: "", final: "iu",  pinyin: "xiu4", hanzi: "修", meaning: "to cultivate" },
  { initial: "", final: "ie",  pinyin: "ye4",  hanzi: "页", meaning: "page" },
  { initial: "", final: "ue",  pinyin: "yue2", hanzi: "月", meaning: "moon" },
  { initial: "", final: "er",  pinyin: "er2",  hanzi: "而", meaning: "and" },
  { initial: "", final: "an",  pinyin: "an1",  hanzi: "安", meaning: "peaceful" },
  { initial: "", final: "en",  pinyin: "en1",  hanzi: "恩", meaning: "benefit" },
  { initial: "", final: "in",  pinyin: "yin1", hanzi: "因", meaning: "cause" },
  { initial: "", final: "un",  pinyin: "yun1", hanzi: "云", meaning: "cloud" },
  { initial: "", final: "ang", pinyin: "ang1", hanzi: "昂", meaning: "to raise" },
  { initial: "", final: "eng", pinyin: "weng1", hanzi: "翁", meaning: "old man" },
  { initial: "", final: "ing", pinyin: "ying1", hanzi: "鹰", meaning: "eagle" },
  { initial: "", final: "ong", pinyin: "yong1", hanzi: "雍", meaning: "harmonious" },
];

export type PinyinGroup = Map<string, Syllable[]>;

/** All initials present in the data, in the canonical order. */
export const INITIALS = ["b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h", "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s"];

/** Group syllables by initial. */
export function groupByInitial(): Map<string, Syllable[]> {
  const map = new Map<string, Syllable[]>();
  for (const init of INITIALS) map.set(init, []);
  for (const s of syllables) {
    const arr = map.get(s.initial) ?? [];
    arr.push(s);
    map.set(s.initial, arr);
  }
  return map;
}

/** Finals in a sensible teaching order. */
export const FINALS_ORDER = ["a", "o", "e", "ai", "ei", "ui", "ao", "ou", "iu", "ie", "ue", "er", "an", "en", "in", "un", "ang", "eng", "ing", "ong", "ian", "uang", "iang", "iong", "uai", "uen", "uan", "üan", "ün"];

/** Group syllables by final. */
export function groupByFinal(): Map<string, Syllable[]> {
  const map = new Map<string, Syllable[]>();
  for (const fin of FINALS_ORDER) map.set(fin, []);
  for (const s of syllables) {
    const arr = map.get(s.final) ?? [];
    arr.push(s);
    map.set(s.final, arr);
  }
  return map;
}

/** Return the plain pinyin suitable for speech synthesis (tone digit removed). */
export function speechPinyin(pinyin: string): string {
  return pinyin.replace(/\d/g, "");
}
