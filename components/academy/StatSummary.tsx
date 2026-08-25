import { Users, GraduationCap, CheckCircle2, Award } from "lucide-react";
import { ICourse, IStudent } from "@/types/academy";

export default function StatSummary({ courses, students }: { courses: ICourse[]; students: IStudent[] }) {
  let totalAttended = 0, totalHeld = 0, totalExams = 0, passedExams = 0;

  courses.forEach((c) => {
    c.classes?.forEach((cls) => {
      totalAttended += cls.presentStudents.length;
      totalHeld += cls.presentStudents.length + cls.absentStudents.length;
    });
    c.weekendExams?.forEach((e) => {
      e.results.forEach((r) => {
        if (r.attended) {
          totalExams++;
          if (r.score >= e.passMarks) passedExams++;
        }
      });
    });
  });

  const avgAttendance = totalHeld > 0 ? `${((totalAttended / totalHeld) * 100).toFixed(0)}%` : "100%";
  const passRate = totalExams > 0 ? `${((passedExams / totalExams) * 100).toFixed(0)}%` : "100%";

  const stats = [
    { label: "Active Scholars", val: students.length, icon: Users, color: "text-primary", bg: "bg-primary/10" },
    { label: "Mandarin Cohorts", val: courses.length, icon: GraduationCap, color: "text-primary", bg: "bg-primary/10" },
    { label: "Avg Attendance", val: avgAttendance, icon: CheckCircle2, color: "text-secondary", bg: "bg-secondary/10" },
    { label: "Exam Pass Rate", val: passRate, icon: Award, color: "text-secondary", bg: "bg-secondary/10" },
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
      {stats.map((s, idx) => {
        const Icon = s.icon;
        return (
          <div key={idx} className="p-4 rounded-2xl bg-text/5 border border-text/10 flex items-center gap-3.5 transition-colors hover:border-primary/30">
            <div className={`p-3 rounded-xl ${s.bg} ${s.color}`}>
              <Icon className="w-5 h-5" />
            </div>
            <div>
              <p className="text-[11px] font-semibold uppercase tracking-wider text-text/50">{s.label}</p>
              <p className="text-2xl font-extrabold text-text mt-0.5">{s.val}</p>
            </div>
          </div>
        );
      })}
    </div>
  );
}