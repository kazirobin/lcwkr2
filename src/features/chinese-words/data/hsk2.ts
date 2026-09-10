// HSK 2 root-word dataset — LOCAL data, no MongoDB.
// Built from the HSK lesson words (data/lesson-words.ts) in lesson
// order; curated core roots carry their relatedWords + examples.
// A related word appears ONCE across all levels (global dedupe).
// To add a new root: copy an object, keep `character` unique, fill
// relatedWords (with examples).
import type { ChineseWordEntry } from "../types";

export const HSK2_WORDS: ChineseWordEntry[] = [
  {
    character: "就",
    pinyin: "",
    meaningEn: "Exactly/Precisely",
    meaningBn: "ঠিক/অবিলম্বে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "让",
    pinyin: "",
    meaningEn: "Let/Allow",
    meaningBn: "অনুমতি দেওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "次",
    pinyin: "",
    meaningEn: "Time/Occurrence",
    meaningBn: "বার/পর্যায়",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "旅游",
    pinyin: "",
    meaningEn: "Travel",
    meaningBn: "ভ্রমণ করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "帮忙",
    pinyin: "",
    meaningEn: "Help",
    meaningBn: "সাহায্য করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "不好意思",
    pinyin: "",
    meaningEn: "Sorry/Embarrassed",
    meaningBn: "লজ্জিত/দুঃখিত",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "已经",
    pinyin: "",
    meaningEn: "Already",
    meaningBn: "ইতিমধ্যে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "介绍",
    pinyin: "",
    meaningEn: "Introduce",
    meaningBn: "পরিচয় করিয়ে দেওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "有时",
    pinyin: "",
    meaningEn: "Sometimes",
    meaningBn: "মাঝে মাঝে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "懂",
    pinyin: "",
    meaningEn: "Understand",
    meaningBn: "বুঝতে পারা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "意思",
    pinyin: "",
    meaningEn: "Meaning",
    meaningBn: "অর্থ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "北京烤鸭",
    pinyin: "",
    meaningEn: "Peking Duck",
    meaningBn: "বেইজিং রোস্ট ডাক",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "公交车",
    pinyin: "",
    meaningEn: "Bus",
    meaningBn: "গণপরিবহন বাস",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "但",
    pinyin: "",
    meaningEn: "But",
    meaningBn: "কিন্তু",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "车站",
    pinyin: "",
    meaningEn: "Station/Stop",
    meaningBn: "স্টেশন/স্টপ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "远",
    pinyin: "",
    meaningEn: "Far",
    meaningBn: "দূরবর্তী",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "打车",
    pinyin: "",
    meaningEn: "Take a taxi",
    meaningBn: "ট্যাক্সি ভাড়া করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "还是",
    pinyin: "",
    meaningEn: "Or/Had better",
    meaningBn: "অথবা/বরং",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "北京大学",
    pinyin: "",
    meaningEn: "Peking University",
    meaningBn: "বেইজিং বিশ্ববিদ্যালয়",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "啊",
    pinyin: "",
    meaningEn: "Exclamation particle",
    meaningBn: "বিস্ময়সূচক কণা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "万",
    pinyin: "",
    meaningEn: "Ten thousand",
    meaningBn: "দশ হাজার",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "名",
    pinyin: "",
    meaningEn: "Measure word for people",
    meaningBn: "ব্যক্তির জন্য পরিমাণবাচক শব্দ",
    hskLevel: 2,
    relatedWords: [
      {
        word: "名字",
        pinyin: "míngzi",
        meaningEn: "Name",
        meaningBn: "নাম",
        hskLevel: 1,
        examples: [
            { chinese: "你的名字很好听。", pinyin: "Nǐ de míngzi hěn hǎotīng.", meaningEn: "Your name sounds nice.", meaningBn: "তোমার নামটা সুন্দর।" },
        ],
      },
      {
        word: "有名",
        pinyin: "yǒumíng",
        meaningEn: "Famous",
        meaningBn: "বিখ্যাত",
        hskLevel: 1,
        examples: [
            { chinese: "这家店很有名。", pinyin: "Zhè jiā diàn hěn yǒumíng.", meaningEn: "This shop is famous.", meaningBn: "এই দোকানটা বিখ্যাত।" },
        ],
      },
      {
        word: "名片",
        pinyin: "míngpiàn",
        meaningEn: "Business card",
        meaningBn: "বিজনেস কার্ড",
        hskLevel: 1,
        examples: [
            { chinese: "这是我的名片。", pinyin: "Zhè shì wǒ de míngpiàn.", meaningEn: "This is my business card.", meaningBn: "এটা আমার কার্ড।" },
        ],
      },
    ],
  },
  {
    character: "网上",
    pinyin: "",
    meaningEn: "Online",
    meaningBn: "অনলাইনে/ইন্টারনেটে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "外国",
    pinyin: "",
    meaningEn: "Foreign country",
    meaningBn: "বিদেশ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "间",
    pinyin: "",
    meaningEn: "Measure word for rooms",
    meaningBn: "কক্ষের জন্য পরিমাণবাচক শব্দ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "教室",
    pinyin: "",
    meaningEn: "Classroom",
    meaningBn: "শ্রেণীকক্ষ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "票",
    pinyin: "",
    meaningEn: "Ticket",
    meaningBn: "টিকিট",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "别",
    pinyin: "",
    meaningEn: "Don't",
    meaningBn: "নিষেধ/না",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "过来",
    pinyin: "",
    meaningEn: "Come over",
    meaningBn: "চলে আসা/এদিকে আসা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "回来",
    pinyin: "",
    meaningEn: "Come back",
    meaningBn: "ফিরে আসা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "这么",
    pinyin: "",
    meaningEn: "So/Such",
    meaningBn: "এইরকম/এত",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "完",
    pinyin: "",
    meaningEn: "Finish/Complete",
    meaningBn: "শেষ করা/সম্পন্ন হওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "一起",
    pinyin: "",
    meaningEn: "Together",
    meaningBn: "একসাথে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "出去",
    pinyin: "",
    meaningEn: "Go out",
    meaningBn: "বাইরে যাওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "洗",
    pinyin: "",
    meaningEn: "Wash",
    meaningBn: "ধোয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "自己",
    pinyin: "",
    meaningEn: "Oneself",
    meaningBn: "নিজে/আত্ম",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "拿",
    pinyin: "",
    meaningEn: "Take/Hold",
    meaningBn: "নেওয়া/ধরা",
    hskLevel: 2,
    relatedWords: [
      {
        word: "拿到",
        pinyin: "nádào",
        meaningEn: "Obtain",
        meaningBn: "পাওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "我拿到了通知书。", pinyin: "Wǒ nádào le tōngzhīshū.", meaningEn: "I got the letter.", meaningBn: "আমি চিঠি পেয়েছি।" },
        ],
      },
      {
        word: "拿手",
        pinyin: "náshǒu",
        meaningEn: "Adept",
        meaningBn: "পারদর্শী",
        hskLevel: 3,
        examples: [
            { chinese: "做菜是她的拿手好戏。", pinyin: "Zuòcài shì tā de náshǒu hǎoxì.", meaningEn: "Cooking is her specialty.", meaningBn: "রান্না তার দক্ষতা।" },
        ],
      },
    ],
  },
  {
    character: "手",
    pinyin: "",
    meaningEn: "Hand",
    meaningBn: "হাত",
    hskLevel: 2,
    relatedWords: [
      {
        word: "手机",
        pinyin: "shǒujī",
        meaningEn: "Mobile phone",
        meaningBn: "মোবাইল ফোন",
        hskLevel: 1,
        examples: [
            { chinese: "我的手机没电了。", pinyin: "Wǒ de shǒujī méi diàn le.", meaningEn: "My phone is out of battery.", meaningBn: "ফোনের চার্জ শেষ।" },
        ],
      },
      {
        word: "歌手",
        pinyin: "gēshǒu",
        meaningEn: "Singer",
        meaningBn: "গায়ক",
        hskLevel: 1,
        examples: [
            { chinese: "他是有名的歌手。", pinyin: "Tā shì yǒumíng de gēshǒu.", meaningEn: "He is a famous singer.", meaningBn: "তিনি বিখ্যাত গায়ক।" },
        ],
      },
      {
        word: "手表",
        pinyin: "shǒubiǎo",
        meaningEn: "Wristwatch",
        meaningBn: "হাতঘড়ি",
        hskLevel: 1,
        examples: [
            { chinese: "这块手表很贵。", pinyin: "Zhè kuài shǒubiǎo hěn guì.", meaningEn: "This watch is expensive.", meaningBn: "এই ঘড়িটা দামি।" },
        ],
      },
    ],
  },
  {
    character: "为什么",
    pinyin: "",
    meaningEn: "Why",
    meaningBn: "কেন",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "不错",
    pinyin: "",
    meaningEn: "Not bad/Pretty good",
    meaningBn: "বেশ ভালো/খারাপ না",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "送",
    pinyin: "",
    meaningEn: "Send/Deliver",
    meaningBn: "পাঠানো/পৌঁছে দেওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "累",
    pinyin: "",
    meaningEn: "Tired",
    meaningBn: "ক্লান্ত",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "过",
    pinyin: "",
    meaningEn: "Experiential marker / Past",
    meaningBn: "অতীত অভিজ্ঞতা নির্দেশক মার্কার",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "商场",
    pinyin: "",
    meaningEn: "Shopping mall",
    meaningBn: "শপিং মল",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "进去",
    pinyin: "",
    meaningEn: "Go in/Enter",
    meaningBn: "ভেতরে যাওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "条",
    pinyin: "",
    meaningEn: "Measure word for long/narrow things",
    meaningBn: "লম্বা ও সরু জিনিসের পরিমাপক শব্দ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "裤子",
    pinyin: "",
    meaningEn: "Pants",
    meaningBn: "প্যান্ট",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "白色",
    pinyin: "",
    meaningEn: "White",
    meaningBn: "সাদা রঙ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "因为",
    pinyin: "",
    meaningEn: "Because",
    meaningBn: "কারণ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "试",
    pinyin: "",
    meaningEn: "Try/Test",
    meaningBn: "চেষ্টা করা/পরখ করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "红色",
    pinyin: "",
    meaningEn: "Red",
    meaningBn: "লাল রঙ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "所以",
    pinyin: "",
    meaningEn: "So/Therefore",
    meaningBn: "তাই/অতএব",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "书包",
    pinyin: "",
    meaningEn: "Schoolbag",
    meaningBn: "স্কুলব্যাগ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "过去",
    pinyin: "",
    meaningEn: "Go over / Past",
    meaningBn: "পার হয়ে যাওয়া / অতীত",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "绿色",
    pinyin: "",
    meaningEn: "Green",
    meaningBn: "সবুজ রঙ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "黑色",
    pinyin: "",
    meaningEn: "Black",
    meaningBn: "কালো রঙ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "更",
    pinyin: "",
    meaningEn: "Even more",
    meaningBn: "আরও/আরও বেশি",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "颜色",
    pinyin: "",
    meaningEn: "Color",
    meaningBn: "রঙ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "下来",
    pinyin: "",
    meaningEn: "Come down",
    meaningBn: "নিচে নামা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "上来",
    pinyin: "",
    meaningEn: "Come up",
    meaningBn: "উপরে আসা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "上去",
    pinyin: "",
    meaningEn: "Go up",
    meaningBn: "উপরে যাওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "下面",
    pinyin: "",
    meaningEn: "Below",
    meaningBn: "নিচে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "面",
    pinyin: "",
    meaningEn: "Side/Surface",
    meaningBn: "পাশ/তল",
    hskLevel: 2,
    relatedWords: [
      {
        word: "面包",
        pinyin: "miànbāo",
        meaningEn: "Bread",
        meaningBn: "পাউরুটি",
        hskLevel: 1,
        examples: [
            { chinese: "早餐有面包和牛奶。", pinyin: "Zǎocān yǒu miànbāo hé niúnǎi.", meaningEn: "Breakfast has bread and milk.", meaningBn: "নাশতায় রুটি ও দুধ আছে।" },
        ],
      },
      {
        word: "面条",
        pinyin: "miàntiáo",
        meaningEn: "Noodles",
        meaningBn: "নুডলস",
        hskLevel: 1,
        examples: [
            { chinese: "我喜欢吃面条。", pinyin: "Wǒ xǐhuan chī miàntiáo.", meaningEn: "I like noodles.", meaningBn: "আমি নুডলস পছন্দ করি।" },
        ],
      },
      {
        word: "见面",
        pinyin: "jiànmiàn",
        meaningEn: "To meet",
        meaningBn: "দেখা করা",
        hskLevel: 1,
        examples: [
            { chinese: "我们明天见面吧。", pinyin: "Wǒmen míngtiān jiànmiàn ba.", meaningEn: "Let's meet tomorrow.", meaningBn: "কাল দেখা হবে।" },
        ],
      },
    ],
  },
  {
    character: "等",
    pinyin: "",
    meaningEn: "Wait",
    meaningBn: "অপেক্ষা করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "一会儿",
    pinyin: "",
    meaningEn: "A moment",
    meaningBn: "একটু পরে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "下去",
    pinyin: "",
    meaningEn: "Go down",
    meaningBn: "নিচে যাওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "进来",
    pinyin: "",
    meaningEn: "Come in",
    meaningBn: "ভেতরে আসা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "爷爷",
    pinyin: "",
    meaningEn: "Grandfather (paternal)",
    meaningBn: "দাদা (বাবার বাবা)",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "奶奶",
    pinyin: "",
    meaningEn: "Grandmother (paternal)",
    meaningBn: "দাদি (বাবার মা)",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "礼物",
    pinyin: "",
    meaningEn: "Gift",
    meaningBn: "উপহার",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "准备",
    pinyin: "",
    meaningEn: "Prepare",
    meaningBn: "প্রস্তুত করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "奶茶",
    pinyin: "",
    meaningEn: "Milk tea",
    meaningBn: "দুধ চা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "跟",
    pinyin: "",
    meaningEn: "With",
    meaningBn: "সাথে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "走",
    pinyin: "",
    meaningEn: "Walk/Go",
    meaningBn: "হাঁটা/যাওয়া",
    hskLevel: 2,
    relatedWords: [
      {
        word: "走路",
        pinyin: "zǒulù",
        meaningEn: "To walk",
        meaningBn: "হাঁটা",
        hskLevel: 3,
        examples: [
            { chinese: "我每天走路去学校。", pinyin: "Wǒ měitiān zǒulù qù xuéxiào.", meaningEn: "I walk to school daily.", meaningBn: "হেঁটে স্কুলে যাই।" },
        ],
      },
      {
        word: "走开",
        pinyin: "zǒukāi",
        meaningEn: "Go away",
        meaningBn: "চলে যাও",
        hskLevel: 3,
        examples: [
            { chinese: "走开！别烦我！", pinyin: "Zǒukāi! Bié fán wǒ!", meaningEn: "Go away! Don't bother me!", meaningBn: "চলে যাও! বিরক্ত করো না!" },
        ],
      },
      {
        word: "走红",
        pinyin: "zǒuhóng",
        meaningEn: "Become popular",
        meaningBn: "জনপ্রিয় হওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "这首歌在网上走红。", pinyin: "Zhè shǒu gē zài wǎngshang zǒuhóng.", meaningEn: "This song went viral.", meaningBn: "এই গানটা ভাইরাল হয়েছে।" },
        ],
      },
    ],
  },
  {
    character: "酒店",
    pinyin: "",
    meaningEn: "Hotel",
    meaningBn: "হোটেল",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "生日",
    pinyin: "",
    meaningEn: "Birthday",
    meaningBn: "জন্মদিন",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "忘",
    pinyin: "",
    meaningEn: "To forget",
    meaningBn: "ভুলে যাওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "画",
    pinyin: "",
    meaningEn: "To draw/paint",
    meaningBn: "ছবি আঁকা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "画笔",
    pinyin: "",
    meaningEn: "Paintbrush",
    meaningBn: "ছবি আঁকার তুলি",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "蛋糕",
    pinyin: "",
    meaningEn: "Cake",
    meaningBn: "কেক",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "快乐",
    pinyin: "",
    meaningEn: "Happy",
    meaningBn: "খুশি/আনন্দিত",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "打开",
    pinyin: "",
    meaningEn: "Open",
    meaningBn: "খোলা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "长",
    pinyin: "",
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
    character: "鱼",
    pinyin: "",
    meaningEn: "Fish",
    meaningBn: "মাছ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "肉",
    pinyin: "",
    meaningEn: "Meat",
    meaningBn: "মাংস",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "地",
    pinyin: "",
    meaningEn: "Adverbial particle",
    meaningBn: "ক্রিয়াবিশেষণ মার্কার",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "床",
    pinyin: "",
    meaningEn: "Bed",
    meaningBn: "বিছানা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "舒服",
    pinyin: "",
    meaningEn: "Comfortable",
    meaningBn: "আরামদায়ক",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "从",
    pinyin: "",
    meaningEn: "From",
    meaningBn: "থেকে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "往",
    pinyin: "",
    meaningEn: "Towards/Go",
    meaningBn: "দিকে/যাওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "跑",
    pinyin: "",
    meaningEn: "Run",
    meaningBn: "দৌড়ানো",
    hskLevel: 2,
    relatedWords: [
      {
        word: "跑步",
        pinyin: "pǎobù",
        meaningEn: "Running",
        meaningBn: "দৌড়",
        hskLevel: 3,
        examples: [
            { chinese: "早上跑步很健康。", pinyin: "Zǎoshang pǎobù hěn jiànkāng.", meaningEn: "Morning runs are healthy.", meaningBn: "সকালের দৌড় স্বাস্থ্যকর।" },
        ],
      },
      {
        word: "逃跑",
        pinyin: "táopǎo",
        meaningEn: "Escape",
        meaningBn: "পালানো",
        hskLevel: 3,
        examples: [
            { chinese: "小猫逃跑了。", pinyin: "Xiǎo māo táopǎo le.", meaningEn: "The kitten escaped.", meaningBn: "বিড়ালছানা পালিয়ে গেছে।" },
        ],
      },
    ],
  },
  {
    character: "打",
    pinyin: "",
    meaningEn: "Play/Hit",
    meaningBn: "খেলা/আঘাত করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "篮球",
    pinyin: "",
    meaningEn: "Basketball",
    meaningBn: "বাস্কেটবল",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "运动",
    pinyin: "",
    meaningEn: "Sports/Exercise",
    meaningBn: "খেলাধুলা/ব্যায়াম",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "踢",
    pinyin: "",
    meaningEn: "To kick",
    meaningBn: "লাথি দেওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "足球",
    pinyin: "",
    meaningEn: "Football/Soccer",
    meaningBn: "ফুটবল",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "球",
    pinyin: "",
    meaningEn: "Ball",
    meaningBn: "বল",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "得",
    pinyin: "",
    meaningEn: "Structural particle",
    meaningBn: "ক্রিয়া বা গুণের মাত্রা নির্দেশক কণা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "跑步",
    pinyin: "",
    meaningEn: "Running/Jogging",
    meaningBn: "দৌড়ানো/জগিং",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "游泳",
    pinyin: "",
    meaningEn: "Swimming",
    meaningBn: "সাঁতার কাটা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "游",
    pinyin: "",
    meaningEn: "To swim/roam",
    meaningBn: "সাঁতার কাটা/ঘুরে বেড়ানো",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "爱好",
    pinyin: "",
    meaningEn: "Hobby",
    meaningBn: "শখ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "开始",
    pinyin: "",
    meaningEn: "To start/Begin",
    meaningBn: "শুরু করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "手表",
    pinyin: "",
    meaningEn: "Wristwatch",
    meaningBn: "হাতঘড়ি",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "左边",
    pinyin: "",
    meaningEn: "Left side",
    meaningBn: "বাম দিক",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "左",
    pinyin: "",
    meaningEn: "Left",
    meaningBn: "বাম",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "比",
    pinyin: "",
    meaningEn: "Than/Compare",
    meaningBn: "তুলনা করা/থেকে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "右边",
    pinyin: "",
    meaningEn: "Right side",
    meaningBn: "ডান দিক",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "右",
    pinyin: "",
    meaningEn: "Right",
    meaningBn: "ডান",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "记得",
    pinyin: "",
    meaningEn: "Remember",
    meaningBn: "মনে রাখা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "爱情片",
    pinyin: "",
    meaningEn: "Romance movie",
    meaningBn: "রোমান্স সিনেমা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "有意思",
    pinyin: "",
    meaningEn: "Interesting",
    meaningBn: "আকর্ষণীয়/মজাদার",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "虽然",
    pinyin: "",
    meaningEn: "Although",
    meaningBn: "যদিও",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "但是",
    pinyin: "",
    meaningEn: "But",
    meaningBn: "কিন্তু",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "花",
    pinyin: "",
    meaningEn: "To spend",
    meaningBn: "খরচ করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "妻子",
    pinyin: "",
    meaningEn: "Wife",
    meaningBn: "স্ত্রী",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "丈夫",
    pinyin: "",
    meaningEn: "Husband",
    meaningBn: "স্বামী",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "饭馆",
    pinyin: "",
    meaningEn: "Restaurant",
    meaningBn: "রেস্তোরাঁ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "坏",
    pinyin: "",
    meaningEn: "Bad/Broken",
    meaningBn: "খারাপ/নষ্ট",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "旁边",
    pinyin: "",
    meaningEn: "Side/Beside",
    meaningBn: "পাশে/পাশ্ববর্তী",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "男孩儿",
    pinyin: "",
    meaningEn: "Boy",
    meaningBn: "ছেলে/পুরুষ শিশু",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "这样",
    pinyin: "",
    meaningEn: "Like this/In this way",
    meaningBn: "এই রকম/এইভাবে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "个子",
    pinyin: "",
    meaningEn: "Stature/Height",
    meaningBn: "উচ্চতা/শারীরিক গঠন",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "那么",
    pinyin: "",
    meaningEn: "Like that/So",
    meaningBn: "ঐ রকম/এত",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "高",
    pinyin: "",
    meaningEn: "Tall/High",
    meaningBn: "উঁচু/লম্বা",
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
    character: "门口",
    pinyin: "",
    meaningEn: "Entrance",
    meaningBn: "দরজা/প্রবেশদ্বার",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "咖啡",
    pinyin: "",
    meaningEn: "Coffee",
    meaningBn: "কফি",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "离",
    pinyin: "",
    meaningEn: "Away from",
    meaningBn: "থেকে দূরে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "近",
    pinyin: "",
    meaningEn: "Near",
    meaningBn: "কাছে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "走路",
    pinyin: "",
    meaningEn: "To walk",
    meaningBn: "হাঁটা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "周",
    pinyin: "",
    meaningEn: "Week/Cycle",
    meaningBn: "সপ্তাহ/চক্র",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "开学",
    pinyin: "",
    meaningEn: "School starts",
    meaningBn: "স্কুল শুরু হওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "门",
    pinyin: "",
    meaningEn: "Door",
    meaningBn: "দরজা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "后面",
    pinyin: "",
    meaningEn: "Behind",
    meaningBn: "পেছনে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "笔",
    pinyin: "",
    meaningEn: "Pen",
    meaningBn: "কলম",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "帮",
    pinyin: "",
    meaningEn: "To help",
    meaningBn: "সাহায্য করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "考试",
    pinyin: "",
    meaningEn: "Exam",
    meaningBn: "পরীক্ষা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "词",
    pinyin: "",
    meaningEn: "Word",
    meaningBn: "শব্দ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "本子",
    pinyin: "",
    meaningEn: "Notebook",
    meaningBn: "নোটবুক/খাতা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "错",
    pinyin: "",
    meaningEn: "Wrong",
    meaningBn: "ভুল",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "题",
    pinyin: "",
    meaningEn: "Question",
    meaningBn: "প্রশ্ন",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "考",
    pinyin: "",
    meaningEn: "To test/examine",
    meaningBn: "পরীক্ষা করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "快要",
    pinyin: "",
    meaningEn: "About to/Soon",
    meaningBn: "শীঘ্রই/প্রায়",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "笑",
    pinyin: "",
    meaningEn: "To smile/laugh",
    meaningBn: "হাসা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "头",
    pinyin: "",
    meaningEn: "Head",
    meaningBn: "মাথা",
    hskLevel: 2,
    relatedWords: [
      {
        word: "头发",
        pinyin: "tóufa",
        meaningEn: "Hair",
        meaningBn: "চুল",
        hskLevel: 1,
        examples: [
            { chinese: "她的头发很长。", pinyin: "Tā de tóufa hěn cháng.", meaningEn: "Her hair is long.", meaningBn: "তার চুল লম্বা।" },
        ],
      },
      {
        word: "馒头",
        pinyin: "mántou",
        meaningEn: "Steamed bun",
        meaningBn: "ভাপা রুটি",
        hskLevel: 1,
        examples: [
            { chinese: "早餐我吃了馒头。", pinyin: "Zǎocān wǒ chīle mántou.", meaningEn: "I had steamed buns for breakfast.", meaningBn: "নাশতায় ভাপা রুটি খেয়েছি。" },
        ],
      },
      {
        word: "龙头",
        pinyin: "lóngtóu",
        meaningEn: "Faucet",
        meaningBn: "কল",
        hskLevel: 1,
        examples: [
            { chinese: "水龙头坏了。", pinyin: "Shuǐ lóngtóu huài le.", meaningEn: "The faucet is broken.", meaningBn: "কলটা নষ্ট।" },
        ],
      },
    ],
  },
  {
    character: "疼",
    pinyin: "",
    meaningEn: "Painful/Ache",
    meaningBn: "ব্যথা হওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "经常",
    pinyin: "",
    meaningEn: "Often",
    meaningBn: "প্রায়ই",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "动",
    pinyin: "",
    meaningEn: "To move",
    meaningBn: "নড়াচড়া করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "着",
    pinyin: "",
    meaningEn: "Aspect particle (ongoing/static state)",
    meaningBn: "ক্রিয়ার চলমান বা স্থায়ী অবস্থা নির্দেশক কণা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "路上",
    pinyin: "",
    meaningEn: "On the way/On the road",
    meaningBn: "রাস্তায়/পথে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "慢",
    pinyin: "",
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
    character: "进",
    pinyin: "",
    meaningEn: "To enter",
    meaningBn: "প্রবেশ করা",
    hskLevel: 2,
    relatedWords: [
      {
        word: "进来",
        pinyin: "jìnlái",
        meaningEn: "Come in",
        meaningBn: "ভেতরে আসা",
        hskLevel: 3,
        examples: [
            { chinese: "请进来坐。", pinyin: "Qǐng jìnlái zuò.", meaningEn: "Come in and sit.", meaningBn: "এসে বসুন।" },
        ],
      },
      {
        word: "进行",
        pinyin: "jìnxíng",
        meaningEn: "Conduct",
        meaningBn: "পরিচালিত হওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "比赛正在进行。", pinyin: "Bǐsài zhèngzài jìnxíng.", meaningEn: "The match is ongoing.", meaningBn: "খেলা চলছে।" },
        ],
      },
      {
        word: "进步",
        pinyin: "jìnbù",
        meaningEn: "Progress",
        meaningBn: "অগ্রগতি",
        hskLevel: 3,
        examples: [
            { chinese: "你的汉语进步很大。", pinyin: "Nǐ de Hànyǔ jìnbù hěn dà.", meaningEn: "Your Chinese improved a lot.", meaningBn: "তোমার চীনা ভাষা উন্নত হয়েছে।" },
        ],
      },
    ],
  },
  {
    character: "身体",
    pinyin: "",
    meaningEn: "Body/Health",
    meaningBn: "শরীর/স্বাস্থ্য",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "时",
    pinyin: "",
    meaningEn: "Time/When",
    meaningBn: "সময়/যখন",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "最",
    pinyin: "",
    meaningEn: "Most/-est",
    meaningBn: "সবচেয়ে/সর্বোচ্চ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "药店",
    pinyin: "",
    meaningEn: "Pharmacy",
    meaningBn: "ওষুধের দোকান",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "事情",
    pinyin: "",
    meaningEn: "Matter/Thing",
    meaningBn: "বিষয়/কাজ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "晴",
    pinyin: "",
    meaningEn: "Sunny/Clear",
    meaningBn: "রৌদ্রোজ্জ্বল",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "正",
    pinyin: "",
    meaningEn: "Just/Right now",
    meaningBn: "ঠিক এই মুহূর্তে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "外面",
    pinyin: "",
    meaningEn: "Outside",
    meaningBn: "বাইরে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "阴",
    pinyin: "",
    meaningEn: "Cloudy/Overcast",
    meaningBn: "মেঘলা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "从小",
    pinyin: "",
    meaningEn: "Since childhood",
    meaningBn: "ছোটবেলা থেকে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "地铁",
    pinyin: "",
    meaningEn: "Subway/Metro",
    meaningBn: "পাতাল রেল/মেট্রো",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "楼",
    pinyin: "",
    meaningEn: "Building/Floor",
    meaningBn: "বহুতল ভবন/তলা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "站",
    pinyin: "",
    meaningEn: "Station/To stand",
    meaningBn: "স্টেশন/দাঁড়ানো",
    hskLevel: 2,
    relatedWords: [
      {
        word: "车站",
        pinyin: "chēzhàn",
        meaningEn: "Station",
        meaningBn: "বাসস্টপ",
        hskLevel: 3,
        examples: [
            { chinese: "车站离这里很近。", pinyin: "Chēzhàn lí zhèlǐ hěn jìn.", meaningEn: "The station is close.", meaningBn: "স্টেশন কাছে।" },
        ],
      },
      {
        word: "火车站",
        pinyin: "huǒchēzhàn",
        meaningEn: "Railway station",
        meaningBn: "রেলস্টেশন",
        hskLevel: 3,
        examples: [
            { chinese: "我去火车站接朋友。", pinyin: "Wǒ qù huǒchēzhàn jiē péngyou.", meaningEn: "I'll pick up a friend at the station.", meaningBn: "স্টেশনে বন্ধুকে নিতে যাচ্ছি।" },
        ],
      },
      {
        word: "站立",
        pinyin: "zhànlì",
        meaningEn: "Stand",
        meaningBn: "দাঁড়িয়ে থাকা",
        hskLevel: 3,
        examples: [
            { chinese: "他站立了很久。", pinyin: "Tā zhànlìle hěn jiǔ.", meaningEn: "He stood for long.", meaningBn: "সে অনেকক্ষণ দাঁড়িয়ে ছিল।" },
        ],
      },
    ],
  },
  {
    character: "小时候",
    pinyin: "",
    meaningEn: "In one's childhood",
    meaningBn: "ছোটবেলায়",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "新年",
    pinyin: "",
    meaningEn: "New Year",
    meaningBn: "নতুন বছর",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "教",
    pinyin: "",
    meaningEn: "To teach",
    meaningBn: "শিক্ষা দেওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "希望",
    pinyin: "",
    meaningEn: "To hope",
    meaningBn: "আশা করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "上面",
    pinyin: "",
    meaningEn: "On/Above",
    meaningBn: "উপরে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "洗手间",
    pinyin: "",
    meaningEn: "Washroom/Restroom",
    meaningBn: "ওয়াশরুম",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "里面",
    pinyin: "",
    meaningEn: "Inside",
    meaningBn: "ভেতরে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "可能",
    pinyin: "",
    meaningEn: "Maybe/Possible",
    meaningBn: "সম্ভবত",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "上网",
    pinyin: "",
    meaningEn: "Go online",
    meaningBn: "ইন্টারনেট ব্যবহার করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "那样",
    pinyin: "",
    meaningEn: "Like that",
    meaningBn: "ওইরকম",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "告诉",
    pinyin: "",
    meaningEn: "To tell",
    meaningBn: "বলা/জানানো",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "班",
    pinyin: "",
    meaningEn: "Class",
    meaningBn: "শ্রেণী",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "包",
    pinyin: "",
    meaningEn: "Bag/Wrap",
    meaningBn: "ব্যাগ/জড়ানো",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "过年",
    pinyin: "",
    meaningEn: "Celebrate the New Year",
    meaningBn: "নতুন বছর উদযাপন করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "没意思",
    pinyin: "",
    meaningEn: "Boring",
    meaningBn: "বিরক্তিকর",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "位",
    pinyin: "",
    meaningEn: "Measure word for people (polite)",
    meaningBn: "জন (সম্মানসূচক পরিমাপক শব্দ)",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "前面",
    pinyin: "",
    meaningEn: "Ahead/Front",
    meaningBn: "সামনে",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "房子",
    pinyin: "",
    meaningEn: "House/Building",
    meaningBn: "বাড়ি/ঘর",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "小孩儿",
    pinyin: "",
    meaningEn: "Child",
    meaningBn: "শিশু",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "女孩儿",
    pinyin: "",
    meaningEn: "Girl",
    meaningBn: "মেয়ে/বালিকা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "姓",
    pinyin: "",
    meaningEn: "Surname",
    meaningBn: "বংশনাম/পদবি",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "眼睛",
    pinyin: "",
    meaningEn: "Eyes",
    meaningBn: "চোখ",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "跳舞",
    pinyin: "",
    meaningEn: "To dance",
    meaningBn: "নাচ করা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "姓名",
    pinyin: "",
    meaningEn: "Full name",
    meaningBn: "পূর্ণ নাম",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "出国",
    pinyin: "",
    meaningEn: "Go abroad",
    meaningBn: "বিদেশে যাওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "门票",
    pinyin: "",
    meaningEn: "Entrance ticket",
    meaningBn: "প্রবেশ টিকিট",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "高中",
    pinyin: "",
    meaningEn: "High school",
    meaningBn: "উচ্চ বিদ্যালয়",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "出门",
    pinyin: "",
    meaningEn: "Go out",
    meaningBn: "বাইরে যাওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "路",
    pinyin: "",
    meaningEn: "Road/Path",
    meaningBn: "রাস্তা",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "颐和园",
    pinyin: "",
    meaningEn: "Summer Palace",
    meaningBn: "সামার প্যালেস",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "机票",
    pinyin: "",
    meaningEn: "Air ticket",
    meaningBn: "বিমানের টিকিট",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "飞",
    pinyin: "",
    meaningEn: "To fly",
    meaningBn: "ওড়া/উড়ে যাওয়া",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "好像",
    pinyin: "",
    meaningEn: "Seem/Like",
    meaningBn: "মনে হওয়া/যেন",
    hskLevel: 2,
    relatedWords: [
    ],
  },
  {
    character: "鸟",
    pinyin: "",
    meaningEn: "Bird",
    meaningBn: "পাখি",
    hskLevel: 2,
    relatedWords: [
    ],
  },
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
      {
        word: "律师",
        pinyin: "lǜshī",
        meaningEn: "Lawyer",
        meaningBn: "আইনজীবী",
        hskLevel: 2,
        examples: [
            { chinese: "他是一名律师。", pinyin: "Tā shì yì míng lǜshī.", meaningEn: "He is a lawyer.", meaningBn: "তিনি একজন আইনজীবী।" },
        ],
      },
    ],
  },
  {
    character: "身",
    pinyin: "shēn",
    meaningEn: "Body",
    meaningBn: "শরীর",
    hskLevel: 2,
    relatedWords: [
      {
        word: "身体",
        pinyin: "shēntǐ",
        meaningEn: "Body/health",
        meaningBn: "শরীরের স্বাস্থ্য",
        hskLevel: 2,
        examples: [
            { chinese: "你的身体好吗？", pinyin: "Nǐ de shēntǐ hǎo ma?", meaningEn: "Is your health good?", meaningBn: "শরীর কি ভালো?" },
        ],
      },
      {
        word: "身份",
        pinyin: "shēnfèn",
        meaningEn: "Identity",
        meaningBn: "পরিচয়",
        hskLevel: 2,
        examples: [
            { chinese: "请出示身份证。", pinyin: "Qǐng chūshì shēnfènzhèng.", meaningEn: "Please show your ID.", meaningBn: "আইডি দেখান।" },
        ],
      },
    ],
  },
  {
    character: "体",
    pinyin: "tǐ",
    meaningEn: "Body, system",
    meaningBn: "দেহ",
    hskLevel: 2,
    relatedWords: [
      {
        word: "体育",
        pinyin: "tǐyù",
        meaningEn: "Sports/PE",
        meaningBn: "শরীরচর্চা",
        hskLevel: 2,
        examples: [
            { chinese: "星期三我们有体育课。", pinyin: "Xīngqīsān wǒmen yǒu tǐyù kè.", meaningEn: "We have PE on Wednesday.", meaningBn: "বুধবার শরীরচর্চার ক্লাস আছে।" },
        ],
      },
      {
        word: "体验",
        pinyin: "tǐyàn",
        meaningEn: "Experience",
        meaningBn: "অভিজ্ঞতা",
        hskLevel: 2,
        examples: [
            { chinese: "这是很好的体验。", pinyin: "Zhè shì hěn hǎo de tǐyàn.", meaningEn: "This is a great experience.", meaningBn: "এটা চমৎকার অভিজ্ঞতা।" },
        ],
      },
    ],
  },
  {
    character: "足",
    pinyin: "zú",
    meaningEn: "Foot, sufficient",
    meaningBn: "পা, যথেষ্ট",
    hskLevel: 2,
    relatedWords: [
      {
        word: "足球",
        pinyin: "zúqiú",
        meaningEn: "Football",
        meaningBn: "ফুটবল",
        hskLevel: 2,
        examples: [
            { chinese: "他喜欢踢足球。", pinyin: "Tā xǐhuan tī zúqiú.", meaningEn: "He likes football.", meaningBn: "সে ফুটবল পছন্দ করে।" },
        ],
      },
      {
        word: "足够",
        pinyin: "zúgòu",
        meaningEn: "Enough",
        meaningBn: "যথেষ্ট",
        hskLevel: 2,
        examples: [
            { chinese: "钱足够了。", pinyin: "Qián zúgòu le.", meaningEn: "The money is enough.", meaningBn: "টাকা যথেষ্ট।" },
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
];
