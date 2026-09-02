// src/components/msg/LibraryPage.tsx
"use client";

import { useState } from "react";
import { useLanguage } from "@/i18n";
import {
  Sparkles,
  Copy,
  Check,
  Code,
  FileText,
  Users,
  User,
  Briefcase,
  CheckCircle,
  MessageSquare,
  FolderOpen,
  Layers,
} from "lucide-react";
import { snippets } from "@/features/marketing/data/msgs";
import { team } from "@/features/marketing/data/team";

// ============================================
// DATA
// ============================================

// export const snippets = [
//   {
//     id: 1,
//     title: "Welcome Message",
//     description: "Welcome new members to the group",
//     language: "English",
//     code: "Welcome to our community! We're excited to have you here. Feel free to introduce yourself and explore the resources available.",
//   },
//   {
//     id: 2,
//     title: "শুভেচ্ছা বার্তা",
//     description: "গ্রুপে নতুন সদস্যদের স্বাগত জানান",
//     language: "Bengali",
//     code: "আমাদের কমিউনিটিতে স্বাগতম! আপনাকে পেয়ে আমরা রোমাঞ্চিত। নিজের পরিচয় দিন এবং উপলব্ধ সংস্থানগুলি অন্বেষণ করুন।",
//   },
//   // Add more snippets as needed
// ];

// export const team = [
//   {
//     id: 1,
//     name: "John Doe",
//     role: "Lead Admin",
//     group: "Management",
//     tasks: ["Oversee all group activities", "Handle member queries", "Organize events"],
//   },
//   {
//     id: 2,
//     name: "Jane Smith",
//     role: "Co-Admin",
//     group: "Moderation",
//     tasks: ["Moderate discussions", "Enforce rules", "Support members"],
//   },
//   {
//     id: 3,
//     name: "Mike Johnson",
//     role: "Teacher",
//     group: "Education",
//     tasks: ["Create learning content", "Conduct classes", "Provide feedback"],
//   },
// ];

// ============================================
// TRANSLATIONS
// ============================================

