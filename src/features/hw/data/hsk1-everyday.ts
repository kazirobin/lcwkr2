import type { HwDialogueLine } from "./hsk1/lesson1-dialogue";

/**
 * HSK-1 everyday dialogues (Bangladesh-life conversations), one script
 * per lesson. Lessons 1–10 follow the course script; 11–15 are composed
 * from each lesson's own vocabulary words.
 *
 * TO EDIT OFFLINE: change any line here (hanzi / pinyin / en / bn),
 * save, reload — no database involved. Speakers alternate A (left) /
 * B (right). Pinyin with tone marks is strongly recommended
 * (the writing section accepts toneless answers, but listening
 * practice is far better with correct tones).
 */

type L = HwDialogueLine;

const L1: L[] = [
  { speaker: "A", hanzi: "你好！你好吗？", pinyin: "Nǐ hǎo! Nǐ hǎo ma?", en: "Hi! How are you?", bn: "হাই! কেমন আছো?" },
  { speaker: "B", hanzi: "我很好。你呢？", pinyin: "Wǒ hěn hǎo. Nǐ ne?", en: "I'm fine. And you?", bn: "আমি ভালো আছি। তুমি?" },
  { speaker: "A", hanzi: "我也很好。你工作吗？", pinyin: "Wǒ yě hěn hǎo. Nǐ gōngzuò ma?", en: "I'm fine too. Do you work?", bn: "আমিও ভালো। তুমি কি কাজ করো?" },
  { speaker: "B", hanzi: "对，我工作。我在服装厂工作。", pinyin: "Duì, wǒ gōngzuò. Wǒ zài fúzhuāngchǎng gōngzuò.", en: "Yes, I work. I work at a garment factory.", bn: "হ্যাঁ, কাজ করি। গার্মেন্টসে কাজ করি।" },
  { speaker: "A", hanzi: "你做什么工作？", pinyin: "Nǐ zuò shénme gōngzuò?", en: "What work do you do?", bn: "তুমি কী কাজ করো?" },
  { speaker: "B", hanzi: "我是工人。你呢？你学习吗？", pinyin: "Wǒ shì gōngrén. Nǐ ne? Nǐ xuéxí ma?", en: "I'm a worker. And you? Do you study?", bn: "আমি শ্রমিক। তুমি? পড়াশোনা করো?" },
  { speaker: "A", hanzi: "对，我学习汉语。", pinyin: "Duì, wǒ xuéxí Hànyǔ.", en: "Yes, I study Chinese.", bn: "হ্যাঁ, চাইনিজ পড়ি।" },
  { speaker: "B", hanzi: "太好了！再见！", pinyin: "Tài hǎo le! Zàijiàn!", en: "Great! Goodbye!", bn: "খুব ভালো! বিদায়!" },
];

const L2: L[] = [
  { speaker: "A", hanzi: "你好！你是马鲁夫吗？", pinyin: "Nǐ hǎo! Nǐ shì Mǎlǔfū ma?", en: "Hi! Are you Maruf?", bn: "হাই! তুমি কি মারুফ?" },
  { speaker: "B", hanzi: "不，我不是马鲁夫，我是久韦尔。你是苏曼吗？", pinyin: "Bù, wǒ bú shì Mǎlǔfū, wǒ shì Jiǔwéi'ěr. Nǐ shì Sūmàn ma?", en: "No, I'm not Maruf, I'm Jewel. Are you Suman?", bn: "না, আমি মারুফ না, আমি জুয়েল। তুমি কি সুমন?" },
  { speaker: "A", hanzi: "对，我是苏曼。认识你很高兴！", pinyin: "Duì, wǒ shì Sūmàn. Rènshi nǐ hěn gāoxìng!", en: "Yes, I'm Suman. Nice to meet you!", bn: "হ্যাঁ, আমি সুমন। পরিচিত হয়ে ভালো লাগলো!" },
];

