import Link from "next/link";
import { ArrowLeft, BookOpen, ArrowUpRight } from "lucide-react";
import { academyData } from "@/data/academyData";

export default function CoursesListPage() {
  const { courses } = academyData;

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
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const pct = Math.round((course.completedClassesCount / course.totalClassesPlanned) * 100);

            return (
              <div
                key={course.courseId}
                className="p-6 rounded-2xl bg-text/5 border border-text/10 flex flex-col justify-between space-y-4 transition-colors hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded bg-secondary/10 text-secondary font-mono text-xs font-bold border border-secondary/20">
                      {course.courseId}
                    </span>
                    <span className="text-xs bg-text/5 text-text/70 px-2 py-0.5 rounded border border-text/10">
                      {course.targetLevel}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-text mt-3">{course.courseName}</h2>
                  <p className="text-xs text-text/50 mt-1">
                    {course.totalLessons} Lessons in Syllabus • {course.enrolledStudentRolls.length} Students
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-text/5 border border-text/10 text-xs flex justify-between">
                    <span className="text-text/50">Class Progress</span>
                    <span className="text-text font-mono font-bold">
                      {course.completedClassesCount} / {course.totalClassesPlanned} ({pct}%)
                    </span>
                  </div>
                </div>

                <Link
                  href={`/academy/courses/${course.courseId}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-semibold transition-all shadow-lg shadow-secondary/25"
                >
                  View Classes & Syllabus <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}