"use client";

import { useCallback } from "react";
import Link from "next/link";
import {
  BookOpen,
  CheckCircle2,
  GraduationCap,
  LogIn,
  RefreshCw,
  Sparkles,
  UserPlus,
  Users,
  Zap,
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

  /* The tiles are the numbers that ask for a decision. Library size — how many
     core words are seeded, how many donations were ever received — does not, so
     it lives on its own page instead of on the front screen. */
  const overview: {
    label: string;
    count: number;
    icon: LucideIcon;
    tone: string;
    href: string;
    hint: string;
  }[] = [
    {
      label: t("মোট শিক্ষার্থী", "Total students"),
      count: counts.totalStudents,
      icon: Users,
      tone: "text-primary",
      href: "/admin/students",
      hint: t("সব স্ট্যাটাস মিলিয়ে", "every status"),
    },
    {
      label: t("অপেক্ষমাণ আবেদন", "Pending intake"),
      count: counts.pendingStudents,
      icon: UserPlus,
      tone: counts.pendingStudents > 0 ? "text-warn" : "text-text/40",
      href: "/admin/registrations",
      hint: t("এখনো সিদ্ধান্ত দেওয়া হয়নি", "not decided yet"),
    },
    {
      label: t("অপেক্ষমাণ ভর্তি", "Pending enrollments"),
      count: counts.pendingEnrollments,
      icon: GraduationCap,
      tone: counts.pendingEnrollments > 0 ? "text-warn" : "text-text/40",
      href: "/admin/courses",
      hint: t("কোর্স পেজেই ঠিক করুন", "approve from the course page"),
    },
    {
      label: t("প্রো সদস্য", "Pro members"),
      count: counts.proMembers,
      icon: Sparkles,
      tone: "text-ok",
      href: "/admin/pro",
      hint: t("পেমেন্ট ও ট্রায়াল মিলিয়ে", "paid + trial"),
    },
    {
      label: t("এখন অনলাইন", "Online now"),
      count: counts.onlineNow,
      icon: Zap,
      tone: counts.onlineNow > 0 ? "text-ok" : "text-text/40",
      href: "/admin/students",
      hint: t("সেশন এখনো খোলা", "session still open"),
    },
    {
      label: t("কোর্স", "Courses"),
      count: counts.courses,
      icon: BookOpen,
      tone: "text-primary",
      href: "/admin/courses",
      hint: t("পাঠ ও ভর্তি একসাথে", "lessons and enrollments"),
    },
  ];

  /* Sign-in reach is a different question from the tiles above: not "how many
     people are here now" but "how many turn up at all". */
  const reach: { label: string; value: string; icon: LucideIcon }[] = [
    { label: t("আজ লগইন", "Sign-ins today"), value: String(counts.loginsToday), icon: LogIn },
    {
      label: t("মোট কতজন লগইন করেছে", "Ever signed in"),
      value: `${counts.everLoggedIn} / ${counts.totalStudents}`,
      icon: CheckCircle2,
    },
  ];

  return (
    <AdminShell
      title={t("অ্যাডমিন কনসোল", "Admin console")}
      crumb={t("ড্যাশবোর্ড", "Dashboard")}
      seal="政"
      lede={t(
        "আজ কী করতে হবে — অপেক্ষমাণ আবেদন, ভর্তি ও লগইন — সব প্রথম স্ক্রিনেই।",
        "What needs doing today — intake, enrollments, sign-ins — on the first screen.",
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
      <section aria-label={t("সারসংক্ষেপ", "Overview")}>
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text/45">
          {t("সারসংক্ষেপ", "Overview")}
        </h2>

        <div className="mt-4 grid grid-cols-2 gap-3 sm:grid-cols-3 lg:grid-cols-6">
          {overview.map((o) => {
            const Icon = o.icon;
            return (
              <Link
                key={o.label}
                href={o.href}
                draggable={false}
                className="group rounded-2xl border border-text/10 bg-card p-4 shadow-sm transition-colors hover:border-primary/45 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
              >
                <div className="flex items-center justify-between gap-2">
                  <Icon className={`size-4 ${o.tone}`} aria-hidden="true" />
                  <span className="font-mono text-xl font-bold tabular-nums text-text">
                    {loading ? "—" : o.count}
                  </span>
                </div>
                <p className="mt-1.5 text-[11px] font-medium uppercase tracking-[0.1em] text-text/60">
                  {o.label}
                </p>
                <p className="mt-0.5 text-[11px] leading-snug text-text/40">{o.hint}</p>
              </Link>
            );
          })}
        </div>
      </section>

      <section aria-label={t("লগইন", "Sign-ins")} className="mt-8">
        <h2 className="text-xs font-semibold uppercase tracking-[0.16em] text-text/45">
          {t("লগইন", "Sign-ins")}
        </h2>
        <div className="mt-3 flex flex-wrap gap-3">
          {reach.map((r) => {
            const Icon = r.icon;
            return (
              <div
                key={r.label}
                className="inline-flex items-center gap-3 rounded-2xl border border-text/10 bg-card px-4 py-3 shadow-sm"
              >
                <Icon className="size-4 text-primary/70" aria-hidden="true" />
                <div>
                  <p className="font-mono text-lg font-bold leading-none tabular-nums text-text">
                    {loading ? "—" : r.value}
                  </p>
                  <p className="mt-1 text-[11px] text-text/50">{r.label}</p>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      <p className="mt-10 border-t border-text/10 pt-6 text-sm text-text/55">
        {t(
          "উপরের বার থেকে যেকোনো মডিউলে এক ক্লিকে যান — বাকিগুলো “আরও” মেনুতে আছে।",
          "The bar jumps to any module in one click — the rest live under “More”.",
        )}
      </p>
    </AdminShell>
  );
}