const L3: L[] = [
  { speaker: "A", hanzi: "哈尼夫，你的老家在哪儿？", pinyin: "Hānífū, nǐ de lǎojiā zài nǎr?", en: "Hanif, where is your hometown?", bn: "হানিফ, তোমার গ্রামের বাড়ি কোথায়?" },
  { speaker: "B", hanzi: "我的老家在杰索尔。你旁边是谁？", pinyin: "Wǒ de lǎojiā zài Jiésuǒ'ěr. Nǐ pángbiān shì shéi?", en: "My hometown is in Jashore. Who is next to you?", bn: "আমার গ্রামের বাড়ি যশোরে। তোমার পাশে কে?" },
  { speaker: "A", hanzi: "他是我的朋友。", pinyin: "Tā shì wǒ de péngyou.", en: "He is my friend.", bn: "উনি আমার বন্ধু।" },
  { speaker: "B", hanzi: "你工作忙吗？怎么没有你的消息？", pinyin: "Nǐ gōngzuò máng ma? Zěnme méiyǒu nǐ de xiāoxi?", en: "Are you busy with work? Why no news from you?", bn: "কাজে ব্যস্ত? তোমার খবর নেই কেন?" },
  { speaker: "A", hanzi: "我有点儿忙，但是我想你。", pinyin: "Wǒ yǒu diǎnr máng, dànshì wǒ xiǎng nǐ.", en: "I'm a bit busy, but I miss you.", bn: "একটু ব্যস্ত, তবে তোমার কথা মনে করি।" },
];

const L4: L[] = [
  { speaker: "A", hanzi: "哈尼夫，你有电脑吗？", pinyin: "Hānífū, nǐ yǒu diànnǎo ma?", en: "Hanif, do you have a computer?", bn: "হানিফ, তোমার কম্পিউটার আছে?" },
  { speaker: "B", hanzi: "有。", pinyin: "Yǒu.", en: "Yes.", bn: "আছে।" },
  { speaker: "A", hanzi: "你的电脑是新的还是旧的？", pinyin: "Nǐ de diànnǎo shì xīn de háishi jiù de?", en: "Is your computer new or old?", bn: "নতুন না পুরনো?" },
  { speaker: "B", hanzi: "不太旧，我买了六个月。", pinyin: "Bú tài jiù, wǒ mǎi le liù ge yuè.", en: "Not too old, I bought it six months ago.", bn: "বেশি পুরনো না, ৬ মাস হলো কিনেছি।" },
  { speaker: "A", hanzi: "我想买一台电脑。你旁边有人卖电脑吗？", pinyin: "Wǒ xiǎng mǎi yī tái diànnǎo. Nǐ pángbiān yǒu rén mài diànnǎo ma?", en: "I want to buy a computer. Is anyone near you selling one?", bn: "কম্পিউটার কিনতে চাই। আশেপাশে কেউ বিক্রি করে?" },
  { speaker: "B", hanzi: "好，没问题。", pinyin: "Hǎo, méi wèntí.", en: "OK, no problem.", bn: "আচ্ছা, ঠিক আছে।" },
];

const L5: L[] = [
  { speaker: "A", hanzi: "阿纳斯，你今天没去办公室吗？", pinyin: "Ānàsī, nǐ jīntiān méi qù bàngōngshì ma?", en: "Anas, didn't you go to the office today?", bn: "আনাস, আজ অফিসে যাওনি?" },
  { speaker: "B", hanzi: "对，今天不去，因为星期天休息。", pinyin: "Duì, jīntiān bú qù, yīnwèi xīngqītiān xiūxi.", en: "Right, not going today, Sunday is off.", bn: "হ্যাঁ, যাবো না, রবিবার বন্ধ।" },
  { speaker: "A", hanzi: "你在哪儿工作？", pinyin: "Nǐ zài nǎr gōngzuò?", en: "Where do you work?", bn: "কোথায় কাজ করো?" },
  { speaker: "B", hanzi: "我在中国公司工作。", pinyin: "Wǒ zài Zhōngguó gōngsī gōngzuò.", en: "I work at a Chinese company.", bn: "চাইনিজ কোম্পানিতে কাজ করি।" },
  { speaker: "A", hanzi: "你几点上班，几点下班？", pinyin: "Nǐ jǐ diǎn shàngbān, jǐ diǎn xiàbān?", en: "What time do you start and finish?", bn: "কয়টা থেকে কয়টা ডিউটি?" },
  { speaker: "B", hanzi: "早上八点到下午五点。", pinyin: "Zǎoshang bā diǎn dào xiàwǔ wǔ diǎn.", en: "8 in the morning to 5 in the afternoon.", bn: "সকাল ৮টা থেকে বিকাল ৫টা।" },
  { speaker: "A", hanzi: "你的工资是多少？", pinyin: "Nǐ de gōngzī shì duōshao?", en: "What is your salary?", bn: "বেতন কত?" },
  { speaker: "B", hanzi: "一万四千块。", pinyin: "Yī wàn sì qiān kuài.", en: "Fourteen thousand.", bn: "১৪ হাজার টাকা।" },
];

