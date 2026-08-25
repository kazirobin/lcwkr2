import Link from "next/link";
import { 
  LayoutDashboard, 
  BookOpen, 
  Users, 
  ArrowUpRight, 
  MapPin, 
  CheckCircle2
} from "lucide-react";
import { academyData } from "@/data/academyData";

export default function AcademyMainPage() {
  const { courses, students, institution, instructor } = academyData;

  const totalClasses = courses.reduce((acc, c) => acc + (c.completedClassesCount ?? c.classes?.length ?? 0), 0);

  // Dynamic Attendance Calculation Helper (Safe String/Number Check)
  const getStudentStats = (rollNumber: string | number, enrolledCourseIds: string[]) => {
    let totalHeld = 0;
    let totalAttended = 0;
    const targetRoll = String(rollNumber).trim();

    courses.forEach((course) => {
      if (enrolledCourseIds.includes(course.courseId)) {
        const classes = course.classes ?? [];
        totalHeld += classes.length;
        totalAttended += classes.filter((cls) =>
          cls.presentStudents?.some((r) => String(r).trim() === targetRoll)
        ).length;
      }
    });

    const attendanceRate = totalHeld > 0 ? `${((totalAttended / totalHeld) * 100).toFixed(0)}%` : "100%";
    return { totalHeld, totalAttended, attendanceRate };
  };

  // Real-time enrolled students count per course
  const getEnrolledStudentCount = (courseId: string) => {
    return students.filter((student) =>
      student.enrolledCourseIds?.includes(courseId)
    ).length;
  };

  return (
    <div className="min-h-screen bg-background text-text py-6 sm:py-10 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Minimal Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-text/10 pb-5">
          <div>
            <div className="flex items-center gap-2 mb-1 text-xs font-mono">
              <span className="font-bold text-secondary uppercase tracking-widest">{institution}</span>
              <span className="text-text/30">•</span>
              <span className="text-text/50">Instructor: {instructor}</span>
            </div>
            <h1 className="text-xl sm:text-2xl font-bold text-text flex items-center gap-2">
              <LayoutDashboard className="w-5 h-5 text-secondary shrink-0" />
              Academy Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2">
            <Link
              href="/academy/courses"
              className="px-3.5 py-1.5 bg-text/5 hover:bg-text/10 border border-text/10 rounded-lg text-xs font-medium transition-colors"
            >
              Courses ({courses.length})
            </Link>
            <Link
              href="/academy/students"
              className="px-3.5 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 rounded-lg text-xs font-semibold transition-colors"
            >
              Students ({students.length})
            </Link>
          </div>
        </div>

        {/* Flat Stat Ribbon Table */}
        <div className="grid grid-cols-2 sm:grid-cols-4 divide-x divide-y sm:divide-y-0 divide-text/10 border border-text/10 rounded-xl bg-text/[0.02] overflow-hidden text-center">
          <div className="p-3.5 sm:p-4">
            <span className="text-[11px] font-mono uppercase text-text/50 block">Students</span>
            <span className="text-lg sm:text-xl font-bold text-text mt-0.5 block">{students.length}</span>
          </div>
          <div className="p-3.5 sm:p-4">
            <span className="text-[11px] font-mono uppercase text-text/50 block">Active Cohorts</span>
            <span className="text-lg sm:text-xl font-bold text-primary mt-0.5 block">{courses.length}</span>
          </div>
          <div className="p-3.5 sm:p-4">
            <span className="text-[11px] font-mono uppercase text-text/50 block">Total Classes</span>
            <span className="text-lg sm:text-xl font-bold text-secondary mt-0.5 block">{totalClasses}</span>
          </div>
          <div className="p-3.5 sm:p-4">
            <span className="text-[11px] font-mono uppercase text-text/50 block">HSK Tracks</span>
            <span className="text-lg sm:text-xl font-bold text-text mt-0.5 block">HSK 1 - 2</span>
          </div>
        </div>

        {/* 1. Courses Table View */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-text flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-secondary" />
              Active Mandarin Cohorts
            </h2>
            <Link href="/academy/courses" className="text-xs text-secondary hover:underline">
              View All Courses &rarr;
            </Link>
          </div>

          <div className="border border-text/10 rounded-xl overflow-hidden bg-text/[0.01]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-text/80 min-w-[580px]">
                <thead className="bg-text/5 border-b border-text/10 font-semibold text-text/60">
                  <tr>
                    <th className="py-2.5 px-3.5">Course Code</th>
                    <th className="py-2.5 px-3.5">Title</th>
                    <th className="py-2.5 px-3.5">Level</th>
                    <th className="py-2.5 px-3.5">Syllabus Progress</th>
                    <th className="py-2.5 px-3.5">Enrolled</th>
                    <th className="py-2.5 px-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/10">
                  {courses.map((course) => {
                    const completedClasses = course.classes?.length ?? course.completedClassesCount ?? 0;
                    const pct = Math.round((completedClasses / course.totalClassesPlanned) * 100);
                    const enrolledCount = getEnrolledStudentCount(course.courseId);

                    return (
                      <tr key={course.courseId} className="hover:bg-text/[0.03] transition-colors group">
                        <td className="py-3 px-3.5 font-mono font-bold text-secondary">
                          {course.courseId}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-text">
                          {course.courseName}
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="px-2 py-0.5 bg-text/5 border border-text/10 rounded text-[11px]">
                            {course.targetLevel}
                          </span>
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="space-y-1 w-32">
                            <div className="flex justify-between text-[11px] font-mono text-text/60">
                              <span>{completedClasses}/{course.totalClassesPlanned}</span>
                              <span>{pct}%</span>
                            </div>
                            <div className="w-full h-1 bg-text/10 rounded-full overflow-hidden">
                              <div className="h-full bg-secondary rounded-full" style={{ width: `${pct}%` }} />
                            </div>
                          </div>
                        </td>
                        <td className="py-3 px-3.5 font-mono">
                          {enrolledCount} Students
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <Link
                            href={`/academy/courses/${course.courseId}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-secondary hover:underline"
                          >
                            Details <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* 2. Students Table View */}
        <div className="space-y-3">
          <div className="flex items-center justify-between">
            <h2 className="text-sm sm:text-base font-bold text-text flex items-center gap-1.5">
              <Users className="w-4 h-4 text-primary" />
              Enrolled Students Directory
            </h2>
            <Link href="/academy/students" className="text-xs text-primary hover:underline">
              View All Students &rarr;
            </Link>
          </div>

          <div className="border border-text/10 rounded-xl overflow-hidden bg-text/[0.01]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs text-text/80 min-w-[580px]">
                <thead className="bg-text/5 border-b border-text/10 font-semibold text-text/60">
                  <tr>
                    <th className="py-2.5 px-3.5">Roll No</th>
                    <th className="py-2.5 px-3.5">Student Name</th>
                    <th className="py-2.5 px-3.5">Location</th>
                    <th className="py-2.5 px-3.5">Enrolled Tracks</th>
                    <th className="py-2.5 px-3.5">Attendance</th>
                    <th className="py-2.5 px-3.5 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/10">
                  {students.map((student) => {
                    const { totalHeld, totalAttended, attendanceRate } = getStudentStats(
                      student.rollNumber,
                      student.enrolledCourseIds ?? []
                    );

                    return (
                      <tr key={String(student.rollNumber)} className="hover:bg-text/[0.03] transition-colors group">
                        <td className="py-3 px-3.5 font-mono font-bold text-text">
                          {student.rollNumber}
                        </td>
                        <td className="py-3 px-3.5 font-semibold text-text flex items-center gap-2">
                          <div className="w-6 h-6 rounded bg-secondary/10 text-secondary border border-secondary/20 flex items-center justify-center font-mono text-xs font-bold shrink-0">
                            {student.nameEnglish.charAt(0)}
                          </div>
                          <span className="truncate">{student.nameEnglish}</span>
                        </td>
                        <td className="py-3 px-3.5 text-text/60">
                          <span className="inline-flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-secondary/60 shrink-0" />
                            {student.location || "N/A"}
                          </span>
                        </td>
                        <td className="py-3 px-3.5">
                          <div className="flex gap-1 flex-wrap font-mono text-[10px]">
                            {student.enrolledCourseIds?.map((cId) => (
                              <span key={cId} className="px-1.5 py-0.5 bg-text/5 border border-text/10 rounded">
                                {cId}
                              </span>
                            ))}
                          </div>
                        </td>
                        <td className="py-3 px-3.5">
                          <span className="inline-flex items-center gap-1 font-mono font-bold text-primary">
                            <CheckCircle2 className="w-3 h-3 text-primary shrink-0" />
                            {attendanceRate} <span className="text-[10px] text-text/40 font-normal">({totalAttended}/{totalHeld})</span>
                          </span>
                        </td>
                        <td className="py-3 px-3.5 text-right">
                          <Link
                            href={`/academy/students/${student.rollNumber}`}
                            className="inline-flex items-center gap-1 text-xs font-semibold text-primary hover:underline"
                          >
                            View <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}