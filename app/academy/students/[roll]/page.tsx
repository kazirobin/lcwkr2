"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import { 
  ArrowLeft, 
  BookOpen, 
  Award, 
  CheckCircle2, 
  XCircle, 
  ArrowUpRight, 
  MapPin, 
  MessageSquare, 
  Lock, 
  Unlock, 
  Eye, 
  EyeOff, 
  X, 
  KeyRound 
} from "lucide-react";
import { academyData } from "@/data/academyData";

// আপনার অ্যাডমিন সিক্রেট পিন/পাসকোড সেট করুন
const ADMIN_SECRET_PIN = "8131";

export default function StudentDetailPage() {
  const params = useParams();
  const rawRoll = params?.roll;
  const rollNumber = Array.isArray(rawRoll) ? rawRoll[0] : (rawRoll as string);

  const student = academyData.students.find((s) => s.rollNumber === rollNumber);

  // Admin visibility states
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Check if admin is already authenticated in this session
  useEffect(() => {
    const savedAdminStatus = sessionStorage.getItem("academy_admin_unlocked");
    if (savedAdminStatus === "true") {
      setIsAdminUnlocked(true);
    }
  }, []);

  const handleUnlockAdmin = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin === ADMIN_SECRET_PIN) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem("academy_admin_unlocked", "true");
      setShowAdminModal(false);
      setEnteredPin("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleLockAdmin = () => {
    setIsAdminUnlocked(false);
    sessionStorage.removeItem("academy_admin_unlocked");
  };

  // Helper function: Mask WhatsApp number for public view
  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 8) return "••••••••••";
    const start = phone.slice(0, 5);
    const end = phone.slice(-3);
    return `${start} •••• ${end}`;
  };

  if (!student) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center p-4 text-center space-y-4 transition-colors duration-300">
        <h2 className="text-lg sm:text-xl font-bold text-secondary">Student &quot;{rollNumber}&quot; Not Found</h2>
        <Link href="/academy/students" className="text-xs sm:text-sm text-text/60 hover:text-text underline transition-colors">
          &larr; Back to Directory
        </Link>
      </div>
    );
  }

  // Calculate dynamic attendance from course classes
  const getCourseAttendanceStats = (courseId: string) => {
    const course = academyData.courses.find((c) => c.courseId === courseId);
    const classes = course?.classes ?? [];
    const totalHeld = classes.length;

    const attendedClasses = classes.filter((cls) => cls.presentStudents?.includes(student.rollNumber));
    const absentClasses = classes.filter((cls) => cls.absentStudents?.includes(student.rollNumber));

    const attendedCount = attendedClasses.length;
    const absentCount = absentClasses.length;
    const rate = totalHeld > 0 ? `${((attendedCount / totalHeld) * 100).toFixed(1)}%` : "100%";

    return { totalHeld, attendedCount, absentCount, rate, classes };
  };

  // Calculate dynamic exam average from weekend exams
  const getCourseExamAverage = (courseId: string) => {
    const course = academyData.courses.find((c) => c.courseId === courseId);
    const exams = course?.weekendExams ?? [];

    const scores: number[] = [];
    exams.forEach((exam) => {
      const res = exam.results?.find((r) => r.rollNumber === student.rollNumber && r.attended);
      if (res && typeof res.score === "number") {
        scores.push(res.score);
      }
    });

    if (scores.length === 0) return null;
    const avg = scores.reduce((acc, curr) => acc + curr, 0) / scores.length;
    return Number(avg.toFixed(1));
  };

  // Collect all exams attended by the student
  const studentExams = academyData.courses.flatMap((c) =>
    (c.weekendExams ?? []).flatMap((e) => {
      const res = (e.results ?? []).find((r) => r.rollNumber === student.rollNumber);
      if (!res) return [];
      return [
        {
          courseId: c.courseId,
          courseName: c.courseName,
          examTitle: e.examTitle,
          date: e.date,
          totalMarks: e.totalMarks,
          passMarks: e.passMarks,
          ...res,
        },
      ];
    })
  );

  return (
    <div className="min-h-screen bg-background text-text py-6 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Navigation & Admin Auth Bar */}
        <div className="flex items-center justify-between">
          <Link
            href="/academy/students"
            className="inline-flex items-center gap-1.5 text-xs sm:text-sm font-semibold text-text/60 hover:text-text transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" /> Back to Directory
          </Link>

          {/* Admin Toggle Indicator */}
          {isAdminUnlocked ? (
            <button
              onClick={handleLockAdmin}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/30 transition-all"
            >
              <Unlock className="w-3.5 h-3.5 text-primary" />
              <span>Admin Mode Active</span>
              <EyeOff className="w-3 h-3 ml-1 opacity-70" />
            </button>
          ) : (
            <button
              onClick={() => {
                setEnteredPin("");
                setPinError(false);
                setShowAdminModal(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-text/5 border border-text/10 text-text/50 hover:text-text/70 text-xs font-semibold hover:border-text/20 transition-all"
            >
              <Lock className="w-3.5 h-3.5 text-primary" />
              <span>Admin Unlock</span>
            </button>
          )}
        </div>

        {/* Identity Hero */}
        <div className="p-4 sm:p-6 lg:p-7 rounded-2xl bg-gradient-to-r from-secondary/10 via-background/80 to-primary/10 border border-text/10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 transition-colors">
          <div className="flex items-center gap-3.5 sm:gap-5">
            <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center font-mono text-xl sm:text-2xl font-bold text-white shadow-xl shrink-0">
              {student.nameEnglish.charAt(0)}
            </div>
            <div className="min-w-0">
              <span className="font-mono text-[10px] sm:text-xs font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20 inline-block">
                {student.rollNumber}
              </span>
              <h1 className="text-lg sm:text-2xl lg:text-3xl font-bold text-text mt-1 break-words">
                {student.nameEnglish}
              </h1>
              
              {/* Location & Protected WhatsApp Row */}
              <div className="flex flex-wrap items-center gap-2 sm:gap-3 mt-2 text-xs text-text/70">
                <span className="inline-flex items-center gap-1 bg-text/5 px-2 py-0.5 rounded border border-text/10">
                  <MapPin className="w-3 h-3 text-secondary shrink-0" /> {student.location}
                </span>

                {/* Conditional WhatsApp Display */}
                {isAdminUnlocked ? (
                  <a
                    href={`https://wa.me/${student.whatsapp.replace(/[^0-9]/g, "")}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-primary bg-primary/10 border border-primary/20 px-2.5 py-0.5 rounded-md hover:bg-primary/20 transition-colors font-mono font-medium"
                  >
                    <MessageSquare className="w-3 h-3 text-primary shrink-0" />
                    <span>{student.whatsapp}</span>
                    <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.2 rounded font-sans">Chat</span>
                  </a>
                ) : (
                  <button
                    onClick={() => {
                      setEnteredPin("");
                      setPinError(false);
                      setShowAdminModal(true);
                    }}
                    className="inline-flex items-center gap-1.5 text-text/40 bg-text/5 border border-text/10 px-2.5 py-0.5 rounded-md hover:border-text/20 hover:text-text/60 transition-colors group"
                  >
                    <Lock className="w-3 h-3 text-primary shrink-0" />
                    <span className="font-mono">{maskPhoneNumber(student.whatsapp)}</span>
                    <span className="text-[10px] text-text/30 group-hover:text-text/40 font-sans">(Hidden)</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Dynamic Enrolled Courses & Detailed Attendance Breakdown */}
        <div className="space-y-3 sm:space-y-4">
          <h2 className="text-base sm:text-lg font-bold text-text flex items-center gap-2">
            <BookOpen className="w-4 h-4 sm:w-5 sm:h-5 text-secondary shrink-0" /> Enrolled Courses & Attendance Breakdown
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-4 sm:gap-6">
            {student.enrolledCourseIds?.map((cId) => {
              const crs = academyData.courses.find((c) => c.courseId === cId);
              const { totalHeld, attendedCount, absentCount, rate, classes } = getCourseAttendanceStats(cId);
              const examAvg = getCourseExamAverage(cId);

              return (
                <div key={cId} className="p-4 sm:p-6 rounded-2xl bg-text/5 border border-text/10 space-y-4 sm:space-y-5 flex flex-col justify-between transition-colors hover:border-primary/30">
                  <div className="space-y-3 sm:space-y-4">
                    {/* Course Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                      <div>
                        <div className="flex flex-wrap items-center gap-1.5 sm:gap-2 mb-1">
                          <span className="font-mono text-[10px] sm:text-xs font-bold text-secondary px-2 py-0.5 rounded bg-secondary/10 border border-secondary/20">
                            {cId}
                          </span>
                          <span className="text-[10px] sm:text-xs bg-text/5 text-text/70 px-2 py-0.5 rounded border border-text/10">
                            {crs?.targetLevel}
                          </span>
                        </div>
                        <h3 className="font-bold text-text text-sm sm:text-base mt-1">{crs?.courseName || cId}</h3>
                      </div>
                      <Link
                        href={`/academy/courses/${cId}`}
                        className="text-xs text-secondary hover:text-secondary/80 flex items-center gap-0.5 self-start sm:self-auto transition-colors"
                      >
                        Cohort Syllabus <ArrowUpRight className="w-3.5 h-3.5" />
                      </Link>
                    </div>

                    {/* Dynamic Attendance Metric 4-Box Grid */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-2.5 text-center">
                      <div className="p-2 sm:p-3 bg-text/5 rounded-xl border border-text/10">
                        <span className="text-text/50 block text-[9px] sm:text-[10px] uppercase font-semibold">Total Classes</span>
                        <span className="font-mono font-bold text-text text-sm sm:text-base mt-0.5 block">{totalHeld}</span>
                      </div>
                      <div className="p-2 sm:p-3 bg-text/5 rounded-xl border border-text/10">
                        <span className="text-primary block text-[9px] sm:text-[10px] uppercase font-semibold">Attended</span>
                        <span className="font-mono font-bold text-primary text-sm sm:text-base mt-0.5 block">{attendedCount}</span>
                      </div>
                      <div className="p-2 sm:p-3 bg-text/5 rounded-xl border border-text/10">
                        <span className="text-secondary block text-[9px] sm:text-[10px] uppercase font-semibold">Absent</span>
                        <span className="font-mono font-bold text-secondary text-sm sm:text-base mt-0.5 block">{absentCount}</span>
                      </div>
                      <div className="p-2 sm:p-3 bg-text/5 rounded-xl border border-text/10">
                        <span className="text-primary block text-[9px] sm:text-[10px] uppercase font-semibold">Rate</span>
                        <span className="font-mono font-bold text-primary text-sm sm:text-base mt-0.5 block">{rate}</span>
                      </div>
                    </div>

                    {/* Class-by-Class Presence Log */}
                    <div className="space-y-2 pt-2 border-t border-text/10">
                      <span className="text-[11px] sm:text-xs font-semibold text-text/50 block">Class-by-Class Attendance:</span>
                      {totalHeld === 0 ? (
                        <p className="text-xs text-text/40 italic">No classes held yet.</p>
                      ) : (
                        <div className="space-y-1.5">
                          {classes.map((cls) => {
                            const isPresent = cls.presentStudents?.includes(student.rollNumber);
                            return (
                              <div
                                key={cls.classId}
                                className="flex flex-col xs:flex-row xs:items-center justify-between p-2 sm:p-2.5 rounded-lg bg-text/5 border border-text/10 text-xs gap-1.5 sm:gap-2"
                              >
                                <div className="space-y-0.5 min-w-0">
                                  <span className="font-mono text-text/40 text-[10px] sm:text-[11px] block truncate">{cls.classId} • {cls.date}</span>
                                  <span className="text-text/70 font-medium text-xs sm:text-sm line-clamp-1">
                                    {cls.contentCovered?.[0]?.lessonTitle || "Class Session"}
                                  </span>
                                </div>
                                <div className="self-start xs:self-auto shrink-0">
                                  {isPresent ? (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-primary/10 text-primary border border-primary/20">
                                      <CheckCircle2 className="w-3 h-3" /> Present
                                    </span>
                                  ) : (
                                    <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded text-[10px] sm:text-[11px] font-bold bg-secondary/10 text-secondary border border-secondary/20">
                                      <XCircle className="w-3 h-3" /> Absent
                                    </span>
                                  )}
                                </div>
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Calculated Exam Average Footer */}
                  <div className="p-2.5 sm:p-3 bg-text/5 rounded-xl border border-text/10 flex justify-between items-center text-xs">
                    <span className="text-text/50 text-[11px] sm:text-xs">Dynamic Exam Average:</span>
                    <span className="font-mono font-bold text-primary text-xs sm:text-sm">
                      {examAvg !== null ? `${examAvg} pts` : "N/A"}
                    </span>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* Exams Table */}
        <div className="p-4 sm:p-6 rounded-2xl bg-text/5 border border-text/10 space-y-3 sm:space-y-4 transition-colors">
          <h2 className="text-base sm:text-lg font-bold text-text flex items-center gap-2">
            <Award className="w-4 h-4 sm:w-5 sm:h-5 text-primary shrink-0" /> Assessment History & Remarks
          </h2>

          {studentExams.length === 0 ? (
            <p className="text-xs sm:text-sm text-text/40">No examination scores recorded.</p>
          ) : (
            <div className="overflow-x-auto -mx-4 sm:mx-0 px-4 sm:px-0 border-t sm:border border-text/10 sm:rounded-xl">
              <table className="w-full text-left text-xs text-text/70 min-w-[550px]">
                <thead className="bg-text/5 text-text/50 border-b border-text/10 font-semibold">
                  <tr>
                    <th className="p-2.5 sm:p-3">Date</th>
                    <th className="p-2.5 sm:p-3">Exam</th>
                    <th className="p-2.5 sm:p-3">Course</th>
                    <th className="p-2.5 sm:p-3">Score</th>
                    <th className="p-2.5 sm:p-3">Grade</th>
                    <th className="p-2.5 sm:p-3">Remarks</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/10">
                  {studentExams.map((ex, idx) => (
                    <tr key={idx} className="hover:bg-text/5 transition-colors">
                      <td className="p-2.5 sm:p-3 font-mono text-text/50 whitespace-nowrap">{ex.date}</td>
                      <td className="p-2.5 sm:p-3 font-semibold text-text">{ex.examTitle}</td>
                      <td className="p-2.5 sm:p-3 font-mono text-text/50">{ex.courseId}</td>
                      <td className="p-2.5 sm:p-3 font-mono font-bold text-text whitespace-nowrap">{ex.score}/{ex.totalMarks}</td>
                      <td className="p-2.5 sm:p-3">
                        <span
                          className={`font-mono font-bold px-1.5 py-0.5 rounded text-[11px] sm:text-xs ${
                            ex.grade === "F" ? "text-secondary bg-secondary/10" : "text-primary bg-primary/10"
                          }`}
                        >
                          {ex.grade}
                        </span>
                      </td>
                      <td className="p-2.5 sm:p-3 text-text/40 italic">{ex.remarks || "—"}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Admin Verification Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-background border border-text/10 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4 transition-colors">
              <div className="flex justify-between items-center border-b border-text/10 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-primary/10 text-primary rounded-lg">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-text text-sm sm:text-base">Admin Verification</h3>
                </div>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="p-1 text-text/40 hover:text-text rounded-lg transition-colors"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-text/50">
                Enter your instructor/admin passkey to reveal full contact details and direct chat actions.
              </p>

              <form onSubmit={handleUnlockAdmin} className="space-y-3">
                <div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter Admin Passcode (e.g. 2026)"
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      setPinError(false);
                    }}
                    className={`w-full bg-text/5 border ${
                      pinError ? "border-secondary focus:border-secondary" : "border-text/10 focus:border-primary"
                    } rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text focus:outline-none font-mono text-center tracking-widest transition-colors`}
                  />
                  {pinError && (
                    <span className="text-[11px] text-secondary mt-1.5 block text-center">
                      Incorrect passcode. Try again.
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="px-3.5 py-2 bg-text/5 hover:bg-text/10 rounded-xl text-xs font-semibold text-text/60 hover:text-text transition-colors"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-secondary hover:bg-secondary/90 rounded-xl text-xs font-semibold text-white transition-colors shadow-lg shadow-secondary/25"
                  >
                    Unlock Details
                  </button>
                </div>
              </form>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}