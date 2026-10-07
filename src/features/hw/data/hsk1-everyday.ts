import type { HwDialogueLine } from "./hsk1/lesson1-dialogue";

/**
 * HSK-1 dialogues (Bangladesh-life conversations), one script per lesson
 * 1–15 — the course dialogues.
 *
 * TO EDIT OFFLINE: change any line here (hanzi / pinyin / en / bn),
 * save, reload — no database involved. Speakers alternate A (left) /
 * B (right). Pinyin with tone marks is strongly recommended
 * (the writing section accepts toneless answers, but listening
 * practice is far better with correct tones).
 */

type L = HwDialogueLine;

const L1: L[] = [
  { speaker: "A", hanzi: "你好吗？现在在做什么？", pinyin: "Nǐ hǎo ma? Xiànzài zài zuò shénme?", en: "How are you? What are you doing now?", bn: "কেমন আছো? এখন কী করছো?" },
  { speaker: "B", hanzi: "我很好。我现在在服装厂工作。你做什么工作？", pinyin: "Wǒ hěn hǎo. Wǒ xiànzài zài fúzhuāngchǎng gōngzuò. Nǐ zuò shénme gōngzuò?", en: "I'm fine. I work at a garment factory now. What work do you do?", bn: "আমি ভালো আছি। এখন গার্মেন্টসে কাজ করি। তুমি কী কাজ করো?" },
  { speaker: "A", hanzi: "我在学习。", pinyin: "Wǒ zài xuéxí.", en: "I'm studying.", bn: "আমি পড়াশোনা করছি।" },
];

const L2: L[] = [
  { speaker: "A", hanzi: "你是马鲁夫吗？", pinyin: "Nǐ shì Mǎlǔfū ma?", en: "Are you Maruf?", bn: "তুমি কি মারুফ?" },
  { speaker: "B", hanzi: "不，我不是马鲁夫，我是朱耶尔。你是苏蒙吗？", pinyin: "Bù, wǒ bú shì Mǎlǔfū, wǒ shì Zhūyē'ěr. Nǐ shì Sūméng ma?", en: "No, I'm not Maruf, I'm Juyel. Are you Sumon?", bn: "না, আমি মারুফ না, আমি জুয়েল। তুমি কি সুমন?" },
  { speaker: "A", hanzi: "是的，我是苏蒙。很高兴认识你。", pinyin: "Shì de, wǒ shì Sūméng. Hěn gāoxìng rènshi nǐ!", en: "Yes, I'm Sumon. Nice to meet you!", bn: "হ্যাঁ, আমি সুমন। পরিচিত হয়ে ভালো লাগলো!" },
];

const L3: L[] = [
  { speaker: "A", hanzi: "哈尼夫哥，你的老家在哪里？", pinyin: "Hānífū gē, nǐ de lǎojiā zài nǎlǐ?", en: "Brother Hanif, where is your hometown?", bn: "হানিফ ভাইয়া, তোমার গ্রামের বাড়ি কোথায়?" },
  { speaker: "B", hanzi: "我的老家在杰索尔。你跟他是什么关系？", pinyin: "Wǒ de lǎojiā zài Jiésuǒ'ěr. Nǐ gēn tā shì shénme guānxi?", en: "My hometown is in Jashore. What is your relationship with him?", bn: "আমার গ্রামের বাড়ি যশোরে। তুমি তার সাথে কী সম্পর্ক?" },
  { speaker: "A", hanzi: "他是我的朋友。", pinyin: "Tā shì wǒ de péngyou.", en: "He is my friend.", bn: "সে আমার বন্ধু।" },
  { speaker: "B", hanzi: "你工作是不是很忙？怎么一直没有你的消息？", pinyin: "Nǐ gōngzuò shì bu shì hěn máng? Zěnme yìzhí méiyǒu nǐ de xiāoxi?", en: "Aren't you very busy with work? Why no news from you all this while?", bn: "কাজে কি খুব ব্যস্ত? এতক্ষণ তোমার খবর কেন নেই?" },
  { speaker: "A", hanzi: "我最近有点忙，不过我一直记得你。", pinyin: "Wǒ zuìjìn yǒudiǎn máng, búguò wǒ yìzhí jìde nǐ.", en: "I've been a bit busy lately, but I've always remembered you.", bn: "সাম্প্রতিক একটু ব্যস্ত, তবে তোমার কথা মনে রাখি।" },
];

