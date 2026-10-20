// Topic-wise vocabulary and sentences for Bangla → Chinese translation

import type { Topic, TranslateWord, TranslateSentence } from "../types";

const commonWords: TranslateWord[] = [
  { hanzi: "你好", pinyin: "nǐ hǎo", meaningEn: "Hello", meaningBn: "হ্যালো / নমস্কার" },
  { hanzi: "谢谢", pinyin: "xiè xie", meaningEn: "Thank you", meaningBn: "ধন্যবাদ" },
  { hanzi: "不客气", pinyin: "bú kè qi", meaningEn: "You're welcome", meaningBn: "স্বাগতম / কোন কথা নেই" },
  { hanzi: "对不起", pinyin: "duì bu qǐ", meaningEn: "Sorry", meaningBn: "দুঃখিত / মাফ করবেন" },
  { hanzi: "没关系", pinyin: "méi guān xi", meaningEn: "It's okay / No problem", meaningBn: "কোন সমস্যা নেই" },
  { hanzi: "是", pinyin: "shì", meaningEn: "Yes / To be", meaningBn: "হ্যাঁ / হওয়া" },
  { hanzi: "不是", pinyin: "bú shì", meaningEn: "No / Not to be", meaningBn: "না / নন" },
  { hanzi: "好", pinyin: "hǎo", meaningEn: "Good / OK", meaningBn: "ভালো / ঠিক আছে" },
  { hanzi: "不好", pinyin: "bú hǎo", meaningEn: "Not good", meaningBn: "খারাপ / ভালো নেই" },
  { hanzi: "我", pinyin: "wǒ", meaningEn: "I / Me", meaningBn: "আমি / আমাকে" },
  { hanzi: "你", pinyin: "nǐ", meaningEn: "You", meaningBn: "তুমি / তোমাকে" },
  { hanzi: "他", pinyin: "tā", meaningEn: "He / Him", meaningBn: "সে / তাকে (পুরুষ)" },
  { hanzi: "她", pinyin: "tā", meaningEn: "She / Her", meaningBn: "সে / তাকে (মহিলা)" },
  { hanzi: "我们", pinyin: "wǒ men", meaningEn: "We / Us", meaningBn: "আমরা / আমাদের" },
  { hanzi: "你们", pinyin: "nǐ men", meaningEn: "You (plural)", meaningBn: "তোমরা / তোমাদের" },
  { hanzi: "他们", pinyin: "tā men", meaningEn: "They / Them", meaningBn: "তারা / তাদের (পুরুষ/মিশ্র)" },
  { hanzi: "她们", pinyin: "tā men", meaningEn: "They / Them (female)", meaningBn: "তারা / তাদের (মহিলা)" },
  { hanzi: "什么", pinyin: "shén me", meaningEn: "What", meaningBn: "কী" },
  { hanzi: "谁", pinyin: "shéi", meaningEn: "Who", meaningBn: "কে" },
  { hanzi: "哪里", pinyin: "nǎ lǐ", meaningEn: "Where", meaningBn: "কোথায়" },
  { hanzi: "为什么", pinyin: "wèi shén me", meaningEn: "Why", meaningBn: "কেন" },
  { hanzi: "怎么", pinyin: "zěn me", meaningEn: "How", meaningBn: "কैसे" },
  { hanzi: "多少", pinyin: "duō shǎo", meaningEn: "How many / How much", meaningBn: "কতটুকু / কতজন" },
];

const greetingSentences: TranslateSentence[] = [
  { chinese: "你好！", pinyin: "Nǐ hǎo!", meaningEn: "Hello!", meaningBn: "হ্যালো / নমস্কার!" },
  { chinese: "早上好！", pinyin: "Zǎo shàng hǎo!", meaningEn: "Good morning!", meaningBn: "শুভ সকাল!" },
  { chinese: "晚上好！", pinyin: "Wǎn shàng hǎo!", meaningEn: "Good evening!", meaningBn: "শুভ সন্ধ্যা!" },
  { chinese: "再见！", pinyin: "Zài jiàn!", meaningEn: "Goodbye!", meaningBn: "বিদায় / আবার দেখা হবে!" },
  { chinese: "晚安！", pinyin: "Wǎn ān!", meaningEn: "Good night!", meaningBn: "শুভ রাত্রি!" },
  { chinese: "请问，你叫什么名字？", pinyin: "Qǐng wèn, nǐ jiào shén me míng zi?", meaningEn: "May I ask, what is your name?", meaningBn: "দয়া করে বলুন, আপনার নাম কী?" },
  { chinese: "我叫...", pinyin: "Wǒ jiào...", meaningEn: "My name is...", meaningBn: "আমার নাম..." },
  { chinese: "很高兴认识你。", pinyin: "Hěn gāo xìng rèn shi nǐ.", meaningEn: "Nice to meet you.", meaningBn: "তোমাকে চিনে ভালো লাগলো।" },
];

