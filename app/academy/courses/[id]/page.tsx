"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import { notFound, useRouter } from "next/navigation";
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
  Trash2
} from "lucide-react";
import { academyData } from "@/data/academy";
import { IClassSession } from "@/types/academy";

const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

interface Props {
  params: Promise<{ id: string }>;
}

export default function CourseDetailsPage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = use(params);
  const courseId = decodeURIComponent(resolvedParams.id).trim();

  // লোকাল ডাটা স্টেট
  const [coursesData, setCoursesData] = useState(academyData.courses);
  const course = coursesData.find((c) => c.courseId.toLowerCase() === courseId.toLowerCase());

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
    presentStudents: [] as number[],
  });
  const [saving, setSaving] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);

  useEffect(() => {
    const saved = sessionStorage.getItem("academy_admin_unlocked");
    if (saved === "true") {
      setIsAdminUnlocked(true);
    }
  }, []);

  if (!course) {
    notFound();
  }

  // এই কোর্সে নথিভুক্ত শিক্ষার্থীরা
  const enrolledStudents = academyData.students.filter((s) =>
    s.enrolledCourseIds?.includes(course.courseId)
  );

  // রোল নম্বর থেকে শিক্ষার্থীর নাম ম্যাপ
  const studentMap = new Map<number, string>();
  academyData.students.forEach((s) => {
    studentMap.set(Number(s.rollNumber), s.nameEnglish);
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
      presentStudents: (cls.presentStudents || []).map((r) => Number(r)),
    });
  };

  // 👈 ক্লাস লগ ডিলিট এবং স্বয়ংক্রিয় সিরিয়াল শিফট হ্যান্ডলার
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
          courseId: course.courseId,
          classId,
          adminPasscode: ADMIN_SECRET_PIN,
        }),
      });

      const result = await res.json();
      if (result.success) {
        // ফ্রন্টএন্ডে সাথে সাথে সিরিয়াল রিনাম্বার করে আপডেট করা
        const cleanCourseCode = course.courseId.replace(/[^a-zA-Z0-9]/g, "");
        const updatedList = (result.classes || course.classes.filter((cls) => cls.classId !== classId)).map(
          (cls: IClassSession, idx: number) => ({
            ...cls,
            classId: `CLS-${cleanCourseCode}-${String(idx + 1).padStart(2, "0")}`,
          })
        );

        setCoursesData((prevCourses) =>
          prevCourses.map((c) => {
            if (c.courseId !== course.courseId) return c;
            return {
              ...c,
              classes: updatedList,
              completedClassesCount: updatedList.length,
            };
          })
        );
        alert(`Class deleted and subsequent classes re-indexed successfully!`);
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

  // এডিট ফর্মে উপস্থিতির টগল
  const toggleAttendanceInEdit = (roll: number) => {
    setEditFormData((prev) => ({
      ...prev,
      presentStudents: prev.presentStudents.includes(roll)
        ? prev.presentStudents.filter((r) => r !== roll)
        : [...prev.presentStudents, roll],
    }));
  };

  // সব সিলেক্ট / ডিসিলেক্ট টগল
  const handleToggleSelectAll = () => {
    const allRolls = enrolledStudents.map((s) => Number(s.rollNumber));
    const isAllSelected = editFormData.presentStudents.length === allRolls.length;

    setEditFormData((prev) => ({
      ...prev,
      presentStudents: isAllSelected ? [] : allRolls,
    }));
  };

  // ক্লাস লগ আপডেট সাবমিট
  const handleSaveClassEdit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);

    const absentRolls = enrolledStudents
      .map((s) => Number(s.rollNumber))
      .filter((roll) => !editFormData.presentStudents.includes(roll));

    const updatedSummary = editFormData.summary.trim() 
      ? editFormData.summary 
      : `Lesson ${editFormData.fromLesson} Text ${editFormData.fromText} to Lesson ${editFormData.toLesson} Text ${editFormData.toText}`;

    try {
      const res = await fetch("/api/academy/classes/edit", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          courseId: course.courseId,
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

      setCoursesData((prevCourses) =>
        prevCourses.map((c) => {
          if (c.courseId !== course.courseId) return c;
          return {
            ...c,
            classes: c.classes.map((cls) => {
              if (cls.classId !== editFormData.classId) return cls;
              return {
                ...cls,
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
              };
            }),
          };
        })
      );

      setEditingClass(null);
      alert("Class log updated successfully!");
    } catch (err) {
      console.error(err);
      alert("Failed to save changes. Please try again.");
    } finally {
      setSaving(false);
    }
  };

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
                const presentList = (cls.presentStudents || []).map((r) => Number(r));
                const absentList = (cls.absentStudents || []).map((r) => Number(r));
                const isDeleting = deletingId === cls.classId;

                // 👈 ডুপ্লিকেট React Key এড়াতে সম্পূর্ণ ইউনিক কী জেনারেশন
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
                          title="Edit this Class Log & Attendance"
                        >
                          <Edit3 className="w-3.5 h-3.5" />
                        </button>

                        {/* Delete Button */}
                        <button
                          disabled={isDeleting}
                          onClick={() => handleDeleteClass(cls.classId)}
                          className="p-1.5 rounded-lg bg-secondary/10 hover:bg-secondary text-secondary hover:text-white border border-secondary/20 transition-all cursor-pointer disabled:opacity-50"
                          title="Delete this Class Session & Shift Subsequent Classes"
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

      {/* 1. Admin Verification Passcode Modal */}
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

      {/* 2. Class Log Edit Modal */}
      {editingClass && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-lg bg-background border border-text/10 rounded-3xl p-6 space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b border-text/10 pb-3">
              <div>
                <h3 className="text-base font-bold flex items-center gap-1.5">
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

            <form onSubmit={handleSaveClassEdit} className="space-y-4">
              {/* Date & Time */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="text-[11px] font-bold text-text/70 block mb-1">Class Date</label>
                  <input
                    type="date"
                    required
                    value={editFormData.date}
                    onChange={(e) => setEditFormData({ ...editFormData, date: e.target.value })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
                <div>
                  <label className="text-[11px] font-bold text-text/70 block mb-1">Class Time</label>
                  <input
                    type="text"
                    required
                    value={editFormData.time}
                    onChange={(e) => setEditFormData({ ...editFormData, time: e.target.value })}
                    className="w-full bg-text/5 border border-text/10 rounded-xl p-2 text-xs font-mono"
                  />
                </div>
              </div>

              {/* Lesson Progression */}
              <div className="p-3 bg-text/5 border border-text/10 rounded-2xl space-y-2">
                <span className="text-[11px] font-bold text-secondary uppercase block">Curriculum Progression</span>
                <div className="grid grid-cols-4 gap-2 text-center text-xs">
                  <div>
                    <span className="text-[10px] text-text/50 block">From Lesson</span>
                    <input
                      type="number"
                      min={1}
                      value={editFormData.fromLesson}
                      onChange={(e) => setEditFormData({ ...editFormData, fromLesson: Number(e.target.value) })}
                      className="w-full bg-background border border-text/10 p-1.5 rounded font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-text/50 block">From Text</span>
                    <input
                      type="number"
                      min={1}
                      value={editFormData.fromText}
                      onChange={(e) => setEditFormData({ ...editFormData, fromText: Number(e.target.value) })}
                      className="w-full bg-background border border-text/10 p-1.5 rounded font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-text/50 block">To Lesson</span>
                    <input
                      type="number"
                      min={1}
                      value={editFormData.toLesson}
                      onChange={(e) => setEditFormData({ ...editFormData, toLesson: Number(e.target.value) })}
                      className="w-full bg-background border border-text/10 p-1.5 rounded font-mono text-center"
                    />
                  </div>
                  <div>
                    <span className="text-[10px] text-text/50 block">To Text</span>
                    <input
                      type="number"
                      min={1}
                      value={editFormData.toText}
                      onChange={(e) => setEditFormData({ ...editFormData, toText: Number(e.target.value) })}
                      className="w-full bg-background border border-text/10 p-1.5 rounded font-mono text-center"
                    />
                  </div>
                </div>
              </div>

              {/* Attendance Selection */}
              <div className="space-y-2">
                <div className="flex justify-between items-center">
                  <label className="text-xs font-bold">
                    Mark Present ({editFormData.presentStudents.length}/{enrolledStudents.length})
                  </label>
                  <button
                    type="button"
                    onClick={handleToggleSelectAll}
                    className="text-[11px] px-2 py-0.5 rounded-lg bg-text/5 border border-text/10 text-text/70 hover:text-text cursor-pointer font-semibold flex items-center gap-1"
                  >
                    {editFormData.presentStudents.length === enrolledStudents.length ? (
                      <>
                        <CheckSquare className="w-3 h-3 text-primary" /> Deselect All
                      </>
                    ) : (
                      <>
                        <Square className="w-3 h-3 text-text/40" /> Select All
                      </>
                    )}
                  </button>
                </div>

                <div className="grid grid-cols-2 gap-2 max-h-44 overflow-y-auto pr-1">
                  {enrolledStudents.map((s) => {
                    const isPresent = editFormData.presentStudents.includes(Number(s.rollNumber));
                    return (
                      <button
                        key={String(s.rollNumber)}
                        type="button"
                        onClick={() => toggleAttendanceInEdit(Number(s.rollNumber))}
                        className={`p-2 rounded-xl border text-left text-xs transition-all cursor-pointer flex justify-between items-center gap-1 ${
                          isPresent
                            ? "bg-primary/10 border-primary text-primary font-bold shadow-sm"
                            : "bg-text/5 border-text/10 text-text/50"
                        }`}
                      >
                        <div className="min-w-0">
                          <span className="font-mono text-[10px] block opacity-75">Roll #{s.rollNumber}</span>
                          <span className="truncate block">{s.nameEnglish}</span>
                        </div>
                        {isPresent && <CheckCircle2 className="w-3.5 h-3.5 shrink-0 text-primary" />}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setEditingClass(null)}
                  className="flex-1 py-2 bg-text/5 hover:bg-text/10 rounded-xl text-xs font-semibold cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 py-2 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-xs cursor-pointer shadow-md shadow-secondary/20 flex items-center justify-center gap-1.5"
                >
                  <Save className="w-3.5 h-3.5" />
                  <span>{saving ? "Saving Changes..." : "Save Updates"}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}