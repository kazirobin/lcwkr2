/**
 * Curated Android apps for Chinese learners, grouped by the skill they help
 * with. Rendered by `app/apps/page.tsx` as hairline-separated sections in the
 * sumi-e register.
 */

export type AppCategory =
  | "Pinyin"
  | "Dictionary"
  | "Vocabulary"
  | "HSK"
  | "Writing"
  | "Language Exchange"
  | "Social"
  | "Communication";

export interface SuggestedApp {
  name: string;
  category: AppCategory;
  /** Google Play Store listing. */
  url: string;
}

/** One Hanzi + bilingual label per category — reads as the section's idea. */
export const categoryMeta: Record<
  AppCategory,
  { seal: string; bn: string; en: string }
> = {
  Pinyin: { seal: "拼", bn: "পিনয়িন", en: "Pinyin" },
  Dictionary: { seal: "典", bn: "অভিধান", en: "Dictionary" },
  Vocabulary: { seal: "词", bn: "শব্দভাণ্ডার", en: "Vocabulary" },
  HSK: { seal: "考", bn: "এইচএসকে", en: "HSK" },
  Writing: { seal: "写", bn: "লেখা", en: "Writing" },
  "Language Exchange": { seal: "换", bn: "ভাষা বিনিময়", en: "Language exchange" },
  Social: { seal: "友", bn: "সোশ্যাল", en: "Social" },
  Communication: { seal: "讯", bn: "যোগাযোগ", en: "Communication" },
};

/** Section order on the page. */
export const categoryOrder: AppCategory[] = [
  "Pinyin",
  "Dictionary",
  "Vocabulary",
  "HSK",
  "Writing",
  "Language Exchange",
  "Social",
  "Communication",
];

export const suggestedApps: SuggestedApp[] = [
  {
    name: "Pinyin Academy",
    category: "Pinyin",
    url: "https://play.google.com/store/apps/details?id=pest.games.ChinesePinYin",
  },
  {
    name: "Chinese Pinyin",
    category: "Pinyin",
    url: "https://play.google.com/store/apps/details?id=com.xixiantian.chinesepinyin",
  },
  {
    name: "Pinyin Helper",
    category: "Pinyin",
    url: "https://play.google.com/store/apps/details?id=com.patgdut.pinyinhelper",
  },
  {
    name: "ChinesePinyin",
    category: "Pinyin",
    url: "https://play.google.com/store/apps/details?id=com.aobocorp.chinesepinyin",
  },
  {
    name: "Chinese Pinyin Learning Machine",
    category: "Pinyin",
    url: "https://play.google.com/store/apps/details?id=uni.UNI40BB307",
  },
  {
    name: "Chinese Guru",
    category: "Vocabulary",
    url: "https://play.google.com/store/apps/details?id=com.xamisoft.chineseexpert",
  },
  {
    name: "Hanping Chinese Dictionary",
    category: "Dictionary",
    url: "https://play.google.com/store/apps/details?id=com.embermitre.hanping.app.pro",
  },
  {
    name: "Pleco Chinese Dictionary",
    category: "Dictionary",
    url: "https://play.google.com/store/apps/details?id=com.pleco.chinesesystem",
  },
  {
    name: "HelloTalk",
    category: "Language Exchange",
    url: "https://play.google.com/store/apps/details?id=com.hellotalk",
  },
  {
    name: "Rednote",
    category: "Social",
    url: "https://play.google.com/store/apps/details?id=com.xingin.xhs",
  },
  {
    name: "WeChat",
    category: "Communication",
    url: "https://play.google.com/store/apps/details?id=com.tencent.mm",
  },
  {
    name: "Chinesimple HSK 1",
    category: "HSK",
    url: "https://play.google.com/store/apps/details?id=es.hskfree.ap",
  },
  {
    name: "Chinesimple HSK 2",
    category: "HSK",
    url: "https://play.google.com/store/apps/details?id=es.aroundpixels.hsk2lite",
  },
  {
    name: "Chinesimple HSK 3",
    category: "HSK",
    url: "https://play.google.com/store/apps/details?id=es.aroundpixels.hsk3lite",
  },
  {
    name: "Chinesimple HSK 4",
    category: "HSK",
    url: "https://play.google.com/store/apps/details?id=es.aroundpixels.hsk4lite",
  },
  {
    name: "Chinesimple HSK 5",
    category: "HSK",
    url: "https://play.google.com/store/apps/details?id=es.aroundpixels.hsk5lite",
  },
  {
    name: "Chinesimple HSK 6",
    category: "HSK",
    url: "https://play.google.com/store/apps/details?id=es.aroundpixels.hsk6",
  },
  {
    name: "KaoHan",
    category: "HSK",
    url: "https://play.google.com/store/apps/details?id=com.kaokao.kaohan_learnchinesehsk",
  },
  {
    name: "Chinese Writer",
    category: "Writing",
    url: "https://play.google.com/store/apps/details?id=com.molatra.chinesewriterlite",
  },
  {
    name: "Skritter",
    category: "Writing",
    url: "https://play.google.com/store/apps/details?id=com.inkren.skritter.chinese",
  },
  {
    name: "Chinese Strokes Order",
    category: "Writing",
    url: "https://play.google.com/store/apps/details?id=com.patgdut.chinesestrokesorder",
  },
  {
    name: "Chinese Stroke Dictionary",
    category: "Writing",
    url: "https://play.google.com/store/apps/details?id=com.ansami.hkchinesechar",
  },
  {
    name: "Hanzi Stroke",
    category: "Writing",
    url: "https://play.google.com/store/apps/details?id=com.sparkinc.hanzi_stroke",
  },
];