const familyWords: TranslateWord[] = [
  { hanzi: "家", pinyin: "jiā", meaningEn: "Family / Home", meaningBn: "পরিবার / বাড়ি" },
  { hanzi: "爸爸", pinyin: "bà ba", meaningEn: "Father / Dad", meaningBn: "বাবা" },
  { hanzi: "妈妈", pinyin: "mā ma", meaningEn: "Mother / Mom", meaningBn: "মা" },
  { hanzi: "哥哥", pinyin: "gē ge", meaningEn: "Older brother", meaningBn: "বড় ভাই" },
  { hanzi: "弟弟", pinyin: "dì di", meaningEn: "Younger brother", meaningBn: "ছোট ভাই" },
  { hanzi: "姐姐", pinyin: "jiě jie", meaningEn: "Older sister", meaningBn: "বড় আপা / বোন" },
  { hanzi: "妹妹", pinyin: "mèi mei", meaningEn: "Younger sister", meaningBn: "ছোট আপা / বোন" },
  { hanzi: "爷爷", pinyin: "yé ye", meaningEn: "Paternal grandfather", meaningBn: "দাদা" },
  { hanzi: "奶奶", pinyin: "nǎi nai", meaningEn: "Paternal grandmother", meaningBn: "দাদী" },
  { hanzi: "外公", pinyin: "wài gōng", meaningEn: "Maternal grandfather", meaningBn: "নানা" },
  { hanzi: "外婆", pinyin: "wài pó", meaningEn: "Maternal grandmother", meaningBn: "নানি" },
];

const familySentences: TranslateSentence[] = [
  { chinese: "这是我的家。", pinyin: "Zhè shì wǒ de jiā.", meaningEn: "This is my family.", meaningBn: "এটি আমার পরিবার।" },
  { chinese: "我爱我的家人。", pinyin: "Wǒ ài wǒ de jiā rén.", meaningEn: "I love my family.", meaningBn: "আমি আমার পরিবারকে ভালোবাসি।" },
  { chinese: "我爸爸是医生。", pinyin: "Wǒ bà ba shì yī shēng.", meaningEn: "My father is a doctor.", meaningBn: "আমার বাবা ডাক্তার।" },
  { chinese: "我妈妈在家。", pinyin: "Wǒ mā ma zài jiā.", meaningEn: "My mother is at home.", meaningBn: "আমার মা বাড়িতে আছেন।" },
  { chinese: "我有一个哥哥和一个妹妹。", pinyin: "Wǒ yǒu yí gè gē ge hé yí gè mèi mei.", meaningEn: "I have an older brother and a younger sister.", meaningBn: "আমার একটি বড় ভাই এবং একটি ছোট বোন আছে।" },
];

