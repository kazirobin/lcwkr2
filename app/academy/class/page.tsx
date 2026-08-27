"use client";

import { useState, useMemo } from "react";
import Link from "next/link";
import { 
  ArrowLeft, 
  BookOpen, 
  Calendar, 
  Clock, 
  CheckCircle2, 
  XCircle, 
  Send, 
  Layers,
  Sparkles,
  ArrowRight
} from "lucide-react";
import { academyData } from "@/data/academyData";

const TARGET_WHATSAPP_NUMBER = "8801787881334";

export default function CreateClassSessionPage() {
  const { courses, students } = academyData;

  // Form States
  const [selectedCourseId, setSelectedCourseId] = useState(courses[0]?.courseId || "HSK-101");
  const [date, setDate] = useState(new Date().toISOString().split("T")[0]);
  const [time, setTime] = useState("09:00 PM - 10:10 PM");
  const [status, setStatus] = useState<"Completed" | "Scheduled">("Completed");

  // Dynamic Content Range States
  const [fromLesson, setFromLesson] = useState(1);
  const [fromText, setFromText] = useState(1);
  const [toLesson, setToLesson] = useState(2);
  const [toText, setToText] = useState(2);

  // Attendance State
  const [presentRolls, setPresentRolls] = useState<(string | number)[]>([]);

  const enrolledStudents = useMemo(() => {
    return students.filter((s) => s.enrolledCourseIds?.includes(selectedCourseId));
  }, [students, selectedCourseId]);

  const handleCourseChange = (cId: string) => {
    setSelectedCourseId(cId);
    const enrolled = students.filter((s) => s.enrolledCourseIds?.includes(cId));
    setPresentRolls(enrolled.map((s) => s.rollNumber));
  };

  const toggleAttendance = (roll: string | number) => {
    setPresentRolls((prev) =>
      prev.some((r) => String(r) === String(roll))
        ? prev.filter((r) => String(r) !== String(roll))
        : [...prev, roll]
    );
  };

  const markAllPresent = () => setPresentRolls(enrolledStudents.map((s) => s.rollNumber));
  const markAllAbsent = () => setPresentRolls([]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCourse = courses.find((c) => c.courseId === selectedCourseId);
    const nextClassIndex = (selectedCourse?.classes?.length || 0) + 1;
    const paddedIndex = nextClassIndex < 10 ? `0${nextClassIndex}` : nextClassIndex;
    const generatedClassId = `CLS-${selectedCourseId.replace("-", "")}-${paddedIndex}`;

    const absentRolls = enrolledStudents
      .map((s) => s.rollNumber)
      .filter((roll) => !presentRolls.some((r) => String(r) === String(roll)));

    // রেঞ্জ সামারি স্ট্রিং তৈরি
    const summaryText = `Lesson ${fromLesson} Text ${fromText} to Lesson ${toLesson} Text ${toText}`;

    // ১. সংশোধিত ক্লিন ক্লাস অবজেক্ট
    const classSessionObject = {
      classId: generatedClassId,
      date,
      time,
      status,
      contentCovered: {
        summary: summaryText,
        fromLesson: Number(fromLesson),
        fromText: Number(fromText),
        toLesson: Number(toLesson),
        toText: Number(toText),
      },
      presentStudents: presentRolls,
      absentStudents: absentRolls,
    };

    // ২. WhatsApp মেসেজ ফরম্যাট
    const message = `*📚 New Class Session Logged*\n\n` +
      `*Course:* ${selectedCourseId} (${selectedCourse?.courseName || ""})\n` +
      `*Class ID:* ${classSessionObject.classId}\n` +
      `*Date & Time:* ${date} | ${time}\n` +
      `*Content Covered:* ${summaryText}\n` +
      `*Attendance:* ${presentRolls.length} Present, ${absentRolls.length} Absent\n\n` +
      `*Class Data JSON:*\n\`\`\`json\n${JSON.stringify(classSessionObject, null, 2)}\n\`\`\``;

    const whatsappUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-text py-8 sm:py-12 px-3 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-3xl mx-auto space-y-8">
        
        {/* Header */}
        <div>
          <Link
            href="/academy"
            className="text-xs sm:text-sm font-semibold text-text/60 hover:text-text inline-flex items-center gap-1 mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Log Class Session
          </h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Dynamic curriculum progression and real-time attendance logging.
          </p>
        </div>

        {/* Main Form */}
        <form onSubmit={handleSubmit} className="p-5 sm:p-8 rounded-3xl bg-text/5 border border-text/10 space-y-6 shadow-xl">
          
          {/* 1. Schedule Details */}
          <div className="space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text/70 flex items-center gap-1.5 border-b border-text/10 pb-2">
              <BookOpen className="w-4 h-4 text-primary" /> 1. Schedule & Status
            </h3>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text/70">Course Track</label>
                <select
                  value={selectedCourseId}
                  onChange={(e) => handleCourseChange(e.target.value)}
                  className="w-full bg-background border border-text/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  {courses.map((c) => (
                    <option key={c.courseId} value={c.courseId}>
                      {c.courseId} - {c.courseName}
                    </option>
                  ))}
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text/70">Status</label>
                <select
                  value={status}
                  onChange={(e) => setStatus(e.target.value as any)}
                  className="w-full bg-background border border-text/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text focus:outline-none focus:border-primary appearance-none cursor-pointer"
                >
                  <option value="Completed">Completed</option>
                  <option value="Scheduled">Scheduled</option>
                </select>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text/70 flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-secondary" /> Date
                </label>
                <input
                  type="date"
                  required
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  className="w-full bg-background border border-text/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text focus:outline-none focus:border-primary font-mono"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-semibold text-text/70 flex items-center gap-1">
                  <Clock className="w-3.5 h-3.5 text-secondary" /> Time Slot
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. 09:00 PM - 10:10 PM"
                  value={time}
                  onChange={(e) => setTime(e.target.value)}
                  className="w-full bg-background border border-text/10 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm text-text focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>
          </div>

          {/* 2. Dynamic Curriculum Progression (From -> To Range) */}
          <div className="space-y-4 pt-2">
            <h3 className="text-xs font-bold uppercase tracking-wider text-text/70 flex items-center gap-1.5 border-b border-text/10 pb-2">
              <Layers className="w-4 h-4 text-primary" /> 2. Content Covered Range
            </h3>

            {/* Range Selectors Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              
              {/* Start Point */}
              <div className="p-3.5 rounded-2xl bg-background border border-text/10 space-y-2">
                <span className="text-[11px] font-bold text-secondary uppercase tracking-wider block">
                  Starting Point
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text/50">Lesson</label>
                    <input
                      type="number"
                      min={1}
                      value={fromLesson}
                      onChange={(e) => setFromLesson(Number(e.target.value))}
                      className="w-full bg-text/5 border border-text/10 rounded-lg p-2 text-xs font-mono font-bold text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text/50">Text</label>
                    <input
                      type="number"
                      min={1}
                      value={fromText}
                      onChange={(e) => setFromText(Number(e.target.value))}
                      className="w-full bg-text/5 border border-text/10 rounded-lg p-2 text-xs font-mono font-bold text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>

              {/* End Point */}
              <div className="p-3.5 rounded-2xl bg-background border border-text/10 space-y-2">
                <span className="text-[11px] font-bold text-primary uppercase tracking-wider block">
                  Ending Point
                </span>
                <div className="grid grid-cols-2 gap-2">
                  <div className="space-y-1">
                    <label className="text-[10px] text-text/50">Lesson</label>
                    <input
                      type="number"
                      min={1}
                      value={toLesson}
                      onChange={(e) => setToLesson(Number(e.target.value))}
                      className="w-full bg-text/5 border border-text/10 rounded-lg p-2 text-xs font-mono font-bold text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                  <div className="space-y-1">
                    <label className="text-[10px] text-text/50">Text</label>
                    <input
                      type="number"
                      min={1}
                      value={toText}
                      onChange={(e) => setToText(Number(e.target.value))}
                      className="w-full bg-text/5 border border-text/10 rounded-lg p-2 text-xs font-mono font-bold text-text focus:outline-none focus:border-primary"
                    />
                  </div>
                </div>
              </div>
            </div>

            {/* Generated Summary Live Preview */}
            <div className="p-3 rounded-xl bg-text/5 border border-text/10 flex items-center justify-between text-xs font-mono">
              <span className="text-text/50">Progression Preview:</span>
              <span className="font-bold text-primary flex items-center gap-1.5">
                Lesson {fromLesson} Text {fromText} <ArrowRight className="w-3.5 h-3.5 text-secondary" /> Lesson {toLesson} Text {toText}
              </span>
            </div>
          </div>

          {/* 3. Attendance Section */}
          <div className="space-y-3 pt-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-text/10 pb-2">
              <h3 className="text-xs font-bold uppercase tracking-wider text-text/70 flex items-center gap-1.5">
                <CheckCircle2 className="w-4 h-4 text-primary" /> 3. Attendance ({presentRolls.length}/{enrolledStudents.length} Present)
              </h3>
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={markAllPresent}
                  className="text-[11px] font-semibold text-primary hover:underline"
                >
                  Mark All Present
                </button>
                <span className="text-text/20">•</span>
                <button
                  type="button"
                  onClick={markAllAbsent}
                  className="text-[11px] font-semibold text-secondary hover:underline"
                >
                  Clear All
                </button>
              </div>
            </div>

            {enrolledStudents.length === 0 ? (
              <p className="text-xs text-text/40 italic p-3">No students currently enrolled in this track.</p>
            ) : (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5 max-h-72 overflow-y-auto p-1">
                {enrolledStudents.map((s) => {
                  const isPresent = presentRolls.some((r) => String(r) === String(s.rollNumber));

                  return (
                    <button
                      key={String(s.rollNumber)}
                      type="button"
                      onClick={() => toggleAttendance(s.rollNumber)}
                      className={`p-2.5 rounded-xl border text-left flex items-center justify-between gap-2 transition-all ${
                        isPresent
                          ? "bg-primary/10 border-primary/40 text-text shadow-sm"
                          : "bg-background/60 border-text/10 text-text/40 hover:border-text/20"
                      }`}
                    >
                      <div className="min-w-0">
                        <span className="text-[10px] font-mono block text-text/50 font-bold">Roll {s.rollNumber}</span>
                        <p className="text-xs font-semibold truncate text-text">{s.nameEnglish}</p>
                      </div>
                      <div className="shrink-0">
                        {isPresent ? (
                          <CheckCircle2 className="w-4 h-4 text-primary" />
                        ) : (
                          <XCircle className="w-4 h-4 text-secondary/40" />
                        )}
                      </div>
                    </button>
                  );
                })}
              </div>
            )}
          </div>

          {/* Submit Action */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-bold text-sm shadow-lg shadow-secondary/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] mt-6"
          >
            <Send className="w-4 h-4" /> Send Class Session to WhatsApp
          </button>
        </form>

      </div>
    </div>
  );
}