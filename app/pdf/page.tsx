// src/components/hsk/PDF.tsx
"use client";

import { useState, useMemo } from "react";
import {
  BookOpen,
  Headphones,
  FileText,
  ClipboardList,
  Download,
  Sparkles,
  Layers,
  CheckCircle,
  ExternalLink,
  FolderOpen,
  ChevronRight,
} from "lucide-react";
import { useLanguage } from "../../context/LanguageContext";

// ============================================
// TYPES & DATA
// ============================================

export interface HSKLevel {
  id: string;
  level: string;
  title: string;
  description: string;
  icon: string;
  resources: {
    all: boolean;
    books: boolean;
    audio: boolean;
    mockTest: boolean;
    vocabulary: boolean;
  };
  driveLinks?: {
    all?: string;
    books?: string;
    audio?: string;
    mockTest?: string;
    vocabulary?: string;
  };
}

export interface ResourceItem {
  id: string;
  title: string;
  description: string;
  icon: string;
  link: string;
}

export const hskLevels: HSKLevel[] = [
  {
    id: "hsk-1",
    level: "HSK Level 1",
    title: "Beginner",
    description: "Start your Chinese journey with basic vocabulary.",
    icon: "🌱",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/1cuhnbILUvxFKlMCmkgRaDP0SiLpiCbgM?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/1GFvFiWDtFa5blOe26a-kKOwCACGY_eCK?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/1X8bv142wtkENNHZWd30c5t1Dvrl6NeQU?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1s7SXAqakvPpEKHnZP3-TC9F4NTjR10vu?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1k6gwM5t4PwwW7Cc-mlHfC6oCt0oXqlQt/view?usp=drive_link",
    },
  },
  {
    id: "hsk-2",
    level: "HSK Level 2",
    title: "Elementary",
    description: "Build foundation with everyday conversations.",
    icon: "📘",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/1kvKuD1100jX2Wgbljuwr443v3LrXOvs_?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/1uyTpWA-cpmc0oMv7mmdDd-Xy1yjoHBOa?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/1F-hJc2XVYcp6diXP7tuQnf4uFfPBNMH9?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1W78AO00XWiwslWvOZHHK-fu_dtqMGA26?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1GVndWJG1bY9M_mqh1XhkQqGXijnxO2YO/view?usp=drive_link",
    },
  },
  {
    id: "hsk-3",
    level: "HSK Level 3",
    title: "Pre-Intermediate",
    description: "Communicate confidently in daily situations.",
    icon: "📗",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/1WoJPqChhwMwVJ1C3KAyp3CyVzGKVmbws?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/1_OXK_Iuee5iuryPMDR76Ea8hiOHVux25?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/1Sp9QQtlfdEc37uSgVTQYyhS8cQ7dBoGu?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1sUz0twM8nkmP3z6ENb0K8Pt_l2-85KlJ?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1TCFTv128jQMbGI9NZUNUD1sJXWUX9ibv/view?usp=drive_link",
    },
  },
  {
    id: "hsk-4",
    level: "HSK Level 4",
    title: "Intermediate",
    description: "Express complex ideas and understand native content.",
    icon: "📕",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/1R80teEvyvy3upZ9hJtHMro5S1BfOVQsG?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/1J3Dr7JFql5IKQxcBMeSu2YmizQ8HVihg?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/17thaoXjYhT-SCuuaLN-WUqLWVgrO2jjV?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1uqPrzOaGjo0jeJghSD1BOH0ZGNENB9mv?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1Q8uDOg2i88CQoQWq-wcvPB-Eyor2gjb9/view?usp=drive_link",
    },
  },
  {
    id: "hsk-5",
    level: "HSK Level 5",
    title: "Advanced",
    description: "Master advanced vocabulary and complex reading.",
    icon: "📙",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/1_kgn35rulKQkLoTqshyK4f1fa2t0ydM4?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/16FImlIM8fd_Cx76xxQGVqyCMhEGpUAEk?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/1qKG7mGdM-CKdSMxKGwWpS3GEiAFvhb_p?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1uoLtBYNROdAcmJzSIfho-0B2a7EV7Nm1?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1M3VYLjf7sEolzoIaNjbhXOotl3Dmb2bC/view?usp=drive_link",
    },
  },
  {
    id: "hsk-6",
    level: "HSK Level 6",
    title: "Proficient",
    description: "Achieve professional-level Chinese fluency.",
    icon: "📚",
    resources: {
      all: true,
      books: true,
      audio: true,
      mockTest: true,
      vocabulary: true,
    },
    driveLinks: {
      all: "https://drive.google.com/drive/folders/13pW9pOFAFkSe-NXbvP611RjW8F16tbYo?usp=drive_link",
      books:
        "https://drive.google.com/drive/folders/18sx8UmwzK93fZea7l28wI_PJFRFaNaEr?usp=drive_link",
      audio:
        "https://drive.google.com/drive/folders/1zUQ45S_XeUHWUVglTrzR5B9rxksAeiaQ?usp=drive_link",
      mockTest:
        "https://drive.google.com/drive/folders/1hWlp_SAcMyNPr2zDT5KVbg9YFxay_fHE?usp=drive_link",
      vocabulary:
        "https://drive.google.com/file/d/1LziYNVQzFa7YQMUqEP_7-XW2j9gZ8HZl/view?usp=drive_link",
    },
  },
];

