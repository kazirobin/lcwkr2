// src/features/vocabulary/pinyin-data.ts
//
// Foundational pinyin: the 21 initials and the main finals, each represented
// by real syllables with a hanzi character, an English gloss and a Bangla
// gloss.
//
// Pinyin is stored with a trailing tone digit ("ba1") because that is
// unambiguous to parse; the UI converts it to the proper diacritic form
// ("bā") with `toneMark`. The `final` field is the real phonological final —
// "ü" rather than "v", and the compound finals spelled out ("uan", "üe") — so
// grouping by final produces a table that matches how pinyin is actually
// taught, and so the tone mark lands on the right vowel.

export interface Syllable {
  /** Initial, e.g. "b". "" for zero-initial syllables (yi, wu, yu …). */
  initial: string;
  /** Final, e.g. "a", "iang", "ü". */
  final: string;
  /** Pinyin with a trailing tone digit, e.g. "ba1". Tone 5 is neutral. */
  pinyin: string;
  /** Hanzi for this syllable, e.g. "巴". */
  hanzi: string;
  /** Short English gloss. */
  meaning: string;
  /** Short Bangla gloss. */
  meaningBn: string;
}

// prettier-ignore
export const syllables: Syllable[] = [
  // ---- b ------------------------------------------------------------
  { initial: "b",  final: "a",  pinyin: "ba1",  hanzi: "巴",  meaning: "to cling to; to long for", meaningBn: "আটকে থাকা; আসা" },
  { initial: "b",  final: "o",  pinyin: "bo1",  hanzi: "波",  meaning: "wave",                     meaningBn: "ঢেউ" },
  { initial: "b",  final: "ai", pinyin: "bai3", hanzi: "百",  meaning: "hundred",                   meaningBn: "শত" },
  { initial: "b",  final: "ei", pinyin: "bei4", hanzi: "北",  meaning: "north",                     meaningBn: "উত্তর" },
  { initial: "b",  final: "ing",pinyin: "bing1",hanzi: "冰",  meaning: "ice",                       meaningBn: "বরফ" },
  { initial: "b",  final: "u",  pinyin: "bu4",  hanzi: "不",  meaning: "not; no",                   meaningBn: "না; নয়" },

  // ---- p ------------------------------------------------------------
  { initial: "p",  final: "a",  pinyin: "pa1",  hanzi: "趴",  meaning: "to lie face down",          meaningBn: "পেটে শুয়ে পড়া" },
  { initial: "p",  final: "o",  pinyin: "po2",  hanzi: "婆",  meaning: "old woman; granny",         meaningBn: "ঠাকুমা" },
  { initial: "p",  final: "ai", pinyin: "pai4", hanzi: "派",  meaning: "to dispatch; a school",     meaningBn: "পাঠানো; স্কুল" },
  { initial: "p",  final: "eng",pinyin: "peng2",hanzi: "朋",  meaning: "friend",                    meaningBn: "বন্ধু" },
  { initial: "p",  final: "ing",pinyin: "ping2",hanzi: "平",  meaning: "flat; level",               meaningBn: "সমতল; সমান" },
  { initial: "p",  final: "u",  pinyin: "pu4",  hanzi: "铺",  meaning: "shop; to pave",             meaningBn: "দোকান; বাস্তু" },

  // ---- m ------------------------------------------------------------
  { initial: "m",  final: "a",  pinyin: "ma1",  hanzi: "妈",  meaning: "mother; ma",                meaningBn: "মা" },
  { initial: "m",  final: "o",  pinyin: "mo2",  hanzi: "摩",  meaning: "to rub",                     meaningBn: "ঘষা" },
  { initial: "m",  final: "ai", pinyin: "mai4", hanzi: "卖",  meaning: "to sell",                    meaningBn: "বিক্রি করা" },
  { initial: "m",  final: "ei", pinyin: "mei3", hanzi: "美",  meaning: "beautiful",                 meaningBn: "সুন্দর" },
  { initial: "m",  final: "ao", pinyin: "mao2", hanzi: "毛",  meaning: "hair; fur",                  meaningBn: "লোম; লোমালো" },
  { initial: "m",  final: "u",  pinyin: "mu4",  hanzi: "木",  meaning: "wood; tree",                 meaningBn: "কাঠ; গাছ" },

  // ---- f ------------------------------------------------------------
  { initial: "f",  final: "a",  pinyin: "fa1",  hanzi: "发",  meaning: "to send out; hair",          meaningBn: "পাঠানো; চুল" },
  { initial: "f",  final: "u",  pinyin: "fu2",  hanzi: "服",  meaning: "clothes; to serve",         meaningBn: "কাপড়; সেবা" },
  { initial: "f",  final: "ei", pinyin: "fei4", hanzi: "费",  meaning: "cost; to spend",            meaningBn: "খরচ; ব্যয়" },
  { initial: "f",  final: "en", pinyin: "fen1", hanzi: "分",  meaning: "part; minute",              meaningBn: "অংশ; মিনিট" },
  { initial: "f",  final: "ang",pinyin: "fang1",hanzi: "方",  meaning: "square; side",              meaningBn: "বর্গ; দিক" },
  { initial: "f",  final: "u",  pinyin: "fu4",  hanzi: "付",  meaning: "to pay",                     meaningBn: "পেমেন্ট করা" },

  // ---- d ------------------------------------------------------------
  { initial: "d",  final: "a",  pinyin: "da1",  hanzi: "搭",  meaning: "to match; to hang up",      meaningBn: "মানানসই; ঝোলানো" },
  { initial: "d",  final: "e",  pinyin: "de2",  hanzi: "得",  meaning: "to get; to obtain",         meaningBn: "পাওয়া; অর্জন" },
  { initial: "d",  final: "ai", pinyin: "dai4", hanzi: "带",  meaning: "belt; to bring along",      meaningBn: "বেল্ট; সঙ্গে আনা" },
  { initial: "d",  final: "eng",pinyin: "deng4",hanzi: "等",  meaning: "to wait; rank",              meaningBn: "অপেক্ষা; স্তর" },
  { initial: "d",  final: "ong",pinyin: "dong1",hanzi: "东",  meaning: "east",                       meaningBn: "পূর্ব" },
  { initial: "d",  final: "a",  pinyin: "da4",  hanzi: "大",  meaning: "big; large",                 meaningBn: "বড়" },

  // ---- t ------------------------------------------------------------
  { initial: "t",  final: "a",  pinyin: "ta1",  hanzi: "他",  meaning: "he; him",                    meaningBn: "তিনি" },
  { initial: "t",  final: "e",  pinyin: "te4",  hanzi: "特",  meaning: "special",                    meaningBn: "বিশেষ" },
  { initial: "t",  final: "ai", pinyin: "tai2", hanzi: "台",  meaning: "platform; Taiwan",           meaningBn: "মঞ্চ; তাইওয়ান" },
  { initial: "t",  final: "ing",pinyin: "ting1",hanzi: "听",  meaning: "to listen",                  meaningBn: "শোনা" },
  { initial: "t",  final: "ong",pinyin: "tong2",hanzi: "同",  meaning: "same; together",             meaningBn: "একই; একসাথে" },
  { initial: "t",  final: "ui", pinyin: "tui4", hanzi: "腿",  meaning: "leg",                        meaningBn: "পা" },

  // ---- n ------------------------------------------------------------
  { initial: "n",  final: "a",  pinyin: "na2",  hanzi: "拿",  meaning: "to take; to hold",           meaningBn: "নেওয়া; ধরা" },
  { initial: "n",  final: "e",  pinyin: "ne5",  hanzi: "呢",  meaning: "question particle",          meaningBn: "প্রশ্নবোধক কণ" },
  { initial: "n",  final: "ai", pinyin: "nai3", hanzi: "奶",  meaning: "milk",                       meaningBn: "দুধ" },
  { initial: "n",  final: "eng",pinyin: "neng2",hanzi: "能",  meaning: "can; able; energy",          meaningBn: "পারা; শক্তি" },
  { initial: "n",  final: "ong",pinyin: "nong2",hanzi: "农",  meaning: "farmer; agriculture",       meaningBn: "কৃষক; কৃষি" },
  { initial: "n",  final: "ü",  pinyin: "nü3",  hanzi: "女",  meaning: "woman; female",              meaningBn: "নারী" },

  // ---- l ------------------------------------------------------------
  { initial: "l",  final: "a",  pinyin: "la1",  hanzi: "拉",  meaning: "to pull; to drag",           meaningBn: "টানা" },
  { initial: "l",  final: "e",  pinyin: "le4",  hanzi: "乐",  meaning: "happy; music",               meaningBn: "আনন্দ; সংগীত" },
  { initial: "l",  final: "ai", pinyin: "lai4", hanzi: "赖",  meaning: "to rely on",                 meaningBn: "নির্ভর করা" },
  { initial: "l",  final: "eng",pinyin: "leng3",hanzi: "冷",  meaning: "cold",                       meaningBn: "ঠান্ডা" },
  { initial: "l",  final: "iu", pinyin: "liu2", hanzi: "流",  meaning: "to flow; stream",            meaningBn: "প্রবাহ" },
  { initial: "l",  final: "un", pinyin: "lun4", hanzi: "论",  meaning: "to discuss",                  meaningBn: "আলোচনা" },
  { initial: "l",  final: "ü",  pinyin: "lü4",  hanzi: "绿",  meaning: "green",                      meaningBn: "সবুজ" },

  // ---- g ------------------------------------------------------------
  { initial: "g",  final: "e",  pinyin: "ge1",  hanzi: "哥",  meaning: "elder brother",              meaningBn: "বড় ভাই" },
  { initial: "g",  final: "u",  pinyin: "gu3",  hanzi: "古",  meaning: "ancient; old",               meaningBn: "প্রাচীন; পুরোনো" },
  { initial: "g",  final: "ai", pinyin: "gai1", hanzi: "该",  meaning: "should; ought to",           meaningBn: "উচিত" },
  { initial: "g",  final: "eng",pinyin: "geng4",hanzi: "更",  meaning: "more; to change",            meaningBn: "আরও; বদলানো" },
  { initial: "g",  final: "ua", pinyin: "gua1", hanzi: "瓜",  meaning: "melon",                      meaningBn: "কলা; তরি" },
  { initial: "g",  final: "uo", pinyin: "guo2", hanzi: "国",  meaning: "country",                    meaningBn: "দেশ" },
  { initial: "g",  final: "uang",pinyin:"guang1",hanzi:"光",  meaning: "light",                      meaningBn: "আলো" },

  // ---- k ------------------------------------------------------------
  { initial: "k",  final: "e",  pinyin: "ke1",  hanzi: "科",  meaning: "subject; science",           meaningBn: "বিষয়; বিজ্ঞান" },
  { initial: "k",  final: "u",  pinyin: "ku3",  hanzi: "苦",  meaning: "bitter; hardship",           meaningBn: "তিক্ত; কষ্ট" },
  { initial: "k",  final: "ai", pinyin: "kai1", hanzi: "开",  meaning: "to open; to drive",          meaningBn: "খোলা; চালানো" },
  { initial: "k",  final: "en", pinyin: "ken3", hanzi: "肯",  meaning: "willing; to consent",        meaningBn: "রাজি" },
  { initial: "k",  final: "uai",pinyin: "kuai4",hanzi: "快",  meaning: "fast; quick",                meaningBn: "দ্রুত" },
  { initial: "k",  final: "u",  pinyin: "ku4",  hanzi: "裤",  meaning: "trousers",                   meaningBn: "প্যান্ট" },

  // ---- h ------------------------------------------------------------
  { initial: "h",  final: "e",  pinyin: "he1",  hanzi: "喝",  meaning: "to drink",                   meaningBn: "পান করা" },
  { initial: "h",  final: "u",  pinyin: "hu3",  hanzi: "虎",  meaning: "tiger",                      meaningBn: "বাঘ" },
  { initial: "h",  final: "ai", pinyin: "hai3", hanzi: "海",  meaning: "sea",                        meaningBn: "সমুদ্র" },
  { initial: "h",  final: "eng",pinyin: "heng2",hanzi: "横",  meaning: "horizontal; across",         meaningBn: "অনুভূমিক" },
  { initial: "h",  final: "ua", pinyin: "hua1", hanzi: "花",  meaning: "flower",                     meaningBn: "ফুল" },
  { initial: "h",  final: "ou", pinyin: "hou4", hanzi: "后",  meaning: "after; behind; queen",       meaningBn: "পরে; পিছনে" },

  // ---- j ------------------------------------------------------------
  { initial: "j",  final: "i",  pinyin: "ji1",  hanzi: "鸡",  meaning: "chicken",                    meaningBn: "মুরগি" },
  { initial: "j",  final: "ü",  pinyin: "ju3",  hanzi: "举",  meaning: "to lift; to raise",          meaningBn: "তোলা" },
  { initial: "j",  final: "ia", pinyin: "jia1", hanzi: "家",  meaning: "home; family",               meaningBn: "বাড়ি; পরিবার" },
  { initial: "j",  final: "ian",pinyin: "jian4",hanzi: "见",  meaning: "to see; to meet",            meaningBn: "দেখা; ভেট" },
  { initial: "j",  final: "iong",pinyin:"jiong3",hanzi:"井",  meaning: "well",                       meaningBn: "কূপ" },
  { initial: "j",  final: "üe", pinyin: "jue2", hanzi: "决",  meaning: "to decide",                  meaningBn: "সিদ্ধান্ত নেওয়া" },

  // ---- q ------------------------------------------------------------
  { initial: "q",  final: "i",  pinyin: "qi1",  hanzi: "七",  meaning: "seven",                      meaningBn: "সাত" },
  { initial: "q",  final: "ü",  pinyin: "qu4",  hanzi: "去",  meaning: "to go; to leave",            meaningBn: "যাওয়া" },
  { initial: "q",  final: "ian",pinyin: "qian1",hanzi: "千",  meaning: "thousand",                   meaningBn: "হাজার" },
  { initial: "q",  final: "ing",pinyin: "qing1",hanzi: "清",  meaning: "clear; clean",               meaningBn: "পরিষ্কার" },
  { initial: "q",  final: "iu", pinyin: "qiu2", hanzi: "球",  meaning: "ball",                       meaningBn: "বল" },
  { initial: "q",  final: "iao",pinyin: "qiao2",hanzi: "桥",  meaning: "bridge",                     meaningBn: "সেতু" },

  // ---- x ------------------------------------------------------------
  { initial: "x",  final: "i",  pinyin: "xi1",  hanzi: "西",  meaning: "west",                       meaningBn: "পশ্চিম" },
  { initial: "x",  final: "ü",  pinyin: "xu3",  hanzi: "许",  meaning: "to allow; maybe",            meaningBn: "অনুমতি দেওয়া" },
  { initial: "x",  final: "ia", pinyin: "xia4", hanzi: "下",  meaning: "below; down; next",          meaningBn: "নিচে; নিম্নে" },
  { initial: "x",  final: "ian",pinyin: "xian1",hanzi: "先",  meaning: "first; before",              meaningBn: "প্রথম" },
  { initial: "x",  final: "iang",pinyin: "xiang2",hanzi:"想",  meaning: "to think; to miss",           meaningBn: "ভাবা; মনে পড়া" },
  { initial: "x",  final: "ie", pinyin: "xie3", hanzi: "写",  meaning: "to write",                   meaningBn: "লেখা" },
  { initial: "x",  final: "iao",pinyin: "xiao3",hanzi: "小",  meaning: "small; little",              meaningBn: "ছোট" },
  { initial: "x",  final: "iong",pinyin:"xiong2",hanzi:"熊",  meaning: "bear",                       meaningBn: "ভাল্লাখ" },
  { initial: "x",  final: "ing",pinyin: "xing1",hanzi: "星",  meaning: "star",                       meaningBn: "তারা" },
  { initial: "x",  final: "üe", pinyin: "xue3", hanzi: "雪",  meaning: "snow",                       meaningBn: "তুষার" },

  // ---- zh -----------------------------------------------------------
  { initial: "zh", final: "i",  pinyin: "zhi1", hanzi: "知",  meaning: "to know",                    meaningBn: "জানা" },
  { initial: "zh", final: "ü",  pinyin: "zhu3", hanzi: "主",  meaning: "master; owner",              meaningBn: "মালিক" },
  { initial: "zh", final: "ao", pinyin: "zhao3",hanzi: "找",  meaning: "to look for",                meaningBn: "খোঁজা" },
  { initial: "zh", final: "iao",pinyin: "zhao1",hanzi: "招",  meaning: "to recruit; to invite",      meaningBn: "নিয়োগ; আমন্ত্রণ" },
  { initial: "zh", final: "en", pinyin: "zhen1",hanzi: "真",  meaning: "true; real",                 meaningBn: "সত্য" },
  { initial: "zh", final: "ong",pinyin: "zhong1",hanzi:"中",  meaning: "middle; China",              meaningBn: "মাঝখান; চীন" },
  { initial: "zh", final: "ang",pinyin: "zhang3",hanzi:"掌",  meaning: "palm; to manage",            meaningBn: "তালু; পরিচালনা" },

  // ---- ch -----------------------------------------------------------
  { initial: "ch", final: "i",  pinyin: "chi1", hanzi: "吃",  meaning: "to eat",                     meaningBn: "খাওয়া" },
  { initial: "ch", final: "ü",  pinyin: "chu3", hanzi: "础",  meaning: "foundation; base",           meaningBn: "ভিত্তি" },
  { initial: "ch", final: "ao", pinyin: "chao2",hanzi: "朝",  meaning: "morning; dynasty",            meaningBn: "সকাল; রাজবংশ" },
  { initial: "ch", final: "ün", pinyin: "chun1",hanzi: "春",  meaning: "spring",                     meaningBn: "বসন্ত" },
  { initial: "ch", final: "ang",pinyin: "chang4",hanzi:"唱",  meaning: "to sing",                    meaningBn: "গাওয়া" },
  { initial: "ch", final: "e",  pinyin: "che1", hanzi: "车",  meaning: "car; vehicle",               meaningBn: "গাড়ি" },

  // ---- sh -----------------------------------------------------------
  { initial: "sh", final: "i",  pinyin: "shi1", hanzi: "师",  meaning: "teacher; master",            meaningBn: "শিক্ষক" },
  { initial: "sh", final: "ü",  pinyin: "shu3", hanzi: "鼠",  meaning: "mouse; rat",                 meaningBn: "ইঁদুর" },
  { initial: "sh", final: "ao", pinyin: "shao1",hanzi: "烧",  meaning: "to burn; to cook",           meaningBn: "পোড়ানো; রান্না" },
  { initial: "sh", final: "an", pinyin: "shan1",hanzi: "山",  meaning: "mountain",                   meaningBn: "পাহাড়" },
  { initial: "sh", final: "ang",pinyin: "shang4",hanzi:"上",  meaning: "above; to go up",            meaningBn: "উপরে; ওঠা" },
  { initial: "sh", final: "uo", pinyin: "shuo1",hanzi: "说",  meaning: "to speak; to say",           meaningBn: "বলা; কথা বলা" },

  // ---- r ------------------------------------------------------------
  { initial: "r",  final: "i",  pinyin: "ri4",  hanzi: "日",  meaning: "sun; day",                   meaningBn: "সূর্য; দিন" },
  { initial: "r",  final: "e",  pinyin: "re4",  hanzi: "热",  meaning: "hot; warm",                  meaningBn: "গরম" },
  { initial: "r",  final: "ou", pinyin: "rou2", hanzi: "柔",  meaning: "soft; gentle",               meaningBn: "নরম; কোমল" },
  { initial: "r",  final: "an", pinyin: "ran2", hanzi: "然",  meaning: "so; like that",              meaningBn: "তাই; এমন" },
  { initial: "r",  final: "en", pinyin: "ren4", hanzi: "认",  meaning: "to recognise; to admit",     meaningBn: "চেনা; স্বীকার" },
  { initial: "r",  final: "uan",pinyin: "ruan3",hanzi: "软",  meaning: "soft; weak",                 meaningBn: "নরম; দুর্বল" },

  // ---- z ------------------------------------------------------------
  { initial: "z",  final: "i",  pinyin: "zi4",  hanzi: "字",  meaning: "character; word",            meaningBn: "অক্ষর; শব্দ" },
  { initial: "z",  final: "e",  pinyin: "ze2",  hanzi: "则",  meaning: "rule; then",                 meaningBn: "নিয়ম" },
  { initial: "z",  final: "ai", pinyin: "zai4", hanzi: "在",  meaning: "to be at; to stay",          meaningBn: "থাকা" },
  { initial: "z",  final: "ao", pinyin: "zao3", hanzi: "早",  meaning: "early; morning",             meaningBn: "ভোর; সকাল" },
  { initial: "z",  final: "uo", pinyin: "zuo4", hanzi: "做",  meaning: "to do; to make",             meaningBn: "করা" },
  { initial: "z",  final: "uan",pinyin: "zuan4",hanzi: "钻",  meaning: "to drill; to dive",          meaningBn: "খনন; ডুব" },

  // ---- c ------------------------------------------------------------
  { initial: "c",  final: "i",  pinyin: "ci4",  hanzi: "次",  meaning: "time; occasion",             meaningBn: "বার; সুযোগ" },
  { initial: "c",  final: "ai", pinyin: "cai4", hanzi: "菜",  meaning: "dish; vegetable",             meaningBn: "তরকারি" },
  { initial: "c",  final: "ao", pinyin: "cao3", hanzi: "草",  meaning: "grass",                      meaningBn: "ঘাস" },
  { initial: "c",  final: "ün", pinyin: "cun1", hanzi: "村",  meaning: "village",                    meaningBn: "গ্রাম" },
  { initial: "c",  final: "uo", pinyin: "cuo4", hanzi: "错",  meaning: "wrong; to cross",            meaningBn: "ভুল" },
  { initial: "c",  final: "ui", pinyin: "cui4", hanzi: "脆",  meaning: "crispy; brittle",             meaningBn: "খসখসে; ভঙ্গুর" },

  // ---- s ------------------------------------------------------------
  { initial: "s",  final: "i",  pinyin: "si4",  hanzi: "四",  meaning: "four",                       meaningBn: "চার" },
  { initial: "s",  final: "an", pinyin: "san1", hanzi: "三",  meaning: "three",                      meaningBn: "তিন" },
  { initial: "s",  final: "en", pinyin: "sen1", hanzi: "森",  meaning: "forest; dense",               meaningBn: "বন; ঘন" },
  { initial: "s",  final: "ong",pinyin: "song1",hanzi: "松",  meaning: "loose; pine",                meaningBn: "ঢিলা; পাইন" },
  { initial: "s",  final: "u",  pinyin: "su4",  hanzi: "素",  meaning: "plain; element",             meaningBn: "সাদামাটা; মৌল" },
  { initial: "s",  final: "uo", pinyin: "suo3", hanzi: "锁",  meaning: "lock",                       meaningBn: "তালা" },

  // ---- zero initial (yi, wu, yu …) -----------------------------------
  // In these the y or w stands in for a missing i or u, so the final is only
  // what is left once the medial is dropped: "ye" is y + "e", "yao" is y + "ao".
  { initial: "",   final: "i",   pinyin: "yi1",  hanzi: "一",  meaning: "one",                        meaningBn: "এক" },
  { initial: "",   final: "u",   pinyin: "wu3",  hanzi: "五",  meaning: "five",                       meaningBn: "পাঁচ" },
  { initial: "",   final: "ü",   pinyin: "yu2",  hanzi: "鱼",  meaning: "fish",                       meaningBn: "মাছ" },
  { initial: "",   final: "a",   pinyin: "ya1",  hanzi: "鸭",  meaning: "duck",                       meaningBn: "হাঁস" },
  { initial: "",   final: "o",   pinyin: "wo3",  hanzi: "我",  meaning: "I; me",                      meaningBn: "আমি" },
  { initial: "",   final: "e",   pinyin: "he2",  hanzi: "河",  meaning: "river",                      meaningBn: "নদী" },
  { initial: "",   final: "er",  pinyin: "er2",  hanzi: "而",  meaning: "and; but",                   meaningBn: "এবং; কিন্তু" },
  { initial: "",   final: "e",   pinyin: "ye4",  hanzi: "叶",  meaning: "leaf",                       meaningBn: "পাতা" },
  { initial: "",   final: "üe",  pinyin: "yue4", hanzi: "月",  meaning: "moon; month",                meaningBn: "চাঁদ; মাস" },
  { initial: "",   final: "ao",  pinyin: "yao3", hanzi: "咬",  meaning: "to bite",                    meaningBn: "কামড়ানো" },
  { initial: "",   final: "ou",  pinyin: "you3", hanzi: "有",  meaning: "to have; there is",          meaningBn: "আছে; থাকা" },
  { initial: "",   final: "ai",  pinyin: "ai4",  hanzi: "爱",  meaning: "love; to love",              meaningBn: "ভালোবাসা" },
  { initial: "",   final: "ei",  pinyin: "mei2", hanzi: "没",  meaning: "not; to have not",           meaningBn: "নেই" },
  { initial: "",   final: "ui",  pinyin: "wei4", hanzi: "味",  meaning: "taste; flavour",             meaningBn: "স্বাদ" },
  { initial: "",   final: "a",   pinyin: "an1",  hanzi: "安",  meaning: "peaceful; safe",             meaningBn: "শান্ত; নিরাপদ" },
  { initial: "",   final: "en",  pinyin: "en1",  hanzi: "恩",  meaning: "kindness; grace",            meaningBn: "উপকার" },
  { initial: "",   final: "in",  pinyin: "yin1", hanzi: "音",  meaning: "sound; tone",                meaningBn: "শব্দ; স্বর" },
  { initial: "",   final: "ün",  pinyin: "yun2", hanzi: "云",  meaning: "cloud",                      meaningBn: "মেঘ" },
  { initial: "",   final: "ang", pinyin: "ang2", hanzi: "昂",  meaning: "to hold head up",            meaningBn: "মাথা তোলা" },
  { initial: "",   final: "eng", pinyin: "weng1",hanzi: "翁",  meaning: "old man",                    meaningBn: "বৃদ্ধ" },
  { initial: "",   final: "ing", pinyin: "ying1",hanzi: "鹰",  meaning: "eagle",                      meaningBn: "গাঙ্গী" },
  { initial: "",   final: "ong", pinyin: "yong4",hanzi: "用",  meaning: "to use",                     meaningBn: "ব্যবহার" },
  { initial: "",   final: "a",   pinyin: "ya4",  hanzi: "亚",  meaning: "Asia; second",               meaningBn: "এশিয়া; দ্বিতীয়" },
  { initial: "",   final: "uai", pinyin: "wai4", hanzi: "外",  meaning: "outside; beyond",             meaningBn: "বাইরে; বাইরের" },
  { initial: "",   final: "uan", pinyin: "wan4", hanzi: "万",  meaning: "ten thousand",               meaningBn: "দশ হাজার" },
  { initial: "",   final: "üan", pinyin: "yuan2",hanzi: "元",  meaning: "yuan; primary",              meaningBn: "ইয়ুয়ান; প্রধান" },
  { initial: "",   final: "ang", pinyin: "yang2",hanzi: "羊",  meaning: "sheep",                      meaningBn: "ভেড়া" },
];