const L4: L[] = [
  { speaker: "A", hanzi: "哈尼夫哥，你有电脑吗？", pinyin: "Hānífū gē, nǐ yǒu diànnǎo ma?", en: "Brother Hanif, do you have a computer?", bn: "হানিফ ভাইয়া, তোমার কম্পিউটার আছে?" },
  { speaker: "B", hanzi: "嗯，有。", pinyin: "Èn, yǒu.", en: "Yes, I do.", bn: "হ্যাঁ, আছে।" },
  { speaker: "A", hanzi: "你的电脑是新的吗？还是旧的？", pinyin: "Nǐ de diànnǎo shì xīn de ma? Háishi jiù de?", en: "Is your computer new? Or old?", bn: "তোমার কম্পিউটার কি নতুন? নাকি পুরনো?" },
  { speaker: "B", hanzi: "买了六个月了，哥。", pinyin: "Mǎi le liù ge yuè le, gē.", en: "I bought it six months ago, brother.", bn: "৬ মাস হলো কিনেছি, ভাইয়া।" },
  { speaker: "A", hanzi: "哈尼夫哥，我想买一台电脑。如果你附近有人卖电脑，请告诉我一声。", pinyin: "Hānífū gē, wǒ xiǎng mǎi yí tái diànnǎo. Rúguǒ nǐ fùjìn yǒu rén mài diànnǎo, qǐng gàosu wǒ yì shēng.", en: "Brother Hanif, I want to buy a computer. If anyone near you sells computers, please let me know.", bn: "হানিফ ভাইয়া, আমি একটা কম্পিউটার কিনতে চাই। তোমার আশেপাশে কেউ বিক্রি করলে জানিয়ে দিও।" },
  { speaker: "B", hanzi: "好，没问题，哥。", pinyin: "Hǎo, méi wèntí, gē.", en: "OK, no problem, brother.", bn: "ঠিক আছে, কোনো সমস্যা নেই, ভাইয়া।" },
];

const L5: L[] = [
  { speaker: "A", hanzi: "阿纳斯哥，你今天没去办公室吗？", pinyin: "Ānàsī gē, nǐ jīntiān méi qù bàngōngshì ma?", en: "Brother Anas, didn't you go to the office today?", bn: "আনাস ভাইয়া, আজ অফিসে যাওনি?" },
  { speaker: "B", hanzi: "不，哥，今天不去，因为我们办公室星期天不上班。", pinyin: "Bù, gē, jīntiān bú qù, yīnwèi wǒmen bàngōngshì xīngqītiān bù shàngbān.", en: "No, brother, I'm not going today — our office doesn't work on Sundays.", bn: "না, ভাইয়া, আজ যাবো না, আমাদের অফিস রবিবার কাজ করে না।" },
  { speaker: "A", hanzi: "哦，原来这样。阿纳斯哥，你在哪个办公室工作？", pinyin: "Ó, yuánlái zhèyàng. Ānàsī gē, nǐ zài nǎge bàngōngshì gōngzuò?", en: "Oh, so that's how it is. Brother Anas, which office do you work in?", bn: "ও, একথা। আনাস ভাইয়া, তুমি কোন অফিসে কাজ করো?" },
  { speaker: "B", hanzi: "哥，我在一家中国公司工作。", pinyin: "Gē, wǒ zài yì jiā Zhōngguó gōngsī gōngzuò.", en: "Brother, I work at a Chinese company.", bn: "ভাইয়া, আমি একটা চাইনিজ কোম্পানিতে কাজ করি।" },
  { speaker: "A", hanzi: "哦，哥，你几点上班，几点下班？", pinyin: "Ó, gē, nǐ jǐ diǎn shàngbān, jǐ diǎn xiàbān?", en: "Oh, brother, what time do you start and finish work?", bn: "ও, ভাইয়া, কয়টায় ডিউটি শুরু, কয়টায় ছাড়া?" },
  { speaker: "B", hanzi: "早上八点到下午五点。", pinyin: "Zǎoshang bā diǎn dào xiàwǔ wǔ diǎn.", en: "Eight in the morning to five in the afternoon.", bn: "সকাল ৮টা থেকে বিকাল ৫টা।" },
  { speaker: "A", hanzi: "你的工资是多少，哥？", pinyin: "Nǐ de gōngzī shì duōshao, gē?", en: "How much is your salary, brother?", bn: "বেতন কত, ভাইয়া?" },
  { speaker: "B", hanzi: "一万四千塔卡，是基本工资。", pinyin: "Yī wàn sì qiān tǎkǎ, shì jīběn gōngzī.", en: "Fourteen thousand taka — that's the basic salary.", bn: "চৌদ্দ হাজার টাকা, এটা বেসিক বেতন।" },
];

