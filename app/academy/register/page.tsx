"use client";

import { useState, useEffect, useMemo } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  User, 
  Phone, 
  MapPin, 
  BookOpen, 
  Send, 
  Sparkles, 
  CheckCircle2, 
  AlertCircle, 
  Clock, 
  Calendar, 
  ArrowRight,
  Globe
} from "lucide-react";
import { academyData } from "@/data/academy";

const TARGET_WHATSAPP_NUMBER = "8801312430659";

const AVATARS = {
  man: "https://api.dicebear.com/10.x/adventurer/svg?seed=Milo",
  woman: "https://api.dicebear.com/10.x/adventurer/svg?seed=Aneka",
};

// আন্তর্জাতিক ডায়ালিং কান্ট্রি কোড লিস্ট
const COUNTRY_CODES = [
  { code: "+880", country: "Bangladesh", flag: "🇧🇩", minDigits: 10 },
  { code: "+86", country: "China", flag: "🇨🇳", minDigits: 11 },
  { code: "+91", country: "India", flag: "🇮🇳", minDigits: 10 },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸", minDigits: 10 },
  { code: "+44", country: "UK", flag: "🇬🇧", minDigits: 10 },
  { code: "+971", country: "UAE", flag: "🇦🇪", minDigits: 9 },
  { code: "+966", country: "Saudi Arabia", flag: "🇸🇦", minDigits: 9 },
  { code: "+60", country: "Malaysia", flag: "🇲🇾", minDigits: 9 },
];

