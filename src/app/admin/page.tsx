"use client";

import { useCallback } from "react";
import {
  BookOpen,
  GraduationCap,
  HandCoins,
  Languages,
  RefreshCw,
  UserPlus,
  Users,
} from "lucide-react";
import { useLanguage } from "@/i18n";
import { AdminShell, useAdminStats } from "@/features/academy";
import { IconButton } from "@/components/ui";

type LucideIcon = typeof Users;

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const { counts, loading, refresh } = useAdminStats();

  const overview: { label: string; count: number; icon: LucideIcon; tone: string }[] = [
    { label: t("অপেক্ষমাণ ভর্তি", "Pending admissions"), count: counts.pendingStudents, icon: UserPlus, tone: "text-warn" },
    { label: t("শিক্ষার্থী", "Students"), count: counts.approvedStudents, icon: GraduationCap, tone: "text-primary" },
    { label: t("অপেক্ষমাণ লগ", "Pending logs"), count: counts.pendingClasses, icon: RefreshCw, tone: "text-warn" },
    { label: t("কোর্স", "Courses"), count: counts.courses, icon: BookOpen, tone: "text-primary" },
    { label: t("কোর ওয়ার্ডস", "Core words"), count: counts.chineseWords, icon: Languages, tone: "text-ok" },
    { label: t("অনুদান", "Donations"), count: counts.donations, icon: HandCoins, tone: "text-ok" },
  ];

  return (
    <AdminShell
      title={t("অ্যাডমিন কনসোল", "Admin console")}
      crumb={t("ড্যাশবোর্ড", "Dashboard")}
      seal="政"
      lede={t(
        "একাডেমির ভর্তি, শিক্ষার্থী, ক্লাস লগ, কোর্স, কোর ওয়ার্ডস ও অনুদান — সব এক জায়গায়।",
        "Admissions, students, class logs, courses, core words and donations — all in one place."
      )}
      actions={
        <IconButton
          label={t("পরিসংখ্যান রিফ্রেশ করুন", "Refresh metrics")}
          size="sm"
          spinning={loading}
          onClick={() => refresh()}
        >
          <RefreshCw className="h-4 w-4" />
        </IconButton>
      }
    >
      {/* ── overview metrics ── */}
      <section aria-label={t("সারসংক্ষেপ", "Overview")}>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text/45">
          {t("সারসংক্ষেপ", "Overview")}
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {overview.map((o) => {
            const Icon = o.icon;
            return (
              <div
                key={o.label}
                className="rounded-2xl border border-text/10 bg-card p-4 shadow-sm"
              >
                <div className="flex items-center justify-between gap-2">
                  <Icon className={`size-4 ${o.tone}`} aria-hidden="true" />
                  <span className="font-mono text-xl font-bold tabular-nums text-text">
                    {loading ? "—" : o.count}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-text/50">
                  {o.label}
                </p>
              </div>
            );
          })}
        </div>
      </section>

      {/* ── quick hint ── */}
      <p className="mt-10 border-t border-text/10 pt-6 text-sm text-text/55">
        {t(
          "উপরের বার থেকে যেকোনো মডিউলে এক ক্লিকে যান — বর্তমান পেজটি হাইলাইট থাকে।",
          "Use the bar above to jump to any module in one click — the current page stays highlighted."
        )}
      </p>
    </AdminShell>
  );
}