const L6: L[] = [
  { speaker: "A", hanzi: "萨比尔，你去哪儿？", pinyin: "Sàbǐ'ěr, nǐ qù nǎr?", en: "Sabbir, where are you going?", bn: "সাব্বির, কই যাও?" },
  { speaker: "B", hanzi: "我去乌特拉的一个大商场。", pinyin: "Wǒ qù Wūtèlā de yí ge dà shāngchǎng.", en: "I'm going to a big shopping mall in Uttara.", bn: "উত্তরার একটা বড় শপিংমলে যাচ্ছি।" },
  { speaker: "A", hanzi: "你只是给自己买东西吗？", pinyin: "Nǐ zhǐshì gěi zìjǐ mǎi dōngxi ma?", en: "Are you only buying things for yourself?", bn: "শুধু নিজের জন্য কিনছো?" },
  { speaker: "B", hanzi: "不是，哥，我爸爸妈妈、两个姐妹，还有我的妻子，我要给大家买东西。", pinyin: "Bú shì, gē, wǒ bàba māma, liǎng ge jiěmei, hái yǒu wǒ de qīzi, wǒ yào gěi dàjiā mǎi dōngxi.", en: "No, brother — my dad, mom, two sisters and my wife. I'm buying for everyone.", bn: "না, ভাইয়া, আব্বু-আম্মু, দুই বোন, আর আমার স্ত্রী — সবার জন্য কিনছি।" },
];

const L7: L[] = [
  { speaker: "A", hanzi: "妈妈，我饿了，快点给我做点吃的。", pinyin: "Māma, wǒ è le, kuài diǎn gěi wǒ zuò diǎn chī de.", en: "Mom, I'm hungry — make me something to eat, quickly.", bn: "আম্মু, ক্ষিদে লাগছে, তাড়াতাড়ি কিছু বানিয়ে দাও।" },
  { speaker: "B", hanzi: "好，你坐着，我给你做烙饼。", pinyin: "Hǎo, nǐ zuòzhe, wǒ gěi nǐ zuò làobǐng.", en: "OK, sit down — I'll make you flatbread.", bn: "ঠিক আছে, বসে থাকো, রুটি বানিয়ে দিচ্ছি।" },
  { speaker: "A", hanzi: "好的，妈妈，你快一点。", pinyin: "Hǎo de, māma, nǐ kuài yì diǎn.", en: "OK mom, hurry up a bit.", bn: "আচ্ছা আম্মু, একটু তাড়াতাড়ি করো।" },
  { speaker: "B", hanzi: "里法特，把手电筒拿过来，停电了。", pinyin: "Lǐfǎtè, bǎ shǒudiàntǒng ná guòlái, tíng diàn le.", en: "Rifat, bring the flashlight over — the power is out.", bn: "রিফাত, টর্চটা নিয়ে আয়, লাইট গেছে।" },
  { speaker: "A", hanzi: "妈妈，手电筒没电了。", pinyin: "Māma, shǒudiàntǒng méi diàn le.", en: "Mom, the flashlight has no charge.", bn: "আম্মু, টর্চে চার্জ নেই।" },
  { speaker: "B", hanzi: "好，把我的手机拿过来。", pinyin: "Hǎo, bǎ wǒ de shǒujī ná guòlái.", en: "OK, bring my phone over.", bn: "ঠিক আছে, আমার ফোনটা নিয়ে আয়।" },
  { speaker: "A", hanzi: "妈妈，你的手机放在哪里？", pinyin: "Māma, nǐ de shǒujī fàng zài nǎlǐ?", en: "Mom, where did you put your phone?", bn: "আম্মু, তোমার ফোনটা কোথায় রেখেছো?" },
  { speaker: "B", hanzi: "放在我房间的桌子上。", pinyin: "Fàng zài wǒ fángjiān de zhuōzi shàng.", en: "On the table in my room.", bn: "আমার রুমের টেবিলে রেখেছি।" },
];