export type PinyinGroup = Map<string, Syllable[]>;

/** All 21 initials, in the canonical teaching order. */
export const INITIALS = [
  "b", "p", "m", "f", "d", "t", "n", "l", "g", "k", "h",
  "j", "q", "x", "zh", "ch", "sh", "r", "z", "c", "s",
];

/** Finals in a teaching order: simple vowels and diphthongs, then codas, then medials. */
export const FINALS_ORDER = [
  "a", "o", "e", "i", "u", "ü", "er",
  "ai", "ei", "ao", "ou",
  "an", "en", "in", "un", "ün",
  "ang", "eng", "ing", "ong",
  "ia", "ie", "üe", "iao", "iu", "ua", "uai", "ui", "uo",
  "ian", "uan", "üan", "iang", "uang", "iong",
];

/**
 * Index of the vowel the tone mark belongs on, counting only the vowels of the
 * final. Monosyllabic finals mark the first vowel; "iu", "ui", "uo", "ua" and
 * every i-/u-/ü-initial compound mark the second, which is the vowel that
 * carries the tone in standard Mandarin (liú, guì, guó, guā, jiǔ …).
 */
const TONE_VOWEL_INDEX: Record<string, number> = {
  a: 0, o: 0, e: 0, i: 0, u: 0, ü: 0, er: 0,
  ai: 0, ei: 0, ao: 0, ou: 0,
  an: 0, en: 0, in: 0, un: 0, ün: 0,
  ang: 0, eng: 0, ing: 0, ong: 0,
  ia: 1, ie: 1, üe: 1, iao: 1, iu: 1, ua: 1, uai: 1, ui: 1, uo: 1,
  ian: 1, uan: 1, üan: 1, iang: 1, uang: 1, iong: 1,
};