export default function StudentRegistrationPage() {
  const router = useRouter();
  const { courses, students } = academyData;

  const comingSoonCourses = useMemo(() => {
    return courses.filter((c) => c.status === "Coming Soon");
  }, [courses]);

  const isRegistrationAvailable = comingSoonCourses.length > 0;

  // Form States
  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+880"); // ডিফল্ট বাংলাদেশ
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [gender, setGender] = useState<"man" | "woman">("man");
  const [selectedCourseId, setSelectedCourseId] = useState<string>("");
  const [phoneError, setPhoneError] = useState("");
  const [countdown, setCountdown] = useState(20);

  useEffect(() => {
    if (comingSoonCourses.length > 0 && !selectedCourseId) {
      setSelectedCourseId(comingSoonCourses[0].courseId);
    }
  }, [comingSoonCourses, selectedCourseId]);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (!isRegistrationAvailable) {
      timer = setInterval(() => {
        setCountdown((prev) => {
          if (prev <= 1) {
            clearInterval(timer);
            router.push("/");
            return 0;
          }
          return prev - 1;
        });
      }, 1000);
    }
    return () => clearInterval(timer);
  }, [isRegistrationAvailable, router]);

  const nextRollNumber = students.length + 1;

  // ফোন ইনপুট হ্যান্ডলার
  const handlePhoneChange = (val: string) => {
    const digitsOnly = val.replace(/\D/g, "");
    setPhone(digitsOnly);

    const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);
    const minDigits = selectedCountry?.minDigits || 8;

    if (digitsOnly.length > 0 && digitsOnly.length < minDigits) {
      setPhoneError(`Number should be at least ${minDigits} digits`);
    } else {
      setPhoneError("");
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const selectedCountry = COUNTRY_CODES.find((c) => c.code === countryCode);
    const minDigits = selectedCountry?.minDigits || 8;

    // বাংলাদেশের জন্য শুরুর ০ বাদ দেওয়া
    let cleanedLocalNumber = phone.replace(/\D/g, "");
    if (countryCode === "+880" && cleanedLocalNumber.startsWith("0")) {
      cleanedLocalNumber = cleanedLocalNumber.slice(1);
    }

    if (cleanedLocalNumber.length < minDigits - (countryCode === "+880" ? 1 : 0)) {
      setPhoneError("Please enter a valid complete phone number");
      return;
    }

    if (!selectedCourseId) {
      alert("Please select a course to register.");
      return;
    }

    const fullInternationalPhone = `${countryCode}${cleanedLocalNumber}`;

    // স্টুডেন্ট অবজেক্ট (isWhatsAppGroupJoined ডিফল্ট false)
    const studentObject = {
      rollNumber: nextRollNumber,
      nameEnglish: name.trim(),
      whatsapp: fullInternationalPhone,
      isWhatsAppGroupJoined: false,
      location: location.trim(),
      avatarUrl: AVATARS[gender],
      enrolledCourseIds: [selectedCourseId],
    };

    const whatsappMessage = `*🎓 New Scholar Registration*\n\n` +
      `*Name:* ${studentObject.nameEnglish}\n` +
      `*WhatsApp:* ${studentObject.whatsapp}\n` +
      `*Group Joined:* No (false)\n` +
      `*Location:* ${studentObject.location}\n` +
      `*Enrolled Course:* ${selectedCourseId}\n\n` +
      `*Student Data JSON:*\n\`\`\`json\n${JSON.stringify(studentObject, null, 2)}\n\`\`\``;

    const whatsappUrl = `https://wa.me/${TARGET_WHATSAPP_NUMBER}?text=${encodeURIComponent(whatsappMessage)}`;
    window.open(whatsappUrl, "_blank");
  };

  const nextBatchLaunchInfo = courses[0]?.nextBatchRegistrationDate || "September 15, 2026";

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
            Enroll for upcoming cohorts. Running tracks are currently closed for admission.
          </p>
        </div>

        {/* 1. Registration Form */}
        {isRegistrationAvailable ? (
          <form onSubmit={handleSubmit} className="p-6 sm:p-8 rounded-3xl bg-text/5 border border-text/10 space-y-6 shadow-xl backdrop-blur-sm">
            
            {/* Full Name */}
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

            {/* International WhatsApp Number */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text/70 flex items-center gap-1.5">
                <Phone className="w-4 h-4 text-primary" /> WhatsApp Number
              </label>
              
              <div className="flex gap-2">
                {/* Country Code Dropdown */}
                <div className="relative shrink-0">
                  <select
                    value={countryCode}
                    onChange={(e) => {
                      setCountryCode(e.target.value);
                      setPhoneError("");
                    }}
                    className="h-full bg-background border border-text/10 rounded-2xl pl-3 pr-7 py-3 text-xs sm:text-sm text-text font-mono font-bold focus:outline-none focus:border-primary appearance-none cursor-pointer"
                  >
                    {COUNTRY_CODES.map((c) => (
                      <option key={c.code} value={c.code}>
                        {c.flag} {c.code}
                      </option>
                    ))}
                  </select>
                  <Globe className="w-3.5 h-3.5 text-text/40 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
                </div>

                {/* Local Phone Input */}
                <input
                  type="tel"
                  required
                  placeholder="WhatsApp number"
                  value={phone}
                  onChange={(e) => handlePhoneChange(e.target.value)}
                  className={`w-full bg-background border ${
                    phoneError ? "border-secondary focus:border-secondary" : "border-text/10 focus:border-primary"
                  } rounded-2xl px-4 py-3 text-sm text-text font-mono placeholder:text-text/30 focus:outline-none transition-colors`}
                />
              </div>

              {phoneError && (
                <span className="text-xs text-secondary font-medium block">
                  {phoneError}
                </span>
              )}
            </div>

            {/* Location */}
            <div className="space-y-2">
              <label className="text-xs font-bold uppercase tracking-wider text-text/70 flex items-center gap-1.5">
                <MapPin className="w-4 h-4 text-primary" /> Current Location
              </label>
              <input
                type="text"
                required
                placeholder="e.g. Dhaka, Bangladesh / Nanchang, China"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full bg-background border border-text/10 rounded-2xl px-4 py-3 text-sm text-text placeholder:text-text/30 focus:outline-none focus:border-primary transition-colors"
              />
            </div>

            {/* Avatar Choice */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text/70 block">
                Choose Avatar Style
              </label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setGender("man")}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
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

                <button
                  type="button"
                  onClick={() => setGender("woman")}
                  className={`p-4 rounded-2xl border flex flex-col items-center gap-2 transition-all cursor-pointer ${
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

            {/* Single Course Selection */}
            <div className="space-y-2.5">
              <label className="text-xs font-bold uppercase tracking-wider text-text/70 flex items-center gap-1.5">
                <BookOpen className="w-4 h-4 text-primary" /> Select Available Course (Single Select)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {comingSoonCourses.map((course) => {
                  const isSelected = selectedCourseId === course.courseId;
                  return (
                    <button
                      key={course.courseId}
                      type="button"
                      onClick={() => setSelectedCourseId(course.courseId)}
                      className={`p-3.5 rounded-2xl border text-left flex items-center justify-between transition-all cursor-pointer ${
                        isSelected
                          ? "border-secondary bg-secondary/10 shadow-sm"
                          : "border-text/10 bg-background/50 hover:border-text/20"
                      }`}
                    >
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="font-mono text-xs font-bold text-secondary">{course.courseId}</span>
                          <span className="text-[10px] bg-amber-500/10 text-amber-500 border border-amber-500/20 px-1.5 py-0.2 rounded font-semibold">
                            Coming Soon
                          </span>
                        </div>
                        <h4 className="font-semibold text-xs text-text mt-1">{course.courseName}</h4>
                      </div>
                      <div className="w-5 h-5 rounded-full border border-text/20 flex items-center justify-center shrink-0">
                        {isSelected && <CheckCircle2 className="w-5 h-5 text-secondary" />}
                      </div>
                    </button>
                  );
                })}
              </div>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              className="w-full py-3.5 px-6 rounded-2xl bg-secondary hover:bg-secondary/90 text-white font-bold text-sm shadow-lg shadow-secondary/25 transition-all flex items-center justify-center gap-2 active:scale-[0.99] cursor-pointer"
            >
              <Send className="w-4 h-4" /> Send Registration via WhatsApp
            </button>
          </form>
        ) : null}

        {/* 2. Fullscreen Popup Modal When No "Coming Soon" Course Exists */}
        {!isRegistrationAvailable && (
          <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
            <div className="w-full max-w-md bg-background border border-text/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-6 text-center animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 border border-secondary/20 text-secondary flex items-center justify-center mx-auto shadow-lg shadow-secondary/10">
                <AlertCircle className="w-8 h-8" />
              </div>

              <div className="space-y-2">
                <span className="text-[11px] font-mono uppercase tracking-widest text-secondary font-bold px-2.5 py-1 rounded bg-secondary/10 border border-secondary/20 inline-block">
                  Admission Closed
                </span>
                <h3 className="text-xl sm:text-2xl font-extrabold text-text">
                  All Active Batches Started!
                </h3>
                <p className="text-xs sm:text-sm text-text/60 leading-relaxed">
                  বর্তমান সবগুলো ব্যাচের ক্লাস ইতোমধ্যে শুরু হয়ে গেছে। অনুগ্রহ করে পরবর্তী ব্যাচ চালুর জন্য অপেক্ষা করুন।
                </p>
              </div>

              {/* Next Batch Schedule Box */}
              <div className="p-4 rounded-2xl bg-text/5 border border-text/10 space-y-2 text-left">
                <div className="flex items-center gap-2 text-xs font-bold text-primary">
                  <Calendar className="w-4 h-4" /> Next Batch Registration Starts:
                </div>
                <p className="text-sm font-extrabold font-mono text-text pl-6">
                  {nextBatchLaunchInfo}
                </p>
              </div>

              {/* 20s Countdown & Redirect */}
              <div className="space-y-3 pt-2">
                <div className="flex items-center justify-center gap-1.5 text-xs font-mono text-text/40">
                  <Clock className="w-3.5 h-3.5" />
                  <span>
                    Redirecting to Home in{" "}
                    <strong className="text-secondary font-bold">
                      {countdown}s
                    </strong>
                    ...
                  </span>
                </div>

                <div className="w-full h-1.5 bg-text/10 rounded-full overflow-hidden">
                  <div
                    className="h-full bg-secondary transition-all duration-1000 ease-linear"
                    style={{ width: `${(countdown / 20) * 100}%` }}
                  />
                </div>

                <button
                  type="button"
                  onClick={() => router.push("/")}
                  className="w-full py-3 bg-secondary hover:bg-secondary/90 text-white rounded-xl text-xs font-bold flex items-center justify-center gap-1.5 shadow-md shadow-secondary/20 transition-all cursor-pointer mt-2"
                >
                  Go to Homepage Now <ArrowRight className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}