const L8: L[] = [
  { speaker: "A", hanzi: "苏蒙，起床，早上十点了。今天我们去公园玩。", pinyin: "Sūméng, qǐchuáng, zǎoshang shí diǎn le. Jīntiān wǒmen qù gōngyuán wán.", en: "Sumon, get up — it's ten in the morning. Today we're going to the park.", bn: "সুমন, ওঠো, সকাল ১০টা বাজে। আজ পার্কে খেলতে যাবো।" },
  { speaker: "B", hanzi: "好，妈妈，公园的门票一个人多少钱？", pinyin: "Hǎo, māma, gōngyuán de ménpiào yí ge rén duōshao qián?", en: "OK mom, how much is one park ticket?", bn: "ঠিক আছে আম্মু, পার্কের টিকিট মাথাপিছু কত?" },
  { speaker: "A", hanzi: "不贵，一个人只要八十块钱。", pinyin: "Bú guì, yí ge rén zhǐ yào bāshí kuài qián.", en: "Not expensive — only eighty for one person.", bn: "বেশি না, মাথাপিছু মাত্র ৮০ টাকা।" },
  { speaker: "B", hanzi: "妈妈，那里有各种各样的食物吗？", pinyin: "Māma, nàlǐ yǒu gèzhǒng gèyàng de shíwù ma?", en: "Mom, are there all kinds of food there?", bn: "আম্মু, ওখানে নানা রকম খাবার আছে?" },
  { speaker: "A", hanzi: "嗯，什么吃的都有。", pinyin: "Èn, shénme chī de dōu yǒu.", en: "Yes, there's every kind of food.", bn: "হ্যাঁ, সব ধরনের খাবার আছে।" },
  { speaker: "B", hanzi: "妈妈，你以前去过那里吗？", pinyin: "Māma, nǐ yǐqián qù guo nàlǐ ma?", en: "Mom, have you been there before?", bn: "আম্মু, আগে ওখানে গেছিলে?" },
  { speaker: "A", hanzi: "嗯，去过，六七个月前去过。", pinyin: "Èn, qù guo, liù qī ge yuè qián qù guo.", en: "Yes, I went — six or seven months ago.", bn: "হ্যাঁ, গেছিলাম, ৬-৭ মাস আগে গেছিলাম।" },
];

const L9: L[] = [
  { speaker: "A", hanzi: "萨吉布，你今天为什么没去学校？", pinyin: "Sàjíbù, nǐ jīntiān wèishénme méi qù xuéxiào?", en: "Sajib, why didn't you go to school today?", bn: "সজিব, আজ স্কুলে যাওনি কেন?" },
  { speaker: "B", hanzi: "哥哥，我的学校今天放假。", pinyin: "Gēge, wǒ de xuéxiào jīntiān fàngjià.", en: "Brother, my school is closed today.", bn: "ভাইয়া, আজ আমাদের স্কুল ছুটি।" },
  { speaker: "A", hanzi: "你的学校一周放几天假？", pinyin: "Nǐ de xuéxiào yì zhōu fàng jǐ tiān jià?", en: "How many days off does your school give in a week?", bn: "তোমার স্কুল সপ্তাহে কয়দিন ছুটি দেয়?" },
  { speaker: "B", hanzi: "一天，星期五。", pinyin: "Yì tiān, xīngqīwǔ.", en: "One day — Friday.", bn: "একদিন — শুক্রবার।" },
  { speaker: "A", hanzi: "你们班有多少学生？", pinyin: "Nǐmen bān yǒu duōshao xuéshēng?", en: "How many students are in your class?", bn: "তোমাদের ক্লাসে কয়জন ছাত্রছাত্রী?" },
  { speaker: "B", hanzi: "大概五十个人。", pinyin: "Dàgài wǔshí ge rén.", en: "About fifty.", bn: "প্রায় ৫০ জন।" },
  { speaker: "A", hanzi: "你的学号是多少？", pinyin: "Nǐ de xuéhào shì duōshao?", en: "What's your roll number?", bn: "তোমার রোল নম্বর কত?" },
  { speaker: "B", hanzi: "我的学号是四号。", pinyin: "Wǒ de xuéhào shì sì hào.", en: "My roll number is four.", bn: "আমার রোল ৪।" },
  { speaker: "A", hanzi: "你们学校每周考试吗？", pinyin: "Nǐmen xuéxiào měi zhōu kǎoshì ma?", en: "Does your school test every week?", bn: "তোমাদের স্কুলে প্রতি সপ্তাহে পরীক্ষা হয়?" },
  { speaker: "B", hanzi: "嗯，会考试。", pinyin: "Èn, huì kǎoshì.", en: "Yes, we do.", bn: "হ্যাঁ, হয়।" },
  { speaker: "A", hanzi: "你带午饭去学校吗？", pinyin: "Nǐ dài wǔfàn qù xuéxiào ma?", en: "Do you take lunch to school?", bn: "তুমি কি দুপুরের খাবার নিয়ে স্কুলে যাও?" },
  { speaker: "B", hanzi: "不，我回家吃，学校给我们三十分钟的时间。", pinyin: "Bù, wǒ huí jiā chī, xuéxiào gěi wǒmen sānshí fēnzhōng de shíjiān.", en: "No, I go home to eat — school gives us thirty minutes.", bn: "না, বাসায় গিয়ে খাই, স্কুল আমাদের ৩০ মিনিট সময় দেয়।" },
];

