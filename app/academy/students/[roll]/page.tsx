"use client";

import { useState, useEffect, use } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter, notFound } from "next/navigation";
import { 
  ArrowLeft, 
  MapPin, 
  CheckCircle2, 
  Phone, 
  BookOpen, 
  Lock, 
  Unlock, 
  KeyRound, 
  X, 
  Copy, 
  Check, 
  MessageSquare,
  ChevronLeft
} from "lucide-react";
import { academyData } from "@/data/academy";

// 👈 Environment Variable থেকে এডমিন পাসকোড লোড
const ADMIN_SECRET_PIN = process.env.NEXT_PUBLIC_ADMIN_PASSCODE || "8131";

interface Props {
  params: Promise<{ roll: string }>;
}

export default function StudentProfilePage({ params }: Props) {
  const router = useRouter();
  const resolvedParams = use(params);
  const targetRoll = String(resolvedParams.roll).trim();

  // লোকাল ডাটা থেকে স্টুডেন্ট ও কোর্স লুকআপ
  const student = academyData.students.find(
    (s) => String(s.rollNumber).trim() === targetRoll
  );

  if (!student) {
    notFound();
  }

  const enrolledCourseId = student.enrolledCourseIds[0] || "HSK-101";
  const course = academyData.courses.find((c) => c.courseId === enrolledCourseId);

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

  const handleUnlock = (e: React.FormEvent) => {
    e.preventDefault();
    // 👈 ENV ভেরিয়েবলের সাথে ভ্যালিডেশন
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
    if (!student.whatsapp) return;
    navigator.clipboard.writeText(student.whatsapp);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // মোবাইল নম্বর মাস্ক করার ফাংশন (+88017 •••• 334)
  const maskPhone = (phone: string) => {
    if (!phone || phone.length < 8) return "••••••••••";
    const start = phone.slice(0, 6);
    const end = phone.slice(-3);
    return `${start} •••• ${end}`;
  };

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

        {/* Profile Card */}
        <div className="p-6 rounded-3xl bg-text/5 border border-text/10 flex flex-col sm:flex-row items-center gap-6 shadow-sm">
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
              <span className="font-mono text-xs px-2.5 py-0.5 rounded bg-primary/10 text-primary border border-primary/20 font-bold">
                Roll: {student.rollNumber}
              </span>
              {!student.isWhatsAppGroupJoined && (
                <span className="text-[10px] font-bold text-amber-500 bg-amber-500/10 px-2 py-0.5 rounded-full border border-amber-500/20">
                  Not in Group
                </span>
              )}
            </div>

            <p className="text-xs text-text/50 flex items-center justify-center sm:justify-start gap-1">
              <MapPin className="w-3.5 h-3.5 text-secondary" /> {student.location || "Dhaka, Bangladesh"}
            </p>

            {/* Protected Contact View */}
            <div className="pt-1 flex items-center justify-center sm:justify-start gap-2">
              {isAdminUnlocked ? (
                <div className="flex items-center gap-2">
                  <a
                    href={`https://wa.me/${cleanDigits}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-xs font-mono font-bold text-primary hover:underline flex items-center gap-1 bg-primary/10 px-2.5 py-1 rounded-lg border border-primary/20"
                    title="Chat on WhatsApp"
                  >
                    <MessageSquare className="w-3.5 h-3.5" /> {student.whatsapp}
                  </a>

                  <button
                    onClick={handleCopyPhone}
                    className="p-1 text-text/40 hover:text-text rounded-md hover:bg-text/5 transition-colors cursor-pointer"
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
                  className="text-xs font-mono text-text/40 hover:text-text/70 bg-background border border-text/10 px-3 py-1 rounded-lg flex items-center gap-1.5 cursor-pointer transition-colors"
                  title="Click to enter admin PIN"
                >
                  <Lock className="w-3.5 h-3.5 text-primary" />
                  <span>{maskPhone(student.whatsapp)}</span>
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Course Track Info */}
        <div className="p-6 rounded-3xl bg-text/5 border border-text/10 space-y-4">
          <h3 className="text-base font-bold flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-secondary" /> Enrolled Cohort: {course?.courseName || enrolledCourseId}
          </h3>
          <p className="text-xs text-text/50">
            Target Level: <span className="font-mono text-text font-bold">{course?.targetLevel || "HSK 1"}</span> • Status: <span className="font-bold text-emerald-500">{course?.status || "Running"}</span>
          </p>
        </div>

        {/* Bottom Back Link */}
        <div className="pt-2">
          <button
            onClick={() => router.back()}
            className="w-full py-2.5 bg-text/5 hover:bg-text/10 border border-text/10 rounded-2xl text-xs font-semibold text-text/70 hover:text-text flex items-center justify-center gap-1.5 transition-all cursor-pointer"
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