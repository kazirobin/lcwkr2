"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Users, 
  ArrowUpRight, 
  MapPin, 
  MessageSquare, 
  Lock, 
  Unlock, 
  EyeOff, 
  KeyRound, 
  X 
} from "lucide-react";
import { academyData } from "@/data/academyData";

// অ্যাডমিন সিক্রেট পিন
const ADMIN_SECRET_PIN = "8131";

export default function StudentsListPage() {
  const { students, courses } = academyData;

  // Admin authentication states
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminModal, setShowAdminModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // Sync session authentication
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

  // Helper function to mask WhatsApp number for public visitors
  const maskPhoneNumber = (phone: string) => {
    if (!phone || phone.length < 8) return "••••••••••";
    const start = phone.slice(0, 5);
    const end = phone.slice(-3);
    return `${start} •••• ${end}`;
  };

  // Dynamic calculations for attendance
  const getStudentStats = (rollNumber: string, enrolledCourseIds: string[]) => {
    let totalHeld = 0;
    let totalAttended = 0;

    courses.forEach((course) => {
      if (enrolledCourseIds.includes(course.courseId)) {
        const classes = course.classes ?? [];
        totalHeld += classes.length;
        totalAttended += classes.filter((cls) => cls.presentStudents?.includes(rollNumber)).length;
      }
    });

    const attendanceRate =
      totalHeld > 0 ? `${((totalAttended / totalHeld) * 100).toFixed(0)}%` : "100%";

    return { totalHeld, totalAttended, attendanceRate };
  };

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-6 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header & Admin Toggle Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/academy"
              className="text-xs sm:text-sm font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
            </Link>
            <h1 className="text-xl sm:text-3xl font-extrabold text-white flex items-center gap-2">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-emerald-400" />
              Enrolled Scholars Directory ({students.length})
            </h1>
            <p className="text-xs sm:text-sm text-slate-400 mt-1">
              Real-time attendance, contact info, and cohort enrollment
            </p>
          </div>

          {/* Admin Unlock/Lock Controls */}
          <div className="self-start sm:self-auto">
            {isAdminUnlocked ? (
              <button
                onClick={handleLockAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-emerald-950/60 border border-emerald-700/60 text-emerald-300 text-xs font-semibold hover:bg-emerald-900/80 transition-all shadow-sm"
              >
                <Unlock className="w-3.5 h-3.5 text-emerald-400" />
                <span>Admin Unlocked</span>
                <EyeOff className="w-3 h-3 ml-1 opacity-70" />
              </button>
            ) : (
              <button
                onClick={() => {
                  setEnteredPin("");
                  setPinError(false);
                  setShowAdminModal(true);
                }}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-800 text-slate-400 hover:text-slate-200 text-xs font-semibold hover:border-slate-700 transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Unlock</span>
              </button>
            )}
          </div>
        </div>

        {/* Student Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {students.map((student) => {
            const { totalHeld, totalAttended, attendanceRate } = getStudentStats(
              student.rollNumber,
              student.enrolledCourseIds ?? []
            );

            return (
              <div
                key={student.rollNumber}
                className="p-4 sm:p-5 rounded-2xl bg-slate-900/60 border border-slate-800 flex flex-col justify-between space-y-4 hover:border-slate-700 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-rose-600 to-amber-600 flex items-center justify-center font-mono text-lg font-bold text-white shadow-md shrink-0">
                      {student.nameEnglish.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-white text-sm truncate">{student.nameEnglish}</h4>
                      <p className="text-xs font-mono text-slate-400">{student.rollNumber}</p>
                    </div>
                  </div>

                  {/* Location & Protected WhatsApp details */}
                  <div className="space-y-1.5 text-xs text-slate-400">
                    <div className="flex items-center gap-1 text-[11px] truncate">
                      <MapPin className="w-3 h-3 text-rose-400 shrink-0" />
                      <span className="truncate">{student.location}</span>
                    </div>

                    {/* Conditional WhatsApp Row */}
                    <div>
                      {isAdminUnlocked ? (
                        <a
                          href={`https://wa.me/${student.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-emerald-400 hover:text-emerald-300 transition-colors font-mono"
                        >
                          <MessageSquare className="w-3 h-3 shrink-0" />
                          <span>{student.whatsapp}</span>
                        </a>
                      ) : (
                        <button
                          onClick={() => {
                            setEnteredPin("");
                            setPinError(false);
                            setShowAdminModal(true);
                          }}
                          className="inline-flex items-center gap-1 text-[11px] text-slate-500 hover:text-slate-400 transition-colors font-mono"
                        >
                          <Lock className="w-3 h-3 text-amber-400 shrink-0" />
                          <span>{maskPhoneNumber(student.whatsapp)}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Real-time Attendance Box */}
                  <div className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Attendance</span>
                      <span className="font-mono font-bold text-emerald-400">{attendanceRate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-slate-400">Attended Sessions</span>
                      <span className="font-mono font-semibold text-slate-200">
                        {totalAttended} / {totalHeld}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-slate-900">
                      <span className="text-slate-400">Enrolled In</span>
                      <span className="font-mono text-[11px] text-rose-400 font-semibold">
                        {student.enrolledCourseIds?.join(", ") || "None"}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/academy/students/${student.rollNumber}`}
                  className="flex items-center justify-center gap-1 w-full py-2 bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white rounded-lg text-xs font-semibold transition-colors"
                >
                  View Profile & Attendance <ArrowUpRight className="w-3.5 h-3.5" />
                </Link>
              </div>
            );
          })}
        </div>

        {/* Admin Verification Passcode Modal */}
        {showAdminModal && (
          <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
            <div className="w-full max-w-sm bg-slate-900 border border-slate-800 rounded-2xl p-5 sm:p-6 shadow-2xl space-y-4">
              <div className="flex justify-between items-center border-b border-slate-800 pb-3">
                <div className="flex items-center gap-2">
                  <div className="p-2 bg-amber-500/10 text-amber-400 rounded-lg">
                    <KeyRound className="w-4 h-4" />
                  </div>
                  <h3 className="font-bold text-white text-sm sm:text-base">Admin Verification</h3>
                </div>
                <button
                  onClick={() => setShowAdminModal(false)}
                  className="p-1 text-slate-400 hover:text-white rounded-lg"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="text-xs text-slate-400">
                Enter your instructor/admin passkey to reveal all scholar WhatsApp contact numbers.
              </p>

              <form onSubmit={handleUnlockAdmin} className="space-y-3">
                <div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter Passcode (e.g. 2026)"
                    value={enteredPin}
                    onChange={(e) => {
                      setEnteredPin(e.target.value);
                      setPinError(false);
                    }}
                    className={`w-full bg-slate-950 border ${
                      pinError ? "border-rose-500 focus:border-rose-500" : "border-slate-800 focus:border-rose-500"
                    } rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-white focus:outline-none font-mono text-center tracking-widest`}
                  />
                  {pinError && (
                    <span className="text-[11px] text-rose-400 mt-1.5 block text-center">
                      Incorrect passcode. Try again.
                    </span>
                  )}
                </div>

                <div className="flex justify-end gap-2 pt-1">
                  <button
                    type="button"
                    onClick={() => setShowAdminModal(false)}
                    className="px-3.5 py-2 bg-slate-800 hover:bg-slate-700 rounded-xl text-xs font-semibold text-slate-300"
                  >
                    Cancel
                  </button>
                  <button
                    type="submit"
                    className="px-4 py-2 bg-rose-600 hover:bg-rose-500 rounded-xl text-xs font-semibold text-white transition-colors"
                  >
                    Unlock All
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