const L10: L[] = [
  { speaker: "A", hanzi: "朱耶尔，这栋漂亮的房子是谁的？", pinyin: "Zhūyē'ěr, zhè dòng piàoliang de fángzi shì shéi de?", en: "Juyel, whose beautiful house is this?", bn: "জুয়েল, এই সুন্দর বাড়িটা কার?" },
  { speaker: "B", hanzi: "这栋房子是我舅舅的儿子的。", pinyin: "Zhè dòng fángzi shì wǒ jiùjiu de érzi de.", en: "This house belongs to my uncle's son.", bn: "এই বাড়িটা আমার মামার ছেলের।" },
  { speaker: "A", hanzi: "哦，这么漂亮的房子是谁建的？他住在国外吗？", pinyin: "Ó, zhème piàoliang de fángzi shì shéi jiàn de? Tā zhù zài guówài ma?", en: "Oh, who built such a beautiful house? Does he live abroad?", bn: "ও, এত সুন্দর বাড়ি কে বানিয়েছে? সে কি বিদেশে থাকে?" },
  { speaker: "B", hanzi: "嗯，他住在欧洲，在那里做翻译工作。", pinyin: "Èn, tā zhù zài Ōuzhōu, zài nàlǐ zuò fānyì gōngzuò.", en: "Yes, he lives in Europe and works there as a translator.", bn: "হ্যাঁ, সে ইউরোপে থাকে, ওখানে দুভাষীর কাজ করে।" },
  { speaker: "A", hanzi: "他的爸爸妈妈做什么？", pinyin: "Tā de bàba māma zuò shénme?", en: "What do his parents do?", bn: "তার আব্বু-আম্মু কী করেন?" },
  { speaker: "B", hanzi: "他的爸爸已经去世了，他妈妈还能自己走路。", pinyin: "Tā de bàba yǐjīng qùshì le, tā māma hái néng zìjǐ zǒulù.", en: "His father has passed away; his mother can still walk on her own.", bn: "তার আব্বু মারা গেছেন, আম্মু এখনো নিজে হাঁটতে পারেন।" },
];

const L11: L[] = [
  { speaker: "A", hanzi: "朱耶尔哥，你们那边有手机店吗？", pinyin: "Zhūyē'ěr gē, nǐmen nàbiān yǒu shǒujī diàn ma?", en: "Brother Juyel, is there a phone shop in your area?", bn: "জুয়েল ভাইয়া, তোমাদের ওখানে কি মোবাইলের দোকান আছে?" },
  { speaker: "B", hanzi: "嗯，有，不过离我家大概一公里，那里有很多好手机。", pinyin: "Èn, yǒu, búguò lí wǒ jiā dàgài yì gōnglǐ, nàlǐ yǒu hěn duō hǎo shǒujī.", en: "Yes, there is — but it's about a kilometre from my home. There are many good phones there.", bn: "হ্যাঁ, আছে, তবে আমার বাসা থেকে প্রায় ১ কিলোমিটার দূরে। ওখানে অনেক ভালো ফোন আছে।" },
  { speaker: "A", hanzi: "朱耶尔哥，你认识那家店里的人吗？", pinyin: "Zhūyē'ěr gē, nǐ rènshi nà jiā diàn lǐ de rén ma?", en: "Brother Juyel, do you know anyone in that shop?", bn: "জুয়েল ভাইয়া, ওই দোকানের লোকদের কি চেনো?" },
  { speaker: "B", hanzi: "嗯，认识，我跟那家店的老板很熟。", pinyin: "Èn, rènshi, wǒ gēn nà jiā diàn de lǎobǎn hěn shú.", en: "Yes, I do — I'm very close with that shop's owner.", bn: "হ্যাঁ, চেনি, ওই দোকানের মালিকের সাথে আমার বহু চেনা।" },
];