const foodWords: TranslateWord[] = [
  { hanzi: "饭", pinyin: "fàn", meaningEn: "Rice / Meal", meaningBn: "ভাত / খাবার" },
  { hanzi: "面条", pinyin: "miàn tiáo", meaningEn: "Noodles", meaningBn: "নুডলস / লচুই" },
  { hanzi: "水饺", pinyin: "shuǐ jiǎo", meaningEn: "Dumplings", meaningBn: "ডামপ্লিং / মুমো" },
  { hanzi: "菜", pinyin: "cài", meaningEn: "Vegetable / Dish", meaningBn: "শাকসবজি / ভাজি" },
  { hanzi: "肉", pinyin: "ròu", meaningEn: "Meat", meaningBn: "মাংস" },
  { hanzi: "鱼", pinyin: "yú", meaningEn: "Fish", meaningBn: "মাছ" },
  { hanzi: "鸡蛋", pinyin: "jī dàn", meaningEn: "Egg", meaningBn: "ডিম" },
  { hanzi: "牛奶", pinyin: "niú nǎi", meaningEn: "Milk", meaningBn: "দুধ" },
  { hanzi: "水", pinyin: "shuǐ", meaningEn: "Water", meaningBn: "পানি" },
  { hanzi: "茶", pinyin: "chá", meaningEn: "Tea", meaningBn: "চা" },
  { hanzi: "咖啡", pinyin: "kā fēi", meaningEn: "Coffee", meaningBn: "কফি" },
  { hanzi: "面包", pinyin: "miàn bāo", meaningEn: "Bread", meaningBn: "রুটি / ব্রেড" },
  { hanzi: "水果", pinyin: "shuǐ guǒ", meaningEn: "Fruit", meaningBn: "ফল" },
  { hanzi: "苹果", pinyin: "píng guǒ", meaningEn: "Apple", meaningBn: "আপেল" },
  { hanzi: "香蕉", pinyin: "xiāng jiāo", meaningEn: "Banana", meaningBn: "কলা" },
];

const foodSentences: TranslateSentence[] = [
  { chinese: "我饿了。", pinyin: "Wǒ è le.", meaningEn: "I am hungry.", meaningBn: "আমি ক্ষুধার্ত।" },
  { chinese: "我想吃饭。", pinyin: "Wǒ xiǎng chī fàn.", meaningEn: "I want to eat.", meaningBn: "আমি খাবার খাব।" },
  { chinese: "这个很好吃。", pinyin: "Zhè ge hěn hǎo chī.", meaningEn: "This is delicious.", meaningBn: "এটি খুব স্বাদিষ্ট।" },
  { chinese: "请给我一杯水。", pinyin: "Qǐng gěi wǒ yì bēi shuǐ.", meaningEn: "Please give me a glass of water.", meaningBn: "দয়া করে আমাকে এক গ্লাস পানি দিন।" },
  { chinese: "我要一杯咖啡。", pinyin: "Wǒ yào yì bēi kā fēi.", meaningEn: "I want a cup of coffee.", meaningBn: "আমি এক কাপ কফি চাই।" },
  { chinese: "早饭吃什么？", pinyin: "Zǎo fàn chī shén me?", meaningEn: "What's for breakfast?", meaningBn: "সকালে কী খাবেন?" },
  { chinese: "我不吃肉。", pinyin: "Wǒ bù chī ròu.", meaningEn: "I don't eat meat.", meaningBn: "আমি মাংস খাই না।" },
];

const travelWords: TranslateWord[] = [
  { hanzi: "去", pinyin: "qù", meaningEn: "To go", meaningBn: "যাওয়া" },
  { hanzi: "来", pinyin: "lái", meaningEn: "To come", meaningBn: "আসা" },
  { hanzi: "飞机", pinyin: "fēi jī", meaningEn: "Airplane", meaningBn: "বিমান" },
  { hanzi: "火车", pinyin: "huǒ chē", meaningEn: "Train", meaningBn: "ট্রেন" },
  { hanzi: "公共汽车", pinyin: "gōng gòng qì chē", meaningEn: "Bus", meaningBn: "বাস" },
  { hanzi: "出租车", pinyin: "chū zū chē", meaningEn: "Taxi", meaningBn: "ট্যাক্সি" },
  { hanzi: "地铁", pinyin: "dì tiě", meaningEn: "Subway / Metro", meaningBn: "মেট্রো / भूमিগত রেল" },
  { hanzi: "车站", pinyin: "chē zhàn", meaningEn: "Station", meaningBn: "স্টেশন" },
  { hanzi: "机场", pinyin: "jī chǎng", meaningEn: "Airport", meaningBn: "বিমানবন্দর" },
  { hanzi: "票", pinyin: "piào", meaningEn: "Ticket", meaningBn: "টিকেট" },
  { hanzi: "护照", pinyin: "hù zhào", meaningEn: "Passport", meaningBn: "পাসপোর্ট" },
  { hanzi: "酒店", pinyin: "jiǔ diàn", meaningEn: "Hotel", meaningBn: "হোটেল" },
  { hanzi: "行李", pinyin: "xíng lǐ", meaningEn: "Luggage", meaningBn: "ব্যাগ / সামান" },
  { hanzi: "地图", pinyin: "dì tú", meaningEn: "Map", meaningBn: "মানচিত্র" },
];

