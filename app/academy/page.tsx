"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
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
  Loader2,
  RefreshCw,
  Trophy,
  Video,
  Award,
  Users,
  Target,
  Flame,
  GraduationCap
} from "lucide-react";
import { ICourse, IStudent } from "@/types/academy";

export default function AcademyMainPage() {
  const router = useRouter();

  // MongoDB লাইভ ডেটা স্টেট
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [students, setStudents] = useState<IStudent[]>([]);
  const [loading, setLoading] = useState(true);

  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(20);

  // সরাসরি MongoDB API থেকে লাইভ ডেটা ফেচ
  const fetchLiveAcademyData = async () => {
    setLoading(true);
    try {
      const [coursesRes, studentsRes] = await Promise.all([
        fetch("/api/academy/courses", { cache: "no-store" }),
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }),
      ]);

      const coursesData = await coursesRes.json();
      const studentsData = await studentsRes.json();

      if (coursesData.success && Array.isArray(coursesData.courses)) {
        setCourses(coursesData.courses);
      }
      if (studentsData.success && Array.isArray(studentsData.students)) {
        setStudents(studentsData.students);
      }
    } catch (err) {
      console.error("Failed to fetch live academy data from MongoDB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchLiveAcademyData();
  }, []);

  const hasComingSoon = courses.some((c) => c.status === "Coming Soon");

  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasComingSoon) {
      router.push("/academy/admission");
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
  const totalClassesDone = courses.reduce(
    (acc, c) => acc + (c.completedClassesCount ?? c.classes?.length ?? 0),
    0
  );

  const totalClassesPlanned = courses.reduce(
    (acc, c) => acc + (c.totalClassesPlanned || 24),
    0
  );

  const overallBatchProgress = totalClassesPlanned > 0 
    ? Math.min(100, Math.round((totalClassesDone / totalClassesPlanned) * 100)) 
    : 0;

  // 👈 সেরা নিয়মিত শিক্ষার্থী (Top Attendance & Regular Attendance Scholars) ক্যালকুলেশন
  const topRegularScholars = useMemo(() => {
    if (students.length === 0 || courses.length === 0) return [];

    return students.map((stu) => {
      const stuRoll = String(stu.rollNumber).trim();
      const enrolledTrackIds = Array.isArray(stu.enrolledCourseIds) && stu.enrolledCourseIds.length > 0
        ? stu.enrolledCourseIds
        : (stu as any).enrolledCourseId ? [(stu as any).enrolledCourseId] : [];

      let totalHeld = 0;
      let totalAttended = 0;

      courses.forEach((crs) => {
        const isEnrolled = enrolledTrackIds.some(
          (id: string) => id.toLowerCase() === crs.courseId.toLowerCase()
        );
        if (isEnrolled) {
          const sessions = crs.classes ?? [];
          totalHeld += sessions.length;
          totalAttended += sessions.filter((cls) =>
            cls.presentStudents?.some((r) => String(r).trim() === stuRoll)
          ).length;
        }
      });

      const numericRate = totalHeld > 0 ? (totalAttended / totalHeld) * 100 : 100;

      return {
        ...stu,
        totalHeld,
        totalAttended,
        numericRate: Math.round(numericRate),
      };
    })
    .filter((s) => s.totalHeld > 0)
    .sort((a, b) => b.numericRate - a.numericRate || b.totalAttended - a.totalAttended)
    .slice(0, 6);
  }, [students, courses]);

  // পরবর্তী ব্যাচের সম্ভাব্য তারিখ
  const nextBatchDate =
    courses.find((c) => c.nextBatchRegistrationDate)?.nextBatchRegistrationDate ||
    "September 15, 2026";

  return (
    <div className="min-h-screen bg-background text-text py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-10">
        
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
            <button
              onClick={fetchLiveAcademyData}
              className="p-1.5 rounded-lg bg-text/5 hover:bg-text/10 border border-text/10 text-text/60 hover:text-text transition-colors cursor-pointer"
              title="Refresh Live Data from MongoDB"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>
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
              className="px-3.5 py-1.5 bg-primary text-background font-bold text-xs rounded-lg flex items-center gap-1.5 hover:opacity-90 cursor-pointer shadow-sm shadow-primary/20"
            >
              <UserPlus className="w-3.5 h-3.5" /> Register Now
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
          <div className="p-4 rounded-2xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Active Batches</span>
            <p className="text-xl font-bold text-primary mt-1">{courses.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Running Batches</span>
            <p className="text-xl font-bold text-emerald-500 mt-1">{runningCourses.length}</p>
          </div>
          <div className="p-4 rounded-2xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Classes Completed</span>
            <p className="text-xl font-bold text-secondary mt-1">{totalClassesDone} / {totalClassesPlanned}</p>
          </div>
          <div className="p-4 rounded-2xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Total Enrolled</span>
            <p className="text-xl font-bold text-text mt-1">{students.length} Scholars</p>
          </div>
        </div>

        {/* Loading State */}
        {loading ? (
          <div className="py-20 flex flex-col items-center justify-center gap-3">
            <Loader2 className="w-8 h-8 text-primary animate-spin" />
            <p className="text-xs font-mono text-text/50">Fetching Live Cohorts from MongoDB...</p>
          </div>
        ) : (
          <>
            {/* 1. All Running & Available Course Cards */}
            <div className="space-y-4">
              <div className="flex justify-between items-center">
                <h2 className="text-lg font-bold flex items-center gap-2">
                  <BookOpen className="w-5 h-5 text-secondary" /> Mandarin Tracks & Course Status
                </h2>
              </div>

              {courses.length === 0 ? (
                <div className="p-12 text-center rounded-3xl bg-text/5 border border-text/10 space-y-2">
                  <p className="text-sm font-semibold text-text/70">No course tracks found in MongoDB.</p>
                  <p className="text-xs text-text/40">Create a course from the Admin Console to get started.</p>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                  {courses.map((course) => {
                    const completedCount = course.classes?.length ?? course.completedClassesCount ?? 0;
                    const totalPlanned = course.totalClassesPlanned || 24;
                    const progressPct = Math.min(100, Math.round((completedCount / totalPlanned) * 100) || 0);
                    
                    const enrolledCount = students.filter((s: any) => {
                      const cId = course.courseId.toLowerCase();
                      if (Array.isArray(s.enrolledCourseIds)) {
                        return s.enrolledCourseIds.some((id: string) => id.toLowerCase() === cId);
                      }
                      if (s.enrolledCourseId) {
                        return String(s.enrolledCourseId).toLowerCase() === cId;
                      }
                      return false;
                    }).length;

                    const isRunning = course.status === "Running";
                    const classTime = course.classes?.[0]?.time || "09:00 PM - 10:10 PM";

                    return (
                      <div
                        key={course._id ? String(course._id) : course.courseId}
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

                          {/* Progress Bar */}
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
              )}
            </div>

            {/* 🌟 2. ACADEMY VALUE & FEATURES IN-DEPTH SECTION (নতুন যুক্ত করা হয়েছে) */}
            <div className="p-6 sm:p-10 rounded-3xl bg-gradient-to-br from-text/[0.04] via-background to-text/[0.02] border border-text/10 space-y-8 shadow-sm">
              <div className="text-center max-w-2xl mx-auto space-y-2">
                <span className="text-xs font-mono text-primary font-bold uppercase tracking-widest bg-primary/10 border border-primary/20 px-3 py-1 rounded-full inline-block">
                  Why Learn Chinese with Kazi Robin?
                </span>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-text">
                  আমাদের অ্যাকাডেমির বিশেষ বৈশিষ্ট্য ও সুবিধা
                </h2>
                <p className="text-xs sm:text-sm text-text/60 leading-relaxed">
                  আন্তর্জাতিক মানসম্পন্ন HSK কারিকুলাম, শতভাগ লাইভ ইন্টারেক্টিভ ক্লাস এবং সম্পূর্ণ ডিজিটাল উপস্থিতি ট্র্যাকিং সিস্টেম।
                </p>
              </div>

              {/* Feature Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
                {/* Feature 1 */}
                <div className="p-6 rounded-2xl bg-background border border-text/10 space-y-3 hover:border-primary/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-primary/10 text-primary flex items-center justify-center">
                    <Video className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-text">১০০% লাইভ ইন্টারেক্টিভ ক্লাস</h3>
                  <p className="text-xs text-text/60 leading-relaxed">
                    রেকর্ডেড ভিডিওর পরিবর্তে সরাসরি Google Meet-এ রিয়েল-টাইম লাইভ ক্লাস, সঠিক চাইনিজ উচ্চারণ (Pinyin) এবং তাৎক্ষণিক ফিডব্যাক সুবিধা।
                  </p>
                </div>

                {/* Feature 2 */}
                <div className="p-6 rounded-2xl bg-background border border-text/10 space-y-3 hover:border-secondary/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-secondary/10 text-secondary flex items-center justify-center">
                    <Target className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-text">HSK এক্সাম ও সিলেবাস ফোকাস্ড</h3>
                  <p className="text-xs text-text/60 leading-relaxed">
                    Lesson ও Text ভিত্তিক পাঠ পরিকল্পনা, HSK 1 ও HSK 2 এর নতুন শব্দভাণ্ডার, ব্যাকরণ নিয়মাবলী এবং সাপ্তাহিক প্র্যাকটিস টেস্ট।
                  </p>
                </div>

                {/* Feature 3 */}
                <div className="p-6 rounded-2xl bg-background border border-text/10 space-y-3 hover:border-emerald-500/30 transition-all">
                  <div className="w-10 h-10 rounded-xl bg-emerald-500/10 text-emerald-500 flex items-center justify-center">
                    <Trophy className="w-5 h-5" />
                  </div>
                  <h3 className="font-bold text-base text-text">রিয়েল-টাইম উপস্থিতি ট্র্যাকার</h3>
                  <p className="text-xs text-text/60 leading-relaxed">
                    প্রতিটি ক্লাসে শিক্ষার্থীর উপস্থিতি স্বয়ংক্রিয়ভাবে রেকর্ড হয়। প্রোফাইলে গিয়ে যেকোনো সময় ব্যক্তিগত ক্লাসের হিস্টোরি ও অগ্রগতি দেখা যায়।
                  </p>
                </div>
              </div>

              {/* 🏆 3. REGULAR & TOP ATTENDANCE SCHOLARS SPOTLIGHT */}
              {topRegularScholars.length > 0 && (
                <div className="pt-6 border-t border-text/10 space-y-4">
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
                    <div>
                      <h3 className="text-base font-bold flex items-center gap-2">
                        <Flame className="w-5 h-5 text-amber-500" /> Regular & Dedicated Scholars Spotlight
                      </h3>
                      <p className="text-xs text-text/50">
                        যেসব শিক্ষার্থী প্রতিটি ক্লাসে নিয়মিত উপস্থিত থেকে সেরা অগ্রগতি অর্জন করছেন
                      </p>
                    </div>

                    <Link
                      href="/academy/students"
                      className="text-xs font-bold text-primary hover:underline inline-flex items-center gap-1"
                    >
                      View All Scholars ({students.length}) <ArrowRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
                    {topRegularScholars.map((s) => (
                      <div
                        key={String(s.rollNumber)}
                        className="p-3.5 rounded-2xl bg-background border border-text/10 text-center space-y-2 hover:border-primary/30 transition-all"
                      >
                        <div className="w-12 h-12 rounded-xl overflow-hidden bg-text/5 mx-auto border border-text/10">
                          <Image
                            src={s.avatarUrl || `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(s.nameEnglish || "student")}`}
                            alt={s.nameEnglish || "Student"}
                            width={48}
                            height={48}
                            className="w-full h-full object-cover"
                            unoptimized
                          />
                        </div>
                        <div>
                          <h4 className="font-bold text-xs truncate text-text">{s.nameEnglish}</h4>
                          <span className="text-[10px] font-mono text-text/50 block">Roll: #{s.rollNumber}</span>
                        </div>
                        <div className="pt-1.5 border-t border-text/10 flex items-center justify-center gap-1 text-[11px] font-bold text-emerald-500 font-mono">
                          <CheckCircle2 className="w-3 h-3" /> {s.numericRate}%
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Call To Action Banner */}
              <div className="p-6 rounded-2xl bg-secondary text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-lg shadow-secondary/20">
                <div className="space-y-1 text-center sm:text-left">
                  <h3 className="text-lg font-bold flex items-center justify-center sm:justify-start gap-2">
                    <GraduationCap className="w-5 h-5" /> চাইনিজ ভাষা শিখে এগিয়ে থাকুন বিশ্বমঞ্চে
                  </h3>
                  <p className="text-xs opacity-90">
                    স্কলারশিপ, ক্যারিয়ার ও উচ্চশিক্ষার জন্য এখনই আপনার পছন্দের ব্যাচে যুক্ত হন।
                  </p>
                </div>
                <button
                  onClick={handleRegister}
                  className="px-5 py-2.5 bg-white text-secondary font-bold text-xs rounded-xl shadow-md hover:bg-white/95 transition-all cursor-pointer shrink-0"
                >
                  Join Next Batch
                </button>
              </div>
            </div>

            {/* 4. পরবর্তী ব্যাচের নোটিশ বক্স */}
            {!hasComingSoon && (
              <div className="p-6 sm:p-8 rounded-3xl bg-gradient-to-br from-secondary/10 via-text/5 to-primary/10 border border-secondary/20 space-y-4 text-center sm:text-left sm:flex sm:items-center sm:justify-between gap-6">
                <div className="space-y-2">
                  <span className="px-3 py-1 rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20 text-[11px] font-bold inline-flex items-center gap-1.5">
                    <Hourglass className="w-3.5 h-3.5" /> Admission Notice
                  </span>
                  <h3 className="text-lg sm:text-xl font-extrabold text-text">
                    সবগুলো ব্যাচে ক্লাস চলমান রয়েছে!
                  </h3>
                  <p className="text-xs sm:text-sm text-text/70 max-w-xl">
                    বর্তমানে কোনো ওপেন সিট নেই। নতুন শিক্ষার্থী ভর্তির জন্য অনুগ্রহ করে পরবর্তী ব্যাচের রেজিস্ট্রেশন শুরু হওয়া পর্যন্ত অপেক্ষা করুন।
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
          </>
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
                চলমান ব্যাচের ক্লাস শুরু হয়ে গেছে। অনুগ্রহ করে পরবর্তী ব্যাচের জন্য অপেক্ষা করুন।
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