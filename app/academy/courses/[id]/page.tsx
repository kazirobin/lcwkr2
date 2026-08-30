"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Layers, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Edit3, 
  KeyRound, 
  X, 
  Lock, 
  Unlock,
  CheckSquare,
  Square,
  Save,
  Trash2,
  RefreshCw,
  Loader2
} from "lucide-react";
import { academyData } from "@/data/academy";
import { ICourse, IClassSession, IStudent } from "@/types/academy";

const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CourseDetailsPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = use(params);
  const courseId = decodeURIComponent(resolvedParams.id).trim();

  // MongoDB লাইভ ডাটা স্টেট
  const [course, setCourse] = useState<ICourse | null>(
    academyData.courses.find((c) => c.courseId.toLowerCase() === courseId.toLowerCase()) || null
  );
  const [allStudents, setAllStudents] = useState<IStudent[]>(academyData.students || []);
  const [loading, setLoading] = useState(false);

  // অ্যাডমিন স্টেট
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showAdminPinModal, setShowAdminPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);

  // ক্লাস এডিট মোডাল স্টেট
  const [editingClass, setEditingClass] = useState<IClassSession | null>(null);
  const [editFormData, setEditFormData] = useState({
    classId: "",
    date: "",
    time: "",
    summary: "",
    fromLesson: 1,
    fromText: 1,
    toLesson: 1,
    toText: 1,
    presentStudents: [] as string[],
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("academy_admin_unlocked");
    if (saved === "true") {
      setIsAdminUnlocked(true);
    }
  }, []);

  // MongoDB API থেকে লাইভ ডেটা ফেচ
  const fetchLiveCourseData = async () => {
    setLoading(true);
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        fetch("/api/academy/courses", { cache: "no-store" }),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }),
      ]);

      const coursesData = await coursesRes.json();
      const studentsData = await studentsRes.json();

      if (coursesData.success && coursesData.courses) {
        const found = coursesData.courses.find(
          (c: ICourse) => c.courseId.toLowerCase() === courseId.toLowerCase()
        );
        if (found) setCourse(found);
      }

      if (studentsData.success && studentsData.students && studentsData.students.length > 0) {
        setAllStudents(studentsData.students);
      }
    } catch (err) {
      console.error("Failed to load live data from MongoDB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveCourseData();
  }, [courseId]);

  // স্টুডেন্ট ফিল্টারিং (array বা string উভয় ফিল্ড সাপোর্ট)
  const currentCourseCode = (course?.courseId || courseId).toLowerCase();
  
  const studentSourceList = allStudents.length > 0 ? allStudents : academyData.students;
  const filteredEnrolled = studentSourceList.filter((s: any) => {
    if (Array.isArray(s.enrolledCourseIds)) {
      return s.enrolledCourseIds.some((id: string) => id.toLowerCase() === currentCourseCode);
    }
    if (s.enrolledCourseId) {
      return String(s.enrolledCourseId).toLowerCase() === currentCourseCode;
    }
    return false;
  });

  // যদি ফিল্টারিংয়ে কোনো স্টুডেন্ট না মেলে, সেফ ফলব্যাক হিসেবে সব স্টুডেন্ট দেখাবে
  const enrolledStudents = filteredEnrolled.length > 0 ? filteredEnrolled : studentSourceList;

  // রোল নম্বর থেকে শিক্ষার্থীর নাম ম্যাপ
  const studentMap = new Map<string, string>();
  studentSourceList.forEach((s) => {
    studentMap.set(String(s.rollNumber).trim(), s.nameEnglish);
  });

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === ADMIN_SECRET_PIN.trim()) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem("academy_admin_unlocked", "true");
      setShowAdminPinModal(false);
      setEnteredPin("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  // এডিট মোডাল ওপেন
  const handleOpenEditModal = (cls: IClassSession) => {
    if (!isAdminUnlocked) {
      setShowAdminPinModal(true);
      return;
    }

    setEditingClass(cls);
    setEditFormData({
      classId: cls.classId,
      date: cls.date,
      time: cls.time,
      summary: cls.contentCovered?.summary || "",
      fromLesson: cls.contentCovered?.fromLesson || 1,
      fromText: cls.contentCovered?.fromText || 1,
      toLesson: cls.contentCovered?.toLesson || 1,
      toText: cls.contentCovered?.toText || 1,
      presentStudents: (cls.presentStudents || []).map((r) => String(r).trim()),
    });
  };

  // উপস্থিতি টগল ফাংশন
  const toggleAttendanceInEdit = (roll: string | number) => {
    const rollStr = String(roll).trim();
    setEditFormData((prev) => {
      const isPresent = prev.presentStudents.includes(rollStr);
      return {
        ...prev,
        presentStudents: isPresent
          ? prev.presentStudents.filter((r) => r !== rollStr)
          : [...prev.presentStudents, rollStr],
      };
    });
  };

  // সব সিলেক্ট / ডিসিলেক্ট টগল
  const handleToggleSelectAll = () => {
    const allRolls = enrolledStudents.map((s) => String(s.rollNumber).trim());
    const isAllSelected = editFormData.presentStudents.length === allRolls.length;

    setEditFormData((prev) => ({
      ...prev,
      presentStudents: isAllSelected ? [] : allRolls,
    }));
  };

  // ক্লাস লগ সেভ হ্যান্ডলার
  const handleSaveClassEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const allEnrolledRolls = enrolledStudents.map((s) => String(s.rollNumber).trim());
    const absentRolls = allEnrolledRolls.filter(
      (roll) => !editFormData.presentStudents.includes(roll)
    );

    const updatedSummary = editFormData.summary.trim() 
      ? editFormData.summary 
      : `Lesson ${editFormData.fromLesson} Text ${editFormData.fromText} to Lesson ${editFormData.toLesson} Text ${editFormData.toText}`;

    try {
      const res = await fetch("/api/academy/classes/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course?.courseId || courseId,
          classId: editFormData.classId,
          date: editFormData.date,
          time: editFormData.time,
          contentCovered: {
            summary: updatedSummary,
            fromLesson: editFormData.fromLesson,
            fromText: editFormData.fromText,
            toLesson: editFormData.toLesson,
            toText: editFormData.toText,
          },
          presentStudents: editFormData.presentStudents,
          absentStudents: absentRolls,
          adminPasscode: ADMIN_SECRET_PIN,
        }),
      });

      const data = await res.json();
      if (data.success) {
        await fetchLiveCourseData();
        setEditingClass(null);
        alert("Attendance & Class Details Updated Successfully!");
      } else {
        alert(data.message || "Failed to update attendance.");
      }
    } catch (err) {
      console.error(err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

  // ক্লাস ডিলিট হ্যান্ডলার
  const handleDeleteClass = async (classId: string) => {
    if (!isAdminUnlocked) {
      setShowAdminPinModal(true);
      return;
    }

    if (!confirm(`Are you sure you want to delete "${classId}"?\n\nSubsequent classes will automatically shift up to fill this sequence.`)) {
      return;
    }

    setDeletingId(classId);
    try {
      const res = await fetch("/api/academy/classes/delete", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course?.courseId || courseId,
          classId,
          adminPasscode: ADMIN_SECRET_PIN,
        }),
      });

      const result = await res.json();
      if (result.success) {
        await fetchLiveCourseData();
        alert(`Class ${classId} deleted and sequence re-indexed in MongoDB!`);
      } else {
        alert(result.message || "Failed to delete class session.");
      }
    } catch (err) {
      console.error(err);
      alert("Error deleting class. Please try again.");
    } finally {
      setDeletingId(null);
    }
  };

  if (loading && !course) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-mono text-text/50">Fetching Course Data...</p>
        </div>
      </div>
    );
  }

  if (!course) {
    return (
      <div className="min-h-screen bg-background text-text py-20 px-4 text-center space-y-4">
        <p className="text-sm font-semibold text-text/70">Course Track "{courseId}" not found.</p>
        <Link href="/academy/courses" className="text-xs text-primary hover:underline font-bold">
          ← Back to Courses
        </Link>
      </div>
    );
  }

  const completedClasses = course.classes?.length ?? course.completedClassesCount ?? 0;
  const totalPlanned = course.totalClassesPlanned || 24;
  const progressPct = Math.min(100, Math.round((completedClasses / totalPlanned) * 100) || 0);

  return (
    <div className="min-h-screen bg-background text-text py-8 sm:py-10 px-4 sm:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-8">
        
        {/* Navigation & Header */}
        <div className="flex justify-between items-center">
          <Link
            href="/academy/courses"
            className="text-xs text-text/60 hover:text-text hover:underline inline-flex items-center gap-1.5 font-medium transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
          </Link>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchLiveCourseData}
              className="p-1.5 rounded-lg bg-text/5 hover:bg-text/10 border border-text/10 text-text/60 hover:text-text transition-colors cursor-pointer"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            {isAdminUnlocked ? (
              <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Unlock className="w-3 h-3" /> Admin Mode Active
              </span>
            ) : (
              <button
                onClick={() => {
                  setEnteredPin("");
                  setPinError(false);
                  setShowAdminPinModal(true);
                }}
                className="text-xs text-text/50 hover:text-text bg-text/5 border border-text/10 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
              >
                <Lock className="w-3 h-3 text-primary" /> Admin Unlock
              </button>
            )}
          </div>
        </div>

        {/* Course Banner */}
        <div className="p-6 sm:p-8 rounded-3xl bg-text/5 border border-text/10 space-y-6 shadow-sm">
          <div className="flex justify-between items-start flex-wrap gap-2">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="font-mono text-xs font-bold text-secondary bg-secondary/10 border border-secondary/20 px-3 py-1 rounded-xl">
                {course.courseId}
              </span>
              <span className="text-xs bg-text/5 border border-text/10 px-2.5 py-1 rounded-xl">
                Target: <b>{course.targetLevel}</b>
              </span>
            </div>

            <span
              className={`text-xs px-3 py-1 rounded-full font-bold border flex items-center gap-1.5 ${
                course.status === "Running"
                  ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                  : "bg-amber-500/10 text-amber-500 border-amber-500/20"
              }`}
            >
              <span className={`w-2 h-2 rounded-full ${course.status === "Running" ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
              {course.status}
            </span>
          </div>

          <div>
            <h1 className="text-2xl sm:text-3xl font-extrabold text-text">
              {course.courseName}
            </h1>
            <p className="text-xs sm:text-sm text-text/50 mt-1">
              Total Lessons: <b>{course.totalLessons}</b> • Enrolled: <b>{enrolledStudents.length} Scholars</b>
            </p>
          </div>

          {/* Quick Metrics */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4 border-t border-text/10 text-xs">
            <div className="p-3 bg-background rounded-2xl border border-text/10">
              <span className="text-text/40 block text-[10px] uppercase font-mono">Lessons</span>
              <span className="font-bold text-sm text-text">{course.totalLessons} Lessons</span>
            </div>
            <div className="p-3 bg-background rounded-2xl border border-text/10">
              <span className="text-text/40 block text-[10px] uppercase font-mono">Enrolled</span>
              <span className="font-bold text-sm text-primary">{enrolledStudents.length} Scholars</span>
            </div>
            <div className="p-3 bg-background rounded-2xl border border-text/10">
              <span className="text-text/40 block text-[10px] uppercase font-mono">Classes Done</span>
              <span className="font-bold text-sm text-secondary font-mono">{completedClasses} / {totalPlanned}</span>
            </div>
            <div className="p-3 bg-background rounded-2xl border border-text/10">
              <span className="text-text/40 block text-[10px] uppercase font-mono">Completion</span>
              <span className="font-bold text-sm text-emerald-500 font-mono">{progressPct}%</span>
            </div>
          </div>
        </div>

        {/* Detailed Class Log History */}
        <div className="space-y-4">
          <h3 className="text-lg font-bold flex items-center gap-2">
            <Layers className="w-5 h-5 text-secondary" /> Class Log History & Details ({course.classes?.length || 0})
          </h3>

          {!course.classes || course.classes.length === 0 ? (
            <div className="p-8 text-center rounded-3xl bg-text/5 border border-text/10 text-xs text-text/40">
              No classes logged yet for this cohort.
            </div>
          ) : (
            <div className="space-y-4">
              {course.classes.map((cls, index) => {
                const presentList = (cls.presentStudents || []).map((r) => String(r).trim());
                const absentList = (cls.absentStudents || []).map((r) => String(r).trim());
                const isDeleting = deletingId === cls.classId;
                const uniqueKey = cls._id ? String(cls._id) : `${cls.classId}-${cls.date}-${index}`;

                return (
                  <div
                    key={uniqueKey}
                    className="p-5 sm:p-6 rounded-3xl border border-text/10 bg-text/[0.02] hover:bg-text/[0.04] space-y-4 transition-all"
                  >
                    {/* Log Card Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-text/10 pb-3">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold px-2.5 py-1 rounded-xl bg-secondary/10 text-secondary border border-secondary/20">
                          {cls.classId}
                        </span>
                        <span className="text-sm font-bold text-text">
                          {cls.contentCovered?.summary || "Regular Session"}
                        </span>
                      </div>

                      <div className="flex items-center gap-2 self-start sm:self-auto">
                        <div className="flex items-center gap-3 text-xs font-mono text-text/60 mr-1">
                          <span className="inline-flex items-center gap-1">
                            <Calendar className="w-3.5 h-3.5 text-secondary" />
                            {cls.date}
                          </span>
                          <span className="inline-flex items-center gap-1">
                            <Clock className="w-3.5 h-3.5 text-primary" />
                            {cls.time}
                          </span>
                        </div>

                        {/* Edit Button */}
                        <button
                          onClick={() => handleOpenEditModal(cls)}
                          className="p-1.5 rounded-lg bg-text/5 hover:bg-primary/20 text-text/60 hover:text-primary border border-text/10 transition-colors cursor-pointer"
                          title="Edit Attendance & Details"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          disabled={isDeleting}
                          onClick={() => handleDeleteClass(cls.classId)}
                          className="p-1.5 rounded-lg bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 transition-all cursor-pointer disabled:opacity-50"
                          title="Delete this Class Session"
                        >
                          <Trash2 className={`w-3.5 h-3.5 ${isDeleting ? "animate-spin" : ""}`} />
                        </button>
                      </div>
                    </div>

                    {/* Content Progression Grid */}
                    {cls.contentCovered && (
                      <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-background p-3 rounded-2xl border border-text/10 text-center font-mono">
                        <div>
                          <span className="text-[10px] text-text/40 block">From Lesson</span>
                          <span className="font-bold text-text">L-{cls.contentCovered.fromLesson}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text/40 block">From Text</span>
                          <span className="font-bold text-text">Text {cls.contentCovered.fromText}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text/40 block">To Lesson</span>
                          <span className="font-bold text-text">L-{cls.contentCovered.toLesson}</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-text/40 block">To Text</span>
                          <span className="font-bold text-text">Text {cls.contentCovered.toText}</span>
                        </div>
                      </div>
                    )}

                    {/* Attendance Details (Names & Rolls) */}
                    <div className="space-y-3 pt-1">
                      <div className="flex items-center gap-3 text-xs font-semibold">
                        <span className="inline-flex items-center gap-1 text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-xl">
                          <CheckCircle2 className="w-3.5 h-3.5" />
                          Present: {presentList.length}
                        </span>
                        <span className="inline-flex items-center gap-1 text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-xl">
                          <XCircle className="w-3.5 h-3.5" />
                          Absent: {absentList.length}
                        </span>
                      </div>

                      {/* Present Students */}
                      {presentList.length > 0 && (
                        <div className="space-y-1.5">
                          <span className="text-[10px] font-bold text-emerald-500 uppercase tracking-wider block">
                            Present Students:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {presentList.map((roll) => (
                              <span
                                key={roll}
                                className="text-[11px] font-mono bg-emerald-500/10 text-emerald-500 border border-emerald-500/20 px-2.5 py-1 rounded-xl inline-flex items-center gap-1"
                              >
                                <span className="font-bold">#{roll}</span>
                                <span className="text-text/80 font-sans font-medium">
                                  {studentMap.get(roll) || `Student #${roll}`}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}

                      {/* Absent Students */}
                      {absentList.length > 0 && (
                        <div className="space-y-1.5 pt-1">
                          <span className="text-[10px] font-bold text-secondary uppercase tracking-wider block">
                            Absent Students:
                          </span>
                          <div className="flex flex-wrap gap-1.5">
                            {absentList.map((roll) => (
                              <span
                                key={roll}
                                className="text-[11px] font-mono bg-secondary/10 text-secondary border border-secondary/20 px-2.5 py-1 rounded-xl inline-flex items-center gap-1"
                              >
                                <span className="font-bold">#{roll}</span>
                                <span className="text-text/80 font-sans font-medium">
                                  {studentMap.get(roll) || `Student #${roll}`}
                                </span>
                              </span>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>

      </div>

      {/* 1. Admin Passcode Modal */}
      {showAdminPinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-background border border-text/10 rounded-2xl p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowAdminPinModal(false)}
              className="absolute top-3 right-3 text-text/40 hover:text-text p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-text/10 pb-2.5">
              <KeyRound className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">Instructor Verification</h3>
            </div>

            <p className="text-xs text-text/50">
              Enter Admin passcode to edit or delete class logs.
            </p>

            <form onSubmit={handleUnlock} className="space-y-3">
              <input
                type="password"
                autoFocus
                placeholder="Enter Admin PIN"
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                className={`w-full bg-text/5 border ${
                  pinError ? "border-secondary" : "border-text/10 focus:border-primary"
                } rounded-xl px-3 py-2 text-xs font-mono text-center tracking-widest focus:outline-none`}
              />

              {pinError && (
                <span className="text-[10px] text-secondary block text-center">
                  Incorrect PIN. Try again.
                </span>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowAdminPinModal(false)}
                  className="flex-1 py-1.5 bg-text/5 rounded-xl text-xs font-semibold text-text/60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-secondary text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* 2. 👈 Class Log Edit Modal (Full Open Student Grid without Inner Scrollbar) */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-3 sm:p-4">
          <div className="w-full max-w-2xl bg-background border border-text/10 rounded-3xl p-5 sm:p-7 space-y-5 max-h-[92vh] overflow-y-auto shadow-2xl">
            <div className="flex justify-between items-center border-b border-text/10 pb-3">
              <div>
                <h3 className="text-base sm:text-lg font-bold flex items-center gap-1.5">
                  <Edit3 className="w-4 h-4 text-secondary" /> Edit {editFormData.classId}
                </h3>
                <span className="text-xs text-text/50">{course.courseName}</span>
              </div>
              <button
                onClick={() => setEditingClass(null)}
                className="p-1 text-text/40 hover:text-text cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <form onSubmit={handleSaveClassEdit} className="space-y-5">
              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-text/70 block mb-1">Class Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text/70 block mb-1">Class Time</label>
                  <input
                    type="text"
                    required
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl p-2.5 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Lesson Progression */}
              <div className="p-4 bg-text/5 border border-text/10 rounded-2xl space-y-2.5">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">Curriculum Progression</span>
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-text/50 block mb-1">From Lesson</span>
                    <input
                      type="number"
                      min={1}
                      value={editFormData.fromLesson}
                      onChange={(e) => setEditFormData({ ...editFormData, fromLesson: Number(e.target.value) })}
                      className="w-full bg-background border border-text/10 p-2 rounded-xl font-mono text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-text/50 block mb-1">From Text</span>
                    <input
                      type="number"
                      min={1}
                      value={editFormData.fromText}
                      onChange={(e) => setEditFormData({ ...editFormData, fromText: Number(e.target.value) })}
                      className="w-full bg-background border border-text/10 p-2 rounded-xl font-mono text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-text/50 block mb-1">To Lesson</span>
                    <input
                      type="number"
                      min={1}
                      value={editFormData.toLesson}
                      onChange={(e) => setEditFormData({ ...editFormData, toLesson: Number(e.target.value) })}
                      className="w-full bg-background border border-text/10 p-2 rounded-xl font-mono text-center font-bold"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-text/50 block mb-1">To Text</span>
                    <input
                      type="number"
                      min={1}
                      value={editFormData.toText}
                      onChange={(e) => setEditFormData({ ...editFormData, toText: Number(e.target.value) })}
                      className="w-full bg-background border border-text/10 p-2 rounded-xl font-mono text-center font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Selection (Full Open Grid without Scrollbar) */}
              <div className="space-y-3 p-4 bg-background border border-text/10 rounded-2xl">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-text/10 pb-3">
                  <div>
                    <label className="text-xs sm:text-sm font-bold block text-text">
                      Mark Present Students
                    </label>
                    <div className="flex items-center gap-3 text-xs mt-0.5">
                      <span className="text-emerald-500 font-semibold flex items-center gap-1">
                        <CheckCircle2 className="w-3.5 h-3.5" /> Present: <b>{editFormData.presentStudents.length}</b>
                      </span>
                      <span className="text-secondary font-semibold flex items-center gap-1">
                        <XCircle className="w-3.5 h-3.5" /> Absent: <b>{enrolledStudents.length - editFormData.presentStudents.length}</b>
                      </span>
                      <span className="text-text/40 font-mono">Total: {enrolledStudents.length}</span>
                    </div>
                  </div>

                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className={`text-xs px-3 py-1.5 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
                      editFormData.presentStudents.length === enrolledStudents.length
                        ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                        : "bg-text/5 text-text/70 border-text/10 hover:text-text hover:bg-text/10"
                    }`}
                  >
                    {editFormData.presentStudents.length === enrolledStudents.length ? (
                      <>
                        <CheckSquare className="w-3.5 h-3.5 text-primary" /> Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="w-3.5 h-3.5 text-text/40" /> Select All ({enrolledStudents.length})
                      </>
                    )}
                  </button>
                </div>

                {/* 👈 Open Grid (সব নাম একসাথে দেখাবে) */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5 pt-1">
                  {enrolledStudents.map((s) => {
                    const rollStr = String(s.rollNumber).trim();
                    const isPresent = editFormData.presentStudents.includes(rollStr);

                    return (
                      <button
                        key={rollStr}
                        type="button"
                        onClick={() => toggleAttendanceInEdit(rollStr)}
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
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2.5 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="flex-1 py-3 bg-text/5 hover:bg-text/10 rounded-2xl text-xs font-semibold cursor-pointer transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-3 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-2xl text-xs cursor-pointer shadow-md shadow-secondary/20 flex items-center justify-center gap-1.5 disabled:opacity-50 transition-all"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving Changes..." : "Save Updates to Database"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}