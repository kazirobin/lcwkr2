"use client";

import { useState, useEffect, useCallback } from "react";
import { RefreshCw } from "lucide-react";
import { CourseCard, ICourse } from "@/features/academy";
import { useLanguage } from "@/i18n";
import {
  Breadcrumb,
  EmptyState,
  Eyebrow,
  IconButton,
  LoadingBlock,
  PageHeader,
  SectionHanzi,
} from "@/components/ui";

export default function CoursesListPage() {
  const { language } = useLanguage();
  const t = useCallback(
    (bn: string, en: string) => (language === "bn" ? bn : en),
    [language],
  );

  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchCourses = useCallback(async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/courses", { cache: "no-store" });
      const data = await res.json();
      if (data.success && Array.isArray(data.courses)) setCourses(data.courses);
    } catch (err) {
      console.error("Failed to fetch courses:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchCourses();
  }, [fetchCourses]);

  return (
    <div className="relative isolate mx-auto max-w-6xl px-4 pt-28 pb-20 sm:px-6 lg:px-8">
      <SectionHanzi char="课" className="-top-10 right-0" />

      <Breadcrumb
        items={[
          { label: t("হোম", "Home"), href: "/" },
          { label: t("একাডেমি", "Academy"), href: "/academy" },
          { label: t("কোর্স", "Courses") },
        ]}
      />

      <PageHeader
        className="mt-6"
        eyebrow={<Eyebrow seal="课" label={t("ম্যান্ডারিন কোর্স", "Mandarin courses")} />}
        title={t("একাডেমি কোর্সসমূহ", "Academy courses")}
        lede={t(
          "লাইভ ব্যাচ, সিলেবাসের বিভাজন ও ব্যাচের অগ্রগতি।",
          "Live cohorts, syllabus breakdown, and where each batch has reached.",
        )}
        actions={
          <IconButton
            label={t("তালিকা রিফ্রেশ করুন", "Refresh list")}
            size="sm"
            spinning={loading}
            onClick={fetchCourses}
          >
            <RefreshCw className="h-4 w-4" />
          </IconButton>
        }
      />

      <div className="mt-10">
        {loading ? (
          <LoadingBlock label={t("কোর্স লোড হচ্ছে", "Loading courses")} rows={3} />
        ) : courses.length === 0 ? (
          <EmptyState
            title={t("এখনও কোনো কোর্স নেই", "No courses yet")}
            description={t(
              "নতুন ব্যাচ চালু হলে এখানে দেখা যাবে।",
              "New cohorts will appear here once they open.",
            )}
          />
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {courses.map((course) => (
              <CourseCard key={course._id || course.courseId} course={course} />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