const L6: L[] = [
  { speaker: "A", hanzi: "萨比尔，你去哪儿？", pinyin: "Sàbǐ'ěr, nǐ qù nǎr?", en: "Sabbir, where are you going?", bn: "সাব্বির, কই যাও?" },
  { speaker: "B", hanzi: "我去北拉的一个大商场。", pinyin: "Wǒ qù Běilā de yí ge dà shāngchǎng.", en: "I'm going to a big mall in Uttara.", bn: "উত্তরার বড় মার্কেটে যাবো।" },
  { speaker: "A", hanzi: "你只给自己买东西吗？", pinyin: "Nǐ zhǐ gěi zìjǐ mǎi dōngxi ma?", en: "Are you shopping only for yourself?", bn: "শুধু নিজের জন্য কিনবে?" },
  { speaker: "B", hanzi: "不，我给爸爸妈妈、两个姐姐和我太太买东西。", pinyin: "Bù, wǒ gěi bàba māma, liǎng ge jiějie hé wǒ tàitai mǎi dōngxi.", en: "No, I'm buying for my parents, two sisters and my wife.", bn: "না, আব্বু-আম্মু, ২ বোন আর স্ত্রীর জন্য কিনবো।" },
  { speaker: "A", hanzi: "太好了！再见！", pinyin: "Tài hǎo le! Zàijiàn!", en: "Great! Bye!", bn: "খুব ভালো! বিদায়!" },
  { speaker: "B", hanzi: "再见！", pinyin: "Zàijiàn!", en: "Bye!", bn: "বিদায়!" },
];

const L7: L[] = [
  { speaker: "A", hanzi: "妈妈，我饿了，快给我饭吃。", pinyin: "Māma, wǒ è le, kuài gěi wǒ fàn chī.", en: "Mom, I'm hungry, give me food quickly.", bn: "আম্মু, ক্ষিদে লাগছে, তাড়াতাড়ি খেতে দাও।" },
  { speaker: "B", hanzi: "好，你坐，我给你做饼。", pinyin: "Hǎo, nǐ zuò, wǒ gěi nǐ zuò bǐng.", en: "OK, sit, I'll make roti for you.", bn: "আচ্ছা বসো, রুটি বানিয়ে দিচ্ছি।" },
  { speaker: "A", hanzi: "好，妈妈，快一点儿。", pinyin: "Hǎo, māma, kuài yì diǎnr.", en: "OK mom, hurry a bit.", bn: "ঠিক আছে মা, তাড়াতাড়ি করো।" },
  { speaker: "B", hanzi: "里法特，拿灯来，没电了。", pinyin: "Lǐfǎtè, ná dēng lái, méi diàn le.", en: "Rifat, bring the lamp, the power is out.", bn: "রিফাত, লাইট নিয়ে আসো, কারেন্ট গেছে।" },
  { speaker: "A", hanzi: "妈妈，灯没有电。", pinyin: "Māma, dēng méiyǒu diàn.", en: "Mom, the lamp has no charge.", bn: "মা, লাইটে চার্জ নাই।" },
  { speaker: "B", hanzi: "好，拿我的手机来。", pinyin: "Hǎo, ná wǒ de shǒujī lái.", en: "OK, bring my phone.", bn: "আচ্ছা, আমার ফোনটা নিয়ে আসো।" },
  { speaker: "A", hanzi: "妈妈，你的手机在哪儿？", pinyin: "Māma, nǐ de shǒujī zài nǎr?", en: "Mom, where is your phone?", bn: "মা, ফোনটা কোথায়?" },
  { speaker: "B", hanzi: "在我房间的桌子上。", pinyin: "Zài wǒ fángjiān de zhuōzi shang.", en: "On the table in my room.", bn: "আমার রুমে টেবিলের ওপরে।" },
];

