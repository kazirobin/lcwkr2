import Link from "next/link";
import Image from "next/image";
import { ArrowUpRight, MapPin, XCircle } from "lucide-react";
import { IStudent } from "@/types/academy";
import { academyData } from "@/data/academy";

export default function StudentCard({ student }: { student: IStudent }) {
  const enrolledCourses = student.enrolledCourseIds ?? [];
  const targetRoll = String(student.rollNumber).trim();

  // ১. ডায়নামিকালি কোর্সের ক্লাস থেকে মোট উপস্থিতি গণনা
  let totalHeld = 0;
  let totalAttended = 0;
  const examScores: number[] = [];

  academyData.courses.forEach((course) => {
    if (enrolledCourses.includes(course.courseId)) {
      // ক্লাস উপস্থিতি হিসাব
      const classes = course.classes ?? [];
      totalHeld += classes.length;
      totalAttended += classes.filter((cls) =>
        cls.presentStudents?.some((r) => String(r).trim() === targetRoll)
      ).length;

      // এক্সাম স্কোর হিসাব
      (course.weekendExams ?? []).forEach((exam) => {
        const result = exam.results?.find(
          (r) => String(r.rollNumber).trim() === targetRoll && r.attended
        );
        if (result && typeof result.score === "number") {
          examScores.push(result.score);
        }
      });
    }
  });

  // উপস্থিতি হার (%)
  const attendanceRate =
    totalHeld > 0
      ? `${((totalAttended / totalHeld) * 100).toFixed(0)}%`
      : "100%";

  // এক্সাম এভারেজ
  const examAvg =
    examScores.length > 0
      ? `${(examScores.reduce((a, b) => a + b, 0) / examScores.length).toFixed(1)} pts`
      : "N/A";

  const avatarSrc =
    student.avatarUrl ||
    `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(student.nameEnglish)}`;

  return (
    <div className="p-4 sm:p-5 rounded-2xl bg-text/5 border border-text/10 hover:border-primary/40 transition-all flex flex-col justify-between space-y-4 group relative">
      
      {/* শুধু গ্রুপে যুক্ত না থাকলে (false হলে) ব্যাজ দেখাবে */}
      {!student.isWhatsAppGroupJoined && (
        <div className="absolute top-4 right-4">
          <span
            title="Not in WhatsApp Group"
            className="inline-flex items-center gap-1 text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20"
          >
            <XCircle className="w-3 h-3" /> Not in Group
          </span>
        </div>
      )}

      <div className="space-y-3">
        {/* টপ প্রোফাইল অবতার ও নাম */}
        <div className={`flex items-center gap-3 ${!student.isWhatsAppGroupJoined ? "pr-24" : ""}`}>
          <div className="w-12 h-12 rounded-xl overflow-hidden bg-background border border-text/10 shadow-md shrink-0 flex items-center justify-center">
            <Image
              src={avatarSrc}
              alt={student.nameEnglish}
              width={48}
              height={48}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>
          <div className="min-w-0">
            <h4 className="font-bold text-text text-sm truncate group-hover:text-primary transition-colors">
              {student.nameEnglish}
            </h4>
            <p className="text-xs font-mono text-text/50">
              Roll: {student.rollNumber}
            </p>
          </div>
        </div>

        {/* লোকেশন */}
        {student.location && (
          <div className="flex items-center gap-1 text-[11px] text-text/50 truncate">
            <MapPin className="w-3 h-3 text-secondary shrink-0" />
            <span className="truncate">{student.location}</span>
          </div>
        )}

        {/* ডায়নামিক প্রগ্রেস ও স্কোর বক্স */}
        <div className="p-3 bg-text/5 rounded-xl border border-text/10 space-y-2 text-xs">
          <div className="flex justify-between items-center">
            <span className="text-text/50">Attendance</span>
            <span className="font-mono font-bold text-primary">
              {attendanceRate}{" "}
              <span className="text-[10px] text-text/40 font-normal">
                ({totalAttended}/{totalHeld})
              </span>
            </span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-text/50">Exam Avg</span>
            <span className="font-mono font-bold text-secondary">
              {examAvg}
            </span>
          </div>
        </div>

        {/* এনরোল্ড কোর্স ব্যাজ */}
        <div className="flex gap-1.5 flex-wrap pt-1">
          {enrolledCourses.map((cId) => (
            <span
              key={cId}
              className="text-[10px] font-mono px-2 py-0.5 rounded bg-text/5 text-text/70 border border-text/10"
            >
              {cId}
            </span>
          ))}
        </div>
      </div>

      {/* প্রোফাইল লিংক */}
      <Link
        href={`/academy/students/${student.rollNumber}`}
        className="mt-2 flex items-center justify-center gap-1.5 w-full py-2 bg-text/10 hover:bg-text/20 text-text/70 hover:text-text rounded-lg text-xs font-semibold transition-colors"
      >
        View Profile & Scores <ArrowUpRight className="w-3.5 h-3.5" />
      </Link>
    </div>
  );
}