export const allResources: ResourceItem[] = [
  {
    id: "all-books",
    title: "All Resources",
    description: "Complete collection",
    icon: "📖",
    link: "https://drive.google.com/drive/folders/13EV97xZHlKU-uUeHElDnHuBu5sCIJj0m?usp=drive_link",
  },
];

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

interface ResourceLinkProps {
  label: string;
  icon: React.ElementType;
  link?: string;
  available: boolean;
  description?: string;
}

const ResourceLink: React.FC<ResourceLinkProps> = ({
  label,
  icon: Icon,
  link,
  available,
  description,
}) => {
  if (!available || !link) return null;

  return (
    <a
      href={link}
      target="_blank"
      rel="noopener noreferrer"
      className="group flex items-center justify-between rounded-lg border border-secondary bg-background p-3 transition-all hover:border-primary hover:bg-primary/5 hover:shadow-sm"
    >
      <div className="flex items-center gap-3 min-w-0">
        <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-primary/10 text-primary transition-colors group-hover:bg-primary/20">
          <Icon className="h-4 w-4" />
        </div>
        <div className="min-w-0">
          <div className="flex items-center gap-2 font-bold">
            <span className="text-sm font-medium text-text">{label}</span>
            <span className="inline-flex items-center gap-0.5 text-primary">
              <ExternalLink className="h-2.5 w-2.5" />
              <span>Click Drive Link</span>
            </span>
          </div>
          {description && (
            <p className="text-xs text-text/40 truncate">{description}</p>
          )}
        </div>
      </div>
      <ChevronRight className="h-4 w-4 text-text/20 transition-all group-hover:translate-x-0.5 group-hover:text-primary" />
    </a>
  );
};

interface HSKLevelCardProps {
  level: HSKLevel;
}

const HSKLevelCard: React.FC<HSKLevelCardProps> = ({ level }) => {
  const t = useTranslation();

  const resourceDescriptions: Record<string, string> = {
    books: t("পিডিএফ টেক্সটবুক ও ওয়ার্কবুক", "PDF textbooks & workbooks"),
    audio: t("এমপি৩ অডিও ফাইল", "MP3 listening files"),
    mockTest: t("প্র্যাকটিস পরীক্ষার পেপার", "Practice exam papers"),
    vocabulary: t("শব্দ তালিকা ও ফ্ল্যাশকার্ড", "Word lists & flashcards"),
  };

  return (
    <div className="group rounded-xl border border-secondary bg-background p-5 transition-all hover:border-primary hover:shadow-md">
      {/* Header */}
      <div className="flex items-center gap-3 mb-3">
        <span className="text-2xl">{level.icon}</span>
        <div>
          <h3 className="font-semibold text-text">{level.title}</h3>
          <span className="text-xs text-text/40">{level.level}</span>
        </div>
      </div>

      <p className="text-sm text-text/60 mb-4">{level.description}</p>

      {/* Resources */}
      <div className="space-y-2 mb-4">
        <ResourceLink
          label={t("PDF বই", "PDF Books")}
          icon={BookOpen}
          link={level.driveLinks?.books}
          available={level.resources.books}
          description={resourceDescriptions.books}
        />
        <ResourceLink
          label={t("অডিও", "Audio")}
          icon={Headphones}
          link={level.driveLinks?.audio}
          available={level.resources.audio}
          description={resourceDescriptions.audio}
        />
        <ResourceLink
          label={t("মক টেস্ট", "Mock Tests")}
          icon={ClipboardList}
          link={level.driveLinks?.mockTest}
          available={level.resources.mockTest}
          description={resourceDescriptions.mockTest}
        />
        <ResourceLink
          label={t("ভোকাবুলারি", "Vocabulary")}
          icon={FileText}
          link={level.driveLinks?.vocabulary}
          available={level.resources.vocabulary}
          description={resourceDescriptions.vocabulary}
        />
      </div>

      {/* Download Button */}
      <a
        href={level.driveLinks?.all}
        target="_blank"
        rel="noopener noreferrer"
        className="flex w-full items-center justify-center gap-2 rounded-lg bg-primary px-4 py-2.5 text-sm font-medium text-background transition-all hover:opacity-90 hover:shadow-md"
      >
        <Download className="h-4 w-4" />
        {t("সব ম্যাটেরিয়াল ডাউনলোড করুন", "Download All Materials")}
        <span className="text-[10px] opacity-70">(Google Drive)</span>
      </a>
    </div>
  );
};

interface AllResourcesCardProps {
  resource: ResourceItem;
}

