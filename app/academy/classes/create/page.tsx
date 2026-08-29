"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  KeyRound,
  CheckSquare,
  Square,
  Users,
  CheckCircle2,
  Calendar,
  Clock
} from "lucide-react";
import { academyData } from "@/data/academy";

const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

export default function TeacherClassLogPage() {
  const { courses, students } = academyData;

  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.courseId || "");
  const [teacherPasscode, setTeacherPasscode] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00 PM - 10:10 PM");

  const [fromLesson, setFromLesson] = useState(1);
  const [fromText, setFromText] = useState(1);
  const [toLesson, setToLesson] = useState(1);
  const [toText, setToText] = useState(2);

  const [presentRolls, setPresentRolls] = useState<number[]>([]);
  const [submitting, setSubmitting] = useState(false);

  // যে কোর্সটি সিলেক্ট করা আছে তার স্টুডেন্ট ফিল্টার
  const enrolled = students.filter((s) => s.enrolledCourseIds.includes(selectedCourseId));

  // একক স্টুডেন্ট টগল
  const toggleAttendance = (roll: number) => {
    setPresentRolls((prev) =>
      prev.includes(roll) ? prev.filter((r) => r !== roll) : [...prev, roll]
    );
  };

  // All Student Select / Deselect Toggle Logic
  const isAllSelected = enrolled.length > 0 && presentRolls.length === enrolled.length;

  const handleToggleSelectAll = () => {
    if (isAllSelected) {
      setPresentRolls([]);
    } else {
      const allRolls = enrolled.map((s) => Number(s.rollNumber));
      setPresentRolls(allRolls);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    const absentRolls = enrolled
      .map((s) => Number(s.rollNumber))
      .filter((roll) => !presentRolls.includes(roll));

    const summary = `Lesson ${fromLesson} Text ${fromText} to Lesson ${toLesson} Text ${toText}`;

    try {
      const res = await fetch("/api/academy/classes", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          teacherPasscode: teacherPasscode || ADMIN_SECRET_PIN,
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
        alert("Class session logged successfully! Submitted to MongoDB for Admin approval.");
        window.location.href = "/academy";
      } else {
        alert(result.message || "Failed to submit class log");
      }
    } catch (err) {
      setSubmitting(false);
      alert("Error submitting class session. Please try again.");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
        </Link>
        
        <div>
          <h1 className="text-2xl sm:text-3xl font-bold flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" /> Teacher Class Logger
          </h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Log class progress and mark attendance directly for live cohorts.
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
              placeholder="Enter PIN (e.g. 8131)"
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

          {/* 👈 Open Full Grid Student Attendance Section (No Inner Scroll) */}
          <div className="space-y-4 p-4 sm:p-6 bg-background border border-text/10 rounded-3xl">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-text/10 pb-4">
              <div className="flex items-center gap-2">
                <Users className="w-5 h-5 text-primary" />
                <div>
                  <h3 className="text-sm sm:text-base font-bold text-text">
                    Mark Present Students
                  </h3>
                  <span className="text-xs text-text/50">
                    Present: <b className="text-primary">{presentRolls.length}</b> / Total: <b className="text-text">{enrolled.length}</b>
                  </span>
                </div>
              </div>
              
              {/* Select All Toggle Button */}
              {enrolled.length > 0 && (
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className={`text-xs px-3.5 py-2 rounded-xl font-bold border flex items-center justify-center gap-1.5 transition-all cursor-pointer ${
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

            {/* 👈 Full Open Grid: No height restriction or scrollbar */}
            {enrolled.length === 0 ? (
              <p className="text-xs text-text/40 py-8 text-center italic">
                No students enrolled in this course track yet.
              </p>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3 pt-1">
                {enrolled.map((s) => {
                  const isSelected = presentRolls.includes(Number(s.rollNumber));
                  return (
                    <button
                      key={String(s.rollNumber)}
                      type="button"
                      onClick={() => toggleAttendance(Number(s.rollNumber))}
                      className={`p-3.5 border rounded-2xl text-left transition-all cursor-pointer flex items-center justify-between gap-2.5 ${
                        isSelected 
                          ? "bg-primary/10 border-primary text-primary shadow-sm" 
                          : "bg-text/[0.02] border-text/10 text-text/60 hover:border-text/30 hover:bg-text/[0.04]"
                      }`}
                    >
                      <div className="min-w-0 flex-1">
                        <span className="font-mono text-xs font-bold opacity-80 block">
                          Roll #{s.rollNumber}
                        </span>
                        <span className={`text-sm truncate block mt-0.5 ${isSelected ? "font-bold text-text" : "font-semibold text-text/80"}`}>
                          {s.nameEnglish}
                        </span>
                      </div>
                      
                      <div className={`w-6 h-6 rounded-xl border flex items-center justify-center shrink-0 transition-colors ${
                        isSelected ? "bg-primary border-primary text-white shadow-sm" : "border-text/20 bg-background"
                      }`}>
                        {isSelected && <CheckCircle2 className="w-4 h-4 text-white" />}
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