const L12: L[] = [
  { speaker: "A", hanzi: "朱耶尔哥，你在哪里？", pinyin: "Zhūyē'ěr gē, nǐ zài nǎlǐ?", en: "Brother Juyel, where are you?", bn: "জুয়েল ভাইয়া, তুমি কোথায়?" },
  { speaker: "B", hanzi: "我在加济布尔的贾伊德布尔火车站。", pinyin: "Wǒ zài Jiājìbù'ěr de Jiǎyīdébù'ěr huǒchēzhàn.", en: "I'm at Joydebpur railway station in Gazipur.", bn: "আমি গাজীপুরের জয়দেবপুর রেলস্টেশনে আছি।" },
  { speaker: "A", hanzi: "怎么了？你要坐火车去哪里？", pinyin: "Zěnme le? Nǐ yào zuò huǒchē qù nǎlǐ?", en: "What's the matter? Where are you taking the train to?", bn: "কী হলো? ট্রেনে কোথায় যাচ্ছো?" },
  { speaker: "B", hanzi: "嗯，我要去，我从这里去锡尔赫特。", pinyin: "Èn, wǒ yào qù, wǒ cóng zhèlǐ qù Xī'ěrhètè.", en: "Yes, I'm going — I'm heading to Sylhet from here.", bn: "হ্যাঁ, যাচ্ছি, এখান থেকে সিলেট যাচ্ছি।" },
  { speaker: "A", hanzi: "哦，那你什么时候回来？", pinyin: "Ó, nà nǐ shénme shíhou huílái?", en: "Oh, then when will you be back?", bn: "ও, তাহলে কখন ফিরবে?" },
  { speaker: "B", hanzi: "我去办点事，办完以后很快就回来。", pinyin: "Wǒ qù bàn diǎn shì, bàn wán yǐhòu hěn kuài jiù huílái.", en: "I'm going to get some work done — I'll be back soon after.", bn: "একটু কাজ মেটাতে যাচ্ছি, শেষ হলেই দ্রুত ফিরে আসব।" },
];

const L13: L[] = [
  { speaker: "A", hanzi: "哥，你是不是刚来我们公司？", pinyin: "Gē, nǐ shì bu shì gāng lái wǒmen gōngsī?", en: "Brother, did you just join our company?", bn: "ভাইয়া, তুমি কি এইমাত্র আমাদের কোম্পানিতে এসেছো?" },
  { speaker: "B", hanzi: "嗯，哥，我是新来的，今天早上刚入职。", pinyin: "Èn, gē, wǒ shì xīn lái de, jīntiān zǎoshang gāng rùzhí.", en: "Yes, brother, I'm new — I just started this morning.", bn: "হ্যাঁ, ভাইয়া, আমি নতুন, আজ সকালেই জয়েন করেছি।" },
  { speaker: "A", hanzi: "哥，那我在这里做什么工作？你能告诉我一下吗？", pinyin: "Gē, nà wǒ zài zhèlǐ zuò shénme gōngzuò? Nǐ néng gàosu wǒ yíxià ma?", en: "Brother, then what work will I do here? Could you tell me?", bn: "ভাইয়া, তাহলে আমি এখানে কী কাজ করব? একটু বলবে?" },
  { speaker: "B", hanzi: "你的工作是操作这里的三台大机器中的一台。会给你安排两个员工，你带着他们一起操作机器。", pinyin: "Nǐ de gōngzuò shì cāozòng zhèlǐ de sān tái dà jīqì zhōng de yí tái. Huì gěi nǐ ānpái liǎng ge yuángōng, nǐ dàizhe tāmen yìqǐ cāozòng jīqì.", en: "Your job is to run one of the three big machines here. You'll be given two workers, and you'll run the machine together with them.", bn: "তোমার কাজ এখানকার তিনটা বড় মেশিনের একটা চালানো। তোমাকে দুজন কর্মী দেওয়া হবে, তুমি ওদের নিয়ে মেশিন চালাবে।" },
  { speaker: "A", hanzi: "我明白了，哥。", pinyin: "Wǒ míngbai le, gē.", en: "I understand, brother.", bn: "বুঝেছি, ভাইয়া।" },
  { speaker: "B", hanzi: "哥，请问洗手间在哪边？", pinyin: "Gē, qǐngwèn xǐshǒujiān zài nǎbian?", en: "Brother, excuse me — where's the washroom?", bn: "ভাইয়া, জিজ্ঞেস করলাম — ওয়াশরুম কোন দিকে?" },
  { speaker: "A", hanzi: "你往前走，然后往右边走一点，就在那里。", pinyin: "Nǐ wǎng qián zǒu, ránhòu wǎng yòubiān zǒu yì diǎn, jiù zài nàlǐ.", en: "Go straight ahead, then a little to the right — it's there.", bn: "সামনে এগোও, তারপর একটু ডানে যাও — ওখানেই।" },
];

