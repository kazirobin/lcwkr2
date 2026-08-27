"use client";

import { useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { ArrowLeft, User, Phone, MapPin, BookOpen, Send, Sparkles, CheckCircle2 } from "lucide-react";
import { academyData } from "@/data/academyData";

// আপনার যে WhatsApp নম্বরে মেসেজ পাঠাতে চান (Country Code সহ)
const TARGET_WHATSAPP_NUMBER = "8801787881334";

// অবতার অপশন
const AVATARS = {
  man: "https://api.dicebear.com/10.x/adventurer/svg?seed=Milo",
  woman: "https://api.dicebear.com/10.x/adventurer/svg?seed=Aneka",
};

export default function StudentRegistrationPage() {
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState<"man" | "woman">("man");
  const [selectedCourses, setSelectedCourses] = useState<string[]>(["HSK-101"]);
  const [phoneError, setPhoneError] = useState("");

  // নতুন রোল নম্বর স্বয়ংক্রিয়ভাবে প্রিভিউ করার জন্য
  const nextRollNumber = academyData.students.length + 1;

  // কোর্স সিলেক্ট/আনসিলেক্ট টগল
  const toggleCourse = (courseId: string) => {
    setSelectedCourses((prev) =>
      prev.includes(courseId)
        ? prev.filter((id) => id !== courseId)
        : [...prev, courseId]
    );
  };

  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "").slice(0, 11);
    setPhone(digitsOnly);

    if (digitsOnly.length > 0 && !digitsOnly.startsWith("01")) {
      setPhoneError("Phone number must start with 01 (e.g. 017...)");
    } else if (digitsOnly.length > 0 && digitsOnly.length < 11) {
      setPhoneError(`Enter full 11 digits (${digitsOnly.length}/11)`);
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    if (phone.length !== 11 || !phone.startsWith("01")) {
      setPhoneError("Please enter a valid 11-digit Bangladeshi number starting with 01");
      return;
    }

    if (selectedCourses.length === 0) {
      alert("Please select at least one course.");
      return;
    }

    // ফরম্যাট করা WhatsApp ফোন নম্বর
    const formattedPhone = `+88${phone}`;

    // ১. এক্সাক্ট অবজেক্ট তৈরি
    const studentObject = {
      rollNumber: String(nextRollNumber),
      nameEnglish: name.trim(),
      whatsapp: formattedPhone,
      location: location.trim(),
      avatarUrl: AVATARS[gender],
      enrolledCourseIds: selectedCourses,
    };

    // ২. WhatsApp-এর জন্য মেসেজ তৈরি
    const whatsappMessage = `*🎓 New Student Enrollment*\n\n` +
      `*Name:* ${studentObject.nameEnglish}\n` +
      `*WhatsApp:* ${studentObject.whatsapp}\n` +
      `*Location:* ${studentObject.location}\n` +
      `*Courses:* ${studentObject.enrolledCourseIds.join(", ")}\n\n` +
      `*Data JSON:*\n\`\`\`json\n${JSON.stringify(studentObject, null, 2)}\n\`\`\``;

    // ৩. WhatsApp API-তে রিডাইরেক্ট
    const whatsappUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  return (
    <div className="min-h-screen bg-background text-text py-8 sm:py-12 px-4 sm:px-6 lg:px-8 transition-colors duration-300">
      <div className="max-w-2xl mx-auto space-y-8">
        
        {/* Top Header */}
        <div>
          <Link
            href="/academy"
            className="text-xs sm:text-sm font-semibold text-text/60 hover:text-text inline-flex items-center gap-1 mb-3 transition-colors"
          >
            <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
          </Link>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-text flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-primary" />
            Scholar Registration
          </h1>
          <p className="text-xs sm:text-sm text-text/50 mt-1">
            Fill in your details to generate your profile and complete verification via WhatsApp.
          </p>
        </div>

        {/* Form Container */}
        <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-text/5 border border-text/10 space-y-6 shadow-xl backdrop-blur-sm">
          
          {/* 1. Full Name */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text/70 flex items-center gap-1.5">
              <User className="w-4 h-4 text-primary" /> Full Name (English)
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Md Shazzad Hossain"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="w-full bg-background border border-text/10 rounded-2xl px-4 py-3 text-sm text-text placeholder:text-text/30 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* 2. WhatsApp Number */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text/70 flex items-center gap-1.5">
              <Phone className="w-4 h-4 text-primary" /> WhatsApp Number (11 Digits)
            </label>
            <div className="relative">
              <span className="absolute left-4 top-1/2 -translate-y-1/2 text-sm font-mono text-text/40 font-semibold">
                +88
              </span>
              <input
                type="tel"
                required
                placeholder="01XXXXXXXXX"
                value={phone}
                onChange={(e) => handlePhoneChange(e.target.value)}
                className={`w-full bg-background border ${
                  phoneError ? "border-secondary focus:border-secondary" : "border-text/10 focus:border-primary"
                } rounded-2xl pl-14 pr-4 py-3 text-sm text-text font-mono placeholder:text-text/30 focus:outline-none transition-colors`}
              />
            </div>
            {phoneError && (
              <span className="text-xs text-secondary font-medium block">
                {phoneError}
              </span>
            )}
          </div>

          {/* 3. Location */}
          <div className="space-y-2">
            <label className="text-xs font-bold uppercase tracking-wider text-text/70 flex items-center gap-1.5">
              <MapPin className="w-4 h-4 text-primary" /> Current Location
            </label>
            <input
              type="text"
              required
              placeholder="e.g. Dhanmondi, Dhaka"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full bg-background border border-text/10 rounded-2xl px-4 py-3 text-sm text-text placeholder:text-text/30 focus:outline-none focus:border-primary transition-colors"
            />
          </div>

          {/* 4. Avatar Choice (Gender) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text/70 block">
              Choose Avatar Style
            </label>
            <div className="grid grid-cols-2 gap-4">
              {/* Man Avatar Option */}
              <button
                type="button"
                onClick={() => setGender("man")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  gender === "man"
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/5"
                    : "border-text/10 bg-background/50 hover:border-text/20"
                }`}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border border-text/10 bg-background flex items-center justify-center relative">
                  <Image
                    src={AVATARS.man}
                    alt="Man Avatar"
                    width={64}
                    height={64}
                    unoptimized
                  />
                </div>
                <span className={`text-xs font-bold ${gender === "man" ? "text-primary" : "text-text/60"}`}>
                  Man (Milo)
                </span>
              </button>

              {/* Woman Avatar Option */}
              <button
                type="button"
                onClick={() => setGender("woman")}
                className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all ${
                  gender === "woman"
                    ? "border-primary bg-primary/10 shadow-md shadow-primary/5"
                    : "border-text/10 bg-background/50 hover:border-text/20"
                }`}
              >
                <div className="w-16 h-16 rounded-full overflow-hidden border border-text/10 bg-background flex items-center justify-center relative">
                  <Image
                    src={AVATARS.woman}
                    alt="Woman Avatar"
                    width={64}
                    height={64}
                    unoptimized
                  />
                </div>
                <span className={`text-xs font-bold ${gender === "woman" ? "text-primary" : "text-text/60"}`}>
                  Woman (Aneka)
                </span>
              </button>
            </div>
          </div>

          {/* 5. Select Course(s) */}
          <div className="space-y-2.5">
            <label className="text-xs font-bold uppercase tracking-wider text-text/70 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-primary" /> Select Course Cohort(s)
            </label>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
              {academyData.courses.map((course) => {
                const isSelected = selectedCourses.includes(course.courseId);
                return (
                  <button
                    key={course.courseId}
                    type="button"
                    onClick={() => toggleCourse(course.courseId)}
                    className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all ${
                      isSelected
                        ? "border-secondary bg-secondary/10 shadow-sm"
                        : "border-text/10 bg-background/50 hover:border-text/20"
                    }`}
                  >
                    <div>
                      <span className="font-mono text-xs font-bold text-secondary">{course.courseId}</span>
                      <h4 className="font-semibold text-xs text-text mt-0.5">{course.courseName}</h4>
                    </div>
                    {isSelected && <CheckCircle2 className="w-4 h-4 text-secondary shrink-0" />}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            className="w-full py-3.5 px-6 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-bold text-sm shadow-lg shadow-secondary/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99]"
          >
            <Send className="w-4 h-4" /> Send Registration via WhatsApp
          </button>
        </form>

      </div>
    </div>
  );
}