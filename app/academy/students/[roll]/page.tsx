"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useParams, useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  BookOpen, 
  Lock, 
  Unlock, 
  KeyRound, 
  X, 
  Copy, 
  Check, 
  MessageSquare, 
  ChevronLeft, 
  Loader2, 
  RefreshCw,
  Layers,
  Calendar
} from "lucide-react";
import { IStudent, ICourse } from "@/types/academy";

const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

export default function StudentProfilePage() {
  const router = useRouter();
  const params = useParams();
  
  const rawRoll = params?.roll ? (Array.isArray(params.roll) ? params.roll[0] : params.roll) : "";
  const targetRoll = decodeURIComponent(String(rawRoll)).trim();

  // MongoDB লাইভ ডেটা স্টেট
  const [student, setStudent] = useState<IStudent | null>(null);
  const [courses, setCourses] = useState<ICourse[]>([]);
  const [loading, setLoading] = useState(true);

  // সিকিউরিটি পিন ও আনলক স্টেট
  const [isAdminUnlocked, setIsAdminUnlocked] = useState(false);
  const [showPinModal, setShowPinModal] = useState(false);
  const [enteredPin, setEnteredPin] = useState("");
  const [pinError, setPinError] = useState(false);
  const [copied, setCopied] = useState(false);

  // সেশন স্টোরেজ থেকে এডমিন স্ট্যাটাস চেক
  useEffect(() => {
    const saved = sessionStorage.getItem("academy_admin_unlocked");
    if (saved === "true") {
      setIsAdminUnlocked(true);
    }
  }, []);

  // সরাসরি MongoDB API থেকে স্টুডেন্ট ও কোর্স লাইভ ফেচ
  const fetchStudentProfileData = async () => {
    setLoading(true);
    try {
      const [studentsRes, coursesRes] = await Promise.all([
        fetch("/api/academy/students?status=Approved", { cache: "no-store" }),
        fetch("/api/academy/courses", { cache: "no-store" }),
      ]);

      const studentsData = await studentsRes.json();
      const coursesData = await coursesRes.json();

      if (studentsData.success && Array.isArray(studentsData.students)) {
        const found = studentsData.students.find(
          (s: any) => String(s.rollNumber).trim() === targetRoll
        );
        setStudent(found || null);
      }

      if (coursesData.success && Array.isArray(coursesData.courses)) {
        setCourses(coursesData.courses);
      }
    } catch (err) {
      console.error("Failed to load student profile from MongoDB:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (targetRoll) {
      fetchStudentProfileData();
    }
  }, [targetRoll]);

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    if (enteredPin.trim() === ADMIN_SECRET_PIN.trim()) {
      setIsAdminUnlocked(true);
      sessionStorage.setItem("academy_admin_unlocked", "true");
      setShowPinModal(false);
      setEnteredPin("");
      setPinError(false);
    } else {
      setPinError(true);
    }
  };

  const handleCopyPhone = () => {
    if (!student?.whatsapp) return;
    navigator.clipboard.writeText(student.whatsapp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 8) return "••••••••••";
    const start = phone.slice(0, 6);
    const end = phone.slice(-3);
    return `${start} •••• ${end}`;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-text flex items-center justify-center p-4">
        <div className="flex flex-col items-center gap-2">
          <Loader2 className="w-8 h-8 text-primary animate-spin" />
          <p className="text-xs font-mono text-text/50">Fetching Student Profile from MongoDB...</p>
        </div>
      </div>
    );
  }

  if (!student) {
    return (
      <div className="min-h-screen bg-background text-text py-20 px-4 text-center space-y-4">
        <p className="text-sm font-semibold text-text/70">Student with Roll #{targetRoll} not found in database.</p>
        <button
          onClick={() => router.push("/academy/students")}
          className="text-xs text-primary hover:underline font-bold cursor-pointer"
        >
          ← Return to Scholars List
        </button>
      </div>
    );
  }

  // 👈 Type-Safe Normalization (enrolledCourseIds বা enrolledCourseId যাই থাকুক না কেন সেফলি অ্যারে তৈরি করবে)
  const normalizedEnrolledCourseIds: string[] = (() => {
    if (Array.isArray(student.enrolledCourseIds) && student.enrolledCourseIds.length > 0) {
      return student.enrolledCourseIds.map((id) => String(id).trim());
    }
    const anyStudent = student as any;
    if (anyStudent.enrolledCourseId) {
      return [String(anyStudent.enrolledCourseId).trim()];
    }
    return ["HSK-101"];
  })();

  // শিক্ষার্থীর এনরোল্ড কোর্সগুলোর ফুল অবজেক্ট তালিকা
  const enrolledCoursesList = courses.filter((c) =>
    normalizedEnrolledCourseIds.some(
      (id) => id.toLowerCase() === c.courseId.toLowerCase()
    )
  );

  const cleanDigits = student.whatsapp ? student.whatsapp.replace(/[^0-9]/g, "") : "";

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 sm:px-8 transition-colors">
      <div className="max-w-4xl mx-auto space-y-6">
        
        {/* Navigation & Header */}
        <div className="flex justify-between items-center">
          <button
            onClick={() => router.back()}
            className="text-xs text-text/60 hover:text-text bg-text/5 hover:bg-text/10 border border-text/10 px-3 py-1.5 rounded-xl inline-flex items-center gap-1.5 transition-all cursor-pointer font-medium"
          >
            <ChevronLeft className="w-4 h-4" /> Back
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={fetchStudentProfileData}
              className="p-1.5 rounded-lg bg-text/5 hover:bg-text/10 border border-text/10 text-text/60 hover:text-text transition-colors cursor-pointer"
              title="Refresh Live Data"
            >
              <RefreshCw className={`w-3.5 h-3.5 ${loading ? "animate-spin" : ""}`} />
            </button>

            {isAdminUnlocked ? (
              <span className="text-[11px] font-mono text-emerald-500 bg-emerald-500/10 border border-emerald-500/20 px-2.5 py-1 rounded-lg flex items-center gap-1">
                <Unlock className="w-3 h-3" /> Admin Mode Active
              </span>
            ) : (
              <button
                onClick={() => {
                  setEnteredPin("");
                  setPinError(false);
                  setShowPinModal(true);
                }}
                className="text-xs text-text/50 hover:text-text bg-text/5 border border-text/10 px-2.5 py-1 rounded-lg flex items-center gap-1 cursor-pointer transition-all"
              >
                <Lock className="w-3 h-3 text-primary" /> Unlock Contacts
              </button>
            )}
          </div>
        </div>

        {/* Profile Card */}
        <div className="p-6 sm:p-8 rounded-3xl bg-text/5 border border-text/10 flex flex-col sm:flex-row items-center sm:items-start gap-6 shadow-sm">
          <div className="w-24 h-24 sm:w-28 sm:h-28 rounded-2xl overflow-hidden bg-background border border-text/10 shrink-0">
            <Image
              src={student.avatarUrl || `https://api.dicebear.com/10.x/adventurer/svg?seed=${encodeURIComponent(student.nameEnglish || "student")}`}
              alt={student.nameEnglish || "Student"}
              width={112}
              height={112}
              className="w-full h-full object-cover"
              unoptimized
            />
          </div>

          <div className="space-y-3 text-center sm:text-left flex-1">
            <div className="flex flex-wrap items-center justify-center sm:justify-start gap-2">
              <h1 className="text-2xl sm:text-3xl font-extrabold text-text">{student.nameEnglish}</h1>
              <span className="font-mono text-xs px-2.5 py-0.5 rounded-lg bg-primary/10 text-primary border border-primary/20 font-bold">
                Roll: #{student.rollNumber}
              </span>
              {!student.isWhatsAppGroupJoined ? (
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2.5 py-0.5 rounded-full border border-amber-500/20">
                  Not in Group
                </span>
              ) : (
                <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2.5 py-0.5 rounded-full border border-emerald-500/20">
                  Group Joined
                </span>
              )}
            </div>

            <p className="text-xs sm:text-sm text-text/50 flex items-center justify-center sm:justify-start gap-1.5">
              <MapPin className="w-4 h-4 text-secondary shrink-0" /> {student.location || "Location not set"}
            </p>

            {/* Protected Contact View */}
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
              {isAdminUnlocked ? (
                <div className="flex items-center gap-2 flex-wrap">
                  <a
                    href={`https://wa.me/${cleanDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1.5 bg-primary/10 px-3 py-1.5 rounded-xl border border-primary/20 shadow-sm"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> {student.whatsapp}
                  </a>

                  <button
                    onClick={handleCopyPhone}
                    className="p-1.5 text-text/40 hover:text-text rounded-lg hover:bg-text/5 transition-colors cursor-pointer border border-text/10"
                    title={copied ? "Copied!" : "Copy Number"}
                  >
                    {copied ? <Check className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  </button>
                </div>
              ) : (
                <button
                  onClick={() => {
                    setEnteredPin("");
                    setPinError(false);
                    setShowPinModal(true);
                  }}
                  className="text-xs font-mono text-text/40 hover:text-text/70 bg-background border border-text/10 px-3 py-1.5 rounded-xl flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Click to enter admin PIN"
                >
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>{maskPhone(student.whatsapp)}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Enrolled Course Tracks Info */}
        <div className="space-y-3">
          <h3 className="text-sm font-bold text-text/70 uppercase tracking-wider flex items-center gap-1.5">
            <Layers className="w-4 h-4 text-secondary" /> Enrolled Cohorts & Tracks ({normalizedEnrolledCourseIds.length})
          </h3>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            {enrolledCoursesList.length > 0 ? (
              enrolledCoursesList.map((c) => (
                <div
                  key={c.courseId}
                  className="p-5 rounded-2xl bg-text/5 border border-text/10 space-y-2.5 flex flex-col justify-between"
                >
                  <div className="space-y-1">
                    <div className="flex justify-between items-center">
                      <span className="font-mono text-xs font-bold text-secondary bg-secondary/10 border border-secondary/20 px-2 py-0.5 rounded-md">
                        {c.courseId}
                      </span>
                      <span className="text-[10px] font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full border border-emerald-500/20">
                        {c.status}
                      </span>
                    </div>
                    <h4 className="font-bold text-base text-text">{c.courseName}</h4>
                  </div>

                  <div className="pt-2 border-t border-text/10 text-xs text-text/60 flex justify-between items-center font-mono">
                    <span>Target: <b>{c.targetLevel}</b></span>
                    <span>Lessons: <b>{c.totalLessons}</b></span>
                  </div>
                </div>
              ))
            ) : (
              <div className="p-5 rounded-2xl bg-text/5 border border-text/10 col-span-full text-xs font-mono text-text/60">
                Track ID: <b className="text-secondary">{normalizedEnrolledCourseIds.join(", ")}</b>
              </div>
            )}
          </div>
        </div>

        {/* Bottom Back Link */}
        <div className="pt-2">
          <button
            onClick={() => router.back()}
            className="w-full py-3 bg-text/5 hover:bg-text/10 border border-text/10 rounded-2xl text-xs font-semibold text-text/70 hover:text-text flex items-center justify-center gap-1.5 transition-all cursor-pointer"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Return to Scholars List
          </button>
        </div>

      </div>

      {/* Admin Passcode Modal */}
      {showPinModal && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-sm flex items-center justify-center p-4">
          <div className="w-full max-w-xs bg-background border border-text/10 rounded-2xl p-5 space-y-4 shadow-2xl relative">
            <button
              onClick={() => setShowPinModal(false)}
              className="absolute top-3 right-3 text-text/40 hover:text-text p-1 cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>

            <div className="flex items-center gap-2 border-b border-text/10 pb-2.5">
              <KeyRound className="w-4 h-4 text-primary" />
              <h3 className="font-bold text-sm">Instructor PIN Required</h3>
            </div>

            <p className="text-xs text-text/50">
              Enter Admin passcode to view full WhatsApp contact details.
            </p>

            <form onSubmit={handleUnlock} className="space-y-3">
              <input
                type="password"
                autoFocus
                placeholder="Enter Admin PIN"
                value={enteredPin}
                onChange={(e) => {
                  setEnteredPin(e.target.value);
                  setPinError(false);
                }}
                className={`w-full bg-text/5 border ${
                  pinError ? "border-secondary" : "border-text/10 focus:border-primary"
                } rounded-xl px-3 py-2 text-xs font-mono text-center tracking-widest focus:outline-none`}
              />

              {pinError && (
                <span className="text-[10px] text-secondary block text-center">
                  Incorrect PIN. Try again.
                </span>
              )}

              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setShowPinModal(false)}
                  className="flex-1 py-1.5 bg-text/5 rounded-xl text-xs font-semibold text-text/60 cursor-pointer"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="flex-1 py-1.5 bg-secondary text-white font-bold rounded-xl text-xs cursor-pointer"
                >
                  Unlock
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
}