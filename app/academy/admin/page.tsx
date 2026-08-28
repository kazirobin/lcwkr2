"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  UserCheck, 
  BookOpenCheck, 
  Trash2, 
  Check, 
  X, 
  ArrowLeft, 
  Clock, 
  RefreshCw,
  BookOpen,
  CheckCircle2,
  XCircle,
  AlertCircle
} from "lucide-react";

export default function AdminControlPanel() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [pendingClasses, setPendingClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [stuRes, logRes, crsRes] = await Promise.all([
        fetch("/api/academy/students?status=Pending"),
        fetch("/api/academy/classes/pending"),
        fetch("/api/academy/courses"),
      ]);

      const stuData = await stuRes.json();
      const logData = await logRes.json();
      const crsData = await crsRes.json();
      
      if (stuData.success) setPendingStudents(stuData.students);
      if (logData.success) setPendingClasses(logData.pendingClasses || []);
      if (crsData.success) setCourses(crsData.courses || []);
    } catch (err) {
      console.error("Error loading admin data:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (passcode === "8131") {
      setIsAuthenticated(true);
      fetchAdminData();
    } else {
      alert("Invalid Admin Passcode!");
    }
  };

  // স্টুডেন্ট অনুমোদন / বাতিল
  const handleStudentAction = async (rollNumber: number, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/academy/students/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ rollNumber, action, adminPasscode: passcode }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      } else {
        alert(data.message || "Failed to update student status");
      }
    } catch (e) {
      console.error(e);
    }
  };

  // টিচারের ক্লাস লগ অনুমোদন / বাতিল
  const handleClassAction = async (logId: string, action: "APPROVE" | "REJECT") => {
    try {
      const res = await fetch("/api/academy/classes/approve", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ logId, action, adminPasscode: passcode }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      } else {
        alert(data.message || "Failed to update class log");
      }
    } catch (e) {
      console.error(e);
    }
  };

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-6 bg-text/5 border border-text/10 rounded-3xl space-y-4 text-center shadow-xl">
          <ShieldCheck className="w-12 h-12 text-secondary mx-auto" />
          <h2 className="text-xl font-bold">Admin Portal Login</h2>
          <p className="text-xs text-text/50">Enter admin passcode to manage admissions and class sessions</p>
          <input
            type="password"
            placeholder="Enter Admin PIN (e.g. 8131)"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-background border border-text/10 rounded-xl p-3 text-center text-sm font-mono tracking-widest focus:outline-none focus:border-primary"
          />
          <button type="submit" className="w-full py-2.5 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-sm cursor-pointer transition-all shadow-md shadow-secondary/20">
            Unlock Admin Console
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text py-8 px-4 sm:px-8 space-y-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-text/10 pb-4">
          <div>
            <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-secondary" /> Academy Admin Console
            </h1>
          </div>
          <button 
            onClick={fetchAdminData} 
            className="px-3.5 py-1.5 bg-text/5 hover:bg-text/10 border border-text/10 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer self-start sm:self-auto"
          >
            <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh Data
          </button>
        </div>

        {/* 1. Pending Class Sessions Submitted by Teacher */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-secondary" /> Pending Teacher Class Logs ({pendingClasses.length})
          </h2>

          {pendingClasses.length === 0 ? (
            <p className="text-xs text-text/40 p-4 border border-text/10 rounded-2xl bg-text/[0.02]">
              No pending class logs waiting for review.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingClasses.map((log) => (
                <div key={log._id} className="p-4 sm:p-5 rounded-2xl bg-text/5 border border-text/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="space-y-1.5">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs font-bold px-2 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
                        {log.courseId}
                      </span>
                      <span className="font-mono text-xs text-text font-bold">
                        {log.classId}
                      </span>
                      <span className="text-xs text-text/50">
                        {log.date} • {log.time}
                      </span>
                      <span className="text-[10px] px-2 py-0.2 rounded bg-amber-500/10 text-amber-500 border border-amber-500/20 font-bold">
                        Pending Review
                      </span>
                    </div>

                    <p className="text-xs font-semibold text-text">
                      <strong className="text-text/50 font-normal">Content: </strong> 
                      {log.contentCovered?.summary || `Lesson ${log.contentCovered?.fromLesson} to ${log.contentCovered?.toLesson}`}
                    </p>

                    <div className="flex items-center gap-3 text-xs font-mono">
                      <span className="text-emerald-500 flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> {log.presentStudents?.length || 0} Present
                      </span>
                      <span className="text-secondary flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> {log.absentStudents?.length || 0} Absent
                      </span>
                      <span className="text-text/40 text-[11px]">
                        Submitted by: {log.submittedBy || "Teacher"}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 self-end sm:self-center shrink-0">
                    <button
                      onClick={() => handleClassAction(log._id, "APPROVE")}
                      className="px-3 py-1.5 bg-emerald-500 hover:bg-emerald-600 text-white text-xs font-bold rounded-xl flex items-center gap-1 shadow-sm transition-all cursor-pointer"
                    >
                      <Check className="w-3.5 h-3.5" /> Approve & Merge
                    </button>
                    <button
                      onClick={() => handleClassAction(log._id, "REJECT")}
                      className="px-3 py-1.5 bg-secondary/10 hover:bg-secondary/20 text-secondary border border-secondary/30 text-xs font-bold rounded-xl flex items-center gap-1 transition-all cursor-pointer"
                    >
                      <X className="w-3.5 h-3.5" /> Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 2. Pending Student Registrations */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" /> Pending Student Admissions ({pendingStudents.length})
          </h2>

          {pendingStudents.length === 0 ? (
            <p className="text-xs text-text/40 p-4 border border-text/10 rounded-2xl bg-text/[0.02]">
              No pending student registrations at the moment.
            </p>
          ) : (
            <div className="border border-text/10 rounded-2xl overflow-hidden bg-text/[0.01]">
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs min-w-[600px]">
                  <thead className="bg-text/5 border-b border-text/10 text-text/60 font-semibold">
                    <tr>
                      <th className="p-3">Roll</th>
                      <th className="p-3">Name</th>
                      <th className="p-3">WhatsApp</th>
                      <th className="p-3">Location</th>
                      <th className="p-3">Target Track</th>
                      <th className="p-3 text-right">Approve / Reject</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-text/10">
                    {pendingStudents.map((s) => (
                      <tr key={s.rollNumber} className="hover:bg-text/5">
                        <td className="p-3 font-mono font-bold">{s.rollNumber}</td>
                        <td className="p-3 font-semibold">{s.nameEnglish}</td>
                        <td className="p-3 font-mono">{s.whatsapp}</td>
                        <td className="p-3 text-text/60">{s.location}</td>
                        <td className="p-3 font-mono text-secondary font-bold">{s.enrolledCourseId}</td>
                        <td className="p-3 text-right space-x-2">
                          <button
                            onClick={() => handleStudentAction(s.rollNumber, "APPROVE")}
                            className="px-2.5 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 cursor-pointer font-bold"
                          >
                            Approve
                          </button>
                          <button
                            onClick={() => handleStudentAction(s.rollNumber, "REJECT")}
                            className="px-2.5 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg hover:bg-secondary/20 cursor-pointer font-bold"
                          >
                            Reject
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}
        </div>

        {/* 3. Live Approved Courses & Class History Overview */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpen className="w-5 h-5 text-primary" /> Active Cohorts & Logged Classes Overview
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => {
              const classesList = course.classes ?? [];
              return (
                <div key={course.courseId} className="p-5 rounded-2xl bg-text/5 border border-text/10 space-y-3">
                  <div className="flex justify-between items-start">
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                          {course.courseId}
                        </span>
                        <span className={`text-[10px] px-2 py-0.5 rounded-full font-bold ${
                          course.status === "Running" ? "bg-emerald-500/10 text-emerald-500" : "bg-amber-500/10 text-amber-500"
                        }`}>
                          {course.status}
                        </span>
                      </div>
                      <h3 className="font-bold text-base text-text mt-1">{course.courseName}</h3>
                    </div>
                    <span className="text-xs font-mono text-text/50">
                      {classesList.length} / {course.totalClassesPlanned} Classes
                    </span>
                  </div>

                  {/* List of classes logged in this course */}
                  <div className="space-y-2 pt-2 border-t border-text/10">
                    <span className="text-[11px] font-mono text-text/50 uppercase block">Approved Classes:</span>
                    {classesList.length === 0 ? (
                      <p className="text-xs text-text/40 italic">No class sessions approved yet.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-40 overflow-y-auto pr-1">
                        {classesList.map((cls: any) => (
                          <div key={cls.classId} className="p-2 rounded-xl bg-background border border-text/10 flex justify-between items-center text-xs">
                            <div>
                              <span className="font-mono font-bold text-secondary mr-2">{cls.classId}</span>
                              <span className="text-text/70">{cls.date}</span>
                            </div>
                            <span className="text-[11px] text-text/50 truncate max-w-[180px]">
                              {cls.contentCovered?.summary}
                            </span>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      </div>
    </div>
  );
}