const travelSentences: TranslateSentence[] = [
  { chinese: "我要去北京。", pinyin: "Wǒ yào qù Běi jīng.", meaningEn: "I want to go to Beijing.", meaningBn: "আমি বেইজিং যেতে চাই।" },
  { chinese: "火车站在哪里？", pinyin: "Huǒ chē zhàn zài nǎ lǐ?", meaningEn: "Where is the train station?", meaningBn: "ট্রেন স্টেশন কোথায়?" },
  { chinese: "一张票多少钱？", pinyin: "Yì zhāng piào duō shǎo qián?", meaningEn: "How much is a ticket?", meaningBn: "একটি টিকেট কত টাকা?" },
  { chinese: "我住在酒店。", pinyin: "Wǒ zhù zài jiǔ diàn.", meaningEn: "I stay at a hotel.", meaningBn: "আমি হোটেলে থাকি।" },
  { chinese: "请帮我拿行李。", pinyin: "Qǐng bāng wǒ ná xíng lǐ.", meaningEn: "Please help me with my luggage.", meaningBn: "দয়া করে আমার ব্যাগ তুলতে সাহায্য করুন।" },
];

const shoppingWords: TranslateWord[] = [
  { hanzi: "买", pinyin: "mǎi", meaningEn: "To buy", meaningBn: "কেনা" },
  { hanzi: "卖", pinyin: "mài", meaningEn: "To sell", meaningBn: "বিক্রি করা" },
  { hanzi: "钱", pinyin: "qián", meaningEn: "Money", meaningBn: "টাকা" },
  { hanzi: "贵", pinyin: "guì", meaningEn: "Expensive", meaningBn: "মহँগা" },
  { hanzi: "便宜", pinyin: "pián yi", meaningEn: "Cheap", meaningBn: "সস্তা" },
  { hanzi: "商店", pinyin: "shāng diàn", meaningEn: "Shop / Store", meaningBn: "দোকান" },
  { hanzi: "市场", pinyin: "shì chǎng", meaningEn: "Market", meaningBn: "বাজার" },
  { hanzi: "东西", pinyin: "dōng xi", meaningEn: "Things / Stuff", meaningBn: "জিনিসপত্র" },
  { hanzi: "衣服", pinyin: "yī fu", meaningEn: "Clothes", meaningBn: "কাপড়" },
  { hanzi: "鞋", pinyin: "xié", meaningEn: "Shoes", meaningBn: "জুতা" },
  { hanzi: "大", pinyin: "dà", meaningEn: "Big / Large", meaningBn: "বড়" },
  { hanzi: "小", pinyin: "xiǎo", meaningEn: "Small", meaningBn: "ছোট" },
  { hanzi: "颜色", pinyin: "yán sè", meaningEn: "Color", meaningBn: "রঙ" },
  { hanzi: "红色", pinyin: "hóng sè", meaningEn: "Red", meaningBn: "লাল" },
  { hanzi: "蓝色", pinyin: "lán sè", meaningEn: "Blue", meaningBn: "নীল" },
  { hanzi: "黑色", pinyin: "hēi sè", meaningEn: "Black", meaningBn: "কালো" },
  { hanzi: "白色", pinyin: "bái sè", meaningEn: "White", meaningBn: "সাদা" },
];

const shoppingSentences: TranslateSentence[] = [
  { chinese: "这个多少钱？", pinyin: "Zhè ge duō shǎo qián?", meaningEn: "How much is this?", meaningBn: "এটার দাম কত?" },
  { chinese: "太贵了！", pinyin: "Tài guì le!", meaningEn: "Too expensive!", meaningBn: "খুব মহँগা!" },
  { chinese: "能便宜一点吗？", pinyin: "Néng pián yi yì diǎn ma?", meaningEn: "Can you make it cheaper?", meaningBn: "এটাকে কি একটু কম দামে দিবেন?" },
  { chinese: "我要买这个。", pinyin: "Wǒ yào mǎi zhè ge.", meaningEn: "I want to buy this.", meaningBn: "আমি এটি কিনব।" },
  { chinese: "有别的颜色吗？", pinyin: "Yǒu bié de yán sè ma?", meaningEn: "Do you have other colors?", meaningBn: "অন্য রঙ আছে কি?" },
  { chinese: "我不要这个。", pinyin: "Wǒ bù yào zhè ge.", meaningEn: "I don't want this.", meaningBn: "আমি এটি চাই না।" },
];

