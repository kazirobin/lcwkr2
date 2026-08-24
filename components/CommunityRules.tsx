// components/CommunityRules.tsx

"use client";

import React, { useState, useMemo } from "react";
import { useLanguage } from "@/context/LanguageContext";
import { rulesData, categoryGroups, Rule, Category } from "@/data/mandarinRules";

// Lucide Icon imports
import {
  GraduationCap, Target, Calendar, BookOpen, Clock, FileCheck,
  Coffee, Headphones, Users, Award, Repeat, Flame, Clock3,
  Timer, DoorClosed, CheckCircle2, AlertOctagon, FileEdit,
  UserX, Zap, TrendingUp, Sparkles, ShieldCheck, HelpCircle,
  Compass, CalendarClock, Network, Shield, Star, LayoutGrid,
  Search, Grid3x3, List, ArrowRight, Phone, LucideIcon
} from "lucide-react";

const iconMap: Record<string, LucideIcon> = {
  GraduationCap, Target, Calendar, BookOpen, Clock, FileCheck,
  Coffee, Headphones, Users, Award, Repeat, Flame, Clock3,
  Timer, DoorClosed, CheckCircle2, AlertOctagon, FileEdit,
  UserX, Zap, TrendingUp, Sparkles, ShieldCheck,
  Compass, CalendarClock, Network, Shield, Star, LayoutGrid
};

const severityColors: Record<string, string> = {
  strict: "text-secondary border-secondary/30 bg-secondary/10",
  moderate: "text-primary border-primary/30 bg-primary/10",
  informative: "text-text border-text/20 bg-text/5"
};

