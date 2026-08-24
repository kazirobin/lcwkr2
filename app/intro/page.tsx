// src/components/intro/IntroPage.tsx
"use client";

import { useLanguage } from "../../context/LanguageContext";
import {
  Sparkles,
  BookOpen,
  Clock,
  Users,
  Globe,
  Target,
  Quote,
  MapPin,
  Lightbulb,
  ChevronRight,
} from "lucide-react";

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
  en: {
    hero: {
      badge: "Introduction to Chinese",
      title: "Discover the World of Chinese Language",
      subtitle:
        "Explore the rich history, culture, and global significance of the Chinese language",
      cta: "Start Learning",
    },
    whatIsChinese: {
      title: "What is Chinese?",
      description:
        "Chinese is a group of related languages spoken by over 1.3 billion people worldwide. It's one of the oldest continuously used writing systems in the world.",
      features: ["Tonal Language", "Logographic Script", "Rich History"],
    },
    history: {
      title: "History & Evolution",
      description:
        "Chinese has evolved over thousands of years, from oracle bone script to modern simplified characters, reflecting the rich cultural heritage of China.",
      features: [
        "5000+ Years Old",
        "Oracle Bone Script",
        "Simplified & Traditional",
      ],
    },
    speakers: {
      title: "Global Speakers",
      description:
        "With over 1.3 billion native speakers, Chinese is the most spoken language in the world and an official UN language.",
      features: ["1.3B+ Speakers", "UN Official Language", "Global Influence"],
    },
    varieties: {
      title: "Varieties of Chinese",
      description:
        "Chinese has many dialects including Mandarin, Cantonese, Shanghainese, and more, each with unique characteristics and cultural significance.",
      features: [
        "8 Major Dialects",
        "Mutual Intelligibility",
        "Cultural Diversity",
      ],
    },
    whyLearn: {
      title: "Why Learn Chinese?",
      description:
        "Learning Chinese opens doors to career opportunities, cultural understanding, and personal growth in our interconnected world.",
      benefits: [
        "Career Opportunities",
        "Cultural Exchange",
        "Personal Growth",
      ],
    },
    quote: {
      text: "Learning Chinese is not just about memorizing characters, it's about understanding a rich culture and a unique way of thinking.",
      author: "Chinese Proverb",
    },
    chineseWorld: {
      title: "Chinese Around the World",
      description:
        "Chinese communities thrive globally, making it one of the most influential languages in international business, culture, and diplomacy.",
    },
    didYouKnow: {
      title: "Did You Know?",
      facts: [
        "Chinese has over 50,000 characters",
        "Mandarin has 4 tones + neutral tone",
        "Chinese is 5000+ years old",
        "Most spoken language globally",
      ],
    },
  },
  bn: {
    hero: {
      badge: "চাইনিজ ভাষার পরিচয়",
      title: "চাইনিজ ভাষার বিশ্ব আবিষ্কার করুন",
      subtitle:
        "চাইনিজ ভাষার সমৃদ্ধ ইতিহাস, সংস্কৃতি এবং বিশ্বব্যাপী গুরুত্ব অন্বেষণ করুন",
      cta: "শেখা শুরু করুন",
    },
    whatIsChinese: {
      title: "চাইনিজ কী?",
      description:
        "চাইনিজ হল সম্পর্কিত ভাষার একটি গোষ্ঠী যা বিশ্বব্যাপী ১.৩ বিলিয়নেরও বেশি মানুষ কথা বলে। এটি বিশ্বের সবচেয়ে পুরনো অবিচ্ছিন্নভাবে ব্যবহৃত লিখন পদ্ধতিগুলির মধ্যে একটি।",
      features: ["স্বরধ্বনি ভাষা", "চিত্রলিপি লিপি", "সমৃদ্ধ ইতিহাস"],
    },
    history: {
      title: "ইতিহাস ও বিবর্তন",
      description:
        "চাইনিজ ভাষা হাজার হাজার বছর ধরে বিবর্তিত হয়েছে, অরাকল হাড়ের লিপি থেকে আধুনিক সরলীকৃত অক্ষর পর্যন্ত, যা চীনের সমৃদ্ধ সাংস্কৃতিক ঐতিহ্যকে প্রতিফলিত করে।",
      features: ["৫০০০+ বছর পুরনো", "অরাকল হাড়ের লিপি", "সরলীকৃত ও প্রথাগত"],
    },
    speakers: {
      title: "বিশ্বব্যাপী ভাষাভাষী",
      description:
        "১.৩ বিলিয়নের বেশি স্থানীয় ভাষাভাষী সহ, চাইনিজ বিশ্বের সবচেয়ে বেশি কথ্য ভাষা এবং জাতিসংঘের একটি সরকারি ভাষা।",
      features: ["১.৩বি+ ভাষাভাষী", "জাতিসংঘের ভাষা", "বিশ্বব্যাপী প্রভাব"],
    },
    varieties: {
      title: "চাইনিজের বিভিন্নতা",
      description:
        "চাইনিজের অনেক উপভাষা রয়েছে যেমন ম্যান্ডারিন, ক্যান্টোনিজ, সাংহাইনিজ এবং আরও অনেক, প্রতিটির নিজস্ব বৈশিষ্ট্য এবং সাংস্কৃতিক গুরুত্ব রয়েছে।",
      features: [
        "৮টি প্রধান উপভাষা",
        "পারস্পরিক বোধগম্যতা",
        "সাংস্কৃতিক বৈচিত্র্য",
      ],
    },
    whyLearn: {
      title: "কেন চাইনিজ শিখবেন?",
      description:
        "চাইনিজ শেখা আমাদের আন্তঃসংযুক্ত বিশ্বে কর্মজীবনের সুযোগ, সাংস্কৃতিক বোধগম্যতা এবং ব্যক্তিগত বৃদ্ধির দরজা খুলে দেয়।",
      benefits: ["কর্মজীবনের সুযোগ", "সাংস্কৃতিক বিনিময়", "ব্যক্তিগত বৃদ্ধি"],
    },
    quote: {
      text: "চাইনিজ শেখা শুধু অক্ষর মুখস্থ করা নয়, এটি একটি সমৃদ্ধ সংস্কৃতি এবং চিন্তার একটি অনন্য উপায় বোঝার বিষয়।",
      author: "চাইনিজ প্রবাদ",
    },
    chineseWorld: {
      title: "বিশ্বজুড়ে চাইনিজ",
      description:
        "চাইনিজ সম্প্রদায় বিশ্বব্যাপী সমৃদ্ধ, যা আন্তর্জাতিক ব্যবসা, সংস্কৃতি এবং কূটনীতিতে সবচেয়ে প্রভাবশালী ভাষাগুলির মধ্যে একটি করে তুলেছে।",
    },
    didYouKnow: {
      title: "আপনি কি জানেন?",
      facts: [
        "চাইনিজে ৫০,০০০+ অক্ষর রয়েছে",
        "ম্যান্ডারিনে ৪টি স্বর + নিরপেক্ষ স্বর রয়েছে",
        "চাইনিজ ৫০০০+ বছর পুরনো",
        "বিশ্বে সর্বাধিক কথ্য ভাষা",
      ],
    },
  },
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