const timeWords: TranslateWord[] = [
  { hanzi: "时间", pinyin: "shí jiān", meaningEn: "Time", meaningBn: "সময়" },
  { hanzi: "现在", pinyin: "xiàn zài", meaningEn: "Now", meaningBn: "এখন" },
  { hanzi: "今天", pinyin: "jīn tiān", meaningEn: "Today", meaningBn: "আজ" },
  { hanzi: "明天", pinyin: "míng tiān", meaningEn: "Tomorrow", meaningBn: "আগামীকাল" },
  { hanzi: "昨天", pinyin: "zuó tiān", meaningEn: "Yesterday", meaningBn: "গতকাল" },
  { hanzi: "早上", pinyin: "zǎo shang", meaningEn: "Morning", meaningBn: "সকাল" },
  { hanzi: "中午", pinyin: "zhōng wǔ", meaningEn: "Noon", meaningBn: "দুপুর" },
  { hanzi: "下午", pinyin: "xià wǔ", meaningEn: "Afternoon", meaningBn: "বিকেল" },
  { hanzi: "晚上", pinyin: "wǎn shang", meaningEn: "Evening / Night", meaningBn: "সন্ধ্যা / রাত" },
  { hanzi: "星期", pinyin: "xīng qī", meaningEn: "Week", meaningBn: "সপ্তাহ" },
  { hanzi: "月", pinyin: "yuè", meaningEn: "Month", meaningBn: "মাস" },
  { hanzi: "年", pinyin: "nián", meaningEn: "Year", meaningBn: "বছর" },
  { hanzi: "点", pinyin: "diǎn", meaningEn: "O'clock", meaningBn: "টা (ঘন্টা)" },
  { hanzi: "分", pinyin: "fēn", meaningEn: "Minute", meaningBn: "মিনিট" },
];

const timeSentences: TranslateSentence[] = [
  { chinese: "现在几点？", pinyin: "Xiàn zài jǐ diǎn?", meaningEn: "What time is it now?", meaningBn: "এখন কটা বাজে?" },
  { chinese: "我早上七点起床。", pinyin: "Wǒ zǎo shang qī diǎn qǐ chuáng.", meaningEn: "I wake up at 7 AM.", meaningBn: "আমি সকাল ৭ টায় ঘুম ভাঙি।" },
  { chinese: "明天见。", pinyin: "Míng tiān jiàn.", meaningEn: "See you tomorrow.", meaningBn: "আগামীকাল দেখা হবে।" },
  { chinese: "每天都要学习。", pinyin: "Měi tiān dōu yào xué xí.", meaningEn: "Study every day.", meaningBn: "প্রতিদিন পড়াশোনা করতে হবে।" },
];

const weatherWords: TranslateWord[] = [
  { hanzi: "天气", pinyin: "tiān qì", meaningEn: "Weather", meaningBn: "আবহাওয়া" },
  { hanzi: "晴天", pinyin: "qíng tiān", meaningEn: "Sunny day", meaningBn: "জ্বলদিন / ধূপচাড়া দিন" },
  { hanzi: "下雨", pinyin: "xià yǔ", meaningEn: "Rain / Raining", meaningBn: "বৃষ্টি / বৃষ্টি হচ্ছে" },
  { hanzi: "下雪", pinyin: "xià xuě", meaningEn: "Snow / Snowing", meaningBn: "হিমপাত / তুষারপাত" },
  { hanzi: "云", pinyin: "yún", meaningEn: "Cloud", meaningBn: "মেঘ" },
  { hanzi: "风", pinyin: "fēng", meaningEn: "Wind", meaningBn: "বাতাস" },
  { hanzi: "热", pinyin: "rè", meaningEn: "Hot", meaningBn: "গরম" },
  { hanzi: "冷", pinyin: "lěng", meaningEn: "Cold", meaningBn: "ঠান্ডা" },
];