const CommunityRules: React.FC = () => {
  const { language } = useLanguage();
  const [activeCategory, setActiveCategory] = useState<Category | "all">("all");
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");

  const isBengali = language === "bn";

  const filteredRules = useMemo(() => {
    let filtered = activeCategory === "all"
      ? rulesData
      : rulesData.filter(rule => rule.category === activeCategory);

    if (searchTerm.trim()) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(rule =>
        rule.title.bn.toLowerCase().includes(term) ||
        rule.title.en.toLowerCase().includes(term) ||
        rule.description.bn.toLowerCase().includes(term) ||
        rule.description.en.toLowerCase().includes(term) ||
        rule.tag.bn.toLowerCase().includes(term) ||
        rule.tag.en.toLowerCase().includes(term)
      );
    }
    return filtered.sort((a, b) => a.priority - b.priority);
  }, [activeCategory, searchTerm]);

  const categoryStats = useMemo(() => {
    const stats: Record<string, number> = { all: rulesData.length };
    categoryGroups.forEach(group => {
      if (group.id !== "all") {
        stats[group.id] = rulesData.filter(r => r.category === group.id).length;
      }
    });
    return stats;
  }, []);

  const t = (bn: string, en: string) => isBengali ? bn : en;

  return (
    <section className="relative overflow-hidden py-16 px-4 md:px-8 bg-background text-text transition-colors duration-300">
      {/* Background Glow */}
      <div className="absolute inset-0 bg-gradient-to-br from-primary/5 via-transparent to-secondary/5 dark:from-primary/10 dark:to-secondary/10 pointer-events-none" />
      <div className="absolute top-1/4 -left-32 w-96 h-96 bg-primary/20 dark:bg-primary/10 blur-[150px] rounded-full pointer-events-none" />
      <div className="absolute bottom-1/4 -right-32 w-96 h-96 bg-secondary/20 dark:bg-secondary/10 blur-[150px] rounded-full pointer-events-none" />

      <div className="max-w-7xl mx-auto relative z-10 space-y-10">
        {/* Header */}
        <div className="text-center space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 dark:bg-primary/20 border border-primary/20">
            <span className="text-lg">🐉</span>
            <span className="text-xs font-bold uppercase tracking-wider text-primary">
              {t("ম্যান্ডারিন এলিট স্কোয়াড", "Mandarin Elite Squad")}
            </span>
          </div>

          <h2 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            <span className="text-text">{t("কমিউনিটি", "Community")} </span>
            <span className="text-primary">{t("গাইডলাইন", "Guidelines")}</span>
          </h2>

          <p className="text-lg text-text/70 max-w-3xl mx-auto leading-relaxed">
            {t(
              "সম্পূর্ণ বিনামূল্যে চীনা ভাষা শেখার এক অনন্য ও সুশৃঙ্খল প্ল্যাটফর্ম। নিচের সকল নিয়ম অনুসরণ করে একটি ফলপ্রসূ পরিবেশ তৈরি করুন।",
              "A unique and structured 100% free Chinese learning platform. Follow all guidelines below to create a productive environment."
            )}
          </p>
        </div>

        {/* Search & Controls */}
        <div className="flex flex-col md:flex-row gap-4 items-center justify-between">
          <div className="relative w-full md:w-72">
            <input
              type="text"
              placeholder={t("নিয়ম খুঁজুন...", "Search rules...")}
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full px-4 py-2.5 pl-10 rounded-xl bg-text/5 border border-text/10 hover:border-primary/50 focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all outline-none text-sm text-text placeholder:text-text/40"
            />
            <Search className="absolute left-3 top-3 w-4 h-4 text-text/40" />
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => setViewMode("grid")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "grid" ? "bg-primary/10 text-primary" : "text-text/40 hover:text-text"}`}
            >
              <Grid3x3 className="w-5 h-5" />
            </button>
            <button
              onClick={() => setViewMode("list")}
              className={`p-2 rounded-lg transition-colors ${viewMode === "list" ? "bg-primary/10 text-primary" : "text-text/40 hover:text-text"}`}
            >
              <List className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex flex-wrap gap-2 justify-center">
          {categoryGroups.map((cat) => {
            const isActive = activeCategory === cat.id;
            const count = categoryStats[cat.id] || 0;

            return (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-300 flex items-center gap-2 ${
                  isActive
                    ? "bg-primary text-white shadow-lg shadow-primary/25"
                    : "bg-text/5 hover:bg-text/10 text-text/70 hover:text-text border border-text/10"
                }`}
              >
                <span className="text-xs opacity-60">{count}</span>
                <span className="hidden sm:inline">{t(cat.label.bn, cat.label.en)}</span>
                <span className="sm:hidden">{t(cat.label.bn.slice(0, 1), cat.label.en.slice(0, 1))}</span>
              </button>
            );
          })}
        </div>

        {/* Rules Grid/List */}
        <div className={`${viewMode === "grid" ? "grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6" : "flex flex-col gap-4"}`}>
          {filteredRules.map((rule) => {
            const IconComponent = iconMap[rule.icon] || HelpCircle;
            const severityClass = severityColors[rule.severity] || "";

            return (
              <div
                key={rule.id}
                className={`group relative p-6 rounded-2xl transition-all duration-300 ${
                  viewMode === "grid"
                    ? "bg-text/5 border border-text/10 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
                    : "bg-text/5 border border-text/10 hover:border-primary/30 flex items-start gap-6"
                }`}
              >
                {/* Highlight indicator */}
                {rule.isHighlighted && (
                  <div className="absolute -top-1 -right-1">
                    <span className="relative flex h-3 w-3">
                      <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-primary opacity-75"></span>
                      <span className="relative inline-flex rounded-full h-3 w-3 bg-primary"></span>
                    </span>
                  </div>
                )}

                {/* Severity badge */}
                <div className={`absolute top-3 right-3 px-2 py-0.5 rounded-full text-[10px] font-semibold border ${severityClass}`}>
                  {t(
                    rule.severity === "strict" ? "কঠোর" :
                    rule.severity === "moderate" ? "মধ্যম" : "তথ্যমূলক",
                    rule.severity === "strict" ? "Strict" :
                    rule.severity === "moderate" ? "Moderate" : "Info"
                  )}
                </div>

                <div className="flex-1 min-w-0">
                  {/* Icon & Tag */}
                  <div className="flex items-center gap-3 mb-3">
                    <div className="p-2.5 rounded-xl bg-primary/10 text-primary group-hover:scale-110 transition-transform">
                      <IconComponent className="w-5 h-5" />
                    </div>
                    <span className="px-2.5 py-1 rounded-full text-xs font-medium bg-primary/10 text-primary border border-primary/20">
                      {t(rule.tag.bn, rule.tag.en)}
                    </span>
                  </div>

                  {/* Content */}
                  <div className="space-y-2">
                    <h3 className={`font-bold text-text group-hover:text-primary transition-colors ${viewMode === "list" ? "text-xl" : "text-lg"}`}>
                      {t(rule.title.bn, rule.title.en)}
                    </h3>
                    <p className="text-text/70 text-sm leading-relaxed">
                      {t(rule.description.bn, rule.description.en)}
                    </p>

                    {/* Details */}
                    {rule.details && (
                      <ul className="mt-3 space-y-1.5">
                        {(rule.details[isBengali ? "bn" : "en"] as string[]).map((detail, i) => (
                          <li key={i} className="flex items-start gap-2 text-sm text-text/60">
                            <span className="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary/40 shrink-0" />
                            {detail}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>

                  {/* Action Button */}
                  {rule.action && (
                    <div className="mt-4">
                      <a
                        href={rule.action.link}
                        target={rule.action.type === "external" ? "_blank" : undefined}
                        rel="noopener noreferrer"
                        className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium"
                      >
                        {t(rule.action.label.bn, rule.action.label.en)}
                        <ArrowRight className="w-4 h-4" />
                      </a>
                    </div>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Empty State */}
        {filteredRules.length === 0 && (
          <div className="text-center py-16">
            <div className="text-6xl mb-4">🔍</div>
            <h3 className="text-xl font-semibold mb-2 text-text">
              {t("কোনো নিয়ম পাওয়া যায়নি", "No rules found")}
            </h3>
            <p className="text-text/60">
              {t("অনুগ্রহ করে অন্য ক্যাটাগরি নির্বাচন করুন", "Please try selecting a different category")}
            </p>
          </div>
        )}

        {/* Footer Info */}
        <div className="mt-12 p-6 rounded-2xl bg-primary/5 dark:bg-primary/10 border border-primary/20">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="flex items-center gap-6">
              <div className="flex items-center gap-3">
                <div className="p-3 rounded-xl bg-primary/10 text-primary">
                  <Shield className="w-6 h-6" />
                </div>
                <div>
                  <p className="text-sm text-text/60">{t("মোট নিয়ম", "Total Rules")}</p>
                  <p className="text-2xl font-bold text-primary">{rulesData.length}</p>
                </div>
              </div>
              <div className="h-12 w-px bg-border hidden md:block" />
              <div className="hidden md:block">
                <p className="text-sm text-text/60">{t("শেষ আপডেট", "Last Updated")}</p>
                <p className="text-sm font-medium text-text">
                 17 August 2026
                </p>
              </div>
            </div>

            <a
              href="https://wa.me/8801787881334"
              target="_blank"
              rel="noopener noreferrer"
              className="px-6 py-3 rounded-xl bg-primary text-white hover:bg-primary/90 shadow-lg shadow-primary/25 transition-all inline-flex items-center gap-2 font-medium"
            >
              <Phone className="w-5 h-5" />
              {t("যোগাযোগ করুন", "Contact Us")}
            </a>
          </div>
        </div>
      </div>

      {/* Custom Animation */}
      <style>{`
        @keyframes ping {
          75%, 100% { transform: scale(2); opacity: 0; }
        }
        .animate-ping {
          animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;
        }
      `}</style>
    </section>
  );
};

export default CommunityRules;