interface FeatureCardProps {
  icon: any;
  title: string;
  description: string;
  features: string[];
  color?: string;
}

const FeatureCard: React.FC<FeatureCardProps> = ({
  icon: Icon,
  title,
  description,
  features,
}) => {
  return (
    <div className="group rounded-xl border border-secondary bg-background p-6 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary dark:bg-primary/20">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-text">{title}</h3>
      </div>
      <p className="mb-4 text-sm text-text/70">{description}</p>
      <div className="flex flex-wrap gap-2">
        {features.map((feature, idx) => (
          <span
            key={idx}
            className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20"
          >
            {feature}
          </span>
        ))}
      </div>
    </div>
  );
};

interface QuoteCardProps {
  text: string;
  author: string;
}

const QuoteCard: React.FC<QuoteCardProps> = ({ text, author }) => {
  return (
    <div className="group rounded-xl border border-secondary bg-background p-6 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary dark:bg-primary/20">
          <Quote className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-text">Quote</h3>
      </div>
      <blockquote className="mb-3 text-base italic text-text/80">
        "{text}"
      </blockquote>
      <p className="text-sm font-medium text-text/60">— {author}</p>
    </div>
  );
};

interface InfoCardProps {
  icon: any;
  title: string;
  description: string;
}

const InfoCard: React.FC<InfoCardProps> = ({
  icon: Icon,
  title,
  description,
}) => {
  return (
    <div className="group rounded-xl border border-secondary bg-background p-6 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
      <div className="mb-4 flex items-center gap-3">
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary dark:bg-primary/20">
          <Icon className="h-5 w-5" />
        </div>
        <h3 className="text-lg font-bold text-text">{title}</h3>
      </div>
      <p className="text-sm text-text/70">{description}</p>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function IntroPage() {
  const t = useTranslation();
  const lang = translations[useLanguage().language as "en" | "bn"];

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Hero Section */}
      <section className="relative overflow-hidden bg-primary py-16 sm:py-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 h-72 w-72 rounded-full bg-background mix-blend-multiply blur-xl animate-pulse" />
          <div className="absolute bottom-0 -right-4 h-72 w-72 rounded-full bg-background/50 mix-blend-multiply blur-xl animate-pulse delay-1000" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/20 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium text-background">
              {lang.hero.badge}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-background sm:text-4xl md:text-5xl">
            {lang.hero.title}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base text-background/80 sm:text-lg">
            {lang.hero.subtitle}
          </p>

          <button className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background px-6 py-3 font-medium text-primary transition-all hover:shadow-lg hover:scale-105">
            {lang.hero.cta}
            <ChevronRight className="h-4 w-4" />
          </button>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        {/* Featured Cards */}
        <section className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <FeatureCard
            icon={BookOpen}
            title={lang.whatIsChinese.title}
            description={lang.whatIsChinese.description}
            features={lang.whatIsChinese.features}
          />
          <FeatureCard
            icon={Clock}
            title={lang.history.title}
            description={lang.history.description}
            features={lang.history.features}
          />
          <FeatureCard
            icon={Users}
            title={lang.speakers.title}
            description={lang.speakers.description}
            features={lang.speakers.features}
          />
          <FeatureCard
            icon={Globe}
            title={lang.varieties.title}
            description={lang.varieties.description}
            features={lang.varieties.features}
          />
        </section>

        {/* Why Learn & Quote */}
        <section className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
          <FeatureCard
            icon={Target}
            title={lang.whyLearn.title}
            description={lang.whyLearn.description}
            features={lang.whyLearn.benefits}
          />
          <QuoteCard text={lang.quote.text} author={lang.quote.author} />
        </section>

        {/* Chinese World */}
        <section className="mt-6">
          <InfoCard
            icon={MapPin}
            title={lang.chineseWorld.title}
            description={lang.chineseWorld.description}
          />
        </section>

        {/* Did You Know */}
        <section className="mt-6">
          <div className="group rounded-xl border border-secondary bg-background p-6 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
            <div className="mb-4 flex items-center gap-3">
              <div className="rounded-lg bg-primary/10 p-2.5 text-primary dark:bg-primary/20">
                <Lightbulb className="h-5 w-5" />
              </div>
              <h3 className="text-lg font-bold text-text">
                {lang.didYouKnow.title}
              </h3>
            </div>
            <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
              {lang.didYouKnow.facts.map((fact, idx) => (
                <div
                  key={idx}
                  className="flex items-center gap-2 rounded-lg bg-secondary/20 p-3 text-sm text-text/80"
                >
                  <span className="text-primary">✦</span>
                  {fact}
                </div>
              ))}
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}
