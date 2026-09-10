// HSK 2 root-word dataset — LOCAL data, no MongoDB.
// Ordered: the user's curated root list (serial) first, then the
// remaining lesson words. Every related word appears ONCE across all
// levels (global dedupe) — if already listed under another root, it is
// not repeated here. To add a new root: copy an object, keep
// `character` unique, fill relatedWords (with examples).
import type { ChineseWordEntry } from "../types";

export const HSK2_WORDS: ChineseWordEntry[] = [
  {
    character: "师",
    pinyin: "shī",
    meaningEn: "Teacher / Master",
    meaningBn: "শিক্ষক / ওস্তাদ",
    descriptionEn: "A root character representing an expert, teacher, or military division.",
    descriptionBn: "বিশেষজ্ঞ, শিক্ষক বা গুরু বোঝাতে ব্যবহৃত মূল অক্ষর।",
    hskLevel: 2,
    strokeCount: 6,
    relatedWords: [
      {
        word: "老师",
        pinyin: "lǎoshī",
        meaningEn: "Teacher",
        meaningBn: "শিক্ষক",
        wordType: "Noun",
        hskLevel: 1,
        examples: [
            { chinese: "老师好！", pinyin: "Lǎoshī hǎo!", meaningEn: "Hello, teacher!", meaningBn: "শিক্ষক মহোদয়, নমস্কার!", type: "Greeting" },
        ],
      },
      {
        word: "师傅",
        pinyin: "shīfu",
        meaningEn: "Master worker / Artisan",
        meaningBn: "কারিগর / ওস্তাদ",
        wordType: "Noun",
        hskLevel: 2,
        examples: [
            { chinese: "师傅，请停车。", pinyin: "Shīfu, qǐng tíngchē.", meaningEn: "Driver / Master, please stop the car.", meaningBn: "ড্রাইভার ভাই, গাড়িটি থামান।", type: "Request" },
        ],
      },
    ],
  },
  {
    character: "力",
    pinyin: "lì",
    meaningEn: "Power, strength",
    meaningBn: "শক্তি",
    hskLevel: 2,
    relatedWords: [
      {
        word: "努力",
        pinyin: "nǔlì",
        meaningEn: "Hardworking",
        meaningBn: "পরিশ্রমী",
        hskLevel: 2,
        examples: [
            { chinese: "你要努力学习。", pinyin: "Nǐ yào nǔlì xuéxí.", meaningEn: "You should study hard.", meaningBn: "মন দিয়ে পড়ো।" },
        ],
      },
      {
        word: "力量",
        pinyin: "lìliàng",
        meaningEn: "Strength",
        meaningBn: "শক্তি",
        hskLevel: 2,
        examples: [
            { chinese: "团结就是力量。", pinyin: "Tuánjié jiùshì lìliàng.", meaningEn: "Unity is strength.", meaningBn: "ঐক্যই শক্তি।" },
        ],
      },
      {
        word: "能力",
        pinyin: "nénglì",
        meaningEn: "Ability",
        meaningBn: "ক্ষমতা",
        hskLevel: 2,
        examples: [
            { chinese: "她的工作能力很强。", pinyin: "Tā de gōngzuò nénglì hěn qiáng.", meaningEn: "She is very capable.", meaningBn: "তার কাজের ক্ষমতা ভালো।" },
        ],
      },
    ],
  },
  {
    character: "气",
    pinyin: "qì",
    meaningEn: "Air, anger",
    meaningBn: "বাতাস, রাগ",
    hskLevel: 2,
    relatedWords: [
      {
        word: "天气",
        pinyin: "tiānqì",
        meaningEn: "Weather",
        meaningBn: "আবহাওয়া",
        hskLevel: 2,
        examples: [
            { chinese: "今天天气很好。", pinyin: "Jīntiān tiānqì hěn hǎo.", meaningEn: "The weather is nice today.", meaningBn: "আজ আবহাওয়া ভালো।" },
        ],
      },
      {
        word: "生气",
        pinyin: "shēngqì",
        meaningEn: "Angry",
        meaningBn: "রাগ করা",
        hskLevel: 2,
        examples: [
            { chinese: "别生气了。", pinyin: "Bié shēngqì le.", meaningEn: "Don't be angry.", meaningBn: "রাগ করো না।" },
        ],
      },
      {
        word: "客气",
        pinyin: "kèqi",
        meaningEn: "Polite",
        meaningBn: "ভদ্র",
        hskLevel: 2,
        examples: [
            { chinese: "你太客气了。", pinyin: "Nǐ tài kèqi le.", meaningEn: "You're too polite.", meaningBn: "তুমি খুব ভদ্র।" },
        ],
      },
    ],
  },
  {
    character: "声",
    pinyin: "shēng",
    meaningEn: "Sound, voice",
    meaningBn: "শব্দ, কণ্ঠ",
    hskLevel: 2,
    relatedWords: [
      {
        word: "声音",
        pinyin: "shēngyīn",
        meaningEn: "Voice",
        meaningBn: "কণ্ঠস্বর",
        hskLevel: 2,
        examples: [
            { chinese: "她的声音很好听。", pinyin: "Tā de shēngyīn hěn hǎotīng.", meaningEn: "Her voice is lovely.", meaningBn: "তার গলার স্বর সুন্দর।" },
        ],
      },
      {
        word: "音乐",
        pinyin: "yīnyuè",
        meaningEn: "Music",
        meaningBn: "সঙ্গীত",
        hskLevel: 2,
        examples: [
            { chinese: "我喜欢听音乐。", pinyin: "Wǒ xǐhuan tīng yīnyuè.", meaningEn: "I like listening to music.", meaningBn: "আমি গান শুনতে পছন্দ করি।" },
        ],
      },
      {
        word: "大声",
        pinyin: "dàshēng",
        meaningEn: "Loud",
        meaningBn: "জোরে",
        hskLevel: 2,
        examples: [
            { chinese: "请大声读。", pinyin: "Qǐng dàshēng dú.", meaningEn: "Please read aloud.", meaningBn: "জোরে পড়ুন।" },
        ],
      },
    ],
  },
  {
    character: "色",
    pinyin: "sè",
    meaningEn: "Color",
    meaningBn: "রং",
    hskLevel: 2,
    relatedWords: [
      {
        word: "颜色",
        pinyin: "yánsè",
        meaningEn: "Color",
        meaningBn: "রং",
        hskLevel: 2,
        examples: [
            { chinese: "你喜欢什么颜色？", pinyin: "Nǐ xǐhuan shénme yánsè?", meaningEn: "What color do you like?", meaningBn: "কোন রং পছন্দ?" },
        ],
      },
      {
        word: "红色",
        pinyin: "hóngsè",
        meaningEn: "Red",
        meaningBn: "লাল",
        hskLevel: 2,
        examples: [
            { chinese: "我买了红色衣服。", pinyin: "Wǒ mǎile hóngsè yīfu.", meaningEn: "I bought red clothes.", meaningBn: "লাল জামা কিনেছি।" },
        ],
      },
      {
        word: "特色",
        pinyin: "tèsè",
        meaningEn: "Distinctive feature",
        meaningBn: "বৈশিষ্ট্য",
        hskLevel: 2,
        examples: [
            { chinese: "这道菜很有特色。", pinyin: "Zhè dào cài hěn yǒu tèsè.", meaningEn: "This dish is distinctive.", meaningBn: "এই খাবারটা স্বতন্ত্র।" },
        ],
      },
    ],
  },
  {
    character: "白",
    pinyin: "bái",
    meaningEn: "White, clear",
    meaningBn: "সাদা",
    hskLevel: 2,
    relatedWords: [
      {
        word: "白色",
        pinyin: "báisè",
        meaningEn: "White",
        meaningBn: "সাদা",
        hskLevel: 2,
        examples: [
            { chinese: "墙是白色的。", pinyin: "Qiáng shì báisè de.", meaningEn: "The wall is white.", meaningBn: "দেয়াল সাদা।" },
        ],
      },
      {
        word: "明白",
        pinyin: "míngbai",
        meaningEn: "To understand",
        meaningBn: "বোঝা",
        hskLevel: 2,
        examples: [
            { chinese: "我明白了。", pinyin: "Wǒ míngbai le.", meaningEn: "I understand.", meaningBn: "আমি বুঝেছি।" },
        ],
      },
      {
        word: "白天",
        pinyin: "báitiān",
        meaningEn: "Daytime",
        meaningBn: "দিনের বেলা",
        hskLevel: 2,
        examples: [
            { chinese: "白天他上班。", pinyin: "Báitiān tā shàngbān.", meaningEn: "He works in the daytime.", meaningBn: "দিনে সে কাজে যায়।" },
        ],
      },
    ],
  },
  {
    character: "黑",
    pinyin: "hēi",
    meaningEn: "Black, dark",
    meaningBn: "কালো",
    hskLevel: 2,
    relatedWords: [
      {
        word: "黑色",
        pinyin: "hēisè",
        meaningEn: "Black",
        meaningBn: "কালো",
        hskLevel: 2,
        examples: [
            { chinese: "他穿黑色裤子。", pinyin: "Tā chuān hēisè kùzi.", meaningEn: "He wears black pants.", meaningBn: "সে কালো প্যান্ট পরে।" },
        ],
      },
      {
        word: "黑暗",
        pinyin: "hēi'àn",
        meaningEn: "Dark",
        meaningBn: "অন্ধকার",
        hskLevel: 2,
        examples: [
            { chinese: "房间里很黑暗。", pinyin: "Fángjiān lǐ hěn hēi'àn.", meaningEn: "The room is dark.", meaningBn: "ঘরটা অন্ধকার।" },
        ],
      },
      {
        word: "黑板",
        pinyin: "hēibǎn",
        meaningEn: "Blackboard",
        meaningBn: "ব্ল্যাকবোর্ড",
        hskLevel: 2,
        examples: [
            { chinese: "老师在黑板上写字。", pinyin: "Lǎoshī zài hēibǎn shang xiězì.", meaningEn: "The teacher writes on the board.", meaningBn: "শিক্ষক বোর্ডে লিখছেন।" },
        ],
      },
    ],
  },
  {
    character: "红",
    pinyin: "hóng",
    meaningEn: "Red",
    meaningBn: "লাল",
    hskLevel: 2,
    relatedWords: [
      {
        word: "红包",
        pinyin: "hóngbāo",
        meaningEn: "Red envelope",
        meaningBn: "লাল খাম",
        hskLevel: 2,
        examples: [
            { chinese: "过年孩子们收红包。", pinyin: "Guònián háizi men shōu hóngbāo.", meaningEn: "Kids get red envelopes at New Year.", meaningBn: "নববর্ষে বাচ্চারা লাল খাম পায়।" },
        ],
      },
      {
        word: "网红",
        pinyin: "wǎnghóng",
        meaningEn: "Internet celebrity",
        meaningBn: "ইন্টারনেট সেলিব্রিটি",
        hskLevel: 2,
        examples: [
            { chinese: "她是一个网红。", pinyin: "Tā shì yíge wǎnghóng.", meaningEn: "She is an influencer.", meaningBn: "তিনি একজন ইনফ্লুয়েন্সার।" },
        ],
      },
    ],
  },
  {
    character: "青",
    pinyin: "qīng",
    meaningEn: "Green, youth",
    meaningBn: "সবুজ, যৌবন",
    hskLevel: 2,
    relatedWords: [
      {
        word: "青年",
        pinyin: "qīngnián",
        meaningEn: "Youth",
        meaningBn: "যুবক",
        hskLevel: 2,
        examples: [
            { chinese: "这些青年很有活力。", pinyin: "Zhèxiē qīngnián hěn yǒu huólì.", meaningEn: "These youths are energetic.", meaningBn: "এই তরুণরা কর্মচঞ্চল।" },
        ],
      },
      {
        word: "青春",
        pinyin: "qīngchūn",
        meaningEn: "Youth/prime",
        meaningBn: "তারুণ্য",
        hskLevel: 2,
        examples: [
            { chinese: "青春是美好的。", pinyin: "Qīngchūn shì měihǎo de.", meaningEn: "Youth is beautiful.", meaningBn: "তারুণ্য সুন্দর।" },
        ],
      },
    ],
  },
  {
    character: "黄",
    pinyin: "huáng",
    meaningEn: "Yellow",
    meaningBn: "হলুদ",
    hskLevel: 2,
    relatedWords: [
      {
        word: "黄色",
        pinyin: "huángsè",
        meaningEn: "Yellow",
        meaningBn: "হলুদ",
        hskLevel: 2,
        examples: [
            { chinese: "树叶变黄色了。", pinyin: "Shùyè biàn huángsè le.", meaningEn: "The leaves turned yellow.", meaningBn: "পাতা হলুদ হয়ে গেছে।" },
        ],
      },
      {
        word: "黄金",
        pinyin: "huángjīn",
        meaningEn: "Gold",
        meaningBn: "সোনা",
        hskLevel: 2,
        examples: [
            { chinese: "这块表是黄金的。", pinyin: "Zhè kuài biǎo shì huángjīn de.", meaningEn: "This watch is gold.", meaningBn: "এই ঘড়িটা সোনার।" },
        ],
      },
      {
        word: "黄河",
        pinyin: "Huáng Hé",
        meaningEn: "Yellow River",
        meaningBn: "হোয়াংহো নদী",
        hskLevel: 2,
        examples: [
            { chinese: "黄河是中国的母亲河。", pinyin: "Huáng Hé shì Zhōngguó de mǔqīn hé.", meaningEn: "The Yellow River is China's mother river.", meaningBn: "হোয়াংহো চীনের মাতৃনদী।" },
        ],
      },
    ],
  },
  {
    character: "新",
    pinyin: "xīn",
    meaningEn: "New",
    meaningBn: "নতুন",
    hskLevel: 2,
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
    character: "旧",
    pinyin: "jiù",
    meaningEn: "Old, worn",
    meaningBn: "পুরনো",
    hskLevel: 2,
    relatedWords: [
      {
        word: "旧书",
        pinyin: "jiùshū",
        meaningEn: "Old book",
        meaningBn: "পুরনো বই",
        hskLevel: 2,
        examples: [
            { chinese: "我喜欢读旧书。", pinyin: "Wǒ xǐhuan dú jiùshū.", meaningEn: "I like old books.", meaningBn: "আমি পুরনো বই পছন্দ করি।" },
        ],
      },
      {
        word: "依旧",
        pinyin: "yījiù",
        meaningEn: "Still, as before",
        meaningBn: "আগের মতোই",
        hskLevel: 2,
        examples: [
            { chinese: "他依旧每天跑步。", pinyin: "Tā yījiù měitiān pǎobù.", meaningEn: "He still runs daily.", meaningBn: "সে আগের মতো দৌড়ায়।" },
        ],
      },
    ],
  },
  {
    character: "多",
    pinyin: "duō",
    meaningEn: "Many, much",
    meaningBn: "অনেক",
    hskLevel: 2,
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
    character: "少",
    pinyin: "shǎo",
    meaningEn: "Few, less",
    meaningBn: "অল্প, কম",
    hskLevel: 2,
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
    character: "高",
    pinyin: "gāo",
    meaningEn: "High, tall",
    meaningBn: "উঁচু",
    hskLevel: 2,
    relatedWords: [
      {
        word: "高兴",
        pinyin: "gāoxìng",
        meaningEn: "Happy",
        meaningBn: "খুশি",
        hskLevel: 2,
        examples: [
            { chinese: "见到你很高兴。", pinyin: "Jiàndào nǐ hěn gāoxìng.", meaningEn: "Nice to meet you.", meaningBn: "দেখে ভালো লাগছে।" },
        ],
      },
      {
        word: "高中",
        pinyin: "gāozhōng",
        meaningEn: "High school",
        meaningBn: "হাইস্কুল",
        hskLevel: 2,
        examples: [
            { chinese: "哥哥在高中教书。", pinyin: "Gēge zài gāozhōng jiāoshū.", meaningEn: "Brother teaches at high school.", meaningBn: "ভাই হাইস্কুলে পড়ান।" },
        ],
      },
      {
        word: "高速",
        pinyin: "gāosù",
        meaningEn: "High speed",
        meaningBn: "উচ্চগতি",
        hskLevel: 2,
        examples: [
            { chinese: "这是高速公路。", pinyin: "Zhè shì gāosù gōnglù.", meaningEn: "This is a highway.", meaningBn: "এটা এক্সপ্রেসওয়ে।" },
        ],
      },
    ],
  },
  {
    character: "低",
    pinyin: "dī",
    meaningEn: "Low",
    meaningBn: "নিচু",
    hskLevel: 2,
    relatedWords: [
      {
        word: "低头",
        pinyin: "dītóu",
        meaningEn: "Lower one's head",
        meaningBn: "মাথা নিচু করা",
        hskLevel: 2,
        examples: [
            { chinese: "他低头看书。", pinyin: "Tā dītóu kànshū.", meaningEn: "He lowers his head to read.", meaningBn: "মাথা নিচু করে পড়ছে।" },
        ],
      },
      {
        word: "低音",
        pinyin: "dīyīn",
        meaningEn: "Bass",
        meaningBn: "বেজ",
        hskLevel: 2,
        examples: [
            { chinese: "我喜欢低音音乐。", pinyin: "Wǒ xǐhuan dīyīn yīnyuè.", meaningEn: "I like bass music.", meaningBn: "আমি বেজ পছন্দ করি।" },
        ],
      },
    ],
  },
  {
    character: "长",
    pinyin: "cháng",
    meaningEn: "Long",
    meaningBn: "লম্বা",
    hskLevel: 2,
    relatedWords: [
      {
        word: "长城",
        pinyin: "Chángchéng",
        meaningEn: "Great Wall",
        meaningBn: "চীনের প্রাচীর",
        hskLevel: 2,
        examples: [
            { chinese: "我去过长城。", pinyin: "Wǒ qùguo Chángchéng.", meaningEn: "I've been to the Great Wall.", meaningBn: "আমি প্রাচীরে গিয়েছি।" },
        ],
      },
      {
        word: "长大",
        pinyin: "zhǎngdà",
        meaningEn: "To grow up",
        meaningBn: "বড় হওয়া",
        hskLevel: 2,
        examples: [
            { chinese: "我想快点长大。", pinyin: "Wǒ xiǎng kuàidiǎn zhǎngdà.", meaningEn: "I want to grow up fast.", meaningBn: "আমি তাড়াতাড়ি বড় হতে চাই।" },
        ],
      },
      {
        word: "长度",
        pinyin: "chángdù",
        meaningEn: "Length",
        meaningBn: "দৈর্ঘ্য",
        hskLevel: 2,
        examples: [
            { chinese: "这条路的长度是多少？", pinyin: "Zhè tiáo lù de chángdù shì duōshǎo?", meaningEn: "How long is this road?", meaningBn: "রাস্তাটার দৈর্ঘ্য কত?" },
        ],
      },
    ],
  },
  {
    character: "短",
    pinyin: "duǎn",
    meaningEn: "Short",
    meaningBn: "ছোট, খাটো",
    hskLevel: 2,
    relatedWords: [
      {
        word: "短信",
        pinyin: "duǎnxìn",
        meaningEn: "Text message",
        meaningBn: "এসএমএস",
        hskLevel: 2,
        examples: [
            { chinese: "我给你发了短信。", pinyin: "Wǒ gěi nǐ fāle duǎnxìn.", meaningEn: "I texted you.", meaningBn: "এসএমএস পাঠিয়েছি।" },
        ],
      },
      {
        word: "短期",
        pinyin: "duǎnqī",
        meaningEn: "Short term",
        meaningBn: "স্বল্পমেয়াদ",
        hskLevel: 2,
        examples: [
            { chinese: "这只是短期工作。", pinyin: "Zhè zhǐshì duǎnqī gōngzuò.", meaningEn: "This is short-term work.", meaningBn: "এটা স্বল্পমেয়াদি কাজ।" },
        ],
      },
    ],
  },
  {
    character: "快",
    pinyin: "kuài",
    meaningEn: "Fast, happy",
    meaningBn: "দ্রুত, খুশি",
    hskLevel: 2,
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
    character: "慢",
    pinyin: "màn",
    meaningEn: "Slow",
    meaningBn: "ধীর",
    hskLevel: 2,
    relatedWords: [
      {
        word: "慢慢",
        pinyin: "mànmàn",
        meaningEn: "Slowly",
        meaningBn: "ধীরে ধীরে",
        hskLevel: 2,
        examples: [
            { chinese: "请慢慢说。", pinyin: "Qǐng mànmàn shuō.", meaningEn: "Please speak slowly.", meaningBn: "ধীরে বলুন।" },
        ],
      },
      {
        word: "慢走",
        pinyin: "mànzǒu",
        meaningEn: "Take care",
        meaningBn: "আস্তে যান",
        hskLevel: 2,
        examples: [
            { chinese: "慢走，欢迎再来。", pinyin: "Mànzǒu, huānyíng zàilái.", meaningEn: "Take care, come again.", meaningBn: "আস্তে যান, আবার আসবেন।" },
        ],
      },
    ],
  },
  {
    character: "早",
    pinyin: "zǎo",
    meaningEn: "Early, morning",
    meaningBn: "সকাল, তাড়াতাড়ি",
    hskLevel: 2,
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
    character: "晚",
    pinyin: "wǎn",
    meaningEn: "Late, evening",
    meaningBn: "সন্ধ্যা, দেরি",
    hskLevel: 2,
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
    character: "热",
    pinyin: "rè",
    meaningEn: "Hot, heat",
    meaningBn: "গরম",
    hskLevel: 2,
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
    character: "冷",
    pinyin: "lěng",
    meaningEn: "Cold",
    meaningBn: "ঠান্ডা",
    hskLevel: 2,
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
    character: "忙",
    pinyin: "máng",
    meaningEn: "Busy",
    meaningBn: "ব্যস্ত",
    hskLevel: 2,
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
    character: "闲",
    pinyin: "xián",
    meaningEn: "Idle, free",
    meaningBn: "অবসর",
    hskLevel: 2,
    relatedWords: [
      {
        word: "休闲",
        pinyin: "xiūxián",
        meaningEn: "Leisure",
        meaningBn: "অবসর",
        hskLevel: 2,
        examples: [
            { chinese: "周末我喜欢休闲。", pinyin: "Zhōumò wǒ xǐhuan xiūxián.", meaningEn: "I relax on weekends.", meaningBn: "ছুটিতে অবসর নিই।" },
        ],
      },
      {
        word: "闲聊",
        pinyin: "xiánliáo",
        meaningEn: "Chat",
        meaningBn: "আড্ডা",
        hskLevel: 2,
        examples: [
            { chinese: "我们在电话里闲聊。", pinyin: "Wǒmen zài diànhuà lǐ xiánliáo.", meaningEn: "We chatted on the phone.", meaningBn: "ফোনে আড্ডা দিলাম।" },
        ],
      },
    ],
  },
  {
    character: "开",
    pinyin: "kāi",
    meaningEn: "Open, start",
    meaningBn: "খোলা, শুরু",
    hskLevel: 2,
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
    character: "关",
    pinyin: "guān",
    meaningEn: "Close, shut",
    meaningBn: "বন্ধ",
    hskLevel: 2,
    relatedWords: [
      {
        word: "关门",
        pinyin: "guānmén",
        meaningEn: "Close doors",
        meaningBn: "দরজা বন্ধ",
        hskLevel: 2,
        examples: [
            { chinese: "商店十点关门。", pinyin: "Shāngdiàn shí diǎn guānmén.", meaningEn: "The shop closes at ten.", meaningBn: "দোকান দশটায় বন্ধ।" },
        ],
      },
      {
        word: "关系",
        pinyin: "guānxì",
        meaningEn: "Relationship",
        meaningBn: "সম্পর্ক",
        hskLevel: 2,
        examples: [
            { chinese: "我们关系很好。", pinyin: "Wǒmen guānxì hěn hǎo.", meaningEn: "We get along well.", meaningBn: "আমাদের সম্পর্ক ভালো।" },
        ],
      },
      {
        word: "关心",
        pinyin: "guānxīn",
        meaningEn: "Care for",
        meaningBn: "যত্ন করা",
        hskLevel: 2,
        examples: [
            { chinese: "老师很关心学生。", pinyin: "Lǎoshī hěn guānxīn xuésheng.", meaningEn: "Teachers care for students.", meaningBn: "শিক্ষকরা যত্ন করেন।" },
        ],
      },
    ],
  },
  {
    character: "来",
    pinyin: "lái",
    meaningEn: "Come",
    meaningBn: "আসা",
    hskLevel: 2,
    relatedWords: [
      {
        word: "来不及",
        pinyin: "láibují",
        meaningEn: "Too late",
        meaningBn: "দেরি হওয়া",
        hskLevel: 2,
        examples: [
            { chinese: "时间来不及了。", pinyin: "Shíjiān láibují le.", meaningEn: "There's no time left.", meaningBn: "সময় নেই।" },
        ],
      },
      {
        word: "未来",
        pinyin: "wèilái",
        meaningEn: "Future",
        meaningBn: "ভবিষ্যৎ",
        hskLevel: 2,
        examples: [
            { chinese: "未来会更好。", pinyin: "Wèilái huì gèng hǎo.", meaningEn: "The future will be better.", meaningBn: "ভবিষ্যৎ ভালো হবে।" },
        ],
      },
      {
        word: "原来",
        pinyin: "yuánlái",
        meaningEn: "Originally",
        meaningBn: "আসলে",
        hskLevel: 2,
        examples: [
            { chinese: "原来是你！", pinyin: "Yuánlái shì nǐ!", meaningEn: "So it was you!", meaningBn: "তুমিই ছিলে!" },
        ],
      },
    ],
  },
  {
    character: "去",
    pinyin: "qù",
    meaningEn: "Go",
    meaningBn: "যাওয়া",
    hskLevel: 2,
    relatedWords: [
      {
        word: "去年",
        pinyin: "qùnián",
        meaningEn: "Last year",
        meaningBn: "গত বছর",
        hskLevel: 2,
        examples: [
            { chinese: "去年我去了北京。", pinyin: "Qùnián wǒ qùle Běijīng.", meaningEn: "Last year I went to Beijing.", meaningBn: "গত বছর বেইজিং গিয়েছিলাম।" },
        ],
      },
      {
        word: "过去",
        pinyin: "guòqù",
        meaningEn: "The past",
        meaningBn: "অতীত",
        hskLevel: 2,
        examples: [
            { chinese: "过去的事情让它过去。", pinyin: "Guòqù de shìqing ràng tā guòqù.", meaningEn: "Let the past go.", meaningBn: "অতীতকে অতীত থাকতে দাও।" },
        ],
      },
      {
        word: "去世",
        pinyin: "qùshì",
        meaningEn: "Pass away",
        meaningBn: "মারা যাওয়া",
        hskLevel: 2,
        examples: [
            { chinese: "他爷爷去年去世了。", pinyin: "Tā yéye qùnián qùshì le.", meaningEn: "His grandpa passed away last year.", meaningBn: "তার দাদা গত বছর মারা গেছেন।" },
        ],
      },
    ],
  },
  {
    character: "回",
    pinyin: "huí",
    meaningEn: "Return",
    meaningBn: "ফেরা",
    hskLevel: 2,
    relatedWords: [
      {
        word: "回家",
        pinyin: "huíjiā",
        meaningEn: "Go home",
        meaningBn: "বাড়ি ফেরা",
        hskLevel: 2,
        examples: [
            { chinese: "我六点回家。", pinyin: "Wǒ liù diǎn huíjiā.", meaningEn: "I go home at six.", meaningBn: "ছয়টায় বাড়ি ফিরি।" },
        ],
      },
      {
        word: "回答",
        pinyin: "huídá",
        meaningEn: "Answer",
        meaningBn: "উত্তর",
        hskLevel: 2,
        examples: [
            { chinese: "请回答这个问题。", pinyin: "Qǐng huídá zhège wèntí.", meaningEn: "Answer this question.", meaningBn: "উত্তর দিন।" },
        ],
      },
      {
        word: "回来",
        pinyin: "huílai",
        meaningEn: "Come back",
        meaningBn: "ফিরে আসা",
        hskLevel: 2,
        examples: [
            { chinese: "爸爸回来了。", pinyin: "Bàba huílái le.", meaningEn: "Dad is back.", meaningBn: "বাবা ফিরে এসেছেন।" },
        ],
      },
    ],
  },
];
