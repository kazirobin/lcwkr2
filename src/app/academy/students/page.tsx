"use client";

import { useState, useEffect, useMemo, useCallback } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, RefreshCw, Search, X } from "lucide-react";
import { IStudent, ICourse } from "@/features/academy";
import { useLanguage } from "@/i18n";
import {
  Breadcrumb,
  Card,
  EmptyState,
  Eyebrow,
  IconButton,
  InlineSelect,
  LoadingBlock,
  PageHeader,
  SectionHanzi,
  StatusMark,
} from "@/components/ui";

export default function ScholarsDirectoryPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [students, setStudents] = useState<IStudent[]>([]);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  const [query, setQuery] = useState("");
  const [track, setTrack] = useState("all");
  const [sortBy, setSortBy] = useState<"roll" | "attendance">("roll");

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const [s, c] = await Promise.all([
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }).then((r) => r.json()),
        fetch("/api/academy/courses", { cache: "no-store" }).then((r) => r.json()),
      ]);
      if (s.success && Array.isArray(s.students)) setStudents(s.students);
      if (c.success && Array.isArray(c.courses)) setCourses(c.courses);
    } catch (err) {
      console.error("Failed to load directory:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const enrolledIds = (s: IStudent): string[] => {
    if (Array.isArray(s.enrolledCourseIds) && s.enrolledCourseIds.length)
      return s.enrolledCourseIds.map((id) => String(id).trim());
    const legacy = (s as { enrolledCourseId?: string }).enrolledCourseId;
    return legacy ? [String(legacy).trim()] : [];
  };

  const attendance = useCallback(
    (roll: string | number, ids: string[]) => {
      let held = 0;
      let attended = 0;
      const target = String(roll).trim();
      courses.forEach((c) => {
        if (ids.some((id) => id.toLowerCase() === c.courseId.toLowerCase())) {
          const cls = c.classes ?? [];
          held += cls.length;
          attended += cls.filter((s) =>
            s.presentStudents?.some((r) => String(r).trim() === target),
          ).length;
        }
      });
      return { held, attended, rate: held > 0 ? Math.round((attended / held) * 100) : null };
    },
    [courses],
  );

  const rows = useMemo(() => {
    const q = query.toLowerCase().trim();
    return students
      .map((s) => {
        const ids = enrolledIds(s);
        return { s, ids, att: attendance(s.rollNumber, ids) };
      })
      .filter(({ s, ids }) => {
        const matchesQ =
          !q ||
          (s.nameEnglish || "").toLowerCase().includes(q) ||
          String(s.rollNumber).includes(q) ||
          (s.location || "").toLowerCase().includes(q);
        const matchesTrack =
          track === "all" || ids.some((id) => id.toLowerCase() === track.toLowerCase());
        return matchesQ && matchesTrack;
      })
      .sort((a, b) => {
        if (sortBy === "attendance") return (b.att.rate ?? -1) - (a.att.rate ?? -1);
        return Number(a.s.rollNumber) - Number(b.s.rollNumber);
      });
  }, [students, query, track, sortBy, attendance]);

  const filtersActive = query !== "" || track !== "all" || sortBy !== "roll";

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="生" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("শিক্ষার্থী", "Scholars") },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={<Eyebrow seal="生" label={t("শিক্ষার্থী তালিকা", "Scholars")} detail={`${students.length}`} />}
        title={t("যাঁরা একসাথে শিখছেন", "The people learning together")}
        lede={t(
          "চলমান ব্যাচের শিক্ষার্থী ও তাঁদের ক্লাস উপস্থিতি।",
          "Everyone in the running cohorts, and how their attendance is going.",
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

      {/* Controls */}
      <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:items-end">
        <div className="relative flex-1">
          <label htmlFor="dir-search" className="sr-only">
            {t("নাম, রোল বা অবস্থান খুঁজুন", "Search by name, roll, or location")}
          </label>
          <Search className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-text/40" aria-hidden="true" />
          <input
            id="dir-search"
            type="search"
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={t("নাম, রোল বা অবস্থান…", "Name, roll, or location…")}
            className="w-full rounded-xl border border-text/15 bg-card py-2.5 pl-9 pr-9 text-sm text-text placeholder:text-text/40 focus:border-text/40 focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
          />
          {query && (
            <button
              type="button"
              onClick={() => setQuery("")}
              aria-label={t("সার্চ মুছুন", "Clear search")}
              className="absolute right-2 top-1/2 flex h-7 w-7 -translate-y-1/2 items-center justify-center rounded-md text-text/40 hover:text-text focus-visible:outline-2 focus-visible:outline-offset-1 focus-visible:outline-text"
            >
              <X className="h-4 w-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <InlineSelect label={t("ট্র্যাক", "Track")} value={track} onChange={(e) => setTrack(e.target.value)}>
          <option value="all">{t("সব ট্র্যাক", "All tracks")}</option>
          {courses.map((c) => (
            <option key={c.courseId} value={c.courseId}>
              {c.courseId}
            </option>
          ))}
        </InlineSelect>
        <InlineSelect
          label={t("সাজান", "Sort")}
          value={sortBy}
          onChange={(e) => setSortBy(e.target.value as "roll" | "attendance")}
        >
          <option value="roll">{t("রোল অনুযায়ী", "By roll")}</option>
          <option value="attendance">{t("উপস্থিতি অনুযায়ী", "By attendance")}</option>
        </InlineSelect>
      </div>

      <div className="mt-4 flex items-center justify-between px-1 text-xs text-text/50" aria-live="polite">
        <span className="tabular-nums">
          {t(
            `${students.length} জনের মধ্যে ${rows.length} জন`,
            `Showing ${rows.length} of ${students.length}`,
          )}
        </span>
        {filtersActive && (
          <button
            type="button"
            onClick={() => {
              setQuery("");
              setTrack("all");
              setSortBy("roll");
            }}
            className="font-medium text-text underline decoration-text/25 underline-offset-2 hover:decoration-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
          >
            {t("ফিল্টার বাদ দিন", "Clear filters")}
          </button>
        )}
      </div>

      <div className="mt-6">
        {loading ? (
          <LoadingBlock label={t("তালিকা লোড হচ্ছে", "Loading directory")} rows={3} />
        ) : rows.length === 0 ? (
          <EmptyState
            title={t("কোনো শিক্ষার্থী পাওয়া যায়নি", "No scholars found")}
            description={t("অন্য নাম দিয়ে খুঁজুন বা ফিল্টার বাদ দিন।", "Try a different name, or clear the filters.")}
          />
        ) : (
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {rows.map(({ s, ids, att }) => (
              <li key={String(s.rollNumber)}>
                <Card interactive className="flex h-full flex-col p-5">
                  <div className="flex items-center gap-3">
                    <span className="h-12 w-12 shrink-0 overflow-hidden rounded-xl border border-text/10 bg-text/5">
                      <Image
                        src={
                          s.avatarUrl ||
                          `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(s.nameEnglish || "student")}`
                        }
                        alt=""
                        width={48}
                        height={48}
                        className="h-full w-full object-cover"
                        unoptimized
                      />
                    </span>
                    <div className="min-w-0">
                      <h3 className="truncate text-sm font-bold text-text">{s.nameEnglish}</h3>
                      <p className="text-xs tabular-nums text-text/45">
                        {t("রোল", "Roll")} #{s.rollNumber}
                      </p>
                    </div>
                  </div>

                  <p className="mt-3 flex items-center gap-1.5 text-xs text-text/55">
                    <MapPin className="h-3.5 w-3.5 shrink-0 text-text/35" aria-hidden="true" />
                    <span className="truncate">{s.location || t("অবস্থান নেই", "Location not set")}</span>
                  </p>

                  <dl className="mt-4 space-y-2 rounded-xl border border-text/10 bg-text/3 p-3 text-xs">
                    <div className="flex items-center justify-between">
                      <dt className="text-text/50">{t("উপস্থিতি", "Attendance")}</dt>
                      <dd>
                        {att.rate === null ? (
                          <span className="text-text/45">{t("এখনও নেই", "—")}</span>
                        ) : (
                          <StatusMark tone={att.rate >= 75 ? "done" : "neutral"}>
                            <span className="tabular-nums">{att.rate}%</span>
                          </StatusMark>
                        )}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between">
                      <dt className="text-text/50">{t("ক্লাসে উপস্থিত", "Sessions attended")}</dt>
                      <dd className="font-semibold tabular-nums text-text">
                        {att.attended} / {att.held}
                      </dd>
                    </div>
                    <div className="flex items-center justify-between border-t border-text/10 pt-2">
                      <dt className="text-text/50">{t("ট্র্যাক", "Track")}</dt>
                      <dd className="font-semibold text-text">{ids.length ? ids.join(", ") : "—"}</dd>
                    </div>
                  </dl>

                  <Link
                    href={`/academy/students/${s.rollNumber}`}
                    className="mt-4 inline-flex items-center gap-1 self-start border-t border-text/10 pt-3 text-sm font-semibold text-text underline decoration-text/25 underline-offset-4 transition-colors hover:decoration-text focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-text"
                  >
                    {t("প্রোফাইল ও উপস্থিতি", "Profile & attendance")}
                    <ArrowUpRight className="h-3.5 w-3.5" aria-hidden="true" />
                  </Link>
                </Card>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}
