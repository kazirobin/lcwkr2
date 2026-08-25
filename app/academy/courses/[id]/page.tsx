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

  // String / Number উভয়ের জন্যই সেফ লুকআপ
  const getStudent = (roll: string | number) => {
    return academyData.students.find(
      (s) => String(s.rollNumber).trim() === String(roll).trim()
    );
  };

  if (!course) {
    return (
      <div className="min-h-screen bg-background text-text flex flex-col items-center justify-center space-y-4">
        <h2 className="text-xl font-bold text-secondary">Course &quot;{courseId}&quot; Not Found</h2>
        <Link href="/academy/courses" className="text-xs text-text/60 underline hover:text-primary transition-colors">
          &larr; Back to Courses
        </Link>
      </div>
    );
  }

  const completedClasses = course.classes ?? [];
  const weekendExams = course.weekendExams ?? [];

  return (
    <div className="min-h-screen bg-background text-text py-8 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-7xl mx-auto space-y-8">
        <Link
          href="/academy/courses"
          className="text-xs font-semibold text-text/60 hover:text-text inline-flex items-center gap-1 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Courses
        </Link>

        {/* Course Header */}
        <div className="p-6 rounded-2xl bg-gradient-to-r from-secondary/10 via-background/80 to-primary/10 border border-text/10">
          <div className="flex items-center gap-2 mb-1.5">
            <span className="font-mono text-xs font-bold px-2.5 py-0.5 rounded bg-secondary/10 text-secondary border border-secondary/20">
              {course.courseId}
            </span>
            <span className="text-xs bg-text/5 text-text/70 px-2 py-0.5 rounded border border-text/10">
              Level: {course.targetLevel}
            </span>
          </div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text">{course.courseName}</h1>
          <p className="text-xs text-text/50 mt-1">
            {course.completedClassesCount} of {course.totalClassesPlanned} classes completed • {course.totalLessons} Total Lessons
          </p>
        </div>

        {/* Class Logs */}
        <div className="space-y-4">
          <h2 className="text-lg font-bold text-text flex items-center gap-2">
            <Clock className="w-5 h-5 text-primary" /> Completed Class Sessions ({completedClasses.length})
          </h2>

          {completedClasses.length === 0 ? (
            <p className="text-xs text-text/40 p-4 rounded-xl border border-text/10 bg-text/5">
              No class sessions logged yet.
            </p>
          ) : (
            <div className="space-y-4">
              {completedClasses.map((cls) => {
                const presentList = cls.presentStudents ?? [];
                const absentList = cls.absentStudents ?? [];

                return (
                  <div key={cls.classId} className="p-5 rounded-2xl bg-text/5 border border-text/10 space-y-4 transition-colors">
                    <div className="flex justify-between items-center border-b border-text/10 pb-2.5">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-mono font-bold text-primary">{cls.classId}</span>
                        <span className="text-xs text-text/50">• {cls.date} ({cls.time})</span>
                      </div>
                      <span className="px-2 py-0.5 rounded text-[10px] font-bold bg-primary/10 text-primary border border-primary/20">
                        {cls.status}
                      </span>
                    </div>

                    {(cls.contentCovered ?? []).map((cov, i) => (
                      <div key={i} className="p-3 bg-text/5 rounded-lg border border-text/10">
                        <div className="flex justify-between items-center">
                          <p className="text-xs font-bold text-text">Lesson {cov.lessonNumber}: {cov.lessonTitle}</p>
                          <span className="text-xs font-mono text-secondary">{cov.lessonProgress}</span>
                        </div>
                        <div className="flex flex-wrap gap-1.5 mt-2">
                          {(cov.coveredTexts ?? []).map((txt) => (
                            <span key={txt.textNumber} className="text-[11px] px-2 py-0.5 rounded bg-text/5 text-text/70 border border-text/10">
                              {txt.title} ({txt.type})
                            </span>
                          ))}
                        </div>
                      </div>
                    ))}

                    {/* Attendance Section */}
                    <div className="pt-2 border-t border-text/10 space-y-2.5">
                      <div>
                        <span className="text-xs font-semibold text-text/50 block mb-1.5">
                          Present ({presentList.length}):
                        </span>
                        <div className="flex flex-wrap gap-2">
                          {presentList.length === 0 ? (
                            <span className="text-xs text-text/40">None</span>
                          ) : (
                            presentList.map((roll) => {
                              const student = getStudent(roll);
                              return (
                                <Link
                                  key={String(roll)}
                                  href={`/academy/students/${roll}`}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-primary/10 hover:bg-primary/20 border border-primary/20 text-text hover:text-text transition-all text-xs group"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-primary" />
                                  <span className="font-semibold">{student?.nameEnglish || `Roll: ${roll}`}</span>
                                  <ArrowUpRight className="w-3 h-3 opacity-0 group-hover:opacity-100 transition-opacity ml-0.5" />
                                </Link>
                              );
                            })
                          )}
                        </div>
                      </div>

                      {absentList.length > 0 && (
                        <div>
                          <span className="text-xs font-semibold text-text/50 block mb-1.5">
                            Absent ({absentList.length}):
                          </span>
                          <div className="flex flex-wrap gap-2">
                            {absentList.map((roll) => {
                              const student = getStudent(roll);
                              return (
                                <Link
                                  key={String(roll)}
                                  href={`/academy/students/${roll}`}
                                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-secondary/10 hover:bg-secondary/20 border border-secondary/20 text-text hover:text-text transition-all text-xs group"
                                >
                                  <span className="w-1.5 h-1.5 rounded-full bg-secondary" />
                                  <span className="font-semibold">{student?.nameEnglish || `Roll: ${roll}`}</span>
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
            <h2 className="text-lg font-bold text-text flex items-center gap-2">
              <Award className="w-5 h-5 text-primary" /> Weekend Assessments
            </h2>
            {weekendExams.map((exam) => (
              <div key={exam.examId} className="p-5 rounded-2xl bg-text/5 border border-text/10 space-y-3 transition-colors">
                <div className="flex justify-between items-center border-b border-text/10 pb-2">
                  <h4 className="font-bold text-sm text-text">{exam.examTitle}</h4>
                  <span className="text-xs font-mono text-text/50">{exam.date} • Pass: {exam.passMarks}/{exam.totalMarks}</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                  {(exam.results ?? []).map((r) => {
                    const student = getStudent(r.rollNumber);
                    return (
                      <Link
                        key={String(r.rollNumber)}
                        href={`/academy/students/${r.rollNumber}`}
                        className="p-3 bg-text/5 hover:bg-text/10 border border-text/10 hover:border-primary/40 rounded-xl text-xs transition-all space-y-1.5 group"
                      >
                        <div className="flex justify-between items-start">
                          <div>
                            <p className="font-semibold text-text group-hover:text-primary transition-colors">
                              {student?.nameEnglish || `Roll: ${r.rollNumber}`}
                            </p>
                          </div>
                          <span
                            className={`font-mono text-xs font-bold px-1.5 py-0.5 rounded ${
                              r.grade === "F"
                                ? "bg-secondary/10 text-secondary"
                                : "bg-primary/10 text-primary"
                            }`}
                          >
                            {r.score} pts ({r.grade})
                          </span>
                        </div>
                        {r.remarks && (
                          <p className="text-[11px] text-text/40 italic truncate pt-1 border-t border-text/10">
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