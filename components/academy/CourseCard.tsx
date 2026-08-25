import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { ICourse } from "@/types/academy";

export default function CourseCard({ course }: { course: ICourse }) {
  const pct = Math.round((course.completedClassesCount / course.totalClassesPlanned) * 100);

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-rose-500/40 transition-all flex flex-col justify-between">
      <div>
        <div className="flex justify-between items-center">
          <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
            {course.courseId}
          </span>
          <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded font-medium">
            {course.targetLevel}
          </span>
        </div>

        <h3 className="font-bold text-white text-lg mt-3">{course.courseName}</h3>
        <p className="text-xs text-slate-400 mt-1">
          {course.totalLessons} Lessons • {course.enrolledStudentRolls.length} Enrolled Scholars
        </p>

        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800/80 flex justify-between text-xs">
          <span className="text-slate-400">Class Progress</span>
          <span className="text-white font-mono font-bold">
            {course.completedClassesCount}/{course.totalClassesPlanned} ({pct}%)
          </span>
        </div>
      </div>

      <div className="mt-5 pt-3 border-t border-slate-800">
        <div className="w-full bg-slate-800 h-1.5 rounded-full overflow-hidden mb-3">
          <div className="bg-gradient-to-r from-rose-500 to-amber-500 h-full rounded-full" style={{ width: `${pct}%` }} />
        </div>
        <Link
          href={`/academy/courses/${course.courseId}`}
          className="flex items-center justify-center gap-1 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors"
        >
          View Syllabus & Classes <ArrowUpRight className="w-3.5 h-3.5" />
        </Link>
      </div>
    </div>
  );
}