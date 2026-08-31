"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, BookOpen, Loader2, RefreshCw } from "lucide-react";
import CourseCard from "@/components/academy/CourseCard";
import { ICourse } from "@/types/academy";

export default function CoursesListPage() {
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  // 👈 সরাসরি MongoDB API থেকে লাইভ কোর্স ডেটা ফেচ
  const fetchCoursesFromMongoDB = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/courses", { cache: "no-store" });
      const data = await res.json();
      if (data.success && data.courses) {
        setCourses(data.courses);
      }
    } catch (err) {
      console.error("Failed to fetch courses from MongoDB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCoursesFromMongoDB();
  }, []);

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex justify-between items-center">
          <Link 
            href="/academy" 
            className="text-xs text-text/50 hover:text-text hover:underline inline-flex items-center gap-1 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Hub
          </Link>

          <button
            onClick={fetchCoursesFromMongoDB}
            className="p-1.5 rounded-xl bg-text/5 hover:bg-text/10 border border-text/10 text-text/60 hover:text-text transition-colors cursor-pointer"
            title="Refresh Live Data from MongoDB"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold flex items-center gap-2">
            <BookOpen className="w-6 h-6 text-secondary" /> Academy Courses
          </h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Explore live Mandarin cohorts, syllabus breakdown, and cohort progress.
          </p>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-24 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs font-mono text-text/50">Fetching Live Courses from MongoDB...</p>
          </div>
        ) : courses.length === 0 ? (
          /* Empty State */
          <div className="p-12 text-center rounded-3xl bg-text/5 border border-text/10 space-y-2">
            <p className="text-sm font-semibold text-text/70">No course tracks found in database.</p>
            <p className="text-xs text-text/40">Courses created from the Admin Console will appear here.</p>
          </div>
        ) : (
          /* Live Course Grid */
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
            {courses.map((course) => (
              <CourseCard key={course._id || course.courseId} course={course} />
            ))}
          </div>
        )}

      </div>
    </div>
  );
}