const L8: L[] = [
  { speaker: "A", hanzi: "苏曼，起床，十点了。今天我们去公园玩。", pinyin: "Sūmàn, qǐchuáng, shí diǎn le. Jīntiān wǒmen qù gōngyuán wán.", en: "Suman, get up, it's 10. Today we're going to the park.", bn: "সুমন ওঠো, ১০টা বাজে। আজ পার্কে যাবো।" },
  { speaker: "B", hanzi: "好，妈妈，公园的票多少钱一张？", pinyin: "Hǎo, māma, gōngyuán de piào duōshao qián yī zhāng?", en: "OK mom, how much is one park ticket?", bn: "টিকিট কত করে?" },
  { speaker: "A", hanzi: "不贵，只要八十块。", pinyin: "Bú guì, zhǐ yào bāshí kuài.", en: "Not expensive, only eighty.", bn: "বেশি না, মাত্র ৮০ টাকা।" },
  { speaker: "B", hanzi: "好，妈妈，那儿什么吃的都有吗？", pinyin: "Hǎo, māma, nàr shénme chī de dōu yǒu ma?", en: "OK, is there every kind of food there?", bn: "সব খাবার পাওয়া যায়?" },
  { speaker: "A", hanzi: "对，什么都有。", pinyin: "Duì, shénme dōu yǒu.", en: "Yes, everything.", bn: "হ্যাঁ, সব আছে।" },
  { speaker: "B", hanzi: "妈妈，你以前去过那儿吗？", pinyin: "Māma, nǐ yǐqián qù guo nàr ma?", en: "Mom, have you been there before?", bn: "আগে গেছিলে?" },
  { speaker: "A", hanzi: "去过，六七个月以前去的。", pinyin: "Qù guo, liù qī ge yuè yǐqián qù de.", en: "Yes, I went six or seven months ago.", bn: "গেছিলাম ৬-৭ মাস আগে।" },
];

const L9: L[] = [
  { speaker: "A", hanzi: "萨吉布，你今天怎么没去学校？", pinyin: "Sàjíbù, nǐ jīntiān zěnme méi qù xuéxiào?", en: "Sajib, why didn't you go to school today?", bn: "সজিব, আজ স্কুলে যাওনি কেন?" },
  { speaker: "B", hanzi: "哥哥，今天学校放假。", pinyin: "Gēge, jīntiān xuéxiào fàngjià.", en: "Brother, school was closed today.", bn: "ভাইয়া, আজ বন্ধ ছিল।" },
  { speaker: "A", hanzi: "你们学校一个星期放几天假？", pinyin: "Nǐmen xuéxiào yí ge xīngqī fàng jǐ tiān jià?", en: "How many days off does your school have per week?", bn: "সপ্তাহে কয়দিন বন্ধ?" },
  { speaker: "B", hanzi: "一天，星期五。", pinyin: "Yì tiān, xīngqīwǔ.", en: "One day, Friday.", bn: "একদিন, শুক্রবার।" },
  { speaker: "A", hanzi: "你们班有多少学生？", pinyin: "Nǐmen bān yǒu duōshao xuéshēng?", en: "How many students are in your class?", bn: "ক্লাসে কয়জন?" },
  { speaker: "B", hanzi: "有五十个左右。", pinyin: "Yǒu wǔshí ge zuǒyòu.", en: "About fifty.", bn: "৫০ জনের মতো।" },
  { speaker: "A", hanzi: "你的学号是几号？", pinyin: "Nǐ de xuéhào shì jǐ hào?", en: "What is your roll number?", bn: "রোল কত?" },
  { speaker: "B", hanzi: "我的学号是四号。", pinyin: "Wǒ de xuéhào shì sì hào.", en: "My roll number is four.", bn: "রোল ৪।" },
  { speaker: "A", hanzi: "你们学校每个星期考试吗？", pinyin: "Nǐmen xuéxiào měi ge xīngqī kǎoshì ma?", en: "Does your school test every week?", bn: "প্রতি সপ্তাহে পরীক্ষা হয়?" },
  { speaker: "B", hanzi: "对。", pinyin: "Duì.", en: "Yes.", bn: "হ্যাঁ।" },
  { speaker: "A", hanzi: "你带午饭去学校吗？", pinyin: "Nǐ dài wǔfàn qù xuéxiào ma?", en: "Do you take lunch to school?", bn: "দুপুরের খাবার নিয়ে যাও?" },
  { speaker: "B", hanzi: "不，我回家吃，学校给三十分钟。", pinyin: "Bù, wǒ huí jiā chī, xuéxiào gěi sānshí fēnzhōng.", en: "No, I eat at home, school gives thirty minutes.", bn: "না, বাসায় খাই, ৩০ মিনিট দেয়।" },
];

