"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { ArrowLeft, Send, Sparkles, BookOpen, Clock, Calendar, CheckCircle2, KeyRound } from "lucide-react";

export default function TeacherClassLogPage() {
  const [courses, setCourses] = useState<any[]>([]);
  const [selectedCourseId, setSelectedCourseId] = useState("");
  const [teacherPasscode, setTeacherPasscode] = useState("");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00 PM - 10:10 PM");

  const [fromLesson, setFromLesson] = useState(1);
  const [fromText, setFromText] = useState(1);
  const [toLesson, setToLesson] = useState(1);
  const [toText, setToText] = useState(2);

  const [students, setStudents] = useState<any[]>([]);
  const [presentRolls, setPresentRolls] = useState<number[]>([]);

  useEffect(() => {
    Promise.all([
      fetch("/api/academy/courses").then((r) => r.json()),
      fetch("/api/academy/students?status=Approved").then((r) => r.json()),
    ]).then(([crsData, stuData]) => {
      if (crsData.success) {
        setCourses(crsData.courses);
        if (crsData.courses.length > 0) setSelectedCourseId(crsData.courses[0].courseId);
      }
      if (stuData.success) {
        setStudents(stuData.students);
      }
    });
  }, []);

  const enrolled = students.filter((s) => s.enrolledCourseId === selectedCourseId);

  const toggleAttendance = (roll: number) => {
    setPresentRolls((prev) =>
      prev.includes(roll) ? prev.filter((r) => r !== roll) : [...prev, roll]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const absentRolls = enrolled
      .map((s) => s.rollNumber)
      .filter((roll) => !presentRolls.includes(roll));

    const summary = `Lesson ${fromLesson} Text ${fromText} to Lesson ${toLesson} Text ${toText}`;

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
    if (result.success) {
      alert("Class log submitted for Admin approval!");
      window.location.href = "/academy";
    } else {
      alert(result.message || "Failed to submit class log");
    }
  };

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4">
      <div className="max-w-2xl mx-auto space-y-6">
        <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
        </Link>
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> Teacher Class Logger
        </h1>

        <form onSubmit={handleSubmit} className="p-6 bg-text/5 border border-text/10 rounded-2xl space-y-5">
          {/* Passcode Guard */}
          <div>
            <label className="text-xs font-bold block mb-1">Teacher Passcode (e.g. 1234)</label>
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
              <label className="text-xs font-bold block mb-1">Course</label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-background border border-text/10 rounded-xl p-2.5 text-xs"
              >
                {courses.map((c) => (
                  <option key={c.courseId} value={c.courseId}>{c.courseId} - {c.courseName}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="text-xs font-bold block mb-1">Date</label>
              <input
                type="date"
                required
                value={date}
                onChange={(e) => setDate(e.target.value)}
                className="w-full bg-background border border-text/10 rounded-xl p-2 text-xs"
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

          {/* Attendance Selection */}
          <div className="space-y-2">
            <label className="text-xs font-bold block">Mark Present Scholars ({presentRolls.length}/{enrolled.length})</label>
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 max-h-48 overflow-y-auto">
              {enrolled.map((s) => (
                <button
                  key={s.rollNumber}
                  type="button"
                  onClick={() => toggleAttendance(s.rollNumber)}
                  className={`p-2 border rounded-xl text-left text-xs ${
                    presentRolls.includes(s.rollNumber) ? "bg-primary/10 border-primary text-primary" : "bg-background border-text/10 text-text/50"
                  }`}
                >
                  <span className="font-mono block text-[10px]">Roll {s.rollNumber}</span>
                  <span className="font-semibold truncate">{s.nameEnglish}</span>
                </button>
              ))}
            </div>
          </div>

          <button type="submit" className="w-full py-3 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-sm">
            Submit Class Session
          </button>
        </form>
      </div>
    </div>
  );
}