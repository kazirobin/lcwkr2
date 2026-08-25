import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import { IStudent } from "@/types/academy";

export default function StudentCard({ student }: { student: IStudent }) {
  const firstCourseId = student.enrolledCourseIds[0];
  const prog = student.courseProgress[firstCourseId];

  return (
    <div className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 hover:border-emerald-500/40 transition-all flex flex-col justify-between">
      <div>
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-xl bg-gradient-to-tr from-rose-600 to-amber-600 flex items-center justify-center font-serif text-lg font-bold text-white shadow-md">
            {student.nameChinese}
          </div>
          <div>
            <h4 className="font-bold text-white text-sm">{student.nameEnglish}</h4>
            <p className="text-xs font-mono text-slate-400">{student.rollNumber}</p>
          </div>
        </div>

        <div className="mt-4 p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2 text-xs">
          <div className="flex justify-between">
            <span className="text-slate-400">Attendance</span>
            <span className="font-mono font-bold text-emerald-400">{prog?.attendanceRate || "100%"}</span>
          </div>
          <div className="flex justify-between">
            <span className="text-slate-400">Exam Avg</span>
            <span className="font-mono font-bold text-amber-400">
              {prog?.examAverage !== null ? `${prog.examAverage} pts` : "N/A"}
            </span>
          </div>
        </div>

        <div className="mt-3 flex gap-1 flex-wrap">
          {student.enrolledCourseIds.map((cId) => (
            <span key={cId} className="text-[10px] font-mono px-2 py-0.5 rounded bg-slate-800 text-slate-300">
              {cId}
            </span>
          ))}
        </div>
      </div>

      <Link
        href={`/academy/students/${student.rollNumber}`}
        className="mt-4 flex items-center justify-center gap-1 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors"
      >
        View Profile & Scores <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}