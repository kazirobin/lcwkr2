"use client";

import { useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { 
  ArrowLeft, 
  Sparkles, 
  AlertCircle, 
  MessageSquare, 
  User, 
  Phone, 
  MapPin, 
  BookOpen 
} from "lucide-react";
import { academyData } from "@/data/academy";

const COUNTRY_CODES = [
  { code: "+880", country: "Bangladesh", flag: "🇧🇩", minDigits: 10 },
  { code: "+86", country: "China", flag: "🇨🇳", minDigits: 11 },
  { code: "+91", country: "India", flag: "🇮🇳", minDigits: 10 },
  { code: "+1", country: "USA / Canada", flag: "🇺🇸", minDigits: 10 },
];

const ADMIN_WHATSAPP = process.env.NEXT_PUBLIC_ADMIN_WHATSAPP || "+8801787881334";

export default function StudentRegistrationPage() {
  const router = useRouter();
  
  // লোকাল ফাইল থেকে Coming Soon কোর্স ফিল্টার
  const comingSoonCourses = academyData.courses.filter((c) => c.status === "Coming Soon");

  const [name, setName] = useState("");
  const [countryCode, setCountryCode] = useState("+880");
  const [phone, setPhone] = useState("");
  const [location, setLocation] = useState("");
  const [selectedCourseId, setSelectedCourseId] = useState(comingSoonCourses[0]?.courseId || "");
  const [submitting, setSubmitting] = useState(false);

  // পোস্ট-রেজিস্ট্রেশন পপআপ স্টেট
  const [showJoinModal, setShowJoinModal] = useState(false);
  const [registeredData, setRegisteredData] = useState<any>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);

    let clean = phone.replace(/\D/g, "");
    if (countryCode === "+880" && clean.startsWith("0")) clean = clean.slice(1);
    const fullPhone = `${countryCode}${clean}`;

    const payload = {
      nameEnglish: name.trim(),
      whatsapp: fullPhone,
      location: location.trim(),
      enrolledCourseId: selectedCourseId,
    };

    try {
      // সরাসরি MongoDB API-তে পাঠানো
      const res = await fetch("/api/academy/students/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const result = await res.json();
      setSubmitting(false);

      if (result.success) {
        setRegisteredData({
          ...payload,
          rollNumber: result.student?.rollNumber || "Pending",
        });
        setShowJoinModal(true);
      } else {
        alert(result.message || "Registration failed");
      }
    } catch (err) {
      setSubmitting(false);
      alert("Error submitting registration. Please try again.");
    }
  };

  const handleSendJoinRequest = () => {
    if (!registeredData) return;

    const message = `*🔔 WhatsApp Group Join Request*\n\n` +
      `Assalamu Alaikum / Nǐ hǎo Admin,\nI have registered for the course and need to join the official WhatsApp group for Google Meet class links.\n\n` +
      `*Name:* ${registeredData.nameEnglish}\n` +
      `*Roll:* ${registeredData.rollNumber}\n` +
      `*Phone/WhatsApp:* ${registeredData.whatsapp}\n` +
      `*Location:* ${registeredData.location}\n` +
      `*Course Track:* ${registeredData.enrolledCourseId}\n\n` +
      `Please verify and add me to the group.`;

    const cleanAdminNum = ADMIN_WHATSAPP.replace(/[^0-9]/g, "");
    const whatsappUrl = `https://wa.me/${cleanAdminNum}?text=${encodeURIComponent(message)}`;
    
    window.open(whatsappUrl, "_blank");
    router.push("/academy");
  };

  return (
    <div className="min-h-screen bg-background text-text py-10 px-4 transition-colors">
      <div className="max-w-xl mx-auto space-y-6">
        <Link href="/academy" className="text-xs text-text/50 hover:underline flex items-center gap-1">
          <ArrowLeft className="w-3.5 h-3.5" /> Back to Academy Hub
        </Link>
        
        <h1 className="text-2xl font-bold flex items-center gap-2">
          <Sparkles className="w-6 h-6 text-primary" /> Scholar Admission
        </h1>

        {comingSoonCourses.length === 0 ? (
          <div className="p-8 border border-text/10 rounded-2xl text-center space-y-3 bg-text/5">
            <AlertCircle className="w-10 h-10 text-secondary mx-auto" />
            <h3 className="text-lg font-bold">All Batches Currently Running!</h3>
            <p className="text-xs text-text/60">No upcoming courses are open for admission at this moment.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="p-6 rounded-2xl bg-text/5 border border-text/10 space-y-4 shadow-xl">
            {/* Name */}
            <div>
              <label className="text-xs font-bold flex items-center gap-1 mb-1">
                <User className="w-3.5 h-3.5 text-primary" /> Full Name (English)
              </label>
              <input
                type="text"
                required
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="e.g. Md Shazzad Hossain"
                className="w-full bg-background border border-text/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* WhatsApp */}
            <div>
              <label className="text-xs font-bold flex items-center gap-1 mb-1">
                <Phone className="w-3.5 h-3.5 text-primary" /> WhatsApp Number
              </label>
              <div className="flex gap-2">
                <select
                  value={countryCode}
                  onChange={(e) => setCountryCode(e.target.value)}
                  className="bg-background border border-text/10 rounded-xl px-3 py-3 text-xs font-bold"
                >
                  {COUNTRY_CODES.map((c) => (
                    <option key={c.code} value={c.code}>{c.flag} {c.code}</option>
                  ))}
                </select>
                <input
                  type="tel"
                  required
                  value={phone}
                  onChange={(e) => setPhone(e.target.value)}
                  placeholder="WhatsApp Number"
                  className="w-full bg-background border border-text/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary font-mono"
                />
              </div>
            </div>

            {/* Location */}
            <div>
              <label className="text-xs font-bold flex items-center gap-1 mb-1">
                <MapPin className="w-3.5 h-3.5 text-primary" /> Current Location
              </label>
              <input
                type="text"
                required
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                placeholder="e.g. Dhanmondi, Dhaka"
                className="w-full bg-background border border-text/10 rounded-xl p-3 text-sm focus:outline-none focus:border-primary"
              />
            </div>

            {/* Course Select */}
            <div>
              <label className="text-xs font-bold flex items-center gap-1 mb-1">
                <BookOpen className="w-3.5 h-3.5 text-primary" /> Select Track
              </label>
              <select
                value={selectedCourseId}
                onChange={(e) => setSelectedCourseId(e.target.value)}
                className="w-full bg-background border border-text/10 rounded-xl p-3 text-sm font-semibold cursor-pointer"
              >
                {comingSoonCourses.map((c) => (
                  <option key={c.courseId} value={c.courseId}>
                    {c.courseId} - {c.courseName} (Coming Soon)
                  </option>
                ))}
              </select>
            </div>

            <button
              type="submit"
              disabled={submitting}
              className="w-full py-3 bg-secondary hover:bg-secondary/90 text-white font-bold rounded-xl text-sm shadow-md shadow-secondary/20 cursor-pointer transition-all"
            >
              {submitting ? "Submitting to Database..." : "Submit Registration"}
            </button>
          </form>
        )}
      </div>

      {/* WhatsApp Verification Modal */}
      {showJoinModal && (
        <div className="fixed inset-0 z-50 bg-black/85 backdrop-blur-md flex items-center justify-center p-4">
          <div className="w-full max-w-md bg-background border border-text/10 rounded-3xl p-6 sm:p-8 shadow-2xl space-y-5 text-center relative animate-in fade-in zoom-in-95">
            <div className="w-16 h-16 rounded-2xl bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 flex items-center justify-center mx-auto shadow-lg shadow-emerald-500/10">
              <MessageSquare className="w-8 h-8" />
            </div>

            <div className="space-y-2">
              <span className="text-[11px] font-mono uppercase tracking-widest text-emerald-500 font-bold px-2.5 py-1 rounded bg-emerald-500/10 border border-emerald-500/20 inline-block">
                Step 2: WhatsApp Group Access
              </span>
              <h3 className="text-xl font-extrabold text-text">
                Join Class WhatsApp Group
              </h3>
              <p className="text-xs sm:text-sm text-text/70 leading-relaxed">
                ক্লাসের <strong>Google Meet লিংক ও লেকচার শিট</strong> পেতে আমাদের অফিসিয়াল হোয়াটসঅ্যাপ গ্রুপে যুক্ত হওয়া আবশ্যক। নিচে ক্লিক করে এডমিনকে ভেরিফিকেশন মেসেজ পাঠান।
              </p>
            </div>

            <div className="p-4 rounded-2xl bg-text/5 border border-text/10 space-y-1.5 text-left text-xs font-mono">
              <div className="flex justify-between">
                <span className="text-text/50">Scholar:</span>
                <span className="font-bold text-text">{registeredData?.nameEnglish}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text/50">WhatsApp:</span>
                <span className="font-bold text-primary">{registeredData?.whatsapp}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-text/50">Location:</span>
                <span className="font-bold text-text">{registeredData?.location}</span>
              </div>
            </div>

            <button
              onClick={handleSendJoinRequest}
              className="w-full py-3.5 bg-emerald-600 hover:bg-emerald-500 text-white font-bold rounded-2xl text-xs sm:text-sm flex items-center justify-center gap-2 shadow-lg shadow-emerald-600/25 transition-all cursor-pointer"
            >
              <MessageSquare className="w-4 h-4" /> Send Request to Admin on WhatsApp
            </button>
          </div>
        </div>
      )}
    </div>
  );
}