const AllResourcesCard: React.FC<AllResourcesCardProps> = ({ resource }) => {
  const t = useTranslation();

  return (
    <a
      href={resource.link}
      target="_blank"
      rel="noopener noreferrer"
      className="group rounded-xl border border-secondary bg-background p-6 text-center transition-all hover:border-primary hover:shadow-md"
    >
      <div className="text-4xl mb-2">{resource.icon}</div>
      <h3 className="font-semibold text-text">{resource.title}</h3>
      <p className="text-sm text-text/50 mt-0.5">{resource.description}</p>
      <div className="mt-3 text-sm font-medium text-primary opacity-0 group-hover:opacity-100 transition-opacity">
        {t("এখনই অ্যাক্সেস করুন", "Access Now")} →
      </div>
    </a>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function PDF() {
  const [selectedLevel, setSelectedLevel] = useState<string | null>(null);
  const t = useTranslation();

  const filteredLevels = useMemo(
    () =>
      selectedLevel
        ? hskLevels.filter((level) => level.id === selectedLevel)
        : hskLevels,
    [selectedLevel],
  );

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Single Banner - Solid Color */}
      <section className="relative -mt-16 overflow-hidden bg-primary pt-28 pb-16 sm:-mt-20 sm:pt-32 sm:pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 w-72 h-72 bg-background rounded-full mix-blend-multiply filter blur-xl animate-pulse" />
          <div className="absolute bottom-0 -right-4 w-72 h-72 bg-background/50 rounded-full mix-blend-multiply filter blur-xl animate-pulse delay-1000" />
        </div>

        <div className="relative max-w-4xl mx-auto px-4 text-center">
          <div className="inline-flex items-center gap-2 bg-background/20 backdrop-blur-sm px-4 py-1.5 rounded-full mb-4">
            <Sparkles className="w-4 h-4" />
            <span className="text-sm font-medium text-background">
              HSK {t("রিসোর্স হাব", "Resource Hub")}
            </span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-extrabold text-background tracking-tight">
            {t("HSK বই ও স্টাডি ম্যাটেরিয়াল", "HSK Books & Materials")}
          </h1>

          <p className="mt-3 text-background/80 text-base sm:text-lg max-w-2xl mx-auto">
            {t(
              "সকল লেভেলের PDF, অডিও, টেস্ট ও ভোকাবুলারি",
              "All levels PDF, Audio, Tests & Vocabulary",
            )}
          </p>

          {/* Level Filter */}
          <div className="mt-6 flex flex-wrap justify-center gap-2">
            <button
              onClick={() => setSelectedLevel(null)}
              className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                !selectedLevel
                  ? "bg-background text-primary shadow-lg"
                  : "bg-background/20 text-background hover:bg-background/30"
              }`}
            >
              {t("সব", "All")}
            </button>
            {hskLevels.map((level) => (
              <button
                key={level.id}
                onClick={() => setSelectedLevel(level.id)}
                className={`px-3.5 py-1.5 rounded-full text-sm font-medium transition-all ${
                  selectedLevel === level.id
                    ? "bg-background text-primary shadow-lg"
                    : "bg-background/20 text-background hover:bg-background/30"
                }`}
              >
                {level.icon} HSK {level.id.split("-")[1]}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* Stats */}
      <div className="max-w-7xl mx-auto px-4 -mt-6 relative z-10">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {[
            { value: "6", label: t("লেভেল", "Levels") },
            { value: "24", label: t("রিসোর্স", "Resources") },
            { value: "5000+", label: t("শব্দ", "Words") },
            { value: "100%", label: t("ফ্রি", "Free") },
          ].map((stat) => (
            <div
              key={stat.label}
              className="rounded-xl border border-secondary bg-background/80 backdrop-blur-sm p-4 text-center shadow-sm"
            >
              <div className="text-2xl font-bold text-primary">
                {stat.value}
              </div>
              <div className="text-xs text-text/50">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>

      {/* HSK Levels Grid */}
      <section className="max-w-7xl mx-auto px-4 py-8 sm:py-12">
        <div className="flex items-center gap-2 mb-6">
          <Layers className="h-5 w-5 text-primary" />
          <h2 className="text-xl font-bold text-text">
            {t("লেভেল অনুযায়ী রিসোর্স", "Resources by Level")}
          </h2>
          <span className="text-sm text-text/40 ml-auto">
            {filteredLevels.length} {t("টি", "")}
          </span>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          {filteredLevels.map((level) => (
            <HSKLevelCard key={level.id} level={level} />
          ))}
        </div>
      </section>

      {/* All Resources */}
      <section className="border-t border-secondary bg-secondary/5 py-8 sm:py-12">
        <div className="max-w-7xl mx-auto px-4">
          <div className="flex items-center gap-2 mb-6">
            <FolderOpen className="h-5 w-5 text-primary" />
            <h2 className="text-xl font-bold text-text">
              {t("সব রিসোর্স একসাথে", "All Resources Together")}
            </h2>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
            {allResources.map((resource) => (
              <AllResourcesCard key={resource.id} resource={resource} />
            ))}
          </div>
        </div>
      </section>
    </div>
  );
}