const L10: L[] = [
  { speaker: "A", hanzi: "久韦尔，这个漂亮的房子是谁的？", pinyin: "Jiǔwéi'ěr, zhège piàoliang de fángzi shì shéi de?", en: "Jewel, whose beautiful house is this?", bn: "জুয়েল, এই সুন্দর বাড়ি কার?" },
  { speaker: "B", hanzi: "这个房子是我表哥的堂弟的。", pinyin: "Zhège fángzi shì wǒ biǎogē de tángdì de.", en: "This house is my cousin's cousin's.", bn: "খালাতো ভাইয়ের চাচার ছেলের।" },
  { speaker: "A", hanzi: "这么漂亮的房子是谁盖的？他在国外吗？", pinyin: "Zhème piàoliang de fángzi shì shéi gài de? Tā zài guówài ma?", en: "Who built such a beautiful house? Does he live abroad?", bn: "কে বানাল? বিদেশে থাকে?" },
  { speaker: "B", hanzi: "对，他在国外十年了，在欧洲做翻译。", pinyin: "Duì, tā zài guówài shí nián le, zài Ōuzhōu zuò fānyì.", en: "Yes, he's been abroad ten years, translating in Europe.", bn: "হ্যাঁ, ১০ বছর ইউরোপে, দুভাষীর কাজ করে।" },
  { speaker: "A", hanzi: "他的爸爸妈妈做什么？", pinyin: "Tā de bàba māma zuò shénme?", en: "What do his parents do?", bn: "আব্বু-আম্মু কী করেন?" },
  { speaker: "B", hanzi: "他的爸爸不在了，他妈妈走路不太方便。", pinyin: "Tā de bàba bú zài le, tā māma zǒulù bú tài fāngbiàn.", en: "His dad passed away, his mom has difficulty walking.", bn: "আব্বু বেঁচে নেই, আম্মু হাঁটতে কষ্ট হয়।" },
];

const L11: L[] = [
  { speaker: "A", hanzi: "弟弟，起床！七点了！", pinyin: "Dìdi, qǐchuáng! Qī diǎn le!", en: "Little brother, get up! It's seven!", bn: "ভাই, ওঠো! ৭টা বাজে!" },
  { speaker: "B", hanzi: "哥哥，我昨天十二点睡觉。", pinyin: "Gēge, wǒ zuótiān shí'èr diǎn shuìjiào.", en: "Brother, I slept at twelve yesterday.", bn: "ভাইয়া, কাল ১২টায় ঘুমিয়েছি।" },
  { speaker: "A", hanzi: "你每天几点起床？", pinyin: "Nǐ měitiān jǐ diǎn qǐchuáng?", en: "What time do you get up every day?", bn: "প্রতিদিন কয়টায় ওঠো?" },
  { speaker: "B", hanzi: "我六点半起床。你呢？", pinyin: "Wǒ liù diǎn bàn qǐchuáng. Nǐ ne?", en: "I get up at six thirty. And you?", bn: "সাড়ে ৬টায়। তুমি?" },
  { speaker: "A", hanzi: "我也六点半起床。大学在哪里？", pinyin: "Wǒ yě liù diǎn bàn qǐchuáng. Dàxué zài nǎlǐ?", en: "I get up at six thirty too. Where is the university?", bn: "আমিও। বিশ্ববিদ্যালয় কোথায়?" },
  { speaker: "B", hanzi: "大学在饭店旁边。", pinyin: "Dàxué zài fàndiàn pángbiān.", en: "The university is next to the restaurant.", bn: "রেস্টুরেন্টের পাশে।" },
  { speaker: "A", hanzi: "好，谢谢！再见！", pinyin: "Hǎo, xièxie! Zàijiàn!", en: "OK, thanks! Bye!", bn: "ঠিক আছে, ধন্যবাদ! বিদায়!" },
  { speaker: "B", hanzi: "再见！", pinyin: "Zàijiàn!", en: "Bye!", bn: "বিদায়!" },
];