const L14: L[] = [
  { speaker: "A", hanzi: "朱耶尔哥，来，我们去买菜吧？", pinyin: "Zhūyē'ěr gē, lái, wǒmen qù mǎi cài ba?", en: "Brother Juyel, come — let's go buy vegetables?", bn: "জুয়েল ভাইয়া, আয় — তরকারি কিনতে যাই?" },
  { speaker: "B", hanzi: "怎么了，哥？你要买菜吗？", pinyin: "Zěnme le, gē? Nǐ yào mǎi cài ma?", en: "What's the matter, brother? Do you need vegetables?", bn: "কী হলো, ভাইয়া? তরকারি কিনতে হবে?" },
  { speaker: "A", hanzi: "嗯，哥，要买一些东西。", pinyin: "Èn, gē, yào mǎi yìxiē dōngxi.", en: "Yes, brother — need to buy a few things.", bn: "হ্যাঁ, ভাইয়া, কিছু জিনিস কিনতে হবে।" },
  { speaker: "B", hanzi: "好，来，我们两个一起去，我也要买一些东西。", pinyin: "Hǎo, lái, wǒmen liǎng ge yìqǐ qù, wǒ yě yào mǎi yìxiē dōngxi.", en: "OK, come — let's the two of us go together. I need to buy some things too.", bn: "ঠিক আছে, আয় — আমরা দুজন একসাথে যাই, আমাকেও কিছু কিনতে হবে।" },
  { speaker: "A", hanzi: "老板，土豆多少钱？菜豆多少钱？木瓜多少钱？", pinyin: "Lǎobǎn, tǔdòu duōshao qián? Càidòu duōshao qián? Mùguā duōshao qián?", en: "Boss, how much are potatoes? Beans? Papaya?", bn: "ভাইয়া, আলু কত? শিম কত? পেঁপে কত?" },
  { speaker: "B", hanzi: "哥，土豆一公斤五十块，木瓜三十块，菜豆四十块。你要哪一种？", pinyin: "Gē, tǔdòu yì gōngjīn wǔshí kuài, mùguā sānshí kuài, càidòu sìshí kuài. Nǐ yào nǎ yì zhǒng?", en: "Brother, potatoes are fifty a kilo, papaya thirty, beans forty. Which one do you want?", bn: "ভাইয়া, আলু কেজিতে ৫০ টাকা, পেঁপে ৩০ টাকা, শিম ৪০ টাকা। কোনটা নেবে?" },
  { speaker: "A", hanzi: "哥，给我一公斤土豆，再给我一些菜豆。", pinyin: "Gē, gěi wǒ yì gōngjīn tǔdòu, zài gěi wǒ yìxiē càidòu.", en: "Brother, give me a kilo of potatoes, and some beans too.", bn: "ভাইয়া, এক কেজি আলু দাও, আর একটু শিম দাও।" },
  { speaker: "B", hanzi: "朱耶尔哥，你什么都不买，只是跟着我来吗？", pinyin: "Zhūyē'ěr gē, nǐ shénme dōu bú mǎi, zhǐshì gēnzhe wǒ lái ma?", en: "Brother Juyel, aren't you buying anything — just following me around?", bn: "জুয়েল ভাইয়া, কিছুই তো কিনছো না, শুধু আমার পেছনে পেছনে আসছো?" },
  { speaker: "A", hanzi: "嗯，哥，我要买水果，其他的我不要。", pinyin: "Èn, gē, wǒ yào mǎi shuǐguǒ, qítā de wǒ bú yào.", en: "Right, brother — I want fruit, I don't need anything else.", bn: "হ্যাঁ, ভাইয়া, আমি ফল কিনতে চাই, বাকিটা লাগবে না।" },
  { speaker: "B", hanzi: "哦，那我们去水果店吧！", pinyin: "Ó, nà wǒmen qù shuǐguǒ diàn ba!", en: "Oh, then let's go to the fruit shop!", bn: "ও, তাহলে ফলের দোকানে যাই!" },
  { speaker: "A", hanzi: "老板，橙子多少钱一公斤？", pinyin: "Lǎobǎn, chéngzi duōshao qián yì gōngjīn?", en: "Boss, how much are oranges per kilo?", bn: "ভাইয়া, কমলা কেজি কত?" },
  { speaker: "B", hanzi: "哥，四百五十块一公斤。", pinyin: "Gē, sìbǎi wǔshí kuài yì gōngjīn.", en: "Brother, four hundred and fifty a kilo.", bn: "ভাইয়া, কেজি ৪৫০ টাকা।" },
  { speaker: "A", hanzi: "那葡萄多少钱？", pinyin: "Nà pútáo duōshao qián?", en: "And how much are grapes?", bn: "তাহলে আঙুর কত?" },
  { speaker: "B", hanzi: "哥，要的话五百五十块一公斤。", pinyin: "Gē, yào de huà wǔbǎi wǔshí kuài yì gōngjīn.", en: "Brother, if you want them, five hundred and fifty a kilo.", bn: "ভাইয়া, নিলে কেজি ৫৫০ টাকা।" },
  { speaker: "A", hanzi: "好的，给我一公斤葡萄。", pinyin: "Hǎo de, gěi wǒ yì gōngjīn pútáo.", en: "OK, give me a kilo of grapes.", bn: "আচ্ছা, এক কেজি আঙুর দাও।" },
];

