"use client";

import { useState, useEffect } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  LayoutDashboard,
  BookOpen,
  Users,
  ArrowUpRight,
  MapPin,
  CheckCircle2,
  UserPlus,
  PlusCircle,
  AlertCircle,
  Calendar,
  Clock,
  ArrowRight,
  X,
} from "lucide-react";
import { academyData } from "@/data/academy";

export default function AcademyMainPage() {
  const router = useRouter();
  const { courses, students, institution, instructor } = academyData;

  const [showModal, setShowModal] = useState(false);
  const [countdown, setCountdown] = useState(20);

  // চেক: কোনো Coming Soon কোর্স আছে কিনা
  const hasComingSoon = courses.some((c) => c.status === "Coming Soon");

  // রেজিস্ট্রেশন বাটন অ্যাকশন
  const handleRegister = (e: React.MouseEvent) => {
    e.preventDefault();
    if (hasComingSoon) {
      router.push("/academy/register");
    } else {
      setShowModal(true);
      setCountdown(20);
    }
  };

  // ২০ সেকেন্ডের কাউন্টডাউন ও রিডাইরেক্ট
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

  // অ্যাটেনডেন্স ক্যালকুলেটর
  const getAttendanceRate = (roll: string | number, enrolledIds: string[] = []) => {
    let held = 0;
    let attended = 0;
    const target = String(roll).trim();

    courses.forEach((c) => {
      if (enrolledIds.includes(c.courseId)) {
        const list = c.classes ?? [];
        held += list.length;
        attended += list.filter((cls) =>
          cls.presentStudents?.some((r) => String(r).trim() === target)
        ).length;
      }
    });

    return held > 0 ? `${Math.round((attended / held) * 100)}% (${attended}/${held})` : "100%";
  };

  const nextBatchDate = courses[0]?.nextBatchRegistrationDate || "September 15, 2026";
  const totalClasses = courses.reduce((acc, c) => acc + (c.completedClassesCount ?? c.classes?.length ?? 0), 0);

  return (
    <div className="min-h-screen bg-background text-text py-8 px-4 sm:px-6 lg:px-8 transition-colors">
      <div className="max-w-6xl mx-auto space-y-8">
        
        {/* Header Strip */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-text/10 pb-5">
          <div>
            <span className="text-xs font-mono text-secondary font-bold uppercase tracking-wider">
              {institution} • Instructor: {instructor}
            </span>
            <h1 className="text-2xl font-bold text-text flex items-center gap-2 mt-1">
              <LayoutDashboard className="w-5 h-5 text-secondary" /> Academy Dashboard
            </h1>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <Link
              href="/academy/classes/create"
              className="px-3.5 py-1.5 bg-secondary text-white font-bold text-xs rounded-lg flex items-center gap-1.5 hover:opacity-90"
            >
              <PlusCircle className="w-3.5 h-3.5" /> Log Class
            </Link>
            <button
              onClick={handleRegister}
              className="px-3.5 py-1.5 bg-primary text-background font-bold text-xs rounded-lg flex items-center gap-1.5 hover:opacity-90 cursor-pointer"
            >
              <UserPlus className="w-3.5 h-3.5" /> Register
            </button>
            <Link href="/academy/courses" className="px-3.5 py-1.5 bg-text/5 border border-text/10 rounded-lg text-xs">
              Courses ({courses.length})
            </Link>
            <Link href="/academy/students" className="px-3.5 py-1.5 bg-text/5 border border-text/10 rounded-lg text-xs">
              Students ({students.length})
            </Link>
          </div>
        </div>

        {/* Stats Strip */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center">
          <div className="p-4 rounded-xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Students</span>
            <p className="text-xl font-bold text-text mt-1">{students.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Active Cohorts</span>
            <p className="text-xl font-bold text-primary mt-1">{courses.length}</p>
          </div>
          <div className="p-4 rounded-xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Total Classes</span>
            <p className="text-xl font-bold text-secondary mt-1">{totalClasses}</p>
          </div>
          <div className="p-4 rounded-xl bg-text/5 border border-text/10">
            <span className="text-[10px] text-text/50 uppercase font-mono">Tracks</span>
            <p className="text-xl font-bold text-text mt-1">HSK 1 - 2</p>
          </div>
        </div>

        {/* Courses Table */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold flex items-center gap-2">
              <BookOpen className="w-4 h-4 text-secondary" /> Active Mandarin Cohorts
            </h2>
            <Link href="/academy/courses" className="text-xs text-text/60 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="border border-text/10 rounded-xl overflow-hidden bg-text/[0.01]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-text/5 border-b border-text/10 text-text/60">
                  <tr>
                    <th className="p-3">Course</th>
                    <th className="p-3">Level</th>
                    <th className="p-3">Progress</th>
                    <th className="p-3">Enrolled</th>
                    <th className="p-3 text-right">Action</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/10">
                  {courses.map((c) => {
                    const done = c.classes?.length ?? c.completedClassesCount ?? 0;
                    const pct = Math.round((done / c.totalClassesPlanned) * 100);
                    const enrolled = students.filter((s) => s.enrolledCourseIds?.includes(c.courseId)).length;

                    return (
                      <tr key={c.courseId} className="hover:bg-text/5">
                        <td className="p-3 font-semibold">
                          <span className="font-mono text-secondary mr-2">{c.courseId}</span>
                          {c.courseName}
                        </td>
                        <td className="p-3">{c.targetLevel}</td>
                        <td className="p-3 font-mono">{done}/{c.totalClassesPlanned} ({pct}%)</td>
                        <td className="p-3 font-mono">{enrolled} Students</td>
                        <td className="p-3 text-right">
                          <Link href={`/academy/courses/${c.courseId}`} className="text-secondary font-semibold hover:underline inline-flex items-center gap-0.5">
                            Details <ArrowUpRight className="w-3.5 h-3.5" />
                          </Link>
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Students Table */}
        <div className="space-y-3">
          <div className="flex justify-between items-center">
            <h2 className="text-base font-bold flex items-center gap-2">
              <Users className="w-4 h-4 text-primary" /> Students Directory
            </h2>
            <Link href="/academy/students" className="text-xs text-text/60 hover:underline">
              View All &rarr;
            </Link>
          </div>

          <div className="border border-text/10 rounded-xl overflow-hidden bg-text/[0.01]">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-text/5 border-b border-text/10 text-text/60">
                  <tr>
                    <th className="p-3">Roll</th>
                    <th className="p-3">Name</th>
                    <th className="p-3">Location</th>
                    <th className="p-3">Attendance</th>
                    <th className="p-3 text-right">Profile</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-text/10">
                  {students.map((s) => (
                    <tr key={String(s.rollNumber)} className="hover:bg-text/5">
                      <td className="p-3 font-mono font-bold">{s.rollNumber}</td>
                      <td className="p-3 font-semibold">{s.nameEnglish}</td>
                      <td className="p-3 text-text/60">
                        <span className="inline-flex items-center gap-1">
                          <MapPin className="w-3 h-3 text-secondary" /> {s.location || "N/A"}
                        </span>
                      </td>
                      <td className="p-3 font-mono text-primary font-bold">
                        <span className="inline-flex items-center gap-1">
                          <CheckCircle2 className="w-3 h-3" />
                          {getAttendanceRate(s.rollNumber, s.enrolledCourseIds)}
                        </span>
                      </td>
                      <td className="p-3 text-right">
                        <Link href={`/academy/students/${s.rollNumber}`} className="text-primary font-semibold hover:underline inline-flex items-center gap-0.5">
                          View <ArrowUpRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

      </div>

      {/* Closed Modal */}
      {showModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-sm bg-background border border-text/10 rounded-2xl p-6 text-center space-y-4 relative">
            <button onClick={() => setShowModal(false)} className="absolute top-3 right-3 text-text/40 hover:text-text p-1">
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
                <Calendar className="w-3.5 h-3.5" /> Next Batch Starts:
              </span>
              <p className="font-mono font-bold text-text mt-1 pl-4.5">{nextBatchDate}</p>
            </div>

            <div className="space-y-2 pt-1 text-xs">
              <p className="text-text/40 flex items-center justify-center gap-1">
                <Clock className="w-3.5 h-3.5" /> Redirecting home in <b className="text-secondary">{countdown}s</b>
              </p>
              <button
                onClick={() => router.push("/")}
                className="w-full py-2 bg-secondary text-white rounded-lg font-bold flex items-center justify-center gap-1 hover:opacity-90"
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