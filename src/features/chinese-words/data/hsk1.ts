// HSK 1 root-word dataset — LOCAL data, no MongoDB.
// Built from the HSK lesson words (data/lesson-words.ts) in lesson
// order; curated core roots carry their relatedWords + examples.
// A related word appears ONCE across all levels (global dedupe).
// To add a new root: copy an object, keep `character` unique, fill
// relatedWords (with examples).
import type { ChineseWordEntry } from "../types";

export const HSK1_WORDS: ChineseWordEntry[] = [
  {
    character: "你",
    pinyin: "nǐ",
    meaningEn: "You",
    meaningBn: "তুমি",
    descriptionEn: "Second-person singular pronoun used to address someone directly.",
    descriptionBn: "একবচনে কাউকে সরাসরি সম্বোধন করার জন্য ব্যবহৃত সর্বনাম।",
    hskLevel: 1,
    strokeCount: 7,
    relatedWords: [
      {
        word: "你们",
        pinyin: "nǐmen",
        meaningEn: "You (plural)",
        meaningBn: "তোমরা",
        wordType: "Pronoun",
        hskLevel: 1,
        examples: [
            { chinese: "你们好！", pinyin: "Nǐmen hǎo!", meaningEn: "Hello everyone / Hello you all!", meaningBn: "তোমরা সবাই কেমন আছো!", type: "Greeting" },
        ],
      },
      {
        word: "你好",
        pinyin: "nǐ hǎo",
        meaningEn: "Hello",
        meaningBn: "হ্যালো / কেমন আছো",
        wordType: "Phrase",
        hskLevel: 1,
        examples: [
            { chinese: "你好，老师！", pinyin: "Nǐ hǎo, lǎoshī!", meaningEn: "Hello, teacher!", meaningBn: "হ্যালো, শিক্ষক!", type: "Greeting" },
        ],
      },
    ],
  },
  {
    character: "好",
    pinyin: "hǎo",
    meaningEn: "Good",
    meaningBn: "ভালো",
    descriptionEn: "A common adjective indicating positive quality, wellness, or being proper.",
    descriptionBn: "একটি সাধারণ বিশেষণ যা ভালো গুণ, সুস্থতা বা সঠিক বিষয় বোঝায়।",
    hskLevel: 1,
    strokeCount: 6,
    relatedWords: [
      {
        word: "很好",
        pinyin: "hěn hǎo",
        meaningEn: "Very good",
        meaningBn: "খুব ভালো",
        wordType: "Adjective Phrase",
        hskLevel: 1,
        examples: [
            { chinese: "这个学生很好。", pinyin: "Zhège xuésheng hěn hǎo.", meaningEn: "This student is very good.", meaningBn: "এই ছাত্রটি খুব ভালো।", type: "Statement" },
        ],
      },
      {
        word: "好人",
        pinyin: "hǎo rén",
        meaningEn: "Good person",
        meaningBn: "ভালো মানুষ",
        wordType: "Noun Phrase",
        hskLevel: 1,
        examples: [
            { chinese: "他是一个好人。", pinyin: "Tā shì yígè hǎo rén.", meaningEn: "He is a good person.", meaningBn: "সে একজন ভালো মানুষ।", type: "Statement" },
        ],
      },
      {
        word: "好看",
        pinyin: "hǎokàn",
        meaningEn: "Good-looking",
        meaningBn: "সুন্দর",
        hskLevel: 1,
        examples: [
            { chinese: "这件衣服很好看。", pinyin: "Zhè jiàn yīfu hěn hǎokàn.", meaningEn: "These clothes look nice.", meaningBn: "এই জামাটা সুন্দর।" },
        ],
      },
      {
        word: "好吃",
        pinyin: "hǎochī",
        meaningEn: "Delicious",
        meaningBn: "মজাদার",
        hskLevel: 1,
        examples: [
            { chinese: "苹果很好吃。", pinyin: "Píngguǒ hěn hǎochī.", meaningEn: "Apples are delicious.", meaningBn: "আপেল মজাদার।" },
        ],
      },
      {
        word: "刚好",
        pinyin: "gānghǎo",
        meaningEn: "Just right",
        meaningBn: "একদম ঠিক",
        hskLevel: 1,
        examples: [
            { chinese: "时间刚好。", pinyin: "Shíjiān gānghǎo.", meaningEn: "The timing is just right.", meaningBn: "সময়টা ঠিক।" },
        ],
      },
    ],
  },
  {
    character: "叫",
    pinyin: "jiào",
    meaningEn: "To be called",
    meaningBn: "ডাকা হয়",
    descriptionEn: "Verb used to state someone's name or being called by a specific identifier.",
    descriptionBn: "কারও নাম প্রকাশ করতে বা কোনো নামে ডাকতে ব্যবহৃত ক্রিয়া।",
    hskLevel: 1,
    strokeCount: 5,
    relatedWords: [
      {
        word: "叫做",
        pinyin: "jiàozuò",
        meaningEn: "To be called / To be known as",
        meaningBn: "নামে পরিচিত হওয়া",
        wordType: "Verb",
        hskLevel: 1,
        examples: [
            { chinese: "这个汉字叫做什么？", pinyin: "Zhège hànzì jiàozuò shénme?", meaningEn: "What is this Chinese character called?", meaningBn: "এই চাইনিজ অক্ষরটির নাম কী?", type: "Question" },
        ],
      },
      {
        word: "大叫",
        pinyin: "dà jiào",
        meaningEn: "To shout / Scream",
        meaningBn: "চিৎকার করা",
        wordType: "Verb",
        hskLevel: 2,
        examples: [
            { chinese: "请不要大叫。", pinyin: "Qǐng búyào dà jiào.", meaningEn: "Please do not shout.", meaningBn: "দয়া করে চিৎকার করবেন না।", type: "Command" },
        ],
      },
    ],
  },
  {
    character: "大家",
    pinyin: "dàjiā",
    meaningEn: "Everyone",
    meaningBn: "সবাই",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "学生",
    pinyin: "xuéshēng",
    meaningEn: "Student",
    meaningBn: "ছাত্র",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "们",
    pinyin: "men",
    meaningEn: "(plural suffix)",
    meaningBn: "বহুবচন প্রত্যয়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "老师",
    pinyin: "lǎoshī",
    meaningEn: "Teacher",
    meaningBn: "শিক্ষক",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "您",
    pinyin: "nín",
    meaningEn: "You (polite)",
    meaningBn: "আপনি (সম্মানসূচক)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "你们",
    pinyin: "nǐmen",
    meaningEn: "You (plural)",
    meaningBn: "তোমরা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "谢谢",
    pinyin: "xièxie",
    meaningEn: "Thank you",
    meaningBn: "ধন্যবাদ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "不客气",
    pinyin: "bú kèqi",
    meaningEn: "You're welcome",
    meaningBn: "স্বাগতম",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "同学",
    pinyin: "tóngxué",
    meaningEn: "Classmate",
    meaningBn: "সহপাঠী",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "再见",
    pinyin: "zàijiàn",
    meaningEn: "Goodbye",
    meaningBn: "বিদায়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "请问",
    pinyin: "qǐngwèn",
    meaningEn: "Excuse me; May I ask",
    meaningBn: "দয়া করে জিজ্ঞাসা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "什么",
    pinyin: "shénme",
    meaningEn: "What",
    meaningBn: "কি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "名字",
    pinyin: "míngzi",
    meaningEn: "Name",
    meaningBn: "নাম",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "我",
    pinyin: "wǒ",
    meaningEn: "I; Me",
    meaningBn: "আমি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "不",
    pinyin: "bù",
    meaningEn: "No; not",
    meaningBn: "না",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "是",
    pinyin: "shì",
    meaningEn: "To be; yes",
    meaningBn: "হওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "对不起",
    pinyin: "duìbuqǐ",
    meaningEn: "Sorry",
    meaningBn: "দুঃখিত",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "没关系",
    pinyin: "méi guānxi",
    meaningEn: "It's okay; no problem",
    meaningBn: "কোনো সমস্যা নেই",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "没事",
    pinyin: "méi shì",
    meaningEn: "It's okay; nothing's wrong",
    meaningBn: "কিছু হয়নি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "很",
    pinyin: "hěn",
    meaningEn: "Very; quite",
    meaningBn: "খুব",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "高兴",
    pinyin: "gāoxìng",
    meaningEn: "Happy; glad",
    meaningBn: "খুশি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "认识",
    pinyin: "rènshi",
    meaningEn: "To know; to meet; to get acquainted",
    meaningBn: "চেনা/পরিচিত হওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "也",
    pinyin: "yě",
    meaningEn: "Also; too",
    meaningBn: "ও",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "人",
    pinyin: "rén",
    meaningEn: "Person; people",
    meaningBn: "ব্যক্তি/লোক",
    hskLevel: 1,
    relatedWords: [
      {
        word: "人们",
        pinyin: "rénmen",
        meaningEn: "People",
        meaningBn: "মানুষরা",
        hskLevel: 1,
        examples: [
            { chinese: "公园里有很多人。", pinyin: "Gōngyuán lǐ yǒu hěn duō rénmen.", meaningEn: "There are many people in the park.", meaningBn: "পার্কে অনেক মানুষ আছে।" },
        ],
      },
      {
        word: "个人",
        pinyin: "gèrén",
        meaningEn: "Individual",
        meaningBn: "ব্যক্তিগত",
        hskLevel: 1,
        examples: [
            { chinese: "这是我的个人电脑。", pinyin: "Zhè shì wǒ de gèrén diànnǎo.", meaningEn: "This is my personal computer.", meaningBn: "এটা আমার ব্যক্তিগত কম্পিউটার।" },
        ],
      },
      {
        word: "中国人",
        pinyin: "Zhōngguórén",
        meaningEn: "Chinese person",
        meaningBn: "চীনা ব্যক্তি",
        hskLevel: 1,
        examples: [
            { chinese: "他是中国人。", pinyin: "Tā shì Zhōngguórén.", meaningEn: "He is Chinese.", meaningBn: "তিনি একজন চীনা।" },
        ],
      },
    ],
  },
  {
    character: "的",
    pinyin: "de",
    meaningEn: "Possessive particle / modifier marker",
    meaningBn: "এর/র (সম্বন্ধ পদ)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "中文",
    pinyin: "Zhōngwén",
    meaningEn: "Chinese language (written)",
    meaningBn: "চীনা ভাষা (লিখিত)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "法国",
    pinyin: "Fǎguó",
    meaningEn: "France",
    meaningBn: "ফ্রান্স",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "中国",
    pinyin: "Zhōngguó",
    meaningEn: "China",
    meaningBn: "চীন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "这",
    pinyin: "zhè",
    meaningEn: "This",
    meaningBn: "এই",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "谁",
    pinyin: "shéi",
    meaningEn: "Who",
    meaningBn: "কে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "女朋友",
    pinyin: "nǚpéngyou",
    meaningEn: "Girlfriend",
    meaningBn: "বান্ধবী",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "哪",
    pinyin: "nǎ",
    meaningEn: "Which",
    meaningBn: "কোন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "国",
    pinyin: "guó",
    meaningEn: "Country",
    meaningBn: "দেশ",
    hskLevel: 1,
    relatedWords: [
      {
        word: "国家",
        pinyin: "guójiā",
        meaningEn: "Country",
        meaningBn: "দেশ",
        hskLevel: 1,
        examples: [
            { chinese: "我爱我的国家。", pinyin: "Wǒ ài wǒ de guójiā.", meaningEn: "I love my country.", meaningBn: "আমি আমার দেশকে ভালোবাসি।" },
        ],
      },
      {
        word: "外国",
        pinyin: "wàiguó",
        meaningEn: "Foreign country",
        meaningBn: "বিদেশ",
        hskLevel: 1,
        examples: [
            { chinese: "他对外国文化很感兴趣。", pinyin: "Tā duì wàiguó wénhuà hěn gǎn xìngqù.", meaningEn: "He is interested in foreign cultures.", meaningBn: "বিদেশি সংস্কৃতিতে তার আগ্রহ আছে।" },
        ],
      },
    ],
  },
  {
    character: "他",
    pinyin: "tā",
    meaningEn: "He/She/It",
    meaningBn: "সে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "泰国",
    pinyin: "Tàiguó",
    meaningEn: "Thailand",
    meaningBn: "থাইল্যান্ড",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "喂",
    pinyin: "wèi",
    meaningEn: "Hello (on phone) / Hey",
    meaningBn: "হ্যালো (ফোনে)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "姐姐",
    pinyin: "jiějie",
    meaningEn: "Older sister",
    meaningBn: "বড় বোন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "工作",
    pinyin: "gōngzuò",
    meaningEn: "Work / Job",
    meaningBn: "কাজ/চাকরি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "还",
    pinyin: "hái",
    meaningEn: "Still / Yet / Also",
    meaningBn: "এখনও/আরও",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "忙",
    pinyin: "máng",
    meaningEn: "Busy",
    meaningBn: "ব্যস্ত",
    hskLevel: 1,
    relatedWords: [
      {
        word: "帮忙",
        pinyin: "bāngmáng",
        meaningEn: "To help",
        meaningBn: "সাহায্য করা",
        hskLevel: 2,
        examples: [
            { chinese: "你能帮个忙吗？", pinyin: "Nǐ néng bāng ge máng ma?", meaningEn: "Can you help?", meaningBn: "সাহায্য করবে?" },
        ],
      },
      {
        word: "非常忙",
        pinyin: "fēicháng máng",
        meaningEn: "Extremely busy",
        meaningBn: "খুব ব্যস্ত",
        hskLevel: 2,
        examples: [
            { chinese: "这周我非常忙。", pinyin: "Zhè zhōu wǒ fēicháng máng.", meaningEn: "I'm extremely busy this week.", meaningBn: "এই সপ্তাহে খুব ব্যস্ত।" },
        ],
      },
    ],
  },
  {
    character: "吗",
    pinyin: "ma",
    meaningEn: "Question particle",
    meaningBn: "প্রশ্নবোধক চিহ্ন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "对",
    pinyin: "duì",
    meaningEn: "Correct / Right / Towards",
    meaningBn: "সঠিক/ঠিক",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "太",
    pinyin: "tài",
    meaningEn: "Too / Very (excessive)",
    meaningBn: "খুব/অত্যধিক",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "我们",
    pinyin: "wǒmen",
    meaningEn: "We / Us",
    meaningBn: "আমরা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "想",
    pinyin: "xiǎng",
    meaningEn: "To think / To want / To miss",
    meaningBn: "ভাবা/চাওয়া/মিস করা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "有",
    pinyin: "yǒu",
    meaningEn: "To have / There is / There are",
    meaningBn: "থাকা/আছে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "多少",
    pinyin: "duōshǎo",
    meaningEn: "How many / How much (with measure words)",
    meaningBn: "কত",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "个",
    pinyin: "gè",
    meaningEn: "Generic measure word",
    meaningBn: "টি/জন (গণনাবাচক শব্দ)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "哥哥",
    pinyin: "gēge",
    meaningEn: "Older brother",
    meaningBn: "বড় ভাই",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "呢",
    pinyin: "ne",
    meaningEn: "Question particle (non-yes/no questions / topic continuing)",
    meaningBn: "প্রশ্নবোধক শব্দ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "没有",
    pinyin: "méiyǒu",
    meaningEn: "To not have / There is no / Haven't (done)",
    meaningBn: "নেই/না",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "家",
    pinyin: "jiā",
    meaningEn: "Home / Family / House",
    meaningBn: "বাড়ি/পরিবার",
    hskLevel: 1,
    relatedWords: [
      {
        word: "家里",
        pinyin: "jiālǐ",
        meaningEn: "At home",
        meaningBn: "বাড়িতে",
        hskLevel: 1,
        examples: [
            { chinese: "家里很安静。", pinyin: "Jiālǐ hěn ānjìng.", meaningEn: "It's quiet at home.", meaningBn: "বাড়িতে শান্ত।" },
        ],
      },
      {
        word: "家人",
        pinyin: "jiārén",
        meaningEn: "Family members",
        meaningBn: "পরিবারের সদস্যরা",
        hskLevel: 1,
        examples: [
            { chinese: "我爱我的家人。", pinyin: "Wǒ ài wǒ de jiārén.", meaningEn: "I love my family.", meaningBn: "আমি আমার পরিবারকে ভালোবাসি।" },
        ],
      },
    ],
  },
  {
    character: "几",
    pinyin: "jǐ",
    meaningEn: "How many (small numbers, usually under 10)",
    meaningBn: "কত (ছোট সংখ্যার জন্য)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "口",
    pinyin: "kǒu",
    meaningEn: "Measure word for family members / Mouth",
    meaningBn: "জন (পরিবারের সদস্যের জন্য)/মুখ",
    hskLevel: 1,
    relatedWords: [
      {
        word: "口语",
        pinyin: "kǒuyǔ",
        meaningEn: "Spoken language",
        meaningBn: "কথ্য ভাষা",
        hskLevel: 1,
        examples: [
            { chinese: "我的口语进步很快。", pinyin: "Wǒ de kǒuyǔ jìnbù hěn kuài.", meaningEn: "My spoken Chinese improves fast.", meaningBn: "আমার কথ্য ভাষা দ্রুত উন্নত হচ্ছে।" },
        ],
      },
      {
        word: "人口",
        pinyin: "rénkǒu",
        meaningEn: "Population",
        meaningBn: "জনসংখ্যা",
        hskLevel: 1,
        examples: [
            { chinese: "中国人口很多。", pinyin: "Zhōngguó rénkǒu hěn duō.", meaningEn: "China's population is large.", meaningBn: "চীনের জনসংখ্যা বেশি।" },
        ],
      },
      {
        word: "门口",
        pinyin: "ménkǒu",
        meaningEn: "Doorway",
        meaningBn: "দরজা",
        hskLevel: 1,
        examples: [
            { chinese: "他在门口等我。", pinyin: "Tā zài ménkǒu děng wǒ.", meaningEn: "He's waiting at the door.", meaningBn: "সে দরজায় অপেক্ষা করছে।" },
        ],
      },
    ],
  },
  {
    character: "爸爸",
    pinyin: "bàba",
    meaningEn: "Dad / Father",
    meaningBn: "বাবা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "妈妈",
    pinyin: "māma",
    meaningEn: "Mom / Mother",
    meaningBn: "মা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "妹妹",
    pinyin: "mèimei",
    meaningEn: "Younger sister",
    meaningBn: "ছোট বোন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "和",
    pinyin: "hé",
    meaningEn: "And / With",
    meaningBn: "এবং/সাথে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "儿子",
    pinyin: "érzi",
    meaningEn: "Son",
    meaningBn: "ছেলে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "孩子",
    pinyin: "háizi",
    meaningEn: "Children",
    meaningBn: "শিশু/সন্তান",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "女儿",
    pinyin: "nǚ'ér",
    meaningEn: "Daughter",
    meaningBn: "মেয়ে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "岁",
    pinyin: "suì",
    meaningEn: "Year (of age)",
    meaningBn: "বছর (বয়স)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "今年",
    pinyin: "jīnnián",
    meaningEn: "This year",
    meaningBn: "এই বছর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "多",
    pinyin: "duō",
    meaningEn: "How; to what extent",
    meaningBn: "কত",
    hskLevel: 1,
    relatedWords: [
      {
        word: "多少",
        pinyin: "duōshǎo",
        meaningEn: "How many",
        meaningBn: "কত",
        hskLevel: 2,
        examples: [
            { chinese: "这多少钱？", pinyin: "Zhè duōshǎo qián?", meaningEn: "How much is this?", meaningBn: "দাম কত?" },
        ],
      },
      {
        word: "多么",
        pinyin: "duōme",
        meaningEn: "How...!",
        meaningBn: "কী যে!",
        hskLevel: 2,
        examples: [
            { chinese: "今天多么热啊！", pinyin: "Jīntiān duōme rè a!", meaningEn: "How hot today!", meaningBn: "আজ কী গরম!" },
        ],
      },
      {
        word: "多数",
        pinyin: "duōshù",
        meaningEn: "Majority",
        meaningBn: "অধিকাংশ",
        hskLevel: 2,
        examples: [
            { chinese: "多数人同意这个计划。", pinyin: "Duōshù rén tóngyì zhège jìhuà.", meaningEn: "Most agree with this plan.", meaningBn: "অধিকাংশ মানুষ একমত।" },
        ],
      },
    ],
  },
  {
    character: "大",
    pinyin: "dà",
    meaningEn: "(Of age) old",
    meaningBn: "বড় (বয়স)",
    hskLevel: 1,
    relatedWords: [
      {
        word: "大小",
        pinyin: "dàxiǎo",
        meaningEn: "Size",
        meaningBn: "আয়তন",
        hskLevel: 1,
        examples: [
            { chinese: "这个箱子大小合适。", pinyin: "Zhège xiāngzi dàxiǎo héshì.", meaningEn: "This box is the right size.", meaningBn: "এই বাক্সটার আয়তন ঠিক আছে।" },
        ],
      },
      {
        word: "大学",
        pinyin: "dàxué",
        meaningEn: "University",
        meaningBn: "বিশ্ববিদ্যালয়",
        hskLevel: 1,
        examples: [
            { chinese: "我在大学学习汉语。", pinyin: "Wǒ zài dàxué xuéxí Hànyǔ.", meaningEn: "I study Chinese at university.", meaningBn: "আমি বিশ্ববিদ্যালয়ে চীনা ভাষা শিখি।" },
        ],
      },
      {
        word: "大家",
        pinyin: "dàjiā",
        meaningEn: "Everyone",
        meaningBn: "সবাই",
        hskLevel: 1,
        examples: [
            { chinese: "大家好！", pinyin: "Dàjiā hǎo!", meaningEn: "Hello everyone!", meaningBn: "সবাইকে শুভেচ্ছা!" },
        ],
      },
    ],
  },
  {
    character: "今天",
    pinyin: "jīntiān",
    meaningEn: "Today",
    meaningBn: "আজ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "号",
    pinyin: "hào",
    meaningEn: "Date",
    meaningBn: "তারিখ/সংখ্যা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "月",
    pinyin: "yuè",
    meaningEn: "Month",
    meaningBn: "মাস",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "日",
    pinyin: "rì",
    meaningEn: "Day",
    meaningBn: "দিন/তারিখ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "星期",
    pinyin: "xīngqī",
    meaningEn: "Week",
    meaningBn: "সপ্তাহ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "星期日",
    pinyin: "xīngqīrì",
    meaningEn: "Sunday",
    meaningBn: "রবিবার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "星期天",
    pinyin: "xīngqītiān",
    meaningEn: "Sunday",
    meaningBn: "রবিবার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "休息",
    pinyin: "xiūxi",
    meaningEn: "Have a rest",
    meaningBn: "বিশ্রাম নেওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "会",
    pinyin: "huì",
    meaningEn: "Can; be able to",
    meaningBn: "পারি/জানি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "做饭",
    pinyin: "zuò fàn",
    meaningEn: "Cook",
    meaningBn: "রান্না করা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "做",
    pinyin: "zuò",
    meaningEn: "Make; produce",
    meaningBn: "করা/বানানো",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "面条儿",
    pinyin: "miàntiáor",
    meaningEn: "Noodles",
    meaningBn: "নুডলস",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "饺子",
    pinyin: "jiǎozi",
    meaningEn: "Jiaozi (Chinese dumpling)",
    meaningBn: "চাইনিজ ডাম্পলিং",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "一些",
    pinyin: "yìxiē",
    meaningEn: "Some",
    meaningBn: "কিছু",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "菜",
    pinyin: "cài",
    meaningEn: "Dish; course",
    meaningBn: "পদ/সবজি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "下班",
    pinyin: "xiàbān",
    meaningEn: "Get off work",
    meaningBn: "কাজ শেষ হওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "新",
    pinyin: "xīn",
    meaningEn: "New",
    meaningBn: "নতুন",
    hskLevel: 1,
    relatedWords: [
      {
        word: "新年",
        pinyin: "xīnnián",
        meaningEn: "New Year",
        meaningBn: "নববর্ষ",
        hskLevel: 2,
        examples: [
            { chinese: "新年快乐！", pinyin: "Xīnnián kuàilè!", meaningEn: "Happy New Year!", meaningBn: "শুভ নববর্ষ!" },
        ],
      },
      {
        word: "新闻",
        pinyin: "xīnwén",
        meaningEn: "News",
        meaningBn: "সংবাদ",
        hskLevel: 2,
        examples: [
            { chinese: "我每天看新闻。", pinyin: "Wǒ měitiān kàn xīnwén.", meaningEn: "I watch news daily.", meaningBn: "আমি প্রতিদিন সংবাদ দেখি।" },
        ],
      },
      {
        word: "创新",
        pinyin: "chuàngxīn",
        meaningEn: "Innovate",
        meaningBn: "উদ্ভাবন",
        hskLevel: 2,
        examples: [
            { chinese: "这家公司很有创新精神。", pinyin: "Zhè jiā gōngsī hěn yǒu chuàngxīn jīngshén.", meaningEn: "This company is innovative.", meaningBn: "কোম্পানিটা উদ্ভাবনী।" },
        ],
      },
    ],
  },
  {
    character: "电脑",
    pinyin: "diànnǎo",
    meaningEn: "Computer",
    meaningBn: "কম্পিউটার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "真",
    pinyin: "zhēn",
    meaningEn: "Really; truly",
    meaningBn: "সত্যিই",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "好看",
    pinyin: "hǎokàn",
    meaningEn: "Beautiful; nice-looking",
    meaningBn: "সুন্দর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "喜欢",
    pinyin: "xǐhuan",
    meaningEn: "Like",
    meaningBn: "পছন্দ করা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "它",
    pinyin: "tā",
    meaningEn: "It",
    meaningBn: "এটি/উহা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "手机",
    pinyin: "shǒujī",
    meaningEn: "Cell phone / Mobile phone",
    meaningBn: "মোবাইল ফোন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "电话",
    pinyin: "diànhuà",
    meaningEn: "Telephone / Phone",
    meaningBn: "টেলিফোন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "明天",
    pinyin: "míngtiān",
    meaningEn: "Tomorrow",
    meaningBn: "আগামীকাল",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "去",
    pinyin: "qù",
    meaningEn: "To go",
    meaningBn: "যাওয়া",
    hskLevel: 1,
    relatedWords: [
      {
        word: "去年",
        pinyin: "qùnián",
        meaningEn: "Last year",
        meaningBn: "গত বছর",
        hskLevel: 3,
        examples: [
            { chinese: "去年我去了北京。", pinyin: "Qùnián wǒ qùle Běijīng.", meaningEn: "Last year I went to Beijing.", meaningBn: "গত বছর বেইজিং গিয়েছিলাম।" },
        ],
      },
      {
        word: "过去",
        pinyin: "guòqù",
        meaningEn: "The past",
        meaningBn: "অতীত",
        hskLevel: 3,
        examples: [
            { chinese: "过去的事情让它过去。", pinyin: "Guòqù de shìqing ràng tā guòqù.", meaningEn: "Let the past go.", meaningBn: "অতীতকে অতীত থাকতে দাও।" },
        ],
      },
      {
        word: "去世",
        pinyin: "qùshì",
        meaningEn: "Pass away",
        meaningBn: "মারা যাওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "他爷爷去年去世了。", pinyin: "Tā yéye qùnián qùshì le.", meaningEn: "His grandpa passed away last year.", meaningBn: "তার দাদা গত বছর মারা গেছেন।" },
        ],
      },
    ],
  },
  {
    character: "哪儿",
    pinyin: "nǎr",
    meaningEn: "Where",
    meaningBn: "কোথায়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "超市",
    pinyin: "chāoshì",
    meaningEn: "Supermarket",
    meaningBn: "সুপারমার্কেট",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "买",
    pinyin: "mǎi",
    meaningEn: "To buy",
    meaningBn: "কেনা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "买东西",
        pinyin: "mǎi dōngxi",
        meaningEn: "Go shopping",
        meaningBn: "কেনাকাটা",
        hskLevel: 3,
        examples: [
            { chinese: "妈妈去买东西了。", pinyin: "Māma qù mǎi dōngxi le.", meaningEn: "Mom went shopping.", meaningBn: "মা কেনাকাটায় গেছেন।" },
        ],
      },
      {
        word: "采购",
        pinyin: "cǎigòu",
        meaningEn: "Purchase",
        meaningBn: "সংগ্রহ করা",
        hskLevel: 3,
        examples: [
            { chinese: "我负责公司采购。", pinyin: "Wǒ fùzé gōngsī cǎigòu.", meaningEn: "I handle company purchases.", meaningBn: "ক্রয়ের দায়িত্ব আমার।" },
        ],
      },
    ],
  },
  {
    character: "东西",
    pinyin: "dōngxi",
    meaningEn: "Things / Stuff / Objects",
    meaningBn: "জিনিসপত্র",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "些",
    pinyin: "xiē",
    meaningEn: "Some (plural marker)",
    meaningBn: "কিছু",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "牛奶",
    pinyin: "niúnǎi",
    meaningEn: "Milk (cow's milk)",
    meaningBn: "দুধ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "吃",
    pinyin: "chī",
    meaningEn: "To eat",
    meaningBn: "খাওয়া",
    hskLevel: 1,
    relatedWords: [
      {
        word: "吃饭",
        pinyin: "chīfàn",
        meaningEn: "Eat a meal",
        meaningBn: "খাবার খাওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "我们十二点吃饭。", pinyin: "Wǒmen shí'èr diǎn chīfàn.", meaningEn: "We eat at twelve.", meaningBn: "বারোটায় খাই।" },
        ],
      },
      {
        word: "吃惊",
        pinyin: "chījīng",
        meaningEn: "Surprised",
        meaningBn: "অবাক",
        hskLevel: 3,
        examples: [
            { chinese: "这个消息让我吃惊。", pinyin: "Zhège xiāoxi ràng wǒ chījīng.", meaningEn: "This news surprised me.", meaningBn: "এই খবরে অবাক হলাম।" },
        ],
      },
      {
        word: "小吃",
        pinyin: "xiǎochī",
        meaningEn: "Snack",
        meaningBn: "নাস্তা",
        hskLevel: 3,
        examples: [
            { chinese: "北京的小吃很有名。", pinyin: "Běijīng de xiǎochī hěn yǒumíng.", meaningEn: "Beijing snacks are famous.", meaningBn: "বেইজিংয়ের নাস্তা বিখ্যাত।" },
        ],
      },
    ],
  },
  {
    character: "晚饭",
    pinyin: "wǎnfàn",
    meaningEn: "Dinner",
    meaningBn: "রাতের খাবার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "那边",
    pinyin: "nàbiān",
    meaningEn: "Over there",
    meaningBn: "ওইদিকে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "包子",
    pinyin: "bāozi",
    meaningEn: "Steamed bun",
    meaningBn: "ভাপে রান্না করা পিঠা/বান",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "非常",
    pinyin: "fēicháng",
    meaningEn: "Very / Extremely",
    meaningBn: "অত্যন্ত/খুব",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "好吃",
    pinyin: "hǎochī",
    meaningEn: "Delicious",
    meaningBn: "সুস্বাদু",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "米饭",
    pinyin: "mǐfàn",
    meaningEn: "Cooked rice",
    meaningBn: "রান্না করা ভাত",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "怎么",
    pinyin: "zěnme",
    meaningEn: "How / In what way",
    meaningBn: "কীভাবে/কেমন করে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "坐",
    pinyin: "zuò",
    meaningEn: "To sit / To ride (vehicle)",
    meaningBn: "বসা/যানবাহনে চড়া",
    hskLevel: 1,
    relatedWords: [
      {
        word: "坐下",
        pinyin: "zuòxia",
        meaningEn: "Sit down",
        meaningBn: "বসে পড়া",
        hskLevel: 3,
        examples: [
            { chinese: "请坐下说。", pinyin: "Qǐng zuòxia shuō.", meaningEn: "Sit down, please.", meaningBn: "বসে বলুন।" },
        ],
      },
      {
        word: "请坐",
        pinyin: "qǐngzuò",
        meaningEn: "Please sit",
        meaningBn: "বসুন",
        hskLevel: 3,
        examples: [
            { chinese: "您请坐。", pinyin: "Nín qǐng zuò.", meaningEn: "Please have a seat.", meaningBn: "আপনি বসুন।" },
        ],
      },
    ],
  },
  {
    character: "出租车",
    pinyin: "chūzūchē",
    meaningEn: "Taxi",
    meaningBn: "ট্যাক্সি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "西安饭店",
    pinyin: "Xī'ān Fàndiàn",
    meaningEn: "Xi'an Restaurant",
    meaningBn: "শিয়ান রেস্তোরাঁ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "现在",
    pinyin: "xiànzài",
    meaningEn: "Now",
    meaningBn: "এখন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "点",
    pinyin: "diǎn",
    meaningEn: "O'clock",
    meaningBn: "টা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "早上",
    pinyin: "zǎoshang",
    meaningEn: "Early morning",
    meaningBn: "সকাল",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "上午",
    pinyin: "shàngwǔ",
    meaningEn: "Morning (before noon)",
    meaningBn: "সকাল/পূর্বাহ্ন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "分",
    pinyin: "fēn",
    meaningEn: "Minute",
    meaningBn: "মিনিট",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "课",
    pinyin: "kè",
    meaningEn: "Class",
    meaningBn: "ক্লাস",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "下午",
    pinyin: "xiàwǔ",
    meaningEn: "Afternoon",
    meaningBn: "বিকেল/অপরাহ্ন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "见",
    pinyin: "jiàn",
    meaningEn: "Meet",
    meaningBn: "দেখা করা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "吧",
    pinyin: "ba",
    meaningEn: "Suggestion particle",
    meaningBn: "প্রস্তাববাচক অব্যয়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "电影院",
    pinyin: "diànyǐngyuàn",
    meaningEn: "Cinema",
    meaningBn: "সিনেমা হল",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "看",
    pinyin: "kàn",
    meaningEn: "To watch / To look",
    meaningBn: "দেখা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "看书",
        pinyin: "kànshū",
        meaningEn: "Read a book",
        meaningBn: "বই পড়া",
        hskLevel: 3,
        examples: [
            { chinese: "他喜欢看书。", pinyin: "Tā xǐhuan kànshū.", meaningEn: "He likes reading.", meaningBn: "সে বই পড়তে ভালোবাসে।" },
        ],
      },
      {
        word: "看见",
        pinyin: "kànjiàn",
        meaningEn: "Catch sight of",
        meaningBn: "চোখে দেখা",
        hskLevel: 3,
        examples: [
            { chinese: "我看见一只小鸟。", pinyin: "Wǒ kànjiàn yì zhī xiǎoniǎo.", meaningEn: "I saw a little bird.", meaningBn: "ছোট পাখি দেখেছি।" },
        ],
      },
    ],
  },
  {
    character: "电影",
    pinyin: "diànyǐng",
    meaningEn: "Movie",
    meaningBn: "চলচ্চিত্র",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "事",
    pinyin: "shì",
    meaningEn: "Matter / Thing",
    meaningBn: "কাজ/বিষয়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "上课",
    pinyin: "shàngkè",
    meaningEn: "To attend class",
    meaningBn: "ক্লাসে যোগ দেওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "半",
    pinyin: "bàn",
    meaningEn: "Half",
    meaningBn: "অর্ধেক",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "下课",
    pinyin: "xiàkè",
    meaningEn: "To finish class",
    meaningBn: "ক্লাস শেষ হওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "在",
    pinyin: "zài",
    meaningEn: "Be in / At a place",
    meaningBn: "থাকা/অবস্থান করা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "里",
    pinyin: "lǐ",
    meaningEn: "Inside",
    meaningBn: "ভেতর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "晚上",
    pinyin: "wǎnshang",
    meaningEn: "Evening",
    meaningBn: "সন্ধ্যা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "医院",
    pinyin: "yīyuàn",
    meaningEn: "Hospital",
    meaningBn: "হাসপাতাল",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "上班",
    pinyin: "shàngbān",
    meaningEn: "Go to work",
    meaningBn: "কাজে যাওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "店",
    pinyin: "diàn",
    meaningEn: "Shop",
    meaningBn: "দোকান",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "分钟",
    pinyin: "fēnzhōng",
    meaningEn: "Minute",
    meaningBn: "মিনিট",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "后",
    pinyin: "hòu",
    meaningEn: "After / Later",
    meaningBn: "পরে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "房间",
    pinyin: "fángjiān",
    meaningEn: "Room",
    meaningBn: "ঘর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "外",
    pinyin: "wài",
    meaningEn: "Outside",
    meaningBn: "বাহির",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "只",
    pinyin: "zhī",
    meaningEn: "Measure word for certain animals",
    meaningBn: "টি (পশুপাখি গণনার পরিমাপক)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "小",
    pinyin: "xiǎo",
    meaningEn: "Small; little",
    meaningBn: "ছোট",
    hskLevel: 1,
    relatedWords: [
      {
        word: "小孩",
        pinyin: "xiǎohái",
        meaningEn: "Child",
        meaningBn: "শিশু",
        hskLevel: 1,
        examples: [
            { chinese: "那个小孩很可爱。", pinyin: "Nàge xiǎohái hěn kě'ài.", meaningEn: "That child is very cute.", meaningBn: "ওই শিশুটি খুব মিষ্টি।" },
        ],
      },
      {
        word: "小时",
        pinyin: "xiǎoshí",
        meaningEn: "Hour",
        meaningBn: "ঘণ্টা",
        hskLevel: 1,
        examples: [
            { chinese: "我们等了两个小时。", pinyin: "Wǒmen děngle liǎng ge xiǎoshí.", meaningEn: "We waited for two hours.", meaningBn: "আমরা দুই ঘণ্টা অপেক্ষা করেছি।" },
        ],
      },
      {
        word: "小学",
        pinyin: "xiǎoxué",
        meaningEn: "Primary school",
        meaningBn: "প্রাথমিক বিদ্যালয়",
        hskLevel: 1,
        examples: [
            { chinese: "我在小学教书。", pinyin: "Wǒ zài xiǎoxué jiāoshū.", meaningEn: "I teach at a primary school.", meaningBn: "আমি প্রাথমিক বিদ্যালয়ে পড়াই।" },
        ],
      },
    ],
  },
  {
    character: "猫",
    pinyin: "māo",
    meaningEn: "Cat",
    meaningBn: "বিড়াল",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "没",
    pinyin: "méi",
    meaningEn: "No; not; not yet",
    meaningBn: "নাই/না",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "看见",
    pinyin: "kànjiàn",
    meaningEn: "See; catch sight of",
    meaningBn: "দেখতে পাওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "桌子",
    pinyin: "zhuōzi",
    meaningEn: "Table; desk",
    meaningBn: "টেবিল",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "下",
    pinyin: "xià",
    meaningEn: "Low position or rank",
    meaningBn: "নিচে",
    hskLevel: 1,
    relatedWords: [
      {
        word: "下午",
        pinyin: "xiàwǔ",
        meaningEn: "Afternoon",
        meaningBn: "বিকেল",
        hskLevel: 1,
        examples: [
            { chinese: "下午天气很好。", pinyin: "Xiàwǔ tiānqì hěn hǎo.", meaningEn: "The weather is nice in the afternoon.", meaningBn: "বিকেলে আবহাওয়া ভালো।" },
        ],
      },
      {
        word: "下雨",
        pinyin: "xiàyǔ",
        meaningEn: "To rain",
        meaningBn: "বৃষ্টি হওয়া",
        hskLevel: 1,
        examples: [
            { chinese: "今天下午下雨了。", pinyin: "Jīntiān xiàwǔ xiàyǔ le.", meaningEn: "It rained this afternoon.", meaningBn: "আজ বিকেলে বৃষ্টি হয়েছে।" },
        ],
      },
      {
        word: "下车",
        pinyin: "xiàchē",
        meaningEn: "Get off a vehicle",
        meaningBn: "গাড়ি থেকে নামা",
        hskLevel: 1,
        examples: [
            { chinese: "到站了，请下车。", pinyin: "Dào zhàn le, qǐng xiàchē.", meaningEn: "We've arrived, please get off.", meaningBn: "স্টেশন এসেছে, নামুন।" },
        ],
      },
    ],
  },
  {
    character: "漂亮",
    pinyin: "piàoliang",
    meaningEn: "Pretty; beautiful",
    meaningBn: "সুন্দর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "学校",
    pinyin: "xuéxiào",
    meaningEn: "School",
    meaningBn: "বিদ্যালয়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "书店",
    pinyin: "shūdiàn",
    meaningEn: "Bookstore",
    meaningBn: "বইয়ের দোকান",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "前",
    pinyin: "qián",
    meaningEn: "Front / Before",
    meaningBn: "সামনে/আগে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "能",
    pinyin: "néng",
    meaningEn: "Can; be able to",
    meaningBn: "পারা/সামর্থ্য থাকা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "到",
    pinyin: "dào",
    meaningEn: "Arrive; reach",
    meaningBn: "পৌঁছানো",
    hskLevel: 1,
    relatedWords: [
      {
        word: "到达",
        pinyin: "dàodá",
        meaningEn: "Arrive",
        meaningBn: "পৌঁছানো",
        hskLevel: 3,
        examples: [
            { chinese: "飞机八点到达。", pinyin: "Fēijī bā diǎn dàodá.", meaningEn: "The plane arrives at eight.", meaningBn: "বিমান আটটায় পৌঁছাবে।" },
        ],
      },
      {
        word: "看到",
        pinyin: "kàndào",
        meaningEn: "To see",
        meaningBn: "দেখতে পাওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "我看到他了。", pinyin: "Wǒ kàndào tā le.", meaningEn: "I saw him.", meaningBn: "আমি তাকে দেখেছি।" },
        ],
      },
      {
        word: "到底",
        pinyin: "dàodǐ",
        meaningEn: "After all",
        meaningBn: "আসলে",
        hskLevel: 3,
        examples: [
            { chinese: "你到底想去哪儿？", pinyin: "Nǐ dàodǐ xiǎng qù nǎr?", meaningEn: "Where do you want to go?", meaningBn: "আসলে কোথায় যেতে চাও?" },
        ],
      },
    ],
  },
  {
    character: "午饭",
    pinyin: "wǔfàn",
    meaningEn: "Lunch",
    meaningBn: "দুপুরের খাবার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "饭",
    pinyin: "fàn",
    meaningEn: "Meal",
    meaningBn: "ভাত/খাবার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "病人",
    pinyin: "bìngrén",
    meaningEn: "Patient",
    meaningBn: "রোগী",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "医生",
    pinyin: "yīshēng",
    meaningEn: "Doctor",
    meaningBn: "ডাক্তার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "胡医生",
    pinyin: "Hú yīshēng",
    meaningEn: "Dr. Hu",
    meaningBn: "ডা. হু",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "前边",
    pinyin: "qiánbian",
    meaningEn: "Front",
    meaningBn: "সামনে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "边",
    pinyin: "biān",
    meaningEn: "Side or Edge",
    meaningBn: "পাশ/সীমানা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "那个",
    pinyin: "nàge",
    meaningEn: "That",
    meaningBn: "ওই",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "外边",
    pinyin: "wàibian",
    meaningEn: "Outside",
    meaningBn: "বাইরে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "椅子",
    pinyin: "yǐzi",
    meaningEn: "Chair",
    meaningBn: "চেয়ার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "上",
    pinyin: "shàng",
    meaningEn: "On / Above",
    meaningBn: "উপরে",
    hskLevel: 1,
    relatedWords: [
      {
        word: "上午",
        pinyin: "shàngwǔ",
        meaningEn: "Morning",
        meaningBn: "সকাল",
        hskLevel: 1,
        examples: [
            { chinese: "上午我们有三节课。", pinyin: "Shàngwǔ wǒmen yǒu sān jié kè.", meaningEn: "We have three classes in the morning.", meaningBn: "সকালে আমাদের তিনটি ক্লাস আছে।" },
        ],
      },
      {
        word: "上学",
        pinyin: "shàngxué",
        meaningEn: "Go to school",
        meaningBn: "স্কুলে যাওয়া",
        hskLevel: 1,
        examples: [
            { chinese: "孩子们早上上学。", pinyin: "Háizi men zǎoshang shàngxué.", meaningEn: "Children go to school in the morning.", meaningBn: "শিশুরা সকালে স্কুলে যায়।" },
        ],
      },
      {
        word: "上车",
        pinyin: "shàngchē",
        meaningEn: "Get on a vehicle",
        meaningBn: "গাড়িতে ওঠা",
        hskLevel: 1,
        examples: [
            { chinese: "我们上车吧。", pinyin: "Wǒmen shàngchē ba.", meaningEn: "Let's get on.", meaningBn: "চলো উঠি।" },
        ],
      },
    ],
  },
  {
    character: "本",
    pinyin: "běn",
    meaningEn: "Measure word for books",
    meaningBn: "টি (বইয়ের পরিমাপক)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "书",
    pinyin: "shū",
    meaningEn: "Book",
    meaningBn: "বই",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "那",
    pinyin: "nà",
    meaningEn: "That",
    meaningBn: "ওই/উহা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "第",
    pinyin: "dì",
    meaningEn: "Prefix for ordinal numbers",
    meaningBn: "পূরণবাচক সংখ্যার উপসর্গ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "学习",
    pinyin: "xuéxí",
    meaningEn: "Study / Learn",
    meaningBn: "পড়াশোনা করা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "白天",
    pinyin: "báitiān",
    meaningEn: "Day; daytime",
    meaningBn: "দিনের বেলা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "读书",
    pinyin: "dúshū",
    meaningEn: "Read a book",
    meaningBn: "বই পড়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "朋友",
    pinyin: "péngyou",
    meaningEn: "Friend",
    meaningBn: "বন্ধু",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "唱",
    pinyin: "chàng",
    meaningEn: "Sing",
    meaningBn: "গান গাওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "歌",
    pinyin: "gē",
    meaningEn: "Song",
    meaningBn: "গান",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "好听",
    pinyin: "hǎotīng",
    meaningEn: "Pleasant to hear",
    meaningBn: "শুনতে মধুর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "电视",
    pinyin: "diànshì",
    meaningEn: "Television",
    meaningBn: "টেলিভিশন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "狗",
    pinyin: "gǒu",
    meaningEn: "Dog",
    meaningBn: "কুকুর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "玩",
    pinyin: "wán",
    meaningEn: "Play; have fun",
    meaningBn: "খেলা করা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "杯子",
    pinyin: "bēizi",
    meaningEn: "Cup",
    meaningBn: "কাপ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "售货员",
    pinyin: "shòuhuòyuán",
    meaningEn: "Salesperson",
    meaningBn: "বিক্রয়কর্মী",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "这边",
    pinyin: "zhèbiān",
    meaningEn: "Here / This side",
    meaningBn: "এই দিকে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "钱",
    pinyin: "qián",
    meaningEn: "Money",
    meaningBn: "টাকা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "这些",
    pinyin: "zhèxiē",
    meaningEn: "These",
    meaningBn: "এইগুলি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "快",
    pinyin: "kuài",
    meaningEn: "Fast / Piece (money unit)",
    meaningBn: "দ্রুত/টাকা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "快乐",
        pinyin: "kuàilè",
        meaningEn: "Happy",
        meaningBn: "আনন্দিত",
        hskLevel: 2,
        examples: [
            { chinese: "祝你生日快乐！", pinyin: "Zhù nǐ shēngrì kuàilè!", meaningEn: "Happy birthday!", meaningBn: "শুভ জন্মদিন!" },
        ],
      },
      {
        word: "快要",
        pinyin: "kuàiyào",
        meaningEn: "About to",
        meaningBn: "প্রায়",
        hskLevel: 2,
        examples: [
            { chinese: "火车快要开了。", pinyin: "Huǒchē kuàiyào kāi le.", meaningEn: "The train is about to leave.", meaningBn: "ট্রেন ছাড়তে যাচ্ছে।" },
        ],
      },
      {
        word: "赶快",
        pinyin: "gǎnkuài",
        meaningEn: "Hurry up",
        meaningBn: "তাড়াতাড়ি",
        hskLevel: 2,
        examples: [
            { chinese: "我们赶快走吧！", pinyin: "Wǒmen gǎnkuài zǒu ba!", meaningEn: "Let's hurry!", meaningBn: "তাড়াতাড়ি চলো!" },
        ],
      },
    ],
  },
  {
    character: "那些",
    pinyin: "nàxiē",
    meaningEn: "Those",
    meaningBn: "ওইগুলি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "这儿",
    pinyin: "zhèr",
    meaningEn: "Here",
    meaningBn: "এখানে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "水果",
    pinyin: "shuǐguǒ",
    meaningEn: "Fruit",
    meaningBn: "ফল",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "少",
    pinyin: "shǎo",
    meaningEn: "Few/Little",
    meaningBn: "কম",
    hskLevel: 1,
    relatedWords: [
      {
        word: "少年",
        pinyin: "shàonián",
        meaningEn: "Juvenile",
        meaningBn: "কিশোর",
        hskLevel: 2,
        examples: [
            { chinese: "少年们在打篮球。", pinyin: "Shàonián men zài dǎ lánqiú.", meaningEn: "The teenagers play basketball.", meaningBn: "কিশোররা বাস্কেটবল খেলছে।" },
        ],
      },
      {
        word: "很少",
        pinyin: "hěnshǎo",
        meaningEn: "Rarely",
        meaningBn: "কমই",
        hskLevel: 2,
        examples: [
            { chinese: "我很少看电视。", pinyin: "Wǒ hěnshǎo kàn diànshì.", meaningEn: "I rarely watch TV.", meaningBn: "আমি কমই টিভি দেখি।" },
        ],
      },
    ],
  },
  {
    character: "斤",
    pinyin: "jīn",
    meaningEn: "Catty (Chinese weight unit = 500g)",
    meaningBn: "ক্যাটি (৫০০ গ্রাম)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "苹果",
    pinyin: "píngguǒ",
    meaningEn: "Apple",
    meaningBn: "আপেল",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "便宜",
    pinyin: "piányi",
    meaningEn: "Cheap",
    meaningBn: "সস্তা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "商店",
    pinyin: "shāngdiàn",
    meaningEn: "Shop / Store",
    meaningBn: "দোকান",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "衣服",
    pinyin: "yīfu",
    meaningEn: "Clothes",
    meaningBn: "পোশাক",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "件",
    pinyin: "jiàn",
    meaningEn: "Measure word for clothes/items",
    meaningBn: "টি (পোশাক/জিনিসের পরিমাপক)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "元",
    pinyin: "yuán",
    meaningEn: "Yuan (Chinese currency unit)",
    meaningBn: "ইউয়ান (চীনা মুদ্রা)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "怎么样",
    pinyin: "zěnmeyàng",
    meaningEn: "How about? / How is it?",
    meaningBn: "কেমন?",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "贵",
    pinyin: "guì",
    meaningEn: "Expensive",
    meaningBn: "দামি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "穿",
    pinyin: "chuān",
    meaningEn: "To wear",
    meaningBn: "পরা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "穿衣服",
        pinyin: "chuān yīfu",
        meaningEn: "Wear clothes",
        meaningBn: "জামা পরা",
        hskLevel: 3,
        examples: [
            { chinese: "早上我穿衣服。", pinyin: "Zǎoshang wǒ chuān yīfu.", meaningEn: "I get dressed in the morning.", meaningBn: "সকালে জামা পরি।" },
        ],
      },
      {
        word: "穿梭",
        pinyin: "chuānsuō",
        meaningEn: "Shuttle through",
        meaningBn: "চলাচল করা",
        hskLevel: 3,
        examples: [
            { chinese: "他在人群中穿梭。", pinyin: "Tā zài rénqún zhōng chuānsuō.", meaningEn: "He moves through the crowd.", meaningBn: "সে ভিড়ের মধ্যে চলাচল করছে।" },
        ],
      },
    ],
  },
  {
    character: "女",
    pinyin: "nǚ",
    meaningEn: "Female / Woman",
    meaningBn: "মহিলা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "女儿",
        pinyin: "nǚ'ér",
        meaningEn: "Daughter",
        meaningBn: "কন্যা",
        hskLevel: 1,
        examples: [
            { chinese: "她的女儿很聪明。", pinyin: "Tā de nǚ'ér hěn cōngming.", meaningEn: "Her daughter is smart.", meaningBn: "তার মেয়ে বুদ্ধিমতী।" },
        ],
      },
      {
        word: "女生",
        pinyin: "nǚshēng",
        meaningEn: "Female student",
        meaningBn: "ছাত্রী",
        hskLevel: 1,
        examples: [
            { chinese: "我们班有十个女生。", pinyin: "Wǒmen bān yǒu shí ge nǚshēng.", meaningEn: "Our class has ten girls.", meaningBn: "আমাদের ক্লাসে দশজন ছাত্রী আছে।" },
        ],
      },
      {
        word: "女人",
        pinyin: "nǚrén",
        meaningEn: "Woman",
        meaningBn: "নারী",
        hskLevel: 1,
        examples: [
            { chinese: "那个女人是我的老师。", pinyin: "Nàge nǚrén shì wǒ de lǎoshī.", meaningEn: "That woman is my teacher.", meaningBn: "ওই মহিলা আমার শিক্ষিকা।" },
        ],
      },
    ],
  },
  {
    character: "男",
    pinyin: "nán",
    meaningEn: "Male / Man",
    meaningBn: "পুরুষ",
    hskLevel: 1,
    relatedWords: [
      {
        word: "男生",
        pinyin: "nánshēng",
        meaningEn: "Male student",
        meaningBn: "ছাত্র",
        hskLevel: 1,
        examples: [
            { chinese: "班里有十五个男生。", pinyin: "Bān lǐ yǒu shíwǔ ge nánshēng.", meaningEn: "There are fifteen boys in class.", meaningBn: "ক্লাসে পনেরোজন ছাত্র আছে।" },
        ],
      },
      {
        word: "男人",
        pinyin: "nánrén",
        meaningEn: "Man",
        meaningBn: "পুরুষ",
        hskLevel: 1,
        examples: [
            { chinese: "那个男人是我的爸爸。", pinyin: "Nàge nánrén shì wǒ de bàba.", meaningEn: "That man is my father.", meaningBn: "ওই লোকটা আমার বাবা।" },
        ],
      },
      {
        word: "男朋友",
        pinyin: "nánpéngyou",
        meaningEn: "Boyfriend",
        meaningBn: "প্রেমিক",
        hskLevel: 1,
        examples: [
            { chinese: "她的男朋友会做菜。", pinyin: "Tā de nánpéngyou huì zuòcài.", meaningEn: "Her boyfriend can cook.", meaningBn: "তার প্রেমিক রান্না করতে পারে।" },
        ],
      },
    ],
  },
  {
    character: "那儿",
    pinyin: "nàr",
    meaningEn: "There",
    meaningBn: "ওখানে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "时候",
    pinyin: "shíhou",
    meaningEn: "Time / Period",
    meaningBn: "সময়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "饭店",
    pinyin: "fàndiàn",
    meaningEn: "Restaurant",
    meaningBn: "রেস্তোরাঁ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "知道",
    pinyin: "zhīdào",
    meaningEn: "Know",
    meaningBn: "জানা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "正在",
    pinyin: "zhèngzài",
    meaningEn: "In the process of",
    meaningBn: "বর্তমানে (কিছু করছি)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "找",
    pinyin: "zhǎo",
    meaningEn: "Look for",
    meaningBn: "খোঁজা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "找到",
        pinyin: "zhǎodào",
        meaningEn: "Find",
        meaningBn: "খুঁজে পাওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "我找到了钥匙。", pinyin: "Wǒ zhǎodào le yàoshi.", meaningEn: "I found the keys.", meaningBn: "চাবি পেয়েছি।" },
        ],
      },
      {
        word: "找钱",
        pinyin: "zhǎo qián",
        meaningEn: "Give change",
        meaningBn: "ভাংতি",
        hskLevel: 3,
        examples: [
            { chinese: "请给我找钱。", pinyin: "Qǐng gěi wǒ zhǎoqián.", meaningEn: "Change, please.", meaningBn: "ভাংতি দিন।" },
        ],
      },
    ],
  },
  {
    character: "开车",
    pinyin: "kāichē",
    meaningEn: "Drive",
    meaningBn: "গাড়ি চালানো",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "车",
    pinyin: "chē",
    meaningEn: "Vehicle",
    meaningBn: "গাড়ি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "读",
    pinyin: "dú",
    meaningEn: "To read / Study",
    meaningBn: "পড়া",
    hskLevel: 1,
    relatedWords: [
      {
        word: "读书",
        pinyin: "dúshū",
        meaningEn: "Study/read",
        meaningBn: "পড়াশোনা",
        hskLevel: 3,
        examples: [
            { chinese: "他每天读书两小时。", pinyin: "Tā měitiān dúshū liǎng xiǎoshí.", meaningEn: "He studies two hours daily.", meaningBn: "প্রতিদিন দুই ঘণ্টা পড়ে।" },
        ],
      },
      {
        word: "读者",
        pinyin: "dúzhě",
        meaningEn: "Reader",
        meaningBn: "পাঠক",
        hskLevel: 3,
        examples: [
            { chinese: "这本书受到读者欢迎。", pinyin: "Zhè běn shū shòudào dúzhě huānyíng.", meaningEn: "Readers love this book.", meaningBn: "পাঠকরা বইটা পছন্দ করেছে।" },
        ],
      },
      {
        word: "朗读",
        pinyin: "lǎngdú",
        meaningEn: "Read aloud",
        meaningBn: "জোরে পড়া",
        hskLevel: 3,
        examples: [
            { chinese: "请朗读课文。", pinyin: "Qǐng lǎngdú kèwén.", meaningEn: "Read the text aloud.", meaningBn: "পাঠ জোরে পড়ুন।" },
        ],
      },
    ],
  },
  {
    character: "大学",
    pinyin: "dàxué",
    meaningEn: "University",
    meaningBn: "বিশ্ববিদ্যালয়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "大学生",
    pinyin: "dàxuéshēng",
    meaningEn: "University student",
    meaningBn: "বিশ্ববিদ্যালয়ের ছাত্র",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "学",
    pinyin: "xué",
    meaningEn: "To learn / Study",
    meaningBn: "শেখা",
    descriptionEn: "Core action verb related to acquiring knowledge or education.",
    descriptionBn: "জ্ঞান অর্জন বা শিক্ষা গ্রহণের সাথে সম্পর্কিত মূল ক্রিয়াপদ।",
    hskLevel: 1,
    strokeCount: 8,
    relatedWords: [
      {
        word: "学生",
        pinyin: "xuéshēng",
        meaningEn: "Student",
        meaningBn: "ছাত্র",
        wordType: "Noun",
        hskLevel: 1,
        examples: [
            { chinese: "我是中文学生。", pinyin: "Wǒ shì zhōngwén xuésheng.", meaningEn: "I am a Chinese language student.", meaningBn: "আমি একজন চাইনিজ ভাষার ছাত্র।", type: "Statement" },
        ],
      },
      {
        word: "学习",
        pinyin: "xuéxí",
        meaningEn: "To learn / To study",
        meaningBn: "শেখা / অধ্যয়ন করা",
        wordType: "Verb",
        hskLevel: 1,
        examples: [
            { chinese: "我们一起学习汉语。", pinyin: "Wǒmen yìqǐ xuéxí hànyǔ.", meaningEn: "We study Chinese together.", meaningBn: "আমরা একসাথে চীনা ভাষা শিখি।", type: "Statement" },
        ],
      },
      {
        word: "学校",
        pinyin: "xuéxiào",
        meaningEn: "School",
        meaningBn: "বিদ্যালয়",
        hskLevel: 1,
        examples: [
            { chinese: "我在学校学习汉语。", pinyin: "Wǒ zài xuéxiào xuéxí Hànyǔ.", meaningEn: "I study Chinese at school.", meaningBn: "আমি স্কুলে চীনা শিখি।" },
        ],
      },
    ],
  },
  {
    character: "医",
    pinyin: "yī",
    meaningEn: "Medical / Medicine",
    meaningBn: "চিকিৎসা/ঔষধ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "弟弟",
    pinyin: "dìdi",
    meaningEn: "Younger brother",
    meaningBn: "ছোট ভাই",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "起床",
    pinyin: "qǐchuáng",
    meaningEn: "Get up; get out of bed",
    meaningBn: "ঘুম থেকে ওঠা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "睡觉",
    pinyin: "shuìjiào",
    meaningEn: "Sleep",
    meaningBn: "ঘুমানো",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "睡",
    pinyin: "shuì",
    meaningEn: "Sleep",
    meaningBn: "ঘুমানো",
    hskLevel: 1,
    relatedWords: [
      {
        word: "睡觉",
        pinyin: "shuìjiào",
        meaningEn: "To sleep",
        meaningBn: "ঘুমানো",
        hskLevel: 3,
        examples: [
            { chinese: "我十一点睡觉。", pinyin: "Wǒ shíyī diǎn shuìjiào.", meaningEn: "I sleep at eleven.", meaningBn: "এগারোটায় ঘুমাই।" },
        ],
      },
      {
        word: "睡着",
        pinyin: "shuìzháo",
        meaningEn: "Fall asleep",
        meaningBn: "ঘুমিয়ে পড়া",
        hskLevel: 3,
        examples: [
            { chinese: "孩子睡着了。", pinyin: "Háizi shuìzháo le.", meaningEn: "The child fell asleep.", meaningBn: "বাচ্চাটা ঘুমিয়ে গেছে।" },
        ],
      },
    ],
  },
  {
    character: "那里",
    pinyin: "nàlǐ",
    meaningEn: "There; that place",
    meaningBn: "ওখানে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "哪里",
    pinyin: "nǎlǐ",
    meaningEn: "Where",
    meaningBn: "কোথায়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "昨天",
    pinyin: "zuótiān",
    meaningEn: "Yesterday",
    meaningBn: "গতকাল",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "问",
    pinyin: "wèn",
    meaningEn: "Ask",
    meaningBn: "জিজ্ঞাসা করা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "问题",
        pinyin: "wèntí",
        meaningEn: "Question",
        meaningBn: "প্রশ্ন",
        hskLevel: 3,
        examples: [
            { chinese: "我有一个问题。", pinyin: "Wǒ yǒu yíge wèntí.", meaningEn: "I have a question.", meaningBn: "একটা প্রশ্ন আছে।" },
        ],
      },
      {
        word: "问好",
        pinyin: "wènhǎo",
        meaningEn: "Send regards",
        meaningBn: "শুভেচ্ছা",
        hskLevel: 3,
        examples: [
            { chinese: "请代我向你父母问好。", pinyin: "Qǐng dài wǒ xiàng nǐ fùmǔ wènhǎo.", meaningEn: "Regards to your parents.", meaningBn: "বাবা-মায়েকে শুভেচ্ছা জানাও।" },
        ],
      },
      {
        word: "访问",
        pinyin: "fǎngwèn",
        meaningEn: "Visit",
        meaningBn: "সফর",
        hskLevel: 3,
        examples: [
            { chinese: "感谢您的访问。", pinyin: "Gǎnxiè nín de fǎngwèn.", meaningEn: "Thanks for your visit.", meaningBn: "সফরের জন্য ধন্যবাদ।" },
        ],
      },
    ],
  },
  {
    character: "说",
    pinyin: "shuō",
    meaningEn: "Speak; talk; say",
    meaningBn: "বলা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "说明",
        pinyin: "shuōmíng",
        meaningEn: "Explain",
        meaningBn: "ব্যাখ্যা",
        hskLevel: 3,
        examples: [
            { chinese: "请说明一下原因。", pinyin: "Qǐng shuōmíng yíxià yuányīn.", meaningEn: "Explain the reason.", meaningBn: "কারণ ব্যাখ্যা করুন।" },
        ],
      },
      {
        word: "说笑",
        pinyin: "shuōxiào",
        meaningEn: "Talk and laugh",
        meaningBn: "হাসিখুশি আড্ডা",
        hskLevel: 3,
        examples: [
            { chinese: "朋友们在说笑。", pinyin: "Péngyou men zài shuōxiào.", meaningEn: "Friends are chatting and laughing.", meaningBn: "বন্ধুরা হাসছে।" },
        ],
      },
    ],
  },
  {
    character: "要",
    pinyin: "yào",
    meaningEn: "Want; wish",
    meaningBn: "চাওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "小朋友",
    pinyin: "xiǎopéngyǒu",
    meaningEn: "Child; kid",
    meaningBn: "বাচ্চা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "天气",
    pinyin: "tiānqì",
    meaningEn: "Weather",
    meaningBn: "আবহাওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "这里",
    pinyin: "zhèlǐ",
    meaningEn: "Here",
    meaningBn: "এখানে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "天",
    pinyin: "tiān",
    meaningEn: "Sky / Day",
    meaningBn: "আকাশ/দিন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "下雨",
    pinyin: "xià yǔ",
    meaningEn: "To rain",
    meaningBn: "বৃষ্টি হওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "了",
    pinyin: "le",
    meaningEn: "Particle (indicates change or completed action)",
    meaningBn: "হয়েছে/গেছে (পার্টিকেল)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "雨",
    pinyin: "yǔ",
    meaningEn: "Rain",
    meaningBn: "বৃষ্টি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "有点儿",
    pinyin: "yǒudiǎnr",
    meaningEn: "A bit / Slightly",
    meaningBn: "একটু",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "觉得",
    pinyin: "juéde",
    meaningEn: "To feel / To think",
    meaningBn: "মনে হওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "冷",
    pinyin: "lěng",
    meaningEn: "Cold",
    meaningBn: "ঠান্ডা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "冰冷",
        pinyin: "bīnglěng",
        meaningEn: "Ice-cold",
        meaningBn: "বরফ ঠান্ডা",
        hskLevel: 2,
        examples: [
            { chinese: "河水冰冷。", pinyin: "Héshuǐ bīnglěng.", meaningEn: "The river is ice-cold.", meaningBn: "নদীর পানি বরফ ঠান্ডা।" },
        ],
      },
      {
        word: "冷静",
        pinyin: "lěngjìng",
        meaningEn: "Calm",
        meaningBn: "শান্ত",
        hskLevel: 2,
        examples: [
            { chinese: "请冷静一下。", pinyin: "Qǐng lěngjìng yíxià.", meaningEn: "Please calm down.", meaningBn: "শান্ত হও।" },
        ],
      },
    ],
  },
  {
    character: "雪",
    pinyin: "xuě",
    meaningEn: "Snow",
    meaningBn: "বরফ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "来",
    pinyin: "lái",
    meaningEn: "To come",
    meaningBn: "আসা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "来不及",
        pinyin: "láibují",
        meaningEn: "Too late",
        meaningBn: "দেরি হওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "时间来不及了。", pinyin: "Shíjiān láibují le.", meaningEn: "There's no time left.", meaningBn: "সময় নেই।" },
        ],
      },
      {
        word: "未来",
        pinyin: "wèilái",
        meaningEn: "Future",
        meaningBn: "ভবিষ্যৎ",
        hskLevel: 3,
        examples: [
            { chinese: "未来会更好。", pinyin: "Wèilái huì gèng hǎo.", meaningEn: "The future will be better.", meaningBn: "ভবিষ্যৎ ভালো হবে।" },
        ],
      },
      {
        word: "原来",
        pinyin: "yuánlái",
        meaningEn: "Originally",
        meaningBn: "আসলে",
        hskLevel: 3,
        examples: [
            { chinese: "原来是你！", pinyin: "Yuánlái shì nǐ!", meaningEn: "So it was you!", meaningBn: "তুমিই ছিলে!" },
        ],
      },
    ],
  },
  {
    character: "公司",
    pinyin: "gōngsī",
    meaningEn: "Company",
    meaningBn: "কোম্পানি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "生病",
    pinyin: "shēngbìng",
    meaningEn: "To fall ill",
    meaningBn: "অসুস্থ হওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "看病",
    pinyin: "kànbìng",
    meaningEn: "To see a doctor",
    meaningBn: "ডাক্তার দেখানো",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "病",
    pinyin: "bìng",
    meaningEn: "To fall ill",
    meaningBn: "অসুস্থ হওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "一点儿",
    pinyin: "yìdiǎnr",
    meaningEn: "A little bit / Some",
    meaningBn: "অল্প কিছু",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "药",
    pinyin: "yào",
    meaningEn: "Medicine",
    meaningBn: "ওষুধ",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "回",
    pinyin: "huí",
    meaningEn: "To return",
    meaningBn: "ফিরে আসা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "回家",
        pinyin: "huíjiā",
        meaningEn: "Go home",
        meaningBn: "বাড়ি ফেরা",
        hskLevel: 3,
        examples: [
            { chinese: "我六点回家。", pinyin: "Wǒ liù diǎn huíjiā.", meaningEn: "I go home at six.", meaningBn: "ছয়টায় বাড়ি ফিরি।" },
        ],
      },
      {
        word: "回答",
        pinyin: "huídá",
        meaningEn: "Answer",
        meaningBn: "উত্তর",
        hskLevel: 3,
        examples: [
            { chinese: "请回答这个问题。", pinyin: "Qǐng huídá zhège wèntí.", meaningEn: "Answer this question.", meaningBn: "উত্তর দিন।" },
        ],
      },
      {
        word: "回来",
        pinyin: "huílai",
        meaningEn: "Come back",
        meaningBn: "ফিরে আসা",
        hskLevel: 3,
        examples: [
            { chinese: "爸爸回来了。", pinyin: "Bàba huílái le.", meaningEn: "Dad is back.", meaningBn: "বাবা ফিরে এসেছেন।" },
        ],
      },
    ],
  },
  {
    character: "再",
    pinyin: "zài",
    meaningEn: "Again",
    meaningBn: "আবার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "喝",
    pinyin: "hē",
    meaningEn: "To drink",
    meaningBn: "পান করা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "喝水",
        pinyin: "hēshuǐ",
        meaningEn: "Drink water",
        meaningBn: "পানি পান",
        hskLevel: 3,
        examples: [
            { chinese: "多喝水对身体好。", pinyin: "Duō hēshuǐ duì shēntǐ hǎo.", meaningEn: "Drinking water is healthy.", meaningBn: "বেশি পানি পান করো।" },
        ],
      },
      {
        word: "喝酒",
        pinyin: "hējiǔ",
        meaningEn: "Drink alcohol",
        meaningBn: "মদ পান",
        hskLevel: 3,
        examples: [
            { chinese: "他不喝酒。", pinyin: "Tā bù hējiǔ.", meaningEn: "He doesn't drink.", meaningBn: "সে মদ খায় না।" },
        ],
      },
    ],
  },
  {
    character: "热",
    pinyin: "rè",
    meaningEn: "Hot",
    meaningBn: "গরম",
    hskLevel: 1,
    relatedWords: [
      {
        word: "热闹",
        pinyin: "rènào",
        meaningEn: "Lively",
        meaningBn: "কোলাহলপূর্ণ",
        hskLevel: 2,
        examples: [
            { chinese: "市场很热闹。", pinyin: "Shìchǎng hěn rènào.", meaningEn: "The market is lively.", meaningBn: "বাজার কোলাহলপূর্ণ।" },
        ],
      },
      {
        word: "热水",
        pinyin: "rèshuǐ",
        meaningEn: "Hot water",
        meaningBn: "গরম পানি",
        hskLevel: 2,
        examples: [
            { chinese: "请给我热水。", pinyin: "Qǐng gěi wǒ rèshuǐ.", meaningEn: "Hot water, please.", meaningBn: "গরম পানি দিন।" },
        ],
      },
      {
        word: "热情",
        pinyin: "rèqíng",
        meaningEn: "Enthusiastic",
        meaningBn: "উৎসাহী",
        hskLevel: 2,
        examples: [
            { chinese: "中国人很热情。", pinyin: "Zhōngguórén hěn rèqíng.", meaningEn: "Chinese people are warm.", meaningBn: "চীনারা অতিথিপরায়ণ।" },
        ],
      },
    ],
  },
  {
    character: "水",
    pinyin: "shuǐ",
    meaningEn: "Water",
    meaningBn: "পানি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "可以",
    pinyin: "kěyǐ",
    meaningEn: "Can / May",
    meaningBn: "পারা/অনুমতি থাকা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "问题",
    pinyin: "wèntí",
    meaningEn: "Question / Problem",
    meaningBn: "প্রশ্ন/সমস্যা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "卖",
    pinyin: "mài",
    meaningEn: "To sell",
    meaningBn: "বিক্রি করা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "拍卖",
        pinyin: "pāimài",
        meaningEn: "Auction",
        meaningBn: "নিলাম",
        hskLevel: 3,
        examples: [
            { chinese: "这幅画将被拍卖。", pinyin: "Zhè fú huà jiāng bèi pāimài.", meaningEn: "This painting will be auctioned.", meaningBn: "ছবিটা নিলামে যাবে।" },
        ],
      },
      {
        word: "外卖",
        pinyin: "wàimài",
        meaningEn: "Takeout",
        meaningBn: "হোম ডেলিভারি",
        hskLevel: 3,
        examples: [
            { chinese: "我们点外卖吧。", pinyin: "Wǒmen diǎn wàimài ba.", meaningEn: "Let's order takeout.", meaningBn: "ডেলিভারি অর্ডার করি।" },
        ],
      },
      {
        word: "卖出",
        pinyin: "màichū",
        meaningEn: "Sell out",
        meaningBn: "বিক্রি হওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "房子已经卖出了。", pinyin: "Fángzi yǐjīng màichū le.", meaningEn: "The house is sold.", meaningBn: "বাড়িটা বিক্রি হয়েছে।" },
        ],
      },
    ],
  },
  {
    character: "打电话",
    pinyin: "dǎ diànhuà",
    meaningEn: "To make a phone call",
    meaningBn: "ফোন করা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "一下",
    pinyin: "yíxià",
    meaningEn: "A bit / A short while",
    meaningBn: "একটু",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "服务员",
    pinyin: "fúwùyuán",
    meaningEn: "Waiter / Waitress",
    meaningBn: "ওয়েটার/সেবাকর্মী",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "女士",
    pinyin: "nǚshì",
    meaningEn: "Lady / Madam",
    meaningBn: "ভদ্রমহিলা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "请",
    pinyin: "qǐng",
    meaningEn: "Please",
    meaningBn: "দয়া করে",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "给",
    pinyin: "gěi",
    meaningEn: "To give",
    meaningBn: "দেওয়া",
    hskLevel: 1,
    relatedWords: [
      {
        word: "给你",
        pinyin: "gěi nǐ",
        meaningEn: "Here you are",
        meaningBn: "এই নাও",
        hskLevel: 3,
        examples: [
            { chinese: "给你，你的书。", pinyin: "Gěi nǐ, nǐ de shū.", meaningEn: "Here's your book.", meaningBn: "এই নাও, তোমার বই।" },
        ],
      },
    ],
  },
  {
    character: "杯",
    pinyin: "bēi",
    meaningEn: "Cup / Glass",
    meaningBn: "কাপ/গ্লাস",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "早饭",
    pinyin: "zǎofàn",
    meaningEn: "Breakfast",
    meaningBn: "সকালের খাবার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "这个",
    pinyin: "zhège",
    meaningEn: "This / This one",
    meaningBn: "এইটি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "面包",
    pinyin: "miànbāo",
    meaningEn: "Bread",
    meaningBn: "পাউরুটি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "鸡蛋",
    pinyin: "jīdàn",
    meaningEn: "Egg",
    meaningBn: "ডিম",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "先生",
    pinyin: "xiānsheng",
    meaningEn: "Mr. / Sir",
    meaningBn: "জনাব/মহোদয়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "一半",
    pinyin: "yíbàn",
    meaningEn: "Half",
    meaningBn: "অর্ধেক",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "茶",
    pinyin: "chá",
    meaningEn: "Tea",
    meaningBn: "চা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "火车",
    pinyin: "huǒchē",
    meaningEn: "Train",
    meaningBn: "ট্রেন",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "中午",
    pinyin: "zhōngwǔ",
    meaningEn: "Noon",
    meaningBn: "দুপুর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "开",
    pinyin: "kāi",
    meaningEn: "To drive / Open",
    meaningBn: "চালানো/খোলা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "开始",
        pinyin: "kāishǐ",
        meaningEn: "To start",
        meaningBn: "শুরু",
        hskLevel: 2,
        examples: [
            { chinese: "课程九点开始。", pinyin: "Kèchéng jiǔ diǎn kāishǐ.", meaningEn: "Class starts at nine.", meaningBn: "ক্লাস নয়টায় শুরু।" },
        ],
      },
      {
        word: "开车",
        pinyin: "kāichē",
        meaningEn: "To drive",
        meaningBn: "গাড়ি চালানো",
        hskLevel: 2,
        examples: [
            { chinese: "爸爸会开车。", pinyin: "Bàba huì kāichē.", meaningEn: "Dad can drive.", meaningBn: "বাবা গাড়ি চালান।" },
        ],
      },
    ],
  },
  {
    character: "有些",
    pinyin: "yǒuxiē",
    meaningEn: "Some",
    meaningBn: "কিছু",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "有的",
    pinyin: "yǒude",
    meaningEn: "Some",
    meaningBn: "কিছু",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "写",
    pinyin: "xiě",
    meaningEn: "To write",
    meaningBn: "লেখা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "写字",
        pinyin: "xiězì",
        meaningEn: "Write characters",
        meaningBn: "অক্ষর লেখা",
        hskLevel: 3,
        examples: [
            { chinese: "用铅笔写字。", pinyin: "Yòng qiānbǐ xiězì.", meaningEn: "Write with a pencil.", meaningBn: "পেন্সিলে লেখো।" },
        ],
      },
      {
        word: "写作",
        pinyin: "xiězuò",
        meaningEn: "Writing",
        meaningBn: "লেখালেখি",
        hskLevel: 3,
        examples: [
            { chinese: "写作是我的爱好。", pinyin: "Xiězuò shì wǒ de àihào.", meaningEn: "Writing is my hobby.", meaningBn: "লেখা আমার শখ।" },
        ],
      },
    ],
  },
  {
    character: "都",
    pinyin: "dōu",
    meaningEn: "All; both",
    meaningBn: "সব",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "听见",
    pinyin: "tīngjiàn",
    meaningEn: "To hear",
    meaningBn: "শোনা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "不要",
    pinyin: "búyào",
    meaningEn: "Don't",
    meaningBn: "না/করো না",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "说话",
    pinyin: "shuōhuà",
    meaningEn: "To speak; talk; say",
    meaningBn: "কথা বলা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "听",
    pinyin: "tīng",
    meaningEn: "To listen to; hear",
    meaningBn: "শোনা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "听音乐",
        pinyin: "tīng yīnyuè",
        meaningEn: "Listen to music",
        meaningBn: "গান শোনা",
        hskLevel: 3,
        examples: [
            { chinese: "我喜欢听音乐。", pinyin: "Wǒ xǐhuan tīng yīnyuè.", meaningEn: "I like music.", meaningBn: "আমি গান শুনি।" },
        ],
      },
      {
        word: "听到",
        pinyin: "tīngdào",
        meaningEn: "Hear",
        meaningBn: "শুনতে পাওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "我听到有人敲门。", pinyin: "Wǒ tīngdào yǒurén qiāo mén.", meaningEn: "I heard a knock.", meaningBn: "কড়া নাড়ার শব্দ শুনেছি।" },
        ],
      },
      {
        word: "听话",
        pinyin: "tīnghuà",
        meaningEn: "Obedient",
        meaningBn: "শোনামানি",
        hskLevel: 3,
        examples: [
            { chinese: "这个孩子很听话。", pinyin: "Zhège háizi hěn tīnghuà.", meaningEn: "This child is obedient.", meaningBn: "বাচ্চাটা শোনামানি।" },
        ],
      },
    ],
  },
  {
    character: "哪些",
    pinyin: "nǎxiē",
    meaningEn: "Which ones",
    meaningBn: "কোনগুলো",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "字",
    pinyin: "zì",
    meaningEn: "Character; word",
    meaningBn: "অক্ষর",
    hskLevel: 1,
    relatedWords: [
      {
        word: "汉字",
        pinyin: "Hànzì",
        meaningEn: "Chinese character",
        meaningBn: "চাইনিজ অক্ষর",
        hskLevel: 1,
        examples: [
            { chinese: "我每天学五个汉字。", pinyin: "Wǒ měitiān xué wǔ ge Hànzì.", meaningEn: "I learn five characters daily.", meaningBn: "আমি প্রতিদিন পাঁচটা অক্ষর শিখি।" },
        ],
      },
      {
        word: "字典",
        pinyin: "zìdiǎn",
        meaningEn: "Dictionary",
        meaningBn: "অভিধান",
        hskLevel: 1,
        examples: [
            { chinese: "请用字典查这个字。", pinyin: "Qǐng yòng zìdiǎn chá zhège zì.", meaningEn: "Look this word up in the dictionary.", meaningBn: "অভিধানে এই শব্দটা দেখো।" },
        ],
      },
    ],
  },
  {
    character: "汉语",
    pinyin: "Hànyǔ",
    meaningEn: "Chinese language",
    meaningBn: "চীনা ভাষা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "汉字",
    pinyin: "Hànzì",
    meaningEn: "Chinese character",
    meaningBn: "চীনা অক্ষর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "明年",
    pinyin: "míngnián",
    meaningEn: "Next year",
    meaningBn: "আগামী বছর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "中学",
    pinyin: "zhōngxué",
    meaningEn: "Middle school",
    meaningBn: "মাধ্যমিক বিদ্যালয়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "小学",
    pinyin: "xiǎoxué",
    meaningEn: "Primary school",
    meaningBn: "প্রাথমিক বিদ্যালয়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "中学生",
    pinyin: "zhōngxuéshēng",
    meaningEn: "Middle school student",
    meaningBn: "মাধ্যমিক বিদ্যালয়ের ছাত্র",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "小学生",
    pinyin: "xiǎoxuéshēng",
    meaningEn: "Primary school student",
    meaningBn: "প্রাথমিক বিদ্যালয়ের ছাত্র",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "上学",
    pinyin: "shàngxué",
    meaningEn: "To go to school",
    meaningBn: "স্কুলে যাওয়া",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "他们",
    pinyin: "tāmen",
    meaningEn: "They (male/mixed)",
    meaningBn: "তারা (পুরুষ/মিশ্র)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "她们",
    pinyin: "tāmen",
    meaningEn: "They (female)",
    meaningBn: "তারা (নারী)",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "它们",
    pinyin: "tāmen",
    meaningEn: "They (animals/things)",
    meaningBn: "সেগুলো/তারা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "晚",
    pinyin: "wǎn",
    meaningEn: "Late",
    meaningBn: "দেরি",
    hskLevel: 1,
    relatedWords: [
      {
        word: "晚上",
        pinyin: "wǎnshang",
        meaningEn: "Evening",
        meaningBn: "সন্ধ্যা",
        hskLevel: 2,
        examples: [
            { chinese: "晚上我们去吃饭。", pinyin: "Wǎnshang wǒmen qù chīfàn.", meaningEn: "We'll eat in the evening.", meaningBn: "সন্ধ্যায় খেতে যাব।" },
        ],
      },
      {
        word: "晚安",
        pinyin: "wǎn'ān",
        meaningEn: "Good night",
        meaningBn: "শুভ রাত্রি",
        hskLevel: 2,
        examples: [
            { chinese: "晚安，好梦。", pinyin: "Wǎn'ān, hǎo mèng.", meaningEn: "Good night, sweet dreams.", meaningBn: "শুভ রাত্রি, মিষ্টি স্বপ্ন।" },
        ],
      },
      {
        word: "很晚",
        pinyin: "hěnwǎn",
        meaningEn: "Very late",
        meaningBn: "খুব দেরি",
        hskLevel: 2,
        examples: [
            { chinese: "他回来得很晚。", pinyin: "Tā huílái de hěn wǎn.", meaningEn: "He came back very late.", meaningBn: "সে দেরিতে ফিরেছে।" },
        ],
      },
    ],
  },
  {
    character: "爱",
    pinyin: "ài",
    meaningEn: "Like / Love",
    meaningBn: "পছন্দ করা/ভালোবাসা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "爱好",
        pinyin: "àihào",
        meaningEn: "Hobby",
        meaningBn: "শখ",
        hskLevel: 1,
        examples: [
            { chinese: "我的爱好是画画。", pinyin: "Wǒ de àihào shì huàhuà.", meaningEn: "My hobby is painting.", meaningBn: "আমার শখ ছবি আঁকা।" },
        ],
      },
      {
        word: "爱情",
        pinyin: "àiqíng",
        meaningEn: "Romantic love",
        meaningBn: "প্রেম",
        hskLevel: 1,
        examples: [
            { chinese: "这是一个爱情故事。", pinyin: "Zhè shì yíge àiqíng gùshi.", meaningEn: "This is a love story.", meaningBn: "এটা একটা প্রেমের গল্প।" },
        ],
      },
      {
        word: "可爱",
        pinyin: "kě'ài",
        meaningEn: "Cute",
        meaningBn: "মিষ্টি",
        hskLevel: 1,
        examples: [
            { chinese: "这只猫很可爱。", pinyin: "Zhè zhī māo hěn kě'ài.", meaningEn: "This cat is cute.", meaningBn: "এই বিড়ালটা মিষ্টি।" },
        ],
      },
    ],
  },
  {
    character: "哪个",
    pinyin: "nǎge",
    meaningEn: "Which one",
    meaningBn: "কোনটি",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "去年",
    pinyin: "qùnián",
    meaningEn: "Last year",
    meaningBn: "গত বছর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "男朋友",
    pinyin: "nánpéngyou",
    meaningEn: "Boyfriend",
    meaningBn: "বয়ফ্রেন্ড",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "年",
    pinyin: "nián",
    meaningEn: "Year",
    meaningBn: "বছর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "好玩儿",
    pinyin: "hǎowánr",
    meaningEn: "Fun / Interesting",
    meaningBn: "মজার",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "飞机",
    pinyin: "fēijī",
    meaningEn: "Plane",
    meaningBn: "বিমান",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "小时",
    pinyin: "xiǎoshí",
    meaningEn: "Hour",
    meaningBn: "ঘণ্টা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "家人",
    pinyin: "jiārén",
    meaningEn: "Family",
    meaningBn: "পরিবারের সদস্য",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "时间",
    pinyin: "shíjiān",
    meaningEn: "Time",
    meaningBn: "সময়",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "机场",
    pinyin: "jīchǎng",
    meaningEn: "Airport",
    meaningBn: "বিমানবন্দর",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "接",
    pinyin: "jiē",
    meaningEn: "Meet / Pick up",
    meaningBn: "রিসিভ করা/নিতে আসা",
    hskLevel: 1,
    relatedWords: [
    ],
  },
  {
    character: "住",
    pinyin: "zhù",
    meaningEn: "Live",
    meaningBn: "বাস করা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "住房",
        pinyin: "zhùfáng",
        meaningEn: "Housing",
        meaningBn: "বাসস্থান",
        hskLevel: 3,
        examples: [
            { chinese: "城里的住房很贵。", pinyin: "Chéng lǐ de zhùfáng hěn guì.", meaningEn: "City housing is expensive.", meaningBn: "শহরে বাসা দামি।" },
        ],
      },
      {
        word: "记住",
        pinyin: "jìzhù",
        meaningEn: "Remember",
        meaningBn: "মনে রাখা",
        hskLevel: 3,
        examples: [
            { chinese: "请记住这个号码。", pinyin: "Qǐng jìzhù zhège hàomǎ.", meaningEn: "Remember this number.", meaningBn: "নম্বরটা মনে রাখুন।" },
        ],
      },
      {
        word: "住所",
        pinyin: "zhùsuǒ",
        meaningEn: "Residence",
        meaningBn: "বাসস্থান",
        hskLevel: 3,
        examples: [
            { chinese: "我的住所在市中心。", pinyin: "Wǒ de zhùsuǒ zài shìzhōngxīn.", meaningEn: "I live downtown.", meaningBn: "আমার বাসা শহরকেন্দ্রে।" },
        ],
      },
    ],
  },
  {
    character: "早",
    pinyin: "zǎo",
    meaningEn: "Early",
    meaningBn: "সকাল/তাড়াতাড়ি",
    hskLevel: 1,
    relatedWords: [
      {
        word: "早上",
        pinyin: "zǎoshang",
        meaningEn: "Early morning",
        meaningBn: "সকাল",
        hskLevel: 2,
        examples: [
            { chinese: "早上我六点起床。", pinyin: "Zǎoshang wǒ liù diǎn qǐchuáng.", meaningEn: "I get up at six.", meaningBn: "সকালে ছয়টায় উঠি।" },
        ],
      },
      {
        word: "早安",
        pinyin: "zǎo'ān",
        meaningEn: "Good morning",
        meaningBn: "শুভ সকাল",
        hskLevel: 2,
        examples: [
            { chinese: "早安，睡得好吗？", pinyin: "Zǎo'ān, shuì de hǎo ma?", meaningEn: "Good morning, slept well?", meaningBn: "শুভ সকাল, ভালো ঘুমিয়েছ?" },
        ],
      },
      {
        word: "早就",
        pinyin: "zǎojiù",
        meaningEn: "Long since",
        meaningBn: "আগেই",
        hskLevel: 2,
        examples: [
            { chinese: "我早就知道了。", pinyin: "Wǒ zǎojiù zhīdào le.", meaningEn: "I knew it long ago.", meaningBn: "আমি আগেই জেনেছি।" },
        ],
      },
    ],
  },
  {
    character: "中",
    pinyin: "zhōng",
    meaningEn: "Middle, center",
    meaningBn: "মাঝখান",
    hskLevel: 1,
    relatedWords: [
      {
        word: "中国",
        pinyin: "Zhōngguó",
        meaningEn: "China",
        meaningBn: "চীন",
        hskLevel: 1,
        examples: [
            { chinese: "中国很大。", pinyin: "Zhōngguó hěn dà.", meaningEn: "China is very big.", meaningBn: "চীন খুব বড়।" },
        ],
      },
      {
        word: "中文",
        pinyin: "Zhōngwén",
        meaningEn: "Chinese language",
        meaningBn: "চীনা ভাষা",
        hskLevel: 1,
        examples: [
            { chinese: "我在学中文。", pinyin: "Wǒ zài xué Zhōngwén.", meaningEn: "I'm learning Chinese.", meaningBn: "আমি চীনা ভাষা শিখছি।" },
        ],
      },
      {
        word: "中午",
        pinyin: "zhōngwǔ",
        meaningEn: "Noon",
        meaningBn: "দুপুর",
        hskLevel: 1,
        examples: [
            { chinese: "中午我们吃饭。", pinyin: "Zhōngwǔ wǒmen chīfàn.", meaningEn: "We eat at noon.", meaningBn: "দুপুরে আমরা খাই।" },
        ],
      },
    ],
  },
  {
    character: "生",
    pinyin: "shēng",
    meaningEn: "Born, raw, student",
    meaningBn: "জন্ম, কাঁচা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "生日",
        pinyin: "shēngrì",
        meaningEn: "Birthday",
        meaningBn: "জন্মদিন",
        hskLevel: 1,
        examples: [
            { chinese: "今天是我的生日。", pinyin: "Jīntiān shì wǒ de shēngrì.", meaningEn: "Today is my birthday.", meaningBn: "আজ আমার জন্মদিন।" },
        ],
      },
      {
        word: "医生",
        pinyin: "yīshēng",
        meaningEn: "Doctor",
        meaningBn: "ডাক্তার",
        hskLevel: 1,
        examples: [
            { chinese: "医生很忙。", pinyin: "Yīshēng hěn máng.", meaningEn: "The doctor is very busy.", meaningBn: "ডাক্তার খুব ব্যস্ত।" },
        ],
      },
      {
        word: "生病",
        pinyin: "shēngbìng",
        meaningEn: "To fall ill",
        meaningBn: "অসুস্থ হওয়া",
        hskLevel: 1,
        examples: [
            { chinese: "他生病了。", pinyin: "Tā shēngbìng le.", meaningEn: "He fell ill.", meaningBn: "সে অসুস্থ হয়ে পড়েছে।" },
        ],
      },
    ],
  },
  {
    character: "老",
    pinyin: "lǎo",
    meaningEn: "Old, experienced",
    meaningBn: "বয়স্ক",
    hskLevel: 1,
    relatedWords: [
      {
        word: "老板",
        pinyin: "lǎobǎn",
        meaningEn: "Boss",
        meaningBn: "বস",
        hskLevel: 1,
        examples: [
            { chinese: "我的老板人很好。", pinyin: "Wǒ de lǎobǎn rén hěn hǎo.", meaningEn: "My boss is very kind.", meaningBn: "আমার বস খুব ভালো মানুষ।" },
        ],
      },
      {
        word: "老人",
        pinyin: "lǎorén",
        meaningEn: "Elderly person",
        meaningBn: "বয়স্ক ব্যক্তি",
        hskLevel: 1,
        examples: [
            { chinese: "请给老人让座。", pinyin: "Qǐng gěi lǎorén ràngzuò.", meaningEn: "Please offer your seat to the elderly.", meaningBn: "বয়স্কদের আসন দিন।" },
        ],
      },
    ],
  },
  {
    character: "同",
    pinyin: "tóng",
    meaningEn: "Same, together",
    meaningBn: "একই, সাথে",
    hskLevel: 1,
    relatedWords: [
      {
        word: "同学",
        pinyin: "tóngxué",
        meaningEn: "Classmate",
        meaningBn: "সহপাঠী",
        hskLevel: 1,
        examples: [
            { chinese: "他是我最好的同学。", pinyin: "Tā shì wǒ zuì hǎo de tóngxué.", meaningEn: "He is my best classmate.", meaningBn: "সে আমার সেরা সহপাঠী।" },
        ],
      },
      {
        word: "同事",
        pinyin: "tóngshì",
        meaningEn: "Colleague",
        meaningBn: "সহকর্মী",
        hskLevel: 1,
        examples: [
            { chinese: "我的同事都是中国人。", pinyin: "Wǒ de tóngshì dōu shì Zhōngguórén.", meaningEn: "My colleagues are all Chinese.", meaningBn: "আমার সহকর্মীরা সবাই চীনা।" },
        ],
      },
      {
        word: "同意",
        pinyin: "tóngyì",
        meaningEn: "To agree",
        meaningBn: "একমত হওয়া",
        hskLevel: 1,
        examples: [
            { chinese: "我同意你的看法。", pinyin: "Wǒ tóngyì nǐ de kànfǎ.", meaningEn: "I agree with your view.", meaningBn: "আমি তোমার মতামতে একমত।" },
        ],
      },
    ],
  },
  {
    character: "友",
    pinyin: "yǒu",
    meaningEn: "Friend",
    meaningBn: "বন্ধু",
    hskLevel: 1,
    relatedWords: [
      {
        word: "朋友",
        pinyin: "péngyou",
        meaningEn: "Friend",
        meaningBn: "বন্ধু",
        hskLevel: 1,
        examples: [
            { chinese: "他有很多朋友。", pinyin: "Tā yǒu hěn duō péngyou.", meaningEn: "He has many friends.", meaningBn: "তার অনেক বন্ধু আছে।" },
        ],
      },
      {
        word: "友好",
        pinyin: "yǒuhǎo",
        meaningEn: "Friendly",
        meaningBn: "বন্ধুত্বপূর্ণ",
        hskLevel: 1,
        examples: [
            { chinese: "这里的人们很友好。", pinyin: "Zhèlǐ de rénmen hěn yǒuhǎo.", meaningEn: "The people here are friendly.", meaningBn: "এখানকার মানুষরা বন্ধুত্বপূর্ণ।" },
        ],
      },
      {
        word: "网友",
        pinyin: "wǎngyǒu",
        meaningEn: "Online friend",
        meaningBn: "ইন্টারনেট বন্ধু",
        hskLevel: 1,
        examples: [
            { chinese: "我和一个网友聊天。", pinyin: "Wǒ hé yíge wǎngyǒu liáotiān.", meaningEn: "I'm chatting with an online friend.", meaningBn: "আমি এক ইন্টারনেট বন্ধুর সাথে কথা বলছি।" },
        ],
      },
    ],
  },
  {
    character: "文",
    pinyin: "wén",
    meaningEn: "Language, culture",
    meaningBn: "ভাষা, সংস্কৃতি",
    hskLevel: 1,
    relatedWords: [
      {
        word: "英文",
        pinyin: "Yīngwén",
        meaningEn: "English",
        meaningBn: "ইংরেজি",
        hskLevel: 1,
        examples: [
            { chinese: "她的英文很好。", pinyin: "Tā de Yīngwén hěn hǎo.", meaningEn: "Her English is very good.", meaningBn: "তার ইংরেজি খুব ভালো।" },
        ],
      },
      {
        word: "文化",
        pinyin: "wénhuà",
        meaningEn: "Culture",
        meaningBn: "সংস্কৃতি",
        hskLevel: 1,
        examples: [
            { chinese: "我喜欢中国文化。", pinyin: "Wǒ xǐhuan Zhōngguó wénhuà.", meaningEn: "I like Chinese culture.", meaningBn: "আমি চীনা সংস্কৃতি পছন্দ করি।" },
        ],
      },
    ],
  },
  {
    character: "语",
    pinyin: "yǔ",
    meaningEn: "Language, speech",
    meaningBn: "ভাষা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "语言",
        pinyin: "yǔyán",
        meaningEn: "Language",
        meaningBn: "ভাষা",
        hskLevel: 1,
        examples: [
            { chinese: "汉语是一门美丽的语言。", pinyin: "Hànyǔ shì yì mén měilì de yǔyán.", meaningEn: "Chinese is a beautiful language.", meaningBn: "চীনা একটা সুন্দর ভাষা।" },
        ],
      },
      {
        word: "汉语",
        pinyin: "Hànyǔ",
        meaningEn: "Chinese",
        meaningBn: "চীনা ভাষা",
        hskLevel: 1,
        examples: [
            { chinese: "我们星期一学汉语。", pinyin: "Wǒmen xīngqīyī xué Hànyǔ.", meaningEn: "We study Chinese on Mondays.", meaningBn: "আমরা সোমবার চীনা শিখি।" },
        ],
      },
      {
        word: "英语",
        pinyin: "Yīngyǔ",
        meaningEn: "English",
        meaningBn: "ইংরেজি",
        hskLevel: 1,
        examples: [
            { chinese: "他会说英语。", pinyin: "Tā huì shuō Yīngyǔ.", meaningEn: "He can speak English.", meaningBn: "সে ইংরেজি বলতে পারে।" },
        ],
      },
    ],
  },
  {
    character: "话",
    pinyin: "huà",
    meaningEn: "Speech, talk",
    meaningBn: "কথা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "说话",
        pinyin: "shuōhuà",
        meaningEn: "To speak",
        meaningBn: "কথা বলা",
        hskLevel: 1,
        examples: [
            { chinese: "请小声说话。", pinyin: "Qǐng xiǎoshēng shuōhuà.", meaningEn: "Please speak quietly.", meaningBn: "চুপচাপ কথা বলুন।" },
        ],
      },
      {
        word: "电话",
        pinyin: "diànhuà",
        meaningEn: "Telephone",
        meaningBn: "টেলিফোন",
        hskLevel: 1,
        examples: [
            { chinese: "我在打电话。", pinyin: "Wǒ zài dǎ diànhuà.", meaningEn: "I'm making a phone call.", meaningBn: "আমি ফোন করছি।" },
        ],
      },
      {
        word: "中国话",
        pinyin: "Zhōngguóhuà",
        meaningEn: "Chinese spoken language",
        meaningBn: "চীনা ভাষা",
        hskLevel: 1,
        examples: [
            { chinese: "他会说中国话。", pinyin: "Tā huì shuō Zhōngguóhuà.", meaningEn: "He can speak Chinese.", meaningBn: "সে চীনা বলতে পারে।" },
        ],
      },
    ],
  },
  {
    character: "子",
    pinyin: "zǐ",
    meaningEn: "Child, son, suffix",
    meaningBn: "সন্তান",
    hskLevel: 1,
    relatedWords: [
      {
        word: "儿子",
        pinyin: "érzi",
        meaningEn: "Son",
        meaningBn: "ছেলেসন্তান",
        hskLevel: 1,
        examples: [
            { chinese: "我的儿子六岁。", pinyin: "Wǒ de érzi liù suì.", meaningEn: "My son is six years old.", meaningBn: "আমার ছেলের বয়স ছয়।" },
        ],
      },
      {
        word: "孩子",
        pinyin: "háizi",
        meaningEn: "Child",
        meaningBn: "শিশু",
        hskLevel: 1,
        examples: [
            { chinese: "孩子们在玩。", pinyin: "Háizi men zài wán.", meaningEn: "The children are playing.", meaningBn: "বাচ্চারা খেলছে।" },
        ],
      },
      {
        word: "桌子",
        pinyin: "zhuōzi",
        meaningEn: "Table",
        meaningBn: "টেবিল",
        hskLevel: 1,
        examples: [
            { chinese: "书在桌子上。", pinyin: "Shū zài zhuōzi shang.", meaningEn: "The book is on the table.", meaningBn: "বইটা টেবিলের ওপরে।" },
        ],
      },
    ],
  },
  {
    character: "儿",
    pinyin: "ér",
    meaningEn: "Child, son",
    meaningBn: "সন্তান",
    hskLevel: 1,
    relatedWords: [
      {
        word: "婴儿",
        pinyin: "yīng'ér",
        meaningEn: "Infant",
        meaningBn: "শিশু",
        hskLevel: 1,
        examples: [
            { chinese: "婴儿在睡觉。", pinyin: "Yīng'ér zài shuìjiào.", meaningEn: "The baby is sleeping.", meaningBn: "শিশুটা ঘুমাচ্ছে।" },
        ],
      },
    ],
  },
  {
    character: "父",
    pinyin: "fù",
    meaningEn: "Father",
    meaningBn: "বাবা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "父亲",
        pinyin: "fùqīn",
        meaningEn: "Father",
        meaningBn: "বাবা",
        hskLevel: 1,
        examples: [
            { chinese: "我的父亲是老师。", pinyin: "Wǒ de fùqīn shì lǎoshī.", meaningEn: "My father is a teacher.", meaningBn: "আমার বাবা শিক্ষক।" },
        ],
      },
      {
        word: "父母",
        pinyin: "fùmǔ",
        meaningEn: "Parents",
        meaningBn: "বাবা-মা",
        hskLevel: 1,
        examples: [
            { chinese: "我住在父母家。", pinyin: "Wǒ zhù zài fùmǔ jiā.", meaningEn: "I live at my parents' home.", meaningBn: "আমি বাবা-মায়ের বাড়িতে থাকি।" },
        ],
      },
    ],
  },
  {
    character: "母",
    pinyin: "mǔ",
    meaningEn: "Mother",
    meaningBn: "মা",
    hskLevel: 1,
    relatedWords: [
      {
        word: "母亲",
        pinyin: "mǔqīn",
        meaningEn: "Mother",
        meaningBn: "মা",
        hskLevel: 1,
        examples: [
            { chinese: "母亲做的饭很好吃。", pinyin: "Mǔqīn zuò de fàn hěn hǎochī.", meaningEn: "Mother's cooking is delicious.", meaningBn: "মায়ের রান্না মজাদার।" },
        ],
      },
    ],
  },
  {
    character: "兄",
    pinyin: "xiōng",
    meaningEn: "Elder brother",
    meaningBn: "বড় ভাই",
    hskLevel: 1,
    relatedWords: [
      {
        word: "兄弟",
        pinyin: "xiōngdì",
        meaningEn: "Brothers",
        meaningBn: "ভাইরা",
        hskLevel: 1,
        examples: [
            { chinese: "他们是亲兄弟。", pinyin: "Tāmen shì qīn xiōngdì.", meaningEn: "They are real brothers.", meaningBn: "তারা আপন ভাই।" },
        ],
      },
      {
        word: "师兄",
        pinyin: "shīxiōng",
        meaningEn: "Senior schoolmate",
        meaningBn: "সিনিয়র সহপাঠী",
        hskLevel: 1,
        examples: [
            { chinese: "师兄帮了我很多。", pinyin: "Shīxiōng bāngle wǒ hěn duō.", meaningEn: "My senior helped me a lot.", meaningBn: "সিনিয়র ভাই অনেক সাহায্য করেছে।" },
        ],
      },
    ],
  },
  {
    character: "弟",
    pinyin: "dì",
    meaningEn: "Younger brother",
    meaningBn: "ছোট ভাই",
    hskLevel: 1,
    relatedWords: [
      {
        word: "弟弟",
        pinyin: "dìdi",
        meaningEn: "Younger brother",
        meaningBn: "ছোট ভাই",
        hskLevel: 1,
        examples: [
            { chinese: "我弟弟喜欢踢球。", pinyin: "Wǒ dìdi xǐhuan tīqiú.", meaningEn: "My brother likes football.", meaningBn: "আমার ভাই ফুটবল পছন্দ করে।" },
        ],
      },
    ],
  },
  {
    character: "姐",
    pinyin: "jiě",
    meaningEn: "Elder sister",
    meaningBn: "বড় বোন",
    hskLevel: 1,
    relatedWords: [
      {
        word: "姐姐",
        pinyin: "jiějie",
        meaningEn: "Elder sister",
        meaningBn: "বড় বোন",
        hskLevel: 1,
        examples: [
            { chinese: "我姐姐在工作。", pinyin: "Wǒ jiějie zài gōngzuò.", meaningEn: "My sister is working.", meaningBn: "আমার বোন কাজ করছে।" },
        ],
      },
      {
        word: "小姐姐",
        pinyin: "xiǎojiějie",
        meaningEn: "Young lady",
        meaningBn: "তরুণী",
        hskLevel: 1,
        examples: [
            { chinese: "那位小姐姐很热心。", pinyin: "Nà wèi xiǎojiějie hěn rèxīn.", meaningEn: "That young lady is very helpful.", meaningBn: "ওই তরুণী খুব সহানুভূতিশীল।" },
        ],
      },
    ],
  },
  {
    character: "妹",
    pinyin: "mèi",
    meaningEn: "Younger sister",
    meaningBn: "ছোট বোন",
    hskLevel: 1,
    relatedWords: [
      {
        word: "妹妹",
        pinyin: "mèimei",
        meaningEn: "Younger sister",
        meaningBn: "ছোট বোন",
        hskLevel: 1,
        examples: [
            { chinese: "我妹妹在上学。", pinyin: "Wǒ mèimei zài shàngxué.", meaningEn: "My sister goes to school.", meaningBn: "আমার বোন স্কুলে পড়ে।" },
        ],
      },
      {
        word: "姐妹",
        pinyin: "jiěmèi",
        meaningEn: "Sisters",
        meaningBn: "বোনেরা",
        hskLevel: 1,
        examples: [
            { chinese: "她们是姐妹。", pinyin: "Tāmen shì jiěmèi.", meaningEn: "They are sisters.", meaningBn: "তারা বোন।" },
        ],
      },
    ],
  },
  {
    character: "亲",
    pinyin: "qīn",
    meaningEn: "Close, relative",
    meaningBn: "কাছের, আত্মীয়",
    hskLevel: 1,
    relatedWords: [
      {
        word: "亲人",
        pinyin: "qīnrén",
        meaningEn: "Relative",
        meaningBn: "আত্মীয়",
        hskLevel: 1,
        examples: [
            { chinese: "春节我和亲人在一起。", pinyin: "Chūnjié wǒ hé qīnrén zài yìqǐ.", meaningEn: "I'm with family at Spring Festival.", meaningBn: "নববর্ষে আমি আত্মীয়দের সাথে থাকি।" },
        ],
      },
      {
        word: "亲自",
        pinyin: "qīnzì",
        meaningEn: "Personally",
        meaningBn: "ব্যক্তিগতভাবে",
        hskLevel: 1,
        examples: [
            { chinese: "老师亲自来了。", pinyin: "Lǎoshī qīnzì lái le.", meaningEn: "The teacher came in person.", meaningBn: "শিক্ষক নিজে এসেছিলেন।" },
        ],
      },
      {
        word: "亲爱",
        pinyin: "qīn'ài",
        meaningEn: "Dear",
        meaningBn: "প্রিয়",
        hskLevel: 1,
        examples: [
            { chinese: "亲爱的妈妈，我爱你。", pinyin: "Qīn'ài de māma, wǒ ài nǐ.", meaningEn: "Dear mom, I love you.", meaningBn: "প্রিয় মা, আমি তোমাকে ভালোবাসি।" },
        ],
      },
    ],
  },
  {
    character: "喜",
    pinyin: "xǐ",
    meaningEn: "Joy, happy",
    meaningBn: "আনন্দ",
    hskLevel: 1,
    relatedWords: [
      {
        word: "喜欢",
        pinyin: "xǐhuan",
        meaningEn: "To like",
        meaningBn: "পছন্দ করা",
        hskLevel: 1,
        examples: [
            { chinese: "我喜欢喝茶。", pinyin: "Wǒ xǐhuan hē chá.", meaningEn: "I like drinking tea.", meaningBn: "আমি চা পছন্দ করি।" },
        ],
      },
      {
        word: "恭喜",
        pinyin: "gōngxǐ",
        meaningEn: "Congratulations",
        meaningBn: "অভিনন্দন",
        hskLevel: 1,
        examples: [
            { chinese: "恭喜你考试通过！", pinyin: "Gōngxǐ nǐ kǎoshì tōngguò!", meaningEn: "Congrats on passing the exam!", meaningBn: "পরীক্ষায় পাসের জন্য অভিনন্দন!" },
        ],
      },
    ],
  },
  {
    character: "心",
    pinyin: "xīn",
    meaningEn: "Heart, mind",
    meaningBn: "হৃদয়, মন",
    hskLevel: 1,
    relatedWords: [
      {
        word: "开心",
        pinyin: "kāixīn",
        meaningEn: "Happy",
        meaningBn: "খুশি",
        hskLevel: 1,
        examples: [
            { chinese: "今天我很开心。", pinyin: "Jīntiān wǒ hěn kāixīn.", meaningEn: "I'm happy today.", meaningBn: "আজ আমি খুশি।" },
        ],
      },
      {
        word: "心情",
        pinyin: "xīnqíng",
        meaningEn: "Mood",
        meaningBn: "মেজাজ",
        hskLevel: 1,
        examples: [
            { chinese: "她今天心情很好。", pinyin: "Tā jīntiān xīnqíng hěn hǎo.", meaningEn: "She's in a good mood.", meaningBn: "সে আজ ভালো মেজাজে আছে।" },
        ],
      },
      {
        word: "小心",
        pinyin: "xiǎoxīn",
        meaningEn: "Be careful",
        meaningBn: "সাবধান",
        hskLevel: 1,
        examples: [
            { chinese: "路上小心！", pinyin: "Lùshang xiǎoxīn!", meaningEn: "Be careful on the road!", meaningBn: "রাস্তায় সাবধান!" },
        ],
      },
    ],
  },
  {
    character: "眼",
    pinyin: "yǎn",
    meaningEn: "Eye",
    meaningBn: "চোখ",
    hskLevel: 1,
    relatedWords: [
      {
        word: "眼睛",
        pinyin: "yǎnjing",
        meaningEn: "Eye",
        meaningBn: "চোখ",
        hskLevel: 1,
        examples: [
            { chinese: "她的眼睛很漂亮。", pinyin: "Tā de yǎnjing hěn piàoliang.", meaningEn: "Her eyes are beautiful.", meaningBn: "তার চোখ সুন্দর।" },
        ],
      },
      {
        word: "眼镜",
        pinyin: "yǎnjìng",
        meaningEn: "Glasses",
        meaningBn: "চশমা",
        hskLevel: 1,
        examples: [
            { chinese: "我戴眼镜。", pinyin: "Wǒ dài yǎnjìng.", meaningEn: "I wear glasses.", meaningBn: "আমি চশমা পরি।" },
        ],
      },
    ],
  },
  {
    character: "耳",
    pinyin: "ěr",
    meaningEn: "Ear",
    meaningBn: "কান",
    hskLevel: 1,
    relatedWords: [
      {
        word: "耳朵",
        pinyin: "ěrduo",
        meaningEn: "Ear",
        meaningBn: "কান",
        hskLevel: 1,
        examples: [
            { chinese: "音乐太大，耳朵疼。", pinyin: "Yīnyuè tài dà, ěrduo téng.", meaningEn: "The music is too loud, my ears hurt.", meaningBn: "গান জোরে, কান ব্যথা করছে।" },
        ],
      },
      {
        word: "耳机",
        pinyin: "ěrjī",
        meaningEn: "Headphones",
        meaningBn: "ইয়ারফোন",
        hskLevel: 1,
        examples: [
            { chinese: "我买了新耳机。", pinyin: "Wǒ mǎile xīn ěrjī.", meaningEn: "I bought new headphones.", meaningBn: "নতুন ইয়ারফোন কিনেছি।" },
        ],
      },
    ],
  },
];
