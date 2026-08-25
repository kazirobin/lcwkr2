import Link from "next/link";
import { ArrowLeft, BookOpen, ArrowUpRight } from "lucide-react";
import { academyData } from "@/data/academyData";

export default function CoursesListPage() {
  const { courses } = academyData;

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <div>
          <Link
            href="/academy"
            className="text-xs font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1 mb-2"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
            <BookOpen className="w-7 h-7 text-rose-500" />
            All Courses ({courses.length})
          </h1>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {courses.map((course) => {
            const pct = Math.round((course.completedClassesCount / course.totalClassesPlanned) * 100);

            return (
              <div
                key={course.courseId}
                className="p-6 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4"
              >
                <div>
                  <div className="flex justify-between items-start">
                    <span className="px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 font-mono text-xs font-bold border border-rose-500/20">
                      {course.courseId}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {course.targetLevel}
                    </span>
                  </div>

                  <h2 className="text-xl font-bold text-white mt-3">{course.courseName}</h2>
                  <p className="text-xs text-slate-400 mt-1">
                    {course.totalLessons} Lessons in Syllabus • {course.enrolledStudentRolls.length} Students
                  </p>

                  <div className="mt-4 p-3 rounded-xl bg-slate-950 border border-slate-800 text-xs flex justify-between">
                    <span className="text-slate-400">Class Progress</span>
                    <span className="text-slate-200 font-mono font-bold">
                      {course.completedClassesCount} / {course.totalClassesPlanned} ({pct}%)
                    </span>
                  </div>
                </div>

                <Link
                  href={`/academy/courses/${course.courseId}`}
                  className="flex items-center justify-center gap-1.5 w-full py-2.5 bg-rose-600 hover:bg-rose-500 text-white rounded-xl text-xs font-semibold transition-colors"
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