const weatherSentences: TranslateSentence[] = [
  { chinese: "今天天气很好。", pinyin: "Jīn tiān tiān qì hěn hǎo.", meaningEn: "The weather is nice today.", meaningBn: "আজ আবহাওয়া খুব ভালো।" },
  { chinese: "明天会下雨吗？", pinyin: "Míng tiān huì xià yǔ ma?", meaningEn: "Will it rain tomorrow?", meaningBn: "আগামীকাল কি বৃষ্টি হবে?" },
  { chinese: "今天很热。", pinyin: "Jīn tiān hěn rè.", meaningEn: "It's very hot today.", meaningBn: "আজ খুব গরম।" },
  { chinese: "外面在下雪。", pinyin: "Wài miàn zài xià xuě.", meaningEn: "It's snowing outside.", meaningBn: "বাইরে তুষার পড়ছে।" },
];

const studyWords: TranslateWord[] = [
  { hanzi: "学习", pinyin: "xué xí", meaningEn: "To study / Learn", meaningBn: "পড়াশোনা করা / শিখা" },
  { hanzi: "学校", pinyin: "xué xiào", meaningEn: "School", meaningBn: "স্কুল" },
  { hanzi: "大学", pinyin: "dà xué", meaningEn: "University", meaningBn: "বিশ্ববিদ্যালয়" },
  { hanzi: "老师", pinyin: "lǎo shī", meaningEn: "Teacher", meaningBn: "শিক্ষক" },
  { hanzi: "学生", pinyin: "xué sheng", meaningEn: "Student", meaningBn: "ছাত্র / ছাত্রী" },
  { hanzi: "书", pinyin: "shū", meaningEn: "Book", meaningBn: "বই" },
  { hanzi: "笔", pinyin: "bǐ", meaningEn: "Pen", meaningBn: "কলম" },
  { hanzi: "纸", pinyin: "zhǐ", meaningEn: "Paper", meaningBn: "কাগজ" },
  { hanzi: "汉语", pinyin: "hàn yǔ", meaningEn: "Chinese language", meaningBn: "চীনা ভাষা" },
  { hanzi: "英语", pinyin: "yīng yǔ", meaningEn: "English language", meaningBn: "ইংরেজি ভাষা" },
  { hanzi: "课", pinyin: "kè", meaningEn: "Class / Lesson", meaningBn: "শ্রেণি / পাঠ" },
  { hanzi: "作业", pinyin: "zuò yè", meaningEn: "Homework", meaningBn: "গৃহকাজ / হোমওয়ার্ক" },
  { hanzi: "考试", pinyin: "kǎo shì", meaningEn: "Exam / Test", meaningBn: "পরীক্ষা" },
];

const studySentences: TranslateSentence[] = [
  { chinese: "我在学习汉语。", pinyin: "Wǒ zài xué xí hàn yǔ.", meaningEn: "I am studying Chinese.", meaningBn: "আমি চীনা ভাষা শিখছি।" },
  { chinese: "我是学生。", pinyin: "Wǒ shì xué sheng.", meaningEn: "I am a student.", meaningBn: "আমি একজন ছাত্র।" },
  { chinese: "老师在教书。", pinyin: "Lǎo shī zài jiāo shū.", meaningEn: "The teacher is teaching.", meaningBn: "শিক্ষক পড়াচ্ছেন।" },
  { chinese: "我要去上课。", pinyin: "Wǒ yào qù shàng kè.", meaningEn: "I have to go to class.", meaningBn: "আমি ক্লাস করতে যাব।" },
  { chinese: "作业做完了吗？", pinyin: "Zuò yè zuò wán le ma?", meaningEn: "Have you finished your homework?", meaningBn: "হোমওয়ার্ক শেষ হয়েছে কি?" },
];

