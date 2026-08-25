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

  // Dynamic calculations for attendance (Safe String & Number Matching)
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

    const attendanceRate =
      totalHeld > 0 ? `${((totalAttended / totalHeld) * 100).toFixed(0)}%` : "100%";

    return { totalHeld, totalAttended, attendanceRate };
  };

  return (
    <div className="min-h-screen bg-background text-text py-6 sm:py-8 lg:py-10 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-6 sm:space-y-8">
        
        {/* Top Header & Admin Toggle Bar */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <Link
              href="/academy"
              className="text-xs sm:text-sm font-semibold text-text/60 hover:text-text inline-flex items-center gap-1 mb-2 transition-colors"
            >
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
            </Link>
            <h1 className="text-xl sm:text-3xl font-extrabold text-text flex items-center gap-2">
              <Users className="w-6 h-6 sm:w-7 sm:h-7 text-primary" />
              Enrolled Scholars Directory ({students.length})
            </h1>
            <p className="text-xs sm:text-sm text-text/50 mt-1">
              Real-time attendance, contact info, and cohort enrollment
            </p>
          </div>

          {/* Admin Unlock/Lock Controls */}
          <div className="self-start sm:self-auto">
            {isAdminUnlocked ? (
              <button
                onClick={handleLockAdmin}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-primary/20 border border-primary/30 text-primary text-xs font-semibold hover:bg-primary/30 transition-all shadow-sm"
              >
                <Unlock className="w-3.5 h-3.5 text-primary" />
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
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-text/5 border border-text/10 text-text/50 hover:text-text/70 text-xs font-semibold hover:border-text/20 transition-all"
              >
                <Lock className="w-3.5 h-3.5 text-primary" />
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
                key={String(student.rollNumber)}
                className="p-4 sm:p-5 rounded-2xl bg-text/5 border border-text/10 flex flex-col justify-between space-y-4 hover:border-primary/30 hover:shadow-lg hover:shadow-primary/5 transition-all"
              >
                <div className="space-y-3">
                  <div className="flex items-center gap-3">
                    <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-secondary to-primary flex items-center justify-center font-mono text-lg font-bold text-white shadow-md shrink-0">
                      {student.nameEnglish.charAt(0)}
                    </div>
                    <div className="min-w-0">
                      <h4 className="font-bold text-text text-sm truncate">{student.nameEnglish}</h4>
                      <p className="text-xs font-mono text-text/50">Roll: {student.rollNumber}</p>
                    </div>
                  </div>

                  {/* Location & Protected WhatsApp details */}
                  <div className="space-y-1.5 text-xs text-text/50">
                    <div className="flex items-center gap-1 text-[11px] truncate">
                      <MapPin className="w-3 h-3 text-secondary shrink-0" />
                      <span className="truncate">{student.location}</span>
                    </div>

                    {/* Conditional WhatsApp Row */}
                    <div>
                      {isAdminUnlocked ? (
                        <a
                          href={`https://wa.me/${student.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="inline-flex items-center gap-1 text-[11px] text-primary hover:text-primary/80 transition-colors font-mono"
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
                          className="inline-flex items-center gap-1 text-[11px] text-text/30 hover:text-text/50 transition-colors font-mono"
                        >
                          <Lock className="w-3 h-3 text-primary shrink-0" />
                          <span>{maskPhoneNumber(student.whatsapp)}</span>
                        </button>
                      )}
                    </div>
                  </div>

                  {/* Real-time Attendance Box */}
                  <div className="p-3 bg-text/5 rounded-xl border border-text/10 space-y-2 text-xs">
                    <div className="flex justify-between items-center">
                      <span className="text-text/50">Attendance</span>
                      <span className="font-mono font-bold text-primary">{attendanceRate}</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <span className="text-text/50">Attended Sessions</span>
                      <span className="font-mono font-semibold text-text">
                        {totalAttended} / {totalHeld}
                      </span>
                    </div>
                    <div className="flex justify-between items-center pt-1 border-t border-text/10">
                      <span className="text-text/50">Enrolled In</span>
                      <span className="font-mono text-[11px] text-secondary font-semibold">
                        {student.enrolledCourseIds?.join(", ") || "None"}
                      </span>
                    </div>
                  </div>
                </div>

                <Link
                  href={`/academy/students/${student.rollNumber}`}
                  className="flex items-center justify-center gap-1 w-full py-2 bg-text/10 hover:bg-text/20 text-text/70 hover:text-text rounded-lg text-xs font-semibold transition-colors"
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
                Enter your instructor/admin passkey to reveal all scholar WhatsApp contact numbers.
              </p>

              <form onSubmit={handleUnlockAdmin} className="space-y-3">
                <div>
                  <input
                    type="password"
                    autoFocus
                    placeholder="Enter Passcode (e.g. 1234)"
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