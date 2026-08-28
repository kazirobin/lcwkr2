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
  PlusCircle,
  Edit3,
  Calendar,
  Layers
} from "lucide-react";

export default function AdminControlPanel() {
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [pendingClasses, setPendingClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);

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

  // ক্লাস লগ অনুমোদন / বাতিল
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

  // নতুন কোর্স যোগ করা বা এডিট করা
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
      } else {
        alert(data.message || "Failed to save course");
      }
    } catch (err) {
      console.error(err);
      alert("Error saving course");
    }
  };

  // কোর্স ডিলিট হ্যান্ডলার
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm(`Are you sure you want to delete course ${courseId}? This action cannot be undone.`)) {
      return;
    }
    try {
      const res = await fetch(`/api/academy/courses/${courseId}`, {
        method: "DELETE",
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      } else {
        alert(data.message || "Failed to delete course");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // এডিট মোড ওপেন
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

  // নতুন কোর্স মোড ওপেন
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

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <form onSubmit={handleLogin} className="w-full max-w-sm p-6 bg-text/5 border border-text/10 rounded-3xl space-y-4 text-center shadow-xl">
          <ShieldCheck className="w-12 h-12 text-secondary mx-auto" />
          <h2 className="text-xl font-bold">Admin Portal Login</h2>
          <p className="text-xs text-text/50">Enter admin passcode to manage courses, admissions and classes</p>
          <input
            type="password"
            placeholder="Enter Admin PIN (e.g. 1234)"
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
          <div className="flex items-center gap-2">
            <button
              onClick={openCreateModal}
              className="px-3.5 py-1.5 bg-primary hover:bg-primary/90 text-background font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shadow-primary/20"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Add New Course
            </button>
            <button 
              onClick={fetchAdminData} 
              className="px-3.5 py-1.5 bg-text/5 hover:bg-text/10 border border-text/10 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {/* 1. Course Management Section (Add / Edit / Delete / Status) */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <Layers className="w-5 h-5 text-primary" /> Manage Courses & Batches ({courses.length})
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => {
              const classesList = course.classes ?? [];
              const isRunning = course.status === "Running";

              return (
                <div key={course.courseId} className="p-5 rounded-2xl bg-text/5 border border-text/10 space-y-4 flex flex-col justify-between hover:border-text/20 transition-all">
                  <div className="space-y-2.5">
                    <div className="flex justify-between items-start gap-2">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-secondary bg-secondary/10 px-2 py-0.5 rounded border border-secondary/20">
                          {course.courseId}
                        </span>
                        <span className="text-[11px] bg-text/5 px-2 py-0.5 rounded border border-text/10">
                          Level: {course.targetLevel}
                        </span>
                        <span className={`text-[10px] px-2.5 py-0.5 rounded-full font-bold border ${
                          isRunning 
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20" 
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}>
                          {course.status}
                        </span>
                      </div>

                      {/* Actions: Edit & Delete */}
                      <div className="flex items-center gap-1">
                        <button
                          onClick={() => openEditModal(course)}
                          className="p-1.5 text-text/60 hover:text-text hover:bg-text/5 rounded-lg transition-colors cursor-pointer"
                          title="Edit Course"
                        >
                          <Edit3 className="w-4 h-4" />
                        </button>
                        <button
                          onClick={() => handleDeleteCourse(course.courseId)}
                          className="p-1.5 text-secondary/60 hover:text-secondary hover:bg-secondary/5 rounded-lg transition-colors cursor-pointer"
                          title="Delete Course"
                        >
                          <Trash2 className="w-4 h-4" />
                        </button>
                      </div>
                    </div>

                    <h3 className="font-bold text-base text-text">{course.courseName}</h3>

                    {/* Schedule & Batch Metadata */}
                    <div className="grid grid-cols-2 gap-2 text-[11px] font-mono p-2.5 bg-background rounded-xl border border-text/10">
                      <div>
                        <span className="text-text/40 block">Start Date:</span>
                        <span className="font-semibold text-text">{course.startDate || "Not specified"}</span>
                      </div>
                      <div>
                        <span className="text-text/40 block">Next Batch Date:</span>
                        <span className="font-semibold text-primary">{course.nextBatchRegistrationDate || "TBA"}</span>
                      </div>
                    </div>

                    {/* Class Progress Info */}
                    <div className="flex justify-between text-xs text-text/60 font-mono">
                      <span>Total Lessons: {course.totalLessons}</span>
                      <span>Classes: {classesList.length} / {course.totalClassesPlanned}</span>
                    </div>
                  </div>

                  {/* Class History Mini-List */}
                  <div className="space-y-1.5 pt-2 border-t border-text/10">
                    <span className="text-[10px] font-mono text-text/50 uppercase block">Approved Classes:</span>
                    {classesList.length === 0 ? (
                      <p className="text-xs text-text/40 italic">No class sessions logged yet.</p>
                    ) : (
                      <div className="space-y-1 max-h-28 overflow-y-auto pr-1">
                        {classesList.map((cls: any) => (
                          <div key={cls.classId} className="p-1.5 rounded-lg bg-background border border-text/10 flex justify-between items-center text-[11px]">
                            <span className="font-mono font-bold text-secondary">{cls.classId}</span>
                            <span className="text-text/50 truncate max-w-[150px]">{cls.contentCovered?.summary}</span>
                            <span className="text-text/70">{cls.date}</span>
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

        {/* 2. Pending Teacher Class Logs */}
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

        {/* 3. Pending Student Registrations */}
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

      </div>

      {/* 🛠 Add / Edit Course Modal */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 overflow-y-auto">
          <div className="w-full max-w-lg bg-background border border-text/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 relative my-8">
            <button
              onClick={() => setShowCourseModal(false)}
              className="absolute top-4 right-4 p-2 text-text/40 hover:text-text rounded-full hover:bg-text/5 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1">
              <h3 className="text-xl font-extrabold text-text flex items-center gap-2">
                <BookOpen className="w-5 h-5 text-primary" />
                {isEditing ? "Edit Course Track" : "Create New Course Track"}
              </h3>
              <p className="text-xs text-text/50">
                Configure curriculum details, admission status, and batch timeline.
              </p>
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Course ID */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text/70">Course ID (e.g. HSK-301)</label>
                  <input
                    type="text"
                    required
                    disabled={isEditing}
                    placeholder="HSK-101"
                    value={courseFormData.courseId}
                    onChange={(e) => setCourseFormData({ ...courseFormData, courseId: e.target.value })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-primary disabled:opacity-50"
                  />
                </div>

                {/* Target Level */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text/70">Level</label>
                  <select
                    value={courseFormData.targetLevel}
                    onChange={(e) => setCourseFormData({ ...courseFormData, targetLevel: e.target.value })}
                    className="w-full bg-background border border-text/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary cursor-pointer"
                  >
                    <option value="HSK 1">HSK 1</option>
                    <option value="HSK 2">HSK 2</option>
                    <option value="HSK 3">HSK 3</option>
                    <option value="HSK 4">HSK 4</option>
                    <option value="Spoken">Spoken Mandarin</option>
                  </select>
                </div>
              </div>

              {/* Course Title */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text/70">Course Title</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beginner Chinese (HSK 1)"
                  value={courseFormData.courseName}
                  onChange={(e) => setCourseFormData({ ...courseFormData, courseName: e.target.value })}
                  className="w-full bg-text/5 border border-text/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary"
                />
              </div>

              {/* Status Selector */}
              <div className="space-y-1">
                <label className="text-xs font-semibold text-text/70">Course Status</label>
                <select
                  value={courseFormData.status}
                  onChange={(e) => setCourseFormData({ ...courseFormData, status: e.target.value as any })}
                  className="w-full bg-background border border-text/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-bold focus:outline-none focus:border-primary cursor-pointer"
                >
                  <option value="Coming Soon">Coming Soon (Open for Admission)</option>
                  <option value="Running">Running (Admission Closed)</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {/* Start Date */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text/70">Start Date (YYYY-MM-DD)</label>
                  <input
                    type="date"
                    value={courseFormData.startDate}
                    onChange={(e) => setCourseFormData({ ...courseFormData, startDate: e.target.value })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Next Batch Date */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text/70">Next Batch Reg Date</label>
                  <input
                    type="text"
                    placeholder="e.g. October 15, 2026"
                    value={courseFormData.nextBatchRegistrationDate}
                    onChange={(e) => setCourseFormData({ ...courseFormData, nextBatchRegistrationDate: e.target.value })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                {/* Total Lessons */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text/70">Total Lessons</label>
                  <input
                    type="number"
                    min={1}
                    value={courseFormData.totalLessons}
                    onChange={(e) => setCourseFormData({ ...courseFormData, totalLessons: Number(e.target.value) })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>

                {/* Total Classes Planned */}
                <div className="space-y-1">
                  <label className="text-xs font-semibold text-text/70">Classes Planned</label>
                  <input
                    type="number"
                    min={1}
                    value={courseFormData.totalClassesPlanned}
                    onChange={(e) => setCourseFormData({ ...courseFormData, totalClassesPlanned: Number(e.target.value) })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl px-3.5 py-2 text-xs sm:text-sm font-mono focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3">
                <button
                  type="button"
                  onClick={() => setShowCourseModal(false)}
                  className="flex-1 py-2.5 bg-text/5 hover:bg-text/10 rounded-xl text-xs font-semibold text-text/70 transition-colors cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-2.5 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold shadow-md shadow-secondary/20 transition-all cursor-pointer"
                >
                  {isEditing ? "Save Changes" : "Create Course"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}