// src/features/vocabulary/pinyin-align.ts
//
// Aligns a tone-marked pinyin string to the individual Hanzi characters of a
// word or sentence, so the reader can sit each syllable directly above the
// character it belongs to (ruby-style). The stored pinyin is grouped by word
// ("Dàjiā hǎo"), not by character, so we re-segment it: strip the tones, split
// the toneless stream into exactly as many valid pinyin syllables as there are
// Hanzi characters, then slice the original tone-marked string at the same
// boundaries. Pure and deterministic, so it runs the same on server and client.

// The toneless syllable inventory. Long enough for everyday HSK text; "r"
// covers erhua (nǎr → 哪 + 儿), and "n"/"m"/"ng"/"hm"/"hng" cover interjections.
const SYLLABLE_LIST = [
  "a", "ai", "an", "ang", "ao", "e", "ei", "en", "eng", "er", "o", "ou", "r",
  "ba", "bai", "ban", "bang", "bao", "bei", "ben", "beng", "bi", "bian", "biao", "bie", "bin", "bing", "bo", "bu",
  "pa", "pai", "pan", "pang", "pao", "pei", "pen", "peng", "pi", "pian", "piao", "pie", "pin", "ping", "po", "pou", "pu",
  "ma", "mai", "man", "mang", "mao", "me", "mei", "men", "meng", "mi", "mian", "miao", "mie", "min", "ming", "miu", "mo", "mou", "mu",
  "fa", "fan", "fang", "fei", "fen", "feng", "fo", "fou", "fu",
  "da", "dai", "dan", "dang", "dao", "de", "dei", "den", "deng", "di", "dia", "dian", "diao", "die", "ding", "diu", "dong", "dou", "du", "duan", "dui", "dun", "duo",
  "ta", "tai", "tan", "tang", "tao", "te", "teng", "ti", "tian", "tiao", "tie", "ting", "tong", "tou", "tu", "tuan", "tui", "tun", "tuo",
  "na", "nai", "nan", "nang", "nao", "ne", "nei", "nen", "neng", "ni", "nian", "niang", "niao", "nie", "nin", "ning", "niu", "nong", "nou", "nu", "nü", "nuan", "nüe", "nuo",
  "la", "lai", "lan", "lang", "lao", "le", "lei", "leng", "li", "lia", "lian", "liang", "liao", "lie", "lin", "ling", "liu", "lo", "long", "lou", "lu", "lü", "luan", "lüe", "lun", "luo",
  "ga", "gai", "gan", "gang", "gao", "ge", "gei", "gen", "geng", "gong", "gou", "gu", "gua", "guai", "guan", "guang", "gui", "gun", "guo",
  "ka", "kai", "kan", "kang", "kao", "ke", "ken", "keng", "kong", "kou", "ku", "kua", "kuai", "kuan", "kuang", "kui", "kun", "kuo",
  "ha", "hai", "han", "hang", "hao", "he", "hei", "hen", "heng", "hong", "hou", "hu", "hua", "huai", "huan", "huang", "hui", "hun", "huo",
  "ji", "jia", "jian", "jiang", "jiao", "jie", "jin", "jing", "jiong", "jiu", "ju", "juan", "jue", "jun",
  "qi", "qia", "qian", "qiang", "qiao", "qie", "qin", "qing", "qiong", "qiu", "qu", "quan", "que", "qun",
  "xi", "xia", "xian", "xiang", "xiao", "xie", "xin", "xing", "xiong", "xiu", "xu", "xuan", "xue", "xun",
  "zha", "zhai", "zhan", "zhang", "zhao", "zhe", "zhei", "zhen", "zheng", "zhi", "zhong", "zhou", "zhu", "zhua", "zhuai", "zhuan", "zhuang", "zhui", "zhun", "zhuo",
  "cha", "chai", "chan", "chang", "chao", "che", "chen", "cheng", "chi", "chong", "chou", "chu", "chua", "chuai", "chuan", "chuang", "chui", "chun", "chuo",
  "sha", "shai", "shan", "shang", "shao", "she", "shei", "shen", "sheng", "shi", "shou", "shu", "shua", "shuai", "shuan", "shuang", "shui", "shun", "shuo",
  "ran", "rang", "rao", "re", "ren", "reng", "ri", "rong", "rou", "ru", "rua", "ruan", "rui", "run", "ruo",
  "za", "zai", "zan", "zang", "zao", "ze", "zei", "zen", "zeng", "zi", "zong", "zou", "zu", "zuan", "zui", "zun", "zuo",
  "ca", "cai", "can", "cang", "cao", "ce", "cen", "ceng", "ci", "cong", "cou", "cu", "cuan", "cui", "cun", "cuo",
  "sa", "sai", "san", "sang", "sao", "se", "sen", "seng", "si", "song", "sou", "su", "suan", "sui", "sun", "suo",
  "ya", "yan", "yang", "yao", "ye", "yi", "yin", "ying", "yo", "yong", "you", "yu", "yuan", "yue", "yun",
  "wa", "wai", "wan", "wang", "wei", "wen", "weng", "wo", "wu",
  "hm", "hng", "ng", "m", "n",
];

