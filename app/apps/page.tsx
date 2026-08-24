// src/components/apps/SuggestedAppsPage.tsx
"use client";

import Link from "next/link";
import {
  Smartphone,
  BookOpen,
  Languages,
  Pencil,
  Download,
  ExternalLink,
  Sparkles,
  Layers,
  Search,
  Headphones,
  MessageSquare,
  PenTool,
  Award,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

const apps = [
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
    name: "Chinese Pinyin Keyboard",
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
    url: "https://play.google.com/store/apps/details?id=com.embermitre.hanping.app.pro",
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

// Category icons mapping
const categoryIcons: Record<string, React.ReactNode> = {
  Dictionary: <BookOpen className="w-5 h-5" />,
  "Language Exchange": <MessageSquare className="w-5 h-5" />,
  Social: <Smartphone className="w-5 h-5" />,
  Communication: <MessageSquare className="w-5 h-5" />,
  Pinyin: <Headphones className="w-5 h-5" />,
  HSK: <Award className="w-5 h-5" />,
  Vocabulary: <BookOpen className="w-5 h-5" />,
  Writing: <PenTool className="w-5 h-5" />,
};

// Category colors - deeper colors for light mode
const categoryColors: Record<string, string> = {
  Dictionary:
    "bg-blue-100 text-blue-700 dark:bg-blue-500/20 dark:text-blue-400",
  "Language Exchange":
    "bg-green-100 text-green-700 dark:bg-green-500/20 dark:text-green-400",
  Social: "bg-pink-100 text-pink-700 dark:bg-pink-500/20 dark:text-pink-400",
  Communication:
    "bg-cyan-100 text-cyan-700 dark:bg-cyan-500/20 dark:text-cyan-400",
  Pinyin:
    "bg-purple-100 text-purple-700 dark:bg-purple-500/20 dark:text-purple-400",
  HSK: "bg-orange-100 text-orange-700 dark:bg-orange-500/20 dark:text-orange-400",
  Vocabulary:
    "bg-emerald-100 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-400",
  Writing: "bg-rose-100 text-rose-700 dark:bg-rose-500/20 dark:text-rose-400",
};

// Category labels in Bengali
const categoryLabels: Record<string, { bn: string; en: string }> = {
  Dictionary: { bn: "অভিধান", en: "Dictionary" },
  "Language Exchange": { bn: "ভাষা বিনিময়", en: "Language Exchange" },
  Social: { bn: "সামাজিক", en: "Social" },
  Communication: { bn: "যোগাযোগ", en: "Communication" },
  Pinyin: { bn: "পিনয়িন", en: "Pinyin" },
  HSK: { bn: "এইচএসকে", en: "HSK" },
  Vocabulary: { bn: "শব্দভাণ্ডার", en: "Vocabulary" },
  Writing: { bn: "লেখা", en: "Writing" },
};

// ============================================
// HOOKS
// ============================================

const useTranslation = () => {
  const { language } = useLanguage();
  return (bn: string, en: string) => (language === "bn" ? bn : en);
};

// ============================================
// COMPONENTS
// ============================================

interface AppCardProps {
  name: string;
  category: string;
  url: string;
}

const AppCard: React.FC<AppCardProps> = ({ name, category, url }) => {
  const t = useTranslation();

  const icon = categoryIcons[category] || <Smartphone className="w-5 h-5" />;
  const colorClass =
    categoryColors[category] ||
    "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
  const categoryLabel = categoryLabels[category] || {
    bn: category,
    en: category,
  };

  return (
    <div className="group rounded-xl border border-secondary bg-background p-5 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start gap-3 mb-4">
        <div
          className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-lg ${colorClass}`}
        >
          {icon}
        </div>
        <div className="min-w-0 flex-1">
          <h3 className="font-semibold text-text text-sm leading-tight line-clamp-2">
            {name}
          </h3>
          <span
            className={`inline-block mt-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium ${colorClass}`}
          >
            {t(categoryLabel.bn, categoryLabel.en)}
          </span>
        </div>
      </div>

      <Link
        href={url}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-background transition-all hover:bg-primary/80 hover:shadow-md active:scale-95"
      >
        <Download className="h-4 w-4" />
        {t("ইন্সটল করুন", "Install")}
        <ExternalLink className="h-3.5 w-3.5 opacity-70" />
      </Link>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function SuggestedAppsPage() {
  const t = useTranslation();

  // Group apps by category
  const categories = [...new Set(apps.map((app) => app.category))];

  // Count apps per category
  const categoryCount = categories.reduce(
    (acc, cat) => {
      acc[cat] = apps.filter((app) => app.category === cat).length;
      return acc;
    },
    {} as Record<string, number>,
  );

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Hero Banner */}
      <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-background rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute bottom-0 -right-4 w-72 h-72 bg-background/50 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium text-background">
              {t("সাজেস্টেড অ্যাপস", "Suggested Apps")}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-background tracking-tight">
            📱 {t("চাইনিজ শেখার অ্যাপস", "Chinese Learning Apps")}
          </h1>

          <p className="mt-3 text-background/80 text-base sm:text-lg max-w-2xl mx-auto">
            {t(
              "এই অ্যাপগুলো ব্যবহার করে আপনার চাইনিজ শোনা, বলা, পড়া, লেখা ও এইচএসকে প্রস্তুতি উন্নত করুন",
              "Improve your Chinese listening, speaking, reading, writing & HSK preparation",
            )}
          </p>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: apps.length, label: t("মোট অ্যাপ", "Total Apps") },
            { value: categories.length, label: t("ক্যাটেগরি", "Categories") },
            { value: "4.5+", label: t("গড় রেটিং", "Avg Rating") },
            { value: "100%", label: t("ফ্রি", "Free") },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-secondary bg-background p-4 text-center shadow-sm"
            >
              <div className="text-2xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-xs text-text/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* Category Filter */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="flex flex-wrap items-center gap-2">
          <div className="flex items-center gap-2 text-sm text-text/60">
            <Layers className="h-4 w-4" />
            <span>{t("ক্যাটেগরি", "Categories")}:</span>
          </div>
          {categories.map((category) => {
            const colorClass =
              categoryColors[category] ||
              "bg-gray-100 text-gray-700 dark:bg-gray-500/20 dark:text-gray-400";
            const label = categoryLabels[category] || {
              bn: category,
              en: category,
            };
            return (
              <span
                key={category}
                className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium ${colorClass}`}
              >
                {categoryIcons[category]}
                {t(label.bn, label.en)}
                <span className="opacity-50">({categoryCount[category]})</span>
              </span>
            );
          })}
        </div>
      </div>

      {/* Apps Grid */}
      <section className="max-w-7xl mx-auto px-4 pb-12 sm:pb-16">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {apps.map((app, index) => (
            <AppCard key={index} {...app} />
          ))}
        </div>
      </section>
    </div>
  );
}