const L12: L[] = [
  { speaker: "A", hanzi: "今天天气怎么样？", pinyin: "Jīntiān tiānqì zěnmeyàng?", en: "How is the weather today?", bn: "আজ আবহাওয়া কেমন?" },
  { speaker: "B", hanzi: "下雨，有点儿冷。", pinyin: "Xià yǔ, yǒudiǎnr lěng.", en: "Rainy, a bit cold.", bn: "বৃষ্টি, একটু ঠান্ডা।" },
  { speaker: "A", hanzi: "你觉得冷吗？", pinyin: "Nǐ juéde lěng ma?", en: "Do you feel cold?", bn: "ঠান্ডা লাগছে?" },
  { speaker: "B", hanzi: "有一点儿冷。你去公司吗？", pinyin: "Yǒu yìdiǎnr lěng. Nǐ qù gōngsī ma?", en: "A little cold. Are you going to the company?", bn: "একটু। অফিসে যাবে?" },
  { speaker: "A", hanzi: "不去，我生病了。", pinyin: "Bú qù, wǒ shēngbìng le.", en: "No, I'm sick.", bn: "না, অসুস্থ।" },
  { speaker: "B", hanzi: "去看病吧，多喝水。", pinyin: "Qù kànbìng ba, duō hē shuǐ.", en: "Go see a doctor, drink more water.", bn: "ডাক্তার দেখাও, বেশি পানি খাও।" },
  { speaker: "A", hanzi: "好，我吃药，回去了。", pinyin: "Hǎo, wǒ chī yào, huí qù le.", en: "OK, I'll take medicine and head back.", bn: "ঠিক আছে, ওষুধ খেয়ে ফিরে যাই।" },
  { speaker: "B", hanzi: "再见！", pinyin: "Zàijiàn!", en: "Bye!", bn: "বিদায়!" },
];

const L13: L[] = [
  { speaker: "A", hanzi: "服务员，你好！", pinyin: "Fúwùyuán, nǐ hǎo!", en: "Waiter, hi!", bn: "ওয়েটার!" },
  { speaker: "B", hanzi: "先生，请坐！要什么？", pinyin: "Xiānsheng, qǐng zuò! Yào shénme?", en: "Sir, please sit! What would you like?", bn: "স্যার বসুন! কী নেবেন?" },
  { speaker: "A", hanzi: "一杯茶，一个面包，两个鸡蛋。", pinyin: "Yì bēi chá, yí ge miànbāo, liǎng ge jīdàn.", en: "A cup of tea, one bread, two eggs.", bn: "এক কাপ চা, একটা রুটি, দুটো ডিম।" },
  { speaker: "B", hanzi: "好。还要什么？", pinyin: "Hǎo. Hái yào shénme?", en: "OK. Anything else?", bn: "ঠিক আছে। আর কিছু?" },
  { speaker: "A", hanzi: "不要了，谢谢。", pinyin: "Bú yào le, xièxie.", en: "Nothing else, thanks.", bn: "আর না, ধন্যবাদ।" },
  { speaker: "B", hanzi: "好，请等一下。", pinyin: "Hǎo, qǐng děng yíxià.", en: "OK, please wait a moment.", bn: "ঠিক আছে, একটু অপেক্ষা করুন।" },
  { speaker: "A", hanzi: "茶很好喝！", pinyin: "Chá hěn hǎo hē!", en: "The tea is delicious!", bn: "চা মজা!" },
  { speaker: "B", hanzi: "谢谢！", pinyin: "Xièxie!", en: "Thanks!", bn: "ধন্যবাদ!" },
];