const SYLLABLES = new Set(SYLLABLE_LIST);

// Tone-marked vowel → its toneless base. "ü" is kept as-is so lü/nü segment.
const TONELESS: Record<string, string> = {
  "ā": "a", "á": "a", "ǎ": "a", "à": "a",
  "ē": "e", "é": "e", "ě": "e", "è": "e",
  "ī": "i", "í": "i", "ǐ": "i", "ì": "i",
  "ō": "o", "ó": "o", "ǒ": "o", "ò": "o",
  "ū": "u", "ú": "u", "ǔ": "u", "ù": "u",
  "ǖ": "ü", "ǘ": "ü", "ǚ": "ü", "ǜ": "ü", "ü": "ü",
  "ń": "n", "ň": "n", "ǹ": "n", "ḿ": "m",
};

const isHanzi = (ch: string) =>
  /[\u3400-\u4dbf\u4e00-\u9fff\uf900-\ufaff]/.test(ch);

// Pinyin letters we keep — plain Latin, the umlaut, and every tone-marked
// vowel. Everything else (spaces, commas, apostrophes, exclamation marks,
// digits) is dropped before segmenting.
const isPinyinLetter = (ch: string) =>
  /[a-zA-ZüÜ]/.test(ch) || ch in TONELESS;

function toToneless(ch: string): string {
  const base = TONELESS[ch];
  if (base) return base;
  if (ch === "v" || ch === "V") return "ü";
  return ch.toLowerCase();
}

/** Split `base` into exactly `count` syllables; returns their index ranges. */
function segment(base: string, count: number): Array<[number, number]> | null {
  const n = base.length;
  const memo = new Map<number, Set<number>>();

  const countsFrom = (i: number): Set<number> => {
    const cached = memo.get(i);
    if (cached) return cached;
    const res = new Set<number>();
    if (i === n) {
      res.add(0);
    } else {
      for (let len = 1; len <= 6 && i + len <= n; len += 1) {
        if (!SYLLABLES.has(base.slice(i, i + len))) continue;
        for (const c of countsFrom(i + len)) res.add(c + 1);
      }
    }
    memo.set(i, res);
    return res;
  };

  if (!countsFrom(0).has(count)) return null;

  const path: Array<[number, number]> = [];
  let i = 0;
  let remaining = count;
  while (i < n) {
    let advanced = false;
    for (let len = 1; len <= 6 && i + len <= n; len += 1) {
      if (!SYLLABLES.has(base.slice(i, i + len))) continue;
      if (countsFrom(i + len).has(remaining - 1)) {
        path.push([i, i + len]);
        i += len;
        remaining -= 1;
        advanced = true;
        break;
      }
    }
    if (!advanced) return null;
  }
  return path;
}

/**
 * One entry per character of `hanzi`, in order: the tone-marked pinyin
 * syllable for that character, or `null` when the character takes none
 * (punctuation, digits, latin). Returns `null` when the pinyin can't be
 * aligned — callers should fall back to a plain pinyin line.
 */
export function alignPinyin(
  hanzi: string,
  pinyin: string,
): (string | null)[] | null {
  const chars = [...hanzi];
  const total = chars.filter(isHanzi).length;
  if (total === 0) return null;

  const letters = [...pinyin].filter(isPinyinLetter);
  if (letters.length === 0) return null;

  const base = letters.map(toToneless).join("");
  const ranges = segment(base, total);
  if (!ranges) return null;

  const slices = ranges.map(([a, b]) => letters.slice(a, b).join(""));

  const out: (string | null)[] = [];
  let k = 0;
  for (const ch of chars) {
    if (isHanzi(ch)) {
      out.push(slices[k] ?? null);
      k += 1;
    } else {
      out.push(null);
    }
  }
  return k === total ? out : null;
}
