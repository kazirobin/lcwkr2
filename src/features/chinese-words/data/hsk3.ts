// HSK 3 root-word dataset — LOCAL data, no MongoDB.
// Built from the HSK lesson words (data/lesson-words.ts) in lesson
// order; curated core roots carry their relatedWords + examples.
// A related word appears ONCE across all levels (global dedupe).
// To add a new root: copy an object, keep `character` unique, fill
// relatedWords (with examples).
import type { ChineseWordEntry } from "../types";

export const HSK3_WORDS: ChineseWordEntry[] = [
  {
    character: "以为",
    pinyin: "yǐwéi",
    meaningEn: "Mistakenly think",
    meaningBn: "মনে করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "像",
    pinyin: "xiàng",
    meaningEn: "Be like/Resemble",
    meaningBn: "মতো/সাদৃশ্য",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "身高",
    pinyin: "shēngāo",
    meaningEn: "Height",
    meaningBn: "উচ্চতা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "米",
    pinyin: "mǐ",
    meaningEn: "Meter",
    meaningBn: "মিটার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "瘦",
    pinyin: "shòu",
    meaningEn: "Thin",
    meaningBn: "রোগা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "行李",
    pinyin: "xíngli",
    meaningEn: "Luggage/Baggage",
    meaningBn: "লাগেজ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "丢",
    pinyin: "diū",
    meaningEn: "Lose/Misplace",
    meaningBn: "হারানো",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "箱子",
    pinyin: "xiāngzi",
    meaningEn: "Suitcase/Box/Chest",
    meaningBn: "ট্রলি/বাক্স",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "号码",
    pinyin: "hàomǎ",
    meaningEn: "Number",
    meaningBn: "নম্বর",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "重要",
    pinyin: "zhòngyào",
    meaningEn: "Important",
    meaningBn: "গুরুত্বপূর্ণ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "着急",
    pinyin: "zháojí",
    meaningEn: "Worried/Anxious",
    meaningBn: "চিন্তিত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "护照",
    pinyin: "hùzhào",
    meaningEn: "Passport",
    meaningBn: "পাসপোর্ট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "服务台",
    pinyin: "fúwùtái",
    meaningEn: "Service desk/Counter",
    meaningBn: "হেল্পডেস্ক/সার্ভিস ডেস্ক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "应该",
    pinyin: "yīnggāi",
    meaningEn: "Should/Ought to",
    meaningBn: "উচিত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "中间",
    pinyin: "zhōngjiān",
    meaningEn: "Middle/Center",
    meaningBn: "মাঝখানে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "短",
    pinyin: "duǎn",
    meaningEn: "Short",
    meaningBn: "ছোট",
    hskLevel: 3,
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
    character: "头发",
    pinyin: "tóufa",
    meaningEn: "Hair",
    meaningBn: "চুল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "年轻",
    pinyin: "niánqīng",
    meaningEn: "Young",
    meaningBn: "তরুণ/যুবক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "发现",
    pinyin: "fāxiàn",
    meaningEn: "Discover/Find",
    meaningBn: "আবিষ্কার করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "不见",
    pinyin: "bújiàn",
    meaningEn: "Be lost/Disappear",
    meaningBn: "হারিয়ে যাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "带",
    pinyin: "dài",
    meaningEn: "Take/Bring/Carry",
    meaningBn: "নিয়ে যাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "帮助",
    pinyin: "bāngzhù",
    meaningEn: "Help/Assist",
    meaningBn: "সাহায্য করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "照片",
    pinyin: "zhàopiàn",
    meaningEn: "Photo/Picture",
    meaningBn: "ছবি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "菜单",
    pinyin: "càidān",
    meaningEn: "Menu",
    meaningBn: "মেনু কার্ড",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "又",
    pinyin: "yòu",
    meaningEn: "And/Also",
    meaningBn: "এবং",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "饿",
    pinyin: "è",
    meaningEn: "Hungry",
    meaningBn: "ক্ষুধার্ত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "渴",
    pinyin: "kě",
    meaningEn: "Thirsty",
    meaningBn: "তৃষ্ণার্ত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "客气",
    pinyin: "kèqi",
    meaningEn: "Polite",
    meaningBn: "সৌজন্য দেখাানো",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "饮料",
    pinyin: "yǐnliào",
    meaningEn: "Drink/Beverage",
    meaningBn: "পানীয়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "好久",
    pinyin: "hǎojiǔ",
    meaningEn: "Long time",
    meaningBn: "দীর্ঘ সময়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "服务",
    pinyin: "fúwù",
    meaningEn: "Serve/Service",
    meaningBn: "সেবা দেওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "员",
    pinyin: "yuán",
    meaningEn: "Person",
    meaningBn: "কর্মী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "双",
    pinyin: "shuāng",
    meaningEn: "Pair",
    meaningBn: "জোড়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "筷子",
    pinyin: "kuàizi",
    meaningEn: "Chopsticks",
    meaningBn: "চপস্টিক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "勺子",
    pinyin: "sháozi",
    meaningEn: "Spoon",
    meaningBn: "চামচ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "碗",
    pinyin: "wǎn",
    meaningEn: "Bowl",
    meaningBn: "বাটি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "马上",
    pinyin: "mǎshàng",
    meaningEn: "Immediately/Right away",
    meaningBn: "এখনই",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "热情",
    pinyin: "rèqíng",
    meaningEn: "Warm/Enthusiastic",
    meaningBn: "আন্তরিক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "尝",
    pinyin: "cháng",
    meaningEn: "Taste",
    meaningBn: "স্বাদ নেওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "记",
    pinyin: "jì",
    meaningEn: "Remember",
    meaningBn: "মনে রাখা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "用",
    pinyin: "yòng",
    meaningEn: "Use/Eat",
    meaningBn: "ব্যবহার করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "鸡",
    pinyin: "jī",
    meaningEn: "Chicken",
    meaningBn: "মুরগি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "张",
    pinyin: "zhāng",
    meaningEn: "Measure word for flat objects",
    meaningBn: "টি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "不用",
    pinyin: "búyòng",
    meaningEn: "Need not",
    meaningBn: "প্রয়োজন নেই",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "选",
    pinyin: "xuǎn",
    meaningEn: "Choose/Select",
    meaningBn: "নির্বাচন করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "外卖",
    pinyin: "wàimài",
    meaningEn: "Takeout/Food delivery",
    meaningBn: "ডেলিভারি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "方便",
    pinyin: "fāngbiàn",
    meaningEn: "Convenient",
    meaningBn: "সুবিধাজনক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "方便面",
    pinyin: "fāngbiànmiàn",
    meaningEn: "Instant noodles",
    meaningBn: "ইনস্ট্যান্ট নুডুলস",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "简单",
    pinyin: "jiǎndān",
    meaningEn: "Simple",
    meaningBn: "সহজ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "初中",
    pinyin: "chūzhōng",
    meaningEn: "Junior high school",
    meaningBn: "জুনিয়র হাইস্কুল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "环境",
    pinyin: "huánjìng",
    meaningEn: "Environment",
    meaningBn: "পরিবেশ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "空调",
    pinyin: "kōngtiáo",
    meaningEn: "Air conditioner",
    meaningBn: "এয়ার কন্ডিশনার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "洗衣机",
    pinyin: "xǐyījī",
    meaningEn: "Washing machine",
    meaningBn: "ওয়াশিং মেশিন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "层",
    pinyin: "céng",
    meaningEn: "Floor (of a building)",
    meaningBn: "তলা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "忘记",
    pinyin: "wàngjì",
    meaningEn: "Forget",
    meaningBn: "ভুলে যাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "关",
    pinyin: "guān",
    meaningEn: "Turn off/Close",
    meaningBn: "বন্ধ করা",
    hskLevel: 3,
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
    character: "冰箱",
    pinyin: "bīngxiāng",
    meaningEn: "Refrigerator",
    meaningBn: "ফ্রিজ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "卫生间",
    pinyin: "wèishēngjiān",
    meaningEn: "Bathroom",
    meaningBn: "বাথরুম",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "打扫",
    pinyin: "dǎsǎo",
    meaningEn: "Clean",
    meaningBn: "পরিষ্কার করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "搬家",
    pinyin: "bānjiā",
    meaningEn: "Move (house)",
    meaningBn: "বাসা বদলানো",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "办",
    pinyin: "bàn",
    meaningEn: "Handle/Apply for",
    meaningBn: "করানো/আবেদন করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "信用卡",
    pinyin: "xìnyòngkǎ",
    meaningEn: "Credit card",
    meaningBn: "ক্রেডিট কার্ড",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "银行",
    pinyin: "yínháng",
    meaningEn: "Bank",
    meaningBn: "ব্যাংক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "纸箱",
    pinyin: "zhǐxiāng",
    meaningEn: "Cardboard box",
    meaningBn: "কার্টন/পেপার বক্স",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "最多",
    pinyin: "zuì duō",
    meaningEn: "At most",
    meaningBn: "সর্বোচ্চ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "搬完",
    pinyin: "bān wán",
    meaningEn: "Finish moving",
    meaningBn: "বাসা বদলানো শেষ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "最少",
    pinyin: "zuì shǎo",
    meaningEn: "At least",
    meaningBn: "কমপক্ষে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "搬家公司",
    pinyin: "bānjiā gōngsī",
    meaningEn: "Moving company",
    meaningBn: "মুভিং কোম্পানি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "假期",
    pinyin: "jiàqī",
    meaningEn: "Vacation/Holiday",
    meaningBn: "ছুটি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "海",
    pinyin: "hǎi",
    meaningEn: "Sea",
    meaningBn: "সমুদ্র",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "草原",
    pinyin: "cǎoyuán",
    meaningEn: "Grassland",
    meaningBn: "তৃণভূমি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "主意",
    pinyin: "zhǔyi",
    meaningEn: "Idea",
    meaningBn: "আইডিয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "骑",
    pinyin: "qí",
    meaningEn: "Ride",
    meaningBn: "চড়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "马",
    pinyin: "mǎ",
    meaningEn: "Horse",
    meaningBn: "ঘোড়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "羊",
    pinyin: "yáng",
    meaningEn: "Sheep/Goat",
    meaningBn: "ভেড়া/ছাগল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "月亮",
    pinyin: "yuèliang",
    meaningEn: "Moon",
    meaningBn: "চাঁদ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "一定",
    pinyin: "yídìng",
    meaningEn: "Certainly/Definitely",
    meaningBn: "অবশ্যই",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "刻",
    pinyin: "kè",
    meaningEn: "Quarter (15 minutes)",
    meaningBn: "এক কোয়ার্টার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "起飞",
    pinyin: "qǐfēi",
    meaningEn: "Take off",
    meaningBn: "টেক অফ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "宾馆",
    pinyin: "bīnguǎn",
    meaningEn: "Hotel",
    meaningBn: "হোটেল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "特别",
    pinyin: "tèbié",
    meaningEn: "Special/Especially",
    meaningBn: "বিশেষ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "别的",
    pinyin: "biéde",
    meaningEn: "Other",
    meaningBn: "অন্যান্য",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "一样",
    pinyin: "yíyàng",
    meaningEn: "The same",
    meaningBn: "একই",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "牛",
    pinyin: "niú",
    meaningEn: "Cattle/Cow",
    meaningBn: "গরু",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "相机",
    pinyin: "xiàngjī",
    meaningEn: "Camera",
    meaningBn: "ক্যামেরা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "欢迎",
    pinyin: "huānyíng",
    meaningEn: "Welcome",
    meaningBn: "স্বাগতম জানানো",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "司机",
    pinyin: "sījī",
    meaningEn: "Driver",
    meaningBn: "ড্রাইভার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "晚点",
    pinyin: "wǎndiǎn",
    meaningEn: "Be late (train/flight)",
    meaningBn: "বিলম্ব হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "久",
    pinyin: "jiǔ",
    meaningEn: "Long (time)",
    meaningBn: "দীর্ঘ সময়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "除了",
    pinyin: "chúle",
    meaningEn: "Besides/Except",
    meaningBn: "ছাড়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "以外",
    pinyin: "yǐwài",
    meaningEn: "Other than/Except",
    meaningBn: "ব্যতিরেকে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "先",
    pinyin: "xiān",
    meaningEn: "First",
    meaningBn: "আগে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "一直",
    pinyin: "yìzhí",
    meaningEn: "All along/Continuously",
    meaningBn: "সবসময়/একটানা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "干净",
    pinyin: "gānjìng",
    meaningEn: "Clean",
    meaningBn: "পরিষ্কার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "满意",
    pinyin: "mǎnyì",
    meaningEn: "Be satisfied",
    meaningBn: "সন্তুষ্ট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "总是",
    pinyin: "zǒngshì",
    meaningEn: "Always",
    meaningBn: "সর্বদা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "终于",
    pinyin: "zhōngyú",
    meaningEn: "Finally",
    meaningBn: "অবশেষে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "爬",
    pinyin: "pá",
    meaningEn: "Climb",
    meaningBn: "চড়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "山",
    pinyin: "shān",
    meaningEn: "Mountain",
    meaningBn: "পাহাড়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "锻炼",
    pinyin: "duànliàn",
    meaningEn: "Exercise",
    meaningBn: "ব্যায়াম করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "照",
    pinyin: "zhào",
    meaningEn: "Take (a picture)",
    meaningBn: "ছবি তোলা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "鞋",
    pinyin: "xié",
    meaningEn: "Shoe",
    meaningBn: "জুতো",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "大衣",
    pinyin: "dàyī",
    meaningEn: "Overcoat",
    meaningBn: "ওভারকোট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "拍照",
    pinyin: "pāizhào",
    meaningEn: "Take a picture",
    meaningBn: "ছবি তোলা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "感兴趣",
    pinyin: "gǎn xìngqù",
    meaningEn: "Be interested in",
    meaningBn: "আগ্রহী হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "照相",
    pinyin: "zhàoxiāng",
    meaningEn: "Take a picture",
    meaningBn: "ছবি তোলা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "难看",
    pinyin: "nánkàn",
    meaningEn: "Bad-looking/Ugly",
    meaningBn: "দেখতে খারাপ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "比较",
    pinyin: "bǐjiào",
    meaningEn: "Compare/Relatively",
    meaningBn: "তুলনা করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "水平",
    pinyin: "shuǐpíng",
    meaningEn: "Level/Standard",
    meaningBn: "দক্ষতা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "太阳",
    pinyin: "tàiyáng",
    meaningEn: "Sun",
    meaningBn: "সূর্য",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "树",
    pinyin: "shù",
    meaningEn: "Tree",
    meaningBn: "গাছ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "干",
    pinyin: "gàn",
    meaningEn: "Do",
    meaningBn: "করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "电",
    pinyin: "diàn",
    meaningEn: "Electricity",
    meaningBn: "বিদ্যুৎ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "收到",
    pinyin: "shōudào",
    meaningEn: "Receive",
    meaningBn: "গ্রহণ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "封",
    pinyin: "fēng",
    meaningEn: "Measure word for letters/mail",
    meaningBn: "চিঠি/মেইল গণনার একক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "邮件",
    pinyin: "yóujiàn",
    meaningEn: "Email/Mail",
    meaningBn: "ইমেইল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "难过",
    pinyin: "nánguò",
    meaningEn: "Sad",
    meaningBn: "মন খারাপ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "哈哈",
    pinyin: "hāhā",
    meaningEn: "Haha (laughter)",
    meaningBn: "হাহা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "音乐",
    pinyin: "yīnyuè",
    meaningEn: "Music",
    meaningBn: "সঙ্গীত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "兴趣",
    pinyin: "xìngqù",
    meaningEn: "Interest",
    meaningBn: "আগ্রহ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "结束",
    pinyin: "jiéshù",
    meaningEn: "Finish/End",
    meaningBn: "শেষ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "该",
    pinyin: "gāi",
    meaningEn: "Should/Ought to",
    meaningBn: "উচিত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "打算",
    pinyin: "dǎsuàn",
    meaningEn: "Plan/Intend",
    meaningBn: "পরিকল্পনা করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "高铁",
    pinyin: "gāotiě",
    meaningEn: "High-speed train",
    meaningBn: "বুলেট ট্রেন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "行",
    pinyin: "xíng",
    meaningEn: "Okay/All right",
    meaningBn: "ঠিক আছে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "路口",
    pinyin: "lùkǒu",
    meaningEn: "Intersection",
    meaningBn: "মোড়/চৌরাস্তা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "小心",
    pinyin: "xiǎoxīn",
    meaningEn: "Careful",
    meaningBn: "সাবধানে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "迟到",
    pinyin: "chídào",
    meaningEn: "Be late",
    meaningBn: "দেরি করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "红绿灯",
    pinyin: "hónglǜdēng",
    meaningEn: "Traffic lights",
    meaningBn: "ট্রাফিক লাইট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "后来",
    pinyin: "hòulái",
    meaningEn: "Afterward/Later",
    meaningBn: "পরবর্তীতে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "急",
    pinyin: "jí",
    meaningEn: "Urgent/Anxious",
    meaningBn: "তাড়াহুড়ো করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "如果",
    pinyin: "rúguǒ",
    meaningEn: "If",
    meaningBn: "যদি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "以前",
    pinyin: "yǐqián",
    meaningEn: "Ago/Before",
    meaningBn: "আগে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "耳机",
    pinyin: "ěrjī",
    meaningEn: "Earphones/Headphones",
    meaningBn: "হেডফোন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "充电宝",
    pinyin: "chōngdiànbǎo",
    meaningEn: "Power bank",
    meaningBn: "পাওয়ার ব্যাংক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "常用",
    pinyin: "chángyòng",
    meaningEn: "Commonly used",
    meaningBn: "সচরাচর ব্যবহৃত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "越",
    pinyin: "yuè",
    meaningEn: "The more... the more...",
    meaningBn: "যত... তত...",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "分开",
    pinyin: "fēnkāi",
    meaningEn: "Separate",
    meaningBn: "আলাদা হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "检查",
    pinyin: "jiǎnchá",
    meaningEn: "Check/Inspect",
    meaningBn: "পরীক্ষা করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "刷",
    pinyin: "shuā",
    meaningEn: "Scan/Swipe",
    meaningBn: "স্ক্যান করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "检票",
    pinyin: "jiǎnpiào",
    meaningEn: "Check tickets",
    meaningBn: "টিকিট চেক করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "电梯",
    pinyin: "diàntī",
    meaningEn: "Elevator",
    meaningBn: "লিফট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "放假",
    pinyin: "fàngjià",
    meaningEn: "Have a vacation",
    meaningBn: "ছুটি পাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "沙发",
    pinyin: "shāfā",
    meaningEn: "Sofa",
    meaningBn: "সোফা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "安静",
    pinyin: "ānjìng",
    meaningEn: "Quiet",
    meaningBn: "শান্ত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "选择",
    pinyin: "xuǎnzé",
    meaningEn: "Choose",
    meaningBn: "পছন্দ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "必须",
    pinyin: "bìxū",
    meaningEn: "Must/Have to",
    meaningBn: "অবশ্যই",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "辆",
    pinyin: "liàng",
    meaningEn: "Measure word for vehicles",
    meaningBn: "যানবাহন গণনার একক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "自行车",
    pinyin: "zìxíngchē",
    meaningEn: "Bicycle",
    meaningBn: "সাইকেল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "旧",
    pinyin: "jiù",
    meaningEn: "Old",
    meaningBn: "পুরোনো",
    hskLevel: 3,
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
    character: "矮",
    pinyin: "ǎi",
    meaningEn: "Short (height)",
    meaningBn: "নিচু/খাটো",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "黄色",
    pinyin: "huángsè",
    meaningEn: "Yellow",
    meaningBn: "হলুদ রঙ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "短裤",
    pinyin: "duǎnkù",
    meaningEn: "Shorts",
    meaningBn: "হাফপ্যান্ট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "大小",
    pinyin: "dàxiǎo",
    meaningEn: "Size",
    meaningBn: "সাইজ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "合适",
    pinyin: "héshì",
    meaningEn: "Suitable",
    meaningBn: "উপযুক্ত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "裙子",
    pinyin: "qúnzi",
    meaningEn: "Skirt",
    meaningBn: "স্কার্ট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "决定",
    pinyin: "juédìng",
    meaningEn: "Decide",
    meaningBn: "সিদ্ধান্ত নেওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "西瓜",
    pinyin: "xīguā",
    meaningEn: "Watermelon",
    meaningBn: "তরমুজ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "新鲜",
    pinyin: "xīnxiān",
    meaningEn: "Fresh",
    meaningBn: "তাজা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "甜",
    pinyin: "tián",
    meaningEn: "Sweet",
    meaningBn: "মিষ্টি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "公斤",
    pinyin: "gōngjīn",
    meaningEn: "Kilogram",
    meaningBn: "কেজি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "冰",
    pinyin: "bīng",
    meaningEn: "Ice/Iced",
    meaningBn: "ঠান্ডা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "极",
    pinyin: "jí",
    meaningEn: "Extremely",
    meaningBn: "অত্যন্ত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "香蕉",
    pinyin: "xiāngjiāo",
    meaningEn: "Banana",
    meaningBn: "কলা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "一共",
    pinyin: "yígòng",
    meaningEn: "Altogether",
    meaningBn: "সর্বমোট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "毛",
    pinyin: "máo",
    meaningEn: "Mao (1/10 yuan)",
    meaningBn: "মাও (ইউয়ানের ১/১০ অংশ)",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "结婚",
    pinyin: "jiéhūn",
    meaningEn: "Marry/Get married",
    meaningBn: "বিয়ে করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "不但",
    pinyin: "búdàn",
    meaningEn: "Not only",
    meaningBn: "শুধু তা-ই নয়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "而且",
    pinyin: "érqiě",
    meaningEn: "But also",
    meaningBn: "উপরন্তু",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "声",
    pinyin: "shēng",
    meaningEn: "Sound (measure word)",
    meaningBn: "শব্দ",
    hskLevel: 3,
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
    character: "开机",
    pinyin: "kāijī",
    meaningEn: "Power on/Start up",
    meaningBn: "চালু করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "最近",
    pinyin: "zuìjìn",
    meaningEn: "Lately/Recently",
    meaningBn: "সম্প্রতি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "常",
    pinyin: "cháng",
    meaningEn: "Often",
    meaningBn: "প্রায়ই",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "体育馆",
    pinyin: "tǐyùguǎn",
    meaningEn: "Gymnasium",
    meaningBn: "ব্যায়ামাগার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "习惯",
    pinyin: "xíguàn",
    meaningEn: "Habit",
    meaningBn: "অভ্যাস",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "胖",
    pinyin: "pàng",
    meaningEn: "Fat",
    meaningBn: "মোটা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "健康",
    pinyin: "jiànkāng",
    meaningEn: "Healthy",
    meaningBn: "স্বাস্থ্যকর",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "以后",
    pinyin: "yǐhòu",
    meaningEn: "After/Afterward",
    meaningBn: "পরে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "羽毛球",
    pinyin: "yǔmáoqiú",
    meaningEn: "Badminton",
    meaningBn: "ব্যাডমিন্টন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "耳朵",
    pinyin: "ěrduo",
    meaningEn: "Ear",
    meaningBn: "কান",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "感冒",
    pinyin: "gǎnmào",
    meaningEn: "Catch a cold",
    meaningBn: "ঠান্ডা লাগা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "发烧",
    pinyin: "fāshāo",
    meaningEn: "Have a fever",
    meaningBn: "জ্বর হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "低",
    pinyin: "dī",
    meaningEn: "Low",
    meaningBn: "কম",
    hskLevel: 3,
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
    character: "关心",
    pinyin: "guānxīn",
    meaningEn: "Be concerned",
    meaningBn: "যত্ন নেওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "注意",
    pinyin: "zhùyì",
    meaningEn: "Pay attention",
    meaningBn: "সতর্ক থাকা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "突然",
    pinyin: "tūrán",
    meaningEn: "Sudden/Suddenly",
    meaningBn: "হঠাৎ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "住院",
    pinyin: "zhùyuàn",
    meaningEn: "Be hospitalized",
    meaningBn: "হাসপাতালে ভর্তি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "担心",
    pinyin: "dānxīn",
    meaningEn: "Worry",
    meaningBn: "চিন্তা করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "腿",
    pinyin: "tuǐ",
    meaningEn: "Leg",
    meaningBn: "পা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "差不多",
    pinyin: "chàbuduō",
    meaningEn: "Almost",
    meaningBn: "প্রায়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "开心",
    pinyin: "kāixīn",
    meaningEn: "Happy",
    meaningBn: "খুশি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "出院",
    pinyin: "chūyuàn",
    meaningEn: "Leave hospital",
    meaningBn: "হাসপাতাল ত্যাগ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "种",
    pinyin: "zhǒng",
    meaningEn: "Kind/Type",
    meaningBn: "প্রকার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "方法",
    pinyin: "fāngfǎ",
    meaningEn: "Method",
    meaningBn: "পদ্ধতি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "其他",
    pinyin: "qítā",
    meaningEn: "Other",
    meaningBn: "অন্যান্য",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "心里",
    pinyin: "xīnlǐ",
    meaningEn: "Mind/Heart",
    meaningBn: "মন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "校园",
    pinyin: "xiàoyuán",
    meaningEn: "Campus",
    meaningBn: "ক্যাম্পাস",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "卡",
    pinyin: "kǎ",
    meaningEn: "Card",
    meaningBn: "কার্ড",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "球场",
    pinyin: "qiúchǎng",
    meaningEn: "Court/Field",
    meaningBn: "খেলার মাঠ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "为了",
    pinyin: "wèile",
    meaningEn: "For/In order to",
    meaningBn: "জন্য",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "运动会",
    pinyin: "yùndònghuì",
    meaningEn: "Sports meet",
    meaningBn: "বার্ষিক ক্রীড়া প্রতিযোগিতা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "男生",
    pinyin: "nánshēng",
    meaningEn: "Male student",
    meaningBn: "ছেলে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "练",
    pinyin: "liàn",
    meaningEn: "Practice",
    meaningBn: "অনুশীলন করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "参加",
    pinyin: "cānjiā",
    meaningEn: "Join/Participate",
    meaningBn: "অংশগ্রহণ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "网球",
    pinyin: "wǎngqiú",
    meaningEn: "Tennis",
    meaningBn: "টেনিস",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "比赛",
    pinyin: "bǐsài",
    meaningEn: "Match/Competition",
    meaningBn: "প্রতিযোগিতা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "练习",
    pinyin: "liànxí",
    meaningEn: "Practice",
    meaningBn: "অনুশীলন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "好多",
    pinyin: "hǎoduō",
    meaningEn: "A lot of/Many",
    meaningBn: "অনেক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "几乎",
    pinyin: "jīhū",
    meaningEn: "Almost/Nearly",
    meaningBn: "প্রায়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "只是",
    pinyin: "zhǐshì",
    meaningEn: "Just/Only",
    meaningBn: "শুধুমাত্র",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "啤酒",
    pinyin: "píjiǔ",
    meaningEn: "Beer",
    meaningBn: "বিয়ার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "紧张",
    pinyin: "jǐnzhāng",
    meaningEn: "Nervous/Anxious",
    meaningBn: "নার্ভাস",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "主要",
    pinyin: "zhǔyào",
    meaningEn: "Main/Major",
    meaningBn: "প্রধান",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "受到",
    pinyin: "shòudào",
    meaningEn: "Receive/Be subjected to",
    meaningBn: "প্রভাবিত হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "影响",
    pinyin: "yǐngxiǎng",
    meaningEn: "Effect/Affect",
    meaningBn: "প্রভাব",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "得分",
    pinyin: "défēn",
    meaningEn: "Score",
    meaningBn: "স্কোর পাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "体育",
    pinyin: "tǐyù",
    meaningEn: "Sports",
    meaningBn: "খেলাধুলা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "世界",
    pinyin: "shìjiè",
    meaningEn: "World",
    meaningBn: "বিশ্ব",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "运动员",
    pinyin: "yùndòngyuán",
    meaningEn: "Athlete",
    meaningBn: "অ্যাথলেট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "得到",
    pinyin: "dédào",
    meaningEn: "Get/Obtain",
    meaningBn: "পাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "成绩",
    pinyin: "chéngjì",
    meaningEn: "Result/Achievement",
    meaningBn: "ফলাফল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "数学",
    pinyin: "shùxué",
    meaningEn: "Mathematics",
    meaningBn: "গণিত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "认真",
    pinyin: "rènzhēn",
    meaningEn: "Conscientious/Serious",
    meaningBn: "মনোযোগী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "笔记",
    pinyin: "bǐjì",
    meaningEn: "Notes",
    meaningBn: "নোট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "清楚",
    pinyin: "qīngchu",
    meaningEn: "Clear",
    meaningBn: "স্পষ্ট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "黑板",
    pinyin: "hēibǎn",
    meaningEn: "Blackboard",
    meaningBn: "ব্ল্যাকবোর্ড",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "把",
    pinyin: "bǎ",
    meaningEn: "Object marker (grammar)",
    meaningBn: "কর্মপদ চিহ্নিতকারী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "作业",
    pinyin: "zuòyè",
    meaningEn: "Homework",
    meaningBn: "হোমওয়ার্ক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "遍",
    pinyin: "biàn",
    meaningEn: "Measure word for actions",
    meaningBn: "বার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "提高",
    pinyin: "tígāo",
    meaningEn: "Improve",
    meaningBn: "উন্নত করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "历史",
    pinyin: "lìshǐ",
    meaningEn: "History",
    meaningBn: "ইতিহাস",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "难",
    pinyin: "nán",
    meaningEn: "Difficult",
    meaningBn: "কঠিন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "要求",
    pinyin: "yāoqiú",
    meaningEn: "Requirement",
    meaningBn: "নির্দেশনা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "差",
    pinyin: "chà",
    meaningEn: "Poor",
    meaningBn: "খারাপ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "复习",
    pinyin: "fùxí",
    meaningEn: "Review",
    meaningBn: "পুনরাবৃত্তি করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "外语",
    pinyin: "wàiyǔ",
    meaningEn: "Foreign language",
    meaningBn: "বিদেশি ভাষা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "当然",
    pinyin: "dāngrán",
    meaningEn: "Of course",
    meaningBn: "অবশ্যই",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "遇到",
    pinyin: "yùdào",
    meaningEn: "Encounter",
    meaningBn: "সম্মুখীন হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "办公室",
    pinyin: "bàngōngshì",
    meaningEn: "Office",
    meaningBn: "অফিস",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "页",
    pinyin: "yè",
    meaningEn: "Page",
    meaningBn: "পৃষ্ঠা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "对话",
    pinyin: "duìhuà",
    meaningEn: "Dialogue",
    meaningBn: "সংলাপ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "明白",
    pinyin: "míngbai",
    meaningEn: "Understand",
    meaningBn: "বোঝা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "讲",
    pinyin: "jiǎng",
    meaningEn: "Explain/Speak",
    meaningBn: "ব্যাখ্যা করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "句",
    pinyin: "jù",
    meaningEn: "Measure word for sentences",
    meaningBn: "বাক্যের একক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "句子",
    pinyin: "jùzi",
    meaningEn: "Sentence",
    meaningBn: "বাক্য",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "年级",
    pinyin: "niánjí",
    meaningEn: "Grade/Class year",
    meaningBn: "শ্রেণি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "后年",
    pinyin: "hòunián",
    meaningEn: "The year after next",
    meaningBn: "আগামী পরশু বছর",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "一般",
    pinyin: "yìbān",
    meaningEn: "General/Usually",
    meaningBn: "সাধারণত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "努力",
    pinyin: "nǔlì",
    meaningEn: "Hard-working",
    meaningBn: "পরিশ্রমী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "会议",
    pinyin: "huìyì",
    meaningEn: "Meeting",
    meaningBn: "সভা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "经理",
    pinyin: "jīnglǐ",
    meaningEn: "Manager",
    meaningBn: "ম্যানেজার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "开会",
    pinyin: "kāihuì",
    meaningEn: "Have a meeting",
    meaningBn: "মিটিং করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "后天",
    pinyin: "hòutiān",
    meaningEn: "Day after tomorrow",
    meaningBn: "আগামী পরশু",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "地点",
    pinyin: "dìdiǎn",
    meaningEn: "Place/Venue",
    meaningBn: "স্থান",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "室",
    pinyin: "shì",
    meaningEn: "Room",
    meaningBn: "কক্ষ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "发",
    pinyin: "fā",
    meaningEn: "Send",
    meaningBn: "পাঠানো",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "笔记本电脑",
    pinyin: "bǐjìběn diànnǎo",
    meaningEn: "Laptop",
    meaningBn: "ল্যাপটপ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "或者",
    pinyin: "huòzhě",
    meaningEn: "Or",
    meaningBn: "অথবা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "声音",
    pinyin: "shēngyīn",
    meaningEn: "Sound/Voice",
    meaningBn: "শব্দ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "看来",
    pinyin: "kànlái",
    meaningEn: "It seems",
    meaningBn: "মনে হচ্ছে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "办法",
    pinyin: "bànfǎ",
    meaningEn: "Way/Method",
    meaningBn: "উপায়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "解决",
    pinyin: "jiějué",
    meaningEn: "Solve",
    meaningBn: "সমাধান করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "只能",
    pinyin: "zhǐ néng",
    meaningEn: "Can only",
    meaningBn: "শুধুমাত্র পারবো",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "别人",
    pinyin: "biérén",
    meaningEn: "Someone else",
    meaningBn: "অন্য কেউ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "请假",
    pinyin: "qǐngjià",
    meaningEn: "Ask for leave",
    meaningBn: "ছুটির আবেদন করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "同事",
    pinyin: "tóngshì",
    meaningEn: "Colleague",
    meaningBn: "সহকর্মী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "休假",
    pinyin: "xiūjià",
    meaningEn: "Take a vacation",
    meaningBn: "ছুটি কাটানো",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "怕",
    pinyin: "pà",
    meaningEn: "Be afraid",
    meaningBn: "ভয় পাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "邮箱",
    pinyin: "yóuxiāng",
    meaningEn: "Mailbox",
    meaningBn: "ইমেইল বক্স",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "愿意",
    pinyin: "yuànyì",
    meaningEn: "Be willing",
    meaningBn: "ইচ্ছুক হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "城市",
    pinyin: "chéngshì",
    meaningEn: "City",
    meaningBn: "শহর",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "离开",
    pinyin: "líkāi",
    meaningEn: "Leave",
    meaningBn: "প্রস্থান করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "机会",
    pinyin: "jīhuì",
    meaningEn: "Opportunity",
    meaningBn: "সুযোগ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "生活",
    pinyin: "shēnghuó",
    meaningEn: "Life",
    meaningBn: "জীবন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "为",
    pinyin: "wèi",
    meaningEn: "For",
    meaningBn: "জন্য",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "或",
    pinyin: "huò",
    meaningEn: "Or",
    meaningBn: "অথবা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "街",
    pinyin: "jiē",
    meaningEn: "Street",
    meaningBn: "রাস্তা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "开花",
    pinyin: "kāihuā",
    meaningEn: "Bloom",
    meaningBn: "ফুল ফোটা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "公园",
    pinyin: "gōngyuán",
    meaningEn: "Park",
    meaningBn: "পার্ক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "船",
    pinyin: "chuán",
    meaningEn: "Boat",
    meaningBn: "নৌকা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "工作日",
    pinyin: "gōngzuòrì",
    meaningEn: "Workday",
    meaningBn: "কর্মদিবস",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "地方",
    pinyin: "dìfang",
    meaningEn: "Place",
    meaningBn: "জায়গা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "刚才",
    pinyin: "gāngcái",
    meaningEn: "Just now",
    meaningBn: "এইমাত্র",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "刮",
    pinyin: "guā",
    meaningEn: "Blow (wind)",
    meaningBn: "বয়ে যাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "风",
    pinyin: "fēng",
    meaningEn: "Wind",
    meaningBn: "বাতাস",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "新闻",
    pinyin: "xīnwén",
    meaningEn: "News",
    meaningBn: "খবর",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "伞",
    pinyin: "sǎn",
    meaningEn: "Umbrella",
    meaningBn: "ছাতা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "借",
    pinyin: "jiè",
    meaningEn: "Lend/Borrow",
    meaningBn: "ধার দেওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "雨衣",
    pinyin: "yǔyī",
    meaningEn: "Raincoat",
    meaningBn: "রেইনকোট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "变",
    pinyin: "biàn",
    meaningEn: "Change",
    meaningBn: "পরিবর্তিত হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "季节",
    pinyin: "jìjié",
    meaningEn: "Season",
    meaningBn: "ঋতু",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "变化",
    pinyin: "biànhuà",
    meaningEn: "Change",
    meaningBn: "পরিবর্তন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "冬天",
    pinyin: "dōngtiān",
    meaningEn: "Winter",
    meaningBn: "শীতকাল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "常常",
    pinyin: "chángcháng",
    meaningEn: "Often",
    meaningBn: "প্রায়ই",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "关注",
    pinyin: "guānzhù",
    meaningEn: "Pay attention",
    meaningBn: "নজর রাখা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "四季",
    pinyin: "sìjì",
    meaningEn: "Four seasons",
    meaningBn: "চার ঋতু",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "春天",
    pinyin: "chūntiān",
    meaningEn: "Spring",
    meaningBn: "বসন্তকাল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "夏天",
    pinyin: "xiàtiān",
    meaningEn: "Summer",
    meaningBn: "গ্রীষ্মকাল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "凉快",
    pinyin: "liángkuai",
    meaningEn: "Comfortably cool",
    meaningBn: "আরামদায়ক শীতল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "秋天",
    pinyin: "qiūtiān",
    meaningEn: "Autumn",
    meaningBn: "শরৎকাল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "叶子",
    pinyin: "yèzi",
    meaningEn: "Leaf",
    meaningBn: "গাছের পাতা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "变成",
    pinyin: "biànchéng",
    meaningEn: "Become/Turn into",
    meaningBn: "রূপান্তরিত হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "请客",
    pinyin: "qǐngkè",
    meaningEn: "Treat/Invite guests",
    meaningBn: "নিমন্ত্রণ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "南方",
    pinyin: "nánfāng",
    meaningEn: "South",
    meaningBn: "দক্ষিণ অঞ্চল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "北方",
    pinyin: "běifāng",
    meaningEn: "North",
    meaningBn: "উত্তর অঞ্চল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "做法",
    pinyin: "zuòfǎ",
    meaningEn: "Way of doing",
    meaningBn: "রান্নার প্রণালী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "不同",
    pinyin: "bù tóng",
    meaningEn: "Different",
    meaningBn: "ভিন্ন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "加",
    pinyin: "jiā",
    meaningEn: "Add",
    meaningBn: "যোগ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "的话",
    pinyin: "dehuà",
    meaningEn: "Conditional particle",
    meaningBn: "হলে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "做客",
    pinyin: "zuòkè",
    meaningEn: "Be a guest",
    meaningBn: "অতিথি হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "邻居",
    pinyin: "línjū",
    meaningEn: "Neighbor",
    meaningBn: "প্রতিবেশী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "放心",
    pinyin: "fàngxīn",
    meaningEn: "Feel at ease",
    meaningBn: "নিশ্চিন্ত হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "酒",
    pinyin: "jiǔ",
    meaningEn: "Alcohol/Wine",
    meaningBn: "মদ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "放",
    pinyin: "fàng",
    meaningEn: "Put",
    meaningBn: "রাখা",
    hskLevel: 3,
    relatedWords: [
      {
        word: "放心",
        pinyin: "fàngxīn",
        meaningEn: "Don't worry",
        meaningBn: "নিশ্চিন্ত",
        hskLevel: 3,
        examples: [
            { chinese: "请放心，没问题。", pinyin: "Qǐng fàngxīn, méi wèntí.", meaningEn: "Relax, no problem.", meaningBn: "চিন্তা নেই।" },
        ],
      },
      {
        word: "放假",
        pinyin: "fàngjià",
        meaningEn: "Have a holiday",
        meaningBn: "ছুটি",
        hskLevel: 3,
        examples: [
            { chinese: "下个月放假。", pinyin: "Xiàge yuè fàngjià.", meaningEn: "Holiday next month.", meaningBn: "পরের মাসে ছুটি।" },
        ],
      },
      {
        word: "放弃",
        pinyin: "fàngqì",
        meaningEn: "Give up",
        meaningBn: "ছেড়ে দেওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "不要放弃梦想。", pinyin: "Búyào fàngqì mèngxiǎng.", meaningEn: "Don't give up your dream.", meaningBn: "স্বপ্ন ছেড়ো না।" },
        ],
      },
    ],
  },
  {
    character: "客人",
    pinyin: "kèrén",
    meaningEn: "Guest",
    meaningBn: "অতিথি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "晚会",
    pinyin: "wǎnhuì",
    meaningEn: "Evening party",
    meaningBn: "সন্ধ্যার অনুষ্ঠান",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "画家",
    pinyin: "huàjiā",
    meaningEn: "Painter",
    meaningBn: "চিত্রশিল্পী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "盘子",
    pinyin: "pánzi",
    meaningEn: "Plate",
    meaningBn: "থালা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "一边",
    pinyin: "yìbiān",
    meaningEn: "At the same time",
    meaningBn: "একসাথে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "聊天儿",
    pinyin: "liáotiānr",
    meaningEn: "Chat",
    meaningBn: "আড্ডা দেওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "来自",
    pinyin: "láizì",
    meaningEn: "Come from",
    meaningBn: "থেকে আসা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "夫妻",
    pinyin: "fūqī",
    meaningEn: "Husband and wife",
    meaningBn: "দম্পতি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "直到",
    pinyin: "zhídào",
    meaningEn: "Until",
    meaningBn: "পর্যন্ত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "地图",
    pinyin: "dìtú",
    meaningEn: "Map",
    meaningBn: "মানচিত্র",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "感到",
    pinyin: "gǎndào",
    meaningEn: "Feel",
    meaningBn: "অনুভব করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "东方",
    pinyin: "dōngfāng",
    meaningEn: "East",
    meaningBn: "প্রাচ্য",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "文化",
    pinyin: "wénhuà",
    meaningEn: "Culture",
    meaningBn: "সংস্কৃতি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "词典",
    pinyin: "cídiǎn",
    meaningEn: "Dictionary",
    meaningBn: "অভিধান",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "最好",
    pinyin: "zuìhǎo",
    meaningEn: "Had better",
    meaningBn: "সবচেয়ে ভালো হয়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "节",
    pinyin: "jié",
    meaningEn: "Measure word for classes",
    meaningBn: "ক্লাসের পিরিয়ড",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "图书馆",
    pinyin: "túshūguǎn",
    meaningEn: "Library",
    meaningBn: "লাইব্রেরি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "被",
    pinyin: "bèi",
    meaningEn: "Passive marker",
    meaningBn: "দ্বারা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "名人",
    pinyin: "míngrén",
    meaningEn: "Celebrity",
    meaningBn: "প্রখ্যাত ব্যক্তিত্ব",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "故事",
    pinyin: "gùshi",
    meaningEn: "Story",
    meaningBn: "গল্প",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "然后",
    pinyin: "ránhòu",
    meaningEn: "Then",
    meaningBn: "তারপর",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "报纸",
    pinyin: "bàozhǐ",
    meaningEn: "Newspaper",
    meaningBn: "খবরের কাগজ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "电子书",
    pinyin: "diànzǐshū",
    meaningEn: "E-book",
    meaningBn: "ই-বুক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "女生",
    pinyin: "nǚshēng",
    meaningEn: "Girl student",
    meaningBn: "ছাত্রী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "表演",
    pinyin: "biǎoyǎn",
    meaningEn: "Perform",
    meaningBn: "পারফর্ম করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "节目",
    pinyin: "jiémù",
    meaningEn: "Program",
    meaningBn: "অনুষ্ঠান",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "怎么办",
    pinyin: "zěnme bàn",
    meaningEn: "What to do",
    meaningBn: "কী করব",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "校长",
    pinyin: "xiàozhǎng",
    meaningEn: "Principal",
    meaningBn: "অধ্যক্ষ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "面前",
    pinyin: "miànqián",
    meaningEn: "Presence",
    meaningBn: "সামনে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "相信",
    pinyin: "xiāngxìn",
    meaningEn: "Believe",
    meaningBn: "বিশ্বাস করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "班级",
    pinyin: "bānjí",
    meaningEn: "Class",
    meaningBn: "শ্রেণী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "跳",
    pinyin: "tiào",
    meaningEn: "Dance",
    meaningBn: "নাচা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "留学生",
    pinyin: "liúxuéshēng",
    meaningEn: "International student",
    meaningBn: "বিদেশী ছাত্র",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "最后",
    pinyin: "zuìhòu",
    meaningEn: "In the end",
    meaningBn: "অবশেষে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "一块儿",
    pinyin: "yíkuàir",
    meaningEn: "Together",
    meaningBn: "একসাথে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "网站",
    pinyin: "wǎngzhàn",
    meaningEn: "Website",
    meaningBn: "ওয়েবসাইট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "视频",
    pinyin: "shìpín",
    meaningEn: "Video",
    meaningBn: "ভিডিও",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "蓝",
    pinyin: "lán",
    meaningEn: "Blue",
    meaningBn: "নীল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "段",
    pinyin: "duàn",
    meaningEn: "Period/Section",
    meaningBn: "সময়/অংশ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "附近",
    pinyin: "fùjìn",
    meaningEn: "Nearby",
    meaningBn: "কাছাকাছি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "马路",
    pinyin: "mǎlù",
    meaningEn: "Road",
    meaningBn: "রাস্তা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "平时",
    pinyin: "píngshí",
    meaningEn: "Usually",
    meaningBn: "সাধারণত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "放学",
    pinyin: "fàngxué",
    meaningEn: "School lets out",
    meaningBn: "স্কুল ছুটি হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "游戏",
    pinyin: "yóuxì",
    meaningEn: "Game",
    meaningBn: "খেলাধুলা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "老人",
    pinyin: "lǎorén",
    meaningEn: "Elderly",
    meaningBn: "বয়স্ক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "根据",
    pinyin: "gēnjù",
    meaningEn: "According to",
    meaningBn: "অনুযায়ী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "了解",
    pinyin: "liǎojiě",
    meaningEn: "Understand",
    meaningBn: "ধারণা থাকা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "可是",
    pinyin: "kěshì",
    meaningEn: "But",
    meaningBn: "কিন্তু",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "以上",
    pinyin: "yǐshàng",
    meaningEn: "More than",
    meaningBn: "বেশি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "有名",
    pinyin: "yǒumíng",
    meaningEn: "Famous",
    meaningBn: "বিখ্যাত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "景点",
    pinyin: "jǐngdiǎn",
    meaningEn: "Scenic spot",
    meaningBn: "দর্শনীয় স্থান",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "游客",
    pinyin: "yóukè",
    meaningEn: "Tourist",
    meaningBn: "পর্যটক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "外地",
    pinyin: "wàidì",
    meaningEn: "Other place",
    meaningBn: "বাইরের এলাকা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "聊",
    pinyin: "liáo",
    meaningEn: "Chat",
    meaningBn: "গল্প করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "河",
    pinyin: "hé",
    meaningEn: "River",
    meaningBn: "নদী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "关系",
    pinyin: "guānxi",
    meaningEn: "Relationship",
    meaningBn: "সম্পর্ক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "养",
    pinyin: "yǎng",
    meaningEn: "Nurture",
    meaningBn: "লালন-পালন করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "西北",
    pinyin: "xīběi",
    meaningEn: "Northwest",
    meaningBn: "উত্তর-পশ্চিম",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "经过",
    pinyin: "jīngguò",
    meaningEn: "Pass by",
    meaningBn: "বয়ে যাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "草地",
    pinyin: "cǎodì",
    meaningEn: "Meadow",
    meaningBn: "ঘাসের মাঠ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "遇见",
    pinyin: "yùjiàn",
    meaningEn: "Meet",
    meaningBn: "দেখা হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "脏",
    pinyin: "zāng",
    meaningEn: "Dirty",
    meaningBn: "নোংরা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "可爱",
    pinyin: "kě'ài",
    meaningEn: "Cute",
    meaningBn: "কিউট",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "脚",
    pinyin: "jiǎo",
    meaningEn: "Foot",
    meaningBn: "পা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "照顾",
    pinyin: "zhàogù",
    meaningEn: "Take care of",
    meaningBn: "যত্ন নেওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "认得",
    pinyin: "rènde",
    meaningEn: "Recognize",
    meaningBn: "চিনতে পারা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "周末",
    pinyin: "zhōumò",
    meaningEn: "Weekend",
    meaningBn: "সপ্তাহান্ত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "动物园",
    pinyin: "dòngwùyuán",
    meaningEn: "Zoo",
    meaningBn: "চিড়িয়াখানা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "动物",
    pinyin: "dòngwù",
    meaningEn: "Animal",
    meaningBn: "প্রাণী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "大熊猫",
    pinyin: "dàxióngmāo",
    meaningEn: "Giant panda",
    meaningBn: "জায়ান্ট প্যান্ডা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "奇怪",
    pinyin: "qíguài",
    meaningEn: "Strange",
    meaningBn: "অদ্ভুত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "其实",
    pinyin: "qíshí",
    meaningEn: "Actually",
    meaningBn: "আসলে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "竹子",
    pinyin: "zhúzi",
    meaningEn: "Bamboo",
    meaningBn: "বাঁশ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "国宝",
    pinyin: "guóbǎo",
    meaningEn: "National treasure",
    meaningBn: "জাতীয় সম্পদ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "全",
    pinyin: "quán",
    meaningEn: "Whole",
    meaningBn: "সম্পূর্ণ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "野生",
    pinyin: "yěshēng",
    meaningEn: "Wild",
    meaningBn: "বুনো",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "关于",
    pinyin: "guānyú",
    meaningEn: "About",
    meaningBn: "সম্পর্কে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "饱",
    pinyin: "bǎo",
    meaningEn: "Full (from eating)",
    meaningBn: "পেট ভরা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "嘴",
    pinyin: "zuǐ",
    meaningEn: "Mouth",
    meaningBn: "মুখ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "身边",
    pinyin: "shēnbiān",
    meaningEn: "One's side",
    meaningBn: "পাশে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "半天",
    pinyin: "bàntiān",
    meaningEn: "Quite a while",
    meaningBn: "দীর্ঘক্ষণ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "脸",
    pinyin: "liǎn",
    meaningEn: "Face",
    meaningBn: "মুখমণ্ডল",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "大人",
    pinyin: "dàren",
    meaningEn: "Adult",
    meaningBn: "বড়রা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "喜爱",
    pinyin: "xǐ'ài",
    meaningEn: "Love/Be fond of",
    meaningBn: "ভালোবাসা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "向",
    pinyin: "xiàng",
    meaningEn: "To/Toward",
    meaningBn: "দিকে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "楼梯",
    pinyin: "lóutī",
    meaningEn: "Stairs",
    meaningBn: "সিঁড়ি",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "害怕",
    pinyin: "hàipà",
    meaningEn: "Be afraid",
    meaningBn: "ভয় পাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "生气",
    pinyin: "shēngqì",
    meaningEn: "Get angry",
    meaningBn: "রাগ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "常见",
    pinyin: "chángjiàn",
    meaningEn: "Common",
    meaningBn: "সাধারণ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "聪明",
    pinyin: "cōngmíng",
    meaningEn: "Smart",
    meaningBn: "বুদ্ধিমান",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "认为",
    pinyin: "rènwéi",
    meaningEn: "Think",
    meaningBn: "মনে করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "到处",
    pinyin: "dàochù",
    meaningEn: "Everywhere",
    meaningBn: "সর্বত্র",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "继续",
    pinyin: "jìxù",
    meaningEn: "Continue",
    meaningBn: "চালিয়ে যাওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "同意",
    pinyin: "tóngyì",
    meaningEn: "Agree",
    meaningBn: "একমত হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "可",
    pinyin: "kě",
    meaningEn: "But",
    meaningBn: "কিন্তু",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "屋子",
    pinyin: "wūzi",
    meaningEn: "Room",
    meaningBn: "ঘর",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "有关",
    pinyin: "yǒuguān",
    meaningEn: "Related to",
    meaningBn: "সম্পর্কিত",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "关机",
    pinyin: "guānjī",
    meaningEn: "Turn off phone",
    meaningBn: "ফোন বন্ধ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "前天",
    pinyin: "qiántiān",
    meaningEn: "Day before yesterday",
    meaningBn: "পরশুদিন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "留学",
    pinyin: "liúxué",
    meaningEn: "Study abroad",
    meaningBn: "বিদেশে পড়াশোনা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "国家",
    pinyin: "guójiā",
    meaningEn: "Country",
    meaningBn: "দেশ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "比如",
    pinyin: "bǐrú",
    meaningEn: "For example",
    meaningBn: "উদাহরণস্বরূপ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "查",
    pinyin: "chá",
    meaningEn: "Look up",
    meaningBn: "খোঁজা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "有用",
    pinyin: "yǒuyòng",
    meaningEn: "Useful",
    meaningBn: "দরকারী",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "容易",
    pinyin: "róngyì",
    meaningEn: "Easy",
    meaningBn: "সহজ",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "回答",
    pinyin: "huídá",
    meaningEn: "Answer",
    meaningBn: "উত্তর দেওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "方向",
    pinyin: "fāngxiàng",
    meaningEn: "Direction",
    meaningBn: "দিক",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "只有",
    pinyin: "zhǐyǒu",
    meaningEn: "Only",
    meaningBn: "একমাত্র",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "真正",
    pinyin: "zhēnzhèng",
    meaningEn: "Really",
    meaningBn: "সত্যিই",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "难题",
    pinyin: "nántí",
    meaningEn: "Difficult problem",
    meaningBn: "কঠিন সমস্যা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "怎样",
    pinyin: "zěnyàng",
    meaningEn: "How",
    meaningBn: "কীভাবে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "过节",
    pinyin: "guòjié",
    meaningEn: "Celebrate a festival",
    meaningBn: "উৎসব উদযাপন করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "节日",
    pinyin: "jiérì",
    meaningEn: "Festival",
    meaningBn: "ছুটির দিন",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "联欢",
    pinyin: "liánhuān",
    meaningEn: "Have a get-together",
    meaningBn: "আনন্দ-উৎসব",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "大概",
    pinyin: "dàgài",
    meaningEn: "About",
    meaningBn: "প্রায়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "阿姨",
    pinyin: "āyí",
    meaningEn: "Aunt",
    meaningBn: "খালাম্মা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "叔叔",
    pinyin: "shūshu",
    meaningEn: "Uncle",
    meaningBn: "খালু",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "收",
    pinyin: "shōu",
    meaningEn: "Accept/Receive",
    meaningBn: "গ্রহণ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "总",
    pinyin: "zǒng",
    meaningEn: "Always",
    meaningBn: "সবসময়",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "起",
    pinyin: "qǐ",
    meaningEn: "Used after verb",
    meaningBn: "উঠে আসা",
    hskLevel: 3,
    relatedWords: [
      {
        word: "起床",
        pinyin: "qǐchuáng",
        meaningEn: "Get up",
        meaningBn: "বিছানা থেকে ওঠা",
        hskLevel: 3,
        examples: [
            { chinese: "我七点起床。", pinyin: "Wǒ qī diǎn qǐchuáng.", meaningEn: "I get up at seven.", meaningBn: "সাতটায় উঠি।" },
        ],
      },
      {
        word: "一起",
        pinyin: "yìqǐ",
        meaningEn: "Together",
        meaningBn: "একসাথে",
        hskLevel: 3,
        examples: [
            { chinese: "我们一起去吧。", pinyin: "Wǒmen yìqǐ qù ba.", meaningEn: "Let's go together.", meaningBn: "একসাথে যাই।" },
        ],
      },
      {
        word: "起飞",
        pinyin: "qǐfēi",
        meaningEn: "Take off",
        meaningBn: "উড্ডয়ন",
        hskLevel: 3,
        examples: [
            { chinese: "飞机十点起飞。", pinyin: "Fēijī shí diǎn qǐfēi.", meaningEn: "The plane takes off at ten.", meaningBn: "বিমান দশটায় উড়বে।" },
        ],
      },
    ],
  },
  {
    character: "见面",
    pinyin: "jiànmiàn",
    meaningEn: "Meet",
    meaningBn: "সাক্ষাৎ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "矿泉水",
    pinyin: "kuàngquánshuǐ",
    meaningEn: "Mineral water",
    meaningBn: "মিনারেল ওয়াটার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "刚刚",
    pinyin: "gānggāng",
    meaningEn: "Just now",
    meaningBn: "এইমাত্র",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "出发",
    pinyin: "chūfā",
    meaningEn: "Depart",
    meaningBn: "রওয়ানা হওয়া",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "不久",
    pinyin: "bùjiǔ",
    meaningEn: "Soon",
    meaningBn: "কিছুদিন আগে",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "发生",
    pinyin: "fāshēng",
    meaningEn: "Happen",
    meaningBn: "ঘটা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "刚",
    pinyin: "gāng",
    meaningEn: "Just",
    meaningBn: "এইমাত্র",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "只要",
    pinyin: "zhǐyào",
    meaningEn: "As long as",
    meaningBn: "যতক্ষণ না",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "学期",
    pinyin: "xuéqī",
    meaningEn: "Semester",
    meaningBn: "সেমিস্টার",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "毕业",
    pinyin: "bìyè",
    meaningEn: "Graduate",
    meaningBn: "গ্র্যাজুয়েশন সম্পন্ন করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "出生",
    pinyin: "chūshēng",
    meaningEn: "Be born",
    meaningBn: "জন্মগ্রহণ করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "懂得",
    pinyin: "dǒngde",
    meaningEn: "Understand",
    meaningBn: "বুঝতে পারা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "坚持",
    pinyin: "jiānchí",
    meaningEn: "Persevere",
    meaningBn: "লেগে থাকা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "完成",
    pinyin: "wánchéng",
    meaningEn: "Complete",
    meaningBn: "সম্পন্ন করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "目标",
    pinyin: "mùbiāo",
    meaningEn: "Goal",
    meaningBn: "লক্ষ্য",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "发展",
    pinyin: "fāzhǎn",
    meaningEn: "Develop",
    meaningBn: "উন্নতি করা",
    hskLevel: 3,
    relatedWords: [
    ],
  },
  {
    character: "出",
    pinyin: "chū",
    meaningEn: "Out, exit",
    meaningBn: "বের হওয়া",
    hskLevel: 3,
    relatedWords: [
      {
        word: "出来",
        pinyin: "chūlái",
        meaningEn: "Come out",
        meaningBn: "বের হওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "太阳出来了。", pinyin: "Tàiyáng chūlái le.", meaningEn: "The sun came out.", meaningBn: "সূর্য উঠেছে।" },
        ],
      },
      {
        word: "出租车",
        pinyin: "chūzūchē",
        meaningEn: "Taxi",
        meaningBn: "ট্যাক্সি",
        hskLevel: 3,
        examples: [
            { chinese: "我们坐出租车去吧。", pinyin: "Wǒmen zuò chūzūchē qù ba.", meaningEn: "Let's take a taxi.", meaningBn: "ট্যাক্সিতে যাই।" },
        ],
      },
      {
        word: "出国",
        pinyin: "chūguó",
        meaningEn: "Go abroad",
        meaningBn: "বিদেশ যাওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "他出国留学了。", pinyin: "Tā chūguó liúxué le.", meaningEn: "He went abroad to study.", meaningBn: "সে বিদেশে পড়তে গেছে।" },
        ],
      },
    ],
  },
  {
    character: "醒",
    pinyin: "xǐng",
    meaningEn: "Wake up",
    meaningBn: "জাগা",
    hskLevel: 3,
    relatedWords: [
      {
        word: "醒来",
        pinyin: "xǐnglái",
        meaningEn: "Wake up",
        meaningBn: "জেগে ওঠা",
        hskLevel: 3,
        examples: [
            { chinese: "我六点醒来。", pinyin: "Wǒ liù diǎn xǐnglái.", meaningEn: "I wake up at six.", meaningBn: "ছয়টায় জেগে উঠি।" },
        ],
      },
      {
        word: "提醒",
        pinyin: "tíxǐng",
        meaningEn: "Remind",
        meaningBn: "মনে করানো",
        hskLevel: 3,
        examples: [
            { chinese: "请提醒我吃药。", pinyin: "Qǐng tíxǐng wǒ chīyào.", meaningEn: "Remind me to take medicine.", meaningBn: "ওষুধ খেতে মনে করিয়ে দিন।" },
        ],
      },
    ],
  },
  {
    character: "答",
    pinyin: "dá",
    meaningEn: "Answer, reply",
    meaningBn: "উত্তর",
    hskLevel: 3,
    relatedWords: [
      {
        word: "答案",
        pinyin: "dá'àn",
        meaningEn: "Answer key",
        meaningBn: "উত্তর",
        hskLevel: 3,
        examples: [
            { chinese: "答案是第三个。", pinyin: "Dá'àn shì dìsān ge.", meaningEn: "The answer is the third one.", meaningBn: "উত্তর তৃতীয়টি।" },
        ],
      },
      {
        word: "答应",
        pinyin: "dāying",
        meaningEn: "Promise",
        meaningBn: "কথা দেওয়া",
        hskLevel: 3,
        examples: [
            { chinese: "他答应帮我。", pinyin: "Tā dāying bāng wǒ.", meaningEn: "He promised to help.", meaningBn: "সে সাহায্যের কথা দিয়েছে।" },
        ],
      },
    ],
  },
];
