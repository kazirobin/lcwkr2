"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  ArrowUpRight,
  UserPlus,
  PlusCircle,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  X,
  Shield,
  CheckCircle2,
  Hourglass,
  Layers,
  Sparkles,
} from "lucide-react";
import { academyData } from "@/data/academy";

export default function AcademyMainPage() {
  const router = useRouter();
  const { courses, students } = academyData;

  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(20);

  const hasComingSoon = courses.some((c) => c.status === "Coming Soon");

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasComingSoon) {
      router.push("/academy/register");
    } else {
      setShowModal(true);
      setCountdown(20);
    }
  };

  useEffect(() => {
    if (!showModal) return;
    const timer = setInterval(() => {
      setCountdown((prev) => {
        if (prev <= 1) {
          clearInterval(timer);
          router.push("/");
          return 0;
        }
        return prev - 1;
      });
    }, 1000);
    return () => clearInterval(timer);
  }, [showModal, router]);

  // পরিসংখ্যান ক্যালকুলেশন
  const runningCourses = courses.filter((c) => c.status === "Running");
  const comingSoonCourses = courses.filter((c) => c.status === "Coming Soon");
  const totalClassesDone = courses.reduce(
    (acc, c) => acc + (c.completedClassesCount ?? c.classes?.length ?? 0),
    0
  );

  // পরবর্তী ব্যাচের সম্ভাব্য তারিখ
  const nextBatchDate =
    courses.find((c) => c.nextBatchRegistrationDate)?.nextBatchRegistrationDate ||
    "September 15, 2026";

  return (
    <div className="min-h-screen bg-background text-text py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-text/10 pb-5">
          <div>
            <span className="text-xs font-mono text-secondary font-bold uppercase tracking-wider">
              Learn Chinese with Kazi Robin • Global Academy
            </span>
            <h1 className="text-2xl font-bold text-text flex items-center gap-2 mt-1">
              <LayoutDashboard className="w-5 h-5 text-secondary" /> Academy Cohorts & Batches
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/academy/admin"
              className="px-3 py-1.5 bg-secondary/10 border border-secondary/30 text-secondary font-bold text-xs rounded-lg flex items-center gap-1.5 hover:bg-secondary/20 transition-all"
            >
              <Shield className="w-3.5 h-3.5" /> Admin Console
            </Link>
            <Link
              href="/academy/classes/create"
              className="px-3 py-1.5 bg-secondary text-white font-bold text-xs rounded-lg flex items-center gap-1.5 hover:opacity-90"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Log Class
            </Link>
            <button
              onClick={handleRegister}
              className="px-3 py-1.5 bg-primary text-background font-bold text-xs rounded-lg flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Register
            </button>
            <Link
              href="/academy/students"
              className="px-3 py-1.5 bg-text/5 border border-text/10 rounded-lg text-xs hover:bg-text/10"
            >
              Students Directory ({students.length})
            </Link>
          </div>
        </div>

        {/* Overview Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Active Batches</span>
            <p className="text-xl font-bold text-primary mt-1">{courses.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Running Batches</span>
            <p className="text-xl font-bold text-emerald-500 mt-1">{runningCourses.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Total Classes Held</span>
            <p className="text-xl font-bold text-secondary mt-1">{totalClassesDone}</p>
          </div>
          <div className="p-4 rounded-xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Total Enrolled</span>
            <p className="text-xl font-bold text-text mt-1">{students.length} Students</p>
          </div>
        </div>

        {/* 1. All Running & Available Course Cards */}
        <div className="space-y-4">
          <div className="flex justify-between items-center">
            <h2 className="text-lg font-bold flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-secondary" /> Mandarin Tracks & Course Status
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
            {courses.map((course) => {
              const completedCount = course.classes?.length ?? course.completedClassesCount ?? 0;
              const totalPlanned = course.totalClassesPlanned || 24;
              const progressPct = Math.min(100, Math.round((completedCount / totalPlanned) * 100));
              const enrolledCount = students.filter((s) => s.enrolledCourseIds.includes(course.courseId)).length;
              const isRunning = course.status === "Running";

              // কোর্স থেকে লেটেস্ট বা ডিফল্ট ক্লাসের সময় বের করা
              const classTime = course.classes?.[0]?.time || "09:00 PM - 10:10 PM";

              return (
                <div
                  key={course.courseId}
                  className="p-6 rounded-3xl bg-text/5 border border-text/10 space-y-5 flex flex-col justify-between hover:border-text/20 transition-all shadow-sm"
                >
                  <div className="space-y-4">
                    {/* Top Badges */}
                    <div className="flex justify-between items-start">
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono text-xs font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2.5 py-1 rounded-xl">
                          {course.courseId}
                        </span>
                        <span className="text-xs px-2.5 py-1 rounded-xl bg-text/5 border border-text/10">
                          {course.targetLevel}
                        </span>
                      </div>

                      <span
                        className={`text-xs px-3 py-1 rounded-full font-bold border flex items-center gap-1.5 ${
                          isRunning
                            ? "bg-emerald-500/10 text-emerald-500 border-emerald-500/20"
                            : "bg-amber-500/10 text-amber-500 border-amber-500/20"
                        }`}
                      >
                        <span className={`w-2 h-2 rounded-full ${isRunning ? "bg-emerald-500 animate-pulse" : "bg-amber-500"}`} />
                        {course.status}
                      </span>
                    </div>

                    {/* Course Title */}
                    <div>
                      <h3 className="text-lg font-bold text-text">{course.courseName}</h3>
                      <p className="text-xs text-text/50 mt-0.5">
                        Total Lessons: <b>{course.totalLessons} Lessons</b> • Enrolled: <b>{enrolledCount} Students</b>
                      </p>
                    </div>

                    {/* Class Time & Schedule Details */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 text-xs bg-background p-3.5 rounded-2xl border border-text/10">
                      <div className="flex items-center gap-2">
                        <Clock className="w-4 h-4 text-primary shrink-0" />
                        <div>
                          <span className="text-text/40 block text-[10px]">Class Routine Time</span>
                          <span className="font-semibold text-text">{classTime}</span>
                        </div>
                      </div>

                      <div className="flex items-center gap-2">
                        <Calendar className="w-4 h-4 text-secondary shrink-0" />
                        <div>
                          <span className="text-text/40 block text-[10px]">Batch Start Date</span>
                          <span className="font-semibold text-text">{course.startDate || "Active Batch"}</span>
                        </div>
                      </div>
                    </div>

                    {/* Progress Bar (কয়টি ক্লাস হয়েছে / কয়টি হবে) */}
                    <div className="space-y-1.5">
                      <div className="flex justify-between items-center text-xs font-mono">
                        <span className="text-text/60">Class Completion Status:</span>
                        <span className="font-bold text-text">
                          {completedCount} / {totalPlanned} Classes ({progressPct}%)
                        </span>
                      </div>
                      <div className="w-full h-2 rounded-full bg-text/10 overflow-hidden">
                        <div
                          className="h-full bg-secondary rounded-full transition-all duration-500"
                          style={{ width: `${progressPct}%` }}
                        />
                      </div>
                    </div>
                  </div>

                  {/* Details Link */}
                  <div className="pt-2 border-t border-text/10 flex justify-between items-center">
                    <span className="text-[11px] text-text/40 font-mono">
                      {isRunning ? "Live Sessions Ongoing" : "Upcoming Admission Cohort"}
                    </span>
                    <Link
                      href={`/academy/courses/${course.courseId}`}
                      className="text-xs font-bold text-secondary hover:underline inline-flex items-center gap-1"
                    >
                      View Curriculum & Logs <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            })}
          </div>
        </div>

        {/* 2. পরবর্তী ব্যাচের জন্য অপেক্ষা করার নোটিশ বক্স (যদি Coming Soon না থাকে) */}
        {!hasComingSoon && (
          <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-secondary/10 via-text/5 to-primary/10 border border-secondary/20 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
            <div className="space-y-2">
              <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[11px] font-bold inline-flex items-center gap-1.5">
                <Hourglass className="w-3.5 h-3.5" /> Admission Notice
              </span>
              <h3 className="text-lg sm:text-xl font-extrabold text-text">
                সবগুলো ব্যাচে ক্লাস চলমান রয়েছে!
              </h3>
              <p className="text-xs sm:text-sm text-text/70 max-w-xl">
                বর্তমানে কোনো ওপেন সিট নেই। নতুন শিক্ষার্থী ভর্তির জন্য অনুগ্রহ করে পরবর্তী ব্যাচের রেজিস্ট্রেশন শুরু হওয়া পর্যন্ত অপেক্ষা করুন।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-background border border-text/10 shrink-0 text-center space-y-1">
              <span className="text-[10px] text-primary uppercase font-mono font-bold block">
                Next Batch Registration
              </span>
              <p className="text-sm sm:text-base font-extrabold font-mono text-text">
                {nextBatchDate}
              </p>
            </div>
          </div>
        )}

      </div>

      {/* Admission Closed Popup Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background border border-text/10 rounded-2xl p-6 text-center space-y-4 relative">
            <button
              onClick={() => setShowModal(false)}
              className="absolute top-3 right-3 text-text/40 hover:text-text p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
            <AlertCircle className="w-10 h-10 text-secondary mx-auto" />
            <div>
              <h3 className="text-lg font-bold text-text">Admission Closed!</h3>
              <p className="text-xs text-text/60 mt-1">
                চলমান ব্যাচের ক্লাস শুরু হয়ে গেছে। অনুগ্রহ করে পরবর্তী ব্যাচের জন্য অপেক্ষা করুন।
              </p>
            </div>
            <div className="p-3 rounded-xl bg-text/5 border border-text/10 text-left text-xs">
              <span className="text-primary font-semibold flex items-center gap-1">
                <Calendar className="w-3.5 h-3.5" /> Next Batch Registration Starts:
              </span>
              <p className="font-mono font-bold text-text mt-1 pl-4.5">{nextBatchDate}</p>
            </div>
            <div className="space-y-2 pt-1 text-xs">
              <p className="text-text/40 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Redirecting home in <b className="text-secondary">{countdown}s</b>
              </p>
              <button
                onClick={() => router.push("/")}
                className="w-full py-2 bg-secondary text-white rounded-lg font-bold flex items-center justify-center gap-1 hover:opacity-90 cursor-pointer"
              >
                Go Home <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}