const translations = {
  en: {
    page: {
      badge: "Message Store",
      title: "Copy the Message You Need",
      subtitle: "Easily copy and use the message you need",
      available: "Messages Available",
    },
    team: {
      title: "Team Instructions",
      subtitle: "Team Members & Responsibilities",
      responsibilities: "Responsibilities",
      group: "Group",
    },
    footer: "Built with ❤️ using Next.js + TypeScript + Tailwind CSS",
  },
  bn: {
    page: {
      badge: "বার্তা স্টোর",
      title: "প্রয়োজনীয় বার্তাটি কপি করুন",
      subtitle:
        "এখান থেকে আপনার প্রয়োজনীয় বার্তাটি সহজেই কপি করে ব্যবহার করুন",
      available: "টি বার্তা উপলব্ধ",
    },
    team: {
      title: "টিম নির্দেশনা",
      subtitle: "টিম সদস্য ও দায়িত্ব",
      responsibilities: "দায়িত্ব",
      group: "গ্রুপ",
    },
    footer: "❤️ দিয়ে তৈরি Next.js + TypeScript + Tailwind CSS ব্যবহার করে",
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

interface MsgCardProps {
  title: string;
  description: string;
  language: string;
  code: string;
}

const MsgCard: React.FC<MsgCardProps> = ({
  title,
  description,
  language,
  code,
}) => {
  const [copied, setCopied] = useState(false);
  const t = useTranslation();

  const copyCode = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="group rounded-xl border border-secondary bg-background overflow-hidden transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
      {/* Header */}
      <div className="border-b border-secondary p-5">
        <div className="flex items-start justify-between gap-4">
          <div>
            <h3 className="text-lg font-bold text-text">{title}</h3>
            <p className="mt-1 text-sm text-text/60">{description}</p>
          </div>
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-medium text-primary dark:bg-primary/20">
            {language}
          </span>
        </div>
      </div>

      {/* Code */}
      <div className="overflow-x-auto bg-secondary/30 p-4">
        <pre className="text-sm leading-6 text-text/80 font-mono">
          <code className="whitespace-pre-wrap">{code}</code>
        </pre>
      </div>

      {/* Footer */}
      <div className="flex items-center justify-between border-t border-secondary p-4">
        <span className="text-xs text-text/40">
          {code.split("\n").length} {t("লাইন", "Lines")}
        </span>
        <button
          onClick={copyCode}
          className={`inline-flex items-center gap-2 rounded-lg px-4 py-2 text-sm font-medium transition-all ${
            copied
              ? "bg-green-600 text-white"
              : "bg-primary text-background hover:opacity-90 hover:shadow-md"
          }`}
        >
          {copied ? (
            <>
              <Check className="h-4 w-4" />
              {t("কপি করা হয়েছে!", "Copied!")}
            </>
          ) : (
            <>
              <Copy className="h-4 w-4" />
              {t("কপি করুন", "Copy")}
            </>
          )}
        </button>
      </div>
    </div>
  );
};

interface TeamCardProps {
  name: string;
  role: string;
  group: string;
  tasks: string[];
}

const TeamCard: React.FC<TeamCardProps> = ({ name, role, group, tasks }) => {
  const t = useTranslation();

  return (
    <div className="group rounded-xl border border-secondary bg-background p-5 transition-all hover:border-primary hover:shadow-lg hover:-translate-y-1">
      <div className="flex items-start gap-3 mb-4">
        <div className="rounded-lg bg-primary/10 p-2.5 text-primary dark:bg-primary/20">
          <User className="h-5 w-5" />
        </div>
        <div>
          <h4 className="font-semibold text-text">{name}</h4>
          <span className="text-xs font-medium text-primary">{role}</span>
        </div>
      </div>

      <div className="mb-4">
        <p className="text-xs font-medium text-text/50">
          {t("গ্রুপ", "Group")}
        </p>
        <p className="text-sm text-text/80">{group}</p>
      </div>

      <div>
        <p className="mb-2 text-xs font-medium text-text/50">
          {t("দায়িত্ব", "Responsibilities")}
        </p>
        <ul className="space-y-1.5">
          {tasks.map((task, index) => (
            <li
              key={index}
              className="flex items-start gap-2 text-sm text-text/70"
            >
              <CheckCircle className="mt-0.5 h-3.5 w-3.5 text-primary shrink-0" />
              <span>{task}</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
};

// ============================================
// MAIN COMPONENT
// ============================================

export default function LibraryPage() {
  const t = useTranslation();
  const lang = translations[useLanguage().language as "en" | "bn"];

  return (
    <div className="min-h-screen bg-background text-text">
      {/* Hero Banner */}
      <section className="relative -mt-16 overflow-hidden bg-primary pt-28 pb-16 sm:-mt-20 sm:pt-32 sm:pb-20">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-0 -left-4 h-72 w-72 rounded-full bg-background mix-blend-multiply blur-xl animate-pulse" />
          <div className="absolute bottom-0 -right-4 h-72 w-72 rounded-full bg-background/50 mix-blend-multiply blur-xl animate-pulse delay-1000" />
        </div>

        <div className="relative mx-auto max-w-4xl px-4 text-center">
          <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-background/20 px-4 py-1.5 backdrop-blur-sm">
            <Sparkles className="h-4 w-4" />
            <span className="text-sm font-medium text-background">
              {lang.page.badge}
            </span>
          </div>

          <h1 className="text-3xl font-extrabold tracking-tight text-background sm:text-4xl md:text-5xl">
            📋 {lang.page.title}
          </h1>

          <p className="mx-auto mt-3 max-w-2xl text-base text-background/80 sm:text-lg">
            {lang.page.subtitle}
          </p>

          <div className="mt-6 inline-flex items-center gap-2 rounded-lg bg-background/20 px-5 py-3 backdrop-blur-sm">
            <FileText className="h-4 w-4 text-background" />
            <span className="font-medium text-background">
              {snippets.length} {lang.page.available}
            </span>
          </div>
        </div>
      </section>

      {/* Main Content */}
      <div className="mx-auto max-w-7xl px-4 py-8 sm:py-12">
        {/* Team Section */}
        <section className="mb-12">
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary dark:bg-primary/20">
              <Users className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text">
                {lang.team.title}
              </h2>
              <p className="text-sm text-text/50">{lang.team.subtitle}</p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {team.map((member) => (
              <TeamCard
                key={member.id}
                name={member.name}
                role={member.role}
                group={member.group}
                tasks={member.tasks}
              />
            ))}
          </div>
        </section>

        {/* Messages Section */}
        <section>
          <div className="mb-6 flex items-center gap-3">
            <div className="rounded-lg bg-primary/10 p-2 text-primary dark:bg-primary/20">
              <MessageSquare className="h-5 w-5" />
            </div>
            <div>
              <h2 className="text-2xl font-bold text-text">
                {t("বার্তা", "Messages")}
              </h2>
              <p className="text-sm text-text/50">
                {t("কপি করে ব্যবহার করুন", "Copy and use")}
              </p>
            </div>
          </div>

          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 xl:grid-cols-3">
            {snippets.map((snippet) => (
              <MsgCard
                key={snippet.id}
                title={snippet.title}
                description={snippet.description}
                language={snippet.language}
                code={snippet.code}
              />
            ))}
          </div>
        </section>

        {/* Footer */}
        <footer className="mt-12 border-t border-secondary pt-8 text-center">
          <p className="text-sm text-text/40">{lang.footer}</p>
        </footer>
      </div>
    </div>
  );
}
