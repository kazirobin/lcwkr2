import Link from "next/link";
import { ArrowLeft, BookOpen, ArrowUpRight, Sparkles, Clock } from "lucide-react";
import { academyData } from "@/data/academy";

export default function CoursesListPage() {
  const { courses, students } = academyData;

  // রিয়েল-টাইম এনরোল্ড স্টুডেন্ট সংখ্যা গণনার ফাংশন
  const getEnrolledStudentCount = (courseId: string) => {
    return students.filter((student) =>
      student.enrolledCourseIds?.includes(courseId),
    ).length;
  };

  return (
    <div className="min-h-screen bg-background text-text py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <Link
            href="/academy"
            className="text-xs font-semibold text-text/60 hover:text-text inline-flex items-center gap-1 mb-2 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-secondary" />
            All Courses ({courses.length})
          </h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Track active cohorts, upcoming syllabus modules, and course progress
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const completedClasses =
              course.classes?.length ?? course.completedClassesCount ?? 0;
            const pct = Math.round(
              (completedClasses / course.totalClassesPlanned) * 100,
            );

            const enrolledCount = getEnrolledStudentCount(course.courseId);
            const isComingSoon = course.status === "Coming Soon";

            return (
              <div
                key={course.courseId}
                className="p-6 rounded-2xl bg-text/5 border border-text/10 flex flex-col justify-between space-y-5 transition-all hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 relative group"
              >
                <div>
                  {/* Top Header Strip: Course Code, Level & Status Badge */}
                  <div className="flex justify-between items-center gap-2">
                    <div className="flex items-center gap-2">
                      <span className="px-2.5 py-0.5 rounded bg-secondary/10 text-secondary font-mono text-xs font-bold border border-secondary/20">
                        {course.courseId}
                      </span>
                      <span className="text-xs bg-text/5 text-text/70 px-2 py-0.5 rounded border border-text/10">
                        Level: {course.targetLevel}
                      </span>
                    </div>

                    {/* Status Badge */}
                    {course.status === "Running" ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 shadow-sm">
                        <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
                        Running
                      </span>
                    ) : isComingSoon ? (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-amber-500/10 text-amber-500 border border-amber-500/20 shadow-sm">
                        <Clock className="w-3 h-3" />
                        Coming Soon
                      </span>
                    ) : (
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[11px] font-bold bg-text/10 text-text/60 border border-text/20">
                        Completed
                      </span>
                    )}
                  </div>

                  {/* Course Title & Enrolled Info */}
                  <h2 className="text-xl font-bold text-text mt-3">
                    {course.courseName}
                  </h2>
                  <p className="text-xs text-text/50 mt-1">
                    {course.totalLessons} Lessons in Syllabus • {enrolledCount}{" "}
                    Enrolled Scholars
                  </p>

                  {/* Progress or Coming Soon Schedule Box */}
                  {isComingSoon ? (
                    <div className="mt-4 p-3.5 rounded-xl bg-amber-500/5 border border-amber-500/20 text-xs flex items-center justify-between">
                      <span className="text-text/60 flex items-center gap-1.5">
                        <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Expected Launch
                      </span>
                      <span className="text-amber-500 font-mono font-bold">
                        {course.nextBatchRegistrationDate || "Q4 2026"}
                      </span>
                    </div>
                  ) : (
                    <div className="mt-4 p-3 rounded-xl bg-text/5 border border-text/10 text-xs flex justify-between items-center">
                      <span className="text-text/50">Class Progress</span>
                      <div className="flex items-center gap-2">
                        <span className="text-text font-mono font-bold">
                          {completedClasses} / {course.totalClassesPlanned} ({pct}%)
                        </span>
                        <div className="w-16 h-1.5 bg-text/10 rounded-full overflow-hidden hidden sm:block">
                          <div 
                            className="h-full bg-secondary rounded-full" 
                            style={{ width: `${pct}%` }} 
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Card Action Button */}
                <Link
                  href={`/academy/courses/${course.courseId}`}
                  className={`flex items-center justify-center gap-1.5 w-full py-2.5 rounded-xl text-xs font-semibold transition-all ${
                    isComingSoon
                      ? "bg-text/10 hover:bg-text/20 text-text border border-text/10"
                      : "bg-secondary hover:bg-secondary/90 text-white shadow-lg shadow-secondary/25"
                  }`}
                >
                  {isComingSoon ? "View Preview & Syllabus" : "View Classes & Syllabus"}{" "}
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}