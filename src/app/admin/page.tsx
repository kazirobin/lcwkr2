"use client";

import { useState, useEffect, useCallback } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw } from "lucide-react";
import { useLanguage } from "@/i18n";
import { AdminShell } from "@/features/academy";
import { Card, IconButton } from "@/components/ui";

export default function AdminDashboardPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [stats, setStats] = useState({
    pendingStudents: 0,
    approvedStudents: 0,
    pendingClasses: 0,
    courses: 0,
    chineseWords: 0,
  });
  const [loading, setLoading] = useState(false);

  const fetchStats = useCallback(async () => {
    setLoading(true);
    try {
      const [pStu, aStu, logs, crs, words] = await Promise.all([
        fetch("/api/academy/students?status=Pending", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/classes/pending", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/chinese-words", { cache: "no-store" }).then((r) => r.json()),
      ]);
      setStats({
        pendingStudents: pStu.students?.length || 0,
        approvedStudents: aStu.students?.length || 0,
        pendingClasses: logs.pendingClasses?.length || 0,
        courses: crs.courses?.length || 0,
        chineseWords: words.data?.length || 0,
      });
    } catch (err) {
      console.error("Failed to load admin stats:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchStats();
  }, [fetchStats]);

  const modules = [
    {
      title: t("অপেক্ষমাণ ভর্তি", "Pending admissions"),
      desc: t("শিক্ষার্থীর রেজিস্ট্রেশন অনুমোদন বা প্রত্যাখ্যান করুন।", "Approve or reject student registration requests."),
      count: stats.pendingStudents,
      href: "/admin/admissions",
    },
    {
      title: t("শিক্ষার্থী ও ট্র্যাক", "Students & tracks"),
      desc: t("গ্রুপ স্ট্যাটাস, ট্র্যাক পরিবর্তন বা শিক্ষার্থী অপসারণ।", "Group status, track transfers, or removing a student."),
      count: stats.approvedStudents,
      href: "/admin/students",
    },
    {
      title: t("ক্লাস লগ অনুমোদন", "Class log approvals"),
      desc: t("শিক্ষকের জমা দেওয়া উপস্থিতি সেশন পর্যালোচনা করুন।", "Review attendance sessions submitted by teachers."),
      count: stats.pendingClasses,
      href: "/admin/class-logs",
    },
    {
      title: t("কোর্স ট্র্যাক", "Course tracks"),
      desc: t("নতুন কোর্স তৈরি করুন, ব্যাচের সময়সূচি সম্পাদনা করুন।", "Create courses and edit cohort schedules."),
      count: stats.courses,
      href: "/admin/courses",
    },
    {
      title: t("চাইনিজ কোর ওয়ার্ডস", "Chinese core words"),
      desc: t("কোর ক্যারেক্টার ও শব্দ পরিবার যোগ, সম্পাদনা বা মুছুন।", "Add, edit, or remove core characters and word families."),
      count: stats.chineseWords,
      href: "/admin/chinese-words",
    },
  ];

  return (
    <AdminShell
      title={t("অ্যাডমিন কনসোল", "Admin console")}
      crumb={t("ড্যাশবোর্ড", "Dashboard")}
      seal="政"
      lede={t("একাডেমির ভর্তি, শিক্ষার্থী, ক্লাস লগ ও কোর্স পরিচালনা।", "Manage the academy's admissions, students, class logs, and courses.")}
      actions={
        <IconButton
          label={t("পরিসংখ্যান রিফ্রেশ করুন", "Refresh metrics")}
          size="sm"
          spinning={loading}
          onClick={fetchStats}
        >
          <RefreshCw className="h-4 w-4" />
        </IconButton>
      }
    >
      <ul className="grid grid-cols-1 gap-4 md:grid-cols-2">
        {modules.map((m) => (
          <li key={m.href}>
            <Link href={m.href} className="group block h-full focus-visible:outline-none">
              <Card interactive className="flex h-full flex-col p-6 group-focus-visible:border-text group-focus-visible:ring-2 group-focus-visible:ring-text">
                <div className="flex items-start justify-between gap-3">
                  <h2 className="text-base font-bold text-text">{m.title}</h2>
                  <span className="rounded-full border border-text/10 bg-text/5 px-2.5 py-0.5 text-xs font-semibold tabular-nums text-text/70">
                    {loading ? "—" : m.count}
                  </span>
                </div>
                <p className="mt-2 flex-1 text-sm text-text/60">{m.desc}</p>
                <span className="mt-4 inline-flex items-center gap-1 border-t border-text/10 pt-3 text-sm font-semibold text-text">
                  {t("খুলুন", "Open")}
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5 motion-reduce:transform-none" aria-hidden="true" />
                </span>
              </Card>
            </Link>
          </li>
        ))}
      </ul>
    </AdminShell>
  );
}
