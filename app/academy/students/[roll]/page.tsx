"use client";

import { useState, useEffect } from "react";
import { useParams } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, MapPin, CheckCircle2, XCircle, Phone, BookOpen, Clock } from "lucide-react";

export default function StudentProfilePage() {
  const params = useParams();
  const roll = params?.roll;

  const [student, setStudent] = useState<any>(null);
  const [courses, setCourses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!roll) return;
    fetch(`/api/academy/students/${roll}`)
      .then((r) => r.json())
      .then((data) => {
        if (data.success) {
          setStudent(data.student);
          setCourses(data.courses || []);
        }
      })
      .finally(() => setLoading(false));
  }, [roll]);

  if (loading) return <div className="min-h-screen flex items-center justify-center">Loading Scholar Profile...</div>;
  if (!student) return <div className="min-h-screen flex items-center justify-center">Student Not Found</div>;

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8">
      <div className="max-w-4xl mx-auto space-y-6">
        <Link href="/academy/students" className="text-xs text-text/60 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Students
        </Link>

        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-text/5 border border-text/10 flex flex-col sm:flex-row items-center gap-6">
          <div className="w-24 h-24 rounded-2xl overflow-hidden bg-background border border-text/10 shrink-0">
            <Image
              src={student.avatarUrl || `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(student.nameEnglish)}`}
              alt={student.nameEnglish}
              width={96}
              height={96}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-2 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl font-bold">{student.nameEnglish}</h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20">
                Roll: {student.rollNumber}
              </span>
              {!student.isWhatsAppGroupJoined && (
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Not in Group
                </span>
              )}
            </div>

            <p className="text-xs text-text/50 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-secondary" /> {student.location}
            </p>
            <p className="text-xs font-mono text-text/70 flex items-center justify-center sm:justify-start gap-1">
              <Phone className="w-3.5 h-3.5 text-primary" /> {student.whatsapp}
            </p>
          </div>
        </div>

        {/* Enrolled Track Overview */}
        <div className="p-6 rounded-3xl bg-text/5 border border-text/10 space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-secondary" /> Enrolled Cohort: {student.enrolledCourseId}
          </h3>
          <p className="text-xs text-text/50">Scholar is enrolled in {student.enrolledCourseId}. Only one active cohort per scholar.</p>
        </div>
      </div>
    </div>
  );
}