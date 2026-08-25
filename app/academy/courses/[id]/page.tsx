"use client";

import { useParams } from "next/navigation";
import Link from "next/link";
import { ArrowLeft, Clock, Award, ArrowUpRight } from "lucide-react";
import { academyData } from "@/data/academyData";

export default function CourseDetailPage() {
  const params = useParams();
  const rawId = params?.id;
  const courseId = Array.isArray(rawId) ? rawId[0] : (rawId as string);

  const course = academyData.courses.find((c) => c.courseId === courseId);

  const getStudent = (roll: string) => {
    return academyData.students.find((s) => s.rollNumber === roll);
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-slate-950 text-slate-100 flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-rose-400">Course &quot;{courseId}&quot; Not Found</h2>
        <Link href="/academy/courses" className="text-xs text-slate-400 underline">
          &larr; Back to Courses
        </Link>
      </div>
    );
  }

  const completedClasses = course.classes ?? [];
  const weekendExams = course.weekendExams ?? [];

  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link
          href="/academy/courses"
          className="text-xs font-semibold text-slate-400 hover:text-white inline-flex items-center gap-1"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </Link>

        {/* Course Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-rose-950/40 via-slate-900 to-amber-950/20 border border-slate-800">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-rose-500/10 text-rose-400 border border-rose-500/20">
              {course.courseId}
            </span>
            <span className="text-xs bg-slate-800 text-slate-300 px-2 py-0.5 rounded">
              Level: {course.targetLevel}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white">{course.courseName}</h1>
          <p className="text-xs text-slate-400 mt-1">
            {course.completedClassesCount} of {course.totalClassesPlanned} classes completed • {course.totalLessons} Total Lessons
          </p>
        </div>

        {/* Class Logs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-white flex items-center gap-2">
            <Clock className="w-5 h-5 text-amber-400" /> Completed Class Sessions ({completedClasses.length})
          </h2>

          {completedClasses.length === 0 ? (
            <p className="text-xs text-slate-500 p-4 rounded-xl border border-slate-800 bg-slate-900/30">
              No class sessions logged yet.
            </p>
          ) : (
            <div className="space-y-4">
              {completedClasses.map((cls) => {
                const presentList = cls.presentStudents ?? [];
                const absentList = cls.absentStudents ?? [];

                return (
                  <div key={cls.classId} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-4">
                    <div className="flex justify-between items-center border-b border-slate-800 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-amber-400">{cls.classId}</span>
                        <span className="text-xs text-slate-400">• {cls.date} ({cls.time})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                        {cls.status}
                      </span>
                    </div>

                    {(cls.contentCovered ?? []).map((cov, i) => (
                      <div key={i} className="p-3 bg-slate-950 rounded-lg border border-slate-800/80">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-white">Lesson {cov.lessonNumber}: {cov.lessonTitle}</p>
                          <span className="text-xs font-mono text-rose-400">{cov.lessonProgress}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(cov.coveredTexts ?? []).map((txt) => (
                            <span key={txt.textNumber} className="text-[11px] px-2 py-0.5 rounded bg-slate-900 text-slate-300 border border-slate-800">
                              {txt.title} ({txt.type})
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Attendance Section */}
                    <div className="pt-2 border-t border-slate-800/60 space-y-2.5">
                      <div>
                        <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                          Present ({presentList.length}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {presentList.length === 0 ? (
                            <span className="text-xs text-slate-500">None</span>
                          ) : (
                            presentList.map((roll) => {
                              const student = getStudent(roll);
                              return (
                                <Link
                                  key={roll}
                                  href={`/academy/students/${roll}`}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-emerald-950/40 hover:bg-emerald-900/60 border border-emerald-800/60 text-emerald-300 hover:text-white transition-all text-xs group"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                                  <span className="font-semibold">{student?.nameEnglish || roll}</span>
                                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                                </Link>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {absentList.length > 0 && (
                        <div>
                          <span className="text-xs font-semibold text-slate-400 block mb-1.5">
                            Absent ({absentList.length}):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {absentList.map((roll) => {
                              const student = getStudent(roll);
                              return (
                                <Link
                                  key={roll}
                                  href={`/academy/students/${roll}`}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 border border-rose-800/60 text-rose-300 hover:text-white transition-all text-xs group"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                                  <span className="font-semibold">{student?.nameEnglish || roll}</span>
                                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                                </Link>
                              );
                            })}
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

        {/* Weekend Exams */}
        {weekendExams.length > 0 && (
          <div className="space-y-4">
            <h2 className="text-lg font-bold text-white flex items-center gap-2">
              <Award className="w-5 h-5 text-amber-400" /> Weekend Assessments
            </h2>
            {weekendExams.map((exam) => (
              <div key={exam.examId} className="p-5 rounded-2xl bg-slate-900/60 border border-slate-800 space-y-3">
                <div className="flex justify-between items-center border-b border-slate-800 pb-2">
                  <h4 className="font-bold text-sm text-white">{exam.examTitle}</h4>
                  <span className="text-xs font-mono text-slate-400">{exam.date} • Pass: {exam.passMarks}/{exam.totalMarks}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {(exam.results ?? []).map((r) => {
                    const student = getStudent(r.rollNumber);
                    return (
                      <Link
                        key={r.rollNumber}
                        href={`/academy/students/${r.rollNumber}`}
                        className="p-3 bg-slate-950 hover:bg-slate-900 border border-slate-800 hover:border-amber-500/40 rounded-xl text-xs transition-all space-y-1.5 group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-slate-200 group-hover:text-amber-400 transition-colors">
                              {student?.nameEnglish || r.rollNumber}
                            </p>
                          </div>
                          <span
                            className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                              r.grade === "F"
                                ? "bg-rose-500/10 text-rose-400"
                                : "bg-emerald-500/10 text-emerald-400"
                            }`}
                          >
                            {r.score} pts ({r.grade})
                          </span>
                        </div>
                        {r.remarks && (
                          <p className="text-[11px] text-slate-500 italic truncate pt-1 border-t border-slate-900">
                            {r.remarks}
                          </p>
                        )}
                      </Link>
                    );
                  })}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}