"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  KeyRound,
  CheckSquare,
  Square,
  Users,
  CheckCircle2,
  XCircle,
  Calendar,
  Clock,
  Loader2
} from "lucide-react";
import { ICourse, IStudent } from "@/types/academy";

// সরাসরি ডিফল্ট পিন ৮১৩১ সেট করা হয়েছে
const ADMIN_SECRET_PIN = "8131";

export default function TeacherClassLogPage() {
  // MongoDB লাইভ ডাটা স্টেট
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const [selectedCourseId, setSelectedCourseId] = useState("");
  // ডিফল্টভাবে পিন 8131 সেট করে রাখা হয়েছে যাতে খালি থাকলেও কাজ করে
  const [teacherPasscode, setTeacherPasscode] = useState(ADMIN_SECRET_PIN);
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00 PM - 10:10 PM");

  const [fromLesson, setFromLesson] = useState(1);
  const [fromText, setFromText] = useState(1);
  const [toLesson, setToLesson] = useState(1);
  const [toText, setToText] = useState(2);

  const [presentRolls, setPresentRolls] = useState<string[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // MongoDB থেকে লাইভ কোর্স এবং স্টুডেন্ট ফেচ
  useEffect(() => {
    const fetchLiveData = async () => {
      setLoading(true);
      try {
        const [coursesRes, studentsRes] = await Promise.all([
          fetch("/api/academy/courses", { cache: "no-store" }),
          fetch("/api/academy/students?status=Approved", { cache: "no-store" }),
        ]);

        const coursesData = await coursesRes.json();
        const studentsData = await studentsRes.json();

        if (coursesData.success && coursesData.courses?.length > 0) {
          setCourses(coursesData.courses);
          setSelectedCourseId(coursesData.courses[0].courseId);
        }

        if (studentsData.success && studentsData.students) {
          setStudents(studentsData.students);
        }
      } catch (err) {
        console.error("Failed to load live data from MongoDB:", err);
      } finally {
        setLoading(false);
      }
    };

    fetchLiveData();
  }, []);

  // নির্বাচিত কোর্সে এনরোল্ড স্টুডেন্ট ফিল্টার
  const currentCourseCode = selectedCourseId.toLowerCase();
  const enrolled = students.filter((s: any) => {
    if (Array.isArray(s.enrolledCourseIds)) {
      return s.enrolledCourseIds.some((id: string) => id.toLowerCase() === currentCourseCode);
    }
    if (s.enrolledCourseId) {
      return String(s.enrolledCourseId).toLowerCase() === currentCourseCode;
    }
    return false;
  });

  const toggleAttendance = (roll: string | number) => {
    const rollStr = String(roll).trim();
    setPresentRolls((prev) =>
      prev.includes(rollStr) ? prev.filter((r) => r !== rollStr) : [...prev, rollStr]
    );
  };

  const isAllSelected = enrolled.length > 0 && presentRolls.length === enrolled.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setPresentRolls([]);
    } else {
      const allRolls = enrolled.map((s) => String(s.rollNumber).trim());
      setPresentRolls(allRolls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const allRolls = enrolled.map((s) => String(s.rollNumber).trim());
    const absentRolls = allRolls.filter((roll) => !presentRolls.includes(roll));
    const summary = `Lesson ${fromLesson} Text ${fromText} to Lesson ${toLesson} Text ${toText}`;

    // পিন ট্রিম করে নিশ্চিতভাবে পাঠানো হচ্ছে
    const finalPin = (teacherPasscode.trim() || ADMIN_SECRET_PIN).trim();

    try {
      const res = await fetch("/api/academy/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherPasscode: finalPin,
          courseId: selectedCourseId,
          date,
          time,
          contentCovered: { summary, fromLesson, fromText, toLesson, toText },
          presentStudents: presentRolls,
          absentStudents: absentRolls,
        }),
      });

      const result = await res.json();
      setSubmitting(false);

      if (result.success) {
        alert("Class session logged successfully to MongoDB!");
        window.location.href = "/academy";
      } else {
        alert(result.message || "Invalid Passcode or failed to submit class log");
      }
    } catch (err) {
      setSubmitting(false);
      alert("Error submitting class session. Please check your connection.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-mono text-text/50">Fetching Live Cohorts from MongoDB...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1 font-medium">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
        </Link>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> Teacher Class Logger
          </h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Log class progress and mark attendance directly for live cohorts. (MongoDB Live)
          </p>
        </div>

        <form onSubmit={handleSubmit} className="p-6 sm:p-8 bg-text/5 border border-text/10 rounded-3xl space-y-6 shadow-xl">
          {/* Passcode */}
          <div>
            <label className="text-xs font-bold flex items-center gap-1 mb-1.5">
              <KeyRound className="w-3.5 h-3.5 text-secondary" /> Teacher / Admin Passcode
            </label>
            <input
              type="password"
              required
              value={teacherPasscode}
              onChange={(e) => setTeacherPasscode(e.target.value)}
              placeholder="Enter PIN (Default: 8131)"
              className="w-full bg-background border border-text/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary font-mono tracking-widest"
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <label className="text-xs font-bold block mb-1.5">Course Track</label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setPresentRolls([]);
                }}
                className="w-full bg-background border border-text/10 rounded-xl p-3 text-xs font-semibold cursor-pointer"
              >
                {courses.map((c) => (
                  <option key={c.courseId} value={c.courseId}>{c.courseId} - {c.courseName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1.5">Class Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-text/10 rounded-xl p-2.5 text-xs font-mono"
              />
            </div>
          </div>

          {/* Curriculum Range */}
          <div className="p-4 bg-background border border-text/10 rounded-2xl space-y-3">
            <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">Curriculum Progression Range</span>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center text-xs">
              <div>
                <span className="text-[10px] text-text/50 block mb-1 font-medium">From Lesson</span>
                <input type="number" min={1} value={fromLesson} onChange={(e) => setFromLesson(Number(e.target.value))} className="w-full bg-text/5 border border-text/10 p-2 rounded-xl text-center font-mono font-bold" />
              </div>
              <div>
                <span className="text-[10px] text-text/50 block mb-1 font-medium">From Text</span>
                <input type="number" min={1} value={fromText} onChange={(e) => setFromText(Number(e.target.value))} className="w-full bg-text/5 border border-text/10 p-2 rounded-xl text-center font-mono font-bold" />
              </div>
              <div>
                <span className="text-[10px] text-text/50 block mb-1 font-medium">To Lesson</span>
                <input type="number" min={1} value={toLesson} onChange={(e) => setToLesson(Number(e.target.value))} className="w-full bg-text/5 border border-text/10 p-2 rounded-xl text-center font-mono font-bold" />
              </div>
              <div>
                <span className="text-[10px] text-text/50 block mb-1 font-medium">To Text</span>
                <input type="number" min={1} value={toText} onChange={(e) => setToText(Number(e.target.value))} className="w-full bg-text/5 border border-text/10 p-2 rounded-xl text-center font-mono font-bold" />
              </div>
            </div>
          </div>

          {/* Attendance Section */}
          <div className="space-y-4 p-4 sm:p-6 bg-background border border-text/10 rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-text/10 pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-text">
                    Mark Present Students
                  </h3>
                  <div className="flex items-center gap-3 text-xs mt-0.5">
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3.5 h-3.5" /> Present: <b>{presentRolls.length}</b>
                    </span>
                    <span className="text-secondary font-semibold flex items-center gap-1">
                      <XCircle className="w-3.5 h-3.5" /> Absent: <b>{enrolled.length - presentRolls.length}</b>
                    </span>
                    <span className="text-text/40 font-mono">Total: {enrolled.length}</span>
                  </div>
                </div>
              </div>
              
              {enrolled.length > 0 && (
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className={`text-xs px-3 py-1.5 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                    isAllSelected
                      ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                      : "bg-text/5 text-text/70 border-text/10 hover:text-text hover:bg-text/10"
                  }`}
                >
                  {isAllSelected ? (
                    <>
                      <CheckSquare className="w-4 h-4 text-primary" />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-4 h-4 text-text/50" />
                      <span>Select All ({enrolled.length})</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {enrolled.length === 0 ? (
              <p className="text-xs text-text/40 py-8 text-center italic">
                No students enrolled in this course track yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                {enrolled.map((s) => {
                  const rollStr = String(s.rollNumber).trim();
                  const isPresent = presentRolls.includes(rollStr);

                  return (
                    <button
                      key={rollStr}
                      type="button"
                      onClick={() => toggleAttendance(rollStr)}
                      className={`p-3.5 rounded-2xl border text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isPresent
                          ? "bg-emerald-500/10 border-emerald-500/40 text-emerald-500 font-bold shadow-sm"
                          : "bg-secondary/5 border-secondary/20 text-secondary hover:border-secondary/40"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-[11px] block opacity-75 font-bold">
                          Roll #{rollStr}
                        </span>
                        <span className="truncate block font-semibold text-text text-sm mt-0.5">
                          {s.nameEnglish}
                        </span>
                      </div>
                      
                      <div className="shrink-0">
                        {isPresent ? (
                          <span className="text-[11px] bg-emerald-500 text-white px-2.5 py-1 rounded-full font-bold flex items-center gap-1 shadow-sm">
                            <CheckCircle2 className="w-3.5 h-3.5" /> Present
                          </span>
                        ) : (
                          <span className="text-[11px] bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-1 rounded-full font-bold flex items-center gap-1">
                            <XCircle className="w-3.5 h-3.5" /> Absent
                          </span>
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-4 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-2xl text-sm sm:text-base shadow-lg shadow-secondary/20 cursor-pointer transition-all disabled:opacity-50"
          >
            {submitting ? "Submitting to Database..." : "Submit Class Session"}
          </button>
        </form>
      </div>
    </div>
  );
}
const ADMIN_SECRET_PASSCODE = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

export default function PendingClassLogsPage() {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/academy/classes/pending", { cache: "no-store" });
      const data = await res.json();
      if (data.success) setLogs(data.pendingClasses || []);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLogs();
  }, []);

  const handleAction = async (logId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/academy/classes/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, action, adminPasscode: ADMIN_SECRET_PASSCODE }),
      });
      const data = await res.json();
      if (data.success) fetchLogs();
      else alert(data.message || "Failed to update");
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8 space-y-6">
      <div className="max-w-4xl mx-auto space-y-6">
        <div className="flex justify-between items-center">
          <Link href="/admin" className="text-xs text-text/50 hover:underline flex items-center gap-1">
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Admin Dashboard
          </Link>
          <button onClick={fetchLogs} className="p-1.5 bg-text/5 border border-text/10 rounded-xl">
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
          </button>
        </div>

        <h1 className="text-2xl font-bold flex items-center gap-2">
          <BookOpenCheck className="w-6 h-6 text-secondary" /> Pending Teacher Class Logs ({logs.length})
        </h1>

        {logs.length === 0 ? (
          <p className="text-xs text-text/40 p-8 border border-text/10 rounded-3xl text-center bg-text/[0.02]">
            No pending class logs in database.
          </p>
        ) : (
          <div className="space-y-3">
            {logs.map((log) => (
              <div key={log._id} className="p-4 rounded-2xl bg-text/5 border border-text/10 flex justify-between items-center">
                <div className="space-y-1">
                  <span className="font-mono text-xs font-bold text-secondary">{log.courseId} • {log.classId}</span>
                  <p className="text-xs font-semibold">{log.contentCovered?.summary}</p>
                  <span className="text-[11px] text-text/50">{log.date} • {log.time}</span>
                </div>
                <div className="flex gap-2">
                  <button onClick={() => handleAction(log._id, "APPROVE")} className="px-3 py-1.5 bg-emerald-500 text-white font-bold text-xs rounded-xl">
                    Approve
                  </button>
                  <button onClick={() => handleAction(log._id, "REJECT")} className="px-3 py-1.5 bg-secondary/10 text-secondary font-bold text-xs rounded-xl">
                    Reject
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}