const workWords: TranslateWord[] = [
  { hanzi: "工作", pinyin: "gōng zuò", meaningEn: "Work / Job", meaningBn: "কাজ / চাকরি" },
  { hanzi: "上班", pinyin: "shàng bān", meaningEn: "Go to work / Start work", meaningBn: "কাজে যাওয়া / ডিউটি শুরু" },
  { hanzi: "下班", pinyin: "xià bān", meaningEn: "Get off work / End work", meaningBn: "কাজ শেষ / ডিউটি শেষ" },
  { hanzi: "公司", pinyin: "gōng sī", meaningEn: "Company", meaningBn: "কোম্পানি" },
  { hanzi: "老板", pinyin: "lǎo bǎn", meaningEn: "Boss", meaningBn: "বস / মালিক" },
  { hanzi: "同事", pinyin: "tóng shì", meaningEn: "Colleague", meaningBn: "সহকর্মী" },
  { hanzi: "会议", pinyin: "huì yì", meaningEn: "Meeting", meaningBn: "সবা / মিটিং" },
  { hanzi: "电脑", pinyin: "diàn nǎo", meaningEn: "Computer", meaningBn: "কম্পিউটার" },
  { hanzi: "电话", pinyin: "diàn huà", meaningEn: "Phone / Telephone", meaningBn: "টেলিফোন / ফোন" },
  { hanzi: "邮件", pinyin: "yóu jiàn", meaningEn: "Email", meaningBn: "ইমেইল" },
];

const workSentences: TranslateSentence[] = [
  { chinese: "我在工作。", pinyin: "Wǒ zài gōng zuò.", meaningEn: "I am working.", meaningBn: "আমি কাজ করছি।" },
  { chinese: "我每天朝九晚五上班。", pinyin: "Wǒ měi tiān zhāo jiǔ wǎn wǔ shàng bān.", meaningEn: "I work 9 to 5 every day.", meaningBn: "আমি প্রতিদিন সকাল ৯ থেকে বিকেল ৫ পর্যন্ত কাজ করি।" },
  { chinese: "开会了。", pinyin: "Kāi huì le.", meaningEn: "Meeting time.", meaningBn: "সবা করার সময়।" },
  { chinese: "下班了，回家吧。", pinyin: "Xià bān le, huí jiā ba.", meaningEn: "Work's over, let's go home.", meaningBn: "কাজ শেষ, বাড়ি যাই।" },
];

const numberWords: TranslateWord[] = [
  { hanzi: "零", pinyin: "líng", meaningEn: "Zero", meaningBn: "শূন্য" },
  { hanzi: "一", pinyin: "yī", meaningEn: "One", meaningBn: "এক" },
  { hanzi: "二", pinyin: "èr", meaningEn: "Two", meaningBn: "দুই" },
  { hanzi: "三", pinyin: "sān", meaningEn: "Three", meaningBn: "তিন" },
  { hanzi: "四", pinyin: "sì", meaningEn: "Four", meaningBn: "চার" },
  { hanzi: "五", pinyin: "wǔ", meaningEn: "Five", meaningBn: "পাঁচ" },
  { hanzi: "六", pinyin: "liù", meaningEn: "Six", meaningBn: "ছয়" },
  { hanzi: "七", pinyin: "qī", meaningEn: "Seven", meaningBn: "সাত" },
  { hanzi: "八", pinyin: "bā", meaningEn: "Eight", meaningBn: "আট" },
  { hanzi: "九", pinyin: "jiǔ", meaningEn: "Nine", meaningBn: "নয়" },
  { hanzi: "十", pinyin: "shí", meaningEn: "Ten", meaningBn: "দশ" },
  { hanzi: "百", pinyin: "bǎi", meaningEn: "Hundred", meaningBn: "শত" },
  { hanzi: "千", pinyin: "qiān", meaningEn: "Thousand", meaningBn: "হাজার" },
  { hanzi: "万", pinyin: "wàn", meaningEn: "Ten thousand", meaningBn: "দশ হাজার" },
];

