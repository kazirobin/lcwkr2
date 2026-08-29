"use client";

import { useState } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  Sparkles, 
  BookOpen, 
  Clock, 
  Calendar, 
  CheckCircle2, 
  KeyRound,
  CheckSquare,
  Square
} from "lucide-react";
import { academyData } from "@/data/academy";

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

  // 👈 All Student Select / Deselect Toggle Logic
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
          teacherPasscode,
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
    <div className="min-h-screen bg-background text-text py-10 px-4 transition-colors">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> Teacher Class Logger
        </h1>

        <form onSubmit={handleSubmit} className="p-6 bg-text/5 border border-text/10 rounded-2xl space-y-5 shadow-xl">
          {/* Passcode */}
          <div>
            <label className="text-xs font-bold flex items-center gap-1 mb-1">
              <KeyRound className="w-3.5 h-3.5 text-secondary" /> Teacher Passcode (e.g. 1234)
            </label>
            <input
              type="password"
              required
              value={teacherPasscode}
              onChange={(e) => setTeacherPasscode(e.target.value)}
              placeholder="Enter PIN"
              className="w-full bg-background border border-text/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary font-mono tracking-widest"
            />
          </div>

          <div className="grid grid-cols-2 gap-3">
            <div>
              <label className="text-xs font-bold block mb-1">Course Track</label>
              <select
                value={selectedCourseId}
                onChange={(e) => {
                  setSelectedCourseId(e.target.value);
                  setPresentRolls([]);
                }}
                className="w-full bg-background border border-text/10 rounded-xl p-2.5 text-xs font-semibold cursor-pointer"
              >
                {courses.map((c) => (
                  <option key={c.courseId} value={c.courseId}>{c.courseId} - {c.courseName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Class Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-text/10 rounded-xl p-2 text-xs font-mono"
              />
            </div>
          </div>

          {/* Curriculum Range */}
          <div className="p-3 bg-background border border-text/10 rounded-xl space-y-2">
            <span className="text-[11px] font-bold text-secondary uppercase">Curriculum Progression Range</span>
            <div className="grid grid-cols-4 gap-2 text-center text-xs">
              <div>
                <span className="text-[10px] text-text/50 block">From Lesson</span>
                <input type="number" min={1} value={fromLesson} onChange={(e) => setFromLesson(Number(e.target.value))} className="w-full bg-text/5 border border-text/10 p-1.5 rounded" />
              </div>
              <div>
                <span className="text-[10px] text-text/50 block">From Text</span>
                <input type="number" min={1} value={fromText} onChange={(e) => setFromText(Number(e.target.value))} className="w-full bg-text/5 border border-text/10 p-1.5 rounded" />
              </div>
              <div>
                <span className="text-[10px] text-text/50 block">To Lesson</span>
                <input type="number" min={1} value={toLesson} onChange={(e) => setToLesson(Number(e.target.value))} className="w-full bg-text/5 border border-text/10 p-1.5 rounded" />
              </div>
              <div>
                <span className="text-[10px] text-text/50 block">To Text</span>
                <input type="number" min={1} value={toText} onChange={(e) => setToText(Number(e.target.value))} className="w-full bg-text/5 border border-text/10 p-1.5 rounded" />
              </div>
            </div>
          </div>

          {/* Attendance Header & Select All Button */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <label className="text-xs font-bold">
                Mark Present Scholars ({presentRolls.length}/{enrolled.length})
              </label>
              
              {/* 👈 Select All Toggle Button */}
              {enrolled.length > 0 && (
                <button
                  type="button"
                  onClick={handleToggleSelectAll}
                  className={`text-xs px-2.5 py-1 rounded-lg font-semibold border flex items-center gap-1.5 transition-all cursor-pointer ${
                    isAllSelected
                      ? "bg-primary/10 text-primary border-primary/30 hover:bg-primary/20"
                      : "bg-text/5 text-text/70 border-text/10 hover:text-text hover:bg-text/10"
                  }`}
                >
                  {isAllSelected ? (
                    <>
                      <CheckSquare className="w-3.5 h-3.5 text-primary" />
                      <span>Deselect All</span>
                    </>
                  ) : (
                    <>
                      <Square className="w-3.5 h-3.5 text-text/50" />
                      <span>Select All ({enrolled.length})</span>
                    </>
                  )}
                </button>
              )}
            </div>

            {/* Scholars List Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto pr-1">
              {enrolled.map((s) => {
                const isSelected = presentRolls.includes(Number(s.rollNumber));
                return (
                  <button
                    key={String(s.rollNumber)}
                    type="button"
                    onClick={() => toggleAttendance(Number(s.rollNumber))}
                    className={`p-2 border rounded-xl text-left text-xs transition-all cursor-pointer flex items-center justify-between gap-1.5 ${
                      isSelected 
                        ? "bg-primary/10 border-primary text-primary font-bold shadow-sm" 
                        : "bg-background border-text/10 text-text/50 hover:border-text/20"
                    }`}
                  >
                    <div className="min-w-0">
                      <span className="font-mono block text-[10px] opacity-75">Roll {s.rollNumber}</span>
                      <span className="truncate block">{s.nameEnglish}</span>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-primary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          <button 
            type="submit" 
            disabled={submitting}
            className="w-full py-3 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-sm shadow-md shadow-secondary/20 cursor-pointer transition-all"
          >
            {submitting ? "Submitting to Database..." : "Submit Class Session"}
          </button>
        </form>
      </div>
    </div>
  );
}