const L15: L[] = [
  { speaker: "A", hanzi: "妈妈，奶奶好像病得很严重，可能要送她去医院。", pinyin: "Māma, nǎinai hǎoxiàng bìng de hěn yánzhòng, kěnéng yào sòng tā qù yīyuàn.", en: "Mom, Grandma seems very seriously ill — we may have to take her to hospital.", bn: "আম্মু, ঠাকুরমা মনে হচ্ছে খুব অসুস্থ, হয়তো হাসপাতালে নিতে হবে।" },
  { speaker: "B", hanzi: "好，你给爸爸打电话，让他回来看看怎么办。", pinyin: "Hǎo, nǐ gěi bàba dǎ diànhuà, ràng tā huílái kàn kàn zěnme bàn.", en: "OK, call your dad and tell him to come home and see what to do.", bn: "ঠিক আছে, আব্বাকে ফোন করো, ফিরে এসে দেখুক কী করব।" },
  { speaker: "A", hanzi: "喂？爸爸，奶奶病得很严重，你快点回家。", pinyin: "Wéi? Bàba, nǎinai bìng de hěn yánzhòng, nǐ kuài diǎn huí jiā.", en: "Hello? Dad, Grandma is very ill — come home quickly.", bn: "হ্যালো? আব্বা, ঠাকুরমা খুব অসুস্থ, দ্রুত বাসায় আয়।" },
  { speaker: "B", hanzi: "妈妈，医院现在还开门吗？", pinyin: "Māma, yīyuàn xiànzài hái kāimén ma?", en: "Mom, is the hospital still open now?", bn: "আম্মু, হাসপাতাল এখনো কি খোলা?" },
  { speaker: "A", hanzi: "嗯，这家医院二十四小时都开门，没问题。", pinyin: "Èn, zhè jiā yīyuàn èrshísì xiǎoshí dōu kāimén, méi wèntí.", en: "Yes, this hospital is open twenty-four hours — no problem.", bn: "হ্যাঁ, এই হাসপাতাল ২৪ ঘণ্টা খোলা থাকে, কোনো সমস্যা নেই।" },
  { speaker: "B", hanzi: "这家医院好吗？", pinyin: "Zhè jiā yīyuàn hǎo ma?", en: "Is this hospital good?", bn: "এই হাসপাতালটা কি ভালো?" },
  { speaker: "A", hanzi: "嗯，是一家非常好的医院。", pinyin: "Èn, shì yì jiā fēicháng hǎo de yīyuàn.", en: "Yes, it's a very good hospital.", bn: "হ্যাঁ, একটা খুব ভালো হাসপাতাল।" },
  { speaker: "B", hanzi: "去了医院，今天应该要留在那里吧？", pinyin: "Qù le yīyuàn, jīntiān yīnggāi yào liú zài nàlǐ ba?", en: "Once we're at the hospital, she'll probably have to stay there today, right?", bn: "হাসপাতালে গেলে, আজ ওখানেই থাকতে হবে তো?" },
  { speaker: "A", hanzi: "嗯，要留，不过不用大家都留下来，留两个人左右就可以了。", pinyin: "Èn, yào liú, búguò búyòng dàjiā dōu liú xiàlái, liú liǎng ge rén zuǒyòu jiù kěyǐ le.", en: "Yes, she'll have to stay — but everyone doesn't need to. Two people or so is enough.", bn: "হ্যাঁ, থাকতে হবে, তবে সবাই না — প্রায় দুজন থাকলেই হবে।" },
  { speaker: "B", hanzi: "妈妈，这家医院有多大？", pinyin: "Māma, zhè jiā yīyuàn yǒu duō dà?", en: "Mom, how big is this hospital?", bn: "আম্মু, এই হাসপাতালটা কত বড়?" },
  { speaker: "A", hanzi: "很大，你去了就知道了。", pinyin: "Hěn dà, nǐ qù le jiù zhīdào le.", en: "Very big — you'll know once you go.", bn: "খুব বড়, গেলেই বুঝবে।" },
  { speaker: "B", hanzi: "好，等爸爸回来以后我们再去。", pinyin: "Hǎo, děng bàba huílái yǐhòu wǒmen zài qù.", en: "OK, we'll go after Dad gets back.", bn: "ঠিক আছে, আব্বা ফিরে এলে গিয়ে যাব।" },
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
