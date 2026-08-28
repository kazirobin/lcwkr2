"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { 
  ShieldCheck, 
  UserCheck, 
  BookOpenCheck, 
  Trash2, 
  Check, 
  X, 
  ArrowLeft, 
  RefreshCw,
  PlusCircle,
  Edit3,
  Layers,
  MessageSquare,
  XCircle,
  CheckCircle2,
  Filter
} from "lucide-react";

export default function AdminControlPanel() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [approvedStudents, setApprovedStudents] = useState<any[]>([]);
  const [pendingClasses, setPendingClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

  // ডিফল্ট ফিল্টার: শুধু যাদের গ্রুপে অ্যাড করা বাকি (false)
  const [groupFilter, setGroupFilter] = useState<"pending" | "joined" | "all">("pending");

  // Modal States for Course CRUD
  const [showCourseModal, setShowCourseModal] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [courseFormData, setCourseFormData] = useState({
    courseId: "",
    courseName: "",
    targetLevel: "HSK 1",
    status: "Coming Soon",
    startDate: "",
    nextBatchRegistrationDate: "",
    totalLessons: 15,
    totalClassesPlanned: 24,
  });

  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [pendingStuRes, approvedStuRes, logRes, crsRes] = await Promise.all([
        fetch("/api/academy/students?status=Pending"),
        fetch("/api/academy/students?status=Approved"),
        fetch("/api/academy/classes/pending"),
        fetch("/api/academy/courses"),
      ]);

      const pendingStuData = await pendingStuRes.json();
      const approvedStuData = await approvedStuRes.json();
      const logData = await logRes.json();
      const crsData = await crsRes.json();
      
      if (pendingStuData.success) setPendingStudents(pendingStuData.students);
      if (approvedStuData.success) setApprovedStudents(approvedStuData.students);
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
      }
    } catch (e) {
      console.error(e);
    }
  };

  // হোয়াটসঅ্যাপ গ্রুপ স্ট্যাটাস টগল
  const handleToggleGroupStatus = async (rollNumber: number, currentStatus: boolean) => {
    try {
      const res = await fetch("/api/academy/students/toggle-group", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          rollNumber,
          isWhatsAppGroupJoined: !currentStatus,
          adminPasscode: passcode,
        }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      }
    } catch (e) {
      console.error(e);
    }
  };

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
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleCourseSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const url = isEditing 
        ? `/api/academy/courses/${courseFormData.courseId}` 
        : "/api/academy/courses";
      const method = isEditing ? "PUT" : "POST";

      const res = await fetch(url, {
        method,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(courseFormData),
      });

      const data = await res.json();
      if (data.success) {
        setShowCourseModal(false);
        fetchAdminData();
      }
    } catch (err) {
      console.error(err);
    }
  };

  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm(`Delete course ${courseId}?`)) return;
    try {
      const res = await fetch(`/api/academy/courses/${courseId}`, { method: "DELETE" });
      if (res.ok) fetchAdminData();
    } catch (err) {
      console.error(err);
    }
  };

  const openEditModal = (course: any) => {
    setIsEditing(true);
    setCourseFormData({
      courseId: course.courseId,
      courseName: course.courseName,
      targetLevel: course.targetLevel || "HSK 1",
      status: course.status || "Coming Soon",
      startDate: course.startDate || "",
      nextBatchRegistrationDate: course.nextBatchRegistrationDate || "",
      totalLessons: course.totalLessons || 15,
      totalClassesPlanned: course.totalClassesPlanned || 24,
    });
    setShowCourseModal(true);
  };

  const openCreateModal = () => {
    setIsEditing(false);
    setCourseFormData({
      courseId: "",
      courseName: "",
      targetLevel: "HSK 1",
      status: "Coming Soon",
      startDate: "",
      nextBatchRegistrationDate: "",
      totalLessons: 15,
      totalClassesPlanned: 24,
    });
    setShowCourseModal(true);
  };

  // গ্রুপ স্ট্যাটাস অনুযায়ী ফিল্টার করা স্টুডেন্ট লিস্ট
  const filteredApprovedStudents = useMemo(() => {
    return approvedStudents.filter((s) => {
      if (groupFilter === "pending") return !s.isWhatsAppGroupJoined;
      if (groupFilter === "joined") return s.isWhatsAppGroupJoined;
      return true;
    });
  }, [approvedStudents, groupFilter]);

  const pendingGroupCount = approvedStudents.filter((s) => !s.isWhatsAppGroupJoined).length;

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-6 bg-text/5 border border-text/10 rounded-3xl space-y-4 text-center shadow-xl">
          <ShieldCheck className="w-12 h-12 text-secondary mx-auto" />
          <h2 className="text-xl font-bold">Admin Portal Login</h2>
          <input
            type="password"
            placeholder="Enter PIN (1234)"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-background border border-text/10 rounded-xl p-3 text-center text-sm font-mono tracking-widest focus:outline-none focus:border-primary"
          />
          <button type="submit" className="w-full py-2.5 bg-secondary text-white font-bold rounded-xl text-sm cursor-pointer">
            Unlock Admin Console
          </button>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text py-8 px-4 sm:px-8 space-y-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-text/10 pb-4">
          <div>
            <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-secondary" /> Academy Admin Console
            </h1>
          </div>
          <div className="flex items-center gap-2">
            <button onClick={openCreateModal} className="px-3.5 py-1.5 bg-primary text-background font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer">
              <PlusCircle className="w-3.5 h-3.5" /> Add Course
            </button>
            <button onClick={fetchAdminData} className="px-3.5 py-1.5 bg-text/5 border border-text/10 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {/* 1. Pending Admission List (New Registrations) */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" /> Pending Student Admissions ({pendingStudents.length})
          </h2>

          {pendingStudents.length === 0 ? (
            <p className="text-xs text-text/40 p-4 border border-text/10 rounded-2xl bg-text/[0.02]">
              No pending admissions.
            </p>
          ) : (
            <div className="border border-text/10 rounded-2xl overflow-hidden bg-text/[0.01]">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-text/5 border-b border-text/10 text-text/60 font-semibold">
                  <tr>
                    <th className="p-3">Scholar Name</th>
                    <th className="p-3">WhatsApp Number</th>
                    <th className="p-3 text-right">Approve / Reject</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/10">
                  {pendingStudents.map((s) => (
                    <tr key={s.rollNumber} className="hover:bg-text/5">
                      <td className="p-3 font-semibold text-text">{s.nameEnglish}</td>
                      <td className="p-3 font-mono text-primary font-bold">{s.whatsapp}</td>
                      <td className="p-3 text-right space-x-2">
                        <button
                          onClick={() => handleStudentAction(s.rollNumber, "APPROVE")}
                          className="px-3 py-1 bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 rounded-lg hover:bg-emerald-500/20 cursor-pointer font-bold"
                        >
                          Approve
                        </button>
                        <button
                          onClick={() => handleStudentAction(s.rollNumber, "REJECT")}
                          className="px-3 py-1 bg-secondary/10 text-secondary border border-secondary/20 rounded-lg hover:bg-secondary/20 cursor-pointer font-bold"
                        >
                          Reject
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* 2. WhatsApp Group Verification List (Simplified: Name + WhatsApp + Default Filter) */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" /> WhatsApp Group Verification
            </h2>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-text/5 border border-text/10 rounded-xl text-xs">
              <button
                onClick={() => setGroupFilter("pending")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  groupFilter === "pending"
                    ? "bg-amber-500 text-white shadow-sm"
                    : "text-text/60 hover:text-text"
                }`}
              >
                <XCircle className="w-3.5 h-3.5" />
                Not in Group ({pendingGroupCount})
              </button>
              <button
                onClick={() => setGroupFilter("joined")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer flex items-center gap-1 ${
                  groupFilter === "joined"
                    ? "bg-emerald-600 text-white shadow-sm"
                    : "text-text/60 hover:text-text"
                }`}
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                Joined
              </button>
              <button
                onClick={() => setGroupFilter("all")}
                className={`px-3 py-1 rounded-lg font-semibold transition-all cursor-pointer ${
                  groupFilter === "all"
                    ? "bg-background text-text shadow-sm"
                    : "text-text/60 hover:text-text"
                }`}
              >
                All ({approvedStudents.length})
              </button>
            </div>
          </div>

          <div className="border border-text/10 rounded-2xl overflow-hidden bg-text/[0.01]">
            {filteredApprovedStudents.length === 0 ? (
              <p className="text-xs text-text/40 p-6 text-center italic">
                No scholars found for this filter.
              </p>
            ) : (
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-text/5 border-b border-text/10 text-text/60 font-semibold">
                  <tr>
                    <th className="p-3.5">Scholar Name</th>
                    <th className="p-3.5">WhatsApp Number</th>
                    <th className="p-3.5 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/10">
                  {filteredApprovedStudents.map((s) => (
                    <tr key={s.rollNumber} className="hover:bg-text/5">
                      <td className="p-3.5 font-bold text-text text-sm">
                        {s.nameEnglish}
                      </td>
                      <td className="p-3.5">
                        <a
                          href={`https://wa.me/${s.whatsapp.replace(/[^0-9]/g, "")}`}
                          target="_blank"
                          rel="noopener noreferrer"
                          className="font-mono text-xs font-bold text-primary hover:underline inline-flex items-center gap-1.5"
                        >
                          <MessageSquare className="w-3.5 h-3.5" />
                          {s.whatsapp}
                        </a>
                      </td>
                      <td className="p-3.5 text-right">
                        <button
                          onClick={() => handleToggleGroupStatus(s.rollNumber, s.isWhatsAppGroupJoined)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer shadow-sm ${
                            s.isWhatsAppGroupJoined 
                              ? "bg-text/10 text-text/60 hover:bg-secondary/10 hover:text-secondary hover:border-secondary/20" 
                              : "bg-emerald-600 hover:bg-emerald-500 text-white"
                          }`}
                        >
                          {s.isWhatsAppGroupJoined ? "Set as Not in Group" : "Mark as Group Joined"}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* 3. Pending Class Logs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <BookOpenCheck className="w-5 h-5 text-secondary" /> Pending Teacher Class Logs ({pendingClasses.length})
          </h2>

          {pendingClasses.length === 0 ? (
            <p className="text-xs text-text/40 p-4 border border-text/10 rounded-2xl bg-text/[0.02]">
              No pending class logs.
            </p>
          ) : (
            <div className="space-y-3">
              {pendingClasses.map((log) => (
                <div key={log._id} className="p-4 rounded-2xl bg-text/5 border border-text/10 flex justify-between items-center">
                  <div className="space-y-1">
                    <span className="font-mono text-xs font-bold text-secondary">{log.courseId} • {log.classId}</span>
                    <p className="text-xs font-semibold">{log.contentCovered?.summary}</p>
                    <span className="text-[11px] text-text/50">{log.date} • {log.time}</span>
                  </div>
                  <div className="flex gap-2">
                    <button onClick={() => handleClassAction(log._id, "APPROVE")} className="px-3 py-1.5 bg-emerald-500 text-white font-bold text-xs rounded-xl cursor-pointer">
                      Approve
                    </button>
                    <button onClick={() => handleClassAction(log._id, "REJECT")} className="px-3 py-1.5 bg-secondary/10 text-secondary font-bold text-xs rounded-xl cursor-pointer">
                      Reject
                    </button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* 4. Course Management */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Manage Courses ({courses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => (
              <div key={course.courseId} className="p-5 rounded-2xl bg-text/5 border border-text/10 space-y-3">
                <div className="flex justify-between items-start">
                  <div>
                    <span className="font-mono text-xs font-bold text-secondary mr-2">{course.courseId}</span>
                    <span className="text-[10px] font-bold px-2 py-0.5 rounded bg-text/5 border border-text/10">{course.status}</span>
                    <h3 className="font-bold text-base mt-1">{course.courseName}</h3>
                  </div>
                  <div className="flex gap-1">
                    <button onClick={() => openEditModal(course)} className="p-1.5 text-text/60 hover:text-text cursor-pointer">
                      <Edit3 className="w-4 h-4" />
                    </button>
                    <button onClick={() => handleDeleteCourse(course.courseId)} className="p-1.5 text-secondary hover:text-secondary/80 cursor-pointer">
                      <Trash2 className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2.5 bg-background rounded-xl border border-text/10">
                  <div>
                    <span className="text-text/40 block">Start Date:</span>
                    <span className="font-semibold">{course.startDate || "N/A"}</span>
                  </div>
                  <div>
                    <span className="text-text/40 block">Next Batch:</span>
                    <span className="font-semibold text-primary">{course.nextBatchRegistrationDate || "TBA"}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

      {/* Course Create/Edit Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-background border border-text/10 rounded-3xl p-6 space-y-4">
            <h3 className="text-lg font-bold">{isEditing ? "Edit Course" : "Create Course"}</h3>
            <form onSubmit={handleCourseSubmit} className="space-y-3">
              <input
                type="text"
                disabled={isEditing}
                placeholder="Course ID (e.g. HSK-101)"
                value={courseFormData.courseId}
                onChange={(e) => setCourseFormData({ ...courseFormData, courseId: e.target.value })}
                className="w-full bg-text/5 border border-text/10 rounded-xl p-2.5 text-xs font-mono"
              />
              <input
                type="text"
                placeholder="Course Title"
                value={courseFormData.courseName}
                onChange={(e) => setCourseFormData({ ...courseFormData, courseName: e.target.value })}
                className="w-full bg-text/5 border border-text/10 rounded-xl p-2.5 text-xs"
              />
              <select
                value={courseFormData.status}
                onChange={(e) => setCourseFormData({ ...courseFormData, status: e.target.value as any })}
                className="w-full bg-background border border-text/10 rounded-xl p-2.5 text-xs font-bold"
              >
                <option value="Coming Soon">Coming Soon (Open for Admission)</option>
                <option value="Running">Running (Admission Closed)</option>
                <option value="Completed">Completed</option>
              </select>
              <div className="grid grid-cols-2 gap-2">
                <input
                  type="date"
                  placeholder="Start Date"
                  value={courseFormData.startDate}
                  onChange={(e) => setCourseFormData({ ...courseFormData, startDate: e.target.value })}
                  className="w-full bg-text/5 border border-text/10 rounded-xl p-2 text-xs font-mono"
                />
                <input
                  type="text"
                  placeholder="Next Batch Date"
                  value={courseFormData.nextBatchRegistrationDate}
                  onChange={(e) => setCourseFormData({ ...courseFormData, nextBatchRegistrationDate: e.target.value })}
                  className="w-full bg-text/5 border border-text/10 rounded-xl p-2 text-xs"
                />
              </div>
              <div className="flex gap-2 pt-2">
                <button type="button" onClick={() => setShowCourseModal(false)} className="flex-1 py-2 bg-text/5 rounded-xl text-xs cursor-pointer">
                  Cancel
                </button>
                <button type="submit" className="flex-1 py-2 bg-secondary text-white font-bold rounded-xl text-xs cursor-pointer">
                  Save
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}