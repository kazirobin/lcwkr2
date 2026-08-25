import Link from "next/link";
import { LayoutDashboard, BookOpen, Users, ArrowUpRight, GraduationCap, CheckCircle2, Award } from "lucide-react";
import { academyData } from "@/data/academyData";

export default function AcademyMainPage() {
  const { courses, students, institution, instructor } = academyData;

  const totalClasses = courses.reduce((acc, c) => acc + c.completedClassesCount, 0);

  return (
    <div className="min-h-screen bg-background text-text py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-10">
        
        {/* Banner */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-secondary/10 via-background/80 to-primary/10 border border-text/10 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 transition-colors">
          <div>
            <div className="flex items-center gap-2 mb-1">
              <span className="text-xs uppercase font-bold tracking-widest text-secondary font-mono">
                {institution}
              </span>
              <span className="text-text/30">•</span>
              <span className="text-xs text-text/50">Instructor: {instructor}</span>
            </div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text flex items-center gap-2.5">
              <LayoutDashboard className="w-7 h-7 text-secondary" />
              Academy Dashboard
            </h1>
          </div>
          <div className="flex gap-2">
            <Link
              href="/academy/courses"
              className="px-4 py-2 bg-text/10 hover:bg-text/20 text-text/70 hover:text-text text-xs font-semibold rounded-xl transition-colors"
            >
              All Courses ({courses.length})
            </Link>
            <Link
              href="/academy/students"
              className="px-4 py-2 bg-secondary hover:bg-secondary/90 text-white text-xs font-semibold rounded-xl transition-colors shadow-lg shadow-secondary/25"
            >
              All Students ({students.length})
            </Link>
          </div>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="p-4 rounded-xl bg-text/5 border border-text/10 transition-colors">
            <p className="text-xs text-text/50 uppercase font-medium">Students</p>
            <p className="text-2xl font-bold text-text mt-1">{students.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-text/5 border border-text/10 transition-colors">
            <p className="text-xs text-text/50 uppercase font-medium">Active Cohorts</p>
            <p className="text-2xl font-bold text-primary mt-1">{courses.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-text/5 border border-text/10 transition-colors">
            <p className="text-xs text-text/50 uppercase font-medium">Completed Classes</p>
            <p className="text-2xl font-bold text-primary mt-1">{totalClasses}</p>
          </div>
          <div className="p-4 rounded-xl bg-text/5 border border-text/10 transition-colors">
            <p className="text-xs text-text/50 uppercase font-medium">HSK Levels</p>
            <p className="text-2xl font-bold text-secondary mt-1">HSK 1 - 2</p>
          </div>
        </div>

        {/* Courses Section */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" /> Mandarin Cohorts
            </h2>
            <Link href="/academy/courses" className="text-xs text-secondary hover:text-secondary/80 transition-colors">
              View All Courses &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <Link
                key={course.courseId}
                href={`/academy/courses/${course.courseId}`}
                className="p-5 rounded-2xl bg-text/5 border border-text/10 hover:border-secondary/40 transition-all flex flex-col justify-between group"
              >
                <div>
                  <div className="flex justify-between items-center">
                    <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
                      {course.courseId}
                    </span>
                    <span className="text-xs bg-text/5 text-text/70 px-2 py-0.5 rounded border border-text/10">
                      {course.targetLevel}
                    </span>
                  </div>
                  <h3 className="text-lg font-bold text-text mt-3 group-hover:text-secondary transition-colors">
                    {course.courseName}
                  </h3>
                  <p className="text-xs text-text/50 mt-1">
                    {course.totalLessons} Lessons • {course.enrolledStudentRolls.length} Enrolled
                  </p>
                </div>
                <div className="mt-4 pt-3 border-t border-text/10 flex justify-between items-center text-xs text-text/50">
                  <span>Classes: {course.completedClassesCount}/{course.totalClassesPlanned}</span>
                  <span className="text-secondary font-semibold flex items-center gap-1">
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
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <Users className="w-5 h-5 text-primary" /> Enrolled Scholars
            </h2>
            <Link href="/academy/students" className="text-xs text-primary hover:text-primary/80 transition-colors">
              View All Students &rarr;
            </Link>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {students.map((student) => (
              <Link
                key={student.rollNumber}
                href={`/academy/students/${student.rollNumber}`}
                className="p-4 rounded-xl bg-text/5 border border-text/10 hover:border-primary/40 transition-all flex items-center gap-3 group"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center font-mono text-sm font-bold text-white shadow-md shrink-0">
                  {student.nameEnglish.charAt(0)}
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-bold text-text text-sm truncate group-hover:text-primary transition-colors">
                    {student.nameEnglish}
                  </h4>
                  <p className="text-xs font-mono text-text/50">{student.rollNumber}</p>
                </div>
              </Link>
            ))}
          </div>
        </div>

      </div>
    </div>
  );
}