const L14: L[] = [
  { speaker: "A", hanzi: "你明年上中学吗？", pinyin: "Nǐ míngnián shàng zhōngxué ma?", en: "Will you go to middle school next year?", bn: "আগামী বছর মিডল স্কুলে যাবে?" },
  { speaker: "B", hanzi: "对，我明年上中学。你呢？", pinyin: "Duì, wǒ míngnián shàng zhōngxué. Nǐ ne?", en: "Yes, I will. And you?", bn: "হ্যাঁ। তুমি?" },
  { speaker: "A", hanzi: "我还上小学。", pinyin: "Wǒ hái shàng xiǎoxué.", en: "I still go to primary school.", bn: "আমি এখনো প্রাইমারিতে।" },
  { speaker: "B", hanzi: "你喜欢汉字吗？", pinyin: "Nǐ xǐhuan Hànzì ma?", en: "Do you like Chinese characters?", bn: "হানজি ভালো লাগে?" },
  { speaker: "A", hanzi: "喜欢！我每天写汉字。", pinyin: "Xǐhuan! Wǒ měitiān xiě Hànzì.", en: "Yes! I write characters every day.", bn: "ভালো লাগে! প্রতিদিন লিখি।" },
  { speaker: "B", hanzi: "中午我们一起听汉语，好吗？", pinyin: "Zhōngwǔ wǒmen yìqǐ tīng Hànyǔ, hǎo ma?", en: "At noon let's listen to Chinese together, OK?", bn: "দুপুরে একসাথে শুনি?" },
  { speaker: "A", hanzi: "好！不要说话，听！", pinyin: "Hǎo! Bú yào shuōhuà, tīng!", en: "OK! No talking, listen!", bn: "ঠিক আছে! কথা না, শোনো!" },
  { speaker: "B", hanzi: "听见了，很有意思。", pinyin: "Tīngjiàn le, hěn yǒu yìsi.", en: "I hear it, very interesting.", bn: "শুনছি, মজার!" },
];

const L15: L[] = [
  { speaker: "A", hanzi: "你去年去哪儿了？", pinyin: "Nǐ qùnián qù nǎr le?", en: "Where did you go last year?", bn: "গত বছর কোথায় গেছিলে?" },
  { speaker: "B", hanzi: "我去年坐飞机去北京了。", pinyin: "Wǒ qùnián zuò fēijī qù Běijīng le.", en: "Last year I flew to Beijing.", bn: "প্লেনে বেইজিং গেছিলাম।" },
  { speaker: "A", hanzi: "飞机坐几个小时？", pinyin: "Fēijī zuò jǐ ge xiǎoshí?", en: "How many hours by plane?", bn: "কয় ঘণ্টা লাগে?" },
  { speaker: "B", hanzi: "三个小时。你去过吗？", pinyin: "Sān ge xiǎoshí. Nǐ qù guo ma?", en: "Three hours. Have you been?", bn: "তিন ঘণ্টা। গেছো?" },
  { speaker: "A", hanzi: "没去过。北京好玩儿吗？", pinyin: "Méi qù guo. Běijīng hǎowánr ma?", en: "Never. Is Beijing fun?", bn: "যাইনি। মজার?" },
  { speaker: "B", hanzi: "很好玩儿！我爱北京。", pinyin: "Hěn hǎowánr! Wǒ ài Běijīng.", en: "Very fun! I love Beijing.", bn: "অনেক মজার! ভালোবাসি।" },
  { speaker: "A", hanzi: "你住哪儿？住你男朋友家吗？", pinyin: "Nǐ zhù nǎr? Zhù nǐ nánpéngyou jiā ma?", en: "Where did you stay? At your boyfriend's home?", bn: "কোথায় ছিলে? বয়ফ্রেন্ডের বাসায়?" },
  { speaker: "B", hanzi: "对，我早上去机场，他来接我。", pinyin: "Duì, wǒ zǎo shang qù jīchǎng, tā lái jiē wǒ.", en: "Yes, I went to the airport in the morning, he picked me up.", bn: "হ্যাঁ, সকালে এয়ারপোর্টে গেছিলাম, ও নিতে এসেছিল।" },
];

export const hsk1EverydayDialogues: Record<number, L[]> = {
  1: L1,
  2: L2,
  3: L3,
  4: L4,
  5: L5,
  6: L6,
  7: L7,
  8: L8,
  9: L9,
  10: L10,
  11: L11,
  12: L12,
  13: L13,
  14: L14,
  15: L15,
};