const TONE_DIACRITIC: Record<number, string> = {
  1: "\u0304", // macron
  2: "\u0301", // acute
  3: "\u030c", // caron
  4: "\u0300", // grave
};

/**
 * The letters the tone mark can actually sit in: the body minus a real initial,
 * minus the y/w that stands in for one in zero-initial syllables.
 *
 * A zero-initial syllable does not keep all of its final's letters — "ye" is
 * y + "e", "wan" is w + "an" — so the tail can be shorter than the final, and
 * the mark position has to be clamped to the vowels that are really there.
 */
function toneTail(syllable: Syllable): string {
  const body = syllable.pinyin.replace(/\d$/, "");
  let tail = body.slice(syllable.initial.length);
  if (syllable.initial === "" && /^[yw]/i.test(tail)) tail = tail.slice(1);
  return tail;
}

/**
 * Render a stored syllable ("juan1") as pinyin with a real tone mark ("juān").
 * Tone 5 is neutral and takes no mark.
 */
export function toneMark(syllable: Syllable): string {
  const body = syllable.pinyin.replace(/\d$/, "");
  const tone = Number(syllable.pinyin.slice(-1));
  const diacritic = TONE_DIACRITIC[tone];
  if (!diacritic) return body;

  const tail = toneTail(syllable);
  const chars = [...tail];
  const vowels = chars.reduce(
    (count, ch) => count + (/[aeoiuü]/i.test(ch) ? 1 : 0),
    0,
  );
  if (vowels === 0) return body;

  // Clamp: "wan" is w + "an", so the stored final "uan" has no room for its
  // second vowel and the mark belongs on the "a". Same for "wei" (w + "ei")
  // and "wai" (w + "ai"), where the w stands in for a missing u.
  //
  // zh/ch/sh/r write a leading i as nothing, so "zhao" is zh + "iao" and the
  // mark moves one vowel to the left of where the stored final puts it. "shuo"
  // is the exception: sh + uo keeps both vowels, so uo still marks the "o".
  let index = TONE_VOWEL_INDEX[syllable.final] ?? 0;

  if (
    /^(zh|ch|sh|r)$/.test(syllable.initial) &&
    syllable.final.length > 1 &&
    syllable.final.startsWith("i")
  ) {
    index -= 1;
  }

  // A zero-initial w stands in for a missing u, so the final loses that vowel
  // and the mark moves left: ui is written "ei" (wèi) and uai is written "ai"
  // (wài). The bare final "u" is written as w itself (wǔ) and is unaffected.
  if (
    syllable.initial === "" &&
    syllable.pinyin.startsWith("w") &&
    syllable.final.startsWith("u") &&
    syllable.final.length > 1
  ) {
    index -= 1;
  }

  const target = Math.max(0, Math.min(index, vowels - 1));

  let seen = 0;
  for (let i = 0; i < chars.length; i++) {
    if (!/[aeoiuü]/i.test(chars[i])) continue;
    if (seen === target) {
      chars[i] += diacritic;
      break;
    }
    seen++;
  }

  // The tail length is measured before the mark was added, so the combining
  // diacritic does not shift the head of the syllable.
  return body.slice(0, body.length - tail.length) + chars.join("");
}

/** Stable key for lists, since a pinyin can legitimately repeat. */
export function syllableKey(s: Syllable): string {
  return `${s.initial}|${s.final}|${s.pinyin}|${s.hanzi}`;
}

/** Group syllables by initial, in `INITIALS` order. */
export function groupByInitial(): PinyinGroup {
  const map: PinyinGroup = new Map();
  for (const init of INITIALS) map.set(init, []);
  for (const s of syllables) {
    const bucket = map.get(s.initial);
    if (bucket) bucket.push(s);
  }
  return map;
}

/** Group syllables by final, in `FINALS_ORDER` order. */
export function groupByFinal(): PinyinGroup {
  const map: PinyinGroup = new Map();
  for (const fin of FINALS_ORDER) map.set(fin, []);
  for (const s of syllables) {
    const bucket = map.get(s.final);
    if (bucket) bucket.push(s);
  }
  return map;
}

/** The plain letters of a syllable, for search and for a Latin-script fallback. */
export function plainPinyin(syllable: Syllable): string {
  return syllable.pinyin.replace(/\d$/, "");
}
