import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, ArrowUpRight, GraduationCap, CheckCircle2, Award } from "lucide-react";
import { academyData } from "@/data/academyData";

export default function AcademyMainPage() {
  const { courses, students, institution, instructor } = academyData;

  const totalClasses = courses.reduce((acc, c) => acc + c.completedClassesCount, 0);

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/20 border border-slate-800 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-widest text-rose-400 font-mono">
                {institution}
              </span>
              <span className="text-slate-600">•</span>
              <span className="text-xs text-slate-400">Instructor: {instructor}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white flex items-center gap-2.5">
              <LayoutDashboard className="w-7 h-7 text-rose-500" />
              Academy Dashboard
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/academy/courses"
              className="px-4 py-2 bg-slate-800 hover:bg-slate-700 text-xs font-semibold rounded-xl text-slate-200 transition-colors"
            >
              All Courses ({courses.length})
            </Link>
            <Link
              href="/academy/students"
              className="px-4 py-2 bg-rose-600 hover:bg-rose-500 text-xs font-semibold rounded-xl text-white transition-colors"
            >
              All Students ({students.length})
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-medium">Students</p>
            <p className="text-2xl font-bold text-white mt-1">{students.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-medium">Active Cohorts</p>
            <p className="text-2xl font-bold text-amber-400 mt-1">{courses.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-medium">Completed Classes</p>
            <p className="text-2xl font-bold text-emerald-400 mt-1">{totalClasses}</p>
          </div>
          <div className="p-4 rounded-xl bg-slate-900/60 border border-slate-800">
            <p className="text-xs text-slate-400 uppercase font-medium">HSK Levels</p>
            <p className="text-2xl font-bold text-sky-400 mt-1">HSK 1 - 2</p>
          </div>
        </div>

        {/* Courses Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-rose-400" /> Mandarin Cohorts
            </h2>
            <Link href="/academy/courses" className="text-xs text-rose-400 hover:underline">
              View All Courses &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Link
                key={course.courseId}
                href={`/academy/courses/${course.courseId}`}
                className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
                      {course.courseId}
                    </span>
                    <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
                      {course.targetLevel}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-white mt-3 group-hover:text-rose-400 transition-colors">
                    {course.courseName}
                  </h3>
                  <p className="text-xs text-slate-400 mt-1">
                    {course.totalLessons} Lessons • {course.enrolledStudentRolls.length} Enrolled
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-slate-800 flex justify-between items-center text-xs text-slate-400">
                  <span>Classes: {course.completedClassesCount}/{course.totalClassesPlanned}</span>
                  <span className="text-rose-400 font-semibold flex items-center gap-1">
                    Open Syllabus <ArrowUpRight className="w-3.5 h-3.5" />
                  </span>
                </div>
              </Link>
            ))}
          </div>
        </div>

        {/* Students Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Users className="w-5 h-5 text-emerald-400" /> Enrolled Scholars
            </h2>
            <Link href="/academy/students" className="text-xs text-emerald-400 hover:underline">
              View All Students &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {students.map((student) => (
              <Link
                key={student.rollNumber}
                href={`/academy/students/${student.rollNumber}`}
                className="p-4 rounded-xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex items-center gap-3 group"
              >
             
             
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-white text-sm truncate group-hover:text-emerald-400 transition-colors">
                    {student.nameEnglish}
                  </h4>
                  <p className="text-xs font-mono text-slate-400">{student.rollNumber}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}