import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ICourse } from "@/types/academy";

export default function CourseCard({ course }: { course: ICourse }) {
  // ১. ক্লাসের কাউন্ট এবং পার্সেন্টেজ হিসাব (ডিফল্ট ফলব্যাক সহ)
  const completedCount = course.completedClassesCount ?? course.classes?.length ?? 0;
  const totalPlanned = course.totalClassesPlanned || 24;
  const pct = Math.min(100, Math.round((completedCount / totalPlanned) * 100) || 0);

  // ২. অপশনাল enrolledStudentRolls থেকে নিরাপদে দৈর্ঘ্য বের করা
  const enrolledCount = course.enrolledStudentRolls?.length ?? 0;

  return (
    <div className="p-5 rounded-2xl bg-text/5 border border-text/10 hover:border-secondary/40 transition-all flex flex-col justify-between group">
      <div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
            {course.courseId}
          </span>
          <span className="text-xs bg-text/5 text-text/70 px-2 py-0.5 rounded font-medium border border-text/10">
            {course.targetLevel}
          </span>
        </div>

        <h3 className="font-bold text-text text-lg mt-3 group-hover:text-secondary transition-colors">
          {course.courseName}
        </h3>
        <p className="text-xs text-text/50 mt-1">
          {course.totalLessons} Lessons
          {enrolledCount > 0 ? ` • ${enrolledCount} Enrolled Scholars` : ""}
        </p>

        <div className="mt-4 p-3 bg-text/5 rounded-xl border border-text/10 flex justify-between text-xs">
          <span className="text-text/50">Class Progress</span>
          <span className="text-text font-mono font-bold">
            {completedCount}/{totalPlanned} ({pct}%)
          </span>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-text/10">
        <div className="w-full bg-text/10 h-1.5 rounded-full overflow-hidden mb-3">
          <div
            className="bg-gradient-to-r from-secondary to-primary h-full rounded-full transition-all duration-500"
            style={{ width: `${pct}%` }}
          />
        </div>
        <Link
          href={`/academy/courses/${course.courseId}`}
          className="flex items-center justify-center gap-1 w-full py-2 bg-text/10 hover:bg-text/20 text-text/70 hover:text-text rounded-lg text-xs font-semibold transition-colors"
        >
          View Syllabus & Classes <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}