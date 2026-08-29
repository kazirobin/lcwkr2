"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
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
  DownloadCloud
} from "lucide-react";

export default function AdminControlPanel() {
  const router = useRouter();
  const [passcode, setPasscode] = useState("");
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [pendingStudents, setPendingStudents] = useState<any[]>([]);
  const [approvedStudents, setApprovedStudents] = useState<any[]>([]);
  const [pendingClasses, setPendingClasses] = useState<any[]>([]);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [syncing, setSyncing] = useState(false);

  // ডিফল্ট ফিল্টার: শুধু যাদের গ্রুপে অ্যাড করা বাকি (pending / false)
  const [groupFilter, setGroupFilter] = useState<"pending" | "joined" | "all">("all");

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

  // সরাসরি MongoDB API থেকে লাইভ ডাটা ফেচ
  const fetchAdminData = async () => {
    setLoading(true);
    try {
      const [pendingStuRes, approvedStuRes, logRes, crsRes] = await Promise.all([
        fetch("/api/academy/students?status=Pending", { cache: "no-store" }),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }),
        fetch("/api/academy/classes/pending", { cache: "no-store" }),
        fetch("/api/academy/courses", { cache: "no-store" }),
      ]);

      const pendingStuData = await pendingStuRes.json();
      const approvedStuData = await approvedStuRes.json();
      const logData = await logRes.json();
      const crsData = await crsRes.json();
      
      if (pendingStuData.success) setPendingStudents(pendingStuData.students || []);
      if (approvedStuData.success) setApprovedStudents(approvedStuData.students || []);
      if (logData.success) setPendingClasses(logData.pendingClasses || []);
      if (crsData.success) setCourses(crsData.courses || []);
    } catch (err) {
      console.error("Error loading admin data from MongoDB:", err);
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

  // MongoDB থেকে লোকাল .ts ফাইলে ডেটা সিঙ্ক হ্যান্ডলার
  const handleSyncToFile = async () => {
    if (!confirm("Are you sure you want to download and overwrite local .ts files with MongoDB live data?")) {
      return;
    }
    setSyncing(true);
    try {
      const res = await fetch(`/api/academy/sync-to-file?pin=${passcode}`);
      const data = await res.json();
      if (data.success) {
        alert(`✅ Synced Successfully!\nCourses: ${data.counts?.courses || 0}\nStudents: ${data.counts?.students || 0}`);
      } else {
        alert(data.message || "Sync failed");
      }
    } catch (err) {
      console.error("Error syncing to file:", err);
      alert("Failed to sync database to local files.");
    } finally {
      setSyncing(false);
    }
  };

  // স্টুডেন্ট অনুমোদন / রিজেক্ট / ডিলিট (Auto Roll Re-index)
  const handleStudentAction = async (rollNumber: number, action: "APPROVE" | "REJECT" | "DELETE", studentName?: string) => {
    const confirmMsg = action === "DELETE" 
      ? `Are you sure you want to permanently delete Roll #${rollNumber} (${studentName || 'Student'}) from MongoDB?\n\nSubsequent rolls will automatically shift down by 1.` 
      : action === "REJECT" ? `Reject application for Roll #${rollNumber}?` : null;

    if (confirmMsg && !confirm(confirmMsg)) return;

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
        alert(data.message || "Failed to update student");
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

  // পেন্ডিং ক্লাস লগ অনুমোদন / রিজেক্ট
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

  // লাইভ কোর্সের ক্লাস লগ ডিলিট
  const handleDeleteClassFromCourse = async (courseId: string, classId: string) => {
    if (!confirm(`Are you sure you want to delete class ${classId} from ${courseId}?`)) {
      return;
    }
    try {
      const res = await fetch("/api/academy/classes/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ courseId, classId, adminPasscode: passcode }),
      });
      const data = await res.json();
      if (data.success) {
        fetchAdminData();
      } else {
        alert(data.message || "Failed to delete class");
      }
    } catch (err) {
      console.error(err);
    }
  };

  // কোর্স সেভ
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
    }
  };

  // কোর্স ডিলিট
  const handleDeleteCourse = async (courseId: string) => {
    if (!confirm(`Delete course ${courseId} from MongoDB?`)) return;
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
          <p className="text-xs text-text/50">Direct MongoDB Real-time Control Center</p>
          <input
            type="password"
            placeholder="Enter PIN (8131)"
            value={passcode}
            onChange={(e) => setPasscode(e.target.value)}
            className="w-full bg-background border border-text/10 rounded-xl p-3 text-center text-sm font-mono tracking-widest focus:outline-none focus:border-primary"
          />
          
          <div className="flex items-center gap-2 pt-1">
            <button
              type="button"
              onClick={() => router.push("/academy")}
              className="flex-1 py-2.5 bg-text/5 hover:bg-text/10 text-text/70 border border-text/10 font-bold rounded-xl text-sm cursor-pointer transition-all"
            >
              Cancel
            </button>
            <button
              type="submit"
              className="flex-1 py-2.5 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-sm cursor-pointer shadow-md shadow-secondary/20 transition-all"
            >
              Unlock Console
            </button>
          </div>
        </form>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-text py-8 px-4 sm:px-8 space-y-8 transition-colors">
      <div className="max-w-5xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-text/10 pb-4">
          <div>
            <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1 mb-1">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
            </Link>
            <h1 className="text-2xl font-bold flex items-center gap-2">
              <ShieldCheck className="w-6 h-6 text-secondary" /> Academy Admin Console
            </h1>
            <span className="text-[11px] font-mono text-emerald-500 font-semibold">● Connected to MongoDB Live</span>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            {/* Sync DB to Local .ts Button */}
            <button
              onClick={handleSyncToFile}
              disabled={syncing}
              className="px-3.5 py-1.5 bg-secondary hover:bg-secondary/90 text-white font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shadow-secondary/20 transition-all disabled:opacity-50"
              title="Fetch approved records from MongoDB and write directly into local .ts files"
            >
              <DownloadCloud className={`w-3.5 h-3.5 ${syncing ? "animate-bounce" : ""}`} />
              <span>{syncing ? "Syncing..." : "Sync DB to Local .ts"}</span>
            </button>

            <button onClick={openCreateModal} className="px-3.5 py-1.5 bg-primary text-background font-bold text-xs rounded-xl flex items-center gap-1.5 cursor-pointer shadow-sm shadow-primary/20">
              <PlusCircle className="w-3.5 h-3.5" /> Add Course
            </button>

            <button onClick={fetchAdminData} className="px-3.5 py-1.5 bg-text/5 border border-text/10 rounded-xl text-xs flex items-center gap-1.5 cursor-pointer hover:bg-text/10">
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} /> Refresh
            </button>
          </div>
        </div>

        {/* 1. Pending Admission List */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <UserCheck className="w-5 h-5 text-primary" /> Pending Student Admissions ({pendingStudents.length})
          </h2>

          {pendingStudents.length === 0 ? (
            <p className="text-xs text-text/40 p-4 border border-text/10 rounded-2xl bg-text/[0.02]">
              No pending admissions in database.
            </p>
          ) : (
            <div className="border border-text/10 rounded-2xl overflow-hidden bg-text/[0.01]">
              <table className="w-full text-left text-xs min-w-[500px]">
                <thead className="bg-text/5 border-b border-text/10 text-text/60 font-semibold">
                  <tr>
                    <th className="p-3">Candidate Name</th>
                    <th className="p-3">WhatsApp Number</th>
                    <th className="p-3">Target Track</th>
                    <th className="p-3 text-right">Approve / Reject</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/10">
                  {pendingStudents.map((s) => (
                    <tr key={s.rollNumber} className="hover:bg-text/5">
                      <td className="p-3 font-semibold text-text">{s.nameEnglish}</td>
                      <td className="p-3 font-mono text-primary font-bold">{s.whatsapp}</td>
                      <td className="p-3 font-mono text-secondary font-bold">{s.enrolledCourseId}</td>
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

        {/* 2. Approved Students & WhatsApp Group Status + Delete Option */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <MessageSquare className="w-5 h-5 text-emerald-500" /> WhatsApp Group Verification & Students ({approvedStudents.length})
            </h2>

            {/* Quick Filter Tabs */}
            <div className="flex items-center gap-1.5 p-1 bg-text/5 border border-text/10 rounded-xl text-xs">
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
            </div>
          </div>

          <div className="border border-text/10 rounded-2xl overflow-hidden bg-text/[0.01]">
            {filteredApprovedStudents.length === 0 ? (
              <p className="text-xs text-text/40 p-6 text-center italic">
                No students found for this filter.
              </p>
            ) : (
              <table className="w-full text-left text-xs min-w-[550px]">
                <thead className="bg-text/5 border-b border-text/10 text-text/60 font-semibold">
                  <tr>
                    <th className="p-3.5 w-16">Roll</th>
                    <th className="p-3.5">Student Name</th>
                    <th className="p-3.5">WhatsApp Number</th>
                    <th className="p-3.5 text-center">Group Status</th>
                    <th className="p-3.5 text-right">Delete Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/10">
                  {filteredApprovedStudents.map((s) => (
                    <tr key={s.rollNumber} className="hover:bg-text/5">
                      <td className="p-3.5 font-mono font-bold text-secondary text-xs">
                        #{s.rollNumber}
                      </td>
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
                      <td className="p-3.5 text-center">
                        {/* Toggle Group Status */}
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
                      <td className="p-3.5 text-right">
                        {/* 👈 Explicit Delete Student Button */}
                        <button
                          onClick={() => handleStudentAction(s.rollNumber, "DELETE", s.nameEnglish)}
                          className="px-3 py-1.5 bg-secondary/10 hover:bg-secondary hover:text-white text-secondary border border-secondary/20 rounded-xl text-xs font-bold transition-all cursor-pointer inline-flex items-center gap-1"
                          title="Permanently remove student & shift down rolls"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                          <span>Delete</span>
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
              No pending class logs in database.
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

        {/* 4. Course Management & Class History Delete Option */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-primary" /> Manage Courses & Logged Classes ({courses.length})
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {courses.map((course) => {
              const classesList = course.classes ?? [];

              return (
                <div key={course.courseId} className="p-5 rounded-2xl bg-text/5 border border-text/10 space-y-4 flex flex-col justify-between">
                  <div className="space-y-3">
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

                  {/* Approved Classes List with Delete Button */}
                  <div className="space-y-1.5 pt-2 border-t border-text/10">
                    <span className="text-[10px] font-mono text-text/50 uppercase block">Approved Classes ({classesList.length}):</span>
                    {classesList.length === 0 ? (
                      <p className="text-xs text-text/40 italic">No class sessions logged yet.</p>
                    ) : (
                      <div className="space-y-1.5 max-h-36 overflow-y-auto pr-1">
                        {classesList.map((cls: any) => (
                          <div key={cls.classId} className="p-2 rounded-xl bg-background border border-text/10 flex justify-between items-center text-[11px]">
                            <div className="min-w-0 pr-2">
                              <span className="font-mono font-bold text-secondary mr-1.5">{cls.classId}</span>
                              <span className="text-text/70 truncate block">{cls.contentCovered?.summary}</span>
                            </div>
                            <div className="flex items-center gap-2 shrink-0">
                              <span className="text-[10px] text-text/40 font-mono">{cls.date}</span>
                              <button
                                onClick={() => handleDeleteClassFromCourse(course.courseId, cls.classId)}
                                className="p-1 text-secondary/60 hover:text-secondary hover:bg-secondary/10 rounded transition-colors cursor-pointer"
                                title="Delete this class session from MongoDB"
                              >
                                <Trash2 className="w-3.5 h-3.5" />
                              </button>
                            </div>
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

      {/* Course Create/Edit Modal with Visible Labels */}
      {showCourseModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-background border border-text/10 rounded-3xl p-6 space-y-4">
            <div className="flex justify-between items-center border-b border-text/10 pb-3">
              <h3 className="text-lg font-bold">{isEditing ? "Edit Course Track" : "Create New Course Track"}</h3>
              <button onClick={() => setShowCourseModal(false)} className="p-1 text-text/40 hover:text-text cursor-pointer">
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleCourseSubmit} className="space-y-3.5">
              {/* Course ID */}
              <div>
                <label className="text-[11px] font-bold text-text/70 uppercase block mb-1">
                  Course ID
                </label>
                <input
                  type="text"
                  disabled={isEditing}
                  placeholder="e.g. HSK-101"
                  value={courseFormData.courseId}
                  onChange={(e) => setCourseFormData({ ...courseFormData, courseId: e.target.value })}
                  className="w-full bg-text/5 border border-text/10 rounded-xl p-2.5 text-xs font-mono disabled:opacity-50"
                />
              </div>

              {/* Course Title */}
              <div>
                <label className="text-[11px] font-bold text-text/70 uppercase block mb-1">
                  Course Title
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Beginner Chinese (HSK 1)"
                  value={courseFormData.courseName}
                  onChange={(e) => setCourseFormData({ ...courseFormData, courseName: e.target.value })}
                  className="w-full bg-text/5 border border-text/10 rounded-xl p-2.5 text-xs"
                />
              </div>

              {/* Course Status */}
              <div>
                <label className="text-[11px] font-bold text-text/70 uppercase block mb-1">
                  Admission / Batch Status
                </label>
                <select
                  value={courseFormData.status}
                  onChange={(e) => setCourseFormData({ ...courseFormData, status: e.target.value as any })}
                  className="w-full bg-background border border-text/10 rounded-xl p-2.5 text-xs font-bold cursor-pointer"
                >
                  <option value="Coming Soon">Coming Soon (Open for Admission)</option>
                  <option value="Running">Running (Admission Closed)</option>
                  <option value="Completed">Completed</option>
                </select>
              </div>

              {/* Date Inputs with Titles */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-text/70 uppercase block mb-1">
                    Batch Start Date
                  </label>
                  <input
                    type="date"
                    value={courseFormData.startDate}
                    onChange={(e) => setCourseFormData({ ...courseFormData, startDate: e.target.value })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text/70 uppercase block mb-1">
                    Next Batch Date
                  </label>
                  <input
                    type="text"
                    placeholder="e.g. October 15, 2026"
                    value={courseFormData.nextBatchRegistrationDate}
                    onChange={(e) => setCourseFormData({ ...courseFormData, nextBatchRegistrationDate: e.target.value })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl p-2 text-xs"
                  />
                </div>
              </div>

              {/* Class & Lesson Counts */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-text/70 uppercase block mb-1">
                    Total Lessons
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={courseFormData.totalLessons}
                    onChange={(e) => setCourseFormData({ ...courseFormData, totalLessons: Number(e.target.value) })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text/70 uppercase block mb-1">
                    Classes Planned
                  </label>
                  <input
                    type="number"
                    min={1}
                    value={courseFormData.totalClassesPlanned}
                    onChange={(e) => setCourseFormData({ ...courseFormData, totalClassesPlanned: Number(e.target.value) })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-3">
                <button 
                  type="button" 
                  onClick={() => setShowCourseModal(false)} 
                  className="flex-1 py-2 bg-text/5 hover:bg-text/10 rounded-xl text-xs cursor-pointer font-semibold transition-all"
                >
                  Cancel
                </button>
                <button 
                  type="submit" 
                  className="flex-1 py-2 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-secondary/20 transition-all"
                >
                  Save to MongoDB
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}