export const TOPICS: Topic[] = [
  {
    id: "common",
    nameEn: "Common Phrases",
    nameBn: "সাধারণ বাক্যাংশ",
    icon: "💬",
    words: commonWords,
    sentences: greetingSentences,
  },
  {
    id: "greetings",
    nameEn: "Greetings",
    nameBn: "অভিবাদন",
    icon: "👋",
    words: commonWords.slice(0, 10),
    sentences: greetingSentences,
  },
  {
    id: "family",
    nameEn: "Family",
    nameBn: "পরিবার",
    icon: "👨‍👩‍👧‍👦",
    words: familyWords,
    sentences: familySentences,
  },
  {
    id: "food",
    nameEn: "Food & Drink",
    nameBn: "খাবার ও পানীয়",
    icon: "🍜",
    words: foodWords,
    sentences: foodSentences,
  },
  {
    id: "travel",
    nameEn: "Travel",
    nameBn: "ভ্রমণ",
    icon: "✈️",
    words: travelWords,
    sentences: travelSentences,
  },
  {
    id: "shopping",
    nameEn: "Shopping",
    nameBn: "কেনাকাটা",
    icon: "🛍️",
    words: shoppingWords,
    sentences: shoppingSentences,
  },
  {
    id: "time",
    nameEn: "Time & Dates",
    nameBn: "সময় ও তারিখ",
    icon: "🕐",
    words: timeWords,
    sentences: timeSentences,
  },
  {
    id: "weather",
    nameEn: "Weather",
    nameBn: "আবহাওয়া",
    icon: "☀️",
    words: weatherWords,
    sentences: weatherSentences,
  },
  {
    id: "study",
    nameEn: "Study",
    nameBn: "পড়াশোনা",
    icon: "📚",
    words: studyWords,
    sentences: studySentences,
  },
  {
    id: "work",
    nameEn: "Work",
    nameBn: "কাজ / চাকরি",
    icon: "💼",
    words: workWords,
    sentences: workSentences,
  },
  {
    id: "numbers",
    nameEn: "Numbers",
    nameBn: "সংখ্যা",
    icon: "🔢",
    words: numberWords,
    sentences: [],
  },
];

export function findTopicById(id: string): Topic | undefined {
  return TOPICS.find((t) => t.id === id);
}

export function searchTopics(query: string): Topic[] {
  const lowerQuery = query.toLowerCase();
  return TOPICS.filter(
    (topic) =>
      topic.nameEn.toLowerCase().includes(lowerQuery) ||
      topic.nameBn.includes(query) ||
      topic.words.some(
        (w) =>
          w.meaningEn.toLowerCase().includes(lowerQuery) ||
          w.meaningBn.includes(query) ||
          w.hanzi.includes(query) ||
          w.pinyin.toLowerCase().includes(lowerQuery)
      ) ||
      topic.sentences.some(
        (s) =>
          s.meaningEn.toLowerCase().includes(lowerQuery) ||
          s.meaningBn.includes(query) ||
          s.chinese.includes(query) ||
          s.pinyin.toLowerCase().includes(lowerQuery)
      )
  );
}

export function getAllWords(): TranslateWord[] {
  const words: TranslateWord[] = [];
  const seen = new Set<string>();
  for (const topic of TOPICS) {
    for (const w of topic.words) {
      const key = w.hanzi + w.pinyin;
      if (!seen.has(key)) {
        seen.add(key);
        words.push(w);
      }
    }
  }
  return words;
}

export function getAllSentences(): TranslateSentence[] {
  const sentences: TranslateSentence[] = [];
  const seen = new Set<string>();
  for (const topic of TOPICS) {
    for (const s of topic.sentences) {
      const key = s.chinese;
      if (!seen.has(key)) {
        seen.add(key);
        sentences.push(s);
      }
    }
  }
  return sentences;
}

export function translateBanglaToChinese(query: string): {
  words: TranslateWord[];
  sentences: TranslateSentence[];
} {
  const lowerQuery = query.toLowerCase().trim();
  if (!lowerQuery) return { words: [], sentences: [] };

  const allWords = getAllWords();
  const allSentences = getAllSentences();

  const matchedWords = allWords.filter(
    (w) =>
      w.meaningBn.includes(query) ||
      w.meaningEn.toLowerCase().includes(lowerQuery) ||
      w.hanzi.includes(query) ||
      w.pinyin.toLowerCase().includes(lowerQuery)
  );

  const matchedSentences = allSentences.filter(
    (s) =>
      s.meaningBn.includes(query) ||
      s.meaningEn.toLowerCase().includes(lowerQuery) ||
      s.chinese.includes(query) ||
      s.pinyin.toLowerCase().includes(lowerQuery)
  );

  return { words: matchedWords, sentences: matchedSentences };
}