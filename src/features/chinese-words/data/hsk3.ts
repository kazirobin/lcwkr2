// HSK 3 root-word dataset — LOCAL data, no MongoDB.
// Ordered: the user's curated root list (serial) first, then the
// remaining lesson words. Every related word appears ONCE across all
// levels (global dedupe) — if already listed under another root, it is
// not repeated here. To add a new root: copy an object, keep
// `character` unique, fill relatedWords (with examples).
import type { ChineseWordEntry } from "../types";

export const HSK3_WORDS: ChineseWordEntry[] = [
  {
    character: "到",
    pinyin: "dào",
    meaningEn: "Arrive",
    meaningBn: "পৌঁছানো",
    hskLevel: 3,
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
    character: "走",
    pinyin: "zǒu",
    meaningEn: "Walk, leave",
    meaningBn: "হাঁটা",
    hskLevel: 3,
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
    character: "跑",
    pinyin: "pǎo",
    meaningEn: "Run",
    meaningBn: "দৌড়ানো",
    hskLevel: 3,
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
    character: "进",
    pinyin: "jìn",
    meaningEn: "Enter",
    meaningBn: "প্রবেশ",
    hskLevel: 3,
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
    character: "起",
    pinyin: "qǐ",
    meaningEn: "Rise, get up",
    meaningBn: "ওঠা",
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
    character: "坐",
    pinyin: "zuò",
    meaningEn: "Sit",
    meaningBn: "বসা",
    hskLevel: 3,
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
    character: "站",
    pinyin: "zhàn",
    meaningEn: "Stand, station",
    meaningBn: "দাঁড়ানো, স্টেশন",
    hskLevel: 3,
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
    character: "住",
    pinyin: "zhù",
    meaningEn: "Live, stay",
    meaningBn: "থাকা",
    hskLevel: 3,
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
    character: "睡",
    pinyin: "shuì",
    meaningEn: "Sleep",
    meaningBn: "ঘুমানো",
    hskLevel: 3,
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
    character: "吃",
    pinyin: "chī",
    meaningEn: "Eat",
    meaningBn: "খাওয়া",
    hskLevel: 3,
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
    character: "喝",
    pinyin: "hē",
    meaningEn: "Drink",
    meaningBn: "পান করা",
    hskLevel: 3,
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
    character: "穿",
    pinyin: "chuān",
    meaningEn: "Wear",
    meaningBn: "পরা",
    hskLevel: 3,
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
    character: "买",
    pinyin: "mǎi",
    meaningEn: "Buy",
    meaningBn: "কেনা",
    hskLevel: 3,
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
    character: "卖",
    pinyin: "mài",
    meaningEn: "Sell",
    meaningBn: "বিক্রি",
    hskLevel: 3,
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
    character: "给",
    pinyin: "gěi",
    meaningEn: "Give, to/for",
    meaningBn: "দেওয়া",
    hskLevel: 3,
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
    character: "拿",
    pinyin: "ná",
    meaningEn: "Take, hold",
    meaningBn: "নেওয়া",
    hskLevel: 3,
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
    character: "放",
    pinyin: "fàng",
    meaningEn: "Put, release",
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
    character: "找",
    pinyin: "zhǎo",
    meaningEn: "Look for, find",
    meaningBn: "খোঁজা",
    hskLevel: 3,
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
    character: "看",
    pinyin: "kàn",
    meaningEn: "Look, watch",
    meaningBn: "দেখা",
    hskLevel: 3,
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
    character: "听",
    pinyin: "tīng",
    meaningEn: "Listen",
    meaningBn: "শোনা",
    hskLevel: 3,
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
    character: "说",
    pinyin: "shuō",
    meaningEn: "Speak, say",
    meaningBn: "বলা",
    hskLevel: 3,
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
    character: "读",
    pinyin: "dú",
    meaningEn: "Read, study",
    meaningBn: "পড়া",
    hskLevel: 3,
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
    character: "写",
    pinyin: "xiě",
    meaningEn: "Write",
    meaningBn: "লেখা",
    hskLevel: 3,
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
    character: "问",
    pinyin: "wèn",
    meaningEn: "Ask",
    meaningBn: "জিজ্ঞাসা",
    hskLevel: 3,
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
