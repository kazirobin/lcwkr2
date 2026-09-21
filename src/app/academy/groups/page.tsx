"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { ArrowRight, RefreshCw, Users } from "lucide-react";
import { ICourse, IStudent, IStudyGroup } from "@/features/academy";
import { useLanguage } from "@/i18n";
import {
  Breadcrumb,
  Card,
  EmptyState,
  Eyebrow,
  IconButton,
  LoadingBlock,
  PageHeader,
  SectionHanzi,
} from "@/components/ui";

export default function AcademyGroupsPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [groups, setGroups] = useState<IStudyGroup[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [gRes, cRes, sRes] = await Promise.all([
        fetch("/api/academy/groups", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (gRes.success && Array.isArray(gRes.groups)) setGroups(gRes.groups);
      if (cRes.success && Array.isArray(cRes.courses)) setCourses(cRes.courses);
      if (sRes.success && Array.isArray(sRes.students)) setStudents(sRes.students);
    } catch {
      /* ignore */
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { fetchData(); }, [fetchData]);

  const nameByRoll = useMemo(() => {
    const m = new Map<string, string>();
    students.forEach((s) => m.set(String(s.rollNumber).trim(), s.nameEnglish));
    return m;
  }, [students]);

  const courseById = useMemo(
    () => new Map(courses.map((c) => [c.courseId, c])),
    [courses],
  );

  const byCourse = useMemo(() => {
    const m = new Map<string, IStudyGroup[]>();
    groups.forEach((g) => {
      const list = m.get(g.courseId) ?? [];
      list.push(g);
      m.set(g.courseId, list);
    });
    return Array.from(m.entries()).sort((a, b) => a[0].localeCompare(b[0]));
  }, [groups]);

  const totalMembers = useMemo(
    () => groups.reduce((acc, g) => acc + g.memberRolls.length, 0),
    [groups],
  );

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="组" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("হোম", "Home"), href: "/" },
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("স্টাডি গ্রুপ", "Study groups") },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={<Eyebrow seal="组" label={t("স্টাডি গ্রুপ", "Study groups")} detail={`${groups.length}`} />}
        title={t("পরবর্তী ক্লাসের জোড়া", "Next-class pairs")}
        lede={t(
          "প্রতিটি কোর্সের স্টাডি গ্রুপ — কে কোন গ্রুপে আছে এক নজরে দেখুন।",
          "Every course's study groups — see who is in which pair at a glance.",
        )}
        actions={
          <IconButton
            label={t("তালিকা রিফ্রেশ করুন", "Refresh list")}
            size="sm"
            spinning={loading}
            onClick={fetchData}
          >
            <RefreshCw className="h-4 w-4" />
          </IconButton>
        }
      />

      <dl className="mt-10 grid grid-cols-3 divide-x divide-text/10 rounded-2xl border border-text/10 bg-card">
        <div className="px-5 py-5">
          <dt className="text-xs font-medium uppercase tracking-wide text-text/50">{t("গ্রুপ", "Groups")}</dt>
          <dd className="mt-1.5 text-2xl font-bold tabular-nums text-text">
            {loading ? <span className="text-text/30">—</span> : groups.length}
          </dd>
        </div>
        <div className="px-5 py-5">
          <dt className="text-xs font-medium uppercase tracking-wide text-text/50">{t("কোর্স", "Courses")}</dt>
          <dd className="mt-1.5 text-2xl font-bold tabular-nums text-text">
            {loading ? <span className="text-text/30">—</span> : byCourse.length}
          </dd>
        </div>
        <div className="px-5 py-5">
          <dt className="text-xs font-medium uppercase tracking-wide text-text/50">{t("শিক্ষার্থী", "Members")}</dt>
          <dd className="mt-1.5 text-2xl font-bold tabular-nums text-text">
            {loading ? <span className="text-text/30">—</span> : totalMembers}
          </dd>
        </div>
      </dl>

      {loading ? (
        <div className="mt-8">
          <LoadingBlock label={t("গ্রুপ লোড হচ্ছে", "Loading study groups")} rows={2} />
        </div>
      ) : byCourse.length === 0 ? (
        <div className="mt-8">
          <EmptyState
            title={t("এখনও কোনো স্টাডি গ্রুপ নেই", "No study groups yet")}
            description={t(
              "অ্যাডমিন প্যানেল থেকে শিক্ষার্থীদের জোড়া তৈরি করলে এখানে দেখা যাবে।",
              "Pairs created from the admin panel will appear here.",
            )}
          />
        </div>
      ) : (
        <div className="mt-8 space-y-8">
          {byCourse.map(([courseId, list]) => {
            const course = courseById.get(courseId);
            return (
              <section key={courseId}>
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <Eyebrow seal="组" label={course?.courseName ?? courseId} detail={`${list.length}`} />
                  </div>
                  <Link
                    href={`/academy/courses?course=${encodeURIComponent(courseId)}`}
                    className="inline-flex items-center gap-1 text-xs font-semibold text-text underline decoration-text/25 underline-offset-4 hover:decoration-text"
                  >
                    {t("কোর্স পেজ", "Course page")}
                    <ArrowRight className="h-3 w-3" />
                  </Link>
                </div>

                <div className="mt-3 grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
                  {list.map((g) => (
                    <Card key={g._id || g.label} className="p-4">
                      <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-bold text-text">{g.label}</h3>
                        <span className="inline-flex items-center gap-1 rounded-lg bg-text/5 px-2 py-0.5 text-[11px] font-semibold tabular-nums text-text/55">
                          <Users className="h-3 w-3" />
                          {g.memberRolls.length}
                        </span>
                      </div>
                      <ul className="mt-3 space-y-1.5">
                        {g.memberRolls.map((r) => {
                          const roll = String(r).trim();
                          const name = nameByRoll.get(roll);
                          return (
                            <li key={roll} className="flex items-baseline gap-2 rounded-lg bg-text/[0.03] px-2.5 py-1.5 text-xs">
                              <span className="w-10 shrink-0 font-mono tabular-nums text-text/40">#{r}</span>
                              <span className={name ? "font-semibold text-text" : "italic text-text/45"}>
                                {name ?? t("অজানা", "Unknown")}
                              </span>
                            </li>
                          );
                        })}
                      </ul>
                    </Card>
                  ))}
                </div>
              </section>
            );
          })}
        </div>
      )}
    </div>
  );
}